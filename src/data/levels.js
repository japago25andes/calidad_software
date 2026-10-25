import { FUNDAMENTOS } from './worlds/fundamentos.js';
import { NIVELES } from './worlds/niveles.js';
import { DISENO } from './worlds/diseno.js';
import { DEFECTOS } from './worlds/defectos.js';
import { UNITARIAS } from './worlds/unitarias.js';
import { PLAYWRIGHT } from './worlds/playwright.js';
import { AVANZADO } from './worlds/avanzado.js';
import { FINAL } from './worlds/final.js';

/*
  Cada mundo: { id, short, name, icon, color, description, levels: [...] }
  Cada nivel: { id, icon, title, project?, boss?, lesson: [...], challenges: [...] }
*/
export const WORLDS = [FUNDAMENTOS, NIVELES, DISENO, DEFECTOS, UNITARIAS, PLAYWRIGHT, AVANZADO, FINAL];

export const LEVELS = WORLDS.flatMap((w) => w.levels.map((l) => ({ ...l, world: w.id })));

export const worldOf = (level) => WORLDS.find((w) => w.id === level.world);
