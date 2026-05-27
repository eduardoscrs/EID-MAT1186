"""Clasificacion de continuidad y tipos de discontinuidad."""


def analizar_continuidad(datos_funcion, limites_laterales, valor_punto):
    tipo_caso = datos_funcion["tipo_caso"]

    if not limites_laterales["existe"]:
        if tipo_caso == "discontinuidad_infinita":
            return _resultado(
                False,
                "El limite no existe porque los limites laterales son infinitos.",
                "infinita",
                "La funcion presenta una asintota vertical en el punto de analisis.",
            )

        return _resultado(
            False,
            "El limite no existe porque los limites laterales son distintos.",
            "salto",
            "La funcion cambia de valor al acercarse por izquierda y derecha.",
        )

    if not valor_punto["definida"]:
        return _resultado(
            False,
            "El limite existe, pero la funcion no esta definida en el punto.",
            "removible",
            "La discontinuidad se puede remover definiendo la funcion con el valor del limite.",
        )

    if valor_punto["valor"] == limites_laterales["valor"]:
        return _resultado(
            True,
            "El limite existe y coincide con el valor de la funcion en el punto.",
            "ninguna",
            "La funcion es continua en el punto de analisis.",
        )

    return _resultado(
        False,
        "El limite existe, pero no coincide con el valor de la funcion en el punto.",
        "removible",
        "La discontinuidad se puede corregir redefiniendo el valor de la funcion en el punto.",
    )


def _resultado(es_continua, conclusion, tipo_discontinuidad, descripcion):
    return {
        "continuidad": {
            "es_continua": es_continua,
            "conclusion": conclusion,
        },
        "discontinuidad": {
            "tipo": tipo_discontinuidad,
            "descripcion": descripcion,
        },
    }
