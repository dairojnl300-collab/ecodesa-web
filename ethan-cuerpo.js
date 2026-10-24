/* Ethan con cuerpo (flotante + pantalla que se enciende). Se monta sobre el botón del asistente. */
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var BASE = "assets/v2/ethan/", T = [];
  function later(fn, ms) { T.push(setTimeout(fn, ms)); }
  function svg() {
    return '<svg class="eth-scr" viewBox="0 0 928 1296" aria-hidden="true">' +
      '<defs><clipPath id="ethScr"><rect x="238" y="353" width="584" height="442" rx="100"/></clipPath></defs>' +
      '<g clip-path="url(#ethScr)"><g class="eth-face glow"><g class="eth-eyes">' +
      '<ellipse class="eth-eye l" cx="411" cy="546" rx="36" ry="58" fill="#c9f58a"/>' +
      '<ellipse class="eth-eye r" cx="676" cy="546" rx="36" ry="58" fill="#c9f58a"/>' +
      '<path class="eth-arc l" d="M372 576 Q411 504 450 576" fill="none" stroke="#c9f58a" stroke-width="26" stroke-linecap="round"/>' +
      '<path class="eth-arc r" d="M637 576 Q676 504 715 576" fill="none" stroke="#c9f58a" stroke-width="26" stroke-linecap="round"/>' +
      '</g><path d="M478 640 Q541 708 604 640" fill="none" stroke="#c9f58a" stroke-width="28" stroke-linecap="round"/></g></g>' +
      '<defs><radialGradient id="ethBoost"><stop offset="0" stop-color="#e6ff9a" stop-opacity=".75"/><stop offset=".6" stop-color="#a6f04a" stop-opacity=".45"/><stop offset="1" stop-color="#7be04a" stop-opacity="0"/></radialGradient></defs>' +
      '<circle class="eth-boost" cx="490" cy="1134" r="175" fill="url(#ethBoost)"/>' +
      '<circle class="eth-ring glow" cx="490" cy="1134" r="154" fill="none" stroke="#c9f58a" stroke-width="10"/>' +
      '</svg>';
  }
  function mount(btn) {
    if (btn.classList.contains("eth-on")) return;
    btn.classList.add("eth-on"); document.documentElement.classList.add("eth-on");
    var f = document.createElement("span"); f.className = "eth" + " ready";
    f.setAttribute("aria-hidden", "true");
    f.innerHTML = '<img class="eth-plate" src="' + BASE + 'plate2.webp" alt="" width="840" height="396" decoding="async">' +
      '<i class="eth-glow"></i><i class="eth-shadow"></i>' +
      '<span class="eth-bot"><img src="' + BASE + 'robot2.webp" alt="" width="620" height="866" decoding="async">' + svg() + '</span>';
    btn.appendChild(f);
    if (!reduce) {
      var lt; btn.addEventListener("pointerdown", function () { f.classList.add("lit", "happy"); clearTimeout(lt); lt = setTimeout(function () { f.classList.remove("lit", "happy"); }, 2600); });
      (function idle() {
        later(function () {
          var r = Math.random();
          if (r < .55) { f.classList.add("blink"); later(function () { f.classList.remove("blink"); }, 150); }
          else if (r < .72) { var c = Math.random() < .5 ? "look-l" : "look-r"; f.classList.add(c); later(function () { f.classList.remove(c); }, 1300); }
          else if (r < .86) { f.classList.add("wink"); later(function () { f.classList.remove("wink"); }, 900); }
          else { f.classList.add("hop"); later(function () { f.classList.remove("hop"); }, 750); }
          idle();
        }, 1800 + Math.random() * 2200);
      })();
    }
  }
  function find() { var b = document.querySelector(".as-btn"); if (b) mount(b); else setTimeout(find, 250); }
  /* Avatar del encabezado del chat: cabeza del nuevo Ethan con la cara dibujada (mismos estados que los sprites) */
  function headSvg() {
    return '<svg viewBox="0 0 928 895" aria-hidden="true"><defs><clipPath id="ethHd"><rect x="238" y="353" width="584" height="442" rx="100"/></clipPath></defs>' +
      '<g clip-path="url(#ethHd)"><g class="eth-face glow"><g class="eth-eyes">' +
      '<ellipse class="eth-eye l" cx="411" cy="546" rx="36" ry="58" fill="#c9f58a"/><ellipse class="eth-eye r" cx="676" cy="546" rx="36" ry="58" fill="#c9f58a"/>' +
      '<path class="eth-arc l" d="M372 576 Q411 504 450 576" fill="none" stroke="#c9f58a" stroke-width="26" stroke-linecap="round"/>' +
      '<path class="eth-arc r" d="M637 576 Q676 504 715 576" fill="none" stroke="#c9f58a" stroke-width="26" stroke-linecap="round"/>' +
      '</g><path class="eth-mouth" d="M478 640 Q541 708 604 640" fill="none" stroke="#c9f58a" stroke-width="28" stroke-linecap="round"/></g></g></svg>';
  }
  function mountHead(hav) {
    if (hav.dataset.eth) return; hav.dataset.eth = "1";
    var w = document.createElement("span"); w.className = "eth-hw"; hav.parentNode.insertBefore(w, hav); w.appendChild(hav);
    var h = document.createElement("span"); h.className = "as-hav eth-hd"; h.setAttribute("aria-hidden", "true");
    h.innerHTML = '<img src="' + BASE + 'robot2.webp" alt="" width="620" height="866" decoding="async">' + headSvg(); w.appendChild(h);
    var st = "", FACE = { happy: "happy", celebrar: "happy", terminado: "happy", wide: "wide", pregunta: "wide", sleep: "sleep", wink: "wink", "look-l": "look-l", "look-r": "look-r", pensar: "look-l" };
    function sync() {
      var m = /robot-([a-z-]+?)(?:-\d+)?\.webp/.exec(hav.getAttribute("src") || ""), n = m ? m[1] : "anim", f = FACE[n] || "";
      ["happy", "wide", "sleep", "wink", "look-l", "look-r"].forEach(function (c) { h.classList.toggle(c, c === f); });
      ["pop", "pensar", "mv-subida", "mv-baile", "mv-mareado", "mv-trabajando"].forEach(function (c) { h.classList.toggle(c, hav.classList.contains(c)); });
    }
    new MutationObserver(sync).observe(hav, { attributes: true, attributeFilter: ["src", "class"] }); sync();
    if (!reduce) (function idle() { setTimeout(function () { if (!h.classList.contains("sleep")) { h.classList.add("blink"); setTimeout(function () { h.classList.remove("blink"); }, 150); } idle(); }, 2200 + Math.random() * 2600); })();
  }
  (function findHead() { var h = document.querySelector(".as-hav"); if (h) mountHead(h); else setTimeout(findHead, 300); })();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", find); else find();
})();
