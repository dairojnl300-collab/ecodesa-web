/* =============================================================
   ECODESA — main.js · v20260701
   "El plano vivo" — cáusticas WebGL, secuencia de cuadros
   procedural, GSAP ScrollTrigger, Motion, Lenis.
   IIFE, sin imports: todo degrada con elegancia si falta un CDN.
   ============================================================= */
(function () {
  "use strict";

  /* ── Helpers y capacidades ── */
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp  = (a, b, t) => a + (b - a) * t;

  const reduced  = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePtr  = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGSAP  = () => !!(window.gsap && window.ScrollTrigger);
  const hasLenis = () => typeof window.Lenis === "function";
  const hasMotion= () => !!(window.Motion && window.Motion.animate);

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[ECODESA:" + name + "]", e); }
  }

  let lenis = null;

  /* ═══════════════════════════════════════════════════════════
     SCROLL SUAVE — Lenis + sincronía con ScrollTrigger
  ═══════════════════════════════════════════════════════════ */
  function initLenis() {
    if (!hasLenis() || reduced) return;
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;

    if (hasGSAP()) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     NAVEGACIÓN — estado scrolled, overlay móvil, anclas
  ═══════════════════════════════════════════════════════════ */
  function initNav() {
    const nav = $("#nav");
    if (!nav) return;

    const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 32);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const burger  = $("#navBurger");
    const overlay = $("#navOverlay");
    const closeBtn = $("#navClose");
    if (burger && overlay) {
      const open = () => {
        overlay.hidden = false;
        requestAnimationFrame(() => overlay.classList.add("is-open"));
        burger.classList.add("is-open");
        burger.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      };
      const close = () => {
        overlay.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        setTimeout(() => { if (!overlay.classList.contains("is-open")) overlay.hidden = true; }, 420);
      };
      burger.addEventListener("click", () =>
        overlay.classList.contains("is-open") ? close() : open());
      if (closeBtn) closeBtn.addEventListener("click", close);
      $$("a", overlay).forEach(a => a.addEventListener("click", close));
      addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    }

    /* Anclas con desplazamiento suave */
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(el, { offset: -64 });
      } else {
        scrollTo({
          top: el.getBoundingClientRect().top + scrollY - 64,
          behavior: reduced ? "auto" : "smooth"
        });
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     ENTRADA DEL HERO
  ═══════════════════════════════════════════════════════════ */
  function initHeroIntro() {
    const kick = () => {
      document.body.classList.add("is-loaded");
      const t = $("#heroTitle");
      if (t) t.classList.add("in");
    };
    if (document.readyState === "complete") setTimeout(kick, 80);
    else addEventListener("load", () => setTimeout(kick, 80));
    setTimeout(kick, 2200); /* red de seguridad */
  }

  /* ═══════════════════════════════════════════════════════════
     BARRA DE PROGRESO — fallback JS cuando no hay scroll-timeline
  ═══════════════════════════════════════════════════════════ */
  function initProgressFallback() {
    if (CSS.supports && CSS.supports("animation-timeline: scroll()")) return;
    const fill = $("#progressFill");
    if (!fill) return;
    let ticking = false;
    const update = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      fill.style.setProperty("--p", h > 0 ? (scrollY / h).toFixed(4) : 0);
      ticking = false;
    };
    addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ═══════════════════════════════════════════════════════════
     SHADER DE CÁUSTICAS — luz a través de agua poco profunda
  ═══════════════════════════════════════════════════════════ */
  const VERT = "attribute vec2 aP; void main(){ gl_Position = vec4(aP, 0.0, 1.0); }";

  const FRAG = [
    "precision highp float;",
    "uniform vec2 uRes; uniform float uT; uniform vec2 uMouse; uniform float uFade;",
    "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }",
    "float noise(vec2 p){",
    "  vec2 i = floor(p); vec2 f = fract(p);",
    "  vec2 u = f * f * (3.0 - 2.0 * f);",
    "  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),",
    "             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);",
    "}",
    "void main(){",
    "  vec2 uv = gl_FragCoord.xy / uRes;",
    "  vec2 p = uv; p.x *= uRes.x / uRes.y;",
    "  float t = uT * 0.09;",
    "  vec2 drift = vec2(t * 0.35, -t * 0.22);",
    "  vec2 w = vec2(noise(p * 2.1 + drift), noise(p * 2.1 - drift + 5.2));",
    "  float n1 = noise(p * 3.0 + w * 1.6 + vec2(t, -t * 0.6));",
    "  float c1 = pow(1.0 - abs(n1 * 2.0 - 1.0), 4.0);",
    "  float n2 = noise(p * 5.2 - w * 2.2 + vec2(-t * 0.8, t * 0.5));",
    "  float c2 = pow(1.0 - abs(n2 * 2.0 - 1.0), 7.0);",
    "  float m = smoothstep(0.55, 0.0, distance(uv, uMouse));",
    "  c1 += m * 0.25 * c2;",
    "  vec3 paper = vec3(0.965, 0.984, 0.976);",
    "  vec3 aqua  = vec3(0.243, 0.812, 0.698);",
    "  vec3 emer  = vec3(0.047, 0.541, 0.373);",
    "  vec3 azur  = vec3(0.055, 0.525, 0.784);",
    "  vec3 col = paper;",
    "  col = mix(col, aqua, c1 * 0.30);",
    "  col = mix(col, azur, c2 * 0.10);",
    "  col = mix(col, emer, c1 * c2 * 0.22);",
    "  col = mix(col, aqua, 0.10 * smoothstep(0.9, 0.2, distance(uv, vec2(0.82, 0.74))));",
    "  col = mix(col, paper, clamp(uFade, 0.0, 1.0) * 0.85);",
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  let heroExitP = 0; /* progreso de salida del hero, alimenta uFade */

  function initShader() {
    const canvas = $("#causticsCanvas");
    const bg = $(".hero-bg");
    if (!canvas || !bg) return;

    const fail = () => bg.classList.add("shader-off");
    let gl;
    try {
      gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    } catch (e) { gl = null; }
    if (!gl) return fail();

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("[ECODESA:shader]", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return fail();

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return fail();
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aP");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes   = gl.getUniformLocation(prog, "uRes");
    const uT     = gl.getUniformLocation(prog, "uT");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uFade  = gl.getUniformLocation(prog, "uFade");

    /* Calidad adaptativa: arranca en 1.25x y baja la resolución de
       render si el frame medio supera ~22ms — el scroll manda, 60fps. */
    let quality = Math.min(1.25, devicePixelRatio || 1);
    const Q_MIN = 0.55;
    function resize() {
      const r = bg.getBoundingClientRect();
      canvas.width  = Math.max(2, Math.round(r.width  * quality));
      canvas.height = Math.max(2, Math.round(r.height * quality));
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    addEventListener("resize", resize);

    let frameCount = 0, frameAccum = 0, lastNow = 0;
    function adapt(now) {
      const d = now - lastNow;
      if (lastNow && d < 100) {
        frameAccum += d;
        if (++frameCount >= 60) {
          const avg = frameAccum / frameCount;
          if (avg > 22 && quality > Q_MIN) {
            quality = Math.max(Q_MIN, quality * 0.8);
            resize();
          }
          frameCount = 0; frameAccum = 0;
        }
      }
      lastNow = now;
    }

    let mx = 0.6, my = 0.6, tmx = 0.6, tmy = 0.6;
    if (finePtr) {
      $("#hero").addEventListener("pointermove", (e) => {
        const r = canvas.getBoundingClientRect();
        tmx = (e.clientX - r.left) / r.width;
        tmy = 1 - (e.clientY - r.top) / r.height;
      }, { passive: true });
    }

    canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); fail(); });

    let visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(canvas);
    }

    const t0 = performance.now();
    function frame(now) {
      if (visible && !document.hidden) {
        adapt(now);
        mx = lerp(mx, tmx, 0.05);
        my = lerp(my, tmy, 0.05);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uT, (now - t0) / 1000);
        gl.uniform2f(uMouse, mx, my);
        gl.uniform1f(uFade, heroExitP);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      if (!reduced) requestAnimationFrame(frame);
    }

    if (reduced) {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, 8.0);
      gl.uniform2f(uMouse, 0.6, 0.6);
      gl.uniform1f(uFade, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } else {
      requestAnimationFrame(frame);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     PARTÍCULAS FLOTANTES — hero, desktop, deep forest dark
  ═══════════════════════════════════════════════════════════ */
  function initParticles() {
    if (reduced || !matchMedia("(min-width: 768px)").matches) return;

    const canvas = $("#particlesCanvas");
    const hero   = $("#hero");
    if (!canvas || !hero) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COUNT  = 25;
    const COLORS = [
      "rgba(0, 230, 118, 0.32)",
      "rgba(105, 240, 174, 0.26)",
      "rgba(27, 94, 32, 0.20)",
      "rgba(200, 230, 201, 0.16)"
    ];

    let w = 0, h = 0, dpr = 1, particles = [], visible = true;

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.width  = Math.round(rect.width  * dpr);
      h = canvas.height = Math.round(rect.height * dpr);
      canvas.style.width  = rect.width  + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = () => {
      const W = w / dpr, H = h / dpr;
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 1.4 + Math.random() * 2.4,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -0.1 - Math.random() * 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        phase: Math.random() * Math.PI * 2
      }));
    };

    resize();
    spawn();

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 })
        .observe(hero);
    }

    addEventListener("resize", () => { resize(); spawn(); }, { passive: true });

    const frame = (now) => {
      if (!document.hidden && visible) {
        const W = w / dpr, H = h / dpr;
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
          p.x += p.vx + Math.sin(now * 0.001 + p.phase) * 0.05;
          p.y += p.vy;
          if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
          if (p.x < -10) p.x = W + 10;
          if (p.x > W + 10) p.x = -10;
          ctx.globalAlpha = 0.5 + Math.sin(now * 0.002 + p.phase) * 0.22;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }

  /* ═══════════════════════════════════════════════════════════
     REVEALS — IntersectionObserver + escalonado por grupo
  ═══════════════════════════════════════════════════════════ */
  function initReveals() {
    const els = $$("[data-reveal]");
    if (!els.length) return;

    /* Escalonado: índice dentro del padre común */
    const groups = new Map();
    els.forEach(el => {
      const p = el.parentElement;
      const i = groups.get(p) || 0;
      groups.set(p, i + 1);
      el.style.setProperty("--rd", Math.min(i * 0.08, 0.42) + "s");
    });

    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    els.forEach(el => io.observe(el));

    /* Red de seguridad: nada queda invisible */
    setTimeout(() => els.forEach(el => el.classList.add("in")), 6000);
  }

  /* ═══════════════════════════════════════════════════════════
     SERVICE CARDS — grow-in al entrar en viewport
  ═══════════════════════════════════════════════════════════ */
  function initServiceCardGrow() {
    const cards = $$(".service-card");
    if (!cards.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      cards.forEach(c => c.classList.add("is-grown"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-grown");
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });

    cards.forEach(c => io.observe(c));
    setTimeout(() => cards.forEach(c => c.classList.add("is-grown")), 5000);
  }

  /* ═══════════════════════════════════════════════════════════
     CONTADORES
  ═══════════════════════════════════════════════════════════ */
  function initCounters() {
    const nums = $$("[data-count]");
    if (!nums.length) return;

    const run = (el) => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
      if (reduced) { el.textContent = target; return; }

      const FRAMES = 60;
      let frame = 0;
      const tick = () => {
        frame++;
        const k = frame / FRAMES;
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(eased * target);
        if (frame < FRAMES) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        run(e.target);
      });
    }, { threshold: 0.4 });
    nums.forEach(el => io.observe(el));
  }

  /* ═══════════════════════════════════════════════════════════
     SERVICIOS — recorrido horizontal
     Desktop + GSAP: sección fijada, el track se desplaza (scrub).
     Resto: carrusel nativo con snap; mismo indicador de progreso.
  ═══════════════════════════════════════════════════════════ */
  function initServicios() {
    const section  = $(".servicios");
    const viewport = $(".serv-viewport");
    const track    = $("#servTrack");
    const cards    = $$(".serv-card");
    const numEl    = $("#servNum");
    const barEl    = $("#servBarFill");
    if (!section || !track || !cards.length) return;

    const setProgress = (p) => {
      const idx = clamp(Math.round(p * (cards.length - 1)), 0, cards.length - 1);
      if (numEl) numEl.textContent = String(idx + 1).padStart(2, "0");
      if (barEl) barEl.style.transform = "scaleX(" + (0.2 + 0.8 * p) + ")";
      cards.forEach((c, i) => c.classList.toggle("is-active", i === idx));
    };
    setProgress(0);

    /* Scroll magic anidado: cada tarjeta reacciona a su distancia al
       centro mientras el track viaja — escala, atenuación y derivas
       internas a velocidades distintas (cabecera, lista, icono). */
    const heads = cards.map(c => $(".sc-head", c));
    const bodies = cards.map(c => $(".sc-body", c));
    const icons = cards.map(c => $(".sc-icon", c));
    const idxs  = cards.map(c => $(".sc-idx", c));
    const cardFx = () => {
      if (reduced) return;
      cards.forEach((card, i) => {
        if (!card.classList.contains("is-grown")) return;
        const r = card.getBoundingClientRect();
        const norm = clamp((r.left + r.width / 2 - innerWidth / 2) / innerWidth, -1, 1);
        const abs = Math.abs(norm);
        card.style.transform = "scale(" + (1 - abs * 0.06).toFixed(4) + ")";
        card.style.opacity = (1 - abs * 0.32).toFixed(3);
        if (heads[i])  heads[i].style.transform  = "translateX(" + (norm * -20).toFixed(1) + "px)";
        if (bodies[i]) bodies[i].style.transform = "translateX(" + (norm * 12).toFixed(1) + "px)";
        if (icons[i])  icons[i].style.transform  = "rotate(" + (norm * 6).toFixed(2) + "deg)";
        if (idxs[i])   idxs[i].style.transform   = "translateX(" + (norm * -30).toFixed(1) + "px)";
      });
    };

    let pinned = false;

    if (hasGSAP() && !reduced) {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 960px)", () => {
        pinned = true;
        section.classList.add("js-hscroll");
        const dist = () => track.scrollWidth - innerWidth;
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + Math.round(dist() * 1.05),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setProgress(self.progress);
              cardFx();
            }
          }
        });
        return () => {
          pinned = false;
          tween.scrollTrigger && tween.scrollTrigger.kill();
          tween.kill();
          section.classList.remove("js-hscroll");
          gsap.set(track, { clearProps: "x" });
          cards.forEach((c, i) => {
            c.style.transform = ""; c.style.opacity = "";
            [heads[i], bodies[i], icons[i], idxs[i]].forEach(el => el && (el.style.transform = ""));
          });
        };
      });
    }

    /* Modo nativo (móvil o sin GSAP) — mismo scroll magic */
    if (viewport) {
      let raf = 0;
      viewport.addEventListener("scroll", () => {
        if (pinned) return;
        const max = viewport.scrollWidth - viewport.clientWidth;
        if (max > 0) setProgress(clamp(viewport.scrollLeft / max, 0, 1));
        if (!raf) raf = requestAnimationFrame(() => { cardFx(); raf = 0; });
      }, { passive: true });
      requestAnimationFrame(cardFx);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     PARALLAX — chips del hero, salida del hero, topo de la ficha
  ═══════════════════════════════════════════════════════════ */
  function initParallax() {
    if (!hasGSAP() || reduced) return;

    /* Capas del hero: GSAP mueve el contenedor con data-depth
       (la flotación CSS vive en el hijo .hv-float — anidado) */
    $$("#hero [data-depth]").forEach((el) => {
      const depth = parseFloat(el.dataset.depth || 0.4);
      gsap.to(el, {
        y: () => -(depth * 210),
        ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
      });
    });

    /* Salida del hero: el texto sube más lento y las cáusticas se apagan */
    gsap.to(".hero-copy", {
      y: -70,
      opacity: 0.25,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero", start: "top top", end: "bottom top", scrub: true,
        onUpdate: (self) => { heroExitP = self.progress; }
      }
    });

    /* Contornos de la ficha técnica */
    const topo = $(".ficha-topo");
    if (topo) {
      gsap.fromTo(topo, { y: 46 }, {
        y: -46,
        ease: "none",
        scrollTrigger: { trigger: ".ficha-card", start: "top bottom", end: "bottom top", scrub: true }
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════
     EL PLANO VIVO — secuencia procedural de 96 cuadros
     Dibujo determinista: contornos → propuesta → flujo → sello
  ═══════════════════════════════════════════════════════════ */
  const FRAMES = 96;

  const INK     = "rgba(6, 46, 36, ";
  const EMERALD = "#0C8A5F";
  const AQUA    = "#3ECFB2";
  const AZURE   = "#0E86C8";

  const phase = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  const easeOut = (k) => 1 - Math.pow(1 - k, 3);
  const backOut = (k) => { const c = 1.70158; const x = k - 1; return 1 + (c + 1) * x * x * x + c * x * x; };

  /* trazo progresivo vía line-dash */
  function progStroke(ctx, per, k, draw) {
    if (k <= 0) return;
    ctx.save();
    if (k < 1) ctx.setLineDash([per * k, per]);
    draw();
    ctx.restore();
  }

  function contourPath(ctx, cx, cy, r, seed, squash) {
    const N = 44;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2;
      const wob = 1 +
        0.16 * Math.sin(a * 3 + seed * 2.1) +
        0.10 * Math.sin(a * 5 + seed * 4.7) +
        0.06 * Math.sin(a * 8 + seed * 1.3);
      const x = cx + Math.cos(a) * r * wob;
      const y = cy + Math.sin(a) * r * wob * squash;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function drawPlano(ctx, W, H, t) {
    ctx.clearRect(0, 0, W, H);
    const s = W / 560; /* escala de diseño */
    const mono = (px, weight) => (weight || 500) + " " + (px * s).toFixed(1) + "px 'IBM Plex Mono', monospace";

    const tA = phase(t, 0.00, 0.26); /* levantamiento */
    const tB = phase(t, 0.24, 0.52); /* propuesta */
    const tC = phase(t, 0.50, 0.78); /* ejecución */
    const tD = phase(t, 0.78, 1.00); /* sello */

    ctx.save();
    /* deriva global sutil del plano */
    ctx.translate(W / 2, H / 2);
    ctx.rotate((t - 0.5) * 0.022);
    ctx.scale(1 + t * 0.025, 1 + t * 0.025);
    ctx.translate(-W / 2, -H / 2);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    /* ── A · Contornos topográficos (la ciénaga) ── */
    const cx = W * 0.40, cy = H * 0.34;
    const rings = 6;
    for (let k = 0; k < rings; k++) {
      const kk = phase(easeOut(tA), k * 0.09, 0.62 + k * 0.06);
      if (kk <= 0) continue;
      const r = (30 + k * 26) * s;
      ctx.strokeStyle = INK + (0.42 - k * 0.05) + ")";
      ctx.lineWidth = 1.1 * s;
      progStroke(ctx, Math.PI * 2 * r * 1.2, kk, () => {
        contourPath(ctx, cx, cy, r, k * 1.7 + 3, 0.78);
        ctx.stroke();
      });
    }
    /* espejo de agua (se llena en ejecución) */
    if (tC > 0) {
      ctx.fillStyle = "rgba(62, 207, 178, " + (0.16 * tC) + ")";
      contourPath(ctx, cx, cy, 30 * s, 3, 0.78);
      ctx.fill();
    }

    /* cruces de retícula */
    if (tA > 0.3) {
      const ga = (tA - 0.3) / 0.7;
      ctx.strokeStyle = INK + (0.20 * ga) + ")";
      ctx.lineWidth = 1 * s;
      for (let gx = 1; gx < 5; gx++) {
        for (let gy = 1; gy < 6; gy++) {
          const x = (gx / 5) * W, y = (gy / 6) * H, c = 5 * s;
          ctx.beginPath();
          ctx.moveTo(x - c, y); ctx.lineTo(x + c, y);
          ctx.moveTo(x, y - c); ctx.lineTo(x, y + c);
          ctx.stroke();
        }
      }
      ctx.fillStyle = INK + (0.5 * ga) + ")";
      ctx.font = mono(9);
      ctx.fillText("N 10°25'", 16 * s, 22 * s);
      ctx.fillText("W 75°31'", 16 * s, 34 * s);
      ctx.textAlign = "right";
      ctx.fillText("LEVANTAMIENTO 1:500", W - 16 * s, 22 * s);
      ctx.textAlign = "left";
    }

    /* ── B · Propuesta técnica (PTAR punteada + cotas) ── */
    const bx = W * 0.66, by = H * 0.66;
    if (tB > 0) {
      const eB = easeOut(tB);
      ctx.strokeStyle = AZURE;
      ctx.lineWidth = 1.3 * s;

      /* tres tanques */
      [0, 1, 2].forEach((i) => {
        const kk = phase(eB, i * 0.14, 0.6 + i * 0.13);
        if (kk <= 0) return;
        const r = 22 * s, x = bx + (i - 1) * 58 * s, y = by;
        ctx.save();
        ctx.setLineDash([5 * s, 4 * s]);
        progStroke(ctx, Math.PI * 2 * r, kk, () => {
          ctx.beginPath();
          ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * kk);
          ctx.stroke();
        });
        ctx.restore();
        if (kk > 0.9) {
          ctx.fillStyle = INK + "0.55)";
          ctx.font = mono(8);
          ctx.textAlign = "center";
          ctx.fillText("T-" + (i + 1), x, y + 3 * s);
          ctx.textAlign = "left";
        }
      });

      /* caseta con achurado */
      const hx = bx - 96 * s, hy = by - 74 * s, hw = 64 * s, hh = 40 * s;
      const kH = phase(eB, 0.3, 0.85);
      if (kH > 0) {
        ctx.save();
        ctx.setLineDash([5 * s, 4 * s]);
        progStroke(ctx, (hw + hh) * 2, kH, () => {
          ctx.strokeRect(hx, hy, hw, hh);
        });
        ctx.restore();
        const nH = Math.floor(kH * 7);
        ctx.strokeStyle = "rgba(14, 134, 200, 0.5)";
        ctx.lineWidth = 1 * s;
        for (let i = 1; i <= nH; i++) {
          const off = (i / 8) * (hw + hh);
          ctx.beginPath();
          ctx.moveTo(hx + Math.min(off, hw), hy + Math.max(0, off - hw));
          ctx.lineTo(hx + Math.max(0, off - hh), hy + Math.min(off, hh));
          ctx.stroke();
        }
      }

      /* cota con flechas */
      if (tB > 0.62) {
        const ka = (tB - 0.62) / 0.38;
        const y2 = by + 42 * s;
        const x1 = bx - 80 * s, x2 = bx + 80 * s;
        const xm = lerp(x1, x2, ka);
        ctx.strokeStyle = EMERALD;
        ctx.lineWidth = 1.1 * s;
        ctx.beginPath(); ctx.moveTo(x1, y2); ctx.lineTo(xm, y2); ctx.stroke();
        const arr = (x, dir) => {
          ctx.beginPath();
          ctx.moveTo(x, y2);
          ctx.lineTo(x + 6 * s * dir, y2 - 3.5 * s);
          ctx.moveTo(x, y2);
          ctx.lineTo(x + 6 * s * dir, y2 + 3.5 * s);
          ctx.stroke();
        };
        arr(x1, 1);
        if (ka > 0.96) arr(x2, -1);
        ctx.fillStyle = EMERALD;
        ctx.font = mono(9, 600);
        ctx.textAlign = "center";
        ctx.globalAlpha = ka;
        ctx.fillText("Ø 8.0 m · 3 UN", (x1 + x2) / 2, y2 + 14 * s);
        ctx.globalAlpha = 1;
        ctx.textAlign = "left";
      }
    }

    /* ── C · Ejecución (flujo de agua, tanques activos) ── */
    if (tC > 0) {
      const eC = easeOut(tC);
      /* tubería ciénaga → tanques */
      const p0 = { x: cx + 20 * s, y: cy + 30 * s };
      const p1 = { x: cx + 60 * s, y: by - 40 * s };
      const p2 = { x: bx - 60 * s, y: by };
      ctx.strokeStyle = AQUA;
      ctx.lineWidth = 2 * s;
      ctx.save();
      ctx.setLineDash([9 * s, 7 * s]);
      ctx.lineDashOffset = -t * 260 * s; /* el flujo corre al hacer scroll */
      const per = 300 * s;
      progStroke(ctx, per, eC, () => {
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
        ctx.stroke();
      });
      ctx.restore();

      /* tanques se llenan */
      [0, 1, 2].forEach((i) => {
        const kk = phase(eC, 0.3 + i * 0.16, 0.75 + i * 0.08);
        if (kk <= 0) return;
        const r = 22 * s, x = bx + (i - 1) * 58 * s;
        ctx.fillStyle = "rgba(62, 207, 178, " + (0.22 * kk) + ")";
        ctx.strokeStyle = EMERALD;
        ctx.lineWidth = 1.4 * s;
        ctx.beginPath(); ctx.arc(x, by, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });

      ctx.fillStyle = INK + (0.55 * eC) + ")";
      ctx.font = mono(8);
      ctx.fillText("LÍNEA DE FLUJO — Q = 12 L/s", W * 0.12, H * 0.56);
    }

    /* ── D · Sello de cumplimiento ── */
    if (tD > 0) {
      const eD = clamp(backOut(tD), 0, 1.2);
      const sx = W * 0.26, sy = H * 0.78, R = 46 * s;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(-0.22);
      ctx.scale(0.5 + 0.5 * eD, 0.5 + 0.5 * eD);
      ctx.globalAlpha = clamp(tD * 2.2, 0, 1);

      ctx.strokeStyle = EMERALD;
      ctx.lineWidth = 2 * s;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1 * s;
      ctx.beginPath(); ctx.arc(0, 0, R - 7 * s, 0, Math.PI * 2); ctx.stroke();

      ctx.fillStyle = EMERALD;
      ctx.font = mono(13, 600);
      ctx.textAlign = "center";
      ctx.fillText("CUMPLE", 0, -2 * s);
      ctx.font = mono(7);
      ctx.fillText("AUTORIDAD AMBIENTAL", 0, 12 * s);

      /* chulo */
      const kV = phase(tD, 0.45, 1);
      if (kV > 0) {
        ctx.strokeStyle = EMERALD;
        ctx.lineWidth = 2.6 * s;
        progStroke(ctx, 40 * s, kV, () => {
          ctx.beginPath();
          ctx.moveTo(-10 * s, 22 * s);
          ctx.lineTo(-3 * s, 29 * s);
          ctx.lineTo(12 * s, 16 * s);
          ctx.stroke();
        });
      }
      ctx.restore();

      ctx.fillStyle = INK + (0.6 * clamp(tD * 1.6, 0, 1)) + ")";
      ctx.font = mono(8);
      ctx.fillText("RAD. CARDIQUE 26-0417", sx - 42 * s, sy + R + 20 * s);
    }

    ctx.restore();
  }

  function initPlano() {
    const stage  = $("#procesoStage");
    const canvas = $("#planoCanvas");
    const frame  = $(".plano-frame");
    const hud    = $("#frameCounter");
    const bar    = $("#planoBarFill");
    const steps  = $$(".step");
    if (!stage || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(2, devicePixelRatio || 1);
    let W = 0, H = 0;
    function resize() {
      const r = frame.getBoundingClientRect();
      W = Math.max(2, Math.round(r.width));
      H = Math.max(2, Math.round(r.height));
      canvas.width  = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      lastFrame = -1;
      render(current);
    }

    let current = 0;
    let lastFrame = -1;

    function render(t) {
      const f = Math.round(t * (FRAMES - 1));
      if (f === lastFrame) return;
      lastFrame = f;
      drawPlano(ctx, W, H, f / (FRAMES - 1));
      if (hud) hud.textContent = "F." + String(f + 1).padStart(3, "0") + "/" + String(FRAMES).padStart(3, "0");
    }

    function update(p) {
      current = clamp(p, 0, 1);
      render(current);
      if (bar) bar.style.transform = "scaleX(" + current + ")";
      const idx = clamp(Math.floor(current * 4), 0, 3);
      steps.forEach((st, i) => {
        st.classList.toggle("is-active", i === idx);
        st.classList.toggle("is-done", i < idx);
        const fill = $(".step-bar span", st);
        if (fill) fill.style.transform = "scaleY(" + clamp(current * 4 - i, 0, 1) + ")";
      });
      /* parallax anidado: el plano respira dentro del pin */
      if (frame) frame.style.translate = "0 " + ((current - 0.5) * -22).toFixed(1) + "px";
    }

    resize();
    addEventListener("resize", resize);

    if (hasGSAP() && !reduced) {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const st = ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: "+=260%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => update(self.progress),
          onRefresh: () => { lastFrame = -1; render(current); }
        });
        return () => st.kill();
      });
      mm.add("(max-width: 1023px)", () => {
        const st = ScrollTrigger.create({
          trigger: stage,
          start: "top 60%",
          end: "bottom 95%",
          scrub: 0.6,
          onUpdate: (self) => update(self.progress)
        });
        return () => st.kill();
      });
    } else {
      /* Sin GSAP: la secuencia sigue el scroll nativo */
      const onScroll = () => {
        const r = stage.getBoundingClientRect();
        const total = r.height + innerHeight * 0.4;
        const p = clamp((innerHeight * 0.7 - r.top) / total, 0, 1);
        update(p);
      };
      addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  /* ═══════════════════════════════════════════════════════════
     BOTONES MAGNÉTICOS — Motion (springs)
  ═══════════════════════════════════════════════════════════ */
  function initMagnetic() {
    if (!hasMotion() || reduced || !finePtr) return;
    const { animate } = window.Motion;

    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        animate(el, { x: dx * 9, y: dy * 6 }, { type: "spring", stiffness: 320, damping: 24, mass: 0.5 });
      });
      el.addEventListener("pointerleave", () => {
        animate(el, { x: 0, y: 0 }, { type: "spring", stiffness: 200, damping: 16 });
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     FORMULARIO → WhatsApp
  ═══════════════════════════════════════════════════════════ */
  function initContactForm() {
    const form = $("#contactoForm");
    if (!form) return;
    const status = $("#formStatus");
    const submitBtn = $("#contactoSubmit");

    const setStatus = (kind, msg) => {
      if (!status) return;
      status.className = "form-status " + (kind === "ok" ? "is-ok" : "is-err");
      status.textContent = msg;
    };

    const waCompose = (d) => {
      const parts = ["Hola ECODESA%2C me comunico desde el sitio web.%0A"];
      parts.push("*Nombre%3A* " + encodeURIComponent(d.nombre));
      if (d.empresa) parts.push("*Empresa%3A* " + encodeURIComponent(d.empresa));
      parts.push("*Tel%C3%A9fono%3A* " + encodeURIComponent(d.telefono));
      if (d.servicio) parts.push("*Servicio%3A* " + encodeURIComponent(d.servicio));
      parts.push("*Mensaje%3A* " + encodeURIComponent(d.mensaje));
      window.open("https://wa.me/573013653273?text=" + parts.join("%0A"), "_blank", "noopener,noreferrer");
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const data = {
        nombre:   form.nombre.value.trim(),
        empresa:  form.empresa.value.trim(),
        telefono: form.telefono.value.trim(),
        servicio: form.servicio.value,
        mensaje:  form.mensaje.value.trim(),
        website:  form.website ? form.website.value : "" /* honeypot */
      };

      if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = "0.7"; }

      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 8000);
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: ctrl.signal
        });
        clearTimeout(t);
        if (!res.ok) throw new Error("HTTP " + res.status);
        setStatus("ok", "Recibimos tu solicitud. Te contactamos en menos de 24 horas hábiles.");
        form.reset();
      } catch (err) {
        /* Sin backend (local o error de red): la solicitud sale por WhatsApp */
        setStatus("err", "No pudimos guardar tu solicitud en línea — te abrimos WhatsApp para enviarla directo.");
        waCompose(data);
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ""; }
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     BOOT
  ═══════════════════════════════════════════════════════════ */
  function boot() {
    if (hasGSAP()) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (e) {}
    }

    safe(initLenis,            "lenis");
    safe(initNav,              "nav");
    safe(initHeroIntro,        "heroIntro");
    safe(initProgressFallback, "progress");
    safe(initShader,           "shader");
    safe(initParticles,        "particles");
    safe(initReveals,          "reveals");
    safe(initServiceCardGrow,  "serviceGrow");
    safe(initCounters,         "counters");
    safe(initServicios,        "servicios");
    safe(initParallax,         "parallax");
    safe(initPlano,            "plano");
    safe(initMagnetic,         "magnetic");
    safe(initContactForm,      "form");

    if (hasGSAP()) {
      addEventListener("load", () => ScrollTrigger.refresh());
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
