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
  function man(sk, shirt, hat, armsHTML) {
    return '<path d="M-10 -42 L-12 -2 L-3 -2 L-1 -42Z M1 -42 L3 -2 L12 -2 L10 -42Z" fill="#fff"' + st(2.5) + "/>" +
      '<ellipse cx="-8" cy="0" rx="7" ry="3.5" fill="' + INK + '"/><ellipse cx="8" cy="0" rx="7" ry="3.5" fill="' + INK + '"/>' +
      '<path d="M-14 -42 L14 -42 L13 -80 Q0 -86 -13 -80Z" fill="' + shirt + '"' + st(2.5) + "/>" +
      '<path d="M-10 -80 L10 -80 L0 -68Z" fill="' + R + '"' + st(2) + "/>" + armsHTML + head(sk, hat);
  }
  function arm(d, sk, cls, dl) { return '<path class="' + (cls || "") + '" style="animation-delay:' + (dl || 0) + 's" d="' + d + '" fill="none" stroke="' + sk + '" stroke-width="6.5" stroke-linecap="round"/>'; }
  function cumbiambera(x, c1, c2, c3, sk, dl) {
    var hem = "M-48 -6"; for (var i = 0; i < 6; i++) hem += " q8 11 16 0";
    return '<g transform="translate(' + x + ' 300)"><g class="fi-walk" style="animation-delay:' + dl + 's">' +
      '<g class="fi-sk" style="animation-delay:' + dl + 's">' +
      '<path d="M-14 -64 Q-44 -30 -48 -6 Q0 6 48 -6 Q44 -30 14 -64Z" fill="' + c1 + '"' + st() + "/>" +
      '<path d="M-36 -36 Q0 -28 36 -36 L42 -20 Q0 -10 -42 -20Z" fill="' + c2 + '"' + st(2.5) + "/>" +
      '<path d="' + hem + ' L48 -6 Q0 6 -48 -6Z" fill="' + c3 + '"' + st(2.5) + "/>" +
      '<path d="M-40 -14 Q0 -4 40 -14" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="2 5"/></g>' +
      '<path d="M-11 -64 L11 -64 L9 -84 L-9 -84Z" fill="' + sk + '"' + st(2.5) + "/>" +
      '<path d="M-17 -84 Q0 -76 17 -84 L15 -70 Q0 -64 -15 -70Z" fill="#fff"' + st(2.5) + "/>" +
      arm("M-13 -80 Q-30 -62 -42 -36", sk) + arm("M13 -82 Q28 -96 32 -116", sk, "fi-armup", dl) +
      '<circle cx="0" cy="-94" r="11" fill="' + sk + '"' + st(2.5) + "/>" +
      '<path d="M-12 -98 Q-15 -117 0 -120 Q15 -117 12 -98 Q0 -106 -12 -98Z" fill="' + c2 + '"' + st(2.5) + "/>" +
      '<circle cx="-8" cy="-116" r="5.5" fill="' + R + '"' + st(1.6) + '/><circle cx="5" cy="-121" r="5.5" fill="' + Y + '"' + st(1.6) + '/><circle cx="13" cy="-110" r="4.5" fill="' + O + '"' + st(1.6) + "/>" +
      '<circle cx="-10" cy="-88" r="2.8" fill="' + Y + '"/></g></g>';
  }
  function candles(x, sk, dl) {
    var c = '<g class="fi-armup2" style="animation-delay:' + dl + 's">' + arm("M12 -78 Q24 -92 22 -112", sk) +
      '<rect x="15" y="-134" width="5" height="24" fill="#fff"' + st(1.8) + '/><rect x="21" y="-138" width="5" height="28" fill="#fff"' + st(1.8) + '/><rect x="27" y="-133" width="5" height="23" fill="#fff"' + st(1.8) + "/>" +
      '<path class="fi-flame" d="M17.5 -134 q-3 -6 0 -10 q3 4 0 10Z M23.5 -138 q-3 -6 0 -10 q3 4 0 10Z M29.5 -133 q-3 -6 0 -10 q3 4 0 10Z" fill="#ffb000" stroke="' + O + '" stroke-width="1"/></g>';
    return '<g transform="translate(' + x + ' 300)"><g class="fi-walk" style="animation-delay:' + dl + 's">' + man(sk, "#fff", true, arm("M-12 -76 Q-21 -60 -18 -46", sk) + c) + "</g></g>";
  }
  function drummer(x, sk, shirt, dl) {
    var drum = '<path d="M-2 -60 L32 -60 L28 -20 Q15 -14 2 -20Z" fill="' + R + '"' + st(2.5) + '/><path d="M2 -54 L9 -24 L15 -54 L21 -24 L28 -54" fill="none" stroke="' + Y + '" stroke-width="3"/>' +
      '<ellipse cx="15" cy="-60" rx="17" ry="5" fill="' + C + '"' + st(2.5) + "/>";
    return '<g transform="translate(' + x + ' 300)"><g class="fi-walk" style="animation-delay:' + dl + 's">' +
      man(sk, shirt, true, drum + arm("M-12 -78 Q0 -62 8 -62", sk, "fi-beat", dl) + arm("M12 -78 Q26 -70 22 -62", sk, "fi-beat", dl + 0.18)) + "</g></g>";
  }
  function millo(x, sk, dl) {
    return '<g transform="translate(' + x + ' 300)"><g class="fi-walk" style="animation-delay:' + dl + 's">' +
      man(sk, Y, true, '<path d="M4 -90 L44 -84" stroke="#c9a26b" stroke-width="5" stroke-linecap="round"/><path d="M4 -90 L44 -84" stroke="' + INK + '" stroke-width="1.2" stroke-dasharray="1 6"/>' +
        arm("M-10 -78 Q8 -80 14 -88", sk) + arm("M10 -78 Q26 -82 30 -86", sk)) + "</g></g>";
  }
  function flagBearer(x, sk, dl) {
    var f = '<path d="M14 -64 V-176" stroke="#8a4b16" stroke-width="4.5" stroke-linecap="round"/><g class="fi-flagw">' +
      '<rect x="14" y="-176" width="64" height="42" fill="' + R + '"' + st(2.5) + '/><rect x="20" y="-170" width="52" height="30" fill="' + Y + '"/><rect x="26" y="-164" width="40" height="18" fill="' + G + '"/>' +
      '<polygon points="' + star8(46, -155, 7.5, 3.2) + '" fill="#fff"/></g>';
    return '<g transform="translate(' + x + ' 300)"><g class="fi-walk" style="animation-delay:' + dl + 's">' + man(sk, G, true, f + arm("M12 -78 Q16 -88 14 -96", sk) + arm("M-12 -76 Q-20 -60 -16 -46", sk)) + "</g></g>";
  }
  function carroza(x, sk) {
    var fl = ""; for (var i = 0; i < 9; i++) fl += '<circle cx="' + (-72 + i * 18) + '" cy="-36" r="7" fill="' + [R, Y, O][i % 3] + '"' + st(1.6) + "/>";
    var wheel = function (cx) { return '<g transform="translate(' + cx + ' -10)"><g class="fi-wheel"><circle r="12" fill="' + INK + '"/><circle r="7" fill="' + Y + '"/><path d="M-7 0 H7 M0 -7 V7" stroke="' + INK + '" stroke-width="2.2"/></g></g>'; };
    return '<g transform="translate(' + x + ' 300)">' +
      '<path d="M-80 -150 Q0 -205 80 -150" fill="none" stroke="' + G + '" stroke-width="7"/>' +
      [[-70, -156], [-40, -178], [0, -186], [40, -178], [70, -156]].map(function (p, i) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="9" fill="' + [R, Y, O, Y, R][i] + '"' + st(1.8) + "/>"; }).join("") +
      '<g class="fi-queen"><path d="M-22 -40 Q-30 -70 -12 -96 L12 -96 Q30 -70 22 -40Z" fill="' + Y + '"' + st(2.5) + '/><path d="M-26 -52 Q0 -44 26 -52" fill="none" stroke="' + R + '" stroke-width="5"/>' +
      '<circle cx="0" cy="-108" r="11" fill="' + sk + '"' + st(2.5) + '/><path d="M-10 -117 L-6 -128 L0 -119 L6 -128 L10 -117Z" fill="' + Y + '"' + st(1.8) + "/>" +
      arm("M12 -92 Q26 -104 28 -122", sk, "fi-wave") + arm("M-12 -92 Q-20 -76 -16 -64", sk) + "</g>" +
      '<path d="M-84 -42 H84 L78 -14 H-78Z" fill="' + G + '"' + st(3) + "/>" + fl + wheel(-50) + wheel(50) + "</g>";
  }
  function bandoScene() {
    var s = '<circle cx="1300" cy="96" r="72" style="fill:var(--fi-sunc)"/>';
    /* palmeras */
    var palm = function (x, k) { return '<g transform="translate(' + x + ' 172) scale(' + k + ')"><path d="M0 0 Q-6 -60 6 -118" fill="none" stroke="#8a5a2b" stroke-width="9" stroke-linecap="round"/>' +
      '<g class="fi-palm" fill="' + G + '"' + st(2.5) + '><path d="M6 -118 Q-30 -132 -58 -104 Q-26 -118 6 -112Z"/><path d="M6 -118 Q42 -136 66 -106 Q36 -118 6 -112Z"/><path d="M6 -118 Q-10 -150 -40 -152 Q-12 -140 4 -114Z"/><path d="M6 -118 Q24 -152 54 -150 Q24 -138 8 -114Z"/></g></g>'; };
    s += palm(70, 1) + palm(1520, 0.9);
    /* ciudad detrás: casas, cúpula y Torre del Reloj */
    [[520, 120, "#ff6fa8"], [620, 104, "#2f9be0"], [1140, 116, O], [1240, 100, "#9b5cff"]].forEach(function (h) {
      s += '<rect x="' + h[0] + '" y="' + h[1] + '" width="96" height="' + (172 - h[1]) + '" fill="' + h[2] + '"' + st() + '/><rect x="' + (h[0] - 4) + '" y="' + (h[1] - 9) + '" width="104" height="11" fill="' + R + '"' + st(2.5) + "/>" +
        '<rect x="' + (h[0] + 14) + '" y="' + (h[1] + 14) + '" width="20" height="26" rx="8" fill="' + C + '"' + st(2) + '/><rect x="' + (h[0] + 62) + '" y="' + (h[1] + 14) + '" width="20" height="26" rx="8" fill="' + C + '"' + st(2) + "/>";
    });
    s += '<g transform="translate(1000 172)"><rect x="-34" y="-58" width="68" height="58" fill="' + C + '"' + st() + '/><path d="M-40 -58 Q0 -126 40 -58Z" fill="#ffc400"' + st() + '/><path d="M-20 -62 Q-12 -100 0 -106 M20 -62 Q12 -100 0 -106" fill="none" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<rect x="-7" y="-122" width="14" height="18" fill="' + C + '"' + st(2.5) + '/><path d="M-9 -122 Q0 -134 9 -122Z" fill="#ffc400"' + st(2.5) + '/><path d="M0 -134 V-146 M-5 -141 H5" stroke="' + INK + '" stroke-width="2.5"/></g>';
    s += '<g transform="translate(330 172)"><rect x="-38" y="-80" width="76" height="80" fill="' + C + '"' + st() + '/><path d="M-14 0 V-30 A14 14 0 0 1 14 -30 V0Z" fill="' + INK + '"/>' +
      '<rect x="-46" y="-92" width="92" height="12" fill="' + O + '"' + st(2.5) + '/><rect x="-28" y="-138" width="56" height="46" fill="' + Y + '"' + st() + '/><circle cx="0" cy="-115" r="16" fill="#fff"' + st(2.5) + '/>' +
      '<path d="M0 -115 V-126 M0 -115 L8 -110" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/><rect x="-34" y="-146" width="68" height="9" fill="' + O + '"' + st(2.5) + '/><path d="M-26 -146 Q0 -184 26 -146Z" fill="' + R + '"' + st() + '/><path d="M0 -176 V-196" stroke="' + INK + '" stroke-width="2.5"/><path d="M0 -196 L16 -191 L0 -186Z" fill="' + Y + '"' + st(1.8) + "/></g>";
    /* murallas con garitas */
    s += '<rect x="-10" y="170" width="1620" height="94" fill="#dba660"' + st() + "/>";
    for (var mx = 0; mx < 1600; mx += 44) s += '<rect x="' + mx + '" y="158" width="26" height="14" fill="#dba660"' + st(2.5) + "/>";
    s += '<path d="M0 196 H1600 M0 222 H1600 M0 246 H1600" stroke="#b37b3a" stroke-width="2.2"/>';
    for (var bx = 0; bx < 1600; bx += 64) s += '<path d="M' + bx + " 170 V196 M" + (bx + 32) + " 196 V222 M" + bx + " 222 V246 M" + (bx + 32) + ' 246 V262" stroke="#b37b3a" stroke-width="2"/>';
    var garita = function (x) { return '<g transform="translate(' + x + ' 166)"><path d="M-24 0 Q0 16 24 0Z" fill="#c9924d"' + st(2.5) + '/><rect x="-20" y="-46" width="40" height="46" fill="#e7b56c"' + st() + '/><path d="M-25 -46 Q0 -84 25 -46Z" fill="#dba660"' + st() + '/><rect x="-4" y="-36" width="8" height="18" rx="4" fill="' + INK + '"/><circle cx="0" cy="-70" r="4" fill="#c9924d"' + st(2) + "/></g>"; };
    s += garita(200) + garita(770) + garita(1430);
    /* faroles con banderines a lo largo de la vía */
    var posts = [120, 520, 920, 1320, 1720];
    posts.forEach(function (px, i) {
      s += '<path d="M' + px + " 266 V176" + '" stroke="#2d3a5a" stroke-width="6"/><path d="M' + (px - 12) + " 178 h24 l-5 -16 h-14Z" + '" fill="#2d3a5a"/><circle class="fi-lamp" cx="' + px + '" cy="186" r="7" style="fill:var(--fi-lamp)"/>';
      if (i < posts.length - 1) {
        var x0 = px, x1 = posts[i + 1], cx = (x0 + x1) / 2;
        s += '<path d="M' + x0 + " 182 Q" + cx + " 222 " + x1 + ' 182" fill="none" stroke="' + INK + '" stroke-width="1.8"/>';
        for (var k = 1; k < 12; k++) { var t = k / 12, mt = 1 - t, fx = mt * mt * x0 + 2 * mt * t * cx + t * t * x1, fy = mt * mt * 182 + 2 * mt * t * 222 + t * t * 182;
          s += '<path class="fi-flag" style="--d:' + (-k * 0.3).toFixed(1) + "s;transform-origin:" + fx.toFixed(1) + "px " + fy.toFixed(1) + 'px" d="M' + (fx - 9).toFixed(1) + " " + fy.toFixed(1) + " h18 l-9 15Z" + '" fill="' + [R, Y, G, O][k % 4] + '" stroke="' + INK + '" stroke-width="1.5"/>'; }
      }
    });
    /* Avenida Santander */
    s += '<rect x="-10" y="262" width="1620" height="10" fill="#e8d9c0"' + st(2.5) + '/><rect x="-10" y="272" width="1620" height="44" fill="#5d626e"/><path d="M0 294 H1600" stroke="' + Y + '" stroke-width="4" stroke-dasharray="28 20"/>';
    /* desfile (dos copias para que el bucle no se note) */
    function parade() {
      return flagBearer(60, SKIN[0], 0) + cumbiambera(210, R, Y, G, SKIN[1], -0.2) + candles(340, SKIN[2], -0.35) + cumbiambera(470, Y, R, G, SKIN[3], -0.1) +
        drummer(600, SKIN[0], C, -0.25) + carroza(790, SKIN[1]) + millo(980, SKIN[2], -0.15) + cumbiambera(1110, G, Y, R, SKIN[0], -0.3) +
        candles(1240, SKIN[3], -0.05) + drummer(1370, SKIN[2], Y, -0.4) + cumbiambera(1500, O, G, Y, SKIN[1], -0.12);
    }
    s += '<g class="fi-parade"><g transform="translate(-1600 0)">' + parade() + "</g>" + parade() + "</g>";
    /* malecón y mar */
    s += '<rect x="-10" y="314" width="1620" height="10" fill="#cdbfa7"' + st(2.5) + '/><rect x="-10" y="324" width="1620" height="60" fill="#1eb5cc"/>' +
      '<g class="fi-sea">' + [0, 1].map(function (r) { var d = "M-120 " + (338 + r * 14); for (var i = 0; i < 30; i++) d += " q15 -7 30 0 t30 0"; return '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity="' + (0.85 - r * 0.3) + '"/>'; }).join("") + "</g>";
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
