// ───────────────────────── MUNDO 7: MÁS ALLÁ DE LO FUNCIONAL ─────────────────────────
import { code, py, shop } from '../helpers.js';

const ESCAPAR = py`
  def escapar_html(texto):
      """Escapa los caracteres peligrosos antes de mostrar texto de un usuario en la página."""
      return (
          texto.replace("&", "&amp;")
          .replace("<", "&lt;")
          .replace(">", "&gt;")
          .replace('"', "&quot;")
      )
`;

const API = py`
  """Cliente de la API de PixelShop (simulada en memoria para las pruebas)."""

  PRODUCTOS = {
      1: {"id": 1, "nombre": "Audífonos Pixel", "precio": 120000},
      2: {"id": 2, "nombre": "Teclado mecánico", "precio": 250000},
  }


  class Respuesta:
      def __init__(self, status_code, datos):
          self.status_code = status_code
          self._datos = datos

      def json(self):
          return self._datos


  def get(ruta):
      if ruta == "/api/productos":
          return Respuesta(200, list(PRODUCTOS.values()))
      if ruta.startswith("/api/productos/"):
          pid = int(ruta.rsplit("/", 1)[1])
          if pid in PRODUCTOS:
              return Respuesta(200, PRODUCTOS[pid])
          return Respuesta(404, {"error": "Producto no encontrado"})
      return Respuesta(404, {"error": "Ruta no encontrada"})


  def post(ruta, datos):
      if ruta == "/api/pedidos":
          if not datos.get("productos"):
              return Respuesta(422, {"error": "El pedido no tiene productos"})
          return Respuesta(201, {"id": 1024, "estado": "recibido", **datos})
      return Respuesta(404, {"error": "Ruta no encontrada"})
`;

