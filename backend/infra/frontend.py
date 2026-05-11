import atexit
import shutil
import subprocess
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
FRONTEND_DIR = BASE_DIR.parent / "frontend"
frontend_process = None


def crear_proceso_frontend():
    npm = shutil.which("npm.cmd") or shutil.which("npm")

    if npm is None:
        print("[WARN] No se encontro npm. Inicia el frontend manualmente con npm run dev.")
        return None

    if not FRONTEND_DIR.exists():
        print(f"[WARN] No se encontro la carpeta frontend: {FRONTEND_DIR}")
        return None

    print("[INFO] Iniciando frontend React/Vite. Vite mostrara la URL disponible.")
    return subprocess.Popen([npm, "run", "dev"], cwd=FRONTEND_DIR)


def detener_frontend():
    global frontend_process

    if frontend_process and frontend_process.poll() is None:
        if sys.platform.startswith("win"):
            subprocess.run(
                ["taskkill", "/F", "/T", "/PID", str(frontend_process.pid)],
                check=False,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
        else:
            frontend_process.terminate()
            try:
                frontend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                frontend_process.kill()
    frontend_process = None


def iniciar_frontend():
    global frontend_process
    frontend_process = crear_proceso_frontend()
    atexit.register(detener_frontend)
