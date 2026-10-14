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
  burger.addEventListener("click", function () {
    var open = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", open); links.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      burger.setAttribute("aria-expanded", "false"); links.classList.remove("is-open"); document.body.style.overflow = "";
    });
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
    gsap.from(".gal figure", { x: 120, stagger: .06, ease: "none", scrollTrigger: { trigger: ".gal", start: "top bottom", end: "bottom center", scrub: true } });
  });

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
