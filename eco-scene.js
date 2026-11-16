/* Escena empresarial ECODESA: "Cartagena que cumple". Mismo lenguaje visual del Bando de Fiestas:
   profesionales de ECODESA en visitas técnicas por sector y Ethan supervisando desde su nave. Decoración aria-hidden. */
(function () {
  var INK = "#13240f", Y = "#ffd21f", R = "#e3262b", G = "#2E6B1F", L = "#76b82a", L2 = "#b6e36a", O = "#ff7a1a", C = "#fbfff2", W = "#ffffff";
  var PEOPLE = "", PK = .6, VW = 3000, VH = 560, B = 470;
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
  function at(x, y, inner, flip) { return '<g transform="translate(' + x + " " + y + ") scale(" + (flip ? -PK : PK) + " " + PK + ')"><ellipse cx="0" cy="1" rx="24" ry="4" fill="' + INK + '" opacity=".2"/>' + inner + "</g>"; }
  function board(cls) { return '<g class="' + (cls || "") + '"><rect x="8" y="-82" width="22" height="28" rx="2" fill="#c9924d"' + st(2) + '/><rect x="11" y="-78" width="16" height="21" fill="#fff"/><path d="M14 -72 h10 M14 -67 h10 M14 -62 h7" stroke="' + L + '" stroke-width="2"/></g>'; }
  function head(sk, top, fem, nod) { return '<g class="' + (nod ? "es-nod" : "") + '">' + face(sk, -93, fem) + (top || "") + "</g>"; }
  /* profesional que anota en su planilla */
  function writer(x, y, sk, top, vest, flip, dl) {
    return at(x, y, stand() + shirt(W, vest) + board() + arm("M-12 -78 Q4 -70 14 -70", sk, "es-write", dl, W) + arm("M12 -78 Q20 -72 16 -64", sk, "", 0, W) + head(sk, top, false, true), flip);
  }
  /* profesional que señala algo */
  function pointer(x, y, sk, top, vest, flip, dl) {
    return at(x, y, stand() + shirt(W, vest) + arm("M-12 -76 Q-18 -60 -16 -46", sk, "", 0, W) + arm("M12 -78 Q28 -78 42 -82", sk, "es-point", dl, W) + head(sk, top), flip);
  }
  /* profesional agachado revisando (trampa de grasas, kit de derrames) */
  function crouch(x, y, sk, top, flip) {
    var limb = function (d, col, w) { return '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="' + (w + 3.5) + '" stroke-linecap="round" stroke-linejoin="round"/><path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>'; };
    return at(x, y, '<ellipse cx="-12" cy="0" rx="8" ry="3.5" fill="' + INK + '"/><ellipse cx="12" cy="0" rx="8" ry="3.5" fill="' + INK + '"/>' +
      limb("M-12 -3 L-4 -28 L-20 -34", "#2f3a3a", 11) + limb("M12 -3 L16 -30 L-6 -34", "#3a4646", 11) +
      '<path d="M-24 -34 L4 -34 L10 -66 Q-4 -72 -16 -64Z" fill="' + W + '"' + st(2.5) + '/><circle cx="-4" cy="-54" r="4" fill="' + L + '"' + st(1.4) + "/>" +
      '<g class="es-look">' + arm("M6 -62 Q22 -50 26 -36", sk, "", 0, W) + '<rect x="24" y="-40" width="13" height="7" rx="2" fill="#ffe27a"' + st(1.6) + '/><path d="M37 -37 l16 8 l0 -14Z" fill="#fff6c8" opacity=".8"/></g>' +
      arm("M-14 -60 Q-20 -46 -10 -36", sk, "", 0, W) +
      '<g transform="translate(4 16)">' + face(sk, -93) + (top || "") + "</g>", flip);
  }
  /* cliente o encargado que escucha */
  function client(x, y, sk, col, fem, flip) {
    return at(x, y, stand("#3c3f52") + '<path d="M-14 -42 L14 -42 L13 -80 Q0 -86 -13 -80Z" fill="' + col + '"' + st(2.5) + "/>" + arm("M-12 -76 Q-18 -60 -16 -46", sk, "", 0, col) + arm("M12 -76 Q18 -60 16 -46", sk, "", 0, col) + head(sk, "", fem, true), flip);
  }
  /* Ethan flota sobre la avenida en su nave: propulsores, saltos entre visitas y gestos en cada parada */
  var EY = B + 16;
  function ethan() {
    var fl = [[-27.5, 1], [-19, 3.5], [-9.6, 5.5]].map(function (p, i) {
      return '<g transform="translate(' + p[0] + " " + p[1] + ') rotate(14)"><g class="es-boost"><g class="es-flame" style="animation-delay:' + (-i * 0.09).toFixed(2) + 's">' +
        '<path d="M-4.4 0 Q-5.6 11 0 24 Q5.6 11 4.4 0Z" fill="#7dffa8" opacity=".7"/><path d="M-2.4 0 Q-2.8 7 0 15 Q2.8 7 2.4 0Z" fill="#fff"/></g></g></g>';
    }).join("");
    var imgs = GEST.map(function (n, i) { return '<image class="es-gest" href="assets/v2/' + n + '.webp" x="-31" y="-102" width="62" height="62" opacity="' + (i ? 0 : 1) + '"/>'; }).join("");
    var rings = [0, 1, 2].map(function (i) { return '<ellipse class="es-ring" style="animation-delay:' + (-i * 0.5) + 's" cx="0" cy="16" rx="26" ry="6" fill="none" stroke="' + L2 + '" stroke-width="2.5"/>'; }).join("");
    return '<g id="esShd" transform="translate(' + STOPS[0] + " " + (B + 44) + ')"><ellipse rx="40" ry="6" fill="' + INK + '" opacity=".28"/></g>' +
      '<g id="esEthan" class="es-route" transform="translate(' + STOPS[0] + " " + EY + ')"><g transform="scale(1.05)"><g class="es-ethan"><g id="esScan" opacity="0">' + rings + "</g>" + fl +
      '<image href="assets/v2/nave-base.webp" x="-40" y="-40" width="80" height="50"/>' + imgs +
      '<g transform="translate(36 -98)"><g id="esOk" opacity="0"><circle r="14" fill="' + L + '"' + st(2.4) + '/><path d="M-7 0 l5 5 9 -10" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g></g></g></g></g>';
  }
  function label(x, y, txt) { var w = txt.length * 10 + 26; return '<g transform="translate(' + x + " " + y + ')"><rect x="' + (-w / 2) + '" y="-17" width="' + w + '" height="30" rx="8" fill="' + INK + '" stroke="' + L2 + '" stroke-width="2"/><text x="0" y="5" text-anchor="middle" fill="' + L2 + '" style="font:400 18px var(--fi-fh,\'Lilita One\',sans-serif);letter-spacing:.04em">' + txt + "</text></g>"; }
  var wn = 0;
  function win(x, y, w, h, live) { wn++; return '<rect class="' + (live ? "es-lit" : "") + '" style="animation-delay:' + (-(wn * 1.37) % 9).toFixed(2) + 's" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="var(--es-win)"' + st(2) + "/>"; }
  function puff(x, y, col, n, cls) { var s = '<g transform="translate(' + x + " " + y + ')">'; for (var i = 0; i < n; i++) s += '<circle class="' + (cls || "es-steam") + '" style="animation-delay:' + (-i * 1.1).toFixed(1) + 's" r="9" fill="' + col + '"' + st(1.4) + "/>"; return s + "</g>"; }
  function sky() {
    var s = "", i, rays = "";
    for (i = 0; i < 16; i++) { var a = i * Math.PI / 8, b = a + 0.09, c2 = a - 0.09;
      rays += '<path d="M' + (84 * Math.cos(c2)).toFixed(1) + " " + (84 * Math.sin(c2)).toFixed(1) + " L" + (116 * Math.cos(a)).toFixed(1) + " " + (116 * Math.sin(a)).toFixed(1) + " L" + (84 * Math.cos(b)).toFixed(1) + " " + (84 * Math.sin(b)).toFixed(1) + 'Z"/>'; }
    s += '<g transform="translate(860 110)"><circle r="134" style="fill:var(--es-sun);opacity:var(--es-halo)"/><g style="opacity:var(--es-rayo)"><g class="fi-rays" style="fill:var(--es-sun)">' + rays + "</g></g>" +
      '<circle r="72" style="fill:var(--es-sun)"/><circle r="72" fill="none" stroke="' + INK + '" stroke-width="3" style="opacity:var(--es-rayo)"/><g style="opacity:var(--es-moon)" fill="#d9e8c6"><circle cx="-24" cy="-16" r="12"/><circle cx="20" cy="22" r="16"/></g></g>';
    var stars = ""; for (i = 0; i < 26; i++) stars += '<g transform="translate(' + ((i * 397) % 2800) + " " + (20 + (i * 53) % 170) + ')"><path class="fi-tw" style="animation-delay:' + (-i * 0.47).toFixed(2) + 's" d="M0 -7 L1.8 -1.8 L7 0 L1.8 1.8 L0 7 L-1.8 1.8 L-7 0 L-1.8 -1.8Z" fill="#eaffd6"/></g>';
    s += '<g style="opacity:var(--es-stars)">' + stars + "</g>";
    var cloud = function (x, y, k, dur, dl) { return '<g transform="translate(' + x + " " + y + ") scale(" + k + ')" style="opacity:var(--es-cloud)"><g class="fi-cloud" style="animation-duration:' + dur + "s;animation-delay:" + dl + 's"><path d="M0 0 Q-4 -22 20 -22 Q26 -44 52 -38 Q70 -56 92 -38 Q120 -40 118 -16 Q132 -12 126 0Z" fill="#fbfff2"' + st(2.5) + "/></g></g>"; };
    s += cloud(200, 70, 0.9, 46, -8) + cloud(1500, 60, 0.8, 58, -20) + cloud(2250, 110, 0.7, 52, -30) + cloud(640, 150, 0.5, 40, -12);
    var bird = function (y, k, dur, dl) { return '<g transform="translate(0 ' + y + ") scale(" + k + ')"><g class="es-bird" style="animation-duration:' + dur + "s;animation-delay:" + dl + 's"><g class="fi-wing"><path d="M-15 0 Q-8 -10 0 0 Q8 -10 15 0" fill="none" stroke="' + INK + '" stroke-width="2.8" stroke-linecap="round"/></g></g></g>'; };
    s += bird(80, 1, 40, -4) + bird(100, 0.75, 40, -5.2) + bird(60, 0.85, 52, -21) + bird(130, 0.7, 46, -33);
    return s;
  }
  function farCity() {
    var s = "", x = -10, i = 0;
    while (x < VW + 10) { var bw = 50 + ((i * 53) % 5) * 16, hh = 60 + ((i * 71) % 6) * 22, top = B - 60 - hh; s += '<rect x="' + x + '" y="' + top + '" width="' + bw + '" height="' + (hh + 60) + '"/>'; x += bw + (i % 3 ? 0 : 14); i++; }
    return '<g style="fill:var(--es-far)">' + s + "</g>";
  }
  function turbine(x, y, k) {
    return '<g transform="translate(' + x + " " + y + ") scale(" + k + ')"><path d="M-3 0 L-1.5 -120 H1.5 L3 0Z" fill="#f4f8ef"' + st(2.2) + '/><g transform="translate(0 -120)"><g class="es-rotor">' +
      [0, 120, 240].map(function (a) { return '<path transform="rotate(' + a + ')" d="M0 0 Q5 -26 0 -56 Q-5 -26 0 0Z" fill="#fbfff2"' + st(2) + "/>"; }).join("") + '<circle r="5" fill="' + L + '"' + st(2) + "/></g></g></g>";
  }
  function palm(x, k) { return '<g transform="translate(' + x + " " + B + ") scale(" + k + ')"><path d="M0 0 Q-6 -60 6 -118" fill="none" stroke="#8a5a2b" stroke-width="9" stroke-linecap="round"/>' +
    '<g class="fi-palm" fill="' + L + '"' + st(2.5) + '><path d="M6 -118 Q-30 -132 -58 -104 Q-26 -118 6 -112Z"/><path d="M6 -118 Q42 -136 66 -106 Q36 -118 6 -112Z"/><path d="M6 -118 Q-10 -150 -40 -152 Q-12 -140 4 -114Z"/><path d="M6 -118 Q24 -152 54 -150 Q24 -138 8 -114Z"/></g></g>'; }

  /* ===== escala real: 1 m = 36 unidades; persona 1,75 m ===== */
  function restaurante(x) { /* 12 m de frente, 1 piso de 4 m */
    var w = 432, h = 150, s = '<g transform="translate(' + x + ' 0)"><rect x="0" y="' + (B - h) + '" width="' + w + '" height="' + h + '" fill="#fff3d6"' + st() + '/><rect x="-8" y="' + (B - h - 16) + '" width="' + (w + 16) + '" height="18" fill="' + G + '"' + st(2.5) + "/>";
    s += '<rect x="300" y="' + (B - h - 90) + '" width="26" height="76" fill="#9aa3a8"' + st(2.2) + "/>" + puff(313, B - h - 96, "#f4f4f4", 4);
    s += '<g class="es-awning">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (k) { return '<path d="M' + (k * 36) + " " + (B - 112) + ' h36 v16 q-18 12 -36 0Z" fill="' + (k % 2 ? "#fff" : L) + '"' + st(2) + "/>"; }).join("") + "</g>";
    s += win(20, B - 84, 110, 64, 1) + win(300, B - 84, 112, 64, 1) + '<rect x="170" y="' + (B - 96) + '" width="76" height="96" fill="#8a5a2b"' + st(2.5) + '/><circle cx="234" cy="' + (B - 48) + '" r="4" fill="' + Y + '"/>';
    s += '<g transform="translate(150 ' + (B - h + 26) + ')"><rect x="0" y="-16" width="120" height="30" rx="6" fill="' + INK + '"/><text class="es-neon" x="60" y="6" text-anchor="middle" fill="' + L2 + '" style="font:400 18px var(--fi-fh,\'Lilita One\',sans-serif)">ABIERTO</text></g>';
    s += '<g transform="translate(40 ' + (B - 30) + ')"><circle cx="20" cy="-20" r="6" fill="#ff6b6b"/><path d="M5 -10 h30" stroke="' + INK + '" stroke-width="2"/></g>';
    s += '<rect x="358" y="' + (B - 22) + '" width="54" height="22" rx="2" fill="#9aa3a8"' + st(2.2) + '/><path d="M364 ' + (B - 14) + ' h42" stroke="' + INK + '" stroke-width="2"/>' + label(216, B - h - 40, "RESTAURANTE") + "</g>";
    PEOPLE += crouch(x + 340, B + 9, SKIN[3], cap()) + client(x + 280, B + 9, SKIN[0], "#ffffff", false, true);
    return s;
  }
  function comercio(x) { /* 8 m, 2 pisos */
    var w = 288, h = 252, s = '<g transform="translate(' + x + ' 0)"><rect x="0" y="' + (B - h) + '" width="' + w + '" height="' + h + '" fill="#ff9fc4"' + st() + '/><rect x="-8" y="' + (B - h - 14) + '" width="' + (w + 16) + '" height="16" fill="' + G + '"' + st(2.5) + "/>";
    s += win(30, B - h + 24, 60, 76, 1) + win(114, B - h + 24, 60, 76, 1) + win(198, B - h + 24, 60, 76, 1) + '<path d="M16 ' + (B - h + 112) + " h256" + '" stroke="#8a4b16" stroke-width="7"/>';
    [40, 124, 208].forEach(function (px, k) { s += '<g class="es-plant" style="animation-delay:' + (-k) + 's"><circle cx="' + (px + 10) + '" cy="' + (B - h + 104) + '" r="9" fill="' + L + '"' + st(1.4) + '/><circle cx="' + (px + 24) + '" cy="' + (B - h + 100) + '" r="8" fill="#ff4fa0"' + st(1.4) + "/></g>"; });
    s += '<g class="es-awning2"><path d="M10 ' + (B - 120) + " h268 l-14 30 h-240Z" + '" fill="' + Y + '"' + st(2.5) + "/></g>" + win(20, B - 84, 150, 70, 1) + '<rect x="190" y="' + (B - 96) + '" width="74" height="96" fill="#bfe3ff"' + st(2.5) + "/>";
    s += '<g transform="translate(40 ' + (B - 66) + ')"><rect width="22" height="32" fill="' + L + '"' + st(1.6) + '/><rect x="30" y="8" width="22" height="24" fill="' + O + '"' + st(1.6) + '/><rect x="62" y="2" width="22" height="30" fill="#2f9be0"' + st(1.6) + "/></g>";
    s += '<g transform="translate(227 ' + (B - 110) + ')"><rect x="-30" y="-12" width="60" height="22" rx="4" fill="' + R + '"' + st(1.8) + '/><text class="es-neon" x="0" y="5" text-anchor="middle" fill="#fff" style="font:400 13px var(--fi-fh,\'Lilita One\',sans-serif)">OPEN</text></g>' + label(144, B - h - 40, "COMERCIO") + "</g>";
    PEOPLE += writer(x + 300, B + 9, SKIN[0], cap(), null, true, -0.2);
    return s;
  }
  function hotel(x) { /* 10 m, 4 pisos + vestíbulo */
    var w = 360, h = 450, s = '<g transform="translate(' + x + ' 0)"><rect x="0" y="' + (B - h) + '" width="' + w + '" height="' + h + '" fill="#7fc8e8"' + st() + '/><rect x="-10" y="' + (B - h - 16) + '" width="' + (w + 20) + '" height="18" fill="' + C + '"' + st(2.5) + "/>";
    s += '<g transform="translate(330 ' + (B - h - 16) + ')"><path d="M0 0 V-60" stroke="' + INK + '" stroke-width="3"/><path class="es-flag" d="M0 -60 h34 v20 h-34Z" fill="' + L + '"' + st(2) + "/></g>";
    s += '<g transform="translate(180 ' + (B - h + 2) + ')"><rect x="-70" y="-18" width="140" height="34" rx="6" fill="' + INK + '"/><text class="es-neon" x="0" y="8" text-anchor="middle" fill="#ffd21f" style="font:400 24px var(--fi-fh,\'Lilita One\',sans-serif);letter-spacing:.12em">HOTEL</text></g>';
    for (var r = 0; r < 4; r++) { for (var c = 0; c < 5; c++) s += win(22 + c * 66, B - h + 20 + r * 92, 46, 56, 1); s += '<path d="M14 ' + (B - h + 86 + r * 92) + " h332" + '" stroke="#fff" stroke-width="5"/>'; }
    s += '<rect x="0" y="' + (B - 74) + '" width="' + w + '" height="74" fill="' + C + '"' + st(2.5) + '/><rect x="130" y="' + (B - 72) + '" width="100" height="72" fill="#bfe3ff"' + st(2.5) + '/><g class="es-door"><path d="M180 ' + (B - 72) + " V" + B + '" stroke="' + INK + '" stroke-width="2.4"/></g>' +
      '<path d="M110 ' + (B - 84) + " h140 l-10 14 h-120Z" + '" fill="' + G + '"' + st(2) + "/>";
    s += '<rect x="290" y="' + (B - 52) + '" width="14" height="32" rx="5" fill="' + R + '"' + st(2) + '/><rect x="284" y="' + (B - 72) + '" width="28" height="14" rx="2" fill="#14964a"' + st(1.6) + '/><path d="M290 ' + (B - 65) + ' h14 l-4 -4 M304 ' + (B - 65) + ' l-4 4" stroke="#fff" stroke-width="2" fill="none"/>';
    s += '<g transform="translate(40 ' + B + ')"><rect x="-10" y="-30" width="24" height="30" fill="#c9924d"' + st(2) + '/><g class="es-plant"><circle cx="2" cy="-40" r="14" fill="' + L + '"' + st(2) + "/></g></g>" + "</g>";
    PEOPLE += pointer(x + 262, B + 9, SKIN[1], helmet(R), O, false, -0.6) + client(x + 214, B + 9, SKIN[2], "#1f4a6b", true);
    return s;
  }
  function industria(x) { /* nave de 14 m x 9 m, chimenea de 13 m */
    var w = 504, h = 324, s = '<g transform="translate(' + x + ' 0)"><rect x="0" y="' + (B - h) + '" width="' + w + '" height="' + h + '" fill="#dfe8d6"' + st() + '/>';
    s += '<path d="M0 ' + (B - h) + [0, 1, 2, 3, 4, 5].map(function (k) { return " L" + (k * 84 + 42) + " " + (B - h - 40) + " L" + (k * 84 + 84) + " " + (B - h); }).join("") + '" fill="#c4d4b6"' + st(2.5) + "/>";
    s += '<rect x="440" y="' + (B - 460) + '" width="40" height="460" fill="#c4d4b6"' + st(2.5) + '/><path d="M440 ' + (B - 420) + " h40 M440 " + (B - 380) + ' h40" stroke="' + R + '" stroke-width="10"/><circle class="es-beacon" cx="460" cy="' + (B - 466) + '" r="7" fill="' + R + '"/>' + puff(460, B - 474, L2, 4, "es-leafp");
    for (var k = 0; k < 5; k++) s += '<g transform="translate(' + (30 + k * 80) + " " + (B - h - 6) + ')"><path d="M0 0 L60 -14 L66 4 L6 18Z" fill="#1f4a6b"' + st(2) + '/><path class="es-glint" style="animation-delay:' + (-k * 0.6) + 's" d="M18 -2 L26 14" stroke="#cfe9ff" stroke-width="3"/></g>';
    [60, 160, 260].forEach(function (fx, k) { s += '<g transform="translate(' + fx + " " + (B - h + 60) + ')"><circle r="24" fill="#9aa3a8"' + st(2.2) + '/><g class="es-fan" style="animation-duration:' + (1 + k * 0.4) + 's"><path d="M0 0 L0 -18 M0 0 L16 9 M0 0 L-16 9" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/></g></g>'; });
    s += '<g transform="translate(20 ' + (B - 150) + ')"><rect width="72" height="150" rx="30" fill="#cfd6cf"' + st(2.5) + '/><rect class="es-gauge" x="22" y="40" width="28" height="12" rx="3" fill="' + L + '"/></g>';
    /* línea de empaque: empacadora -> banda con rodillos -> control de calidad -> paletizado */
    var cvy = B - 66, cv = '<g transform="translate(120 ' + cvy + ')"><path d="M70 12 V66 M150 12 V66 M230 12 V66" stroke="#5d626e" stroke-width="6"/><path d="M60 66 h20 M140 66 h20 M220 66 h20" stroke="' + INK + '" stroke-width="3"/>';
    cv += '<rect x="44" y="0" width="216" height="12" rx="6" fill="#3a3f48"' + st(2) + "/>";
    for (var rq = 0; rq < 9; rq++) cv += '<g transform="translate(' + (54 + rq * 24.5) + ' 6)"><circle r="4.2" fill="#b7bcc1"' + st(1.2) + '/><g class="es-roll"><path d="M-3 0 H3" stroke="' + INK + '" stroke-width="1.4"/></g></g>';
    cv += '<clipPath id="esBox"><rect x="40" y="-40" width="230" height="40"/></clipPath><g clip-path="url(#esBox)"><g class="es-belt">' +
      [0, 1, 2, 3, 4].map(function (b) { var bx = -12 + b * 60; return '<g transform="translate(' + bx + ' -26)"><rect width="34" height="26" rx="2" fill="#c9924d"' + st(1.8) + '/><path d="M17 0 V26" stroke="#e8c48a" stroke-width="4"/><rect x="4" y="9" width="8" height="8" fill="' + L + '"/></g>'; }).join("") + "</g></g>";
    cv += '<path d="M168 6 V-46 H198 V6" fill="none" stroke="#5d626e" stroke-width="5"/><path class="es-laser" d="M172 -38 V2" stroke="' + R + '" stroke-width="2" opacity=".8"/><circle class="es-qc" cx="183" cy="-52" r="5" fill="' + L + '"' + st(1.4) + "/>";
    cv += '<rect x="-12" y="-78" width="62" height="90" rx="6" fill="#9aa3a8"' + st(2.4) + '/><rect x="-2" y="-68" width="42" height="18" rx="3" fill="#1f4a6b"' + st(1.6) + '/><path class="es-glint" d="M4 -60 h12" stroke="' + L2 + '" stroke-width="3"/>' +
      '<rect x="2" y="-44" width="34" height="40" fill="#3a3f48"/><g class="es-press"><rect x="12" y="-44" width="14" height="22" fill="#d7d2c8"' + st(1.4) + '/><rect x="6" y="-24" width="26" height="6" fill="' + Y + '"' + st(1.4) + "/></g>";
    cv += '<rect x="262" y="-56" width="46" height="68" rx="4" fill="#cfd6cf"' + st(2.2) + '/><path d="M268 -40 V10 M276 -40 V10 M284 -40 V10 M292 -40 V10 M300 -40 V10" stroke="#8ab0c8" stroke-width="4" opacity=".85"/><rect x="262" y="-56" width="46" height="14" fill="' + G + '"' + st(2) + "/></g>";
    s += cv;
    s += win(250, B - 220, 150, 70, 1) + label(250, B - h - 66, "INDUSTRIA") + "</g>";
    PEOPLE += writer(x + 300, B + 9, SKIN[2], helmet(Y), Y, false, -0.9);
    return s;
  }
  function construccion(x) { /* 4 pisos en obra (12 m) y grúa torre */
    var w = 360, fl = 108, s = '<g transform="translate(' + x + ' 0)">';
    s += '<rect x="0" y="' + (B - fl * 2) + '" width="' + w + '" height="' + fl * 2 + '" fill="#d7d2c8"' + st(2.5) + '/>' + win(30, B - fl * 2 + 24, 70, 60) + win(140, B - fl * 2 + 24, 70, 60) + win(250, B - fl * 2 + 24, 70, 60);
    s += '<path d="M0 ' + B + " V" + (B - fl * 3) + " H" + w + " V" + B + '" fill="none" stroke="#8d939a" stroke-width="8"/>';
    for (var f = 1; f < 3; f++) s += '<path d="M0 ' + (B - fl * f) + " H" + w + '" stroke="#8d939a" stroke-width="7"/>';
    s += '<path d="M120 ' + B + " V" + (B - fl * 3) + " M240 " + B + " V" + (B - fl * 3) + '" stroke="#8d939a" stroke-width="6"/><path d="M0 ' + (B - fl * 2) + " L120 " + (B - fl * 3) + " M240 " + (B - fl * 2) + " L360 " + (B - fl * 3) + '" stroke="#b7bcc1" stroke-width="3"/>';
    s += '<path d="M-14 ' + (B - fl * 2) + " h" + (w + 28) + '" stroke="' + O + '" stroke-width="6"/><path d="M-14 ' + (B - fl * 2 - 38) + " h" + (w + 28) + " M-14 " + (B - fl * 3) + " h" + (w + 28) + '" stroke="' + O + '" stroke-width="3.5"/>';
    /* obrero en andamio martillando y chispa de soldadura */
    s += at(80, B - fl * 2 - 3, stand() + shirt(O) + '<g class="es-hammer">' + arm("M12 -78 Q30 -90 34 -100", SKIN[1], "", 0, O) + '<path d="M34 -100 L40 -118 M32 -120 h16" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/></g>' + face(SKIN[1], -93) + helmet(Y));
    s += '<g transform="translate(300 ' + (B - fl * 2 - 40) + ')"><g class="es-spark">' + [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { return '<path transform="rotate(' + a + ')" d="M4 0 h14" stroke="#ffd21f" stroke-width="3" stroke-linecap="round"/>'; }).join("") + '<circle r="5" fill="#fff"/></g></g>';
    /* grúa torre: mástil sale del cuadro, carro y gancho con viga */
    s += '<g transform="translate(' + (w + 60) + ' 0)"><path d="M-10 ' + B + " L-10 -40 M10 " + B + " L10 -40" + '" stroke="#e8a316" stroke-width="7"/>';
    for (var yy = B - 30; yy > -20; yy -= 40) s += '<path d="M-10 ' + yy + " L10 " + (yy - 40) + '" stroke="#e8a316" stroke-width="3"/>';
    s += '<path d="M-420 30 H120 V44 H-420Z" fill="#e8a316"' + st(2.2) + '/>';
    for (var jx = -400; jx < 120; jx += 28) s += '<path d="M' + jx + " 44 L" + (jx + 14) + " 30 L" + (jx + 28) + ' 44" fill="none" stroke="' + INK + '" stroke-width="1.4" opacity=".45"/>';
    s += '<rect x="70" y="44" width="50" height="34" fill="#9aa3a8"' + st(2) + '/><rect x="-30" y="44" width="26" height="24" rx="3" fill="' + C + '"' + st(2) + '/><rect x="-26" y="48" width="18" height="10" fill="#bfe3ff"/>' +
      '<g class="es-trolley"><clipPath id="esTc"><rect x="-44" y="50" width="60" height="300"/></clipPath><rect x="-28" y="40" width="28" height="12" rx="2" fill="' + INK + '"/><circle cx="-21" cy="40" r="3" fill="#5d626e"/><circle cx="-7" cy="40" r="3" fill="#5d626e"/>' +
      '<g clip-path="url(#esTc)"><g class="es-hook"><path d="M-17 -200 V76 M-11 -200 V76" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<rect x="-21" y="76" width="14" height="10" rx="2" fill="' + Y + '"' + st(1.6) + '/><path d="M-14 86 q0 6 4 6" fill="none" stroke="' + INK + '" stroke-width="2.4"/><path d="M-14 90 L-56 104 M-14 90 L28 104" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<path d="M-60 104 H32 V118 H-60Z" fill="#8d939a"' + st(2) + '/><path d="M-60 111 H32" stroke="' + INK + '" stroke-width="1" opacity=".4"/></g></g></g></g>';
    s += label(180, B - fl * 2 - 70, "CONSTRUCCIÓN") + "</g>";
    PEOPLE += pointer(x + 190, B + 9, SKIN[3], helmet(Y), Y, true, -0.3) + client(x + 120, B + 9, SKIN[1], O, false);
    return s;
  }
  function puerto(x) { /* contenedores de 20 pies (6,1 x 2,6 m) y grúa pórtico */
    var cw = 220, chh = 94, cols = ["#2f9be0", R, L, O, Y, "#2f9be0"], s = '<g transform="translate(' + x + ' 0)">';
    var cont = function (cx, cy, col) { var t = '<rect x="' + cx + '" y="' + cy + '" width="' + cw + '" height="' + chh + '" fill="' + col + '"' + st(2.4) + "/>"; for (var i = 1; i < 10; i++) t += '<path d="M' + (cx + i * 22) + " " + (cy + 8) + " v" + (chh - 16) + '" stroke="' + INK + '" stroke-width="1.6" opacity=".35"/>'; return t; };
    s += cont(0, B - chh, cols[0]) + cont(0, B - chh * 2, cols[1]) + cont(0, B - chh * 3, cols[3]) + cont(cw + 4, B - chh, cols[2]);
    s += '<g transform="translate(' + (cw * 2 + 70) + ' 0)"><path d="M-30 ' + B + " V-40 M30 " + B + " V-40" + '" stroke="#e8a316" stroke-width="12"/><path d="M-30 ' + (B - 150) + " H30 M-30 " + (B - 300) + ' H30" stroke="#e8a316" stroke-width="8"/>' +
      '<path d="M-330 30 H90 V50 H-330Z" fill="#e8a316"' + st(2.2) + '/><rect x="-60" y="-10" width="50" height="40" fill="' + C + '"' + st(2) + "/>" +
      '<clipPath id="esPc"><rect x="-340" y="52" width="280" height="460"/></clipPath>' +
      '<rect x="-318" y="42" width="236" height="16" rx="3" fill="' + INK + '"/><rect x="-300" y="36" width="200" height="8" rx="2" fill="#5d626e"' + st(1.6) + '/>' +
      '<g clip-path="url(#esPc)"><g class="es-spreader"><path d="M-300 -300 V' + (B - chh * 2 - 152) + " M-282 -300 V" + (B - chh * 2 - 152) + " M-118 -300 V" + (B - chh * 2 - 152) + " M-100 -300 V" + (B - chh * 2 - 152) + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<rect x="-316" y="' + (B - chh * 2 - 152) + '" width="232" height="12" rx="2" fill="' + Y + '"' + st(2) + "/>" + cont(-310, B - chh * 2 - 140, cols[4]) + "</g></g></g>";
    s += '<rect x="400" y="' + (B - 30) + '" width="34" height="30" rx="3" fill="' + Y + '"' + st(2) + '/><path d="M406 ' + (B - 20) + ' h22" stroke="' + INK + '" stroke-width="2"/>' + label(110, B - chh * 3 - 30, "PUERTO") + "</g>";
    PEOPLE += crouch(x + 330, B + 9, SKIN[0], helmet("#fff"));
    return s;
  }
  function scene() {
    var s = sky() + farCity();
    s += turbine(40, B, 1.1) + turbine(110, B, 0.8) + palm(130, 1);
    s += restaurante(160) + comercio(660) + hotel(1020) + industria(1440) + construccion(2010) + puerto(2480);
    s += '<rect x="-10" y="' + B + '" width="' + (VW + 20) + '" height="12" fill="#e8d9c0"' + st(2.5) + '/><rect x="-10" y="' + (B + 12) + '" width="' + (VW + 20) + '" height="44" fill="#5d626e"/><path d="M0 ' + (B + 34) + " H" + VW + '" stroke="#fff" stroke-width="4" stroke-dasharray="28 20"/>';
    var wave = function (y, col, w, op, cls) { var dd = "M-120 " + y; for (var i2 = 0; i2 < 54; i2++) dd += " q15 -7 30 0 t30 0"; return '<g class="' + cls + '"><path d="' + dd + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" opacity="' + op + '"/></g>'; };
    s += '<rect x="-10" y="' + (B + 56) + '" width="' + (VW + 20) + '" height="40" fill="#1eb5cc"/>' + wave(B + 66, "#fff", 2.6, 0.8, "fi-sea") + wave(B + 78, "#fff", 2.2, 0.5, "fi-sea2");
    s += PEOPLE; PEOPLE = "";
    s += ethan();
    return '<svg viewBox="0 0 ' + VW + " " + VH + '" preserveAspectRatio="xMinYMax meet" aria-hidden="true">' + s + "</svg>";
  }
  /* paradas de Ethan sobre la avenida, al lado de cada visita */
  var STOPS = [580, 1030, 1360, 1810, 2270, 2740, 2270, 1810, 1360, 1030];
  var GEST = ["robot-anim-256", "robot-pensar", "robot-terminado", "robot-celebrar", "robot-look-r", "robot-look-l"];
  function mount(box) {
    box.innerHTML = '<div class="es-pan">' + scene() + "</div>";
    var pan = box.firstChild, svg = pan.firstChild, $ = function (q) { return svg.querySelector(q); }, $$ = function (q) { return [].slice.call(svg.querySelectorAll(q)); };
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var n = STOPS.length, per = 5200 * n, anims = [];
    var sm = function (t) { return t * t * (3 - 2 * t); };
    /* fotogramas por parada: f = fracción dentro del tramo de 6 s */
    function seq(fn) {
      var k = [];
      for (var i = 0; i < n; i++) fn(i, STOPS[i], STOPS[(i + 1) % n]).forEach(function (f) { var o = Object.assign({}, f[1]); o.offset = (i + f[0]) / n; k.push(o); });
      var last = Object.assign({}, k[0]); last.offset = 1; delete last.easing; k.push(last);
      return k;
    }
    var T = function (x, y, r, sc) { return "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) rotate(" + (r || 0) + "deg)" + (sc ? " scale(" + sc + ")" : ""); };
    var sr = function (t) { return t * t * t * (t * (6 * t - 15) + 10); };
    /* tramo i: flota en la visita y vuela en un solo arco continuo a la siguiente */
    function path(f, x, nx) {
      var F = .46, dir = nx < x ? -1 : 1, bob = 6 * Math.sin(f * 6.283 * 3);
      if (f < F) return { x: x + dir * 6 * Math.sin(f / F * 3.1416), y: 16 + bob, r: 0, sp: 0 };
      var u = Math.min(1, (f - F) / (1 - F - .02)), e = sr(u), v = (sr(Math.min(1, u + .01)) - e) / .01 / 1.9;
      return { x: x + (nx - x) * e, y: 16 + bob * (1 - u) + 54 * Math.sin(3.1416 * e) + 6 * Math.sin(u * 6.283 * 2) * Math.sin(3.1416 * u), r: dir * 11 * Math.min(1, v), sp: Math.min(1, v) };
    }
    function phase(i, x, nx) { return [[0, 0], [0.04, 1], [0.2, 2], [0.34, 3], [0.46, nx < x ? 5 : 4]]; }
    function samples(i, x, nx) { var o = [], N = 56; for (var q = 0; q < N; q++) { var f = q / N, p = path(f, x, nx); p.f = f; o.push(p); } return o; }
    function build() {
      anims.forEach(function (a) { a.cancel(); }); anims = [];
      var H = box.clientHeight, sw = H * VW / VH, cw = box.clientWidth, k = H / VH; pan.style.width = sw + "px";
      var opt = { duration: per, iterations: Infinity, easing: "linear" }, go = function (el, kf) { if (el) anims.push(el.animate(kf, opt)); };
      go($("#esEthan"), seq(function (i, x, nx) { return samples(i, x, nx).map(function (p) { return [p.f, { transform: T(p.x, EY - p.y, p.r) }]; }); }));
      go($("#esShd"), seq(function (i, x, nx) { return samples(i, x, nx).map(function (p) { return [p.f, { transform: T(p.x, B + 44, 0, (1 - (p.y - 16) / 150).toFixed(2)), opacity: 1 - (p.y - 16) / 200 }]; }); }));
      /* gestos: piensa (escanea) -> terminado + visto bueno -> celebra -> mira hacia donde va */
      $$(".es-gest").forEach(function (img, g) {
        go(img, seq(function (i, x, nx) { var ph = phase(i, x, nx), out = []; ph.forEach(function (p, j) { var prev = j ? ph[j - 1][1] : -1; if (j) out.push([p[0] - 0.002, { opacity: prev === g ? 1 : 0 }]); out.push([p[0], { opacity: p[1] === g ? 1 : 0 }]); }); return out; }));
      });
      go($("#esScan"), seq(function () { return [[0, { opacity: 0 }], [0.04, { opacity: 0 }], [0.07, { opacity: 1 }], [0.18, { opacity: 1 }], [0.21, { opacity: 0 }]]; }));
      go($("#esOk"), seq(function () { return [[0, { opacity: 0, transform: "scale(.3)" }], [0.2, { opacity: 0, transform: "scale(.3)" }], [0.23, { opacity: 1, transform: "scale(1.15)" }], [0.26, { opacity: 1, transform: "scale(1)" }], [0.42, { opacity: 1, transform: "scale(1)" }], [0.46, { opacity: 0, transform: "scale(.5)" }]]; }));
      /* propulsores: suaves en la visita, más fuertes según la velocidad del vuelo */
      $$(".es-boost").forEach(function (b) {
        go(b, seq(function (i, x, nx) { return samples(i, x, nx).map(function (p) { return [p.f, { transform: "scaleY(" + (1 + 1.3 * p.sp).toFixed(2) + ")" }]; }); }));
      });
      if (sw > cw + 2) go(pan, seq(function (i, x, nx) {
        var tx = function (p) { return Math.min(0, Math.max(cw - sw, cw / 2 - p * k)); };
        return samples(i, x, nx).map(function (p) { return [p.f, { transform: "translateX(" + tx(p.x).toFixed(1) + "px)" }]; });
      }));
    }
    build(); var t; addEventListener("resize", function () { clearTimeout(t); t = setTimeout(build, 200); });
    /* solo se anima con la escena en pantalla */
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) {
      var on = es[0].isIntersecting; box.classList.toggle("es-off", !on);
      anims.forEach(function (a) { on ? a.play() : a.pause(); });
    }, { rootMargin: "100px 0px" }).observe(box);
  }
  window.ecoScene = { mount: mount };
  /* portada de la edición empresarial: se monta sola cuando no está activa la edición Fiestas */
  function auto() {
    var box = document.getElementById("esScene"), root = document.documentElement, done = false;
    if (!box) return;
    function go() { if (!done && !root.classList.contains("fi")) { done = true; mount(box); } }
    go();
    if (!done && "MutationObserver" in window) new MutationObserver(go).observe(root, { attributes: true, attributeFilter: ["class"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto); else auto();
})();
