# Revision de geometria analitica segun PDF

Alcance revisado: secciones conicas generadas desde RUT. El estado del modulo
de limites se registra por separado en `docs/revision-limites.md` y en
`progreso.md`.

## Requerimientos cubiertos

- Validar RUT chileno real con modulo 11.
- Mostrar pasos de validacion del RUT.
- Extraer digitos del RUT.
- Construir la ecuacion general `Ax^2 + By^2 + Cx + Dy + E = 0`.
- Mostrar pasos de construccion de la ecuacion general.
- Clasificar automaticamente circunferencia, elipse, parabola o hiperbola.
- Mostrar ecuacion general.
- Mostrar forma canonica.
- Mostrar pasos desde forma general a forma canonica.
- Mostrar procedimiento inverso desde forma canonica a forma general.
- Graficar la conica con puntos generados manualmente y dibujados en canvas.
- Mostrar elementos geometricos principales: centro/vertice, focos, vertices,
  ejes, radio, excentricidad y directriz cuando corresponde.
- Incluir campos vacios para completar elementos durante la defensa oral.

## Casos de prueba validos

Estos RUTs fueron verificados con el algoritmo de modulo 11 y sirven para
mostrar variedad de conicas durante la defensa:

| Tipo | RUT valido |
| --- | --- |
| Circunferencia | `11070434-8` |
| Elipse | `17439150-5` |
| Parabola | `17010350-5` |
| Hiperbola | `29141777-9` |

## Estado actual

- La parte de geometria analitica esta integrada en la interfaz principal.
- El backend valida el RUT antes de procesar la conica.
- La interfaz muestra procedimiento, forma canonica, grafica y campos vacios
  para defensa oral.
- Queda recomendado hacer una revision grupal final con los cuatro RUTs antes
  de la entrega.
