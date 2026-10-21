(function () {
  var fr = document.getElementById("evFrame"); if (!fr) return;
  var root = document.documentElement;
  function theme() { return root.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  function send(m) { try { fr.contentWindow.postMessage(m, "*"); } catch (e) {} }
  function sendTheme() { send({ type: "theme", v: theme() }); }
  function ratio() { fr.style.aspectRatio = fr.clientWidth >= 760 ? "1690 / 1170" : "1080 / 1620"; }
  fr.src = "ethan-escena.html?theme=" + theme();
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
  var pv = document.getElementById("paVid"), pb = document.getElementById("paPlay");
  if (pv) {
    var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches, vis = false, cur = "", opted = false;
    pv.muted = true; pv.defaultMuted = true; pv.setAttribute("muted", ""); pv.setAttribute("playsinline", "");
    function ask() { if (pb) pb.hidden = false; }
    function ok() { if (pb) pb.hidden = true; }
    function tryPlay() {
      if (!vis || (calm && !opted)) { if (vis && calm) ask(); return; }
      var p; try { p = pv.play(); } catch (e) { ask(); return; }
      if (p && p.then) p.then(ok, ask); else ok();
    }
    function setPa() {
      var d = theme() === "dark", k = d ? "d" : "l"; if (k === cur) return; cur = k;
      pv.poster = "assets/v2/asesor/asesor-poster" + (d ? "-d" : "") + ".webp";
      pv.src = "assets/v2/asesor/asesor" + (d ? "-d" : "") + ".mp4"; pv.load(); tryPlay();
    }
    setPa();
    pv.addEventListener("canplay", tryPlay);
    pv.addEventListener("playing", ok);
    pv.addEventListener("pause", function () { if (vis && !pv.ended && !calm) setTimeout(function () { if (vis && pv.paused) tryPlay(); }, 400); });
    ["touchend", "pointerdown", "click", "keydown"].forEach(function (ev) {
      window.addEventListener(ev, function () { if (vis && pv.paused && !calm) tryPlay(); }, { passive: true });
    });
    if (pb) pb.addEventListener("click", function () { opted = true; tryPlay(); });
    new MutationObserver(setPa).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { en.forEach(function (x) {
        vis = x.isIntersecting;
        if (vis) tryPlay(); else { try { pv.pause(); } catch (e) {} }
      }); }, { threshold: .15 }).observe(pv);
    } else { vis = true; tryPlay(); }
  }
})();
