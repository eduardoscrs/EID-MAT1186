def analizar_circunferencia(h_x, h_y, constante_derecha, A):
    """
    Calcula centro y radio.
    Ecuación: A(x - h_x)^2 + A(y - h_y)^2 = constante_derecha
    """
    centro = (h_x, h_y)
    # Radio al cuadrado = constante_derecha / A
    r_cuadrado = constante_derecha / A
    radio = r_cuadrado ** 0.5 if r_cuadrado > 0 else 0
    
    return centro, radio