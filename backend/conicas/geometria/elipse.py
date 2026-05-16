def analizar_elipse(h_x, h_y, constante_derecha, A, B):
    """Calcula los componentes geometricos de la elipse."""
    radio_x_cuadrado = constante_derecha / A
    radio_y_cuadrado = constante_derecha / B

    radio_x = radio_x_cuadrado**0.5 if radio_x_cuadrado > 0 else 0
    radio_y = radio_y_cuadrado**0.5 if radio_y_cuadrado > 0 else 0
    c = abs(radio_x_cuadrado - radio_y_cuadrado) ** 0.5
    centro = (h_x, h_y)

    if radio_x >= radio_y:
        orientacion = "Horizontal"
        a = radio_x
        b = radio_y
        focos = [(h_x - c, h_y), (h_x + c, h_y)]
        vertices = [(h_x - a, h_y), (h_x + a, h_y)]
        covertices = [(h_x, h_y - b), (h_x, h_y + b)]
    else:
        orientacion = "Vertical"
        a = radio_y
        b = radio_x
        focos = [(h_x, h_y - c), (h_x, h_y + c)]
        vertices = [(h_x, h_y - a), (h_x, h_y + a)]
        covertices = [(h_x - b, h_y), (h_x + b, h_y)]

    return centro, vertices, covertices, focos, a, b, c, radio_x, radio_y, orientacion
