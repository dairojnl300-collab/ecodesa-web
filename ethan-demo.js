(function () {
  var root = document.getElementById("eph"); if (!root) return;
  var flow = root.querySelector(".eph-flow"), body = root.querySelector(".eph-body"), btn = root.querySelector(".eph-re");
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var END = 34.5, INF = 1e9, E = [];
  function add(o) { E.push(o); return o; }
  function typing(s, h) { add({ k: "typ", s: s, h: h }); }
  function bot(s, t) { add({ k: "bot", s: s, h: INF, t: t }); }
  function me(s, t) { add({ k: "me", s: s, h: INF, t: t }); }
  function chips(s, l, idx, tap, h) { add({ k: "chips", s: s, h: h, l: l, idx: idx, tap: tap }); }
  var SN = ["✓ Sí", "✗ No", "No sé"];
  typing(.4, 1.2); bot(1.2, "Hola, soy Ethan, el asistente de ECODESA. ¿Desde dónde nos escribes?");
  chips(1.6, ["Cartagena", "Barranquilla", "Bogotá", "Escribir"], 2, 3.0, 3.45); me(3.45, "Bogotá");
  typing(3.8, 4.6); bot(4.6, "¿Qué tipo de negocio tienes?");
  chips(5.0, ["Restaurantes", "Hoteles y turismo", "Comercio y locales", "Industria"], 0, 6.4, 6.85); me(6.85, "Restaurantes");
  typing(7.2, 8.0); bot(8.0, "Perfecto. ¿Qué te gustaría saber sobre tu restaurante?");
  chips(8.4, ["Normativa que aplica", "Realizar un diagnóstico inicial", "Cómo te ayuda ECODESA"], 1, 10.0, 10.45); me(10.45, "Realizar un diagnóstico inicial");
  typing(10.8, 11.6); bot(11.6, "¿Qué tema quieres revisar?");
  chips(12.0, ["Todos los temas", "Sanidad", "Seguridad contra incendios"], 0, 13.4, 13.85); me(13.85, "Todos los temas");
  typing(14.2, 15.0); bot(15.0, "Responde sí, no o no sé. Son 29 preguntas sobre tu restaurante.");
  bot(15.4, "¿Su establecimiento está inscrito ante la autoridad ambiental competente?");
  chips(15.9, SN, 0, 17.4, 17.85); me(17.85, "✓ Sí");
  typing(18.2, 19.0); bot(19.0, "Registrado como cumplido declarado."); bot(19.3, "Cumplimiento hasta ahora: 100 % (1 de 29 preguntas).");
  bot(19.8, "¿La inscripción tiene el volumen mensual de aceite usado en promedio?");
  chips(20.3, SN, 1, 21.8, 22.25); me(22.25, "✗ No");
  typing(22.6, 23.4); bot(23.4, "Requisito pendiente. Un Profesional de ECODESA te orienta para cumplirlo.");
  bot(23.8, "Cumplimiento hasta ahora: 50 % (2 de 29 preguntas).");
  add({ k: "prog", s: 24.6, h: 29.0 });
  typing(29.0, 29.9); add({ k: "res", s: 29.9, h: INF });
  bot(31.0, "Publicidad exterior: 67 %.");
  chips(31.8, ["Validar mi cumplimiento con un profesional"], 0, INF, INF);

  function mk(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  E.forEach(function (e) {
    var el;
    if (e.k === "typ") { el = mk("div", "eph-m bot typ", "<i></i><i></i><i></i>"); e.dots = el.querySelectorAll("i"); }
    else if (e.k === "bot" || e.k === "me") el = mk("div", "eph-m " + e.k, e.t);
    else if (e.k === "chips") { el = mk("div", "eph-opts"); e.os = e.l.map(function (t) { var o = mk("span", "eph-o", t); el.appendChild(o); return o; }); e.pr = -1; }
    else if (e.k === "prog") { el = mk("div", "eph-prog", '<div class="eph-pt"><b>Respondiendo tu diagnóstico</b><span>2 de 29</span></div><div class="eph-bar"><i></i></div>'); e.n = el.querySelector("span"); e.b = el.querySelector("i"); }
    else if (e.k === "res") { el = mk("div", "eph-res", '<div class="eph-rt">Resultado</div><div class="eph-pct">0 %</div><div class="eph-lv">Cumplimiento declarado parcial</div><div class="eph-bar"><i></i></div><p>Es una estimación según tus respuestas; un Profesional la valida.</p>'); e.n = el.querySelector(".eph-pct"); e.b = el.querySelector("i"); }
    el.style.display = "none"; e.el = el; e.vis = false; e.hgt = 0; flow.appendChild(el);
  });
  var evT = [0]; E.forEach(function (e) { evT.push(e.s); if (e.h < INF) evT.push(e.h); }); evT.sort(function (a, b) { return a - b; });
  var GAP = 8, C = 300;
  function measure() {
    GAP = parseFloat(getComputedStyle(flow).rowGap) || 8;
    C = body.clientHeight - (parseFloat(getComputedStyle(flow).bottom) || 0);
    E.forEach(function (e) { var d = e.el.style.display; e.el.style.display = ""; e.hgt = e.el.offsetHeight; e.el.style.display = d; });
  }
  function H(x) { var h = 0; E.forEach(function (e) { if (x >= e.s && x < e.h) h += e.hgt + GAP; }); return h; }
  function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ez(u) { return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
  function render(t) {
    var te = 0, i;
    for (i = 0; i < evT.length; i++) if (evT[i] <= t) te = evT[i];
    var dH = Math.min(H(te + 1e-6), C) - Math.min(H(te - 1e-6), C);
    flow.style.transform = "translateY(" + (dH * (1 - ez(cl((t - te) / .3)))).toFixed(2) + "px)";
    E.forEach(function (e) {
      var vis = t >= e.s && t < e.h;
      if (vis !== e.vis) { e.el.style.display = vis ? "" : "none"; e.vis = vis; }
      if (!vis) return;
      var u = ez(cl((t - e.s) / .28));
      e.el.style.opacity = u.toFixed(3); e.el.style.transform = "translateY(" + (8 * (1 - u)).toFixed(2) + "px)";
      if (e.k === "typ") { for (var d = 0; d < 3; d++) e.dots[d].style.transform = "translateY(" + (-.35 * Math.max(0, Math.sin(t * 7 - d * .9))).toFixed(3) + "em)"; }
      else if (e.k === "chips") { var p = (t >= e.tap) ? e.idx : -1; if (p !== e.pr) { e.os.forEach(function (o, j) { o.classList.toggle("pr", j === p); }); e.pr = p; } }
      else if (e.k === "prog") { var n = 2 + Math.round(27 * ez(cl((t - e.s - .3) / 3.6))); e.n.textContent = n + " de 29"; e.b.style.width = (n / 29 * 100).toFixed(1) + "%"; }
      else if (e.k === "res") { var pc = Math.round(59 * ez(cl((t - e.s - .3) / 1.1))); e.n.textContent = pc + " %"; e.b.style.width = pc + "%"; }
    });
  }
  var raf = 0, t0 = 0, last = 0, played = false, now = 0;
  function frame(ts) {
    var dt = Math.min(.1, (ts - last) / 1000); last = ts; now += dt; render(now);
    if (now >= END) { raf = 0; btn.hidden = false; return; }
    raf = requestAnimationFrame(frame);
  }
  function play() { cancelAnimationFrame(raf); played = true; btn.hidden = true; now = 0; last = performance.now(); render(0); raf = requestAnimationFrame(frame); }
  window.__eph = { seek: function (t) { measure(); render(t); }, END: END };
  measure(); render(reduce ? END : 0);
  if (window.ResizeObserver) new ResizeObserver(function () { measure(); render(now); }).observe(body);
  btn.addEventListener("click", play);
  if (reduce || /ephseek/.test(location.search)) return;
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting && !played) { io.disconnect(); setTimeout(play, 250); } }); }, { threshold: .55 });
    io.observe(root);
  } else play();
})();
