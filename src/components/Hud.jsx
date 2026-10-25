import { BADGES, MAX_STARS, rankFor, totalStars, totalXp } from '../data/game.js';

export default function Hud({ progress, onNav, onSave, onToggleMute }) {
  const xp = totalXp(progress);
  const { current, next, progress: frac } = rankFor(xp);

  return (
    <header className="hud">
      <button className="hud-brand" onClick={() => onNav('map')} title="Mapa">
        <span className="logo-badge small"><span>✓</span></span>
        <span className="hud-brand-text">Misión: <b>Calidad</b></span>
      </button>

      <button className="hud-player" onClick={() => onNav('credential')} title="Ver mi licencia">
        <div className="rank-icon">{current.icon}</div>
        <div className="hud-player-info">
          <div className="hud-name">
            {progress.name} · <span className="rank-name">{current.name}</span>
          </div>
          <div className="xpbar" title={next ? `${next.min - xp} XP para ${next.name}` : 'Rango máximo'}>
            <div className="xpbar-fill" style={{ width: `${frac * 100}%` }} />
          </div>
          <div className="hud-sub">{next ? `${xp} / ${next.min} XP → ${next.icon} ${next.name}` : `${xp} XP · ¡rango máximo!`}</div>
        </div>
      </button>

      <div className="hud-stats">
        <div className="stat" title="Racha actual">🔥 {progress.streak}</div>
        <div className="stat" title="Estrellas">⭐ {totalStars(progress)}/{MAX_STARS}</div>
        <button className="stat clickable" onClick={() => onNav('badges')} title="Logros">
          🏅 {progress.badges.length}/{BADGES.length}
        </button>
      </div>

      <nav className="hud-nav">
        <button className="btn btn-ghost btn-sm" onClick={() => onNav('credential')}>🪪 Licencia</button>
        <button className="btn btn-ghost btn-sm" onClick={onSave} title="Guardar o cargar tu progreso">💾 Progreso</button>
        <button className="btn btn-ghost btn-sm" onClick={() => onNav('notes')}>📘 Apuntes</button>
        <button className="btn btn-ghost btn-sm" onClick={() => onNav('badges')}>🏆 Logros</button>
        <button className="btn btn-ghost btn-icon" onClick={onToggleMute} title={progress.muted ? 'Activar sonido' : 'Silenciar'}>
          {progress.muted ? '🔇' : '🔊'}
        </button>
      </nav>
    </header>
  );
}
