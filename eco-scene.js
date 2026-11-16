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
  /* ---------- equipo ECODESA en visita técnica (de pie, trabajando) ---------- */
  function stand(p) { p = p || "#2f3a3a";
    return '<path d="M-10 -42 L-11 -2 L-2 -2 L-1 -42Z M1 -42 L2 -2 L11 -2 L10 -42Z" fill="' + p + '"' + st(2.5) + '/><ellipse cx="-7" cy="0" rx="7" ry="3.5" fill="' + INK + '"/><ellipse cx="7" cy="0" rx="7" ry="3.5" fill="' + INK + '"/>'; }
  function at(x, y, inner, flip) { return '<g transform="translate(' + x + " " + y + (flip ? ") scale(-1 1)" : ")") + '"><ellipse cx="0" cy="1" rx="24" ry="4" fill="' + INK + '" opacity=".2"/>' + inner + "</g>"; }
  function board(cls) { return '<g class="' + (cls || "") + '"><rect x="8" y="-82" width="22" height="28" rx="2" fill="#c9924d"' + st(2) + '/><rect x="11" y="-78" width="16" height="21" fill="#fff"/><path d="M14 -72 h10 M14 -67 h10 M14 -62 h7" stroke="' + L + '" stroke-width="2"/></g>'; }
  function head(sk, top, fem, nod) { return '<g class="' + (nod ? "es-nod" : "") + '">' + face(sk, -93, fem) + (top || "") + "</g>"; }
  /* profesional que anota en su planilla */
  function writer(x, y, sk, top, vest, flip, dl) {
    return at(x, y, stand() + shirt(W, vest) + board() + arm("M-12 -78 Q4 -70 14 -70", sk, "es-write", dl, W) + arm("M12 -78 Q20 -72 16 -64", sk, "", 0, W) + head(sk, top, false, true), flip);
  }
  /* profesional que señala algo */
  function pointer(x, y, sk, top, vest, flip, dl) {
    return at(x, y, stand() + shirt(W, vest) + arm("M-12 -76 Q-18 -60 -16 -46", sk, "", 0, W) + arm("M12 -78 Q30 -86 44 -98", sk, "es-point", dl, W) + head(sk, top), flip);
  }
  /* profesional agachado revisando (trampa de grasas, kit de derrames) */
  function crouch(x, y, sk, top, flip) {
    return at(x, y, '<path d="M-12 -2 L-16 -30 L4 -34 L8 -2Z" fill="#2f3a3a"' + st(2.5) + '/><ellipse cx="-10" cy="0" rx="8" ry="3.5" fill="' + INK + '"/><ellipse cx="6" cy="0" rx="8" ry="3.5" fill="' + INK + '"/>' +
      '<path d="M-16 -30 L12 -30 L14 -64 Q0 -70 -12 -64Z" fill="' + W + '"' + st(2.5) + '/><circle cx="-4" cy="-52" r="4" fill="' + L + '"' + st(1.4) + "/>" +
      '<g class="es-look"><rect x="20" y="-34" width="12" height="7" rx="2" fill="#ffe27a"' + st(1.6) + '/><path d="M32 -30 l14 6 l0 -12Z" fill="#fff6c8" opacity=".75"/>' + arm("M10 -60 Q22 -46 22 -32", sk, "", 0, W) + "</g>" +
      '<g transform="translate(2 18)">' + face(sk, -93) + (top || "") + "</g>", flip);
  }
  /* cliente o encargado que escucha */
  function client(x, y, sk, col, fem, flip) {
    return at(x, y, stand("#3c3f52") + '<path d="M-14 -42 L14 -42 L13 -80 Q0 -86 -13 -80Z" fill="' + col + '"' + st(2.5) + "/>" + arm("M-12 -76 Q-18 -60 -16 -46", sk, "", 0, col) + arm("M12 -76 Q18 -60 16 -46", sk, "", 0, col) + head(sk, "", fem, true), flip);
  }
  /* Ethan recorre la ciudad y se detiene en cada visita */
  function ethan() {
    return '<g class="es-route"><g class="es-ethan"><path class="es-beam" d="M-16 -2 L16 -2 L30 46 L-30 46Z" fill="' + L2 + '" opacity=".35"/>' +
      '<image href="assets/v2/nave-base.webp" x="-40" y="-40" width="80" height="50"/><image href="assets/v2/robot-anim-256.webp" x="-31" y="-102" width="62" height="62"/></g></g>';
  }
  /* camioneta de servicio ECODESA */
  function van() {
    var wheel = function (cx) { return '<g transform="translate(' + cx + ' -8)"><g class="fi-wheel"><circle r="11" fill="' + INK + '"/><circle r="6" fill="#cfd6cf"/></g></g>'; };
    return '<g class="es-van"><g class="fi-bump"><path d="M-70 -14 V-58 Q-70 -64 -64 -64 H30 L58 -40 L66 -36 V-14Z" fill="#fff"' + st(3) + '/><path d="M34 -60 L54 -40 H34Z" fill="#bfe3ff"' + st(2) + '/>' +
      '<path d="M-70 -30 H66" stroke="' + L + '" stroke-width="6"/><g transform="translate(-22 -44)"><circle r="12" fill="#fff"' + st(2) + '/><circle r="7" fill="none" stroke="' + L + '" stroke-width="4" stroke-dasharray="2.6 2.2"/></g>' +
      '<text x="6" y="-40" fill="' + G + '" style="font:400 14px var(--fi-fh,\'Lilita One\',sans-serif)">ecodesa</text><circle cx="62" cy="-24" r="3" fill="#ffd21f"/></g>' + wheel(-44) + wheel(40) + "</g>";
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
  function label(x, y, txt) { var w = txt.length * 8 + 20; return '<g transform="translate(' + x + " " + y + ')"><rect x="' + (-w / 2) + '" y="-14" width="' + w + '" height="24" rx="6" fill="' + INK + '"/><text x="0" y="3" text-anchor="middle" fill="' + L2 + '" style="font:400 14px var(--fi-fh,\'Lilita One\',sans-serif);letter-spacing:.04em">' + txt + "</text></g>"; }
  function win(x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="var(--es-win)"' + st(2) + "/>"; }
  function scene() {
    var s = sky() + farCity(), B = 262;
    var palm = function (x, k) { return '<g transform="translate(' + x + " " + B + ") scale(" + k + ')"><path d="M0 0 Q-6 -60 6 -118" fill="none" stroke="#8a5a2b" stroke-width="9" stroke-linecap="round"/>' +
      '<g class="fi-palm" fill="' + L + '"' + st(2.5) + '><path d="M6 -118 Q-30 -132 -58 -104 Q-26 -118 6 -112Z"/><path d="M6 -118 Q42 -136 66 -106 Q36 -118 6 -112Z"/><path d="M6 -118 Q-10 -150 -40 -152 Q-12 -140 4 -114Z"/><path d="M6 -118 Q24 -152 54 -150 Q24 -138 8 -114Z"/></g></g>'; };
    s += turbine(40, 0.8) + turbine(96, 0.6);
    /* 1. Restaurante: trampa de grasas */
    s += '<g transform="translate(40 0)"><rect x="0" y="' + (B - 130) + '" width="210" height="130" fill="#fff3d6"' + st() + '/><rect x="-6" y="' + (B - 142) + '" width="222" height="14" fill="' + G + '"' + st(2.5) + "/>" +
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (k) { return '<path d="M' + (k * 21) + " " + (B - 92) + ' h21 v12 q-10.5 9 -21 0Z" fill="' + (k % 2 ? "#fff" : L) + '"' + st(2) + "/>"; }).join("") +
      win(14, B - 70, 60, 40) + win(140, B - 70, 56, 40) + '<rect x="86" y="' + (B - 76) + '" width="40" height="76" fill="#8a5a2b"' + st(2.5) + "/>" +
      '<rect x="150" y="' + (B - 16) + '" width="36" height="16" rx="2" fill="#9aa3a8"' + st(2.2) + '/><path d="M156 ' + (B - 10) + ' h24" stroke="' + INK + '" stroke-width="2"/>' + label(105, B - 116, "RESTAURANTE") + "</g>";
    s += crouch(250, B, SKIN[3], cap()) + client(118, B, SKIN[0], "#ffffff", false);
    /* 2. Hotel: extintor y ruta de evacuación */
    s += '<g transform="translate(310 0)"><rect x="0" y="' + (B - 200) + '" width="150" height="200" fill="#7fc8e8"' + st() + '/><rect x="-6" y="' + (B - 212) + '" width="162" height="14" fill="' + C + '"' + st(2.5) + "/>";
    for (var r = 0; r < 5; r++) for (var c = 0; c < 4; c++) s += win(14 + c * 34, B - 186 + r * 28, 20, 18);
    s += '<rect x="52" y="' + (B - 50) + '" width="46" height="50" fill="#bfe3ff"' + st(2.5) + '/><path d="M75 ' + (B - 50) + " V" + B + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<rect x="112" y="' + (B - 52) + '" width="12" height="28" rx="5" fill="' + R + '"' + st(2) + '/><rect x="106" y="' + (B - 72) + '" width="26" height="14" rx="2" fill="#14964a"' + st(1.6) + '/><path d="M112 ' + (B - 65) + ' h10 l-4 -4 M122 ' + (B - 65) + ' l-4 4" stroke="#fff" stroke-width="2" fill="none"/>' + label(75, B - 222, "HOTEL") + "</g>";
    s += pointer(400, B, SKIN[1], helmet(R), O, false, -0.6) + client(350, B, SKIN[2], "#1f4a6b", true);
    /* 3. Comercio */
    s += '<g transform="translate(500 0)"><rect x="0" y="' + (B - 120) + '" width="140" height="120" fill="#ff9fc4"' + st() + '/><rect x="-6" y="' + (B - 132) + '" width="152" height="14" fill="' + G + '"' + st(2.5) + "/>" +
      win(12, B - 100, 116, 46) + '<rect x="50" y="' + (B - 48) + '" width="40" height="48" fill="#bfe3ff"' + st(2.5) + "/>" +
      '<g transform="translate(24 ' + (B - 84) + ')"><rect width="16" height="22" fill="' + L + '"' + st(1.6) + '/><rect x="22" y="6" width="16" height="16" fill="' + Y + '"' + st(1.6) + '/><rect x="70" width="20" height="22" fill="' + O + '"' + st(1.6) + "/></g>" + label(70, B - 146, "COMERCIO") + "</g>";
    s += writer(668, B, SKIN[0], cap(), null, true, -0.2);
    /* 4. Industria */
    s += '<g transform="translate(720 0)"><rect x="0" y="' + (B - 110) + '" width="190" height="110" fill="#dfe8d6"' + st() + '/><path d="M0 ' + (B - 110) + " L25 " + (B - 134) + " L50 " + (B - 110) + " L75 " + (B - 134) + " L100 " + (B - 110) + " L125 " + (B - 134) + " L150 " + (B - 110) + '" fill="#c4d4b6"' + st(2.5) + "/>" +
      '<rect x="160" y="' + (B - 196) + '" width="20" height="196" fill="#c4d4b6"' + st(2.5) + '/><path d="M160 ' + (B - 176) + " h20 M160 " + (B - 156) + ' h20" stroke="' + R + '" stroke-width="6"/>' +
      '<g transform="translate(164 ' + (B - 204) + ')">' + '<path class="es-puff" d="M0 0 q8 -10 16 0 q-8 10 -16 0Z" fill="' + L2 + '"' + st(1.4) + '/><path class="es-puff" style="animation-delay:-1.2s" d="M0 0 q8 -10 16 0 q-8 10 -16 0Z" fill="' + L2 + '"' + st(1.4) + '/><path class="es-puff" style="animation-delay:-2.4s" d="M0 0 q8 -10 16 0 q-8 10 -16 0Z" fill="' + L2 + '"' + st(1.4) + "/></g>" +
      '<g transform="translate(14 ' + (B - 64) + ')"><rect width="40" height="64" rx="18" fill="#cfd6cf"' + st(2.5) + '/><rect x="48" y="8" width="40" height="56" rx="18" fill="#cfd6cf"' + st(2.5) + '/><path d="M0 24 h40 M48 30 h40" stroke="' + INK + '" stroke-width="2" opacity=".4"/></g>' +
      win(104, B - 90, 44, 26) + '<g transform="translate(14 ' + (B - 150) + ')"><path d="M0 0 L48 -12 L55 8 L7 20Z" fill="#1f4a6b"' + st(2) + '/><path d="M16 -4 L22 16 M32 -8 L38 12" stroke="#7fb8e6" stroke-width="1.6"/></g>' + label(95, B - 160, "INDUSTRIA") + "</g>";
    s += writer(888, B, SKIN[2], helmet(Y), Y, false, -0.9);
    /* 5. Construcción */
    s += '<g transform="translate(960 0)"><path d="M0 ' + B + " V" + (B - 150) + " H150 V" + B + '" fill="none" stroke="#8d939a" stroke-width="7"/><path d="M0 ' + (B - 50) + " H150 M0 " + (B - 100) + " H150 M50 " + B + " V" + (B - 150) + " M100 " + B + " V" + (B - 150) + '" stroke="#8d939a" stroke-width="5"/>' +
      '<path d="M0 ' + (B - 50) + " L50 " + (B - 100) + " M100 " + (B - 50) + " L150 " + (B - 100) + '" stroke="#b7bcc1" stroke-width="3"/><rect x="-6" y="' + (B - 54) + '" width="162" height="6" fill="' + O + '"' + st(1.6) + "/>" +
      '<g transform="translate(190 ' + B + ')"><path d="M-8 0 L-4 -230 M8 0 L4 -230" stroke="#e8a316" stroke-width="5"/><path d="M-120 -230 H70 V-222 H-120Z" fill="#e8a316"' + st(2.2) + '/><path d="M-90 -222 V-160" stroke="' + INK + '" stroke-width="2"/><rect x="-104" y="-160" width="28" height="12" fill="#8d939a"' + st(1.6) + "/></g>" + label(75, B - 168, "CONSTRUCCIÓN") + "</g>";
    s += pointer(1100, B, SKIN[3], helmet(Y), Y, true, -0.3) + client(1036, B, SKIN[1], O, false);
    /* 6. Puerto */
    var cont = function (x, y, col) { return '<rect x="' + x + '" y="' + y + '" width="62" height="28" fill="' + col + '"' + st(2.2) + '/><path d="M' + (x + 10) + " " + (y + 4) + " v20 M" + (x + 22) + " " + (y + 4) + " v20 M" + (x + 34) + " " + (y + 4) + " v20 M" + (x + 46) + " " + (y + 4) + ' v20" stroke="' + INK + '" stroke-width="1.5" opacity=".4"/>'; };
    s += '<g transform="translate(1190 0)">' + cont(0, B - 28, "#2f9be0") + cont(64, B - 28, R) + cont(128, B - 28, L) + cont(32, B - 56, O) + cont(96, B - 56, "#2f9be0") + cont(64, B - 84, Y) +
      '<g transform="translate(250 ' + B + ')"><path d="M-14 0 L-8 -170 M14 0 L8 -170 M-11 -60 H11 M-12 -110 H12" fill="none" stroke="#e8a316" stroke-width="6"/><path d="M-130 -170 H80 V-160 H-130Z" fill="#e8a316"' + st(2.2) + '/><rect x="-26" y="-190" width="26" height="20" fill="' + C + '"' + st(2) + '/><path d="M-100 -160 V-110" stroke="' + INK + '" stroke-width="2"/><rect x="-118" y="-110" width="36" height="16" fill="' + L + '"' + st(2) + "/></g>" +
      '<rect x="206" y="' + (B - 26) + '" width="26" height="26" rx="3" fill="' + Y + '"' + st(2) + '/><path d="M210 ' + (B - 18) + ' h18" stroke="' + INK + '" stroke-width="2"/>' + label(96, B - 104, "PUERTO") + "</g>";
    s += crouch(1450, B, SKIN[0], helmet("#fff"), true) + palm(1570, 0.9);
    /* acera, vía y mar */
    s += '<rect x="-10" y="' + B + '" width="1620" height="10" fill="#e8d9c0"' + st(2.5) + '/><rect x="-10" y="' + (B + 10) + '" width="1620" height="44" fill="#5d626e"/><path d="M0 ' + (B + 32) + ' H1600" stroke="#fff" stroke-width="4" stroke-dasharray="28 20"/>';
    s += '<g transform="translate(0 ' + (B + 44) + ')">' + van() + "</g>";
    var wave = function (y, col, w, op, cls) { var dd = "M-120 " + y; for (var i2 = 0; i2 < 30; i2++) dd += " q15 -7 30 0 t30 0"; return '<g class="' + cls + '"><path d="' + dd + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" opacity="' + op + '"/></g>'; };
    s += '<rect x="-10" y="314" width="1620" height="10" fill="#cdbfa7"' + st(2.5) + '/><rect x="-10" y="324" width="1620" height="60" fill="#1eb5cc"/>' +
      wave(336, "#0f8ea3", 2.4, 0.8, "fi-sea3") + wave(343, "#fff", 2.6, 0.85, "fi-sea") + wave(355, "#fff", 2.4, 0.55, "fi-sea2");
    s += ethan();
    return '<svg viewBox="0 0 1600 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + s + "</svg>";
  }
  window.ecoScene = scene;
})();
