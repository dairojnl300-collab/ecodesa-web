/* Sectores: las fotos pasan solas cuando el cliente se queda mirando la tarjeta; cada foto se ve completa */
(function () {
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cards = document.querySelectorAll(".scard-img[data-slides]");
  if (!cards.length) return;
  function frame(src, alt, first) {
    var f = document.createElement("div"); f.className = "ss-f" + (first ? " on" : "");
    f.innerHTML = '<i class="ss-bg" style="background-image:url(' + src + ')"></i><img class="ss-im" src="' + src + '" alt="' + (alt || "") + '" decoding="async">';
    return f;
  }
  [].forEach.call(cards, function (box, n) {
    var main = box.querySelector("img"), srcs = [main.getAttribute("src")].concat(box.getAttribute("data-slides").split(","));
    var alt = main.getAttribute("alt"), chip = box.querySelector(".chip"), wrap = document.createElement("div");
    wrap.className = "ss"; wrap.setAttribute("aria-live", "off");
    var frames = [], dots = document.createElement("div"); dots.className = "ss-dots"; dots.setAttribute("aria-hidden", "true");
    srcs.forEach(function (s, i) { var f = frame(s, i ? "" : alt, i === 0); frames.push(f); wrap.appendChild(f); dots.appendChild(document.createElement("b")); });
    dots.children[0].className = "on";
    main.remove(); box.insertBefore(wrap, box.firstChild); box.appendChild(dots);
    var cur = 0, timer = null, visible = false, hover = false;
    function go(i) {
      frames[cur].classList.remove("on"); dots.children[cur].className = "";
      cur = (i + frames.length) % frames.length;
      frames[cur].classList.add("on"); dots.children[cur].className = "on";
    }
    function tick() { if (!hover) go(cur + 1); }
    function start() { if (timer || reduce || !visible) return; timer = setInterval(tick, 3200 + n * 150); }
    function stop() { clearInterval(timer); timer = null; }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (e) {
        visible = e[0].isIntersecting;
        if (visible) { setTimeout(function () { if (visible) start(); }, 1800); } else stop();
      }, { threshold: .6 });
      io.observe(box);
    } else { visible = true; start(); }
    box.addEventListener("mouseenter", function () { hover = true; });
    box.addEventListener("mouseleave", function () { hover = false; });
    dots.addEventListener("click", function (ev) { var i = [].indexOf.call(dots.children, ev.target); if (i > -1) { go(i); stop(); start(); } });
    dots.style.pointerEvents = "auto";
  });
})();
