/* Bóveda IA en la página principal: valida el código (huella SHA-256), abre la puerta y carga el catálogo sin salir de ecodesa.co. */
(function () {
  var sec = document.getElementById("boveda"); if (!sec) return;
  var HASH = "4716ee882e39658c7bf9ea3d731458672824656a5642093c472f07e99491f7c5";
  var $ = function (id) { return document.getElementById(id); };
  var form = $("bvForm"), inp = $("bvCode"), err = $("bvErr"), btn = $("bvGo"), frame = $("bvFrame");
  var root = document.documentElement, tries = 0, opened = false;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ls = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  if (ls.get("boveda-acceso") === HASH) { $("bvNew").hidden = true; $("bvBack").hidden = false; }

  function hash(s) {
    if (!(window.crypto && crypto.subtle && window.TextEncoder)) return Promise.resolve("");
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
    });
  }
  function theme() { return root.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  function syncTheme() {
    try { var d = frame.contentDocument; if (d && d.documentElement) d.documentElement.setAttribute("data-theme", theme()); } catch (e) {}
  }
  function load() {
    ls.set("boveda-theme", theme());
    ls.set("boveda-fi", root.classList.contains("fi") ? "on" : "off");
    if (!frame.getAttribute("src")) frame.setAttribute("src", "/boveda/?puerta=0&embed=1");
  }
  function show() {
    sec.classList.remove("opening"); sec.classList.add("open");
    var top = sec.getBoundingClientRect().top + scrollY - 70;
    scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
    setTimeout(function () { try { $("bvTitle2").focus({ preventScroll: true }); } catch (e) {} }, 400);
  }
  function open() {
    if (opened) return; opened = true; load();
    if (reduce) return show();
    sec.classList.add("opening");
    setTimeout(show, 1500);
  }

  inp.addEventListener("input", function () { inp.value = inp.value.toUpperCase().replace(/\s/g, ""); err.textContent = ""; });
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var v = inp.value.trim().toUpperCase();
    if (!v) { err.textContent = "Escribe el código."; return; }
    btn.disabled = true;
    hash(v).then(function (h) {
      if (h === HASH) { ls.set("boveda-acceso", HASH); open(); return; }
      tries++; btn.disabled = false; inp.select();
      err.textContent = tries < 3 ? "Ese no es el código. Revisa e intenta otra vez." : "Ese no es. El código está en nuestros videos de Instagram: síguenos y búscalo.";
      form.classList.remove("bv-shake"); void form.offsetWidth; form.classList.add("bv-shake");
    });
  });
  $("bvEnter").addEventListener("click", open);

  /* el catálogo crece con su contenido: se lee como parte de la página, sin barra de desplazamiento propia */
  function fit() {
    try {
      var d = frame.contentDocument; if (!d || !d.body) return;
      var h = Math.max(d.documentElement.scrollHeight, d.body.scrollHeight);
      if (Math.abs(h - (parseFloat(frame.style.height) || 0)) > 2) frame.style.height = h + "px";
    } catch (e) {}
  }
  frame.addEventListener("load", function () {
    syncTheme(); fit();
    var d; try { d = frame.contentDocument; } catch (e) { return; }
    if (!d) return;
    if (window.ResizeObserver) new ResizeObserver(fit).observe(d.body); else setInterval(fit, 700);
    /* enlaces internos (#...) llevan la página principal, no el marco */
    d.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
      var id = a.getAttribute("href").slice(1), t = id && d.getElementById(id); if (!t) return;
      e.preventDefault();
      var y = frame.getBoundingClientRect().top + scrollY + t.getBoundingClientRect().top - 80;
      scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    });
    /* la ficha emergente aparece donde el visitante está mirando */
    var m = d.getElementById("modal");
    if (m) new MutationObserver(function () {
      if (!m.open) return;
      var top = Math.max(0, -frame.getBoundingClientRect().top) + 84;
      m.style.cssText = "position:absolute;margin:0 auto;left:0;right:0;top:" + top + "px;max-height:" + Math.max(320, innerHeight - 104) + "px";
    }).observe(m, { attributes: true, attributeFilter: ["open"] });
  });
  new MutationObserver(syncTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

})();
