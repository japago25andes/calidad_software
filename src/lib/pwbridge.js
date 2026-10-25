/*
  Puente del simulador de Playwright: el código Python (src/py/sync_api.py) llama a call(json)
  y aquí se resuelven los locators sobre PixelShop, se ejecutan las acciones y se evalúan los expect().
  Como en Playwright de verdad:
    - las acciones esperan a que el elemento sea visible y esté habilitado (auto-waiting),
    - un locator que encuentra varios elementos al actuar es un error (strict mode),
    - get_by_role usa el rol y el nombre accesible del elemento.
  El tiempo de la app es virtual: esperar 5 segundos no tarda 5 segundos de verdad.
*/
import { BASE_URL } from './pixelshop.js';

const ctx = { frame: null, bugs: [], steps: [], test: null, timeout: 5000 };

export function attachFrame(frame) {
  ctx.frame = frame;
}

export function frameReady() {
  return !!ctx.frame?.contentWindow?.PixelShop;
}

export function beginRun(bugs = []) {
  ctx.bugs = bugs;
  ctx.steps = [];
  ctx.test = null;
}

export const getSteps = () => ctx.steps;

/** Al terminar las pruebas, el reloj vuelve a ser real para poder explorar la app a mano. */
export function endRun() {
  ctx.frame?.contentWindow?.PixelShop?.clock.toReal();
}

const win = () => ctx.frame.contentWindow;
const doc = () => ctx.frame.contentDocument;
const app = () => win().PixelShop;
const tick = (ms) => app().clock.advance(ms);

// ───────────── Texto y coincidencias ─────────────

const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const isRe = (v) => v && typeof v === 'object' && 're' in v;
const toRe = (v) => new RegExp(v.re, v.flags || '');
const pyStr = (v) => (isRe(v) ? `re.compile(r"${v.re}"${v.flags ? ', re.IGNORECASE' : ''})` : JSON.stringify(v));

/** Coincidencia de texto como en Playwright: por defecto, subcadena sin distinguir mayúsculas. */
function textMatches(actual, expected, exact) {
  const a = norm(actual);
  if (isRe(expected)) return toRe(expected).test(a);
  const e = norm(expected);
  return exact ? a === e : a.toLowerCase().includes(e.toLowerCase());
}

// ───────────── Roles y nombres accesibles ─────────────

const INPUT_ROLES = { button: 'button', submit: 'button', reset: 'button', image: 'button', checkbox: 'checkbox', radio: 'radio', range: 'slider', number: 'spinbutton', search: 'searchbox', email: 'textbox', tel: 'textbox', text: 'textbox', url: 'textbox', '': 'textbox' };
const NAME_FROM_CONTENT = new Set(['button', 'link', 'heading', 'cell', 'columnheader', 'rowheader', 'checkbox', 'radio', 'option', 'row', 'switch', 'tab', 'menuitem', 'treeitem', 'tooltip', 'gridcell']);
const SECTIONING = 'article, aside, main, nav, section';

function roleOf(el) {
  const explicit = el.getAttribute('role');
  if (explicit) return explicit.trim().split(/\s+/)[0];
  const tag = el.tagName.toLowerCase();
  if (/^h[1-6]$/.test(tag)) return 'heading';
  switch (tag) {
    case 'button': return 'button';
    case 'a': case 'area': return el.hasAttribute('href') ? 'link' : null;
    case 'input': {
      const type = (el.getAttribute('type') || '').toLowerCase();
      if (['hidden', 'password', 'file', 'color', 'date', 'datetime-local', 'month', 'time', 'week'].includes(type)) return null;
      if (el.hasAttribute('list') && ['', 'text', 'search', 'email', 'tel', 'url'].includes(type)) return 'combobox';
      return INPUT_ROLES[type] ?? 'textbox';
    }
    case 'textarea': return 'textbox';
    case 'select': return el.multiple || el.size > 1 ? 'listbox' : 'combobox';
    case 'option': return 'option';
    case 'ul': case 'ol': case 'menu': return 'list';
    case 'li': return 'listitem';
    case 'img': return el.getAttribute('alt') === '' ? 'presentation' : 'img';
    case 'nav': return 'navigation';
    case 'main': return 'main';
    case 'header': return el.parentElement?.closest(SECTIONING) ? null : 'banner';
    case 'footer': return el.parentElement?.closest(SECTIONING) ? null : 'contentinfo';
    case 'aside': return 'complementary';
    case 'section': return el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby') ? 'region' : null;
    case 'form': return el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby') ? 'form' : null;
    case 'table': return 'table';
    case 'tr': return 'row';
    case 'td': return 'cell';
    case 'th': return el.getAttribute('scope') === 'row' ? 'rowheader' : 'columnheader';
    case 'thead': case 'tbody': case 'tfoot': return 'rowgroup';
    case 'p': return 'paragraph';
    case 'dialog': return 'dialog';
    case 'output': return 'status';
    case 'article': return 'article';
    case 'hr': return 'separator';
    case 'progress': return 'progressbar';
    case 'strong': case 'b': return 'strong';
    default: return null;
  }
}

