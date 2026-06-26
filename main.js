/* =============================================================
   ECODESA — main.js · v20260626
   IIFE pattern: no import/export — works on file:// and any host
   ============================================================= */
(function () {
  "use strict";

  /* ── Helpers ── */
  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[ECODESA:" + name + "]", e); }
  }

  /* ═══════════════════════════════════════════════════════════
     SPLASH — double safety: CSS 4.5s animation + JS hide
  ═══════════════════════════════════════════════════════════ */
  function initSplash() {
    const splash = $("[data-splash]");
    if (!splash) return;
    const hide = () => splash.classList.add("is-out");
    if (document.readyState === "complete") {
      setTimeout(hide, 500);
    } else {
      window.addEventListener("load", () => setTimeout(hide, 400));
    }
    setTimeout(hide, 3800); /* JS safety net */
  }

  /* ═══════════════════════════════════════════════════════════
     NAVIGATION
  ═══════════════════════════════════════════════════════════ */
  function initNav() {
    const nav = $("#nav");
    const burger = $("#navBurger");
    const menu = $("#navMobileMenu");
    const close = $("#mobileMenuClose");
    if (!nav) return;

    /* Sticky state on scroll */
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* Burger toggle */
    if (burger && menu) {
      const openMenu = () => {
        burger.classList.add("is-open");
        burger.setAttribute("aria-expanded", "true");
        menu.classList.add("is-open");
        menu.removeAttribute("aria-hidden");
        document.body.style.overflow = "hidden";
      };
      const closeMenu = () => {
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
        menu.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      };

      burger.addEventListener("click", () => {
        menu.classList.contains("is-open") ? closeMenu() : openMenu();
      });
      if (close) close.addEventListener("click", closeMenu);

      /* Close on nav link click */
      $$("a", menu).forEach(a => a.addEventListener("click", closeMenu));
    }
  }

  /* ═══════════════════════════════════════════════════════════
     SMOOTH SCROLL — native anchor intercept
  ═══════════════════════════════════════════════════════════ */
  function initSmoothScroll() {
    document.addEventListener("click", e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({
        top: el.getBoundingClientRect().top + scrollY - 70,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     REVEALS — IntersectionObserver with safety fallback
  ═══════════════════════════════════════════════════════════ */
  function initReveals() {
    const els = $$(".reveal");
    if (!els.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -4% 0px" });

    els.forEach(el => io.observe(el));

    /* Safety: at 6s, force-reveal anything still in viewport */
    setTimeout(() => {
      els.forEach(el => {
        if (el.classList.contains("is-visible")) return;
        if (el.getBoundingClientRect().top < window.innerHeight + 200) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ═══════════════════════════════════════════════════════════
     COUNTERS — count-up on scroll into view
  ═══════════════════════════════════════════════════════════ */
  function initCounters() {
    const counters = $$("[data-count]");
    if (!counters.length) return;

    const countUp = (el) => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
      const duration = reduced ? 0 : 1400;
      const start = performance.now();

      function tick(now) {
        const elapsed = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - elapsed, 3); /* ease-out cubic */
        el.textContent = Math.round(ease * target);
        if (elapsed < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }

      if (reduced) { el.textContent = target; return; }
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        countUp(e.target);
      });
    }, { threshold: 0.1 });

    counters.forEach(el => io.observe(el));
  }

  /* ═══════════════════════════════════════════════════════════
     SERVICIOS — horizontal pinned scroll (desktop)
                 CSS scroll-snap (mobile — handled in CSS)
  ═══════════════════════════════════════════════════════════ */
  function initServiciosScroll() {
    if (!window.gsap || !window.ScrollTrigger) return;

    const section = $(".servicios-section");
    const track = $("#serviciosTrack");
    const cards = $$(".service-card");
    const progressNum = $("#serviciosProgressNum");
    if (!section || !track || !cards.length) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 960px)", () => {
      ScrollTrigger.refresh();

      const getScrollDist = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getScrollDist(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + getScrollDist(),
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              Math.round(self.progress * (cards.length - 1)),
              cards.length - 1
            );
            if (progressNum) {
              progressNum.textContent = String(idx + 1).padStart(2, "0");
            }
            cards.forEach((card, i) => {
              card.classList.toggle("is-active", i === idx);
            });
          }
        }
      });

      return () => { tween.kill(); };
    });

    /* Mobile: update progress on scroll-snap scroll */
    mm.add("(max-width: 959px)", () => {
      const onTrackScroll = () => {
        const idx = Math.round(track.scrollLeft / window.innerWidth);
        if (progressNum) progressNum.textContent = String(idx + 1).padStart(2, "0");
      };
      track.addEventListener("scroll", onTrackScroll, { passive: true });
      return () => track.removeEventListener("scroll", onTrackScroll);
    });
  }

  /* ═══════════════════════════════════════════════════════════
     GSAP SECTION REVEALS (enhanced — for elements not using .reveal)
  ═══════════════════════════════════════════════════════════ */
  function initGSAPReveals() {
    if (!window.gsap || !window.ScrollTrigger || reduced) return;

    /* Counter items stagger */
    gsap.from(".counter-item", {
      y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: "expo.out",
      scrollTrigger: { trigger: ".counters-grid", start: "top 80%", once: true }
    });

    /* Aside card slide in */
    gsap.from(".nosotros-aside", {
      x: 40, opacity: 0, duration: 1, ease: "expo.out",
      scrollTrigger: { trigger: ".nosotros-aside", start: "top 80%", once: true }
    });

    /* Sector items stagger */
    gsap.from(".sector-item", {
      y: 20, opacity: 0, duration: 0.5, stagger: 0.07, ease: "expo.out",
      scrollTrigger: { trigger: ".sectores-grid", start: "top 80%", once: true }
    });

    /* Product cards stagger */
    gsap.from(".product-card", {
      y: 25, opacity: 0, duration: 0.6, stagger: 0.08, ease: "expo.out",
      scrollTrigger: { trigger: ".tienda-grid", start: "top 85%", once: true }
    });

    /* Process steps stagger */
    gsap.from(".paso", {
      y: 20, opacity: 0, duration: 0.6, stagger: 0.12, ease: "expo.out",
      scrollTrigger: { trigger: ".proceso-timeline", start: "top 80%", once: true }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     CUSTOM CURSOR — desktop only (opacity 0 until first mousemove)
  ═══════════════════════════════════════════════════════════ */
  function initCursor() {
    if (!fineHover) return;
    const cursor = $("#cursor");
    if (!cursor) return;

    const ring = $(".cursor-ring", cursor);
    const dot = $(".cursor-dot", cursor);
    const label = $(".cursor-label", cursor);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let firstMove = false;

    const LABELS = {
      cotizar: "Cotizar",
      ver: "Ver",
      comprar: "Comprar",
      contactar: "Contactar",
      leer: "Leer",
      arriba: "↑ Inicio"
    };

    window.addEventListener("mousemove", e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) dot.style.transform = `translate3d(${mouseX}px,${mouseY}px,0) translate(-50%,-50%)`;
      if (!firstMove) {
        firstMove = true;
        ringX = mouseX; ringY = mouseY;
        if (ring) ring.style.transform = `translate3d(${ringX}px,${ringY}px,0) translate(-50%,-50%)`;
        cursor.classList.add("is-ready");
      }
    });

    /* Ring lerp — single rAF loop */
    let rafId;
    function animCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ring) ring.style.transform = `translate3d(${ringX}px,${ringY}px,0) translate(-50%,-50%)`;
      rafId = requestAnimationFrame(animCursor);
    }
    animCursor();

    /* Context labels */
    document.addEventListener("mouseover", e => {
      const t = e.target.closest("[data-cursor]");
      if (t) {
        if (label) label.textContent = LABELS[t.dataset.cursor] || "";
        cursor.classList.add("has-label");
      }
      if (e.target.closest("a, button")) cursor.classList.add("is-hovering");
    });
    document.addEventListener("mouseout", e => {
      const t = e.target.closest("[data-cursor]");
      if (t && !t.contains(e.relatedTarget)) {
        cursor.classList.remove("has-label");
        if (label) label.textContent = "";
      }
      if (e.target.closest("a, button") && !e.relatedTarget?.closest("a, button")) {
        cursor.classList.remove("is-hovering");
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     CONTACT FORM → WhatsApp
  ═══════════════════════════════════════════════════════════ */
  function initContactForm() {
    const form = $("#contactoForm");
    if (!form) return;

    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const nombre   = form.nombre.value.trim();
      const empresa  = form.empresa.value.trim();
      const telefono = form.telefono.value.trim();
      const servicio = form.servicio.value;
      const mensaje  = form.mensaje.value.trim();

      let parts = ["Hola ECODESA%2C me comunico desde el sitio web.%0A"];
      parts.push("*Nombre%3A* " + encodeURIComponent(nombre));
      if (empresa) parts.push("*Empresa%3A* " + encodeURIComponent(empresa));
      parts.push("*Tel%C3%A9fono%3A* " + encodeURIComponent(telefono));
      if (servicio) parts.push("*Servicio%3A* " + encodeURIComponent(servicio));
      parts.push("*Mensaje%3A* " + encodeURIComponent(mensaje));

      const text = parts.join("%0A");
      window.open("https://wa.me/573013653273?text=" + text, "_blank", "noopener,noreferrer");
    });
  }

  /* ═══════════════════════════════════════════════════════════
     PRODUCT CARD hover tilt (subtle, desktop only)
  ═══════════════════════════════════════════════════════════ */
  function initCardTilt() {
    if (!fineHover) return;
    $$(".product-card").forEach(card => {
      card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `translateY(-4px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     BOOT — register + run all inits
  ═══════════════════════════════════════════════════════════ */
  function boot() {
    /* Register GSAP plugin */
    if (window.gsap && window.ScrollTrigger) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (_) {}
    }

    /* Non-GSAP inits — always run */
    safe(initSplash,       "initSplash");
    safe(initNav,          "initNav");
    safe(initSmoothScroll, "initSmoothScroll");
    safe(initReveals,      "initReveals");
    safe(initCounters,     "initCounters");
    safe(initContactForm,  "initContactForm");
    safe(initCursor,       "initCursor");
    safe(initCardTilt,     "initCardTilt");

    /* GSAP-dependent inits */
    if (window.gsap && window.ScrollTrigger) {
      safe(initServiciosScroll,"initServiciosScroll");
      safe(initGSAPReveals,    "initGSAPReveals");
    }

    document.documentElement.classList.add("js-ready");
  }

  /* Wait for DOM (defer ensures scripts run after HTML parse) */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();

document.querySelectorAll('.sc-accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const body = btn.nextElementSibling;
    const isOpen = body.classList.contains('open');
    body.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', !isOpen);
  });
});
