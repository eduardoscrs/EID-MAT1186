from core.rut import limpiar_rut, validar_rut_paso_a_paso
from core.ecuacion import construir_ecuacion_general
from core.clasificacion import clasificar_conica
from algebra.canonica import transformar_a_canonica
from utils.helpers import imprimir_pasos

# Importamos las funciones de graficación
from visualizacion.grafica import (
    graficar_circunferencia,
    graficar_elipse,
    graficar_hiperbola,
    graficar_parabola
)

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
    
    print(f"\nEcuación obtenida: {A}x^2 + {B}y^2 + {C}x + {D}y + {E} = 0")
    
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
            
            # Llamada a graficar
            graficar_circunferencia(centro[0], centro[1], radio)
            
        elif tipo_conica == "Elipse":
            from geometria.elipse import analizar_elipse
            centro, vertices, focos, a, b = analizar_elipse(h_x, h_y, const_der, A, B)
            print(f"\nCentro: {centro} \nVértices: {vertices} \nFocos: {focos}")
            
            # Llamada a graficar
            graficar_elipse(h_x, h_y, a, b, focos, vertices)
            
        elif tipo_conica == "Hipérbola":
            from geometria.hiperbola import analizar_hiperbola
            centro, vertices, focos, a, b = analizar_hiperbola(h_x, h_y, const_der, A, B)
            print(f"\nCentro: {centro} \nVértices: {vertices} \nFocos: {focos}")
            
            # Determinamos la orientación para la gráfica
            orientacion = "Horizontal" if (A * const_der) > 0 else "Vertical"
            
            # Llamada a graficar
            graficar_hiperbola(h_x, h_y, a, b, orientacion, focos, vertices)
            
    else:
        from geometria.parabola import analizar_parabola
        vertice, foco, directriz, p, orientacion, pasos_par = analizar_parabola(A, B, C, D, E)
        imprimir_pasos("Análisis de Parábola (Completar cuadrados)", pasos_par)
        print(f"\nOrientación: {orientacion} \nVértice: {vertice} \nFoco: {foco} \nDirectriz: {directriz}")
        
        # Llamada a graficar
        graficar_parabola(vertice[0], vertice[1], p, orientacion, foco, directriz)

if __name__ == "__main__":
    main()