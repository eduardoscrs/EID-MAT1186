
def calcular_variable_v(dv):
    """Calcula la variable auxiliar v basada en el DV."""
    if dv == 'K':
        return 10
    elif dv == '0':
        return 11
    else:
        return int(dv)

def construir_ecuacion_general(cuerpo_rut, dv):
    """
    Construye la ecuación general de segundo grado y documenta los pasos.
    """
    pasos = []
    # Asegurar que el cuerpo tenga 8 dígitos (rellenar con ceros a la izq si es necesario)
    d = [int(x) for x in cuerpo_rut.zfill(8)]
    
    v = calcular_variable_v(dv)
    pasos.append(f"Variable auxiliar v = {v}")
    
    # Coeficientes iniciales
    A = (d[0] + d[1]) / v
    B = (d[2] + d[3]) / v
    C = -(d[4] + d[5])
    D = -(d[6] + d[7])
    E = d[0] + d[2] + d[4] + d[6]
    
    pasos.append(f"Coeficientes iniciales calculados:")
    pasos.append(f"A = (d1+d2)/v = ({d[0]}+{d[1]})/{v} = {A}")
    pasos.append(f"B = (d3+d4)/v = ({d[2]}+{d[3]})/{v} = {B}")
    pasos.append(f"C = -(d5+d6) = -({d[4]}+{d[5]}) = {C}")
    pasos.append(f"D = -(d7+d8) = -({d[6]}+{d[7]}) = {D}")
    pasos.append(f"E = d1+d3+d5+d7 = {d[0]}+{d[2]}+{d[4]}+{d[6]} = {E}")
    
    # Ajustes según rúbrica
    pasos.append("\nAplicando ajustes de la rúbrica:")
    
    # Ajuste 1: Hipérbola
    if d[7] % 2 != 0:
        B = -B
        pasos.append(f"- d8 ({d[7]}) es impar -> B cambia de signo: B = {B}")
        
    # Ajuste 2: Circunferencia
    if d[0] == d[1]:
        B = A
        pasos.append(f"- d1 ({d[0]}) es igual a d2 ({d[1]}) -> B se iguala a A: B = {B}")
        
    # Ajuste 3: Parábola
    suma_d5_d6 = d[4] + d[5]
    if suma_d5_d6 % 3 == 0:
        if d[6] % 2 == 0:
            B = 0
            pasos.append(f"- d5+d6 ({suma_d5_d6}) es múltiplo de 3 y d7 ({d[6]}) es par -> Parábola vertical: B = 0")
        else:
            A = 0
            pasos.append(f"- d5+d6 ({suma_d5_d6}) es múltiplo de 3 y d7 ({d[6]}) es impar -> Parábola horizontal: A = 0")

    return A, B, C, D, E, pasos