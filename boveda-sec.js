/* Bóveda IA en la página principal: valida el código (huella SHA-256), abre la puerta y carga el catálogo sin salir de ecodesa.co. */
(function () {
  var sec = document.getElementById("boveda"); if (!sec) return;
  var HASH = "4716ee882e39658c7bf9ea3d731458672824656a5642093c472f07e99491f7c5";
  var $ = function (id) { return document.getElementById(id); };
  var form = $("bvForm"), inp = $("bvCode"), err = $("bvErr"), btn = $("bvGo"), vid = $("bvVid"), frame = $("bvFrame");
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
    var done = false, fin = function () { if (!done) { done = true; show(); } };
    vid.addEventListener("ended", fin); vid.addEventListener("error", fin);
    var tick = function () { if (vid.currentTime >= 2.4) return fin(); if (!done) requestAnimationFrame(tick); };
    vid.muted = true; var p = vid.play();
    if (p && p.then) p.then(function () { requestAnimationFrame(tick); }).catch(fin);
    setTimeout(fin, 4500);
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

  $("bvFull").addEventListener("click", function () {
    var on = !sec.classList.contains("full");
    sec.classList.toggle("full", on); root.classList.toggle("bv-lock-scroll", on);
    this.setAttribute("aria-pressed", on); this.textContent = on ? "Salir de pantalla completa" : "Pantalla completa";
  });
  addEventListener("keydown", function (e) { if (e.key === "Escape" && sec.classList.contains("full")) $("bvFull").click(); });

  frame.addEventListener("load", syncTheme);
  new MutationObserver(syncTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

})();
