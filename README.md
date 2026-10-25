# ✅ Misión: Calidad

> **Software III · Calidad y pruebas** · De los fundamentos de las pruebas a la automatización con pytest y Playwright.

Una web gamificada en español para aprender **pruebas de software como un profesional**. El estudiante entra a la **Agencia de Calidad** y su misión es dejar sin bugs a **PixelShop**, una tienda online de práctica. Lo guía **Bichi**, un bug reformado que ahora caza a sus antiguos compañeros. 🐞🔍

1. 🧭 **Fundamentos**: qué es la calidad, error/defecto/fallo, los 7 principios e ISO/IEC 25010.
2. 🏗️ **Niveles y tipos**: el proceso de pruebas, los niveles, los tipos, la pirámide y las revisiones.
3. 🎯 **Diseño de casos**: particiones, valores límite, tablas de decisión, estados y cobertura.
4. 🐛 **Defectos y gestión**: reportes, severidad y prioridad, ciclo de vida, riesgos y métricas.
5. 🧪 **pytest**: pruebas unitarias **reales**, con fixtures, parametrización, mocks y TDD.
6. 🎭 **Playwright**: pruebas E2E sobre PixelShop con locators, aserciones y Page Object Model.
7. ⚙️ **Más allá de lo funcional**: rendimiento, seguridad, accesibilidad, APIs e integración continua.

La terminología sigue el temario **ISTQB Foundation v4** en español, así que también sirve como preparación para quien quiera certificarse.

Lo más especial: **Python y pytest se ejecutan de verdad dentro del navegador** (con Pyodide), sin instalar nada. Las pruebas del estudiante se ejecutan contra el código correcto **y contra versiones con bugs sembrados**: si sus pruebas no detectan los bugs, el reto no está superado. Al final hay una **licencia de inspector/a** que gana sellos y un **diploma** imprimible.

---

## 📑 Índice

