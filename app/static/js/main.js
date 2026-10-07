import { parseText } from './parser.js';
import { Typewriter } from './typewriter.js';
import { SoundEngine } from './blip.js';
import { SpriteManager, EMOTIONS } from './sprites.js';

let appConfig = null;
let typewriter = null;
let soundEngine = null;
let spriteManager = null;

async function loadConfig() {
  try {
    const response = await fetch('/api/config');
    if (response.ok) {
      return await response.json();
    }
    console.warn(`Aviso: /api/config respondio con status ${response.status}, usando valores de configuracion de respaldo.`);
  } catch (err) {
    console.warn('Aviso: no se pudo consultar /api/config, usando valores de respaldo:', err);
  }

  return {
    default_speed_ms: 40,
    default_volume: 0.5,
    default_voice: 'media',
  };
}

function bindControlInputs(elements) {
  const {
    speedSlider,
    speedValue,
    volumeSlider,
    volumeValue,
    voiceSelect,
    spriteSizeSelect,
    spriteContainer,
  } = elements;

  speedSlider.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    speedValue.textContent = `${val} ms`;
    typewriter.setSpeed(val);
  });

  volumeSlider.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    volumeValue.textContent = `${Math.round(val * 100)}%`;
    soundEngine.setVolume(val);
  });

  voiceSelect.addEventListener('change', (e) => {
    soundEngine.setVoice(e.target.value);
  });

  if (spriteSizeSelect && spriteContainer) {
    spriteSizeSelect.addEventListener('change', (e) => {
      const size = e.target.value;
      spriteContainer.style.width = `${size}px`;
      spriteContainer.style.height = `${size}px`;
    });
  }
}

function bindSpriteInputs() {
  EMOTIONS.forEach((emotion) => {
    const input = document.getElementById(`sprite-input-${emotion}`);
    const preview = document.getElementById(`sprite-preview-${emotion}`);
    if (!input) return;

    input.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
      spriteManager.setSpriteFile(emotion, file);

      if (preview) {
        if (file) {
          preview.textContent = '✓ Cargado';
          preview.style.color = '#0f0';
        } else {
          preview.textContent = 'Sin imagen';
          preview.style.color = '#888';
        }
      }
    });
  });
}

function bindActionButtons(elements) {
  const { textInput, btnSpeak, btnSkip, speedSlider } = elements;

  btnSpeak.addEventListener('click', () => {
    soundEngine.ensureContext();
    spriteManager.reset();

    const rawText = textInput.value;
    const events = parseText(rawText);

    btnSpeak.disabled = true;
    btnSkip.disabled = false;
    typewriter.start(events, Number(speedSlider.value));
  });

  btnSkip.addEventListener('click', () => {
    typewriter.skip();
  });
}

function setupUI(config) {
  const elements = {
    textInput: document.getElementById('text-input'),
    btnSpeak: document.getElementById('btn-speak'),
    btnSkip: document.getElementById('btn-skip'),
    speedSlider: document.getElementById('speed-slider'),
    speedValue: document.getElementById('speed-value'),
    volumeSlider: document.getElementById('volume-slider'),
    volumeValue: document.getElementById('volume-value'),
    voiceSelect: document.getElementById('voice-select'),
    spriteSizeSelect: document.getElementById('sprite-size-select'),
    dialogText: document.getElementById('dialog-text'),
    dialogSpriteImg: document.getElementById('dialog-sprite-img'),
    spritePlaceholder: document.getElementById('sprite-placeholder'),
    spriteContainer: document.getElementById('sprite-container'),
  };

  soundEngine = new SoundEngine();
  soundEngine.setVolume(config.default_volume);
  soundEngine.setVoice(config.default_voice);

  spriteManager = new SpriteManager({
    imgElement: elements.dialogSpriteImg,
    placeholderElement: elements.spritePlaceholder,
    containerElement: elements.spriteContainer,
  });
  spriteManager.reset();

  // Valores iniciales desde .env
  elements.speedSlider.value = config.default_speed_ms;
  elements.speedValue.textContent = `${config.default_speed_ms} ms`;
  elements.volumeSlider.value = config.default_volume;
  elements.volumeValue.textContent = `${Math.round(config.default_volume * 100)}%`;
  elements.voiceSelect.value = config.default_voice;

  typewriter = new Typewriter({
    targetElement: elements.dialogText,
    onChar: (char) => {
      soundEngine.playBlip(char);
    },
    onEmotion: (emotion) => {
      spriteManager.setEmotion(emotion);
    },
    onComplete: () => {
      elements.btnSpeak.disabled = false;
      elements.btnSkip.disabled = true;
    },
  });
  typewriter.setSpeed(config.default_speed_ms);

  bindControlInputs(elements);
  bindSpriteInputs();
  bindActionButtons(elements);

  const unlockAudio = () => {
    soundEngine.ensureContext();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
}

async function init() {
  try {
    appConfig = await loadConfig();
    setupUI(appConfig);
  } catch (error) {
    console.error('Error inicializando la aplicación:', error);
  }
}

document.addEventListener('DOMContentLoaded', init);
