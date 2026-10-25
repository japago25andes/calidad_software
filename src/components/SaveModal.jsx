import { useEffect, useRef, useState } from 'react';
import { Mascot } from './Mascot.jsx';
import { LEVELS } from '../data/levels.js';
import { BADGES, completedCount, totalStars, totalXp } from '../data/game.js';
import { SaveFileError, downloadSave, readSaveFile } from '../lib/savefile.js';
import { sfx } from '../lib/sound.js';

const hasProgress = (p) => !!p.name || Object.keys(p.levels).length > 0;

function Summary({ progress }) {
  return (
    <div className="save-stats">
      <div><strong>{completedCount(progress)}/{LEVELS.length}</strong><span>niveles</span></div>
      <div><strong>{totalStars(progress)}</strong><span>estrellas</span></div>
      <div><strong>{totalXp(progress)}</strong><span>XP</span></div>
      <div><strong>{progress.badges.length}/{BADGES.length}</strong><span>insignias</span></div>
    </div>
  );
}

// Ventana para llevar el progreso de un equipo a otro con un archivo .txt.
export default function SaveModal({ progress, onLoad, onClose }) {
  const inputRef = useRef(null);
  const [saved, setSaved] = useState(null);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function save() {
    setError(null);
    setSaved(await downloadSave(progress));
    sfx.correct();
  }

  async function open(file) {
    if (!file) return;
    setError(null);
    setSaved(null);
    try {
      setPending(await readSaveFile(file));
      sfx.click();
    } catch (e) {
      setError(e instanceof SaveFileError ? e.message : 'No se pudo leer el archivo.');
      sfx.wrong();
    }
  }

  function drop(e) {
    e.preventDefault();
    setDragging(false);
    open(e.dataTransfer.files[0]);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal ${dragging ? 'dragging' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Tu progreso"
        onClick={(e) => e.stopPropagation()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
      >
        <button className="btn btn-ghost btn-icon modal-close" onClick={onClose} title="Cerrar">✕</button>

        {pending ? (
          <>
            <h2>📂 ¿Cargar este progreso?</h2>
            <div className="save-summary">
              <Mascot mood="happy" size={84} />
              <div>
                <div className="save-name">{pending.progress.name}</div>
                <div className="muted">Guardado el {new Date(pending.savedAt).toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' })}</div>
              </div>
            </div>
            <Summary progress={pending.progress} />
            {hasProgress(progress) && (
              <p className="save-warn">
                ⚠️ Esto reemplazará el progreso que hay ahora en este navegador
                {progress.name ? <> (<b>{progress.name}</b>, {completedCount(progress)} niveles, {totalXp(progress)} XP)</> : null}.
              </p>
            )}
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setPending(null)}>Cancelar</button>
              <button
                className="btn btn-primary btn-lg glow"
                onClick={() => {
                  sfx.win();
                  onLoad(pending.progress);
                }}
              >
                Sí, cargar progreso
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>💾 Tu progreso</h2>
            <p className="muted">
              Tu avance se guarda solo en este navegador. Para seguir en otro equipo, guárdalo en un archivo y cárgalo allá.
            </p>
            <div className="save-grid">
              <div className="save-card">
                <div className="save-icon">💾</div>
                <h3>Guardar progreso</h3>
                <p>Descarga un archivo .txt con tu nombre, niveles, estrellas, XP e insignias. Guárdalo en tu correo, Drive o una USB.</p>
                <button className="btn btn-primary" onClick={save} disabled={!progress.name}>Descargar archivo</button>
                {!progress.name && <p className="save-note">Primero escribe tu nombre para empezar a jugar.</p>}
                {saved && <p className="save-ok">✓ Descargado: {saved}</p>}
              </div>
              <div className="save-card">
                <div className="save-icon">📂</div>
                <h3>Cargar progreso</h3>
                <p>Elige el archivo .txt que guardaste antes (o arrástralo aquí) y sigue justo donde ibas.</p>
                <button className="btn" onClick={() => inputRef.current.click()}>Elegir archivo</button>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".txt,text/plain"
                  hidden
                  onChange={(e) => {
                    open(e.target.files[0]);
                    e.target.value = '';
                  }}
                />
              </div>
            </div>
            {error && <div className="save-error">⚠️ {error}</div>}
          </>
        )}
      </div>
    </div>
  );
}
