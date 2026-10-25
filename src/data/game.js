import { LEVELS, WORLDS } from './levels.js';

export const MAX_HEARTS = 3;
export const STAR_BONUS = 50;
export const STREAK_STEP = 10;
export const STREAK_CAP = 5;

// Rangos: la carrera de un/a profesional de calidad.
export const RANKS = [
  { min: 0, name: 'Tester aprendiz', icon: '🥚' },
  { min: 2500, name: 'Tester junior', icon: '🔍' },
  { min: 6500, name: 'Analista de pruebas', icon: '📋' },
  { min: 11500, name: 'Diseñador/a de pruebas', icon: '🎯' },
  { min: 17000, name: 'Automatizador/a', icon: '🤖' },
  { min: 22500, name: 'QA Engineer', icon: '🛡️' },
  { min: 28000, name: 'Leyenda de la Calidad', icon: '👑' },
];

export function rankFor(xp) {
  let i = 0;
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1].min) i++;
  const current = RANKS[i];
  const next = RANKS[i + 1] || null;
  const progress = next ? (xp - current.min) / (next.min - current.min) : 1;
  return { current, next, progress };
}

export const totalXp = (p) => Object.values(p.levels).reduce((s, l) => s + (l.bestXp || 0), 0);
export const totalStars = (p) => Object.values(p.levels).reduce((s, l) => s + (l.stars || 0), 0);
export const completedCount = (p) => Object.values(p.levels).filter((l) => l.completed).length;
export const MAX_STARS = LEVELS.length * 3;

export function worldCompleted(p, worldId) {
  const w = WORLDS.find((x) => x.id === worldId);
  return !!w && w.levels.every((l) => p.levels[l.id]?.completed);
}

export function worldProgress(p, world) {
  const done = world.levels.filter((l) => p.levels[l.id]?.completed).length;
  const stars = world.levels.reduce((s, l) => s + (p.levels[l.id]?.stars || 0), 0);
  return { done, total: world.levels.length, stars, maxStars: world.levels.length * 3 };
}

const worldBadge = (id, icon, name, what) => ({
  id: `mundo-${id}`,
  icon,
  name,
  desc: `Completa todos los niveles del mundo ${what}.`,
  test: (p) => worldCompleted(p, id),
});

export const BADGES = [
  { id: 'primer-paso', icon: '🚀', name: 'Primer paso', desc: 'Completa tu primer nivel.', test: (p) => completedCount(p) >= 1 },
  { id: 'primer-verde', icon: '🟢', name: 'Primer verde', desc: 'Supera tu primer reto de pytest.', test: (p) => (p.codeWins || 0) >= 1 },
  { id: 'pytest-pro', icon: '🐍', name: 'Pytest pro', desc: 'Supera 15 retos de código.', test: (p) => (p.codeWins || 0) >= 15 },
  { id: 'cazabugs', icon: '🐞', name: 'Cazabugs', desc: 'Encuentra 5 bugs escondidos.', test: (p) => (p.bugsFound || 0) >= 5 },
  { id: 'ojo-de-halcon', icon: '🦅', name: 'Ojo de halcón', desc: 'Encuentra 10 bugs escondidos.', test: (p) => (p.bugsFound || 0) >= 10 },
  { id: 'en-racha', icon: '🔥', name: 'En racha', desc: 'Consigue 5 aciertos seguidos.', test: (p) => p.bestStreak >= 5 },
  { id: 'imparable', icon: '⚡', name: 'Imparable', desc: 'Consigue 15 aciertos seguidos.', test: (p) => p.bestStreak >= 15 },
  { id: 'en-llamas', icon: '☄️', name: 'En llamas', desc: 'Consigue 30 aciertos seguidos.', test: (p) => p.bestStreak >= 30 },
  { id: 'perfeccionista', icon: '💎', name: 'Perfeccionista', desc: 'Consigue 3 estrellas en un nivel.', test: (p) => Object.values(p.levels).some((l) => l.stars === 3) },
  worldBadge('fundamentos', '🧭', 'Fundamentos sólidos', 'Fundamentos de calidad'),
  worldBadge('niveles', '🏗️', 'Arquitecto/a de pruebas', 'Niveles y tipos de prueba'),
  worldBadge('diseno', '🎯', 'Diseñador/a de casos', 'Diseño de casos de prueba'),
  worldBadge('defectos', '🐛', 'Gestor/a de defectos', 'Gestión de defectos'),
  worldBadge('unitarias', '🧪', 'Maestro/a pytest', 'Pruebas unitarias'),
  worldBadge('playwright', '🎭', 'Titiritero/a Playwright', 'Playwright'),
  worldBadge('avanzado', '⚙️', 'Más allá de lo funcional', 'Más allá de lo funcional'),
  { id: 'cazajefes', icon: '👾', name: 'Auditor/a', desc: 'Supera la auditoría final de PixelShop.', test: (p) => worldCompleted(p, 'final') },
  { id: 'coleccionista', icon: '🌟', name: 'Coleccionista', desc: `Consigue las ${MAX_STARS} estrellas.`, test: (p) => totalStars(p) >= MAX_STARS },
  { id: 'leyenda', icon: '👑', name: 'Leyenda de la Calidad', desc: 'Alcanza el rango máximo.', test: (p) => totalXp(p) >= RANKS[RANKS.length - 1].min },
];

export const earnedBadges = (p) => BADGES.filter((b) => b.test(p)).map((b) => b.id);

export const isUnlocked = (p, index) => index === 0 || !!p.levels[LEVELS[index - 1].id]?.completed;
