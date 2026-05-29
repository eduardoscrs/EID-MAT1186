class RutValidationError(ValueError):
    """Error esperado cuando el RUT no cumple el formato requerido."""


def limpiar_rut(rut_ingresado):
    """Limpia puntos, guiones y espacios del RUT."""
    if rut_ingresado is None:
        return ""
    return str(rut_ingresado).strip().replace(".", "").replace("-", "").replace(" ", "").upper()


def validar_estructura_rut(rut_limpio):
    if not rut_limpio:
        raise RutValidationError("Ingresa un RUT antes de validar.")

    cuerpo = rut_limpio[:-1]
    dv_ingresado = rut_limpio[-1:]

    if not cuerpo or not dv_ingresado:
        raise RutValidationError("El RUT debe incluir cuerpo y digito verificador.")

    if not cuerpo.isdigit() or not _dv_es_valido(dv_ingresado):
        raise RutValidationError("El RUT contiene caracteres invalidos.")

    if len(cuerpo) not in (7, 8):
        raise RutValidationError("El cuerpo del RUT debe tener 7 u 8 digitos.")

    numero_cuerpo = int(cuerpo)
    if numero_cuerpo == 0:
        raise RutValidationError("El cuerpo del RUT no puede ser cero.")

    if numero_cuerpo >= 50_000_000:
        raise RutValidationError("Ingresa un RUT de persona natural, no de empresa.")

    return cuerpo, dv_ingresado


def validar_cuerpo_dv_para_procesar(cuerpo, dv):
    cuerpo_normalizado = _normalizar_cuerpo(cuerpo)
    dv_normalizado = "" if dv is None else str(dv).strip().upper()
    rut_limpio = limpiar_rut(f"{cuerpo_normalizado}{dv_normalizado}")
    es_valido, pasos, cuerpo_validado, dv_validado = validar_rut_paso_a_paso(rut_limpio)

    if not es_valido:
        raise RutValidationError("No se puede procesar el RUT porque no supera la validacion previa.")

    return cuerpo_validado, dv_validado, pasos


def validar_rut_paso_a_paso(rut_limpio):
    """Valida el RUT usando el Modulo 11 y retorna el paso a paso."""
    cuerpo, dv_ingresado = validar_estructura_rut(rut_limpio)

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


def _normalizar_cuerpo(cuerpo):
    if isinstance(cuerpo, list):
        return "".join([str(x) for x in cuerpo])
    if cuerpo is None:
        return ""
    return str(cuerpo).strip()


def _dv_es_valido(dv):
    return len(dv) == 1 and (dv.isdigit() or dv == "K")
