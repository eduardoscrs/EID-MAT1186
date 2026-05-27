"""Orquestacion del modulo de limites."""

from common.rut import validar_cuerpo_dv_para_procesar
from limites.analisis import calcular_limites_laterales
from limites.constructor import construir_funcion_por_tramos
from limites.continuidad import analizar_continuidad
from limites.funciones import valor_en_a
from limites.graficas import generar_puntos_grafica
from limites.tablas import generar_tabla_valores


def procesar_limites(cuerpo, dv):
    cuerpo_validado, dv_validado, pasos_rut = validar_cuerpo_dv_para_procesar(
        cuerpo, dv
    )
    datos_funcion = construir_funcion_por_tramos(cuerpo_validado)
    limites_laterales = calcular_limites_laterales(datos_funcion)
    valor_punto = valor_en_a(datos_funcion)
    continuidad = analizar_continuidad(
        datos_funcion, limites_laterales, valor_punto
    )

    return {
        "rut": {
            "cuerpo": cuerpo_validado,
            "digito_verificador": dv_validado,
        },
        "digitos": datos_funcion["digitos"],
        "tipo_caso": datos_funcion["tipo_caso"],
        "a": datos_funcion["a"],
        "regla_seleccion": datos_funcion["regla_seleccion"],
        "funcion": datos_funcion["funcion"],
        "extension_sugerida": datos_funcion["extension_sugerida"],
        "limites_laterales": limites_laterales,
        "tabla_valores": generar_tabla_valores(datos_funcion),
        "continuidad": {
            **continuidad["continuidad"],
            "valor_funcion_en_a": valor_punto,
        },
        "discontinuidad": continuidad["discontinuidad"],
        "puntos_criticos": datos_funcion["puntos_criticos"],
        "puntos_grafica": generar_puntos_grafica(datos_funcion),
        "justificacion": _generar_justificacion(datos_funcion, limites_laterales),
        "pasos": _generar_pasos(datos_funcion, limites_laterales, continuidad),
        "pasos_rut": pasos_rut,
    }


def _generar_pasos(datos_funcion, limites_laterales, continuidad):
    regla = datos_funcion["regla_seleccion"]
    funcion = datos_funcion["funcion"]

    pasos = []
    _agregar_paso(pasos, "Se valida el RUT usando modulo 11.")
    _agregar_paso(
        pasos,
        f"Se extraen los digitos del cuerpo y se define a = d3 = {datos_funcion['a']}.",
    )
    _agregar_paso(
        pasos,
        (
            "Se calcula la regla de seleccion: "
            f"d8 = {regla['d8']} y d8 % 3 = {regla['residuo_mod_3']}."
        ),
    )
    _agregar_paso(pasos, f"Se construye la funcion: {funcion['expresion']}.")

    if datos_funcion["tipo_caso"] == "discontinuidad_removible":
        _agregar_paso(
            pasos,
            "Se simplifica el factor comun para calcular los limites laterales.",
        )
    elif datos_funcion["tipo_caso"] == "discontinuidad_salto":
        if funcion.get("ajuste_salto"):
            _agregar_paso(
                pasos,
                "Como d2 y d4 son iguales, se usa d4 + 1 en el tramo derecho para asegurar un salto real.",
            )
        _agregar_paso(
            pasos,
            "Se evalua el tramo izquierdo y el tramo derecho en torno a a.",
        )
    else:
        _agregar_paso(
            pasos,
            "Se identifica que el denominador se anula en x = a.",
        )

    _agregar_paso(
        pasos,
        f"Limite por izquierda: {limites_laterales['izquierda']['valor']}.",
    )
    _agregar_paso(
        pasos,
        f"Limite por derecha: {limites_laterales['derecha']['valor']}.",
    )
    _agregar_paso(pasos, continuidad["continuidad"]["conclusion"])
    _agregar_paso(
        pasos,
        f"Tipo de discontinuidad: {continuidad['discontinuidad']['tipo']}.",
    )

    return pasos


def _agregar_paso(pasos, descripcion):
    pasos.append(f"{len(pasos) + 1}. {descripcion}")


def _generar_justificacion(datos_funcion, limites_laterales):
    a = datos_funcion["a"]
    funcion = datos_funcion["funcion"]
    digitos = datos_funcion["digitos"]

    if datos_funcion["tipo_caso"] == "discontinuidad_removible":
        return (
            f"La expresion tiene el factor comun (x - {a}) en numerador y denominador. "
            f"Al simplificarla se obtiene {funcion['expresion_simplificada']}, "
            "pero la funcion original no esta definida en el punto de analisis."
        )

    if datos_funcion["tipo_caso"] == "discontinuidad_salto":
        detalle = ""
        if funcion.get("ajuste_salto"):
            detalle = (
                " Como d2 y d4 coinciden, se ajusta el tramo derecho con d4 + 1 "
                "para mantener una discontinuidad de salto."
            )
        return (
            "Los limites laterales son distintos: "
            f"{limites_laterales['izquierda']['valor']} por izquierda y "
            f"{limites_laterales['derecha']['valor']} por derecha.{detalle}"
        )

    numerador = digitos["d5"] + 1
    return (
        f"El numerador es {numerador} y el denominador x - {a} tiende a cero. "
        "Por eso la funcion diverge y aparece una asintota vertical."
    )
