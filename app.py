import traceback

from algebra.canonica import transformar_a_canonica
from algebra.procedimiento_inverso import generar_procedimiento_inverso
from core.clasificacion import clasificar_conica
from core.ecuacion import construir_ecuacion_general
from core.rut import limpiar_rut, validar_rut_paso_a_paso
from flask import Flask, jsonify, request
from geometria.circunferencia import analizar_circunferencia
from geometria.elipse import analizar_elipse
from geometria.hiperbola import analizar_hiperbola
from geometria.parabola import analizar_parabola
from visualizacion.grafica import (
    generar_puntos_circunferencia,
    generar_puntos_elipse,
    generar_puntos_hiperbola,
    generar_puntos_parabola,
)
from utils.formato import formatear_ecuacion_general, formatear_forma_canonica

app = Flask(__name__)


@app.route("/")
def home():
    return jsonify(
        {
            "status": "ok",
            "message": "Backend Flask activo. Use el frontend React/Vite para la interfaz.",
        }
    )


@app.route("/api/validar_rut", methods=["POST"])
def validar_rut_api():
    """Endpoint para validar RUT usando algoritmo Módulo 11"""
    data = request.json
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


@app.route("/api/procesar", methods=["POST"])
def procesar_api():
    """Endpoint que procesa el RUT completo y calcula la cónica"""
    data = request.json
    cuerpo = data.get("cuerpo")
    dv = data.get("digito_verificador") or data.get("dv")

    try:
        if isinstance(cuerpo, list):
            cuerpo = "".join([str(x) for x in cuerpo])

        # PASO 1: Construcción de la Ecuación General
        A, B, C, D, E, pasos_eq = construir_ecuacion_general(cuerpo, dv)

        # PASO 2: Clasificación de la Cónica
        tipo_conica = clasificar_conica(A, B)

        resultado = {
            "ecuacion": formatear_ecuacion_general(A, B, C, D, E),
            "A": A,
            "B": B,
            "C": C,
            "D": D,
            "E": E,
            "tipo_conica": tipo_conica,
            "pasos_ecuacion": pasos_eq,
        }

        # PASO 3: Transformación a Forma Canónica y Análisis Geométrico
        if tipo_conica != "Parábola":
            h_x, h_y, const_der, pasos_can = transformar_a_canonica(A, B, C, D, E)
            resultado["pasos_canonica"] = pasos_can
            resultado["h"] = float(h_x)
            resultado["k"] = float(h_y)
            resultado["constante_derecha"] = float(const_der)

            if tipo_conica == "Circunferencia":
                centro, radio = analizar_circunferencia(h_x, h_y, const_der, A)
                radio_val = float(radio)
                resultado.update(
                    {
                        "centro": [float(centro[0]), float(centro[1])],
                        "radio": radio_val,
                    }
                )
                puntos = generar_puntos_circunferencia(
                    float(centro[0]), float(centro[1]), radio_val, puntos=1000
                )
                resultado["puntos_grafica"] = {
                    "x": [float(x) for x in puntos[0]],
                    "y_pos": [float(y) for y in puntos[1]],
                    "y_neg": [float(y) for y in puntos[2]],
                }

            elif tipo_conica == "Elipse":
                centro, vertices, focos, a, b = analizar_elipse(
                    h_x, h_y, const_der, A, B
                )
                a_val, b_val = float(a), float(b)
                c_val = (
                    float((a_val**2 - b_val**2) ** 0.5)
                    if a_val > b_val
                    else float((b_val**2 - a_val**2) ** 0.5)
                )
                excentricidad = float(c_val / a_val) if a_val != 0 else 0.0

                resultado.update(
                    {
                        "centro": [float(centro[0]), float(centro[1])],
                        "vertices": [[float(v[0]), float(v[1])] for v in vertices],
                        "focos": [[float(f[0]), float(f[1])] for f in focos],
                        "a": a_val,
                        "b": b_val,
                        "c": c_val,
                        "excentricidad": excentricidad,
                    }
                )
                puntos = generar_puntos_elipse(
                    float(centro[0]), float(centro[1]), a_val, b_val, puntos=1000
                )
                resultado["puntos_grafica"] = {
                    "x": [float(x) for x in puntos[0]],
                    "y_pos": [float(y) for y in puntos[1]],
                    "y_neg": [float(y) for y in puntos[2]],
                }

            elif tipo_conica == "Hipérbola":
                centro, vertices, focos, a, b = analizar_hiperbola(
                    h_x, h_y, const_der, A, B
                )
                a_val, b_val = float(a), float(b)
                c_val = float((a_val**2 + b_val**2) ** 0.5)
                excentricidad = float(c_val / a_val) if a_val != 0 else 0.0
                orientacion = "Horizontal" if (A * const_der) > 0 else "Vertical"

                resultado.update(
                    {
                        "centro": [float(centro[0]), float(centro[1])],
                        "vertices": [[float(v[0]), float(v[1])] for v in vertices],
                        "focos": [[float(f[0]), float(f[1])] for f in focos],
                        "a": a_val,
                        "b": b_val,
                        "c": c_val,
                        "excentricidad": excentricidad,
                        "orientacion": orientacion,
                    }
                )
                puntos = generar_puntos_hiperbola(
                    float(centro[0]),
                    float(centro[1]),
                    a_val,
                    b_val,
                    orientacion,
                    puntos=500,
                )

                rama_izq, rama_der = puntos
                resultado["puntos_grafica"] = {
                    "rama_izq": (
                        {
                            "x": [float(x) for x in rama_izq[0]],
                            "y": [float(y) for y in rama_izq[1]],
                            "y_neg": [float(y) for y in rama_izq[2]],
                        }
                        if rama_izq
                        else None
                    ),
                    "rama_der": {
                        "x": [float(x) for x in rama_der[0]],
                        "y": [float(y) for y in rama_der[1]],
                        "y_neg": [float(y) for y in rama_der[2]],
                    },
                }
        else:
            vertice, foco, directriz, p, orientacion, pasos_par = analizar_parabola(
                A, B, C, D, E
            )
            p_val = float(p)
            resultado.update(
                {
                    "pasos_canonica": pasos_par,
                    "pasos_parabola": pasos_par,
                    "vertice": [float(vertice[0]), float(vertice[1])],
                    "foco": [float(foco[0]), float(foco[1])],
                    "directriz": float(directriz),
                    "p": p_val,
                    "orientacion": orientacion,
                }
            )
            puntos = generar_puntos_parabola(
                float(vertice[0]), float(vertice[1]), p_val, orientacion, puntos=1000
            )
            resultado["puntos_grafica"] = {
                "x": [float(x) for x in puntos[0]],
                "y_pos": [float(y) for y in puntos[1]],
                "y_neg": [float(y) for y in puntos[2]] if puntos[2] else None,
            }

        resultado["forma_canonica"] = formatear_forma_canonica(resultado)
        resultado["pasos_inverso"] = generar_procedimiento_inverso(
            A, B, C, D, E, resultado
        )

        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 400


if __name__ == "__main__":
    app.run(debug=True)
