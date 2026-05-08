def analizar_hiperbola(h_x, h_y, constante_derecha, A, B):
    """Calcula centro, vértices y focos de la hipérbola."""
    a_cuadrado = constante_derecha / A
    b_cuadrado = constante_derecha / B
    
    # c^2 = a^2 + b^2 (usamos abs() por los signos opuestos)
    c_cuadrado = abs(a_cuadrado) + abs(b_cuadrado)
    c = c_cuadrado ** 0.5
    
    val_a = abs(a_cuadrado) ** 0.5
    val_b = abs(b_cuadrado) ** 0.5
    
    centro = (h_x, h_y)
    
    # Si A y la constante tienen el mismo signo, abre en el eje X
    if (A * constante_derecha) > 0:
        focos = [(h_x - c, h_y), (h_x + c, h_y)]
        vertices = [(h_x - val_a, h_y), (h_x + val_a, h_y)]
    else:
        # Abre en el eje Y
        focos = [(h_x, h_y - c), (h_x, h_y + c)]
        vertices = [(h_x, h_y - val_b), (h_x, h_y + val_b)]
        
    return centro, vertices, focos, val_a, val_b