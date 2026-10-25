import { useState } from 'react';
import { Speech } from './Mascot.jsx';
import { LEVELS, WORLDS } from '../data/levels.js';
import { BADGES } from '../data/game.js';
import { sfx } from '../lib/sound.js';

export default function Welcome({ savedName, onStart, onContinue, onLoadFile }) {
  const [name, setName] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    sfx.win();
    onStart(name.trim());
  }

  return (
    <div className="welcome">
      <div className="welcome-hero">
        <div className="logo-badge">
          <span>✓</span>
        </div>
        <p className="eyebrow">Agencia de Calidad · Software III</p>
        <h1 className="title-xl">
          Misión: <span className="gradient-text">Calidad</span>
        </h1>
        <p className="lead">
          Aprende a probar software como un profesional: de los fundamentos y el diseño de casos de prueba hasta automatizar con pytest y
          Playwright. Tu objetivo: dejar sin bugs a PixelShop, la tienda online de la agencia.
        </p>
        <div className="tech-row">
          {WORLDS.filter((w) => w.id !== 'final').map((w) => (
            <span key={w.id} className="tech" style={{ '--level-color': w.color }}>
              {w.icon} {w.short}
            </span>
          ))}
        </div>
      </div>

      <div className="welcome-card">
        <Speech mood="happy" size={120} title="Bichi · Agencia de Calidad">
          ¡Hola! Soy **Bichi**. Antes era un **bug** que se escondía en el código de PixelShop… hasta que me atraparon y me pasé al lado de los
          testers. Conozco todos los trucos de los defectos, así que voy a enseñarte a encontrarlos **antes que los usuarios**: con buenos casos de
          prueba, con **pytest** y con **Playwright**. ¿Listo/a para tu primera inspección?
        </Speech>

        {savedName ? (
          <div className="welcome-actions">
            <button className="btn btn-primary btn-lg glow" onClick={onContinue}>
              Continuar como {savedName} →
            </button>
          </div>
        ) : (
          <form className="welcome-form" onSubmit={submit}>
            <label htmlFor="player-name">¿Cómo te llamas? (aparecerá en tu licencia y tu diploma)</label>
            <div className="input-row">
              <input id="player-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre y apellido" maxLength={40} autoFocus autoComplete="off" />
              <button className="btn btn-primary btn-lg glow" disabled={!name.trim()}>
                ¡Empezar la inspección! 🔍
              </button>
            </div>
          </form>
        )}

        <div className="welcome-load">
          <button type="button" className="link-btn" onClick={onLoadFile}>
            📂 ¿Vienes de otro equipo? Carga tu archivo de progreso
          </button>
        </div>

        <div className="feature-row">
          <div>🗺️<span>{WORLDS.length - 1} mundos · {LEVELS.length} niveles</span></div>
          <div>🐍<span>pytest y Playwright reales</span></div>
          <div>🪪<span>Licencia de inspector/a</span></div>
          <div>🎓<span>Diploma final · {BADGES.length} insignias</span></div>
        </div>
      </div>
    </div>
  );
}
