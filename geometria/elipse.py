def analizar_elipse(h_x, h_y, constante_derecha, A, B):
    """Calcula centro, vértices y focos de la elipse."""
    a_cuadrado = constante_derecha / A
    b_cuadrado = constante_derecha / B
    
    # Raíces sin usar math
    val_a = a_cuadrado ** 0.5 if a_cuadrado > 0 else 0
    val_b = b_cuadrado ** 0.5 if b_cuadrado > 0 else 0
    
    # Focos: c^2 = |a^2 - b^2|
    c_cuadrado = abs(a_cuadrado - b_cuadrado)
    c = c_cuadrado ** 0.5
    
    centro = (h_x, h_y)
    
    if a_cuadrado > b_cuadrado:
        # Eje mayor horizontal
        focos = [(h_x - c, h_y), (h_x + c, h_y)]
        vertices = [(h_x - val_a, h_y), (h_x + val_a, h_y)]
    else:
        # Eje mayor vertical
        focos = [(h_x, h_y - c), (h_x, h_y + c)]
        vertices = [(h_x, h_y - val_b), (h_x, h_y + val_b)]
        
    return centro, vertices, focos, val_a, val_b