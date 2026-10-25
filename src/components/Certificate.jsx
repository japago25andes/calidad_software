import { BADGES, MAX_STARS, rankFor, totalStars, totalXp } from '../data/game.js';
import { WORLDS } from '../data/levels.js';
import { Mascot } from './Mascot.jsx';
import { fmtDate } from './Credential.jsx';

/** Diploma final, imprimible en horizontal. */
export default function Certificate({ progress, onBack }) {
  const xp = totalXp(progress);
  const { current } = rankFor(xp);
  const worlds = WORLDS.filter((w) => w.id !== 'final');

  return (
    <div className="page">
      <div className="page-head no-print">
        <button className="btn btn-ghost" onClick={onBack}>← Mapa</button>
        <h1>🎓 Diploma</h1>
        <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Imprimir / PDF</button>
      </div>

      <div className="diploma">
        <div className="diploma-inner">
          <div className="diploma-corner tl" />
          <div className="diploma-corner tr" />
          <div className="diploma-corner bl" />
          <div className="diploma-corner br" />

          <div className="diploma-top">
            <Mascot mood="happy" size={74} />
            <div>
              <div className="diploma-org">Agencia de Calidad · PixelShop</div>
              <div className="diploma-kicker">Software III · Calidad y pruebas</div>
            </div>
          </div>

          <h2 className="diploma-title">Diploma de Especialista en Calidad de Software</h2>
          <p className="diploma-intro">Se otorga a</p>
          <div className="diploma-name">{progress.name}</div>
          <p className="diploma-text">
            por completar <b>Misión: Calidad</b>: dominar los fundamentos de las pruebas, diseñar casos con técnicas de caja negra y caja blanca,
            gestionar defectos, escribir pruebas unitarias con <b>pytest</b>, automatizar la interfaz con <b>Playwright</b> y superar la auditoría
            final de PixelShop.
          </p>

          <div className="diploma-techs">
            {worlds.map((w) => (
              <span key={w.id} className="tech" style={{ '--level-color': w.color }}>
                {w.icon} {w.short}
              </span>
            ))}
          </div>

          <div className="diploma-stats">
            <div><strong>{current.icon} {current.name}</strong><span>Rango</span></div>
            <div><strong>{xp}</strong><span>XP totales</span></div>
            <div><strong>{totalStars(progress)}/{MAX_STARS}</strong><span>Estrellas</span></div>
            <div><strong>{progress.badges.length}/{BADGES.length}</strong><span>Insignias</span></div>
            <div><strong>{progress.bugsFound || 0}</strong><span>Bugs atrapados</span></div>
          </div>

          <div className="diploma-foot">
            <div className="diploma-sign">
              <div className="sign-name">Bichi</div>
              <div className="sign-role">Jefe de inspección · Agencia de Calidad</div>
            </div>
            <div className="diploma-seal" aria-hidden="true">
              <span>✓</span>
            </div>
            <div className="diploma-date">
              <div className="sign-name date">{fmtDate()}</div>
              <div className="sign-role">Fecha</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
