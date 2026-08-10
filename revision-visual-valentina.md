# Revisión visual — Valentina

## Sesión 2026-08-08 — Cotizador multi-selección (#servicios + #negocios-comerciales)

**Rama:** `feature/cotizador-checkboxes` (creada desde `main` en `7d92c66`)
**Commit local:** `ab5ea7a` — sin push.
**Encargo:** implementación directa (no auditoría de una entrega de Carlos) de
checkboxes accesibles en las 12 cards de ambas secciones + botón flotante
único "Cotizar servicios seleccionados" con deep-link a WhatsApp, más
refuerzo de la animación en escalera de `#servicios`.
**Estado:** PARCIAL — implementación completa y verificada con interacción
real en Chrome en el breakpoint crítico (desktop, ≥960px, zona del pin-scroll
GSAP); 768px y 375px no se pudieron verificar visualmente en esta sesión por
una limitación de la herramienta `resize_window` (ver detalle abajo).

### Estado por requerimiento
1. **Checkbox accesible en las 12 cards** — Hecho. `<label>` real envolviendo
   `<input type="checkbox">` nativo (foco/teclado nativos), nombre accesible
   "Seleccionar {título de la card}" (texto visible + `sr-only`), ligado por
   `for`/`id`. Confirmado en Chrome: 12 `.svc-select-input` presentes, click
   real vía referencia de accesibilidad togglea `checked` y dispara `change`.
2. **Botón único "Cotizar servicios seleccionados"** — Hecho.
   `main.js:initQuoteSelector()` mantiene un `Set` de ids marcados (sin
   framework de estado, por instrucción de `ponytail`), arma
   `https://wa.me/573246886824?text=...` con los títulos reales — verificado
   leyendo el `href` generado tras marcar 2 checkboxes: incluía ambos títulos
   correctamente codificados. Oculto/deshabilitado en 0 selecciones
   (`aria-disabled="true"`, `tabindex="-1"`, `pointer-events:none`), visible
   y habilitado desde 1 (confirmado con 1, 2 y 3 selecciones simultáneas).
3. **Animación escalera reforzada en `#servicios`** — Hecho. `--sc-i` (0–5)
   añadido a cada `.serv-card` + `transition-delay: calc(var(--sc-i,0) *
   120ms)` en la regla de grow-in existente — mismo cadenciado de 120ms/ítem
   que ya usaba `--nc-i` en Negocios Comerciales. Sigue gateado por
   `reduced` vía el bloque `@media (prefers-reduced-motion: reduce)`
   existente (que ya cubría `.serv-card.service-card` con `transition:none
   !important`).
4. **Diseño premium coherente** — Hecho. El chip de selección reutiliza
   `var(--hue)` (servicios) / `var(--nc-accent-card)` (negocios) vía
   `color-mix()`, sin paleta nueva; check icon es SVG inline (no emoji);
   el botón flotante reutiliza el gradiente `--emerald→--aqua` y
   `--shadow-deep` ya existentes.

### Hallazgos corregidos durante la implementación
- **[V0] Chip de selección tapaba título/lista de la card** — posición
  inicial `top:14px/20px` colisionaba con el título de la nc-card 01 y el
  primer ítem del checklist derecho de las serv-card (visto en captura real
  a 1440px). Corregido reposicionando el chip como insignia que asoma sobre
  el borde superior (`top:-16px`), fuera del área de contenido — verificado
  sin overlap en las 12 cards tras el cambio.
- **[V1] Objetivo táctil del chip en 40px** — subido a `min-height:44px`
  (regla no negociable de touch target).

### Cambios implementados
- **Archivos:** `index.html` (12 bloques `<label class="svc-select">` + markup
  de `#quoteBar` junto al WhatsApp flotante existente + `--sc-i:0..5` inline
  en cada `.serv-card`), `styles.css` (~150 líneas nuevas: `.svc-select`,
  `.nc-select`, estados de check, `.is-quote-selected`, `.quote-bar`,
  entradas en el bloque de reduced-motion), `main.js`
  (`initQuoteSelector()`, registrada en `boot()`). Total: 3 archivos,
  +280/-6 líneas (`git diff --stat`).
- **Movimiento:** transiciones de check y del botón flotante usan solo
  `transform`/`opacity` (200–320ms), con `transition:none !important` bajo
  `prefers-reduced-motion: reduce`, igual que el resto del sistema.

### Validación real en Chrome
- **Desktop (~1536×639 real, ventana pedida en 1440×900 — representa el
  breakpoint crítico ≥960px de GSAP):** `ScrollTrigger` del pin de
  `#servicios` verificado con scroll de rueda real — progreso avanzó de
  0.375 a 0.563 con `pin:true` intacto y las cards con checkbox visibles.
  3 checkboxes marcados en `#servicios` (Ambiental/Hidrología/SST) y 2 en
  `#negocios-comerciales`, botón flotante mostrando el conteo correcto y
  colores por card sin overlap. Sin errores de consola.
