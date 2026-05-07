from core.rut import limpiar_rut, validar_rut_paso_a_paso
from core.ecuacion import construir_ecuacion_general
from core.clasificacion import clasificar_conica
from algebra.canonica import transformar_a_canonica
from algebra.completar_cuadrado import completar_cuadrado
from geometria.circunferencia import analizar_circunferencia
from geometria.elipse import analizar_elipse
from geometria.hiperbola import analizar_hiperbola
from geometria.parabola import analizar_parabola
from visualizacion.grafica import (
    generar_puntos_circunferencia,
    generar_puntos_elipse,
    generar_puntos_hiperbola,
    generar_puntos_parabola
)
from utils.helpers import imprimir_pasos
from flask import Flask, render_template, request, jsonify
import json
import traceback

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/validar_rut", methods=["POST"])
def validar_rut_api():
    """Endpoint para validar RUT usando algoritmo Módulo 11"""
    data = request.json
    rut_input = data.get("rut", "")
    
    try:
        rut_limpio = limpiar_rut(rut_input)
        es_valido, pasos_rut, cuerpo, dv = validar_rut_paso_a_paso(rut_limpio)
        
        return jsonify({
            "valido": es_valido,
            "pasos": pasos_rut,
            "cuerpo": cuerpo,  # cuerpo es string "12345678"
            "digito_verificador": str(dv),
            "rut_limpio": rut_limpio
        })
    except Exception as e:
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 400

