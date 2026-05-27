def generar_puntos_parabola(h, k, p, orientacion, puntos=1000):
    x_vals, y_pos, y_neg = [], [], []

    if p == 0 or puntos <= 0:
        return [h], [k], None

    if orientacion == "Vertical":
        return _generar_vertical(h, k, p, puntos)

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


def _generar_vertical(h, k, p, puntos):
    x_vals, y_pos = [], []
    ancho = 4 * abs(p)
    paso = (2 * ancho) / puntos
    x_actual = h - ancho

    while x_actual <= h + ancho:
        x_vals.append(x_actual)
        y_pos.append(k + ((x_actual - h) ** 2) / (4 * p))
        x_actual += paso

    return x_vals, y_pos, None
