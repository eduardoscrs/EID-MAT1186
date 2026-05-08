def completar_cuadrado(coef_cuad, coef_lineal, variable):
    """
    Completa el cuadrado para una variable dada.
    Forma inicial: Ax^2 + Cx
    Forma final: A(x - h)^2 + K_fuera
    """
    pasos = []
    if coef_cuad == 0:
        return 0, 0, coef_lineal, pasos # No hay término cuadrático
        
    pasos.append(f"Agrupando términos de {variable}: {coef_cuad}{variable}^2 + {coef_lineal}{variable}")
    
    # Factorizar el coeficiente cuadrático
    factor = coef_lineal / coef_cuad
    pasos.append(f"Factorizando {coef_cuad}: {coef_cuad}({variable}^2 + {factor}{variable})")
    
    # Encontrar el valor a sumar y restar (mitad del término lineal al cuadrado)
    mitad = factor / 2
    cuadrado_mitad = mitad ** 2
    
    pasos.append(f"Sumando y restando ({factor}/2)^2 = {cuadrado_mitad} dentro del paréntesis")
    pasos.append(f"{coef_cuad}({variable}^2 + {factor}{variable} + {cuadrado_mitad} - {cuadrado_mitad})")
    
    # Extraer la parte negativa multiplicada por el coeficiente cuadrático
    k_fuera = - (cuadrado_mitad * coef_cuad)
    h = -mitad # Para que la forma sea (x - h)
    
    signo_h = "+" if mitad >= 0 else "-"
    pasos.append(f"Trinomio cuadrado perfecto: {coef_cuad}({variable} {signo_h} {abs(mitad)})^2 {k_fuera}")
    
    return coef_cuad, h, k_fuera, pasos