# EID-MAT1186 - Introducción al Cálculo
## Evaluación Integrada de Desempeño N°1: Análisis y Modelamiento de Secciones Cónicas y Funciones por Tramos

### Descripción del Proyecto

Este proyecto representa el **25%** de la calificación final del curso MAT1186 - Introducción al Cálculo. Integra contenidos matemáticos con programación, razonamiento lógico y trabajo colaborativo.

### Estructura del Proyecto

La aplicación vive directamente en la raíz del repositorio para que GitHub muestre la estructura principal sin una carpeta intermedia genérica.

```text
.
├── app.py                  # Aplicación web Flask
├── main.py                 # Ejecución por consola
├── requirements.txt        # Dependencias directas del proyecto
├── algebra/                # Transformaciones algebraicas
├── core/                   # Validación de RUT, ecuación y clasificación
├── geometria/              # Análisis geométrico por tipo de cónica
├── visualizacion/          # Generación de puntos y gráficos auxiliares
├── templates/              # Vistas HTML
├── static/                 # CSS y JavaScript de la interfaz
├── utils/                  # Utilidades compartidas
└── docs/                   # Enunciado y documentación de apoyo
```

### Ejecución Local

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
flask --app app run --debug
```

Luego abra `http://127.0.0.1:5000` en el navegador.

Para ejecutar la versión por consola:

```bash
python main.py
```

### Objetivo Principal

Desarrollar una aplicación en **Python** que:
1. **Valide RUTs chilenos** usando el algoritmo oficial del módulo 11
2. **Construya automáticamente** una ecuación general de segundo grado (Ax² + By² + Cx + Dy + E = 0) a partir de los dígitos del RUT
3. **Clasifique la cónica** (circunferencia, elipse, hipérbola o parábola)
4. **Transforme a forma canónica** mostrando paso a paso el procedimiento algebraico
5. **Grafique la cónica** en el plano cartesiano
6. **Analice funciones por tramos** generadas desde el RUT, estudiando límites laterales, continuidad y discontinuidades

### Fases de Trabajo

#### Fase 1: Fundamento Matemático
- Validación de RUT mediante dígito verificador
- Construcción de ecuación general a partir de dígitos del RUT
- Aplicación de reglas de ajuste (hipérbolas, circunferencias, parábolas)
- Clasificación automática de cónicas
- Transformación entre ecuación general y forma canónica

#### Fase 2: Desarrollo del Programa
Requerimientos principales:
- Ingreso y validación de RUT chileno válido
- Mostrar procedimiento paso a paso de validación
- Extracción correcta de dígitos del RUT
- Construcción de ecuación general con procedimiento visible
- Determinación automática del tipo de cónica
- Transformación a forma canónica (paso a paso)
- Procedimiento inverso (canónica a general)
- Graficación correcta de la cónica
- Interfaz intuitiva y visualmente cuidada

**Restricción importante:** Prohibido el uso de librerías matemáticas (numpy, math, sympy). Todos los cálculos deben ser implementados manualmente.

#### Fase 3: Desarrollo Profesional
- Código modular y organizado (no un único archivo)
- Distribución real de tareas entre integrantes
- Uso de GitHub como control de versiones
- Estructura de organización interna con líder designado
- Código de ética propio para regular colaboración

### Competencias a Desarrollar

**Genéricas:**
- Actuación ética
- Aprendizaje autónomo

**Específicas:**
- Aplica ciencias de la Ingeniería (implementa modelos matemáticos, razonamiento lógico deductivo)

**Resultado de Aprendizaje (RA1):**
- Implementa, conoce y maneja elementos de geometría analítica y límites aplicando aprendizaje autónomo

### Tecnologías Permitidas
- Python
- Flask para la interfaz web
- Matplotlib para gráficos auxiliares de la versión por consola
- Git/GitHub para control de versiones

El código del proyecto no importa `numpy`, `math` ni `sympy`; los cálculos matemáticos se implementan manualmente.
