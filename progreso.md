# Progreso del proyecto

## Plan semanas 2 a 8

| Semana | Objetivo principal |
|---|---|
| Semana 2 | Cerrar brechas del modulo de conicas y disenar tecnicamente el modulo de limites. |
| Semana 3 | Implementar backend de funciones por tramos: seleccion por `d8 % 3`, limites laterales, continuidad y discontinuidades. |
| Semana 4 | Construir interfaz del modulo de limites: funcion generada, procedimiento, tabla de valores y campos vacios para defensa. |
| Semana 5 | Implementar grafica de funciones por tramos: removible, salto e infinita, con punto critico `a = d3`. |
| Semana 6 | Crear casos de prueba completos: 4 conicas y 3 tipos de discontinuidad con RUTs validos. |
| Semana 7 | Pulir interfaz, manejo de errores, documentacion, codigo de etica y evidencia de aportes. |
| Semana 8 | Ensayo de defensa, congelamiento del codigo, revision final y preparacion de presentacion. |

## Semana 2: tareas

| ID | Tarea | Responsable | Depende de | Entregable esperado |
|---|---|---|---|---|
| S2-01 | Crear matriz de requisitos contra estado actual del proyecto. | Marcelo Santana, Scrum Master | Ninguna | Checklist en `docs/` separando: cumplido, parcial, pendiente. Incluir conicas, limites, interfaz, pruebas y gestion. |
| S2-02 | Organizar flujo de trabajo GitHub de la semana. | Marcelo Santana, Scrum Master | Ninguna | Ramas o PRs definidos por tarea, registro de acuerdos de trabajo y control de que cada integrante avance hacia minimo 3 commits verificables. |
| S2-03 | Revisar y documentar riesgos del modulo de conicas. | Marcelo Santana, Scrum Master | S2-01 | Lista breve de riesgos: calculos que requieren revision, casos borde y puntos que deben explicarse mejor en la defensa. |
| S2-04 | Implementar mejoras de manejo de errores en la API de RUT. | Marcelo Santana, Scrum Master | S2-03 | Ajustes de codigo para responder mensajes claros ante RUT vacio, formato incorrecto, cuerpo con menos de 8 digitos o digito verificador invalido. |
| S2-05 | Revisar y reforzar validacion de RUT y manejo de errores. | Patricio Benavides, Sub Lider | Ninguna | Lista de ajustes necesarios para evitar RUT vacio, largo incorrecto, caracteres invalidos o uso directo de `/api/procesar` sin validacion. |
| S2-06 | Disenar contrato backend del modulo de limites. | Patricio Benavides, Sub Lider | S2-01 | Estructura JSON esperada: tipo de caso, `a = d3`, funcion, limites laterales, tabla de valores, continuidad, discontinuidad y pasos. |
| S2-07 | Auditar el modulo de conicas con los 4 RUTs validos documentados. | Eduardo Escares, Miembro | Ninguna | Evidencia manual de circunferencia, elipse, parabola e hiperbola, verificando ecuacion, forma canonica, grafica y campos de defensa. |
| S2-08 | Disenar maqueta funcional de la interfaz de limites. | Eduardo Escares, Miembro | S2-06 | Boceto o descripcion de pantalla con funcion generada, procedimiento, tabla de valores, grafica y campos vacios para defensa. |

## Revision de ramas para preparar semana 3

| Rama | Estado observado | Avance util | Decision recomendada |
|---|---|---|---|
| `pbenavides` | Contiene la reorganizacion modular del backend en `common`, `conicas` y `limites`. | Deja creada la estructura base del modulo de limites y mejora validaciones de RUT. | Usarla como base tecnica del backend si no se trabaja desde `santana`. |
| `santana` | Esta por delante de `pbenavides` y agrega documentacion de semana 2. | Incluye matriz de requisitos, riesgos de conicas y documentacion de errores de RUT. | Usarla como base principal de semana 3, porque acumula el avance de `pbenavides` mas documentacion. |
| `origin/eescares` | Esta mas atrasada y conserva una estructura monolitica con archivos en raiz, `static`, `templates` y `Programa`. | Puede servir como referencia historica de UI/grafica, pero no calza con la estructura actual React + Flask modular. | No usarla como base de semana 3; rescatar ideas solo si son utiles y migrarlas manualmente. |

Nota: `main` no es rama personal, pero contiene decisiones vigentes del frontend como `pnpm` y KaTeX. Al integrar semana 3 se debe cuidar que esos cambios no se pierdan.

## Semana 3: tareas

| ID | Tarea | Responsable | Depende de | Entregable esperado |
|---|---|---|---|---|
| S3-01 | Consolidar la rama base de trabajo para semana 3. | Marcelo Santana, Scrum Master | Semana 2 cerrada | Rama base definida usando `santana` o integrando `santana` con `main`, conservando la estructura modular, `pnpm` y KaTeX. |
| S3-02 | Implementar el endpoint `POST /api/limites`. | Marcelo Santana, Scrum Master | S3-01, S3-06 | Ruta en `backend/api/limites_routes.py` que reciba cuerpo y DV validado, llame al servicio de limites y devuelva JSON consistente con errores controlados. |
| S3-03 | Verificar el contrato API del modulo de limites. | Marcelo Santana, Scrum Master | S3-02, S3-09 | Pruebas manuales o documento de verificacion con 3 RUTs validos, respuestas esperadas, errores controlados y confirmacion de que no se rompio `/api/validar_rut` ni `/api/procesar`. |
| S3-04 | Implementar la construccion de funciones por tramos desde el RUT. | Patricio Benavides, Sub Lider | S3-01 | Codigo en `backend/limites/constructor.py` y `backend/limites/funciones.py` que calcule `a = d3`, seleccione caso por `d8 % 3` y represente la funcion generada. |
| S3-05 | Implementar limites laterales y clasificacion de continuidad. | Patricio Benavides, Sub Lider | S3-04 | Codigo en `backend/limites/analisis.py` y `backend/limites/continuidad.py` para removible, salto e infinita, sin usar librerias matematicas prohibidas. |
| S3-06 | Orquestar la respuesta completa del modulo de limites. | Patricio Benavides, Sub Lider | S3-04, S3-05 | Servicio en `backend/limites/service.py` que entregue tipo de caso, punto `a`, funcion, limites laterales, continuidad, discontinuidad, tabla y pasos. |
| S3-07 | Implementar la tabla de valores cercanos al punto critico. | Eduardo Escares, Miembro | S3-04 | Codigo en `backend/limites/tablas.py` que genere valores para `a - 1`, `a - 0.1`, `a - 0.01`, `a - 0.001`, `a + 0.001`, `a + 0.01`, `a + 0.1`, `a + 1`, separando izquierda y derecha. |
| S3-08 | Generar puntos de grafica para funciones por tramos. | Eduardo Escares, Miembro | S3-04 | Codigo en `backend/limites/graficas.py` que produzca puntos por izquierda y derecha, marcando comportamiento removible, salto o infinito cerca de `x = a`. |
| S3-09 | Crear casos de prueba validos para los tres tipos de discontinuidad. | Eduardo Escares, Miembro | S3-06, S3-07, S3-08 | Documento o tabla con RUTs validos que cubran `d8 % 3 = 0`, `1` y `2`, mas resultado esperado de limites, tabla, grafica y discontinuidad. |
