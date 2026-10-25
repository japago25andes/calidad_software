import { useState } from 'react';
import Shell from './Shell.jsx';
import { rich } from '../../lib/utils.jsx';
import { sfx } from '../../lib/sound.js';

/*
  Tabla con celdas para completar (tablas de decisión, de transición de estados, de trazabilidad…).
  challenge = { head: ['', 'R1', ...], rows: [['texto', 'dato', { options: ['✓', '–'], answer: '✓' }, ...], ...] }
*/
export default function Grid({ challenge, revealed, onCheck }) {
  const cells = [];
  challenge.rows.forEach((r, i) => r.forEach((c, j) => c && typeof c === 'object' && cells.push(`${i}-${j}`)));
  const [vals, setVals] = useState({});
  const filled = cells.filter((k) => vals[k] != null).length;
  const answerOf = (k) => {
    const [i, j] = k.split('-').map(Number);
    return challenge.rows[i][j].answer;
  };

  function check() {
    onCheck(cells.filter((k) => vals[k] === answerOf(k)).length / cells.length);
  }

  function cycle(k, options) {
    if (revealed) return;
    sfx.click();
    setVals((p) => ({ ...p, [k]: options[(options.indexOf(p[k]) + 1) % options.length] }));
  }

  return (
    <Shell challenge={challenge} revealed={revealed} canCheck={filled === cells.length} onCheck={check} actionHint={`Completa las celdas (${filled}/${cells.length})`}>
      <p className="ch-hint">Haz clic en cada celda con «?» para cambiar su valor.</p>
      <div className="grid-wrap">
        <table className="grid-table">
          <thead>
            <tr>
              {challenge.head.map((h, i) => (
                <th key={i}>{rich(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {challenge.rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => {
                  if (!c || typeof c !== 'object') return j === 0 ? <th key={j}>{rich(c)}</th> : <td key={j} className="given">{rich(c)}</td>;
                  const k = `${i}-${j}`;
                  const state = revealed ? (vals[k] === c.answer ? 'ok' : 'bad') : vals[k] != null ? 'set' : '';
                  return (
                    <td key={j}>
                      <button className={`cell-btn ${state}`} onClick={() => cycle(k, c.options)} disabled={revealed}>
                        {vals[k] ?? '?'}
                      </button>
                      {revealed && vals[k] !== c.answer && <span className="cell-answer">{c.answer}</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
