import { useEffect, useRef, useState } from 'react';
import Shell from './Shell.jsx';
import { highlight } from '../code/CodeBlock.jsx';
import { sfx } from '../../lib/sound.js';

/*
  Encuentra el bug: haz clic en las líneas de código (o en las partes de la pantalla) que tienen el defecto.
  challenge = { code, lang, bugs: [nº de línea, ...] }  o  { screen: 'html con data-spot="id"', bugs: ['id', ...] }
*/
export default function BugHunt({ challenge, revealed, onCheck }) {
  const [picked, setPicked] = useState(() => new Set());
  const box = useRef(null);
  const need = challenge.bugs.length;

  function toggle(id) {
    if (revealed) return;
    sfx.click();
    setPicked((prev) => {
      if (need === 1) return new Set(prev.has(id) ? [] : [id]);
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < need) next.add(id);
      return next;
    });
  }

  function check() {
    const hits = challenge.bugs.filter((b) => picked.has(b)).length;
    onCheck(hits / Math.max(need, picked.size));
  }

  // Pantalla: marcar las zonas elegidas y, al revelar, las correctas.
  useEffect(() => {
    if (!challenge.screen || !box.current) return;
    box.current.querySelectorAll('[data-spot]').forEach((el) => {
      const id = el.getAttribute('data-spot');
      const isBug = challenge.bugs.includes(id);
      el.classList.toggle('spot-picked', picked.has(id) && !revealed);
      el.classList.toggle('spot-ok', revealed && isBug && picked.has(id));
      el.classList.toggle('spot-missed', revealed && isBug && !picked.has(id));
      el.classList.toggle('spot-bad', revealed && !isBug && picked.has(id));
    });
  }, [picked, revealed, challenge]);

  const label = need === 1 ? 'Marca el lugar del bug' : `Marca los ${need} bugs (${picked.size}/${need})`;

  return (
    <Shell challenge={challenge} revealed={revealed} canCheck={picked.size === need} onCheck={check} actionHint={label}>
      <p className="ch-hint">
        🔎 {challenge.screen ? 'Haz clic en la parte de la pantalla que tiene el defecto.' : 'Haz clic en la línea donde está el defecto.'}
        {need > 1 && ` Hay ${need}.`}
      </p>
      {challenge.screen ? (
        <div
          ref={box}
          className={`mock hunt ${revealed ? 'revealed' : ''}`}
          onClick={(e) => {
            const s = e.target.closest('[data-spot]');
            if (s) toggle(s.getAttribute('data-spot'));
          }}
          dangerouslySetInnerHTML={{ __html: challenge.screen }}
        />
      ) : (
        <div className="bug-code">
          {challenge.code.split('\n').map((line, i) => {
            const n = i + 1;
            const isBug = challenge.bugs.includes(n);
            let state = picked.has(n) ? 'picked' : '';
            if (revealed) state = isBug && picked.has(n) ? 'ok' : isBug ? 'missed' : picked.has(n) ? 'bad' : '';
            return (
              <button key={n} className={`bug-line ${state}`} onClick={() => toggle(n)} disabled={revealed}>
                <span className="bug-num">{n}</span>
                <code dangerouslySetInnerHTML={{ __html: highlight(line || ' ', challenge.lang || 'py') }} />
                {revealed && isBug && <span className="bug-flag">🐞</span>}
              </button>
            );
          })}
        </div>
      )}
    </Shell>
  );
}