- **768px y 375px — NO verificados visualmente.** `resize_window` del MCP
  de `claude-in-chrome` no cambió el viewport real en esta sesión: se probó
  768×1024, 800×1000 y 390×844 (en dos tabs distintas, una tras cerrar y
  recrear el grupo) y `window.innerWidth` siguió reportando ~1536 en todos
  los casos. Es la misma limitación de la herramienta ya documentada en la
  sesión de 2026-08-07 (`resize_window` no bajaba de ~502px entonces; en
  esta sesión ni eso). La revisión de código confirma que el mecanismo
  responsive subyacente no se alteró: `#servicios` sigue con scroll-snap
  nativo (no GSAP) por debajo de `min-width:960px`
  (`main.js:initServicios()`), `.nc-card` pasa a `flex:0 0 100%` en
  `@media (max-width:720px)`, y `.quote-bar` tiene
  `max-width:calc(100vw - 2.8rem)` + `text-overflow:ellipsis` como red de
  seguridad en pantallas angostas — pero esto **no sustituye** una
  verificación visual real.

### Pendiente de Camila / próxima sesión
- Confirmar visualmente 768px y 375px (reintentar `resize_window`, o usar
  DevTools device toolbar / la técnica de iframe same-origin documentada en
  la sesión de 2026-08-07 más abajo en este mismo archivo).
- Auditoría funcional de `initQuoteSelector()`: construcción del mensaje de
  WhatsApp, estado disabled/enabled del botón, y confirmar en dispositivo
  táctil real que el tap en el checkbox no interfiere con el pin-scroll en
  la zona de transición GSAP↔nativo (768–959px).
- Los CTAs individuales "Cotizar este servicio" no se tocaron — confirmar
  que siguen funcionando igual que antes (no debería haber regresión, son
  aditivos).

---

## Sesión 2026-08-07b — Fix: gap del canvas de constelación en `#servicios`

**Rama:** `fix/servicios-constellation-gap` (creada desde `main`, no se commiteó ni se hizo push)
**Encargo:** Corregir un corte/separación visual donde el canvas `#servConstellation` (fondo de red de partículas de `#servicios`) no cubría completamente el contenedor del carrusel.
**Estado:** COMPLETA — causa raíz confirmada empíricamente, fix aplicado y verificado en los 3 breakpoints solicitados.

### Causa raíz

`initServiciosConstellation()` en `main.js` dimensiona el `<canvas>` con una función `resize()` (`main.js:1295-1303`) que mide `section.getBoundingClientRect()` y fija `canvas.width/height` (buffer) + `canvas.style.width/height` (CSS) a ese valor. Esa función solo se reejecutaba en dos casos (`main.js:1422-1426`, antes del fix): la llamada inicial en el arranque, y el listener `addEventListener("resize", ...)` atado al evento global `resize` de `window`.

El problema: `.servicios` puede cambiar de alto por razones que **no disparan un evento `resize` de `window`** — swap de web fonts, carga tardía de contenido, o el reajuste del `pin-spacer` que GSAP ScrollTrigger crea para el modo horizontal-scroll de escritorio (`main.js:1064-1098`, activo con `min-width:960px`). Cuando eso ocurre, el canvas se queda con el tamaño de buffer/CSS congelado del último `resize()` mientras `.servicios`, `#servAmbient` y `.serv-viewport` sí crecen, dejando expuesto el fondo plano de la sección sin red de nodos — exactamente el "corte" reportado.

**Reproducción controlada (antes del fix):** en una vista de 768px (modo scroll nativo, sin GSAP pin) se infló artificialmente el alto de `.serv-hint` en 300px vía JS, sin disparar ningún evento de `resize`:
```
before: { sec: {h: 1004}, cv: {h: 1004} }   // canvas sincronizado
after:  { sec: {h: 1304}, cv: {h: 1004} }   // sección creció, canvas se quedó atrás → gap de 300px
```
Esto confirma la causa: el mecanismo de resincronización del canvas dependía únicamente de `window resize`, sin observar el contenedor real.

Verifiqué previamente, y descarté como causa, las hipótesis del diagnóstico original: mismatch de posicionamiento CSS (`.servicios-ambient`/`.serv-constellation-canvas` con `position:absolute; inset:0`, sin padding/border en `.servicios` — los rects de `.servicios`, `#servAmbient` y `#servConstellation` coincidían exactamente en carga limpia), y mismatch de buffer dpr (`Math.round(rect.width*dpr)` con `ctx.setTransform(dpr,...)` es correcto, sin desalineación visible). El problema real no era estático, era de **resincronización ante cambios de layout no atados a `window resize`**.

### Fix aplicado

**Archivo:** `C:\Users\DAIRON NARVAEZ\Escritorio\ecodesa-web\main.js`, dentro de `initServiciosConstellation()`, inmediatamente después del listener de `resize` existente (antes de la línea que ahora es ~1427).

Añadí un `ResizeObserver` sobre `section` (`.servicios`) que reejecuta `resize(); spawn(); draw()` cuando el **box real de layout** de la sección cambia, sin depender de que `window` dispare `resize`:

```js
addEventListener("resize", () => { resize(); spawn(); draw(performance.now()); }, { passive: true });

/* El resize por window no cubre cambios de layout que no disparan un
   evento de resize global (font-swap, carga tardía de contenido,
   ajuste del pin-spacer de GSAP en el modo horizontal-scroll) — sin
   esto el canvas quedaba con tamaño obsoleto y dejaba un corte visible
   en el borde de la sección. ResizeObserver reacciona al box real de
   layout de la sección (ignora los transform:scale de las tarjetas
   activas, que son solo de pintura y no disparan reflow). */
if ("ResizeObserver" in window) {
  let firstRO = true;
  new ResizeObserver(() => {
    if (firstRO) { firstRO = false; return; }
    resize(); spawn(); draw(performance.now());
  }).observe(section);
}
```

