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
    "Forestal": "Autoridad ambiental competente",
    "Publicidad al consumidor": "Superintendencia de Industria y Comercio",
    "Protección de datos": "Superintendencia de Industria y Comercio"
  };
  var SAN = ["Plan de saneamiento escrito con limpieza y desinfección, manejo de residuos sólidos y líquidos, control integral de plagas y agua potable (Resolución 2674 de 2013, art. 26).", "Certificado médico de aptitud de cada manipulador de alimentos y plan de capacitación (Resolución 2674 de 2013, arts. 11 a 13).", "Control de temperaturas y prevención de la contaminación cruzada en la preparación (Resolución 2674 de 2013, arts. 16 y 18).", "Lavado y desinfección de los tanques de agua al menos cada seis meses (Decreto 1575 de 2007).", "En la visita se califican 6 aspectos: instalaciones, saneamiento, manipuladores, equipos, almacenamiento y alimentos. Con menos de 60 puntos el concepto es desfavorable (acta de inspección sanitaria con enfoque de riesgo)."];
  var INC = ["Concepto técnico sobre seguridad humana y protección contra incendios (Ley 1575 de 2012, art. 42).", "Extintores portátiles según el riesgo, diseñados con NTC 2885 y NFPA 10 (NSR-10, J.4.3).", "Rutas de evacuación, salidas y señalización acordes con la carga de ocupación (NSR-10, Título K).", "Cortes de gas y electricidad de fácil acceso e instalaciones eléctricas conforme al RETIE (NSR-10, J.2.2).", "Brigada de emergencias capacitada en evacuación, fuego incipiente, uso de extintores y primeros auxilios, con al menos el 20 % del personal y reentrenamiento anual (Decreto 1072 de 2015; Resolución 256 de 2014, arts. 5 y 16)."];
  var ACU = ["Inscribirse como generador de aceite de cocina usado, entregarlo solo a gestores inscritos, capacitar al personal, conservar las constancias del gestor y reportar cada año en los primeros 15 días de enero (Resolución 316 de 2018, art. 9).", "No verter el aceite de cocina usado al alcantarillado, a fuentes de agua ni al suelo (Resolución 316 de 2018, art. 13)."];
  var SST = {
    "1 a 10": "SG-SST con 7 estándares mínimos si tienes hasta 10 trabajadores en riesgo I, II o III, o con 60 si tu actividad es de riesgo IV o V (Resolución 0312 de 2019).",
    "11 a 50": "SG-SST con 21 estándares mínimos si tienes entre 11 y 50 trabajadores en riesgo I, II o III, o con 60 si tu actividad es de riesgo IV o V (Resolución 0312 de 2019).",
    "Más de 50": "SG-SST con 60 estándares mínimos si tienes más de 50 trabajadores, o si tu actividad es de riesgo IV o V (Resolución 0312 de 2019)."
  };
  var AUTO = "Autoevaluación anual de estándares mínimos y plan de mejoramiento (Resolución 0312 de 2019, arts. 27 y 28).";
  var EMER = "Plan de prevención, preparación y respuesta ante emergencias, con simulacro al menos una vez al año (Decreto 1072 de 2015, art. 2.2.4.6.25).";
  var HT = {
    "Sanidad": ["Plan de saneamiento básico: limpieza y desinfección, residuos, control de plagas y agua potable", "Manual de BPM y plan de capacitación de manipuladores", "Análisis de laboratorio gestionados con laboratorios aliados", "Revisión previa de los aspectos que califica la visita sanitaria"],
    "Seguridad contra incendios": ["Plan de emergencias y contingencia", "Revisión de extintores, rutas de evacuación y señalización", "Organización de la brigada de emergencias y su plan de capacitación", "Simulacros"],
    "Seguridad y salud en el trabajo": ["Diseño e implementación del SG-SST", "Autoevaluación de estándares mínimos y plan de mejoramiento", "Plan de prevención, preparación y respuesta ante emergencias", "Simulacro anual"],
    "Uso del suelo y apertura": ["Revisión de los requisitos de apertura (Ley 232 de 1995)", "Acompañamiento en la consulta de uso del suelo"],
    "Publicidad y espacio público": ["Registro de la publicidad exterior visual"],
    "Gestión del riesgo": ["Plan de gestión del riesgo de desastres", "Planes de emergencia y contingencia", "Simulacros"],
    "Seguridad química": ["Programas de seguridad química y SGA", "Auditorías de riesgo químico"],
    "Protección de datos": ["Avisos y política de tratamiento de datos en tu web o app"],
    "Publicidad al consumidor": ["Marketing digital y gestión de redes sociales", "Campañas de pauta digital", "Revisión de textos publicitarios de tu web y redes"],
    "Forestal": ["Inventarios forestales", "Trámite de autorizaciones de tala, poda y aprovechamiento forestal", "Tala, poda y aprovechamiento forestal", "Reforestación y compensación ambiental"]
  };
  var HA = {
    restaurantes: ["Gestión del aceite de cocina usado: inscripción como generador, entrega a gestor inscrito y reporte anual", "Capacitación del personal en el manejo del aceite usado"],
    hoteles: ["Gestión del aceite de cocina usado: inscripción como generador, entrega a gestor inscrito y reporte anual", "Capacitación del personal en el manejo del aceite usado"],
    industria: ["Concesión de aguas", "Permisos de vertimiento y emisiones", "Permiso de ocupación de cauce", "Caracterización y toma de muestras de agua, suelo, ruido y aire", "Plan de gestión integral de residuos peligrosos", "Licencias ambientales y Planes de Manejo Ambiental (PMA)"],
    puertos: ["Concesión de aguas", "Permisos de vertimiento y emisiones", "Permiso de ocupación de cauce", "Caracterización y toma de muestras de agua, suelo, ruido y aire", "Plan de gestión integral de residuos peligrosos", "Licencias ambientales y Planes de Manejo Ambiental (PMA)", "Manejo de residuos de embarcaciones en puerto"],
    construccion: ["Plan de manejo de RCD y trámite PIN RCD", "Plan de manejo ambiental de obra"].concat(["Concesión de aguas", "Permisos de vertimiento y emisiones", "Permiso de ocupación de cauce", "Caracterización y toma de muestras de agua, suelo, ruido y aire", "Plan de gestión integral de residuos peligrosos", "Licencias ambientales y Planes de Manejo Ambiental (PMA)"])
  };
  var AMB = ["Concesión de aguas si captas agua de una fuente superficial o subterránea (Decreto 1076 de 2015, art. 2.2.3.2.7.1).", "Permiso de vertimientos si descargas aguas residuales a aguas superficiales, marinas o al suelo, sin conexión al alcantarillado público, y cumplir los parámetros de vertimiento (Decreto 1076 de 2015, art. 2.2.3.3.5.1; Resolución 631 de 2015).", "Permiso de emisión atmosférica para las fuentes fijas que lo requieran (Decreto 1076 de 2015, art. 2.2.5.1.7.2).", "Permiso de ocupación de cauce para obras en cauces o depósitos de agua (Decreto 1076 de 2015, art. 2.2.3.2.12.1).", "Plan de gestión integral de residuos peligrosos, entrega a gestores autorizados e inscripción como generador desde 10 kg al mes (Decreto 1076 de 2015, arts. 2.2.6.1.3.1 y 2.2.6.1.6.2; Resolución 1362 de 2007).", "Licencia ambiental para los proyectos, obras o actividades que la normativa lista (Decreto 1076 de 2015, arts. 2.2.2.3.2.2 y 2.2.2.3.2.3)."];
  var FOR = ["Autorización para talar o podar árboles aislados en zona urbana que causen daños a suelos, canales, vías o edificaciones (Decreto 1076 de 2015, art. 2.2.1.1.9.3).", "Autorización para talar, trasplantar o reubicar árboles aislados por obras públicas o privadas, con reposición de especies (Decreto 1076 de 2015, art. 2.2.1.1.9.4).", "Permiso o autorización de aprovechamiento forestal de bosques naturales o flora silvestre (Decreto 1076 de 2015, art. 2.2.1.1.7.1)."];
  var PUB = ["Información clara, veraz y suficiente en la publicidad de tus productos o servicios, sin publicidad engañosa (Ley 1480 de 2011, arts. 23 y 30).", "Autorización del titular para usar sus datos en bases de contacto y envíos comerciales (Ley 1581 de 2012)."];
  var ISOH = ["Diseño e implementación del sistema de gestión integral ISO 9001, ISO 14001 e ISO 45001", "Auditorías internas ISO 9001, 14001 y 45001", "Preparación para la auditoría de certificación"];
  var MKT = ["Páginas web y apps a la medida", "Marketing digital y gestión de redes sociales", "SEO y posicionamiento web", "Campañas de pauta digital", "Tableros Power BI para tus indicadores", "Automatización con IA"];
  var ALTO = ["industria", "puertos", "construccion"];
  var S = [
    { id: "restaurantes", n: "Restaurantes", u: "tu restaurante", acu: 1, req: [{"a": "Sanidad", "items": SAN}, {"a": "Seguridad contra incendios", "nota": "La inspección revisa, con referencia en la NSR-10:", "items": INC}, {"a": "Seguridad y salud en el trabajo", "items": []}, {"a": "Uso del suelo y apertura", "items": ["Cumplir el uso del suelo, tener matrícula mercantil y comunicar la apertura a la autoridad de planeación local (Ley 232 de 1995).", "Si hay música en público, comprobantes de pago de derechos de autor (Ley 232 de 1995, art. 2, lit. c)."]}], hac: ["Plan de saneamiento básico y control de plagas", "Programa de agua potable, limpieza y desinfección", "Manual de BPM", "Gestión de aceite de cocina usado", "SG-SST y planes de emergencia", "Análisis de laboratorio gestionados con laboratorios aliados"], plan: "Suscripción mensual.", wa: "Hola ECODESA, tengo un restaurante y me interesa la suscripción mensual.", cert: 1 },
    { id: "hoteles", n: "Hoteles y turismo", u: "tu hotel", acu: 1, req: [{"a": "Sanidad", "items": SAN}, {"a": "Seguridad contra incendios", "nota": "La inspección revisa, con referencia en la NSR-10:", "items": INC}, {"a": "Seguridad y salud en el trabajo", "items": []}, {"a": "Uso del suelo y apertura", "items": ["Cumplir el uso del suelo, tener matrícula mercantil y comunicar la apertura a la autoridad de planeación local (Ley 232 de 1995).", "Si hay música en público, comprobantes de pago de derechos de autor (Ley 232 de 1995, art. 2, lit. c)."]}, {"a": "Forestal", "items": FOR}], hac: ["Saneamiento básico, agua potable y planes de emergencia", "SG-SST y capacitación", "Gestión de análisis con laboratorios aliados", "Todo reunido en un paquete anual"], plan: "Paquete anual.", wa: "Hola ECODESA, tengo un hotel y me interesa el paquete anual.", cert: 1 },
    { id: "comercio", u: "tu local", n: "Comercio y locales", req: [{"a": "Seguridad contra incendios", "nota": "La inspección revisa, con referencia en la NSR-10:", "items": INC}, {"a": "Seguridad y salud en el trabajo", "items": []}, {"a": "Uso del suelo y apertura", "items": ["Cumplir el uso del suelo, tener matrícula mercantil y comunicar la apertura a la autoridad de planeación local (Ley 232 de 1995).", "Si hay música en público, comprobantes de pago de derechos de autor (Ley 232 de 1995, art. 2, lit. c)."]}, {"a": "Publicidad y espacio público", "items": ["Registrar el aviso o publicidad exterior visual ante la autoridad local dentro de los 3 días hábiles siguientes a su colocación (Ley 140 de 1994)."]}], hac: ["Plan de emergencias", "Control de plagas", "SG-SST", "Registro de la publicidad exterior visual"], plan: "Kit de apertura.", wa: "Hola ECODESA, tengo un local comercial y me interesa el kit de apertura.", cert: 1 },
    { id: "industria", u: "tu empresa", n: "Industria", req: [{"a": "Seguridad y salud en el trabajo", "items": []}, {"a": "Seguridad química", "items": ["Etiquetas y fichas de datos de seguridad en español, inventario de químicos, capacitación anual y no trasvasar sin etiqueta (Resolución 773 de 2021)."]}, {"a": "Gestión del riesgo", "items": ["Plan de gestión del riesgo de desastres para actividades industriales (Decreto 2157 de 2017)."]}, {"a": "Ambiental", "items": AMB}, {"a": "Forestal", "items": FOR}], hac: ["SG-SST", "Programas de seguridad química y SGA", "Auditorías de riesgo químico", "Permisos de vertimiento y emisiones", "Plan de Manejo Ambiental de residuos", "Acompañamiento en ISO 45001"], plan: "Auditoría de brechas.", wa: "Hola ECODESA, somos una industria y nos interesa una auditoría de brechas.", cert: 1 },
    { id: "puertos", u: "tu operación", n: "Puertos y logística", req: [{"a": "Gestión del riesgo", "items": ["Plan de gestión del riesgo de desastres para el transporte y almacenamiento de carga (Decreto 2157 de 2017)."]}, {"a": "Seguridad y salud en el trabajo", "items": ["Programa de prevención de caídas, coordinador, certificados y permiso de trabajo en alturas (Resolución 4272 de 2021)."]}, {"a": "Ambiental", "items": AMB}, {"a": "Forestal", "items": FOR}], hac: ["Plan de gestión del riesgo", "Planes de emergencia y contingencia", "SG-SST", "Plan de Manejo Ambiental de residuos", "Permisos de vertimiento"], wa: "Hola ECODESA, somos del sector portuario/logístico y queremos cotizar.", cert: 1 },
    { id: "construccion", u: "tu obra", n: "Construcción", req: [{"a": "Seguridad y salud en el trabajo", "items": ["Programa de prevención de caídas, coordinador, certificados y permiso de trabajo en alturas (Resolución 4272 de 2021)."]}, {"a": "Ambiental", "items": ["Los grandes generadores de residuos de construcción y demolición presentan su programa de manejo 30 días antes de iniciar y reportan cada trimestre (Resolución 1257 de 2021)."].concat(AMB)}, {"a": "Forestal", "items": FOR}, {"a": "Gestión del riesgo", "items": ["Plan de gestión del riesgo de desastres para obras civiles mayores (Decreto 2157 de 2017)."]}], hac: ["SG-SST", "Plan de manejo de RCD y trámite PIN RCD", "Licencias y permisos ambientales"], wa: "Hola ECODESA, tengo una obra y quiero cotizar.", cert: 1 },
        { id: "digital", u: "tu negocio", n: "Digital y marketing", req: [{"a": "Protección de datos", "items": ["Autorización previa e informada del titular, política de tratamiento de datos y atención de sus derechos (Ley 1581 de 2012)."]}, {"a": "Publicidad al consumidor", "items": PUB}], hac: ["Páginas web y apps a la medida", "Software y tableros Power BI para indicadores ambientales, SST y gestión del riesgo", "Automatización con IA", "Marketing digital y gestión de redes sociales", "SEO y posicionamiento web", "Campañas de pauta digital", "Avisos y política de tratamiento de datos", ISOH[0]], wa: "Hola ECODESA, quiero cotizar una página web / app / marketing digital." },
    { id: "iso", n: "Sistema de gestión integral (ISO)", txt: "Cualquier empresa, de cualquier sector, puede implementar un sistema de gestión integral con ISO 9001 (calidad), ISO 14001 (ambiental) e ISO 45001 (seguridad y salud en el trabajo). Son normas voluntarias: sirven para demostrar cumplimiento y mejora continua.", hac: ISOH, f: "La certificación la otorga un organismo certificador externo.", wa: "Hola ECODESA, me interesa un sistema de gestión integral ISO (9001, 14001 y 45001)." }
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
      if (t.groups) { t.groups.forEach(function (g) { b.appendChild(el("span", "as-sub", g.a)); if (VER[g.a] && !t.noVer) b.appendChild(el("span", "as-ver", "Verifica: " + VER[g.a])); if (g.nota) b.appendChild(el("span", "as-nota", g.nota)); var u = el("ul", "as-ul"); g.items.forEach(function (x) { u.appendChild(el("li", "", x)); }); b.appendChild(u); }); }
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
      var tieneVolver = list.some(function (o) { return /^Volver/.test(o.t); });
      var esMenu = list.some(function (o) { return o.t === "Otra consulta"; });
      if (!tieneVolver && !esMenu) list = list.concat([{ t: "Volver al menú principal", fn: function () { menu(false); } }]);
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
    var vueltas = 0;
    var BARRIOS = null;
    function nrm(x) { return String(x).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\./g, "").replace(/\s+/g, " ").trim().toUpperCase(); }
    function cargarBarrios(cb) {
      if (BARRIOS) return cb(BARRIOS);
      fetch("/ethan/barrios-ucg.json", { cache: "no-cache" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { if (d && d.barrios) { BARRIOS = d.barrios.map(function (b) { b.k = nrm(b.clave); return b; }); } cb(BARRIOS); })
        .catch(function () { cb(null); });
    }
    function pedirBarrio(cb) {
      step(function () {
        say("Escribe tu barrio y te digo en qué localidad estás.");
        q.push(function (done) {
          var w = el("form", "as-opts as-form");
          var inp = el("input", "as-in"); inp.type = "text"; inp.placeholder = "Ej.: Manga"; inp.maxLength = 60; inp.setAttribute("aria-label", "Barrio");
          var go = el("button", "as-o", "Buscar"); go.type = "submit";
          var back = el("button", "as-o", "Volver al menú principal"); back.type = "button";
          back.addEventListener("click", function () { w.remove(); pick("Volver al menú principal"); menu(false); });
          w.appendChild(inp); w.appendChild(go); w.appendChild(back); body.appendChild(w); toEnd(); done();
          w.addEventListener("submit", function (e) { e.preventDefault(); var v = inp.value.trim(); if (!v) return; w.remove(); pick(v); buscarBarrio(v, cb); });
        });
        run();
      });
    }
    function buscarBarrio(v, cb) {
      cargarBarrios(function (lista) {
        if (!lista) { say("No pude cargar la lista de barrios en este momento. Un asesor te ubica por WhatsApp."); if (cb) return cb(); opts([{ t: "Hablar con un asesor", id: "ubicar", href: link("Hola ECODESA, quiero saber mi localidad.") }, { t: "Volver al menú principal", fn: function () { menu(false); } }]); return; }
        var k = nrm(v);
        var hit = lista.filter(function (b) { return b.k === k || b.k === "EL " + k || b.k === "LA " + k; });
        hit.sort(function (a, b) { return (a.rural ? 1 : 0) - (b.rural ? 1 : 0); });
        var b = hit[0];
        if (!b) {
          say("No encuentro ese barrio en nuestra lista. Un asesor te ubica por WhatsApp.");
          if (cb) return cb();
          opts([{ t: "Hablar con un asesor", id: "ubicar", href: link("Hola ECODESA, quiero saber mi localidad. Mi barrio es " + v + ".") }, { t: "Intentar otro barrio", fn: function () { pedirBarrio(cb); } }, { t: "Volver al menú principal", fn: function () { menu(false); } }]);
          return;
        }
        if (b.rural) {
          say("Ese nombre corresponde a zona rural de " + b.localidad + " (" + b.nombre_localidad + "). Un asesor confirma la UCG de tu predio.");
          if (cb) return cb();
          opts([{ t: "Hablar con un asesor", id: "ubicar", href: link("Hola ECODESA, estoy en zona rural de " + b.localidad + " (" + b.barrio + ").") }, { t: "Volver al menú principal", fn: function () { menu(false); } }]);
          return;
        }
        say("Tu barrio está en la " + b.localidad + ": " + b.nombre_localidad + ". Código de unidad comunera: UCG " + b.ucg + ".");
        LOC = b;
        if (cb) return cb();
        opts([{ t: "Hablar con un asesor", id: "ubicar", href: link("Hola ECODESA, estoy en " + b.localidad + ", UCG " + b.ucg + " (" + b.barrio + "). Quiero información de servicios ambientales.") }, { t: "Volver al menú principal", fn: function () { menu(false); } }]);
      });
    }

    function menu(first) {
      var ayudaAsesor = false;
      if (!first) { vueltas += 1; ayudaAsesor = vueltas >= 2; }
      if (first) { say("Hola, soy Ethan, el asistente de ECODESA, firma fundada en Cartagena de Indias. Te ayudamos a cumplir la normativa a nivel nacional y a crecer con servicios digitales y marketing digital."); }
      step(function () {
        if (!CIUDAD) return preguntarCiudad();
        mostrarSectores(ayudaAsesor);
      });
    }
    function preguntarCiudad() {
      say("¿En qué ciudad está tu negocio?");
      opts([
        { t: "Cartagena", fn: function () { pick("Cartagena"); CIUDAD = "cartagena"; track("asistente_localidad"); pedirBarrio(function () { mostrarSectores(false); }); } },
        { t: "Otra ciudad", fn: function () { pick("Otra ciudad"); CIUDAD = "otra"; step(function () { say("La ubicación por localidad y UCG solo aplica a Cartagena. Igual te orientamos en cualquier sector."); mostrarSectores(false); }); } }
      ]);
    }
    function mostrarSectores(ayudaAsesor) {
      if (ayudaAsesor) say("¿No ves tu caso? Un Profesional de nuestro equipo lo revisa contigo por WhatsApp.");
      else say("¿Qué tipo de negocio tienes?");
      var l = S.filter(function (s) { return s.id !== "digital" && s.id !== "iso"; }).map(function (s) { return { t: s.n, fn: function () { pick(s.n); track("asistente_" + s.id); show(s); } }; });
      if (ayudaAsesor) l.unshift({ t: "Hablar con un asesor", id: "menu", href: link("Hola ECODESA, tengo una consulta.") });
      l.push({ t: "Otra consulta", fn: function () { pick("Otra consulta"); step(function () { say("Eso lo revisa un Profesional de nuestro equipo. Cuéntanos por WhatsApp."); opts([{ t: "Hablar con un asesor", id: "otra", href: link("Hola ECODESA, tengo una consulta.") }, { t: "Volver al menú", fn: function () { menu(false); } }]); }); } });
      opts(l);
    }
    var DISC = "Aplica según tu actividad y tamaño. ECODESA es una firma privada: no representa a estas autoridades ni emite sus certificados o conceptos. La mención de una autoridad es informativa y no implica aval ni relación con ella. Un asesor te confirma qué aplica a tu caso.";
    function groupsFor(s, c) {
      var out = [];
      (s.req || []).forEach(function (g) {
        var it = g.items.slice();
        if (g.a === "Seguridad y salud en el trabajo") {
          var l = SST[c.size] || "SG-SST con los estándares mínimos que correspondan a tu número de trabajadores y nivel de riesgo (Resolución 0312 de 2019).";
          it.unshift(l, AUTO, EMER);
        }
        out.push({ a: g.a, nota: g.nota, items: it });
      });
      if (s.acu && c.acu) { var fi = out.findIndex(function (g) { return g.a === "Forestal"; }); var ag = { a: "Ambiental", items: ACU }; if (fi > -1) out.splice(fi, 0, ag); else out.push(ag); }
      return out;
    }
    function waText(s, c) {
      var t = s.wa;
      if (c.size) t += " Trabajadores: " + c.size + ".";
      if (c.tema) t += " Me interesa: " + c.tema + ".";
      return t;
    }
    var LOC = null;
    var CIUDAD = null;
    function show(s) { showOpc(s); }
    function showOpc(s) {
      step(function () {
        if (s.txt) { say(s.txt); say({ h: "Te acompañamos con:", items: s.hac, f: s.f }); opts([{ t: "Hablar con un asesor", id: s.id, href: link(s.wa) }, { t: "Ver otro sector", fn: function () { menu(false); } }]); return; }
        say("Perfecto. ¿Qué te gustaría saber sobre " + s.u + "?");
        opts([
          { t: "¿Quieres conocer la normativa que aplica a tu negocio?", fn: function () { pick("Conocer la normativa que aplica"); track("asistente_norma_" + s.id); norma(s); } },
          { t: "¿Quieres realizar un diagnóstico inicial?", fn: function () { pick("Realizar un diagnóstico inicial"); track("asistente_diag_" + s.id); diagnostico(s); } },
          { t: "¿Cómo te ayuda ECODESA en tu negocio?", fn: function () { pick("Cómo te ayuda ECODESA"); ayuda(s, {}); } },
          { t: "¿Conoces nuestros nuevos servicios?", fn: function () { pick("Nuevos servicios"); nuevos(s); } },
          { t: "Hablar con un asesor", id: s.id, href: link(s.wa) },
          { t: "Volver al menú principal", fn: function () { menu(false); } }
        ]);
      });
    }
    function nuevos(s) {
      var g = [];
      if (s.id !== "digital") g.push({ a: "Marketing y servicios digitales", items: MKT });
      g.push({ a: "Sistemas de gestión ISO", items: ISOH });
      say({ h: "Nuevos servicios para " + s.u + ":", groups: g, noVer: 1, f: "Las normas ISO son voluntarias y la certificación la otorga un organismo certificador externo." });
      opts([
        { t: "Hablar con un asesor", id: s.id, href: link("Hola ECODESA, me interesan los servicios de marketing digital y sistemas de gestión integral ISO para " + s.u + ".") },
        { t: "Ver la normativa", fn: function () { pick("Ver la normativa"); norma(s); } },
        { t: "Ver otro sector", fn: function () { pick("Ver otro sector"); menu(false); } }
      ]);
    }
    var CHECK = null;
    function cargarChecklist(cb) {
      if (CHECK) return cb(CHECK);
      fetch("/ethan/checklist.json", { cache: "no-cache" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { CHECK = d; cb(d); })
        .catch(function () { cb(null); });
    }
    function soporte(it, si, next) {
      var base = it.norma ? "Base normativa: " + it.norma + "." : "";
      var nota = it.revision && it.revision.estado === "texto_verificado" ? "" : " Vigencia en confirmación.";
      var txt = si ? "Registrado como cumplido declarado. " + base + nota : "Requisito pendiente. " + base + nota + " Un Profesional de ECODESA te orienta para cumplirlo.";
      say(txt.trim());
      next();
    }
    function diagnostico(s) {
      cargarChecklist(function (d) {
        var todos = d && d[s.id];
        if (!todos || !todos.length) {
          say("Estamos preparando el diagnóstico de tu sector. Un Profesional de ECODESA te acompaña por WhatsApp.");
          opts([{ t: "Hablar con un asesor", id: s.id, href: link(s.wa) }, { t: "Volver al menú principal", fn: function () { menu(false); } }]);
          return;
        }
        var PUB = "Publicidad exterior";
        var items = todos.filter(function (i) { return i.area !== PUB; });
        var avi = todos.filter(function (i) { return i.area === PUB; });
        var areas = [];
        items.forEach(function (i) { if (areas.indexOf(i.area) < 0) areas.push(i.area); });
        if (!items.length) return preguntar(avi, cierreFinal);
        if (areas.length < 2) return preguntar(items, ofrecerPub);
        say("¿Qué tema quieres revisar?");
        var l = areas.map(function (a) { return { t: a, fn: function () { pick(a); preguntar(items.filter(function (i) { return i.area === a; }), ofrecerPub); } }; });
        l.push({ t: "Todos los temas", fn: function () { pick("Todos los temas"); preguntar(items, ofrecerPub); } });
        opts(l);
        function ofrecerPub(pct) {
          if (!avi.length) return cierreFinal(pct);
          say("¿Quieres hacer el diagnóstico con publicidad exterior?");
          opts([
            { t: "Sí", fn: function () { pick("Sí"); preguntar(avi, function (pct2) { cierreFinal(pct, pct2); }); } },
            { t: "No", fn: function () { pick("No"); cierreFinal(pct); } }
          ]);
        }
        function cierreFinal(pct, pctPub) {
          if (pctPub !== undefined) say("Publicidad exterior: " + pctPub + " %.");
          opts([
            { t: "Validar mi cumplimiento con un profesional", id: s.id, href: link("Hola ECODESA, hice el diagnóstico inicial de " + s.u + " con " + (pct || 0) + " % declarado" + (pctPub !== undefined ? " y " + pctPub + " % en publicidad exterior" : "") + ". Quiero validarlo.") },
            { t: "Volver al menú principal", fn: function () { menu(false); } }
          ]);
        }
        function preguntar(list, siguiente) {
          say("Responde sí o no. Son " + list.length + " preguntas sobre " + s.u + ".");
          var yes = 0, aplica = 0;
          function fin() {
            var pct = aplica ? Math.round(yes / aplica * 100) : 0;
            var nivel = pct >= 80 ? "Cumplimiento declarado alto" : pct >= 50 ? "Cumplimiento declarado parcial" : "Cumplimiento declarado bajo";
            say("Resultado: " + pct + " %. " + nivel + ". Es una estimación según tus respuestas; un Profesional la valida.");
            siguiente(pct);
          }
          function ask(i) {
            if (i >= list.length) return fin();
            say(list[i].p);
            var lista = [
              { t: "Sí", fn: function () { pick("Sí"); aplica += 1; yes += 1; soporte(list[i], true, function () { ask(i + 1); }); } },
              { t: "No", fn: function () { pick("No"); aplica += 1; soporte(list[i], false, function () { ask(i + 1); }); } }
            ];
            if (/vertim/i.test(list[i].p)) lista.push({ t: "No aplica", fn: function () { pick("No aplica"); ask(i + 1); } });
            opts(lista);
          }
          ask(0);
        }
      });
    }
    function norma(s) {
      var c = {};
      var hasSST = (s.req || []).some(function (g) { return g.a === "Seguridad y salud en el trabajo"; });
      function q1() {
        if (!hasSST) return q2();
        say("Para darte una respuesta a tu medida: ¿cuántas personas trabajan en " + s.u + "?");
        opts(["1 a 10", "11 a 50", "Más de 50"].map(function (x) { return { t: x, fn: function () { pick(x); c.size = x; q2(); } }; }));
      }
      function q2() {
        if (!s.acu) return q3();
        say("¿En " + s.u + " se usa aceite para freír o cocinar?");
        opts([{ t: "Sí", fn: function () { pick("Sí"); c.acu = 1; q3(); } }, { t: "No", fn: function () { pick("No"); q3(); } }]);
      }
      function q3() {
        c.again = q3; c.tema = "";
        var gs = groupsFor(s, c);
        if (gs.length < 2) { c.again = null; if (gs[0]) c.tema = gs[0].a; return res(s, c, gs); }
        say("¿Qué tema quieres revisar?");
        var l = gs.map(function (g) { return { t: g.a, fn: function () { pick(g.a); c.tema = g.a; track("asistente_tema_" + s.id); res(s, c, [g], q3); } }; });
        l.push({ t: "Todos los temas", fn: function () { pick("Todos los temas"); c.tema = "todos los temas"; res(s, c, gs, q3); } });
        opts(l);
      }
      q1();
    }
    function res(s, c, gs, again) {
      var who = s.u + (c.size ? ", con " + c.size.toLowerCase() + " trabajadores" : "");
      say({ h: "Para " + who + ", según la normativa las autoridades pueden solicitarte:", groups: gs, f: DISC });
      say("Siguiente paso: un Profesional de nuestro equipo revisa tu caso y confirma qué aplica en tu negocio. Verifica siempre la normativa vigente.");
      var l = [{ t: "Hablar con un asesor", id: s.id, href: link(waText(s, c)) }];
      if (again) l.push({ t: "Ver otro tema", fn: function () { pick("Ver otro tema"); again(); } });
      l.push({ t: "Cómo me ayuda ECODESA", fn: function () { pick("Cómo me ayuda ECODESA"); ayuda(s, c); } });
      l.push({ t: "Ver otro sector", fn: function () { pick("Ver otro sector"); menu(false); } });
      opts(l);
    }
    function todos(s) {
      if (!s.req || s.id === "digital") return null;
      var out = [], seen = {};
      s.req.forEach(function (g) {
        var l = g.a === "Ambiental" ? HA[s.id] : HT[g.a];
        if (l && l.length) { out.push({ a: g.a === "Ambiental" ? "Gestión ambiental" : g.a, items: l }); }
      });
      if (!s.req.some(function (g) { return g.a === "Ambiental"; }) && HA[s.id]) out.push({ a: "Gestión ambiental", items: HA[s.id] });
      out.push({ a: "Marketing y servicios digitales", items: MKT });
      out.push({ a: "Sistemas de gestión ISO", items: ISOH });
      return out;
    }
    function ayuda(s, c) {
      var t = c.tema && c.tema !== "todos los temas" ? c.tema : "";
      var it = t ? (t === "Ambiental" ? HA[s.id] : HT[t]) : null;
      if (it) say({ h: "En " + (t === "Ambiental" ? "gestión ambiental" : t === "Forestal" ? "gestión forestal" : t.toLowerCase()) + ", te acompañamos con:", items: it, f: s.plan ? "Modalidad: " + s.plan.replace(/\.$/, "") + "." : "" });
      else if (todos(s)) say({ h: "Si nos contratas, te acompañamos con:", groups: todos(s), noVer: 1, f: s.plan ? "Modalidad: " + s.plan.replace(/\.$/, "") + "." : "" });
      else say({ h: "Si nos contratas, te acompañamos con:", items: s.hac, f: s.plan ? "Modalidad: " + s.plan.replace(/\.$/, "") + "." : "" });
      if (s.cert) say(CERT);
      say("Siguiente paso: cuéntanos tu caso y un Profesional de nuestro equipo te orienta sobre el alcance y las condiciones.");
      var l = [{ t: "Hablar con un asesor", id: s.id, href: link(waText(s, c)) }];
      if (c.again) l.push({ t: "Ver otro tema", fn: function () { pick("Ver otro tema"); c.again(); } });
      else l.push({ t: "Ver la normativa", fn: function () { pick("Ver la normativa"); norma(s); } });
      if (it) l.push({ t: "Ver todos los servicios", fn: function () { pick("Ver todos los servicios"); ayuda(s, { size: c.size, acu: c.acu, again: c.again }); } });
      l.push({ t: "Ver otro sector", fn: function () { pick("Ver otro sector"); menu(false); } });
      opts(l);
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
