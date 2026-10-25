import { useEffect, useState } from 'react';

// El progreso se guarda en el navegador de cada estudiante (localStorage).
const KEY = 'calidad-quest:v1';

export const EMPTY_PROGRESS = {
  name: '',
  since: null, // fecha de inicio (para la credencial)
  levels: {}, // { [levelId]: { completed, stars, bestXp } }
  badges: [],
  streak: 0,
  bestStreak: 0,
  codeWins: 0,
  bugsFound: 0,
  muted: false,
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...EMPTY_PROGRESS, ...JSON.parse(raw) };
  } catch {
    // Almacenamiento no disponible: se juega sin guardar.
  }
  return EMPTY_PROGRESS;
}

export function useProgress() {
  const [progress, setProgress] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress));
    } catch {
      // Ignorado: el juego sigue funcionando sin persistencia.
    }
  }, [progress]);

  return [progress, setProgress];
}
