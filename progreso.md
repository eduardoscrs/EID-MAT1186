# Progreso del proyecto

## Estado general

La rama `main` queda como base integrada para continuar el trabajo. El proyecto
ya tiene backend Flask, frontend React/Vite, modulo de conicas, modulo de
limites, validacion de RUT y documentacion de apoyo.

Avance estimado:

| Area | Estado | Observacion |
| --- | --- | --- |
| Validacion de RUT | Completo | Se valida modulo 11, formato, largo correcto, caracteres invalidos y se rechaza RUT de empresa. |
| Geometria analitica | Avanzado | Construye, clasifica, transforma y grafica conicas desde RUT. |
| Limites | Avanzado | Genera funcion por tramos, limites laterales, tabla, continuidad, discontinuidad, pasos y grafica. |
| Interfaz | Avanzado | Tiene pantallas separadas para conicas y limites, con campos vacios para defensa oral. |
| Documentacion | Actualizada | README, revision de conicas, revision de limites y este archivo resumen. |
| GitHub | En revision grupal | Las ramas fueron comparadas contra `main` y no conviene fusionarlas completas si reemplazan trabajo ya integrado. |

## Tareas S4

| Tarea | Estado | Resultado |
| --- | --- | --- |
| S4-01 Consolidar base de trabajo en `main` | Completada | `main` queda como base mas avanzada del proyecto. |
| S4-02 Integrar pantalla del modulo de limites | Completada | La interfaz permite ingresar RUT y ver el analisis de limites. |
| S4-03 Alinear interfaz de limites con contrato API | Completada | Se muestran caso, `a`, funcion, limites, continuidad, discontinuidad, pasos y justificacion. |
| S4-04 Revisar tabla y grafica de limites | Completada | La interfaz muestra valores alrededor de `a` y grafica el comportamiento cerca del punto critico. |
| S4-05 Incorporar campos vacios para defensa oral | Completada | Conicas y limites incluyen campos editables sin completar automaticamente. |
| S4-06 Actualizar documentacion de estado | Completada | Se actualizo README y se agregaron documentos de revision. |
| S4-07 Revisar ramas del equipo antes de integrar | Completada | `main` conserva el trabajo mas completo; las demas ramas sirven como referencia pero no conviene fusionarlas completas. |

## Verificacion local

- Backend probado con RUTs validos para circunferencia, elipse, parabola e hiperbola.
- Backend probado con RUTs validos para discontinuidad removible, de salto e infinita.
- Frontend revisado con `pnpm lint`.
- Frontend compilado con `pnpm build`.
- Se reviso que el codigo no importe librerias matematicas prohibidas.

## Pendientes recomendados

- Hacer una revision grupal visual de la interfaz completa antes de la entrega.
- Probar los RUTs documentados durante la defensa para confirmar que todos obtienen el resultado esperado.
- Revisar en GitHub si se cierran o se mantienen abiertos los PRs antiguos que ya no conviene fusionar.
