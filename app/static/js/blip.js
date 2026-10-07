/**
 * Motor de audio de 8 bits usando Web Audio API con osciladores de onda cuadrada.
 * Cumple con la política de autoplay al iniciar/reanudar el AudioContext tras la interacción del usuario.
 */

export const VOICE_PRESETS = {
  grave: {
    name: 'Grave',
    baseFreq: 95,
    jitter: 8,
    duration: 0.05,
  },
  media: {
    name: 'Media',
    baseFreq: 210,
    jitter: 15,
    duration: 0.045,
  },
  aguda: {
    name: 'Aguda',
    baseFreq: 420,
    jitter: 25,
    duration: 0.04,
  },
  robotica: {
    name: 'Robótica',
    baseFreq: 140,
    jitter: 0,
    duration: 0.055,
    metallicDetune: 1200,
  },
};

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.currentVoice = 'media';
    this.volume = 0.5;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    const parsed = Number(val);
    if (!Number.isNaN(parsed)) {
      this.volume = Math.max(0, Math.min(1, parsed));
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      }
    }
  }

  setVoice(presetKey) {
    if (VOICE_PRESETS[presetKey]) {
      this.currentVoice = presetKey;
    }
  }

  playBlip(char) {
    // Los espacios y caracteres invisibles NO suenan
    if (!char || char.trim() === '') {
      return;
    }

    try {
      this.ensureContext();
      if (!this.ctx || this.volume <= 0) {
        return;
      }

      const preset = VOICE_PRESETS[this.currentVoice] || VOICE_PRESETS.media;
      const now = this.ctx.currentTime;
      const duration = preset.duration;

      // Calcular frecuencia con ligera variación aleatoria (pitch jitter)
      const randomOffset = (Math.random() * 2 - 1) * preset.jitter;
      const freq = Math.max(40, preset.baseFreq + randomOffset);

      // Oscilador de onda cuadrada de 8-bits
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);

      if (preset.metallicDetune) {
        // Efecto robótico metálico modulando frecuencia rápidamente
        osc.frequency.linearRampToValueAtTime(freq * 1.5, now + duration * 0.5);
        osc.frequency.linearRampToValueAtTime(freq, now + duration);
      }

      // Envolvente de volumen (Attack rápido, Decay a 0 sin 'pop')
      const noteGain = this.ctx.createGain();
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(1.0, now + 0.004);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch (err) {
      console.warn('No se pudo reproducir el blip de audio:', err);
    }
  }
}

