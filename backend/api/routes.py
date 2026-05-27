from common.rut import limpiar_rut, validar_rut_paso_a_paso
from conicas.services.procesador import procesar_conica
from flask import Blueprint, current_app, jsonify, request
from limites.services.procesador import procesar_limites

api_bp = Blueprint("api", __name__)


def _json_body():
    return request.get_json(silent=True) or {}


def _error_response(error, status=400):
    return jsonify({"error": str(error)}), status


@api_bp.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        return jsonify(
            {
                "status": "ignored",
                "message": "La API usa rutas /api/*. Revise que el frontend no envie POST a la raiz.",
            }
        ), 200

    return jsonify(
        {
            "status": "ok",
            "message": "Backend Flask activo. Use el frontend React/Vite para la interfaz.",
        }
    )


@api_bp.route("/api/validar_rut", methods=["POST"])
def validar_rut_api():
    """Endpoint para validar RUT usando algoritmo Modulo 11."""
    data = _json_body()
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
    except ValueError as error:
        return _error_response(error)
    except Exception as error:
        current_app.logger.exception("Error inesperado validando RUT")
        return _error_response(error, 500)


@api_bp.route("/api/procesar", methods=["POST"])
def procesar_api():
    """Endpoint que procesa el RUT completo y calcula la conica."""
    data = _json_body()

    try:
        resultado = procesar_conica(
            data.get("cuerpo"),
            data.get("digito_verificador") or data.get("dv"),
        )
        return jsonify(resultado)
    except ValueError as error:
        return _error_response(error)
    except Exception as error:
        current_app.logger.exception("Error inesperado procesando conica")
        return _error_response(error, 500)


@api_bp.route("/api/limites", methods=["POST"])
def limites_api():
    """Endpoint que construye la funcion por tramos y analiza sus limites."""
    data = _json_body()

    try:
        resultado = procesar_limites(data.get("rut", ""))
        return jsonify(resultado)
    except ValueError as error:
        return _error_response(error)
    except Exception as error:
        current_app.logger.exception("Error inesperado procesando limites")
        return _error_response(error, 500)
