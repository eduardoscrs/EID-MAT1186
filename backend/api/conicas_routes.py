from common.rut import (
    RutValidationError,
    limpiar_rut,
    validar_cuerpo_dv_para_procesar,
    validar_rut_paso_a_paso,
)
from conicas.services.procesador_conicas import procesar_conica
from flask import Blueprint, current_app, jsonify, request, session

conicas_bp = Blueprint("conicas", __name__)


def _leer_json_request():
    if not request.is_json:
        raise RutValidationError("La solicitud debe enviarse en formato JSON.")

    data = request.get_json(silent=True)
    if data is None:
        raise RutValidationError("El cuerpo JSON no pudo ser leido.")

    if not isinstance(data, dict):
        raise RutValidationError("El cuerpo JSON debe ser un objeto.")

    return data


def _codigo_error_rut(mensaje):
    mensaje_normalizado = str(mensaje).lower()

    if "json" in mensaje_normalizado:
        return "request_json_invalido"
    if "antes de validar" in mensaje_normalizado:
        return "rut_vacio"
    if "caracteres invalidos" in mensaje_normalizado:
        return "rut_caracteres_invalidos"
    if "7 u 8" in mensaje_normalizado:
        return "rut_largo_incorrecto"
    if "empresa" in mensaje_normalizado:
        return "rut_empresa"
    if "cero" in mensaje_normalizado:
        return "rut_cuerpo_cero"
    if "digito verificador" in mensaje_normalizado:
        return "rut_dv_incorrecto"
    if "validacion previa" in mensaje_normalizado:
        return "rut_dv_incorrecto"
    if "valida el rut antes" in mensaje_normalizado:
        return "rut_no_validado"

    return "rut_invalido"


def _respuesta_error(mensaje, status=400, codigo=None):
    codigo_error = codigo or _codigo_error_rut(mensaje)
    return (
        jsonify(
            {
                "valido": False,
                "codigo": codigo_error,
                "error": str(mensaje),
                "mensaje": str(mensaje),
                "pasos": [],
            }
        ),
        status,
    )


@conicas_bp.route("/api/validar_rut", methods=["POST"])
def validar_rut_api():
    """Endpoint para validar RUT usando algoritmo Modulo 11."""
    try:
        data = _leer_json_request()
        rut_input = data.get("rut", "")
        rut_limpio = limpiar_rut(rut_input)
        es_valido, pasos_rut, cuerpo, dv = validar_rut_paso_a_paso(rut_limpio)

        if es_valido:
            session["rut_validado"] = f"{cuerpo}{dv}"
        else:
            session.pop("rut_validado", None)

        return jsonify(
            {
                "valido": es_valido,
                "codigo": "rut_valido" if es_valido else "rut_dv_incorrecto",
                "mensaje": "RUT valido."
                if es_valido
                else "El digito verificador no coincide.",
                "pasos": pasos_rut,
                "cuerpo": cuerpo,
                "digito_verificador": str(dv),
                "rut_limpio": rut_limpio,
            }
        )
    except RutValidationError as e:
        session.pop("rut_validado", None)
        return _respuesta_error(str(e))
    except Exception:
        session.pop("rut_validado", None)
        current_app.logger.exception("Error inesperado validando RUT")
        return _respuesta_error(
            "No se pudo validar el RUT.",
            status=500,
            codigo="rut_error_interno",
        )


@conicas_bp.route("/api/procesar", methods=["POST"])
def procesar_api():
    """Endpoint que procesa el RUT completo y calcula la conica."""
    try:
        data = _leer_json_request()
        cuerpo, dv, _ = validar_cuerpo_dv_para_procesar(
            data.get("cuerpo"),
            data.get("digito_verificador") or data.get("dv"),
        )
        if session.get("rut_validado") != f"{cuerpo}{dv}":
            raise RutValidationError("Valida el RUT antes de procesar la conica.")

        resultado = procesar_conica(
            cuerpo,
            dv,
        )
        return jsonify(resultado)
    except RutValidationError as e:
        return _respuesta_error(str(e))
    except Exception:
        current_app.logger.exception("Error inesperado procesando conica")
        return _respuesta_error(
            "No se pudo procesar la conica.",
            status=500,
            codigo="conica_error_interno",
        )
