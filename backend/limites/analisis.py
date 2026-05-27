"""Analisis de limites laterales, existencia del limite y continuidad."""


def calcular_limites_laterales(datos_funcion):
    tipo_caso = datos_funcion["tipo_caso"]
    digitos = datos_funcion["digitos"]
    a = datos_funcion["a"]

    if tipo_caso == "discontinuidad_removible":
        valor = _normalizar_numero(a + digitos["d1"])
        return _limites_finitos(valor, valor)

    if tipo_caso == "discontinuidad_salto":
        funcion = datos_funcion["funcion"]
        izquierda = _normalizar_numero(a + funcion["termino_izquierdo"])
        derecha = _normalizar_numero(a + funcion["termino_derecho"])
        return _limites_finitos(izquierda, derecha)

    return {
        "izquierda": {"valor": "-infinito", "descripcion": "La funcion decrece sin limite al acercarse por la izquierda."},
        "derecha": {"valor": "infinito", "descripcion": "La funcion crece sin limite al acercarse por la derecha."},
        "existe": False,
        "valor": None,
    }


def _limites_finitos(izquierda, derecha):
    existe = izquierda == derecha
    return {
        "izquierda": {"valor": izquierda},
        "derecha": {"valor": derecha},
        "existe": existe,
        "valor": izquierda if existe else None,
    }


def _normalizar_numero(valor):
    valor_normalizado = round(float(valor), 6)
    if valor_normalizado == 0:
        return 0.0
    return valor_normalizado
