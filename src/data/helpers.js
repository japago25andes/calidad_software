// Utilidades para escribir el contenido de los mundos.

/**
 * Etiqueta para código Python: py`...` conserva las barras invertidas tal cual (como String.raw)
 * y quita la sangría común, para poder escribir el código bien alineado dentro del archivo.
 */
export function py(strings, ...values) {
  // Un valor de varias líneas se sangra igual que la línea donde se inserta.
  const indented = values.map((v, i) => {
    const pad = strings.raw[i].match(/(?:^|\n)([ \t]*)$/)?.[1] ?? '';
    return String(v).replace(/\n$/, '').replace(/\n/g, `\n${pad}`);
  });
  const raw = String.raw({ raw: strings.raw }, ...indented).replace(/^\n/, '').replace(/\n[ \t]*$/, '');
  const lines = raw.split('\n');
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return `${lines.map((l) => l.slice(indent)).join('\n')}\n`;
}

/** Igual que py`` pero sin el salto de línea final (para fragmentos cortos en las lecciones). */
export const code = (strings, ...values) => py(strings, ...values).replace(/\n$/, '');

/** Pantalla de ejemplo de PixelShop para los retos de "encuentra el bug" y los reportes. */
export function shop(body, nav = 'Inicio · Carrito (2) · Hola, Ana') {
  return `<div class="m-bar"><b>Pixel<span style="color:#38bdf8">Shop</span></b><span class="m-nav">${nav}</span></div><div class="m-body">${body}</div>`;
}