**Por qué `ResizeObserver` y no, p. ej., un `MutationObserver` o polling:** `ResizeObserver` observa el *border-box* real de layout — no se dispara con los `transform:scale` que `cardFx()` aplica a las tarjetas activas durante el scroll del carrusel (transform es solo de composición/pintura, no genera reflow), así que no hay riesgo de respawns excesivos de nodos durante la animación normal del carrusel. Solo reacciona cuando `.servicios` realmente cambia de tamaño.

**Guard `firstRO`:** `ResizeObserver` invoca su callback una vez de forma asíncrona apenas se llama `.observe()`, con el tamaño ya vigente (redundante con la llamada `resize()` explícita que ya corre en la inicialización, `main.js:1422-1424`). El guard evita un respawn de nodos innecesario justo al cargar la página.

**No se tocó:** la lógica de partículas/enlaces/pulsos, el listener de `window resize` existente (se mantiene como fallback), la paleta de colores, ni ningún otro archivo. Cambio de una sola función, ~14 líneas añadidas.

### Verificación con evidencia real (Chrome, `claude-in-chrome`, conectado sin problemas esta sesión)

Metodología: dado que `resize_window` en este equipo no baja del tamaño nativo de la ventana (~1536×639, ver memoria de sesiones previas), usé la técnica de iframe same-origin (`document.write` con `<iframe src="http://localhost:8765/" style="width:NNNpx">`) para emular cada breakpoint exacto, más `getBoundingClientRect()` comparado entre `.servicios`, `#servAmbient` y `#servConstellation` en cada caso, además de screenshots/zooms de los 4 bordes.

| Breakpoint | Modo carrusel | Rects `sec`/`amb`/`cv` | Evidencia visual |
|---|---|---|---|
| **~375px** (iframe 375×1200) | Nativo (scroll-snap, `js-hscroll` ausente) | Idénticos: `{top:0,left:10,right:350,bottom:1200}` en los tres | Screenshot superior: red de nodos hasta el borde superior/izquierdo/derecho. Zoom del borde inferior (y:580-639): nodos visibles detrás de "DESLIZA PARA RECORRER LAS 6 ÁREAS", sin corte. |
| **~768px** (iframe 768×1100) | Nativo (sin pin GSAP; breakpoint intermedio entre mobile y `min-width:960px`) | Idénticos: `{top:0,left:12,right:741,bottom:1100}` | Screenshot superior: red hasta las 4 esquinas. Zoom del borde inferior (y:550-639): línea de conexión y nodos justo en el borde redondeado de la tarjeta, sin gap. Repetí este breakpoint tras el fix con el mismo test de inflado artificial (+300px sin evento resize) y el canvas **sí se resincronizó**: `after: {sec:{h:1304}, cv:{h:1304}}`, `fixed:true`. |
| **~1440px** (iframe 1440×960) | GSAP pin (`js-hscroll` activo, `min-width:960px`) | Idénticos: `{top:0,left:23,right:1448,bottom:960}`, incluyendo la zona de `.serv-hint` (`{top:809,bottom:826}`, dentro del rango del canvas) | Screenshot + zoom de esquina superior-derecha (dots/líneas hasta el borde). Screenshot con scroll adicional dentro del pin mostrando la banda inferior de la sección (debajo de las tarjetas 04/05): red de nodos visible hasta el borde inferior, sin corte. |

En los tres breakpoints, antes y después del fix, `.servicios`, `#servAmbient` y `#servConstellation` midieron **exactamente el mismo rect** en carga limpia (sin el fix ya se comprobó que el problema no era estático sino de resincronización — ver reproducción controlada arriba). Después del fix, la reproducción controlada en 768px confirma que el `ResizeObserver` corrige el caso que antes fallaba.

**No verificado en esta sesión:** navegadores distintos de Chrome (Safari/Firefox), y el caso específico de swap de web fonts en una red lenta real (en localhost los fonts ya estaban cacheados en cada prueba). El fix cubre la causa estructural (falta de un observer de layout), por lo que debería resolver también esos casos, pero no hay evidencia visual directa de ellos.

### Pendiente de Camila

Ninguna dependencia funcional — el cambio es puramente de sincronización visual de un canvas decorativo (`aria-hidden="true"`, `pointer-events:none`), no toca navegación, datos, formularios ni lógica de negocio. Si se audita, alcance sugerido: solo `#servicios` en `index.html`, confirmando que el carrusel (scroll horizontal en escritorio, scroll-snap nativo en móvil) sigue funcionando igual que antes del fix — el `ResizeObserver` no interviene en esa lógica.

---

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

## Sesión 2026-08-09 — Verificación independiente: halo verde ausente en íconos de "Control de cumplimiento" (mobile/tablet)

