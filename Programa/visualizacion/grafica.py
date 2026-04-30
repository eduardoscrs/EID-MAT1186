import matplotlib.pyplot as plt

def generar_puntos_circunferencia(h, k, r, puntos=1000):
    """
    Genera listas de coordenadas X e Y sin usar math ni numpy.
    Despeje: y = k +/- raiz(r^2 - (x - h)^2)
    """
    x_vals = []
    y_vals_pos = []
    y_vals_neg = []
    
    # Generar 'puntos' cantidad de pasos entre h-r y h+r
    paso = (2 * r) / puntos
    x_actual = h - r
    
    while x_actual <= h + r:
        x_vals.append(x_actual)
        
        # Lo que está dentro de la raíz cuadrada
        interior_raiz = (r ** 2) - ((x_actual - h) ** 2)
        
        # Corrección por errores de precisión de punto flotante (< 0 muy pequeño)
        if interior_raiz < 0:
            interior_raiz = 0
            
        raiz = interior_raiz ** 0.5
        y_vals_pos.append(k + raiz)
        y_vals_neg.append(k - raiz)
        
        x_actual += paso
        
    return x_vals, y_vals_pos, y_vals_neg

def graficar_circunferencia(h, k, r):
    x, y_pos, y_neg = generar_puntos_circunferencia(h, k, r)
    
    plt.figure(figsize=(6, 6))
    
    # Trazar la cónica
    plt.plot(x, y_pos, color='blue', label='Circunferencia')
    plt.plot(x, y_neg, color='blue')
    
    # Trazar el centro
    plt.plot(h, k, marker='o', color='red', label=f'Centro ({h}, {k})')
    
    # Configuraciones de ejes
    plt.axhline(0, color='black', linewidth=1)
    plt.axvline(0, color='black', linewidth=1)
    plt.grid(color='gray', linestyle='--', linewidth=0.5)
    plt.gca().set_aspect('equal', adjustable='box') # Proporción exacta
    
    plt.title("Gráfica de la Sección Cónica")
    plt.legend()
    plt.show()


def generar_puntos_elipse(h, k, rx, ry, puntos=1000):
    x_vals, y_pos, y_neg = [], [], []
    paso = (2 * rx) / puntos
    x_actual = h - rx
    
    while x_actual <= h + rx:
        x_vals.append(x_actual)
        interior = 1 - ((x_actual - h) ** 2) / (rx ** 2)
        if interior < 0: interior = 0
        raiz = (ry ** 2 * interior) ** 0.5
        
        y_pos.append(k + raiz)
        y_neg.append(k - raiz)
        x_actual += paso
        
    return x_vals, y_pos, y_neg

def graficar_elipse(h, k, rx, ry, focos, vertices):
    x, y_pos, y_neg = generar_puntos_elipse(h, k, rx, ry)
    
    plt.figure(figsize=(7, 7))
    plt.plot(x, y_pos, color='blue', label='Elipse')
    plt.plot(x, y_neg, color='blue')
    
    # Puntos clave
    plt.plot(h, k, marker='o', color='red', label=f'Centro ({h}, {k})')
    for f in focos:
        plt.plot(f[0], f[1], marker='x', color='green', label=f'Foco ({f[0]:.2f}, {f[1]:.2f})')
    for v in vertices:
        plt.plot(v[0], v[1], marker='^', color='orange', label=f'Vértice ({v[0]:.2f}, {v[1]:.2f})')
        
    plt.axhline(0, color='black', linewidth=1)
    plt.axvline(0, color='black', linewidth=1)
    plt.grid(color='gray', linestyle='--', linewidth=0.5)
    plt.gca().set_aspect('equal', adjustable='box')
    
    # Filtramos leyendas duplicadas
    handles, labels = plt.gca().get_legend_handles_labels()
    by_label = dict(zip(labels, handles))
    plt.legend(by_label.values(), by_label.keys())
    
    plt.title("Gráfica de la Elipse")
    plt.show()



def generar_puntos_parabola(h, k, p, orientacion, puntos=1000):
    x_vals, y_pos, y_neg = [], [], []
    
    if orientacion == "Vertical":
        ancho = 4 * abs(p) if p != 0 else 10
        paso = (2 * ancho) / puntos
        x_actual = h - ancho
        
        while x_actual <= h + ancho:
            x_vals.append(x_actual)
            y = k + ((x_actual - h) ** 2) / (4 * p)
            y_pos.append(y)
            x_actual += paso
        return x_vals, y_pos, None
        
    else: # Horizontal
        largo = 4 * abs(p) if p != 0 else 10
        paso = largo / puntos if p > 0 else -largo / puntos
        x_actual = h
        
        for _ in range(puntos + 1):
            x_vals.append(x_actual)
            interior = 4 * p * (x_actual - h)
            if interior < 0: interior = 0
            raiz = interior ** 0.5
            y_pos.append(k + raiz)
            y_neg.append(k - raiz)
            x_actual += paso
            
        return x_vals, y_pos, y_neg

