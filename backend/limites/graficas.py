"""Generacion de puntos para graficar funciones por tramos."""

from limites.funciones import evaluar_funcion


def generar_puntos_grafica(datos_funcion):
    a = datos_funcion["a"]
    izquierda = []
    derecha = []

    for paso in range(-50, 51):
        x = _normalizar_numero(a + paso / 10)
        if x == a:
            continue

        punto = {"x": x, "y": evaluar_funcion(datos_funcion, x)}
        if x < a:
            izquierda.append(punto)
        else:
            derecha.append(punto)

    resultado = {
        "izquierda": izquierda,
        "derecha": derecha,
    }

    if datos_funcion["tipo_caso"] == "discontinuidad_removible":
        resultado["punto_abierto"] = {
            "x": a,
            "y": datos_funcion["a"] + datos_funcion["digitos"]["d1"],
        }
    elif datos_funcion["tipo_caso"] == "discontinuidad_salto":
        resultado["punto_cerrado"] = {
            "x": a,
            "y": a + datos_funcion["funcion"]["termino_derecho"],
        }
        resultado["punto_abierto"] = {
            "x": a,
            "y": a + datos_funcion["funcion"]["termino_izquierdo"],
        }
    else:
        resultado["asintota_vertical"] = {"x": a}

    return resultado


def _normalizar_numero(valor):
    valor_normalizado = round(float(valor), 6)
    if valor_normalizado == 0:
        return 0.0
    return valor_normalizado
