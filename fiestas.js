/* Edición Fiestas de Independencia (Cartagena, 11 de noviembre).
   Temporada: 1 al 16 de noviembre. ?fiestas=1 la fuerza, ?fiestas=0 la apaga.
   El visitante la puede quitar o activar con el botón de la bandera (se recuerda en localStorage).
   Toda la decoración es aria-hidden y no recibe clics. */
(function () {
  var root = document.documentElement;
  var INK = "#2b1406", Y = "#ffd21f", R = "#e3262b", G = "#14964a", O = "#ff7a1a", C = "#fff4d6";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var q = null; try { q = new URLSearchParams(location.search).get("fiestas"); } catch (e) {}
  var d = new Date(), season = (d.getMonth() === 10 && d.getDate() <= 16) || q === "1";
  if (q === "0") season = false;
  if (!season) return;
  var off = false; try { off = localStorage.getItem("ecodesa-fi") === "off"; } catch (e) {}
  if (q === "1" || !off) root.classList.add("fi");

  /* ---------- dibujos ---------- */
  function star8(cx, cy, r1, r2) {
    var p = [];
    for (var i = 0; i < 16; i++) { var a = -Math.PI / 2 + i * Math.PI / 8, r = i % 2 ? r2 : r1; p.push((cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1)); }
    return p.join(" ");
  }
  /* bandera de Cartagena simplificada: rojo, amarillo, verde y estrella blanca de 8 puntas */
  function badge() {
    return '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="2" y="2" width="44" height="44" rx="11" fill="' + R + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<rect x="8.5" y="8.5" width="31" height="31" rx="6" fill="' + Y + '"/><rect x="14" y="14" width="20" height="20" rx="4" fill="' + G + '"/>' +
      '<polygon points="' + star8(24, 24, 8.4, 3.6) + '" fill="#fff"/></svg>';
  }
  /* banderines de papel picado sobre una cuerda con caída natural */
  function bunting(w, opt) {
    opt = opt || {};
    var sw = opt.swags || 2, fh = opt.fh || 34, sag = opt.sag || 26, cols = [R, Y, G, O, C], h = sag + fh + 10, s = "", k = 0;
    for (var j = 0; j < sw; j++) {
      var x0 = (w / sw) * j, x1 = (w / sw) * (j + 1), cx = (x0 + x1) / 2, cy = 4 + 2 * sag;
      s += '<path d="M' + x0.toFixed(1) + " 4 Q" + cx.toFixed(1) + " " + cy + " " + x1.toFixed(1) + ' 4" fill="none" stroke="' + INK + '" stroke-width="2.2"/>';
      var n = Math.max(4, Math.round((x1 - x0) / (fh * 1.25)));
      for (var i = 0; i < n; i++) {
        var t = (i + 0.5) / n, mt = 1 - t, x = mt * mt * x0 + 2 * mt * t * cx + t * t * x1, y = mt * mt * 4 + 2 * mt * t * cy + t * t * 4;
        var fw = ((x1 - x0) / n) * 0.8, c = cols[k++ % cols.length], hole = c === C ? R : C;
        s += '<g class="fi-flag" style="--d:' + (-(i * 0.37 + j * 0.9)).toFixed(2) + "s;transform-origin:" + x.toFixed(1) + "px " + y.toFixed(1) + 'px">' +
          '<path d="M' + (x - fw / 2).toFixed(1) + " " + y.toFixed(1) + " L" + (x + fw / 2).toFixed(1) + " " + y.toFixed(1) + " L" + x.toFixed(1) + " " + (y + fh).toFixed(1) + 'Z" fill="' + c + '" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/>' +
          '<path d="M' + (x - fw * 0.32).toFixed(1) + " " + (y + 5).toFixed(1) + " l" + (fw * 0.16).toFixed(1) + " 5 l" + (fw * 0.16).toFixed(1) + " -5 l" + (fw * 0.16).toFixed(1) + " 5 l" + (fw * 0.16).toFixed(1) + ' -5" fill="none" stroke="' + hole + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<circle cx="' + x.toFixed(1) + '" cy="' + (y + fh * 0.48).toFixed(1) + '" r="' + (fh * 0.08).toFixed(1) + '" fill="' + hole + '"/></g>';
      }
    }
    return '<svg viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '" aria-hidden="true">' + s + "</svg>";
  }
  function tower() {
    var st = ' stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"';
    return '<svg viewBox="0 -24 200 330" aria-hidden="true">' +
      '<path d="M100 -20 V8" stroke="' + INK + '" stroke-width="3"/><path d="M100 -20 L122 -13 L100 -6Z" fill="' + Y + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<path d="M62 44 Q100 -6 138 44Z" fill="' + R + '"' + st + '/>' +
      '<rect x="52" y="40" width="96" height="14" rx="3" fill="' + O + '"' + st + '/>' +
      '<rect x="60" y="54" width="80" height="64" fill="' + Y + '"' + st + '/>' +
      '<circle cx="100" cy="86" r="23" fill="#fff"' + st + '/><path d="M100 86 V70 M100 86 L111 92" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="30" y="118" width="140" height="16" rx="3" fill="' + O + '"' + st + '/>' +
      '<rect x="38" y="134" width="124" height="166" fill="' + C + '"' + st + '/>' +
      '<path d="M74 300 V222 A26 26 0 0 1 126 222 V300Z" fill="' + INK + '"/>' +
      '<path d="M52 196 V176 A9 9 0 0 1 70 176 V196Z M130 196 V176 A9 9 0 0 1 148 176 V196Z" fill="' + G + '" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M38 150 H162" stroke="' + INK + '" stroke-width="3"/></svg>';
  }
  function drum() {
    return '<svg viewBox="0 0 120 150" aria-hidden="true"><path d="M18 42 L102 42 L92 136 Q60 148 28 136Z" fill="' + R + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M22 54 L36 132 L50 54 L62 138 L74 54 L86 132 L98 54" fill="none" stroke="' + Y + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<ellipse cx="60" cy="42" rx="44" ry="13" fill="' + C + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<path d="M28 134 Q60 146 92 134" fill="none" stroke="' + G + '" stroke-width="6"/></svg>';
  }
  function maracas() {
    function one(cx, cy, rot, fill, band) {
      return '<g transform="rotate(' + rot + " " + cx + " " + cy + ')"><rect x="' + (cx - 4) + '" y="' + (cy + 18) + '" width="8" height="40" rx="4" fill="#8a4b16" stroke="' + INK + '" stroke-width="3"/>' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="17" ry="22" fill="' + fill + '" stroke="' + INK + '" stroke-width="3.5"/>' +
        '<path d="M' + (cx - 15) + " " + (cy - 4) + " Q" + cx + " " + (cy + 6) + " " + (cx + 15) + " " + (cy - 4) + '" fill="none" stroke="' + band + '" stroke-width="4"/>' +
        '<circle cx="' + (cx - 6) + '" cy="' + (cy - 10) + '" r="3" fill="' + band + '"/><circle cx="' + (cx + 6) + '" cy="' + (cy - 12) + '" r="3" fill="' + band + '"/></g>';
    }
    return '<svg viewBox="0 0 110 130" aria-hidden="true">' + one(40, 40, -22, G, Y) + one(72, 44, 18, Y, R) + "</svg>";
  }
  function skyline() {
    var cols = [O, "#2f9be0", Y, "#ff6fa8", G, R, "#9b5cff", Y], s = "", x = 0, i = 0;
    while (x < 1600) {
      var w = 110 + (i % 3) * 20, h = 92 + ((i * 37) % 4) * 14, top = 180 - h, c = cols[i % cols.length];
      s += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + (h + 4) + '" fill="' + c + '" stroke="' + INK + '" stroke-width="3"/>' +
        '<rect x="' + (x - 4) + '" y="' + (top - 10) + '" width="' + (w + 8) + '" height="12" fill="' + R + '" stroke="' + INK + '" stroke-width="3"/>' +
        '<rect x="' + (x + 16) + '" y="' + (top + 18) + '" width="24" height="34" rx="10" fill="' + C + '" stroke="' + INK + '" stroke-width="2.5"/>' +
        '<rect x="' + (x + w - 40) + '" y="' + (top + 18) + '" width="24" height="34" rx="10" fill="' + C + '" stroke="' + INK + '" stroke-width="2.5"/>' +
        '<path d="M' + (x + 6) + " " + (top + 58) + " h" + (w - 12) + '" stroke="#8a4b16" stroke-width="6"/>' +
        '<path d="M' + (x + 10) + " " + (top + 60) + " v12 M" + (x + w * 0.35) + " " + (top + 60) + " v12 M" + (x + w * 0.65) + " " + (top + 60) + " v12 M" + (x + w - 10) + " " + (top + 60) + ' v12" stroke="#8a4b16" stroke-width="3"/>' +
        '<path d="M' + (x + w / 2 - 14) + ' 184 V' + (top + 92) + " a14 14 0 0 1 28 0 V184" + '" fill="#8a4b16" stroke="' + INK + '" stroke-width="2.5"/>' +
        (i % 2 ? '<circle cx="' + (x + 12) + '" cy="' + (top + 54) + '" r="9" fill="#ff4fa0"/><circle cx="' + (x + 24) + '" cy="' + (top + 50) + '" r="7" fill="#ff4fa0"/>' : "");
      x += w; i++;
    }
    return '<svg viewBox="0 0 1600 184" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + s + "</svg>";
  }
  var ICONS = [
    /* residuos: caneca con separación */
    '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="14" y="20" width="36" height="38" rx="5" fill="' + G + '" stroke="' + INK + '" stroke-width="3"/><rect x="10" y="12" width="44" height="9" rx="4" fill="' + Y + '" stroke="' + INK + '" stroke-width="3"/><path d="M26 12 V7 H38 V12" fill="none" stroke="' + INK + '" stroke-width="3"/><path d="M24 30 V50 M32 30 V50 M40 30 V50" stroke="' + C + '" stroke-width="3.5" stroke-linecap="round"/><circle cx="54" cy="10" r="4" fill="' + R + '"/><rect x="4" y="6" width="6" height="9" rx="1.5" fill="' + O + '" transform="rotate(-20 7 10)"/></svg>',
    /* cocina: olla con vapor */
    '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M22 14 q-4 -5 0 -10 M32 14 q-4 -5 0 -10 M42 14 q-4 -5 0 -10" fill="none" stroke="' + O + '" stroke-width="3" stroke-linecap="round"/><path d="M8 24 H56 L52 54 Q32 62 12 54Z" fill="' + R + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><rect x="5" y="19" width="54" height="8" rx="4" fill="' + Y + '" stroke="' + INK + '" stroke-width="3"/><path d="M14 36 h36" stroke="' + C + '" stroke-width="3" stroke-dasharray="5 5"/></svg>',
    /* afluencia: señal de evacuación */
    '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="4" y="10" width="56" height="44" rx="8" fill="' + G + '" stroke="' + INK + '" stroke-width="3"/><circle cx="26" cy="20" r="4.5" fill="#fff"/><path d="M26 26 L22 38 L30 40 L26 50 M23 31 L16 34 M27 29 L33 34 M22 38 L16 47" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 32 H54 M48 26 L54 32 L48 38" fill="none" stroke="' + Y + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  ];

  /* ---------- confeti ---------- */
  function confetti(box, n) {
    if (reduce) return;
    var cols = [R, Y, G, O, "#2f9be0", "#ff4fa0", C], s = "";
    for (var i = 0; i < n; i++) {
      var round = i % 4 === 0, w = round ? 9 : 7 + (i % 3) * 2, h = round ? 9 : 12 + (i % 4) * 2;
      s += '<i class="fi-cf" style="--x:' + ((i * 61 + 7) % 100) + "%;--c:" + cols[i % cols.length] + ";--w:" + w + "px;--h:" + h + "px;--r:" + (round ? "50%" : "2px") +
        ";--t:" + (9 + (i % 5) * 1.6).toFixed(1) + "s;--dl:" + (-(i * 1.37) % 12).toFixed(2) + "s;--sx:" + (14 + (i % 4) * 8) + 'px"></i>';
    }
    var c = document.createElement("div"); c.className = "fi-conf"; c.setAttribute("aria-hidden", "true"); c.innerHTML = s;
    box.appendChild(c);
    var set = function () { c.style.setProperty("--fall", (box.offsetHeight + 40) + "px"); };
    set(); window.addEventListener("resize", set, { passive: true });
  }
  function placeBunting(host, opt) {
    var el = host.querySelector(":scope > .fi-bunt");
    if (!el) { el = document.createElement("div"); el.className = "fi-bunt"; el.setAttribute("aria-hidden", "true"); host.appendChild(el); }
    var w = Math.max(240, Math.round(opt.width || host.offsetWidth || window.innerWidth)), mobile = w < 640;
    el.style.left = opt.left ? opt.left + "px" : ""; el.style.right = opt.left ? "auto" : ""; el.style.width = opt.width ? w + "px" : "";
    el.innerHTML = bunting(w, { swags: opt.swags || (mobile ? 1 : 2), fh: mobile ? (opt.fhm || 24) : (opt.fh || 34), sag: mobile ? (opt.sagm || 16) : (opt.sag || 26) });
  }

  /* en el hero los banderines van entre el logotipo y los botones del menú, sin taparlos */
  function heroBunting(heroL) {
    var brand = document.querySelector(".nav-brand"), btn = document.getElementById("fiBtn") || document.getElementById("themeBtn");
    var old = heroL.querySelector(":scope > .fi-bunt");
    if (!brand || !btn) return;
    var a = brand.getBoundingClientRect().right + 18, b = btn.getBoundingClientRect().left - 18, w = Math.round(b - a);
    if (w < 300) { if (old) old.remove(); return; }
    placeBunting(heroL, { left: Math.round(a), width: w, swags: w > 900 ? 2 : 1, fh: 28, sag: 20 });
  }
  var built = false;
  function build() {
    if (built) return; built = true;
    var heroL = document.getElementById("fiHero");
    if (heroL) { heroBunting(heroL); confetti(heroL, 14); }
    var pills = document.querySelectorAll(".fi-star[data-fi]");
    Array.prototype.forEach.call(pills, function (p) { p.innerHTML = badge(); });
    var art = document.getElementById("fiArt");
    if (art) {
      art.insertAdjacentHTML("beforeend",
        '<i class="fi-sun"></i>' +
        '<div class="fi-tower">' + tower() + "</div>" +
        '<div class="fi-band"><span class="fi-note n1">♪</span><span class="fi-note n2">♫</span><span class="fi-note n3">♪</span><div class="fi-drum">' + drum() + '</div><div class="fi-mar">' + maracas() + "</div></div>" +
        '<div class="fi-skyline">' + skyline() + "</div>");
      placeBunting(art, { swags: 3, fh: 36, sag: 30 });
      confetti(art, 14);
    }
    Array.prototype.forEach.call(document.querySelectorAll(".fi-card .fi-ic[data-i]"), function (el) { el.innerHTML = ICONS[+el.getAttribute("data-i")] || ""; });
    var foot = document.querySelector(".foot");
    if (foot) { var f = document.createElement("div"); f.className = "fi-foot fi-only"; f.setAttribute("aria-hidden", "true"); foot.insertBefore(f, foot.firstChild); placeBunting(f, { swags: 3, fh: 26, sag: 18 }); }
    var t; window.addEventListener("resize", function () {
      clearTimeout(t); t = setTimeout(function () {
        if (heroL) heroBunting(heroL);
        if (art) placeBunting(art, { swags: 3, fh: 36, sag: 30 });
        var ff = document.querySelector(".fi-foot"); if (ff) placeBunting(ff, { swags: 3, fh: 26, sag: 18 });
      }, 200);
    }, { passive: true });
  }

  function mountBtn() {
    var themeBtn = document.getElementById("themeBtn");
    if (!themeBtn || document.getElementById("fiBtn")) return;
    var on = root.classList.contains("fi"), b = document.createElement("button");
    b.type = "button"; b.id = "fiBtn"; b.className = "fi-btn"; b.title = "Edición Fiestas de Independencia";
    function sync() { var a = root.classList.contains("fi"); b.setAttribute("aria-pressed", a ? "true" : "false"); b.setAttribute("aria-label", a ? "Quitar edición Fiestas de Independencia" : "Activar edición Fiestas de Independencia"); }
    b.innerHTML = badge() + '<span class="fi-btn-t">Edición Fiestas</span>';
    b.addEventListener("click", function () {
      var next = !root.classList.contains("fi");
      root.classList.toggle("fi", next);
      try { localStorage.setItem("ecodesa-fi", next ? "on" : "off"); } catch (e) {}
      if (next) build();
      sync();
    });
    sync();
    themeBtn.parentNode.insertBefore(b, themeBtn);
  }
  function start() { mountBtn(); if (root.classList.contains("fi")) build(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
