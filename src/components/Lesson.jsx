import { useEffect, useState } from 'react';
import { Mascot } from './Mascot.jsx';
import CodeBlock from './code/CodeBlock.jsx';
import { rich } from '../lib/utils.jsx';
import { sfx } from '../lib/sound.js';

/*
  Diapositivas de la lección. Cada diapositiva admite:
  title, text, points[], code { lang, code, title } | codes [...],
  tip, mood ('normal' | 'happy' | 'wow' | 'sad'), table { head: [], rows: [[]] }
*/
export default function Lesson({ level, onDone, canSkip }) {
  const [i, setI] = useState(0);
  const slides = level.lesson;
  const slide = slides[i];
  const last = i === slides.length - 1;
  const codes = slide.codes || (slide.code ? [slide.code] : []);

  function go(n) {
    sfx.whoosh();
    setI(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('.cm-editor, input, textarea')) return;
      if (e.key === 'ArrowRight') last ? onDone() : go(i + 1);
      if (e.key === 'ArrowLeft' && i > 0) go(i - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="lesson">
      <div className="lesson-head">
        <span className="pill">📘 Lección</span>
        <div className="dots">
          {slides.map((_, n) => (
            <button key={n} className={`dot ${n === i ? 'active' : ''} ${n < i ? 'seen' : ''}`} onClick={() => go(n)} aria-label={`Diapositiva ${n + 1}`} />
          ))}
        </div>
        {canSkip && (
          <button className="btn btn-ghost btn-sm" onClick={onDone}>
            Saltar lección ⏭
          </button>
        )}
      </div>

      <div className="lesson-card" key={i}>
        <div className="lesson-mascot">
          <Mascot mood={slide.mood || 'normal'} size={110} />
        </div>
        <div className="lesson-body">
          <h2>{slide.title}</h2>
          {slide.text && <p className="lesson-text">{rich(slide.text)}</p>}
          {slide.points && (
            <ul className="lesson-points">
              {slide.points.map((p, n) => (
                <li key={n} style={{ animationDelay: `${0.06 * n + 0.1}s` }}>
                  {rich(p)}
                </li>
              ))}
            </ul>
          )}
          {slide.table && (
            <table className="lesson-table">
              <thead>
                <tr>{slide.table.head.map((h) => <th key={h}>{rich(h)}</th>)}</tr>
              </thead>
              <tbody>
                {slide.table.rows.map((r, n) => (
                  <tr key={n}>{r.map((c, k) => <td key={k}>{rich(c)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          )}
          {codes.length > 0 && (
            <div className={`lesson-codes ${codes.length > 1 ? 'multi' : ''}`}>
              {codes.map((c, n) => (
                <CodeBlock key={n} code={c.code} lang={c.lang} title={c.title} />
              ))}
            </div>
          )}
          {slide.tip && <div className="tip">💡 {rich(slide.tip)}</div>}
        </div>
      </div>

      <div className="lesson-nav">
        <button className="btn btn-ghost" onClick={() => go(i - 1)} disabled={i === 0}>
          ← Atrás
        </button>
        {last ? (
          <button className="btn btn-primary btn-lg glow" onClick={onDone}>
            ¡A los retos! 🔍
          </button>
        ) : (
          <button className="btn btn-primary btn-lg" onClick={() => go(i + 1)}>
            Siguiente →
          </button>
        )}
      </div>
    </div>
  );
}
