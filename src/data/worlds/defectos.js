// ───────────────────────── MUNDO 4: GESTIÓN DE DEFECTOS ─────────────────────────
import { code, shop } from '../helpers.js';

const SEV = ['Crítica', 'Alta', 'Media', 'Baja'];
const PRIO = ['Alta', 'Media', 'Baja'];
const NIVEL = ['Alto', 'Medio', 'Bajo'];
const sev = (answer) => ({ options: SEV, answer });
const prio = (answer) => ({ options: PRIO, answer });
const nivel = (answer) => ({ options: NIVEL, answer });
const x = (answer) => ({ options: ['✓', '–'], answer });

export const DEFECTOS = {
  id: 'defectos',
  short: 'Defectos',
  name: 'Gestión de defectos y de las pruebas',
  icon: '🐛',
  color: '#f43f5e',
  description: 'Reportar defectos como un profesional, severidad y prioridad, ciclo de vida, riesgos, plan de pruebas y métricas.',
  levels: [
    // ─────────────── 1
    {
      id: 'g-reporte',
      icon: '📝',
      title: 'El reporte de defecto perfecto',
      lesson: [
        {
          title: 'Un buen reporte ahorra horas',
          text: 'Un reporte de defecto (incidencia) debe permitir que **otra persona reproduzca** el fallo sin preguntarte nada. Según ISO/IEC/IEEE 29119-3 suele incluir:',
          table: {
            head: ['Campo', 'Ejemplo'],
            rows: [
              ['**ID** y **título** claro', 'DEF-208 · El cupón PIXEL10 descuenta 20 % en lugar de 10 %'],
              ['**Fecha, autor y versión**', '21/10/2026 · Laura · PixelShop 2.3.1'],
              ['**Entorno**', 'Chrome 130 · Windows 11 · servidor de pruebas'],
              ['**Pasos para reproducir**', '1. Agregar un Teclado mecánico · 2. Ir al carrito · 3. Aplicar PIXEL10'],
              ['**Resultado esperado**', 'Total: $225.000'],
              ['**Resultado obtenido**', 'Total: $200.000'],
              ['**Severidad y prioridad**', 'Alta · Alta'],
              ['**Evidencias**', 'Captura de pantalla, registros (logs), video'],
              ['**Estado**', 'Nuevo'],
            ],
          },
        },
        {
          title: 'Malos hábitos',
          points: [
            '❌ Títulos vagos: «No funciona», «Error en el carrito».',
            '❌ Mezclar **varios defectos** en un mismo reporte.',
            '❌ Opiniones o tono acusador: «El que programó esto no sabe sumar».',
            '❌ Omitir el **resultado esperado**: ¿cómo sabe el dev qué es lo correcto?',
          ],
          tip: 'Un reporte es comunicación profesional: **hechos**, no culpables. Criticamos el producto, no a las personas. 🤝',
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'report',
          question: 'Encontraste este fallo en PixelShop. Completa el **reporte de defecto**.',
          screen: shop(`
            <h3>Tu carrito</h3>
            <table><tr><th>Producto</th><th>Cantidad</th><th>Subtotal</th></tr>
            <tr><td>Teclado mecánico</td><td>1</td><td>$250.000</td></tr></table>
            <p class="m-ok">Cupón aplicado: 10% de descuento</p>
            <p style="font-size:18px;font-weight:800">Total: $200.000</p>
          `),
          fields: [
            {
              label: 'Título',
              options: ['El cupón PIXEL10 descuenta 20 % en lugar de 10 % en el carrito', 'El carrito no funciona', 'Error grave en PixelShop', 'Bug en cupones (urgente!!!)'],
              answer: 0,
            },
            {
              label: 'Pasos para reproducir',
              options: [
                '1. Agregar un Teclado mecánico ($250.000) · 2. Ir al carrito · 3. Escribir PIXEL10 y pulsar «Aplicar»',
                'Usar el cupón',
                'Probar el carrito varias veces hasta que falle',
              ],
              answer: 0,
            },
            { label: 'Resultado esperado', options: ['Total: $225.000 (10 % de descuento)', 'Que funcione bien', 'Total: $200.000'], answer: 0 },
            { label: 'Resultado obtenido', options: ['Total: $200.000', 'Total: $225.000', 'El cupón no se aplica'], answer: 0 },
            { label: 'Evidencia', options: ['Captura de la pantalla del carrito con el total', 'Ninguna, no hace falta', 'El nombre del desarrollador responsable'], answer: 0 },
          ],
          explanation: 'Título específico, pasos reproducibles, esperado vs. obtenido y evidencia. Con esto el desarrollador puede ir directo al problema.',
        },
        {
          type: 'pick',
          question: '¿Qué **títulos** de defecto son buenos?',
          options: [
            { text: 'La búsqueda de «TECLADO» no devuelve resultados (distingue mayúsculas)', correct: true },
            { text: 'El contador del carrito no se actualiza al agregar productos', correct: true },
            { text: 'Nada funciona en el checkout', correct: false },
            { text: 'Otra vez el error de siempre', correct: false },
            { text: 'Botón «Confirmar compra» habilitado sin aceptar términos', correct: true },
          ],
          explanation: 'Un buen título dice **dónde** y **qué** pasa. Debería entenderse sin abrir el reporte.',
        },
        {
          type: 'quiz',
          question: 'Encontraste 3 problemas distintos en la página de pago. ¿Qué haces?',
          options: [
            'Creo 3 reportes, uno por defecto',
            'Creo un único reporte con los 3 problemas para ahorrar tiempo',
            'Reporto solo el más grave',
            'Se lo comento al desarrollador en el pasillo',
          ],
          answer: 0,
          explanation: 'Cada defecto tiene su propio ciclo de vida: puede corregirse, rechazarse o diferirse de forma independiente.',
        },
        {
          type: 'quiz',
          question: '¿Por qué es importante indicar el **entorno** (navegador, sistema operativo, versión)?',
          options: [
            'Porque muchos fallos solo ocurren en ciertos entornos y sin ese dato no se pueden reproducir',
            'Por formalidad: nadie lo lee',
            'Para culpar al navegador',
            'Porque así el reporte es más largo',
          ],
          answer: 0,
          explanation: 'Un fallo que solo ocurre en Safari o en la versión 2.3.1 es imposible de reproducir si no sabes dónde mirar.',
        },
      ],
    },

    // ─────────────── 2
    {
      id: 'g-severidad',
      icon: '🌡️',
      title: 'Severidad vs. prioridad',
      lesson: [
        {
          title: 'Dos preguntas distintas',
          table: {
            head: ['', 'Severidad', 'Prioridad'],
            rows: [
              ['Mide…', 'El **impacto** del defecto en el sistema', 'La **urgencia** de corregirlo'],
              ['La decide…', 'Normalmente el tester (criterio técnico)', 'Normalmente el negocio / product owner'],
              ['Pregunta', '¿Cuánto daño hace?', '¿Cuándo hay que arreglarlo?'],
            ],
          },
        },
        {
          title: 'No siempre van juntas',
          table: {
            head: ['Caso', 'Severidad', 'Prioridad'],
            rows: [
              ['No se puede pagar con ninguna tarjeta', 'Crítica', 'Alta'],
              ['El logo de la empresa aparece mal escrito en la portada', 'Baja', 'Alta'],
              ['El sistema se cae al exportar un reporte de 2015 que nadie usa', 'Alta', 'Baja'],
              ['Un error de ortografía en la página de términos', 'Baja', 'Baja'],
            ],
          },
          tip: 'Un logo mal escrito no rompe nada (severidad baja)… pero es lo primero que ven los clientes (prioridad alta). 😅',
          mood: 'wow',
        },
      ],
      challenges: [
        {
          type: 'grid',
          question: 'Asigna **severidad** y **prioridad** a cada defecto de PixelShop.',
          head: ['Defecto', 'Severidad', 'Prioridad'],
          rows: [
            ['El botón «Confirmar compra» no hace nada: nadie puede comprar', sev('Crítica'), prio('Alta')],
            ['El nombre de la tienda aparece como «PixleShop» en la portada', sev('Baja'), prio('Alta')],
            ['La app se cierra al exportar pedidos de hace 10 años (función casi sin uso)', sev('Alta'), prio('Baja')],
            ['Una tilde falta en la página «Acerca de nosotros»', sev('Baja'), prio('Baja')],
          ],
          explanation: 'Severidad = daño técnico; prioridad = urgencia para el negocio. Pueden no coincidir.',
        },
        {
          type: 'quiz',
          question: 'Normalmente, ¿quién decide la **prioridad** de un defecto?',
          options: ['El negocio o el product owner, según el impacto en los usuarios y el calendario', 'El desarrollador que lo corregirá', 'El tester que lo encontró, siempre', 'El usuario que lo sufrió'],
          answer: 0,
          explanation: 'El tester propone la severidad con criterio técnico; la prioridad depende de decisiones de negocio.',
        },
        {
          type: 'classify',
          question: '¿Qué severidad tiene cada defecto?',
          bins: [
            { id: 'crit', label: '🔴 Crítica' },
            { id: 'alta', label: '🟠 Alta' },
            { id: 'media', label: '🟡 Media' },
            { id: 'baja', label: '🟢 Baja' },
          ],
          items: [
            { text: 'Se pierden los pedidos ya pagados al reiniciar el servidor', bin: 'crit' },
            { text: 'El cupón descuenta el doble de lo que debería', bin: 'alta' },
            { text: 'El buscador no encuentra productos escritos en mayúsculas', bin: 'media' },
            { text: 'Un botón está 2 píxeles desalineado', bin: 'baja' },
          ],
          explanation: 'Pérdida de datos = crítica; dinero mal calculado = alta; función degradada con alternativa = media; cosmético = baja.',
        },
      ],
    },

    // ─────────────── 3
    {
      id: 'g-ciclo',
      icon: '♻️',
      title: 'Ciclo de vida del defecto',
      lesson: [
        {
          title: 'De «Nuevo» a «Cerrado»',
          code: {
            lang: 'text',
            code: code`
              Nuevo → Asignado → En progreso → Corregido → En re-test → Cerrado
                                                           ↘ Reabierto (si sigue fallando) → Asignado
              Otros estados: Rechazado (no es un defecto) · Duplicado · Diferido (se corregirá más adelante)
            `,
          },
          points: [
            'Las herramientas (Jira, GitHub Issues, Azure DevOps…) permiten configurar este flujo.',
            'Solo el **tester** cierra el defecto, después de la **prueba de confirmación**.',
          ],
        },
        {
          title: 'Estados especiales',
          table: {
            head: ['Estado', 'Cuándo'],
            rows: [
              ['**Rechazado**', 'No es un defecto: el sistema funciona según lo especificado (o fue un falso positivo).'],
              ['**Duplicado**', 'Ya existe otro reporte del mismo defecto.'],
              ['**Diferido**', 'Es real, pero se decide corregirlo en una versión posterior.'],
              ['**Reabierto**', 'La prueba de confirmación falla: el defecto sigue ahí.'],
            ],
          },
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'order',
          question: 'Ordena el camino "feliz" de un defecto.',
          steps: ['Nuevo', 'Asignado', 'En progreso', 'Corregido', 'En re-test', 'Cerrado'],
          explanation: 'Si en el re-test el fallo persiste, el defecto pasa a **Reabierto** y vuelve a asignarse.',
        },
        {
          type: 'classify',
          question: '¿A qué estado debe pasar el defecto en cada situación?',
          bins: [
            { id: 'rech', label: '🚫 Rechazado' },
            { id: 'dup', label: '👯 Duplicado' },
            { id: 'dif', label: '⏳ Diferido' },
            { id: 'reab', label: '🔁 Reabierto' },
            { id: 'cerr', label: '✅ Cerrado' },
          ],
          items: [
            { text: 'El re-test pasa y la regresión también', bin: 'cerr' },
            { text: 'Ya había un reporte idéntico de la semana pasada', bin: 'dup' },
            { text: 'Tras la corrección, el fallo sigue ocurriendo', bin: 'reab' },
            { text: 'El "fallo" era el comportamiento especificado en el requisito', bin: 'rech' },
            { text: 'Es real, pero se corregirá en la versión 3.0', bin: 'dif' },
          ],
          explanation: 'Cada estado comunica algo distinto al equipo. Un buen flujo evita que los defectos se "pierdan".',
        },
        {
          type: 'quiz',
          question: '¿Quién debería mover un defecto de «Corregido» a «Cerrado»?',
          options: ['El tester, tras la prueba de confirmación', 'El desarrollador, al terminar el código', 'El gerente del proyecto', 'Nadie: se cierra solo'],
          answer: 0,
          explanation: 'Que el desarrollador diga "ya está" no basta: hay que **confirmarlo** probando.',
        },
        {
          type: 'grid',
          question: '¿Qué transiciones son **válidas** en el flujo de defectos?',
          head: ['Desde', 'Hacia', '¿Válida?'],
          rows: [
            ['Nuevo', 'Asignado', x('✓')],
            ['Corregido', 'En re-test', x('✓')],
            ['En re-test', 'Reabierto', x('✓')],
            ['Nuevo', 'Cerrado (sin corregir ni rechazar)', x('–')],
            ['Cerrado', 'En progreso (sin reabrir)', x('–')],
          ],
          explanation: 'Saltarse estados (cerrar sin probar, trabajar en algo cerrado) rompe la trazabilidad del defecto.',
        },
      ],
    },

    // ─────────────── 4
    {
      id: 'g-riesgos',
      icon: '⚠️',
      title: 'Riesgos y plan de pruebas',
      lesson: [
        {
          title: 'Pruebas basadas en el riesgo',
          text: 'Como no se puede probar todo, se prueba **más** lo que **más riesgo** tiene. El **nivel de riesgo** combina:',
          points: ['**Probabilidad**: ¿qué tan probable es que falle? (código nuevo, complejo, equipo sin experiencia…)', '**Impacto**: ¿cuánto daño haría? (dinero, datos, reputación, personas…)'],
          table: {
            head: ['Probabilidad \\ Impacto', 'Bajo', 'Medio', 'Alto'],
            rows: [
              ['**Alta**', 'Medio', 'Alto', 'Alto'],
              ['**Media**', 'Bajo', 'Medio', 'Alto'],
              ['**Baja**', 'Bajo', 'Bajo', 'Medio'],
            ],
          },
        },
        {
          title: 'Riesgos de producto y de proyecto',
          table: {
            head: ['Tipo', 'Afecta a…', 'Ejemplo'],
            rows: [
              ['**De producto** (calidad)', 'El software y sus usuarios', 'El cálculo de impuestos es incorrecto'],
              ['**De proyecto**', 'La gestión: plazos, personas, presupuesto', 'El servidor de pruebas no estará listo a tiempo'],
            ],
          },
        },
        {
          title: 'El plan de pruebas',
          points: [
            '**Contexto**: alcance, objetivos, base de prueba.',
            '**Riesgos** y cómo se tratarán.',
            '**Enfoque**: niveles, tipos, técnicas, automatización.',
            '**Recursos y calendario**: personas, entornos, herramientas.',
            '**Criterios de entrada** (cuándo empezar) y **de salida** (cuándo terminar: la "definición de hecho").',
          ],
          tip: 'Criterio de salida típico: «0 defectos críticos abiertos y 95 % de los casos ejecutados».',
        },
      ],
      challenges: [
        {
          type: 'grid',
          question: 'Calcula el **nivel de riesgo** de cada funcionalidad con la matriz de la lección.',
          head: ['Funcionalidad', 'Probabilidad', 'Impacto', 'Nivel de riesgo'],
          rows: [
            ['Pago con tarjeta (código nuevo)', 'Alta', 'Alto', nivel('Alto')],
            ['Cambiar la foto de perfil', 'Baja', 'Bajo', nivel('Bajo')],
            ['Cálculo de envío (modificado)', 'Media', 'Alto', nivel('Alto')],
            ['Página «Acerca de»', 'Media', 'Bajo', nivel('Bajo')],
            ['Historial de pedidos', 'Media', 'Medio', nivel('Medio')],
          ],
          explanation: 'Con la matriz, el equipo prioriza: el pago y el envío reciben más pruebas (y más rigurosas) que la foto de perfil.',
        },
        {
          type: 'classify',
          question: '¿Riesgo de producto o de proyecto?',
          bins: [
            { id: 'prod', label: '📦 De producto' },
            { id: 'proy', label: '📅 De proyecto' },
          ],
          items: [
            { text: 'Los datos de las tarjetas podrían filtrarse', bin: 'prod' },
            { text: 'La única tester se va de vacaciones la semana del lanzamiento', bin: 'proy' },
            { text: 'La tienda podría ser lenta en el Black Friday', bin: 'prod' },
            { text: 'El proveedor de la pasarela de pagos entrega su API con retraso', bin: 'proy' },
            { text: 'El buscador podría devolver productos agotados', bin: 'prod' },
          ],
          explanation: 'Los riesgos de producto se mitigan con **pruebas**; los de proyecto, con **gestión** (planes de contingencia, recursos…).',
        },
        {
          type: 'pick',
          question: '¿Cuáles son buenos **criterios de salida** (para terminar las pruebas de una versión)?',
          options: [
            { text: 'No hay defectos críticos ni altos abiertos', correct: true },
            { text: 'Se ejecutó al menos el 95 % de los casos planificados', correct: true },
            { text: 'Todos los riesgos altos tienen pruebas que pasan', correct: true },
            { text: 'Se acabó el café', correct: false },
            { text: 'El tester tiene una buena sensación', correct: false },
          ],
          explanation: 'Los criterios de salida deben ser **medibles** y acordados de antemano.',
        },
        {
          type: 'quiz',
          question: '¿Qué sección del plan de pruebas responde «¿cuándo podemos **empezar** a ejecutar las pruebas del sistema?»',
          options: ['Criterios de entrada', 'Criterios de salida', 'Análisis de riesgos', 'Lecciones aprendidas'],
          answer: 0,
          explanation: 'Ejemplo de criterio de entrada: «la versión pasa la prueba de humo y el entorno de pruebas está disponible».',
        },
      ],
    },

    // ─────────────── 5
    {
      id: 'g-metricas',
      icon: '📊',
      title: 'Trazabilidad y métricas',
      lesson: [
        {
          title: 'Matriz de trazabilidad',
          text: 'La **matriz de trazabilidad** relaciona requisitos con casos de prueba (y con defectos). Responde preguntas como: ¿hay requisitos **sin probar**? ¿qué pruebas hay que repetir si cambia un requisito?',
          table: {
            head: ['Requisito', 'CP-01', 'CP-02', 'CP-03', 'CP-04'],
            rows: [
              ['HU-01 Buscar productos', '✓', '✓', '', ''],
              ['HU-02 Agregar al carrito', '', '', '✓', ''],
              ['HU-03 Aplicar cupón', '', '', '', '✓'],
              ['HU-04 Pagar', '', '', '', ''],
            ],
          },
          tip: '¡HU-04 no tiene ningún caso! La matriz deja ese hueco a la vista.',
          mood: 'wow',
        },
        {
          title: 'Métricas útiles',
          table: {
            head: ['Métrica', 'Cálculo'],
            rows: [
              ['**Avance de ejecución**', 'casos ejecutados ÷ casos planificados'],
              ['**Tasa de éxito**', 'casos que pasan ÷ casos ejecutados'],
              ['**Cobertura de requisitos**', 'requisitos con pruebas ÷ requisitos totales'],
              ['**Densidad de defectos**', 'defectos ÷ tamaño (por ejemplo, por cada 1.000 líneas)'],
              ['**Eficacia de detección (DDP)**', 'defectos encontrados en pruebas ÷ (los de pruebas + los encontrados después en producción)'],
            ],
          },
        },
      ],
      challenges: [
        {
          type: 'grid',
          question: 'Completa la matriz: marca qué requisito cubre cada caso de prueba.',
          head: ['Caso de prueba', 'HU-01 Buscar', 'HU-02 Carrito', 'HU-03 Cupón'],
          rows: [
            ['CP-01 Buscar «teclado» muestra el Teclado mecánico', x('✓'), x('–'), x('–')],
            ['CP-02 Agregar dos unidades actualiza el contador', x('–'), x('✓'), x('–')],
            ['CP-03 PIXEL10 descuenta el 10 % del total del carrito', x('–'), x('–'), x('✓')],
            ['CP-04 Buscar «zzz» muestra «No encontramos productos»', x('✓'), x('–'), x('–')],
          ],
          explanation: 'Con la matriz completa se ve qué requisitos están cubiertos y cuántos casos tiene cada uno.',
        },
        {
          type: 'quiz',
          question: 'Se planificaron **200** casos, se ejecutaron **160** y pasaron **144**. ¿Cuál es el avance de ejecución y la tasa de éxito?',
          options: ['80 % ejecutado y 90 % de éxito', '72 % ejecutado y 80 % de éxito', '80 % ejecutado y 72 % de éxito', '90 % ejecutado y 80 % de éxito'],
          answer: 0,
          explanation: 'Avance: 160 ÷ 200 = **80 %**. Éxito: 144 ÷ 160 = **90 %**.',
        },
        {
          type: 'quiz',
          question: 'En pruebas se encontraron **90** defectos y en producción, después del lanzamiento, aparecieron **10** más. ¿Cuál es la **eficacia de detección** (DDP)?',
          options: ['90 %', '10 %', '80 %', '100 %'],
          answer: 0,
          explanation: '90 ÷ (90 + 10) = **90 %**. Cuanto más cerca del 100 %, menos defectos se escapan a los usuarios.',
        },
        {
          type: 'pick',
          question: '¿Para qué sirve la **matriz de trazabilidad**?',
          options: [
            { text: 'Detectar requisitos que no tienen pruebas', correct: true },
            { text: 'Saber qué pruebas repetir si cambia un requisito', correct: true },
            { text: 'Mostrar la cobertura de requisitos en los informes', correct: true },
            { text: 'Encontrar automáticamente los defectos en el código', correct: false },
          ],
          explanation: 'La trazabilidad conecta el **porqué** (requisitos) con el **cómo** (pruebas) y el **resultado** (defectos).',
        },
      ],
    },

    // ─────────────── 6
    {
      id: 'g-sesion',
      icon: '🕵️',
      title: 'Proyecto: sesión exploratoria',
      project: true,
      lesson: [
        {
          title: 'Tu charter',
          code: {
            lang: 'text',
            code: code`
              Explorar: el catálogo, el carrito y el pago de PixelShop
              Con: búsquedas variadas, cantidades y cupones
              Para descubrir: cálculos incorrectos y mensajes engañosos
              Duración: lo que tarde este nivel ⏱️
            `,
          },
          text: 'En este proyecto vas a explorar pantallas de PixelShop, encontrar defectos, clasificarlos y reportarlos. ¡Aplica todo lo del mundo!',
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'bughunt',
          question: 'Búsqueda de «**teclado**». Encuentra el defecto.',
          screen: shop(`
            <h3>Catálogo</h3>
            <span class="m-input" data-spot="buscador">teclado</span>
            <p class="m-muted" data-spot="mensaje">No encontramos productos para «teclado»</p>
            <div class="m-grid" style="margin-top:10px">
              <div class="m-card" data-spot="p1"><b>Audífonos Pixel</b><div class="m-price">$120.000</div></div>
              <div class="m-card" data-spot="p2"><b>Teclado mecánico</b><div class="m-price">$250.000</div></div>
            </div>
          `),
          bugs: ['mensaje'],
          explanation: 'Dice que no hay resultados… ¡pero el «Teclado mecánico» existe! El buscador distingue mayúsculas: «teclado» ≠ «Teclado». (Y además muestra productos que no coinciden.)',
        },
        {
          type: 'bughunt',
          question: 'Página de pago. Encuentra los **2 defectos**.',
          screen: shop(`
            <h3>Pago</h3>
            <p>Total a pagar: <strong data-spot="total">$330.000</strong></p>
            <div class="m-card" style="max-width:380px;display:grid;gap:8px">
              <span class="m-label">Nombre completo</span><span class="m-input" data-spot="nombre">Ana Gómez</span>
              <span class="m-label">Ciudad</span><span class="m-input" data-spot="ciudad">Bogotá ▾</span>
              <label data-spot="terminos"><input type="checkbox" disabled> Acepto los términos y condiciones</label>
              <span class="m-btn" data-spot="boton">Confirmar compra</span>
              <span class="m-muted" data-spot="ayuda">El pago es seguro 🔒</span>
            </div>
          `),
          bugs: ['terminos', 'boton'],
          explanation: 'Los términos **no** están aceptados y aun así el botón «Confirmar compra» está **habilitado**. Además, la casilla aparece deshabilitada: el usuario ni siquiera puede marcarla.',
        },
        {
          type: 'grid',
          question: 'Clasifica los defectos que encontraste en la sesión.',
          head: ['Defecto', 'Severidad', 'Prioridad'],
          rows: [
            ['Se puede comprar sin aceptar los términos (riesgo legal)', sev('Alta'), prio('Alta')],
            ['El buscador distingue mayúsculas y minúsculas', sev('Media'), prio('Media')],
            ['El aviso «Agregado al carrito» tiene una tilde de más', sev('Baja'), prio('Baja')],
          ],
          explanation: 'Un problema legal en el pago es urgente; el buscador tiene alternativa (escribir con mayúscula); la tilde es cosmética.',
        },
        {
          type: 'report',
          question: 'Reporta el defecto del buscador.',
          fields: [
            { label: 'Título', options: ['La búsqueda distingue mayúsculas: «teclado» no encuentra «Teclado mecánico»', 'El buscador está roto', 'No hay teclados en la tienda'], answer: 0 },
            { label: 'Pasos', options: ['1. Abrir el catálogo · 2. Escribir «teclado» en el buscador', '1. Buscar algo', '1. Usar la tienda normalmente'], answer: 0 },
            { label: 'Esperado', options: ['Aparece «Teclado mecánico» en los resultados', 'Aparece un mensaje de error', 'No aparece nada'], answer: 0 },
            { label: 'Obtenido', options: ['Mensaje «No encontramos productos para «teclado»»', 'Aparece «Teclado mecánico»', 'La página se cierra'], answer: 0 },
            { label: 'Severidad', options: ['Media', 'Crítica', 'Baja'], answer: 0 },
          ],
          explanation: '¡Excelente sesión! Hallazgos claros, clasificados y listos para que el equipo los corrija. 🕵️',
        },
      ],
    },
  ],
};
