def generar_puntos_hiperbola(h, k, a, b, orientacion, puntos=500):
    x_izq, y_pos_izq, y_neg_izq = [], [], []
    x_der, y_pos_der, y_neg_der = [], [], []

    if a <= 0 or b <= 0 or puntos <= 0:
        return None, ([h], [k], [k])

    if orientacion == "Horizontal":
        return _generar_horizontal(h, k, a, b, puntos)

    largo = 3 * b
    paso = (2 * largo) / puntos
    x_actual = h - largo

    while x_actual <= h + largo:
        x_der.append(x_actual)
        interior = 1 + ((x_actual - h) ** 2) / (b**2)
        raiz = a * (interior**0.5)
        y_pos_der.append(k + raiz)
        y_neg_der.append(k - raiz)
        x_actual += paso

    return None, (x_der, y_pos_der, y_neg_der)


def _generar_horizontal(h, k, a, b, puntos):
    x_izq, y_pos_izq, y_neg_izq = [], [], []
    x_der, y_pos_der, y_neg_der = [], [], []

    _agregar_rama_horizontal(
        x_der, y_pos_der, y_neg_der, h + a, h + 4 * a, h, k, a, b, puntos
    )
    _agregar_rama_horizontal(
        x_izq, y_pos_izq, y_neg_izq, h - 4 * a, h - a, h, k, a, b, puntos
    )

    return (x_izq, y_pos_izq, y_neg_izq), (x_der, y_pos_der, y_neg_der)


def _agregar_rama_horizontal(x_vals, y_pos, y_neg, inicio, fin, h, k, a, b, puntos):
    paso = (fin - inicio) / puntos
    x_actual = inicio

    while x_actual <= fin:
        x_vals.append(x_actual)
        interior = ((x_actual - h) ** 2) / (a**2) - 1

        if interior < 0:
            interior = 0

        raiz = b * (interior**0.5)
        y_pos.append(k + raiz)
        y_neg.append(k - raiz)
        x_actual += paso