export const AVANZADO = {
  id: 'avanzado',
  short: 'No funcional',
  name: 'Más allá de lo funcional',
  icon: '⚙️',
  color: '#14b8a6',
  description: 'Rendimiento, seguridad, accesibilidad, pruebas de API e integración continua: la calidad que no se ve a simple vista.',
  levels: [
    // ─────────────── 1
    {
      id: 'a-rendimiento',
      icon: '🚀',
      title: 'Pruebas de rendimiento',
      lesson: [
        {
          title: '¿Aguanta el Black Friday?',
          table: {
            head: ['Tipo', 'Qué hace', 'Pregunta'],
            rows: [
              ['**Carga**', 'Simula la carga **esperada**', '¿Responde bien con 500 usuarios a la vez?'],
              ['**Estrés**', 'Sube la carga **más allá** del límite', '¿Dónde se rompe y cómo se recupera?'],
              ['**Picos** (spike)', 'Aumentos **bruscos** de usuarios', '¿Qué pasa si llegan 5.000 usuarios en un minuto?'],
              ['**Resistencia** (soak)', 'Carga normal durante **horas o días**', '¿Hay fugas de memoria que aparecen con el tiempo?'],
              ['**Escalabilidad**', 'Aumenta recursos y carga', '¿Rinde más si agregamos servidores?'],
            ],
          },
        },
        {
          title: 'Métricas clave',
          points: [
            '**Tiempo de respuesta**: mejor en **percentiles** que en promedio. El **p95** = el 95 % de las peticiones tardó eso o menos.',
            '**Rendimiento** (throughput): peticiones por segundo que el sistema procesa.',
            '**Tasa de errores**: % de peticiones que fallan bajo carga.',
            '**Uso de recursos**: CPU, memoria, conexiones a la base de datos.',
          ],
          tip: 'El promedio engaña: si 9 peticiones tardan 100 ms y una tarda 10 s, el promedio (1,09 s) no describe a ningún usuario real.',
          mood: 'wow',
        },
        {
          title: 'Herramientas: Locust (Python), k6, JMeter',
          code: {
            lang: 'py',
            code: code`
              # locustfile.py  →  locust -f locustfile.py --users 500 --spawn-rate 50
              from locust import HttpUser, task, between


              class Cliente(HttpUser):
                  wait_time = between(1, 3)

                  @task(3)
                  def ver_catalogo(self):
                      self.client.get("/")

                  @task(1)
                  def buscar(self):
                      self.client.get("/buscar?q=teclado")
            `,
          },
        },
      ],
      challenges: [
        {
          type: 'classify',
          question: '¿Qué tipo de prueba de rendimiento es?',
          bins: [
            { id: 'carga', label: '📈 Carga' },
            { id: 'estres', label: '🔥 Estrés' },
            { id: 'pico', label: '⚡ Picos' },
            { id: 'soak', label: '⏳ Resistencia' },
          ],
          items: [
            { text: 'Simular los 800 usuarios que esperamos un sábado normal', bin: 'carga' },
            { text: 'Subir usuarios hasta que la tienda deje de responder', bin: 'estres' },
            { text: 'Pasar de 100 a 6.000 usuarios en 30 s por un anuncio en TV', bin: 'pico' },
            { text: 'Mantener 300 usuarios durante 48 horas', bin: 'soak' },
            { text: 'Ver si el servidor se recupera después de saturarlo', bin: 'estres' },
          ],
          explanation: 'Cada tipo responde a una pregunta distinta: esperado, límite, cambio brusco o duración.',
        },
        {
          type: 'quiz',
          question: 'Ordenaste los tiempos de respuesta de **20 peticiones** de menor a mayor. ¿Cuál es el **p95**?',
          snippet: { lang: 'text', code: '120 130 135 140 150 150 160 170 180 190\n200 210 220 240 260 300 350 400 900 4200   (ms)' },
          options: ['900 ms', '4200 ms', '200 ms', '445 ms (el promedio)'],
          answer: 0,
          explanation: 'El 95 % de 20 es 19: el p95 es el valor número 19 → **900 ms**. El p95 muestra la experiencia de los usuarios más lentos sin dejar que un único valor extremo (4.200 ms) lo domine.',
        },
        {
          type: 'pick',
          question: '¿Qué es un buen requisito de rendimiento (medible)?',
          options: [
            { text: 'El p95 de la búsqueda es menor a 800 ms con 500 usuarios simultáneos', correct: true },
            { text: 'La tasa de errores es menor al 1 % durante 1 hora de carga esperada', correct: true },
            { text: 'La tienda debe ser rápida', correct: false },
            { text: 'Los usuarios no deben quejarse de la velocidad', correct: false },
          ],
          explanation: 'Métrica + umbral + condiciones de carga. Sin eso, no se puede decidir si la prueba pasó.',
        },
        {
          type: 'quiz',
          question: 'Tras 30 horas de una prueba de resistencia, la memoria del servidor sube sin parar hasta que se reinicia. ¿Qué encontraste?',
          options: ['Probablemente una fuga de memoria', 'Un problema de usabilidad', 'Un defecto de accesibilidad', 'Nada: es normal'],
          answer: 0,
          explanation: 'Las fugas de memoria casi nunca aparecen en pruebas cortas: por eso existen las pruebas de **resistencia** (soak).',
        },
      ],
    },

    // ─────────────── 2
    {
      id: 'a-seguridad',
      icon: '🔐',
      title: 'Pruebas de seguridad',
      lesson: [
        {
          title: 'El OWASP Top 10',
          text: 'La fundación **OWASP** publica periódicamente los 10 riesgos de seguridad más críticos en aplicaciones web (ediciones 2021 y 2025). Entre los más frecuentes:',
          table: {
            head: ['Riesgo', 'Ejemplo en PixelShop'],
            rows: [
              ['**Control de acceso roto**', 'Cambiando `/pedidos/1024` por `/pedidos/1025` veo el pedido de otro cliente'],
              ['**Inyección** (SQL, comandos…)', 'El buscador arma la consulta SQL pegando el texto del usuario'],
              ['**Fallos criptográficos**', 'Contraseñas guardadas sin cifrar o sitio sin HTTPS'],
              ['**Configuración insegura**', 'Mensajes de error que muestran el código o claves por defecto'],
              ['**Componentes vulnerables**', 'Librerías desactualizadas con fallos conocidos'],
              ['**Fallos de autenticación**', 'Permitir infinitos intentos de contraseña'],
            ],
          },
        },
        {
          title: 'Inyección SQL y XSS',
          codes: [
            {
              lang: 'py',
              title: '❌ Vulnerable',
              code: 'consulta = f"SELECT * FROM productos WHERE nombre = \'{texto}\'"\ncursor.execute(consulta)',
            },
            { lang: 'py', title: '✅ Consulta parametrizada', code: 'cursor.execute(\n    "SELECT * FROM productos WHERE nombre = ?", (texto,)\n)' },
          ],
          points: ['Con `texto = "\' OR \'1\'=\'1"` la consulta vulnerable devuelve **todo**.', '**XSS**: si se muestra en la página un texto del usuario sin escapar, `<script>` se ejecuta en el navegador de otros. Solución: **escapar** la salida.'],
          tip: 'Regla de oro: **nunca** confíes en lo que escribe el usuario. Valida la entrada y escapa la salida.',
          mood: 'wow',
        },
      ],
      challenges: [
        {
          type: 'bughunt',
          question: 'Revisión de seguridad: ¿qué línea es **vulnerable a inyección SQL**?',
          code: code`
            def buscar_productos(conexion, texto):
                texto = texto.strip()
                if not texto:
                    return []
                cursor = conexion.cursor()
                cursor.execute(f"SELECT * FROM productos WHERE nombre LIKE '%{texto}%'")
                return cursor.fetchall()
          `,
          bugs: [6],
          explanation: 'Pega el texto del usuario directamente en el SQL. Hay que usar parámetros: `cursor.execute("… LIKE ?", (f"%{texto}%",))`.',
        },
        {
          type: 'classify',
          question: '¿Qué riesgo de OWASP describe cada hallazgo?',
          bins: [
            { id: 'acceso', label: '🚪 Control de acceso roto' },
            { id: 'iny', label: '💉 Inyección' },
            { id: 'cripto', label: '🔑 Fallos criptográficos' },
            { id: 'auth', label: '🪪 Fallos de autenticación' },
          ],
          items: [
            { text: 'Un cliente sin rol de administrador entra a /admin/cupones', bin: 'acceso' },
            { text: "Escribir `'; DROP TABLE pedidos; --` en el buscador rompe la base de datos", bin: 'iny' },
            { text: 'Las contraseñas se guardan en texto plano', bin: 'cripto' },
            { text: 'Se pueden probar millones de contraseñas sin bloqueo', bin: 'auth' },
            { text: 'Cambiar el id en la URL muestra la factura de otra persona', bin: 'acceso' },
          ],
          explanation: 'El control de acceso roto es el riesgo n.º 1 de OWASP: siempre prueba qué pasa si un usuario pide algo que **no es suyo**.',
        },
        {
          type: 'py',
          question: 'Prueba la defensa contra XSS',
          instructions:
            'La función `escapar_html` (🔒 `seguridad.py`) protege la página de scripts maliciosos.\nEscribe pruebas que comprueben que escapa `<`, `>`, `&` y comillas dobles.\nHay **3 bugs** sembrados: uno de ellos solo aparece si pruebas un texto con **`&` y `<` a la vez**.',
          files: {
            'test_seguridad.py': py`
              from seguridad import escapar_html


              def test_texto_normal_no_cambia():
                  assert escapar_html("Teclado mecánico") == "Teclado mecánico"
            `,
            'seguridad.py': ESCAPAR,
          },
          mutants: {
            sinlt: { label: 'No escapa el signo `<`', files: { 'seguridad.py': ESCAPAR.replace('        .replace("<", "&lt;")\n', '') } },
            orden: { label: 'Escapa `&` al final (doble escape: `&lt;` → `&amp;lt;`)', files: { 'seguridad.py': ESCAPAR.replace('texto.replace("&", "&amp;")\n        .replace("<", "&lt;")', 'texto.replace("<", "&lt;")\n        .replace("&", "&amp;")') } },
            comillas: { label: 'No escapa las comillas dobles', files: { 'seguridad.py': ESCAPAR.replace('        .replace(\'"\', "&quot;")\n', '') } },
          },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'Pruebas un `<script>`', uses: '<script' },
            { text: 'Atrapas el bug del `<` sin escapar', kills: 'sinlt' },
            { text: 'Atrapas el bug del doble escape', kills: 'orden' },
            { text: 'Atrapas el bug de las comillas', kills: 'comillas' },
          ],
          solution: {
            'test_seguridad.py': py`
              from seguridad import escapar_html


              def test_texto_normal_no_cambia():
                  assert escapar_html("Teclado mecánico") == "Teclado mecánico"


              def test_escapa_script():
                  assert escapar_html("<script>alert(1)</script>") == "&lt;script&gt;alert(1)&lt;/script&gt;"


              def test_escapa_ampersand_y_menor_que():
                  assert escapar_html("a & <b>") == "a &amp; &lt;b&gt;"


              def test_escapa_comillas():
                  assert escapar_html('"hola"') == "&quot;hola&quot;"
            `,
          },
          hint: 'Prueba `escapar_html("a & <b>")` → `"a &amp; &lt;b&gt;"` y `escapar_html(\'"hola"\')` → `"&quot;hola&quot;"`.',
        },
        {
          type: 'quiz',
          question: 'Al iniciar sesión con un correo inexistente, PixelShop dice «Ese correo no está registrado». ¿Qué problema de seguridad hay?',
          options: [
            'Permite a un atacante averiguar qué correos tienen cuenta (enumeración de usuarios)',
            'Ninguno: es un mensaje útil',
            'Es un problema de rendimiento',
            'Es inyección SQL',
          ],
          answer: 0,
          explanation: 'El mensaje correcto es genérico: «Correo o contraseña incorrectos». ¡Como el que usa PixelShop!',
        },
      ],
    },

    // ─────────────── 3
    {
      id: 'a-accesibilidad',
      icon: '♿',
      title: 'Accesibilidad y usabilidad',
      lesson: [
        {
          title: 'Una web para todas las personas',
          text: 'Las pautas **WCAG 2.2** (W3C) definen cómo hacer contenido web accesible. Se organizan en 4 principios, **POUR**:',
          table: {
            head: ['Principio', 'Significa', 'Ejemplo'],
            rows: [
              ['**Perceptible**', 'Todos pueden percibir la información', 'Imágenes con texto alternativo; buen contraste'],
              ['**Operable**', 'Todos pueden usar los controles', 'Todo funciona con el teclado'],
              ['**Comprensible**', 'La información y el uso son claros', 'Mensajes de error que explican qué corregir'],
              ['**Robusto**', 'Funciona con tecnologías de apoyo', 'HTML semántico que entienden los lectores de pantalla'],
            ],
          },
          points: ['Niveles de conformidad: **A**, **AA** (el habitual en leyes y contratos) y **AAA**.', 'Contraste mínimo AA para texto normal: **4.5:1**.'],
        },
        {
          title: 'Cómo se prueba',
          points: [
            '**Herramientas automáticas**: axe, Lighthouse, WAVE. Detectan parte de los problemas (contraste, alt, etiquetas…).',
            '**Revisión manual**: navegar solo con el teclado (Tab, Enter, Esc) y con un lector de pantalla (NVDA, VoiceOver).',
            '**Con usuarios**: personas con discapacidad que usan la app de verdad.',
            'Bonus: si tus pruebas de Playwright usan `get_by_role` y `get_by_label`, ¡ya están comprobando parte de la accesibilidad!',
          ],
          tip: 'La **usabilidad** (eficacia, eficiencia y satisfacción) se evalúa observando a usuarios reales hacer tareas: «compra un mouse», «aplica un cupón»…',
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'bughunt',
          question: 'Auditoría de accesibilidad. Encuentra los **3 problemas**.',
          screen: shop(`
            <h3>Catálogo</h3>
            <div class="m-row">
              <span class="m-input" data-spot="buscar">Buscar productos</span>
              <span class="m-btn" data-spot="lupa" title="">🔍</span>
            </div>
            <div class="m-grid" style="margin-top:10px">
              <div class="m-card" data-spot="card1"><div style="height:60px;background:#e2e8f0;border-radius:8px;display:grid;place-items:center" data-spot="img">🖼️ &lt;img src="audifonos.jpg"&gt;</div><b>Audífonos Pixel</b><div class="m-price">$120.000</div></div>
              <div class="m-card" data-spot="card2"><b>Teclado mecánico</b><div style="color:#cbd5e1" data-spot="contraste">Precio: $250.000</div></div>
              <div class="m-card" data-spot="card3"><b>Mouse inalámbrico</b><div class="m-price">$80.000</div><span class="m-btn">Agregar al carrito</span></div>
            </div>
          `),
          bugs: ['lupa', 'img', 'contraste'],
          explanation: 'El botón 🔍 **no tiene nombre accesible** (un lector de pantalla dirá solo "botón"), la imagen **no tiene `alt`** y el precio gris claro sobre blanco **no cumple el contraste** 4.5:1.',
        },
        {
          type: 'classify',
          question: '¿Qué principio de WCAG (POUR) se incumple?',
          bins: [
            { id: 'p', label: '👁️ Perceptible' },
            { id: 'o', label: '⌨️ Operable' },
            { id: 'c', label: '💡 Comprensible' },
            { id: 'r', label: '🧱 Robusto' },
          ],
          items: [
            { text: 'Un video sin subtítulos', bin: 'p' },
            { text: 'El menú solo se abre pasando el mouse por encima', bin: 'o' },
            { text: 'Un error dice «Error 0x8F» sin explicar qué hacer', bin: 'c' },
            { text: 'Botones hechos con `<div>` sin rol, que el lector de pantalla no reconoce', bin: 'r' },
            { text: 'Texto gris claro sobre fondo blanco', bin: 'p' },
            { text: 'El formulario expira en 30 s sin avisar ni permitir más tiempo', bin: 'o' },
          ],
          explanation: 'POUR ayuda a ordenar los hallazgos de una auditoría y a explicarlos al equipo.',
        },
        {
          type: 'pick',
          question: '¿Qué puedes comprobar **sin herramientas**, solo con el teclado?',
          options: [
            { text: 'Que se llega a todos los botones y enlaces con Tab', correct: true },
            { text: 'Que el foco se ve en todo momento', correct: true },
            { text: 'Que los diálogos se cierran con Esc y el foco no queda atrapado', correct: true },
            { text: 'La relación de contraste exacta de los colores', correct: false },
          ],
          explanation: 'El contraste exacto se mide con herramientas (axe, Lighthouse, un medidor de contraste). El resto, ¡con las manos!',
        },
        {
          type: 'quiz',
          question: '¿Qué nivel de conformidad WCAG suelen exigir las leyes y los contratos?',
          options: ['AA', 'A', 'AAA', 'Ninguno'],
          answer: 0,
          explanation: 'El nivel **AA** es el estándar habitual (por ejemplo, en la Unión Europea y en muchos contratos públicos).',
        },
      ],
    },

    // ─────────────── 4
    {
      id: 'a-api',
      icon: '🔌',
      title: 'Pruebas de API',
      lesson: [
        {
          title: 'Probar sin interfaz gráfica',
          text: 'Las **APIs REST** comunican el frontend con el servidor (y sistemas entre sí). Probarlas es más **rápido** y **estable** que probar por la interfaz: es la capa del medio de la pirámide.',
          table: {
            head: ['Método', 'Uso', 'Respuesta típica'],
            rows: [
              ['`GET /api/productos/2`', 'Consultar', '**200** OK · **404** si no existe'],
              ['`POST /api/pedidos`', 'Crear', '**201** Created · **422/400** si los datos son inválidos'],
              ['`PUT` / `PATCH`', 'Modificar', '**200** OK'],
              ['`DELETE /api/pedidos/7`', 'Eliminar', '**204** No Content'],
            ],
          },
          tip: 'Códigos: **2xx** éxito · **4xx** error del cliente (401 sin autenticar, 403 sin permiso, 404 no existe) · **5xx** error del servidor.',
        },
        {
          title: 'Con Python: requests + pytest',
          code: {
            lang: 'py',
            code: code`
              import requests

              def test_obtener_producto():
                  respuesta = requests.get("https://pixelshop.test/api/productos/2")
                  assert respuesta.status_code == 200
                  assert respuesta.json()["nombre"] == "Teclado mecánico"
            `,
          },
          points: ['Comprueba el **código de estado**, el **cuerpo** (JSON) y, si aplica, los encabezados y el tiempo de respuesta.', 'Prueba también los casos de **error**: recursos que no existen, datos inválidos, sin permiso.', 'Playwright también trae un cliente de API: `playwright.request`.'],
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'classify',
          question: '¿Qué código de estado HTTP debería devolver la API?',
          bins: [
            { id: '200', label: '200 OK' },
            { id: '201', label: '201 Created' },
            { id: '404', label: '404 Not Found' },
            { id: '401', label: '401 Unauthorized' },
            { id: '500', label: '500 Server Error' },
          ],
          items: [
            { text: 'GET de un producto que existe', bin: '200' },
            { text: 'POST que crea un pedido nuevo', bin: '201' },
            { text: 'GET de /api/productos/999 (no existe)', bin: '404' },
            { text: 'Pedir el historial sin haber iniciado sesión', bin: '401' },
            { text: 'La base de datos se cayó', bin: '500' },
          ],
          explanation: 'Un 500 nunca debería ser la respuesta "normal" a un error del usuario: si lo ves en una prueba, ¡probablemente encontraste un defecto!',
        },
        {
          type: 'py',
          question: 'Prueba la API de PixelShop',
          instructions:
            'El módulo 🔒 `api.py` simula la API (funciona igual que `requests`: `respuesta.status_code` y `respuesta.json()`).\nPrueba:\n• `GET /api/productos/2` → 200 y nombre «Teclado mecánico».\n• `GET /api/productos/99` → 404.\n• `POST /api/pedidos` con `{"productos": [2]}` → 201 y estado «recibido».\n• `POST /api/pedidos` con `{"productos": []}` → 422.\nHay **4 bugs** sembrados.',
          files: {
            'test_api.py': py`
              import api


              def test_listar_productos():
                  respuesta = api.get("/api/productos")
                  assert respuesta.status_code == 200
                  assert len(respuesta.json()) == 2
            `,
            'api.py': API,
          },
          mutants: {
            noexiste: { label: 'Un producto inexistente devuelve 200', files: { 'api.py': API.replace('return Respuesta(404, {"error": "Producto no encontrado"})', 'return Respuesta(200, {"error": "Producto no encontrado"})') } },
            porid: { label: 'GET por id siempre devuelve el primer producto', files: { 'api.py': API.replace('return Respuesta(200, PRODUCTOS[pid])', 'return Respuesta(200, PRODUCTOS[1])') } },
            creado: { label: 'Crear un pedido devuelve 200 en vez de 201', files: { 'api.py': API.replace('return Respuesta(201, {"id": 1024', 'return Respuesta(200, {"id": 1024') } },
            vacio: { label: 'Acepta pedidos sin productos', files: { 'api.py': API.replace('        if not datos.get("productos"):\n            return Respuesta(422, {"error": "El pedido no tiene productos"})\n', '') } },
          },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'Compruebas los códigos de estado', uses: 'status_code' },
            { text: 'Atrapas el 200 de un producto inexistente', kills: 'noexiste' },
            { text: 'Atrapas el bug del GET por id', kills: 'porid' },
            { text: 'Atrapas el 200 en vez de 201', kills: 'creado' },
            { text: 'Atrapas el pedido vacío aceptado', kills: 'vacio' },
          ],
          solution: {
            'test_api.py': py`
              import api


              def test_listar_productos():
                  respuesta = api.get("/api/productos")
                  assert respuesta.status_code == 200
                  assert len(respuesta.json()) == 2


              def test_obtener_producto():
                  respuesta = api.get("/api/productos/2")
                  assert respuesta.status_code == 200
                  assert respuesta.json()["nombre"] == "Teclado mecánico"


              def test_producto_inexistente():
                  assert api.get("/api/productos/99").status_code == 404


              def test_crear_pedido():
                  respuesta = api.post("/api/pedidos", {"productos": [2]})
                  assert respuesta.status_code == 201
                  assert respuesta.json()["estado"] == "recibido"


              def test_pedido_sin_productos():
                  assert api.post("/api/pedidos", {"productos": []}).status_code == 422
            `,
          },
          hint: 'Una prueba por punto de la lista. Revisa siempre `status_code` y, cuando haya datos, `respuesta.json()[...]`.',
        },
        {
          type: 'quiz',
          question: 'Toda la lógica de los cupones se puede probar por la API. ¿Por qué conviene hacerlo ahí y no con Playwright por la interfaz?',
          options: [
            'Porque las pruebas de API son más rápidas y estables; la UI se reserva para los flujos críticos',
            'Porque Playwright no puede probar cupones',
            'Porque la API nunca tiene defectos',
            'Porque así no hay que escribir aserciones',
          ],
          answer: 0,
          explanation: 'Es la idea de la **pirámide**: cada regla se prueba en la capa más baja (y barata) posible.',
        },
      ],
    },

    // ─────────────── 5
    {
      id: 'a-ci',
      icon: '🔁',
      title: 'Integración continua',
      lesson: [
        {
          title: 'Pruebas en cada cambio',
          text: 'En la **integración continua (CI)**, cada `push` o pull request dispara una **canalización** (pipeline) que instala, ejecuta las pruebas y avisa si algo se rompió.',
          code: {
            lang: 'yaml',
            code: code`
              # .github/workflows/pruebas.yml
              name: Pruebas
              on: [push, pull_request]
              jobs:
                pruebas:
                  runs-on: ubuntu-latest
                  steps:
                    - uses: actions/checkout@v4
                    - uses: actions/setup-python@v5
                      with:
                        python-version: "3.12"
                    - run: pip install -r requirements.txt
                    - run: playwright install --with-deps
                    - run: pytest --tracing retain-on-failure
                    - uses: actions/upload-artifact@v4
                      if: failure()
                      with:
                        name: trazas
                        path: test-results/
            `,
          },
        },
        {
          title: 'Buenas prácticas',
          points: [
            'Ordena por velocidad: primero **linter** y **unitarias** (segundos), luego API, al final **E2E**.',
            'Si la canalización está en rojo, **arreglarla es la prioridad** del equipo.',
            'Las **pruebas inestables** (flaky) destruyen la confianza: investiga la causa (esperas fijas, datos compartidos, orden) en lugar de "reintentar hasta que pase".',
            'Guarda **evidencias** (trazas, capturas, reportes) cuando algo falla.',
          ],
          tip: '¡Felicitaciones! Con esto tienes el ciclo completo: diseñar, automatizar y ejecutar las pruebas en cada cambio. 🎉',
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'order',
          question: 'Ordena los pasos de una buena canalización de CI.',
          steps: ['Descargar el código (checkout)', 'Instalar Python y las dependencias', 'Ejecutar el linter (análisis estático)', 'Ejecutar las pruebas unitarias', 'Ejecutar las pruebas E2E con Playwright', 'Publicar las evidencias si algo falló'],
          explanation: 'Lo rápido primero: si el linter o las unitarias fallan, no hace falta esperar a las E2E.',
        },
        {
          type: 'fill',
          question: 'Completa el workflow de GitHub Actions.',
          lang: 'yaml',
          code: 'on: [push, ___]\njobs:\n  pruebas:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/___@v4\n      - run: pip install -r requirements.txt\n      - run: playwright ___ --with-deps\n      - run: ___',
          blanks: [['pull_request'], ['checkout'], ['install'], ['pytest']],
          bank: ['pull_request', 'checkout', 'install', 'pytest', 'merge', 'clone', 'run-tests'],
          explanation: 'Disparadores, descargar el repo, instalar navegadores y ejecutar pytest. ¡Tu proyecto de clase puede usar exactamente esto!',
        },
        {
          type: 'quiz',
          question: 'Una prueba E2E falla 1 de cada 10 veces en CI, sin cambios en el código. ¿Qué haces?',
          options: [
            'Investigar la causa (esperas fijas, datos compartidos, dependencia del orden) y corregir la prueba',
            'Configurar 5 reintentos automáticos y olvidarse',
            'Borrar la prueba',
            'Ignorarla: 90 % es suficiente',
          ],
          answer: 0,
          explanation: 'Los reintentos pueden ayudar mientras se investiga, pero una prueba flaky esconde problemas (¡a veces de la app!) y hace que el equipo deje de confiar en la canalización.',
        },
        {
          type: 'pick',
          question: '¿Qué beneficios trae ejecutar las pruebas en CI?',
          options: [
            { text: 'Detectar regresiones minutos después de cada cambio', correct: true },
            { text: 'Ejecutar siempre en un entorno limpio y repetible', correct: true },
            { text: 'Evitar el «en mi máquina funciona»', correct: true },
            { text: 'Garantizar que el software no tiene defectos', correct: false },
          ],
          explanation: 'CI acelera la retroalimentación, pero recuerda el principio 1: las pruebas muestran la presencia de defectos, no su ausencia.',
        },
      ],
    },
  ],
};
