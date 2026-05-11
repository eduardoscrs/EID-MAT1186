def generar_puntos_circunferencia(h, k, r, puntos=1000):
    """
    Genera coordenadas para una circunferencia sin dibujarla.
    Despeje: y = k +/- raiz(r^2 - (x - h)^2).
    """
    x_vals = []
    y_vals_pos = []
    y_vals_neg = []

    if r <= 0 or puntos <= 0:
        return [h], [k], [k]

    paso = (2 * r) / puntos
    x_actual = h - r

    while x_actual <= h + r:
        x_vals.append(x_actual)
        interior_raiz = (r**2) - ((x_actual - h) ** 2)

        if interior_raiz < 0:
            interior_raiz = 0

        raiz = interior_raiz**0.5
        y_vals_pos.append(k + raiz)
        y_vals_neg.append(k - raiz)
        x_actual += paso

    return x_vals, y_vals_pos, y_vals_neg


def generar_puntos_elipse(h, k, rx, ry, puntos=1000):
    x_vals, y_pos, y_neg = [], [], []

    if rx <= 0 or ry <= 0 or puntos <= 0:
        return [h], [k], [k]

    paso = (2 * rx) / puntos
    x_actual = h - rx

    while x_actual <= h + rx:
        x_vals.append(x_actual)
        interior = 1 - ((x_actual - h) ** 2) / (rx**2)

        if interior < 0:
            interior = 0

        raiz = (ry**2 * interior) ** 0.5
        y_pos.append(k + raiz)
        y_neg.append(k - raiz)
        x_actual += paso

    return x_vals, y_pos, y_neg


def generar_puntos_parabola(h, k, p, orientacion, puntos=1000):
    x_vals, y_pos, y_neg = [], [], []

    if p == 0 or puntos <= 0:
        return [h], [k], None

    if orientacion == "Vertical":
        ancho = 4 * abs(p)
        paso = (2 * ancho) / puntos
        x_actual = h - ancho

        while x_actual <= h + ancho:
            x_vals.append(x_actual)
            y = k + ((x_actual - h) ** 2) / (4 * p)
            y_pos.append(y)
            x_actual += paso

        return x_vals, y_pos, None

    largo = 4 * abs(p)
    paso = largo / puntos if p > 0 else -largo / puntos
    x_actual = h

    for _ in range(puntos + 1):
        x_vals.append(x_actual)
        interior = 4 * p * (x_actual - h)

        if interior < 0:
            interior = 0

        raiz = interior**0.5
        y_pos.append(k + raiz)
        y_neg.append(k - raiz)
        x_actual += paso

    return x_vals, y_pos, y_neg


def generar_puntos_hiperbola(h, k, a, b, orientacion, puntos=500):
    x_izq, y_pos_izq, y_neg_izq = [], [], []
    x_der, y_pos_der, y_neg_der = [], [], []

    if a <= 0 or b <= 0 or puntos <= 0:
        return None, ([h], [k], [k])

    if orientacion == "Horizontal":
        largo = 3 * a
        paso = largo / puntos

        x_actual = h + a
        while x_actual <= h + a + largo:
            x_der.append(x_actual)
            interior = ((x_actual - h) ** 2) / (a**2) - 1

            if interior < 0:
                interior = 0

            raiz = b * (interior**0.5)
            y_pos_der.append(k + raiz)
            y_neg_der.append(k - raiz)
            x_actual += paso

        x_actual = h - a - largo
        while x_actual <= h - a:
            x_izq.append(x_actual)
            interior = ((x_actual - h) ** 2) / (a**2) - 1

            if interior < 0:
                interior = 0

            raiz = b * (interior**0.5)
            y_pos_izq.append(k + raiz)
            y_neg_izq.append(k - raiz)
            x_actual += paso

        return (x_izq, y_pos_izq, y_neg_izq), (x_der, y_pos_der, y_neg_der)

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
