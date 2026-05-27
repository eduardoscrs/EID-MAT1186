from common.rut import (
    RutValidationError,
    limpiar_rut,
    validar_rut_paso_a_paso,
)
from flask import Blueprint, current_app, jsonify, request
from limites.service import procesar_limites

limites_bp = Blueprint("limites", __name__)


@limites_bp.route("/api/limites", methods=["POST"])
def limites_api():
    try:
        data = _leer_json_request()
        cuerpo, dv = _obtener_cuerpo_dv(data)
        resultado = procesar_limites(cuerpo, dv)
        return jsonify(resultado)
    except RutValidationError as error:
        return _respuesta_error(str(error))
    except Exception:
        current_app.logger.exception("Error inesperado analizando limites")
        return _respuesta_error(
            "No se pudo procesar el modulo de limites.",
            status=500,
            codigo="limites_error_interno",
        )


def _leer_json_request():
    if not request.is_json:
        raise RutValidationError("La solicitud debe enviarse en formato JSON.")

    data = request.get_json(silent=True)
    if data is None:
        raise RutValidationError("El cuerpo JSON no pudo ser leido.")

    if not isinstance(data, dict):
        raise RutValidationError("El cuerpo JSON debe ser un objeto.")

    return data


def _obtener_cuerpo_dv(data):
    rut = data.get("rut")
    if rut:
        rut_limpio = limpiar_rut(rut)
        es_valido, _, cuerpo, dv = validar_rut_paso_a_paso(rut_limpio)
        if not es_valido:
            raise RutValidationError(
                "No se puede analizar limites porque el RUT no es valido."
            )
        return cuerpo, dv

    cuerpo = data.get("cuerpo")
    dv = data.get("digito_verificador") or data.get("dv")
    return cuerpo, dv


def _respuesta_error(mensaje, status=400, codigo=None):
    return (
        jsonify(
            {
                "valido": False,
                "codigo": codigo or _codigo_error(mensaje),
                "error": str(mensaje),
                "mensaje": str(mensaje),
                "pasos": [],
            }
        ),
        status,
    )


def _codigo_error(mensaje):
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
    if "rut no es valido" in mensaje_normalizado:
        return "rut_dv_incorrecto"

    return "rut_invalido"
