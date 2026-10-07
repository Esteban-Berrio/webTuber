/**
 * Administrador de sprites por emoción para la caja de diálogo Undertale.
 * Maneja la carga en memoria local (sin subida al servidor),
 * fallback a neutral, tolerancia a etiquetas desconocidas y efecto de rebote/salto.
 */

export const EMOTIONS = [
  'neutral',
  'feliz',
  'enojado',
  'triste',
  'sorprendido',
];

export class SpriteManager {
  constructor({ imgElement, placeholderElement, containerElement }) {
    this.imgElement = imgElement;
    this.placeholderElement = placeholderElement;
    this.containerElement = containerElement;
    this.sprites = new Map();
    this.currentEmotion = 'neutral';
  }

  /**
   * Asigna un archivo de imagen a una emoción específica usando Object URLs locales.
   * @param {string} emotion - Nombre de la emoción ('neutral', 'feliz', etc.)
   * @param {File|null} file - Archivo de imagen seleccionado por el usuario.
   */
  setSpriteFile(emotion, file) {
    const key = emotion.toLowerCase();
    if (!EMOTIONS.includes(key)) {
      return;
    }

    const previousUrl = this.sprites.get(key);
    if (previousUrl && previousUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previousUrl);
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      this.sprites.set(key, objectUrl);
    } else {
      this.sprites.delete(key);
    }

    this.refreshDisplay();
  }

  /**
   * Obtiene la URL de la emoción solicitada, aplicando fallback a 'neutral'.
   * @param {string} emotion
   * @returns {string|null}
   */
  getSpriteUrl(emotion) {
    const key = emotion ? emotion.toLowerCase() : 'neutral';

    if (this.sprites.has(key)) {
      return this.sprites.get(key);
    }

    // Si falta la imagen de una emoción, fallback a 'neutral'
    if (this.sprites.has('neutral')) {
      return this.sprites.get('neutral');
    }

    return null;
  }

  /**
   * Ejecuta el efecto de rebote/saltito al cambiar de emoción.
   */
  triggerHop() {
    if (!this.imgElement) {
      return;
    }
    this.imgElement.classList.remove('sprite-hop');
    // Forzar reflow para reiniciar la animación CSS
    void this.imgElement.offsetWidth;
    this.imgElement.classList.add('sprite-hop');
  }

  /**
   * Cambia el sprite actual según la emoción recibida.
   * Si la etiqueta es desconocida, se ignora sin lanzar errores.
   * @param {string} emotion
   */
  setEmotion(emotion) {
    const key = (emotion || 'neutral').toLowerCase();

    // Etiqueta desconocida: se ignora sin romper
    if (!EMOTIONS.includes(key)) {
      return;
    }

    const emotionChanged = this.currentEmotion !== key;
    this.currentEmotion = key;
    this.refreshDisplay();

    if (emotionChanged && this.imgElement && this.imgElement.style.display !== 'none') {
      this.triggerHop();
    }
  }

  /**
   * Actualiza el elemento <img>, el placeholder y el contenedor en el DOM.
   */
  refreshDisplay() {
    const url = this.getSpriteUrl(this.currentEmotion);

    if (url) {
      this.imgElement.src = url;
      this.imgElement.alt = `Sprite ${this.currentEmotion}`;
      this.imgElement.style.display = 'block';

      if (this.placeholderElement) {
        this.placeholderElement.style.display = 'none';
      }
      if (this.containerElement) {
        this.containerElement.classList.remove('border-dashed', 'border-neutral-700', 'bg-neutral-950');
        this.containerElement.classList.add('border-transparent', 'bg-transparent');
      }
    } else {
      // Sin imagen disponible: limpia el src sin errores en consola
      this.imgElement.removeAttribute('src');
      this.imgElement.style.display = 'none';

      if (this.placeholderElement) {
        this.placeholderElement.style.display = 'flex';
        this.placeholderElement.textContent = `[${this.currentEmotion}]`;
      }
      if (this.containerElement) {
        this.containerElement.classList.add('border-dashed', 'border-neutral-700', 'bg-neutral-950');
        this.containerElement.classList.remove('border-transparent', 'bg-transparent');
      }
    }
  }

  reset() {
    this.currentEmotion = 'neutral';
    this.refreshDisplay();
  }
}
