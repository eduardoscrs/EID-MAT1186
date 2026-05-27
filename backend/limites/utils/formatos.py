def formatear_limite(valor):
    if valor == float("inf"):
        return "+\u221e"
    if valor == float("-inf"):
        return "-\u221e"
    if isinstance(valor, int):
        return str(valor)
    if isinstance(valor, float) and valor.is_integer():
        return str(int(valor))
    return str(valor)


def formatear_funcion_por_tramos(tramos):
    return (
        f"f(x) = {{ {tramos[0]['expresion']} , si {tramos[0]['condicion']}; "
        f"{tramos[1]['expresion']} , si {tramos[1]['condicion']} }}"
    )
