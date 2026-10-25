import { WORLDS } from '../data/levels.js';
import { BADGES, MAX_STARS, rankFor, totalStars, totalXp, worldCompleted, worldProgress } from '../data/game.js';
import { Mascot } from './Mascot.jsx';

function hash(str) {
  let h = 2166136261;
  for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function Barcode({ seed }) {
  const bars = [];
  let x = 0;
  let s = seed;
  for (let i = 0; i < 42; i++) {
    s = Math.imul(s ^ (s >>> 13), 1274126177) >>> 0;
    const w = 1 + (s % 3);
    if (i % 2 === 0) bars.push(<rect key={i} x={x} y="0" width={w} height="34" />);
    x += w + 1;
  }
  return (
    <svg className="barcode" viewBox={`0 0 ${x} 34`} preserveAspectRatio="none" aria-hidden="true">
      {bars}
    </svg>
  );
}

export const fmtDate = (d) => new Date(d || Date.now()).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

/** Licencia de inspector/a de calidad: evoluciona con el rango y gana un sello por cada mundo completado. */
export default function Credential({ progress, onBack }) {
  const xp = totalXp(progress);
  const { current } = rankFor(xp);
  const seed = hash(progress.name || 'qa');
  const id = `QA-${String(seed % 1000000).padStart(6, '0')}`;
  const stamps = WORLDS.filter((w) => w.id !== 'final');
  const finished = worldCompleted(progress, 'final');

  return (
    <div className="page">
      <div className="page-head no-print">
        <button className="btn btn-ghost" onClick={onBack}>← Mapa</button>
        <h1>🪪 Mi licencia</h1>
        <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Imprimir</button>
      </div>

      <div className="credential-wrap">
        <div className="lanyard" aria-hidden="true" />
        <div className={`credential ${finished ? 'gold' : ''}`}>
          <div className="cred-top">
            <span className="cred-logo">✓</span>
            <div>
              <div className="cred-org">Agencia de Calidad</div>
              <div className="cred-team">Licencia de inspector/a de calidad</div>
            </div>
            <span className="cred-chip" aria-hidden="true" />
          </div>

          <div className="cred-body">
            <div className="cred-avatar">{initials(progress.name || 'QA')}</div>
            <div className="cred-main">
              <div className="cred-name">{progress.name}</div>
              <div className="cred-rank">
                {current.icon} {current.name}
              </div>
              <div className="cred-meta">
                <span>Licencia {id}</span>
                <span>Desde {fmtDate(progress.since)}</span>
              </div>
            </div>
            <div className="cred-mascot">
              <Mascot mood={finished ? 'happy' : 'normal'} size={70} />
            </div>
          </div>

          <div className="cred-stamps">
            {stamps.map((w) => {
              const done = worldCompleted(progress, w.id);
              const wp = worldProgress(progress, w);
              return (
                <div key={w.id} className={`stamp ${done ? 'on' : ''}`} style={{ '--level-color': w.color }} title={done ? `${w.name}: completado` : `${w.name}: ${wp.done}/${wp.total} niveles`}>
                  <span className="stamp-icon">{done ? w.icon : '·'}</span>
                  <span className="stamp-name">{w.short}</span>
                </div>
              );
            })}
            <div className={`stamp boss ${finished ? 'on' : ''}`} title="Auditoría final">
              <span className="stamp-icon">{finished ? '👾' : '·'}</span>
              <span className="stamp-name">Auditoría</span>
            </div>
          </div>

          <div className="cred-stats">
            <div><strong>{xp}</strong><span>XP</span></div>
            <div><strong>{totalStars(progress)}/{MAX_STARS}</strong><span>Estrellas</span></div>
            <div><strong>{progress.badges.length}/{BADGES.length}</strong><span>Insignias</span></div>
            <div><strong>{progress.codeWins || 0}</strong><span>Retos de código</span></div>
            <div><strong>{progress.bugsFound || 0}</strong><span>Bugs atrapados</span></div>
          </div>

          <div className="cred-foot">
            <Barcode seed={seed} />
            <span className="cred-access">{finished ? 'AUDITOR/A CERTIFICADO/A' : 'INSPECCIÓN AUTORIZADA'}</span>
          </div>
        </div>
      </div>

      <p className="muted center no-print">
        Cada mundo que completes estampa un sello en tu licencia. Al superar la auditoría final se vuelve <b>dorada</b>.
      </p>
    </div>
  );
}