const isControl = (el) => ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(el.tagName);

/** Texto de un subárbol para el nombre accesible (las imágenes aportan su alt). */
function textOf(node, skipControls = false) {
  let out = '';
  for (const n of node.childNodes) {
    if (n.nodeType === 3) out += n.textContent;
    else if (n.nodeType === 1) {
      if (n.tagName === 'SCRIPT' || n.tagName === 'STYLE' || hiddenForA11y(n)) continue;
      if (n.tagName === 'IMG') out += ` ${n.getAttribute('alt') || ''} `;
      else if (skipControls && isControl(n)) continue;
      else out += ` ${textOf(n, skipControls)} `;
    }
  }
  return norm(out);
}

function labelsOf(el) {
  const parts = [];
  if (el.id) doc().querySelectorAll(`label[for="${CSS.escape(el.id)}"]`).forEach((l) => parts.push(textOf(l, true)));
  const wrap = el.closest('label');
  if (wrap && !parts.length) parts.push(textOf(wrap, true));
  return norm(parts.join(' '));
}

function nameOf(el) {
  const by = el.getAttribute('aria-labelledby');
  if (by) return norm(by.split(/\s+/).map((id) => { const r = doc().getElementById(id); return r ? textOf(r) : ''; }).join(' '));
  const aria = el.getAttribute('aria-label');
  if (aria && aria.trim()) return norm(aria);
  const tag = el.tagName.toLowerCase();
  const type = (el.getAttribute('type') || '').toLowerCase();
  if (tag === 'input' && ['submit', 'button', 'reset'].includes(type)) return norm(el.value || (type === 'submit' ? 'Submit' : type === 'reset' ? 'Reset' : ''));
  if (['input', 'select', 'textarea'].includes(tag)) return labelsOf(el) || norm(el.getAttribute('title') || el.getAttribute('placeholder') || '');
  if (tag === 'img') return norm(el.getAttribute('alt') || el.getAttribute('title') || '');
  if (NAME_FROM_CONTENT.has(roleOf(el))) return textOf(el) || norm(el.getAttribute('title') || '');
  return norm(el.getAttribute('title') || '');
}

/** Etiquetas asociadas (para get_by_label): <label>, aria-label y aria-labelledby. */
function labelTextsOf(el) {
  const out = [];
  const lbl = labelsOf(el);
  if (lbl) out.push(lbl);
  if (el.getAttribute('aria-label')) out.push(norm(el.getAttribute('aria-label')));
  const by = el.getAttribute('aria-labelledby');
  if (by) out.push(nameOf(el));
  return out;
}

function hiddenForA11y(el) {
  for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
    if (n.getAttribute('aria-hidden') === 'true' || n.hidden) return true;
    if (win().getComputedStyle(n).display === 'none') return true;
  }
  return win().getComputedStyle(el).visibility === 'hidden';
}

function isVisible(el) {
  if (!el.isConnected) return false;
  const st = win().getComputedStyle(el);
  if (st.visibility === 'hidden') return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
}

const isDisabled = (el) => !!el.disabled || el.getAttribute('aria-disabled') === 'true' || !!el.closest('fieldset[disabled]');
const isEditable = (el) => (el.tagName === 'INPUT' && !['checkbox', 'radio', 'submit', 'button', 'reset'].includes(el.type)) || el.tagName === 'TEXTAREA' || el.isContentEditable;
const checkedOf = (el) => (el.getAttribute('aria-checked') ? el.getAttribute('aria-checked') === 'true' : !!el.checked);

