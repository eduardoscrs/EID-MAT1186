from conicas.geometria.circunferencia import analizar_circunferencia
from conicas.geometria.elipse import analizar_elipse
from conicas.geometria.hiperbola import analizar_hiperbola
from conicas.geometria.parabola import analizar_parabola


def agregar_analisis_central(resultado, A, B, C, D, E, datos_canonicos):
    h_x, h_y, const_der, pasos_can = datos_canonicos
    tipo_conica = resultado["tipo_conica"]

    resultado.update(
        {
            "pasos_canonica": pasos_can,
            "h": float(h_x),
            "k": float(h_y),
            "constante_derecha": float(const_der),
        }
    )

    if tipo_conica == "Circunferencia":
        resultado.update(_datos_circunferencia(h_x, h_y, const_der, A))
    elif tipo_conica == "Elipse":
        resultado.update(_datos_elipse(h_x, h_y, const_der, A, B))
    elif tipo_conica == "Hipérbola":
        resultado.update(_datos_hiperbola(h_x, h_y, const_der, A, B))

    return resultado


def agregar_analisis_parabola(resultado, A, B, C, D, E):
    vertice, foco, directriz, p, orientacion, pasos_par = analizar_parabola(
        A, B, C, D, E
    )
    p_val = float(p)

    resultado.update(
        {
            "pasos_canonica": pasos_par,
            "pasos_parabola": pasos_par,
            "vertice": [float(vertice[0]), float(vertice[1])],
            "foco": [float(foco[0]), float(foco[1])],
            "directriz": float(directriz),
            "directriz_recta": _recta_directriz(orientacion, directriz),
            "eje_simetria": _eje_simetria_parabola(vertice, orientacion),
            "p": p_val,
            "lado_recto": float(abs(4 * p_val)),
            "extremos_lado_recto": _extremos_lado_recto(vertice, p_val, orientacion),
            "orientacion": orientacion,
        }
    )
    return resultado


def _datos_circunferencia(h_x, h_y, const_der, A):
    centro, radio, radio_cuadrado = analizar_circunferencia(h_x, h_y, const_der, A)
    radio_val = float(radio)
    radio_cuadrado_val = float(radio_cuadrado)
    centro_val = [float(centro[0]), float(centro[1])]

    datos = {
        "centro": centro_val,
        "radio": radio_val,
        "radio_cuadrado": radio_cuadrado_val,
    }

    if radio_cuadrado_val < 0:
        datos.update(
            {
                "estado_conica": "imaginaria",
                "tiene_grafica_real": False,
                "observacion": "No hay circunferencia real porque r^2 es negativo.",
            }
        )
        return datos

    if radio_cuadrado_val == 0:
        datos.update(
            {
                "estado_conica": "degenerada",
                "tiene_grafica_real": True,
                "observacion": "La circunferencia se reduce a un punto.",
            }
        )
        return datos

    datos.update(
        {
            "estado_conica": "real",
            "tiene_grafica_real": True,
        }
    )
    return datos


def _datos_elipse(h_x, h_y, const_der, A, B):
    centro, vertices, covertices, focos, a, b, c, radio_x, radio_y, orientacion = analizar_elipse(
        h_x, h_y, const_der, A, B
    )
    a_val, b_val, c_val = float(a), float(b), float(c)
    radio_x_val, radio_y_val = float(radio_x), float(radio_y)
    centro_val = [float(centro[0]), float(centro[1])]

    datos = {
        "centro": centro_val,
        "a": a_val,
        "b": b_val,
        "c": c_val,
        "semieje_x": radio_x_val,
        "semieje_y": radio_y_val,
        "orientacion": orientacion,
    }

    if radio_x_val <= 0 or radio_y_val <= 0:
        datos.update(
            {
                "vertices": [],
                "covertices": [],
                "focos": [],
                "eje_mayor": float(2 * a_val),
                "eje_menor": float(2 * b_val),
                "distancia_focal": float(2 * c_val),
                "excentricidad": 0.0,
                "estado_conica": "imaginaria" if radio_x_val == 0 and radio_y_val == 0 else "degenerada",
                "tiene_grafica_real": False,
                "observacion": "La elipse no tiene region real porque algun semieje no es positivo.",
            }
        )
        return datos

    datos.update({
        "vertices": [[float(v[0]), float(v[1])] for v in vertices],
        "covertices": [[float(v[0]), float(v[1])] for v in covertices],
        "focos": [[float(f[0]), float(f[1])] for f in focos],
        "eje_mayor": float(2 * a_val),
        "eje_menor": float(2 * b_val),
        "distancia_focal": float(2 * c_val),
        "excentricidad": float(c_val / a_val) if a_val != 0 else 0.0,
        "eje_mayor_recta": _eje_central(centro_val, orientacion),
        "eje_menor_recta": _eje_central(centro_val, _orientacion_perpendicular(orientacion)),
        "estado_conica": "real",
        "tiene_grafica_real": True,
    })
    return datos


