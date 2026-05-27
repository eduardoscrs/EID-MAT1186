"""Tablas de valores cercanos al punto de analisis."""

from limites.funciones import evaluar_funcion


DESPLAZAMIENTOS = (-1, -0.1, -0.01, -0.001, 0.001, 0.01, 0.1, 1)


def generar_tabla_valores(datos_funcion):
    a = datos_funcion["a"]
    filas = []

    for desplazamiento in DESPLAZAMIENTOS:
        x = _normalizar_numero(a + desplazamiento)
        filas.append(
            {
                "x": x,
                "lado": "izquierda" if desplazamiento < 0 else "derecha",
                "f_x": evaluar_funcion(datos_funcion, x),
            }
        )

    return filas


def _normalizar_numero(valor):
    valor_normalizado = round(float(valor), 6)
    if valor_normalizado == 0:
        return 0.0
    return valor_normalizado
