/*
  Python de verdad en el navegador: Pyodide (CPython compilado a WebAssembly) + pytest 8.
  Todo se sirve desde el propio contenedor (public/pyodide y public/wheels): no necesita internet.
  La primera carga tarda unos segundos; después cada ejecución de pytest es casi instantánea.
*/
import HARNESS from '../py/harness.py?raw';
import SYNC_API from '../py/sync_api.py?raw';
import PLUGIN from '../py/_pytest_plugin.py?raw';
import { beginRun, call as bridgeCall, endRun } from './pwbridge.js';

const BASE = import.meta.env.BASE_URL;
const WHEELS = ['pytest-8.3.5-py3-none-any.whl', 'pluggy-1.5.0-py3-none-any.whl', 'iniconfig-2.0.0-py3-none-any.whl', 'packaging-24.2-py3-none-any.whl'];

let pyPromise = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    document.head.appendChild(s);
  });
}

/** Carga Pyodide una sola vez (las siguientes llamadas devuelven la misma instancia). */
export function loadPython() {
  if (!pyPromise) {
    pyPromise = (async () => {
      if (!window.loadPyodide) await loadScript(`${BASE}pyodide/pyodide.js`);
      const py = await window.loadPyodide({ indexURL: `${BASE}pyodide/` });
      const site = py.runPython('import site; site.getsitepackages()[0]');
      for (const w of WHEELS) {
        const res = await fetch(`${BASE}wheels/${w}`);
        if (!res.ok) throw new Error(`No se pudo cargar ${w}`);
        py.unpackArchive(await res.arrayBuffer(), 'wheel', { extractDir: site });
      }
      py.registerJsModule('_pwbridge', { call: bridgeCall });
      py.FS.mkdirTree('/home/pyodide/sim/playwright');
      py.FS.writeFile('/home/pyodide/sim/playwright/__init__.py', '');
      py.FS.writeFile('/home/pyodide/sim/playwright/sync_api.py', SYNC_API);
      py.FS.writeFile('/home/pyodide/sim/playwright/_pytest_plugin.py', PLUGIN);
      py.runPython("import sys; sys.path.insert(0, '/home/pyodide/sim')");
      py.runPython(HARNESS);
      return py;
    })().catch((e) => {
      pyPromise = null;
      throw e;
    });
  }
  return pyPromise;
}

export const pythonLoaded = () => !!pyPromise;

const breathe = () => new Promise((r) => setTimeout(r, 30));

function runOnce(py, files, { target, app }) {
  const fn = py.globals.get('run_session');
  try {
    return JSON.parse(fn(JSON.stringify(files), target || null, !!app));
  } finally {
    fn.destroy();
  }
}

/**
 * Ejecuta pytest sobre los archivos del estudiante.
 * Primero contra cada mutante (código con un bug sembrado) y cada bug de la app,
 * y al final contra el código correcto, para que la app quede mostrando esa ejecución.
 * Devuelve { main, mut: { id: resultado } }.
 */
export async function runPytest(challenge, files, { onPhase } = {}) {
  const py = await loadPython();
  const app = !!challenge.app;
  const mut = {};
  const variants = [
    ...Object.entries(challenge.mutants || {}).map(([id, m]) => ({ id, files: { ...files, ...m.files }, bugs: [] })),
    ...Object.entries(challenge.appBugs || {}).map(([id, bug]) => ({ id, files, bugs: [bug] })),
  ];
  for (const [i, v] of variants.entries()) {
    onPhase?.(`Probando contra el bug sembrado ${i + 1} de ${variants.length}…`);
    await breathe();
    beginRun(v.bugs);
    mut[v.id] = runOnce(py, v.files, { target: challenge.target, app });
  }
  onPhase?.('Ejecutando pytest…');
  await breathe();
  beginRun([]);
  const main = runOnce(py, files, { target: challenge.target, app });
  if (app) endRun();
  return { main, mut };
}
