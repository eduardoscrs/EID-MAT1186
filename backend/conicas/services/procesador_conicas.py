from common.formato import formatear_ecuacion_general, formatear_forma_canonica
from common.rut import validar_cuerpo_dv_para_procesar
from conicas.algebra.canonica import transformar_a_canonica
from conicas.algebra.procedimiento_inverso import generar_procedimiento_inverso
from conicas.core.clasificacion import clasificar_conica
from conicas.core.ecuacion import construir_ecuacion_general
from conicas.services.analisis_conicas import (
    agregar_analisis_central,
    agregar_analisis_parabola,
)


def procesar_conica(cuerpo, dv):
    cuerpo_normalizado, dv_normalizado, _ = validar_cuerpo_dv_para_procesar(cuerpo, dv)
    dv = dv_normalizado
    A, B, C, D, E, pasos_eq = construir_ecuacion_general(cuerpo_normalizado, dv)
    tipo_conica = clasificar_conica(A, B)

    resultado = _resultado_base(A, B, C, D, E, tipo_conica, pasos_eq)

    if tipo_conica != "Parábola":
        datos_canonicos = transformar_a_canonica(A, B, C, D, E)
        agregar_analisis_central(resultado, A, B, C, D, E, datos_canonicos)
    else:
        agregar_analisis_parabola(resultado, A, B, C, D, E)

    resultado["forma_canonica"] = formatear_forma_canonica(resultado)
    resultado["pasos_inverso"] = generar_procedimiento_inverso(
        A, B, C, D, E, resultado
    )
    return resultado

def _resultado_base(A, B, C, D, E, tipo_conica, pasos_eq):
    return {
        "ecuacion": formatear_ecuacion_general(A, B, C, D, E),
        "A": A,
        "B": B,
        "C": C,
        "D": D,
        "E": E,
        "tipo_conica": tipo_conica,
        "pasos_ecuacion": pasos_eq,
    }
