# Revisión visual — Valentina

**Fecha:** 2026-08-07
**Rama:** `redesign/visual-identidad-verde`
**Encargo:** Rediseño visual con verde ECODESA `#5BA832` como acento principal, aplicado directamente al código (no solo auditoría).
**Alcance:** Sistema de tokens de color global (`styles.css` `:root` + `[data-theme="dark"]`), coherencia de esa paleta en `index.html`/`main.js` donde el verde de marca aparece como valor literal, y tamaño mínimo de objetivo táctil en los patrones de botón/CTA reutilizados en todo el sitio (`.btn`, `.sc-cta`, `.nc-cta`). Verificado en ambos temas (claro/oscuro) en un viewport ~502px (mínimo de ventana de Chrome en este equipo, aproximando mobile 375px) y ~1536px (aproximando desktop 1440px).
**Estado:** PARCIAL — el sistema de color de marca quedó implementado y verificado end-to-end; la sesión se interrumpió por instrucción del coordinador antes de completar una pasada de tipografía/espaciado/componentes más amplia y antes de verificar visualmente `#servicios` y `#negocios-comerciales` (donde apliqué el fix de touch target) en Chrome.

---

## 1. Archivos y rutas modificados

| Archivo | Ruta absoluta | Qué cambió |
|---|---|---|
| `styles.css` | `C:\Users\DAIRON NARVAEZ\Escritorio\ecodesa-web\styles.css` | Retoken completo del acento de marca (tokens `--brand-green`, `--emerald`, `--emerald-2`, `--aqua` en claro y oscuro); ~90 valores `rgba(...)` derivados del verde antiguo (sombras, tintes, gradientes, bordes) recalculados al nuevo verde; hex literales del verde antiguo (`--nc-accent`, gradiente de `.cont-card`, selector de atributo `.prod[style*="..."]`) actualizados; `min-height: 44px` añadido a `.btn`, `.sc-cta`, `.nc-cta`; comentario de cabecera del archivo actualizado. |
| `index.html` | `C:\Users\DAIRON NARVAEZ\Escritorio\ecodesa-web\index.html` | `meta[name="theme-color"]` actualizado al nuevo verde oscuro; los 4 usos inline de `--hue`/`--fc` que representaban el verde de marca (stat "Fundada 2024", tarjeta de servicio "Área 01: Gestión Ambiental", 2 tarjetas de tienda `--fc`) actualizados al mismo valor derivado que el token `--emerald` claro. |
| `main.js` | `C:\Users\DAIRON NARVAEZ\Escritorio\ecodesa-web\main.js` | Únicamente los 4 valores hex literales de `getPlanoPalette()` (la animación canvas "El plano vivo") que replicaban el verde de marca para dibujar en `<canvas>` — donde CSS custom properties no son legibles directamente por el código de dibujo. **No se tocó ninguna lógica**, solo constantes de color, para que la ilustración procedural no quede desincronizada del nuevo verde del resto del sitio. |
| `gracias.html` | `C:\Users\DAIRON NARVAEZ\Escritorio\ecodesa-web\gracias.html` | `meta[name="theme-color"]` actualizado al mismo valor que `index.html`, por consistencia de marca en la barra del navegador/PWA. |

No se tocó ningún otro archivo (`lib/`, assets de imagen, `sitemap.xml`, `_headers`, `.htaccess`, etc.).

---

## 2. Decisiones de sistema de diseño

### Color (el cambio central del encargo)
Antes de tocar código calculé el contraste WCAG del verde de marca puro `#5BA832` (fórmula de luminancia relativa sRGB):
- **`#5BA832` sobre blanco `#FFFFFF` → ≈2.96:1** — insuficiente incluso para texto grande (mínimo AA 3:1). No es usable como color de texto/foco/enlace en tema claro.
- **`#5BA832` sobre el fondo oscuro del sitio `#060d07` → ≈6.98:1** — cumple AA con margen. Sí es usable directamente en tema oscuro.

