/**
 * Motor de efecto typewriter con soporte para pausas en puntuación,
 * eventos de emoción y función de salto inmediato.
 */
export class Typewriter {
  constructor({
    targetElement,
    onChar = () => {},
    onEmotion = () => {},
    onComplete = () => {},
  }) {
    this.targetElement = targetElement;
    this.onChar = onChar;
    this.onEmotion = onEmotion;
    this.onComplete = onComplete;

    this.isRunning = false;
    this.timeoutId = null;
    this.events = [];
    this.currentIndex = 0;
    this.speedMs = 40;
  }

  setSpeed(speedMs) {
    const parsed = Number(speedMs);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      this.speedMs = parsed;
    }
  }

  start(events, speedMs) {
    this.stop();
    if (speedMs !== undefined) {
      this.setSpeed(speedMs);
    }

    this.events = events;
    this.currentIndex = 0;
    this.isRunning = true;
    this.targetElement.textContent = '';
    this.step();
  }

  stop() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.isRunning = false;
  }

  skip() {
    if (!this.isRunning) {
      return;
    }

    this.stop();

    while (this.currentIndex < this.events.length) {
      const event = this.events[this.currentIndex];
      if (event.tipo === 'char') {
        this.targetElement.textContent += event.valor;
      } else if (event.tipo === 'emocion') {
        this.onEmotion(event.valor);
      }
      this.currentIndex += 1;
    }

    this.onComplete();
  }

  getPunctuationDelay(char) {
    if (char === '.' || char === '!' || char === '?') {
      return this.speedMs * 5;
    }
    if (char === ',' || char === ';' || char === ':') {
      return this.speedMs * 2.5;
    }
    return 0;
  }

  step() {
    if (!this.isRunning) {
      return;
    }

    if (this.currentIndex >= this.events.length) {
      this.isRunning = false;
      this.onComplete();
      return;
    }

    const event = this.events[this.currentIndex];
    this.currentIndex += 1;

    if (event.tipo === 'emocion') {
      this.onEmotion(event.valor);
      // Las etiquetas no producen delay ni sonido
      this.step();
      return;
    }

    if (event.tipo === 'char') {
      this.targetElement.textContent += event.valor;
      this.onChar(event.valor);

      const delay = this.speedMs + this.getPunctuationDelay(event.valor);
      this.timeoutId = setTimeout(() => this.step(), delay);
    }
  }
}

