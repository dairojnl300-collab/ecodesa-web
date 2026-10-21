(function () {
  var v = document.getElementById("evVid"); if (!v) return;
  var root = document.documentElement, snd = document.getElementById("evSnd"),
    pp = document.getElementById("evPP"), sk = document.getElementById("evSk"),
    skf = document.getElementById("evSkf"), tm = document.getElementById("evTm"),
    cta = document.getElementById("evCta"), DUR = 84.5, key = "", near = false, vis = false, started = false, userPaused = false, sent = false, userMuted = false, unlocked = false;
  function th() { return root.getAttribute("data-theme") === "dark" ? "d" : "l"; }
  function lay() { return window.innerWidth >= 760 ? "w" : "v"; }
  function fmt(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function want() { return lay() + th(); }
  function base() { return "assets/v2/ev/escena-" + want(); }
  function apply(force) {
    var k = want(); if (k === key && !force) return;
    var t = key ? v.currentTime : 0, was = !v.paused; key = k;
    v.poster = base() + ".webp";
    if (!near) return;
    v.src = base() + ".mp4"; v.load();
    v.addEventListener("loadedmetadata", function f() {
      v.removeEventListener("loadedmetadata", f);
      if (t > 0 && t < DUR - 0.3) try { v.currentTime = t; } catch (e) {}
      if (was) v.play().catch(function () {});
    });
  }
  function ui() {
    var t = v.currentTime || 0, d = v.duration || DUR, end = v.ended;
    skf.style.width = Math.min(100, t / d * 100) + "%";
    sk.setAttribute("aria-valuenow", Math.round(t));
    tm.textContent = fmt(t) + " / " + fmt(d);
    pp.textContent = end ? "↻" : (v.paused ? "▶" : "❚❚");
    pp.setAttribute("aria-label", end ? "Volver a ver" : (v.paused ? "Reproducir" : "Pausar"));
  }
  function play() {
    if (!v.src) { near = true; apply(true); }
    v.muted = userMuted;
    var p = v.play();
    if (p && p.catch) p.catch(function () { if (v.muted) return; v.muted = true; var q = v.play(); if (q && q.catch) q.catch(function () {}); });
  }
  function toggle() {
    if (v.ended) { v.currentTime = 0; userPaused = false; play(); }
    else if (v.paused) { userPaused = false; play(); }
    else { userPaused = true; v.pause(); }
  }
  v.addEventListener("play", function () {
    if (/unlock\.mp4/.test(v.currentSrc || v.src)) return;
    started = true;
    if (!sent) { sent = true; (window.dataLayer = window.dataLayer || []).push({ event: "induccion_play" }); }
  });
  ["timeupdate", "play", "pause", "ended", "loadedmetadata"].forEach(function (e) { v.addEventListener(e, ui); });
  v.addEventListener("click", toggle); pp.addEventListener("click", toggle);
  function sndUi() { snd.setAttribute("aria-pressed", String(!v.muted)); snd.setAttribute("aria-label", v.muted ? "Activar sonido" : "Silenciar"); }
  v.addEventListener("volumechange", sndUi);
  snd.addEventListener("click", function () {
    userMuted = !v.muted; v.muted = userMuted; sndUi();
    if (!v.muted && v.paused && !v.ended) { userPaused = false; play(); }
  });
  // Primer toque en la página: desbloquea el sonido del video (iOS/Chrome exigen un gesto del usuario)
  function unlock() {
    if (unlocked) return; unlocked = true;
    ["touchend", "click", "keydown"].forEach(function (e) { document.removeEventListener(e, unlock, true); });
    if (v.src) { if (!v.paused && !userMuted) v.muted = false; return; }
    v.src = "assets/v2/ev/unlock.mp4"; v.muted = false;
    var back = function () { v.removeAttribute("src"); try { v.load(); } catch (e) {} key = ""; apply(true); };
    var p; try { p = v.play(); } catch (e) { back(); return; }
    if (p && p.then) p.then(function () { v.pause(); back(); }, back); else back();
  }
  ["touchend", "click", "keydown"].forEach(function (e) { document.addEventListener(e, unlock, true); });
  function seek(x) {
    var r = sk.getBoundingClientRect(), p = Math.min(1, Math.max(0, (x - r.left) / r.width));
    if (!v.src) { near = true; apply(true); }
    var d = v.duration || DUR; try { v.currentTime = p * d; } catch (e) {}
  }
  var drag = false;
  sk.addEventListener("pointerdown", function (e) { drag = true; sk.setPointerCapture(e.pointerId); seek(e.clientX); });
  sk.addEventListener("pointermove", function (e) { if (drag) seek(e.clientX); });
  sk.addEventListener("pointerup", function () { drag = false; });
  sk.addEventListener("keydown", function (e) {
    var d = e.key === "ArrowRight" ? 5 : e.key === "ArrowLeft" ? -5 : 0; if (!d) return;
    e.preventDefault(); v.currentTime = Math.max(0, Math.min((v.duration || DUR) - 0.1, v.currentTime + d));
  });
  cta.addEventListener("click", function () { var b = document.querySelector(".as-btn"); if (b) b.click(); });
  var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      near = es[0].isIntersecting; if (near) apply(true); else if (v.src && !started) { v.removeAttribute("src"); v.load(); }
    }, { rootMargin: "600px 0px" }).observe(v);
    new IntersectionObserver(function (es) {
      vis = es[0].isIntersecting;
      if (vis && !userPaused && !v.ended && !calm) { if (!v.src) { near = true; apply(true); } play(); }
      else if (!vis && !v.paused) v.pause();
    }, { threshold: 0.35 }).observe(v);
  }
  new MutationObserver(function () { apply(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(apply, 250); });
  apply(); ui();
})();
