def seleccionar_caso(d8):
    residuo = d8 % 3

    if residuo == 0:
        return residuo, 1, "Como d8 es multiplo de 3, se genera el caso de discontinuidad removible."
    if residuo == 1:
        return residuo, 2, "Como d8 deja residuo 1, se genera el caso de discontinuidad de salto."
    return residuo, 3, "Como d8 deja residuo 2, se genera el caso de discontinuidad infinita."


def construir_estructura(caso, a, digitos):
    d1, d2, _d3, d4, d5, _d6, _d7, _d8 = digitos

    if caso == 1:
        return _caso_removible(a, d1)
    if caso == 2:
        return _caso_salto(a, d2, d4)
    return _caso_infinito(a, d5)


def _caso_removible(a, d1):
    expresion = f"((x - {a})(x + {d1})) / (x - {a})"
    return {
        "tipo": "removible",
        "funcion_original": expresion,
        "tramos": [
            {"condicion": f"x < {a}", "expresion": expresion},
            {"condicion": f"x > {a}", "expresion": expresion},
        ],
        "extension_sugerida": f"x + {d1}",
        "limite_izquierdo": a + d1,
        "limite_derecho": a + d1,
        "valor_funcion": None,
        "discontinuidad": "removible",
        "puntos_criticos": [
            {
                "x": a,
                "motivo": "El denominador x - a se anula y la expresion original no esta definida en ese punto.",
            }
        ],
    }


def _caso_salto(a, d2, d4):
    ajuste_derecho = d4 if d2 != d4 else d4 + 1
    izquierdo = f"x + {d2}"
    derecho = f"x + {ajuste_derecho}"

    return {
        "tipo": "salto",
        "funcion_original": f"{{ {izquierdo} , si x < {a}; {derecho} , si x >= {a} }}",
        "ajuste_salto": ajuste_derecho != d4,
        "tramos": [
            {"condicion": f"x < {a}", "expresion": izquierdo},
            {"condicion": f"x >= {a}", "expresion": derecho},
        ],
        "extension_sugerida": None,
        "limite_izquierdo": a + d2,
        "limite_derecho": a + ajuste_derecho,
        "valor_funcion": a + ajuste_derecho,
        "discontinuidad": "salto",
        "puntos_criticos": [
            {
                "x": a,
                "motivo": "El punto de cambio de tramo produce limites laterales distintos.",
            }
        ],
    }


def _caso_infinito(a, d5):
    numerador = d5 + 1
    expresion = f"({numerador}) / (x - {a})"
    return {
        "tipo": "infinita",
        "funcion_original": expresion,
        "tramos": [
            {"condicion": f"x < {a}", "expresion": expresion},
            {"condicion": f"x > {a}", "expresion": expresion},
        ],
        "extension_sugerida": None,
        "limite_izquierdo": float("-inf") if numerador > 0 else float("inf"),
        "limite_derecho": float("inf") if numerador > 0 else float("-inf"),
        "valor_funcion": None,
        "discontinuidad": "infinita",
        "puntos_criticos": [
            {
                "x": a,
                "motivo": "El denominador x - a se anula y la funcion diverge sin limite.",
            }
        ],
    }