// ───────────── Resolver locators ─────────────

function candidates(root) {
  return [...root.querySelectorAll('*')].filter((e) => !['SCRIPT', 'STYLE', 'HEAD', 'TITLE', 'META', 'LINK'].includes(e.tagName));
}

function deepest(list) {
  return list.filter((el) => !list.some((o) => o !== el && el.contains(o)));
}

function query(root, s) {
  switch (s.kind) {
    case 'css':
      return [...root.querySelectorAll(s.selector)];
    case 'role':
      return candidates(root).filter((el) => {
        if (roleOf(el) !== s.role) return false;
        if (!s.includeHidden && hiddenForA11y(el)) return false;
        if (s.name != null && !textMatches(nameOf(el), s.name, s.exact)) return false;
        if (s.level != null && Number(el.tagName[1] || el.getAttribute('aria-level')) !== s.level) return false;
        if (s.checked != null && checkedOf(el) !== s.checked) return false;
        if (s.disabled != null && isDisabled(el) !== s.disabled) return false;
        return true;
      });
    case 'text': {
      const own = (el) => (el.tagName === 'INPUT' && ['submit', 'button'].includes(el.type) ? el.value : el.textContent);
      return deepest(candidates(root).filter((el) => textMatches(own(el), s.text, s.exact)));
    }
    case 'label':
      return candidates(root).filter((el) => isControl(el) && el.type !== 'hidden' && labelTextsOf(el).some((t) => textMatches(t, s.text, s.exact)));
    case 'placeholder':
      return candidates(root).filter((el) => el.hasAttribute('placeholder') && textMatches(el.getAttribute('placeholder'), s.text, s.exact));
    case 'alt':
      return candidates(root).filter((el) => el.hasAttribute('alt') && textMatches(el.getAttribute('alt'), s.text, s.exact));
    case 'title':
      return candidates(root).filter((el) => el.hasAttribute('title') && textMatches(el.getAttribute('title'), s.text, s.exact));
    case 'testid':
      return candidates(root).filter((el) => {
        const v = el.getAttribute('data-testid');
        return v != null && (isRe(s.text) ? toRe(s.text).test(v) : v === s.text);
      });
    default:
      throw new Error(`Locator desconocido: ${s.kind}`);
  }
}

function resolve(steps, scope) {
  let set = [scope || doc()];
  for (const s of steps) {
    if (s.kind === 'nth') {
      const i = s.n < 0 ? set.length + s.n : s.n;
      set = set[i] ? [set[i]] : [];
    } else if (s.kind === 'filter') {
      set = set.filter((el) => {
        if (s.hasText != null && !textMatches(el.textContent, s.hasText, false)) return false;
        if (s.hasNotText != null && textMatches(el.textContent, s.hasNotText, false)) return false;
        if (s.has && !resolve(s.has, el).length) return false;
        if (s.hasNot && resolve(s.hasNot, el).length) return false;
        return true;
      });
    } else {
      const out = [];
      for (const root of set) for (const el of query(root, s)) if (!out.includes(el)) out.push(el);
      set = out.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    }
  }
  return set;
}

// ───────────── Descripciones (como las imprime Playwright) ─────────────

function describeStep(s) {
  const opts = (o) => Object.entries(o).filter(([, v]) => v != null && v !== false).map(([k, v]) => `, ${k}=${v === true ? 'True' : pyStr(v)}`).join('');
  switch (s.kind) {
    case 'css': return `locator(${JSON.stringify(s.selector)})`;
    case 'role': return `get_by_role(${JSON.stringify(s.role)}${opts({ name: s.name, exact: s.exact, level: s.level, checked: s.checked, disabled: s.disabled })})`;
    case 'text': return `get_by_text(${pyStr(s.text)}${opts({ exact: s.exact })})`;
    case 'label': return `get_by_label(${pyStr(s.text)}${opts({ exact: s.exact })})`;
    case 'placeholder': return `get_by_placeholder(${pyStr(s.text)}${opts({ exact: s.exact })})`;
    case 'alt': return `get_by_alt_text(${pyStr(s.text)})`;
    case 'title': return `get_by_title(${pyStr(s.text)})`;
    case 'testid': return `get_by_test_id(${pyStr(s.text)})`;
    case 'nth': return s.n === 0 ? 'first' : s.n === -1 ? 'last' : `nth(${s.n})`;
    case 'filter': {
      const parts = [];
      if (s.hasText != null) parts.push(`has_text=${pyStr(s.hasText)}`);
      if (s.hasNotText != null) parts.push(`has_not_text=${pyStr(s.hasNotText)}`);
      if (s.has) parts.push(`has=page.${describe(s.has)}`);
      if (s.hasNot) parts.push(`has_not=page.${describe(s.hasNot)}`);
      return `filter(${parts.join(', ')})`;
    }
    default: return s.kind;
  }
}

