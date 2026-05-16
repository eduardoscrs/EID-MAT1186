def analizar_hiperbola(h_x, h_y, constante_derecha, A, B):
    """Calcula los componentes geometricos de la hiperbola."""
    denom_x = constante_derecha / A
    denom_y = constante_derecha / B
    radio_x = abs(denom_x) ** 0.5
    radio_y = abs(denom_y) ** 0.5
    centro = (h_x, h_y)

    if (A * constante_derecha) > 0:
        orientacion = "Horizontal"
        a = radio_x
        b = radio_y
        focos = [(h_x - _calcular_c(a, b), h_y), (h_x + _calcular_c(a, b), h_y)]
        vertices = [(h_x - a, h_y), (h_x + a, h_y)]
        extremos_conjugados = [(h_x, h_y - b), (h_x, h_y + b)]
    else:
        orientacion = "Vertical"
        a = radio_y
        b = radio_x
        focos = [(h_x, h_y - _calcular_c(a, b)), (h_x, h_y + _calcular_c(a, b))]
        vertices = [(h_x, h_y - a), (h_x, h_y + a)]
        extremos_conjugados = [(h_x - b, h_y), (h_x + b, h_y)]

    c = _calcular_c(a, b)
    return centro, vertices, extremos_conjugados, focos, a, b, c, orientacion


def _calcular_c(a, b):
    return (a**2 + b**2) ** 0.5
