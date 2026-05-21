from geometria.puntos import (
    generar_puntos_circunferencia,
    generar_puntos_elipse,
    generar_puntos_hiperbola,
    generar_puntos_parabola,
)


def _lista_float(valores):
    return [float(valor) for valor in valores]


def puntos_circunferencia(centro, radio):
    puntos = generar_puntos_circunferencia(
        float(centro[0]), float(centro[1]), float(radio), puntos=1000
    )
    return {
        "x": _lista_float(puntos[0]),
        "y_pos": _lista_float(puntos[1]),
        "y_neg": _lista_float(puntos[2]),
    }


def puntos_elipse(centro, a, b):
    puntos = generar_puntos_elipse(
        float(centro[0]), float(centro[1]), float(a), float(b), puntos=1000
    )
    return {
        "x": _lista_float(puntos[0]),
        "y_pos": _lista_float(puntos[1]),
        "y_neg": _lista_float(puntos[2]),
    }


def puntos_hiperbola(centro, a, b, orientacion):
    rama_izq, rama_der = generar_puntos_hiperbola(
        float(centro[0]),
        float(centro[1]),
        float(a),
        float(b),
        orientacion,
        puntos=500,
    )

    return {
        "rama_izq": _serializar_rama_hiperbola(rama_izq) if rama_izq else None,
        "rama_der": _serializar_rama_hiperbola(rama_der),
    }


def puntos_parabola(vertice, p, orientacion):
    puntos = generar_puntos_parabola(
        float(vertice[0]), float(vertice[1]), float(p), orientacion, puntos=1000
    )
    return {
        "x": _lista_float(puntos[0]),
        "y_pos": _lista_float(puntos[1]),
        "y_neg": _lista_float(puntos[2]) if puntos[2] else None,
    }


def _serializar_rama_hiperbola(rama):
    return {
        "x": _lista_float(rama[0]),
        "y": _lista_float(rama[1]),
        "y_neg": _lista_float(rama[2]),
    }
