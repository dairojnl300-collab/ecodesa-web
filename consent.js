/* Banner y panel de cookies — ECODESA · política v1.1 (Consent Mode v2) */
(function () {
  "use strict";
  var KEY = "ecodesa-consent", VER = "1.1";
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") window.gtag = function () { window.dataLayer.push(arguments); };

  function read() {
    try { var c = JSON.parse(localStorage.getItem(KEY) || "null"); return c && c.v === VER ? c : null; } catch (e) { return null; }
  }
  var IDS = ["AW-18359649271", "G-NZR1GJPMJD"], loaded = false, adsCbs = [], adsOn = false;
  function g(x) { return x ? "granted" : "denied"; }

  /* Bloqueo total: gtag.js solo se descarga tras aceptar analitica o publicidad */
  function loadGoogle() {
    if (loaded) return; loaded = true; window.ecodesaGoogleLoaded = true;
    window.gtag("js", new Date());
    IDS.forEach(function (id) { window.gtag("config", id); });
    IDS.forEach(function (id) {
      var s = document.createElement("script"); s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
      document.head.appendChild(s);
    });
  }

  /* Borra cookies de Google del dominio, subdominio y dominios padre */
  function expire(name) {
    var host = location.hostname, parts = host.split("."), doms = ["", host, "." + host], i;
    for (i = 1; i < parts.length - 1; i++) { doms.push("." + parts.slice(i).join(".")); doms.push(parts.slice(i).join(".")); }
    doms.forEach(function (d) {
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=/" + (d ? "; domain=" + d : "");
    });
  }
  function clean(a, ads) {
    var names = (document.cookie || "").split(";").map(function (c) { return c.split("=")[0].trim(); }).filter(Boolean);
    names.forEach(function (n) {
      if (!a && (n === "_ga" || n.indexOf("_ga_") === 0 || n === "_gid" || n.indexOf("_gat") === 0)) expire(n);
      if (!ads && (n.indexOf("_gcl_") === 0 || n.indexOf("_gac_") === 0 || n === "IDE" || n === "test_cookie")) expire(n);
    });
    if (!ads) expire("IDE"); if (!ads) expire("test_cookie");
  }

  function apply(a, ads, fromUser) {
    window.gtag("consent", "update", { analytics_storage: g(a), ad_storage: g(ads), ad_user_data: g(ads), ad_personalization: g(ads) });
    window["ga-disable-G-NZR1GJPMJD"] = !a;
    if (a || ads) loadGoogle();
    if (!a || !ads) clean(a, ads);
    adsOn = !!ads;
    if (ads) { var q = adsCbs; adsCbs = []; q.forEach(function (f) { try { f(); } catch (e) {} }); }
  }
  function save(a, ads) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: VER, fecha: new Date().toISOString(), analytics: !!a, ads: !!ads })); } catch (e) {}
    apply(a, ads, true);
  }

  var box, banner, panel, swA, swP, live, opener = null, decided = !!read();

  function el(t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h) n.innerHTML = h; return n; }

  function build() {
    box = el("div", "ck-root");
    banner = el("div", "ck ck-banner");
    banner.setAttribute("role", "dialog"); banner.setAttribute("aria-modal", "false"); banner.setAttribute("aria-label", "Aviso de cookies"); banner.tabIndex = -1; banner.hidden = true;
    banner.innerHTML =
      '<p>Usamos cookies técnicas para que el sitio funcione. Solo si usted lo acepta, cargamos cookies de analítica y publicidad de Google para medir y mejorar nuestro sitio y mostrarle anuncios de ECODESA. Esto puede implicar tratamiento de datos por Google fuera de Colombia, incluidos EE. UU. Más información en la <a href="/cookies/">Política de Cookies</a>.</p>' +
      '<div class="ck-btns"><button type="button" class="ck-b ck-main" data-a="all">Aceptar todas</button><button type="button" class="ck-b ck-main" data-a="none">Rechazar</button><button type="button" class="ck-b ck-alt ck-conf" data-a="conf" aria-haspopup="dialog">Configurar</button></div>';
    panel = el("div", "ck ck-panel");
    panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "false"); panel.setAttribute("aria-labelledby", "ckT"); panel.hidden = true;
    panel.innerHTML =
      '<h2 id="ckT" tabindex="-1">Configurar cookies</h2>' +
      '<p class="ck-intro">Elija qué cookies permite. Puede cambiar su decisión en cualquier momento desde «Configurar cookies», en el pie de página.</p>' +
      '<div class="ck-cat"><h3>Técnicas (necesarias)</h3><p>Permiten que el sitio funcione y recuerdan su tema claro u oscuro y su elección de cookies. No se pueden desactivar.</p><span class="ck-ctl ck-always">Siempre activas</span></div>' +
      '<div class="ck-cat"><h3 id="ckHa">Analíticas</h3><p id="ckDa">Google Analytics nos ayuda a entender, de forma estadística, cómo se usa el sitio para mejorarlo.</p><span class="ck-ctl ck-sw"><input type="checkbox" role="switch" id="ckA" aria-labelledby="ckHa" aria-describedby="ckDa"><span aria-hidden="true"></span></span></div>' +
      '<div class="ck-cat"><h3 id="ckHp">Publicidad y remarketing</h3><p id="ckDp">Google Ads mide el resultado de nuestras campañas y le muestra anuncios de ECODESA en otros sitios. Incluye personalización de anuncios y uso de datos para publicidad.</p><span class="ck-ctl ck-sw"><input type="checkbox" role="switch" id="ckP" aria-labelledby="ckHp" aria-describedby="ckDp"><span aria-hidden="true"></span></span></div>' +
      '<p class="ck-note">Al activar analítica o publicidad, usted autoriza que Google trate sus datos de navegación, incluso fuera de Colombia. Detalles en la <a href="/cookies/">Política de Cookies</a> y la <a href="/datos/">Política de Datos</a>.</p>' +
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
    var c0 = read();
    if (c0) apply(c0.analytics, c0.ads); /* decision previa: carga Google solo si acepto */
    if (!decided) { banner.hidden = false; try { banner.focus({ preventScroll: true }); } catch (e) {} }
    document.addEventListener("click", function (e) {
      var o = e.target.closest("[data-consent-open]");
      if (!o) return;
      e.preventDefault(); openPanel(o);
    });
  }
  window.ecodesaConsent = {
    open: function () { openPanel(document.activeElement); },
    /* ejecuta fn una sola vez cuando ad_storage este concedido (de inmediato si ya lo esta) */
    onAds: function (fn) { var c = read(); if (c && c.ads && loaded) { try { fn(); } catch (e) {} } else adsCbs.push(fn); }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
