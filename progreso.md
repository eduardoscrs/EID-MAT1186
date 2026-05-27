# Progreso del proyecto

## Estado general

| Area | Estado | Avance estimado | Observaciones |
|---|---|---:|---|
| Validacion de RUT | Implementado | 90% | Valida formato, modulo 11, RUT vacio, caracteres invalidos, largo incorrecto, RUT de empresa y uso incorrecto de endpoints. |
| Geometria analitica y conicas | Avanzado | 85% | Construye ecuacion general, clasifica conicas, transforma a forma canonica, genera procedimiento inverso, calcula elementos geometricos y grafica en canvas. |
| Modulo backend de limites | Implementado | 90% | Expone `POST /api/limites`, genera funcion por tramos, limites laterales, tabla de valores, continuidad, discontinuidad, pasos y puntos de grafica. |
| Interfaz del modulo de limites | Pendiente de integracion | 30% | Existen referencias de interfaz en ramas de trabajo, pero falta integrarla con el contrato JSON actual del backend. |
| Documentacion y evidencia | En progreso | 75% | Hay matriz de requisitos, riesgos, verificacion API y plan semanal; falta cerrar evidencia visual y pruebas completas. |
| Integracion en `main` | Pendiente | 55% | Hay avances distribuidos entre ramas; antes de fusionar se debe alinear contrato API, interfaz de limites y dependencias frontend. |

## Plan semanas 2 a 8

| Semana | Objetivo principal |
|---|---|
| Semana 2 | Cerrar brechas del modulo de conicas y disenar tecnicamente el modulo de limites. |
| Semana 3 | Implementar backend de funciones por tramos: seleccion por `d8 % 3`, limites laterales, continuidad y discontinuidades. |
| Semana 4 | Integrar frontend y backend del modulo de limites, cerrar contrato visual/API y preparar evidencia de revision. |
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
| `pbenavides` | Contiene una reorganizacion modular de frontend y backend, incluyendo componentes funcionales para limites. | Aporta interfaz de limites, panel teorico, grafica y API frontend. | Usarla como referencia para integrar la interfaz de limites, cuidando que el contrato JSON coincida con el backend actual. |
| `santana` | Contiene documentacion de semana 2 y backend de limites implementado. | Aporta contrato `POST /api/limites`, validacion robusta de RUT y documentos de verificacion. | Usarla como referencia del contrato backend de limites. |
| `origin/eescares` | Contiene trabajo de interfaz/grafica en ramas historicas y cambios visuales. | Puede aportar criterios visuales o mejoras de grafica. | Revisar visualmente antes de rescatar componentes o estilos. |

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

## Semana 4: tareas

| ID | Issue | Tarea | Responsable | Depende de | Entregable esperado |
|---|---|---|---|---|---|
| S4-01 | #12 | Alinear contrato frontend/backend del modulo de limites. | Marcelo Santana, Scrum Master | S3-02, S3-03 | Mapeo definitivo entre campos del backend (`tipo_caso`, `limites_laterales`, `tabla_valores`, `puntos_grafica`) y los componentes React que muestran limites. |
| S4-02 | #13 | Integrar formulario de limites con `POST /api/limites`. | Patricio Benavides, Sub Lider | S4-01 | Pantalla que permita ingresar RUT, validar, llamar al endpoint de limites y mostrar errores sin romper la navegacion. |
| S4-03 | #14 | Mostrar funcion por tramos, regla de seleccion y procedimiento. | Patricio Benavides, Sub Lider | S4-01, S4-02 | Panel de resultados con `a = d3`, `d8 % 3`, funcion generada, limites laterales, continuidad, discontinuidad, justificacion y pasos. |
| S4-04 | #15 | Renderizar tabla de valores y grafica del modulo de limites. | Eduardo Escares, Miembro | S4-01, S4-02 | Tabla alrededor de `a` y grafica que distinga comportamiento removible, salto o infinito cerca del punto critico. |
| S4-05 | #16 | Incorporar campos vacios para defensa oral en limites. | Eduardo Escares, Miembro | S4-03 | Campos editables vacios para limite izquierdo, limite derecho, existencia del limite, continuidad, tipo de discontinuidad y justificacion escrita. |
| S4-06 | #17 | Verificar dependencias frontend y renderizado matematico. | Marcelo Santana, Scrum Master | S4-02, S4-03 | `pnpm install` y build local funcionando, KaTeX disponible y formulas clave renderizadas de forma legible. |
| S4-07 | #18 | Actualizar evidencia de auditoria de conicas con RUTs validos. | Marcelo Santana, Scrum Master | S2-07 | Tabla final de cuatro RUTs validos de persona natural para circunferencia, elipse, parabola e hiperbola, con ecuacion, tipo y elementos principales. |