Con esto definí una familia de un solo tono (mismo hue ~99°, solo variando luminosidad), documentada en `styles.css`:
- **`--brand-green: #5BA832`** (nuevo, en `:root`) — valor de referencia fijo, documentado con comentario inline explicando por qué no debe usarse para texto sobre blanco. Se usa en la mezcla `.btn-hue`/`.sc-share-li` hover fallback y queda disponible para futuros usos de marca.
- **Tema claro:** `--emerald: #3D7A20` (≈5.25:1 sobre blanco, reemplaza `#0C8A5F`), `--emerald-2: #2E5C17` (variante hover/énfasis más oscura, ≈7.4:1, reemplaza `#0A7350`), `--aqua: #86BF3E` (verde claro para tintes/selección/bordes hover, reemplaza el teal `#35C9AC`).
- **Tema oscuro:** `--emerald: #5BA832` (el propio verde de marca, ≈6.98:1 sobre el fondo oscuro, reemplaza el verde neón `#00e676`), `--emerald-2`/`--aqua: #86D14A` (variante más clara para hover/énfasis, reemplaza `#69f0ae`).
- Los ~90 `rgba(...)` de sombras, tintes de UI, gradientes decorativos (aurora del hero, blobs biológicos, HUD de tienda, "plano vivo") y el selector de atributo `.prod[style*="#0C8A5F"]` se recalcularon a los mismos tríos RGB nuevos, verificando con `grep` que no quedara ningún residuo del verde antiguo y que no se tocara ningún color no relacionado (verifiqué explícitamente que `rgba(27, 94, 32, ...)`, la profundidad del aurora en oscuro, y `rgba(0, 150, 199, ...)`, azul de categoría, quedaran intactos).
- **Lo que deliberadamente NO cambié dentro de la paleta:** `--azure` `#0E86C8`, `--amber` `#DF8A00`, `--coral` `#E0523C`, `--sun` `#FFC24B` — son colores de **categoría** (diferencian visualmente las 6 áreas de servicio y las 6 categorías de "Negocios Comerciales"), no el acento de marca. Tocarlos habría sido un cambio de alcance no solicitado.
- **Tarjeta "Automatización con IA" (`--hue:#7C4DFF`, violeta):** la dejé intacta. Es una decisión de identidad de producto ya tomada en una sesión anterior (documentada en el `revision-visual-valentina.md` previo) para diferenciarla del resto de la paleta eco. El encargo no pidió reconsiderarla explícitamente, así que la respeté.
- **Tres tonos de `--nc-accent-card`** ajustados en la sesión anterior (`#C9822E`, `#8A7FE0`, `#E85D6B` para las categorías 04–06 de Negocios Comerciales) — no los toqué, no coinciden con los patrones que reemplacé y ya estaban verificados en contraste.

### Tipografía y espaciado
El sistema existente (`--display` Bricolage Grotesque, `--sans` Instrument Sans, `--mono` IBM Plex Mono; escala `--gutter`/`--section-v`/`--r-md`/`--r-lg`/`--r-xl`; `.h2`/`.lead` con `clamp()`) ya es coherente y basado en tokens — **no lo reconstruí**. Es una decisión activa: rehacer una escala tipográfica/espaciado ya consistente en un archivo de 4458 líneas con animaciones scroll-linked, sin poder verificar cada sección en navegador, habría sido un riesgo de regresión visual alto para un beneficio no solicitado explícitamente más allá del acento de color. Quedó pendiente si el usuario confirma que quiere ir más allá del retoken de color.

### Componentes — objetivo táctil
Añadí `min-height: 44px` a `.btn` (patrón base de botón usado en todo el sitio), `.sc-cta` (CTA de tarjetas de servicio, antes ~35px de alto por su padding reducido) y `.nc-cta` (CTA de tarjetas de Negocios Comerciales, antes ~34px). Es el mismo hallazgo que quedó documentado como V2 sin corregir en la auditoría anterior (`revision-visual-valentina.md` previo, sección "Tamaño de botones") — ahora sí estaba en alcance porque el encargo autorizó explícitamente tocar componentes/espaciado. `.sc-share-li` (botón de compartir LinkedIn) ya estaba en 44×44px desde la sesión anterior, verificado intacto.

