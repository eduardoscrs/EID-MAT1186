from common.rut import limpiar_rut, validar_rut_paso_a_paso


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
        ajuste_derecho = d4
        if d2 == d4:
            ajuste_derecho = d4 + 1

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

    # Generar muestras para la gráfica y tabla de valores
    samples_x = []
    samples_y = []
    step = 0.5
    span = 5
    start = a - span
    end = a + span

    def eval_at(x):
        # devuelve número, float('inf') o None
        try:
            if estructura["tipo"] == "removible":
                # simplificada: x + d1 (excepto en x == a donde está indefinida)
                if abs(x - a) < 1e-9:
                    return None
                return x + d1
            if estructura["tipo"] == "salto":
                if x < a:
                    return x + d2
                return x + (estructura["limite_derecho"] - a)
            # infinita
            numerador = d5 + 1
            denom = x - a
            if abs(denom) < 1e-9:
                return None
            return numerador / denom
        except Exception:
            return None

    x = start
    while x <= end + 1e-9:
        samples_x.append(round(x, 6))
        y = eval_at(x)
        # normalizar infinitos a +/-inf string handled later
        if y is None:
            samples_y.append(None)
        elif y == float("inf") or y == float("-inf"):
            samples_y.append(y)
        else:
            samples_y.append(round(float(y), 6))
        x += step

    # Tabla de evidencia: valores cercanos a a por la izquierda y derecha
    offsets = [-1, -0.1, -0.01, -0.001, 0.001, 0.01, 0.1, 1]
    evidence = []
    for off in offsets:
        val = eval_at(a + off)
        if val is None:
            evidence.append({"x": round(a + off, 6), "y": None})
        elif val == float("inf"):
            evidence.append({"x": round(a + off, 6), "y": "+inf"})
        elif val == float("-inf"):
            evidence.append({"x": round(a + off, 6), "y": "-inf"})
        else:
            evidence.append({"x": round(a + off, 6), "y": round(float(val), 6)})

    # Aproximaciones numéricas de límites laterales (elegir el más cercano no nulo)
    def _nearest_limit(side_offsets):
        for off in side_offsets:
            v = eval_at(a + off)
            if v is None:
                continue
            if v == float("inf") or v == float("-inf"):
                return v
            return float(v)
        return None

    left_numeric = _nearest_limit([-0.001, -0.01, -0.1, -1])
    right_numeric = _nearest_limit([0.001, 0.01, 0.1, 1])

    # Justificación matemática breve basada en el caso
    if estructura["discontinuidad"] == "removible":
        justificacion = (
            f"La expresión tiene un factor (x - {a}) en numerador y denominador; al cancelarlo la función simplificada vale {a + d1} en x=a, "
            "pero la expresión original está indefinida en x=a. Por eso es discontinuidad removible."
        )
    elif estructura["discontinuidad"] == "salto":
        detalle_ajuste = ""
        if estructura.get("ajuste_salto"):
            ajuste_derecho = estructura["limite_derecho"] - a
            detalle_ajuste = (
                f" Como d2 y d4 son iguales, se usa d4 + 1 = {ajuste_derecho} "
                "en el tramo derecho para asegurar un salto real."
            )
        justificacion = (
            f"Los límites laterales son lim_izq = {limite_izquierdo} y lim_der = {limite_derecho}, "
            f"distintos entre sí; por tanto hay un salto.{detalle_ajuste}"
        )
    else:
        signo = "positivo" if (d5 + 1) > 0 else "negativo"
        justificacion = (
            f"El numerador es {d5 + 1} ({signo}). Al acercarse x->a el denominador tiende a 0, por lo que la función diverge a ±∞ según el lado; resulta en discontinuidad infinita y asíntota vertical."
        )


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

    # incluir metadatos en samples para facilitar la gráfica
    samples = {"xs": samples_x, "ys": samples_y, "a": a, "extension": estructura.get("extension_sugerida"), "analytic": {"izq": None, "der": None}}
    # Analytic limits (si son números) - usar valores exactos de la estructura
    try:
        li = estructura.get("limite_izquierdo")
        ld = estructura.get("limite_derecho")
        samples["analytic"]["izq"] = None if li in (float("inf"), float("-inf")) else li
        samples["analytic"]["der"] = None if ld in (float("inf"), float("-inf")) else ld
    except Exception:
        pass

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
        "samples": samples,
        "evidence": evidence,
        "numeric_limits": {"izq": left_numeric, "der": right_numeric},
        "justificacion": justificacion,
    }




