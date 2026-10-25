import { useEffect, useMemo, useState } from 'react';
import Shell from './Shell.jsx';
import { rich, shuffle } from '../../lib/utils.jsx';

export default function Quiz({ challenge, revealed, onCheck }) {
  const options = useMemo(() => shuffle(challenge.options.map((text, i) => ({ text, i }))), [challenge]);
  const [selected, setSelected] = useState(null);

  function choose(opt) {
    if (revealed) return;
    setSelected(opt.i);
    onCheck(opt.i === challenge.answer ? 1 : 0);
  }

  // Atajos de teclado 1-4.
  useEffect(() => {
    const onKey = (e) => {
      const n = Number(e.key);
      if (!revealed && n >= 1 && n <= options.length) choose(options[n - 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <Shell challenge={challenge} revealed={revealed}>
      <div className="options">
        {options.map((opt, n) => {
          let state = '';
          if (revealed) {
            if (opt.i === challenge.answer) state = 'ok';
            else if (opt.i === selected) state = 'bad';
            else state = 'dim';
          }
          return (
            <button key={opt.i} className={`option ${state}`} onClick={() => choose(opt)} disabled={revealed}>
              <span className="option-key">{n + 1}</span>
              <span>{rich(opt.text)}</span>
            </button>
          );
        })}
      </div>
    </Shell>
  );
}