**Rama:** `feature/hero-marcela-v1` (worktree en
`.worktrees\hero-marcela-v1`), sirviendo `index.html` vía servidor estático
local en `http://localhost:8791/index.html`.
**Encargo:** validación visual independiente de un fix ya aplicado (no
commiteado) por otro agente en `index.html:196-217` — un `<radialGradient
id="custodyHaloGrad">` y `<filter id="custodyHaloShadow">` que vivían dentro
del `<defs>` del SVG `.custody-constellation--wide` (oculto por
`display:none` en tablet/mobile) se movieron a un `<svg width="0" height="0"
style="position:absolute">` dedicado que se renderiza siempre, para que los
otros dos SVG (`--tablet`, `--mobile`) puedan seguir resolviendo
`url(#custodyHaloGrad)`/`url(#custodyHaloShadow)` como paint-server aunque
el SVG `--wide` esté oculto.
**Estado:** COMPLETA — verificado con evidencia visual real e inspección de
DOM en los 3 breakpoints pedidos.

### Limitación de entorno reconfirmada por tercera vez

`resize_window` (herramienta `claude-in-chrome`) reportó éxito al pedir
375×812 y 400×850, pero `window.innerWidth` tras la llamada seguía fijo en
1536 (el tamaño de pantalla física de esta máquina) — mismo problema ya
documentado en las dos sesiones anteriores de este archivo. Confirmado con
`javascript_tool` leyendo `innerWidth`/`outerWidth`/`screen.width` (los tres
iguales a 1536), así que no es un artefacto de zoom de captura sino que el
viewport real de la pestaña no cambió.

**Método usado en su lugar (más preciso que el iframe de la sesión
anterior):** en vez de simular el breakpoint dentro de la misma pestaña, se
lanzó una instancia headless independiente del Chrome del sistema
(`C:\Program Files\Google\Chrome\Application\chrome.exe`) vía
`puppeteer-core` (ya presente en `node_modules` del repo raíz, sin instalar
nada nuevo), con `page.setViewport()` fijando el viewport real del proceso
de renderizado a 375, 768 y 1440px (`deviceScaleFactor: 2`), navegando a la
misma URL que sirve el fix. Esto da un viewport CSS genuino (no una
aproximación), a diferencia del truco de iframe usado la sesión anterior.
Script en el scratchpad de esta sesión (no en el repo).

### Hallazgos

**[V2] Verificación visual del fix — sin hallazgos bloqueantes**
- **Ubicación:** `.hero-control-card` / `.custody-constellation--{wide,tablet,mobile}`, `index.html:196-288`
- **Evidencia e impacto:** en los 3 breakpoints, `getComputedStyle` confirma
  que el SVG de constelación correcto está activo por breakpoint
  (`--mobile` a 375px, `--tablet` a 768px, `--wide` a 1440px) y que los 3
  `.custody-halo` de cada uno resuelven `fill: url("#custodyHaloGrad")` y
  `filter: url("#custodyHaloShadow")` sin caer a `none`. Las capturas de
  pantalla (Chrome headless real, no simulación) muestran los 3 íconos con
  su halo verde degradado completo, glifo interior nítido (documento /
  engranaje IA / velocímetro-escudo), sombra sutil y etiqueta legible en los
  tres tamaños. No se observó el bug original (trazo flotando sin relleno).
- **Intervención:** ninguna — solo validación del fix ya aplicado.
- **Verificación:** capturas guardadas en el scratchpad de esta sesión:
  `halo-375w.png`, `halo-768w.png`, `halo-1440w.png` (recorte de
  `.hero-control-card` con `element.screenshot()`, no captura de pantalla
  completa).

**[V2] Contraste de texto sobre la tarjeta — aceptable, medido de forma aproximada**
- **Ubicación:** `.hero-route-kicker` ("CONTROL DE CUMPLIMIENTO") y `.custody-label` dentro de `.hero-control-card`
- **Evidencia e impacto:** el fondo real de la tarjeta se pinta por capas
  (gradientes de ancestros), así que `getComputedStyle` en `.hero-control-card`
  devuelve `background-color: rgba(0,0,0,0)` — no hay un color sólido único
  contra el cual calcular la razón de contraste con precisión. Usando negro
  puro como aproximación conservadora del fondo oscuro visible en las
  capturas: kicker `rgb(134,209,74)` ≈ 11.2:1, labels `rgb(232,245,233)` ≈
  18.7:1 — ambos muy por encima de 4.5:1 incluso con el margen de error de
  la aproximación. No es un hallazgo, se registra el método para
  transparencia.
- **Intervención:** ninguna requerida.
- **Verificación:** script de contraste en el scratchpad de esta sesión.

**Sin regresión detectada** en jerarquía visual, alineación de las 3 tarjetas-nodo, ni en las líneas/puntos de conexión (`.custody-network`) en ningún breakpoint. `prefers-reduced-motion` sigue cubriendo `.custody-pulse` y `.custody-network path` (`styles.css:3690-3726`, sin tocar). No se probaron los estados hover/focus de la tarjeta porque no es interactiva (solo decorativa, `aria-hidden` en los SVG).

### Pendiente
- No se verificó con el DevTools real del usuario (mismo límite de entorno
  que en la sesión anterior); la evidencia aquí viene de una instancia
  headless independiente del Chrome del sistema, que es una fuente de
  verdad distinta pero igualmente real (viewport CSS genuino, no simulado).
- No se probó orientación landscape en mobile/tablet para esta tarjeta
  específica (fuera del alcance pedido).

