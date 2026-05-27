# EID-MAT1186 - Introduccion al Calculo
## Evaluacion Integrada de Desempeno Nro. 1: Analisis y Modelamiento de Secciones Conicas y Funciones por Tramos

### Descripcion del Proyecto

Este proyecto representa el **25%** de la calificacion final del curso MAT1186 - Introduccion al Calculo. Integra contenidos matematicos con programacion, razonamiento logico y trabajo colaborativo.

### Estructura del Proyecto

La aplicacion separa el backend Flask del frontend React para que cada parte tenga sus dependencias y comandos propios.

```text
.
|-- backend/                # API Flask y logica matematica
|   |-- app.py              # Punto de entrada de Flask
|   |-- requirements.txt    # Dependencias Python
|   |-- api/                # Rutas HTTP y respuestas JSON
|   |-- common/             # Validacion de RUT y utilidades compartidas
|   |-- conicas/            # Secciones conicas: algebra, clasificacion, geometria y servicios
|   |-- limites/            # Funciones por tramos, limites, continuidad y discontinuidades
|   `-- infra/              # Arranque y cierre del frontend de desarrollo
|-- frontend/               # Interfaz React + Vite
|   `-- src/
|       |-- components/     # Componentes compartidos
|       |-- modules/
|       |   |-- conicas/    # UI, API, canvas y utilidades de conicas
|       |   `-- limites/    # UI y API del modulo de limites
|       |-- constants/      # Textos/listas compartidas
|       `-- utils/          # Render y transformacion de texto matematico
`-- docs/                   # Enunciado y documentacion de apoyo
```

### Ejecucion Local

Backend Flask:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements.txt
cd backend
python app.py
```

Ese comando inicia el backend Flask en `http://127.0.0.1:5000` y el frontend React/Vite. Vite mostrara en consola la URL disponible, normalmente `http://127.0.0.1:5173`.

Para instalar las dependencias del frontend la primera vez:

```bash
cd frontend
pnpm install
```

Si `pnpm` no esta disponible como comando directo, use Corepack:

```bash
corepack pnpm install
```

Luego abra la URL que muestre Vite en el navegador. El frontend se comunica con Flask mediante el proxy configurado en Vite.

### Objetivo Principal

Desarrollar una aplicacion en **Python** que:
1. **Valide RUTs chilenos** usando el algoritmo oficial del modulo 11
2. **Construya automaticamente** una ecuacion general de segundo grado (Ax^2 + By^2 + Cx + Dy + E = 0) a partir de los digitos del RUT
3. **Clasifique la conica** (circunferencia, elipse, hiperbola o parabola)
4. **Transforme a forma canonica** mostrando paso a paso el procedimiento algebraico
5. **Grafique la conica** en el plano cartesiano
6. **Analice funciones por tramos** generadas desde el RUT, estudiando limites laterales, continuidad y discontinuidades

### Fases de Trabajo

#### Fase 1: Fundamento Matematico
- Validacion de RUT mediante digito verificador
- Construccion de ecuacion general a partir de digitos del RUT
- Aplicacion de reglas de ajuste (hiperbolas, circunferencias, parabolas)
- Clasificacion automatica de conicas
- Transformacion entre ecuacion general y forma canonica

#### Fase 2: Desarrollo del Programa
Requerimientos principales:
- Ingreso y validacion de RUT chileno valido
- Mostrar procedimiento paso a paso de validacion
- Extraccion correcta de digitos del RUT
- Construccion de ecuacion general con procedimiento visible
- Determinacion automatica del tipo de conica
- Transformacion a forma canonica (paso a paso)
- Procedimiento inverso (canonica a general)
- Graficacion correcta de la conica
- Interfaz intuitiva y visualmente cuidada

**Restriccion importante:** Prohibido el uso de librerias matematicas (numpy, math, sympy). Todos los calculos deben ser implementados manualmente.

#### Fase 3: Desarrollo Profesional
- Codigo modular y organizado (no un unico archivo)
- Distribucion real de tareas entre integrantes
- Uso de GitHub como control de versiones
- Estructura de organizacion interna con lider designado
- Codigo de etica propio para regular colaboracion

### Competencias a Desarrollar

**Genericas:**
- Actuacion etica
- Aprendizaje autonomo

**Especificas:**
- Aplica ciencias de la Ingenieria (implementa modelos matematicos, razonamiento logico deductivo)

**Resultado de Aprendizaje (RA1):**
- Implementa, conoce y maneja elementos de geometria analitica y limites aplicando aprendizaje autonomo

### Tecnologias Permitidas
- Python
- Flask para el backend/API
- React + Vite para la interfaz web
- Git/GitHub para control de versiones

El codigo del proyecto no importa `numpy`, `math` ni `sympy`; los calculos matematicos se implementan manualmente.