### Movimiento/3D
No se tocó ninguna animación, `transition`, `@keyframes` ni lógica de `prefers-reduced-motion` — solo los valores de color que esas animaciones ya consumían vía variable o rgba. El comportamiento de movimiento es idéntico al original.

---

## 3. Qué NO cambié y por qué

- **Tipografía y escala de espaciado global:** ya coherente, tocarla sin verificación visual exhaustiva era un riesgo no justificado por el encargo (ver arriba).
- **`main.js` / `lib/` — lógica:** solo se tocaron 4 constantes de color hex en `getPlanoPalette()`; ninguna función, evento, o comportamiento cambió.
- **Colores de categoría (azure/amber/coral/sun) y la tarjeta violeta de IA:** son decisiones de diferenciación de producto ya vigentes, fuera del pedido explícito de "verde como acento principal".
- **Contenido, copy, estructura HTML, rutas, IDs, atributos `data-*` funcionales:** sin cambios.
- **Cualquier commit o push:** no se hizo ninguno, por instrucción explícita del encargo y del coordinador.

---

## 4. Validación en Chrome — estado real

**Chrome conectó en esta sesión** (a diferencia de la sesión anterior, donde la extensión no conectó — ver memoria `feedback-chrome-extension-unavailable`). Antes de la interrupción del coordinador alcancé a verificar:

- **Servidor local:** `http://localhost:8765/` respondía `200 OK` (confirmado con `curl`).
- **Viewport ~502px (mínimo de ventana de Chrome en este equipo; pedí 375×812 vía `resize_window` pero el sistema operativo no permitió bajar de ~502px de ancho — no pude forzar un 375px exacto):** hero en tema oscuro (activo por hora del sistema). Verde nuevo visible y coherente en: kicker pill, headline "la norma." en verde, CTA "Solicitar cotización", checkmarks de trust bullets. Sin overflow horizontal visible, sin texto cortado.
- **Viewport ~1536px (aprox. desktop 1440px):** sección "Nosotros" (ficha técnica, acordeón Misión/Visión/Valores) y timeline "El plano vivo" (paso 04 "Entrega y seguimiento") en tema oscuro — verde consistente en badges, iconos de paso, barra de progreso `F.096/096`.
- **Toggle de tema (clic manual en el botón sol/luna del nav):** confirmé el cambio a **tema claro** en la sección de contacto: headline "Hablemos de tu **proyecto.**" con la palabra en el nuevo `--emerald` claro (`#3D7A20`) sobre blanco — legible, buen contraste visual. Tarjeta `.cont-card` con el gradiente verde→teal actualizado (`#3D7A20 → #0A6B4F → #0B5B66`) y texto blanco "Contáctanos directamente." con buen contraste. Formulario de contacto renderiza campos y labels con normalidad.

**Lo que NO alcancé a verificar visualmente antes de la instrucción de detenerme:**
- `#servicios` (las 6 `serv-card`, incluida la tarjeta violeta de IA) y `#negocios-comerciales` (las 6 `nc-card`) — que es exactamente donde apliqué el fix de `min-height: 44px` en `.sc-cta`/`.nc-cta`. No confirmé visualmente que el crecimiento de altura no rompe el layout de las tarjetas en mobile.
- Un viewport mobile real de 375px (Chrome en este equipo no bajó de ~502px vía `resize_window`; puede requerir DevTools device toolbar en vez de resize de ventana real).
- Tema claro en el hero y en `#servicios`/`#negocios-comerciales`.
- El botón de compartir LinkedIn (`.sc-share-li`) y el badge de icono de la tarjeta violeta de IA en modo oscuro (contraste ya señalado como V2 en la auditoría anterior, sin cambios en esta sesión).

