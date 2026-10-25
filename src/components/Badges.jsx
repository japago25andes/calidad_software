import { BADGES } from '../data/game.js';

export default function Badges({ progress, onBack }) {
  const earned = new Set(progress.badges);
  return (
    <div className="page">
      <div className="page-head">
        <button className="btn btn-ghost" onClick={onBack}>← Mapa</button>
        <h1>🏆 Logros</h1>
        <span className="pill">{earned.size} / {BADGES.length}</span>
      </div>
      <div className="badge-grid">
        {BADGES.map((b) => (
          <div key={b.id} className={`badge-card ${earned.has(b.id) ? 'earned' : 'locked'}`}>
            <div className="badge-icon">{earned.has(b.id) ? b.icon : '🔒'}</div>
            <div className="badge-name">{b.name}</div>
            <div className="badge-desc">{b.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
