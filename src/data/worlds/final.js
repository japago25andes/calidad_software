// ───────────────────────── JEFE FINAL: AUDITORÍA DE PIXELSHOP ─────────────────────────
import { code, py, shop } from '../helpers.js';

const ENVIO = py`
  def costo_envio(total, peso_kg, premium=False):
      """Reglas de envío de PixelShop:
      - Peso de 1 a 20 kg: envío normal ($12.000).
      - Peso de 21 a 30 kg: envío pesado ($25.000), nunca es gratis.
      - Menos de 1 kg o más de 30 kg: ValueError.
      - El envío normal es gratis si el total es de $150.000 o más, o si el cliente es premium.
      """
      if peso_kg < 1 or peso_kg > 30:
          raise ValueError("Peso no permitido")
      if peso_kg > 20:
          return 25000
      if premium or total >= 150000:
          return 0
      return 12000
`;

const sev = (answer) => ({ options: ['Crítica', 'Alta', 'Media', 'Baja'], answer });
const x = (answer) => ({ options: ['✓', '–'], answer });

export const FINAL = {
  id: 'final',
  short: 'Auditoría',
  name: 'Auditoría final',
  icon: '👾',
  color: '#e11d48',
  description: 'La auditoría de PixelShop antes del gran lanzamiento. Demuestra todo lo que aprendiste.',
  levels: [
    {
      id: 'auditoria-final',
      icon: '👾',
      title: 'Auditoría de PixelShop',
      boss: true,
      lesson: [
        {
          title: 'El gran lanzamiento',
          text: 'PixelShop abre al público la próxima semana y la Agencia te encarga la **auditoría final**. Vas a revisar requisitos y código, diseñar casos, reportar defectos y escribir pruebas automáticas con **pytest** y **Playwright**.',
          points: ['Revisa con calma: los bugs se esconden en los **límites** y en las **combinaciones**.', 'Tus pruebas automáticas deben **atrapar los bugs sembrados**.', 'Al terminar, recibirás tu **diploma** y tu licencia se volverá **dorada**. 🏅'],
          mood: 'wow',
        },
        {
          title: 'Últimos consejos de Bichi',
          points: [
            'Piensa en particiones y valores límite **antes** de escribir el código de las pruebas.',
            'Prefiere `expect()` a las esperas fijas, y los locators por rol y etiqueta.',
            'Un reporte de defecto es comunicación: claro, reproducible y sin culpas.',
          ],
          tip: 'Ya no soy un bug: soy tu compañero de inspección. ¡Vamos! 🐞✓',
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'bughunt',
          question: 'Revisión de código: la regla dice «**3 intentos fallidos bloquean la cuenta**». ¿Qué línea tiene el defecto?',
          code: code`
            def registrar_intento_fallido(usuario):
                usuario.intentos += 1
                if usuario.intentos > 3:
                    usuario.bloqueado = True
                return usuario.bloqueado
          `,
          bugs: [3],
          explanation: 'Con `> 3` la cuenta se bloquea al **cuarto** intento. Debería ser `>= 3`. Otro clásico de los valores límite.',
        },
        {
          type: 'boundary',
          question: 'Diseña los valores para las reglas de **peso del envío** (AVL de 2 valores).',
          rule: 'Peso en kilos enteros: **1 a 20** → envío normal · **21 a 30** → envío pesado · menos de 1 o más de 30 → no permitido.',
          min: -2,
          max: 34,
          unit: ' kg',
          partitions: [
            { from: -2, to: 0.5, label: 'no permitido', valid: false },
            { from: 0.5, to: 20.5, label: 'normal', valid: true },
            { from: 20.5, to: 30.5, label: 'pesado', valid: true },
            { from: 30.5, to: 34, label: 'no permitido', valid: false },
          ],
          answer: [0, 1, 20, 21, 30, 31],
          explanation: 'Tres fronteras, dos valores cada una: 0|1, 20|21 y 30|31. Los usarás en la siguiente prueba automática.',
        },
        {
          type: 'grid',
          question: 'Tabla de decisión del **envío gratis** (solo para paquetes de peso normal).',
          head: ['', 'R1', 'R2', 'R3', 'R4'],
          rows: [
            ['Cliente premium', 'V', 'V', 'F', 'F'],
            ['Total ≥ $150.000', 'V', 'F', 'V', 'F'],
            ['→ Envío gratis', x('✓'), x('✓'), x('✓'), x('–')],
            ['→ Cobra $12.000', x('–'), x('–'), x('–'), x('✓')],
          ],
          explanation: 'Basta una de las dos condiciones para el envío gratis. Solo R4 paga el envío normal.',
        },
        {
          type: 'py',
          question: 'Pruebas unitarias del costo de envío',
          instructions:
            'Prueba `costo_envio` (🔒 `envio.py`) con **valores límite** y la **tabla de decisión** que acabas de hacer.\nUsa `@pytest.mark.parametrize` y `pytest.raises`. Hay **5 bugs** sembrados.',
          files: {
            'test_envio.py': py`
              import pytest
              from envio import costo_envio


              @pytest.mark.parametrize("total, peso, premium, esperado", [
                  (50000, 5, False, 12000),
              ])
              def test_costo_envio(total, peso, premium, esperado):
                  assert costo_envio(total, peso, premium) == esperado
            `,
            'envio.py': ENVIO,
          },
          mutants: {
            pesado20: { label: 'A los 20 kg ya cobra envío pesado (`>=` en vez de `>`)', files: { 'envio.py': ENVIO.replace('if peso_kg > 20:', 'if peso_kg >= 20:') } },
            max31: { label: 'Acepta paquetes de 31 kg', files: { 'envio.py': ENVIO.replace('peso_kg > 30', 'peso_kg > 31') } },
            total: { label: 'El envío gratis exige más de $150.000 (`>` en vez de `>=`)', files: { 'envio.py': ENVIO.replace('total >= 150000', 'total > 150000') } },
            premium: { label: 'Se ignora el beneficio premium', files: { 'envio.py': ENVIO.replace('if premium or total >= 150000:', 'if total >= 150000:') } },
            pesadogratis: {
              label: 'El envío pesado también es gratis para compras grandes',
              files: { 'envio.py': ENVIO.replace('    if peso_kg > 20:\n        return 25000\n    if premium or total >= 150000:\n        return 0\n', '    if premium or total >= 150000:\n        return 0\n    if peso_kg > 20:\n        return 25000\n') },
            },
          },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'Usas `@pytest.mark.parametrize`', uses: '@pytest\\.mark\\.parametrize' },
            { text: 'Usas `pytest.raises` para los pesos no permitidos', uses: 'pytest\\.raises' },
            { text: 'Atrapas el bug del límite de 20 kg', kills: 'pesado20' },
            { text: 'Atrapas el bug de los 31 kg', kills: 'max31' },
            { text: 'Atrapas el bug del total de $150.000', kills: 'total' },
            { text: 'Atrapas el bug del cliente premium', kills: 'premium' },
            { text: 'Atrapas el bug del envío pesado gratis', kills: 'pesadogratis' },
          ],
          solution: {
            'test_envio.py': py`
              import pytest
              from envio import costo_envio


              @pytest.mark.parametrize("total, peso, premium, esperado", [
                  (50000, 1, False, 12000),
                  (50000, 20, False, 12000),
                  (50000, 21, False, 25000),
                  (50000, 30, False, 25000),
                  (150000, 5, False, 0),
                  (149999, 5, False, 12000),
                  (50000, 5, True, 0),
                  (200000, 25, True, 25000),
              ])
              def test_costo_envio(total, peso, premium, esperado):
                  assert costo_envio(total, peso, premium) == esperado


              @pytest.mark.parametrize("peso", [0, 31])
              def test_peso_no_permitido(peso):
                  with pytest.raises(ValueError):
                      costo_envio(50000, peso)
            `,
          },
          hint: 'Combina límites de peso (1, 20, 21, 30 y los inválidos 0 y 31) con la tabla del envío gratis (150000 vs. 149999, premium). ¡No olvides un paquete pesado con compra grande!',
        },
        {
          type: 'py',
          kind: 'pw',
          app: true,
          question: 'Prueba E2E del flujo de compra',
          instructions:
            'Escribe pruebas E2E que protejan el flujo principal:\n1. Buscar «mouse», agregar **2** Mouse inalámbrico, ir al carrito y comprobar **Total: $160.000**.\n2. Ir a pagar, iniciar sesión (ana@pixelshop.test / Clave123) y comprobar que «Confirmar compra» está **deshabilitado** hasta aceptar los términos.\nHay **2 bugs** sembrados en esta versión de PixelShop.',
          files: {
            'test_auditoria.py': py`
              from playwright.sync_api import Page, expect


              def test_total_de_dos_mouses(page: Page):
                  page.goto("/")
                  page.get_by_role("searchbox", name="Buscar").fill("mouse")
            `,
          },
          appBugs: { total: 'total-sin-cantidad', terminos: 'pagar-sin-terminos' },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'Tienes al menos 2 pruebas', minTests: 2 },
            { text: 'No usas esperas fijas', avoid: 'time\\.sleep|wait_for_timeout' },
            { text: 'Detectas el bug del total', kills: 'total' },
            { text: 'Detectas el bug de los términos', kills: 'terminos' },
          ],
          solution: {
            'test_auditoria.py': py`
              from playwright.sync_api import Page, expect


              def agregar_dos_mouses(page: Page):
                  page.goto("/")
                  page.get_by_role("searchbox", name="Buscar").fill("mouse")
                  boton = page.get_by_role("listitem").filter(has_text="Mouse inalámbrico").get_by_role("button", name="Agregar al carrito")
                  boton.click()
                  boton.click()
                  page.get_by_role("link", name="Carrito").click()


              def test_total_de_dos_mouses(page: Page):
                  agregar_dos_mouses(page)
                  expect(page.get_by_test_id("total")).to_have_text("Total: $160.000")


              def test_pagar_exige_aceptar_terminos(page: Page):
                  agregar_dos_mouses(page)
                  page.get_by_role("button", name="Ir a pagar").click()
                  page.get_by_label("Correo electrónico").fill("ana@pixelshop.test")
                  page.get_by_label("Contraseña").fill("Clave123")
                  page.get_by_role("button", name="Entrar").click()
                  confirmar = page.get_by_role("button", name="Confirmar compra")
                  expect(confirmar).to_be_disabled()
                  page.get_by_label("Acepto los términos y condiciones").check()
                  expect(confirmar).to_be_enabled()
            `,
          },
          hint: 'Después de buscar, filtra la tarjeta del Mouse y pulsa su botón dos veces (el locator se vuelve a resolver solo). Para el pago, reutiliza el login del mundo 6.',
        },
        {
          type: 'report',
          question: 'Una de tus pruebas E2E detectó esto en la versión candidata. Repórtalo.',
          screen: shop(`
            <h3>Tu carrito</h3>
            <table><tr><th>Producto</th><th>Cantidad</th><th>Subtotal</th></tr>
            <tr><td>Mouse inalámbrico</td><td>2</td><td>$160.000</td></tr></table>
            <p style="font-size:18px;font-weight:800">Total: $80.000</p>
          `),
          fields: [
            { label: 'Título', options: ['El total del carrito ignora la cantidad: 2 mouses suman $80.000', 'El carrito está mal', 'Error en los precios de toda la tienda'], answer: 0 },
            { label: 'Esperado / obtenido', options: ['Esperado: Total $160.000 · Obtenido: Total $80.000', 'Esperado: que funcione · Obtenido: no funciona', 'Esperado: $80.000 · Obtenido: $160.000'], answer: 0 },
            { label: 'Severidad', options: ['Alta', 'Baja', 'Crítica'], answer: 0 },
            { label: 'Prioridad', options: ['Alta (bloquea el lanzamiento)', 'Baja (para la próxima versión)', 'No aplica'], answer: 0 },
            { label: 'Evidencia', options: ['Captura del carrito y la traza de Playwright de la prueba que falló', 'Ninguna', 'Un mensaje en el chat diciendo que no funciona'], answer: 0 },
          ],
          explanation: 'Cobrar un monto incorrecto es severidad **alta** y, a días del lanzamiento, prioridad **alta**: bloquea la salida a producción.',
        },
        {
          type: 'grid',
          question: 'Último paso: decide si PixelShop puede **lanzarse**. Criterios de salida: 0 defectos críticos o altos abiertos y todas las pruebas de regresión en verde.',
          head: ['Situación', '¿Se cumple el criterio?'],
          rows: [
            ['El defecto del total sigue abierto', x('–')],
            ['Tras la corrección, el re-test y la regresión pasan', x('✓')],
            ['Queda abierto un defecto cosmético de severidad baja', x('✓')],
            ['Una prueba E2E falla a veces (flaky) y nadie sabe por qué', x('–')],
          ],
          explanation: 'Un defecto cosmético no bloquea según el criterio acordado; uno alto abierto o una prueba inestable sin investigar, sí. ¡Decisión basada en datos, no en intuición! 👾 ¡Auditoría superada!',
        },
      ],
    },
  ],
};
