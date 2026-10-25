import { useMemo, useState } from 'react';
import Shell from './Shell.jsx';
import { rich, shuffle } from '../../lib/utils.jsx';
import { sfx } from '../../lib/sound.js';

/*
  Formulario (reporte de defecto o caso de prueba): en cada campo se elige la mejor opción.
  challenge = { screen?: 'html', title?, fields: [{ label, options: [...], answer: índice }] }
*/
export default function Report({ challenge, revealed, onCheck }) {
  const fields = useMemo(() => challenge.fields.map((f) => ({ ...f, order: shuffle(f.options.map((_, i) => i)) })), [challenge]);
  const [vals, setVals] = useState(() => fields.map(() => ''));
  const filled = vals.filter((v) => v !== '').length;
  const plain = (s) => s.replace(/[`*]/g, '');

  function check() {
    const hits = fields.filter((f, i) => Number(vals[i]) === f.answer).length;
    onCheck(hits / fields.length);
  }

  return (
    <Shell challenge={challenge} revealed={revealed} canCheck={filled === fields.length} onCheck={check} actionHint={`Completa todos los campos (${filled}/${fields.length})`}>
      {challenge.screen && <div className="mock" dangerouslySetInnerHTML={{ __html: challenge.screen }} />}
      <div className="report">
        <div className="report-head">
          {challenge.kind === 'case' ? '🧪' : '🐞'} {challenge.title || (challenge.kind === 'case' ? 'Caso de prueba' : 'Reporte de defecto')}
        </div>
        {fields.map((f, i) => {
          const ok = Number(vals[i]) === f.answer;
          return (
            <label key={i} className={`report-field ${revealed ? (ok ? 'ok' : 'bad') : ''}`}>
              <span className="report-label">{f.label}</span>
              <select
                value={vals[i]}
                disabled={revealed}
                onChange={(e) => {
                  sfx.click();
                  const v = e.target.value;
                  setVals((p) => p.map((x, k) => (k === i ? v : x)));
                }}
              >
                <option value="">— Elige —</option>
                {f.order.map((o) => (
                  <option key={o} value={o}>
                    {plain(f.options[o])}
                  </option>
                ))}
              </select>
              {revealed && !ok && <span className="correction">→ {rich(f.options[f.answer])}</span>}
            </label>
          );
        })}
      </div>
    </Shell>
  );
}
