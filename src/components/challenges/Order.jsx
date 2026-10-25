import { useRef, useState } from 'react';
import Shell from './Shell.jsx';
import { rich, shuffle } from '../../lib/utils.jsx';
import { highlight } from '../code/CodeBlock.jsx';
import { sfx } from '../../lib/sound.js';

function initialOrder(n) {
  const idx = [...Array(n).keys()];
  let s = shuffle(idx);
  while (n > 1 && s.every((v, i) => v === i)) s = shuffle(idx);
  return s;
}

export default function Order({ challenge, revealed, onCheck }) {
  const [order, setOrder] = useState(() => initialOrder(challenge.steps.length));
  const dragFrom = useRef(null);
  const [dragging, setDragging] = useState(null);

  function move(from, to) {
    if (revealed || to < 0 || to >= order.length || from === to) return;
    const next = [...order];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setOrder(next);
  }

  function check() {
    const hits = order.filter((v, i) => v === i).length;
    onCheck(hits / order.length);
  }

  return (
    <Shell challenge={challenge} revealed={revealed} canCheck onCheck={check}>
      <p className="ch-hint">Arrastra los pasos o usa las flechas ▲▼.</p>
      <ol className="order-list">
        {order.map((stepIdx, pos) => {
          const state = revealed ? (stepIdx === pos ? 'ok' : 'bad') : '';
          return (
            <li
              key={stepIdx}
              className={`order-item ${state} ${dragging === stepIdx ? 'dragging' : ''}`}
              draggable={!revealed}
              onDragStart={(e) => {
                dragFrom.current = pos;
                setDragging(stepIdx);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragEnter={() => {
                if (dragFrom.current === null || dragFrom.current === pos) return;
                move(dragFrom.current, pos);
                dragFrom.current = pos;
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={() => {
                dragFrom.current = null;
                setDragging(null);
                sfx.click();
              }}
            >
              <span className="order-num">{pos + 1}</span>
              {challenge.lang ? (
                <code className="order-text order-code" dangerouslySetInnerHTML={{ __html: highlight(challenge.steps[stepIdx], challenge.lang) }} />
              ) : (
                <span className="order-text">{rich(challenge.steps[stepIdx])}</span>
              )}
              {revealed ? (
                stepIdx !== pos && <span className="correction">va en el paso {stepIdx + 1}</span>
              ) : (
                <span className="order-btns">
                  <button onClick={() => move(pos, pos - 1)} disabled={pos === 0} aria-label="Subir">▲</button>
                  <button onClick={() => move(pos, pos + 1)} disabled={pos === order.length - 1} aria-label="Bajar">▼</button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </Shell>
  );
}
