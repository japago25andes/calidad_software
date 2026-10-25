// ───────────────────────── MUNDO 6: AUTOMATIZACIÓN CON PLAYWRIGHT ─────────────────────────
// Los retos con `app: true` ejecutan pytest + el simulador de Playwright contra PixelShop.
// `appBugs` siembra defectos en la app (ver APP_BUGS en lib/pixelshop.js): las pruebas deben detectarlos.
import { code, py } from '../helpers.js';

const LOGIN_HELPER = py`
  def iniciar_sesion(page: Page):
      page.get_by_label("Correo electrónico").fill("ana@pixelshop.test")
      page.get_by_label("Contraseña").fill("Clave123")
      page.get_by_role("button", name="Entrar").click()
`;

export const PLAYWRIGHT = {
  id: 'playwright',
  short: 'Playwright',
  name: 'Automatización con Playwright',
  icon: '🎭',
  color: '#a855f7',
  description: 'Pruebas de extremo a extremo sobre PixelShop con Playwright para Python: locators, acciones, aserciones, Page Object Model y herramientas.',
  levels: [
    // ─────────────── 1
    {
      id: 'p-intro',
      icon: '🎭',
      title: 'Conoce Playwright',
      lesson: [
        {
          title: 'Un robot que usa el navegador por ti',
          text: '**Playwright** (de Microsoft) automatiza navegadores reales: Chromium, Firefox y WebKit. Con el plugin **pytest-playwright** escribes pruebas E2E con pytest:',
          code: { lang: 'bash', code: 'pip install pytest-playwright\nplaywright install          # descarga los navegadores\npytest --headed             # ver el navegador mientras prueba\npytest --browser firefox    # elegir navegador' },
        },
        {
          title: 'Tu primera prueba E2E',
          code: {
            lang: 'py',
            code: code`
              from playwright.sync_api import Page, expect


              def test_catalogo(page: Page):
                  page.goto("https://pixelshop.test/")
                  expect(page).to_have_title("PixelShop · Catálogo")
                  expect(page.get_by_role("heading", name="Catálogo")).to_be_visible()
            `,
          },
          points: ['`page` es una **fixture** del plugin: cada prueba recibe una pestaña nueva y limpia.', '`page.goto()` navega; `expect()` hace **aserciones web** que esperan solas.', 'Con `--base-url` puedes escribir solo la ruta: `page.goto("/")`.'],
        },
        {
          title: 'En este juego',
          text: 'Aquí usarás un **simulador** de Playwright para Python con la misma sintaxis, que maneja la tienda **PixelShop** dentro del juego. Después de ejecutar verás los **pasos** de cada prueba y podrás pulsar **▶ Ver al robot** para verla en acción.',
          tip: 'Lo que aprendas aquí lo aplicas tal cual con Playwright real en tu proyecto de clase. 🎭',
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'order',
          question: 'Ordena los pasos para empezar con Playwright en Python.',
          steps: ['`pip install pytest-playwright`', '`playwright install`', 'Escribir `test_*.py` con la fixture `page`', 'Ejecutar `pytest`'],
          explanation: '`playwright install` descarga los navegadores que Playwright controla.',
        },
        {
          type: 'py',
          kind: 'pw',
          app: true,
          question: 'Tu primera prueba E2E',
          instructions:
            'Explora PixelShop en el navegador de la derecha y luego:\n1. Completa `test_catalogo_tiene_titulo`: comprueba que el título de la pestaña es **PixelShop · Catálogo** (`expect(page).to_have_title(...)`).\n2. Agrega otra prueba que compruebe que el catálogo muestra **6 productos** (`get_by_role("listitem")` y `to_have_count`).',
          files: {
            'test_catalogo.py': py`
              from playwright.sync_api import Page, expect


              def test_catalogo_tiene_titulo(page: Page):
                  page.goto("/")
                  # Comprueba el título de la pestaña
            `,
          },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'Tienes al menos 2 pruebas', minTests: 2 },
            { text: 'Compruebas el título con `to_have_title`', uses: 'to_have_title\\(' },
            { text: 'Compruebas la cantidad de productos con `to_have_count`', uses: 'to_have_count\\(\\s*6\\s*\\)' },
          ],
          solution: {
            'test_catalogo.py': py`
              from playwright.sync_api import Page, expect


              def test_catalogo_tiene_titulo(page: Page):
                  page.goto("/")
                  expect(page).to_have_title("PixelShop · Catálogo")


              def test_catalogo_muestra_seis_productos(page: Page):
                  page.goto("/")
                  expect(page.get_by_role("listitem")).to_have_count(6)
            `,
          },
          hint: '`expect(page).to_have_title("PixelShop · Catálogo")` y `expect(page.get_by_role("listitem")).to_have_count(6)`.',
        },
        {
          type: 'quiz',
          question: '¿Qué es `page` en una prueba de pytest-playwright?',
          options: ['Una fixture que entrega una pestaña nueva del navegador para cada prueba', 'Una variable global que hay que crear a mano', 'El archivo HTML de la página', 'Un mock del navegador'],
          answer: 0,
          explanation: 'Como cada prueba recibe una pestaña nueva (con su propio contexto: sin cookies ni sesión), las pruebas son **independientes**.',
        },
      ],
    },

    // ─────────────── 2
    {
      id: 'p-locators',
      icon: '🎯',
      title: 'Locators que no se rompen',
      lesson: [
        {
          title: 'Buscar elementos como lo haría una persona',
          text: 'Un **locator** describe cómo encontrar un elemento. Playwright recomienda usar, en este orden:',
          table: {
            head: ['Locator', 'Ejemplo', 'Para…'],
            rows: [
              ['`get_by_role`', '`page.get_by_role("button", name="Entrar")`', 'Casi todo: botones, enlaces, títulos, casillas…'],
              ['`get_by_label`', '`page.get_by_label("Contraseña")`', 'Campos de formulario'],
              ['`get_by_placeholder`', '`page.get_by_placeholder("Buscar productos")`', 'Campos sin etiqueta visible'],
              ['`get_by_text`', '`page.get_by_text("Tu carrito está vacío")`', 'Textos sin rol interactivo'],
              ['`get_by_test_id`', '`page.get_by_test_id("total")`', 'Cuando nada de lo anterior sirve (`data-testid`)'],
              ['`locator(css)`', '`page.locator("#app > div:nth-child(3)")`', '⚠️ Último recurso: frágil'],
            ],
          },
        },
        {
          title: '¿Por qué roles y etiquetas?',
          points: [
            'Son lo que **ven y usan** las personas (y los lectores de pantalla): si cambian, el usuario también lo nota.',
            'Un selector CSS como `div > div:nth-child(3) > button` se rompe con cualquier cambio de diseño.',
            'Bonus: si `get_by_role` o `get_by_label` no encuentran algo, quizá hay un **problema de accesibilidad**.',
          ],
          tip: 'Ojo: un `<input type="password">` **no tiene rol** textbox. Para la contraseña usa `get_by_label`.',
          mood: 'wow',
        },
      ],
      challenges: [
        {
          type: 'quiz',
          question: '¿Cuál es el locator más **robusto** para el botón «Agregar al carrito» del Teclado mecánico?',
          options: [
            '`page.get_by_role("listitem").filter(has_text="Teclado mecánico").get_by_role("button", name="Agregar al carrito")`',
            '`page.locator("ul > li:nth-child(2) > button")`',
            '`page.locator("xpath=/html/body/main/ul/li[2]/button")`',
            '`page.locator(".primary").nth(1)`',
          ],
          answer: 0,
          explanation: 'Se basa en lo que ve el usuario (el producto y el texto del botón), no en la posición dentro del HTML.',
        },
        {
          type: 'classify',
          question: '¿Locator robusto o frágil?',
          bins: [
            { id: 'ok', label: '💪 Robusto' },
            { id: 'mal', label: '🥀 Frágil' },
          ],
          items: [
            { text: '`page.get_by_role("link", name="Carrito")`', bin: 'ok' },
            { text: '`page.locator("div.css-1x2y3z > span")`', bin: 'mal' },
            { text: '`page.get_by_label("Correo electrónico")`', bin: 'ok' },
            { text: '`page.locator("//div[3]/form/input[2]")`', bin: 'mal' },
            { text: '`page.get_by_test_id("total")`', bin: 'ok' },
            { text: '`page.locator("button").nth(7)`', bin: 'mal' },
          ],
          explanation: 'Clases generadas, rutas XPath absolutas y posiciones cambian con facilidad. Roles, etiquetas y test ids son estables.',
        },
        {
          type: 'py',
          kind: 'pw',
          app: true,
          question: 'Automatiza el inicio de sesión',
          instructions:
            'Completa `test_login_correcto` con locators **robustos** (`get_by_label`, `get_by_role`, `get_by_text`):\n1. Correo **ana@pixelshop.test** · contraseña **Clave123** · botón «Entrar».\n2. Comprueba que aparece «Hola, Ana».\nLuego escribe `test_login_incorrecto` con una contraseña equivocada y comprueba la alerta (`get_by_role("alert")`) con el texto «Correo o contraseña incorrectos».',
          files: {
            'test_login.py': py`
              from playwright.sync_api import Page, expect


              def test_login_correcto(page: Page):
                  page.goto("/login")
                  # 1. Llena el correo y la contraseña
                  # 2. Pulsa «Entrar»
                  # 3. Comprueba que aparece «Hola, Ana»
            `,
          },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'Tienes al menos 2 pruebas', minTests: 2 },
            { text: 'Usas `get_by_label` para los campos', uses: 'get_by_label\\(' },
            { text: 'Usas `get_by_role` para el botón', uses: 'get_by_role\\(\\s*"button"' },
            { text: 'Compruebas la alerta del login incorrecto', uses: 'get_by_role\\(\\s*"alert"' },
            { text: 'No usas selectores CSS ni XPath', avoid: '\\.locator\\(' },
          ],
          solution: {
            'test_login.py': py`
              from playwright.sync_api import Page, expect


              def test_login_correcto(page: Page):
                  page.goto("/login")
                  page.get_by_label("Correo electrónico").fill("ana@pixelshop.test")
                  page.get_by_label("Contraseña").fill("Clave123")
                  page.get_by_role("button", name="Entrar").click()
                  expect(page.get_by_text("Hola, Ana")).to_be_visible()


              def test_login_incorrecto(page: Page):
                  page.goto("/login")
                  page.get_by_label("Correo electrónico").fill("ana@pixelshop.test")
                  page.get_by_label("Contraseña").fill("otra-clave")
                  page.get_by_role("button", name="Entrar").click()
                  expect(page.get_by_role("alert")).to_have_text("Correo o contraseña incorrectos")
            `,
          },
          hint: '`page.get_by_label("Correo electrónico").fill(...)`, `page.get_by_label("Contraseña").fill(...)` y `page.get_by_role("button", name="Entrar").click()`.',
        },
      ],
    },

    // ─────────────── 3
    {
      id: 'p-acciones',
      icon: '🖱️',
      title: 'Acciones: llenar, elegir, marcar',
      lesson: [
        {
          title: 'Las acciones más usadas',
          table: {
            head: ['Acción', 'Ejemplo'],
            rows: [
              ['Clic', '`page.get_by_role("button", name="Aplicar").click()`'],
              ['Escribir', '`page.get_by_label("Cupón").fill("PIXEL10")`'],
              ['Tecla', '`page.get_by_label("Cupón").press("Enter")`'],
              ['Casilla', '`page.get_by_label("Acepto los términos").check()` / `.uncheck()`'],
              ['Lista desplegable', '`page.get_by_label("Ciudad").select_option("Cali")`'],
              ['Pasar el mouse', '`page.get_by_role("link", name="Carrito").hover()`'],
            ],
          },
          tip: '`fill()` reemplaza todo el contenido del campo. Para simular tecla por tecla existe `press_sequentially()`.',
        },
        {
          title: 'Las acciones esperan solas',
          text: 'Antes de actuar, Playwright espera a que el elemento esté **visible**, **habilitado** y **estable** (auto-waiting). Si después de un tiempo no lo está, la prueba falla con un `TimeoutError` y un registro de lo que esperó.',
          points: ['En Playwright real, las acciones esperan hasta **30 s** por defecto; los `expect`, **5 s**.', 'En el simulador del juego, ambos esperan 5 s (de tiempo **virtual**: ¡no tienes que esperar de verdad!).'],
          mood: 'wow',
        },
      ],
      challenges: [
        {
          type: 'fill',
          question: 'Completa las acciones del formulario de pago.',
          lang: 'py',
          code: 'page.get_by_label("Nombre completo").___("Ana Gómez")\npage.get_by_label("Ciudad").___("Cali")\npage.get_by_label("Acepto los términos y condiciones").___()\npage.get_by_role("button", name="Confirmar compra").___()',
          blanks: [['fill'], ['select_option'], ['check'], ['click']],
          bank: ['fill', 'select_option', 'check', 'click', 'type_text', 'choose', 'mark'],
          explanation: '`fill` para texto, `select_option` para listas, `check` para casillas y `click` para botones.',
        },
        {
          type: 'py',
          kind: 'pw',
          app: true,
          appHeight: 360,
          question: 'Una compra de principio a fin',
          instructions:
            'La prueba ya agrega un mouse al carrito, va a pagar e inicia sesión. Complétala en la página de pago:\n1. Comprueba que «Confirmar compra» está **deshabilitado** (aún no aceptaste los términos).\n2. Llena «Nombre completo» y «Dirección».\n3. Elige la ciudad **Medellín**.\n4. Marca «Acepto los términos y condiciones».\n5. Pulsa «Confirmar compra» y comprueba el mensaje «Tu pedido #1024 está en camino a Medellín».',
          files: {
            'test_compra.py': py`
              from playwright.sync_api import Page, expect


              ${LOGIN_HELPER}

              def test_compra_completa(page: Page):
                  page.goto("/")
                  page.get_by_role("listitem").filter(has_text="Mouse inalámbrico").get_by_role("button", name="Agregar al carrito").click()
                  page.get_by_role("link", name="Carrito").click()
                  page.get_by_role("button", name="Ir a pagar").click()
                  iniciar_sesion(page)

                  # Ya estás en la página de pago. ¡Complétala!
            `,
          },
          appBugs: { terminos: 'pagar-sin-terminos' },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'Usas `select_option` para la ciudad', uses: 'select_option\\(' },
            { text: 'Usas `check()` para los términos', uses: '\\.check\\(\\)' },
            { text: 'Compruebas el mensaje de confirmación', uses: 'en camino a Medell' },
            { text: 'Detectas el bug del botón habilitado sin términos', kills: 'terminos' },
          ],
          solution: {
            'test_compra.py': py`
              from playwright.sync_api import Page, expect


              ${LOGIN_HELPER}

              def test_compra_completa(page: Page):
                  page.goto("/")
                  page.get_by_role("listitem").filter(has_text="Mouse inalámbrico").get_by_role("button", name="Agregar al carrito").click()
                  page.get_by_role("link", name="Carrito").click()
                  page.get_by_role("button", name="Ir a pagar").click()
                  iniciar_sesion(page)

                  confirmar = page.get_by_role("button", name="Confirmar compra")
                  expect(confirmar).to_be_disabled()
                  page.get_by_label("Nombre completo").fill("Ana Gómez")
                  page.get_by_label("Dirección").fill("Calle 10 # 20-30")
                  page.get_by_label("Ciudad").select_option("Medellín")
                  page.get_by_label("Acepto los términos y condiciones").check()
                  confirmar.click()
                  expect(page.get_by_text("Tu pedido #1024 está en camino a Medellín")).to_be_visible()
            `,
          },
          hint: 'Guarda el botón en una variable: `confirmar = page.get_by_role("button", name="Confirmar compra")`, luego `expect(confirmar).to_be_disabled()`.',
        },
        {
          type: 'quiz',
          question: 'La prueba intenta hacer clic en «Confirmar compra», pero el botón está **deshabilitado** y nunca se habilita. ¿Qué pasa?',
          options: [
            'Playwright espera a que se habilite y, al agotarse el tiempo, la prueba falla con TimeoutError',
            'Hace clic igual y la prueba pasa',
            'La prueba se queda esperando para siempre',
            'Playwright habilita el botón automáticamente',
          ],
          answer: 0,
          explanation: 'Auto-waiting: espera a que el elemento sea accionable. Si no ocurre, falla con un mensaje que indica qué estaba esperando ("element is not enabled").',
        },
      ],
    },

    // ─────────────── 4
    {
      id: 'p-aserciones',
      icon: '⏱️',
      title: 'Aserciones web y auto-waiting',
      lesson: [
        {
          title: 'expect() espera… `assert` no',
          code: {
            lang: 'py',
            code: code`
              # ❌ Frágil: count() mira UNA vez, quizá antes de que lleguen los resultados
              assert page.get_by_role("listitem").count() == 1

              # ❌ Lento y frágil: espera fija
              time.sleep(2)

              # ✅ Reintenta hasta que se cumpla (o se agote el tiempo)
              expect(page.get_by_role("listitem")).to_have_count(1)
            `,
          },
          tip: '`time.sleep()` hace las pruebas **lentas** (siempre esperan) y **frágiles** (a veces no es suficiente). Es la causa n.º 1 de pruebas inestables (*flaky*).',
          mood: 'wow',
        },
        {
          title: 'Aserciones más usadas',
          table: {
            head: ['Aserción', 'Comprueba…'],
            rows: [
              ['`to_be_visible()` / `to_be_hidden()`', 'Visibilidad'],
              ['`to_have_text("…")` / `to_contain_text("…")`', 'Texto exacto / que contiene'],
              ['`to_have_count(n)`', 'Cantidad de elementos'],
              ['`to_have_value("…")`', 'Valor de un campo'],
              ['`to_be_enabled()` / `to_be_disabled()` / `to_be_checked()`', 'Estado'],
              ['`expect(page).to_have_url(…)` / `to_have_title(…)`', 'La página'],
            ],
          },
          points: ['Todas tienen versión negativa: `not_to_have_text`, `not_to_be_visible`…', 'Aceptan expresiones regulares: `to_have_url(re.compile(".*carrito"))`.'],
        },
      ],
      challenges: [
        {
          type: 'py',
          kind: 'pw',
          app: true,
          question: 'Prueba el buscador sin esperas fijas',
          instructions:
            'El buscador de PixelShop tarda un momento en mostrar resultados («Buscando…»).\n1. Reemplaza el `time.sleep` y el `assert` por un `expect(...).to_have_count(1)`.\n2. Agrega una prueba que busque **«TECLADO»** (en mayúsculas) y también encuentre 1 resultado.\n3. Agrega una prueba que busque «zzz» y compruebe el texto «No encontramos productos».',
          files: {
            'test_buscador.py': py`
              import time
              from playwright.sync_api import Page, expect


              def test_buscar_teclado(page: Page):
                  page.goto("/")
                  page.get_by_role("searchbox", name="Buscar").fill("teclado")
                  time.sleep(2)  # 😬 espera fija: ¡cámbiala por un expect!
                  resultados = page.get_by_role("listitem")
                  assert resultados.count() == 1
            `,
          },
          appBugs: { mayus: 'buscar-mayusculas' },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'No usas `time.sleep`', avoid: 'time\\.sleep' },
            { text: 'Usas `to_have_count`', uses: 'to_have_count\\(' },
            { text: 'Compruebas el mensaje sin resultados', uses: 'No encontramos' },
            { text: 'Detectas el bug de las mayúsculas', kills: 'mayus' },
          ],
          solution: {
            'test_buscador.py': py`
              from playwright.sync_api import Page, expect


              def test_buscar_teclado(page: Page):
                  page.goto("/")
                  page.get_by_role("searchbox", name="Buscar").fill("teclado")
                  expect(page.get_by_role("listitem")).to_have_count(1)


              def test_buscar_en_mayusculas(page: Page):
                  page.goto("/")
                  page.get_by_role("searchbox", name="Buscar").fill("TECLADO")
                  expect(page.get_by_role("listitem")).to_have_count(1)


              def test_buscar_sin_resultados(page: Page):
                  page.goto("/")
                  page.get_by_role("searchbox", name="Buscar").fill("zzz")
                  expect(page.get_by_text("No encontramos productos")).to_be_visible()
            `,
          },
          hint: '`expect(page.get_by_role("listitem")).to_have_count(1)` reintenta solo hasta que aparezcan los resultados.',
        },
        {
          type: 'quiz',
          question: 'Una prueba con `time.sleep(1)` pasa en tu computador pero **a veces** falla en el servidor de integración continua. ¿Cuál es la causa más probable?',
          options: [
            'La espera fija no siempre alcanza: en el servidor la app tarda más. Hay que usar expect()',
            'El servidor tiene un virus',
            'pytest es inestable',
            'Hay que subir el sleep a 60 segundos',
          ],
          answer: 0,
          explanation: 'Es una prueba **flaky** (inestable). Subir el sleep la hace más lenta y sigue sin garantizar nada. `expect` espera lo justo.',
        },
        {
          type: 'fill',
          question: 'Completa las aserciones.',
          lang: 'py',
          code: 'expect(page).___("https://pixelshop.test/carrito")\nexpect(page.get_by_test_id("total")).___("Total: $250.000")\nexpect(page.get_by_role("alert")).___()',
          blanks: [['to_have_url'], ['to_have_text'], ['not_to_be_visible', 'to_be_hidden']],
          bank: ['to_have_url', 'to_have_text', 'not_to_be_visible', 'to_be_url', 'have_text', 'is_visible'],
          explanation: 'Las aserciones de página van sobre `page`; las de elementos, sobre un locator. Para "no visible" sirven `not_to_be_visible()` o `to_be_hidden()`.',
        },
      ],
    },

    // ─────────────── 5
    {
      id: 'p-strict',
      icon: '📋',
      title: 'Listas, filtros y strict mode',
      lesson: [
        {
          title: 'Strict mode: un locator, un elemento',
          text: 'Si un locator encuentra **varios** elementos y le pides una acción, Playwright **no adivina**: lanza un error de *strict mode*.',
          code: {
            lang: 'text',
            code: code`
              Error: strict mode violation: get_by_role("button", name="Agregar al carrito") resolved to 5 elements:
                  1) <button>Agregar al carrito</button>
                  2) <button>Agregar al carrito</button>
                  …
            `,
          },
          tip: 'Es una protección: hacer clic en "el primero que aparezca" es una fuente de pruebas que pasan por casualidad.',
        },
        {
          title: 'Afinar el locator',
          code: {
            lang: 'py',
            code: code`
              # Filtrar por texto: la tarjeta del Teclado y su botón
              teclado = page.get_by_role("listitem").filter(has_text="Teclado mecánico")
              teclado.get_by_role("button", name="Agregar al carrito").click()

              # Por posición (úsalo con cuidado)
              page.get_by_role("listitem").first
              page.get_by_role("listitem").nth(2)

              # Contar y recorrer
              expect(page.get_by_role("listitem")).to_have_count(6)
              nombres = page.get_by_role("heading", level=2).all_text_contents()
            `,
          },
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'quiz',
          kind: 'predict',
          question: 'En el catálogo hay 5 botones «Agregar al carrito». ¿Qué pasa con esta línea?',
          snippet: { lang: 'py', code: 'page.get_by_role("button", name="Agregar al carrito").click()' },
          options: ['Falla con «strict mode violation … resolved to 5 elements»', 'Hace clic en el primero', 'Hace clic en todos', 'Hace clic en uno al azar'],
          answer: 0,
          explanation: 'Hay que precisar cuál: con `filter(has_text=...)`, buscando dentro de la tarjeta del producto, o (con cuidado) con `.first` / `.nth()`.',
        },
        {
          type: 'py',
          kind: 'pw',
          app: true,
          question: 'Verifica el total del carrito',
          instructions:
            'Arregla la prueba (¡tiene un *strict mode violation*!) y complétala:\n1. Agrega **2** Teclados mecánicos ($250.000) y **1** Mouse inalámbrico ($80.000). Usa `filter(has_text=...)`.\n2. Comprueba que el contador del carrito (`get_by_test_id("contador-carrito")`) muestra **3**.\n3. Ve al carrito y comprueba que el total (`get_by_test_id("total")`) es **Total: $580.000**.',
          files: {
            'test_carrito.py': py`
              from playwright.sync_api import Page, expect


              def test_total_del_carrito(page: Page):
                  page.goto("/")
                  page.get_by_role("button", name="Agregar al carrito").click()
            `,
          },
          appBugs: { total: 'total-sin-cantidad', contador: 'contador-congelado' },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'Usas `filter(has_text=...)`', uses: 'filter\\(\\s*has_text' },
            { text: 'Detectas el bug del total sin cantidades', kills: 'total' },
            { text: 'Detectas el bug del contador congelado', kills: 'contador' },
          ],
          solution: {
            'test_carrito.py': py`
              from playwright.sync_api import Page, expect


              def agregar(page: Page, producto: str):
                  tarjeta = page.get_by_role("listitem").filter(has_text=producto)
                  tarjeta.get_by_role("button", name="Agregar al carrito").click()


              def test_total_del_carrito(page: Page):
                  page.goto("/")
                  agregar(page, "Teclado mecánico")
                  agregar(page, "Teclado mecánico")
                  agregar(page, "Mouse inalámbrico")
                  expect(page.get_by_test_id("contador-carrito")).to_have_text("3")
                  page.get_by_role("link", name="Carrito").click()
                  expect(page.get_by_test_id("total")).to_have_text("Total: $580.000")
            `,
          },
          hint: 'Crea una función `agregar(page, producto)` que filtre la tarjeta con `get_by_role("listitem").filter(has_text=producto)` y pulse su botón.',
        },
        {
          type: 'pick',
          question: '¿Qué locators encuentran **un solo** elemento en el catálogo (6 productos, 5 con stock)?',
          options: [
            { text: '`page.get_by_role("listitem").filter(has_text="Parlante bluetooth")`', correct: true },
            { text: '`page.get_by_role("button", name="Agotado")`', correct: true },
            { text: '`page.get_by_role("heading", name="Catálogo")`', correct: true },
            { text: '`page.get_by_role("button", name="Agregar al carrito")`', correct: false },
            { text: '`page.get_by_role("listitem")`', correct: false },
          ],
          explanation: 'Solo la Cámara web está agotada: hay un único botón «Agotado». Los otros dos encuentran 5 y 6 elementos.',
        },
      ],
    },

    // ─────────────── 6
    {
      id: 'p-pom',
      icon: '🏛️',
      title: 'Page Object Model',
      lesson: [
        {
          title: 'Un objeto por página',
          text: 'Si 30 pruebas usan `page.get_by_label("Correo electrónico")` y cambia la etiqueta, hay que editar 30 pruebas. El patrón **Page Object Model (POM)** agrupa los locators y acciones de cada página en una clase:',
          code: {
            lang: 'py',
            code: code`
              # pages/login_page.py
              class LoginPage:
                  def __init__(self, page):
                      self.page = page
                      self.correo = page.get_by_label("Correo electrónico")
                      self.clave = page.get_by_label("Contraseña")
                      self.boton_entrar = page.get_by_role("button", name="Entrar")

                  def abrir(self):
                      self.page.goto("/login")

                  def iniciar_sesion(self, correo, clave):
                      self.correo.fill(correo)
                      self.clave.fill(clave)
                      self.boton_entrar.click()
            `,
          },
        },
        {
          title: 'Pruebas que se leen como historias',
          code: {
            lang: 'py',
            code: code`
              def test_login_correcto(page):
                  login = LoginPage(page)
                  login.abrir()
                  login.iniciar_sesion("ana@pixelshop.test", "Clave123")
                  expect(page.get_by_text("Hola, Ana")).to_be_visible()
            `,
          },
          points: ['Si cambia la página, se edita **un solo** lugar.', 'Las pruebas hablan el idioma del negocio, no del HTML.', 'Recomendación: las aserciones van en las **pruebas**, no en el page object.'],
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'py',
          kind: 'pw',
          app: true,
          question: 'Construye y usa un page object',
          instructions:
            '1. En `pages/login_page.py`, completa el método `iniciar_sesion` (llena los campos y pulsa «Entrar»).\n2. En `test_login.py`, agrega una prueba con contraseña incorrecta y otra que envíe el formulario **vacío** y compruebe la alerta «Completa todos los campos».\nHay un bug sembrado en la validación del login.',
          files: {
            'test_login.py': py`
              from playwright.sync_api import Page, expect
              from pages.login_page import LoginPage


              def test_login_correcto(page: Page):
                  login = LoginPage(page)
                  login.abrir()
                  login.iniciar_sesion("ana@pixelshop.test", "Clave123")
                  expect(page.get_by_text("Hola, Ana")).to_be_visible()
            `,
            'pages/login_page.py': py`
              from playwright.sync_api import Page


              class LoginPage:
                  def __init__(self, page: Page):
                      self.page = page
                      self.correo = page.get_by_label("Correo electrónico")
                      self.clave = page.get_by_label("Contraseña")
                      self.boton_entrar = page.get_by_role("button", name="Entrar")
                      self.alerta = page.get_by_role("alert")

                  def abrir(self):
                      self.page.goto("/login")

                  def iniciar_sesion(self, correo, clave):
                      # Completa: llena los dos campos y pulsa «Entrar»
                      pass
            `,
          },
          editable: ['test_login.py', 'pages/login_page.py'],
          appBugs: { validar: 'login-sin-validar' },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'Tienes al menos 3 pruebas', minTests: 3 },
            { text: 'Las pruebas usan `LoginPage`', uses: 'LoginPage\\(page\\)[\\s\\S]*LoginPage\\(page\\)[\\s\\S]*LoginPage\\(page\\)' },
            { text: 'Detectas el bug de la validación de campos vacíos', kills: 'validar' },
          ],
          solution: {
            'test_login.py': py`
              from playwright.sync_api import Page, expect
              from pages.login_page import LoginPage


              def test_login_correcto(page: Page):
                  login = LoginPage(page)
                  login.abrir()
                  login.iniciar_sesion("ana@pixelshop.test", "Clave123")
                  expect(page.get_by_text("Hola, Ana")).to_be_visible()


              def test_login_incorrecto(page: Page):
                  login = LoginPage(page)
                  login.abrir()
                  login.iniciar_sesion("ana@pixelshop.test", "equivocada")
                  expect(login.alerta).to_have_text("Correo o contraseña incorrectos")


              def test_login_vacio(page: Page):
                  login = LoginPage(page)
                  login.abrir()
                  login.iniciar_sesion("", "")
                  expect(login.alerta).to_have_text("Completa todos los campos")
            `,
            'pages/login_page.py': py`
              from playwright.sync_api import Page


              class LoginPage:
                  def __init__(self, page: Page):
                      self.page = page
                      self.correo = page.get_by_label("Correo electrónico")
                      self.clave = page.get_by_label("Contraseña")
                      self.boton_entrar = page.get_by_role("button", name="Entrar")
                      self.alerta = page.get_by_role("alert")

                  def abrir(self):
                      self.page.goto("/login")

                  def iniciar_sesion(self, correo, clave):
                      self.correo.fill(correo)
                      self.clave.fill(clave)
                      self.boton_entrar.click()
            `,
          },
          hint: 'En el page object: `self.correo.fill(correo)`, `self.clave.fill(clave)` y `self.boton_entrar.click()`. En las pruebas, compara `login.alerta` con `to_have_text`.',
        },
        {
          type: 'quiz',
          question: 'La etiqueta «Correo electrónico» cambia a «Email». Con POM, ¿cuántos archivos hay que modificar?',
          options: ['Uno: el page object de la página de login', 'Todos los archivos de prueba que inician sesión', 'Ninguno', 'Hay que reescribir todas las pruebas'],
          answer: 0,
          explanation: 'Esa es la gran ventaja del POM: los detalles de la página viven en un solo lugar.',
        },
        {
          type: 'pick',
          question: '¿Qué es **buena práctica** con Page Object Model?',
          options: [
            { text: 'Guardar los locators como atributos del page object', correct: true },
            { text: 'Exponer métodos con nombres del negocio: iniciar_sesion, agregar_al_carrito', correct: true },
            { text: 'Dejar las aserciones (expect) en las pruebas', correct: true },
            { text: 'Copiar los locators en cada prueba por si acaso', correct: false },
            { text: 'Meter toda la aplicación en un único page object gigante', correct: false },
          ],
          explanation: 'Un page object por página (o componente), con nombres que cuenten **qué** hace el usuario.',
        },
      ],
    },

    // ─────────────── 7
    {
      id: 'p-herramientas',
      icon: '🧰',
      title: 'Herramientas pro de Playwright',
      lesson: [
        {
          title: 'Generar, depurar y diagnosticar',
          table: {
            head: ['Herramienta', 'Comando', 'Para qué'],
            rows: [
              ['**Codegen**', '`playwright codegen https://pixelshop.test`', 'Graba tus clics y genera el código (con buenos locators)'],
              ['**Modo visible**', '`pytest --headed --slowmo 500`', 'Ver el navegador, más despacio'],
              ['**Inspector**', '`page.pause()` o `PWDEBUG=1 pytest`', 'Ejecutar paso a paso y probar locators'],
              ['**Trace viewer**', '`pytest --tracing retain-on-failure` y `playwright show-trace trace.zip`', 'Ver la "película" de una prueba que falló: DOM, red, consola'],
              ['**Capturas y video**', '`--screenshot only-on-failure --video retain-on-failure`', 'Evidencias para el reporte de defecto'],
            ],
          },
        },
        {
          title: 'Varios navegadores y paralelismo',
          points: [
            '`pytest --browser chromium --browser firefox --browser webkit` ejecuta las pruebas en los tres motores.',
            'Con el plugin **pytest-xdist**: `pytest -n 4` reparte las pruebas en 4 procesos.',
            '`page.set_default_timeout(10000)` cambia el tiempo de espera de las acciones; las aserciones aceptan `timeout=`.',
          ],
          tip: 'El trace viewer es la mejor amiga de quien depura pruebas E2E en CI: ves exactamente qué vio el navegador. 🎬',
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'classify',
          question: '¿Qué herramienta usarías?',
          bins: [
            { id: 'codegen', label: '🎥 Codegen' },
            { id: 'trace', label: '🎬 Trace viewer' },
            { id: 'headed', label: '👀 --headed / --slowmo' },
            { id: 'browsers', label: '🌐 --browser' },
          ],
          items: [
            { text: 'Una prueba falló anoche en CI y quieres ver qué pasó paso a paso', bin: 'trace' },
            { text: 'Quieres un primer borrador del script grabando tus clics', bin: 'codegen' },
            { text: 'Quieres mirar con tus ojos qué hace la prueba, despacio', bin: 'headed' },
            { text: 'Un cliente reporta un fallo que solo ocurre en Safari', bin: 'browsers' },
          ],
          explanation: 'Safari usa el motor **WebKit**: `pytest --browser webkit`.',
        },
        {
          type: 'quiz',
          question: 'Un bug hace que el login tarde **7 segundos**. La prueba hace `expect(page.get_by_text("Hola, Ana")).to_be_visible()`. ¿Qué pasa?',
          options: [
            'Falla: el expect espera 5 s por defecto y el texto aparece a los 7 s',
            'Pasa: expect espera todo lo necesario',
            'Pasa, pero tarda 7 s',
            'Falla de inmediato sin esperar',
          ],
          answer: 0,
          explanation: 'El timeout por defecto de `expect` es 5 s. ¡Y la prueba hace bien en fallar: un login de 7 s es un problema de **rendimiento** que hay que reportar! Si de verdad fuera aceptable, se usaría `to_be_visible(timeout=10000)`.',
        },
        {
          type: 'fill',
          question: 'Completa el comando para ejecutar en Firefox, viendo el navegador y guardando la traza solo si falla.',
          lang: 'bash',
          code: 'pytest --browser ___ --___ --tracing ___',
          blanks: [['firefox'], ['headed'], ['retain-on-failure']],
          bank: ['firefox', 'headed', 'retain-on-failure', 'safari', 'visible', 'always'],
          explanation: 'Después: `playwright show-trace test-results/…/trace.zip` para abrir la traza.',
        },
      ],
    },

    // ─────────────── 8
    {
      id: 'p-proyecto',
      icon: '🛒',
      title: 'Proyecto: regresión del carrito',
      project: true,
      lesson: [
        {
          title: 'Tu misión',
          text: 'El equipo de PixelShop va a publicar una nueva versión del carrito. Te piden una **suite de regresión** automática que proteja lo más importante: los **cupones** y **eliminar productos**.',
          points: ['Aplica todo: locators robustos, `filter`, acciones y `expect`.', 'Tus pruebas deben pasar con la versión correcta y **fallar** con las versiones con bugs.', 'Cuando termines, pulsa **▶ Ver al robot** para ver tu suite en acción. 🤖'],
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'py',
          kind: 'pw',
          app: true,
          question: 'Suite de regresión del carrito',
          instructions:
            'Escribe pruebas (el carrito empieza vacío en cada una) para:\n1. Con un Teclado mecánico ($250.000), el cupón **PIXEL10** muestra «Cupón aplicado: 10% de descuento» y el total **Total: $225.000**.\n2. El cupón **GRATIS** muestra la alerta «Cupón no válido».\n3. Al pulsar «Eliminar» (`get_by_role("button", name="Eliminar Teclado mecánico")`) el carrito muestra «Tu carrito está vacío».\nHay **2 bugs** sembrados en esta versión.',
          files: {
            'test_regresion.py': py`
              from playwright.sync_api import Page, expect


              def agregar_teclado_e_ir_al_carrito(page: Page):
                  page.goto("/")
                  tarjeta = page.get_by_role("listitem").filter(has_text="Teclado mecánico")
                  tarjeta.get_by_role("button", name="Agregar al carrito").click()
                  page.get_by_role("link", name="Carrito").click()


              def test_cupon_pixel10(page: Page):
                  agregar_teclado_e_ir_al_carrito(page)
                  # Aplica el cupón y comprueba el mensaje y el total
            `,
          },
          appBugs: { cupon: 'cupon20', eliminar: 'eliminar-roto' },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'Tienes al menos 3 pruebas', minTests: 3 },
            { text: 'Compruebas el cupón inválido', uses: 'Cupón no válido' },
            { text: 'Detectas el bug del cupón del 20 %', kills: 'cupon' },
            { text: 'Detectas el bug del botón Eliminar', kills: 'eliminar' },
          ],
          solution: {
            'test_regresion.py': py`
              from playwright.sync_api import Page, expect


              def agregar_teclado_e_ir_al_carrito(page: Page):
                  page.goto("/")
                  tarjeta = page.get_by_role("listitem").filter(has_text="Teclado mecánico")
                  tarjeta.get_by_role("button", name="Agregar al carrito").click()
                  page.get_by_role("link", name="Carrito").click()


              def aplicar_cupon(page: Page, codigo: str):
                  page.get_by_label("Cupón").fill(codigo)
                  page.get_by_role("button", name="Aplicar").click()


              def test_cupon_pixel10(page: Page):
                  agregar_teclado_e_ir_al_carrito(page)
                  aplicar_cupon(page, "PIXEL10")
                  expect(page.get_by_text("Cupón aplicado: 10% de descuento")).to_be_visible()
                  expect(page.get_by_test_id("total")).to_have_text("Total: $225.000")


              def test_cupon_invalido(page: Page):
                  agregar_teclado_e_ir_al_carrito(page)
                  aplicar_cupon(page, "GRATIS")
                  expect(page.get_by_role("alert")).to_have_text("Cupón no válido")


              def test_eliminar_producto(page: Page):
                  agregar_teclado_e_ir_al_carrito(page)
                  page.get_by_role("button", name="Eliminar Teclado mecánico").click()
                  expect(page.get_by_text("Tu carrito está vacío")).to_be_visible()
            `,
          },
          hint: 'Crea una función `aplicar_cupon(page, codigo)` que llene `get_by_label("Cupón")` y pulse «Aplicar». Para el total usa `get_by_test_id("total")`.',
        },
        {
          type: 'quiz',
          question: 'Tu suite pasa con la versión correcta y **falla** con la versión del cupón del 20 %. ¿Eso es bueno?',
          options: ['Sí: la suite detecta la regresión, que es justo su trabajo', 'No: una suite nunca debería fallar', 'Solo si falla en Firefox', 'No importa'],
          answer: 0,
          explanation: 'Una suite de regresión que nunca falla ante un bug real no protege nada. ¡Las tuyas sí muerden! 🐞',
        },
      ],
    },
  ],
};
