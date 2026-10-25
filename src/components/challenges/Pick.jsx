import { useMemo, useState } from 'react';
import Shell from './Shell.jsx';
import { rich, shuffle } from '../../lib/utils.jsx';
import { sfx } from '../../lib/sound.js';

export default function Pick({ challenge, revealed, onCheck }) {
  const options = useMemo(() => shuffle(challenge.options), [challenge]);
  const [picked, setPicked] = useState(() => new Set());

  function toggle(i) {
    if (revealed) return;
    sfx.click();
    setPicked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function check() {
    const hits = options.filter((o, i) => o.correct === picked.has(i)).length;
    onCheck(hits / options.length);
  }

  return (
    <Shell challenge={challenge} revealed={revealed} canCheck={picked.size > 0} onCheck={check}>
      <div className="pick-grid">
        {options.map((opt, i) => {
          const on = picked.has(i);
          let state = on ? 'on' : '';
          if (revealed) {
            if (opt.correct && on) state = 'ok';
            else if (opt.correct && !on) state = 'missed';
            else if (!opt.correct && on) state = 'bad';
            else state = 'dim';
          }
          return (
            <button key={i} className={`pick ${state}`} onClick={() => toggle(i)} disabled={revealed}>
              <span className="pick-box">{revealed ? (opt.correct ? '✓' : '✗') : on ? '✓' : ''}</span>
              <span>{rich(opt.text)}</span>
            </button>
          );
        })}
      </div>
      {revealed && <p className="legend-note">✓ verde: acertaste · borde verde discontinuo: era correcta y no la marcaste · rojo: no era correcta</p>}
    </Shell>
  );
}