@app.route("/api/procesar", methods=["POST"])
def procesar_api():
    """Endpoint que procesa el RUT completo y calcula la cónica"""
    data = request.json
    cuerpo = data.get("cuerpo")
    dv = data.get("digito_verificador") or data.get("dv")
    
    try:
        # Convertir cuerpo a string si es necesario (ya debería serlo)
        if isinstance(cuerpo, list):
            cuerpo = ''.join([str(x) for x in cuerpo])
        
        # ===== PASO 1: Construcción de la Ecuación General =====
        A, B, C, D, E, pasos_eq = construir_ecuacion_general(cuerpo, dv)
        
        # ===== PASO 2: Clasificación de la Cónica =====
        tipo_conica = clasificar_conica(A, B)
        
        resultado = {
            "ecuacion": f"{A}x² + {B}xy + {C}y² + {D}x + {E}y + F = 0",
            "A": A, "B": B, "C": C, "D": D, "E": E,
            "tipo_conica": tipo_conica,
            "pasos_ecuacion": pasos_eq,
        }
        
        # ===== PASO 3: Transformación a Forma Canónica y Análisis Geométrico =====
        if tipo_conica != "Parábola":
            # Transformar a forma canónica
            h_x, h_y, const_der, pasos_can = transformar_a_canonica(A, B, C, D, E)
            resultado["pasos_canonica"] = pasos_can
            resultado["h"] = float(h_x)
            resultado["k"] = float(h_y)
            resultado["constante_derecha"] = float(const_der)
            
            if tipo_conica == "Circunferencia":
                # ===== CIRCUNFERENCIA =====
                centro, radio = analizar_circunferencia(h_x, h_y, const_der, A)
                radio_val = float(radio)
                resultado.update({
                    "centro": [float(centro[0]), float(centro[1])],
                    "radio": radio_val,
                })
                # Generar puntos para gráfica
                puntos = generar_puntos_circunferencia(float(centro[0]), float(centro[1]), radio_val, puntos=1000)
                resultado["puntos_grafica"] = {
                    "x": [float(x) for x in puntos[0]],
                    "y_pos": [float(y) for y in puntos[1]],
                    "y_neg": [float(y) for y in puntos[2]]
                }
                
            elif tipo_conica == "Elipse":
                # ===== ELIPSE =====
                centro, vertices, focos, a, b = analizar_elipse(h_x, h_y, const_der, A, B)
                a_val = float(a)
                b_val = float(b)
                c_val = float((a_val**2 - b_val**2)**0.5) if a_val > b_val else float((b_val**2 - a_val**2)**0.5)
                excentricidad = float(c_val / a_val) if a_val != 0 else 0.0
                
                resultado.update({
                    "centro": [float(centro[0]), float(centro[1])],
                    "vertices": [[float(v[0]), float(v[1])] for v in vertices],
                    "focos": [[float(f[0]), float(f[1])] for f in focos],
                    "a": a_val,
                    "b": b_val,
                    "c": c_val,
                    "excentricidad": excentricidad
                })
                # Generar puntos para gráfica
                puntos = generar_puntos_elipse(float(centro[0]), float(centro[1]), a_val, b_val, puntos=1000)
                resultado["puntos_grafica"] = {
                    "x": [float(x) for x in puntos[0]],
                    "y_pos": [float(y) for y in puntos[1]],
                    "y_neg": [float(y) for y in puntos[2]]
                }
                
            elif tipo_conica == "Hipérbola":
                # ===== HIPÉRBOLA =====
                centro, vertices, focos, a, b = analizar_hiperbola(h_x, h_y, const_der, A, B)
                a_val = float(a)
                b_val = float(b)
                c_val = float((a_val**2 + b_val**2)**0.5)
                excentricidad = float(c_val / a_val) if a_val != 0 else 0.0
                orientacion = "Horizontal" if (A * const_der) > 0 else "Vertical"
                
                resultado.update({
                    "centro": [float(centro[0]), float(centro[1])],
                    "vertices": [[float(v[0]), float(v[1])] for v in vertices],
                    "focos": [[float(f[0]), float(f[1])] for f in focos],
                    "a": a_val,
                    "b": b_val,
                    "c": c_val,
                    "excentricidad": excentricidad,
                    "orientacion": orientacion
                })
                # Generar puntos para gráfica
                puntos = generar_puntos_hiperbola(float(centro[0]), float(centro[1]), a_val, b_val, orientacion, puntos=500)
                resultado["puntos_grafica"] = {
                    "rama_izq": {"x": [float(x) for x in puntos[0][0]], "y": [float(y) for y in puntos[0][1]]},
                    "rama_der": {"x": [float(x) for x in puntos[1][0]], "y": [float(y) for y in puntos[1][1]]}
                }
        else:
            # ===== PARÁBOLA =====
            vertice, foco, directriz, p, orientacion, pasos_par = analizar_parabola(A, B, C, D, E)
            p_val = float(p)
            resultado.update({
                "pasos_parabola": pasos_par,
                "vertice": [float(vertice[0]), float(vertice[1])],
                "foco": [float(foco[0]), float(foco[1])],
                "directriz": float(directriz),
                "p": p_val,
                "orientacion": orientacion
            })
            # Generar puntos para gráfica
            puntos = generar_puntos_parabola(float(vertice[0]), float(vertice[1]), p_val, orientacion, puntos=1000)
            resultado["puntos_grafica"] = {
                "x": [float(x) for x in puntos[0]],
                "y_pos": [float(y) for y in puntos[1]],
                "y_neg": [float(y) for y in puntos[2]] if puntos[2] else None
            }
        
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 400

