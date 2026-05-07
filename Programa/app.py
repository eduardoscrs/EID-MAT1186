from flask import Flask, render_template, request

# from core.ecuacion import construir_ecuacion_general

app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # capturar el RUT ingresado por el usuario
        rut_ingresado = request.form.get("rut_input")
        return f"RUT: {rut_ingresado}"

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
