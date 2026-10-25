/*
  PixelShop: la tienda online de práctica sobre la que se escriben las pruebas de Playwright.
  Se carga en un iframe (mismo origen) y expone window.PixelShop:
    mount({ virtual, bugs, route })  monta una pestaña nueva (sin sesión ni carrito)
    clock                            reloj de la app: real (setTimeout) o virtual (lo avanza el simulador)
  Los "bugs" son defectos sembrados a propósito: las pruebas del estudiante deben detectarlos.
*/

export const BASE_URL = 'https://pixelshop.test';

// Defectos que se pueden sembrar en la app (para comprobar que una prueba detecta un bug real).
export const APP_BUGS = {
  cupon20: 'El cupón PIXEL10 descuenta un 20 % en vez de un 10 %',
  'total-sin-cantidad': 'El total ignora las cantidades del carrito',
  'login-sin-validar': 'El login no avisa cuando faltan campos',
  'contador-congelado': 'El contador del carrito no se actualiza',
  'buscar-mayusculas': 'El buscador distingue mayúsculas y minúsculas',
  'pagar-sin-terminos': 'Se puede confirmar la compra sin aceptar los términos',
  'login-lento': 'El login tarda 7 segundos en responder',
  'eliminar-roto': 'El botón Eliminar no quita el producto',
};

const CSS = `
*{box-sizing:border-box}
body{margin:0;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#0f172a;background:#f1f5f9;font-size:15px}
header{display:flex;align-items:center;gap:16px;padding:10px 18px;background:#0f172a;color:#fff}
header .logo{font-weight:800;font-size:18px;color:#fff;text-decoration:none}
header .logo span{color:#38bdf8}
header nav{display:flex;gap:14px;margin-left:auto;align-items:center}
header nav a{color:#e2e8f0;text-decoration:none;font-weight:600}
header nav a:hover{color:#38bdf8}
.badge{display:inline-block;min-width:20px;padding:0 6px;border-radius:99px;background:#22c55e;color:#052e16;font-size:12px;text-align:center;margin-left:4px}
header button{background:#334155;color:#fff;border:0;border-radius:8px;padding:5px 10px;cursor:pointer}
main{padding:16px 18px;max-width:900px}
h1{margin:4px 0 12px;font-size:24px}
h2{margin:0 0 4px;font-size:16px}
.search{width:100%;max-width:360px;padding:9px 12px;border:1px solid #cbd5e1;border-radius:10px;font-size:15px;margin-bottom:12px}
ul.grid{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
ul.grid li{background:#fff;border-radius:14px;padding:14px;box-shadow:0 2px 8px rgba(15,23,42,.08);display:flex;flex-direction:column;gap:6px}
.price{font-weight:800;color:#0369a1;margin:0}
.cat{font-size:12px;color:#64748b;margin:0}
button.primary{background:#0ea5e9;color:#fff;border:0;border-radius:10px;padding:8px 12px;font-weight:700;cursor:pointer}
button.primary:disabled{background:#cbd5e1;color:#64748b;cursor:not-allowed}
button.ghost{background:#e2e8f0;border:0;border-radius:8px;padding:5px 10px;cursor:pointer}
form.box{background:#fff;padding:16px;border-radius:14px;max-width:380px;display:grid;gap:10px;box-shadow:0 2px 8px rgba(15,23,42,.08)}
form.box label{display:grid;gap:4px;font-weight:600;font-size:14px}
form.box input,form.box select{padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;font-size:15px}
form.box .check{display:flex;gap:8px;align-items:center;font-weight:500}
.alert{background:#fee2e2;color:#991b1b;padding:8px 12px;border-radius:8px;font-weight:600}
.ok{background:#dcfce7;color:#166534;padding:8px 12px;border-radius:8px;font-weight:600}
.toast{position:fixed;right:14px;bottom:14px;background:#0f172a;color:#fff;padding:10px 14px;border-radius:10px;font-weight:600}
table{border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;width:100%;max-width:640px}
th,td{padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:left}
.qty{display:inline-flex;gap:6px;align-items:center}
.total{font-size:18px;font-weight:800;margin:12px 0}
.row{display:flex;gap:8px;align-items:end;margin-top:10px}
.row input{padding:7px 10px;border:1px solid #cbd5e1;border-radius:8px}
.empty{color:#64748b}
.pw-hl{position:absolute;pointer-events:none;border:3px solid #f43f5e;border-radius:8px;box-shadow:0 0 0 4px rgba(244,63,94,.25);z-index:9999;transition:all .25s}
.pw-tag{position:absolute;pointer-events:none;z-index:10000;background:#f43f5e;color:#fff;font:600 12px system-ui;padding:2px 8px;border-radius:6px;white-space:nowrap}
.pw-tag.ok{background:#16a34a}
`;

