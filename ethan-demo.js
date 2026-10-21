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
  var pv = document.getElementById("paVid");
  if (pv) {
    var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!calm && "IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { en.forEach(function (x) {
        if (x.isIntersecting) { var p = pv.play(); if (p && p.catch) p.catch(function () {}); } else pv.pause();
      }); }, { threshold: .2 }).observe(pv);
    }
  }
})();
