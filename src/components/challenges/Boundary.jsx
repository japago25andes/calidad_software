import { useState } from 'react';
import Shell from './Shell.jsx';
import { rich } from '../../lib/utils.jsx';
import { sfx } from '../../lib/sound.js';

/*
  Valores límite: el estudiante elige los valores a probar sobre una recta numérica.
  challenge = { min, max, step?, unit?, partitions: [{ from, to, label, valid }], answer: [valores] }
*/
export default function Boundary({ challenge, revealed, onCheck }) {
  const { min, max, partitions = [], unit = '' } = challenge;
  const step = challenge.step || 1;
  const [vals, setVals] = useState([]);
  const [input, setInput] = useState('');
  const answer = new Set(challenge.answer);
  const pct = (v) => ((v - min) / (max - min)) * 100;
  const ticks = [];
  if ((max - min) / step <= 60) for (let v = min; v <= max + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100);

  function toggle(v) {
    if (revealed || Number.isNaN(v)) return;
    sfx.click();
    setVals((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v].sort((a, b) => a - b)));
  }

  function add(e) {
    e.preventDefault();
    const v = Number(input.replace(',', '.'));
    if (input.trim() && !Number.isNaN(v)) toggle(v);
    setInput('');
  }

  function check() {
    const hits = vals.filter((v) => answer.has(v)).length;
    onCheck(hits / new Set([...vals, ...answer]).size);
  }

  return (
    <Shell challenge={challenge} revealed={revealed} canCheck={vals.length > 0} onCheck={check} actionHint="Elige al menos un valor">
      {challenge.rule && <div className="rule-card">📋 {rich(challenge.rule)}</div>}
      <div className="numline">
        <div className="numline-track">
          {partitions.map((p, i) => (
            <div
              key={i}
              className={`numline-part ${p.valid ? 'valid' : 'invalid'}`}
              style={{ left: `${pct(Math.max(min, p.from))}%`, width: `${pct(Math.min(max, p.to)) - pct(Math.max(min, p.from))}%` }}
              title={p.label}
            >
              <span>{p.label}</span>
            </div>
          ))}
        </div>
        {ticks.length > 0 && (
          <div className="numline-ticks">
            {ticks.map((v) => {
              const on = vals.includes(v);
              const state = revealed ? (answer.has(v) && on ? 'ok' : answer.has(v) ? 'missed' : on ? 'bad' : '') : on ? 'on' : '';
              return (
                <button key={v} className={`tick ${state}`} style={{ left: `${pct(v)}%` }} onClick={() => toggle(v)} disabled={revealed} title={`${v}${unit}`}>
                  <span>{v}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <form className="boundary-input" onSubmit={add}>
        <label>
          Añadir un valor:
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`p. ej. ${min}`} disabled={revealed} inputMode="decimal" />
        </label>
        <button className="btn btn-sm" disabled={revealed || !input.trim()}>Añadir</button>
        <div className="chips">
          {vals.length === 0 && <span className="muted">Aún no has elegido valores.</span>}
          {vals.map((v) => (
            <button key={v} type="button" className={`chip ${revealed ? (answer.has(v) ? 'ok' : 'bad') : ''}`} onClick={() => toggle(v)} disabled={revealed}>
              {v}
              {unit} {!revealed && '✕'}
            </button>
          ))}
        </div>
      </form>
      {revealed && (
        <p className="legend-note">
          Valores esperados: <b>{challenge.answer.map((v) => `${v}${unit}`).join(' · ')}</b>
        </p>
      )}
    </Shell>
  );
}
