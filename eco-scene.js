/* Escena empresarial ECODESA: "Cartagena que cumple". Mismo lenguaje visual del Bando de Fiestas,
   con el equipo de ECODESA desfilando por la Avenida Santander y Ethan en su nave. Decoración aria-hidden. */
(function () {
  var INK = "#13240f", Y = "#ffd21f", R = "#e3262b", G = "#2E6B1F", L = "#76b82a", L2 = "#b6e36a", O = "#ff7a1a", C = "#fbfff2", W = "#ffffff";
  var SKIN = ["#7b4a2b", "#9a6038", "#5e3a22", "#c58c5e"];
  function st(w) { return ' stroke="' + INK + '" stroke-width="' + (w || 3) + '" stroke-linejoin="round" stroke-linecap="round"'; }
  function face(sk, cy, fem) {
    var s = '<rect x="-4.5" y="' + (cy + 9) + '" width="9" height="9" fill="' + sk + '"' + st(2.2) + "/>" +
      '<circle cx="-13.5" cy="' + (cy + 1) + '" r="3.6" fill="' + sk + '"' + st(2) + '/><circle cx="13.5" cy="' + (cy + 1) + '" r="3.6" fill="' + sk + '"' + st(2) + "/>" +
      '<circle cx="0" cy="' + cy + '" r="14" fill="' + sk + '"' + st(2.5) + "/>";
    if (fem) s += '<path d="M-14 ' + (cy - 1) + " Q-15 " + (cy - 15) + " 0 " + (cy - 15) + " Q15 " + (cy - 15) + " 14 " + (cy - 1) + " Q8 " + (cy - 9) + " 0 " + (cy - 9) + " Q-8 " + (cy - 9) + " -14 " + (cy - 1) + 'Z" fill="' + INK + '"/><path d="M12 ' + (cy - 4) + ' q10 8 4 22" fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>';
    [-5.2, 5.2].forEach(function (ex) {
      s += '<ellipse cx="' + ex + '" cy="' + cy + '" rx="2.9" ry="3.4" fill="#fff" stroke="' + INK + '" stroke-width="1"/><circle cx="' + (ex + 0.5) + '" cy="' + (cy + 0.6) + '" r="1.8" fill="' + INK + '"/><circle cx="' + (ex + 1.1) + '" cy="' + (cy - 0.4) + '" r=".7" fill="#fff"/>' +
        '<path d="M' + (ex - 3) + " " + (cy - 5.2) + " Q" + ex + " " + (cy - 7.4) + " " + (ex + 3) + " " + (cy - 5.4) + '" fill="none" stroke="' + INK + '" stroke-width="1.5" stroke-linecap="round"/>';
    });
    s += '<path d="M-4.6 ' + (cy + 6.4) + " Q0 " + (cy + 11.6) + " 4.6 " + (cy + 6.4) + ' Z" fill="#7a1a10"' + st(1.2) + '/><path d="M-3.4 ' + (cy + 6.9) + ' H3.4" stroke="#fff" stroke-width="1.4"/>' +
      '<ellipse cx="-8.4" cy="' + (cy + 5) + '" rx="2.8" ry="1.8" fill="#ff6b6b" opacity=".45"/><ellipse cx="8.4" cy="' + (cy + 5) + '" rx="2.8" ry="1.8" fill="#ff6b6b" opacity=".45"/>';
    return s;
  }
  function helmet(col) {
    return '<path d="M-15 -100 Q-15 -122 0 -123 Q15 -122 15 -100Z" fill="' + col + '"' + st(2.5) + '/><path d="M-19 -100 H19" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/><path d="M0 -123 V-104" stroke="' + INK + '" stroke-width="2" opacity=".5"/>';
  }
  function cap() { return '<path d="M-14 -101 Q-14 -120 0 -120 Q14 -120 14 -101Z" fill="' + G + '"' + st(2.5) + '/><path d="M8 -102 H28 Q26 -96 10 -97Z" fill="' + G + '"' + st(2) + "/>"; }
  function legs(p) {
    p = p || "#2f3a3a";
    return '<g class="fi-leg"><path d="M-10 -42 L-12 -2 L-3 -2 L-1 -42Z" fill="' + p + '"' + st(2.5) + '/><ellipse cx="-8" cy="0" rx="7" ry="3.5" fill="' + INK + '"/></g>' +
      '<g class="fi-leg fi-leg2"><path d="M1 -42 L3 -2 L12 -2 L10 -42Z" fill="' + p + '"' + st(2.5) + '/><ellipse cx="8" cy="0" rx="7" ry="3.5" fill="' + INK + '"/></g>';
  }
  /* camisa blanca con el logo verde de ECODESA */
  function shirt(col, vest) {
    var s = '<path d="M-14 -42 L14 -42 L13 -80 Q0 -86 -13 -80Z" fill="' + (col || W) + '"' + st(2.5) + "/>" +
      '<path d="M-6 -80 L0 -72 L6 -80" fill="none" stroke="' + INK + '" stroke-width="2"/>';
    if (vest) s += '<path d="M-14 -42 L-13 -80 L-5 -80 L-4 -42Z M14 -42 L13 -80 L5 -80 L4 -42Z" fill="' + vest + '"' + st(2) + '/><path d="M-13 -56 H-4 M4 -56 H13" stroke="#e8ecef" stroke-width="3"/>';
    else s += '<circle cx="-6" cy="-66" r="4.2" fill="' + L + '"' + st(1.4) + '/><path d="M-8 -66 h4" stroke="#fff" stroke-width="1.6"/>';
    return s;
  }
  function arm(d, sk, cls, dl, sleeve) {
    var n = d.match(/-?\d+(\.\d+)?/g), hx = n[n.length - 2], hy = n[n.length - 1];
    return '<g class="' + (cls || "") + '" style="animation-delay:' + (dl || 0) + 's"><path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="9.5" stroke-linecap="round"/>' +
      '<path d="' + d + '" fill="none" stroke="' + (sleeve || sk) + '" stroke-width="6" stroke-linecap="round"/><circle cx="' + hx + '" cy="' + hy + '" r="4.6" fill="' + sk + '"' + st(2) + "/></g>";
  }
  function sign(txt, col) {
    var w = txt.length * 7.6 + 18;
    return '<g class="es-sign"><path d="M0 -132 V-150" stroke="' + INK + '" stroke-width="2"/><rect x="' + (-w / 2) + '" y="-172" width="' + w + '" height="24" rx="12" fill="' + (col || G) + '"' + st(2.2) + '/>' +
      '<text x="0" y="-155" text-anchor="middle" fill="#fff" style="font:400 14px var(--fi-fh,\'Lilita One\',sans-serif);letter-spacing:.02em">' + txt + "</text></g>";
  }
  function fig(x, dl, inner, extra) {
    return '<g transform="translate(' + x + ' 300)"><ellipse class="fi-shd" style="--dl:' + dl + 's" cx="0" cy="1" rx="25" ry="4.5" fill="' + INK + '" opacity=".22"/>' +
      '<g class="fi-walk" style="--dl:' + dl + 's">' + inner + "</g>" + (extra || "") + "</g>";
  }
  /* ---------- equipo ECODESA ---------- */
  function sst(x, sk, dl) {
    var board = '<rect x="8" y="-82" width="22" height="28" rx="2" fill="#c9924d"' + st(2) + '/><rect x="11" y="-78" width="16" height="21" fill="#fff"/><path d="M14 -72 h10 M14 -67 h10 M14 -62 h7" stroke="' + L + '" stroke-width="2"/><path d="M14 -73 l2 2 3 -4" fill="none" stroke="' + G + '" stroke-width="1.6"/>';
    return fig(x, dl, legs() + shirt(W, Y) + arm("M-12 -76 Q-21 -60 -18 -46", sk, "fi-swing", dl, W) + board + arm("M12 -78 Q20 -70 18 -62", sk, "", 0, W) + face(sk, -93) + helmet(Y), sign("SG-SST", G));
  }
  function saneamiento(x, sk, dl) {
    var probe = '<g class="fi-armup2" style="animation-delay:' + dl + 's">' + arm("M12 -78 Q26 -86 28 -100", sk, "", 0, W) +
      '<rect x="24" y="-122" width="9" height="20" rx="3" fill="#cfe9ff"' + st(1.8) + '/><rect x="25.5" y="-112" width="6" height="9" fill="' + L + '"/><path d="M28.5 -122 v-6" stroke="' + INK + '" stroke-width="2"/></g>';
    return fig(x, dl, legs() + shirt(W) + arm("M-12 -76 Q-21 -60 -18 -46", sk, "fi-swing", dl, W) + probe + face(sk, -93) + cap(), sign("Saneamiento", L));
  }
  function brigadista(x, sk, dl) {
    var ext = '<rect x="14" y="-74" width="14" height="34" rx="6" fill="' + R + '"' + st(2.2) + '/><rect x="16" y="-64" width="10" height="9" fill="#fff"/><path d="M21 -74 v-6 h8 l4 -4" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';
    return fig(x, dl, legs() + shirt(W, O) + arm("M-12 -76 Q-21 -60 -18 -46", sk, "fi-swing", dl, W) + ext + arm("M12 -78 Q18 -72 20 -76", sk, "", 0, W) + face(sk, -93) + helmet(R), sign("Emergencias", R));
  }
  function recicladora(x, sk, dl) {
    var bins = '<g transform="translate(16 -60)"><rect x="0" y="0" width="12" height="18" rx="2" fill="' + L + '"' + st(1.8) + '/><rect x="13" y="0" width="12" height="18" rx="2" fill="#fff"' + st(1.8) + '/><rect x="26" y="0" width="12" height="18" rx="2" fill="#3a3f45"' + st(1.8) + '/><path d="M3 6 h6 M16 6 h6 M29 6 h6" stroke="' + INK + '" stroke-width="1.4" opacity=".5"/></g>';
    return fig(x, dl, legs("#1f4a6b") + '<path d="M-14 -42 L14 -42 L13 -80 Q0 -86 -13 -80Z" fill="' + L + '"' + st(2.5) + '/><path d="M-6 -80 L0 -72 L6 -80" fill="none" stroke="' + INK + '" stroke-width="2"/>' +
      arm("M-12 -76 Q-21 -60 -18 -46", sk, "fi-swing", dl, L) + bins + arm("M12 -78 Q20 -66 18 -60", sk, "", 0, L) + face(sk, -93, true), sign("Reciclaje", G));
  }
  function digital(x, sk, dl) {
    var lap = '<g transform="translate(-4 -74)"><path d="M0 0 L30 -4 L32 -26 L2 -22Z" fill="#1b1f1c"' + st(2) + '/><path d="M4 -4 L27 -7 L29 -22 L5 -19Z" fill="' + L2 + '"/><path d="M8 -11 h14 M8 -15 h9" stroke="' + G + '" stroke-width="2"/><path d="M-4 2 L34 -3" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/></g>';
    return fig(x, dl, legs() + shirt(W) + lap + arm("M-12 -78 Q-4 -72 2 -76", sk, "", 0, W) + arm("M12 -78 Q22 -74 24 -80", sk, "", 0, W) + face(sk, -93) +
      '<path d="M-14 -100 Q-14 -112 0 -113 Q14 -112 14 -100 Q8 -106 0 -106 Q-8 -106 -14 -100Z" fill="' + INK + '"/><path d="M-11 -94 h9 M2 -94 h9" stroke="' + INK + '" stroke-width="1.6"/><rect x="-11" y="-97" width="8" height="6" rx="2" fill="none" stroke="' + INK + '" stroke-width="1.6"/><rect x="3" y="-97" width="8" height="6" rx="2" fill="none" stroke="' + INK + '" stroke-width="1.6"/>', sign("Web e IA", "#1b6fd8"));
  }
  /* Ethan en su nave */
  function ethan(x) {
    return '<g transform="translate(' + x + ' 300)"><ellipse cx="0" cy="1" rx="34" ry="5" fill="' + INK + '" opacity=".18"/>' +
      '<g class="es-ethan"><path class="es-beam" d="M-20 -40 L20 -40 L36 0 L-36 0Z" fill="' + L2 + '" opacity=".35"/>' +
      '<image href="assets/v2/nave-base.webp" x="-46" y="-78" width="92" height="58"/><image href="assets/v2/robot-anim-256.webp" x="-36" y="-150" width="72" height="72"/></g>' +
      sign("¡Hola, soy Ethan!", L) + "</g>";
  }
  /* carroza ECODESA: camión de reciclaje con árbol que crece y hojas al viento */
  function carroza(x) {
    var wheel = function (cx) { return '<g transform="translate(' + cx + ' -10)"><g class="fi-wheel"><circle r="12" fill="' + INK + '"/><circle r="7" fill="' + L2 + '"/><path d="M-7 0 H7 M0 -7 V7" stroke="' + INK + '" stroke-width="2.2"/></g></g>'; };
    var lv = ""; for (var j = 0; j < 9; j++) lv += '<path class="fi-cc" style="--cx:' + ((j % 2 ? 1 : -1) * (14 + j * 6)) + "px;animation-delay:" + (-j * 0.34).toFixed(2) + 's" d="M0 -190 q6 -8 12 0 q-6 8 -12 0Z" fill="' + [L, G, L2][j % 3] + '"' + st(1.2) + "/>";
    return '<g transform="translate(' + x + ' 300)"><ellipse cx="0" cy="2" rx="104" ry="6" fill="' + INK + '" opacity=".22"/><g class="fi-bump">' +
      /* árbol */
      '<g class="es-tree"><path d="M-30 -42 V-118" stroke="#8a5a2b" stroke-width="8" stroke-linecap="round"/><path d="M-30 -96 l-16 -12 M-30 -108 l14 -10" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="-30" cy="-140" r="30" fill="' + L + '"' + st(2.5) + '/><circle cx="-54" cy="-122" r="18" fill="' + G + '"' + st(2.5) + '/><circle cx="-6" cy="-122" r="18" fill="' + G + '"' + st(2.5) + '/><circle cx="-38" cy="-150" r="5" fill="' + R + '"/><circle cx="-18" cy="-138" r="4" fill="' + R + '"/></g>' +
      /* cabina */
      '<path d="M40 -42 V-92 H72 L92 -64 V-42Z" fill="' + C + '"' + st(3) + '/><path d="M48 -86 H70 L84 -66 H48Z" fill="#bfe3ff"' + st(2) + "/>" +
      /* plataforma con logo */
      '<path d="M-96 -42 H96 L90 -14 H-90Z" fill="' + G + '"' + st(3) + '/><path d="M-92 -26 H92" stroke="' + L2 + '" stroke-width="4"/>' +
      '<g transform="translate(12 -28)"><circle r="16" fill="#fff"' + st(2.2) + '/><circle r="9.5" fill="none" stroke="' + L + '" stroke-width="5" stroke-dasharray="3 2.6"/><path d="M-4 -1 h8 M-4 3 h6" stroke="' + G + '" stroke-width="2.4" stroke-linecap="round"/></g>' +
      /* canecas de separación */
      '<g transform="translate(-86 -74)"><rect width="16" height="30" rx="3" fill="' + L + '"' + st(2) + '/><rect x="18" width="16" height="30" rx="3" fill="#fff"' + st(2) + '/><rect x="36" width="16" height="30" rx="3" fill="#3a3f45"' + st(2) + '/><path d="M4 -4 h8 M22 -4 h8 M40 -4 h8" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/></g>' +
      "</g>" + lv + wheel(-60) + wheel(60) + "</g>";
  }
  /* ---------- cielo ---------- */
  function sky() {
    var s = "", i, rays = "";
    for (i = 0; i < 16; i++) { var a = i * Math.PI / 8, b = a + 0.09, c2 = a - 0.09;
      rays += '<path d="M' + (84 * Math.cos(c2)).toFixed(1) + " " + (84 * Math.sin(c2)).toFixed(1) + " L" + (116 * Math.cos(a)).toFixed(1) + " " + (116 * Math.sin(a)).toFixed(1) + " L" + (84 * Math.cos(b)).toFixed(1) + " " + (84 * Math.sin(b)).toFixed(1) + 'Z"/>'; }
    s += '<g transform="translate(1300 96)"><circle r="134" style="fill:var(--es-sun);opacity:var(--es-halo)"/><g style="opacity:var(--es-rayo)"><g class="fi-rays" style="fill:var(--es-sun)">' + rays + "</g></g>" +
      '<circle r="72" style="fill:var(--es-sun)"/><circle r="72" fill="none" stroke="' + INK + '" stroke-width="3" style="opacity:var(--es-rayo)"/>' +
      '<g style="opacity:var(--es-moon)" fill="#d9e8c6"><circle cx="-24" cy="-16" r="12"/><circle cx="20" cy="22" r="16"/><circle cx="28" cy="-26" r="7"/></g></g>';
    s += '<g style="opacity:var(--es-stars)">' + [[90, 40], [250, 22], [430, 60], [560, 26], [760, 48], [880, 18], [1060, 40], [1480, 30], [1560, 78], [140, 96]].map(function (p, k) {
      return '<g transform="translate(' + p[0] + " " + p[1] + ')"><path class="fi-tw" style="animation-delay:' + (-k * 0.47).toFixed(2) + 's" d="M0 -7 L1.8 -1.8 L7 0 L1.8 1.8 L0 7 L-1.8 1.8 L-7 0 L-1.8 -1.8Z" fill="#eaffd6"/></g>'; }).join("") + "</g>";
    var cloud = function (x, y, k, dur, dl) {
      return '<g transform="translate(' + x + " " + y + ") scale(" + k + ')" style="opacity:var(--es-cloud)"><g class="fi-cloud" style="animation-duration:' + dur + "s;animation-delay:" + dl + 's">' +
        '<path d="M0 0 Q-4 -22 20 -22 Q26 -44 52 -38 Q70 -56 92 -38 Q120 -40 118 -16 Q132 -12 126 0Z" fill="#fbfff2"' + st(2.5) + '/></g></g>'; };
    s += cloud(80, 60, 0.9, 46, -8) + cloud(700, 44, 0.7, 58, -20) + cloud(1460, 120, 0.6, 52, -30);
    var bird = function (y, k, dur, dl) {
      return '<g transform="translate(0 ' + y + ") scale(" + k + ')"><g class="fi-bird" style="animation-duration:' + dur + "s;animation-delay:" + dl + 's"><g class="fi-wing">' +
        '<path d="M-15 0 Q-8 -10 0 0 Q8 -10 15 0" fill="none" stroke="' + INK + '" stroke-width="2.8" stroke-linecap="round"/></g></g></g>'; };
    s += bird(70, 1, 30, -4) + bird(92, 0.75, 30, -5.2) + bird(54, 0.85, 38, -21);
    return s;
  }
  function farCity() {
    var s = "", w = "", x = -10, i = 0;
    while (x < 1610) {
      var bw = 38 + ((i * 53) % 5) * 13, h = 36 + ((i * 71) % 6) * 11, top = 168 - h;
      s += '<rect x="' + x + '" y="' + top + '" width="' + bw + '" height="' + (h + 6) + '"/>';
      for (var r = 0; r < 2; r++) for (var c = 0; c < Math.floor(bw / 18); c++) if ((i + r + c) % 3) w += '<rect x="' + (x + 7 + c * 18) + '" y="' + (top + 10 + r * 16) + '" width="6" height="8" rx="1"/>';
      x += bw + (i % 3 ? 0 : 10); i++;
    }
    return '<g style="fill:var(--es-far)">' + s + '</g><g style="fill:var(--es-farwin)">' + w + "</g>";
  }
  /* aerogenerador, panel solar, planta limpia, grúas del puerto */
  function turbine(x, k) {
    return '<g transform="translate(' + x + ' 172) scale(' + k + ')"><path d="M-3 0 L-1.5 -120 H1.5 L3 0Z" fill="#f4f8ef"' + st(2.2) + '/><g transform="translate(0 -120)"><g class="es-rotor">' +
      [0, 120, 240].map(function (a) { return '<path transform="rotate(' + a + ')" d="M0 0 Q5 -26 0 -56 Q-5 -26 0 0Z" fill="#fbfff2"' + st(2) + "/>"; }).join("") + '<circle r="5" fill="' + L + '"' + st(2) + "/></g></g></g>";
  }
  function crane(x) {
    return '<g transform="translate(' + x + ' 172)"><path d="M-14 0 L-8 -96 M14 0 L8 -96 M-11 -48 H11 M-12 -24 L12 -48 M-12 -48 L12 -24" fill="none" stroke="#e8a316" stroke-width="5"/>' +
      '<path d="M-30 -96 H70 V-88 H-30Z" fill="#e8a316"' + st(2.2) + '/><path d="M50 -88 V-56" stroke="' + INK + '" stroke-width="2"/><rect x="38" y="-56" width="26" height="16" fill="#2f9be0"' + st(2) + '/><rect x="-26" y="-112" width="22" height="16" fill="' + C + '"' + st(2) + "/></g>";
  }
  function plant(x) {
    var leaf = function (dl) { return '<path class="es-puff" style="animation-delay:' + dl + 's" d="M0 0 q8 -10 16 0 q-8 10 -16 0Z" fill="' + L2 + '"' + st(1.4) + "/>"; };
    return '<g transform="translate(' + x + ' 172)"><rect x="-60" y="-56" width="90" height="56" fill="#dfe8d6"' + st(3) + '/><path d="M-60 -56 L-45 -72 L-30 -56 L-15 -72 L0 -56 L15 -72 L30 -56" fill="#c4d4b6"' + st(2.5) + '/>' +
      '<rect x="40" y="-120" width="16" height="120" fill="#c4d4b6"' + st(2.5) + '/><path d="M40 -104 h16 M40 -88 h16" stroke="' + R + '" stroke-width="5"/>' +
      '<g transform="translate(44 -128)">' + leaf(0) + leaf(-1.2) + leaf(-2.4) + "</g>" +
      '<rect x="-48" y="-40" width="18" height="14" fill="var(--es-win)"' + st(2) + '/><rect x="-22" y="-40" width="18" height="14" fill="var(--es-win)"' + st(2) + '/>' +
      '<g transform="translate(-60 -82)"><path d="M0 0 L40 -10 L46 8 L6 18Z" fill="#1f4a6b"' + st(2) + '/><path d="M13 -3 L19 15 M26 -6 L32 12 M3 9 L43 -1" stroke="#7fb8e6" stroke-width="1.6"/><path d="M24 12 V26" stroke="' + INK + '" stroke-width="3"/></g></g>';
  }
  function scene() {
    var s = sky() + farCity();
    var palm = function (x, k) { return '<g transform="translate(' + x + ' 172) scale(' + k + ')"><path d="M0 0 Q-6 -60 6 -118" fill="none" stroke="#8a5a2b" stroke-width="9" stroke-linecap="round"/>' +
      '<g class="fi-palm" fill="' + L + '"' + st(2.5) + '><path d="M6 -118 Q-30 -132 -58 -104 Q-26 -118 6 -112Z"/><path d="M6 -118 Q42 -136 66 -106 Q36 -118 6 -112Z"/><path d="M6 -118 Q-10 -150 -40 -152 Q-12 -140 4 -114Z"/><path d="M6 -118 Q24 -152 54 -150 Q24 -138 8 -114Z"/></g></g>'; };
    s += palm(60, 1) + turbine(170, 0.9) + turbine(232, 0.7);
    /* Torre del Reloj */
    s += '<g transform="translate(400 172)"><rect x="-38" y="-80" width="76" height="80" fill="' + C + '"' + st() + '/><path d="M-14 0 V-30 A14 14 0 0 1 14 -30 V0Z" fill="' + INK + '"/>' +
      '<rect x="-46" y="-92" width="92" height="12" fill="' + L + '"' + st(2.5) + '/><rect x="-28" y="-138" width="56" height="46" fill="' + L2 + '"' + st() + '/><circle cx="0" cy="-115" r="16" fill="#fff"' + st(2.5) + "/>" +
      '<g transform="translate(0 -115)"><path class="fi-hand" d="M0 0 V-11" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/><path class="fi-hand2" d="M0 0 V-7" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round"/><circle r="2.4" fill="' + INK + '"/></g>' +
      '<rect x="-34" y="-146" width="68" height="9" fill="' + L + '"' + st(2.5) + '/><path d="M-26 -146 Q0 -184 26 -146Z" fill="' + G + '"' + st() + '/><path d="M0 -176 V-196" stroke="' + INK + '" stroke-width="2.5"/><path d="M0 -196 L16 -191 L0 -186Z" fill="' + L + '"' + st(1.8) + "/></g>";
    /* restaurante con toldo y hotel */
    s += '<g transform="translate(540 172)"><rect x="0" y="-78" width="110" height="78" fill="#fff3d6"' + st() + '/><rect x="-4" y="-88" width="118" height="12" fill="' + G + '"' + st(2.5) + "/>" +
      [0, 1, 2, 3, 4, 5].map(function (k) { return '<path d="M' + (k * 18 + 2) + " -52 h18 v10 q-9 8 -18 0Z" + '" fill="' + (k % 2 ? "#fff" : L) + '"' + st(2) + "/>"; }).join("") +
      '<rect x="12" y="-74" width="86" height="18" rx="4" fill="' + INK + '"/><text x="55" y="-60" text-anchor="middle" fill="' + L2 + '" style="font:400 13px var(--fi-fh,\'Lilita One\',sans-serif)">RESTAURANTE</text>' +
      '<rect x="14" y="-38" width="24" height="38" fill="var(--es-win)"' + st(2) + '/><rect x="56" y="-36" width="40" height="22" rx="4" fill="var(--es-win)"' + st(2) + "/></g>";
    s += '<g transform="translate(680 172)"><rect x="0" y="-122" width="96" height="122" fill="#7fc8e8"' + st() + '/><rect x="-4" y="-132" width="104" height="12" fill="' + C + '"' + st(2.5) + "/>";
    for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) s += '<rect x="' + (12 + c * 28) + '" y="' + (-110 + r * 26) + '" width="16" height="16" rx="3" fill="var(--es-win)"' + st(1.8) + "/>";
    s += '<text x="48" y="-138" text-anchor="middle" fill="' + INK + '" style="font:400 14px var(--fi-fh,\'Lilita One\',sans-serif)">HOTEL</text></g>';
    /* cúpula y casas */
    s += '<g transform="translate(870 172)"><rect x="-34" y="-58" width="68" height="58" fill="' + C + '"' + st() + '/><path d="M-40 -58 Q0 -126 40 -58Z" fill="' + L + '"' + st() + '/><rect x="-7" y="-122" width="14" height="18" fill="' + C + '"' + st(2.5) + '/><path d="M-9 -122 Q0 -134 9 -122Z" fill="' + L + '"' + st(2.5) + '/><path d="M0 -134 V-146 M-5 -141 H5" stroke="' + INK + '" stroke-width="2.5"/><rect x="-8" y="-44" width="16" height="22" rx="8" fill="var(--es-win)"' + st(2) + "/></g>";
    [[940, 118, "#ff9fc4"], [1036, 104, "#ffd96a"]].forEach(function (h) {
      s += '<rect x="' + h[0] + '" y="' + h[1] + '" width="96" height="' + (172 - h[1]) + '" fill="' + h[2] + '"' + st() + '/><rect x="' + (h[0] - 4) + '" y="' + (h[1] - 9) + '" width="104" height="11" fill="' + G + '"' + st(2.5) + "/>" +
        '<rect x="' + (h[0] + 14) + '" y="' + (h[1] + 14) + '" width="20" height="26" rx="8" fill="var(--es-win)"' + st(2) + '/><rect x="' + (h[0] + 62) + '" y="' + (h[1] + 14) + '" width="20" height="26" rx="8" fill="var(--es-win)"' + st(2) + "/>" +
        '<path d="M' + (h[0] + 6) + " " + (h[1] + 44) + ' h84" stroke="#8a4b16" stroke-width="5"/><circle cx="' + (h[0] + 14) + '" cy="' + (h[1] + 40) + '" r="6" fill="' + L + '"' + st(1.4) + '/><circle cx="' + (h[0] + 24) + '" cy="' + (h[1] + 38) + '" r="5" fill="' + G + '"' + st(1.4) + "/>";
    });
    s += plant(1220) + crane(1390) + crane(1500) + palm(1580, 0.9);
    /* muralla */
    s += '<rect x="-10" y="170" width="1620" height="94" fill="#dba660"' + st() + '/><rect x="-10" y="236" width="1620" height="28" fill="#b98345" opacity=".35"/><path d="M-10 174 H1610" stroke="#f3cf8e" stroke-width="3"/>';
    for (var mx = 0; mx < 1600; mx += 44) s += '<rect x="' + mx + '" y="158" width="26" height="14" fill="#dba660"' + st(2.5) + "/>";
    s += '<path d="M0 196 H1600 M0 222 H1600 M0 246 H1600" stroke="#b37b3a" stroke-width="2.2"/>';
    for (var bx = 0; bx < 1600; bx += 64) s += '<path d="M' + bx + " 170 V196 M" + (bx + 32) + " 196 V222 M" + bx + " 222 V246 M" + (bx + 32) + ' 246 V262" stroke="#b37b3a" stroke-width="2"/>';
    /* enredaderas verdes sobre la muralla */
    [110, 610, 1120].forEach(function (x) {
      var v = '<g transform="translate(' + x + ' 162)">';
      [[-24, 0], [-10, -4], [6, 0], [20, -4], [-18, 12], [0, 14], [16, 16], [-6, 28], [10, 34]].forEach(function (p, k) { v += '<path d="M' + p[0] + " " + p[1] + ' q6 -8 12 0 q-6 8 -12 0Z" fill="' + [L, G, L2][k % 3] + '"' + st(1.4) + "/>"; });
      s += v + "</g>";
    });
    /* faroles con banderines verdes */
    var posts = [120, 520, 920, 1320, 1720];
    posts.forEach(function (px, i) {
      s += '<path d="M' + px + ' 266 V176" stroke="#2d3a2d" stroke-width="6"/><path d="M' + (px - 12) + " 178 h24 l-5 -16 h-14Z" + '" fill="#2d3a2d"/><circle cx="' + px + '" cy="186" r="16" style="fill:var(--es-lampg)"/><circle cx="' + px + '" cy="186" r="7" style="fill:var(--es-lamp)"/>';
      if (i < posts.length - 1) {
        var x0 = px, x1 = posts[i + 1], cx = (x0 + x1) / 2;
        var P = function (t) { var mt = 1 - t; return [mt * mt * x0 + 2 * mt * t * cx + t * t * x1, mt * mt * 182 + 2 * mt * t * 222 + t * t * 182]; };
        s += '<path d="M' + x0 + " 182 Q" + cx + " 222 " + x1 + ' 182" fill="none" stroke="' + INK + '" stroke-width="1.8"/>';
        for (var k = 1; k < 12; k++) { var f = P(k / 12);
          s += '<path class="fi-flag" style="--d:' + (-k * 0.3).toFixed(1) + "s;transform-origin:" + f[0].toFixed(1) + "px " + f[1].toFixed(1) + 'px" d="M' + (f[0] - 9).toFixed(1) + " " + f[1].toFixed(1) + ' h18 l-9 15Z" fill="' + [G, "#fff", L, L2][k % 4] + '" stroke="' + INK + '" stroke-width="1.5"/>'; }
      }
    });
    /* avenida */
    s += '<rect x="-10" y="262" width="1620" height="10" fill="#e8d9c0"' + st(2.5) + '/><rect x="-10" y="272" width="1620" height="44" fill="#5d626e"/><path d="M0 294 H1600" stroke="#fff" stroke-width="4" stroke-dasharray="28 20"/>';
    function parade() {
      return sst(70, SKIN[0], 0) + saneamiento(210, SKIN[3], -0.2) + ethan(370) + brigadista(530, SKIN[1], -0.35) + carroza(720, SKIN[2]) +
        recicladora(910, SKIN[2], -0.1) + digital(1050, SKIN[3], -0.25) + sst(1190, SKIN[1], -0.4) + recicladora(1330, SKIN[0], -0.15) + saneamiento(1470, SKIN[2], -0.3);
    }
    s += '<g class="fi-parade"><g transform="translate(-1600 0)">' + parade() + "</g>" + parade() + "</g>";
    /* mar */
    var wave = function (y, col, w, op, cls) { var dd = "M-120 " + y; for (var i2 = 0; i2 < 30; i2++) dd += " q15 -7 30 0 t30 0"; return '<g class="' + cls + '"><path d="' + dd + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" opacity="' + op + '"/></g>'; };
    s += '<rect x="-10" y="314" width="1620" height="10" fill="#cdbfa7"' + st(2.5) + '/><rect x="-10" y="324" width="1620" height="60" fill="#1eb5cc"/>' +
      wave(336, "#0f8ea3", 2.4, 0.8, "fi-sea3") + wave(343, "#fff", 2.6, 0.85, "fi-sea") + wave(355, "#fff", 2.4, 0.55, "fi-sea2");
    return '<svg viewBox="0 0 1600 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + s + "</svg>";
  }
  window.ecoScene = scene;
})();
