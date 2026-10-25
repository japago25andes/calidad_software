// ───────────────────────── MUNDO 3: DISEÑO DE CASOS DE PRUEBA ─────────────────────────
import { code } from '../helpers.js';

const ENVIO = code`
  def precio_envio(total, premium):
      costo = 12000
      if premium:
          costo = 0
      if total >= 150000:
          costo = 0
      return costo
`;

const ENVIO_CASOS = [
  { call: 'precio_envio(50000, False)', lines: [2, 3, 5, 7], branches: ['pF', 'tF'] },
  { call: 'precio_envio(200000, True)', lines: [2, 3, 4, 5, 6, 7], branches: ['pT', 'tT'] },
  { call: 'precio_envio(50000, True)', lines: [2, 3, 4, 5, 7], branches: ['pT', 'tF'] },
  { call: 'precio_envio(200000, False)', lines: [2, 3, 5, 6, 7], branches: ['pF', 'tT'] },
];

const ENVIO_RAMAS = [
  { id: 'pT', label: '`if premium` → verdadero' },
  { id: 'pF', label: '`if premium` → falso' },
  { id: 'tT', label: '`if total >= 150000` → verdadero' },
  { id: 'tF', label: '`if total >= 150000` → falso' },
];

const ESTADOS = ['Pagado', 'Enviado', 'Entregado', 'Cancelado', '—'];
const st = (answer) => ({ options: ESTADOS, answer });

