import { useEffect, useRef, useState } from 'react';
import { LEVELS } from '../data/levels.js';
import { runPytest } from '../lib/python.js';
import { evaluateChecks } from '../lib/checks.js';
import { attachFrame } from '../lib/pwbridge.js';
import { PIXELSHOP_DOC } from '../lib/pixelshop.js';

/*
  Modo de control de calidad (se abre con ?qa en la URL). ¡Las pruebas también se prueban!
  Para cada reto de Python comprueba que:
   1) la solución pasa TODAS las comprobaciones (y detecta todos los bugs sembrados);
   2) el código inicial NO las pasa todas (si no, el reto sería trivial).
  Los demás retos se revisan por estructura (respuestas existentes, huecos, celdas…).
  Con ?qa=nivel-id se revisa solo ese nivel.
*/
function structural(ch) {
  const p = [];
  if (ch.type === 'quiz' && (ch.answer == null || !ch.options?.[ch.answer])) p.push('answer fuera de rango');
  if (ch.type === 'fill' && ch.code.split('___').length - 1 !== ch.blanks.length) p.push('nº de huecos ≠ nº de respuestas');
  if (ch.type === 'pick' && !ch.options.some((o) => o.correct)) p.push('ninguna opción correcta');
  if (ch.type === 'classify' && ch.items.some((it) => !ch.bins.some((b) => b.id === it.bin))) p.push('item con bin inexistente');
  if (ch.type === 'report' && ch.fields.some((f) => !f.options[f.answer])) p.push('campo con answer fuera de rango');
  if (ch.type === 'grid' && ch.rows.some((r) => r.some((c) => c && typeof c === 'object' && !c.options.includes(c.answer)))) p.push('celda cuya respuesta no está en sus opciones');
  if (ch.type === 'grid' && ch.rows.some((r) => r.length !== ch.head.length)) p.push('fila con un nº de celdas distinto a la cabecera');
  if (ch.type === 'bughunt' && ch.code && ch.bugs.some((n) => n < 1 || n > ch.code.split('\n').length)) p.push('línea de bug fuera del código');
  if (ch.type === 'bughunt' && ch.screen && ch.bugs.some((id) => !ch.screen.includes(`data-spot="${id}"`))) p.push('bug sin data-spot en la pantalla');
  if (ch.type === 'boundary' && ch.answer.some((v) => v < ch.min || v > ch.max)) p.push('valor esperado fuera de la recta');
  if (ch.type === 'coverage') {
    const goal = ch.goal || 'branch';
    const all = goal === 'branch' ? ch.branches.map((b) => b.id) : ch.statements;
    const key = goal === 'branch' ? 'branches' : 'lines';
    const sol = (ch.solution || []).map((i) => ch.candidates[i]);
    if (!sol.length) p.push('sin solución (índices de candidates)');
    else if (sol.length > ch.max) p.push('la solución usa más casos que el máximo');
    else if (!all.every((x) => sol.some((c) => (c[key] || []).includes(x)))) p.push('la solución no alcanza el 100 %');
    if (ch.candidates.some((c) => c.lines.some((l) => !ch.statements.includes(l)))) p.push('candidato con líneas que no son sentencias');
  }
  if (!ch.explanation) p.push('sin explicación');
  return p;
}

export default function QA() {
  const [rows, setRows] = useState([]);
  const [done, setDone] = useState(false);
  const frame = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const only = new URLSearchParams(window.location.search).get('qa');
    (async () => {
      await new Promise((r) => (frame.current.contentWindow?.PixelShop ? r() : frame.current.addEventListener('load', r, { once: true })));
      attachFrame(frame.current);
      const out = [];
      for (const level of LEVELS) {
        if (only && level.id !== only) continue;
        for (const [i, ch] of level.challenges.entries()) {
          const where = `${level.id} #${i + 1}`;
          if (ch.type === 'py') {
            const detail = [];
            try {
              const solFiles = { ...ch.files, ...ch.solution };
              const sol = await runPytest(ch, solFiles);
              const solChecks = evaluateChecks(ch, sol, solFiles);
              solChecks.forEach((r, k) => !r.ok && detail.push(`Solución falla: ${ch.checks[k].text}${r.err ? ` (${r.err})` : ''}`));
              if (detail.length) detail.push(`Salida: ${sol.main.output.slice(-600)}`);
              const start = await runPytest(ch, ch.files);
              if (evaluateChecks(ch, start, ch.files).every((r) => r.ok)) detail.push('El código inicial ya pasa todo');
            } catch (e) {
              detail.push(`Error: ${e.message}`);
            }
            out.push({ where, title: ch.question, ok: detail.length === 0, detail });
          } else {
            const problems = structural(ch);
            out.push({ where, title: ch.question, ok: problems.length === 0, detail: problems });
          }
          if (cancelled) return;
          setRows([...out]);
        }
      }
      setDone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const bad = rows.filter((r) => !r.ok);
  return (
    <div className="page qa">
      <h1>🧪 Control de calidad de los retos</h1>
      <p id="qa-summary" data-done={done} data-bad={bad.length} data-total={rows.length}>
        {done ? '✅ Terminado' : '⏳ Ejecutando…'} · {rows.length} retos revisados · <b>{bad.length} con problemas</b>
      </p>
      <div className="qa-frame">
        <iframe ref={frame} title="PixelShop" sandbox="allow-scripts allow-same-origin allow-forms" srcDoc={PIXELSHOP_DOC} />
      </div>
      <table className="spec-table">
        <tbody>
          {rows.map((r) => (
            <tr key={r.where} className={r.ok ? 'qa-ok' : 'qa-bad'}>
              <td>{r.ok ? '✅' : '❌'}</td>
              <td>{r.where}</td>
              <td>
                {r.title}
                {r.detail.map((d, k) => (
                  <div key={k} className="qa-detail">{d}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
