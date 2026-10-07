/**
 * Parsea una cadena de texto extrayendo etiquetas de emoción {emocion}
 * y separando los caracteres en una lista de eventos secuenciales.
 * Módulo independiente del DOM.
 * 
 * @param {string} input - Texto con posibles etiquetas {emocion}.
 * @returns {Array<{tipo: 'char' | 'emocion', valor: string}>}
 */
export function parseText(input) {
  if (typeof input !== 'string') {
    return [];
  }

  const events = [];
  const tagRegex = /\{([a-zA-Z0-9_\-]+)\}/g;
  let lastIndex = 0;
  let match;

  while ((match = tagRegex.exec(input)) !== null) {
    const precedingText = input.slice(lastIndex, match.index);
    for (const char of precedingText) {
      events.push({ tipo: 'char', valor: char });
    }

    events.push({
      tipo: 'emocion',
      valor: match[1].toLowerCase(),
    });

    lastIndex = tagRegex.lastIndex;
  }

  const remainingText = input.slice(lastIndex);
  for (const char of remainingText) {
    events.push({ tipo: 'char', valor: char });
  }

  return events;
}