export const DISENO = {
  id: 'diseno',
  short: 'Diseño',
  name: 'Diseño de casos de prueba',
  icon: '🎯',
  color: '#f59e0b',
  description: 'Técnicas para elegir pocas pruebas con mucho poder: particiones, valores límite, tablas de decisión, estados, cobertura y experiencia.',
  levels: [
    // ─────────────── 1
    {
      id: 'd-caso',
      icon: '🧾',
      title: 'Anatomía de un caso de prueba',
      lesson: [
        {
          title: 'Las partes de un caso de prueba',
          table: {
            head: ['Parte', 'Para qué sirve', 'Ejemplo'],
            rows: [
              ['**ID y título**', 'Identificarlo y saber qué prueba', 'CP-014 · Aplicar cupón válido'],
              ['**Precondiciones**', 'El estado necesario **antes** de empezar', 'Sesión iniciada; carrito con un Teclado mecánico ($250.000)'],
              ['**Datos de prueba**', 'Los valores concretos', 'Cupón: PIXEL10'],
              ['**Pasos**', 'Las acciones, en orden', '1. Ir al carrito · 2. Escribir el cupón · 3. Pulsar «Aplicar»'],
              ['**Resultado esperado**', 'Lo que **debe** pasar, verificable', 'Total: $225.000 y mensaje «Cupón aplicado: 10% de descuento»'],
              ['**Postcondiciones**', 'El estado en que queda el sistema', 'El cupón queda asociado al carrito'],
              ['**Trazabilidad**', 'Requisito o historia que cubre', 'HU-12 · Cupones de descuento'],
            ],
          },
        },
        {
          title: 'Un buen resultado esperado',
          points: [
            '❌ «Funciona bien» · «El total es correcto» → no se puede verificar.',
            '✅ «El total muestra **$225.000**» → cualquiera puede comprobarlo.',
            'El resultado esperado sale de la **base de prueba** (requisito), no de lo que hace el sistema hoy.',
          ],
          tip: 'Si el resultado esperado lo copias de la pantalla actual, ¡estás probando que el sistema hace lo que hace, no lo que debe! 🙃',
          mood: 'wow',
        },
        {
          title: 'Caso positivo y caso negativo',
          points: [
            '**Positivo** (camino feliz): datos válidos, el sistema hace lo esperado. *Cupón válido → descuento.*',
            '**Negativo**: datos inválidos o situaciones de error, el sistema debe **rechazar** de forma controlada. *Cupón vencido → mensaje de error, total sin cambios.*',
          ],
        },
      ],
      challenges: [
        {
          type: 'report',
          kind: 'case',
          title: 'CP-021 · Inicio de sesión con contraseña incorrecta',
          question: 'Completa el caso de prueba eligiendo la mejor opción en cada campo.',
          fields: [
            { label: 'Precondiciones', options: ['Existe la usuaria ana@pixelshop.test y no hay sesión iniciada', 'Hacer clic en «Entrar»', 'El sistema muestra un error'], answer: 0 },
            { label: 'Datos de prueba', options: ['Correo: ana@pixelshop.test · Contraseña: «abc123»', 'Una contraseña cualquiera', 'Los datos que el tester prefiera'], answer: 0 },
            { label: 'Pasos', options: ['1. Ir a «Iniciar sesión» 2. Escribir correo y contraseña 3. Pulsar «Entrar»', '1. Probar el login', '1. Verificar que funciona'], answer: 0 },
            {
              label: 'Resultado esperado',
              options: [
                'Se muestra «Correo o contraseña incorrectos» y no se inicia sesión',
                'El sistema funciona correctamente',
                'Aparece un mensaje',
                'Lo que muestre la pantalla en ese momento',
              ],
              answer: 0,
            },
            { label: 'Tipo de caso', options: ['Negativo', 'Positivo', 'De rendimiento'], answer: 0 },
          ],
          explanation: 'Un caso de prueba debe poder ejecutarlo **cualquier persona** con el mismo resultado: precondiciones claras, datos concretos y un resultado esperado **verificable**.',
        },
        {
          type: 'classify',
          question: '¿En qué parte del caso de prueba va cada elemento?',
          bins: [
            { id: 'pre', label: 'Precondición' },
            { id: 'paso', label: 'Paso' },
            { id: 'esp', label: 'Resultado esperado' },
          ],
          items: [
            { text: 'El carrito tiene 2 productos', bin: 'pre' },
            { text: 'Pulsar «Eliminar» en el Mouse inalámbrico', bin: 'paso' },
            { text: 'El carrito muestra 1 producto y el contador dice 1', bin: 'esp' },
            { text: 'La usuaria tiene la sesión iniciada', bin: 'pre' },
            { text: 'Escribir «PIXEL10» en el campo Cupón', bin: 'paso' },
            { text: 'Aparece el mensaje «Cupón no válido»', bin: 'esp' },
          ],
          explanation: 'Precondición: cómo está todo **antes**. Paso: lo que **haces**. Resultado esperado: lo que **debe ocurrir**.',
        },
        {
          type: 'quiz',
          question: '¿Cuál es el mejor **resultado esperado** para «agregar un Mouse inalámbrico ($80.000) al carrito vacío»?',
          options: [
            'El contador del carrito muestra 1 y el carrito lista «Mouse inalámbrico» con subtotal $80.000',
            'El producto se agrega bien',
            'No hay errores',
            'El sistema responde',
          ],
          answer: 0,
          explanation: 'Concreto, observable y comparable. Los demás son opiniones, no resultados verificables.',
        },
        {
          type: 'classify',
          question: '¿Caso positivo o negativo?',
          bins: [
            { id: 'pos', label: '😀 Positivo' },
            { id: 'neg', label: '🚫 Negativo' },
          ],
          items: [
            { text: 'Comprar con una tarjeta válida', bin: 'pos' },
            { text: 'Registrarse con un correo sin @', bin: 'neg' },
            { text: 'Agregar 3 unidades de un producto con stock', bin: 'pos' },
            { text: 'Intentar comprar un producto agotado', bin: 'neg' },
            { text: 'Aplicar un cupón vencido', bin: 'neg' },
          ],
          explanation: 'Los casos negativos comprueban que el sistema **se defiende** bien de entradas inválidas. ¡Muchos bugs viven ahí!',
        },
      ],
    },

    // ─────────────── 2
    {
      id: 'd-particiones',
      icon: '🧱',
      title: 'Partición de equivalencia',
      lesson: [
        {
          title: 'Si uno funciona, todos funcionan',
          text: 'La **partición de equivalencia** divide los datos en grupos (particiones) que el sistema debería tratar **igual**. Basta probar **un valor de cada partición**.',
          points: [
            'Regla: «La edad para registrarse es de **18 a 99** años».',
            'Partición inválida: **menos de 18** (ej. 10).',
            'Partición válida: **de 18 a 99** (ej. 40).',
            'Partición inválida: **más de 99** (ej. 120).',
            'Y si el campo admite texto: partición inválida **no numérica** (ej. «abc»).',
          ],
          tip: 'Si con 40 funciona, asumimos que con 41 o 57 también. Si no fuera así, ¡las particiones estaban mal definidas!',
        },
        {
          title: 'Cobertura de particiones',
          points: [
            'Cobertura = particiones probadas ÷ particiones identificadas.',
            'Para el 100 % basta **un caso por partición**.',
            'Las particiones **inválidas** se prueban **una a la vez**: si un caso mezcla dos valores inválidos, un error puede tapar al otro.',
          ],
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'classify',
          question: 'Regla: «La **cantidad** de un producto en el carrito es un entero de **1 a 10**». ¿A qué partición pertenece cada valor?',
          bins: [
            { id: 'baja', label: '❌ Inválida: menor que 1' },
            { id: 'ok', label: '✅ Válida: 1 a 10' },
            { id: 'alta', label: '❌ Inválida: mayor que 10' },
            { id: 'nonum', label: '❌ Inválida: no es un entero' },
          ],
          items: [
            { text: '`0`', bin: 'baja' },
            { text: '`5`', bin: 'ok' },
            { text: '`10`', bin: 'ok' },
            { text: '`11`', bin: 'alta' },
            { text: '`-3`', bin: 'baja' },
            { text: '`dos`', bin: 'nonum' },
            { text: '`2.5`', bin: 'nonum' },
            { text: '`1`', bin: 'ok' },
          ],
          explanation: 'Cuatro particiones: con **4 casos** (uno por partición) se logra el 100 % de cobertura de particiones.',
        },
        {
          type: 'quiz',
          question: 'Descuento por volumen: **1–9** unidades sin descuento, **10–49** con 5 %, **50 o más** con 10 %. Las cantidades ≤ 0 son inválidas. ¿Cuántos casos como **mínimo** cubren todas las particiones?',
          options: ['4', '3', '2', '6'],
          answer: 0,
          explanation: 'Particiones: inválida (≤ 0), 1–9, 10–49 y ≥ 50. Un valor de cada una → **4 casos**.',
        },
        {
          type: 'pick',
          question: 'Regla: «El nombre de usuario tiene entre 3 y 15 caracteres, solo letras y números». ¿Qué valores pertenecen a una partición **válida**?',
          options: [
            { text: '`ana25`', correct: true },
            { text: '`Bichi`', correct: true },
            { text: '`yo`', correct: false },
            { text: '`ana_25`', correct: false },
            { text: '`nombreextremadamentelargo`', correct: false },
          ],
          explanation: '`yo` es muy corto, `ana_25` tiene un carácter no permitido y el último supera los 15 caracteres.',
        },
        {
          type: 'quiz',
          question: '¿Por qué conviene probar las particiones inválidas **una por una** y no en el mismo caso?',
          options: [
            'Porque un error puede enmascarar al otro y no sabríamos si ambos se validan',
            'Porque así hay menos casos',
            'Porque las particiones inválidas no importan',
            'Porque el sistema no acepta dos errores a la vez',
          ],
          answer: 0,
          explanation: 'Si envías edad inválida **y** correo inválido, quizá el sistema solo valida la edad: el defecto de la validación del correo quedaría oculto.',
        },
      ],
    },

    // ─────────────── 3
    {
      id: 'd-limites',
      icon: '📏',
      title: 'Análisis de valores límite',
      lesson: [
        {
          title: 'Los bugs viven en las fronteras',
          text: 'Muchos defectos aparecen justo en los **límites** de las particiones: un `>` en vez de `>=`, un `<` en vez de `<=`… El **análisis de valores límite** (AVL) prueba esos bordes.',
          points: [
            'Regla: cantidad válida de **1 a 10**.',
            'Valores límite: **1** y **10** (bordes de la partición válida).',
            'Y sus vecinos en las particiones inválidas: **0** y **11**.',
          ],
        },
        {
          title: 'AVL de 2 valores y de 3 valores',
          table: {
            head: ['Variante', 'Por cada límite se prueba…', 'Ejemplo (límite 10)'],
            rows: [
              ['**2 valores**', 'El límite y su vecino de la otra partición', '10 y 11'],
              ['**3 valores**', 'El límite y **sus dos** vecinos', '9, 10 y 11'],
            ],
          },
          tip: 'La de 3 valores es más rigurosa: detecta, por ejemplo, un `==` escrito en lugar de un `<=`.',
          mood: 'wow',
        },
      ],
      challenges: [
        {
          type: 'boundary',
          question: 'Elige los valores para un **AVL de 2 valores**.',
          rule: 'La cantidad de un producto en el carrito es un **entero de 1 a 10**.',
          min: -2,
          max: 14,
          partitions: [
            { from: -2, to: 0.5, label: 'inválida', valid: false },
            { from: 0.5, to: 10.5, label: 'válida: 1 a 10', valid: true },
            { from: 10.5, to: 14, label: 'inválida', valid: false },
          ],
          answer: [0, 1, 10, 11],
          explanation: 'Límites 1 y 10 más sus vecinos inválidos 0 y 11. Con estos 4 valores atrapas casi todos los errores de `<` / `<=`.',
        },
        {
          type: 'boundary',
          question: 'Ahora un **AVL de 3 valores**.',
          rule: 'La contraseña debe tener **entre 8 y 20 caracteres**. Elige las longitudes a probar.',
          min: 4,
          max: 24,
          unit: ' car.',
          partitions: [
            { from: 4, to: 7.5, label: 'corta', valid: false },
            { from: 7.5, to: 20.5, label: 'válida: 8 a 20', valid: true },
            { from: 20.5, to: 24, label: 'larga', valid: false },
          ],
          answer: [7, 8, 9, 19, 20, 21],
          explanation: 'Para el límite 8: 7, 8 y 9. Para el límite 20: 19, 20 y 21. Seis valores en total.',
        },
        {
          type: 'boundary',
          question: 'Tres particiones válidas, ¡más límites! Usa **AVL de 2 valores**.',
          rule: 'Peso del paquete en kilos enteros: **1 a 20** → envío normal · **21 a 30** → envío pesado · **31 o más** → no se acepta · **0 o menos** → inválido.',
          min: -2,
          max: 34,
          unit: ' kg',
          partitions: [
            { from: -2, to: 0.5, label: 'inválido', valid: false },
            { from: 0.5, to: 20.5, label: 'normal', valid: true },
            { from: 20.5, to: 30.5, label: 'pesado', valid: true },
            { from: 30.5, to: 34, label: 'rechazado', valid: false },
          ],
          answer: [0, 1, 20, 21, 30, 31],
          explanation: 'Cada frontera entre particiones aporta dos valores: 0|1, 20|21 y 30|31.',
        },
        {
          type: 'bughunt',
          question: 'Con AVL encontraste un fallo: una contraseña de **exactamente 20 caracteres** se rechaza. ¿Qué línea tiene el defecto?',
          code: code`
            def contrasena_valida(clave):
                if len(clave) < 8:
                    return False
                if len(clave) >= 20:
                    return False
                return True
          `,
          bugs: [4],
          explanation: 'Debería ser `> 20` (o `len(clave) <= 20` como condición válida). Solo un valor **en el límite** (20) revela este defecto.',
        },
      ],
    },

    // ─────────────── 4
    {
      id: 'd-decision',
      icon: '🧮',
      title: 'Tablas de decisión',
      lesson: [
        {
          title: 'Cuando las reglas se combinan',
          text: 'Si el resultado depende de **combinaciones de condiciones**, una **tabla de decisión** asegura que no se olvide ninguna combinación.',
          table: {
            head: ['', 'R1', 'R2', 'R3', 'R4'],
            rows: [
              ['Cliente premium', 'V', 'V', 'F', 'F'],
              ['Compra ≥ $150.000', 'V', 'F', 'V', 'F'],
              ['→ **Envío gratis**', '✓', '✓', '✓', '–'],
            ],
          },
          points: ['Arriba van las **condiciones**; abajo, las **acciones**.', 'Cada columna es una **regla** = un caso de prueba.', 'Con *n* condiciones booleanas hay **2ⁿ** reglas.'],
        },
        {
          title: 'Tablas minimizadas',
          text: 'Si para una condición el resultado no cambia, las reglas se pueden **fusionar** con un guion (—, "no importa"):',
          table: {
            head: ['', 'R1', 'R2', 'R3'],
            rows: [
              ['Cliente premium', 'V', 'F', 'F'],
              ['Compra ≥ $150.000', '—', 'V', 'F'],
              ['→ Envío gratis', '✓', '✓', '–'],
            ],
          },
          tip: 'Ojo: también sirve para descubrir **reglas imposibles** o **requisitos incompletos** (combinaciones que nadie definió).',
        },
      ],
      challenges: [
        {
          type: 'grid',
          question: 'Regla: «**Envío gratis** si el cliente es premium **o** compra $150.000 o más. Los clientes premium que compran $150.000 o más reciben además un **regalo**». Completa las acciones.',
          head: ['', 'R1', 'R2', 'R3', 'R4'],
          rows: [
            ['Cliente premium', 'V', 'V', 'F', 'F'],
            ['Compra ≥ $150.000', 'V', 'F', 'V', 'F'],
            ['→ Envío gratis', { options: ['✓', '–'], answer: '✓' }, { options: ['✓', '–'], answer: '✓' }, { options: ['✓', '–'], answer: '✓' }, { options: ['✓', '–'], answer: '–' }],
            ['→ Regalo', { options: ['✓', '–'], answer: '✓' }, { options: ['✓', '–'], answer: '–' }, { options: ['✓', '–'], answer: '–' }, { options: ['✓', '–'], answer: '–' }],
          ],
          explanation: 'Envío gratis en todas menos R4 (ni premium ni compra grande). El regalo solo en R1 (premium **y** compra grande).',
        },
        {
          type: 'quiz',
          question: 'Un formulario tiene **3 condiciones** booleanas que afectan el resultado. ¿Cuántas reglas tiene la tabla de decisión completa?',
          options: ['8', '6', '3', '9'],
          answer: 0,
          explanation: '2³ = **8** combinaciones. Con 4 condiciones serían 16: por eso a veces se minimiza la tabla.',
        },
        {
          type: 'grid',
          question: 'Reglas del login: «Se entra si el correo existe **y** la contraseña es correcta. Si el correo existe pero la contraseña es incorrecta, se suma un intento fallido». Completa.',
          head: ['', 'R1', 'R2', 'R3', 'R4'],
          rows: [
            ['Correo existe', 'V', 'V', 'F', 'F'],
            ['Contraseña correcta', 'V', 'F', 'V', 'F'],
            ['→ Inicia sesión', { options: ['✓', '–'], answer: '✓' }, { options: ['✓', '–'], answer: '–' }, { options: ['✓', '–'], answer: '–' }, { options: ['✓', '–'], answer: '–' }],
            ['→ Suma intento fallido', { options: ['✓', '–'], answer: '–' }, { options: ['✓', '–'], answer: '✓' }, { options: ['✓', '–'], answer: '–' }, { options: ['✓', '–'], answer: '–' }],
          ],
          explanation: 'R3 es curiosa: si el correo no existe, ¿cómo puede la contraseña ser "correcta"? Es una regla **imposible**: la tabla te ayuda a detectarla y a preguntarle al negocio.',
        },
        {
          type: 'quiz',
          question: '¿Qué significa un guion (—) en una condición de una tabla de decisión minimizada?',
          options: [
            'Que el valor de esa condición no afecta al resultado de esa regla',
            'Que la condición es falsa',
            'Que la regla es imposible',
            'Que hay un defecto',
          ],
          answer: 0,
          explanation: '«No importa»: la regla se cumple tanto si la condición es verdadera como si es falsa.',
        },
      ],
    },

    // ─────────────── 5
    {
      id: 'd-estados',
      icon: '🚦',
      title: 'Transición de estados',
      lesson: [
        {
          title: 'Sistemas con memoria',
          text: 'Algunos sistemas responden distinto según su **estado**. Un pedido de PixelShop pasa por varios estados:',
          table: {
            head: ['Estado actual', 'Evento', 'Estado siguiente'],
            rows: [
              ['Pendiente de pago', 'pagar', 'Pagado'],
              ['Pendiente de pago', 'cancelar', 'Cancelado'],
              ['Pagado', 'enviar', 'Enviado'],
              ['Pagado', 'cancelar', 'Cancelado'],
              ['Enviado', 'entregar', 'Entregado'],
            ],
          },
          tip: 'Cualquier otra combinación (por ejemplo, **cancelar** un pedido ya **Enviado**) es una **transición inválida**: el sistema debe rechazarla.',
        },
        {
          title: 'Diagrama y cobertura',
          code: {
            lang: 'text',
            code: code`
              [Pendiente] --pagar--> [Pagado] --enviar--> [Enviado] --entregar--> [Entregado]
                   |                    |
                   +-----cancelar-------+--cancelar--> [Cancelado]
            `,
          },
          points: [
            '**Cobertura de estados**: visitar todos los estados.',
            '**Cobertura de transiciones válidas** (0-switch): ejecutar cada transición válida al menos una vez.',
            '**Cobertura de todas las transiciones**: también intentar las **inválidas** y comprobar que se rechazan.',
          ],
        },
      ],
      challenges: [
        {
          type: 'grid',
          question: 'Completa la **tabla de estados** del pedido. Pon «—» si la transición es inválida.',
          head: ['Estado \\ Evento', 'pagar', 'enviar', 'cancelar', 'entregar'],
          rows: [
            ['Pendiente de pago', st('Pagado'), st('—'), st('Cancelado'), st('—')],
            ['Pagado', st('—'), st('Enviado'), st('Cancelado'), st('—')],
            ['Enviado', st('—'), st('—'), st('—'), st('Entregado')],
          ],
          explanation: 'Las celdas «—» son las **transiciones inválidas**: también hay que probar que el sistema las rechaza (por ejemplo, no se puede cancelar un pedido ya enviado).',
        },
        {
          type: 'quiz',
          question: '¿Cuántas **transiciones válidas** tiene el modelo del pedido?',
          options: ['5', '4', '6', '12'],
          answer: 0,
          explanation: 'pagar, cancelar (desde Pendiente), enviar, cancelar (desde Pagado) y entregar: **5**.',
        },
        {
          type: 'quiz',
          question: 'Todo caso empieza en «Pendiente de pago». ¿Cuántos casos como **mínimo** cubren las 5 transiciones válidas?',
          options: ['3', '1', '2', '5'],
          answer: 0,
          explanation: '① pagar → enviar → entregar · ② cancelar · ③ pagar → cancelar. Como Entregado y Cancelado son estados **finales**, no se puede hacer en menos.',
        },
        {
          type: 'pick',
          question: '¿Cuáles son **transiciones inválidas** que conviene probar?',
          options: [
            { text: 'Cancelar un pedido Enviado', correct: true },
            { text: 'Pagar dos veces el mismo pedido', correct: true },
            { text: 'Enviar un pedido que aún no se pagó', correct: true },
            { text: 'Pagar un pedido Pendiente de pago', correct: false },
            { text: 'Entregar un pedido Enviado', correct: false },
          ],
          explanation: '¡Pagar dos veces es un clásico! Los casos inválidos suelen esconder defectos graves (cobros dobles, envíos sin pago…).',
        },
      ],
    },

    // ─────────────── 6
    {
      id: 'd-cajablanca',
      icon: '🔬',
      title: 'Caja blanca: sentencias y ramas',
      lesson: [
        {
          title: 'Mirar dentro del código',
          text: 'Las técnicas de **caja blanca** usan la estructura del código para medir qué tan probado está.',
          table: {
            head: ['Cobertura', 'Mide…', 'Fórmula'],
            rows: [
              ['**Sentencias**', 'Qué sentencias se ejecutaron', 'sentencias ejecutadas ÷ sentencias totales'],
              ['**Ramas** (decisiones)', 'Qué salidas de cada decisión se tomaron (verdadero y falso)', 'ramas ejecutadas ÷ ramas totales'],
            ],
          },
          tip: '100 % de ramas implica 100 % de sentencias, pero **no al revés**.',
        },
        {
          title: 'El caso típico',
          code: { lang: 'py', code: ENVIO },
          points: [
            'Con `precio_envio(200000, True)` se ejecutan **todas las sentencias** (100 % de sentencias)…',
            '…pero solo se toma la rama **verdadera** de cada `if`. ¿Y si `premium` es falso? ¡Nunca se probó!',
            'Para 100 % de ramas hace falta al menos otro caso que tome las ramas **falsas**.',
          ],
        },
        {
          title: 'Complejidad ciclomática',
          text: 'La **complejidad ciclomática** de McCabe cuenta los caminos independientes: **número de decisiones + 1**.',
          points: ['`precio_envio` tiene 2 decisiones → complejidad **3**.', 'Indica el número mínimo de casos para cubrir los caminos básicos y avisa de funciones demasiado complejas.'],
          tip: 'Recuerda: 100 % de cobertura no significa 0 defectos. Mide lo que **ejecutaste**, no lo que **comprobaste**.',
          mood: 'wow',
        },
      ],
      challenges: [
        {
          type: 'coverage',
          question: 'Consigue **100 % de cobertura de sentencias** con **un solo** caso de prueba.',
          code: ENVIO,
          statements: [2, 3, 4, 5, 6, 7],
          branches: ENVIO_RAMAS,
          candidates: ENVIO_CASOS,
          goal: 'statement',
          max: 1,
          solution: [1],
          explanation: '`precio_envio(200000, True)` entra en los dos `if` y ejecuta todas las líneas. Fíjate en el medidor de ramas: ¡solo 50 %!',
        },
        {
          type: 'coverage',
          question: 'Ahora consigue **100 % de cobertura de ramas** con **2** casos como máximo.',
          code: ENVIO,
          statements: [2, 3, 4, 5, 6, 7],
          branches: ENVIO_RAMAS,
          candidates: ENVIO_CASOS,
          goal: 'branch',
          max: 2,
          solution: [0, 1],
          explanation: 'Un caso con ambas condiciones verdaderas y otro con ambas falsas cubren las 4 ramas. (Las combinaciones cruzadas también sirven.)',
        },
        {
          type: 'coverage',
          question: 'Esta función tiene más decisiones. Logra **100 % de ramas** con **4** casos como máximo.',
          code: code`
            def categoria(edad):
                if edad < 0:
                    raise ValueError("edad inválida")
                if edad < 13:
                    return "niño"
                elif edad < 18:
                    return "adolescente"
                return "adulto"
          `,
          statements: [2, 3, 4, 5, 6, 7, 8],
          branches: [
            { id: 'nT', label: '`edad < 0` → verdadero' },
            { id: 'nF', label: '`edad < 0` → falso' },
            { id: 'cT', label: '`edad < 13` → verdadero' },
            { id: 'cF', label: '`edad < 13` → falso' },
            { id: 'aT', label: '`edad < 18` → verdadero' },
            { id: 'aF', label: '`edad < 18` → falso' },
          ],
          candidates: [
            { call: 'categoria(-1)', lines: [2, 3], branches: ['nT'] },
            { call: 'categoria(8)', lines: [2, 4, 5], branches: ['nF', 'cT'] },
            { call: 'categoria(15)', lines: [2, 4, 6, 7], branches: ['nF', 'cF', 'aT'] },
            { call: 'categoria(30)', lines: [2, 4, 6, 8], branches: ['nF', 'cF', 'aF'] },
            { call: 'categoria(13)', lines: [2, 4, 6, 7], branches: ['nF', 'cF', 'aT'] },
          ],
          goal: 'branch',
          max: 4,
          solution: [0, 1, 2, 3],
          explanation: 'Cada `return` (y el `raise`) necesita su propio caso: −1, 8, 15 y 30. `categoria(13)` no agrega nada nuevo frente a 15… ¡aunque es un buen **valor límite**!',
        },
        {
          type: 'quiz',
          question: '¿Cuál es la **complejidad ciclomática** de `categoria`?',
          snippet: { lang: 'py', code: 'if edad < 0: ...\nif edad < 13: ...\nelif edad < 18: ...' },
          options: ['4', '3', '2', '6'],
          answer: 0,
          explanation: 'Tres decisiones (`if`, `if`, `elif`) + 1 = **4**. Coincide con los 4 casos que necesitaste para cubrir sus ramas.',
        },
        {
          type: 'quiz',
          question: 'Una función tiene **100 % de cobertura de sentencias**. ¿Qué puedes afirmar?',
          options: [
            'Que cada sentencia se ejecutó al menos una vez, pero puede haber ramas sin probar y defectos',
            'Que no tiene defectos',
            'Que tiene 100 % de cobertura de ramas',
            'Que todas sus pruebas tienen buenas aserciones',
          ],
          answer: 0,
          explanation: 'La cobertura mide lo **ejecutado**. Una prueba sin `assert` también "cubre" líneas… ¡sin comprobar nada!',
        },
      ],
    },

    // ─────────────── 7
    {
      id: 'd-experiencia',
      icon: '🧠',
      title: 'Experiencia y colaboración',
      lesson: [
        {
          title: 'Técnicas basadas en la experiencia',
          table: {
            head: ['Técnica', 'Idea'],
            rows: [
              ['**Predicción de errores** (error guessing)', 'Anticipar errores típicos según la experiencia: campos vacíos, textos enormes, caracteres especiales, doble clic…'],
              ['**Pruebas exploratorias**', 'Diseñar, ejecutar y aprender **a la vez**, guiados por un **charter** (misión) y en sesiones con tiempo limitado.'],
              ['**Basadas en listas de comprobación**', 'Seguir una checklist de aspectos a verificar (por ejemplo, de accesibilidad o de formularios).'],
            ],
          },
        },
        {
          title: 'Un charter exploratorio',
          code: {
            lang: 'text',
            code: code`
              Explorar: el formulario de pago
              Con: datos inválidos, caracteres especiales y navegación con el botón Atrás
              Para descubrir: cobros dobles o pedidos inconsistentes
              Duración: 60 minutos
            `,
          },
          tip: 'Explorar no es "probar al azar": tiene una misión, se toman notas y al final se reportan hallazgos.',
        },
        {
          title: 'Enfoques colaborativos',
          points: [
            'Las **historias de usuario** siguen las "3C": **C**ard (tarjeta), **C**onversation (conversación) y **C**onfirmation (criterios de aceptación).',
            'Los **criterios de aceptación** se escriben con ejemplos, a menudo en formato **Dado / Cuando / Entonces**.',
            'En **ATDD**, esos criterios se convierten en pruebas **antes** de programar.',
          ],
          code: {
            lang: 'gherkin',
            code: code`
              Escenario: cupón vencido
                Dado un carrito con un total de $100.000
                Y el cupón "VERANO" venció ayer
                Cuando aplico el cupón "VERANO"
                Entonces veo el mensaje "Cupón no válido"
                Y el total sigue siendo $100.000
            `,
          },
        },
      ],
      challenges: [
        {
          type: 'pick',
          question: '**Predicción de errores**: ¿qué intentarías en el formulario de pago de PixelShop?',
          options: [
            { text: 'Pulsar «Confirmar compra» dos veces muy rápido', correct: true },
            { text: 'Dejar la dirección vacía', correct: true },
            { text: 'Escribir 500 caracteres en el nombre', correct: true },
            { text: 'Volver con el botón Atrás después de pagar', correct: true },
            { text: 'Comprar exactamente como lo haría un cliente normal y nada más', correct: false },
          ],
          explanation: 'El doble clic puede producir **cobros dobles**; el botón Atrás, pedidos duplicados. La experiencia dice dónde suelen esconderse los bugs.',
        },
        {
          type: 'classify',
          question: '¿Qué técnica basada en la experiencia es?',
          bins: [
            { id: 'pred', label: '🔮 Predicción de errores' },
            { id: 'expl', label: '🧭 Exploratoria' },
            { id: 'check', label: '✅ Lista de comprobación' },
          ],
          items: [
            { text: 'Sesión de 45 minutos con la misión de explorar el buscador', bin: 'expl' },
            { text: 'Verificar uno por uno los 20 puntos de la checklist de formularios', bin: 'check' },
            { text: 'Probar emojis en el nombre porque en otro proyecto rompieron la base de datos', bin: 'pred' },
            { text: 'Aprender cómo funciona el cupón mientras se prueba y anotar ideas nuevas', bin: 'expl' },
          ],
          explanation: 'Las tres complementan a las técnicas formales: encuentran lo que **nadie especificó**.',
        },
        {
          type: 'fill',
          question: 'Completa los criterios de aceptación de «agregar al carrito».',
          lang: 'gherkin',
          code: 'Escenario: agregar un producto con stock\n  ___ que estoy en el catálogo\n  ___ pulso «Agregar al carrito» en el Mouse inalámbrico\n  ___ el contador del carrito muestra 1\n  ___ veo el aviso «Agregado: Mouse inalámbrico»',
          blanks: [['Dado'], ['Cuando'], ['Entonces'], ['Y']],
          bank: ['Dado', 'Cuando', 'Entonces', 'Y', 'Si', 'Pero no'],
          explanation: '**Y** encadena varios pasos del mismo tipo. Cada «Entonces» debe ser **verificable**.',
        },
        {
          type: 'quiz',
          question: '¿Qué hace que una sesión exploratoria sea **profesional** y no "probar al azar"?',
          options: [
            'Tener un charter (misión), un tiempo limitado, notas y un informe de hallazgos',
            'Hacerla sin ningún objetivo para no sesgarse',
            'Que la haga siempre la persona más nueva del equipo',
            'Ejecutar casos de prueba escritos con anterioridad',
          ],
          answer: 0,
          explanation: 'Charter + sesión con tiempo limitado + notas = exploración gestionable (session-based test management).',
        },
      ],
    },
  ],
};
