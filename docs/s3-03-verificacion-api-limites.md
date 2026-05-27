# S3-03 Verificacion del contrato API del modulo de limites

Endpoint verificado:

```http
POST /api/limites
Content-Type: application/json
```

Entrada minima:

```json
{
  "rut": "17439150-5"
}
```

Tambien se acepta el cuerpo separado:

```json
{
  "cuerpo": "17439150",
  "digito_verificador": "5"
}
```

## Contrato de respuesta

| Campo | Descripcion |
| --- | --- |
| `rut` | Cuerpo y digito verificador validados. |
| `tipo_caso` | Caso generado desde `d8 % 3`: removible, salto o infinita. |
| `a` | Punto de analisis definido como `d3`. |
| `funcion` | Funcion generada, tramos y expresiones usadas. |
| `regla_seleccion` | Valor de `d8`, residuo modulo 3 y descripcion del caso generado. |
| `limites_laterales` | Limite por izquierda, limite por derecha, existencia y valor si corresponde. |
| `tabla_valores` | Valores de `x` cercanos a `a`, por izquierda y derecha. |
| `continuidad` | Conclusion de continuidad y valor de la funcion en `a`. |
| `discontinuidad` | Tipo de discontinuidad y descripcion. |
| `puntos_criticos` | Puntos relevantes del analisis y motivo matematico. |
| `puntos_grafica` | Puntos basicos para representar la funcion. |
| `justificacion` | Explicacion matematica breve de la discontinuidad. |
| `pasos` | Procedimiento textual del analisis. |
| `pasos_rut` | Procedimiento de validacion del RUT. |

## RUTs verificados

| RUT | d8 | d8 % 3 | Caso esperado | Resultado esperado |
| --- | --- | --- | --- | --- |
| `17439150-5` | 0 | 0 | `discontinuidad_removible` | Limites laterales iguales y funcion no definida en `a`. |
| `11070434-8` | 4 | 1 | `discontinuidad_salto` | Limites laterales distintos. |
| `11100002-6` | 2 | 2 | `discontinuidad_infinita` | Limite izquierdo `-infinito`, derecho `infinito`. |

## Resumen de resultados

### `17439150-5`

- `tipo_caso`: `discontinuidad_removible`
- `a`: `4`
- Limite izquierdo: `5.0`
- Limite derecho: `5.0`
- Discontinuidad: `removible`

### `11070434-8`

- `tipo_caso`: `discontinuidad_salto`
- `a`: `0`
- Limite izquierdo: `1.0`
- Limite derecho: `7.0`
- Discontinuidad: `salto`

### `11100002-6`

- `tipo_caso`: `discontinuidad_infinita`
- `a`: `1`
- Limite izquierdo: `-infinito`
- Limite derecho: `infinito`
- Discontinuidad: `infinita`

## Verificacion adicional de salto

Se verifico tambien `11110001-2`, un caso donde `d2` y `d4` coinciden. Para
mantener una discontinuidad de salto real, el tramo derecho usa `d4 + 1`.

- `tipo_caso`: `discontinuidad_salto`
- `a`: `1`
- Limite izquierdo: `2.0`
- Limite derecho: `3.0`
- Discontinuidad: `salto`
