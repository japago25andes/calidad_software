// Efectos de sonido sintetizados con Web Audio (sin archivos de audio).
let ctx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, { type = 'sine', vol = 0.12, slide } = {}) {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function play(fn) {
  if (muted) return;
  try {
    fn();
  } catch {
    // El audio es opcional.
  }
}

export const sfx = {
  click: () => play(() => tone(660, 0, 0.06, { type: 'triangle', vol: 0.06 })),
  correct: () =>
    play(() => {
      tone(660, 0, 0.12, { type: 'triangle' });
      tone(990, 0.09, 0.2, { type: 'triangle' });
    }),
  wrong: () =>
    play(() => {
      tone(220, 0, 0.18, { type: 'sawtooth', vol: 0.06 });
      tone(160, 0.12, 0.25, { type: 'sawtooth', vol: 0.06 });
    }),
  win: () =>
    play(() => {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.25, { type: 'triangle' }));
      tone(1319, 0.48, 0.5, { type: 'sine', vol: 0.1 });
    }),
  fail: () => play(() => tone(392, 0, 0.6, { type: 'triangle', vol: 0.1, slide: 130 })),
  badge: () =>
    play(() => {
      [880, 1175, 1568].forEach((f, i) => tone(f, i * 0.07, 0.18, { type: 'sine', vol: 0.09 }));
    }),
  whoosh: () => play(() => tone(300, 0, 0.18, { type: 'sine', vol: 0.05, slide: 900 })),
};
