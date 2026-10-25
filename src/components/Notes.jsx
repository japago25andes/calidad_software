import { useState } from 'react';
import { NOTES } from '../data/notes.js';
import { WORLDS } from '../data/levels.js';
import CodeBlock from './code/CodeBlock.jsx';
import { rich } from '../lib/utils.jsx';

/** Apuntes: una chuleta de referencia por cada mundo. */
export default function Notes({ onBack }) {
  const worlds = WORLDS.filter((w) => NOTES[w.id]);
  const [tab, setTab] = useState(worlds[0].id);
  const world = worlds.find((w) => w.id === tab);

  return (
    <div className="page">
      <div className="page-head">
        <button className="btn btn-ghost" onClick={onBack}>← Mapa</button>
        <h1>📘 Apuntes</h1>
        <span className="pill">Chuleta de referencia</span>
      </div>

      <div className="notes-tabs">
        {worlds.map((w) => (
          <button key={w.id} className={`notes-tab ${tab === w.id ? 'active' : ''}`} style={{ '--level-color': w.color }} onClick={() => setTab(w.id)}>
            {w.icon} {w.short}
          </button>
        ))}
      </div>

      <div className="notes-grid" style={{ '--level-color': world.color }}>
        {NOTES[tab].map((card) => (
          <section key={card.title} className={`note-card ${card.wide ? 'wide' : ''}`}>
            <h2>{card.title}</h2>
            {card.text && <p>{rich(card.text)}</p>}
            {card.rows && (
              <table className="spec-table notes-table">
                <tbody>
                  {card.rows.map(([k, v]) => (
                    <tr key={k}>
                      <th>{card.mono ? <code>{k}</code> : rich(k)}</th>
                      <td>{rich(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {card.code && <CodeBlock code={card.code.code} lang={card.code.lang} />}
          </section>
        ))}
      </div>
    </div>
  );
}
