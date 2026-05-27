import traceback

from common.rut import limpiar_rut, validar_rut_paso_a_paso
from conicas.services.procesador import procesar_conica
from flask import Blueprint, jsonify, request
from limites.procesador import procesar_limites

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

        return jsonify(
            {
                "valido": es_valido,
                "pasos": pasos_rut,
                "cuerpo": cuerpo,
                "digito_verificador": str(dv),
                "rut_limpio": rut_limpio,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 400


@api_bp.route("/api/procesar", methods=["POST"])
def procesar_api():
    """Endpoint que procesa el RUT completo y calcula la conica."""
    data = request.json or {}

    try:
        resultado = procesar_conica(
            data.get("cuerpo"),
            data.get("digito_verificador") or data.get("dv"),
        )
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 400


@api_bp.route("/api/limites", methods=["POST"])
def limites_api():
    """Endpoint que construye la función por tramos y analiza sus límites."""
    data = request.json or {}

    try:
        resultado = procesar_limites(data.get("rut", ""))
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 400