export function describe(steps) {
  return steps.map(describeStep).join('.');
}

function short(el) {
  const text = norm(el.textContent).slice(0, 40);
  const attrs = ['type', 'name', 'aria-label', 'data-testid', 'href'].filter((a) => el.hasAttribute(a)).map((a) => ` ${a}="${el.getAttribute(a)}"`).join('');
  return `<${el.tagName.toLowerCase()}${attrs}>${text}${text ? `</${el.tagName.toLowerCase()}>` : ''}`;
}

function strictError(steps, els) {
  return `strict mode violation: ${describe(steps)} resolved to ${els.length} elements:\n${els.slice(0, 5).map((e, i) => `    ${i + 1}) ${short(e)}`).join('\n')}${els.length > 5 ? '\n    …' : ''}\n\nPista: afina el locator (por ejemplo con name=, filter() o .first).`;
}

// ───────────── Esperas, acciones y aserciones ─────────────

/** Repite `probe` avanzando el reloj virtual hasta que diga done o se agote el tiempo. */
function poll(probe, timeout) {
  let waited = 0;
  for (;;) {
    const r = probe();
    if (r.done || waited >= timeout) return { ...r, waited };
    tick(100);
    waited += 100;
  }
}

const ACTIONS_NEED_ENABLED = new Set(['click', 'dblclick', 'fill', 'type', 'check', 'select', 'press']);

function fire(el, type, init = {}) {
  const W = win();
  const Ctor = type.startsWith('key') ? W.KeyboardEvent : type.startsWith('mouse') || type.endsWith('click') ? W.MouseEvent : W.Event;
  el.dispatchEvent(new Ctor(type, { bubbles: true, cancelable: true, ...init }));
}

function perform(el, action, args) {
  switch (action) {
    case 'click':
      el.focus?.();
      el.click();
      return null;
    case 'dblclick':
      el.click();
      el.click();
      fire(el, 'dblclick');
      return null;
    case 'fill':
      if (!isEditable(el)) throw new Error('Error: Element is not an <input>, <textarea> or [contenteditable] element');
      el.focus();
      el.value = args.value;
      fire(el, 'input');
      fire(el, 'change');
      return null;
    case 'type': {
      if (!isEditable(el)) throw new Error('Error: Element is not an <input>, <textarea> or [contenteditable] element');
      el.focus();
      for (const ch of args.value) {
        const cur = doc().activeElement && isEditable(doc().activeElement) ? doc().activeElement : el;
        fire(cur, 'keydown', { key: ch });
        cur.value += ch;
        fire(cur, 'input');
        fire(cur, 'keyup', { key: ch });
      }
      return null;
    }
    case 'press':
      el.focus?.();
      pressKey(el, args.key);
      return null;
    case 'check': {
      if (!['checkbox', 'radio'].includes(el.type) && !el.hasAttribute('aria-checked')) throw new Error('Error: Not a checkbox or radio button');
      if (checkedOf(el) !== args.checked) el.click();
      if (checkedOf(el) !== args.checked) throw new Error('Error: Clicking the checkbox did not change its state');
      return null;
    }
    case 'select': {
      if (el.tagName !== 'SELECT') throw new Error('Error: Element is not a <select> element');
      const opts = [...el.options];
      const want = args.value ?? args.label ?? args.index;
      const opt = args.index != null ? opts[args.index] : opts.find((o) => o.value === want) || opts.find((o) => norm(o.textContent) === norm(want));
      if (!opt) throw new Error(`Error: did not find some options: ${JSON.stringify(want)}`);
      el.value = opt.value;
      fire(el, 'input');
      fire(el, 'change');
      return [opt.value];
    }
    case 'hover':
      fire(el, 'mouseover');
      fire(el, 'mouseenter', { bubbles: false });
      return null;
    case 'focus':
      el.focus();
      return null;
    default:
      return null;
  }
}