## Sesión 2026-08-09 — Verificación fix cápsula "DESPLAZA" (scroll cue) en móvil

**Rama:** `feature/hero-marcela-v1` (worktree). **Encargo:** verificar el fix
de Carlos para el bug crítico reportado por mí en esta misma rama — la
cápsula "DESPLAZA" del hero quedaba recortada/invisible en el primer render
en móvil porque `.scrollcue` era `position:absolute` anclado al fondo de
`.hero`, y `.hero` mide ~1.5–1.8× la altura del viewport en móvil (apilado
kicker+título+descripción+2 CTAs+tarjeta "Control de cumplimiento").
**Fix revisado (sin commitear, `main.js` +16/-0, `styles.css` +31/-0):**
`.scrollcue` pasa a `position:fixed` solo en `@media (max-width:520px)`,
más un `IntersectionObserver` (`initScrollCue`, `main.js`) que la oculta al
salir del hero, más un fondo+blur propio en `.scrollcue-label` para que no
quede ilegible sobre `.hero-trust-line`.

**Método:** `resize_window` de `claude-in-chrome` sigue sin reflejar el
viewport real en esta máquina ([[feedback_resize_window_broken]] — no se
reintentó, la limitación es confirmada y estable). Se usó **puppeteer-core**
headless (Chrome del sistema) apuntado a `http://localhost:8793/index.html`
(servidor estático del worktree, confirmado con `curl` → 200), con
`page.setViewport()` para viewport CSS genuino y `getBoundingClientRect()`
para medir posición real en vez de inferir de una captura.

### Veredicto: **APROBADO con 1 hallazgo menor (V2) no bloqueante**

El bug crítico reportado (cápsula recortada/invisible en la primera carga)
está **resuelto y verificado**. Hay un hallazgo nuevo y aislado (overlap
cosmético en un tamaño de viewport específico) que no bloquea el fix
principal — ver detalle abajo.

### 1. Cápsula visible completa en el primer render (sin scroll previo)
- **Evidencia:** `scrollY=0`, `getBoundingClientRect()` de `.scrollcue` vs
  `window.innerHeight`, en **9 tamaños reales de dispositivo** (no solo
  375/390 pedidos): iPhone SE (375×667), iPhone 8/X/11 Pro/12 mini
  (375×812 — el tamaño reportado originalmente con el bug), iPhone 12–14
  (390×844), iPhone 14 Pro (393×852), iPhone 11/XR (414×896), Pixel 7
  (412×915), Galaxy S8/S20/S22 (360×740, 360×800), Android chico
  (360×640). **`cueFullyVisible: true` en los 9**, tema oscuro y claro.
  Antes del fix, en 375×812 la cápsula estaba a `top≈1414px` contra un
  `innerHeight` de 812px (ver reporte de Carlos); ahora `top≈715–862px`,
  siempre dentro de los límites del viewport.
- **Capturas:** `scrollcue_375x812_dark_top.png`,
  `scrollcue_375x812_light_top.png`, `scrollcue_390x844_dark_top.png`,
  `scrollcue_390x844_light_top.png` (scratchpad de esta sesión) — cápsula
  completa (track + punto animado + label "DESPLAZA") visible sin recorte
  en ambos anchos y temas, sin necesidad de scroll.
- **Intervención:** ninguna — fix de Carlos confirmado correcto.

### 2. Ocultamiento al salir del hero
- **Evidencia:** en 375×812 dark, `window.scrollTo(0, 2200)` (pasado el
  hero) → `.scrollcue` queda con `opacity:0` y clase `.is-hidden`
  confirmada. No flota sobre el resto de la página.

### [V2] Overlap cosmético entre el label "DESPLAZA" y `.hero-trust-line` en un tamaño específico (375×812)
- **Ubicación:** `styles.css:1370-1386` (`@media max-width:520px`),
  `.scrollcue`/`.scrollcue-label` vs `.hero-trust-line`.
