# S2-01 Matriz de requisitos contra estado actual

Fuente de requisitos: enunciado EID MAT1186, fases de trabajo, modulo de conicas,
modulo de limites, restricciones de implementacion y desarrollo profesional.

## Matriz

| ID | Requisito del enunciado | Estado actual | Evidencia en el proyecto | Accion pendiente |
| --- | --- | --- | --- | --- |
| R-01 | Validar primero que el RUT ingresado sea real y valido con modulo 11. | Cumple | `backend/common/rut.py`, `validar_rut_paso_a_paso` | Mantener pruebas de RUT valido e invalido antes de cada entrega. |
| R-02 | Mostrar el procedimiento paso a paso de validacion del RUT. | Cumple | `backend/common/rut.py`, lista `pasos` retornada por `validar_rut_paso_a_paso` | Verificar que el frontend siempre muestre los pasos cuando corresponda. |
| R-03 | Extraer correctamente los ocho digitos del cuerpo del RUT. | Cumple | `backend/conicas/core/ecuacion.py`, uso de `cuerpo_rut.zfill(8)` | Documentar que los RUT de 7 digitos se completan con cero a la izquierda. |
| R-04 | Definir la variable auxiliar `v` segun DV: `K=10`, `0=11`, digitos `1..9`. | Cumple | `backend/conicas/core/ecuacion.py`, `calcular_variable_v` | Mantener cubierto con casos de prueba de DV `K`, `0` y numerico. |
| R-05 | Construir la ecuacion general `Ax^2 + By^2 + Cx + Dy + E = 0` desde los digitos. | Cumple | `backend/conicas/core/ecuacion.py`, `construir_ecuacion_general` | Auditar resultados con los 4 RUTs documentados. |
| R-06 | Mostrar paso a paso como se construye la ecuacion general. | Cumple | `backend/conicas/core/ecuacion.py`, lista `pasos` | Verificar presentacion en interfaz. |
| R-07 | Aplicar regla de hiperbola: si `d8` es impar, reemplazar `B` por `-B`. | Cumple | `backend/conicas/core/ecuacion.py` | Probar con RUT de hiperbola. |
| R-08 | Aplicar regla de circunferencia: si `d1 = d2`, imponer `B = A`. | Cumple | `backend/conicas/core/ecuacion.py` | Probar con RUT de circunferencia. |
| R-09 | Aplicar regla de parabola: si `d5 + d6` es multiplo de 3, anular `A` o `B` segun paridad de `d7`. | Cumple | `backend/conicas/core/ecuacion.py` | Revisar casos donde el coeficiente lineal necesario sea cero. |
| R-10 | Clasificar automaticamente circunferencia, elipse, hiperbola o parabola segun `A` y `B`. | Cumple | `backend/conicas/core/clasificacion.py` | Detectar y explicar casos degenerados o no reales. |
| R-11 | Mostrar la ecuacion general obtenida. | Cumple | `backend/conicas/services/procesador_conicas.py`, campo `ecuacion` | Verificar render final en frontend. |
| R-12 | Mostrar, cuando corresponda, la forma canonica de la conica. | Cumple parcial | `backend/conicas/algebra/canonica.py`, `common/formato.py` | Mejorar manejo de constante derecha cero o negativa. |
| R-13 | Mostrar paso a paso la transformacion desde forma general a canonica. | Cumple parcial | `backend/conicas/algebra/canonica.py`, campo `pasos_canonica` | Completar mensajes para casos no normalizables. |
| R-14 | Mostrar procedimiento inverso desde forma canonica a general. | Cumple | `backend/conicas/algebra/procedimiento_inverso.py` | Auditar consistencia con cada tipo de conica. |
| R-15 | Graficar correctamente la conica en el plano cartesiano. | Cumple parcial | `backend/conicas/services/graficas.py`, `frontend/src/canvas` | Validar visualmente los 4 casos documentados. |
| R-16 | Mostrar elementos geometricos: centro, vertices, focos, ejes y directriz cuando corresponda. | Cumple parcial | `backend/conicas/geometria`, `backend/conicas/services/analisis_conicas.py` | Confirmar que cada campo aparece para el tipo correcto. |
| R-17 | Incluir campos vacios para que el estudiante complete elementos durante la defensa oral. | Cumple parcial | `docs/revision-geometria-analitica.md`; componentes de interfaz en `frontend/src` | Revisar interfaz y documentar campos disponibles. |
| R-18 | Interfaz intuitiva, ordenada y visualmente adecuada. | Cumple parcial | `frontend/src/pages/ConicsPage`, `frontend/src/index.css` | Validar con ejecucion local y captura. |
| R-19 | Incorporar modulo de funciones por tramos generado desde el RUT. | Pendiente | `backend/limites` existe como estructura base | Implementar logica de generacion de funciones por tramos. |
| R-20 | Construir funcion por tramos con punto principal `a = d3`. | Pendiente | `backend/limites/constructor.py` es placeholder | Definir contrato JSON del modulo de limites. |
| R-21 | Seleccionar caso por `d8 % 3`: removible, salto o infinita. | Pendiente | No hay implementacion activa | Implementar regla de seleccion y exponerla en la respuesta. |
| R-22 | Calcular limites laterales en puntos criticos. | Pendiente | `backend/limites/analisis.py` es placeholder | Implementar calculo de limites por izquierda y derecha. |
| R-23 | Determinar continuidad y tipo de discontinuidad. | Pendiente | `backend/limites/continuidad.py` es placeholder | Implementar conclusion de continuidad y tipo de discontinuidad. |
| R-24 | Mostrar tabla de valores cercanos al punto de analisis `a`. | Pendiente | `backend/limites/tablas.py` es placeholder | Generar tabla con valores por izquierda y derecha. |
| R-25 | Graficar la funcion por tramos y evidenciar el comportamiento cerca del punto critico. | Pendiente | `backend/limites/graficas.py` y pagina de limites aun sin logica completa | Generar puntos para grafica y marcar el comportamiento en `x = a`. |
| R-26 | Campos vacios en interfaz de limites para defensa oral. | Pendiente | `frontend/src/pages/LimitsPage` requiere revision especifica | Incorporar campos vacios para respuestas manuales durante la defensa. |
| R-27 | No usar librerias matematicas o algebraicas prohibidas: `numpy`, `math`, `sympy`, `scipy`, `pandas`. | Cumple | `requirements.txt` solo incluye Flask; no hay imports detectados en backend revisado | Mantener auditoria antes de entrega. |
| R-28 | Codigo modular, no un unico archivo desordenado. | Cumple | Carpetas `backend/api`, `backend/common`, `backend/conicas`, `backend/limites`, `frontend/src` | Mantener separacion de responsabilidades. |
| R-29 | Manejo basico de errores de entrada, especialmente RUT mal ingresado o invalido. | Cumple | `backend/common/rut.py`, `backend/api/conicas_routes.py` | Mantener casos de prueba para entrada vacia, no JSON, empresa, largo incorrecto, caracteres invalidos y uso directo de `/api/procesar`. |
| R-30 | Uso obligatorio de GitHub y evidencia de participacion por commits. | Cumple parcial | Repositorio Git remoto configurado; issues de semana 2 creados; PR de trabajo abierto | Mantener commits verificables por integrante y revisar cambios antes de fusionar. |

## Resumen de brechas principales

- El modulo de conicas cubre la mayor parte del enunciado matematico, pero debe
  auditarse con los 4 RUTs validos documentados.
- El modulo de limites existe como estructura, pero los requisitos funcionales
  estan pendientes de implementacion.
- La API de RUT valida correctamente los casos principales y ahora expone un
  contrato de error mas claro para entradas invalidas y uso incorrecto de
  endpoints.
- La gestion de GitHub ya cuenta con issues semanales y PR de trabajo; falta
  completar la evidencia de commits por integrante antes de la entrega.
