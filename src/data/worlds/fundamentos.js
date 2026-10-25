// ───────────────────────── MUNDO 1: FUNDAMENTOS DE CALIDAD ─────────────────────────
import { code, shop } from '../helpers.js';

export const FUNDAMENTOS = {
  id: 'fundamentos',
  short: 'Fundamentos',
  name: 'Fundamentos de calidad',
  icon: '🧭',
  color: '#0ea5e9',
  description: 'Qué es la calidad, por qué fallan los sistemas, los siete principios de las pruebas y el modelo ISO/IEC 25010.',
  levels: [
    // ─────────────── 1
    {
      id: 'f-calidad',
      icon: '💎',
      title: '¿Qué es la calidad?',
      lesson: [
        {
          title: 'Bienvenido/a a la Agencia de Calidad',
          text: 'La **calidad del software** es el grado en que un producto satisface los requisitos y las **necesidades** (explícitas e implícitas) de quienes lo usan. No basta con que "funcione": también tiene que ser seguro, rápido, fácil de usar y fácil de mantener.',
          points: [
            'Un software de calidad hace **lo que debe** y **no hace lo que no debe**.',
            'La calidad no se "agrega al final": se **construye** durante todo el proyecto.',
            'Las pruebas son una de las formas de **medir** y **mejorar** la calidad.',
          ],
          mood: 'happy',
        },
        {
          title: 'QA, QC y pruebas: no son lo mismo',
          table: {
            head: ['Concepto', 'Se enfoca en…', 'Ejemplo'],
            rows: [
              ['**Aseguramiento de la calidad (QA)**', 'El **proceso**: prevenir defectos', 'Definir estándares de código, hacer revisiones, capacitar al equipo'],
              ['**Control de calidad (QC)**', 'El **producto**: detectar defectos', 'Revisar el entregable antes de liberarlo'],
              ['**Pruebas (testing)**', 'Una actividad del QC', 'Ejecutar casos de prueba sobre PixelShop'],
            ],
          },
          tip: 'QA es **preventivo** (orientado al proceso); QC y las pruebas son **detectivos** (orientados al producto).',
        },
        {
          title: '¿Para qué probamos?',
          text: 'Según el temario **ISTQB Foundation v4**, los objetivos típicos de las pruebas son:',
          points: [
            'Evaluar los productos de trabajo: requisitos, historias de usuario, diseños y código.',
            'Provocar **fallos** y encontrar **defectos**.',
            'Asegurar la cobertura necesaria del objeto de prueba.',
            '**Reducir el riesgo** de que la calidad sea insuficiente.',
            'Verificar que se cumplen los requisitos (y las normas o leyes).',
            'Dar **información** a los interesados para que tomen decisiones.',
            'Generar **confianza** y **validar** que el sistema sirve a los usuarios.',
          ],
        },
        {
          title: 'Cuando la calidad falla',
          table: {
            head: ['Caso', 'Qué pasó'],
            rows: [
              ['**Ariane 5** (1996)', 'Un número de 64 bits convertido a 16 bits provocó un desbordamiento: el cohete se autodestruyó a los 37 s del despegue.'],
              ['**Mars Climate Orbiter** (1999)', 'Un equipo usaba unidades imperiales y otro métricas: la sonda se perdió en Marte.'],
              ['**Therac-25** (1985–1987)', 'Errores de concurrencia en una máquina de radioterapia causaron sobredosis graves a pacientes.'],
              ['**Knight Capital** (2012)', 'Un despliegue incompleto activó código antiguo: perdió unos 440 millones de dólares en 45 minutos.'],
            ],
          },
          tip: 'Moraleja de Bichi: un bug pequeño en el lugar equivocado puede costar vidas o millones. 🐞',
          mood: 'wow',
        },
      ],
      challenges: [
        {
          type: 'quiz',
          question: '¿Cuál es la mejor definición de **calidad del software**?',
          options: [
            'El grado en que el software satisface los requisitos y las necesidades de sus usuarios',
            'Que el software no tenga ningún defecto',
            'Que el código esté bien comentado',
            'Que el software pase todas las pruebas automáticas',
          ],
          answer: 0,
          explanation: 'Un software sin defectos conocidos puede igualmente no servirle a nadie. La calidad mira los **requisitos** y las **necesidades** de los usuarios.',
        },
        {
          type: 'classify',
          question: '¿Es aseguramiento de la calidad (QA) o control de calidad (QC)?',
          bins: [
            { id: 'qa', label: '🛡️ QA (proceso, prevenir)' },
            { id: 'qc', label: '🔍 QC (producto, detectar)' },
          ],
          items: [
            { text: 'Definir una guía de estilo de código para todo el equipo', bin: 'qa' },
            { text: 'Ejecutar los casos de prueba del carrito de PixelShop', bin: 'qc' },
            { text: 'Capacitar al equipo en buenas prácticas de seguridad', bin: 'qa' },
            { text: 'Revisar la versión candidata antes de publicarla', bin: 'qc' },
            { text: 'Acordar que todo cambio pase por revisión de código', bin: 'qa' },
            { text: 'Registrar los defectos encontrados en la versión 2.1', bin: 'qc' },
          ],
          explanation: 'QA mejora **cómo** trabajamos para que los defectos no aparezcan; QC examina **lo que** construimos para encontrar los que sí aparecieron.',
        },
        {
          type: 'pick',
          question: 'Marca los **objetivos de las pruebas** según ISTQB.',
          options: [
            { text: 'Reducir el riesgo de que la calidad sea insuficiente', correct: true },
            { text: 'Provocar fallos y encontrar defectos', correct: true },
            { text: 'Demostrar que el software no tiene ningún defecto', correct: false },
            { text: 'Dar información a los interesados para tomar decisiones', correct: true },
            { text: 'Corregir los defectos encontrados', correct: false },
            { text: 'Generar confianza en el nivel de calidad', correct: true },
          ],
          explanation: 'Las pruebas **no pueden demostrar** que no hay defectos, y **corregirlos** es depuración (trabajo de desarrollo), no prueba.',
        },
        {
          type: 'quiz',
          question: 'En el caso del **Mars Climate Orbiter**, ¿qué tipo de prueba habría ayudado más a detectar el problema?',
          options: [
            'Pruebas de integración entre los componentes de los dos equipos',
            'Pruebas de rendimiento del software de vuelo',
            'Pruebas de usabilidad de la consola de control',
            'Ninguna: era imposible de detectar',
          ],
          answer: 0,
          explanation: 'Cada parte funcionaba "bien" por separado: el fallo estaba en la **interfaz** entre ellas (unidades distintas). Eso es justo lo que buscan las pruebas de **integración**.',
        },
        {
          type: 'quiz',
          question: 'El equipo de PixelShop dice: «Ya probamos mucho, así que el software **no tiene defectos**». ¿Qué le respondes?',
          options: [
            'Las pruebas reducen la probabilidad de defectos no descubiertos, pero no demuestran que no existan',
            'Tienen razón: si las pruebas pasan, no hay defectos',
            'Solo es cierto si las pruebas son automáticas',
            'Solo es cierto si la cobertura es del 100 %',
          ],
          answer: 0,
          explanation: 'Es el primer principio de las pruebas: **muestran la presencia de defectos, no su ausencia**. Ni siquiera el 100 % de cobertura garantiza cero defectos.',
        },
      ],
    },

    // ─────────────── 2
    {
      id: 'f-error',
      icon: '🐞',
      title: 'Error, defecto y fallo',
      lesson: [
        {
          title: 'La cadena del bug',
          text: 'En la vida diaria decimos "bug" para todo, pero en pruebas distinguimos tres conceptos que forman una cadena:',
          table: {
            head: ['Término', 'Qué es', 'Ejemplo en PixelShop'],
            rows: [
              ['**Error** (equivocación)', 'Una acción **humana** que produce un resultado incorrecto', 'La desarrolladora entiende mal la regla del descuento'],
              ['**Defecto** (bug, falta)', 'Una imperfección en un **producto de trabajo** (código, requisito, diseño…)', 'En el código queda `if total > 200` en vez de `>= 200`'],
              ['**Fallo** (falla)', 'Cuando el sistema **no hace** lo que debería al ejecutarse', 'Una clienta que compra exactamente $200.000 no recibe su descuento'],
            ],
          },
          tip: 'Error → defecto → fallo. Las personas cometen **errores**, el código contiene **defectos** y el usuario ve **fallos**.',
        },
        {
          title: 'No todo defecto produce un fallo',
          points: [
            'Un defecto en un código que **nunca se ejecuta** no produce fallos (¡pero sigue ahí!).',
            'Un defecto puede necesitar **condiciones especiales** para manifestarse: un dato concreto, una fecha, mucha carga…',
            'Los fallos también pueden venir del **entorno**: radiación, campos magnéticos, hardware defectuoso.',
          ],
          code: {
            lang: 'py',
            code: code`
              def precio_final(total, es_socio):
                  if es_socio:
                      return total * 0.9
                  if total < 0:          # defecto: esta rama nunca se alcanza
                      return 0           # con los datos reales de la tienda
                  return total
            `,
          },
        },
        {
          title: 'Causa raíz',
          text: 'La **causa raíz** es la razón de fondo por la que apareció un defecto. Si solo corregimos el defecto, el mismo tipo de error volverá a ocurrir.',
          points: [
            '**Síntoma**: el total del carrito sale mal (fallo).',
            '**Defecto**: el código usa `>` en lugar de `>=`.',
            '**Causa raíz**: el requisito decía «compras de más de $200.000» y se interpretó de dos maneras.',
            '**Acción**: escribir los requisitos con ejemplos concretos (criterios de aceptación).',
          ],
          tip: 'Analizar la causa raíz es lo que convierte un bug en una **lección** para todo el equipo.',
        },
        {
          title: 'Falsos positivos y falsos negativos',
          table: {
            head: ['Resultado', 'Qué significa'],
            rows: [
              ['**Falso positivo**', 'La prueba **reporta un fallo** pero el sistema está bien (por ejemplo, la prueba tiene un error o el entorno falló).'],
              ['**Falso negativo**', 'La prueba **pasa** pero el sistema tiene un defecto que debería haber detectado.'],
            ],
          },
          tip: 'Los falsos negativos son los más peligrosos: dan una **falsa sensación de seguridad**. 😱',
          mood: 'wow',
        },
      ],
      challenges: [
        {
          type: 'classify',
          question: '¿Es un error, un defecto o un fallo?',
          bins: [
            { id: 'error', label: '🧠 Error' },
            { id: 'defecto', label: '🐛 Defecto' },
            { id: 'fallo', label: '💥 Fallo' },
          ],
          items: [
            { text: 'El analista confunde "días hábiles" con "días calendario"', bin: 'error' },
            { text: 'El requisito del envío gratis tiene una condición contradictoria', bin: 'defecto' },
            { text: 'Al pagar con tarjeta, la página muestra un error 500', bin: 'fallo' },
            { text: 'La función `calcular_iva` multiplica por 0.16 en lugar de 0.19', bin: 'defecto' },
            { text: 'La programadora, con prisa, copia y pega la función equivocada', bin: 'error' },
            { text: 'El correo de confirmación llega con el nombre de otro cliente', bin: 'fallo' },
          ],
          explanation: 'Los **errores** los cometen personas; los **defectos** viven en los productos de trabajo (también en requisitos y diseños); los **fallos** se observan al ejecutar.',
        },
        {
          type: 'bughunt',
          question: 'La regla dice: «**Envío gratis en compras de $150.000 o más**». ¿Dónde está el defecto?',
          code: code`
            ENVIO = 12000
            MINIMO_ENVIO_GRATIS = 150000

            def costo_envio(total):
                if total > MINIMO_ENVIO_GRATIS:
                    return 0
                return ENVIO
          `,
          bugs: [5],
          explanation: 'Con `>` una compra de **exactamente $150.000** paga envío, pero la regla dice "o más". Debería ser `>=`. Los defectos en los **límites** son de los más comunes.',
        },
        {
          type: 'quiz',
          question: 'Una prueba automática de PixelShop **falla** porque el servidor de pruebas estaba caído, pero la app no tiene ningún problema. Eso es un…',
          options: ['Falso positivo', 'Falso negativo', 'Defecto de la app', 'Fallo del usuario'],
          answer: 0,
          explanation: 'La prueba "acusa" un problema que no existe en la app: es un **falso positivo**. Hay que revisar el entorno y la prueba antes de reportar un defecto.',
        },
        {
          type: 'order',
          question: 'Ordena la cadena, desde el origen hasta lo que ve el usuario.',
          steps: [
            'Un desarrollador **malinterpreta** la regla de los cupones (error)',
            'El código aplica el cupón **dos veces** (defecto)',
            'Una clienta usa el cupón y ve un total **más bajo** del que corresponde (fallo)',
            'Se reporta el problema y el equipo busca la **causa raíz**',
          ],
          explanation: 'Error humano → defecto en el producto → fallo observable. Luego el análisis de causa raíz evita que se repita.',
        },
        {
          type: 'quiz',
          question: 'El código de PixelShop tiene un defecto en una función que **nunca se llama**. ¿Qué es cierto?',
          options: [
            'Es un defecto, aunque no produzca fallos mientras no se ejecute',
            'No es un defecto porque no produce fallos',
            'Es un fallo latente que se ve en la interfaz',
            'Es un falso positivo',
          ],
          answer: 0,
          explanation: 'El defecto existe aunque esté "dormido". Si un día alguien llama a esa función, aparecerá el fallo. Por eso también se hacen **revisiones** del código.',
        },
      ],
    },

    // ─────────────── 3
    {
      id: 'f-principios',
      icon: '📜',
      title: 'Los 7 principios de las pruebas',
      lesson: [
        {
          title: 'Siete verdades que todo tester conoce',
          table: {
            head: ['#', 'Principio', 'En pocas palabras'],
            rows: [
              ['1', '**Las pruebas muestran la presencia de defectos, no su ausencia**', 'Encontrar 0 bugs no prueba que no haya bugs.'],
              ['2', '**Las pruebas exhaustivas son imposibles**', 'No se pueden probar todas las combinaciones: hay que priorizar.'],
              ['3', '**Las pruebas tempranas ahorran tiempo y dinero**', 'Cuanto antes se encuentra un defecto, más barato es.'],
              ['4', '**Los defectos se agrupan**', 'Pocos módulos concentran la mayoría de los defectos.'],
              ['5', '**Las pruebas se desgastan**', 'Repetir siempre las mismas pruebas deja de encontrar defectos nuevos.'],
              ['6', '**Las pruebas dependen del contexto**', 'No se prueba igual un videojuego que un marcapasos.'],
              ['7', '**La falacia de la ausencia de defectos**', 'Un sistema sin defectos puede no servirle a nadie.'],
            ],
          },
        },
        {
          title: '¿Por qué es imposible probarlo todo?',
          text: 'Un formulario de PixelShop tiene 3 campos de texto de hasta 20 caracteres. Con solo letras minúsculas, cada campo admite más de 26²⁰ valores… ¡y combinarlos es astronómico!',
          points: [
            'Por eso usamos **técnicas de diseño** (particiones, límites…) para elegir pocas pruebas con mucho poder.',
            'Y priorizamos según el **riesgo**: probamos más lo que más puede fallar o más daño hace.',
          ],
          tip: 'Principio 2 + principio 4: concentra el esfuerzo donde se agrupan los defectos.',
        },
        {
          title: 'La paradoja del pesticida',
          text: 'El principio 5 antes se llamaba **paradoja del pesticida**: igual que los insectos se vuelven resistentes al mismo veneno, el software "se acostumbra" a las mismas pruebas.',
          points: [
            'Las pruebas de **regresión** automáticas siguen siendo valiosas (detectan si algo que funcionaba se rompió)…',
            '…pero para encontrar defectos **nuevos** hay que **actualizar** las pruebas y crear otras distintas.',
          ],
          mood: 'wow',
        },
        {
          title: 'La falacia de la ausencia de defectos',
          text: 'PixelShop podría pasar el 100 % de sus pruebas y aun así fracasar si los clientes no encuentran cómo pagar, si es lentísima o si no resuelve lo que necesitan.',
          tip: 'Por eso además de **verificar** (¿lo construimos bien?) hay que **validar** (¿construimos lo correcto?).',
        },
      ],
      challenges: [
        {
          type: 'classify',
          question: '¿Qué principio describe cada situación?',
          bins: [
            { id: 'exh', label: '♾️ Exhaustivas imposibles' },
            { id: 'agr', label: '🎯 Los defectos se agrupan' },
            { id: 'des', label: '🧴 Las pruebas se desgastan' },
            { id: 'ctx', label: '🌍 Dependen del contexto' },
          ],
          items: [
            { text: 'El 80 % de los bugs de PixelShop están en el módulo de pagos', bin: 'agr' },
            { text: 'Hace un año que la batería de pruebas no encuentra nada nuevo, aunque los usuarios sí reportan fallos', bin: 'des' },
            { text: 'Un software de dispositivos médicos exige pruebas mucho más rigurosas que una app de recetas', bin: 'ctx' },
            { text: 'No podemos probar todas las combinaciones de filtros del catálogo', bin: 'exh' },
            { text: 'El buscador tuvo 15 bugs el mes pasado: conviene probarlo más a fondo', bin: 'agr' },
            { text: 'Una startup prioriza salir rápido; un banco prioriza la seguridad', bin: 'ctx' },
          ],
          explanation: 'Reconocer el principio detrás de cada situación ayuda a decidir **qué hacer**: concentrar esfuerzo, renovar pruebas, adaptar el rigor o priorizar.',
        },
        {
          type: 'quiz',
          question: 'PixelShop pasó todas sus pruebas, pero los clientes la abandonan porque **no encuentran el botón de pagar**. ¿Qué principio ilustra?',
          options: [
            'La falacia de la ausencia de defectos',
            'Las pruebas se desgastan',
            'Las pruebas tempranas ahorran dinero',
            'Los defectos se agrupan',
          ],
          answer: 0,
          explanation: 'Sin defectos "técnicos", el producto igual falla en lo importante: servir a sus usuarios.',
        },
        {
          type: 'quiz',
          question: 'Encontrar un defecto en el **requisito** cuesta mucho menos que encontrarlo en producción. ¿Qué principio es?',
          options: ['Las pruebas tempranas ahorran tiempo y dinero', 'Las pruebas dependen del contexto', 'Las pruebas exhaustivas son imposibles', 'La falacia de la ausencia de defectos'],
          answer: 0,
          explanation: 'Es el fundamento del **shift-left**: probar (y revisar) lo antes posible en el ciclo de vida.',
        },
        {
          type: 'pick',
          question: 'Tu batería de pruebas de regresión ya no encuentra defectos nuevos. ¿Qué acciones ayudan? (marca todas las correctas)',
          options: [
            { text: 'Revisar y actualizar los casos de prueba existentes', correct: true },
            { text: 'Agregar pruebas nuevas con otros datos y escenarios', correct: true },
            { text: 'Hacer sesiones de pruebas exploratorias', correct: true },
            { text: 'Ejecutar las mismas pruebas el doble de veces', correct: false },
            { text: 'Borrar todas las pruebas de regresión', correct: false },
          ],
          explanation: 'Contra el desgaste: **renovar** pruebas y explorar. Pero no borres la regresión: sigue protegiendo lo que ya funcionaba.',
        },
        {
          type: 'quiz',
          question: 'Un compañero dice: «Probemos todas las combinaciones posibles del formulario de pago para estar seguros». ¿Qué principio usarías para responderle?',
          options: [
            'Las pruebas exhaustivas son imposibles: hay que usar técnicas y priorizar por riesgo',
            'Los defectos se agrupan: solo hay que probar el pago',
            'Las pruebas dependen del contexto: en pagos no hace falta probar',
            'Las pruebas se desgastan: mejor no probar',
          ],
          answer: 0,
          explanation: 'Salvo casos triviales, probar todo es imposible. Con **particiones** y **valores límite** cubrimos mucho con pocas pruebas.',
        },
      ],
    },

    // ─────────────── 4
    {
      id: 'f-iso',
      icon: '🏅',
      title: 'El modelo ISO/IEC 25010',
      lesson: [
        {
          title: 'Un idioma común para la calidad',
          text: 'La norma **ISO/IEC 25010** define un **modelo de calidad del producto**: una lista de características para hablar de calidad de forma precisa. La versión **2023** tiene 9 características:',
          table: {
            head: ['Característica', 'Pregunta clave'],
            rows: [
              ['**Adecuación funcional**', '¿Hace lo que tiene que hacer, completo y correcto?'],
              ['**Eficiencia de desempeño**', '¿Responde rápido y usa bien los recursos?'],
              ['**Compatibilidad**', '¿Convive e intercambia datos con otros sistemas?'],
              ['**Capacidad de interacción**', '¿Es fácil de aprender, usar y accesible? (antes "usabilidad")'],
              ['**Fiabilidad**', '¿Funciona sin fallar, se recupera y está disponible?'],
              ['**Seguridad**', '¿Protege la información frente a accesos no autorizados?'],
              ['**Mantenibilidad**', '¿Es fácil de modificar, analizar y probar?'],
              ['**Flexibilidad**', '¿Se adapta a otros entornos, escala, se instala bien? (antes "portabilidad")'],
              ['**Protección** (safety)', '¿Evita poner en peligro a personas, bienes o el entorno?'],
            ],
          },
        },
        {
          title: 'Subcaracterísticas: el detalle',
          points: [
            '**Adecuación funcional** → completitud, corrección, pertinencia funcional.',
            '**Eficiencia de desempeño** → comportamiento temporal, uso de recursos, capacidad.',
            '**Fiabilidad** → ausencia de fallos, disponibilidad, tolerancia a fallos, recuperabilidad.',
            '**Seguridad** → confidencialidad, integridad, no repudio, responsabilidad, autenticidad, resistencia.',
            '**Mantenibilidad** → modularidad, reusabilidad, analizabilidad, modificabilidad, **capacidad de ser probado**.',
          ],
          tip: 'La versión anterior (2011) tenía 8 características: la de 2023 renombró usabilidad y portabilidad y agregó **protección**.',
        },
        {
          title: 'Requisitos funcionales y no funcionales',
          table: {
            head: ['Tipo', 'Describe…', 'Ejemplo en PixelShop'],
            rows: [
              ['**Funcional**', '**Qué** hace el sistema', '«El cupón PIXEL10 descuenta el 10 % del total»'],
              ['**No funcional**', '**Cómo de bien** lo hace', '«La búsqueda responde en menos de 1 segundo con 500 usuarios»'],
            ],
          },
          tip: 'Un buen requisito no funcional es **medible**: "rápido" no se puede probar; "menos de 1 s en el 95 % de las peticiones" sí.',
        },
      ],
      challenges: [
        {
          type: 'classify',
          question: '¿Qué característica de ISO/IEC 25010 describe cada requisito de PixelShop?',
          bins: [
            { id: 'func', label: 'Adecuación funcional' },
            { id: 'perf', label: 'Eficiencia de desempeño' },
            { id: 'sec', label: 'Seguridad' },
            { id: 'inter', label: 'Capacidad de interacción' },
            { id: 'fiab', label: 'Fiabilidad' },
          ],
          items: [
            { text: 'El total del carrito suma correctamente los subtotales', bin: 'func' },
            { text: 'La página de producto carga en menos de 2 segundos', bin: 'perf' },
            { text: 'Las contraseñas se guardan cifradas', bin: 'sec' },
            { text: 'Un usuario nuevo completa su primera compra sin ayuda', bin: 'inter' },
            { text: 'La tienda está disponible el 99,9 % del tiempo', bin: 'fiab' },
            { text: 'Se puede navegar todo el sitio solo con el teclado', bin: 'inter' },
            { text: 'Un usuario no puede ver los pedidos de otro', bin: 'sec' },
            { text: 'Si cae un servidor, otro atiende las peticiones sin perder pedidos', bin: 'fiab' },
          ],
          explanation: 'Clasificar requisitos con el modelo ayuda a no olvidar ninguna dimensión de la calidad al planificar las pruebas.',
        },
        {
          type: 'classify',
          question: '¿Requisito funcional o no funcional?',
          bins: [
            { id: 'f', label: '⚙️ Funcional' },
            { id: 'nf', label: '📏 No funcional' },
          ],
          items: [
            { text: 'El sistema envía un correo de confirmación tras cada compra', bin: 'f' },
            { text: 'El sistema soporta 1.000 usuarios simultáneos', bin: 'nf' },
            { text: 'El buscador filtra productos por nombre', bin: 'f' },
            { text: 'El sitio cumple el nivel AA de las pautas WCAG', bin: 'nf' },
            { text: 'Un administrador puede crear cupones de descuento', bin: 'f' },
            { text: 'El código tiene al menos 80 % de cobertura de pruebas', bin: 'nf' },
          ],
          explanation: 'Lo **funcional** dice qué hace; lo **no funcional**, cómo de bien (rendimiento, accesibilidad, mantenibilidad…).',
        },
        {
          type: 'quiz',
          question: '¿Cuál de estos requisitos **se puede probar** objetivamente?',
          options: [
            'El 95 % de las búsquedas responde en menos de 800 ms con 200 usuarios simultáneos',
            'La búsqueda debe ser rápida',
            'El sistema debe ser fácil de usar',
            'La aplicación debe tener buena calidad',
          ],
          answer: 0,
          explanation: 'Solo el primero tiene una **métrica** y un **umbral**. Los demás hay que reescribirlos antes de poder probarlos.',
        },
        {
          type: 'quiz',
          question: 'En ISO/IEC 25010:2023, ¿qué característica es **nueva** respecto a la versión de 2011?',
          options: ['Protección (safety)', 'Seguridad', 'Fiabilidad', 'Mantenibilidad'],
          answer: 0,
          explanation: 'La **protección** se ocupa de no poner en peligro a personas o al entorno. Además, usabilidad pasó a llamarse **capacidad de interacción** y portabilidad, **flexibilidad**.',
        },
        {
          type: 'pick',
          question: 'Marca las subcaracterísticas de la **mantenibilidad**.',
          options: [
            { text: 'Capacidad de ser probado', correct: true },
            { text: 'Modularidad', correct: true },
            { text: 'Modificabilidad', correct: true },
            { text: 'Confidencialidad', correct: false },
            { text: 'Comportamiento temporal', correct: false },
          ],
          explanation: 'Un código modular y fácil de probar es más fácil de mantener. Confidencialidad es de **seguridad** y el comportamiento temporal de **eficiencia de desempeño**.',
        },
      ],
    },

    // ─────────────── 5
    {
      id: 'f-vv',
      icon: '⚖️',
      title: 'Verificación, validación y depuración',
      lesson: [
        {
          title: '¿Lo construimos bien? ¿Construimos lo correcto?',
          table: {
            head: ['', 'Verificación', 'Validación'],
            rows: [
              ['Pregunta', '¿Construimos el producto **correctamente**?', '¿Construimos el producto **correcto**?'],
              ['Compara contra…', 'Los requisitos y especificaciones', 'Las necesidades reales de los usuarios'],
              ['Ejemplo', 'El cupón descuenta el 10 % como dice el requisito', 'A los clientes les sirve y entienden el cupón'],
            ],
          },
          tip: 'Truco para recordarlo: **V**erificación = **v**ersus la especificación; **Val**idación = **val**or para el usuario.',
        },
        {
          title: 'Pruebas estáticas y dinámicas',
          points: [
            '**Pruebas estáticas**: examinan el producto **sin ejecutarlo**: revisiones de requisitos o código, análisis estático (linters).',
            '**Pruebas dinámicas**: **ejecutan** el software y comparan el resultado obtenido con el esperado.',
            'Son complementarias: las estáticas encuentran defectos (en requisitos, por ejemplo) que las dinámicas no pueden ver.',
          ],
        },
        {
          title: 'Probar no es depurar',
          table: {
            head: ['Actividad', 'Quién suele hacerla', 'Objetivo'],
            rows: [
              ['**Probar**', 'Testers (y también devs)', 'Provocar fallos y encontrar defectos'],
              ['**Depurar** (debugging)', 'Desarrolladores', 'Encontrar la **causa** del fallo, corregir el defecto y comprobar la corrección'],
            ],
          },
          points: ['Después de depurar se hace una **prueba de confirmación** (re-test) para verificar que el defecto se corrigió.', 'Y pruebas de **regresión** para comprobar que la corrección no rompió otra cosa.'],
        },
      ],
      challenges: [
        {
          type: 'classify',
          question: '¿Verificación o validación?',
          bins: [
            { id: 'ver', label: '📐 Verificación' },
            { id: 'val', label: '🙋 Validación' },
          ],
          items: [
            { text: 'Comprobar que el total incluye el IVA del 19 %, como dice el requisito', bin: 'ver' },
            { text: 'Observar a clientes reales comprando y ver si se confunden', bin: 'val' },
            { text: 'Revisar que el diseño implementa todos los casos de uso especificados', bin: 'ver' },
            { text: 'Hacer una beta con 50 clientes y recoger su opinión', bin: 'val' },
            { text: 'Ejecutar las pruebas unitarias contra la especificación de la función', bin: 'ver' },
            { text: 'Preguntar al dueño de la tienda si el reporte de ventas le sirve', bin: 'val' },
          ],
          explanation: 'Verificar mira **la especificación**; validar mira **al usuario** y su necesidad real.',
        },
        {
          type: 'classify',
          question: '¿Prueba estática o dinámica?',
          bins: [
            { id: 'est', label: '📄 Estática (sin ejecutar)' },
            { id: 'din', label: '▶️ Dinámica (ejecutando)' },
          ],
          items: [
            { text: 'Revisar en equipo el documento de requisitos del carrito', bin: 'est' },
            { text: 'Ejecutar pytest sobre el módulo de cupones', bin: 'din' },
            { text: 'Pasar un linter que detecta variables sin usar', bin: 'est' },
            { text: 'Automatizar con Playwright el flujo de compra', bin: 'din' },
            { text: 'Hacer revisión de código (code review) de un pull request', bin: 'est' },
            { text: 'Medir el tiempo de respuesta con 500 usuarios virtuales', bin: 'din' },
          ],
          explanation: 'Las pruebas estáticas pueden hacerse incluso **antes** de que exista código ejecutable, por ejemplo sobre los requisitos.',
        },
        {
          type: 'order',
          question: 'Ordena lo que pasa desde que una prueba encuentra un fallo hasta cerrar el defecto.',
          steps: [
            'La prueba falla y el tester **reporta el defecto**',
            'El desarrollador **depura**: reproduce el fallo y encuentra la causa',
            'El desarrollador **corrige** el defecto',
            'El tester hace la **prueba de confirmación** (re-test)',
            'Se ejecuta la **regresión** para comprobar que no se rompió nada más',
          ],
          explanation: 'Probar encuentra; depurar corrige; confirmación y regresión comprueban.',
        },
        {
          type: 'quiz',
          question: '¿Cuál de estas actividades es **depuración** y no prueba?',
          options: [
            'Poner un punto de interrupción para ver por qué la variable `total` vale negativo',
            'Diseñar casos de prueba para el carrito',
            'Ejecutar la regresión antes de publicar',
            'Revisar los criterios de aceptación de una historia',
          ],
          answer: 0,
          explanation: 'Buscar la **causa** de un fallo dentro del código (con un depurador, por ejemplo) es depurar.',
        },
      ],
    },

    // ─────────────── 6
    {
      id: 'f-inspeccion',
      icon: '🔦',
      title: 'Proyecto: tu primera inspección',
      project: true,
      lesson: [
        {
          title: 'El costo de un defecto crece con el tiempo',
          text: 'Un defecto encontrado en los requisitos se corrige cambiando un párrafo. El mismo defecto encontrado en producción puede obligar a cambiar código, datos, documentación, avisar a clientes… Varios estudios (con cifras discutidas) muestran que el costo **crece mucho** en cada fase.',
          table: {
            head: ['Fase en que se encuentra', 'Costo relativo aproximado'],
            rows: [
              ['Requisitos', '1×'],
              ['Diseño', '≈ 5×'],
              ['Codificación', '≈ 10×'],
              ['Pruebas del sistema', '≈ 20×'],
              ['Producción', '≈ 100× o más'],
            ],
          },
          tip: 'Las cifras exactas varían según el estudio, pero la tendencia es clara: **cuanto antes, más barato**.',
        },
        {
          title: 'Shift-left: mover las pruebas a la izquierda',
          points: [
            'Revisar requisitos e historias de usuario **antes** de programar.',
            'Escribir pruebas **antes** o **junto** con el código (TDD).',
            'Ejecutar pruebas automáticas en cada cambio (integración continua).',
            'Involucrar a testers desde el **primer día** del proyecto.',
          ],
          mood: 'happy',
        },
        {
          title: 'Tu misión',
          text: 'La Agencia te envía a inspeccionar **PixelShop**. Revisa pantallas, encuentra los defectos y aplica todo lo que aprendiste en este mundo. ¡Bichi confía en ti! 🔍',
          mood: 'happy',
        },
      ],
      challenges: [
        {
          type: 'order',
          question: 'Ordena las fases de **menor a mayor** costo de corregir un mismo defecto.',
          steps: ['Requisitos', 'Diseño', 'Codificación', 'Pruebas del sistema', 'Producción'],
          explanation: 'Por eso invertir en revisar requisitos y en pruebas tempranas es tan rentable.',
        },
        {
          type: 'bughunt',
          question: 'Inspecciona el carrito. Un **Teclado mecánico** cuesta $250.000 y un **Mouse inalámbrico** $80.000. ¿Dónde está el defecto?',
          screen: shop(`
            <h3>Tu carrito</h3>
            <table>
              <tr><th>Producto</th><th>Cantidad</th><th>Subtotal</th></tr>
              <tr><td data-spot="p1">Teclado mecánico</td><td data-spot="c1">1</td><td data-spot="s1">$250.000</td></tr>
              <tr><td data-spot="p2">Mouse inalámbrico</td><td data-spot="c2">2</td><td data-spot="s2">$80.000</td></tr>
            </table>
            <p class="m-row" style="font-size:18px;font-weight:800" data-spot="total">Total: $330.000</p>
            <span class="m-btn" data-spot="pagar">Ir a pagar</span>
          `),
          bugs: ['s2'],
          explanation: '2 mouse × $80.000 = **$160.000**, pero el subtotal muestra $80.000: ignora la cantidad. (Y por eso el total también está mal: debería ser $410.000.)',
        },
        {
          type: 'bughunt',
          question: 'Ahora el formulario de inicio de sesión. Encuentra los **2 defectos**.',
          screen: shop(
            `
            <h3>Iniciar sesión</h3>
            <div class="m-card" style="max-width:360px;display:grid;gap:8px">
              <span class="m-label">Correo electrónico</span><span class="m-input" data-spot="email">ana@pixelshop.test</span>
              <span class="m-label">Contraseña</span><span class="m-input" data-spot="clave">Clave123</span>
              <span class="m-alert" data-spot="alerta">Contraseña incorrecta para ana@pixelshop.test</span>
              <span class="m-btn" data-spot="entrar">Entrar</span>
            </div>
          `,
            'Inicio · Carrito (0) · Iniciar sesión',
          ),
          bugs: ['clave', 'alerta'],
          explanation: 'La contraseña se muestra **en claro** (debería verse como ••••••) y el mensaje revela que el correo **existe**, lo que ayuda a un atacante. Lo seguro es un mensaje genérico: «Correo o contraseña incorrectos».',
        },
        {
          type: 'quiz',
          question: 'El defecto del subtotal se encontró en **producción** y no en la revisión del diseño. ¿Qué consecuencia es la más probable?',
          options: [
            'Corregirlo cuesta mucho más: hay que arreglar código, revisar pedidos afectados y avisar a clientes',
            'Cuesta lo mismo: un defecto es un defecto',
            'Es más barato porque ya se sabe dónde está',
            'No hay que corregirlo porque ya está en producción',
          ],
          answer: 0,
          explanation: 'En producción el defecto ya causó **fallos reales**: pedidos mal cobrados, reclamos, posibles pérdidas. Cuanto más tarde, más caro.',
        },
        {
          type: 'pick',
          question: '¿Qué prácticas son **shift-left**?',
          options: [
            { text: 'Revisar las historias de usuario con el equipo antes de programar', correct: true },
            { text: 'Escribir las pruebas unitarias antes que el código (TDD)', correct: true },
            { text: 'Ejecutar las pruebas automáticas en cada commit', correct: true },
            { text: 'Probar solo cuando el producto esté terminado', correct: false },
            { text: 'Esperar a que los usuarios reporten los fallos', correct: false },
          ],
          explanation: 'Shift-left = adelantar las actividades de calidad en el ciclo de vida para encontrar defectos **antes**.',
        },
      ],
    },
  ],
};