function pressKey(el, key) {
  const k = key.split('+').pop();
  fire(el, 'keydown', { key: k });
  if (k === 'Enter' && el.form) el.form.requestSubmit();
  fire(el, 'keyup', { key: k });
}

const pyArgs = (action, args) => {
  if (action === 'fill' || action === 'type') return JSON.stringify(args.value);
  if (action === 'press') return JSON.stringify(args.key);
  if (action === 'select') return args.label != null ? `label=${JSON.stringify(args.label)}` : JSON.stringify(args.value ?? args.index);
  return '';
};
const PY_ACTION = { type: 'press_sequentially', select: 'select_option' };

function step(kind, title, ok = true, error = null, replay = null) {
  ctx.steps.push({ test: ctx.test, kind, title, ok, error, replay });
}

function act({ steps, action, args = {}, timeout }) {
  const t = timeout ?? ctx.timeout;
  const name = action === 'check' ? (args.checked ? 'check' : 'uncheck') : PY_ACTION[action] || action;
  const title = `${describe(steps)}.${name}(${pyArgs(action, args)})`;
  const r = poll(() => {
    const els = resolve(steps);
    if (els.length > 1) return { done: true, strict: els };
    if (!els.length) return { done: false, why: 'waiting for element' };
    const el = els[0];
    if (!['focus', 'scroll'].includes(action) && !isVisible(el)) return { done: false, why: 'element is not visible', el };
    if (ACTIONS_NEED_ENABLED.has(action) && isDisabled(el)) return { done: false, why: 'element is not enabled', el };
    return { done: true, el };
  }, t);
  if (r.strict) {
    const error = strictError(steps, r.strict);
    step('action', title, false, error);
    return { error };
  }
  if (!r.done) {
    const error = `Locator.${name}: Timeout ${t}ms exceeded.\nCall log:\n  - waiting for ${describe(steps)}${r.why !== 'waiting for element' ? `\n  - ${r.why}` : ''}`;
    step('action', title, false, error);
    return { error, timeout: true };
  }
  try {
    const value = perform(r.el, action, args);
    step('action', title, true, null, { op: 'act', steps, action, args });
    tick(50);
    return { value };
  } catch (e) {
    step('action', title, false, e.message);
    return { error: e.message };
  }
}

const PHRASES = {
  visible: 'to be visible', hidden: 'to be hidden', enabled: 'to be enabled', disabled: 'to be disabled', editable: 'to be editable',
  checked: 'to be checked', unchecked: 'to be unchecked', empty: 'to be empty', focused: 'to be focused', attached: 'to be attached', detached: 'to be detached',
  text: 'to have text', containText: 'to contain text', value: 'to have value', count: 'to have count', attribute: 'to have attribute',
  class: 'to have class', containClass: 'to contain class', accessibleName: 'to have accessible name',
};
const SINGLE = new Set(['visible', 'enabled', 'disabled', 'editable', 'checked', 'unchecked', 'empty', 'focused', 'value', 'attribute', 'class', 'containClass', 'accessibleName']);

function fullMatch(actual, expected, ignoreCase) {
  const a = norm(actual);
  if (isRe(expected)) return toRe(expected).test(a);
  return ignoreCase ? a.toLowerCase() === norm(expected).toLowerCase() : a === norm(expected);
}
function containsMatch(actual, expected, ignoreCase) {
  const a = norm(actual);
  if (isRe(expected)) return toRe(expected).test(a);
  return ignoreCase ? a.toLowerCase().includes(norm(expected).toLowerCase()) : a.includes(norm(expected));
}