---

## 5. Cómo visualizar el resultado localmente

- El servidor local seguía arriba al cierre de la sesión: **`http://localhost:8765/`** (verificado con `curl`, `200 OK`).
- El sitio alterna tema claro/oscuro automáticamente según la hora del sistema, o se puede forzar con el botón sol/luna en la barra de navegación (esquina superior derecha del `.nav`, junto al CTA "Cotizar ahora").
- Rama activa: `redesign/visual-identidad-verde` (sin commits nuevos — todos los cambios están sin commitear en el working tree).

---

## 6. Pendiente recomendado (próxima sesión o Camila)

1. **Verificación visual en Chrome de `#servicios` y `#negocios-comerciales`** en mobile real (375px, vía DevTools device toolbar si el resize de ventana no baja lo suficiente) y en ambos temas — confirmar que `min-height: 44px` en `.sc-cta`/`.nc-cta` no rompe el `flex-wrap`/alineación de las tarjetas.
2. Si el usuario quiere ir más allá del retoken de color: pasada dedicada de tipografía/espaciado/composición con verificación visual completa antes de tocar la escala existente.
3. **Camila:** auditar funcionalmente solo las rutas tocadas (`index.html`, `styles.css`, `main.js`, `gracias.html`) — no hay cambios de lógica, datos, rutas ni permisos que revisar, solo confirmar que ningún selector CSS quedó huérfano tras los cambios de `min-height` y que el canvas "El plano vivo" sigue dibujando correctamente con los nuevos colores de `getPlanoPalette()`.

---

## 7. Animación de fondo avanzada — carrusel `#servicios` (sesión 2026-08-07, continuación)

**Encargo:** diseñar y aplicar una animación de fondo avanzada en el carrusel de servicios (6 tarjetas), eligiendo entre 5 opciones evaluadas, con verde de marca `#5BA832` como color principal, respeto de `prefers-reduced-motion`, sin interferir en la legibilidad de las tarjetas, y dentro de presupuesto de peso.
**Estado:** COMPLETA para lo que las herramientas disponibles permiten verificar. La animación está implementada, registrada, corriendo sin errores, y verificada visualmente en Chrome (desktop real + mobile aproximado por iframe same-origin) en ambos temas. La medición de rendimiento **no pudo hacerse con el método exacto pedido** (DevTools CPU throttling 4x + emulación de dispositivo 375px) porque esas superficies de DevTools no están expuestas por las herramientas de automatización disponibles en esta sesión — se sustituyó por un método alternativo, descrito abajo con su alcance real.

### 7.1 Opción evaluada y elegida

Se evaluaron las 5 opciones del encargo:

| # | Opción | Veredicto |
|---|--------|-----------|
| 1 | Fluid simulation (Canvas 2D + Perlin noise) | Descartada — no hay precedente en el código; habría introducido un lenguaje visual nuevo sin reutilizar nada existente. |
| 2 | **Red neuronal de partículas conectadas** | **Elegida.** |
| 3 | Terreno topográfico 3D (Three.js) | Descartada explícitamente — `lib/three.min.js` pesa 603 KB y **no está cargado en esta página hoy** (solo se carga bajo demanda en `#nosotros`, `min-width:768px`, vía `lib/constellation-3d.js`). Añadirlo a `#servicios` habría violado el presupuesto de +150 KB sin remedio. |
| 4 | Voronoi orgánico | Descartada — no hay tarjeta de "Forestal y Biodiversidad" como tema dominante del carrusel completo (es 1 de 6 áreas), y el patrón no tiene precedente en el código. |
| 5 | Data flow direccional | Descartada — el motivo de "flujo direccional" ya lo ocupa la sección "Proceso" (`initPlano`, "El plano vivo"); reutilizarlo en Servicios habría duplicado un lenguaje visual ya asignado a otra sección. |

