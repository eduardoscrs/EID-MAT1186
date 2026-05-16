import os
import sys

from api import conicas_bp, home_bp, limites_bp
from flask import Flask
from infra.frontend import iniciar_frontend


def crear_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.environ.get(
        "FLASK_SECRET_KEY", "eid-mat1186-dev-secret"
    )
    app.register_blueprint(home_bp)
    app.register_blueprint(conicas_bp)
    app.register_blueprint(limites_bp)
    return app


app = crear_app()


if __name__ == "__main__":
    iniciar_frontend()
    print("[INFO] Iniciando backend Flask en http://127.0.0.1:5000")
    try:
        app.run(debug=True, use_reloader=False)
    except KeyboardInterrupt:
        sys.exit(0)
