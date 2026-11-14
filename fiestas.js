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
  /* ---------- Bando en la Avenida Santander: mar, vía, murallas con garitas y la ciudad detrás ---------- */
  var SKIN = ["#7b4a2b", "#9a6038", "#5e3a22", "#a8714a"];
  function st(w) { return ' stroke="' + INK + '" stroke-width="' + (w || 3) + '" stroke-linejoin="round" stroke-linecap="round"'; }
  function head(sk, hat) {
    var s = '<circle cx="0" cy="-92" r="11" fill="' + sk + '"' + st(2.5) + "/>";
    if (hat) s += '<path d="M-11 -100 Q-10 -119 0 -119 Q10 -119 11 -100Z" fill="#f6e7c8"' + st(2.5) + '/><path d="M-10 -108 H10 M-9 -113 H9" stroke="' + INK + '" stroke-width="2"/>' +
      '<ellipse cx="0" cy="-100" rx="27" ry="6" fill="#f6e7c8"' + st(2.5) + '/><ellipse cx="0" cy="-100" rx="18" ry="3.6" fill="none" stroke="' + INK + '" stroke-width="2"/>';
    return s;
  }
  /* piernas con paso alterno (cadera como pivote) */
  function legs(pants) {
    pants = pants || "#fff";
    return '<g class="fi-leg"><path d="M-10 -42 L-12 -2 L-3 -2 L-1 -42Z" fill="' + pants + '"' + st(2.5) + '/><ellipse cx="-8" cy="0" rx="7" ry="3.5" fill="' + INK + '"/></g>' +
      '<g class="fi-leg fi-leg2"><path d="M1 -42 L3 -2 L12 -2 L10 -42Z" fill="' + pants + '"' + st(2.5) + '/><ellipse cx="8" cy="0" rx="7" ry="3.5" fill="' + INK + '"/></g>';
  }
  function man(sk, shirt, hat, armsHTML) {
    return legs() +
      '<path d="M-14 -42 L14 -42 L13 -80 Q0 -86 -13 -80Z" fill="' + shirt + '"' + st(2.5) + "/>" +
      '<path d="M-14 -46 H14" stroke="' + INK + '" stroke-width="2"/><path d="M-10 -80 L10 -80 L0 -68Z" fill="' + R + '"' + st(2) + "/>" + armsHTML + head(sk, hat);
  }
  function arm(d, sk, cls, dl) { return '<path class="' + (cls || "") + '" style="animation-delay:' + (dl || 0) + 's" d="' + d + '" fill="none" stroke="' + sk + '" stroke-width="6.5" stroke-linecap="round"/>'; }
  /* figura del desfile: sombra en el piso + cuerpo que camina (+ extra que viaja con ella) */
  function fig(x, dl, inner, extra) {
    return '<g transform="translate(' + x + ' 300)"><ellipse class="fi-shd" style="--dl:' + dl + 's" cx="0" cy="1" rx="25" ry="4.5" fill="' + INK + '" opacity=".22"/>' +
      '<g class="fi-walk" style="--dl:' + dl + 's">' + inner + "</g>" + (extra || "") + "</g>";
  }
  function notes(dl) {
    return '<g class="fi-pn" style="animation-delay:' + dl + 's"><text x="-8" y="-126">♪</text></g><g class="fi-pn" style="animation-delay:' + (dl - 1.3).toFixed(2) + 's"><text x="12" y="-118">♫</text></g>';
  }
  function cumbiambera(x, c1, c2, c3, sk, dl) {
    var hem = "M-48 -6"; for (var i = 0; i < 6; i++) hem += " q8 11 16 0";
    return fig(x, dl, '<g class="fi-sway" style="animation-delay:' + dl + 's">' +
      '<g class="fi-sk" style="animation-delay:' + dl + 's">' +
      '<path d="M-14 -64 Q-44 -30 -48 -6 Q0 6 48 -6 Q44 -30 14 -64Z" fill="' + c1 + '"' + st() + "/>" +
      '<path d="M-36 -36 Q0 -28 36 -36 L42 -20 Q0 -10 -42 -20Z" fill="' + c2 + '"' + st(2.5) + "/>" +
      '<path d="' + hem + ' L48 -6 Q0 6 -48 -6Z" fill="' + c3 + '"' + st(2.5) + "/>" +
      '<path d="M-40 -14 Q0 -4 40 -14" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="2 5"/>' +
      '<path d="M-24 -50 Q-30 -30 -34 -12 M0 -58 V-10 M24 -50 Q30 -30 34 -12" fill="none" stroke="' + INK + '" stroke-width="1.6" opacity=".35"/></g>' +
      '<path d="M-11 -64 L11 -64 L9 -84 L-9 -84Z" fill="' + sk + '"' + st(2.5) + "/>" +
      '<path d="M-17 -84 Q0 -76 17 -84 L15 -70 Q0 -64 -15 -70Z" fill="#fff"' + st(2.5) + "/>" +
      arm("M-13 -80 Q-30 -62 -42 -36", sk) + arm("M13 -82 Q28 -96 32 -116", sk, "fi-armup", dl) +
      '<circle cx="0" cy="-94" r="11" fill="' + sk + '"' + st(2.5) + "/>" +
      '<path d="M-12 -98 Q-15 -117 0 -120 Q15 -117 12 -98 Q0 -106 -12 -98Z" fill="' + c2 + '"' + st(2.5) + "/>" +
      '<circle cx="-8" cy="-116" r="5.5" fill="' + R + '"' + st(1.6) + '/><circle cx="5" cy="-121" r="5.5" fill="' + Y + '"' + st(1.6) + '/><circle cx="13" cy="-110" r="4.5" fill="' + O + '"' + st(1.6) + "/>" +
      '<circle cx="-10" cy="-88" r="2.8" fill="' + Y + '"/><circle cx="10" cy="-88" r="2.8" fill="' + Y + '"/></g>');
  }
  function candles(x, sk, dl) {
    var c = '<g class="fi-armup2" style="animation-delay:' + dl + 's">' + arm("M12 -78 Q24 -92 22 -112", sk) +
      '<rect x="15" y="-134" width="5" height="24" fill="#fff"' + st(1.8) + '/><rect x="21" y="-138" width="5" height="28" fill="#fff"' + st(1.8) + '/><rect x="27" y="-133" width="5" height="23" fill="#fff"' + st(1.8) + "/>" +
      '<circle class="fi-glow" cx="23.5" cy="-142" r="13" style="fill:var(--fi-flame-g)"/>' +
      '<path class="fi-flame" d="M17.5 -134 q-3 -6 0 -10 q3 4 0 10Z M23.5 -138 q-3 -6 0 -10 q3 4 0 10Z M29.5 -133 q-3 -6 0 -10 q3 4 0 10Z" fill="#ffb000" stroke="' + O + '" stroke-width="1"/></g>';
    return fig(x, dl, man(sk, "#fff", true, arm("M-12 -76 Q-21 -60 -18 -46", sk, "fi-swing", dl) + c));
  }
  function drummer(x, sk, shirt, dl) {
    var drum = '<path d="M-2 -60 L32 -60 L28 -20 Q15 -14 2 -20Z" fill="' + R + '"' + st(2.5) + '/><path d="M2 -54 L9 -24 L15 -54 L21 -24 L28 -54" fill="none" stroke="' + Y + '" stroke-width="3"/>' +
      '<ellipse cx="15" cy="-60" rx="17" ry="5" fill="' + C + '"' + st(2.5) + '/><path d="M-12 -80 Q4 -70 30 -60" fill="none" stroke="#8a4b16" stroke-width="2.5"/>';
    return fig(x, dl, man(sk, shirt, true, drum + arm("M-12 -78 Q0 -62 8 -62", sk, "fi-beat", dl) + arm("M12 -78 Q26 -70 22 -62", sk, "fi-beat", dl + 0.18)), notes(dl));
  }
  function millo(x, sk, dl) {
    return fig(x, dl, man(sk, Y, true, '<g class="fi-flute" style="animation-delay:' + dl + 's"><path d="M4 -90 L44 -84" stroke="#c9a26b" stroke-width="5" stroke-linecap="round"/><path d="M4 -90 L44 -84" stroke="' + INK + '" stroke-width="1.2" stroke-dasharray="1 6"/>' +
      arm("M-10 -78 Q8 -80 14 -88", sk) + arm("M10 -78 Q26 -82 30 -86", sk) + "</g>"), notes(dl - 0.6));
  }
  function flagBearer(x, sk, dl) {
    var f = '<path d="M14 -64 V-176" stroke="#8a4b16" stroke-width="4.5" stroke-linecap="round"/><circle cx="14" cy="-178" r="4" fill="' + Y + '"' + st(1.8) + '/><g class="fi-flagw">' +
      '<path d="M14 -176 H78 V-134 H14Z" fill="' + R + '"' + st(2.5) + '/><rect x="20" y="-170" width="52" height="30" fill="' + Y + '"/><rect x="26" y="-164" width="40" height="18" fill="' + G + '"/>' +
      '<polygon points="' + star8(46, -155, 7.5, 3.2) + '" fill="#fff"/><path d="M14 -176 H78 V-134 H14Z" fill="none"' + st(2.5) + "/></g>";
    return fig(x, dl, man(sk, G, true, f + arm("M12 -78 Q16 -88 14 -96", sk) + arm("M-12 -76 Q-20 -60 -16 -46", sk, "fi-swing", dl)));
  }
  function carroza(x, sk) {
    var fl = ""; for (var i = 0; i < 9; i++) fl += '<circle cx="' + (-72 + i * 18) + '" cy="-36" r="7" fill="' + [R, Y, O][i % 3] + '"' + st(1.6) + "/>";
    var wheel = function (cx) { return '<g transform="translate(' + cx + ' -10)"><g class="fi-wheel"><circle r="12" fill="' + INK + '"/><circle r="7" fill="' + Y + '"/><path d="M-7 0 H7 M0 -7 V7" stroke="' + INK + '" stroke-width="2.2"/></g></g>'; };
    var cc = ""; for (var j = 0; j < 10; j++) cc += '<rect class="fi-cc" style="--cx:' + ((j % 2 ? 1 : -1) * (16 + j * 6)) + "px;animation-delay:" + (-j * 0.31).toFixed(2) + 's" x="-3" y="-196" width="6" height="9" rx="1.5" fill="' + [R, Y, G, O, "#2f9be0", "#ff4fa0"][j % 6] + '"/>';
    return '<g transform="translate(' + x + ' 300)"><ellipse cx="0" cy="2" rx="96" ry="6" fill="' + INK + '" opacity=".22"/><g class="fi-bump">' +
      '<path d="M-80 -150 Q0 -205 80 -150" fill="none" stroke="' + G + '" stroke-width="7"/>' +
      [[-70, -156], [-40, -178], [0, -186], [40, -178], [70, -156]].map(function (p, i) { return '<circle class="fi-bulb" style="animation-delay:' + (-i * 0.4) + 's;fill:' + [R, Y, O, Y, R][i] + '" cx="' + p[0] + '" cy="' + p[1] + '" r="9"' + st(1.8) + "/>"; }).join("") +
      '<g class="fi-queen"><path d="M-22 -40 Q-30 -70 -12 -96 L12 -96 Q30 -70 22 -40Z" fill="' + Y + '"' + st(2.5) + '/><path d="M-26 -52 Q0 -44 26 -52" fill="none" stroke="' + R + '" stroke-width="5"/>' +
      '<path d="M-14 -94 Q0 -88 14 -94" fill="none" stroke="#fff" stroke-width="3"/>' +
      '<circle cx="0" cy="-108" r="11" fill="' + sk + '"' + st(2.5) + '/><path d="M-10 -117 L-6 -128 L0 -119 L6 -128 L10 -117Z" fill="' + Y + '"' + st(1.8) + "/>" +
      arm("M12 -92 Q26 -104 28 -122", sk, "fi-wave") + arm("M-12 -92 Q-20 -76 -16 -64", sk) + "</g>" +
      '<path d="M-84 -42 H84 L78 -14 H-78Z" fill="' + G + '"' + st(3) + '/><path d="M-80 -24 H80" stroke="' + Y + '" stroke-width="4"/>' + fl + "</g>" + cc + wheel(-50) + wheel(50) + "</g>";
  }
  /* ---------- cielo: sol/luna, nubes, estrellas, gaviotas y fuegos artificiales ---------- */
  function sky() {
    var s = "", i;
    var rays = ""; for (i = 0; i < 16; i++) { var a = i * Math.PI / 8, b = a + 0.09, c2 = a - 0.09;
      rays += '<path d="M' + (84 * Math.cos(c2)).toFixed(1) + " " + (84 * Math.sin(c2)).toFixed(1) + " L" + (116 * Math.cos(a)).toFixed(1) + " " + (116 * Math.sin(a)).toFixed(1) + " L" + (84 * Math.cos(b)).toFixed(1) + " " + (84 * Math.sin(b)).toFixed(1) + 'Z"/>'; }
    s += '<g transform="translate(1300 96)"><circle r="134" style="fill:var(--fi-sunc);opacity:var(--fi-halo)"/>' +
      '<g style="opacity:var(--fi-rayo)"><g class="fi-rays" style="fill:var(--fi-sunc)">' + rays + "</g></g>" +
      '<circle r="72" style="fill:var(--fi-sunc)"/><circle r="72" fill="none" stroke="' + INK + '" stroke-width="3" style="opacity:var(--fi-rayo)"/>' +
      '<g style="opacity:var(--fi-moon)" fill="#eadb9e"><circle cx="-24" cy="-16" r="12"/><circle cx="20" cy="22" r="16"/><circle cx="28" cy="-26" r="7"/><circle cx="-14" cy="30" r="5"/></g></g>';
    var stars = [[90, 40], [250, 22], [430, 60], [560, 26], [760, 48], [880, 18], [1060, 40], [1180, 64], [1480, 30], [1560, 78], [690, 82], [140, 96]];
    s += '<g style="opacity:var(--fi-stars)">' + stars.map(function (p, k) {
      return '<g transform="translate(' + p[0] + " " + p[1] + ')"><path class="fi-tw" style="animation-delay:' + (-k * 0.47).toFixed(2) + 's" d="M0 -7 L1.8 -1.8 L7 0 L1.8 1.8 L0 7 L-1.8 1.8 L-7 0 L-1.8 -1.8Z" fill="#fff4d6"/></g>';
    }).join("") + "</g>";
    var cloud = function (x, y, k, dur, dl) {
      return '<g transform="translate(' + x + " " + y + ") scale(" + k + ')" style="opacity:var(--fi-cloud)"><g class="fi-cloud" style="animation-duration:' + dur + "s;animation-delay:" + dl + 's">' +
        '<path d="M0 0 Q-4 -22 20 -22 Q26 -44 52 -38 Q70 -56 92 -38 Q120 -40 118 -16 Q132 -12 126 0Z" fill="#fff8e6"' + st(2.5) + '/><path d="M18 -8 Q40 -2 64 -8" fill="none" stroke="#f1d9a0" stroke-width="3" stroke-linecap="round"/></g></g>';
    };
    s += cloud(80, 60, 0.9, 46, -8) + cloud(700, 44, 0.7, 58, -20) + cloud(1460, 120, 0.6, 52, -30);
    var fw = function (x, y, col, dl) {
      var l = ""; for (var j = 0; j < 12; j++) { var an = j * Math.PI / 6, cx = Math.cos(an), sy = Math.sin(an);
        l += '<path d="M' + (cx * 9).toFixed(1) + " " + (sy * 9).toFixed(1) + " L" + (cx * 28).toFixed(1) + " " + (sy * 28).toFixed(1) + '"/><circle cx="' + (cx * 35).toFixed(1) + '" cy="' + (sy * 35).toFixed(1) + '" r="2.4"/>'; }
      return '<g transform="translate(' + x + " " + y + ')"><path class="fi-fwt" style="animation-delay:' + dl + 's" d="M0 8 V34" stroke="' + col + '" stroke-width="3" stroke-linecap="round"/>' +
        '<g class="fi-fwb" style="animation-delay:' + dl + 's" stroke="' + col + '" fill="' + col + '" stroke-width="3" stroke-linecap="round">' + l + '<circle r="4"/></g></g>';
    };
    s += fw(470, 52, R, -0.4) + fw(840, 40, G, -2.1) + fw(1530, 50, "#e8178a", -3.3) + fw(170, 70, O, -1.4);
    var bird = function (y, k, dur, dl) {
      return '<g transform="translate(0 ' + y + ") scale(" + k + ')"><g class="fi-bird" style="animation-duration:' + dur + "s;animation-delay:" + dl + 's"><g class="fi-wing" style="animation-delay:' + (dl / 7).toFixed(2) + 's">' +
        '<path d="M-15 0 Q-8 -10 0 0 Q8 -10 15 0" fill="none" stroke="' + INK + '" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></g></g></g>';
    };
    s += bird(70, 1, 30, -4) + bird(92, 0.75, 30, -5.2) + bird(54, 0.85, 38, -21);
    return s;
  }
  /* ciudad lejana (silueta) para dar profundidad */
  function farCity() {
    var s = "", w = "", x = -10, i = 0;
    while (x < 1610) {
      var bw = 38 + ((i * 53) % 5) * 13, h = 36 + ((i * 71) % 6) * 11, top = 168 - h;
      s += '<rect x="' + x + '" y="' + top + '" width="' + bw + '" height="' + (h + 6) + '"/>';
      if (i % 4 === 1) s += '<path d="M' + (x + bw / 2 - 13) + " " + top + " Q" + (x + bw / 2) + " " + (top - 28) + " " + (x + bw / 2 + 13) + " " + top + 'Z"/><rect x="' + (x + bw / 2 - 1.5) + '" y="' + (top - 36) + '" width="3" height="10"/>';
      for (var r = 0; r < 2; r++) for (var c = 0; c < Math.floor(bw / 18); c++) if ((i + r + c) % 3) w += '<rect x="' + (x + 7 + c * 18) + '" y="' + (top + 10 + r * 16) + '" width="6" height="8" rx="1"/>';
      x += bw + (i % 3 ? 0 : 10); i++;
    }
    return '<g style="fill:var(--fi-far)">' + s + '</g><g class="fi-farw" style="fill:var(--fi-farwin)">' + w + "</g>";
  }
  /* buganvilias (cayenas) que caen sobre la muralla */
  function buga(x) {
    var s = '<g transform="translate(' + x + ' 160)"><g class="fi-buga">', cols = ["#ff4fa0", "#e8178a", "#ff7ac0"];
    var pts = [[-30, 0], [-16, -6], [0, -2], [16, -7], [30, 0], [-24, 12], [-6, 10], [12, 12], [26, 14], [-14, 24], [4, 26], [18, 30], [-4, 40], [10, 46]];
    s += '<path d="M-26 6 Q-28 26 -20 40 M8 8 Q14 30 6 52" fill="none" stroke="' + G + '" stroke-width="3" stroke-linecap="round"/>';
    pts.forEach(function (p, k) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (7 - (k % 3)) + '" fill="' + cols[k % 3] + '"' + st(1.6) + "/>"; });
    s += '<path d="M-36 4 q-6 -8 2 -10 q4 6 -2 10Z M36 6 q8 -6 2 -12 q-6 4 -2 12Z M-20 30 q-8 2 -6 -6 q6 0 6 6Z" fill="' + G + '"' + st(1.4) + "/>";
    return s + "</g></g>";
  }
  function bandoScene() {
    var s = sky() + farCity();
    /* palmeras */
    var palm = function (x, k) { return '<g transform="translate(' + x + ' 172) scale(' + k + ')"><path d="M0 0 Q-6 -60 6 -118" fill="none" stroke="#8a5a2b" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M-3 -20 h8 M-4 -44 h8 M-2 -68 h8 M2 -92 h7" stroke="#5e3a1a" stroke-width="2"/>' +
      '<g class="fi-palm" fill="' + G + '"' + st(2.5) + '><path d="M6 -118 Q-30 -132 -58 -104 Q-26 -118 6 -112Z"/><path d="M6 -118 Q42 -136 66 -106 Q36 -118 6 -112Z"/><path d="M6 -118 Q-10 -150 -40 -152 Q-12 -140 4 -114Z"/><path d="M6 -118 Q24 -152 54 -150 Q24 -138 8 -114Z"/><circle cx="2" cy="-112" r="5" fill="#8a5a2b"/><circle cx="11" cy="-110" r="5" fill="#8a5a2b"/></g></g>'; };
    s += palm(70, 1) + palm(1520, 0.9);
    /* ciudad: casas con balcón, cúpula y Torre del Reloj */
    [[520, 120, "#ff6fa8"], [620, 104, "#2f9be0"], [1140, 116, O], [1240, 100, "#9b5cff"]].forEach(function (h) {
      s += '<rect x="' + h[0] + '" y="' + h[1] + '" width="96" height="' + (172 - h[1]) + '" fill="' + h[2] + '"' + st() + '/><rect x="' + (h[0] - 4) + '" y="' + (h[1] - 9) + '" width="104" height="11" fill="' + R + '"' + st(2.5) + "/>" +
        '<rect class="fi-win" x="' + (h[0] + 14) + '" y="' + (h[1] + 14) + '" width="20" height="26" rx="8" style="fill:var(--fi-win)"' + st(2) + '/><rect class="fi-win" x="' + (h[0] + 62) + '" y="' + (h[1] + 14) + '" width="20" height="26" rx="8" style="fill:var(--fi-win)"' + st(2) + "/>" +
        '<path d="M' + (h[0] + 6) + " " + (h[1] + 44) + " h84" + '" stroke="#8a4b16" stroke-width="5"/><path d="M' + (h[0] + 10) + " " + (h[1] + 46) + " v8 M" + (h[0] + 32) + " " + (h[1] + 46) + " v8 M" + (h[0] + 54) + " " + (h[1] + 46) + " v8 M" + (h[0] + 76) + " " + (h[1] + 46) + ' v8" stroke="#8a4b16" stroke-width="2.5"/>' +
        '<circle cx="' + (h[0] + 12) + '" cy="' + (h[1] + 40) + '" r="6" fill="#ff4fa0"' + st(1.4) + '/><circle cx="' + (h[0] + 22) + '" cy="' + (h[1] + 38) + '" r="5" fill="#e8178a"' + st(1.4) + "/>";
    });
    s += '<g transform="translate(1000 172)"><rect x="-34" y="-58" width="68" height="58" fill="' + C + '"' + st() + '/><path d="M-40 -58 Q0 -126 40 -58Z" fill="#ffc400"' + st() + '/><path d="M-20 -62 Q-12 -100 0 -106 M20 -62 Q12 -100 0 -106" fill="none" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<rect x="-7" y="-122" width="14" height="18" fill="' + C + '"' + st(2.5) + '/><path d="M-9 -122 Q0 -134 9 -122Z" fill="#ffc400"' + st(2.5) + '/><path d="M0 -134 V-146 M-5 -141 H5" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<rect class="fi-win" x="-8" y="-44" width="16" height="22" rx="8" style="fill:var(--fi-win)"' + st(2) + "/></g>";
    s += '<g transform="translate(330 172)"><rect x="-38" y="-80" width="76" height="80" fill="' + C + '"' + st() + '/><path d="M-14 0 V-30 A14 14 0 0 1 14 -30 V0Z" fill="' + INK + '"/>' +
      '<rect x="-46" y="-92" width="92" height="12" fill="' + O + '"' + st(2.5) + '/><rect x="-28" y="-138" width="56" height="46" fill="' + Y + '"' + st() + '/><circle cx="0" cy="-115" r="16" style="fill:var(--fi-clock)"' + st(2.5) + '/>' +
      '<g transform="translate(0 -115)"><path class="fi-hand" d="M0 0 V-11" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/><path class="fi-hand2" d="M0 0 V-7" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round"/><circle r="2.4" fill="' + INK + '"/></g>' +
      '<rect x="-34" y="-146" width="68" height="9" fill="' + O + '"' + st(2.5) + '/><path d="M-26 -146 Q0 -184 26 -146Z" fill="' + R + '"' + st() + '/><path d="M0 -176 V-196" stroke="' + INK + '" stroke-width="2.5"/><path d="M0 -196 L16 -191 L0 -186Z" fill="' + Y + '"' + st(1.8) + "/></g>";
    /* murallas con garitas */
    s += '<rect x="-10" y="170" width="1620" height="94" fill="#dba660"' + st() + '/><rect x="-10" y="236" width="1620" height="28" fill="#b98345" opacity=".35"/><path d="M-10 174 H1610" stroke="#f3cf8e" stroke-width="3"/>';
    for (var mx = 0; mx < 1600; mx += 44) s += '<rect x="' + mx + '" y="158" width="26" height="14" fill="#dba660"' + st(2.5) + '/><path d="M' + (mx + 3) + ' 161 h20" stroke="#f3cf8e" stroke-width="2.4"/>';
    s += '<path d="M0 196 H1600 M0 222 H1600 M0 246 H1600" stroke="#b37b3a" stroke-width="2.2"/>';
    for (var bx = 0; bx < 1600; bx += 64) s += '<path d="M' + bx + " 170 V196 M" + (bx + 32) + " 196 V222 M" + bx + " 222 V246 M" + (bx + 32) + ' 246 V262" stroke="#b37b3a" stroke-width="2"/>';
    var garita = function (x) { return '<g transform="translate(' + x + ' 166)"><path d="M-24 0 Q0 16 24 0Z" fill="#c9924d"' + st(2.5) + '/><rect x="-20" y="-46" width="40" height="46" fill="#e7b56c"' + st() + '/><path d="M-25 -46 Q0 -84 25 -46Z" fill="#dba660"' + st() + '/><rect x="-4" y="-36" width="8" height="18" rx="4" fill="' + INK + '"/><circle cx="0" cy="-70" r="4" fill="#c9924d"' + st(2) + "/></g>"; };
    s += garita(200) + garita(770) + garita(1430);
    s += buga(96) + buga(470) + buga(1080) + buga(1585);
    /* faroles con banderines y bombillos a lo largo de la vía */
    var posts = [120, 520, 920, 1320, 1720];
    posts.forEach(function (px, i) {
      s += '<path d="M' + px + " 266 V176" + '" stroke="#2d3a5a" stroke-width="6"/><path d="M' + (px - 12) + " 178 h24 l-5 -16 h-14Z" + '" fill="#2d3a5a"/><circle cx="' + px + '" cy="186" r="16" style="fill:var(--fi-lampg)"/><circle class="fi-lamp" cx="' + px + '" cy="186" r="7" style="fill:var(--fi-lamp)"/>';
      if (i < posts.length - 1) {
        var x0 = px, x1 = posts[i + 1], cx = (x0 + x1) / 2;
        var P = function (t) { var mt = 1 - t; return [mt * mt * x0 + 2 * mt * t * cx + t * t * x1, mt * mt * 182 + 2 * mt * t * 222 + t * t * 182]; };
        s += '<path d="M' + x0 + " 182 Q" + cx + " 222 " + x1 + ' 182" fill="none" stroke="' + INK + '" stroke-width="1.8"/>';
        for (var k = 1; k < 12; k++) { var f = P(k / 12);
          s += '<path class="fi-flag" style="--d:' + (-k * 0.3).toFixed(1) + "s;transform-origin:" + f[0].toFixed(1) + "px " + f[1].toFixed(1) + 'px" d="M' + (f[0] - 9).toFixed(1) + " " + f[1].toFixed(1) + " h18 l-9 15Z" + '" fill="' + [R, Y, G, O][k % 4] + '" stroke="' + INK + '" stroke-width="1.5"/>';
          var bl = P((k + 0.5) / 12); if (k < 11) s += '<circle class="fi-bulb" style="animation-delay:' + (-(k + i) * 0.37).toFixed(2) + 's;fill:var(--fi-bulbc)" cx="' + bl[0].toFixed(1) + '" cy="' + (bl[1] + 2).toFixed(1) + '" r="3.2" stroke="' + INK + '" stroke-width="1.2"/>'; }
      }
    });
    /* Avenida Santander */
    s += '<rect x="-10" y="262" width="1620" height="10" fill="#e8d9c0"' + st(2.5) + '/><rect x="-10" y="272" width="1620" height="44" fill="#5d626e"/><rect x="-10" y="272" width="1620" height="6" fill="' + INK + '" opacity=".18"/><path d="M0 294 H1600" stroke="' + Y + '" stroke-width="4" stroke-dasharray="28 20"/>';
    /* desfile (dos copias para que el bucle no se note) */
    function parade() {
      return flagBearer(60, SKIN[0], 0) + cumbiambera(210, R, Y, G, SKIN[1], -0.2) + candles(340, SKIN[2], -0.35) + cumbiambera(470, Y, R, G, SKIN[3], -0.1) +
        drummer(600, SKIN[0], C, -0.25) + carroza(790, SKIN[1]) + millo(980, SKIN[2], -0.15) + cumbiambera(1110, G, Y, R, SKIN[0], -0.3) +
        candles(1240, SKIN[3], -0.05) + drummer(1370, SKIN[2], Y, -0.4) + cumbiambera(1500, O, G, Y, SKIN[1], -0.12);
    }
    s += '<g class="fi-parade"><g transform="translate(-1600 0)">' + parade() + "</g>" + parade() + "</g>";
    /* malecón y mar con oleaje en capas y destellos */
    var wave = function (y, col, w, op, cls) { var dd = "M-120 " + y; for (var i = 0; i < 30; i++) dd += " q15 -7 30 0 t30 0"; return '<g class="' + cls + '"><path d="' + dd + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" opacity="' + op + '"/></g>'; };
    s += '<rect x="-10" y="314" width="1620" height="10" fill="#cdbfa7"' + st(2.5) + '/><rect x="-10" y="324" width="1620" height="60" fill="#1eb5cc"/><rect x="-10" y="324" width="1620" height="8" fill="#0f8ea3" opacity=".55"/>' +
      wave(336, "#0f8ea3", 2.4, 0.8, "fi-sea3") + wave(343, "#fff", 2.6, 0.85, "fi-sea") + wave(355, "#fff", 2.4, 0.55, "fi-sea2");
    [[150, 348], [430, 340], [690, 352], [980, 344], [1250, 350], [1520, 341]].forEach(function (p, k) {
      s += '<g transform="translate(' + p[0] + " " + p[1] + ')"><path class="fi-spk" style="animation-delay:' + (-k * 0.6).toFixed(1) + 's" d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2Z" fill="#fff"/></g>';
    });
    return '<svg viewBox="0 0 1600 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + s + "</svg>";
  }
  var ICONS = [
    /* residuos: caneca con separación */
    '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="14" y="20" width="36" height="38" rx="5" fill="' + G + '" stroke="' + INK + '" stroke-width="3"/><rect x="10" y="12" width="44" height="9" rx="4" fill="' + Y + '" stroke="' + INK + '" stroke-width="3"/><path d="M26 12 V7 H38 V12" fill="none" stroke="' + INK + '" stroke-width="3"/><path d="M24 30 V50 M32 30 V50 M40 30 V50" stroke="' + C + '" stroke-width="3.5" stroke-linecap="round"/><circle cx="54" cy="10" r="4" fill="' + R + '"/><rect x="4" y="6" width="6" height="9" rx="1.5" fill="' + O + '" transform="rotate(-20 7 10)"/></svg>',
    /* cocina: olla con vapor */
    '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M22 14 q-4 -5 0 -10 M32 14 q-4 -5 0 -10 M42 14 q-4 -5 0 -10" fill="none" stroke="' + O + '" stroke-width="3" stroke-linecap="round"/><path d="M8 24 H56 L52 54 Q32 62 12 54Z" fill="' + R + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><rect x="5" y="19" width="54" height="8" rx="4" fill="' + Y + '" stroke="' + INK + '" stroke-width="3"/><path d="M14 36 h36" stroke="' + C + '" stroke-width="3" stroke-dasharray="5 5"/></svg>',
    /* afluencia: señal de evacuación */
    '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="4" y="10" width="56" height="44" rx="8" fill="' + G + '" stroke="' + INK + '" stroke-width="3"/><circle cx="26" cy="20" r="4.5" fill="#fff"/><path d="M26 26 L22 38 L30 40 L26 50 M23 31 L16 34 M27 29 L33 34 M22 38 L16 47" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 32 H54 M48 26 L54 32 L48 38" fill="none" stroke="' + Y + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  ];

  /* ---------- decoración en toda la página: banderines, farol colgante y un objeto típico por sección ---------- */
  function farol(c1, c2) {
    return '<svg viewBox="0 0 70 130" aria-hidden="true"><path d="M35 0 V34" stroke="' + INK + '" stroke-width="2"/><rect x="27" y="32" width="16" height="8" rx="2" fill="' + Y + '"' + st(2.2) + "/>" +
      '<ellipse cx="35" cy="72" rx="28" ry="33" fill="' + c1 + '"' + st(3) + '/><path d="M10 60 Q35 68 60 60 M8 76 Q35 84 62 76 M12 92 Q35 98 58 92" fill="none" stroke="' + c2 + '" stroke-width="4"/>' +
      '<path d="M35 39 V105" stroke="' + INK + '" stroke-width="1.6" opacity=".45"/><rect x="27" y="103" width="16" height="7" rx="2" fill="' + Y + '"' + st(2.2) + "/>" +
      '<path d="M30 110 l-3 16 M35 110 v18 M40 110 l3 16" stroke="' + c2 + '" stroke-width="2.5" stroke-linecap="round"/></svg>';
  }
  function sombrero() {
    return '<svg viewBox="0 0 130 74" aria-hidden="true"><ellipse cx="65" cy="54" rx="60" ry="16" fill="#f6e7c8"' + st(3) + '/>' +
      '<ellipse cx="65" cy="54" rx="46" ry="11.5" fill="none" stroke="' + INK + '" stroke-width="2.4"/><ellipse cx="65" cy="54" rx="32" ry="8" fill="none" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<path d="M40 52 Q38 10 65 8 Q92 10 90 52 Q65 60 40 52Z" fill="#f6e7c8"' + st(3) + '/><path d="M41 40 Q65 47 89 40 M43 28 Q65 34 87 28 M48 17 Q65 22 82 17" fill="none" stroke="' + INK + '" stroke-width="2.4"/></svg>';
  }
  function ponchera() {
    return '<svg viewBox="0 0 130 100" aria-hidden="true">' +
      '<path d="M44 40 Q40 14 58 6 Q50 24 56 40Z M60 40 Q64 10 82 4 Q72 24 70 40Z" fill="' + Y + '"' + st(2.5) + "/>" +
      '<ellipse cx="88" cy="36" rx="12" ry="15" fill="' + O + '"' + st(2.5) + '/><path d="M82 22 l-4 -10 l6 6 l2 -10 l3 10 l6 -6 l-3 10" fill="' + G + '"' + st(2) + "/>" +
      '<circle cx="34" cy="40" r="10" fill="' + R + '"' + st(2.5) + '/><circle cx="104" cy="44" r="9" fill="' + G + '"' + st(2.5) + "/>" +
      '<path d="M12 46 H118 Q112 86 65 90 Q18 86 12 46Z" fill="#c9ced6"' + st(3) + '/><path d="M24 58 Q65 70 106 58" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/></svg>';
  }
  function cayena() {
    var p = ""; for (var i = 0; i < 5; i++) p += '<ellipse cx="50" cy="26" rx="16" ry="24" fill="' + R + '"' + st(2.5) + ' transform="rotate(' + (i * 72) + ' 50 50)"/>';
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 50 L18 86 Q30 60 50 50Z M50 50 L88 84 Q66 62 50 50Z" fill="' + G + '"' + st(2.5) + "/>" + p +
      '<circle cx="50" cy="50" r="9" fill="' + Y + '"' + st(2.5) + '/><path d="M50 50 L64 20" stroke="' + Y + '" stroke-width="3"/><circle cx="65" cy="18" r="3.5" fill="' + O + '"/></svg>';
  }
  function banderita() {
    return '<svg viewBox="0 0 90 120" aria-hidden="true"><path d="M12 4 V118" stroke="#8a4b16" stroke-width="5" stroke-linecap="round"/><circle cx="12" cy="5" r="5" fill="' + Y + '"' + st(2) + '/>' +
      '<g class="fi-flagw"><rect x="12" y="10" width="72" height="50" fill="' + R + '"' + st(2.5) + '/><rect x="19" y="17" width="58" height="36" fill="' + Y + '"/><rect x="27" y="24" width="42" height="22" fill="' + G + '"/>' +
      '<polygon points="' + star8(48, 35, 9, 3.8) + '" fill="#fff"/></g></svg>';
  }
  function tamborSolo() {
    return '<svg viewBox="0 0 110 120" aria-hidden="true"><path d="M14 30 L96 30 L86 110 Q55 120 24 110Z" fill="' + R + '"' + st(3) + '/><path d="M18 42 L32 106 L46 42 L58 112 L70 42 L82 106 L94 42" fill="none" stroke="' + Y + '" stroke-width="3.5" stroke-linejoin="round"/>' +
      '<ellipse cx="55" cy="30" rx="43" ry="12" fill="' + C + '"' + st(3) + '/><path d="M24 110 Q55 120 86 110" fill="none" stroke="' + G + '" stroke-width="5"/></svg>';
  }
  function maracasSolo() {
    function one(cx, cy, rot, fill, band) {
      return '<g transform="rotate(' + rot + " " + cx + " " + cy + ')"><rect x="' + (cx - 4) + '" y="' + (cy + 18) + '" width="8" height="40" rx="4" fill="#8a4b16"' + st(3) + "/>" +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="17" ry="22" fill="' + fill + '"' + st(3) + '/><path d="M' + (cx - 15) + " " + (cy - 4) + " Q" + cx + " " + (cy + 6) + " " + (cx + 15) + " " + (cy - 4) + '" fill="none" stroke="' + band + '" stroke-width="4"/></g>';
    }
    return '<svg viewBox="0 0 110 130" aria-hidden="true">' + one(40, 40, -22, G, Y) + one(72, 44, 18, Y, R) + "</svg>";
  }
  var DECO = [
    ["fi-o-shake", maracasSolo], ["fi-o-bob", sombrero], ["fi-o-beat", tamborSolo], ["fi-o-bob", ponchera], ["fi-o-spin", cayena], ["fi-o-bob", banderita]
  ];
  var FAROL = [[R, Y], [G, Y], [Y, R], [O, G], ["#2f9be0", Y]];
  function buildWide() {
    var secs = document.querySelectorAll("main .sec:not(.fi-sec), .foot");
    var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle("fi-run", e.isIntersecting); });
    }, { rootMargin: "120px 0px" }) : null;
    Array.prototype.forEach.call(secs, function (s, i) {
      if (s.querySelector(":scope > .fi-wide")) return;
      var L = document.createElement("div"); L.className = "fi-wide fi-only"; L.setAttribute("aria-hidden", "true");
      var isFoot = s.classList.contains("foot"), f = FAROL[i % FAROL.length], d = DECO[i % DECO.length];
      var html = '<i class="fi-tex"></i>';
      if (!isFoot) html += '<span class="fi-farol ' + (i % 2 ? "fl" : "fr") + '" style="animation-delay:' + (-i * 0.7) + 's">' + farol(f[0], f[1]) + "</span>";
      html += '<span class="fi-obj ' + d[0] + " " + (i % 2 ? "or" : "ol") + '" style="animation-delay:' + (-i * 0.5) + 's">' + d[1]() + "</span>";
      L.innerHTML = html;
      s.classList.add("fi-host");
      s.insertBefore(L, s.firstChild);
      if (!isFoot) placeBunting(L, { swags: 3, fh: 22, sag: 14, fhm: 14, sagm: 7 });
      confetti(L, isFoot ? 8 : 12);
      if (io) io.observe(L); else L.classList.add("fi-run");
    });
  }

  /* ---------- bailarines de las fiestas: uno por sección, en el espacio libre junto al título ---------- */
  var BAILES = [
    ["#sectores", "capuchon", "r", 480, 720], ["#servicios", "urbana", "r", 451, 720], ["#campo", "golero", "r", 484, 720],
    ["#proceso", "pollera", "r", 476, 720], [".sec.video", "vela", "l", 481, 720], [".sec.video", "tambora", "r", 480, 720]
  ];
  function buildDancers() {
    BAILES.forEach(function (b, i) {
      var s = document.querySelector(b[0]); if (!s || s.querySelector(".fi-dancer.d-" + b[1])) return;
      var f = document.createElement("figure"); f.className = "fi-dancer fi-only d-" + b[1] + " " + (b[2] === "l" ? "dl" : "dr") + (s.classList.contains("video") ? " dc" : "");
      f.setAttribute("aria-hidden", "true");
      f.innerHTML = '<img src="assets/v2/fi-baile-' + b[1] + '.webp" alt="" width="' + b[3] + '" height="' + b[4] + '" loading="lazy" decoding="async" style="animation-delay:' + (-i * 0.6) + 's">';
      s.appendChild(f);
    });
  }

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
        '<div class="fi-bando">' + bandoScene() + "</div>");
      /* la escena solo se anima con la sección en pantalla */
      if ("IntersectionObserver" in window) {
        art.classList.add("fi-io");
        new IntersectionObserver(function (es) { es.forEach(function (e) { art.classList.toggle("fi-run", e.isIntersecting); }); }, { rootMargin: "120px 0px" }).observe(art);
      }
      placeBunting(art, { swags: 3, fh: 36, sag: 30 });
      confetti(art, 14);
    }
    Array.prototype.forEach.call(document.querySelectorAll(".fi-card .fi-ic[data-i]"), function (el) { el.innerHTML = ICONS[+el.getAttribute("data-i")] || ""; });
    var foot = document.querySelector(".foot");
    if (foot) { var f = document.createElement("div"); f.className = "fi-foot fi-only"; f.setAttribute("aria-hidden", "true"); foot.insertBefore(f, foot.firstChild); placeBunting(f, { swags: 3, fh: 26, sag: 18 }); }
    buildWide();
    buildDancers();
    var t; window.addEventListener("resize", function () {
      clearTimeout(t); t = setTimeout(function () {
        if (heroL) heroBunting(heroL);
        if (art) placeBunting(art, { swags: 3, fh: 36, sag: 30 });
        var ff = document.querySelector(".fi-foot"); if (ff) placeBunting(ff, { swags: 3, fh: 26, sag: 18 });
        Array.prototype.forEach.call(document.querySelectorAll("main .fi-wide"), function (w) { placeBunting(w, { swags: 3, fh: 22, sag: 14, fhm: 14, sagm: 7 }); });
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
