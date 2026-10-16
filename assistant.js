/* Asistente guiado ECODESA: menú de opciones, sin IA, sin guardar datos. Termina siempre en WhatsApp con un asesor. */
(function () {
  var WA = "573246886824";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var track = function (l) { try { if (window.ecodesaGoogleLoaded && typeof gtag === "function") gtag("event", "click", { event_category: "asistente", event_label: l, value: 1 }); } catch (e) {} };
  var CERT = "Los certificados y conceptos los emite cada autoridad según sus lineamientos. Nosotros te preparamos y te acompañamos para cumplirlos.";
  var S = [
    { id: "restaurantes", n: "Restaurantes", rev: "Saneamiento básico (plagas, agua potable, limpieza y desinfección), manipulación de alimentos, manejo de aceite usado y trampa de grasas, SG-SST, plan de emergencias y extintores.", hac: "Diagnóstico de brechas, plan de saneamiento básico, BPM, SG-SST, plan de emergencias y capacitaciones. Gestionamos los análisis de laboratorio con laboratorios aliados.", plan: "Suscripción mensual.", wa: "Hola ECODESA, tengo un restaurante y me interesa la suscripción mensual.", cert: 1 },
    { id: "hoteles", n: "Hoteles y turismo", rev: "Lo de cocinas, más agua potable y lavado de tanques, plan de emergencias con brigadas y simulacros, SG-SST y manejo de residuos.", hac: "Reunimos saneamiento, agua potable, emergencias y SG-SST en un solo paquete anual, con capacitaciones y gestión de laboratorios aliados.", plan: "Paquete anual.", wa: "Hola ECODESA, tengo un hotel y me interesa el paquete anual.", cert: 1 },
    { id: "comercio", n: "Comercio y locales", rev: "Plan de emergencias y señalización, extintores, SG-SST con estándares mínimos, control de plagas y permiso de publicidad exterior visual.", hac: "Te organizamos los requisitos para abrir o renovar tu local.", plan: "Kit de apertura.", wa: "Hola ECODESA, tengo un local comercial y me interesa el kit de apertura.", cert: 1 },
    { id: "industria", n: "Industria", rev: "SG-SST completo, seguridad química (hojas de seguridad y etiquetado), permisos ambientales por vertimientos, emisiones y residuos, y plan de emergencias.", hac: "Auditoría de brechas, SG-SST, seguridad química, permisos ambientales y acompañamiento para implementar ISO 45001.", plan: "Auditoría de brechas.", wa: "Hola ECODESA, somos una industria y nos interesa una auditoría de brechas.", cert: 1 },
    { id: "puertos", n: "Puertos y logística", rev: "Plan de contingencia y gestión del riesgo, manejo de residuos y vertimientos, SG-SST con trabajos de alto riesgo (alturas y espacios confinados) y permisos ambientales.", hac: "Gestión del riesgo, planes de emergencia, SG-SST y gestión ambiental para tu operación.", wa: "Hola ECODESA, somos del sector portuario/logístico y queremos cotizar.", cert: 1 },
    { id: "construccion", n: "Construcción", rev: "SG-SST de obra y trabajo en alturas, manejo de residuos de construcción y demolición, permisos ambientales y plan de emergencias.", hac: "SG-SST de obra, plan de manejo de residuos de construcción y acompañamiento en los trámites ambientales.", wa: "Hola ECODESA, tengo una obra y quiero cotizar.", cert: 1 },
    { id: "digital", n: "Digital e IA", rev: "Política de tratamiento de datos personales, aviso de privacidad y cookies.", hac: "Páginas web, apps, marketing digital y automatización con IA, con los avisos y políticas que la normativa de datos exige.", wa: "Hola ECODESA, quiero cotizar una página web / app / marketing digital." },
    { id: "iso", n: "Auditoría ISO", txt: "Realizamos auditorías internas de ISO 9001, ISO 14001 e ISO 45001 y te acompañamos a implementarlas. La certificación la otorga un organismo certificador externo.", wa: "Hola ECODESA, me interesa una auditoría interna ISO (9001, 14001 o 45001)." }
  ];
  var link = function (t) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(t); };

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }

  function build() {
    var btn = el("button", "as-btn"); btn.type = "button"; btn.setAttribute("aria-label", "Hablar con Ethan, asistente de ECODESA"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", "asPanel");
    btn.innerHTML = '<img class="as-av" src="assets/v2/robot-anim-128.webp" srcset="assets/v2/robot-anim-128.webp 1x, assets/v2/robot-anim-256.webp 2x" width="56" height="56" alt=""><span class="as-btn-t">Habla con Ethan</span>';
    var panel = el("section", "as-panel"); panel.id = "asPanel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Ethan, asistente de ECODESA"); panel.hidden = true;
    var head = el("header", "as-head"); var hav = el("img", "as-hav"); hav.src = "assets/v2/robot-anim-128.webp"; hav.width = 44; hav.height = 44; hav.alt = ""; head.appendChild(hav); var ht = el("div", "as-ht"); ht.appendChild(el("b", "", "Ethan")); ht.appendChild(el("small", "", "Asistente de ECODESA · Ambiente y SST")); head.appendChild(ht);
    var close = el("button", "as-x"); close.type = "button"; close.setAttribute("aria-label", "Cerrar asistente"); close.textContent = "×"; head.appendChild(close);
    var body = el("div", "as-body"); body.setAttribute("aria-live", "polite");
    var foot = el("p", "as-foot", "Información orientativa, no constituye oferta ni asesoría legal. El alcance, valor y condiciones se acuerdan por escrito con un asesor. No escribas datos personales en este chat. Al continuar por WhatsApp aplica nuestra ");
    var fl = el("a", "", "Política de datos"); fl.href = "/datos/"; fl.target = "_blank"; fl.rel = "noopener"; foot.appendChild(fl); foot.appendChild(document.createTextNode("."));
    panel.appendChild(head); panel.appendChild(body); panel.appendChild(foot);
    document.body.appendChild(btn); document.body.appendChild(panel);

    function say(t, delay) { var b = el("div", "as-m bot", t); body.appendChild(b); return b; }
    function pick(t) { body.appendChild(el("div", "as-m me", t)); }
    function opts(list) {
      var w = el("div", "as-opts");
      list.forEach(function (o) {
        var e = o.href ? el("a", "as-o as-wa", o.t) : el("button", "as-o", o.t);
        if (o.href) { e.href = o.href; e.target = "_blank"; e.rel = "noopener"; e.addEventListener("click", function () { track("asistente_asesor_" + (o.id || "")); }); }
        else { e.type = "button"; e.addEventListener("click", function () { w.remove(); o.fn(); }); }
        w.appendChild(e);
      });
      body.appendChild(w); body.scrollTop = body.scrollHeight;
    }
    function step(fn) { if (reduce) fn(); else setTimeout(fn, 380); }
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
    function open() { panel.hidden = false; btn.setAttribute("aria-expanded", "true"); btn.classList.add("on"); if (!started) { started = true; menu(true); track("asistente_abierto"); } close.focus(); }
    function shut() { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); btn.classList.remove("on"); btn.focus(); }
    btn.addEventListener("click", function () { panel.hidden ? open() : shut(); });
    close.addEventListener("click", shut);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) shut(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