function evaluate(kind, els, a) {
  const el = els[0];
  const need = () => (el ? null : { pass: false, actual: '<element(s) not found>' });
  switch (kind) {
    case 'count': return { pass: els.length === a.expected, actual: els.length };
    case 'visible': return need() || { pass: isVisible(el), actual: isVisible(el) ? 'visible' : 'hidden' };
    case 'hidden': return { pass: !el || !isVisible(el), actual: el && isVisible(el) ? 'visible' : 'hidden' };
    case 'attached': return { pass: !!el, actual: el ? 'attached' : 'detached' };
    case 'detached': return { pass: !el, actual: el ? 'attached' : 'detached' };
    case 'enabled': return need() || { pass: !isDisabled(el), actual: isDisabled(el) ? 'disabled' : 'enabled' };
    case 'disabled': return need() || { pass: isDisabled(el), actual: isDisabled(el) ? 'disabled' : 'enabled' };
    case 'editable': return need() || { pass: isEditable(el) && !isDisabled(el) && !el.readOnly, actual: isEditable(el) ? 'editable' : 'not editable' };
    case 'checked': return need() || { pass: checkedOf(el), actual: checkedOf(el) ? 'checked' : 'unchecked' };
    case 'unchecked': return need() || { pass: !checkedOf(el), actual: checkedOf(el) ? 'checked' : 'unchecked' };
    case 'empty': return need() || { pass: isEditable(el) ? !el.value : !norm(el.textContent), actual: isEditable(el) ? el.value : norm(el.textContent) };
    case 'focused': return need() || { pass: doc().activeElement === el, actual: doc().activeElement === el ? 'focused' : 'not focused' };
    case 'value': return need() || { pass: isRe(a.expected) ? toRe(a.expected).test(el.value) : el.value === String(a.expected), actual: el.value };
    case 'attribute': {
      if (!el) return need();
      const v = el.getAttribute(a.name);
      return { pass: v != null && (isRe(a.expected) ? toRe(a.expected).test(v) : v === String(a.expected)), actual: v };
    }
    case 'class': return need() || { pass: fullMatch(el.className, a.expected), actual: el.className };
    case 'containClass': return need() || { pass: el.classList.contains(a.expected), actual: el.className };
    case 'accessibleName': return need() || { pass: fullMatch(nameOf(el), a.expected), actual: nameOf(el) };
    case 'text':
    case 'containText': {
      const match = kind === 'text' ? fullMatch : containsMatch;
      if (Array.isArray(a.expected)) {
        const texts = els.map((e) => norm(e.textContent));
        return { pass: texts.length === a.expected.length && texts.every((t, i) => match(t, a.expected[i], a.ignoreCase)), actual: JSON.stringify(texts) };
      }
      if (!el) return need();
      return { pass: match(el.textContent, a.expected, a.ignoreCase), actual: norm(el.textContent) };
    }
    default:
      throw new Error(`Aserción desconocida: ${kind}`);
  }
}

function expectLocator(a) {
  const t = a.timeout ?? ctx.timeout;
  const phrase = `${a.negate ? 'not ' : ''}${PHRASES[a.kind]}`;
  const exp = a.expected != null ? ` ${pyStr(a.expected)}` : '';
  const title = `expect(${describe(a.steps)}).${a.negate ? 'not_' : ''}${phrase.replace(/^not /, '').replace(/ /g, '_')}(${a.expected != null ? pyStr(a.expected) : ''})`;
  const multiOk = a.kind === 'count' || a.kind === 'hidden' || a.kind === 'attached' || a.kind === 'detached' || ((a.kind === 'text' || a.kind === 'containText') && Array.isArray(a.expected));
  const r = poll(() => {
    const els = resolve(a.steps);
    if (els.length > 1 && !multiOk && (SINGLE.has(a.kind) || a.kind === 'text' || a.kind === 'containText')) return { done: true, strict: els };
    const res = evaluate(a.kind, els, a);
    return { done: a.negate ? !res.pass : res.pass, ...res, el: els[0] };
  }, t);
  if (r.strict) {
    const error = strictError(a.steps, r.strict);
    step('expect', title, false, error);
    return { error };
  }
  if (!r.done) {
    const error = `Locator expected ${phrase}${exp}\nActual value: ${r.actual}\nCall log:\n  - Expect "${phrase.replace(/ /g, '_')}" with timeout ${t}ms\n  - waiting for ${describe(a.steps)}`;
    step('expect', title, false, error);
    return { error, assertion: true };
  }
  step('expect', title, true, null, { op: 'expect', steps: a.steps });
  return { value: null };
}

