from geometria.circunferencia import analizar_circunferencia
from geometria.elipse import analizar_elipse
from geometria.hiperbola import analizar_hiperbola
from geometria.parabola import analizar_parabola
from services.graficas import (
    puntos_circunferencia,
    puntos_elipse,
    puntos_hiperbola,
    puntos_parabola,
)


def agregar_analisis_central(resultado, A, B, C, D, E, datos_canonicos):
    h_x, h_y, const_der, pasos_can = datos_canonicos
    tipo_conica = resultado["tipo_conica"]

    resultado.update(
        {
            "pasos_canonica": pasos_can,
            "h": float(h_x),
            "k": float(h_y),
            "constante_derecha": float(const_der),
        }
    )

    if tipo_conica == "Circunferencia":
        resultado.update(_datos_circunferencia(h_x, h_y, const_der, A))
    elif tipo_conica == "Elipse":
        resultado.update(_datos_elipse(h_x, h_y, const_der, A, B))
    elif tipo_conica == "Hipérbola":
        resultado.update(_datos_hiperbola(h_x, h_y, const_der, A, B))

    return resultado


def agregar_analisis_parabola(resultado, A, B, C, D, E):
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
            "puntos_grafica": puntos_parabola(vertice, p_val, orientacion),
        }
    )
    return resultado


def _datos_circunferencia(h_x, h_y, const_der, A):
    centro, radio = analizar_circunferencia(h_x, h_y, const_der, A)
    radio_val = float(radio)
    centro_val = [float(centro[0]), float(centro[1])]

    return {
        "centro": centro_val,
        "radio": radio_val,
        "puntos_grafica": puntos_circunferencia(centro_val, radio_val),
    }


def _datos_elipse(h_x, h_y, const_der, A, B):
    centro, vertices, focos, a, b = analizar_elipse(h_x, h_y, const_der, A, B)
    a_val, b_val = float(a), float(b)
    c_val = _calcular_c_elipse(a_val, b_val)
    centro_val = [float(centro[0]), float(centro[1])]

    return {
        "centro": centro_val,
        "vertices": [[float(v[0]), float(v[1])] for v in vertices],
        "focos": [[float(f[0]), float(f[1])] for f in focos],
        "a": a_val,
        "b": b_val,
        "c": c_val,
        "excentricidad": float(c_val / a_val) if a_val != 0 else 0.0,
        "puntos_grafica": puntos_elipse(centro_val, a_val, b_val),
    }


def _datos_hiperbola(h_x, h_y, const_der, A, B):
    centro, vertices, focos, a, b = analizar_hiperbola(h_x, h_y, const_der, A, B)
    a_val, b_val = float(a), float(b)
    c_val = float((a_val**2 + b_val**2) ** 0.5)
    orientacion = "Horizontal" if (A * const_der) > 0 else "Vertical"
    centro_val = [float(centro[0]), float(centro[1])]

    return {
        "centro": centro_val,
        "vertices": [[float(v[0]), float(v[1])] for v in vertices],
        "focos": [[float(f[0]), float(f[1])] for f in focos],
        "a": a_val,
        "b": b_val,
        "c": c_val,
        "excentricidad": float(c_val / a_val) if a_val != 0 else 0.0,
        "orientacion": orientacion,
        "puntos_grafica": puntos_hiperbola(centro_val, a_val, b_val, orientacion),
    }


def _calcular_c_elipse(a, b):
    return float((abs(a**2 - b**2)) ** 0.5)
