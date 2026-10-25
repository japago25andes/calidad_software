// Copia el núcleo de Pyodide (Python compilado a WebAssembly) a public/pyodide,
// para que el juego funcione sin internet: nada se descarga de un CDN.
import { cpSync, existsSync, mkdirSync } from 'node:fs';

const FILES = ['pyodide.js', 'pyodide.asm.js', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];
const from = 'node_modules/pyodide';
const to = 'public/pyodide';

mkdirSync(to, { recursive: true });
for (const f of FILES) {
  if (!existsSync(`${from}/${f}`)) throw new Error(`Falta ${from}/${f}: ejecuta npm install`);
  cpSync(`${from}/${f}`, `${to}/${f}`);
}
console.log(`Pyodide copiado a ${to}`);
