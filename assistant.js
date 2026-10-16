/* Asistente guiado ECODESA: menú de opciones, sin IA, sin guardar datos. Termina siempre en WhatsApp con un asesor. */
(function () {
  var WA = "573246886824";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var track = function (l) { try { if (window.ecodesaGoogleLoaded && typeof gtag === "function") gtag("event", "click", { event_category: "asistente", event_label: l, value: 1 }); } catch (e) {} };
  var CERT = "Los certificados y conceptos los emite cada autoridad según sus lineamientos. Nosotros te preparamos y te acompañamos para cumplirlos.";
  var S = [
    { id: "restaurantes", n: "Restaurantes", rev: "Saneamiento básico (plagas, agua potable, limpieza y desinfección), manipulación de alimentos, manejo de aceite usado y trampa de grasas, SG-SST, plan de emergencias y extintores.", hac: "Plan de saneamiento básico, control de plagas, programa de agua potable, limpieza y desinfección, manual de BPM, gestión de aceite de cocina usado, SG-SST y planes de emergencia. Los análisis de laboratorio los gestionamos con laboratorios aliados.", plan: "Suscripción mensual.", wa: "Hola ECODESA, tengo un restaurante y me interesa la suscripción mensual.", cert: 1 },
    { id: "hoteles", n: "Hoteles y turismo", rev: "Lo de cocinas, más agua potable y lavado de tanques, plan de emergencias con brigadas y simulacros, SG-SST y manejo de residuos.", hac: "Reunimos saneamiento básico, agua potable, planes de emergencia y SG-SST en un solo paquete anual, con capacitación y gestión de análisis con laboratorios aliados.", plan: "Paquete anual.", wa: "Hola ECODESA, tengo un hotel y me interesa el paquete anual.", cert: 1 },
    { id: "comercio", n: "Comercio y locales", rev: "Plan de emergencias y señalización, extintores, SG-SST con estándares mínimos, control de plagas y permiso de publicidad exterior visual.", hac: "Plan de emergencias, control de plagas, SG-SST y trámite de publicidad exterior visual para abrir o renovar tu local.", plan: "Kit de apertura.", wa: "Hola ECODESA, tengo un local comercial y me interesa el kit de apertura.", cert: 1 },
    { id: "industria", n: "Industria", rev: "SG-SST completo, seguridad química (hojas de seguridad y etiquetado), permisos ambientales por vertimientos, emisiones y residuos, y plan de emergencias.", hac: "SG-SST, programas de seguridad química y SGA, auditorías de riesgo químico, permisos de vertimiento y emisiones, Plan de Manejo Ambiental de residuos y acompañamiento en ISO 45001.", plan: "Auditoría de brechas.", wa: "Hola ECODESA, somos una industria y nos interesa una auditoría de brechas.", cert: 1 },
    { id: "puertos", n: "Puertos y logística", rev: "Plan de contingencia y gestión del riesgo, manejo de residuos y vertimientos, SG-SST con trabajos de alto riesgo (alturas y espacios confinados) y permisos ambientales.", hac: "Plan de gestión del riesgo, planes de emergencia y contingencia, SG-SST, Plan de Manejo Ambiental de residuos y permisos de vertimiento.", wa: "Hola ECODESA, somos del sector portuario/logístico y queremos cotizar.", cert: 1 },
    { id: "construccion", n: "Construcción", rev: "SG-SST de obra y trabajo en alturas, manejo de residuos de construcción y demolición, permisos ambientales y plan de emergencias.", hac: "SG-SST, plan de manejo de RCD, trámite PIN RCD y licencias y permisos ambientales.", wa: "Hola ECODESA, tengo una obra y quiero cotizar.", cert: 1 },
    { id: "digital", n: "Digital e IA", rev: "Política de tratamiento de datos personales, aviso de privacidad y cookies.", hac: "Páginas web, apps, marketing digital y automatización con IA, con los avisos y políticas que la normativa de datos exige.", wa: "Hola ECODESA, quiero cotizar una página web / app / marketing digital." },
    { id: "iso", n: "Auditoría ISO", txt: "Realizamos auditorías internas de ISO 9001, ISO 14001 e ISO 45001 y te acompañamos a implementarlas. La certificación la otorga un organismo certificador externo.", wa: "Hola ECODESA, me interesa una auditoría interna ISO (9001, 14001 o 45001)." }
  ];
  var link = function (t) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(t); };

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }

  function build() {
    var btn = el("button", "as-btn"); btn.type = "button"; btn.setAttribute("aria-label", "Hablar con Ethan, asistente de ECODESA"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", "asPanel");
    btn.innerHTML = '<img class="as-av" src="assets/v2/robot-anim-128.webp" srcset="assets/v2/robot-anim-128.webp 1x, assets/v2/robot-anim-256.webp 2x" width="56" height="56" alt=""><span class="as-zz" aria-hidden="true"><i>z</i><i>z</i><i>Z</i></span><span class="as-btn-t">Habla con Ethan</span>';
    var panel = el("section", "as-panel"); panel.id = "asPanel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Ethan, asistente de ECODESA"); panel.hidden = true;
    var head = el("header", "as-head"); var hav = el("img", "as-hav"); hav.src = "assets/v2/robot-anim-128.webp"; hav.width = 44; hav.height = 44; hav.alt = ""; head.appendChild(hav); var hzz = el("span", "as-zz"); hzz.setAttribute("aria-hidden", "true"); hzz.innerHTML = "<i>z</i><i>z</i><i>Z</i>"; head.appendChild(hzz); var ht = el("div", "as-ht"); ht.appendChild(el("b", "", "Ethan")); ht.appendChild(el("small", "", "Asistente de ECODESA · Ambiente y SST")); head.appendChild(ht);
    var close = el("button", "as-x"); close.type = "button"; close.setAttribute("aria-label", "Cerrar asistente"); close.textContent = "×"; head.appendChild(close);
    var body = el("div", "as-body"); body.setAttribute("aria-live", "polite");
    var foot = el("p", "as-foot", "Información orientativa, no constituye oferta ni asesoría legal. El alcance, valor y condiciones se acuerdan por escrito con un asesor. No escribas datos personales en este chat. Al continuar por WhatsApp aplica nuestra ");
    var fl = el("a", "", "Política de datos"); fl.href = "/datos/"; fl.target = "_blank"; fl.rel = "noopener"; foot.appendChild(fl); foot.appendChild(document.createTextNode("."));
    panel.appendChild(head); panel.appendChild(body); panel.appendChild(foot);
    document.body.appendChild(btn); document.body.appendChild(panel);
    var hi = el("div", "as-hi"); hi.hidden = true;
    var hit = el("button", "as-hi-t", "Hola, me llamo Ethan. ¿Te ayudo?"); hit.type = "button";
    var hix = el("button", "as-hi-x", "\u00d7"); hix.type = "button"; hix.setAttribute("aria-label", "Cerrar saludo");
    hi.appendChild(hit); hi.appendChild(hix); document.body.appendChild(hi);
    function hideHi(save) { hi.hidden = true; if (save) { try { sessionStorage.setItem("ecodesa-as-hi", "1"); } catch (e) {} } }
    var seen = false; try { seen = sessionStorage.getItem("ecodesa-as-hi") === "1"; } catch (e) {}
    if (!seen) {
      setTimeout(function () { if (panel.hidden) { hi.hidden = false; setTimeout(function () { hideHi(true); }, 10000); } }, 4000);
    }
    hix.addEventListener("click", function () { hideHi(true); });
    hit.addEventListener("click", function () { hideHi(true); btn.click(); });

    var q = [], busy = false;
    function run() { if (busy || !q.length) return; busy = true; q.shift()(function () { busy = false; run(); }); }
    function toEnd() { body.scrollTop = body.scrollHeight; }
    function say(t) {
      q.push(function (done) {
        var b = el("div", "as-m bot");
        if (reduce) { b.textContent = t; body.appendChild(b); toEnd(); done(); return; }
        b.classList.add("typing"); b.setAttribute("aria-hidden", "true");
        b.innerHTML = '<i></i><i></i><i></i>'; body.appendChild(b); toEnd();
        setTimeout(function () {
          b.classList.remove("typing"); b.removeAttribute("aria-hidden"); b.textContent = t; toEnd(); done();
        }, Math.min(1500, 600 + t.length * 11));
      });
      run();
    }
    function pick(t) { body.appendChild(el("div", "as-m me", t)); toEnd(); }
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
          say("Lo que suelen revisar las autoridades: " + s.rev);
          say("Lo que hacemos: " + s.hac + (s.plan ? " Plan: " + s.plan : ""));
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
      faceT = setTimeout(function () { if (!sleeping) restoreFace(); }, ms || 1800);
    }
    function snooze(on) {
      sleeping = on; clearTimeout(faceT);
      btn.classList.toggle("sleep", on); head.classList.toggle("sleep", on);
      if (on) setFace("sleep"); else restoreFace();
    }
    setTimeout(function () { CARAS.forEach(function (n) { var i = new Image(); i.src = "assets/v2/robot-" + n + ".webp"; }); }, 2500);
    function randomFace() {
      rndT = setTimeout(function () {
        if (!document.hidden && !sleeping && !reduce) {
          var n = ["look-l", "look-r", "wide", "wink", "look-r", "look-l"][Math.floor(Math.random() * 6)];
          face(n, n === "wide" ? 2400 : 1700, n === "wide" && panel.hidden);
        }
        randomFace();
      }, 6500 + Math.random() * 5500);
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
      hideHi(true); panel.hidden = false; btn.setAttribute("aria-expanded", "true"); btn.classList.add("on");
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
