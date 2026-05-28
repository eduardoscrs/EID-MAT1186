from conicas.algebra.completar_cuadrado import completar_cuadrado
from conicas.utils.formato import formatear_binomio, formatear_numero


def analizar_parabola(A, B, C, D, E):
    """Calcula vertice, foco y directriz de una parabola."""
    if A == 0:
        # Parabola horizontal (y al cuadrado).
        _, h_y, k_fuera, pasos = completar_cuadrado(B, D, "y")
        # B(y - h_y)^2 = -C(x - h_x)
        p = -C / (4 * B) if B != 0 else 0
        h_x = (-E - k_fuera) / C if C != 0 else 0

        vertice = (h_x, h_y)
        foco = (h_x + p, h_y)
        directriz = h_x - p
        orientacion = "Horizontal"
        pasos.extend(
            _pasos_parabola_horizontal(B, C, E, k_fuera, h_x, h_y, p)
        )

    else:
        # Parabola vertical (x al cuadrado).
        _, h_x, k_fuera, pasos = completar_cuadrado(A, C, "x")
        p = -D / (4 * A) if A != 0 else 0
        h_y = (-E - k_fuera) / D if D != 0 else 0

        vertice = (h_x, h_y)
        foco = (h_x, h_y + p)
        directriz = h_y - p
        orientacion = "Vertical"
        pasos.extend(_pasos_parabola_vertical(A, D, E, k_fuera, h_x, h_y, p))

    return vertice, foco, directriz, p, orientacion, pasos


def _pasos_parabola_vertical(A, D, E, k_fuera, h_x, h_y, p):
    return [
        (
            "Sustituyendo el cuadrado completado en la ecuacion: "
            f"{formatear_numero(A)}{formatear_binomio('x', h_x)}^2 "
            f"+ {formatear_numero(D)}y + {formatear_numero(E + k_fuera)} = 0"
        ),
        (
            "Se aisla el termino cuadratico: "
            f"{formatear_numero(A)}{formatear_binomio('x', h_x)}^2 = "
            f"{formatear_numero(-D)}{formatear_binomio('y', h_y)}"
        ),
        (
            "Dividiendo por el coeficiente cuadratico se obtiene la forma canonica: "
            f"{formatear_binomio('x', h_x)}^2 = "
            f"{formatear_numero(4 * p)}{formatear_binomio('y', h_y)}"
        ),
        f"Por comparacion con (x - h)^2 = 4p(y - k), p = {formatear_numero(p)}.",
    ]


def _pasos_parabola_horizontal(B, C, E, k_fuera, h_x, h_y, p):
    return [
        (
            "Sustituyendo el cuadrado completado en la ecuacion: "
            f"{formatear_numero(B)}{formatear_binomio('y', h_y)}^2 "
            f"+ {formatear_numero(C)}x + {formatear_numero(E + k_fuera)} = 0"
        ),
        (
            "Se aisla el termino cuadratico: "
            f"{formatear_numero(B)}{formatear_binomio('y', h_y)}^2 = "
            f"{formatear_numero(-C)}{formatear_binomio('x', h_x)}"
        ),
        (
            "Dividiendo por el coeficiente cuadratico se obtiene la forma canonica: "
            f"{formatear_binomio('y', h_y)}^2 = "
            f"{formatear_numero(4 * p)}{formatear_binomio('x', h_x)}"
        ),
        f"Por comparacion con (y - k)^2 = 4p(x - h), p = {formatear_numero(p)}.",
    ]
