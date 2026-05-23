from core.rut import limpiar_rut, validar_rut_paso_a_paso


def _formatear_limite(valor):
    if valor == float("inf"):
        return "+\u221e"
    if valor == float("-inf"):
        return "-\u221e"
    if isinstance(valor, int):
        return str(valor)
    if isinstance(valor, float) and valor.is_integer():
        return str(int(valor))
    return str(valor)


def _construir_piecewise(caso, a, d):
    d1, d2, d3, d4, d5, d6, d7, d8 = d

    if caso == 1:
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
                    "motivo": "El denominador x - a se anula y la expresión original no está definida en ese punto.",
                }
            ],
        }

    if caso == 2:
        izquierdo = f"x + {d2}"
        derecho = f"x + {d4}"
        return {
            "tipo": "salto",
            "funcion_original": f"{{ {izquierdo} , si x < {a}; {derecho} , si x >= {a} }}",
            "tramos": [
                {"condicion": f"x < {a}", "expresion": izquierdo},
                {"condicion": f"x >= {a}", "expresion": derecho},
            ],
            "extension_sugerida": None,
            "limite_izquierdo": a + d2,
            "limite_derecho": a + d4,
            "valor_funcion": a + d4,
            "discontinuidad": "salto",
            "puntos_criticos": [
                {
                    "x": a,
                    "motivo": "El punto de cambio de tramo produce límites laterales distintos.",
                }
            ],
        }

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
                "motivo": "El denominador x - a se anula y la función diverge sin límite.",
            }
        ],
    }


def generar_funcion_limite(rut_ingresado):
    rut_limpio = limpiar_rut(rut_ingresado)
    es_valido, pasos_rut, cuerpo, dv = validar_rut_paso_a_paso(rut_limpio)
    if not es_valido:
        raise ValueError("RUT inválido")

    d = [int(x) for x in cuerpo.zfill(8)]
    d1, d2, d3, d4, d5, d6, d7, d8 = d
    a = d3
    residuo = d8 % 3

    pasos = []
    pasos.extend(pasos_rut)
    pasos.append(f"Dígitos extraídos: {d}")
    pasos.append(f"Se define el punto de análisis a = d3 = {a}")
    pasos.append(f"Regla de selección: d8 = {d8} y d8 % 3 = {residuo}")

    if residuo == 0:
        pasos.append("Como d8 es múltiplo de 3, se genera el caso de discontinuidad removible.")
        caso = 1
    elif residuo == 1:
        pasos.append("Como d8 deja residuo 1, se genera el caso de discontinuidad de salto.")
        caso = 2
    else:
        pasos.append("Como d8 deja residuo 2, se genera el caso de discontinuidad infinita.")
        caso = 3

    estructura = _construir_piecewise(caso, a, d)
    limite_izquierdo = estructura["limite_izquierdo"]
    limite_derecho = estructura["limite_derecho"]
    existe_limite = limite_izquierdo == limite_derecho

    if existe_limite:
        pasos.append(
            f"Los límites laterales coinciden: lim x-> {a}- f(x) = lim x-> {a}+ f(x) = {_formatear_limite(limite_izquierdo)}"
        )
    else:
        pasos.append(
            f"Los límites laterales son distintos: lim x-> {a}- f(x) = {_formatear_limite(limite_izquierdo)} y lim x-> {a}+ f(x) = {_formatear_limite(limite_derecho)}"
        )

    if estructura["discontinuidad"] == "removible":
        pasos.append(f"La discontinuidad es removible y la extensión continua sugerida es f(a) = {a + d1}.")
    elif estructura["discontinuidad"] == "salto":
        pasos.append("La discontinuidad es de salto porque los límites laterales no coinciden.")
    else:
        pasos.append("La discontinuidad es infinita porque la función diverge al acercarse a x = a.")

    return {
        "rut_limpio": rut_limpio,
        "cuerpo": cuerpo,
        "digito_verificador": str(dv),
        "digitos": {
            "d1": d1,
            "d2": d2,
            "d3": d3,
            "d4": d4,
            "d5": d5,
            "d6": d6,
            "d7": d7,
            "d8": d8,
        },
        "a": a,
        "residuo": residuo,
        "caso": estructura["tipo"],
        "regla_seleccion": f"d8 = {d8} -> d8 % 3 = {residuo}",
        "funcion_original": estructura["funcion_original"],
        "funcion_por_tramos": f"f(x) = {{ {estructura['tramos'][0]['expresion']} , si {estructura['tramos'][0]['condicion']}; {estructura['tramos'][1]['expresion']} , si {estructura['tramos'][1]['condicion']} }}",
        "tramos": estructura["tramos"],
        "extension_sugerida": estructura["extension_sugerida"],
        "limites": {
            "izquierdo": _formatear_limite(limite_izquierdo),
            "derecho": _formatear_limite(limite_derecho),
            "existe": existe_limite,
        },
        "continuidad": {
            "limite_existe": existe_limite,
            "definida_en_a": estructura["valor_funcion"] is not None,
            "continua_en_a": existe_limite and estructura["valor_funcion"] is not None and limite_izquierdo == estructura["valor_funcion"],
            "clasificacion": estructura["discontinuidad"],
        },
        "puntos_criticos": estructura["puntos_criticos"],
        "pasos": pasos,
    }




