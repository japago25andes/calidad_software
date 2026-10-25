// ───────────────────────── MUNDO 2: NIVELES Y TIPOS DE PRUEBA ─────────────────────────
import { code } from '../helpers.js';

export const NIVELES = {
  id: 'niveles',
  short: 'Niveles',
  name: 'Niveles y tipos de prueba',
  icon: '🏗️',
  color: '#8b5cf6',
  description: 'El proceso de pruebas, los niveles (de componente a aceptación), los tipos de prueba, la pirámide y las revisiones.',
  levels: [
    // ─────────────── 1
    {
      id: 'n-proceso',
      icon: '🔄',
      title: 'El proceso de pruebas',
      lesson: [
        {
          title: 'Probar no es solo ejecutar',
          text: 'Ejecutar pruebas es solo una parte. ISTQB v4 describe un **proceso de pruebas** con grupos de actividades que se adaptan a cada proyecto:',
          table: {
            head: ['Actividad', '¿Qué se hace?'],
            rows: [
              ['**Planificación**', 'Definir objetivos, alcance, enfoque, recursos y calendario de las pruebas.'],
              ['**Monitorización y control**', 'Comparar el avance con el plan y tomar acciones si hay desvíos.'],
              ['**Análisis**', 'Estudiar la base de prueba (requisitos…) y decidir **qué** probar: las condiciones de prueba.'],
              ['**Diseño**', 'Convertir las condiciones en **casos de prueba**: decidir **cómo** probar.'],
              ['**Implementación**', 'Preparar lo necesario para ejecutar: datos, scripts, entornos, procedimientos.'],
              ['**Ejecución**', 'Ejecutar las pruebas, comparar resultados y registrar incidencias.'],
              ['**Compleción**', 'Cerrar: archivar testware, informe final, lecciones aprendidas.'],
            ],
          },
        },
        {
          title: 'Testware: todo lo que producen las pruebas',
          points: [
            'Plan de pruebas, condiciones y casos de prueba.',
            'Datos de prueba, scripts automatizados y entornos.',
            'Registros de ejecución, reportes de defectos e informes de avance y de cierre.',
          ],
          tip: 'El testware también se **versiona** y se **mantiene**, igual que el código.',
        },
        {
          title: '«Qué» vs. «cómo»',
          points: [
            '**Condición de prueba** (análisis): *«El cupón PIXEL10 aplica descuento»*. Es el **qué**.',
            '**Caso de prueba** (diseño): *«Con un carrito de $250.000, aplicar PIXEL10 → total $225.000»*. Es el **cómo**, con datos y resultado esperado.',
          ],
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'order',
          question: 'Ordena las actividades principales del proceso de pruebas.',
          steps: ['Planificación', 'Análisis', 'Diseño', 'Implementación', 'Ejecución', 'Compleción'],
          explanation: 'La **monitorización y control** no va en la lista porque ocurre de forma **continua** durante todo el proceso.',
        },
        {
          type: 'classify',
          question: '¿En qué actividad del proceso ocurre cada tarea?',
          bins: [
            { id: 'plan', label: 'Planificación' },
            { id: 'ana', label: 'Análisis' },
            { id: 'dis', label: 'Diseño' },
            { id: 'eje', label: 'Ejecución' },
            { id: 'comp', label: 'Compleción' },
          ],
          items: [
            { text: 'Decidir que se probará primero el pago porque es lo más riesgoso', bin: 'plan' },
            { text: 'Leer las historias de usuario e identificar qué hay que probar', bin: 'ana' },
            { text: 'Escribir los casos con datos de entrada y resultados esperados', bin: 'dis' },
            { text: 'Correr los casos y registrar los defectos encontrados', bin: 'eje' },
            { text: 'Escribir el informe final y las lecciones aprendidas', bin: 'comp' },
            { text: 'Estimar cuántas personas y días hacen falta', bin: 'plan' },
          ],
          explanation: 'Análisis = **qué** probar; diseño = **cómo** probarlo; ejecución = hacerlo.',
        },
        {
          type: 'classify',
          question: '¿Es una condición de prueba (qué) o un caso de prueba (cómo)?',
          bins: [
            { id: 'cond', label: '🎯 Condición de prueba' },
            { id: 'caso', label: '🧪 Caso de prueba' },
          ],
          items: [
            { text: 'El inicio de sesión rechaza contraseñas incorrectas', bin: 'cond' },
            { text: 'Usuario ana@pixelshop.test, clave «abc» → mensaje «Correo o contraseña incorrectos»', bin: 'caso' },
            { text: 'El buscador encuentra productos sin distinguir mayúsculas', bin: 'cond' },
            { text: 'Buscar «TECLADO» → aparece «Teclado mecánico» en los resultados', bin: 'caso' },
          ],
          explanation: 'El caso de prueba concreta la condición con **datos**, **pasos** y **resultado esperado**.',
        },
        {
          type: 'pick',
          question: 'Marca lo que es **testware**.',
          options: [
            { text: 'Los scripts de Playwright', correct: true },
            { text: 'Los datos de prueba de clientes ficticios', correct: true },
            { text: 'El informe de cierre de pruebas', correct: true },
            { text: 'Los reportes de defectos', correct: true },
            { text: 'El servidor de producción de los clientes', correct: false },
          ],
          explanation: 'Testware es todo lo que se produce **para** y **durante** las pruebas.',
        },
      ],
    },

    // ─────────────── 2
    {
      id: 'n-niveles',
      icon: '🪜',
      title: 'Niveles de prueba',
      lesson: [
        {
          title: 'De la pieza al sistema completo',
          table: {
            head: ['Nivel', 'Qué se prueba', 'Quién suele probar'],
            rows: [
              ['**Componente** (unitarias)', 'Una función, clase o módulo **aislado**', 'Desarrolladores'],
              ['**Integración de componentes**', 'Las **interfaces** entre componentes', 'Desarrolladores'],
              ['**Sistema**', 'El sistema **completo** de punta a punta, funcional y no funcional', 'Equipo de pruebas'],
              ['**Integración de sistemas**', 'Las interfaces con **otros sistemas** (pasarela de pagos, transportadora…)', 'Equipo de pruebas'],
              ['**Aceptación**', 'Que el sistema sirve para el **negocio** y los usuarios', 'Usuarios, clientes, negocio'],
            ],
          },
        },
        {
          title: 'Tipos de pruebas de aceptación',
          points: [
            '**De usuario (UAT)**: usuarios reales comprueban que pueden hacer su trabajo.',
            '**Operativa**: administradores verifican copias de seguridad, recuperación, instalación…',
            '**Contractual y regulatoria**: se comprueba lo firmado en un contrato o exigido por una ley.',
            '**Alfa**: en las instalaciones del desarrollador, con usuarios. **Beta**: en el entorno de los usuarios, antes del lanzamiento general.',
          ],
        },
        {
          title: 'Cada nivel tiene su base de prueba',
          table: {
            head: ['Nivel', 'Base de prueba típica'],
            rows: [
              ['Componente', 'Diseño detallado, código, especificación de la función'],
              ['Integración', 'Diseño de la arquitectura, contratos de las interfaces (APIs)'],
              ['Sistema', 'Requisitos del sistema, casos de uso, historias de usuario'],
              ['Aceptación', 'Procesos de negocio, requisitos de usuario, contratos, normas'],
            ],
          },
          tip: 'Cuanto más "alto" el nivel, más se parece la prueba al **uso real**… y más caro es encontrar ahí un defecto.',
        },
      ],
      challenges: [
        {
          type: 'classify',
          question: '¿Qué nivel de prueba es cada uno?',
          bins: [
            { id: 'comp', label: '🧩 Componente' },
            { id: 'int', label: '🔗 Integración' },
            { id: 'sis', label: '🖥️ Sistema' },
            { id: 'acep', label: '🤝 Aceptación' },
          ],
          items: [
            { text: 'Probar con pytest que `calcular_iva(100)` devuelve 19', bin: 'comp' },
            { text: 'Comprobar que el carrito envía bien el pedido al módulo de inventario', bin: 'int' },
            { text: 'Recorrer con Playwright toda la compra: buscar, agregar, pagar', bin: 'sis' },
            { text: 'El dueño de PixelShop usa la tienda una semana antes de abrirla', bin: 'acep' },
            { text: 'Verificar que PixelShop y la pasarela de pagos intercambian bien los datos', bin: 'int' },
            { text: 'Probar la clase `Cupon` aislada, con dobles de prueba', bin: 'comp' },
          ],
          explanation: 'La pasarela de pagos es **integración de sistemas**; el carrito con el inventario, **integración de componentes**. Ambas buscan defectos en las **interfaces**.',
        },
        {
          type: 'order',
          question: 'Ordena los niveles de prueba de **más pequeño** a **más amplio**.',
          steps: ['Componente', 'Integración de componentes', 'Sistema', 'Integración de sistemas', 'Aceptación'],
          explanation: 'Cada nivel construye sobre el anterior, aunque en equipos ágiles varios niveles se trabajan a la vez.',
        },
        {
          type: 'quiz',
          question: 'Antes del lanzamiento, 200 clientes reales usan PixelShop **desde sus casas** y reportan problemas. ¿Qué es?',
          options: ['Prueba beta', 'Prueba alfa', 'Prueba de integración', 'Prueba de componente'],
          answer: 0,
          explanation: 'En la **beta** los usuarios prueban en **su** entorno; en la **alfa**, en las instalaciones del desarrollador.',
        },
        {
          type: 'quiz',
          question: 'La ley exige que la tienda guarde las facturas 5 años. ¿Qué prueba lo verifica?',
          options: ['Aceptación contractual y regulatoria', 'Prueba de componente', 'Prueba beta', 'Prueba de humo'],
          answer: 0,
          explanation: 'Lo que exigen contratos o normas se comprueba en la aceptación **contractual y regulatoria**.',
        },
        {
          type: 'pick',
          question: 'Marca lo que es **cierto** sobre las pruebas de componente (unitarias).',
          options: [
            { text: 'Prueban una unidad aislada del resto del sistema', correct: true },
            { text: 'Suelen escribirlas los desarrolladores', correct: true },
            { text: 'Pueden usar dobles de prueba (mocks, stubs) para aislar dependencias', correct: true },
            { text: 'Necesitan la interfaz gráfica completa para ejecutarse', correct: false },
            { text: 'Son las más lentas de ejecutar', correct: false },
          ],
          explanation: 'Las unitarias son **rápidas** y **aisladas**: por eso son la base de la pirámide de pruebas.',
        },
      ],
    },

    // ─────────────── 3
    {
      id: 'n-tipos',
      icon: '🧬',
      title: 'Tipos de prueba',
      lesson: [
        {
          title: 'Cuatro grandes tipos',
          table: {
            head: ['Tipo', 'Evalúa…', 'Ejemplo'],
            rows: [
              ['**Funcional**', '**Qué** hace el sistema', 'El cupón descuenta el 10 %'],
              ['**No funcional**', '**Cómo de bien** lo hace', 'El pago responde en menos de 2 s'],
              ['**Caja negra**', 'El comportamiento, **sin mirar** el código', 'Particiones y valores límite'],
              ['**Caja blanca**', 'La **estructura interna** (código)', 'Cobertura de sentencias y ramas'],
            ],
          },
          tip: 'Los tipos de prueba se pueden aplicar en **cualquier nivel**: hay pruebas de rendimiento de una función y de todo el sistema.',
        },
        {
          title: 'Confirmación y regresión',
          points: [
            '**Prueba de confirmación** (re-test): después de corregir un defecto, se repite la prueba que falló para **confirmar** la corrección.',
            '**Prueba de regresión**: se vuelven a ejecutar pruebas que antes pasaban para comprobar que un **cambio** no rompió nada.',
            'Las pruebas de regresión se ejecutan **muchísimas veces**: son las mejores candidatas a **automatizar**.',
          ],
          mood: 'wow',
        },
        {
          title: 'Humo y cordura',
          points: [
            '**Prueba de humo** (smoke test): un conjunto pequeño y rápido que comprueba que lo **más básico** funciona (¿arranca? ¿se puede iniciar sesión?). Si falla, no tiene sentido seguir probando.',
            '**Prueba de cordura** (sanity): una comprobación rápida y enfocada de una funcionalidad concreta tras un cambio pequeño.',
          ],
          tip: 'El nombre "humo" viene del hardware: enchufas el aparato y miras si sale humo. 💨',
        },
      ],
      challenges: [
        {
          type: 'classify',
          question: '¿Prueba funcional o no funcional?',
          bins: [
            { id: 'f', label: '⚙️ Funcional' },
            { id: 'nf', label: '📏 No funcional' },
          ],
          items: [
            { text: 'Comprobar que se puede eliminar un producto del carrito', bin: 'f' },
            { text: 'Medir cuántas compras por segundo soporta el sistema', bin: 'nf' },
            { text: 'Verificar que un lector de pantalla anuncia los botones', bin: 'nf' },
            { text: 'Comprobar que el cupón vencido se rechaza', bin: 'f' },
            { text: 'Intentar una inyección SQL en el buscador', bin: 'nf' },
            { text: 'Comprobar que el correo de confirmación incluye el número de pedido', bin: 'f' },
          ],
          explanation: 'Rendimiento, accesibilidad y seguridad son **no funcionales** (características de calidad de ISO 25010 distintas de la adecuación funcional).',
        },
        {
          type: 'classify',
          question: '¿Confirmación o regresión?',
          bins: [
            { id: 'conf', label: '✅ Confirmación (re-test)' },
            { id: 'reg', label: '🔁 Regresión' },
          ],
          items: [
            { text: 'Se corrigió el bug del cupón: repito exactamente la prueba que fallaba', bin: 'conf' },
            { text: 'Se actualizó la librería de pagos: ejecuto todas las pruebas del checkout', bin: 'reg' },
            { text: 'Cada noche corren automáticamente las 800 pruebas del sistema', bin: 'reg' },
            { text: 'Verifico que el defecto #142 ya no ocurre', bin: 'conf' },
          ],
          explanation: 'Confirmación: ¿se arregló **ese** defecto? Regresión: ¿el cambio rompió **otra cosa**?',
        },
        {
          type: 'quiz',
          question: 'Cada mañana, antes de probar a fondo, el equipo ejecuta 10 pruebas rápidas: abrir la tienda, iniciar sesión, buscar y agregar al carrito. ¿Qué son?',
          options: ['Pruebas de humo', 'Pruebas de aceptación', 'Pruebas de caja blanca', 'Pruebas de estrés'],
          answer: 0,
          explanation: 'Si la prueba de humo falla, la versión no está lista para pruebas más profundas.',
        },
        {
          type: 'quiz',
          question: '¿Qué tipo de prueba es la **mejor candidata a automatizar**?',
          options: ['La regresión, porque se repite en cada cambio', 'La prueba exploratoria', 'La prueba de usabilidad con usuarios', 'La prueba beta'],
          answer: 0,
          explanation: 'Lo que se repite mucho y tiene resultados esperados claros es ideal para automatizar. La exploración y la usabilidad necesitan **criterio humano**.',
        },
        {
          type: 'classify',
          question: '¿Técnica de caja negra o de caja blanca?',
          bins: [
            { id: 'negra', label: '⬛ Caja negra' },
            { id: 'blanca', label: '⬜ Caja blanca' },
          ],
          items: [
            { text: 'Elegir edades 17, 18, 65 y 66 según la regla del requisito', bin: 'negra' },
            { text: 'Agregar casos hasta que todas las ramas del `if` se ejecuten', bin: 'blanca' },
            { text: 'Armar una tabla de decisión con las reglas del descuento', bin: 'negra' },
            { text: 'Medir la cobertura de sentencias con pytest-cov', bin: 'blanca' },
          ],
          explanation: 'Caja negra se basa en la **especificación**; caja blanca, en la **estructura del código**.',
        },
      ],
    },

    // ─────────────── 4
    {
      id: 'n-piramide',
      icon: '🔺',
      title: 'La pirámide de pruebas',
      lesson: [
        {
          title: 'Muchas pruebas pequeñas, pocas grandes',
          text: 'La **pirámide de pruebas** (Mike Cohn) recomienda cómo repartir las pruebas automáticas:',
          table: {
            head: ['Capa', 'Cantidad', 'Velocidad', 'Costo de mantener'],
            rows: [
              ['🔺 **E2E / interfaz** (Playwright)', 'Pocas', 'Lentas (segundos)', 'Alto: se rompen con cambios de UI'],
              ['🔷 **Servicio / integración / API**', 'Algunas', 'Medias', 'Medio'],
              ['🟩 **Unitarias** (pytest)', 'Muchas', 'Rapidísimas (milisegundos)', 'Bajo'],
            ],
          },
          tip: 'El antipatrón es el **cono de helado** 🍦: casi todo son pruebas manuales o de interfaz y casi no hay unitarias.',
        },
        {
          title: 'Los cuadrantes de pruebas ágiles',
          text: 'Brian Marick propuso cuatro cuadrantes para no olvidar ningún tipo de prueba:',
          table: {
            head: ['', 'Apoyan al equipo', 'Critican el producto'],
            rows: [
              ['**De cara al negocio**', 'Q2: pruebas funcionales, ejemplos, historias (BDD), prototipos', 'Q3: exploratorias, usabilidad, UAT, alfa/beta'],
              ['**De cara a la tecnología**', 'Q1: unitarias y de componentes', 'Q4: rendimiento, seguridad, carga'],
            ],
          },
        },
      ],
      challenges: [
        {
          type: 'order',
          question: 'Ordena las capas de la pirámide de la **base** (más pruebas) a la **punta** (menos pruebas).',
          steps: ['Pruebas unitarias', 'Pruebas de integración / API', 'Pruebas de extremo a extremo (E2E)'],
          explanation: 'Base ancha de unitarias rápidas y baratas; punta estrecha de E2E lentas pero realistas.',
        },
        {
          type: 'quiz',
          question: 'El equipo de PixelShop tiene 400 pruebas E2E con Playwright y 15 unitarias. La batería tarda 2 horas y falla a menudo por cambios de diseño. ¿Qué pasa?',
          options: [
            'Es un cono de helado: deberían mover lógica a pruebas unitarias y de API',
            'Está perfecto: las E2E son las más realistas',
            'Deberían borrar las unitarias',
            'El problema es Playwright: hay que cambiar de herramienta',
          ],
          answer: 0,
          explanation: 'Las reglas de negocio (descuentos, impuestos, validaciones) se prueban mejor con **unitarias**. Deja las E2E para los **flujos críticos**.',
        },
        {
          type: 'classify',
          question: '¿En qué cuadrante ágil va cada prueba?',
          bins: [
            { id: 'q1', label: 'Q1 · Tecnología / apoyo' },
            { id: 'q2', label: 'Q2 · Negocio / apoyo' },
            { id: 'q3', label: 'Q3 · Negocio / crítica' },
            { id: 'q4', label: 'Q4 · Tecnología / crítica' },
          ],
          items: [
            { text: 'Pruebas unitarias con pytest', bin: 'q1' },
            { text: 'Escenarios Given/When/Then acordados con el negocio', bin: 'q2' },
            { text: 'Sesión exploratoria del checkout', bin: 'q3' },
            { text: 'Prueba de carga con 1.000 usuarios', bin: 'q4' },
            { text: 'Prueba de usabilidad con clientes reales', bin: 'q3' },
            { text: 'Escaneo de vulnerabilidades', bin: 'q4' },
          ],
          explanation: 'Los cuadrantes recuerdan que además de "¿funciona?" hay que preguntarse "¿le sirve al usuario?" y "¿aguanta?".',
        },
        {
          type: 'pick',
          question: '¿Qué ventajas tienen las pruebas **unitarias** frente a las E2E?',
          options: [
            { text: 'Se ejecutan en milisegundos', correct: true },
            { text: 'Señalan con precisión dónde está el defecto', correct: true },
            { text: 'Son más baratas de mantener', correct: true },
            { text: 'Prueban la experiencia completa del usuario', correct: false },
            { text: 'Detectan problemas de integración con la pasarela de pagos', correct: false },
          ],
          explanation: 'Las unitarias son rápidas y precisas, pero no ven la integración ni la experiencia completa: por eso necesitas **todas** las capas.',
        },
      ],
    },

    // ─────────────── 5
    {
      id: 'n-modelos',
      icon: '🔀',
      title: 'Ciclos de vida y pruebas',
      lesson: [
        {
          title: 'El modelo en V',
          text: 'En el **modelo en V**, cada fase de desarrollo (lado izquierdo) tiene su nivel de prueba (lado derecho). Las pruebas se **diseñan** en paralelo a cada fase, aunque se **ejecuten** después.',
          table: {
            head: ['Fase de desarrollo', '⟷', 'Nivel de prueba'],
            rows: [
              ['Requisitos del negocio', '⟷', 'Pruebas de aceptación'],
              ['Requisitos del sistema', '⟷', 'Pruebas de sistema'],
              ['Diseño de la arquitectura', '⟷', 'Pruebas de integración'],
              ['Diseño detallado / código', '⟷', 'Pruebas de componente'],
            ],
          },
        },
        {
          title: 'Ágil, DevOps y entrega continua',
          points: [
            'En **ágil** (Scrum…) todo ocurre en iteraciones cortas: cada historia se especifica, programa y **prueba dentro del sprint**.',
            'El tester trabaja **dentro del equipo**, desde el refinamiento de las historias.',
            'En **DevOps**, cada cambio pasa por una **canalización** (pipeline) que compila, ejecuta las pruebas automáticas y despliega.',
            'La automatización de la regresión es lo que permite entregar **rápido y seguro**.',
          ],
        },
        {
          title: 'TDD, ATDD y BDD',
          table: {
            head: ['Enfoque', 'Idea'],
            rows: [
              ['**TDD** (desarrollo guiado por pruebas)', 'Primero la prueba unitaria que falla, luego el código que la hace pasar, luego refactorizar.'],
              ['**ATDD** (guiado por pruebas de aceptación)', 'El equipo y el negocio escriben las pruebas de aceptación **antes** de desarrollar la historia.'],
              ['**BDD** (guiado por comportamiento)', 'Los ejemplos se escriben en lenguaje natural (Given/When/Then) y se automatizan.'],
            ],
          },
          code: {
            lang: 'gherkin',
            code: code`
              Escenario: aplicar un cupón válido
                Dado un carrito con un total de $250.000
                Cuando aplico el cupón "PIXEL10"
                Entonces el total es $225.000
            `,
          },
        },
      ],
      challenges: [
        {
          type: 'grid',
          question: 'Completa el modelo en V: ¿qué nivel de prueba corresponde a cada fase?',
          head: ['Fase de desarrollo', 'Nivel de prueba'],
          rows: [
            ['Requisitos del negocio', { options: ['Aceptación', 'Sistema', 'Integración', 'Componente'], answer: 'Aceptación' }],
            ['Requisitos del sistema', { options: ['Aceptación', 'Sistema', 'Integración', 'Componente'], answer: 'Sistema' }],
            ['Diseño de la arquitectura', { options: ['Aceptación', 'Sistema', 'Integración', 'Componente'], answer: 'Integración' }],
            ['Diseño detallado', { options: ['Aceptación', 'Sistema', 'Integración', 'Componente'], answer: 'Componente' }],
          ],
          explanation: 'En la V, el lado izquierdo **especifica** y el derecho **comprueba** lo especificado al mismo nivel.',
        },
        {
          type: 'classify',
          question: '¿TDD, ATDD o BDD?',
          bins: [
            { id: 'tdd', label: '🔴 TDD' },
            { id: 'atdd', label: '🤝 ATDD' },
            { id: 'bdd', label: '🥒 BDD' },
          ],
          items: [
            { text: 'Escribo una prueba unitaria que falla y luego el código mínimo para que pase', bin: 'tdd' },
            { text: 'Negocio, tester y dev acuerdan las pruebas de aceptación antes de empezar la historia', bin: 'atdd' },
            { text: 'Los escenarios se escriben con «Dado… Cuando… Entonces…» y se automatizan', bin: 'bdd' },
            { text: 'Ciclo rojo → verde → refactorizar', bin: 'tdd' },
          ],
          explanation: 'Los tres son enfoques **test-first**: las pruebas guían el desarrollo en lugar de llegar al final.',
        },
        {
          type: 'fill',
          question: 'Completa el escenario BDD con las palabras clave de Gherkin en español.',
          lang: 'gherkin',
          code: 'Escenario: buscar un producto\n  ___ que estoy en el catálogo\n  ___ busco "teclado"\n  ___ veo "Teclado mecánico" en los resultados',
          blanks: [['Dado'], ['Cuando'], ['Entonces']],
          bank: ['Dado', 'Cuando', 'Entonces', 'Si', 'Luego'],
          explanation: '**Dado** (contexto) · **Cuando** (acción) · **Entonces** (resultado esperado). En inglés: Given / When / Then.',
        },
        {
          type: 'quiz',
          question: 'En un equipo Scrum, ¿cuándo debe empezar a participar el tester en una historia de usuario?',
          options: [
            'Desde el refinamiento, ayudando a definir los criterios de aceptación',
            'Cuando la historia está terminada y desplegada',
            'Al final del sprint, el último día',
            'Solo si la historia tiene defectos',
          ],
          answer: 0,
          explanation: 'Participar desde el refinamiento es **shift-left**: muchas ambigüedades (y defectos) se eliminan antes de escribir código.',
        },
      ],
    },

    // ─────────────── 6
    {
      id: 'n-estaticas',
      icon: '👓',
      title: 'Pruebas estáticas y revisiones',
      lesson: [
        {
          title: 'Encontrar defectos sin ejecutar nada',
          points: [
            'Las **pruebas estáticas** examinan productos de trabajo **sin ejecutarlos**: requisitos, historias, diseños, código, planes de prueba…',
            'Encuentran defectos que las dinámicas no ven: ambigüedades, requisitos contradictorios, código inalcanzable, falta de seguridad.',
            'El **análisis estático** lo hacen herramientas (linters como Ruff o Pylint, analizadores de seguridad, tipos con mypy).',
          ],
        },
        {
          title: 'Tipos de revisión (de menos a más formal)',
          table: {
            head: ['Tipo', 'Características'],
            rows: [
              ['**Revisión informal**', 'Sin proceso definido ni documentación. Ej.: pedirle a un compañero que mire el código.'],
              ['**Revisión guiada** (walkthrough)', 'El **autor** guía la reunión. Sirve para aprender, generar ideas y encontrar defectos.'],
              ['**Revisión técnica**', 'La hacen revisores técnicos, guiados por un **moderador**. Busca consenso y decisiones técnicas.'],
              ['**Inspección**', 'La más **formal**: roles definidos, proceso documentado, métricas, criterios de salida. El autor **no** puede ser moderador.'],
            ],
          },
        },
        {
          title: 'Roles en una revisión',
          points: [
            '**Autor**: creó el producto y corrige los defectos.',
            '**Moderador** (facilitador): dirige las reuniones.',
            '**Escriba** (registrador): anota las anomalías y decisiones.',
            '**Revisores**: buscan anomalías.',
            '**Gerente** y **líder de la revisión**: deciden qué revisar y organizan.',
          ],
          tip: 'Una revisión de código en un pull request es una revisión estática: ¡lo haces sin ejecutar el código!',
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'bughunt',
          question: 'Haz una **revisión de código** (sin ejecutarlo). La función debe devolver el promedio de calificaciones de un producto. ¿En qué línea hay defectos?',
          code: code`
            def promedio_calificaciones(calificaciones):
                """Promedio de 1 a 5 estrellas. Lista vacía → 0."""
                total = 0
                for c in calificaciones:
                    total += c
                return total / len(calificaciones) + 1
          `,
          bugs: [6],
          explanation: 'Línea 6: suma **+1** al promedio (¡nadie puede tener 6 estrellas!) y, además, si la lista está vacía divide entre cero en lugar de devolver 0. Ambos defectos están en la misma línea: falta un `if not calificaciones: return 0` y sobra el `+ 1`.',
        },
        {
          type: 'classify',
          question: '¿Qué tipo de revisión es?',
          bins: [
            { id: 'inf', label: 'Informal' },
            { id: 'walk', label: 'Revisión guiada' },
            { id: 'tec', label: 'Revisión técnica' },
            { id: 'insp', label: 'Inspección' },
          ],
          items: [
            { text: 'Le pido a un compañero que eche un vistazo a mi función en el chat', bin: 'inf' },
            { text: 'La autora presenta su diseño al equipo, paso a paso, para recoger ideas', bin: 'walk' },
            { text: 'Arquitectos revisan la propuesta de base de datos, guiados por un moderador, para decidir', bin: 'tec' },
            { text: 'Proceso formal con roles, lista de verificación, métricas y criterios de salida', bin: 'insp' },
          ],
          explanation: 'La formalidad crece de la informal a la inspección. La inspección es la que más defectos encuentra por hora, pero también la más costosa.',
        },
        {
          type: 'pick',
          question: '¿Qué defectos son **más fáciles** de encontrar con pruebas estáticas que con dinámicas?',
          options: [
            { text: 'Requisitos ambiguos o contradictorios', correct: true },
            { text: 'Código que nunca se puede ejecutar (inalcanzable)', correct: true },
            { text: 'Variables usadas sin definir', correct: true },
            { text: 'El sistema es lento con 1.000 usuarios', correct: false },
            { text: 'Un fallo que solo aparece al pagar con cierta tarjeta en producción', correct: false },
          ],
          explanation: 'Rendimiento y fallos dependientes del entorno se descubren **ejecutando**. Ambigüedades y código muerto, **leyendo**.',
        },
        {
          type: 'bughunt',
          question: 'Revisa este **requisito** antes de que se programe. ¿Qué frase tiene el defecto?',
          screen: `<div class="m-body">
            <h3>HU-07 · Envío gratis</h3>
            <p data-spot="a">Como cliente quiero envío gratis para ahorrar dinero.</p>
            <p data-spot="b">• El envío es gratis en compras de $150.000 o más.</p>
            <p data-spot="c">• El envío es gratis para los clientes nuevos.</p>
            <p data-spot="d">• El envío cuesta $12.000 en compras menores a $200.000.</p>
            <p data-spot="e">• El costo del envío se muestra antes de pagar.</p>
          </div>`,
          bugs: ['d'],
          explanation: 'Contradice la regla de $150.000: ¿una compra de $170.000 paga envío o no? Encontrar esta **contradicción** en una revisión cuesta minutos; en producción, reclamos.',
        },
        {
          type: 'quiz',
          question: 'En una **inspección**, ¿quién **no** puede actuar como moderador?',
          options: ['El autor del producto revisado', 'Un revisor externo al equipo', 'El líder de calidad', 'Un tester con experiencia'],
          answer: 0,
          explanation: 'En la inspección el autor no modera ni lee el documento: así se evita que la revisión se convierta en una defensa del trabajo.',
        },
      ],
    },
  ],
};
