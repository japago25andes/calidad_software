import { useMemo, useState } from 'react';
import Shell from './Shell.jsx';
import { rich, shuffle } from '../../lib/utils.jsx';
import { sfx } from '../../lib/sound.js';

export default function Classify({ challenge, revealed, onCheck }) {
  const items = useMemo(() => shuffle(challenge.items), [challenge]);
  const [assign, setAssign] = useState({});
  const binLabel = Object.fromEntries(challenge.bins.map((b) => [b.id, b.label]));
  const done = Object.keys(assign).length === items.length;

  function set(i, bin) {
    if (revealed) return;
    sfx.click();
    setAssign((prev) => ({ ...prev, [i]: bin }));
  }

  function check() {
    const hits = items.filter((it, i) => assign[i] === it.bin).length;
    onCheck(hits / items.length);
  }

  return (
    <Shell
      challenge={challenge}
      revealed={revealed}
      canCheck={done}
      onCheck={check}
      actionHint={`Clasifica todos los elementos (${Object.keys(assign).length}/${items.length})`}
    >
      <div className="classify">
        {items.map((it, i) => {
          const state = revealed ? (assign[i] === it.bin ? 'ok' : 'bad') : assign[i] ? 'set' : '';
          return (
            <div key={i} className={`classify-row ${state}`}>
              <div className="classify-text">
                {rich(it.text)}
                {revealed && assign[i] !== it.bin && <span className="correction">→ {binLabel[it.bin]}</span>}
              </div>
              <div className="bins">
                {challenge.bins.map((b) => (
                  <button
                    key={b.id}
                    className={`bin ${assign[i] === b.id ? 'active' : ''} ${revealed && it.bin === b.id ? 'truth' : ''}`}
                    onClick={() => set(i, b.id)}
                    disabled={revealed}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
