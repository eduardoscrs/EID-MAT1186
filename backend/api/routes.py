from flask import Blueprint, jsonify

home_bp = Blueprint("home", __name__)


@home_bp.route("/")
def home():
    return jsonify(
        {
            "status": "ok",
            "message": "Backend Flask activo. Use el frontend React/Vite para la interfaz.",
        }
    )
