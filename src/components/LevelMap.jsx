import { LEVELS, WORLDS } from '../data/levels.js';
import { isUnlocked, worldProgress } from '../data/game.js';
import { Speech } from './Mascot.jsx';
import { sfx } from '../lib/sound.js';

const COLS = 5;
const ROW_H = 192;

function tipFor(progress, currentIdx) {
  if (currentIdx === -1) return '¡Lo has completado todo! Eres oficialmente **especialista en calidad**. Repite niveles para conseguir todas las estrellas o imprime tu **diploma**. 👑';
  const lvl = LEVELS[currentIdx];
  const world = WORLDS.find((w) => w.id === lvl.world);
  if (currentIdx === 0) return `¡Bienvenido/a a la **Agencia de Calidad**, **${progress.name}**! Antes de cazar bugs hay que entender qué es la calidad. Empieza por el mundo **Fundamentos**.`;
  if (lvl.boss) return '¡Ha llegado la hora! La **auditoría final de PixelShop** te espera: demuestra todo lo que sabes. 👾';
  if (world.levels[0].id === lvl.id) return `¡Nuevo mundo desbloqueado: **${world.name}**! ${world.description}`;
  return `Tu siguiente misión: **${lvl.title}** (${world.short}). ¿Necesitas repasar? Abre los **Apuntes**.`;
}

function WorldPath({ world, progress, currentIdx, onPlay }) {
  const n = world.levels.length;
  const rows = Math.ceil(n / COLS);
  const height = rows * ROW_H;
  // Posiciones en zigzag: filas de izquierda a derecha y de derecha a izquierda.
  const pos = world.levels.map((_, i) => {
    const r = Math.floor(i / COLS);
    const c = r % 2 === 0 ? i % COLS : COLS - 1 - (i % COLS);
    return { x: ((c + 0.5) / COLS) * 1000, y: r * ROW_H + 62 };
  });
  const path = pos.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');

  return (
    <div className="world-path" style={{ height }}>
      <svg viewBox={`0 0 1000 ${height}`} preserveAspectRatio="none" className="map-path" aria-hidden="true">
        <path d={path} className="path-bg" vectorEffect="non-scaling-stroke" />
        <path d={path} className="path-dash" vectorEffect="non-scaling-stroke" />
      </svg>
      {world.levels.map((lvl, i) => {
        const index = LEVELS.findIndex((l) => l.id === lvl.id);
        const unlocked = isUnlocked(progress, index);
        const data = progress.levels[lvl.id];
        const current = index === currentIdx;
        return (
          <button
            key={lvl.id}
            className={`node ${unlocked ? '' : 'locked'} ${current ? 'current' : ''} ${data?.completed ? 'done' : ''} ${lvl.project ? 'project' : ''} ${lvl.boss ? 'boss' : ''}`}
            style={{ left: `${pos[i].x / 10}%`, top: pos[i].y }}
            onClick={() => {
              if (!unlocked) return;
              sfx.click();
              onPlay(lvl.id);
            }}
            disabled={!unlocked}
            title={unlocked ? lvl.title : 'Completa el nivel anterior para desbloquearlo'}
          >
            {current && <span className="node-here">¡Aquí!</span>}
            <span className="node-circle">
              <span className="node-icon">{unlocked ? lvl.icon : '🔒'}</span>
              <span className="node-num">{index + 1}</span>
            </span>
            <span className="node-stars">
              {[1, 2, 3].map((s) => (
                <span key={s} className={s <= (data?.stars || 0) ? 'on' : ''}>★</span>
              ))}
            </span>
            <span className="node-title">{lvl.title}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function LevelMap({ progress, onPlay, onCertificate, onReset }) {
  const currentIdx = LEVELS.findIndex((l, i) => isUnlocked(progress, i) && !progress.levels[l.id]?.completed);

  return (
    <div className="map-screen">
      <Speech mood={currentIdx === -1 ? 'happy' : 'normal'} size={84}>
        {tipFor(progress, currentIdx)}
      </Speech>

      <nav className="world-strip">
        {WORLDS.map((w) => {
          const wp = worldProgress(progress, w);
          return (
            <a key={w.id} href={`#mundo-${w.id}`} className={`world-chip ${wp.done === wp.total ? 'complete' : ''}`} style={{ '--level-color': w.color }}>
              <span className="world-chip-icon">{w.icon}</span>
              <span className="world-chip-name">{w.short}</span>
              <span className="world-chip-bar">
                <i style={{ width: `${(wp.done / wp.total) * 100}%` }} />
              </span>
            </a>
          );
        })}
      </nav>

      {WORLDS.map((w, wi) => {
        const wp = worldProgress(progress, w);
        const firstIndex = LEVELS.findIndex((l) => l.id === w.levels[0].id);
        const open = isUnlocked(progress, firstIndex);
        return (
          <section key={w.id} id={`mundo-${w.id}`} className={`world ${open ? '' : 'locked'}`} style={{ '--level-color': w.color }}>
            <header className="world-head">
              <div className="world-badge">{w.icon}</div>
              <div className="world-info">
                <div className="world-kicker">Mundo {wi + 1}</div>
                <h2>{w.name}</h2>
                <p>{w.description}</p>
              </div>
              <div className="world-stats">
                <div><strong>{wp.done}/{wp.total}</strong><span>niveles</span></div>
                <div><strong>{wp.stars}/{wp.maxStars}</strong><span>estrellas</span></div>
              </div>
            </header>
            <WorldPath world={w} progress={progress} currentIdx={currentIdx} onPlay={onPlay} />
          </section>
        );
      })}

      <div className="map-footer">
        {progress.levels[LEVELS[LEVELS.length - 1].id]?.completed && (
          <button className="btn btn-primary glow" onClick={onCertificate}>🎓 Ver mi diploma</button>
        )}
        <button className="btn btn-ghost btn-sm danger" onClick={onReset}>Reiniciar progreso</button>
      </div>
    </div>
  );
}
