// Archivo de progreso: un .txt ilegible que el estudiante lleva de un equipo a otro.
// El contenido se comprime, se revuelve con una clave y se sella: si alguien cambia
// una sola letra, el sello deja de coincidir y el archivo se rechaza.
// No es criptografía fuerte (la clave viaja dentro del juego); solo evita que se edite a mano.
// Se usa código propio porque las funciones de cifrado del navegador solo existen en localhost/https.

export const THIS_GAME = 'calidad';

const GAMES = {
  'casos-de-uso': 'Misión: Casos de Uso',
  uml: 'Misión: UML',
  frontend: 'Misión: Frontend',
  calidad: 'Misión: Calidad',
};

const FORMAT = 1;
const SECRET = 'misiones·archivo-de-progreso·2026';
const MAX_FILE = 1024 * 1024;

const enc = new TextEncoder();
const dec = new TextDecoder();

export class SaveFileError extends Error {}

const concat = (...parts) => {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
};

// cyrb128: huella de 128 bits sobre bytes.
function hash128(bytes) {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0; i < bytes.length; i++) {
    const k = bytes[i];
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  h1 ^= h2 ^ h3 ^ h4;
  h2 ^= h1;
  h3 ^= h1;
  h4 ^= h1;
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

const toBytes = (words) => Uint8Array.from(words.flatMap((w) => [w & 255, (w >>> 8) & 255, (w >>> 16) & 255, w >>> 24]));

// Flujo pseudoaleatorio (sfc32) sembrado con la clave y el nonce del archivo.
function scramble(bytes, nonce) {
  let [a, b, c, d] = hash128(concat(enc.encode(SECRET), nonce));
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 4) {
    let t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    for (let j = 0; j < 4 && i + j < bytes.length; j++) out[i + j] = bytes[i + j] ^ ((t >>> (8 * j)) & 255);
  }
  return out;
}

const seal = (head, body) => toBytes(hash128(concat(enc.encode(SECRET), head, body, enc.encode(SECRET))));

async function transform(bytes, Stream) {
  const stream = new Blob([bytes]).stream().pipeThrough(new Stream('deflate'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function toBase64(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

export async function encodeSave(progress) {
  let body = enc.encode(JSON.stringify({ g: THIS_GAME, t: new Date().toISOString(), p: progress }));
  const compressed = typeof CompressionStream !== 'undefined';
  if (compressed) body = await transform(body, CompressionStream);

  const nonce = crypto.getRandomValues(new Uint8Array(8));
  const head = concat(Uint8Array.of(FORMAT, compressed ? 1 : 0), nonce);
  const bytes = concat(head, scramble(concat(body, seal(head, body)), nonce));

  const lines = toBase64(bytes).match(/.{1,64}/g);
  return [
    `${GAMES[THIS_GAME]} - Archivo de progreso`,
    'No modifiques este archivo: si cambias una sola letra dejará de funcionar.',
    'Para usarlo: abre el juego, entra a "Progreso" y elige "Cargar progreso".',
    '',
    ...lines,
    '',
  ].join('\r\n');
}

const DAMAGED = 'El archivo fue modificado o está dañado, por eso no se puede cargar. Usa el archivo original que descargaste del juego.';

export async function decodeSave(text) {
  const data = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => /^[A-Za-z0-9+/]+=*$/.test(l))
    .join('');

  let bytes;
  try {
    bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  } catch {
    bytes = new Uint8Array();
  }
  if (bytes.length < 10 + 16 + 2) throw new SaveFileError('Este archivo no es un archivo de progreso de las Misiones.');
  if (bytes[0] > FORMAT) throw new SaveFileError('Este archivo se creó con una versión más nueva del juego. Descarga la última versión e inténtalo de nuevo.');
  if (bytes[0] !== FORMAT) throw new SaveFileError(DAMAGED);

  const head = bytes.slice(0, 10);
  const plain = scramble(bytes.slice(10), head.slice(2));
  let body = plain.slice(0, -16);
  const expected = seal(head, body);
  if (!expected.every((b, i) => b === plain[plain.length - 16 + i])) throw new SaveFileError(DAMAGED);

  let save;
  try {
    if (head[1] === 1) {
      if (typeof DecompressionStream === 'undefined') throw new SaveFileError('Tu navegador es muy antiguo para leer este archivo. Actualízalo e inténtalo de nuevo.');
      body = await transform(body, DecompressionStream);
    }
    save = JSON.parse(dec.decode(body));
  } catch (e) {
    if (e instanceof SaveFileError) throw e;
    throw new SaveFileError(DAMAGED);
  }

  if (save.g !== THIS_GAME) {
    const other = GAMES[save.g];
    throw new SaveFileError(other ? `Este archivo es de ${other}. Cárgalo en ese juego.` : 'Este archivo es de otro juego.');
  }
  const p = save.p;
  if (!p || typeof p !== 'object' || typeof p.name !== 'string' || !p.levels || typeof p.levels !== 'object' || !Array.isArray(p.badges)) {
    throw new SaveFileError(DAMAGED);
  }
  return { progress: p, savedAt: save.t };
}

export async function readSaveFile(file) {
  if (file.size > MAX_FILE) throw new SaveFileError('Este archivo no es un archivo de progreso de las Misiones.');
  return decodeSave(await file.text());
}

export function saveFileName(progress) {
  const slug =
    (progress.name || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'estudiante';
  return `progreso-${THIS_GAME}-${slug}-${new Date().toLocaleDateString('sv-SE')}.txt`;
}

export async function downloadSave(progress) {
  const text = await encodeSave(progress);
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = saveFileName(progress);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return a.download;
}