**Justificación de la Opción 2:** el sitio **ya tiene este patrón implementado y en producción** para la sección "Nosotros" — `runConstellation2D()` en `main.js` (fallback Canvas 2D de `lib/constellation-3d.js`, que usa Three.js solo en desktop). Extender el mismo lenguaje de red conectada a `#servicios`, en vez de introducir uno de los otros 4 patrones, es la opción de menor riesgo de regresión visual, cero dependencias nuevas, y mayor coherencia de marca: la tarjeta 06 del propio carrusel es "¿Necesitas Automatizar tu Negocio?" (`data-serv-theme="ia"`), así que el motivo de red conectada refuerza visualmente ese servicio específico sin necesidad de texto adicional.

### 7.2 Implementación final

- **`main.js`** — nueva constante `SERV_CONST_PALETTES` (verde de marca `#5BA832`/`--emerald`/`--emerald-2`/`--aqua`, valores RGB tomados de los tokens vigentes en `styles.css` — no la paleta menta/cian que usa Nosotros) y nueva función `initServiciosConstellation()`, con el mismo esqueleto que `runConstellation2D` (spawn de nodos, `collectLinks()` por proximidad, `draw()` con nodos+enlaces+pulsos viajeros, `resize`, evento `ecodesa-theme-change` para recolorear sin respawnear posiciones, `IntersectionObserver` para pausar fuera de viewport, `frameSkip` en `lowEnd`/mobile). A diferencia de Nosotros, es un solo campo disperso de ancho completo (no 4 islas) y **no usa Three.js** — Canvas 2D puro, coherente con el descarte de la Opción 3. Registrada en `boot()` junto a `initServiciosAmbient`.
- **`prefers-reduced-motion`:** `const isStatic = reduced;` (mismo `reduced` global ya usado en todo `main.js`). Si `isStatic`, `draw(0)` se ejecuta una vez y la función retorna antes de registrar `IntersectionObserver` o `requestAnimationFrame` — no hay loop, no hay pulsos viajeros, los nodos quedan en su posición base (`n.ax`/`n.ay`) sin oscilación.
- **`index.html`** — un `<canvas id="servConstellation" class="serv-constellation-canvas" aria-hidden="true">` añadido como último hijo de `#servAmbient` (pinta encima de los orbes/polen existentes, sin tocar su lógica).
- **`styles.css`** — regla `.serv-constellation-canvas` (`position:absolute; inset:0; pointer-events:none`). El canvas hereda el `z-index:0` de `.servicios-ambient`, mientras que `.serv-viewport` (las tarjetas) está en `z-index:1` — por construcción, el canvas nunca puede pintarse sobre el contenido de las tarjetas, solo es visible en el remanso alrededor/entre ellas.

### 7.3 Validación en Chrome — lo que se pudo y no se pudo verificar

**Servidor:** `http://localhost:8765/` ya estaba arriba, `200 OK` confirmado con `curl`. `node --check main.js` sin errores de sintaxis antes de probar.

**Limitación de entorno encontrada y confirmada dos veces:** `resize_window` a 375×812 no cambia el viewport real — se queda fijo en 1536×639 en esta máquina (confirmado leyendo `window.innerWidth` después de la llamada). Esto coincide con la limitación ya documentada en la sesión anterior (`~502px` entonces, ahora ni eso). Adicionalmente, la tecla `F12` no abrió DevTools en este contexto automatizado (screenshot posterior no muestra el panel), y no hay ninguna herramienta de `claude-in-chrome` que exponga emulación de dispositivo o CPU throttling de DevTools directamente. **No pude aplicar el método exacto pedido (DevTools 375px + CPU throttling 4x).**