def graficar_parabola(h, k, p, orientacion, foco, directriz):
    x, y_pos, y_neg = generar_puntos_parabola(h, k, p, orientacion)
    
    plt.figure(figsize=(7, 7))
    plt.plot(x, y_pos, color='blue', label='Parábola')
    if y_neg:
        plt.plot(x, y_neg, color='blue')
        
    # Puntos y líneas clave
    plt.plot(h, k, marker='o', color='red', label=f'Vértice ({h}, {k})')
    plt.plot(foco[0], foco[1], marker='x', color='green', label=f'Foco ({foco[0]:.2f}, {foco[1]:.2f})')
    
    if orientacion == "Vertical":
        plt.axhline(directriz, color='purple', linestyle='-.', label=f'Directriz y={directriz:.2f}')
    else:
        plt.axvline(directriz, color='purple', linestyle='-.', label=f'Directriz x={directriz:.2f}')
        
    plt.axhline(0, color='black', linewidth=1)
    plt.axvline(0, color='black', linewidth=1)
    plt.grid(color='gray', linestyle='--', linewidth=0.5)
    plt.gca().set_aspect('equal', adjustable='box')
    plt.legend()
    plt.title(f"Gráfica de la Parábola {orientacion}")
    plt.show()




def generar_puntos_hiperbola(h, k, a, b, orientacion, puntos=500):
    x_izq, y_pos_izq, y_neg_izq = [], [], []
    x_der, y_pos_der, y_neg_der = [], [], []
    
    if orientacion == "Horizontal":
        largo = 3 * a
        paso = largo / puntos
        
        # Rama Derecha
        x_actual = h + a
        while x_actual <= h + a + largo:
            x_der.append(x_actual)
            interior = ((x_actual - h) ** 2) / (a ** 2) - 1
            if interior < 0: interior = 0
            raiz = b * (interior ** 0.5)
            y_pos_der.append(k + raiz)
            y_neg_der.append(k - raiz)
            x_actual += paso
            
        # Rama Izquierda
        x_actual = h - a - largo
        while x_actual <= h - a:
            x_izq.append(x_actual)
            interior = ((x_actual - h) ** 2) / (a ** 2) - 1
            if interior < 0: interior = 0
            raiz = b * (interior ** 0.5)
            y_pos_izq.append(k + raiz)
            y_neg_izq.append(k - raiz)
            x_actual += paso
            
        return (x_izq, y_pos_izq, y_neg_izq), (x_der, y_pos_der, y_neg_der)
        
    else: # Vertical
        largo = 3 * b
        paso = (2 * largo) / puntos
        x_actual = h - largo
        
        while x_actual <= h + largo:
            x_der.append(x_actual) # Usamos las listas "derechas" para guardar toda la x
            interior = 1 + ((x_actual - h) ** 2) / (b ** 2)
            raiz = a * (interior ** 0.5)
            y_pos_der.append(k + raiz) # Rama superior
            y_neg_der.append(k - raiz) # Rama inferior
            x_actual += paso
            
        return None, (x_der, y_pos_der, y_neg_der)

def graficar_hiperbola(h, k, a, b, orientacion, focos, vertices):
    ramas_izq, ramas_der = generar_puntos_hiperbola(h, k, a, b, orientacion)
    
    plt.figure(figsize=(7, 7))
    
    if ramas_izq: # Horizontal
        plt.plot(ramas_izq[0], ramas_izq[1], color='blue', label='Hipérbola')
        plt.plot(ramas_izq[0], ramas_izq[2], color='blue')
        
    if ramas_der:
        plt.plot(ramas_der[0], ramas_der[1], color='blue', label='Hipérbola' if not ramas_izq else "")
        plt.plot(ramas_der[0], ramas_der[2], color='blue')
        
    # Puntos clave
    plt.plot(h, k, marker='o', color='red', label=f'Centro ({h}, {k})')
    for f in focos:
        plt.plot(f[0], f[1], marker='x', color='green', label=f'Foco ({f[0]:.2f}, {f[1]:.2f})')
    for v in vertices:
        plt.plot(v[0], v[1], marker='^', color='orange', label=f'Vértice ({v[0]:.2f}, {v[1]:.2f})')
        
    # Asíntotas
    x_asintota = [h - 3*max(a,b), h + 3*max(a,b)]
    if orientacion == "Horizontal":
        m = b / a
    else:
        m = a / b
    y_asintota_1 = [k + m * (x - h) for x in x_asintota]
    y_asintota_2 = [k - m * (x - h) for x in x_asintota]
    
    plt.plot(x_asintota, y_asintota_1, color='purple', linestyle=':', label='Asíntotas')
    plt.plot(x_asintota, y_asintota_2, color='purple', linestyle=':')
        
    plt.axhline(0, color='black', linewidth=1)
    plt.axvline(0, color='black', linewidth=1)
    plt.grid(color='gray', linestyle='--', linewidth=0.5)
    plt.gca().set_aspect('equal', adjustable='box')
    
    handles, labels = plt.gca().get_legend_handles_labels()
    by_label = dict(zip(labels, handles))
    plt.legend(by_label.values(), by_label.keys())
    
    plt.title(f"Gráfica de la Hipérbola {orientacion}")
    plt.show()