## 1.Reglas generales
Responder siempre en español.
Ser conciso: explicar el qué y el por qué, sin relleno.
No crear archivos .log.
Antes de escribir código nuevo, escanear el proyecto para verificar si la
funcionalidad ya existe. Aplicar DRY estrictamente.
Función más larga permitida: 150 líneas. Si supera eso, dividir antes de continuar.
Archivo más largo permitido: 400 líneas. Si supera eso, modularizar.
No hardcodear puertos, IPs, credenciales ni URLs. Todo va en .env.
El agente no puede crear ni modificar archivos de código hasta que el plan este aprobado por el usuario (yo)

# Tarea: App estilo Undertale (caja de diálogo con sprites y sonido 8 bits)

Sigue estrictamente mi agent.MD. NO crees ni modifiques archivos de código hasta que yo apruebe tu plan.
**Primer paso:** responde solo con un plan (archivos, responsabilidad de cada uno, orden de implementación). Espera mi "aprobado".

## Objetivo
Web app donde escribo texto y se muestra letra por letra en una caja de diálogo estilo Undertale, con un sonido de 8 bits por letra, y un sprite de personaje que cambia según etiquetas en el texto.

## Stack (no negociable)
- Backend: FastAPI (Python 3.11+) + uvicorn. Solo sirve HTML/estáticos y `GET /api/config`.
- Frontend: HTML + JavaScript vanilla con módulos ES (sin frameworks, sin bundler).
- Estilos: Tailwind CSS compilado con Tailwind CLI (sin CDN). Estética clásica Undertale: fondo negro, caja con borde blanco de 4px, texto blanco.
- Fuente pixelada AUTOALOJADA en /static/fonts (Press Start 2P o VT323). Sin enlaces externos.
- `aiohttp` solo si hay llamadas HTTP externas; aquí NO hay, no lo uses.
- Todo valor configurable va en `.env` (HOST, PORT, velocidad por defecto, volumen por defecto, voz por defecto). Crea `.env.example`. Nada hardcodeado.

## Funcionalidad
1. **Caja de diálogo:** sprite a la izquierda, texto a la derecha, estilo Undertale.
2. **Typewriter:** muestra el texto letra por letra. Pausa extra tras `. , ! ?`. Botón "Saltar" que muestra todo el texto de golpe.
3. **Sonido:** Web Audio API con oscilador de onda cuadrada (sin archivos de audio). Un blip por letra visible; los espacios NO suenan. Pequeña variación aleatoria de tono. El AudioContext se crea/reanuda en el primer clic del usuario (política de autoplay). Presets de voz: grave, media, aguda, robótica.
4. **Sprites por emoción:** el usuario carga imágenes para: neutral, feliz, enojado, triste, sorprendido. La carga es solo en el navegador (FileReader/object URL), NO se suben al servidor. Usar `image-rendering: pixelated`. Si falta la imagen de una emoción, usar neutral.
5. **Etiquetas en el texto:** `{feliz}¡Hola!{enojado} ¿Quién eres?` Las etiquetas no se muestran ni suenan; cambian el sprite en ese punto. Etiqueta desconocida: se ignora sin romper.
6. **Controles:** textarea de entrada, botón "Hablar", sliders de velocidad y volumen, selector de voz, cargadores de sprites.

## Estructura de archivos
app/main.py, app/config.py, app/static/js/{typewriter,blip,sprites,parser,main}.js,
app/static/css/ (entrada y salida de Tailwind), app/templates/index.html, .env.example, requirements.txt

## Restricciones de calidad
- Máx. 150 líneas por función y 400 por archivo. DRY: revisa el proyecto antes de crear algo.
- `parser.js` debe separar texto y etiquetas en una lista de eventos `{tipo:"char"|"emocion", valor}` y ser independiente del DOM.
- No crees archivos .log. Responde en español y sé conciso.

## Criterios de aceptación
- Con `uvicorn` levantado, cargo 2 sprites, escribo `{feliz}Hola{triste}...adiós` y veo el cambio de sprite en el momento correcto con sonido por letra.
- Sin sprites cargados no hay errores en consola.
- El sonido no suena en espacios ni en etiquetas.
- Ningún puerto/URL/valor por defecto está hardcodeado en el código.

## Entrega
Implementa por fases y detente al final de cada una para que yo pruebe:
Fase 1 backend + .env + página vacía → Fase 2 parser + typewriter → Fase 3 sonido → Fase 4 sprites → Fase 5 estilos y pulido.