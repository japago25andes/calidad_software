import { useEffect, useMemo, useRef, useState } from 'react';
import Shell from './Shell.jsx';
import CodeEditor from '../code/CodeEditor.jsx';
import CodeBlock from '../code/CodeBlock.jsx';
import { loadPython, runPytest } from '../../lib/python.js';
import { attachFrame, getSteps, replay } from '../../lib/pwbridge.js';
import { APP_BUGS, PIXELSHOP_DOC } from '../../lib/pixelshop.js';
import { evaluateChecks } from '../../lib/checks.js';
import { rich } from '../../lib/utils.jsx';
import { sfx } from '../../lib/sound.js';

/*
  Laboratorio de Python: editor + pytest real (Pyodide) y, si challenge.app, el navegador con PixelShop
  para las pruebas de Playwright.
  challenge = {
    type: 'py', kind?: 'pw' | 'tdd',
    files: { 'test_x.py': '...', 'x.py': '...' },  archivos (el orden es el de las pestañas)
    editable: ['test_x.py'],                       editables (por defecto, el primero)
    target: 'x.py',                                módulo cuya cobertura se mide (opcional)
    mutants: { id: { label, files: { 'x.py': '...' } } },  versiones con un bug sembrado
    app: true, appBugs: { id: 'nombre-del-bug' },  pruebas de Playwright contra PixelShop
    checks: [{ text, allPass | minTests | kills | cov | uses | avoid | test }],
    solution: { 'test_x.py': '...' }, hint, instructions
  }
*/
export default function PyLab({ challenge, revealed, onCheck }) {
  const names = Object.keys(challenge.files);
  const editable = challenge.editable || [names[0]];
  const [files, setFiles] = useState(() => ({ ...challenge.files }));
  const [active, setActive] = useState(editable[0]);
  const [status, setStatus] = useState('idle');
  const [phase, setPhase] = useState('');
  const [res, setRes] = useState(null);
  const [ranKey, setRanKey] = useState(null);
  const [results, setResults] = useState(() => challenge.checks.map(() => null));
  const [steps, setSteps] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [url, setUrl] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [error, setError] = useState(null);
  const frame = useRef(null);
  const stop = useRef(null);
  const filesKey = JSON.stringify(files);
  const dirty = ranKey !== filesKey;

  // Python se carga en segundo plano en cuanto aparece el reto.
  useEffect(() => {
    let alive = true;
    setStatus('loading');
    loadPython()
      .then(() => alive && setStatus('ready'))
      .catch((e) => alive && (setStatus('error'), setError(e.message)));
    return () => {
      alive = false;
      stop.current?.abort();
    };
  }, []);

  // Barra de direcciones del navegador simulado.
  useEffect(() => {
    if (!challenge.app) return undefined;
    const t = setInterval(() => {
      try {
        setUrl(frame.current?.contentWindow?.PixelShop?.url() || '');
      } catch {
        /* la app aún no ha cargado */
      }
    }, 400);
    return () => clearInterval(t);
  }, [challenge.app]);

  async function run() {
    if (status === 'running' || status === 'loading') return;
    stop.current?.abort();
    setPlaying(null);
    setStatus('running');
    setError(null);
    sfx.click();
    try {
      if (challenge.app) attachFrame(frame.current);
      const r = await runPytest(challenge, files, { onPhase: setPhase });
      setRes(r);
      setRanKey(filesKey);
      setResults(evaluateChecks(challenge, r, files));
      if (challenge.app) setSteps([...getSteps()]);
      setStatus('ready');
      r.main.total && r.main.passed === r.main.total ? sfx.correct() : sfx.wrong();
    } catch (e) {
      setError(e.message);
      setStatus('ready');
    }
  }

  async function play(test) {
    stop.current?.abort();
    const ctrl = new AbortController();
    stop.current = ctrl;
    setPlaying({ test, step: -1 });
    await replay(test, { signal: ctrl.signal, onStep: (i) => !ctrl.signal.aborted && setPlaying(i < 0 ? null : { test, step: i }) });
  }

  const passed = results.filter((r) => r?.ok).length;
  const total = challenge.checks.length;
  const allOk = passed === total && !dirty;

  async function submit() {
    if (dirty) {
      await run();
      return;
    }
    onCheck(passed / total, { hint: showHint });
  }

  function giveUp() {
    if (!window.confirm('¿Rendirte? Perderás una vida, pero verás una solución.')) return;
    onCheck(0, { gaveUp: true });
    setShowSolution(true);
  }

  const mutants = useMemo(
    () => [
      ...Object.entries(challenge.mutants || {}).map(([id, m]) => ({ id, label: m.label })),
      ...Object.entries(challenge.appBugs || {}).map(([id, b]) => ({ id, label: `PixelShop: ${APP_BUGS[b] || b}` })),
    ],
    [challenge],
  );
  const killed = (id) => res && (res.mut[id]?.failed || 0) + (res.mut[id]?.errors || 0) > 0;
  const cov = res?.main.coverage;
  const marks = active === challenge.target && cov && !dirty ? cov : null;
  const testsByName = useMemo(() => {
    const groups = [];
    for (const [i, s] of steps.entries()) {
      if (s.kind === 'test') groups.push({ test: s.title, items: [] });
      else if (groups.length) groups[groups.length - 1].items.push({ ...s, i });
    }
    return groups;
  }, [steps]);
  const outcome = (name) => res?.main.tests.find((t) => t.name === name)?.outcome;

  return (
    <Shell challenge={challenge} revealed={revealed} wide>
      {challenge.instructions && <div className="instructions">{rich(challenge.instructions)}</div>}

      <div className={`code-layout ${challenge.app ? 'with-app' : 'py-only'}`}>
        <div className="editor-panel">
          <div className="editor-tabs">
            {names.map((t) => (
              <button key={t} className={`editor-tab ${active === t ? 'active' : ''} ${editable.includes(t) ? '' : 'locked'}`} onClick={() => setActive(t)}>
                {t} {!editable.includes(t) && <span title="Solo lectura">🔒</span>}
              </button>
            ))}
            <button
              className="editor-reset"
              title="Volver al código inicial"
              disabled={revealed}
              onClick={() => {
                if (window.confirm('¿Volver al código inicial? Perderás tus cambios.')) setFiles({ ...challenge.files });
              }}
            >
              ↺ Reiniciar
            </button>
          </div>
          <CodeEditor
            docKey={active}
            lang="py"
            value={files[active]}
            readOnly={revealed || !editable.includes(active)}
            marks={marks}
            onChange={(v) => setFiles((f) => ({ ...f, [active]: v }))}
          />
          {marks && (
            <div className="cov-legend">
              <span className="cov-dot hit" /> línea ejecutada por tus pruebas <span className="cov-dot miss" /> línea sin probar · cobertura <b>{cov.percent}%</b>
            </div>
          )}
        </div>

        {challenge.app ? (
          <div className="app-panel">
            <div className="preview browser">
              <div className="preview-bar">
                <span className="dots"><i /><i /><i /></span>
                <span className="url-bar">🔒 {url || 'https://pixelshop.test/'}</span>
              </div>
              <iframe ref={frame} title="PixelShop" sandbox="allow-scripts allow-same-origin allow-forms" srcDoc={PIXELSHOP_DOC} style={{ height: challenge.appHeight || 330 }} />
            </div>
            <div className="trace">
              <div className="trace-title">🎬 Pasos de la prueba {steps.length ? '' : '(ejecuta las pruebas para verlos)'}</div>
              {testsByName.map((g) => (
                <div key={g.test} className="trace-test">
                  <div className={`trace-test-head ${outcome(g.test) || ''}`}>
                    <span>{outcome(g.test) === 'passed' ? '✅' : '❌'} {g.test}</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => play(g.test)} disabled={status === 'running'} title="Repetir la prueba despacio en el navegador">
                      {playing?.test === g.test ? '⏳ Reproduciendo…' : '▶ Ver al robot'}
                    </button>
                  </div>
                  <ol>
                    {g.items.map((s) => (
                      <li key={s.i} className={`${s.ok ? 'ok' : 'bad'} ${s.kind} ${playing?.step === s.i ? 'playing' : ''}`}>
                        <code>{s.title}</code>
                        {s.error && <pre className="trace-error">{s.error}</pre>}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Terminal res={res} status={status} phase={phase} dirty={dirty} />
        )}
      </div>

      <div className="run-bar">
        <button className="btn btn-run" onClick={run} disabled={status === 'running' || status === 'loading' || revealed}>
          {status === 'loading' ? '🐍 Cargando Python…' : status === 'running' ? `⏳ ${phase || 'Ejecutando…'}` : '▶ Ejecutar pruebas'}
        </button>
        <code className="run-cmd">$ pytest -q</code>
        {status === 'loading' && <span className="muted">Solo la primera vez tarda unos segundos.</span>}
        {res && dirty && status !== 'running' && <span className="muted">Cambiaste el código: vuelve a ejecutar.</span>}
        {error && <span className="run-error">⚠️ {error}</span>}
      </div>

      {challenge.app && res && <Terminal res={res} status={status} phase={phase} dirty={dirty} compact />}

      {mutants.length > 0 && res && (
        <div className="mutants">
          <div className="mutants-head">🐞 Bugs sembrados detectados: {mutants.filter((m) => killed(m.id)).length}/{mutants.length}</div>
          <ul>
            {mutants.map((m) => (
              <li key={m.id} className={killed(m.id) ? 'ok' : 'bad'}>
                <span className="check-icon">{killed(m.id) ? '✓' : '✗'}</span> {rich(m.label)} {killed(m.id) ? '— ¡tus pruebas lo atrapan!' : '— se escapa: ninguna prueba falla'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="checklist">
        <div className="checklist-head">
          <span>✅ Comprobaciones</span>
          <span className={`checklist-count ${allOk ? 'all' : ''}`}>
            {passed}/{total}
          </span>
        </div>
        <div className="checklist-bar">
          <div style={{ width: `${(passed / total) * 100}%` }} />
        </div>
        <ul>
          {challenge.checks.map((c, i) => {
            const r = results[i];
            return (
              <li key={i} className={r == null ? 'pending' : r.ok ? 'ok' : 'bad'}>
                <span className="check-icon">{r == null ? '○' : r.ok ? '✓' : '✗'}</span>
                <span>{rich(c.text)}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {showHint && challenge.hint && <div className="tip">💡 {rich(challenge.hint)}</div>}

      {!revealed && (
        <div className="ch-actions code-actions">
          {challenge.hint && !showHint && (
            <button className="btn btn-ghost" onClick={() => { sfx.click(); setShowHint(true); }} title="Usar la pista reduce el XP de este reto">
              💡 Pista (−30% XP)
            </button>
          )}
          <button className="btn btn-ghost danger" onClick={giveUp}>
            🏳️ Me rindo
          </button>
          <span className="ch-action-hint">
            {!res ? 'Ejecuta las pruebas para ver cómo vas.' : dirty ? 'Al entregar se ejecutan de nuevo tus pruebas.' : allOk ? '¡Todo en verde! Ya puedes entregar.' : 'Puedes entregar cuando quieras: se puntúa lo que esté en verde.'}
          </span>
          <button className={`btn btn-primary btn-lg ${allOk ? 'glow' : ''}`} onClick={submit} disabled={status === 'loading' || status === 'running'}>
            {dirty ? 'Ejecutar y comprobar' : 'Entregar ✓'}
          </button>
        </div>
      )}

      {revealed && challenge.solution && (
        <div className="solution">
          <button className="btn btn-ghost btn-sm" onClick={() => setShowSolution((s) => !s)}>
            {showSolution ? 'Ocultar' : 'Ver'} una solución posible
          </button>
          {showSolution && Object.entries(challenge.solution).map(([k, code]) => <CodeBlock key={k} code={code} lang="py" title={k} />)}
        </div>
      )}
    </Shell>
  );
}

function Terminal({ res, status, phase, dirty, compact }) {
  const m = res?.main;
  return (
    <div className={`terminal ${compact ? 'compact' : ''}`}>
      <div className="terminal-bar">
        <span className="dots"><i /><i /><i /></span>
        <span>Terminal</span>
        {m && (
          <span className={`terminal-sum ${m.total && m.passed === m.total ? 'ok' : 'bad'}`}>
            {m.passed} ✓ · {m.failed + m.errors} ✗{dirty ? ' (código modificado)' : ''}
          </span>
        )}
      </div>
      <pre className="terminal-body">
        {status === 'loading' && !m && '🐍 Preparando Python y pytest en tu navegador…\n'}
        {status === 'running' && `$ pytest -q\n${phase}\n`}
        {status !== 'running' && !m && status !== 'loading' && '$ pytest -q\n(pulsa «▶ Ejecutar pruebas»)'}
        {status !== 'running' && m && <TerminalOutput text={`$ pytest -q\n${m.output}`} />}
      </pre>
    </div>
  );
}

function TerminalOutput({ text }) {
  return text.split('\n').map((line, i) => {
    let cls = '';
    if (/^E\s/.test(line) || /FAILED|failed|ERROR|Error/.test(line)) cls = 'bad';
    if (/^(=+ )?\d+ passed( in [\d.]+s)?( =+)?$/.test(line.trim()) || /PASSED/.test(line)) cls = 'ok';
    return (
      <span key={i} className={cls}>
        {line}
        {'\n'}
      </span>
    );
  });
}
