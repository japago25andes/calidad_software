// ───────────────────────── MUNDO 5: PRUEBAS UNITARIAS CON PYTEST ─────────────────────────
// Los retos `py` ejecutan pytest de verdad (Pyodide). Los "mutants" son copias del módulo con un bug
// sembrado: las pruebas del estudiante deben fallar con ellos (así se comprueba que de verdad prueban algo).
import { code, py } from '../helpers.js';

const PRECIOS = py`
  def precio_con_iva(precio):
      """Suma el IVA del 19 % y redondea al peso más cercano."""
      return round(precio * 1.19)
`;

const CARRITO = py`
  class Carrito:
      def __init__(self):
          self.items = {}

      def agregar(self, producto, precio, cantidad=1):
          if cantidad < 1:
              raise ValueError("La cantidad debe ser al menos 1")
          actual = self.items.get(producto, (precio, 0))[1]
          self.items[producto] = (precio, actual + cantidad)

      def cantidad_total(self):
          return sum(c for _, c in self.items.values())

      def total(self):
          return sum(p * c for p, c in self.items.values())
`;

const CUPONES = py`
  def aplicar_cupon(total, codigo):
      if total < 0:
          raise ValueError("El total no puede ser negativo")
      if codigo == "":
          return total
      if codigo == "PIXEL10":
          return total * 0.9
      raise ValueError("Cupón no válido")
`;

const REGISTRO = py`
  def puede_registrarse(edad):
      """Solo pueden registrarse personas de 18 a 99 años."""
      return 18 <= edad <= 99
`;

const INVENTARIO = py`
  class Inventario:
      def __init__(self):
          self._stock = {}

      def recibir(self, producto, unidades):
          self._stock[producto] = self._stock.get(producto, 0) + unidades

      def vender(self, producto, unidades):
          disponible = self._stock.get(producto, 0)
          if unidades > disponible:
              raise ValueError(f"Stock insuficiente de {producto}")
          self._stock[producto] = disponible - unidades

      def stock(self, producto):
          return self._stock.get(producto, 0)
`;

const PAGOS = py`
  class PasarelaPagos:
      """La pasarela real: cobra dinero de verdad. ¡No la uses en las pruebas unitarias!"""

      def cobrar(self, tarjeta, monto):
          raise RuntimeError("Sin conexión con el banco desde el entorno de pruebas")


  def finalizar_compra(total, tarjeta, pasarela):
      if total <= 0:
          raise ValueError("El carrito está vacío")
      respuesta = pasarela.cobrar(tarjeta, total)
      if respuesta["estado"] == "aprobado":
          return f"Pedido confirmado: {respuesta['id']}"
      return "Pago rechazado"
`;

