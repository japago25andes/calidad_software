import { Fragment, useRef, useState } from 'react';
import Shell from './Shell.jsx';
import { highlight } from '../code/CodeBlock.jsx';
import { shuffle } from '../../lib/utils.jsx';
import { sfx } from '../../lib/sound.js';

const norm = (s) => s.replace(/\s+/g, ' ').trim();

/*
  Completar huecos en un fragmento de código.
  challenge = { code: 'texto con ___ en cada hueco', blanks: [['respuesta', 'alternativa'], ...], lang, bank: ['opciones', ...] }
*/
export default function Fill({ challenge, revealed, onCheck }) {
  const parts = challenge.code.split('___');
  const n = parts.length - 1;
  const [vals, setVals] = useState(() => Array(n).fill(''));
  const [bank] = useState(() => (challenge.bank ? shuffle(challenge.bank) : null));
  const focused = useRef(0);
  const inputs = useRef([]);
  const ok = (i) => challenge.blanks[i].some((a) => norm(a) === norm(vals[i]));
  const filled = vals.every((v) => v.trim());

  function set(i, v) {
    setVals((prev) => prev.map((x, k) => (k === i ? v : x)));
  }

  function pickWord(w) {
    if (revealed) return;
    sfx.click();
    const empty = vals.findIndex((v) => !v.trim());
    const i = vals[focused.current] === '' || empty === -1 ? focused.current : empty;
    set(i, w);
    const next = vals.findIndex((v, k) => k !== i && !v.trim());
    if (next !== -1) {
      focused.current = next;
      inputs.current[next]?.focus();
    }
  }

  function check() {
    const hits = vals.filter((_, i) => ok(i)).length;
    onCheck(hits / n);
  }

  const width = (i) => Math.max(4, ...challenge.blanks[i].map((a) => a.length)) + 2;

  return (
    <Shell challenge={challenge} revealed={revealed} canCheck={filled} onCheck={check} actionHint="Rellena todos los huecos">
      <pre className="fill-code">
        {parts.map((p, i) => (
          <Fragment key={i}>
            <span dangerouslySetInnerHTML={{ __html: highlight(p, challenge.lang || 'py') }} />
            {i < n && (
              <span className="blank-wrap">
                <input
                  ref={(el) => (inputs.current[i] = el)}
                  className={`blank ${revealed ? (ok(i) ? 'ok' : 'bad') : ''}`}
                  style={{ width: `${width(i)}ch` }}
                  value={vals[i]}
                  disabled={revealed}
                  spellCheck={false}
                  autoComplete="off"
                  autoFocus={i === 0}
                  onFocus={() => (focused.current = i)}
                  onChange={(e) => set(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filled && !revealed) check();
                  }}
                />
                {revealed && !ok(i) && <span className="blank-answer">{challenge.blanks[i][0]}</span>}
              </span>
            )}
          </Fragment>
        ))}
      </pre>
      {bank && !revealed && (
        <div className="word-bank">
          <span className="word-bank-title">Banco de palabras:</span>
          {bank.map((w, i) => (
            <button key={i} className="chip mono" onClick={() => pickWord(w)}>
              {w}
            </button>
          ))}
        </div>
      )}
    </Shell>
  );
}
