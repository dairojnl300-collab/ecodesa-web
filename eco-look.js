/* Figurines ECODESA: patrón de fondo y figuras grandes que flotan con parallax suave en cada sección. */
(function () {
  var I = {
    hoja: '<path d="M5 19C5 10 11 5 20 4c0 9-5 15-15 15Z"/><path d="M5 19 14 10"/>',
    gota: '<path d="M12 3c4.5 5.4 6.5 8.8 6.5 11.6a6.5 6.5 0 0 1-13 0C5.5 11.8 7.5 8.4 12 3Z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
    engranaje: '<circle cx="12" cy="12" r="7" stroke-width="3.2" stroke-dasharray="2.6 2.9"/><circle cx="12" cy="12" r="5.2"/><circle cx="12" cy="12" r="2"/>',
    casco: '<path d="M3.5 17h17"/><path d="M5.5 17a6.5 6.5 0 0 1 13 0"/><path d="M10 10.8V7.5h4v3.3"/><path d="M8.5 13.5v3.5M15.5 13.5v3.5"/>',
    escudo: '<path d="M12 3 19 6v5c0 5-3 8.4-7 10-4-1.6-7-5-7-10V6Z"/><path d="m8.8 12 2.2 2.2 4.3-4.4"/>',
    reciclaje: '<path d="M7.5 9 10 4.6a2 2 0 0 1 3.4 0L15 7.4"/><path d="M15.6 4.6 15 7.4l-2.8-.7"/><path d="M17.8 12 20 16a2 2 0 0 1-1.7 3h-3.4"/><path d="M16.8 21.2 14.9 19l1.9-2.1"/><path d="M9.3 19H5.7A2 2 0 0 1 4 16l1.7-3"/><path d="M3.9 13.6 5.7 13l1 2.7"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>',
    ola: '<path d="M2.5 9c2.4-2 4.8-2 7.2 0s4.8 2 7.2 0 3.2-1.6 4.6-.6"/><path d="M2.5 14.5c2.4-2 4.8-2 7.2 0s4.8 2 7.2 0 3.2-1.6 4.6-.6"/>',
    alerta: '<path d="M12 4 21 19.5H3Z"/><path d="M12 10v4.2M12 16.8v.01"/>',
    arbol: '<path d="M12 21v-5"/><path d="M12 3 6.5 10h3L6 15h12l-3.5-5h3Z"/>'
  };
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* patrón: misma escala y trazo que las figuritas de Fiestas (figuras de ~36 px, trazo de 3 px, mosaico de 180 px por figura) */
  var spots = [["hoja", 14, 10, -10], ["gota", 104, 22, 6], ["engranaje", 196, 8, 0], ["casco", 286, 26, -6],
    ["escudo", 30, 104, 4], ["reciclaje", 122, 116, 0], ["sol", 214, 100, 0], ["ola", 300, 120, 0],
    ["alerta", 10, 200, -4], ["arbol", 100, 214, 4], ["hoja", 194, 196, 22], ["gota", 286, 210, -8],
    ["engranaje", 38, 292, 0], ["escudo", 130, 304, -6], ["casco", 222, 288, 8], ["reciclaje", 306, 300, 0]];
  var dots = [[90, 88], [176, 64], [270, 176], [60, 176], [170, 262], [344, 258], [254, 344], [80, 350]];
  var tile = '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 360 360"><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round">' +
    spots.map(function (s) { return '<g stroke-width="1.6" transform="translate(' + s[1] + " " + s[2] + ") rotate(" + s[3] + ' 23 23) scale(1.9)">' + I[s[0]] + "</g>"; }).join("") +
    dots.map(function (d) { return '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="3" stroke-width="3"/>'; }).join("") + "</g></svg>";
  root.style.setProperty("--eco-tile", 'url("data:image/svg+xml,' + encodeURIComponent(tile) + '")');

  /* figuras grandes por sección: [figura, lado, arriba %, tamaño px, velocidad parallax] */
  var sets = [
    [["hoja", "r", 6, 170, .10], ["gota", "l", 40, 104, -.06], ["sol", "r", 62, 88, .04, 1], ["reciclaje", "l", 86, 70, .08]],
    [["engranaje", "r", 8, 160, .08, 1], ["casco", "l", 46, 118, -.05], ["escudo", "r", 72, 84, .06], ["gota", "l", 90, 64, -.04]],
    [["reciclaje", "l", 8, 146, -.08], ["arbol", "r", 36, 128, .07], ["ola", "l", 66, 96, .05], ["engranaje", "r", 88, 72, -.05, 1]],
    [["escudo", "r", 10, 152, .09], ["alerta", "l", 44, 100, -.06], ["hoja", "r", 70, 86, .05], ["sol", "l", 90, 66, .04, 1]],
    [["gota", "l", 8, 136, .07], ["engranaje", "r", 40, 116, -.05, 1], ["casco", "l", 70, 84, .06], ["arbol", "r", 90, 70, .05]]
  ];
  var floaters = [], k = 0;
  [].forEach.call(document.querySelectorAll("main .sec, .lbg"), function (sec) {
    if (sec.classList.contains("fi-sec")) return;
    var deco = document.createElement("div");
    deco.className = "eco-deco"; deco.setAttribute("aria-hidden", "true");
    var html = '<div class="eco-pat"></div>', set = sets[k++ % sets.length];
    set.forEach(function (f, i) {
      var side = (f[1] === "r" ? "right:" : "left:") + "calc(" + (i % 2 ? 1 : -1) + "% - " + Math.round(f[3] / 4) + "px)";
      html += '<span class="eco-fl' + (f[5] ? " spin" : "") + '" data-sp="' + f[4] + '" style="' + side + ";top:" + f[2] + "%;--s:" + f[3] + "px;--t:" + (8 + i * 2.5) + "s;--d:-" + (i * 1.7) + "s;--r0:" + (-8 + i * 3) + "deg;--r1:" + (7 - i * 2) + 'deg"><svg viewBox="0 0 24 24">' + I[f[0]] + "</svg></span>";
    });
    deco.innerHTML = html;
    sec.classList.add("eco-on"); sec.prepend(deco);
    [].forEach.call(deco.querySelectorAll(".eco-fl"), function (el) { floaters.push({ el: el, sec: sec, sp: +el.dataset.sp }); });
  });

  if (reduce || !floaters.length) return;
  var ticking = false;
  function update() {
    ticking = false;
    var vh = innerHeight;
    for (var i = 0; i < floaters.length; i++) {
      var f = floaters[i], r = f.sec.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      f.el.style.setProperty("--py", ((r.top + r.height / 2 - vh / 2) * f.sp).toFixed(1) + "px");
    }
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update);
  update();
})();