export const UNITARIAS = {
  id: 'unitarias',
  short: 'pytest',
  name: 'Pruebas unitarias con pytest',
  icon: '🧪',
  color: '#22c55e',
  description: 'Escribe pruebas de verdad con pytest: aserciones, patrón AAA, excepciones, parametrización, fixtures, mocks y TDD.',
  levels: [
    // ─────────────── 1
    {
      id: 'u-primera',
      icon: '🐍',
      title: 'Tu primera prueba con pytest',
      lesson: [
        {
          title: 'pytest: la herramienta favorita de Python',
          text: '**pytest** es el framework de pruebas más usado en Python. Se instala con pip y encuentra tus pruebas solo:',
          code: { lang: 'bash', code: 'pip install pytest\npytest            # ejecuta todas las pruebas\npytest -v         # muestra cada prueba por su nombre\npytest -q         # salida corta' },
          points: ['Los archivos se llaman `test_*.py` (o `*_test.py`).', 'Las pruebas son funciones que empiezan por `test_`.', 'Se comprueba con el `assert` de Python, sin nada especial.'],
        },
        {
          title: 'Una prueba en tres líneas',
          codes: [
            { lang: 'py', title: 'precios.py', code: PRECIOS.trim() },
            {
              lang: 'py',
              title: 'test_precios.py',
              code: code`
                from precios import precio_con_iva


                def test_precio_con_iva_de_100():
                    assert precio_con_iva(100) == 119
              `,
            },
          ],
          tip: 'En este juego, pytest se ejecuta **de verdad** dentro de tu navegador (gracias a Pyodide). Lo que veas en la terminal es la salida real de pytest. 🐍',
        },
        {
          title: 'Leer la salida',
          code: {
            lang: 'text',
            code: code`
              $ pytest -q
              ..F                                                    [100%]
              ================================ FAILURES ================================
              ________________________ test_precio_con_iva_de_200 ______________________
                  def test_precio_con_iva_de_200():
              >       assert precio_con_iva(200) == 240
              E       assert 238 == 240
              E        +  where 238 = precio_con_iva(200)
              1 failed, 2 passed in 0.02s
            `,
          },
          points: ['`.` = prueba que pasa · `F` = falla (un `assert` no se cumplió) · `E` = error (excepción inesperada).', 'pytest muestra los **valores reales**: aquí se esperaba 240 y salió 238.'],
          mood: 'wow',
        },
        {
          title: '¿Mis pruebas sirven? Bugs sembrados',
          text: 'En los retos de este mundo, Bichi **siembra bugs** en copias del código (esto se llama **pruebas de mutación**). Si tus pruebas fallan con el código con bug, ¡lo atraparon! Si siguen en verde, el bug **se escapó**: tus pruebas no comprueban lo suficiente.',
          tip: 'Una prueba que nunca falla no protege nada. 🐞',
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'quiz',
          kind: 'predict',
          question: '¿Qué muestra pytest si de 4 pruebas, la tercera falla y las demás pasan?',
          options: ['`..F.` y «1 failed, 3 passed»', '`FFFF`', '`...F` y «3 passed»', '`..E.` y «1 error»'],
          answer: 0,
          explanation: 'Un carácter por prueba, en orden: `.` para las que pasan y `F` para la que falla.',
        },
        {
          type: 'fill',
          question: 'Completa la prueba para que pytest la encuentre y compruebe el resultado.',
          lang: 'py',
          code: 'from precios import precio_con_iva\n\n\ndef ___precio_con_iva_de_1000():\n    ___ precio_con_iva(1000) ___ 1190',
          blanks: [['test_'], ['assert'], ['==']],
          bank: ['test_', 'assert', '==', '=', 'check', 'prueba_'],
          explanation: 'Funciones `test_…` y `assert` con `==` (comparación). Un solo `=` sería una asignación: ¡error de sintaxis!',
        },
        {
          type: 'py',
          question: 'Escribe tus primeras pruebas',
          instructions:
            'Prueba la función `precio_con_iva` (pestaña 🔒 `precios.py`).\n1. Completa la primera prueba con un `assert`.\n2. Agrega **al menos otra prueba** con otro precio.\n3. Pulsa **▶ Ejecutar pruebas**. Bichi sembró **2 bugs**: tus pruebas deben atraparlos a ambos.',
          files: {
            'test_precios.py': py`
              from precios import precio_con_iva


              def test_precio_con_iva_de_100():
                  # Escribe aquí tu aserción: el precio 100 con IVA es 119
                  pass
            `,
            'precios.py': PRECIOS,
          },
          mutants: {
            iva16: { label: 'El IVA usado es del 16 % en vez del 19 %', files: { 'precios.py': 'def precio_con_iva(precio):\n    return round(precio * 1.16)\n' } },
            sumafija: { label: 'Suma 19 pesos fijos en vez del 19 %', files: { 'precios.py': 'def precio_con_iva(precio):\n    return precio + 19\n' } },
          },
          checks: [
            { text: 'Todas tus pruebas pasan con el código correcto', allPass: true },
            { text: 'Tienes al menos 2 pruebas', minTests: 2 },
            { text: 'Usas `assert` para comprobar el resultado', uses: '^\\s*assert\\s' },
            { text: 'Atrapas el bug del IVA del 16 %', kills: 'iva16' },
            { text: 'Atrapas el bug de la suma fija', kills: 'sumafija' },
          ],
          solution: {
            'test_precios.py': py`
              from precios import precio_con_iva


              def test_precio_con_iva_de_100():
                  assert precio_con_iva(100) == 119


              def test_precio_con_iva_de_200():
                  assert precio_con_iva(200) == 238
            `,
          },
          hint: 'Con 100, «sumar 19 pesos» y «sumar el 19 %» dan lo mismo (119). ¡Prueba otro precio, por ejemplo 200 → 238!',
        },
        {
          type: 'quiz',
          question: 'Con el bug «suma 19 pesos fijos», la prueba `assert precio_con_iva(100) == 119` **pasa**. ¿Qué lección deja?',
          options: [
            'Un solo dato puede coincidir por casualidad: hay que elegir datos que distingan el comportamiento correcto',
            'Que la prueba está mal escrita',
            'Que pytest no funciona con números',
            'Que el bug no es importante',
          ],
          answer: 0,
          explanation: '100 × 19 % = 19: ¡coincidencia! Elegir bien los **datos de prueba** es tan importante como escribir el `assert`.',
        },
      ],
    },

    // ─────────────── 2
    {
      id: 'u-aaa',
      icon: '🧱',
      title: 'Patrón AAA y buenas pruebas',
      lesson: [
        {
          title: 'Arrange · Act · Assert',
          text: 'Casi toda prueba unitaria sigue tres pasos:',
          code: {
            lang: 'py',
            code: code`
              def test_agregar_dos_unidades_suma_al_total():
                  # Arrange (preparar)
                  carrito = Carrito()

                  # Act (actuar)
                  carrito.agregar("Mouse", 80000, cantidad=2)

                  # Assert (comprobar)
                  assert carrito.total() == 160000
            `,
          },
          tip: 'En español: **Preparar · Actuar · Comprobar**. Una prueba = un comportamiento.',
        },
        {
          title: 'Los principios FIRST',
          table: {
            head: ['Letra', 'Principio', 'Significa'],
            rows: [
              ['**F**', 'Fast (rápidas)', 'Milisegundos: se ejecutan a cada rato.'],
              ['**I**', 'Independent (independientes)', 'No dependen del orden ni de otras pruebas.'],
              ['**R**', 'Repeatable (repetibles)', 'Mismo resultado siempre, en cualquier máquina.'],
              ['**S**', 'Self-validating (autoevaluables)', 'Pasan o fallan solas: nadie tiene que mirar la salida.'],
              ['**T**', 'Timely (oportunas)', 'Se escriben a tiempo: junto con el código (o antes).'],
            ],
          },
        },
        {
          title: 'Nombres que cuentan una historia',
          points: ['❌ `test_1`, `test_carrito`, `test_funciona`', '✅ `test_agregar_mismo_producto_acumula_cantidad`', '✅ `test_carrito_vacio_tiene_total_cero`'],
          tip: 'Cuando una prueba falla, su **nombre** es lo primero que lees. Que te diga qué se rompió.',
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'bughunt',
          question: 'Esta prueba **siempre pasa**, aunque el carrito esté roto. ¿Qué línea revela el problema?',
          code: code`
            def test_agregar_producto():
                carrito = Carrito()
                carrito.agregar("Mouse", 80000)
                carrito.total()
          `,
          bugs: [4],
          explanation: 'Llama a `total()` pero **no comprueba** nada: le falta el `assert`. Viola el principio *Self-validating*.',
        },
        {
          type: 'classify',
          question: '¿Qué principio FIRST se **viola** en cada caso?',
          bins: [
            { id: 'f', label: 'Fast' },
            { id: 'i', label: 'Independent' },
            { id: 'r', label: 'Repeatable' },
            { id: 's', label: 'Self-validating' },
          ],
          items: [
            { text: 'La prueba espera 10 segundos con `time.sleep(10)`', bin: 'f' },
            { text: '`test_pagar` solo funciona si antes corrió `test_agregar`', bin: 'i' },
            { text: 'La prueba depende de la fecha de hoy y falla los domingos', bin: 'r' },
            { text: 'La prueba imprime el total y hay que leerlo para saber si está bien', bin: 's' },
          ],
          explanation: 'Pruebas lentas, acopladas, frágiles o que requieren mirar la salida terminan ignoradas por el equipo.',
        },
        {
          type: 'py',
          question: 'Prueba el carrito con el patrón AAA',
          instructions:
            'Escribe pruebas para la clase `Carrito` (pestaña 🔒 `carrito.py`). Usa el patrón **Arrange / Act / Assert**.\nBichi sembró **3 bugs** distintos en el carrito. Piensa qué comportamientos hay que comprobar: el total, la cantidad total y qué pasa si agregas **el mismo producto dos veces**.',
          files: {
            'test_carrito.py': py`
              from carrito import Carrito


              def test_carrito_vacio_tiene_total_cero():
                  # Arrange
                  carrito = Carrito()
                  # Act
                  total = carrito.total()
                  # Assert
                  assert total == 0
            `,
            'carrito.py': CARRITO,
          },
          mutants: {
            total: { label: 'El total ignora la cantidad de cada producto', files: { 'carrito.py': CARRITO.replace('sum(p * c for p, c', 'sum(p for p, c') } },
            reemplaza: { label: 'Agregar el mismo producto reemplaza la cantidad en vez de sumarla', files: { 'carrito.py': CARRITO.replace('(precio, actual + cantidad)', '(precio, cantidad)') } },
            contador: { label: 'cantidad_total() cuenta productos distintos, no unidades', files: { 'carrito.py': CARRITO.replace('sum(c for _, c in self.items.values())', 'len(self.items)') } },
          },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'Tienes al menos 3 pruebas', minTests: 3 },
            { text: 'Atrapas el bug del total sin cantidades', kills: 'total' },
            { text: 'Atrapas el bug de agregar dos veces', kills: 'reemplaza' },
            { text: 'Atrapas el bug del contador de unidades', kills: 'contador' },
          ],
          solution: {
            'test_carrito.py': py`
              from carrito import Carrito


              def test_carrito_vacio_tiene_total_cero():
                  carrito = Carrito()
                  assert carrito.total() == 0


              def test_total_multiplica_precio_por_cantidad():
                  # Arrange
                  carrito = Carrito()
                  # Act
                  carrito.agregar("Mouse", 80000, cantidad=2)
                  # Assert
                  assert carrito.total() == 160000


              def test_agregar_mismo_producto_acumula_cantidad():
                  carrito = Carrito()
                  carrito.agregar("Mouse", 80000)
                  carrito.agregar("Mouse", 80000)
                  assert carrito.cantidad_total() == 2
            `,
          },
          hint: 'Una prueba con `cantidad=2` atrapa dos bugs a la vez. Para el tercero: agrega el mismo producto **dos veces** y revisa `cantidad_total()`.',
        },
        {
          type: 'quiz',
          question: '¿Cuál es el **mejor nombre** para una prueba que verifica que no se puede agregar cantidad 0?',
          options: ['`test_agregar_cantidad_cero_lanza_error`', '`test_3`', '`test_carrito_error`', '`test_funciona_bien`'],
          answer: 0,
          explanation: 'Dice **qué** se hace y **qué** se espera. Si falla, ya sabes qué se rompió sin abrir el código.',
        },
      ],
    },

    // ─────────────── 3
    {
      id: 'u-excepciones',
      icon: '💥',
      title: 'Excepciones y decimales',
      lesson: [
        {
          title: 'Probar que algo falla… como debe',
          text: 'Los casos **negativos** también se prueban. Con `pytest.raises` compruebas que se lanza la excepción esperada:',
          code: {
            lang: 'py',
            code: code`
              import pytest
              from cupones import aplicar_cupon


              def test_cupon_inexistente_lanza_error():
                  with pytest.raises(ValueError, match="no válido"):
                      aplicar_cupon(100000, "GRATIS")
            `,
          },
          tip: '`match` busca un texto (o expresión regular) en el mensaje de la excepción. Así no te vale *cualquier* ValueError.',
        },
        {
          title: 'Cuidado con los decimales',
          code: { lang: 'py', code: '>>> 0.1 + 0.2\n0.30000000000000004\n>>> 0.1 + 0.2 == 0.3\nFalse' },
          points: ['Los `float` no son exactos: comparar con `==` puede fallar por una diferencia minúscula.', 'Usa `pytest.approx`: `assert 0.1 + 0.2 == pytest.approx(0.3)`.'],
          mood: 'wow',
        },
      ],
      challenges: [
        {
          type: 'quiz',
          kind: 'predict',
          question: '¿Qué pasa al ejecutar esta prueba?',
          snippet: { lang: 'py', code: 'def test_suma():\n    assert 0.1 + 0.2 == 0.3' },
          options: ['Falla: 0.30000000000000004 != 0.3', 'Pasa', 'Da un error de sintaxis', 'pytest la ignora'],
          answer: 0,
          explanation: 'Problema clásico de punto flotante. Solución: `pytest.approx(0.3)`.',
        },
        {
          type: 'fill',
          question: 'Completa la prueba que comprueba que un total negativo es rechazado.',
          lang: 'py',
          code: 'import pytest\n\n\ndef test_total_negativo_lanza_error():\n    ___ pytest.___(ValueError):\n        aplicar_cupon(-500, "PIXEL10")',
          blanks: [['with'], ['raises']],
          bank: ['with', 'raises', 'try', 'except', 'catch', 'error'],
          explanation: '`with pytest.raises(...)` hace que la prueba **pase** solo si el bloque lanza esa excepción.',
        },
        {
          type: 'py',
          question: 'Prueba los cupones, incluidos los errores',
          instructions:
            'Prueba `aplicar_cupon` (🔒 `cupones.py`):\n• PIXEL10 descuenta el 10 % (usa `pytest.approx`).\n• Un código vacío no cambia el total.\n• Un cupón inexistente lanza `ValueError`.\n• Un total negativo lanza `ValueError`.\nHay **4 bugs** sembrados.',
          files: {
            'test_cupones.py': py`
              import pytest
              from cupones import aplicar_cupon


              def test_pixel10_descuenta_diez_por_ciento():
                  assert aplicar_cupon(250000, "PIXEL10") == pytest.approx(225000)
            `,
            'cupones.py': CUPONES,
          },
          mutants: {
            descuento: { label: 'PIXEL10 descuenta el 20 %', files: { 'cupones.py': CUPONES.replace('total * 0.9', 'total * 0.8') } },
            vacio: { label: 'El código vacío también aplica descuento', files: { 'cupones.py': CUPONES.replace('    if codigo == "":\n        return total\n', '') .replace('if codigo == "PIXEL10":', 'if codigo in ("PIXEL10", ""):') } },
            invalido: { label: 'Un cupón inexistente se acepta sin descuento', files: { 'cupones.py': CUPONES.replace('    raise ValueError("Cupón no válido")', '    return total') } },
            negativo: { label: 'No se valida que el total sea negativo', files: { 'cupones.py': CUPONES.replace('    if total < 0:\n        raise ValueError("El total no puede ser negativo")\n', '') } },
          },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'Usas `pytest.raises` para los casos de error', uses: 'pytest\\.raises' },
            { text: 'Atrapas el bug del descuento del 20 %', kills: 'descuento' },
            { text: 'Atrapas el bug del código vacío', kills: 'vacio' },
            { text: 'Atrapas el bug del cupón inexistente', kills: 'invalido' },
            { text: 'Atrapas el bug del total negativo', kills: 'negativo' },
          ],
          solution: {
            'test_cupones.py': py`
              import pytest
              from cupones import aplicar_cupon


              def test_pixel10_descuenta_diez_por_ciento():
                  assert aplicar_cupon(250000, "PIXEL10") == pytest.approx(225000)


              def test_codigo_vacio_no_cambia_el_total():
                  assert aplicar_cupon(100000, "") == 100000


              def test_cupon_inexistente_lanza_error():
                  with pytest.raises(ValueError, match="no válido"):
                      aplicar_cupon(100000, "GRATIS")


              def test_total_negativo_lanza_error():
                  with pytest.raises(ValueError, match="negativo"):
                      aplicar_cupon(-100, "")
            `,
          },
          hint: 'Necesitas 4 pruebas: una por comportamiento. Para los errores: `with pytest.raises(ValueError):`.',
        },
      ],
    },

    // ─────────────── 4
    {
      id: 'u-parametrize',
      icon: '🧮',
      title: 'Parametrización',
      lesson: [
        {
          title: 'Una prueba, muchos datos',
          text: 'Cuando la lógica de la prueba es la misma y solo cambian los datos, `@pytest.mark.parametrize` evita copiar y pegar:',
          code: {
            lang: 'py',
            code: code`
              import pytest
              from registro import puede_registrarse


              @pytest.mark.parametrize("edad, esperado", [
                  (17, False),
                  (18, True),
                  (40, True),
              ])
              def test_puede_registrarse(edad, esperado):
                  assert puede_registrarse(edad) == esperado
            `,
          },
          points: ['pytest crea **una prueba por cada tupla**: `test_puede_registrarse[17-False]`, `[18-True]`…', 'Si falla una, las demás siguen ejecutándose.'],
        },
        {
          title: 'Parametrizar + valores límite = 💪',
          text: '¿Recuerdas el **análisis de valores límite** del mundo 3? Con `parametrize` lo conviertes en pruebas automáticas en segundos.',
          tip: 'Puedes poner nombres a los casos con `ids=[...]` o `pytest.param(17, False, id="menor de edad")`.',
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'fill',
          question: 'Completa la parametrización.',
          lang: 'py',
          code: '@pytest.___.___("cantidad, valida", [\n    (0, False),\n    (1, True),\n    (10, True),\n    (11, False),\n])\ndef test_cantidad(___, valida):\n    assert cantidad_valida(cantidad) == valida',
          blanks: [['mark'], ['parametrize'], ['cantidad']],
          bank: ['mark', 'parametrize', 'cantidad', 'fixture', 'param', 'valores'],
          explanation: '`@pytest.mark.parametrize("nombres", [tuplas])` y los mismos nombres como parámetros de la función.',
        },
        {
          type: 'py',
          question: 'Valores límite con parametrize',
          instructions:
            'Regla: **solo pueden registrarse personas de 18 a 99 años** (🔒 `registro.py`).\nEscribe **una** prueba parametrizada con los valores límite (AVL de 2 valores).\nBichi sembró **4 bugs** en los límites: solo un buen análisis de valores límite los atrapa todos.',
          files: {
            'test_registro.py': py`
              import pytest
              from registro import puede_registrarse


              @pytest.mark.parametrize("edad, esperado", [
                  (40, True),
              ])
              def test_puede_registrarse(edad, esperado):
                  assert puede_registrarse(edad) == esperado
            `,
            'registro.py': REGISTRO,
          },
          mutants: {
            min_estricto: { label: 'Mínimo con `<` en vez de `<=` (rechaza a los de 18)', files: { 'registro.py': REGISTRO.replace('18 <= edad', '18 < edad') } },
            max_estricto: { label: 'Máximo con `<` en vez de `<=` (rechaza a los de 99)', files: { 'registro.py': REGISTRO.replace('edad <= 99', 'edad < 99') } },
            min_bajo: { label: 'El mínimo es 17 en vez de 18', files: { 'registro.py': REGISTRO.replace('18 <= edad', '17 <= edad') } },
            max_alto: { label: 'El máximo es 100 en vez de 99', files: { 'registro.py': REGISTRO.replace('edad <= 99', 'edad <= 100') } },
          },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'Usas `@pytest.mark.parametrize`', uses: '@pytest\\.mark\\.parametrize' },
            { text: 'Hay al menos 4 casos', minTests: 4 },
            { text: 'Atrapas el bug del mínimo estricto', kills: 'min_estricto' },
            { text: 'Atrapas el bug del máximo estricto', kills: 'max_estricto' },
            { text: 'Atrapas el bug del mínimo 17', kills: 'min_bajo' },
            { text: 'Atrapas el bug del máximo 100', kills: 'max_alto' },
          ],
          solution: {
            'test_registro.py': py`
              import pytest
              from registro import puede_registrarse


              @pytest.mark.parametrize("edad, esperado", [
                  (17, False),
                  (18, True),
                  (99, True),
                  (100, False),
              ])
              def test_puede_registrarse(edad, esperado):
                  assert puede_registrarse(edad) == esperado
            `,
          },
          hint: 'AVL de 2 valores: los límites (18 y 99) y sus vecinos inválidos (17 y 100).',
        },
        {
          type: 'quiz',
          question: 'Una prueba parametrizada tiene 5 tuplas y una de ellas falla. ¿Qué informa pytest?',
          options: ['1 failed, 4 passed: cada tupla es una prueba independiente', '1 failed: toda la prueba falla', '5 failed', 'Solo ejecuta hasta la tupla que falla'],
          answer: 0,
          explanation: 'Cada combinación es una prueba aparte con su propio nombre, por ejemplo `test_puede_registrarse[17-False]`.',
        },
      ],
    },

    // ─────────────── 5
    {
      id: 'u-fixtures',
      icon: '🔧',
      title: 'Fixtures',
      lesson: [
        {
          title: 'Preparar una vez, usar en muchas pruebas',
          text: 'Una **fixture** prepara lo que necesitan las pruebas (el *Arrange*). pytest la inyecta en cualquier prueba que tenga un parámetro con su nombre:',
          code: {
            lang: 'py',
            code: code`
              import pytest
              from inventario import Inventario


              @pytest.fixture
              def inventario():
                  inv = Inventario()
                  inv.recibir("Teclado", 10)
                  return inv


              def test_vender_descuenta_stock(inventario):
                  inventario.vender("Teclado", 3)
                  assert inventario.stock("Teclado") == 7
            `,
          },
          tip: 'Cada prueba recibe una fixture **nueva**: las pruebas no se contaminan entre sí (principio *Independent*).',
        },
        {
          title: 'yield, alcance y conftest.py',
          points: [
            'Con `yield` en vez de `return`, el código después del `yield` se ejecuta al **terminar** la prueba (limpieza).',
            '`@pytest.fixture(scope="module")` comparte la fixture entre las pruebas de un archivo (útil si es costosa).',
            'Las fixtures en `conftest.py` están disponibles para todas las pruebas de esa carpeta.',
            'pytest trae fixtures listas: `tmp_path` (carpeta temporal), `monkeypatch`, `capsys`…',
          ],
          code: {
            lang: 'py',
            code: code`
              @pytest.fixture
              def base_de_datos():
                  db = conectar()      # preparar
                  yield db             # la prueba se ejecuta aquí
                  db.cerrar()          # limpiar, aunque la prueba falle
            `,
          },
        },
      ],
      challenges: [
        {
          type: 'py',
          question: 'Prueba el inventario con una fixture',
          instructions:
            'Completa la fixture `inventario` para que devuelva un `Inventario` con **10 teclados**, y escribe al menos **3 pruebas** que la usen.\nHay **3 bugs** sembrados. Pista: ¿qué pasa si vendes **exactamente** todo el stock? ¿Y si pides más de lo que hay?',
          files: {
            'test_inventario.py': py`
              import pytest
              from inventario import Inventario


              @pytest.fixture
              def inventario():
                  # Prepara y devuelve un inventario con 10 teclados
                  pass


              def test_vender_descuenta_stock(inventario):
                  inventario.vender("Teclado", 3)
                  assert inventario.stock("Teclado") == 7
            `,
            'inventario.py': INVENTARIO,
          },
          mutants: {
            nodescuenta: { label: 'Vender no descuenta el stock', files: { 'inventario.py': INVENTARIO.replace('self._stock[producto] = disponible - unidades', 'self._stock[producto] = disponible') } },
            sinvalidar: { label: 'Se puede vender más de lo que hay (stock negativo)', files: { 'inventario.py': INVENTARIO.replace('        if unidades > disponible:\n            raise ValueError(f"Stock insuficiente de {producto}")\n', '') } },
            limite: { label: 'No deja vender exactamente todo el stock (`>=` en vez de `>`)', files: { 'inventario.py': INVENTARIO.replace('if unidades > disponible', 'if unidades >= disponible') } },
          },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'Defines una fixture con `@pytest.fixture`', uses: '@pytest\\.fixture' },
            { text: 'Tienes al menos 3 pruebas', minTests: 3 },
            { text: 'Atrapas el bug de vender sin descontar', kills: 'nodescuenta' },
            { text: 'Atrapas el bug del stock negativo', kills: 'sinvalidar' },
            { text: 'Atrapas el bug del límite (vender todo)', kills: 'limite' },
          ],
          solution: {
            'test_inventario.py': py`
              import pytest
              from inventario import Inventario


              @pytest.fixture
              def inventario():
                  inv = Inventario()
                  inv.recibir("Teclado", 10)
                  return inv


              def test_vender_descuenta_stock(inventario):
                  inventario.vender("Teclado", 3)
                  assert inventario.stock("Teclado") == 7


              def test_vender_todo_el_stock_deja_cero(inventario):
                  inventario.vender("Teclado", 10)
                  assert inventario.stock("Teclado") == 0


              def test_vender_mas_de_lo_que_hay_lanza_error(inventario):
                  with pytest.raises(ValueError, match="insuficiente"):
                      inventario.vender("Teclado", 11)
            `,
          },
          hint: 'La fixture: `inv = Inventario()`, `inv.recibir("Teclado", 10)`, `return inv`. Luego prueba vender 10 (límite) y vender 11 (error).',
        },
        {
          type: 'quiz',
          question: '¿Qué ventaja tiene usar `yield` en una fixture?',
          options: [
            'El código después del yield se ejecuta al terminar la prueba, para limpiar recursos',
            'Hace que la prueba se ejecute dos veces',
            'Hace la fixture más rápida',
            'Permite saltarse la prueba',
          ],
          answer: 0,
          explanation: 'Preparación antes del `yield` y limpieza después: cerrar conexiones, borrar archivos temporales…',
        },
        {
          type: 'pick',
          question: '¿Qué afirmaciones sobre las fixtures son **ciertas**?',
          options: [
            { text: 'Se inyectan por el nombre del parámetro de la prueba', correct: true },
            { text: 'Por defecto, cada prueba recibe una instancia nueva', correct: true },
            { text: 'Si están en conftest.py, las pueden usar todas las pruebas de la carpeta', correct: true },
            { text: 'Hay que llamarlas a mano dentro de la prueba: inventario()', correct: false },
          ],
          explanation: 'No se llaman: pytest las ejecuta y pasa el resultado. ¡Llamarlas directamente es un error!',
        },
      ],
    },

    // ─────────────── 6
    {
      id: 'u-mocks',
      icon: '🎭',
      title: 'Dobles de prueba: mocks y stubs',
      lesson: [
        {
          title: '¿Y si mi código cobra dinero de verdad?',
          text: 'Para probar `finalizar_compra` no podemos usar la pasarela de pagos real: cobraría dinero, sería lenta y no siempre estaría disponible. Usamos un **doble de prueba**:',
          table: {
            head: ['Doble', 'Qué hace'],
            rows: [
              ['**Dummy**', 'Se pasa para cumplir la firma, pero no se usa.'],
              ['**Stub**', 'Devuelve respuestas **preprogramadas**.'],
              ['**Spy**', 'Como un stub, pero además **registra** cómo se le llamó.'],
              ['**Mock**', 'Objeto con **expectativas**: se verifica cómo se usó (qué método, cuántas veces, con qué argumentos).'],
              ['**Fake**', 'Implementación real pero simplificada (por ejemplo, una base de datos en memoria).'],
            ],
          },
        },
        {
          title: 'unittest.mock',
          code: {
            lang: 'py',
            code: code`
              from unittest.mock import Mock

              pasarela = Mock()
              pasarela.cobrar.return_value = {"estado": "aprobado", "id": "P-1"}

              mensaje = finalizar_compra(50000, "4111", pasarela)

              assert mensaje == "Pedido confirmado: P-1"
              pasarela.cobrar.assert_called_once_with("4111", 50000)
            `,
          },
          points: ['`return_value` lo convierte en **stub** (respuesta preparada).', '`assert_called_once_with(...)` lo usa como **mock** (verifica la interacción).', '`assert_not_called()` comprueba que **no** se llamó.'],
          tip: 'También existen `unittest.mock.patch` y la fixture `monkeypatch` de pytest para reemplazar cosas temporalmente.',
        },
      ],
      challenges: [
        {
          type: 'classify',
          question: '¿Qué tipo de doble de prueba es?',
          bins: [
            { id: 'stub', label: 'Stub' },
            { id: 'mock', label: 'Mock' },
            { id: 'fake', label: 'Fake' },
            { id: 'dummy', label: 'Dummy' },
          ],
          items: [
            { text: 'Un objeto que siempre responde «aprobado» al cobrar', bin: 'stub' },
            { text: 'Verificamos que `enviar_correo` se llamó una vez con el correo del cliente', bin: 'mock' },
            { text: 'Un repositorio que guarda los pedidos en un diccionario en memoria', bin: 'fake' },
            { text: 'Un objeto `None` que se pasa como logger porque la función nunca lo usa', bin: 'dummy' },
          ],
          explanation: 'El stub controla **lo que entra** a tu código; el mock verifica **lo que sale** de él hacia sus dependencias.',
        },
        {
          type: 'py',
          question: 'Prueba el pago sin cobrar dinero real',
          instructions:
            'Prueba `finalizar_compra` (🔒 `pagos.py`) usando `Mock` en lugar de la pasarela real.\nComprueba: pago **aprobado** (mensaje y que se cobró **una vez** el monto correcto), pago **rechazado**, y que con el carrito **vacío** se lanza error **sin cobrar**.\nHay **4 bugs** sembrados.',
          files: {
            'test_pagos.py': py`
              import pytest
              from unittest.mock import Mock
              from pagos import finalizar_compra


              def test_pago_aprobado_confirma_el_pedido():
                  pasarela = Mock()
                  pasarela.cobrar.return_value = {"estado": "aprobado", "id": "P-1"}

                  mensaje = finalizar_compra(50000, "4111", pasarela)

                  assert mensaje == "Pedido confirmado: P-1"
            `,
            'pagos.py': PAGOS,
          },
          mutants: {
            doble: { label: 'Cobra dos veces al cliente', files: { 'pagos.py': PAGOS.replace('    respuesta = pasarela.cobrar(tarjeta, total)\n', '    pasarela.cobrar(tarjeta, total)\n    respuesta = pasarela.cobrar(tarjeta, total)\n') } },
            monto: { label: 'Cobra el monto multiplicado por 100', files: { 'pagos.py': PAGOS.replace('pasarela.cobrar(tarjeta, total)', 'pasarela.cobrar(tarjeta, total * 100)') } },
            rechazo: { label: 'Un pago rechazado también se confirma', files: { 'pagos.py': PAGOS.replace('if respuesta["estado"] == "aprobado":', 'if respuesta["estado"]:') } },
            vacio: { label: 'Cobra aunque el carrito esté vacío', files: { 'pagos.py': PAGOS.replace('    if total <= 0:\n        raise ValueError("El carrito está vacío")\n', '') } },
          },
          checks: [
            { text: 'Todas las pruebas pasan', allPass: true },
            { text: 'Usas `Mock` en lugar de la pasarela real', uses: 'Mock\\(' },
            { text: 'No usas la pasarela real', avoid: 'PasarelaPagos\\(' },
            { text: 'Atrapas el cobro doble', kills: 'doble' },
            { text: 'Atrapas el monto equivocado', kills: 'monto' },
            { text: 'Atrapas el rechazo que se confirma', kills: 'rechazo' },
            { text: 'Atrapas el cobro con el carrito vacío', kills: 'vacio' },
          ],
          solution: {
            'test_pagos.py': py`
              import pytest
              from unittest.mock import Mock
              from pagos import finalizar_compra


              def test_pago_aprobado_confirma_el_pedido():
                  pasarela = Mock()
                  pasarela.cobrar.return_value = {"estado": "aprobado", "id": "P-1"}

                  mensaje = finalizar_compra(50000, "4111", pasarela)

                  assert mensaje == "Pedido confirmado: P-1"
                  pasarela.cobrar.assert_called_once_with("4111", 50000)


              def test_pago_rechazado():
                  pasarela = Mock()
                  pasarela.cobrar.return_value = {"estado": "rechazado"}
                  assert finalizar_compra(50000, "4111", pasarela) == "Pago rechazado"


              def test_carrito_vacio_no_cobra():
                  pasarela = Mock()
                  with pytest.raises(ValueError):
                      finalizar_compra(0, "4111", pasarela)
                  pasarela.cobrar.assert_not_called()
            `,
          },
          hint: 'Agrega `pasarela.cobrar.assert_called_once_with("4111", 50000)` a la primera prueba, una prueba con `{"estado": "rechazado"}` y otra con total 0 que use `pytest.raises` y `assert_not_called()`.',
        },
        {
          type: 'quiz',
          question: '¿Por qué no usamos la pasarela de pagos **real** en una prueba unitaria?',
          options: [
            'Porque cobraría dinero, sería lenta e inestable y la prueba dejaría de estar aislada',
            'Porque pytest no permite conexiones de red',
            'Porque los mocks encuentran más defectos que el código real',
            'Porque la pasarela real nunca falla',
          ],
          answer: 0,
          explanation: 'La integración real se prueba aparte (pruebas de integración de sistemas), con entornos de prueba ("sandbox") del proveedor.',
        },
      ],
    },

    // ─────────────── 7
    {
      id: 'u-tdd',
      icon: '🔴',
      title: 'TDD: rojo, verde, refactor',
      lesson: [
        {
          title: 'Primero la prueba',
          text: 'En **TDD** (Test-Driven Development) el ciclo es corto y se repite muchas veces:',
          table: {
            head: ['Paso', 'Qué haces'],
            rows: [
              ['🔴 **Rojo**', 'Escribes una prueba pequeña que **falla** (porque el código aún no existe).'],
              ['🟢 **Verde**', 'Escribes el código **mínimo** para que pase.'],
              ['🔵 **Refactor**', 'Mejoras el código (y las pruebas) sin cambiar el comportamiento: las pruebas te protegen.'],
            ],
          },
          tip: 'TDD no es "escribir todas las pruebas primero": es avanzar **de a una** prueba.',
        },
        {
          title: 'Cobertura con pytest-cov',
          code: { lang: 'bash', code: 'pip install pytest-cov\npytest --cov=contrasenas --cov-report=term-missing' },
          points: ['Muestra el % de líneas ejecutadas y **cuáles faltan**.', 'Con TDD la cobertura suele salir alta "gratis": cada línea nació para hacer pasar una prueba.', 'Y para medir la **calidad** de las pruebas, existen herramientas de mutación como **mutmut**: ¡lo que has hecho con los bugs sembrados!'],
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'order',
          question: 'Ordena el ciclo de TDD.',
          steps: ['Escribir una prueba que falla', 'Ejecutarla y ver que está en rojo', 'Escribir el código mínimo para que pase', 'Ejecutar y ver todo en verde', 'Refactorizar con las pruebas como red de seguridad'],
          explanation: 'Ver la prueba en **rojo** primero es importante: demuestra que la prueba sí puede fallar.',
        },
        {
          type: 'py',
          kind: 'tdd',
          question: 'TDD: haz pasar las pruebas',
          instructions:
            'Ahora los papeles se invierten: las pruebas ya están escritas (🔒 `test_contrasenas.py`) y **tú** escribes el código en `contrasenas.py`.\nUna contraseña es **segura** si tiene al menos 8 caracteres, al menos un número, al menos una mayúscula y ningún espacio.\nVe prueba por prueba: ejecuta, mira la que falla, corrige.',
          files: {
            'contrasenas.py': py`
              def es_segura(clave):
                  # TDD: escribe el código mínimo para que cada prueba pase
                  return False
            `,
            'test_contrasenas.py': py`
              from contrasenas import es_segura


              def test_contrasena_segura():
                  assert es_segura("Pixel2026") is True


              def test_muy_corta():
                  assert es_segura("Px1") is False


              def test_sin_numeros():
                  assert es_segura("PixelShop") is False


              def test_sin_mayusculas():
                  assert es_segura("pixel2026") is False


              def test_con_espacios():
                  assert es_segura("Pixel 2026") is False


              def test_exactamente_ocho_caracteres():
                  assert es_segura("Pixel202") is True
            `,
          },
          editable: ['contrasenas.py'],
          target: 'contrasenas.py',
          checks: [
            { text: 'Las 6 pruebas pasan', allPass: true },
            { text: 'Cobertura del 100 % de `contrasenas.py`', cov: 100 },
            { text: 'No cambiaste las pruebas para "hacer trampa"', test: 'return h.test("test_exactamente_ocho_caracteres") && r.total === 6' },
          ],
          solution: {
            'contrasenas.py': py`
              def es_segura(clave):
                  if len(clave) < 8:
                      return False
                  if " " in clave:
                      return False
                  tiene_numero = any(c.isdigit() for c in clave)
                  tiene_mayuscula = any(c.isupper() for c in clave)
                  return tiene_numero and tiene_mayuscula
            `,
          },
          hint: 'Usa `len(clave) < 8`, `" " in clave`, `any(c.isdigit() for c in clave)` y `any(c.isupper() for c in clave)`.',
        },
        {
          type: 'quiz',
          question: 'En TDD, ¿por qué es importante ver la prueba **fallar** antes de escribir el código?',
          options: [
            'Para comprobar que la prueba realmente puede detectar la ausencia del comportamiento',
            'Porque pytest exige que la primera ejecución falle',
            'Para tener más pruebas en rojo en el informe',
            'No es importante: se puede saltar',
          ],
          answer: 0,
          explanation: 'Una prueba que pasa desde el principio quizá no prueba nada (como la que no tenía `assert`).',
        },
      ],
    },
  ],
};
