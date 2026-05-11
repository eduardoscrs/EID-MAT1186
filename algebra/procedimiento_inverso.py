from utils.formato import formatear_ecuacion_general, formatear_numero


def generar_procedimiento_inverso(A, B, C, D, E, resultado):
    """Explica como regresar desde la forma canonica a la ecuacion general."""
    tipo = resultado.get("tipo_conica")
    pasos = ["--- Procedimiento inverso: forma canónica a ecuación general ---"]

    if tipo in ("Circunferencia", "Elipse", "Hipérbola"):
        h, k = resultado["centro"]
        constante = resultado["constante_derecha"]
        pasos.append(
            f"Se parte de la forma con centro: "
            f"{formatear_numero(A)}(x - {formatear_numero(h)})^2 + "
            f"{formatear_numero(B)}(y - {formatear_numero(k)})^2 = "
            f"{formatear_numero(constante)}."
        )
        pasos.append(
            "(x - h)^2 se expande como x^2 - 2hx + h^2, "
            "y (y - k)^2 como y^2 - 2ky + k^2."
        )
        pasos.append(
            f"Al distribuir: {formatear_numero(A)}x^2 + "
            f"{formatear_numero(-2 * A * h)}x + "
            f"{formatear_numero(A * h * h)} + "
            f"{formatear_numero(B)}y^2 + "
            f"{formatear_numero(-2 * B * k)}y + "
            f"{formatear_numero(B * k * k)} = {formatear_numero(constante)}."
        )
        pasos.append(
            "Se pasa la constante derecha al lado izquierdo y se agrupan "
            "los términos semejantes."
        )
    else:
        h, k = resultado["vertice"]
        if resultado.get("orientacion") == "Vertical":
            pasos.append(
                f"Se parte de {formatear_numero(A)}(x - {formatear_numero(h)})^2 + "
                f"{formatear_numero(D)}(y - {formatear_numero(k)}) = 0."
            )
            pasos.append(
                f"Se expande el cuadrado: {formatear_numero(A)}x^2 + "
                f"{formatear_numero(-2 * A * h)}x + "
                f"{formatear_numero(A * h * h)} + "
                f"{formatear_numero(D)}y + {formatear_numero(-D * k)} = 0."
            )
        else:
            pasos.append(
                f"Se parte de {formatear_numero(B)}(y - {formatear_numero(k)})^2 + "
                f"{formatear_numero(C)}(x - {formatear_numero(h)}) = 0."
            )
            pasos.append(
                f"Se expande el cuadrado: {formatear_numero(B)}y^2 + "
                f"{formatear_numero(-2 * B * k)}y + "
                f"{formatear_numero(B * k * k)} + "
                f"{formatear_numero(C)}x + {formatear_numero(-C * h)} = 0."
            )
        pasos.append("Se ordenan los términos como Ax^2 + By^2 + Cx + Dy + E = 0.")

    pasos.append(f"El resultado recuperado es: {formatear_ecuacion_general(A, B, C, D, E)}")
    return pasos
