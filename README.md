# EID-MAT1186 - Introduccion al Calculo

Aplicacion web para la Evaluacion Integrada de Desempeno Nro. 1 de
MAT1186. El proyecto valida RUTs chilenos y, a partir de sus digitos,
construye evidencia matematica para dos modulos: secciones conicas y funciones
por tramos con limites.

La solucion separa un backend Flask, encargado de la validacion y los calculos,
de un frontend React/Vite, encargado de la experiencia visual, graficos,
procedimientos y campos de defensa oral.

## Estado actual

La rama `main` contiene la version integrada del proyecto:

- API Flask con endpoints para validar RUT, procesar conicas y analizar
  limites.
- Frontend React/Vite con navegacion entre los modulos `Conicas` y `Limites`.
- Validacion de RUT chileno con algoritmo de modulo 11, limpieza de formato,
  control de largo, caracteres invalidos y rechazo de RUTs de empresa.
- Desarrollo matematico con KaTeX para validacion, construccion algebraica,
  forma canonica y procedimiento inverso.
- Graficos en canvas para conicas y limites, con escalas ajustadas a los
  elementos relevantes.
- Campos vacios para defensa oral: al ingresar respuestas y validar con Enter,
  la interfaz marca correcto/incorrecto y revela los valores asociados.
- Recalculo automatico al cambiar entre modulos cuando ya existe un RUT valido.

## Funcionalidades

### Validacion RUT

- Acepta entradas con o sin puntos y guion.
- Calcula el digito verificador mediante modulo 11.
- Muestra el procedimiento paso a paso.
- Expone el cuerpo del RUT, el DV y los digitos usados por los modulos.

### Conicas

- Extrae los digitos del RUT.
- Construye la ecuacion general:

```text
Ax^2 + By^2 + Cx + Dy + E = 0
```

- Clasifica la conica como circunferencia, elipse, parabola o hiperbola.
- Transforma la ecuacion general a forma canonica.
- Muestra el procedimiento inverso desde forma canonica a ecuacion general.
- Calcula elementos geometricos: centro o vertice, vertices, focos, ejes,
  radio, excentricidad, directriz, asintotas o lado recto segun corresponda.
- Grafica la conica y sus elementos principales en el plano cartesiano.
- Incluye campos de defensa para completar elementos sin ver inicialmente todos
  los resultados.

### Limites

- Genera una funcion por tramos desde el mismo RUT validado.
- Define el punto de analisis como `a = d3`.
- Selecciona el caso de discontinuidad con la regla `d8 % 3`.
- Calcula limites laterales, existencia del limite, valor de la funcion en `a`,
  continuidad y tipo de discontinuidad.
- Muestra tabla de valores alrededor del punto critico.
- Grafica el comportamiento por izquierda y derecha con ejes, punto critico y
  lineas auxiliares.
- Incluye campos de defensa para limites laterales, continuidad,
  removibilidad/irremovibilidad y justificacion.

## Restriccion matematica

El proyecto no usa librerias externas de algebra o calculo numerico como
`numpy`, `math`, `sympy`, `scipy` o `pandas`. Los procedimientos matematicos
del backend se implementan manualmente.

## Tecnologias

- Python 3
- Flask
- React 19
- Vite
- Tailwind CSS
- KaTeX
- pnpm

## Estructura

```text
.
|-- backend/
|   |-- app.py                  # Punto de entrada de Flask
|   |-- requirements.txt        # Dependencias Python
|   |-- api/                    # Rutas HTTP
|   |-- common/                 # Validacion de RUT y utilidades compartidas
|   |-- conicas/                # Algebra, clasificacion, geometria y servicios
|   |-- limites/                # Funciones por tramos, limites y continuidad
|   `-- infra/                  # Arranque del frontend de desarrollo
|-- frontend/
|   |-- package.json            # Scripts y dependencias del frontend
|   |-- vite.config.js          # Proxy local hacia Flask
|   `-- src/
|       |-- components/         # Componentes compartidos
|       |-- modules/
|       |   |-- conicas/        # UI, API, canvas y utilidades de conicas
|       |   `-- limites/        # UI, API, canvas y utilidades de limites
|       |-- constants/          # Textos y listas compartidas
|       `-- utils/              # Formato numerico y render matematico
|-- docs/                       # Pauta y enunciado original en PDF
|-- progreso.md                 # Registro de avance y tareas
`-- README.md
```

## Instalacion

### Backend

macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements.txt
```

Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
```

### Frontend

El frontend usa `pnpm`. Si no esta disponible, activar Corepack:

```bash
corepack enable
```

Instalar dependencias:

```bash
cd frontend
pnpm install
```

## Ejecucion local

Forma recomendada:

```bash
cd backend
python app.py
```

Al ejecutar `backend/app.py`, Flask inicia el backend en
`http://127.0.0.1:5000` y tambien intenta levantar Vite automaticamente. La URL
del frontend aparece en consola, normalmente `http://127.0.0.1:5173`.

Si necesita iniciar el frontend manualmente en otra terminal:

```bash
cd frontend
pnpm run dev
```

## Scripts utiles

Desde `frontend/`:

```bash
pnpm run dev
pnpm run lint
pnpm run build
pnpm run preview
```

## API

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| `GET` | `/` | Comprueba que Flask esta activo. |
| `POST` | `/api/validar_rut` | Valida un RUT y devuelve pasos de modulo 11. |
| `POST` | `/api/conicas` | Genera ecuacion, clasificacion, forma canonica, elementos y grafica de conica. |
| `POST` | `/api/limites` | Genera funcion por tramos, limites, continuidad, tabla y muestras para grafica. |

Ejemplo de cuerpo JSON:

```json
{
  "rut": "21750677-8"
}
```

## Casos de prueba

Los siguientes RUTs estan disponibles como ejemplos dentro de la interfaz.

### Conicas

| Tipo esperado | RUT valido |
| --- | --- |
| Circunferencia | `11231420-2` |
| Elipse | `12314664-6` |
| Parabola | `12314568-2` |
| Hiperbola | `12314667-0` |

### Limites

| Caso esperado | RUT valido |
| --- | --- |
| Discontinuidad removible | `11231420-2` |
| Discontinuidad de salto | `12314664-6` |
| Discontinuidad infinita | `12314568-2` |

## Defensa oral

La interfaz incluye campos inicialmente vacios para simular la defensa. El
estudiante debe completar valores como centro, focos, limites laterales,
continuidad o justificacion. Al presionar Enter, la app valida contra el
calculo interno:

- Borde verde: respuesta correcta.
- Borde rojo: respuesta incorrecta.
- Resultado revelado: aparece solo cuando el campo asociado fue respondido
  correctamente.

En campos de texto largo, Enter conserva el salto de linea; para validar se usa
`Ctrl + Enter` o `Cmd + Enter`.

## Documentacion disponible

La carpeta `docs/` conserva solo los documentos fuente del encargo:

- `docs/enunciado-eid-introduccion-calculo.pdf`
- `docs/Pauta_de_Evaluación_EID___Introducción_al_Calculo (1).pdf`

El avance operativo del proyecto se registra en `progreso.md`.

## Verificacion antes de entregar

Recomendado antes de una defensa o entrega:

```bash
cd frontend
pnpm run lint
pnpm run build
```

Luego probar visualmente:

- Validacion de RUT.
- Un caso de cada conica.
- Un caso removible, de salto e infinito en limites.
- Campos de defensa en ambos modulos.
- Cambio entre `Conicas` y `Limites` sin tener que volver a construir desde
  cero.
