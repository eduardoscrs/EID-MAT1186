"""Construccion de funciones por tramos a partir del RUT."""


def construir_funcion_por_tramos(cuerpo):
    digitos = [int(digito) for digito in str(cuerpo).zfill(8)]
    a = digitos[2]
    residuo = digitos[7] % 3

    if residuo == 0:
        tipo_caso = "discontinuidad_removible"
        funcion = _funcion_removible(digitos, a)
    elif residuo == 1:
        tipo_caso = "discontinuidad_salto"
        funcion = _funcion_salto(digitos, a)
    else:
        tipo_caso = "discontinuidad_infinita"
        funcion = _funcion_infinita(digitos, a)

    return {
        "tipo_caso": tipo_caso,
        "a": a,
        "digitos": _digitos_rut(digitos),
        "regla_seleccion": {
            "d8": digitos[7],
            "residuo_mod_3": residuo,
            "descripcion": (
                f"Como d8 = {digitos[7]} y {digitos[7]} % 3 = {residuo}, "
                f"se genera {tipo_caso.replace('_', ' ')}."
            ),
        },
        "funcion": funcion,
        "extension_sugerida": funcion.get("extension_sugerida"),
        "puntos_criticos": funcion["puntos_criticos"],
    }


def _funcion_removible(digitos, a):
    d1 = digitos[0]
    return {
        "variable": "x",
        "descripcion": "Funcion racional con factor comun que se anula en x = a.",
        "expresion": f"((x - {a})(x + {d1})) / (x - {a})",
        "expresion_simplificada": f"x + {d1}",
        "definida_en_a": False,
        "extension_sugerida": f"f({a}) = {a + d1}",
        "tramos": [
            {
                "condicion": f"x < {a}",
                "expresion": f"((x - {a})(x + {d1})) / (x - {a})",
            },
            {
                "condicion": f"x > {a}",
                "expresion": f"((x - {a})(x + {d1})) / (x - {a})",
            },
        ],
        "puntos_criticos": [
            {
                "x": a,
                "motivo": "El denominador x - a se anula y la expresion original no esta definida en ese punto.",
            }
        ],
    }


def _funcion_salto(digitos, a):
    d2 = digitos[1]
    d4 = digitos[3]
    termino_derecho = d4 if d2 != d4 else d4 + 1
    return {
        "variable": "x",
        "descripcion": "Funcion por tramos con expresiones lineales distintas.",
        "expresion": (
            f"f(x) = x + {d2} si x < {a}; "
            f"x + {termino_derecho} si x >= {a}"
        ),
        "definida_en_a": True,
        "ajuste_salto": termino_derecho != d4,
        "termino_izquierdo": d2,
        "termino_derecho": termino_derecho,
        "tramos": [
            {"condicion": f"x < {a}", "expresion": f"x + {d2}"},
            {"condicion": f"x >= {a}", "expresion": f"x + {termino_derecho}"},
        ],
        "puntos_criticos": [
            {
                "x": a,
                "motivo": "El punto de cambio de tramo produce limites laterales distintos.",
            }
        ],
    }


def _funcion_infinita(digitos, a):
    numerador = digitos[4] + 1
    return {
        "variable": "x",
        "descripcion": "Funcion racional con denominador nulo en x = a.",
        "expresion": f"{numerador} / (x - {a})",
        "definida_en_a": False,
        "asintota_vertical": f"x = {a}",
        "tramos": [
            {"condicion": f"x < {a}", "expresion": f"{numerador} / (x - {a})"},
            {"condicion": f"x > {a}", "expresion": f"{numerador} / (x - {a})"},
        ],
        "puntos_criticos": [
            {
                "x": a,
                "motivo": "El denominador x - a se anula y la funcion diverge sin limite.",
            }
        ],
    }


def _digitos_rut(digitos):
    return {f"d{indice + 1}": digito for indice, digito in enumerate(digitos)}