def main():
    rut_input = input("Ingresa el RUT (ej: 12345678-9): ")
    rut_limpio = limpiar_rut(rut_input)
    
    es_valido, pasos_rut, cuerpo, dv = validar_rut_paso_a_paso(rut_limpio)
    imprimir_pasos("Validación de RUT", pasos_rut)
    
    if not es_valido:
        print("\n[ERROR] El RUT ingresado no es válido. Fin del programa.")
        return
        
    # Construcción de la Ecuación
    A, B, C, D, E, pasos_eq = construir_ecuacion_general(cuerpo, dv)
    imprimir_pasos("Construcción de Ecuación General", pasos_eq)
    
    print(f"\nEcuación obtenida: {A}x^2 + {B}xy + {C}y^2 + {D}x + {E}y + F = 0")
    
    # Clasificación
    tipo_conica = clasificar_conica(A, B)
    print(f"\n[RESULTADO] La cónica clasificada es: {tipo_conica}")
    
    # Forma Canónica y Geometría
    if tipo_conica != "Parábola":
        h_x, h_y, const_der, pasos_can = transformar_a_canonica(A, B, C, D, E)
        imprimir_pasos("Transformación a Forma Canónica", pasos_can)
        
        if tipo_conica == "Circunferencia":
            from geometria.circunferencia import analizar_circunferencia
            centro, radio = analizar_circunferencia(h_x, h_y, const_der, A)
            print(f"\nCentro: {centro} | Radio: {radio}")
            
        elif tipo_conica == "Elipse":
            from geometria.elipse import analizar_elipse
            centro, vertices, focos, a, b = analizar_elipse(h_x, h_y, const_der, A, B)
            print(f"\nCentro: {centro} \nVértices: {vertices} \nFocos: {focos}")
            
        elif tipo_conica == "Hipérbola":
            from geometria.hiperbola import analizar_hiperbola
            centro, vertices, focos, a, b = analizar_hiperbola(h_x, h_y, const_der, A, B)
            print(f"\nCentro: {centro} \nVértices: {vertices} \nFocos: {focos}")
            
    else:
        from geometria.parabola import analizar_parabola
        vertice, foco, directriz, p, orientacion, pasos_par = analizar_parabola(A, B, C, D, E)
        imprimir_pasos("Análisis de Parábola (Completar cuadrados)", pasos_par)
        print(f"\nOrientación: {orientacion} \nVértice: {vertice} \nFoco: {foco} \nDirectriz: {directriz}")

if __name__ == "__main__":
    app.run(debug=True)

def main():
    rut_input = input("Ingresa el RUT (ej: 12345678-9): ")
    rut_limpio = limpiar_rut(rut_input)
    
    es_valido, pasos_rut, cuerpo, dv = validar_rut_paso_a_paso(rut_limpio)
    imprimir_pasos("Validación de RUT", pasos_rut)
    
    if not es_valido:
        print("\n[ERROR] El RUT ingresado no es válido. Fin del programa.")
        return
        
    # Construcción de la Ecuación
    A, B, C, D, E, pasos_eq = construir_ecuacion_general(cuerpo, dv)
    imprimir_pasos("Construcción de Ecuación General", pasos_eq)
    
    print(f"\nEcuación obtenida: {A}x^2 + {B}xy + {C}y^2 + {D}x + {E}y + F = 0")
    
    # Clasificación
    tipo_conica = clasificar_conica(A, B)
    print(f"\n[RESULTADO] La cónica clasificada es: {tipo_conica}")
    
    # Forma Canónica y Geometría
    if tipo_conica != "Parábola":
        h_x, h_y, const_der, pasos_can = transformar_a_canonica(A, B, C, D, E)
        imprimir_pasos("Transformación a Forma Canónica", pasos_can)
        
        if tipo_conica == "Circunferencia":
            from geometria.circunferencia import analizar_circunferencia
            centro, radio = analizar_circunferencia(h_x, h_y, const_der, A)
            print(f"\nCentro: {centro} | Radio: {radio}")
            
        elif tipo_conica == "Elipse":
            from geometria.elipse import analizar_elipse
            centro, vertices, focos, a, b = analizar_elipse(h_x, h_y, const_der, A, B)
            print(f"\nCentro: {centro} \nVértices: {vertices} \nFocos: {focos}")
            
        elif tipo_conica == "Hipérbola":
            from geometria.hiperbola import analizar_hiperbola
            centro, vertices, focos, a, b = analizar_hiperbola(h_x, h_y, const_der, A, B)
            print(f"\nCentro: {centro} \nVértices: {vertices} \nFocos: {focos}")
            
    else:
        from geometria.parabola import analizar_parabola
        vertice, foco, directriz, p, orientacion, pasos_par = analizar_parabola(A, B, C, D, E)
        imprimir_pasos("Análisis de Parábola (Completar cuadrados)", pasos_par)
        print(f"\nOrientación: {orientacion} \nVértice: {vertice} \nFoco: {foco} \nDirectriz: {directriz}")

if __name__ == "__main__":
    app.run(debug=True)