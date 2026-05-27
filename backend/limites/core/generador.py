from common.rut import limpiar_rut, validar_rut_paso_a_paso
from limites.core.casos import construir_estructura, seleccionar_caso
from limites.services.analisis import agregar_pasos_conclusion, analizar_continuidad, generar_justificacion
from limites.services.muestras import calcular_limites_numericos, generar_evidencia, generar_muestras
from limites.utils.formatos import formatear_funcion_por_tramos


def generar_funcion_limite(rut_ingresado):
    rut_limpio, pasos_rut, cuerpo, dv = _validar_rut(rut_ingresado)
    digitos = [int(x) for x in cuerpo.zfill(8)]
    d1, d2, d3, d4, d5, d6, d7, d8 = digitos
    a = d3

    residuo, caso, paso_caso = seleccionar_caso(d8)
    pasos = _pasos_iniciales(pasos_rut, digitos, a, d8, residuo, paso_caso)

    estructura = construir_estructura(caso, a, digitos)
    analisis = analizar_continuidad(estructura)
    agregar_pasos_conclusion(pasos, a, estructura)

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
        "funcion_por_tramos": formatear_funcion_por_tramos(estructura["tramos"]),
        "tramos": estructura["tramos"],
        "extension_sugerida": estructura["extension_sugerida"],
        "limites": analisis["limites"],
        "continuidad": analisis["continuidad"],
        "puntos_criticos": estructura["puntos_criticos"],
        "pasos": pasos,
        "samples": generar_muestras(a, digitos, estructura),
        "evidence": generar_evidencia(a, digitos, estructura),
        "numeric_limits": calcular_limites_numericos(a, digitos, estructura),
        "justificacion": generar_justificacion(a, digitos, estructura),
    }


def _validar_rut(rut_ingresado):
    rut_limpio = limpiar_rut(rut_ingresado)
    es_valido, pasos_rut, cuerpo, dv = validar_rut_paso_a_paso(rut_limpio)
    if not es_valido:
        raise ValueError("RUT invalido")
    return rut_limpio, pasos_rut, cuerpo, dv


def _pasos_iniciales(pasos_rut, digitos, a, d8, residuo, paso_caso):
    pasos = list(pasos_rut)
    pasos.append(f"Digitos extraidos: {digitos}")
    pasos.append(f"Se define el punto de analisis a = d3 = {a}")
    pasos.append(f"Regla de seleccion: d8 = {d8} y d8 % 3 = {residuo}")
    pasos.append(paso_caso)
    return pasos
