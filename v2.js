/* ECODESA v2 */
(function () {
  "use strict";
  window.__v2 = true;
  var WA = "573246886824";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var track = function (label) { if (typeof gtag === "function") gtag("event", "click", { event_category: "engagement", event_label: label, value: 1 }); };

  /* WhatsApp links with prefilled text */
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(a.getAttribute("data-wa"));
    a.target = "_blank"; a.rel = "noopener";
    a.addEventListener("click", function () { track("whatsapp_contact_click"); });
  });

  /* nav */
  var nav = document.getElementById("nav");
  var pf = document.getElementById("progressFill"), noTL = !(window.CSS && CSS.supports("animation-timeline: scroll()"));
  var onScroll = function () {
    nav.classList.toggle("is-solid", window.scrollY > 32);
    if (noTL && pf) { var h = document.documentElement.scrollHeight - innerHeight; pf.style.setProperty("--p", h > 0 ? (scrollY / h).toFixed(4) : 0); }
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var burger = document.getElementById("navBurger"), links = document.getElementById("navLinks");
  var menuItems = links.querySelectorAll(".menu-list a"), pic = document.getElementById("menuPic");
  var setMenu = function (open) {
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    burger.querySelector("em").textContent = open ? "Cerrar" : "Menú";
    links.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    menuItems.forEach(function (a) { a.tabIndex = open ? 0 : -1; });
    if (open) { setTimeout(function () { menuItems[0].focus({ preventScroll: true }); }, 450); track("menu_open"); }
  };
  menuItems.forEach(function (a) { a.tabIndex = -1; });
  burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && links.classList.contains("is-open")) { setMenu(false); burger.focus(); }
  });
  links.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  var swapTo = function (src) {
    if (!pic || pic.getAttribute("src") === src) return;
    pic.classList.add("swap");
    setTimeout(function () { pic.src = src; pic.classList.remove("swap"); }, 200);
  };
  menuItems.forEach(function (a) {
    var s = a.getAttribute("data-img");
    a.addEventListener("mouseenter", function () { swapTo(s); });
    a.addEventListener("focus", function () { swapTo(s); });
  });

  /* tema día / noche */
  var tb = document.getElementById("themeBtn"), root = document.documentElement;
  var syncTheme = function () {
    var dark = root.getAttribute("data-theme") === "dark";
    tb.setAttribute("aria-label", dark ? "Cambiar a modo día" : "Cambiar a modo noche");
  };
  tb.addEventListener("click", function () {
    var t = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("ecodesa-theme", t); } catch (e) {}
    syncTheme(); track("theme_toggle_" + t);
  });
  syncTheme();

  /* hero sector slideshow */
  var SEC = [
    ["Restaurantes", ["Plan de saneamiento básico", "Buenas prácticas (BPM)", "Gestión de aceite de cocina usado", "Control de plagas y limpieza"]],
    ["Hoteles", ["Saneamiento básico y BPM", "Agua potable y lavado de tanques", "Brigadas y simulacros", "SG-SST para tu equipo"]],
    ["Industria", ["SG-SST e ISO 45001", "Seguridad química (SGA)", "Vertimientos y emisiones", "Residuos peligrosos"]],
    ["Puertos", ["Gestión del riesgo de desastres", "Planes de emergencia y derrames", "Trabajo en alturas e izaje", "Reportes automatizados con IA"]]
  ];
  var D = 6000, cur = 0, timer, paused = false;
  var hero = document.querySelector(".hero"), pBtn = document.getElementById("hPause");
  var slides = document.querySelectorAll("#heroBg .slide"), tabs = document.querySelectorAll(".htab");
  var gTitle = document.getElementById("gTitle"), gList = document.getElementById("gList");
  document.documentElement.style.setProperty("--d", D / 1000 + "s");
  function show(i) {
    cur = i;
    slides.forEach(function (s, k) { s.classList.toggle("is-on", k === i); });
    tabs.forEach(function (t, k) {
      t.classList.toggle("is-on", k === i); t.classList.toggle("is-done", k < i);
      t.setAttribute("aria-selected", k === i);
      var b = t.querySelector("b"); b.style.animation = "none"; void b.offsetWidth; b.style.animation = "";
    });
    gTitle.textContent = SEC[i][0];
    gTitle.style.animation = "none"; void gTitle.offsetWidth; gTitle.style.animation = "";
    gList.innerHTML = SEC[i][1].map(function (x) { return "<li>" + x + "</li>"; }).join("");
    clearTimeout(timer);
    if (!reduce && !paused) timer = setTimeout(function () { show((cur + 1) % SEC.length); }, D);
  }
  tabs.forEach(function (t, k) { t.addEventListener("click", function () { show(k); }); });
  if (reduce) { paused = true; hero.classList.add("is-paused"); }
  pBtn.addEventListener("click", function () {
    paused = !paused; hero.classList.toggle("is-paused", paused);
    pBtn.setAttribute("aria-pressed", paused); pBtn.setAttribute("aria-label", paused ? "Reanudar presentación" : "Pausar presentación");
    pBtn.textContent = paused ? "▶" : "❚❚";
    if (paused) clearTimeout(timer); else show(cur);
  });
  var buy = document.getElementById("buyPsb");
  if (buy) buy.addEventListener("click", function () { track("psb_buy_click"); });
  show(0);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) clearTimeout(timer); else if (!paused) show(cur);
  });

  /* reveal on scroll */
  var rv = document.querySelectorAll("[data-rv]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          var sib = Array.prototype.indexOf.call(e.target.parentNode.children, e.target);
          e.target.style.transitionDelay = Math.min(sib, 5) * 0.08 + "s";
          e.target.classList.add("is-in"); io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("is-in"); });

  /* depth parallax (GSAP) */
  window.addEventListener("load", function () {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var st = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
    gsap.to("#heroBg", { yPercent: 12, scale: 1.08, ease: "none", scrollTrigger: st });
    gsap.to("#heroWord", { y: 220, opacity: .25, ease: "none", scrollTrigger: st });
    gsap.to("#heroCard", { y: -90, ease: "none", scrollTrigger: st });
    gsap.to("#heroCopy", { y: 60, ease: "none", scrollTrigger: st });
  });

  /* proceso: ruta tipo mapa con bucles que se dibuja con el scroll */
  var route = document.getElementById("route");
  if (route) {
    var line = document.getElementById("routeLine"), car = document.getElementById("routeCar"), svg = route.querySelector(".route-svg");
    var stops = route.querySelectorAll(".stop"), L = line.getTotalLength(), VW = 1200, VH = 600;
    var C = [[150, 300], [450, 300], [750, 300], [1050, 300]], R = 56;
    line.style.strokeDasharray = L; line.style.strokeDashoffset = L;
    /* longitud donde termina el bucle de cada parada (segunda pasada por el punto inferior) */
    var loopEnd = C.map(function (c) {
      var hits = [];
      for (var s = 0; s <= L; s += 2) {
        var q = line.getPointAtLength(s);
        if (Math.abs(q.x - c[0]) < 3 && Math.abs(q.y - (c[1] + R)) < 3) { if (!hits.length || s - hits[hits.length - 1] > 50) hits.push(s); }
      }
      return hits.length ? hits[hits.length - 1] : 0;
    });
    /* flechas antes de cada parada y al final */
    var NS = "http://www.w3.org/2000/svg", g = document.getElementById("routeArrows"), arrows = [];
    loopEnd.map(function (e) { return e - 2 * Math.PI * R - 34; }).concat([L - 6]).forEach(function (s) {
      var a = line.getPointAtLength(s - 4), b = line.getPointAtLength(s + 4);
      var ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI, m = line.getPointAtLength(s);
      var el = document.createElementNS(NS, "path");
      el.setAttribute("d", "M-9 -8 L2 0 L-9 8"); el.setAttribute("class", "arw");
      el.setAttribute("transform", "translate(" + m.x + " " + m.y + ") rotate(" + ang + ")");
      g.appendChild(el); arrows.push([s, el]);
    });
    var goal = document.getElementById("routeGoal");
    var upd = function () {
      var r = route.getBoundingClientRect(), vh = innerHeight;
      var p = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.75)));
      var d = L * p;
      route.style.setProperty("--p", p.toFixed(3));
      line.style.strokeDashoffset = (L - d).toFixed(1);
      var vertical = getComputedStyle(svg).display === "none";
      if (!vertical) {
        var sr = svg.getBoundingClientRect(), rr = route.getBoundingClientRect(), k = sr.width / VW;
        var X = function (x) { return sr.left - rr.left + x * k + "px"; }, Y = function (y) { return sr.top - rr.top + y * k + "px"; };
        var pt = line.getPointAtLength(d);
        car.style.left = X(pt.x); car.style.top = Y(pt.y);
        car.style.opacity = p > 0.01 && p < 0.985 ? 1 : 0;
        C.forEach(function (c, i) {
          var pin = stops[i].querySelector(".pin"), card = stops[i].querySelector(".stop-card");
          pin.style.left = X(c[0]); pin.style.top = Y(c[1]);
          var w = card.offsetWidth, h = card.offsetHeight, gap = (R + 34) * k;
          card.style.left = (sr.left - rr.left + c[0] * k - w / 2) + "px";
          card.style.top = (i % 2 === 0 ? sr.top - rr.top + c[1] * k - gap - h : sr.top - rr.top + c[1] * k + gap) + "px";
          card.style.setProperty("--stem", Math.max(0, gap - 9 - 36) + "px");
        });
        arrows.forEach(function (a) { a[1].classList.toggle("on", d >= a[0]); });
        goal.classList.toggle("on", p >= 0.99);
      } else {
        stops.forEach(function (s) { var cd = s.querySelector(".stop-card"); cd.style.left = ""; cd.style.top = ""; });
      }
      stops.forEach(function (s, i) { s.classList.toggle("on", vertical ? p >= i / stops.length + 0.05 : d >= loopEnd[i] - 2 * Math.PI * R * 0.5); });
    };
    window.addEventListener("scroll", upd, { passive: true }); window.addEventListener("resize", upd); upd();
  }

  /* digital: pestañas que cambian las pantallas de ejemplo */
  var dtabs = document.querySelectorAll(".dtab"), stage = document.getElementById("stage");
  if (dtabs.length && stage) {
    var lapS = stage.querySelectorAll(".lap-screen .scr"), phS = stage.querySelectorAll(".ph-screen .scr"), url = document.getElementById("lapUrl");
    var dsec = document.getElementById("digital"), dcur = 0, dt, DD = 4500, hold = false;
    document.documentElement.style.setProperty("--dd", DD / 1000 + "s");
    var dshow = function (i) {
      dcur = i;
      dtabs.forEach(function (t, k) { t.classList.toggle("on", k === i); t.setAttribute("aria-pressed", k === i); var b = t.querySelector("i"); b.style.animation = "none"; void b.offsetWidth; b.style.animation = ""; });
      lapS.forEach(function (s, k) { s.classList.toggle("on", k === i); });
      phS.forEach(function (s, k) { s.classList.toggle("on", k === i); });
      url.textContent = lapS[i].getAttribute("data-url");
      clearTimeout(dt); if (!reduce && !hold) dt = setTimeout(function () { dshow((dcur + 1) % dtabs.length); }, DD);
    };
    dtabs.forEach(function (t, k) {
      t.addEventListener("click", function () { dshow(k); track("digital_tab_" + k); });
      t.addEventListener("mouseenter", function () { if (k !== dcur) dshow(k); });
    });
    dsec.addEventListener("mouseenter", function () { hold = true; dsec.classList.add("paused"); clearTimeout(dt); });
    dsec.addEventListener("mouseleave", function () { hold = false; dsec.classList.remove("paused"); dshow(dcur); });
    dshow(0);
  }

  /* video tracking */
  var v = document.getElementById("promo");
  if (v) v.addEventListener("play", function () { track("video_play"); }, { once: true });

  /* contact form → WhatsApp (sitio estático, sin backend) */
  var f = document.getElementById("cform"), st = document.getElementById("fstatus");
  if (f) f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!f.reportValidity()) return;
    var d = { nombre: f.nombre.value.trim(), empresa: f.empresa.value.trim(), telefono: f.telefono.value.trim(), servicio: f.servicio.value, mensaje: f.mensaje.value.trim(), website: f.website.value };
    if (d.website) return; /* honeypot */
    var t = "Hola ECODESA, soy " + d.nombre + (d.empresa ? " (" + d.empresa + ")" : "") + ".\nSector: " + (d.servicio || "—") + "\nTeléfono: " + d.telefono + "\n" + d.mensaje;
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(t), "_blank", "noopener");
    st.className = "fstatus ok"; st.textContent = "Abrimos WhatsApp con tu solicitud lista para enviar.";
    track("form_whatsapp_submit");
  });
})();
