from conicas.utils.formato import formatear_numero


def completar_cuadrado(coef_cuad, coef_lineal, variable):
    """
    Completa el cuadrado para una variable dada.
    Forma inicial: Ax^2 + Cx
    Forma final: A(x - h)^2 + K_fuera
    """
    pasos = []
    if coef_cuad == 0:
        return 0, 0, coef_lineal, pasos

    pasos.append(
        f"Agrupando terminos de {variable}: "
        f"{formatear_numero(coef_cuad)}{variable}^2 + "
        f"{formatear_numero(coef_lineal)}{variable}"
    )

    factor = coef_lineal / coef_cuad
    pasos.append(
        f"Factorizando {formatear_numero(coef_cuad)}: "
        f"{formatear_numero(coef_cuad)}("
        f"{variable}^2 + {formatear_numero(factor)}{variable})"
    )

    mitad = factor / 2
    cuadrado_mitad = mitad ** 2

    pasos.append(
        f"Sumando y restando ({formatear_numero(factor)}/2)^2 = "
        f"{formatear_numero(cuadrado_mitad)} dentro del parentesis"
    )
    pasos.append(
        f"{formatear_numero(coef_cuad)}("
        f"{variable}^2 + {formatear_numero(factor)}{variable} + "
        f"{formatear_numero(cuadrado_mitad)} - "
        f"{formatear_numero(cuadrado_mitad)})"
    )

    k_fuera = -(cuadrado_mitad * coef_cuad)
    h = -mitad

    signo_h = "+" if mitad >= 0 else "-"
    pasos.append(
        f"Trinomio cuadrado perfecto: {formatear_numero(coef_cuad)}"
        f"({variable} {signo_h} {formatear_numero(abs(mitad))})^2 "
        f"{formatear_numero(k_fuera)}"
    )

    return coef_cuad, h, k_fuera, pasos
