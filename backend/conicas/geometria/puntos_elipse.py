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
