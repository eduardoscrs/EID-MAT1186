from core.rut import (
    RutValidationError,
    limpiar_rut,
    validar_cuerpo_dv_para_procesar,
    validar_rut_paso_a_paso,
)
from flask import Blueprint, jsonify, request, session
from services.procesador_conicas import procesar_conica

api_bp = Blueprint("api", __name__)


@api_bp.route("/")
def home():
    return jsonify(
        {
            "status": "ok",
            "message": "Backend Flask activo. Use el frontend React/Vite para la interfaz.",
        }
    )


@api_bp.route("/api/validar_rut", methods=["POST"])
def validar_rut_api():
    """Endpoint para validar RUT usando algoritmo Modulo 11."""
    data = request.json or {}
    rut_input = data.get("rut", "")

    try:
        rut_limpio = limpiar_rut(rut_input)
        es_valido, pasos_rut, cuerpo, dv = validar_rut_paso_a_paso(rut_limpio)

        if es_valido:
            session["rut_validado"] = f"{cuerpo}{dv}"
        else:
            session.pop("rut_validado", None)

        return jsonify(
            {
                "valido": es_valido,
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
        return jsonify({"valido": False, "error": str(e), "pasos": []}), 400
    except Exception as e:
        return jsonify({"error": "No se pudo validar el RUT."}), 500


@api_bp.route("/api/procesar", methods=["POST"])
def procesar_api():
    """Endpoint que procesa el RUT completo y calcula la conica."""
    data = request.json or {}

    try:
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
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "No se pudo procesar la conica."}), 500
