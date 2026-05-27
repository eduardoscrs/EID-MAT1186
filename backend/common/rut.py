def limpiar_rut(rut_ingresado):
    """Limpia puntos y guiones del RUT."""
    if rut_ingresado is None:
        return ""
    return str(rut_ingresado).strip().replace(".", "").replace("-", "").upper()


def validar_rut_paso_a_paso(rut_limpio):
    """Valida el RUT usando el Modulo 11 y retorna el paso a paso."""
    if len(rut_limpio) < 2:
        raise ValueError("Ingrese el cuerpo del RUT y su digito verificador.")

    cuerpo = rut_limpio[:-1]
    dv_ingresado = rut_limpio[-1]

    if not cuerpo.isdigit():
        raise ValueError("El cuerpo del RUT debe contener solo digitos.")
    if len(cuerpo) > 8:
        raise ValueError("El cuerpo del RUT no puede tener mas de 8 digitos.")
    if dv_ingresado not in "0123456789K":
        raise ValueError("El digito verificador debe ser un numero o K.")

    pasos = []
    pasos.append(f"1. RUT a validar (sin DV): {cuerpo}")

    suma = 0
    multiplicador = 2
    pasos.append("2. Multiplicando digitos de derecha a izquierda por la serie 2,3,4,5,6,7:")

    for i in reversed(range(len(cuerpo))):
        digito = int(cuerpo[i])
        producto = digito * multiplicador
        suma += producto
        pasos.append(f"   Digito {digito} * {multiplicador} = {producto} (Suma parcial: {suma})")

        multiplicador += 1
        if multiplicador == 8:
            multiplicador = 2

    pasos.append(f"3. Suma total obtenida = {suma}")

    resto = suma % 11
    pasos.append(f"4. Calculando resto: {suma} % 11 = {resto}")

    resultado_resta = 11 - resto
    pasos.append(f"5. Calculando 11 - resto: 11 - {resto} = {resultado_resta}")

    if resultado_resta == 11:
        dv_calculado = "0"
    elif resultado_resta == 10:
        dv_calculado = "K"
    else:
        dv_calculado = str(resultado_resta)

    pasos.append(f"6. Digito verificador esperado = {dv_calculado}")

    es_valido = dv_calculado == dv_ingresado
    coincide = "Si" if es_valido else "No"
    pasos.append(f"7. Coincide el DV ingresado ({dv_ingresado}) con el calculado? {coincide}")

    return es_valido, pasos, cuerpo, dv_ingresado
