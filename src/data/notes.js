// Apuntes: chuletas de referencia de cada mundo.
// Cada tarjeta: { title, text?, rows?: [[término, descripción]], mono? (términos en fuente de código), code?, wide? }
import { code } from './helpers.js';

export const NOTES = {
  fundamentos: [
    {
      title: 'Conceptos clave',
      rows: [
        ['**Calidad**', 'Grado en que el software satisface requisitos y necesidades de los usuarios'],
        ['**QA**', 'Aseguramiento: proceso, prevenir defectos'],
        ['**QC / pruebas**', 'Control: producto, detectar defectos'],
        ['**Verificación**', '¿Lo construimos bien? (contra la especificación)'],
        ['**Validación**', '¿Construimos lo correcto? (contra la necesidad del usuario)'],
        ['**Depurar**', 'Encontrar la causa de un fallo y corregir el defecto (no es probar)'],
      ],
    },
    {
      title: 'Error → defecto → fallo',
      rows: [
        ['**Error**', 'Acción humana equivocada'],
        ['**Defecto**', 'Imperfección en un producto de trabajo (código, requisito…)'],
        ['**Fallo**', 'El sistema no hace lo que debe al ejecutarse'],
        ['**Causa raíz**', 'La razón de fondo por la que apareció el defecto'],
        ['**Falso positivo**', 'La prueba reporta un fallo que no existe'],
        ['**Falso negativo**', 'La prueba pasa pero hay un defecto'],
      ],
    },
    {
      title: 'Los 7 principios (ISTQB)',
      wide: true,
      rows: [
        ['1', 'Las pruebas muestran la presencia de defectos, no su ausencia'],
        ['2', 'Las pruebas exhaustivas son imposibles'],
        ['3', 'Las pruebas tempranas ahorran tiempo y dinero'],
        ['4', 'Los defectos se agrupan'],
        ['5', 'Las pruebas se desgastan (paradoja del pesticida)'],
        ['6', 'Las pruebas dependen del contexto'],
        ['7', 'La falacia de la ausencia de defectos'],
      ],
    },
    {
      title: 'ISO/IEC 25010:2023',
      rows: [
        ['Adecuación funcional', 'Completitud, corrección, pertinencia'],
        ['Eficiencia de desempeño', 'Tiempo, recursos, capacidad'],
        ['Compatibilidad', 'Coexistencia, interoperabilidad'],
        ['Capacidad de interacción', 'Antes "usabilidad"; incluye accesibilidad'],
        ['Fiabilidad', 'Sin fallos, disponibilidad, tolerancia, recuperación'],
        ['Seguridad', 'Confidencialidad, integridad, autenticidad…'],
        ['Mantenibilidad', 'Modularidad, analizabilidad, capacidad de ser probado…'],
        ['Flexibilidad', 'Antes "portabilidad"; adaptabilidad, escalabilidad'],
        ['Protección (safety)', 'No poner en peligro a personas ni al entorno'],
      ],
    },
  ],
  niveles: [
    {
      title: 'Proceso de pruebas (ISTQB v4)',
      rows: [
        ['Planificación', 'Objetivos, alcance, enfoque, recursos, calendario'],
        ['Monitorización y control', 'Continuo: comparar con el plan y corregir'],
        ['Análisis', '**Qué** probar: condiciones de prueba'],
        ['Diseño', '**Cómo** probar: casos de prueba'],
        ['Implementación', 'Datos, scripts, entornos listos'],
        ['Ejecución', 'Ejecutar, comparar, registrar incidencias'],
        ['Compleción', 'Informe final, archivo, lecciones aprendidas'],
      ],
    },
    {
      title: 'Niveles de prueba',
      rows: [
        ['Componente', 'Una unidad aislada (pytest)'],
        ['Integración de componentes', 'Interfaces entre módulos'],
        ['Sistema', 'El sistema completo, de punta a punta'],
        ['Integración de sistemas', 'Interfaces con sistemas externos'],
        ['Aceptación', 'UAT, operativa, contractual/regulatoria, alfa y beta'],
      ],
    },
    {
      title: 'Tipos de prueba',
      rows: [
        ['Funcional / no funcional', '**Qué** hace / **cómo de bien** lo hace'],
        ['Caja negra / caja blanca', 'Según la especificación / según el código'],
        ['Confirmación (re-test)', 'Repetir la prueba que falló tras corregir'],
        ['Regresión', 'Comprobar que un cambio no rompió nada'],
        ['Humo (smoke)', 'Lo básico funciona: ¿seguimos probando?'],
      ],
    },
    {
      title: 'Revisiones (de menos a más formal)',
      rows: [
        ['Informal', 'Sin proceso: "¿le echas un vistazo?"'],
        ['Revisión guiada', 'La guía el autor'],
        ['Revisión técnica', 'Expertos + moderador, buscan consenso'],
        ['Inspección', 'Proceso formal, roles, métricas; el autor no modera'],
      ],
    },
    {
      title: 'Pirámide y cuadrantes',
      text: 'Muchas **unitarias** (rápidas, baratas), algunas de **integración/API** y pocas **E2E**. Antipatrón: el cono de helado 🍦. Cuadrantes: Q1 unitarias · Q2 funcionales con el negocio · Q3 exploratorias y usabilidad · Q4 rendimiento y seguridad.',
    },
  ],
  diseno: [
    {
      title: 'Caso de prueba',
      rows: [
        ['ID y título', 'Identificar y describir'],
        ['Precondiciones', 'Estado necesario antes de empezar'],
        ['Datos', 'Valores concretos'],
        ['Pasos', 'Acciones en orden'],
        ['Resultado esperado', 'Lo que debe pasar, **verificable**'],
        ['Trazabilidad', 'Requisito o historia que cubre'],
      ],
    },
    {
      title: 'Técnicas de caja negra',
      rows: [
        ['Partición de equivalencia', 'Un valor por grupo que el sistema trata igual'],
        ['Valores límite (2 valores)', 'El límite y su vecino: 10 · 11'],
        ['Valores límite (3 valores)', 'El límite y sus dos vecinos: 9 · 10 · 11'],
        ['Tabla de decisión', 'Combinaciones de condiciones → acciones (2ⁿ reglas)'],
        ['Transición de estados', 'Estados, eventos y transiciones válidas e inválidas'],
      ],
    },
    {
      title: 'Caja blanca',
      rows: [
        ['Cobertura de sentencias', 'Sentencias ejecutadas ÷ total'],
        ['Cobertura de ramas', 'Salidas de decisiones ejecutadas ÷ total'],
        ['Relación', '100 % ramas ⇒ 100 % sentencias (no al revés)'],
        ['Complejidad ciclomática', 'Decisiones + 1'],
      ],
    },
    {
      title: 'Experiencia y colaboración',
      rows: [
        ['Predicción de errores', 'Atacar los errores típicos'],
        ['Exploratoria', 'Charter + sesión con tiempo + notas'],
        ['Lista de comprobación', 'Verificar puntos de una checklist'],
        ['Criterios de aceptación', 'Dado / Cuando / Entonces'],
      ],
    },
  ],
  defectos: [
    {
      title: 'Reporte de defecto',
      rows: [
        ['Título', 'Dónde y qué pasa, concreto'],
        ['Entorno y versión', 'Navegador, SO, versión de la app'],
        ['Pasos', 'Reproducibles por cualquiera'],
        ['Esperado vs. obtenido', 'Siempre los dos'],
        ['Severidad / prioridad', 'Impacto técnico / urgencia de negocio'],
        ['Evidencias', 'Capturas, logs, trazas, video'],
      ],
    },
    {
      title: 'Ciclo de vida',
      text: 'Nuevo → Asignado → En progreso → Corregido → En re-test → **Cerrado**. Si el re-test falla → **Reabierto**. Otros: Rechazado, Duplicado, Diferido.',
    },
    {
      title: 'Riesgo y plan',
      rows: [
        ['Nivel de riesgo', 'Probabilidad × impacto'],
        ['Riesgo de producto', 'Afecta a la calidad del software'],
        ['Riesgo de proyecto', 'Afecta a plazos, personas, presupuesto'],
        ['Criterios de entrada', 'Cuándo se puede empezar'],
        ['Criterios de salida', 'Cuándo se puede terminar (medibles)'],
      ],
    },
    {
      title: 'Métricas',
      rows: [
        ['Avance', 'Ejecutados ÷ planificados'],
        ['Tasa de éxito', 'Pasan ÷ ejecutados'],
        ['Cobertura de requisitos', 'Requisitos con pruebas ÷ total'],
        ['DDP', 'Defectos en pruebas ÷ (en pruebas + en producción)'],
      ],
    },
  ],
  unitarias: [
    {
      title: 'pytest básico',
      mono: true,
      rows: [
        ['pytest -q / -v', 'Ejecutar (salida corta / detallada)'],
        ['test_*.py · def test_*', 'Convención de nombres'],
        ['assert x == y', 'Comprobar'],
        ['pytest.approx(0.3)', 'Comparar decimales'],
        ['with pytest.raises(ValueError):', 'Esperar una excepción'],
        ['pytest --cov=modulo', 'Cobertura (pytest-cov)'],
      ],
    },
    {
      title: 'Parametrize y fixtures',
      wide: true,
      code: {
        lang: 'py',
        code: code`
          @pytest.fixture
          def carrito():
              c = Carrito()
              yield c            # después del yield: limpieza

          @pytest.mark.parametrize("edad, esperado", [(17, False), (18, True)])
          def test_registro(edad, esperado):
              assert puede_registrarse(edad) == esperado
        `,
      },
    },
    {
      title: 'Dobles de prueba',
      mono: true,
      rows: [
        ['Mock()', 'Objeto doble de unittest.mock'],
        ['m.metodo.return_value = …', 'Respuesta preparada (stub)'],
        ['m.metodo.assert_called_once_with(…)', 'Verificar la llamada (mock)'],
        ['m.metodo.assert_not_called()', 'Verificar que no se llamó'],
        ['monkeypatch.setattr(obj, "x", v)', 'Reemplazo temporal (fixture de pytest)'],
      ],
    },
    {
      title: 'Buenas pruebas',
      rows: [
        ['AAA', 'Arrange · Act · Assert'],
        ['FIRST', 'Fast · Independent · Repeatable · Self-validating · Timely'],
        ['TDD', 'Rojo → verde → refactor'],
        ['Mutación', 'Si siembras un bug y ninguna prueba falla, faltan pruebas'],
      ],
    },
  ],
  playwright: [
    {
      title: 'Instalar y ejecutar',
      mono: true,
      rows: [
        ['pip install pytest-playwright', 'Plugin para pytest'],
        ['playwright install', 'Descargar navegadores'],
        ['pytest --headed --slowmo 500', 'Ver el navegador, despacio'],
        ['pytest --browser firefox', 'Elegir navegador'],
        ['playwright codegen URL', 'Grabar y generar código'],
        ['pytest --tracing retain-on-failure', 'Guardar trazas de los fallos'],
        ['playwright show-trace trace.zip', 'Abrir el trace viewer'],
      ],
    },
    {
      title: 'Locators (en orden de preferencia)',
      mono: true,
      rows: [
        ['get_by_role("button", name="Entrar")', 'Rol + nombre accesible'],
        ['get_by_label("Contraseña")', 'Campos de formulario'],
        ['get_by_placeholder("Buscar")', 'Por placeholder'],
        ['get_by_text("Tu carrito está vacío")', 'Por texto'],
        ['get_by_test_id("total")', 'Atributo data-testid'],
        ['.filter(has_text="Teclado")', 'Refinar una lista'],
        ['.first / .last / .nth(2)', 'Por posición (con cuidado)'],
      ],
    },
    {
      title: 'Acciones',
      mono: true,
      rows: [
        ['.click()', 'Clic'],
        ['.fill("texto")', 'Escribir (reemplaza)'],
        ['.press("Enter")', 'Tecla'],
        ['.check() / .uncheck()', 'Casillas'],
        ['.select_option("Cali")', 'Listas desplegables'],
        ['page.goto("/login")', 'Navegar'],
      ],
    },
    {
      title: 'Aserciones (expect)',
      mono: true,
      rows: [
        ['to_be_visible() / to_be_hidden()', 'Visibilidad'],
        ['to_have_text("…") / to_contain_text("…")', 'Texto'],
        ['to_have_count(n)', 'Cantidad'],
        ['to_have_value("…")', 'Valor de un campo'],
        ['to_be_enabled() / to_be_disabled()', 'Estado'],
        ['expect(page).to_have_url(…)', 'URL'],
        ['not_to_…', 'Versión negativa'],
      ],
    },
  ],
  avanzado: [
    {
      title: 'Rendimiento',
      rows: [
        ['Carga', 'Carga esperada'],
        ['Estrés', 'Más allá del límite'],
        ['Picos', 'Aumentos bruscos'],
        ['Resistencia (soak)', 'Horas o días'],
        ['p95', 'El 95 % de las peticiones tarda eso o menos'],
        ['Herramientas', 'Locust (Python), k6, JMeter'],
      ],
    },
    {
      title: 'Seguridad (OWASP)',
      rows: [
        ['Control de acceso roto', '¿Puedo ver lo que no es mío?'],
        ['Inyección', 'Nunca pegar datos del usuario en SQL o comandos'],
        ['XSS', 'Escapar la salida'],
        ['Autenticación', 'Bloqueos, mensajes genéricos'],
        ['Criptografía', 'HTTPS, contraseñas con hash'],
      ],
    },
    {
      title: 'Accesibilidad (WCAG 2.2)',
      rows: [
        ['POUR', 'Perceptible · Operable · Comprensible · Robusto'],
        ['Niveles', 'A · AA (habitual) · AAA'],
        ['Contraste AA', '4.5:1 en texto normal'],
        ['Herramientas', 'axe, Lighthouse, WAVE + teclado + lector de pantalla'],
      ],
    },
    {
      title: 'API y CI',
      rows: [
        ['200 / 201 / 204', 'OK / creado / sin contenido'],
        ['400 / 401 / 403 / 404 / 422', 'Errores del cliente'],
        ['500', 'Error del servidor (¡sospechoso!)'],
        ['CI', 'Pruebas en cada push: lo rápido primero, evidencias si falla'],
        ['Flaky', 'Prueba inestable: investigar la causa, no solo reintentar'],
      ],
    },
  ],
};
