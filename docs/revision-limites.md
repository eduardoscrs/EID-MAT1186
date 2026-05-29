# Revision del modulo de limites

## Alcance

El modulo de limites genera una funcion por tramos a partir del mismo RUT
validado por el sistema. El punto principal de analisis queda definido como
`a = d3` y el caso se selecciona con la regla `d8 % 3`.

## Requerimientos cubiertos

- Endpoint `POST /api/limites`.
- Validacion del RUT antes de generar la funcion.
- Seleccion automatica del caso: discontinuidad removible, de salto o infinita.
- Respuesta JSON con tipo de caso, `a`, funcion por tramos, limites laterales,
  tabla de valores, continuidad, discontinuidad y pasos.
- Evidencia numerica alrededor de `a`, usando valores por izquierda y derecha.
- Grafica del comportamiento de la funcion cerca del punto critico.
- Campos vacios editables para completar durante la defensa oral.

## Contrato principal del backend

La respuesta del endpoint incluye, entre otros, estos campos:

| Campo | Uso |
| --- | --- |
| `caso` | Tipo de funcion generada segun `d8 % 3`. |
| `a` | Punto de analisis, definido como `d3`. |
| `funcion_por_tramos` | Representacion textual de la funcion generada. |
| `limites` | Limite por izquierda, limite por derecha y conclusion. |
| `continuidad` | Estado de continuidad y tipo de discontinuidad. |
| `evidence` | Tabla de valores cercanos a `a`. |
| `samples` | Puntos usados para dibujar la grafica. |
| `numeric_limits` | Aproximaciones numericas laterales. |
| `puntos_criticos` | Puntos relevantes de la funcion. |
| `pasos` | Desarrollo paso a paso del procedimiento. |
| `justificacion` | Explicacion matematica del caso obtenido. |

## Casos de prueba validos

| Caso esperado | RUT valido |
| --- | --- |
| Discontinuidad removible | `17439150-5` |
| Discontinuidad de salto | `11070434-8` |
| Discontinuidad infinita | `11100002-6` |

## Estado actual

El modulo esta integrado en la interfaz React. La pantalla muestra la funcion
generada, regla de seleccion, limites laterales, continuidad, tabla de valores,
grafica y campos vacios para que el estudiante complete su interpretacion
durante la defensa oral.