function expectPage(a) {
  const t = a.timeout ?? ctx.timeout;
  const get = () => (a.kind === 'url' ? app().url() : doc().title);
  const expected = !isRe(a.expected) && a.kind === 'url' && String(a.expected).startsWith('/') ? BASE_URL + a.expected : a.expected;
  const r = poll(() => {
    const actual = get();
    const pass = isRe(expected) ? toRe(expected).test(actual) : actual === expected;
    return { done: a.negate ? !pass : pass, actual };
  }, t);
  const phrase = a.kind === 'url' ? 'to have URL' : 'to have title';
  const title = a.waitOnly ? `page.wait_for_url(${pyStr(a.expected)})` : `expect(page).${a.negate ? 'not_' : ''}${phrase.toLowerCase().replace(/ /g, '_')}(${pyStr(a.expected)})`;
  if (!r.done) {
    if (a.waitOnly) {
      const error = `Page.wait_for_url: Timeout ${t}ms exceeded.\n  waiting for navigation to ${pyStr(a.expected)}\n  current URL: ${r.actual}`;
      step('expect', title, false, error);
      return { error, timeout: true };
    }
    const error = `Page ${a.negate ? 'not ' : ''}${phrase} ${pyStr(a.expected)}\nActual value: ${r.actual}\nCall log:\n  - Expect "${phrase.toLowerCase().replace(/ /g, '_')}" with timeout ${t}ms`;
    step('expect', title, false, error);
    return { error, assertion: true };
  }
  step('expect', title, true);
  return { value: null };
}

function single(steps, timeout) {
  const t = timeout ?? ctx.timeout;
  const r = poll(() => {
    const els = resolve(steps);
    if (els.length > 1) return { done: true, strict: els };
    return { done: els.length === 1, el: els[0] };
  }, t);
  if (r.strict) return { error: strictError(steps, r.strict) };
  if (!r.done) return { error: `Timeout ${t}ms exceeded.\nCall log:\n  - waiting for ${describe(steps)}`, timeout: true };
  return { el: r.el };
}

function read(el, what, args) {
  switch (what) {
    case 'textContent': return el.textContent;
    case 'innerText': return norm(el.innerText ?? el.textContent);
    case 'value': return el.value ?? '';
    case 'attribute': return el.getAttribute(args.name);
    case 'visible': return isVisible(el);
    case 'enabled': return !isDisabled(el);
    case 'checked': return checkedOf(el);
    default: return null;
  }
}

function goto(url) {
  let path;
  if (url.startsWith('/')) path = url;
  else if (url.startsWith(BASE_URL)) path = url.slice(BASE_URL.length) || '/';
  else if (/^https?:\/\//.test(url)) {
    const error = `Page.goto: net::ERR_NAME_NOT_RESOLVED at ${url}\n(En este simulador solo existe PixelShop: ${BASE_URL})`;
    step('goto', `page.goto(${JSON.stringify(url)})`, false, error);
    return { error };
  } else path = `/${url}`;
  app().navigate(path);
  tick(100);
  step('goto', `page.goto(${JSON.stringify(url)})`, true, null, { op: 'goto', path });
  return { value: null };
}

/** Punto de entrada que llama el Python del simulador. */
export function call(json) {
  const a = JSON.parse(json);
  let res;
  try {
    res = dispatch(a);
  } catch (e) {
    res = { error: e.message };
  }
  return JSON.stringify(res ?? { value: null });
}

