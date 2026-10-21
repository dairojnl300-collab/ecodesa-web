(function () {
  var fr = document.getElementById("evFrame"); if (!fr) return;
  var root = document.documentElement;
  function theme() { return root.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  function send(m) { try { fr.contentWindow.postMessage(m, "*"); } catch (e) {} }
  function sendTheme() { send({ type: "theme", v: theme() }); }
  function ratio() { fr.style.aspectRatio = fr.clientWidth >= 760 ? "1690 / 1170" : "1080 / 1620"; }
  var fOn = false;
  function frameLoad(on) {
    if (on === fOn) return; fOn = on;
    fr.src = on ? "ethan-escena.html?theme=" + theme() : "about:blank";
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) frameLoad(true); }); }, { rootMargin: "700px 0px" }).observe(fr);
    new IntersectionObserver(function (en) { en.forEach(function (x) { if (!x.isIntersecting) frameLoad(false); }); }, { rootMargin: "1600px 0px" }).observe(fr);
  } else frameLoad(true);
  fr.addEventListener("load", sendTheme);
  new MutationObserver(sendTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  ratio(); if (window.ResizeObserver) new ResizeObserver(ratio).observe(fr); else window.addEventListener("resize", ratio);
  window.addEventListener("message", function (e) {
    if (e.source !== fr.contentWindow) return;
    var d = e.data || {};
    if (d.type === "evcta") { var b = document.querySelector(".as-btn"); if (b) b.click(); }
    else if (d.type === "evplay" && window.dataLayer) window.dataLayer.push({ event: "induccion_play" });
  });
  if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { en.forEach(function (x) { if (!x.isIntersecting) send({ type: "pause" }); }); }, { threshold: .15 }).observe(fr);
  var pv = document.getElementById("paVid"), pi = document.getElementById("paImg");
  if (pv) {
    var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var vis = false, cur = "", fb = false, tm = 0, wd = 0, pos = 0, N = 80, STEPS = 2 * N - 2;
    pv.muted = true; pv.defaultMuted = true; pv.setAttribute("muted", ""); pv.setAttribute("playsinline", "");
    function dir() { return "assets/v2/asesor/" + (cur === "d" ? "fd" : "fl") + "/"; }
    function frm(i) { return dir() + (i < 9 ? "0" : "") + (i + 1) + ".webp"; }
    function pose(s) { return s < N ? s : STEPS - s; }
    // Respaldo sin <video>: el navegador (p. ej. iPhone en modo de bajo consumo) bloquea el autoplay -> animamos cuadros por JS
    function stepFb() {
      if (!vis) return;
      pos = (pos + 1) % STEPS; pi.src = frm(pose(pos));
      var pre = new Image(); pre.src = frm(pose((pos + 3) % STEPS));
    }
    function startFb() {
      if (calm || fb && tm) return; fb = true; pv.style.visibility = "hidden"; pi.hidden = false;
      pi.src = frm(pose(pos)); clearInterval(tm); tm = setInterval(stepFb, 100);
    }
    function stopFb() { clearInterval(tm); tm = 0; }
    function tryPlay() {
      if (!vis || calm) return;
      if (fb) { startFb(); return; }
      var p; try { p = pv.play(); } catch (e) { startFb(); return; }
      if (p && p.then) p.then(null, startFb);
      clearTimeout(wd); wd = setTimeout(function () { if (vis && !fb && pv.currentTime < .05) startFb(); }, 1500);
    }
    var near = false;
    function applySrc() {
      if (!near) return; var s = "assets/v2/asesor/asesor" + (cur === "d" ? "-d" : "") + ".mp4";
      if (pv.getAttribute("data-s") === s) return; pv.setAttribute("data-s", s); pv.src = s; pv.load();
    }
    function setPa() {
      var d = theme() === "dark", k = d ? "d" : "l"; if (k === cur) return; cur = k;
      pv.poster = "assets/v2/asesor/asesor-poster" + (d ? "-d" : "") + ".webp";
      applySrc();
      if (fb) { stopFb(); pi.src = frm(pose(pos)); if (vis) startFb(); } else tryPlay();
    }
    setPa();
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting && !near) { near = true; applySrc(); tryPlay(); } }); }, { rootMargin: "500px 0px" }).observe(pv); else { near = true; applySrc(); }
    pv.addEventListener("canplay", tryPlay);
    pv.addEventListener("playing", function () { clearTimeout(wd); });
    pv.addEventListener("pause", function () { if (vis && !fb && !pv.ended) setTimeout(function () { if (vis && pv.paused && !fb) tryPlay(); }, 400); });
    new MutationObserver(setPa).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { en.forEach(function (x) {
        vis = x.isIntersecting;
        if (vis) tryPlay(); else { try { pv.pause(); } catch (e) {} stopFb(); }
      }); }, { threshold: .15 }).observe(pv);
    } else { vis = true; tryPlay(); }
  }
})();
