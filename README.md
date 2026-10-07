# Undertale Dialog Box

Aplicación web interactiva que recrea la clásica caja de diálogo de **Undertale**, mostrando texto letra por letra con sonido retro de 8 bits (onda cuadrada), presets de voz y cambio reactivo de sprites con animaciones según etiquetas en el texto.

---

## Características

- **Caja de Diálogo Undertale:** Estética fiel al juego original con fondo negro, borde blanco de 4px, renderizado pixelado y tipografía retro *Press Start 2P* autoalojada (sin CDNs externos).
- **Efecto Typewriter:**
  - Animación secuencial carácter por carácter.
  - Pausas automáticas y orgánicas tras signos de puntuación (`.`, `,`, `!`, `?`).
  - Botón **Saltar** para desplegar el texto completo de inmediato.
- **Sonido de 8 bits (Web Audio API):**
  - Generación de audio en tiempo real mediante osciladores de onda cuadrada (`square`).
  - Microenvolvente para evitar chasquidos (*clicks/pops*) y variación aleatoria de tono (*pitch jitter*).
  - Los espacios en blanco y saltos de línea **no emiten sonido**.
  - Cumple la política de *autoplay* de los navegadores (el `AudioContext` se inicializa tras la primera interacción).
  - 4 presets de voz:
    - **Grave** (~95 Hz, estilo Sans / Asgore)
    - **Media** (~210 Hz, estilo Toriel / estándar)
    - **Aguda** (~420 Hz, estilo Papyrus / Alphys)
    - **Robótica** (~140 Hz con modulación metálica, estilo Mettaton)
- **Sprites Reactivos y Animados:**
  - Carga local de imágenes en el navegador mediante Object URLs (no se suben al servidor).
  - Soporte de 5 emociones: `neutral`, `feliz`, `enojado`, `triste`, `sorprendido`.
  - Fallback automático al sprite `neutral` si falta una emoción.
  - Tolerancia a etiquetas desconocidas (se ignoran sin romper el flujo).
  - Efecto de **rebote / saltito** elástico al cambiar de expresión.
  - Selector de tamaño de sprite: *Mediano (140px)*, *Grande (180px)* o *Gigante (220px)*.

---

## Estructura del Proyecto

```text
├── app/
│   ├── main.py               # Servidor FastAPI (sirve estáticos, / y /api/config)
│   ├── config.py             # Carga y validación estricta de variables .env
│   ├── templates/
│   │   └── index.html        # Plantilla principal de la interfaz
│   └── static/
│       ├── css/
│       │   ├── input.css     # Entrada de estilos Tailwind y reglas personalizadas
│       │   └── output.css    # CSS compilado y minificado con Tailwind CLI
│       ├── fonts/
│       │   └── PressStart2P-Regular.ttf # Fuente pixelada autoalojada
│       └── js/
│           ├── parser.js     # Parser puro de texto y etiquetas {emocion}
│           ├── typewriter.js # Motor de animación de texto y pausas
│           ├── blip.js       # Sintetizador de audio Web Audio API
│           ├── sprites.js    # Gestor de sprites en memoria local y animaciones
│           └── main.js       # Orquestador e interactividad de la UI
├── .env.example              # Plantilla de variables de entorno
├── requirements.txt          # Dependencias de Python
├── package.json              # Scripts de compilación de Tailwind CSS
├── tailwind.config.js        # Configuración de Tailwind CLI
└── README.md
```

---

## Requisitos Previos

- **Python:** 3.11 o superior.
- **Node.js:** v18 o superior (solo requerido si deseas recompilar estilos con Tailwind CLI).

---

## Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd webTuber
   ```

2. **Instalar dependencias de Python:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar el entorno:**
   Copia el archivo `.env.example` como `.env`:
   ```bash
   cp .env.example .env
   ```
   *Variables configurables en `.env`:*
   - `HOST`: Dirección del servidor (ej. `127.0.0.1`).
   - `PORT`: Puerto de escucha (ej. `8000`).
   - `DEFAULT_SPEED_MS`: Velocidad del typewriter en milisegundos (ej. `40`).
   - `DEFAULT_VOLUME`: Volumen inicial entre 0.0 y 1.0 (ej. `0.5`).
   - `DEFAULT_VOICE`: Preset de voz inicial (`grave`, `media`, `aguda`, `robotica`).

---

## Ejecución

Inicia el servidor backend con Uvicorn:

```bash
python -m uvicorn app.main:app --reload
```
*(O simplemente ejecuta `python app/main.py`).*

Abre en tu navegador:
```text
http://127.0.0.1:8000/
```

---

## Compilación de Estilos (Opcional)

Si realizas modificaciones en `input.css` o agregas nuevas clases de Tailwind, puedes recompilar el CSS con:

```bash
# Instalar Tailwind CLI
npm install

# Compilar CSS minificado
npm run build:css

# O compilar en modo observación (watch)
npm run watch:css
```

---

## Sintaxis de Etiquetas en el Diálogo

Puedes insertar etiquetas entre llaves `{emocion}` en cualquier parte del texto. El diálogo ocultará la etiqueta y activará el sprite correspondiente en ese punto:

```text
{feliz}¡Hola humano!{triste}... pensé que éramos amigos.{enojado} ¡Prepárate para luchar!
```

- Si una emoción no tiene imagen cargada, se usará automáticamente la imagen asignada a `{neutral}`.
- Si no hay ningún sprite cargado, la aplicación funciona con normalidad sin generar errores.

