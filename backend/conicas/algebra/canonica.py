from conicas.algebra.completar_cuadrado import completar_cuadrado
from conicas.utils.formato import formatear_binomio, formatear_numero

def transformar_a_canonica(A, B, C, D, E):
    """
    Transforma Ax^2 + By^2 + Cx + Dy + E = 0 a su forma canónica.
    (Ejemplo base enfocado en Cónicas con centro h, k como Elipses, Hipérbolas y Circunferencias).
    """
    pasos_totales = ["--- Transformación a Forma Canónica ---"]
    
    # Completar cuadrado para X
    a_x, h_x, k_x, pasos_x = completar_cuadrado(A, C, 'x')
    pasos_totales.extend(pasos_x)
    
    # Completar cuadrado para Y
    a_y, h_y, k_y, pasos_y = completar_cuadrado(B, D, 'y')
    pasos_totales.extend(pasos_y)
    
    # Término independiente final
    constante_derecha = -E - k_x - k_y
    pasos_totales.append(f"Pasando las constantes a la derecha: -E - K_x - K_y = {-E} - ({k_x}) - ({k_y}) = {constante_derecha}")
    
    # Para elipse, hipérbola y circunferencia, dividimos todo por constante_derecha (si es distinto de 0)
    if constante_derecha != 0 and a_x != 0 and a_y != 0:
        denom_x = constante_derecha / a_x
        denom_y = constante_derecha / a_y
        pasos_totales.append(f"Dividiendo todo por {constante_derecha}:")
        pasos_totales.append(
            _formatear_paso_canonico(h_x, h_y, denom_x, denom_y)
        )
    
    return h_x, h_y, constante_derecha, pasos_totales


def _formatear_paso_canonico(h_x, h_y, denom_x, denom_y):
    termino_x = (
        f"{formatear_binomio('x', h_x)}^2 / "
        f"{formatear_numero(abs(denom_x))}"
    )
    termino_y = (
        f"{formatear_binomio('y', h_y)}^2 / "
        f"{formatear_numero(abs(denom_y))}"
    )

    if denom_x > 0 and denom_y > 0:
        return f"{termino_x} + {termino_y} = 1"
    if denom_x > 0 and denom_y < 0:
        return f"{termino_x} - {termino_y} = 1"
    if denom_x < 0 and denom_y > 0:
        return f"{termino_y} - {termino_x} = 1"

    return (
        "Ambos denominadores quedan negativos; no hay forma canonica real "
        "estandar igualada a 1."
    )
