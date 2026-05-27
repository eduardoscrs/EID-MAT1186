from limites.core.evaluacion import evaluar_en, normalizar_valor_tabla


def generar_muestras(a, digitos, estructura):
    xs = []
    ys = []
    x = a - 5

    while x <= a + 5 + 1e-9:
        xs.append(round(x, 6))
        y = evaluar_en(x, a, digitos, estructura)
        ys.append(None if y is None else round(float(y), 6))
        x += 0.5

    return {
        "xs": xs,
        "ys": ys,
        "a": a,
        "extension": estructura.get("extension_sugerida"),
        "analytic": _limites_analiticos(estructura),
    }


def generar_evidencia(a, digitos, estructura):
    offsets = [-1, -0.1, -0.01, -0.001, 0.001, 0.01, 0.1, 1]
    evidencia = []

    for offset in offsets:
        x = a + offset
        y = evaluar_en(x, a, digitos, estructura)
        evidencia.append({"x": round(x, 6), "y": normalizar_valor_tabla(y)})

    return evidencia


def calcular_limites_numericos(a, digitos, estructura):
    return {
        "izq": _limite_mas_cercano(a, digitos, estructura, [-0.001, -0.01, -0.1, -1]),
        "der": _limite_mas_cercano(a, digitos, estructura, [0.001, 0.01, 0.1, 1]),
    }


def _limites_analiticos(estructura):
    izquierdo = estructura["limite_izquierdo"]
    derecho = estructura["limite_derecho"]

    return {
        "izq": None if izquierdo in (float("inf"), float("-inf")) else izquierdo,
        "der": None if derecho in (float("inf"), float("-inf")) else derecho,
    }


def _limite_mas_cercano(a, digitos, estructura, offsets):
    for offset in offsets:
        valor = evaluar_en(a + offset, a, digitos, estructura)
        if valor is None:
            continue
        if valor in (float("inf"), float("-inf")):
            return valor
        return float(valor)
    return None
