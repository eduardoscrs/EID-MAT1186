from algebra.canonica import transformar_a_canonica
from core.clasificacion import clasificar_conica
from core.ecuacion import construir_ecuacion_general
from core.rut import limpiar_rut, validar_rut_paso_a_paso
from utils.helpers import imprimir_pasos


def main():
    rut_input = input("Ingresa el RUT (ej: 12345678-9): ")
    rut_limpio = limpiar_rut(rut_input)

    es_valido, pasos_rut, cuerpo, dv = validar_rut_paso_a_paso(rut_limpio)
    imprimir_pasos("Validacion de RUT", pasos_rut)

    if not es_valido:
        print("\n[ERROR] El RUT ingresado no es valido. Fin del programa.")
        return

    A, B, C, D, E, pasos_eq = construir_ecuacion_general(cuerpo, dv)
    imprimir_pasos("Construccion de Ecuacion General", pasos_eq)

    print(f"\nEcuacion obtenida: {A}x^2 + {B}y^2 + {C}x + {D}y + {E} = 0")

    tipo_conica = clasificar_conica(A, B)
    print(f"\n[RESULTADO] La conica clasificada es: {tipo_conica}")

    if tipo_conica != "Parábola":
        h_x, h_y, const_der, pasos_can = transformar_a_canonica(A, B, C, D, E)
        imprimir_pasos("Transformacion a Forma Canonica", pasos_can)

        if tipo_conica == "Circunferencia":
            from geometria.circunferencia import analizar_circunferencia

            centro, radio = analizar_circunferencia(h_x, h_y, const_der, A)
            print(f"\nCentro: {centro} | Radio: {radio}")

        elif tipo_conica == "Elipse":
            from geometria.elipse import analizar_elipse

            centro, vertices, focos, a, b = analizar_elipse(h_x, h_y, const_der, A, B)
            print(f"\nCentro: {centro} \nVertices: {vertices} \nFocos: {focos}")

        elif tipo_conica == "Hipérbola":
            from geometria.hiperbola import analizar_hiperbola

            centro, vertices, focos, a, b = analizar_hiperbola(
                h_x, h_y, const_der, A, B
            )
            print(f"\nCentro: {centro} \nVertices: {vertices} \nFocos: {focos}")

    else:
        from geometria.parabola import analizar_parabola

        vertice, foco, directriz, p, orientacion, pasos_par = analizar_parabola(
            A, B, C, D, E
        )
        imprimir_pasos("Analisis de Parabola (Completar cuadrados)", pasos_par)
        print(
            f"\nOrientacion: {orientacion} "
            f"\nVertice: {vertice} "
            f"\nFoco: {foco} "
            f"\nDirectriz: {directriz}"
        )


if __name__ == "__main__":
    main()
