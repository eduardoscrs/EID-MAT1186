# S3-01 Base de trabajo para semana 3

La base de trabajo de semana 3 queda organizada sobre la estructura modular
existente del proyecto:

```text
backend/
|-- api/
|   `-- limites_routes.py
`-- limites/
    |-- analisis.py
    |-- constructor.py
    |-- continuidad.py
    |-- funciones.py
    |-- graficas.py
    |-- service.py
    `-- tablas.py
```

## Responsabilidades por archivo

| Archivo | Responsabilidad |
| --- | --- |
| `backend/api/limites_routes.py` | Expone el endpoint HTTP del modulo de limites. |
| `backend/limites/service.py` | Orquesta validacion de RUT, construccion de funcion, limites, continuidad, tabla y puntos de grafica. |
| `backend/limites/constructor.py` | Construye la funcion por tramos desde los digitos del RUT. |
| `backend/limites/analisis.py` | Calcula limites laterales y existencia del limite. |
| `backend/limites/continuidad.py` | Determina continuidad y tipo de discontinuidad. |
| `backend/limites/funciones.py` | Evalua manualmente la funcion generada. |
| `backend/limites/tablas.py` | Genera valores cercanos al punto de analisis. |
| `backend/limites/graficas.py` | Genera puntos para representar la funcion. |

## Criterio de consolidacion

- El modulo de limites queda integrado en el backend Flask.
- La validacion de RUT se reutiliza desde `backend/common/rut.py`.
- El endpoint trabaja con datos generados desde RUT, no con funciones libres.
- Los calculos se implementan manualmente, sin librerias matematicas externas.
- La respuesta del backend sigue un contrato JSON estable para la interfaz.
