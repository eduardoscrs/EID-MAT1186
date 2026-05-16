# S2-04 Manejo de errores en API de RUT

Este documento resume el formato de respuesta del backend ante entradas
invalidas o uso incorrecto de los endpoints de RUT.

## Endpoints revisados

- `POST /api/validar_rut`
- `POST /api/procesar`

## Formato de error

Los errores esperados devuelven un JSON consistente:

```json
{
  "valido": false,
  "codigo": "rut_largo_incorrecto",
  "error": "El cuerpo del RUT debe tener 7 u 8 digitos.",
  "mensaje": "El cuerpo del RUT debe tener 7 u 8 digitos.",
  "pasos": []
}
```

## Codigos definidos

| Codigo | Caso |
| --- | --- |
| `request_json_invalido` | La solicitud no viene como JSON valido. |
| `rut_vacio` | No se envio RUT para validar. |
| `rut_caracteres_invalidos` | El RUT contiene caracteres no permitidos. |
| `rut_largo_incorrecto` | El cuerpo no tiene 7 u 8 digitos. |
| `rut_empresa` | El cuerpo corresponde a empresa, no persona natural. |
| `rut_cuerpo_cero` | El cuerpo del RUT es cero. |
| `rut_dv_incorrecto` | El digito verificador no coincide o no supera validacion previa. |
| `rut_no_validado` | Se intento usar `/api/procesar` sin validar el RUT antes en la sesion. |
| `rut_error_interno` | Error inesperado durante validacion. |
| `conica_error_interno` | Error inesperado durante procesamiento de conica. |

## Casos verificados

| Caso | Resultado esperado |
| --- | --- |
| RUT valido `11070434-8` | HTTP 200, `codigo: rut_valido`, `valido: true`. |
| DV incorrecto `11070434-9` | HTTP 200, `codigo: rut_dv_incorrecto`, `valido: false`, conserva pasos. |
| RUT vacio | HTTP 400, `codigo: rut_vacio`. |
| RUT de empresa | HTTP 400, `codigo: rut_empresa`. |
| Largo incorrecto | HTTP 400, `codigo: rut_largo_incorrecto`. |
| Caracteres invalidos | HTTP 400, `codigo: rut_caracteres_invalidos`. |
| Request no JSON | HTTP 400, `codigo: request_json_invalido`. |
| Uso directo de `/api/procesar` sin sesion validada | HTTP 400, `codigo: rut_no_validado`. |

## Nota de compatibilidad

El caso de digito verificador incorrecto se mantiene como HTTP 200 con
`valido: false`, porque el frontend necesita recibir los pasos de validacion y
mostrar el mensaje sin tratarlo como error tecnico.