- **Evidencia e impacto:** en **375×812 exactamente** (iPhone 8/X/11
  Pro/12 mini — tamaño de referencia real y común), el rect del label
  "DESPLAZA" (`top≈759, bottom≈783`) se solapa verticalmente con el rect de
  `.hero-trust-line` (`top≈771, bottom≈804`, el texto "Criterio, validación
  y responsabilidad de profesionales técnicos."). El label en sí sigue
  legible (tiene su propio fondo+blur, fix de Carlos), pero la píldora
  tapa parcialmente la palabra "responsabilidad" del texto de confianza
  detrás — confirmado visualmente en capturas recortadas
  `zoom_cue_dark.png` / `zoom_cue_light.png` (más notorio en tema claro,
  fondo blanco opaco que corta la palabra en seco). **Probado en los otros
  8 tamaños de la lista de arriba: no ocurre en ninguno** (390×844,
  393×852, 414×896, 412×915, 360×740/800/640, 375×667) — es específico de
  la combinación de altura de viewport (~812px) con la posición de flujo
  del `.hero-trust-line` en ese ancho. No es una regresión del fix (el fix
  ya redujo el impacto poniendo fondo al label; el remanente es que ese
  fondo, al ser una píldora angosta, no cubre toda la línea de texto detrás).
- **Intervención:** ninguna aplicada — fuera del alcance de esta
  verificación (se pidió revisar el fix ya hecho, no iterar sobre él). Sugerencia
  para una próxima pasada: en vez de una píldora angosta pegada al label,
  usar un scrim más ancho detrás de todo `.scrollcue` (cubriendo también el
  `.hero-trust-line` cuando coincide), o desplazar `.hero-trust-line`
  ligeramente hacia arriba en ese rango de altura para que no compita con
  la zona reservada a la cápsula fija.
- **Verificación:** `sweep_overlap.js` (scratchpad), 9 viewports,
  `labelOverlapsTrust` calculado por intersección de rects.

### 3. Sin regresión en tablet (768×1024) y desktop (1440×900)
- **Evidencia:** `.scrollcue` mantiene `position:absolute` en ambos
  (media query nueva es `≤520px` únicamente, sin tocar), igual que antes
  del fix. En ambos casos `fullyInViewport:false` porque `.scrollcue`
  sigue anclada al fondo de un `.hero` más alto que el viewport
  (1316px vs 1024px en tablet; 989px vs 900px en desktop) — **este es el
  mismo comportamiento pre-existente, no un cambio de esta sesión ni del
  fix de Carlos** (fuera del alcance del bug reportado, que era
  específicamente móvil). Confirmado en tema oscuro y claro, sin
  diferencias entre temas.

### Nota fuera de alcance (no bloqueante)
`.scrollcue-label` usa `color: var(--ink-40)` (~0.42 de alpha) — un token
de "quiet label" ya existente en el sitio *antes* de esta sesión (la regla
vive fuera del media query nuevo, `styles.css:1322`). No es parte del diff
de Carlos. Se menciona solo como observación de contraste bajo en un
elemento decorativo (scroll hint), no como hallazgo de este fix.

### Archivos
- `main.js` (+16), `styles.css` (+31) — sin commitear, revisados vía `git
  diff --stat`.

### Pendiente de Camila
- Ninguna dependencia funcional: el fix es puramente posicional/CSS + un
  `IntersectionObserver` de solo-lectura (no toca lógica de negocio,
  formularios ni navegación). Si se decide commitear, las rutas a incluir
  en su revisión son únicamente `main.js` e `index.html`/`styles.css` del
  hero — sin efectos esperados fuera de esa sección.

---

## Sesión 2026-08-10 — Cierre cápsula "DESPLAZA" (V2 pendiente) + tipografía móvil de `.normas`

**Rama:** `feature/hero-marcela-v1` (worktree), servidor estático local en
`http://localhost:8795/index.html`. **Encargo:** (1) investigar en la web
`position:sticky` vs. alternativas antes de tocar código, y cerrar de forma
robusta el hallazgo V2 (overlap `.scrollcue-label`/`.hero-trust-line` en
375×812) que quedó documentado sin corregir en la sesión anterior; (2)
evaluar y corregir la presentación móvil de `.normas` (sellos ISO/HACCP/etc,
sin ningún `@media` propio hasta ahora). Esta vez con implementación directa
de código, no solo auditoría.

### 1. Investigación previa (resumen, con fuentes)

- **El bug real de la v2 (`position:fixed` + `backdrop-filter` "viajando"
  con el contenido) es un problema de compositor de WebKit/iOS conocido y
  documentado**: la recomendación encontrada es "no pongas
  `background-color`/`backdrop-filter` directamente en el elemento
  fixed/sticky; ponlo en un descendiente" — [Safari 26 and the Strange Case
  of Fixed Overlays](https://www.edoardolunardi.dev/blog/safari-26-and-the-strange-case-of-fixed-overlays),
  [iOS 26 Safari fixed/sticky misplacement](https://pratikpathak.com/fix-ios-26-safari-web-layouts-are-breaking-due-to-fixed-sticky-position-elements-getting-misplaced/).
  El fix ya vigente (commit previo) ya cumple esto: el `backdrop-filter`
  vive en `.scrollcue-track`/`.scrollcue-label` (hijos), nunca en
  `.scrollcue` (el elemento `sticky` en sí) — confirmado que no hace falta
  moverlo.
- **`position:sticky` sí tiene un bug residual conocido y documentado en
  Safari** (distinto y mucho más leve que el de `fixed`): con
  `bottom:X`, el elemento no sigue a la barra de herramientas cuando esta
  se retrae durante el scroll — se queda "atascado" en la altura donde
  estaba la barra, dejando un hueco transitorio, en vez de viajar con el
  contenido como hacía `fixed` — [Apple Developer Forums, thread
  801028](https://developer.apple.com/forums/thread/801028) (reportado en
  iOS 26, sin fix oficial de Apple a la fecha). Es un bug real y sin
  workaround de CSS, pero de impacto muchísimo menor (hueco cosmético
  transitorio) que el de `fixed` (elemento fuera de sitio sobre el
  contenido) — no se puede corregir desde el código, se documenta como
  limitación conocida y aceptada.
- **Gotcha de `position:sticky` dentro de contenedores flex/con overflow
  en ancestros — verificado que NO aplica aquí**: `sticky` se rompe si
  algún ancestro tiene `overflow` distinto de `visible` (se vuelve sticky
  respecto a ese ancestro, no al viewport) — [Getting stuck: all the ways
  position:sticky can fail](https://polypane.app/blog/getting-stuck-all-the-ways-position-sticky-can-fail/).
  Se confirmó en `styles.css`: `html`/`body` usan **`overflow-x: clip`**
  (no `hidden`) — precisamente el valor que evita este problema sin
  romper `sticky` ([confirmado por
  terluinwebdesign.nl](https://www.terluinwebdesign.nl/en/blog/position-sticky-not-working-try-overflow-clip-not-overflow-hidden/):
  `overflow:hidden` en el body rompe `sticky` en todo el sitio;
  `overflow:clip` no, porque no crea scroll container). `.hero` tiene
  `overflow: visible` explícito. No hay ningún ancestro entre `.scrollcue`
  y el viewport con `overflow:hidden/auto/scroll`. También se verificó el
  gotcha de "stretch en flex sin alto" (`align-items:stretch` por
  defecto puede dejar al sticky sin margen para moverse) — no aplica: el
  `flex-wrap:wrap` ya existente hace que `.scrollcue` ocupe su propia
  línea flex, con altura propia (no estirada).
- **CSS Scroll-driven Animations (`animation-timeline: view()`)**:
  investigado como alternativa "más moderna" al `IntersectionObserver`
  actual para el fundido de salida. Soporte ya amplio en 2026 (Safari 18+,
  Chrome/Edge 115+, Firefox 132+ —
  [Chrome for Developers](https://developer.chrome.com/docs/css-ui/scroll-driven-animations),
  [WebKit blog](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)),
  pero **no es un sustituto de `position:sticky`**: solo controla progreso
  de animación según scroll/visibilidad, no puede "anclar" un elemento
  dentro de su contenedor sin JS ni otra primitiva de posicionamiento. Se
  descarta como reemplazo del problema de fondo (anclaje), y no se
  justifica cambiarlo por el mecanismo de fundido actual (el
  `IntersectionObserver` ya funciona, verificado, y no tiene ningún bug
  reportado) — cambiarlo sería dependencia nueva sin problema que resuelva.

**Veredicto de la investigación: `position:sticky` es la primitiva
correcta y ya estaba bien elegida.** No se revierte ni se sustituye por
otra alternativa. Lo único que faltaba era cerrar el hallazgo V2 (overlap
visual), no el mecanismo de anclaje en sí.

### 2. Fix aplicado — Encargo 1 (cierre del hallazgo V2)

**Causa por qué el hallazgo no era "solo un caso aislado de 375×812"**: la
librería de investigación (arriba) confirma que la altura efectiva del
viewport en Safari cambia dinámicamente según la barra de herramientas se
retrae/expande durante el scroll real — así que el punto exacto donde
`.scrollcue-label` coincide verticalmente con `.hero-trust-line` no es fijo
a un solo tamaño de pantalla estático, puede recurrir en cualquier
dispositivo según cuánto haya colapsado la UI del navegador en ese
instante. Un fix que dependiera de "mover un elemento X px para que no
choquen en 812px" habría sido frágil.

**Fix robusto elegido**: en vez de que el label cargue su propio fondo
angosto (que solo cubre el ancho del texto "DESPLAZA"), se añadió un
`::before` en `.scrollcue` con:
- `width: 100vw` centrado (`left:50%; transform:translateX(-50%)`) —
  cubre TODO el ancho del viewport detrás de la cápsula, no solo el ancho
  del label. Así, sin importar en qué X caiga el texto detrás
  (`.hero-trust-line` u otro), o si el punto de colisión se mueve por el
  bug de altura dinámica de Safari, siempre queda completamente oculto —
  nunca cortado a la mitad de una palabra.
- Gradiente vertical (no un bloque opaco parejo) para que se lea como un
  velo suave, no una barra dura.
- `backdrop-filter` en este pseudo-elemento (un descendiente absolute),
  **no en `.scrollcue` mismo** — seguí la recomendación encontrada en la
  investigación (punto 1) para el bug de compositor de WebKit.
- `pointer-events:none` y `z-index:-1` para no interferir con el toque ni
  taparse a sí mismo detrás de track/dot/label.
- Confirmado que `overflow-x:clip` en `html`/`body` (ya existente)
  absorbe el `width:100vw` sin generar scroll horizontal — verificado con
  `document.documentElement.scrollWidth === innerWidth` en 320/375/390px
  (script de scratchpad, sin cambios).

**Archivo:** `styles.css`, dentro del mismo bloque `@media (max-width:
520px)` que ya traía el fix de `sticky` (sin tocar nada fuera de ese
bloque ni fuera de `.scrollcue*`).

### 3. Fix aplicado — Encargo 2 (`.normas` en móvil)

Confirmado el diagnóstico del encargo: no existía ningún `@media` sobre
`.normas`/`.seal*` antes de este cambio — mismos tamaños en 375px que en
1440px.

- **Hallazgo de contraste no pedido explícitamente pero descubierto al
  auditar legibilidad**: `.normas-title` y `.seal-name` usaban
  `--ink-55` (alpha 0.58) sobre `--white`. Calculado el contraste WCAG:
  **≈3.88:1 en tema claro — por debajo de 4.5:1 AA** (no califica como
  "texto grande" a 11px/9px, peso 500). Se cambió a `--ink-70` (mismo
  token del sistema, sin inventar color nuevo): **≈6.41:1 en claro,
  ≈6.22:1 en oscuro** — ambos superan AA con margen. `--emerald-2` (sufijo
  ISO en `.seal-ring b i`) ya daba ≈7.89:1, sin cambios ahí.
- **`.seal-name` y el sufijo ISO a 0.56rem (~9px) eran el texto más
  pequeño de todo `styles.css`** (confirmado con grep de todos los
  `font-size` del archivo) — por debajo del piso de ~0.62rem que usan el
  resto de los "labels" mono pequeños del sistema en otras secciones. Se
  subieron a ese piso ya establecido (`.seal-name` a 0.64rem, sufijo ISO a
  0.62rem) en vez de inventar una escala nueva.
- **`.normas-title`** subido un paso (0.68rem→0.74rem) y con
  `letter-spacing` reducido (0.2em→0.14em) solo en móvil: a 0.68rem con
  tracking tan ancho, la oración completa se leía estirada y aumentaba
  innecesariamente el número de líneas en 375–390px.
- Todo dentro de un nuevo `@media (max-width: 520px)` (mismo breakpoint
  que ya usa el resto del hero/sistema para móvil), sin tocar
  `.seal-ring`, tamaños de anillo, gap del marquee ni la animación (que ya
  estaba correctamente cubierta por `prefers-reduced-motion: reduce`,
  verificado sin cambios).

### 4. Validación real (Chrome headless vía puppeteer-core — `resize_window` sigue sin reflejar el viewport real en esta máquina, [[feedback_resize_window_broken]])

Viewports **375×812** y **390×844**, temas **claro y oscuro**, con
`page.setViewport()` (viewport CSS genuino) contra
`http://localhost:8795/index.html`.

**Cápsula "DESPLAZA":**
- `position: sticky` confirmado por `getComputedStyle` en ambos
  viewports.
- Visible completa en el primer render sin scroll (`fullyInViewport:
  true` en los 4 casos).
- **Scroll real simulado con `page.mouse.wheel()`** (no `scrollTo()`
  instantáneo — la sesión anterior ya había señalado que ese método no
  reproduce el bug real): 25 eventos de rueda, midiendo
  `getBoundingClientRect().top` cada 5 eventos. **`top` idéntico en las 6
  muestras** en los 4 casos (375/390 × claro/oscuro) — cero drift, la
  cápsula no "viaja" con el contenido.
- Al salir del hero (scroll continuado): `opacity:0`, clase `.is-hidden`
  confirmada en los 4 casos — sigue ocultándose bien.
- **Overlap visual en 375×812**: geométricamente el rect del label sigue
  coincidiendo con `.hero-trust-line` (`labelOverlapsTrustGeometry:
  true`, esperado — no se movió ningún elemento). Pero visualmente, con
  el nuevo scrim de 100vw, el texto detrás queda atenuado/desenfocado de
  forma pareja en vez de cortado a la mitad de una palabra — confirmado
  en capturas (`hero_bottom_375x812_dark.png`,
  `hero_bottom_375x812_light.png`, scratchpad de esta sesión). En 390×844
  no hay overlap geométrico en absoluto (`labelOverlapsTrustGeometry:
  false`) — cápsula y línea de confianza con espacio limpio entre ambas
  (`cue_390x844_dark.png`).

**`.normas` en móvil:**
- Capturas limpias de la sección completa en los 4 casos
  (`normas3_375x812_{dark,light}.png`, `normas3_390x844_{dark,light}.png`,
  scratchpad de esta sesión, offset manual bajo el nav fijo de 73px para
  que el título no quedara tapado por el header). Título en 2 líneas
  legible, sellos con nombre claramente más grandes y con mejor contraste
  que antes, sin desbordamiento horizontal, spacing entre sellos sin
  sentirse apretado.
- `getComputedStyle` confirma los valores aplicados: `.normas-title`
  11.84px / `rgba(…, 0.74)` (antes 10.88px / alpha 0.58); `.seal-name`
  10.24px / mismo color (antes 8.96px); sufijo ISO 9.92px (antes 8.96px).
- Sin overflow horizontal en 320/375/390px
  (`document.documentElement.scrollWidth === innerWidth` en los 3, script
  de scratchpad).

### 5. Archivos

- `styles.css` — único archivo tocado. Bloque `.scrollcue::before` dentro
  de `@media (max-width:520px)` (Encargo 1); `.normas-title`/`.seal-name`
  color a `--ink-70` (aplica a todos los breakpoints, fix de contraste);
  nuevo `@media (max-width:520px)` para `.normas-title`/`.seal-ring b
  i`/`.seal-name` (Encargo 2). Sin cambios en `index.html` ni `main.js`.
  Sin commitear.

### Pendiente de Camila
- Ninguna dependencia funcional en ninguno de los dos encargos — cambios
  puramente CSS (posicionamiento, color, tamaño de fuente), sin tocar
  lógica, datos, navegación ni formularios. Si se audita, alcance
  sugerido: `.scrollcue*` y `.normas`/`.seal*` en `styles.css` únicamente,
  confirmando que ningún otro selector quedó huérfano.
- **No verificado en Safari/iOS real** (mismo límite de entorno que
  sesiones anteriores) — la investigación web y el scroll real simulado
  en Chrome dan alta confianza, pero el bug residual de `sticky` +
  retracción de toolbar (sección 1) solo es reproducible en Safari real.
