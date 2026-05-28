def evaluar_en(x, a, digitos, estructura):
    d1, d2, _d3, d4, d5, _d6, _d7, _d8 = digitos

    try:
        if estructura["tipo"] == "removible":
            if abs(x - a) < 1e-9:
                return None
            return x + d1

        if estructura["tipo"] == "salto":
            if x < a:
                return x + d2
            return x + d4

        numerador = d5 + 1
        denominador = x - a
        if abs(denominador) < 1e-9:
            return None
        return numerador / denominador
    except Exception:
        return None


def normalizar_valor_tabla(valor):
    if valor is None:
        return None
    if valor == float("inf"):
        return "+inf"
    if valor == float("-inf"):
        return "-inf"
    return round(float(valor), 6)
