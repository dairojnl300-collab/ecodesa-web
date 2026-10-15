/* Banner y panel de cookies — ECODESA · política v1.0 (Consent Mode v2) */
(function () {
  "use strict";
  var KEY = "ecodesa-consent", VER = "1.0";
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") window.gtag = function () { window.dataLayer.push(arguments); };

  function read() {
    try { var c = JSON.parse(localStorage.getItem(KEY) || "null"); return c && c.v === VER ? c : null; } catch (e) { return null; }
  }
  function apply(a, ads) {
    var g = function (x) { return x ? "granted" : "denied"; };
    window.gtag("consent", "update", { analytics_storage: g(a), ad_storage: g(ads), ad_user_data: g(ads), ad_personalization: g(ads) });
  }
  function save(a, ads) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: VER, fecha: new Date().toISOString(), analytics: !!a, ads: !!ads })); } catch (e) {}
    apply(a, ads);
  }

  var box, banner, panel, swA, swP, live, opener = null, decided = !!read();

  function el(t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h) n.innerHTML = h; return n; }

  function build() {
    box = el("div", "ck-root");
    banner = el("div", "ck ck-banner");
    banner.setAttribute("role", "region"); banner.setAttribute("aria-label", "Aviso de cookies"); banner.hidden = true;
    banner.innerHTML =
      '<p>Usamos cookies técnicas para que el sitio funcione y, solo si usted lo acepta, cookies de analítica y publicidad de Google para medir y mejorar nuestro sitio y mostrarle anuncios de ECODESA. Esto puede implicar tratamiento de datos por Google fuera de Colombia, incluidos EE. UU. Más información en la <a href="/cookies">Política de Cookies</a>.</p>' +
      '<div class="ck-btns"><button type="button" class="ck-b ck-main" data-a="all">Aceptar todas</button><button type="button" class="ck-b ck-main" data-a="none">Rechazar</button><button type="button" class="ck-b ck-alt ck-conf" data-a="conf" aria-haspopup="dialog">Configurar</button></div>';
    panel = el("div", "ck ck-panel");
    panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "false"); panel.setAttribute("aria-labelledby", "ckT"); panel.hidden = true;
    panel.innerHTML =
      '<h2 id="ckT" tabindex="-1">Configurar cookies</h2>' +
      '<p class="ck-intro">Elija qué cookies permite. Puede cambiar su decisión en cualquier momento desde «Configurar cookies», en el pie de página.</p>' +
      '<div class="ck-cat"><h3>Técnicas (necesarias)</h3><p>Permiten que el sitio funcione y recuerdan su tema claro u oscuro y su elección de cookies. No se pueden desactivar.</p><span class="ck-ctl ck-always">Siempre activas</span></div>' +
      '<div class="ck-cat"><h3 id="ckHa">Analíticas</h3><p id="ckDa">Google Analytics nos ayuda a entender, de forma estadística, cómo se usa el sitio para mejorarlo.</p><span class="ck-ctl ck-sw"><input type="checkbox" role="switch" id="ckA" aria-labelledby="ckHa" aria-describedby="ckDa"><span aria-hidden="true"></span></span></div>' +
      '<div class="ck-cat"><h3 id="ckHp">Publicidad y remarketing</h3><p id="ckDp">Google Ads mide el resultado de nuestras campañas y le muestra anuncios de ECODESA en otros sitios. Incluye personalización de anuncios y uso de datos para publicidad.</p><span class="ck-ctl ck-sw"><input type="checkbox" role="switch" id="ckP" aria-labelledby="ckHp" aria-describedby="ckDp"><span aria-hidden="true"></span></span></div>' +
      '<p class="ck-note">Al activar analítica o publicidad, usted autoriza que Google trate sus datos de navegación, incluso fuera de Colombia. Detalles en la <a href="/cookies">Política de Cookies</a> y la <a href="/datos">Política de Datos</a>.</p>' +
      '<div class="ck-btns"><button type="button" class="ck-b ck-main" data-a="save">Guardar mi selección</button><button type="button" class="ck-b ck-main" data-a="all">Aceptar todas</button><button type="button" class="ck-b ck-main" data-a="none">Rechazar todas</button></div>';
    live = el("div", "ck-live"); live.setAttribute("role", "status"); live.setAttribute("aria-live", "polite");
    box.appendChild(banner); box.appendChild(panel); box.appendChild(live);
    document.body.appendChild(box);
    swA = panel.querySelector("#ckA"); swP = panel.querySelector("#ckP");
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-a]"); if (!b) return;
      var a = b.getAttribute("data-a");
      if (a === "conf") openPanel(b);
      else if (a === "all") decide(true, true);
      else if (a === "none") decide(false, false);
      else if (a === "save") decide(swA.checked, swP.checked);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) closePanel();
    });
  }

  function decide(a, ads) {
    save(a, ads); decided = true;
    banner.hidden = true; panel.hidden = true;
    live.textContent = "Preferencias de cookies guardadas.";
    if (opener && document.body.contains(opener)) { try { opener.focus(); } catch (e) {} }
    opener = null;
  }

  function openPanel(from) {
    var c = read();
    swA.checked = !!(c && c.analytics); swP.checked = !!(c && c.ads);
    if (from) opener = from;
    banner.hidden = true; panel.hidden = false;
    var t = panel.querySelector("#ckT"); t.focus();
  }

  function closePanel() {
    panel.hidden = true;
    if (!decided) { banner.hidden = false; var b = banner.querySelector('[data-a="conf"]'); if (b) b.focus(); }
    else if (opener && document.body.contains(opener)) { try { opener.focus(); } catch (e) {} }
    opener = null;
  }

  function init() {
    build();
    if (!decided) banner.hidden = false;
    document.addEventListener("click", function (e) {
      var o = e.target.closest("[data-consent-open]");
      if (!o) return;
      e.preventDefault(); openPanel(o);
    });
  }
  window.ecodesaConsent = { open: function () { openPanel(document.activeElement); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