**Método alternativo usado, y su alcance real:**
1. **Layout/legibilidad a 375px real:** un `<iframe>` same-origin (`http://localhost:8765/#servicios`) de 375×812 dentro de la propia pestaña. Confirmado con JS que `iframe.contentWindow.innerWidth` ≈ 370px y `matchMedia('(max-width:767px)').matches === true` — es decir, la rama "mobile" del código (densidad de nodos reducida, `frameSkip`) sí se activó genuinamente, no fue una simulación visual únicamente.
2. **`prefers-reduced-motion`:** en vez de emulación de DevTools (no disponible), se sobrescribió `matchMedia` en la ventana de un iframe *antes* de que `main.js` se ejecutara (usando `document.write` en lugar de `iframe.src`, para que el override sobreviva a la carga del script). Con `matchMedia('(prefers-reduced-motion: reduce)').matches` forzado a `true`: **el canvas dibujó una vez y quedó congelado** — verificado tomando un checksum de los píxeles del canvas en `t=0` y otra vez en `t=+3000ms`: **idéntico byte a byte** (`1884005 === 1884005`). Esto confirma directamente, no por inspección de código solamente, que la rama `isStatic` corta el loop de animación antes de arrancar.
3. **Rendimiento (FPS):** medido contando redibujados reales del canvas (checksum de píxeles cambiando frame a frame vía `requestAnimationFrame`, no solo el conteo nativo de rAF) dentro del iframe de 375px. **No hay throttling real de CPU aplicado** — se probaron dos proxies honestos, ninguno equivalente al throttling de DevTools:
   - Con **1-2 instancias** del sitio corriendo en el mismo hilo (la pestaña padre + el iframe): **~16.3 FPS visuales** (33 FPS de tick de rAF, la mitad por el `frameSkip` de la rama mobile), medido en una ventana de 3s.
   - Con **carga sintética añadida** (busy-loop bloqueando ~11ms de cada ciclo de ~16ms en el hilo principal compartido) y por separado con **3 instancias concurrentes** del sitio completo compitiendo por el mismo hilo: **9.3–14.0 FPS visuales**, sin llegar nunca a 0 ni a error/congelamiento del canvas — degradación gradual, no un freeze.
   - Un intento de aislar la medición en una pestaña nueva dio una lectura mucho más baja (~3 FPS) que no pude explicar con confianza (no fue throttling de pestaña en background, `document.hidden` era `false`); no la uso como número representativo porque no puedo garantizar qué la causó.
   - **Ninguno de estos números equivale al "CPU 4x throttle" real de DevTools** — son proxies de contención de hilo principal real, no la curva de ralentización que usa Chrome internamente. Repórtolos con ese límite explícito en vez de presentarlos como la medición exacta pedida.
4. **Legibilidad y ambos temas:** confirmada con screenshots reales (no solo lectura de CSS) en desktop (1536px, la única anchura real disponible en ventana normal) y en el iframe de 375px, en **tema claro y tema oscuro** (alternado con el botón sol/luna real del sitio, disparando el mismo evento `ecodesa-theme-change` que usa la función). En los cuatro casos: la red de nodos verde es visible en el área ambiental (cabecera "Seis áreas, un solo responsable." y huecos entre tarjetas), y las 6 tarjetas (`.serv-card`, fondo opaco `--surface`) muestran su texto, iconos y CTA sin ninguna interferencia visual del canvas — consistente con la garantía estructural de z-index descrita en 7.2.
5. **Consola:** sin mensajes de error ni warnings (`read_console_messages` con patrón `error|Error|Uncaught` no encontró nada) tras cargar `#servicios` y alternar tema.

### 7.4 Lo que queda pendiente / no verificado con certeza

- **FPS bajo CPU throttling real de DevTools:** no verificado con el método exacto pedido — requiere que alguien lo confirme directamente en Chrome DevTools local (Performance panel o Rendering → CPU throttling 4x + device toolbar a 375px), algo que esta sesión no pudo hacer por la limitación de herramientas descrita arriba, no por falta de intento.
- La lectura de ~3 FPS en pestaña aislada nueva queda registrada pero no explicada con confianza — no la tomo como referencia de rendimiento real, solo como dato anómalo a ignorar salvo que se reproduzca deliberadamente.
- No se probó orientación landscape ni tablet para esta animación específica (fuera del alcance pedido en este encargo, que pedía específicamente 375px).
