# S2-03 Riesgos del modulo de conicas

## Riesgos principales

| Riesgo | Archivo asociado | Impacto | Revision recomendada |
| --- | --- | --- | --- |
| Cero a la izquierda en RUT de 7 digitos | `backend/conicas/core/ecuacion.py` | Puede generar dudas sobre la correspondencia entre `d1..d8` y el cuerpo del RUT. | Documentar que `zfill(8)` completa el cuerpo antes de calcular la ecuacion. |
| Division por `v` dependiente del DV | `backend/conicas/core/ecuacion.py` | Si el DV no fue validado antes, `v` podria ser invalido. | Mantener el procesamiento bloqueado hasta validar RUT. |
| Ajustes de conicas se aplican en secuencia | `backend/conicas/core/ecuacion.py` | Una regla posterior puede cambiar el efecto de una regla anterior. | Revisar y explicar prioridad: hiperbola, circunferencia, parabola. |
| Clasificacion usa solo los signos y ceros de `A` y `B` | `backend/conicas/core/clasificacion.py` | Puede clasificar una ecuacion sin verificar si representa una conica real. | Complementar con validacion de constante derecha y radios/semiejes. |
| `constante_derecha` igual a cero o negativa | `backend/conicas/algebra/canonica.py`, `backend/conicas/geometria` | Puede producir radio, semiejes o grafica nulos aunque el caso sea degenerado o no real. | Agregar advertencias matematicas o mensajes de caso degenerado. |
| Parabola con coeficiente lineal necesario igual a cero | `backend/conicas/geometria/parabola.py` | Si `C == 0` o `D == 0`, el vertice se fuerza a `0` y puede quedar incorrecto. | Probar RUTs borde y devolver advertencia si la forma no permite despeje esperado. |
| Puntos generados manualmente para graficar | `backend/conicas/services/graficas.py`, `backend/conicas/geometria/puntos.py` | Una grafica puede verse correcta aunque los puntos no representen bien el caso borde. | Comparar grafica con ecuacion y elementos geometricos. |
| Redondeo y conversion a `float` | `backend/conicas/services/analisis_conicas.py` | Puede ocultar diferencias pequenas en focos, radios o asintotas. | Mostrar valores suficientes y usar casos verificables a mano. |
| Campos geometricos por tipo | `backend/conicas/services/analisis_conicas.py` | Un tipo de conica podria omitir un campo pedido para defensa oral. | Confirmar por tipo: centro, vertices, focos, ejes, directriz. |

## Casos borde que requieren atencion

- RUT valido con DV `K`, porque `v = 10`.
- RUT valido con DV `0`, porque `v = 11`.
- RUT de 7 digitos, porque se completa a 8 digitos con cero inicial.
- Circunferencia con radio al cuadrado menor o igual a cero.
- Elipse con algun semieje nulo.
- Hiperbola con denominadores muy pequenos o constante derecha cercana a cero.
- Parabola vertical con `D = 0`.
- Parabola horizontal con `C = 0`.

## RUTs validos recomendados para auditoria

| Tipo esperado | RUT valido | Uso recomendado |
| --- | --- | --- |
| Circunferencia | `11070434-8` | Verificar `A = B`, centro, radio y grafica cerrada. |
| Elipse | `17439150-5` | Verificar semiejes, focos, vertices y forma canonica. |
| Parabola | `63170669-K` | Verificar vertice, foco, directriz, lado recto y orientacion. |
| Hiperbola | `29141777-9` | Verificar vertices, focos, asintotas y ramas. |

## Checklist breve para auditoria manual

- La ecuacion general coincide con las formulas del enunciado.
- La regla de ajuste aplicada se muestra en los pasos.
- La clasificacion coincide con los criterios `A`, `B` del enunciado.
- La forma canonica tiene sentido matematico para el tipo obtenido.
- Los elementos geometricos principales coinciden con la forma canonica.
- La grafica representa la misma conica que la ecuacion.
- No se usan librerias matematicas prohibidas para resolver calculos.
