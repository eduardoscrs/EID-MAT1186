def formatear_numero(valor, decimales=4):
    """Devuelve numeros legibles sin depender de librerias matematicas."""
    if isinstance(valor, int):
        return str(valor)

    texto = f"{float(valor):.{decimales}f}"
    texto = texto.rstrip("0").rstrip(".")
    if texto == "-0":
        return "0"
    return texto


def formatear_punto(punto):
    return f"({formatear_numero(punto[0])}, {formatear_numero(punto[1])})"


def formatear_binomio(variable, centro):
    signo = "-" if centro >= 0 else "+"
    return f"({variable} {signo} {formatear_numero(abs(centro))})"


def formatear_termino_signado(coeficiente, variable=""):
    signo = "+" if coeficiente >= 0 else "-"
    return f"{signo} {formatear_numero(abs(coeficiente))}{variable}"


def formatear_ecuacion_general(A, B, C, D, E):
    return (
        f"{formatear_numero(A)}x^2 "
        f"{formatear_termino_signado(B, 'y^2')} "
        f"{formatear_termino_signado(C, 'x')} "
        f"{formatear_termino_signado(D, 'y')} "
        f"{formatear_termino_signado(E)} = 0"
    )


def formatear_forma_canonica(resultado):
    tipo = resultado.get("tipo_conica")

    if tipo == "Circunferencia":
        h, k = resultado["centro"]
        radio_cuadrado = resultado.get("radio_cuadrado", resultado["radio"] ** 2)
        return (
            f"{formatear_binomio('x', h)}^2 + "
            f"{formatear_binomio('y', k)}^2 = {formatear_numero(radio_cuadrado)}"
        )

    if tipo == "Elipse":
        h, k = resultado["centro"]
        semieje_x = resultado.get("semieje_x", resultado["a"])
        semieje_y = resultado.get("semieje_y", resultado["b"])
        if semieje_x <= 0 or semieje_y <= 0:
            return "No hay forma canonica real de elipse porque algun semieje no es positivo"
        return (
            f"{formatear_binomio('x', h)}^2/{formatear_numero(semieje_x ** 2)} + "
            f"{formatear_binomio('y', k)}^2/{formatear_numero(semieje_y ** 2)} = 1"
        )

    if tipo == "Hipérbola":
        h, k = resultado["centro"]
        a = resultado["a"]
        b = resultado["b"]
        if a <= 0 or b <= 0:
            return "La hiperbola queda degenerada y no tiene forma canonica real estandar"
        if resultado.get("orientacion") == "Horizontal":
            return (
                f"{formatear_binomio('x', h)}^2/{formatear_numero(a ** 2)} - "
                f"{formatear_binomio('y', k)}^2/{formatear_numero(b ** 2)} = 1"
            )
        return (
            f"{formatear_binomio('y', k)}^2/{formatear_numero(a ** 2)} - "
            f"{formatear_binomio('x', h)}^2/{formatear_numero(b ** 2)} = 1"
        )

    if tipo == "Parábola":
        h, k = resultado["vertice"]
        p = resultado["p"]
        if resultado.get("orientacion") == "Vertical":
            return (
                f"{formatear_binomio('x', h)}^2 = "
                f"{formatear_numero(4 * p)}{formatear_binomio('y', k)}"
            )
        return (
            f"{formatear_binomio('y', k)}^2 = "
            f"{formatear_numero(4 * p)}{formatear_binomio('x', h)}"
        )

    return "No disponible"
