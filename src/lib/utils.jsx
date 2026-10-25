import confetti from 'canvas-confetti';

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Formato ligero: `código`, **negrita** y *cursiva*.
export function rich(text) {
  if (!text) return null;
  return String(text)
    .split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g)
    .map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 1) return <code key={i}>{part.slice(1, -1)}</code>;
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
      return part;
    });
}

const COLORS = ['#0ea5e9', '#22c55e', '#a3e635', '#f87171', '#facc15'];

export function celebrate() {
  const end = Date.now() + 900;
  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors: COLORS });
    confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors: COLORS });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function sparkle() {
  confetti({ particleCount: 40, spread: 60, startVelocity: 30, origin: { y: 0.75 }, colors: COLORS, scalar: 0.8 });
}
