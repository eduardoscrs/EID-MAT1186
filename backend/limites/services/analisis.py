from limites.utils.formatos import formatear_limite


def analizar_continuidad(estructura):
    limite_izquierdo = estructura["limite_izquierdo"]
    limite_derecho = estructura["limite_derecho"]
    valor_funcion = estructura["valor_funcion"]
    existe_limite = limite_izquierdo == limite_derecho

    return {
        "limites": {
            "izquierdo": formatear_limite(limite_izquierdo),
            "derecho": formatear_limite(limite_derecho),
            "existe": existe_limite,
        },
        "continuidad": {
            "limite_existe": existe_limite,
            "definida_en_a": valor_funcion is not None,
            "continua_en_a": existe_limite and valor_funcion is not None and limite_izquierdo == valor_funcion,
            "clasificacion": estructura["discontinuidad"],
        },
    }


def generar_justificacion(a, digitos, estructura):
    d1, d2, _d3, _d4, d5, _d6, _d7, _d8 = digitos
    izquierdo = estructura["limite_izquierdo"]
    derecho = estructura["limite_derecho"]

    if estructura["discontinuidad"] == "removible":
        return (
            f"La expresion tiene un factor (x - {a}) en numerador y denominador; "
            f"al cancelarlo la funcion simplificada vale {a + d1} en x=a, "
            "pero la expresion original esta indefinida en x=a. Por eso es discontinuidad removible."
        )

    if estructura["discontinuidad"] == "salto":
        detalle = ""
        if estructura.get("ajuste_salto"):
            ajuste_derecho = estructura["limite_derecho"] - a
            detalle = (
                f" Como d2 y d4 son iguales, se usa d4 + 1 = {ajuste_derecho} "
                "en el tramo derecho para asegurar un salto real."
            )
        return (
            f"Los limites laterales son lim_izq = {izquierdo} y lim_der = {derecho}, "
            f"distintos entre si; por tanto hay un salto.{detalle}"
        )

    signo = "positivo" if (d5 + 1) > 0 else "negativo"
    return (
        f"El numerador es {d5 + 1} ({signo}). Al acercarse x->a el denominador tiende a 0, "
        "por lo que la funcion diverge a +/- infinito segun el lado; resulta en discontinuidad "
        "infinita y asintota vertical."
    )


def agregar_pasos_conclusion(pasos, a, estructura):
    izquierdo = estructura["limite_izquierdo"]
    derecho = estructura["limite_derecho"]

    if izquierdo == derecho:
        pasos.append(
            f"Los limites laterales coinciden: lim x-> {a}- f(x) = lim x-> {a}+ f(x) = {formatear_limite(izquierdo)}"
        )
    else:
        pasos.append(
            f"Los limites laterales son distintos: lim x-> {a}- f(x) = {formatear_limite(izquierdo)} "
            f"y lim x-> {a}+ f(x) = {formatear_limite(derecho)}"
        )

    if estructura["discontinuidad"] == "removible":
        pasos.append(f"La discontinuidad es removible y la extension continua sugerida es f(a) = {izquierdo}.")
    elif estructura["discontinuidad"] == "salto":
        pasos.append("La discontinuidad es de salto porque los limites laterales no coinciden.")
    else:
        pasos.append("La discontinuidad es infinita porque la funcion diverge al acercarse a x = a.")
