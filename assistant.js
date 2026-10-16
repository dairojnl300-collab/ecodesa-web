/* Asistente guiado ECODESA: menú de opciones, sin IA, sin guardar datos. Termina siempre en WhatsApp con un asesor. */
(function () {
  var WA = "573246886824";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var track = function (l) { try { if (window.ecodesaGoogleLoaded && typeof gtag === "function") gtag("event", "click", { event_category: "asistente", event_label: l, value: 1 }); } catch (e) {} };
  var CERT = "Los certificados y conceptos los emite cada autoridad según sus lineamientos. Nosotros te preparamos y te acompañamos para cumplirlos.";
  var VER = {
    "Sanidad": "Entidades territoriales de salud",
    "Seguridad contra incendios": "Cuerpo de Bomberos",
    "Seguridad y salud en el trabajo": "Ministerio del Trabajo, con apoyo de las ARL",
    "Uso del suelo y apertura": "Alcaldía y autoridad de planeación local",
    "Publicidad y espacio público": "Alcaldía",
    "Gestión del riesgo": "Consejo territorial de gestión del riesgo",
    "Seguridad química": "Autoridades competentes según la sustancia y la actividad",
    "Ambiental": "Autoridad ambiental competente",
    "Protección de datos": "Superintendencia de Industria y Comercio"
  };
  var S = [
    { id: "restaurantes", n: "Restaurantes", req: [{"a": "Sanidad", "items": ["Plan de saneamiento escrito, buenas prácticas de manufactura y capacitación anual de manipuladores (Resolución 2674 de 2013).", "Lavado y desinfección de los tanques de agua al menos cada seis meses (Decreto 1575 de 2007)."]}, {"a": "Seguridad contra incendios", "items": ["Concepto técnico sobre rutas de evacuación y señalización, extintores e instalación eléctrica (Ley 1575 de 2012, art. 42)."]}, {"a": "Seguridad y salud en el trabajo", "items": ["SG-SST y plan de prevención y respuesta ante emergencias (Decreto 1072 de 2015; Resolución 0312 de 2019)."]}, {"a": "Uso del suelo y apertura", "items": ["Cumplir el uso del suelo, tener matrícula mercantil y comunicar la apertura a la autoridad de planeación local (Ley 232 de 1995)."]}, {"a": "Ambiental", "items": ["Gestionar el aceite de cocina usado con gestores autorizados y no verterlo al alcantarillado ni al suelo (Resolución 316 de 2018; Decreto-Ley 2811 de 1974, art. 35)."]}], hac: ["Plan de saneamiento básico y control de plagas", "Programa de agua potable, limpieza y desinfección", "Manual de BPM", "Gestión de aceite de cocina usado", "SG-SST y planes de emergencia", "Análisis de laboratorio gestionados con laboratorios aliados"], plan: "Suscripción mensual.", wa: "Hola ECODESA, tengo un restaurante y me interesa la suscripción mensual.", cert: 1 },
    { id: "hoteles", n: "Hoteles y turismo", req: [{"a": "Sanidad", "items": ["Plan de saneamiento escrito y buenas prácticas en la cocina, con capacitación anual de manipuladores (Resolución 2674 de 2013).", "Lavado y desinfección de los tanques de agua al menos cada seis meses en establecimientos como hoteles (Decreto 1575 de 2007)."]}, {"a": "Seguridad contra incendios", "items": ["Concepto técnico sobre rutas de evacuación y señalización, extintores e instalación eléctrica (Ley 1575 de 2012, art. 42)."]}, {"a": "Seguridad y salud en el trabajo", "items": ["SG-SST y plan de prevención y respuesta ante emergencias (Decreto 1072 de 2015; Resolución 0312 de 2019). Incluye simulacro anual."]}, {"a": "Uso del suelo y apertura", "items": ["Cumplir el uso del suelo, tener matrícula mercantil y comunicar la apertura a la autoridad de planeación local (Ley 232 de 1995)."]}], hac: ["Saneamiento básico, agua potable y planes de emergencia", "SG-SST y capacitación", "Gestión de análisis con laboratorios aliados", "Todo reunido en un paquete anual"], plan: "Paquete anual.", wa: "Hola ECODESA, tengo un hotel y me interesa el paquete anual.", cert: 1 },
    { id: "comercio", n: "Comercio y locales", req: [{"a": "Seguridad contra incendios", "items": ["Concepto técnico sobre rutas de evacuación y señalización, extintores e instalación eléctrica (Ley 1575 de 2012, art. 42)."]}, {"a": "Seguridad y salud en el trabajo", "items": ["SG-SST y plan de prevención y respuesta ante emergencias (Decreto 1072 de 2015; Resolución 0312 de 2019)."]}, {"a": "Uso del suelo y apertura", "items": ["Cumplir el uso del suelo, tener matrícula mercantil y comunicar la apertura a la autoridad de planeación local (Ley 232 de 1995)."]}, {"a": "Publicidad y espacio público", "items": ["Registrar el aviso o publicidad exterior visual ante la autoridad local dentro de los 3 días hábiles siguientes a su colocación (Ley 140 de 1994)."]}], hac: ["Plan de emergencias", "Control de plagas", "SG-SST", "Registro de la publicidad exterior visual"], plan: "Kit de apertura.", wa: "Hola ECODESA, tengo un local comercial y me interesa el kit de apertura.", cert: 1 },
    { id: "industria", n: "Industria", req: [{"a": "Seguridad y salud en el trabajo", "items": ["SG-SST con estándares mínimos y plan de emergencias (Decreto 1072 de 2015; Resolución 0312 de 2019)."]}, {"a": "Seguridad química", "items": ["Etiquetas y fichas de datos de seguridad en español, inventario de químicos, capacitación anual y no trasvasar sin etiqueta (Resolución 773 de 2021)."]}, {"a": "Gestión del riesgo", "items": ["Plan de gestión del riesgo de desastres para actividades industriales (Decreto 2157 de 2017)."]}, {"a": "Ambiental", "items": ["Los permisos ambientales que la normativa exija según la actividad (vertimientos, emisiones, residuos)."]}], hac: ["SG-SST", "Programas de seguridad química y SGA", "Auditorías de riesgo químico", "Permisos de vertimiento y emisiones", "Plan de Manejo Ambiental de residuos", "Acompañamiento en ISO 45001"], plan: "Auditoría de brechas.", wa: "Hola ECODESA, somos una industria y nos interesa una auditoría de brechas.", cert: 1 },
    { id: "puertos", n: "Puertos y logística", req: [{"a": "Gestión del riesgo", "items": ["Plan de gestión del riesgo de desastres para el transporte y almacenamiento de carga (Decreto 2157 de 2017)."]}, {"a": "Seguridad y salud en el trabajo", "items": ["Programa de prevención de caídas, coordinador, certificados y permiso de trabajo en alturas (Resolución 4272 de 2021).", "SG-SST y plan de emergencias (Decreto 1072 de 2015; Resolución 0312 de 2019)."]}, {"a": "Ambiental", "items": ["Los permisos ambientales que la normativa exija según la actividad (vertimientos, residuos)."]}], hac: ["Plan de gestión del riesgo", "Planes de emergencia y contingencia", "SG-SST", "Plan de Manejo Ambiental de residuos", "Permisos de vertimiento"], wa: "Hola ECODESA, somos del sector portuario/logístico y queremos cotizar.", cert: 1 },
    { id: "construccion", n: "Construcción", req: [{"a": "Seguridad y salud en el trabajo", "items": ["Programa de prevención de caídas, coordinador, certificados y permiso de trabajo en alturas (Resolución 4272 de 2021).", "SG-SST y plan de emergencias (Decreto 1072 de 2015; Resolución 0312 de 2019)."]}, {"a": "Ambiental", "items": ["Los grandes generadores de residuos de construcción y demolición presentan su programa de manejo 30 días antes de iniciar y reportan cada trimestre (Resolución 1257 de 2021)."]}, {"a": "Gestión del riesgo", "items": ["Plan de gestión del riesgo de desastres para obras civiles mayores (Decreto 2157 de 2017)."]}], hac: ["SG-SST", "Plan de manejo de RCD y trámite PIN RCD", "Licencias y permisos ambientales"], wa: "Hola ECODESA, tengo una obra y quiero cotizar.", cert: 1 },
    { id: "digital", n: "Digital e IA", req: [{"a": "Protección de datos", "items": ["Autorización previa e informada del titular, política de tratamiento de datos y atención de sus derechos (Ley 1581 de 2012)."]}], hac: ["Páginas web y apps", "Marketing digital", "Automatización con IA", "Con los avisos y políticas que la normativa de datos exige"], wa: "Hola ECODESA, quiero cotizar una página web / app / marketing digital." },
    { id: "iso", n: "Auditoría ISO", txt: "Las normas ISO son voluntarias: sirven para demostrar cumplimiento y mejora continua. Realizamos auditorías internas de ISO 9001, ISO 14001 e ISO 45001 y te acompañamos a implementarlas. La certificación la otorga un organismo certificador externo.", wa: "Hola ECODESA, me interesa una auditoría interna ISO (9001, 14001 o 45001)." }
  ];
  var link = function (t) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(t); };

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }

  function build() {
    var btn = el("button", "as-btn"); btn.type = "button"; btn.setAttribute("aria-label", "Hablar con Ethan, asistente de ECODESA"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", "asPanel");
    btn.innerHTML = '<img class="as-av" src="assets/v2/robot-anim-128.webp" srcset="assets/v2/robot-anim-128.webp 1x, assets/v2/robot-anim-256.webp 2x" width="56" height="56" alt=""><span class="as-zz" aria-hidden="true"><i>z</i><i>z</i><i>Z</i></span><span class="as-btn-t">Habla con Ethan</span>';
    var panel = el("section", "as-panel"); panel.id = "asPanel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Ethan, asistente de ECODESA"); panel.hidden = true;
    var head = el("header", "as-head"); var hav = el("img", "as-hav"); hav.src = "assets/v2/robot-anim-128.webp"; hav.width = 44; hav.height = 44; hav.alt = ""; head.appendChild(hav); var hzz = el("span", "as-zz"); hzz.setAttribute("aria-hidden", "true"); hzz.innerHTML = "<i>z</i><i>z</i><i>Z</i>"; head.appendChild(hzz); var ht = el("div", "as-ht"); ht.appendChild(el("b", "", "Ethan")); ht.appendChild(el("small", "", "Asistente de ECODESA Ingeniería SAS")); head.appendChild(ht);
    var close = el("button", "as-x"); close.type = "button"; close.setAttribute("aria-label", "Cerrar asistente"); close.textContent = "×"; head.appendChild(close);
    var body = el("div", "as-body"); body.setAttribute("aria-live", "polite");
    var foot = el("p", "as-foot", "Información orientativa, no constituye oferta ni asesoría legal. El alcance, valor y condiciones se acuerdan por escrito con un asesor. No escribas datos personales en este chat. Al continuar por WhatsApp aplica nuestra ");
    var fl = el("a", "", "Política de datos"); fl.href = "/datos/"; fl.target = "_blank"; fl.rel = "noopener"; foot.appendChild(fl); foot.appendChild(document.createTextNode("."));
    panel.appendChild(head); panel.appendChild(body); panel.appendChild(foot);
    document.body.appendChild(btn); document.body.appendChild(panel);
    var hi = el("div", "as-hi"); hi.hidden = true;
    var hix = el("button", "as-hi-x", "\u00d7"); hix.type = "button"; hix.setAttribute("aria-label", "Cerrar saludo");
    hi.appendChild(hix); document.body.appendChild(hi);
    var hiOff = false, hiT = [];
    function hideHi() { hiOff = true; hiT.forEach(clearTimeout); hi.hidden = true; }
    function hiBubble(txt, last, done) {
      var b = el("button", "as-hb typing"); b.type = "button"; b.innerHTML = "<i></i><i></i><i></i>";
      if (last) b.classList.add("last");
      b.addEventListener("click", function () { hideHi(); if (panel.hidden) btn.click(); });
      hi.insertBefore(b, hix); hi.hidden = false;
      hiT.push(setTimeout(function () { if (hiOff) return; b.classList.remove("typing"); b.textContent = txt; if (done) done(); }, reduce ? 0 : 900));
    }
    hiT.push(setTimeout(function () {
      if (hiOff || !panel.hidden) return;
      hiBubble("Hola, soy Ethan.", false, function () {
        hiT.push(setTimeout(function () {
          if (hiOff) return;
          hiBubble("\u00bfEn qu\u00e9 te puedo ayudar?", true, function () { hiT.push(setTimeout(hideHi, 14000)); });
        }, 900));
      });
    }, 3000));
    hix.addEventListener("click", hideHi);

    var q = [], busy = false;
    function run() { if (busy || !q.length) return; busy = true; q.shift()(function () { busy = false; run(); }); }
    function toEnd() { body.scrollTop = body.scrollHeight; }
    function fill(b, t) {
      if (typeof t === "string") { b.textContent = t; return; }
      b.appendChild(el("strong", "as-h", t.h));
      if (t.groups) { t.groups.forEach(function (g) { b.appendChild(el("span", "as-sub", g.a)); if (VER[g.a]) b.appendChild(el("span", "as-ver", "Verifica: " + VER[g.a])); var u = el("ul", "as-ul"); g.items.forEach(function (x) { u.appendChild(el("li", "", x)); }); b.appendChild(u); }); }
      else { var ul = el("ul", "as-ul"); t.items.forEach(function (x) { ul.appendChild(el("li", "", x)); }); b.appendChild(ul); }
      if (t.f) b.appendChild(el("span", "as-f", t.f));
    }
    function say(t) {
      var len = typeof t === "string" ? t.length : t.h.length + (t.groups ? t.groups.map(function (g) { return g.items.join(""); }).join("") : t.items.join("")).length;
      q.push(function (done) {
        var b = el("div", "as-m bot");
        if (reduce) { fill(b, t); body.appendChild(b); toEnd(); done(); return; }
        var d = Math.min(1500, 600 + len * 8);
        b.classList.add("typing"); b.setAttribute("aria-hidden", "true"); face(lookNext(), d);
        b.innerHTML = '<i></i><i></i><i></i>'; body.appendChild(b); toEnd();
        setTimeout(function () {
          b.classList.remove("typing"); b.removeAttribute("aria-hidden"); b.textContent = ""; fill(b, t); toEnd(); done();
        }, d);
      });
      run();
    }
    function pick(t) { body.appendChild(el("div", "as-m me", t)); toEnd(); face("happy", 1400); }
    function opts(list) {
      q.push(function (done) {
        var w = el("div", "as-opts");
        list.forEach(function (o) {
          var e = o.href ? el("a", "as-o as-wa", o.t) : el("button", "as-o", o.t);
          if (o.href) { e.href = o.href; e.target = "_blank"; e.rel = "noopener"; e.addEventListener("click", function () { track("asistente_asesor_" + (o.id || "")); face("happy", 3500); }); }
          else { e.type = "button"; e.addEventListener("click", function () { w.remove(); o.fn(); }); }
          w.appendChild(e);
        });
        body.appendChild(w); toEnd(); done();
      });
      run();
    }
    function step(fn) { fn(); }
    function menu(first) {
      if (first) { say("Hola, soy Ethan, el asistente de ECODESA. Somos una firma fundada en Cartagena de Indias. Te ayudamos a cumplir lo que exigen las autoridades en gestión ambiental, SG-SST, saneamiento y gestión del riesgo, en Cartagena y a nivel nacional."); }
      step(function () {
        say("¿Qué tipo de negocio tienes?");
        var l = S.map(function (s) { return { t: s.n, fn: function () { pick(s.n); track("asistente_" + s.id); show(s); } }; });
        l.push({ t: "Otra consulta", fn: function () { pick("Otra consulta"); step(function () { say("Eso lo revisa un Profesional de nuestro equipo. Cuéntanos por WhatsApp."); opts([{ t: "Hablar con un asesor", id: "otra", href: link("Hola ECODESA, tengo una consulta.") }, { t: "Volver al menú", fn: function () { menu(false); } }]); }); } });
        opts(l);
      });
    }
    function show(s) {
      step(function () {
        if (s.txt) { say(s.txt); }
        else {
          say({ h: "Según la normativa, las autoridades pueden solicitarte:", groups: s.req, f: "Aplica según tu actividad y tamaño. ECODESA es una firma privada: no representa a estas autoridades ni emite sus certificados o conceptos. La mención de una autoridad es informativa y no implica aval ni relación con ella. Un asesor te confirma qué aplica a tu caso." });
          say({ h: "Si nos contratas, te acompañamos con:", items: s.hac, f: s.plan ? "Modalidad: " + s.plan.replace(/\.$/, "") + "." : "" });
          if (s.cert) say(CERT);
        }
        opts([{ t: "Hablar con un asesor", id: s.id, href: link(s.wa) }, { t: "Ver otro sector", fn: function () { menu(false); } }]);
      });
    }
    var started = false;
    var av = btn.querySelector(".as-av");
    var ANIM = "assets/v2/robot-anim-128.webp", ANIM_SET = "assets/v2/robot-anim-128.webp 1x, assets/v2/robot-anim-256.webp 2x";
    var CARAS = ["look-l", "look-r", "wide", "happy", "wink", "sleep"];
    var faceT = null, sleeping = false, asked = false, sleepT = 0, askT = 0, wipeT = 0, rndT = 0;
    function setFace(n) { var u = "assets/v2/robot-" + n + ".webp"; av.srcset = ""; av.src = u; hav.src = u; }
    function restoreFace() { av.srcset = ANIM_SET; av.src = ANIM; hav.removeAttribute("srcset"); hav.src = ANIM; av.classList.remove("lean"); }
    function face(n, ms, lean) {
      if (sleeping) return;
      clearTimeout(faceT); setFace(n); if (lean && !reduce) av.classList.add("lean");
      if (!reduce) { hav.classList.remove("pop"); void hav.offsetWidth; hav.classList.add("pop"); }
      faceT = setTimeout(function () { if (!sleeping) restoreFace(); }, ms || 1800);
    }
    function snooze(on) {
      sleeping = on; clearTimeout(faceT);
      btn.classList.toggle("sleep", on); head.classList.toggle("sleep", on);
      if (on) setFace("sleep"); else restoreFace();
    }
    setTimeout(function () { CARAS.forEach(function (n) { var i = new Image(); i.src = "assets/v2/robot-" + n + ".webp"; }); }, 2500);
    var lk = 0; function lookNext() { lk = 1 - lk; return lk ? "look-l" : "look-r"; }
    var tapN = 0; hav.style.cursor = "pointer";
    hav.addEventListener("click", function () { var t = ["happy", "wink", "wide", "look-r", "happy"]; sleeping && snooze(false); face(t[tapN++ % t.length], 1800); });
    function randomFace() {
      rndT = setTimeout(function () {
        if (!document.hidden && !sleeping && !reduce) {
          var n = ["look-l", "look-r", "wide", "wink", "look-r", "look-l"][Math.floor(Math.random() * 6)];
          face(n, n === "wide" ? 2400 : 1700, n === "wide" && panel.hidden);
        }
        randomFace();
      }, panel.hidden ? 6500 + Math.random() * 5500 : 3500 + Math.random() * 3000);
    }
    if (!reduce) randomFace();

    var TT = window.ecodesaAsistenteT || {}; var T_SLEEP = TT.sleep || 60000, T_ASK = TT.ask || 300000, T_WIPE = TT.wipe || 120000;
    function stopTimers() { clearTimeout(sleepT); clearTimeout(askT); clearTimeout(wipeT); }
    function bump() {
      if (asked) return;
      stopTimers();
      if (sleeping) { snooze(false); face("wide", 1200); }
      if (panel.hidden || !started) return;
      sleepT = setTimeout(function () { snooze(true); }, T_SLEEP);
      askT = setTimeout(ask, T_ASK);
    }
    function ask() {
      asked = true; snooze(false); face("wide", 2200);
      say("¿Sigues ahí? ¿Te puedo ayudar en otra cosa?");
      opts([
        { t: "Sí, sigo aquí", fn: function () { answered(); pick("Sí, sigo aquí"); face("happy", 2200); say("¡Perfecto! Sigo aquí para ayudarte."); menu(false); } },
        { t: "No, gracias", fn: function () { answered(); pick("No, gracias"); face("happy", 2600); say("Gracias por visitarnos. Aquí estaré cuando me necesites."); q.push(function (done) { setTimeout(function () { wipe(); done(); }, 2500); }); run(); } }
      ]);
      wipeT = setTimeout(wipe, T_WIPE);
    }
    function answered() { asked = false; clearTimeout(wipeT); bump(); }
    function wipe() {
      stopTimers(); asked = false; q = []; busy = false; body.textContent = ""; started = false; snooze(false);
      shut(true);
    }
    ["pointerdown", "keydown", "touchstart", "wheel"].forEach(function (ev) { panel.addEventListener(ev, bump, { passive: true }); });

    function open() {
      hideHi(); panel.hidden = false; btn.setAttribute("aria-expanded", "true"); btn.classList.add("on");
      if (!started) { started = true; menu(true); track("asistente_abierto"); face("happy", 2400); }
      bump(); close.focus();
    }
    function shut(nofocus) {
      panel.hidden = true; btn.setAttribute("aria-expanded", "false"); btn.classList.remove("on"); stopTimers(); if (!asked) snooze(false); if (nofocus !== true) btn.focus();
    }
    btn.addEventListener("click", function () { panel.hidden ? open() : shut(); });
    close.addEventListener("click", function () { shut(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) shut(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