function dispatch(a) {
  if (!frameReady()) return { error: 'PixelShop no está cargada todavía. Espera un momento y vuelve a ejecutar.' };
  switch (a.op) {
    case 'reset':
      ctx.test = a.test;
      ctx.timeout = 5000;
      app().mount({ virtual: true, bugs: ctx.bugs });
      step('test', a.test);
      return { value: null };
    case 'endTest':
      return { value: null };
    case 'goto': return goto(a.url);
    case 'reload':
      app().reload();
      step('goto', 'page.reload()');
      return { value: null };
    case 'back':
      app().back();
      step('goto', 'page.go_back()');
      return { value: null };
    case 'url': return { value: app().url() };
    case 'title': return { value: doc().title };
    case 'content': return { value: doc().documentElement.outerHTML };
    case 'wait':
      tick(a.ms);
      step('note', a.sleep ? `time.sleep(${a.ms / 1000})  ⚠️ espera fija: mejor usa expect()` : `page.wait_for_timeout(${a.ms})`);
      return { value: null };
    case 'setTimeout':
      ctx.timeout = a.ms;
      return { value: null };
    case 'note':
      step('note', a.text);
      return { value: null };
    case 'describe': return { value: describe(a.steps) };
    case 'count': return { value: resolve(a.steps).length };
    case 'all': return { value: resolve(a.steps).map((el) => read(el, a.what, {})) };
    case 'query': {
      const r = single(a.steps, a.timeout);
      if (r.error) return r;
      return { value: read(r.el, a.what, a.args || {}) };
    }
    case 'waitFor': {
      const t = a.timeout ?? ctx.timeout;
      const r = poll(() => {
        const els = resolve(a.steps);
        const ok = { visible: els.length === 1 && isVisible(els[0]), hidden: !els.length || !isVisible(els[0]), attached: els.length > 0, detached: !els.length }[a.state];
        return { done: ok };
      }, t);
      step('action', `${describe(a.steps)}.wait_for(state=${JSON.stringify(a.state)})`, r.done, r.done ? null : `Timeout ${t}ms exceeded`);
      return r.done ? { value: null } : { error: `Locator.wait_for: Timeout ${t}ms exceeded.\n  waiting for ${describe(a.steps)} to be ${a.state}`, timeout: true };
    }
    case 'act': return act(a);
    case 'key': {
      const el = doc().activeElement || doc().body;
      if (a.key) pressKey(el, a.key);
      else perform(el, 'type', { value: a.text });
      step('action', a.key ? `page.keyboard.press(${JSON.stringify(a.key)})` : `page.keyboard.type(${JSON.stringify(a.text)})`);
      tick(50);
      return { value: null };
    }
    case 'expect': return expectLocator(a);
    case 'expectPage': return expectPage(a);
    default:
      return { error: `Operación desconocida: ${a.op}` };
  }
}

// ───────────── Repetición visual ("ver al robot en acción") ─────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function highlight(el, label, ok) {
  const d = doc();
  d.querySelectorAll('.pw-hl, .pw-tag').forEach((n) => n.remove());
  if (!el) return;
  const r = el.getBoundingClientRect();
  const sx = win().scrollX;
  const sy = win().scrollY;
  const box = d.createElement('div');
  box.className = 'pw-hl';
  Object.assign(box.style, { left: `${r.left + sx - 4}px`, top: `${r.top + sy - 4}px`, width: `${r.width + 8}px`, height: `${r.height + 8}px` });
  if (ok) box.style.borderColor = '#16a34a';
  const tag = d.createElement('div');
  tag.className = `pw-tag${ok ? ' ok' : ''}`;
  tag.textContent = label;
  Object.assign(tag.style, { left: `${r.left + sx}px`, top: `${Math.max(0, r.top + sy - 26)}px` });
  d.body.append(box, tag);
  el.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
}

/** Repite, despacio y en tiempo real, los pasos que pasaron en una prueba. */
export async function replay(test, { onStep, signal } = {}) {
  const steps = ctx.steps.filter((s) => s.test === test && s.replay);
  app().mount({ virtual: false, bugs: ctx.bugs });
  await sleep(400);
  for (const [i, s] of steps.entries()) {
    if (signal?.aborted) return;
    onStep?.(ctx.steps.indexOf(s), i);
    const rp = s.replay;
    if (rp.op === 'goto') {
      app().navigate(rp.path);
      await sleep(600);
      continue;
    }
    let el = null;
    for (let w = 0; w < 30 && !el; w++) {
      const els = resolve(rp.steps);
      el = els.length === 1 && isVisible(els[0]) ? els[0] : null;
      if (!el && rp.op === 'expect') break;
      if (!el) await sleep(100);
    }
    if (rp.op === 'expect') {
      highlight(el || resolve(rp.steps)[0], '✓ expect', true);
      await sleep(900);
      continue;
    }
    if (!el) break;
    const name = rp.action === 'check' ? (rp.args.checked ? 'check' : 'uncheck') : PY_ACTION[rp.action] || rp.action;
    highlight(el, name, false);
    await sleep(750);
    try {
      perform(el, rp.action, rp.args);
    } catch {
      break;
    }
    await sleep(450);
  }
  highlight(null);
  onStep?.(-1, -1);
}