const APP = String.raw`
(function () {
  var PRODUCTS = [
    { id: 1, nombre: 'Audífonos Pixel', precio: 120000, cat: 'Audio', stock: true },
    { id: 2, nombre: 'Teclado mecánico', precio: 250000, cat: 'Periféricos', stock: true },
    { id: 3, nombre: 'Mouse inalámbrico', precio: 80000, cat: 'Periféricos', stock: true },
    { id: 4, nombre: 'Monitor 24 pulgadas', precio: 750000, cat: 'Pantallas', stock: true },
    { id: 5, nombre: 'Cámara web HD', precio: 150000, cat: 'Video', stock: false },
    { id: 6, nombre: 'Parlante bluetooth', precio: 95000, cat: 'Audio', stock: true },
  ];
  var TITLES = { '/': 'Catálogo', '/login': 'Iniciar sesión', '/carrito': 'Carrito', '/checkout': 'Pago', '/confirmacion': 'Pedido confirmado' };
  var money = function (n) { return '$' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };

  var clock = {
    virtual: false, now: 0, queue: [], seq: 0,
    after: function (ms, fn) {
      if (!this.virtual) return setTimeout(fn, ms);
      this.queue.push({ t: this.now + ms, fn: fn, id: ++this.seq });
    },
    advance: function (ms) {
      var end = this.now + ms;
      for (;;) {
        this.queue.sort(function (a, b) { return a.t - b.t || a.id - b.id; });
        var next = this.queue[0];
        if (!next || next.t > end) break;
        this.queue.shift();
        this.now = next.t;
        next.fn();
      }
      this.now = end;
    },
    toReal: function () {
      var self = this;
      this.virtual = false;
      this.queue.forEach(function (q) { setTimeout(q.fn, Math.max(0, q.t - self.now)); });
      this.queue = [];
    },
  };

  var S, bugs, history;

  function has(bug) { return bugs.indexOf(bug) !== -1; }
  function cartCount() { return S.cart.reduce(function (n, i) { return n + i.qty; }, 0); }
  function product(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function subtotal() {
    return S.cart.reduce(function (s, i) { return s + product(i.id).precio * (has('total-sin-cantidad') ? 1 : i.qty); }, 0);
  }
  function total() { return subtotal() * (1 - S.discount); }

  function navigate(path, push) {
    path = path.split('?')[0].split('#')[0] || '/';
    if (!TITLES[path]) path = '/404';
    if (push !== false) history.push(path);
    S.route = path;
    S.flash = S.nextFlash; S.nextFlash = null;
    render();
  }

  function header() {
    var count = has('contador-congelado') ? 0 : cartCount();
    return '<header><a class="logo" href="/">Pixel<span>Shop</span></a><nav aria-label="Principal">' +
      '<a href="/">Inicio</a>' +
      '<a href="/carrito">Carrito <span class="badge" data-testid="contador-carrito">' + count + '</span></a>' +
      (S.user ? '<span>Hola, ' + esc(S.user) + '</span><button data-act="logout">Cerrar sesión</button>' : '<a href="/login">Iniciar sesión</a>') +
      '</nav></header>';
  }

  function catalog() {
    var q = S.search.trim();
    var list = PRODUCTS.filter(function (p) {
      if (!q) return true;
      return has('buscar-mayusculas') ? p.nombre.indexOf(q) !== -1 : p.nombre.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    var body;
    if (S.searching) body = '<p class="empty" role="status">Buscando…</p>';
    else if (!list.length) body = '<p class="empty">No encontramos productos para «' + esc(q) + '»</p>';
    else body = '<ul class="grid" aria-label="Productos">' + list.map(function (p) {
      return '<li data-testid="producto-' + p.id + '"><h2>' + esc(p.nombre) + '</h2><p class="cat">' + p.cat + '</p><p class="price">' + money(p.precio) + '</p>' +
        (p.stock ? '<button class="primary" data-add="' + p.id + '">Agregar al carrito</button>' : '<button class="primary" disabled>Agotado</button>') + '</li>';
    }).join('') + '</ul>';
    return '<h1>Catálogo</h1><input class="search" type="search" placeholder="Buscar productos" aria-label="Buscar" value="' + esc(S.search) + '" data-input="search">' + body;
  }

  function login() {
    return '<h1>Iniciar sesión</h1>' + (S.flash ? '<p class="ok" role="status">' + esc(S.flash) + '</p>' : '') +
      '<form class="box" data-form="login" novalidate>' +
      '<label>Correo electrónico <input id="email" type="email" name="email" autocomplete="off"></label>' +
      '<label for="clave">Contraseña</label><input id="clave" type="password" name="clave">' +
      (S.loginError ? '<p class="alert" role="alert">' + esc(S.loginError) + '</p>' : '') +
      '<button class="primary" type="submit"' + (S.loggingIn ? ' disabled' : '') + '>' + (S.loggingIn ? 'Verificando…' : 'Entrar') + '</button>' +
      '</form>';
  }

  function cart() {
    if (!S.cart.length) return '<h1>Tu carrito</h1><p class="empty">Tu carrito está vacío</p><a href="/">Ver productos</a>';
    var rows = S.cart.map(function (i) {
      var p = product(i.id);
      return '<tr><td>' + esc(p.nombre) + '</td><td><span class="qty">' +
        '<button class="ghost" data-dec="' + p.id + '" aria-label="Quitar uno de ' + esc(p.nombre) + '">−</button>' +
        '<span data-testid="cantidad-' + p.id + '">' + i.qty + '</span>' +
        '<button class="ghost" data-inc="' + p.id + '" aria-label="Agregar uno de ' + esc(p.nombre) + '">+</button></span></td>' +
        '<td>' + money(p.precio * i.qty) + '</td>' +
        '<td><button class="ghost" data-del="' + p.id + '" aria-label="Eliminar ' + esc(p.nombre) + '">Eliminar</button></td></tr>';
    }).join('');
    return '<h1>Tu carrito</h1><table><thead><tr><th>Producto</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<form class="row" data-form="coupon"><label>Cupón <input name="cupon" value="' + esc(S.couponInput) + '"></label><button class="ghost" type="submit">Aplicar</button></form>' +
      (S.couponMsg ? '<p class="' + (S.couponOk ? 'ok' : 'alert') + '" role="' + (S.couponOk ? 'status' : 'alert') + '">' + esc(S.couponMsg) + '</p>' : '') +
      '<p class="total" data-testid="total">Total: ' + money(total()) + '</p>' +
      '<button class="primary" data-act="checkout">Ir a pagar</button>';
  }

  function checkout() {
    if (!S.cart.length && !S.paying) return '<h1>Pago</h1><p class="empty">No hay nada que pagar.</p><a href="/">Ver productos</a>';
    var cities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'];
    var enabled = S.terms || has('pagar-sin-terminos');
    return '<h1>Pago</h1><p>Total a pagar: <strong data-testid="total-pago">' + money(total()) + '</strong></p>' +
      '<form class="box" data-form="checkout" novalidate>' +
      '<label>Nombre completo <input name="nombre" value="' + esc(S.form.nombre) + '"></label>' +
      '<label>Dirección <input name="direccion" value="' + esc(S.form.direccion) + '"></label>' +
      '<label>Ciudad <select name="ciudad">' + cities.map(function (c) { return '<option' + (S.form.ciudad === c ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select></label>' +
      '<label class="check"><input type="checkbox" name="terminos"' + (S.terms ? ' checked' : '') + '> Acepto los términos y condiciones</label>' +
      (S.payError ? '<p class="alert" role="alert">' + esc(S.payError) + '</p>' : '') +
      '<button class="primary" type="submit"' + (enabled && !S.paying ? '' : ' disabled') + '>' + (S.paying ? 'Procesando pago…' : 'Confirmar compra') + '</button>' +
      '</form>';
  }

  function confirmation() {
    return '<h1>¡Gracias por tu compra!</h1><p class="ok" role="status">Tu pedido #' + S.order.id + ' está en camino a ' + esc(S.order.ciudad) + '.</p><a href="/">Seguir comprando</a>';
  }

  function render() {
    var doc = document;
    var focusName = doc.activeElement && doc.activeElement.getAttribute && (doc.activeElement.getAttribute('data-input') || doc.activeElement.name);
    var views = { '/': catalog, '/login': login, '/carrito': cart, '/checkout': checkout, '/confirmacion': confirmation };
    var view = views[S.route];
    doc.title = 'PixelShop · ' + (TITLES[S.route] || 'Página no encontrada');
    doc.body.innerHTML = header() + '<main>' + (view ? view() : '<h1>Página no encontrada</h1><a href="/">Volver al inicio</a>') + '</main>' +
      (S.toast ? '<div class="toast" role="status">' + esc(S.toast) + '</div>' : '');
    if (focusName) {
      var el = doc.querySelector('[data-input="' + focusName + '"], [name="' + focusName + '"]');
      if (el) { el.focus(); if (el.setSelectionRange && el.type !== 'email') try { el.setSelectionRange(el.value.length, el.value.length); } catch (e) {} }
    }
  }

  function showToast(text) {
    S.toast = text;
    var mine = ++S.toastSeq;
    clock.after(2000, function () { if (S.toastSeq === mine) { S.toast = null; render(); } });
  }

  function onClick(e) {
    var t = e.target.closest('a, button');
    if (!t) return;
    if (t.tagName === 'A') {
      e.preventDefault();
      navigate(t.getAttribute('href'));
      return;
    }
    if (t.form && t.type === 'submit') return;
    var id;
    if ((id = t.getAttribute('data-add'))) {
      id = Number(id);
      var item = S.cart.filter(function (i) { return i.id === id; })[0];
      if (item) item.qty++; else S.cart.push({ id: id, qty: 1 });
      showToast('Agregado: ' + product(id).nombre);
      render();
    } else if ((id = t.getAttribute('data-inc'))) {
      S.cart.forEach(function (i) { if (i.id === Number(id)) i.qty++; });
      render();
    } else if ((id = t.getAttribute('data-dec'))) {
      S.cart.forEach(function (i) { if (i.id === Number(id)) i.qty--; });
      S.cart = S.cart.filter(function (i) { return i.qty > 0; });
      render();
    } else if ((id = t.getAttribute('data-del'))) {
      if (!has('eliminar-roto')) S.cart = S.cart.filter(function (i) { return i.id !== Number(id); });
      render();
    } else if (t.getAttribute('data-act') === 'logout') {
      S.user = null;
      navigate('/');
    } else if (t.getAttribute('data-act') === 'checkout') {
      if (!S.user) { S.nextFlash = 'Inicia sesión para pagar'; S.afterLogin = '/checkout'; navigate('/login'); }
      else navigate('/checkout');
    }
  }

  function onInput(e) {
    var t = e.target;
    if (t.getAttribute('data-input') === 'search') {
      S.search = t.value;
      S.searching = true;
      var mine = ++S.searchSeq;
      render();
      clock.after(300, function () { if (S.searchSeq === mine) { S.searching = false; render(); } });
    } else if (t.name === 'cupon') {
      S.couponInput = t.value;
    } else if (t.name === 'nombre' || t.name === 'direccion') {
      S.form[t.name] = t.value;
    }
  }

  function onChange(e) {
    var t = e.target;
    if (t.name === 'ciudad') S.form.ciudad = t.value;
    if (t.name === 'terminos') { S.terms = t.checked; render(); }
  }

  function onSubmit(e) {
    e.preventDefault();
    var f = e.target, kind = f.getAttribute('data-form');
    if (kind === 'login') {
      var email = f.email.value.trim(), clave = f.clave.value;
      S.loginError = null;
      if ((!email || !clave) && !has('login-sin-validar')) { S.loginError = 'Completa todos los campos'; render(); return; }
      S.loggingIn = true;
      render();
      clock.after(has('login-lento') ? 7000 : 800, function () {
        S.loggingIn = false;
        if (email.toLowerCase() === 'ana@pixelshop.test' && clave === 'Clave123') {
          S.user = 'Ana';
          var to = S.afterLogin || '/';
          S.afterLogin = null;
          navigate(to);
        } else {
          S.loginError = 'Correo o contraseña incorrectos';
          render();
        }
      });
    } else if (kind === 'coupon') {
      var code = f.cupon.value.trim().toUpperCase();
      S.couponInput = f.cupon.value;
      if (code === 'PIXEL10') { S.discount = has('cupon20') ? 0.2 : 0.1; S.couponOk = true; S.couponMsg = 'Cupón aplicado: 10% de descuento'; }
      else { S.discount = 0; S.couponOk = false; S.couponMsg = 'Cupón no válido'; }
      render();
    } else if (kind === 'checkout') {
      S.payError = null;
      if (!S.form.nombre.trim() || !S.form.direccion.trim()) { S.payError = 'Completa nombre y dirección'; render(); return; }
      S.paying = true;
      render();
      clock.after(1000, function () {
        S.paying = false;
        S.order = { id: 1024, ciudad: S.form.ciudad };
        S.cart = [];
        S.discount = 0;
        navigate('/confirmacion');
      });
    }
  }

  function mount(opts) {
    opts = opts || {};
    clock.virtual = !!opts.virtual;
    clock.queue = [];
    clock.now = 0;
    bugs = opts.bugs || [];
    history = [];
    S = {
      route: '/', user: null, cart: [], search: '', searching: false, searchSeq: 0, toast: null, toastSeq: 0,
      loginError: null, loggingIn: false, discount: 0, couponInput: '', couponMsg: null, couponOk: false,
      form: { nombre: '', direccion: '', ciudad: 'Bogotá' }, terms: false, paying: false, payError: null, order: null,
      flash: null, nextFlash: null, afterLogin: null,
    };
    navigate(opts.route || '/');
  }

  document.addEventListener('click', onClick);
  document.addEventListener('input', onInput);
  document.addEventListener('change', onChange);
  document.addEventListener('submit', onSubmit);

  window.PixelShop = {
    mount: mount,
    clock: clock,
    navigate: navigate,
    url: function () { return '${BASE_URL}' + (S.route === '/404' ? '/404' : S.route); },
    back: function () { history.pop(); navigate(history[history.length - 1] || '/', false); },
    reload: function () { navigate(S.route, false); },
  };
  mount();
})();
`;

export const PIXELSHOP_DOC = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>PixelShop</title><style>${CSS}</style></head><body><script>${APP}</script></body></html>`;