def _datos_hiperbola(h_x, h_y, const_der, A, B):
    centro, vertices, extremos_conjugados, focos, a, b, c, orientacion = analizar_hiperbola(
        h_x, h_y, const_der, A, B
    )
    a_val, b_val, c_val = float(a), float(b), float(c)
    centro_val = [float(centro[0]), float(centro[1])]

    datos = {
        "centro": centro_val,
        "a": a_val,
        "b": b_val,
        "c": c_val,
        "orientacion": orientacion,
    }

    if a_val == 0 or b_val == 0:
        datos.update(
            {
                "vertices": [],
                "extremos_conjugados": [],
                "focos": [],
                "eje_transversal": float(2 * a_val),
                "eje_conjugado": float(2 * b_val),
                "distancia_focal": float(2 * c_val),
                "asintotas": [],
                "excentricidad": 0.0,
                "estado_conica": "degenerada",
                "tiene_grafica_real": False,
                "observacion": "La hiperbola queda degenerada porque algun semieje es cero.",
            }
        )
        return datos

    datos.update({
        "vertices": [[float(v[0]), float(v[1])] for v in vertices],
        "extremos_conjugados": [
            [float(v[0]), float(v[1])] for v in extremos_conjugados
        ],
        "focos": [[float(f[0]), float(f[1])] for f in focos],
        "eje_transversal": float(2 * a_val),
        "eje_conjugado": float(2 * b_val),
        "distancia_focal": float(2 * c_val),
        "asintotas": _asintotas(centro_val, a_val, b_val, orientacion),
        "excentricidad": float(c_val / a_val) if a_val != 0 else 0.0,
        "eje_transversal_recta": _eje_central(centro_val, orientacion),
        "eje_conjugado_recta": _eje_central(centro_val, _orientacion_perpendicular(orientacion)),
        "estado_conica": "real",
        "tiene_grafica_real": True,
    })
    return datos


def _recta_directriz(orientacion, directriz):
    if orientacion == "Vertical":
        return {"tipo": "horizontal", "y": float(directriz), "ecuacion": f"y = {float(directriz):.2f}"}
    return {"tipo": "vertical", "x": float(directriz), "ecuacion": f"x = {float(directriz):.2f}"}


def _eje_simetria_parabola(vertice, orientacion):
    h, k = float(vertice[0]), float(vertice[1])
    if orientacion == "Vertical":
        return {"tipo": "vertical", "x": h, "ecuacion": f"x = {h:.2f}"}
    return {"tipo": "horizontal", "y": k, "ecuacion": f"y = {k:.2f}"}


def _extremos_lado_recto(vertice, p, orientacion):
    h, k = float(vertice[0]), float(vertice[1])
    distancia = abs(2 * float(p))

    if orientacion == "Vertical":
        y = k + float(p)
        return [[h - distancia, y], [h + distancia, y]]

    x = h + float(p)
    return [[x, k - distancia], [x, k + distancia]]


def _eje_central(centro, orientacion):
    h, k = float(centro[0]), float(centro[1])
    if orientacion == "Vertical":
        return {"tipo": "vertical", "x": h, "ecuacion": f"x = {h:.2f}"}
    return {"tipo": "horizontal", "y": k, "ecuacion": f"y = {k:.2f}"}


def _orientacion_perpendicular(orientacion):
    return "Vertical" if orientacion == "Horizontal" else "Horizontal"


def _asintotas(centro, a, b, orientacion):
    h, k = float(centro[0]), float(centro[1])
    pendiente = (b / a) if orientacion == "Horizontal" else (a / b)
    return [
        {
            "m": float(pendiente),
            "h": h,
            "k": k,
            "ecuacion": _ecuacion_punto_pendiente(h, k, pendiente),
        },
        {
            "m": float(-pendiente),
            "h": h,
            "k": k,
            "ecuacion": _ecuacion_punto_pendiente(h, k, -pendiente),
        },
    ]


def _ecuacion_punto_pendiente(h, k, pendiente):
    termino_y = f"y - {k:.2f}" if k >= 0 else f"y + {abs(k):.2f}"
    termino_x = f"x - {h:.2f}" if h >= 0 else f"x + {abs(h):.2f}"
    return f"{termino_y} = {pendiente:.2f}({termino_x})"
