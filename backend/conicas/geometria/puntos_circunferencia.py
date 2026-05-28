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

    for indice in range(puntos + 1):
        x_actual = h - r + paso * indice
        if indice == puntos:
            x_actual = h + r

        x_vals.append(x_actual)
        interior_raiz = (r**2) - ((x_actual - h) ** 2)

        if interior_raiz < 0:
            interior_raiz = 0

        raiz = interior_raiz**0.5
        y_vals_pos.append(k + raiz)
        y_vals_neg.append(k - raiz)

    return x_vals, y_vals_pos, y_vals_neg
