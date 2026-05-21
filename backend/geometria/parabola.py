from algebra.completar_cuadrado import completar_cuadrado

def analizar_parabola(A, B, C, D, E):
    """Calcula vértice, foco y directriz de una parábola."""
    if A == 0:
        # Parábola Horizontal (y al cuadrado)
        coef_y, h_y, k_fuera, pasos = completar_cuadrado(B, D, 'y')
        # B(y - h_y)^2 = -Cx - E - k_fuera
        p = -C / (4 * B) if B != 0 else 0
        h_x = (-E - k_fuera) / (-C) if C != 0 else 0
        
        vertice = (h_x, h_y)
        foco = (h_x + p, h_y)
        directriz = h_x - p
        orientacion = "Horizontal"
        
    else:
        # Parábola Vertical (x al cuadrado)
        coef_x, h_x, k_fuera, pasos = completar_cuadrado(A, C, 'x')
        p = -D / (4 * A) if A != 0 else 0
        h_y = (-E - k_fuera) / (-D) if D != 0 else 0
        
        vertice = (h_x, h_y)
        foco = (h_x, h_y + p)
        directriz = h_y - p
        orientacion = "Vertical"
        
    return vertice, foco, directriz, p, orientacion, pasos