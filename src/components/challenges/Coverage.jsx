import { useState } from 'react';
import Shell from './Shell.jsx';
import { highlight } from '../code/CodeBlock.jsx';
import { rich } from '../../lib/utils.jsx';
import { sfx } from '../../lib/sound.js';

/*
  Cobertura en vivo: elige casos de prueba y mira qué líneas y ramas del código ejecutan.
  challenge = {
    code, statements: [líneas ejecutables],
    branches: [{ id, label }],
    candidates: [{ call: 'descuento(50, False)', lines: [...], branches: ['id', ...] }],
    goal: 'statement' | 'branch', max: nº máximo de casos
  }
*/
export default function Coverage({ challenge, revealed, onCheck }) {
  const [picked, setPicked] = useState(() => new Set());
  const goal = challenge.goal || 'branch';
  const chosen = challenge.candidates.filter((_, i) => picked.has(i));
  const lines = new Set(chosen.flatMap((c) => c.lines));
  const branches = new Set(chosen.flatMap((c) => c.branches || []));
  const stmtPct = Math.round((100 * challenge.statements.filter((l) => lines.has(l)).length) / challenge.statements.length);
  const brPct = challenge.branches?.length ? Math.round((100 * challenge.branches.filter((b) => branches.has(b.id)).length) / challenge.branches.length) : 100;
  const reached = goal === 'branch' ? brPct === 100 : stmtPct === 100;

  function toggle(i) {
    if (revealed) return;
    sfx.click();
    setPicked((p) => {
      const n = new Set(p);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  }

  function check() {
    const pct = (goal === 'branch' ? brPct : stmtPct) / 100;
    onCheck(picked.size > challenge.max ? Math.min(pct, 0.5) : pct);
  }

  return (
    <Shell challenge={challenge} revealed={revealed} canCheck={picked.size > 0} onCheck={check} actionHint="Elige al menos un caso de prueba">
      <div className="cov-layout">
        <div className="cov-code">
          {challenge.code.split('\n').map((line, i) => {
            const n = i + 1;
            const isStmt = challenge.statements.includes(n);
            const cls = !isStmt ? '' : lines.has(n) ? 'hit' : picked.size ? 'miss' : '';
            return (
              <div key={n} className={`cov-line ${cls}`}>
                <span className="bug-num">{n}</span>
                <code dangerouslySetInnerHTML={{ __html: highlight(line || ' ', 'py') }} />
              </div>
            );
          })}
        </div>
        <div className="cov-side">
          <div className="cov-meters">
            <Meter label="Sentencias" pct={stmtPct} active={goal === 'statement'} />
            {challenge.branches?.length > 0 && <Meter label="Ramas" pct={brPct} active={goal === 'branch'} />}
          </div>
          <div className="cov-title">🧪 Casos de prueba (máximo {challenge.max})</div>
          {challenge.candidates.map((c, i) => (
            <button key={i} className={`cov-case ${picked.has(i) ? 'on' : ''}`} onClick={() => toggle(i)} disabled={revealed}>
              <span className="pick-box">{picked.has(i) ? '✓' : ''}</span>
              <code>{c.call}</code>
            </button>
          ))}
          {challenge.branches?.length > 0 && (
            <ul className="cov-branches">
              {challenge.branches.map((b) => (
                <li key={b.id} className={branches.has(b.id) ? 'ok' : ''}>
                  <span className="check-icon">{branches.has(b.id) ? '✓' : '○'}</span> {rich(b.label)}
                </li>
              ))}
            </ul>
          )}
          <p className={`cov-status ${reached && picked.size <= challenge.max ? 'ok' : ''}`}>
            {picked.size > challenge.max
              ? `⚠️ Usas ${picked.size} casos: el reto pide como máximo ${challenge.max}.`
              : reached
                ? `🎯 ¡${goal === 'branch' ? 'Todas las ramas' : 'Todas las sentencias'} cubiertas con ${picked.size} caso(s)!`
                : `Objetivo: 100 % de ${goal === 'branch' ? 'ramas' : 'sentencias'}.`}
          </p>
        </div>
      </div>
    </Shell>
  );
}

function Meter({ label, pct, active }) {
  return (
    <div className={`meter ${active ? 'active' : ''}`}>
      <div className="meter-head">
        <span>{label}</span>
        <b>{pct}%</b>
      </div>
      <div className="meter-bar">
        <div style={{ width: `${pct}%` }} className={pct === 100 ? 'full' : ''} />
      </div>
    </div>
  );
}