1. [Resumen rápido](#-resumen-rápido)
2. [Requisitos](#-requisitos)
3. [Puertos](#-puertos)
4. [Cómo levantarlo con Docker](#-cómo-levantarlo-con-docker)
5. [Comprobar, detener y actualizar](#-comprobar-detener-y-actualizar)
6. [Usarlo en clase](#-usarlo-en-clase)
7. [Contenido: 7 mundos y 46 niveles](#-contenido-7-mundos-y-46-niveles)
8. [Tipos de reto](#-tipos-de-reto)
9. [PixelShop y el simulador de Playwright](#-pixelshop-y-el-simulador-de-playwright)
10. [Mecánica de juego](#-mecánica-de-juego)
11. [Editar o ampliar el contenido](#-editar-o-ampliar-el-contenido)
12. [Control de calidad de los retos (`?qa`)](#-control-de-calidad-de-los-retos-qa)
13. [Estructura del proyecto](#-estructura-del-proyecto)
14. [Solución de problemas](#-solución-de-problemas)
15. [Tecnología](#-tecnología)

---

## ⚡ Resumen rápido

| Qué | Valor |
|---|---|
| Dirección del juego | **http://localhost:8084** |
| Arrancar (Windows) | Doble clic en **`iniciar.bat`** |
| Detener (Windows) | Doble clic en **`detener.bat`** |
| Arrancar (terminal) | `docker compose up -d --build` |
| Detener (terminal) | `docker compose down` |
| Contenedor | `calidad-quest` |
| Requisito único | **Docker Desktop** abierto |

---

## 🧰 Requisitos

Solo **Docker**. No hace falta instalar Python, pytest, Playwright ni Node.js: todo va dentro del contenedor.

| Sistema | Qué instalar |
|---|---|
| **Windows 10/11** | [Docker Desktop](https://www.docker.com/products/docker-desktop/) (usa WSL 2) |
| **macOS** | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |
| **Linux** | Docker Engine + plugin **Docker Compose v2** |

- **Internet la primera vez**, para descargar las imágenes y las librerías. Después funciona **sin conexión**: Python (Pyodide) y pytest se sirven desde el propio contenedor, no desde un CDN.
- Navegador moderno (**Chrome, Edge o Firefox**) en un **ordenador**: los retos de código están pensados para teclado y pantalla grande.

Comprueba que Docker funciona:

```bash
docker --version
```

```bash
docker compose version
```

---

## 🔌 Puertos

| Puerto | Para qué |
|---|---|
| **8084** | **Versión para clase** (la web compilada, servida con Nginx) |
| **5176** | Versión de **desarrollo** con recarga automática (solo para editar contenidos) |

Los puertos no chocan con los otros juegos del curso: Casos de Uso (8080), UML (8081) y Frontend (8083).

**¿El 8084 está ocupado?**

1. En `docker-compose.yml`, cambia el número de la **izquierda**: `"9084:80"`. El 80 de la derecha no se toca.
2. Cambia también la dirección en `iniciar.bat`.
3. Vuelve a arrancar.

---

## 🚀 Cómo levantarlo con Docker

### Windows: doble clic

1. Abre **Docker Desktop** y espera a *Engine running*.
2. Haz doble clic en **`iniciar.bat`**. La primera vez tarda 1–3 minutos (compila la web).
3. Se abre el navegador en **http://localhost:8084**.

### Cualquier sistema: terminal

Desde la carpeta del proyecto:

```bash
docker compose up -d --build
```

Después abre **http://localhost:8084**.

### ¿Qué hace Docker?

El `Dockerfile` trabaja en dos etapas:

1. **Node 20** instala las dependencias, copia el núcleo de **Pyodide** (Python compilado a WebAssembly) a `public/pyodide` y compila la web (`npm run build`).
2. **Nginx** sirve la carpeta compilada en el puerto 80 del contenedor, que `docker-compose.yml` publica en el **8084**.

Las librerías de Python que usa el juego (**pytest 8.3** y sus dependencias) están en `public/wheels/`, incluidas en el repositorio.

El contenedor se reinicia solo al encender el ordenador, siempre que Docker Desktop esté abierto.

---

## ✅ Comprobar, detener y actualizar

| Acción | Comando |
|---|---|
| Ver el estado | `docker compose ps` |
| Ver los mensajes | `docker compose logs -f web` |
| Detener | `docker compose down` (o `detener.bat`) |
| Aplicar cambios del contenido | `docker compose up -d --build` (o `iniciar.bat`) |
| Reconstruir desde cero | `docker compose build --no-cache` y luego `docker compose up -d` |

---

## 🏫 Usarlo en clase

- **Cada estudiante en su ordenador** (recomendado): clona o descarga el repositorio y ejecuta `iniciar.bat`.
- **Un ordenador para toda la clase**: levántalo en el tuyo y comparte `http://TU-IP:8084`. Para ver tu IP en Windows, ejecuta `ipconfig` (*Dirección IPv4*). Si no carga, abre el puerto en el firewall con PowerShell como administrador:
  ```powershell
  New-NetFirewallRule -DisplayName "Mision Calidad 8084" -Direction Inbound -Protocol TCP -LocalPort 8084 -Action Allow
  ```
- La **primera vez** que un estudiante llega a un reto de Python, el navegador descarga y prepara Python (unos 14 MB, entre 3 y 10 segundos). Después queda en la caché del navegador.

### Progreso, licencia y diploma

- El progreso se guarda en el **navegador** de cada estudiante (`localStorage`): no hay cuentas ni base de datos.
- Para **llevar el progreso a otro equipo** (por ejemplo, de la sala de cómputo al portátil de casa) está el **archivo de progreso**:
  1. En el juego, botón **💾 Progreso → Descargar archivo**. Se descarga un `.txt`, por ejemplo `progreso-calidad-juan-perez-2026-10-24.txt`.
  2. El estudiante lo guarda en su correo, Drive o una USB.
  3. En el otro equipo, en la pantalla de inicio: **📂 ¿Vienes de otro equipo? Carga tu archivo de progreso** (o **💾 Progreso → Elegir archivo**, o arrastrando el archivo a la ventana). El juego muestra un resumen y pide confirmación antes de reemplazar lo que haya.
- El archivo guarda **todo**: nombre, niveles, estrellas, XP, rachas, insignias y bugs atrapados. Su contenido va **codificado y sellado**: no se puede leer con el Bloc de notas y, si se cambia una sola letra, el juego lo rechaza. Cada archivo solo sirve para su propio juego. (Es una protección contra la edición a mano, no cifrado de alta seguridad.)
- Al terminar cada nivel aparece el botón **💾 Guardar progreso**, y al completar un mundo Bichi lo recuerda.
- Sin ese archivo, si cambia de navegador u ordenador, empieza de cero.
- 🪪 **Licencia de inspector/a de calidad**: una tarjeta de la Agencia de Calidad con:
  - el nombre y el rango del estudiante;
  - un **sello por cada mundo completado** (7 + la auditoría final);
  - XP, estrellas, insignias, retos de código superados y bugs atrapados;
  - un código de barras.

  Al superar la auditoría final se vuelve **dorada**. Se puede imprimir.
- 🎓 **Diploma de Especialista en Calidad de Software**: aparece al superar la auditoría final. Lleva el nombre, los mundos dominados y las estadísticas, y se puede imprimir o guardar en PDF.

---

## 📚 Contenido: 7 mundos y 46 niveles

| Mundo | Niveles | Retos |
|---|---|---|
| 🧭 **Fundamentos de calidad** | ¿Qué es la calidad? (QA, QC y pruebas) · Error, defecto y fallo · Los 7 principios de las pruebas · El modelo ISO/IEC 25010 · Verificación, validación y depuración · 🧪 Proyecto: tu primera inspección | 29 |
| 🏗️ **Niveles y tipos de prueba** | El proceso de pruebas · Niveles de prueba · Tipos de prueba (confirmación, regresión, humo) · La pirámide de pruebas y los cuadrantes · Ciclos de vida: modelo en V, ágil, TDD/ATDD/BDD · Pruebas estáticas y revisiones | 27 |
| 🎯 **Diseño de casos de prueba** | Anatomía de un caso de prueba · Partición de equivalencia · Análisis de valores límite · Tablas de decisión · Transición de estados · Caja blanca: sentencias, ramas y complejidad ciclomática · Experiencia y colaboración (exploratorias, Gherkin) | 29 |
| 🐛 **Gestión de defectos** | El reporte de defecto perfecto · Severidad vs. prioridad · Ciclo de vida del defecto · Riesgos y plan de pruebas · Trazabilidad y métricas · 🧪 Proyecto: sesión exploratoria | 23 |
| 🧪 **Pruebas unitarias con pytest** | Tu primera prueba · Patrón AAA y principios FIRST · Excepciones y decimales · Parametrización · Fixtures · Dobles de prueba: mocks y stubs · TDD: rojo, verde, refactor | 23 (7 de pytest) |
| 🎭 **Automatización con Playwright** | Conoce Playwright · Locators que no se rompen · Acciones · Aserciones web y auto-waiting · Listas, filtros y strict mode · Page Object Model · Herramientas pro (codegen, trace viewer…) · 🧪 Proyecto: regresión del carrito | 23 (7 de Playwright) |
| ⚙️ **Más allá de lo funcional** | Rendimiento (carga, estrés, p95, Locust) · Seguridad (OWASP, inyección SQL, XSS) · Accesibilidad (WCAG 2.2) · Pruebas de API · Integración continua (GitHub Actions) | 19 (2 de pytest) |
| 👾 **Auditoría final** | La auditoría de PixelShop antes del lanzamiento: revisión de código, valores límite, tabla de decisión, pytest, Playwright, reporte y criterios de salida | 7 |
| **Total** | **46 niveles** | **180 retos (18 de pytest/Playwright)** |

- **Apuntes** 📘: una chuleta de referencia por mundo (conceptos, técnicas, comandos de pytest y Playwright), siempre a mano desde el menú.
- No se menciona ninguna aplicación externa: todos los ejemplos usan **PixelShop**, la tienda de práctica del juego.

---

## 🧩 Tipos de reto

| Tipo | Cómo funciona |
|---|---|
| 🐍 **Escribe las pruebas** | Editor de Python con pestañas (las 🔒 son de solo lectura), botón **▶ Ejecutar pruebas** y una terminal con la salida **real** de `pytest -q` |
| 🔴 **TDD** | Al revés: las pruebas ya están escritas y el estudiante escribe el código que las hace pasar |
| 🎭 **Automatiza con Playwright** | Igual, pero con un **navegador** con PixelShop al lado, la lista de **pasos** de cada prueba y el botón **▶ Ver al robot** que repite la prueba despacio, resaltando cada elemento |
| 🐞 **Encuentra el bug** | Hacer clic en la línea de código o en la parte de una pantalla de PixelShop que tiene el defecto |
| 📝 **Reporta el bug** / 🧪 **Caso de prueba** | Completar un reporte de defecto o un caso de prueba eligiendo la mejor opción en cada campo |
| 📏 **Valores límite** | Elegir valores sobre una **recta numérica** con las particiones coloreadas |
| 🧮 **Completa la tabla** | Tablas de decisión, de transición de estados, de trazabilidad, de riesgos… |
| 📊 **Cobertura** | Elegir casos de prueba y ver **en vivo** qué líneas y ramas del código se ejecutan |
| ✏️ 🔮 ❓ ☑️ 🗂️ 🔢 | Completar, predecir, pregunta, selección múltiple, clasificar y ordenar |

### Los bugs sembrados (pruebas de mutación)

Cada reto de pytest o Playwright tiene **bugs sembrados**: copias del código (o de PixelShop) con un defecto concreto, por ejemplo «`>=` cambiado por `>`» o «el cupón descuenta 20 % en vez de 10 %». Al ejecutar:

1. las pruebas del estudiante se ejecutan contra **cada versión con bug**;
2. luego contra la versión **correcta**.

Un bug queda **atrapado** si alguna prueba falla con él. Las comprobaciones del reto piden que todas las pruebas pasen con el código correcto **y** que se atrapen los bugs. Así el estudiante aprende que una prueba que nunca falla no protege nada.

En los retos de código:

- **💡 Pista**: ayuda, a cambio de **−30% de XP** en ese reto.
- **🏳️ Me rindo**: muestra una solución, pero cuesta una vida.
- **Entregar**: puntúa la proporción de comprobaciones en verde. Si el código cambió desde la última ejecución, primero vuelve a ejecutar.
- La cobertura de líneas se puede pintar en el editor (verde ejecutada, rojo sin probar).
- Un guardián detiene el código si ejecuta demasiadas líneas (probable **bucle infinito**).

---

## 🛒 PixelShop y el simulador de Playwright

**PixelShop** es la tienda de práctica sobre la que se escriben las pruebas E2E. Tiene catálogo con buscador, carrito con cantidades y cupones, inicio de sesión y pago.

| Dato | Valor |
|---|---|
| Dirección (simulada) | `https://pixelshop.test` (las pruebas usan rutas como `page.goto("/login")`) |
| Usuaria de prueba | **ana@pixelshop.test** · contraseña **Clave123** (ficticias, solo existen dentro del juego) |
| Cupón válido | **PIXEL10** (10 % de descuento) |
| Productos | Audífonos Pixel $120.000 · Teclado mecánico $250.000 · Mouse inalámbrico $80.000 · Monitor 24 pulgadas $750.000 · Cámara web HD (agotada) · Parlante bluetooth $95.000 |

El **simulador** imita la API síncrona de **Playwright para Python** (`from playwright.sync_api import Page, expect`) y la fixture `page` de **pytest-playwright**, así que el código que escribe el estudiante es Playwright real. Se comporta como Playwright:

- `get_by_role` usa el **rol** y el **nombre accesible** (por eso un campo de contraseña no es un `textbox` y se busca con `get_by_label`);
- las acciones y los `expect` **esperan solos** (auto-waiting), con 5 s de tiempo **virtual**: esperar no tarda de verdad;
- si un locator encuentra varios elementos al actuar, falla con **strict mode violation**;
- `time.sleep()` funciona, pero queda anotado en los pasos como mala práctica.

Incluye lo más usado: `get_by_role`, `get_by_label`, `get_by_text`, `get_by_placeholder`, `get_by_test_id`, `locator`, `filter`, `first`, `last`, `nth`; las acciones `click`, `fill`, `press`, `check`, `select_option`, `hover`; y las aserciones `to_be_visible`, `to_have_text`, `to_contain_text`, `to_have_count`, `to_have_value`, `to_be_enabled`, `to_be_disabled`, `to_be_checked`, `to_have_url`, `to_have_title` (y sus versiones `not_to_…`).

Es un simulador **para aprender** la API y las buenas prácticas. Las pruebas contra aplicaciones reales se hacen con Playwright instalado (`pip install pytest-playwright`), como se explica en el mundo 6.

---

## 🎮 Mecánica de juego

| Elemento | Detalle |
|---|---|
| **Lecciones** | Diapositivas con tablas y código resaltado (Python, Gherkin, YAML…). Se pueden saltar si el nivel ya está superado |
| **Vidas** | 3 ❤️ por nivel |
| **XP** | 100 por acierto, 120 en los proyectos y 150 en la auditoría final. Los aciertos parciales dan algo de XP pero cuestan una vida |
| **Racha 🔥** | +10 XP por acierto seguido (máximo +50) |
| **Estrellas** | ⭐⭐⭐ sin fallos, ⭐⭐ con 1 fallo, ⭐ con 2. Cada estrella suma 50 XP |
| **Mejor marca** | Repetir un nivel solo cuenta si se mejora |
| **Rangos** | 🥚 Tester aprendiz → 🔍 Tester junior → 📋 Analista de pruebas → 🎯 Diseñador/a de pruebas → 🤖 Automatizador/a → 🛡️ QA Engineer → 👑 Leyenda de la Calidad |
| **Insignias** | 19, entre ellas: Primer verde · Pytest pro · Cazabugs · Ojo de halcón · una por cada mundo · Auditor/a · Leyenda de la Calidad |
| **Desbloqueo** | Los niveles se desbloquean en orden |

---

## ✏️ Editar o ampliar el contenido

| Archivo | Contenido |
|---|---|
| `src/data/worlds/*.js` | Los niveles de cada mundo: lecciones y retos |
| `src/data/notes.js` | Los apuntes (chuletas) |
| `src/data/game.js` | Rangos, insignias y puntuaciones |
| `src/lib/pixelshop.js` | La app PixelShop y la lista de bugs que se le pueden sembrar |
| `src/lib/pwbridge.js` · `src/py/sync_api.py` | El simulador de Playwright |
| `src/py/harness.py` · `src/lib/python.js` | El ejecutor de pytest en el navegador |

### Modo desarrollo (con recarga automática)

```bash
docker compose --profile dev up dev
```

Abre **http://localhost:5176**. Cuando termines, actualiza la versión de clase con `iniciar.bat`.

### Ejemplo de reto de pytest

El código de Python se escribe con la etiqueta `` py`…` `` (de `src/data/helpers.js`), que quita la sangría común.

```js
{
  type: 'py',
  question: 'Valores límite con parametrize',
  instructions: 'Solo pueden registrarse personas de **18 a 99 años**…',
  files: {
    'test_registro.py': py`…código inicial del estudiante…`,
    'registro.py': REGISTRO,                       // el módulo bajo prueba
  },
  editable: ['test_registro.py'],                  // por defecto, el primer archivo
  target: 'registro.py',                           // (opcional) mide la cobertura de este módulo
  mutants: {                                       // bugs sembrados: copias con un defecto
    min_estricto: { label: 'Mínimo con `<` en vez de `<=`', files: { 'registro.py': REGISTRO.replace('18 <= edad', '18 < edad') } },
  },
  checks: [
    { text: 'Todas las pruebas pasan', allPass: true },
    { text: 'Usas parametrize', uses: '@pytest\\.mark\\.parametrize' },
    { text: 'Atrapas el bug del mínimo', kills: 'min_estricto' },
  ],
  solution: { 'test_registro.py': py`…` },
  hint: '…',
}
```

Para un reto de **Playwright** se añade `app: true` y, en vez de `mutants`, `appBugs: { id: 'nombre-del-bug' }` con los bugs de `APP_BUGS` en `src/lib/pixelshop.js` (por ejemplo `cupon20`, `total-sin-cantidad`, `pagar-sin-terminos`).

Comprobaciones disponibles:

| Comprobación | Se cumple si… |
|---|---|
| `allPass: true` | hay pruebas y todas pasan con el código correcto |
| `minTests: n` | hay al menos `n` pruebas (cada caso de `parametrize` cuenta) |
| `kills: 'id'` | todas pasan y alguna falla con el bug sembrado `id` |
| `cov: n` | todas pasan y la cobertura de `target` es al menos `n` % |
| `uses: 'regex'` / `avoid: 'regex'` | el código editable contiene / no contiene el patrón |
| `test: 'cuerpo JS'` | una función propia `(r, m, src, h) => boolean` |

Los demás tipos (`quiz`, `pick`, `classify`, `order`, `fill`, `bughunt`, `report`, `grid`, `boundary`, `coverage`) siguen el formato que verás en los archivos de cada mundo; cada componente de `src/components/challenges/` documenta el suyo al principio.

---

## 🧪 Control de calidad de los retos (`?qa`)

¡Las pruebas también se prueban! Abre **http://localhost:8084/?qa** (o `http://localhost:5176/?qa` en desarrollo). La página revisa automáticamente **todos los retos**:

- la **solución** de cada reto de pytest o Playwright pasa **todas** sus comprobaciones y **atrapa todos** los bugs sembrados;
- el **código inicial** no las pasa todas, para que el reto no sea trivial;
- las preguntas, tablas, recta numérica, cobertura y pantallas de "encuentra el bug" están bien formadas.

Con `?qa=id-del-nivel` revisa solo un nivel. Al publicar esta versión, el resultado era **180 retos revisados, 0 con problemas**.

> Ten esa pestaña **visible** mientras se ejecuta (tarda alrededor de un minuto): los navegadores no maquetan las páginas de pestañas ocultas y los retos de Playwright necesitan ver PixelShop.

---

## 🗂️ Estructura del proyecto

```
calidad-quest/
├── iniciar.bat / detener.bat      ← arrancar y parar (Windows)
├── docker-compose.yml             ← puertos 8084 (clase) y 5176 (desarrollo)
├── Dockerfile · nginx.conf        ← compilación y servidor
├── scripts/copy-pyodide.mjs       ← copia Python (Pyodide) a public/ al compilar
├── public/wheels/                 ← pytest y sus dependencias
└── src/
    ├── data/
    │   ├── worlds/                ← el contenido de cada mundo
    │   ├── notes.js               ← apuntes
    │   ├── game.js                ← rangos, insignias y reglas
    │   └── helpers.js             ← py`…` y pantallas de ejemplo de PixelShop
    ├── py/                        ← ejecutor de pytest y simulador de Playwright (Python)
    ├── lib/
    │   ├── python.js              ← carga Pyodide y ejecuta pytest (con los bugs sembrados)
    │   ├── pixelshop.js           ← la tienda de práctica
    │   ├── pwbridge.js            ← locators, acciones y expect del simulador
    │   ├── checks.js              ← comprobaciones de los retos de código
    │   └── savefile.js            ← archivo de progreso
    ├── components/
    │   ├── challenges/            ← PyLab, BugHunt, Report, Grid, Boundary, Coverage, Quiz…
    │   ├── LevelMap.jsx           ← mapa de mundos
    │   ├── LevelPlayer.jsx        ← lección, retos, vidas y resultados
    │   ├── Credential.jsx         ← licencia de inspector/a
    │   ├── Certificate.jsx        ← diploma
    │   └── QA.jsx                 ← control de calidad (?qa)
    ├── styles.css · calidad.css · lab.css
```

---

## 🩺 Solución de problemas

| Problema | Solución |
|---|---|
| *"No se pudo arrancar"* | Abre Docker Desktop y espera a *Engine running* |
| `port is already allocated` | Cambia el puerto (ver [Puertos](#-puertos)) |
| Error de red al construir la primera vez | Comprueba la conexión a internet y repite |
| No veo mis cambios | `docker compose up -d --build` y recarga con `Ctrl + F5` |
| El botón dice «🐍 Cargando Python…» mucho rato | Solo la primera vez: descarga unos 14 MB. Si no termina, recarga la página |
| La terminal dice «Bucle infinito detectado» | El código ejecutó demasiadas líneas: revisa los `while` y los `for` |
| Una prueba de Playwright dice `strict mode violation` | El locator encuentra varios elementos: afínalo con `name=`, `filter(has_text=…)` o `.first` |
| Una prueba de Playwright dice `Timeout 5000ms exceeded` | El elemento no apareció, no está visible o está deshabilitado: revisa el locator en el paso que falló |
| Un estudiante perdió su progreso | El progreso vive en cada navegador. Si guardó su archivo de progreso, que lo cargue con **💾 Progreso**; si no, debe usar siempre el mismo navegador |
| Al cargar el archivo dice «fue modificado o está dañado» | Se abrió y editó, o se dañó al copiarlo: usar el archivo original descargado del juego |
| Al cargar el archivo dice «es de Misión: …» | Es el archivo de otro juego del curso: cargarlo en ese juego |

---

## 🛠️ Tecnología

- **React 18 + Vite 5**: la interfaz del juego.
- **Pyodide 0.27** (CPython 3.12 en WebAssembly) + **pytest 8.3**: Python real en el navegador, sin servidor.
- **Simulador de Playwright** propio (Python + JavaScript) sobre PixelShop, en un iframe.
- **CodeMirror 6**: el editor de código (con resaltado de Python y cobertura por línea).
- **Prism**: el resaltado de sintaxis de las lecciones.
- **canvas-confetti** y **Web Audio API**: celebraciones y sonidos, sin archivos de audio.
- Fuentes **Outfit** y **JetBrains Mono**, incluidas en el proyecto.
- **Docker** (Node 20 para compilar y Nginx para servir).
