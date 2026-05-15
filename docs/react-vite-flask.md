# React + Vite con Flask

Este proyecto puede usar Flask como backend/API y React + Vite como frontend.
La estructura recomendada queda dentro del mismo repositorio:

```text
EID-MAT1186/
  backend/            # Backend Flask y logica Python
    app.py            # Punto de entrada de Flask
    api/              # Endpoints /api
    services/         # Casos de uso del backend
    infra/            # Arranque del frontend de desarrollo
    requirements.txt  # Dependencias Python
  frontend/           # Aplicacion React + Vite
    package.json      # Dependencias JavaScript
    src/
```

## Instalacion inicial

La carpeta `frontend/` fue creada con:

```bash
pnpm create vite frontend --template react
cd frontend
pnpm install
```

## Ejecutar en desarrollo

Desde una sola terminal:

```bash
cd EID-MAT1186\backend
..\.venv\Scripts\python.exe app.py
```

Ese comando inicia Flask en `http://127.0.0.1:5000` y React/Vite. Vite mostrara en consola la URL disponible, normalmente `http://127.0.0.1:5173`.

Si solo necesita iniciar el frontend manualmente:

```bash
cd EID-MAT1186\frontend
pnpm run dev
```

Luego abrir:

```text
http://127.0.0.1:5173/
```

## Conexion entre React y Flask

React llama a rutas como:

```js
fetch('/api/validar_rut')
fetch('/api/procesar')
```

Vite redirige esas llamadas al backend Flask mediante el proxy configurado en
`frontend/vite.config.js`:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:5000',
      changeOrigin: true,
    },
  },
}
```

Asi se evita configurar CORS mientras desarrollamos localmente.

## Build de produccion

Para verificar que React compila:

```bash
cd EID-MAT1186\frontend
pnpm run build
```

Esto genera `frontend/dist/`. Esa carpeta no debe subirse a GitHub porque se
puede regenerar.
