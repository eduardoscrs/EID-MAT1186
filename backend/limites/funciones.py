"""Representacion y evaluacion manual de funciones por tramos."""


def evaluar_funcion(datos_funcion, x):
    tipo_caso = datos_funcion["tipo_caso"]
    digitos = datos_funcion["digitos"]
    a = datos_funcion["a"]

    if _son_iguales(x, a):
        if tipo_caso == "discontinuidad_salto":
            return _normalizar_numero(a + datos_funcion["funcion"]["termino_derecho"])
        return None

    if tipo_caso == "discontinuidad_removible":
        return _normalizar_numero(x + digitos["d1"])

    if tipo_caso == "discontinuidad_salto":
        if x < a:
            return _normalizar_numero(x + datos_funcion["funcion"]["termino_izquierdo"])
        return _normalizar_numero(x + datos_funcion["funcion"]["termino_derecho"])

    numerador = digitos["d5"] + 1
    return _normalizar_numero(numerador / (x - a))


def valor_en_a(datos_funcion):
    valor = evaluar_funcion(datos_funcion, datos_funcion["a"])
    return {
        "definida": valor is not None,
        "valor": valor,
    }


def _normalizar_numero(valor):
    valor_normalizado = round(float(valor), 6)
    if valor_normalizado == 0:
        return 0.0
    return valor_normalizado


def _son_iguales(a, b):
    return abs(float(a) - float(b)) < 0.0000001
