def clasificar_conica(A, B):
    """
    Clasifica la cónica analizando los coeficientes A y B de los términos al cuadrado.
    """
    if A == 0 and B == 0:
        return "Degenerada (Línea o punto, los ajustes de la rúbrica deberían evitar esto)"
        
    if A == 0 or B == 0:
        return "Parábola"
        
    if A == B:
        return "Circunferencia"
        
    if (A > 0 and B > 0) or (A < 0 and B < 0):
        return "Elipse"
        
    if (A > 0 and B < 0) or (A < 0 and B > 0):
        return "Hipérbola"
        
    return "Desconocida"