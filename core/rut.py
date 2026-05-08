def limpiar_rut(rut_ingresado):
    """Limpia puntos y guiones del RUT."""
    return rut_ingresado.replace(".", "").replace("-", "").upper()

def validar_rut_paso_a_paso(rut_limpio):
    """
    Valida el RUT usando el Módulo 11 y retorna el paso a paso.
    """
    cuerpo = rut_limpio[:-1]
    dv_ingresado = rut_limpio[-1]
    
    pasos = []
    pasos.append(f"1. RUT a validar (sin DV): {cuerpo}")
    
    suma = 0
    multiplicador = 2
    pasos.append("2. Multiplicando dígitos de derecha a izquierda por la serie 2,3,4,5,6,7:")
    
    for i in reversed(range(len(cuerpo))):
        digito = int(cuerpo[i])
        producto = digito * multiplicador
        suma += producto
        pasos.append(f"   Dígito {digito} * {multiplicador} = {producto} (Suma parcial: {suma})")
        
        multiplicador += 1
        if multiplicador == 8:
            multiplicador = 2
            
    pasos.append(f"3. Suma total obtenida = {suma}")
    
    resto = suma % 11
    pasos.append(f"4. Calculando resto: {suma} % 11 = {resto}")
    
    resultado_resta = 11 - resto
    pasos.append(f"5. Calculando 11 - resto: 11 - {resto} = {resultado_resta}")
    
    if resultado_resta == 11:
        dv_calculado = '0'
    elif resultado_resta == 10:
        dv_calculado = 'K'
    else:
        dv_calculado = str(resultado_resta)
        
    pasos.append(f"6. Dígito verificador esperado = {dv_calculado}")
    
    es_valido = (dv_calculado == dv_ingresado)
    pasos.append(f"7. ¿Coincide el DV ingresado ({dv_ingresado}) con el calculado? {'Sí' if es_valido else 'No'}")
    
    return es_valido, pasos, cuerpo, dv_ingresado