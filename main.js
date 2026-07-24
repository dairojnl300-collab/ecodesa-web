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
  const lowEnd   = (navigator.hardwareConcurrency || 4) <= 4;
  const hasGSAP  = () => !!(window.gsap && window.ScrollTrigger);
  const hasLenis = () => typeof window.Lenis === "function";
  const hasMotion= () => !!(window.Motion && window.Motion.animate);

  const THEME_KEY = "ecodesa-theme";
  const getTheme  = () => document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const readCssPx = (name, fallback) => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  const PARTICLE_PALETTES = {
    light: [
      "rgba(12, 138, 95, 0.26)",
      "rgba(53, 201, 172, 0.2)",
      "rgba(10, 46, 35, 0.12)",
      "rgba(14, 134, 200, 0.14)"
    ],
    dark: [
      "rgba(0, 230, 118, 0.32)",
      "rgba(105, 240, 174, 0.26)",
      "rgba(27, 94, 32, 0.2)",
      "rgba(200, 230, 201, 0.16)"
    ]
  };

  const CLOSE_MESH_PALETTES = {
    light: {
      nodes: [[12, 138, 95], [10, 107, 86], [11, 91, 102]],
      line:  [12, 120, 108],
      glow:  [12, 138, 95]
    },
    dark: {
      nodes: [[70, 210, 255], [0, 190, 230], [90, 255, 220]],
      line:  [55, 235, 210],
      glow:  [0, 230, 195]
    }
  };

  const CLOSE_LAYERS = [
    { z: -130, rBase: 3.2, rVar: 1.2, alpha: 0.34, glow: 10 },
    { z: -35,  rBase: 5.5, rVar: 1.5, alpha: 0.42, glow: 18 },
    { z: 95,   rBase: 7.5, rVar: 2.0, alpha: 0.5,  glow: 26 }
  ];

  const CONSTELLATION_PALETTES = {
    light: {
      nodes: [[8, 190, 130], [0, 210, 185], [0, 175, 230]],
      line:  [10, 210, 160],
      pulse: [0, 230, 210],
      glow:  [40, 240, 200]
    },
    dark: {
      nodes: [[60, 255, 170], [100, 255, 220], [80, 220, 255]],
      line:  [80, 255, 200],
      pulse: [120, 255, 220],
      glow:  [0, 255, 200]
    }
  };

  const CONST_CLUSTERS = [
    { cx: 0.17, cy: 0.30, rx: 0.15, ry: 0.17, n: 12 },
    { cx: 0.83, cy: 0.26, rx: 0.14, ry: 0.16, n: 11 },
    { cx: 0.30, cy: 0.76, rx: 0.16, ry: 0.15, n: 12 },
    { cx: 0.78, cy: 0.70, rx: 0.15, ry: 0.16, n: 10 }
  ];

  const CONST_LAYER = [
    { speed: 0.42, rBase: 8,  rVar: 1.5, alpha: 0.62, glow: 14 },
    { speed: 0.72, rBase: 10, rVar: 2.0, alpha: 0.78, glow: 22 },
    { speed: 1.12, rBase: 12, rVar: 2.0, alpha: 0.92, glow: 30 }
  ];

  function initThemeToggle() {
    const btn = $("#themeToggle");
    if (!btn) return;

    const systemTheme = () => matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const syncUi = (theme) => {
      const dark = theme === "dark";
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.setAttribute("aria-label", dark ? "Activar modo claro" : "Activar modo oscuro");
      btn.title = dark ? "Modo claro" : "Modo oscuro";
    };

    const applyTheme = (theme, persist) => {
      const next = theme === "dark" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      if (persist) localStorage.setItem(THEME_KEY, next);
      syncUi(next);
      window.dispatchEvent(new CustomEvent("ecodesa-theme-change", { detail: { theme: next } }));
    };

    const stored = localStorage.getItem(THEME_KEY);
    applyTheme(stored || systemTheme(), false);
    syncUi(getTheme());

    btn.addEventListener("click", () => {
      applyTheme(getTheme() === "dark" ? "light" : "dark", true);
    });
  }

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
    "uniform vec2 uRes; uniform float uT; uniform vec2 uMouse; uniform float uFade; uniform float uDark;",
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
    "  vec3 paper = mix(vec3(0.965, 0.984, 0.976), vec3(0.024, 0.051, 0.027), step(0.5, uDark));",
    "  vec3 aqua  = mix(vec3(0.243, 0.812, 0.698), vec3(0.412, 0.941, 0.682), step(0.5, uDark));",
    "  vec3 emer  = mix(vec3(0.047, 0.541, 0.373), vec3(0.0, 0.902, 0.463), step(0.5, uDark));",
    "  vec3 azur  = mix(vec3(0.055, 0.525, 0.784), vec3(0.18, 0.62, 0.86), step(0.5, uDark));",
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
    const uDark  = gl.getUniformLocation(prog, "uDark");
    let shaderDark = getTheme() === "dark" ? 1 : 0;
    window.addEventListener("ecodesa-theme-change", (e) => {
      shaderDark = e.detail.theme === "dark" ? 1 : 0;
    });

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
        gl.uniform1f(uDark, shaderDark);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      if (!reduced) requestAnimationFrame(frame);
    }

    if (reduced) {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, 8.0);
      gl.uniform2f(uMouse, 0.6, 0.6);
      gl.uniform1f(uFade, 0);
      gl.uniform1f(uDark, shaderDark);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } else {
      requestAnimationFrame(frame);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     PARTÍCULAS FLOTANTES — hero, desktop, deep forest dark
  ═══════════════════════════════════════════════════════════ */
  function initParticles() {
    if (reduced) return;
    if (lowEnd && matchMedia("(max-width: 767px)").matches) return;

    const canvas = $("#particlesCanvas");
    const hero   = $("#hero");
    if (!canvas || !hero) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mobile = matchMedia("(max-width: 767px)").matches;
    const COUNT  = lowEnd ? 12 : (mobile ? 14 : 25);
    const paletteFor = () => PARTICLE_PALETTES[getTheme()] || PARTICLE_PALETTES.light;

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
      const COLORS = paletteFor();
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
    window.addEventListener("ecodesa-theme-change", () => {
      const COLORS = paletteFor();
      particles.forEach((p, i) => { p.color = COLORS[i % COLORS.length]; });
    });

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
     CONSTELACIÓN — Nosotros · Three.js 3D con fallback canvas 2D
  ═══════════════════════════════════════════════════════════ */
  function runConstellation2D(canvas, section) {

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const INTRA_LINK_DIST  = 220;
    const BRIDGE_LINK_DIST = 100;
    const LINK_ALPHA_INTRA = [0.4, 0.7];
    const LINK_ALPHA_BRIDGE = [0.12, 0.28];
    const MAGNET_RADIUS    = 120;
    const isStatic         = reduced;
    const hasMagnet        = finePtr && !isStatic;
    const rgba             = (rgb, a) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;
    const paletteFor       = () => CONSTELLATION_PALETTES[getTheme()] || CONSTELLATION_PALETTES.light;

    let w = 0, h = 0, dpr = 1, nodes = [], pulses = [], visible = true;
    let mx = -9999, my = -9999, nextPulseAt = 0, frameSkip = 0;

    const resize = () => {
      const rect = section.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.width  = Math.round(rect.width  * dpr);
      h = canvas.height = Math.round(rect.height * dpr);
      canvas.style.width  = rect.width  + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = () => {
      const W = w / dpr, H = h / dpr;
      const pal = paletteFor();
      nodes = [];
      CONST_CLUSTERS.forEach((c, ci) => {
        for (let k = 0; k < c.n; k++) {
          const layer = k % 3;
          const L = CONST_LAYER[layer];
          const angle = Math.random() * Math.PI * 2;
          const dist  = Math.sqrt(Math.random());
          nodes.push({
            cluster: ci,
            layer,
            ax: W * c.cx + Math.cos(angle) * c.rx * W * dist,
            ay: H * c.cy + Math.sin(angle) * c.ry * H * dist,
            x: 0, y: 0,
            color: pal.nodes[(ci + k) % pal.nodes.length],
            glowColor: pal.glow,
            seed:  Math.random() * Math.PI * 2,
            seed2: Math.random() * Math.PI * 2,
            seed3: Math.random() * Math.PI * 2,
            f1: 0.22 + Math.random() * 0.18,
            f2: 0.38 + Math.random() * 0.24,
            f3: 0.30 + Math.random() * 0.18,
            f4: 0.48 + Math.random() * 0.22,
            a1: 18 + Math.random() * 26,
            a2: 10 + Math.random() * 16,
            rBase: L.rBase + Math.random() * L.rVar,
            alpha: L.alpha,
            glow: L.glow,
            speed: L.speed,
            phase: Math.random() * Math.PI * 2,
            pulseHz: 0.0016 + Math.random() * 0.001
          });
        }
      });
      pulses = [];
      nextPulseAt = performance.now() + 2500 + Math.random() * 1500;
    };

    const nodePos = (n, now, W, H) => {
      if (isStatic) {
        n.x = n.ax;
        n.y = n.ay;
        return;
      }
      const t = now * 0.001;
      const s = n.speed;
      n.x = n.ax
        + Math.sin(t * n.f1 + n.seed)  * n.a1 * s
        + Math.sin(t * n.f2 + n.seed2) * n.a2 * s * 0.65;
      n.y = n.ay
        + Math.cos(t * n.f3 + n.seed3) * n.a1 * s * 0.82
        + Math.sin(t * n.f4 + n.seed)  * n.a2 * s * 0.55;
      n.x = clamp(n.x, 20, W - 20);
      n.y = clamp(n.y, 20, H - 20);

      if (hasMagnet) {
        const dx = mx - n.x, dy = my - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MAGNET_RADIUS && dist > 1) {
          const pull = (1 - dist / MAGNET_RADIUS) * 0.5 * n.speed;
          n.x += (dx / dist) * pull;
          n.y += (dy / dist) * pull;
        }
      }
    };

    const collectLinks = () => {
      const links = [];
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const same = a.cluster === b.cluster;
          const maxDist = same ? INTRA_LINK_DIST : BRIDGE_LINK_DIST;
          const dx = b.x - a.x, dy = b.y - a.y;
          if (Math.abs(dx) > maxDist || Math.abs(dy) > maxDist) continue;
          const dist = Math.hypot(dx, dy);
          if (dist > maxDist) continue;
          const proximity = 1 - dist / maxDist;
          const alphaRange = same ? LINK_ALPHA_INTRA : LINK_ALPHA_BRIDGE;
          const alpha = lerp(alphaRange[0], alphaRange[1], proximity);
          links.push({ i, j, dist, proximity, alpha, same });
        }
      }
      return links;
    };

    const drawLinks = (links, pal) => {
      links.forEach(({ i, j, proximity, alpha, same }) => {
        const a = nodes[i], b = nodes[j];
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        const [lr, lg, lb] = pal.line;
        const edge = same ? 0.08 : 0.22;
        grad.addColorStop(0,   `rgba(${lr},${lg},${lb},${alpha * edge})`);
        grad.addColorStop(0.5, `rgba(${lr},${lg},${lb},${alpha})`);
        grad.addColorStop(1,   `rgba(${lr},${lg},${lb},${alpha * edge})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = same ? 1.5 + proximity * 1.0 : 0.8 + proximity * 0.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });
    };

    const drawNodes = (now) => {
      const sorted = nodes.slice().sort((a, b) => a.layer - b.layer);
      sorted.forEach(n => {
        let r = n.rBase;
        let alpha = n.alpha;
        let glow = n.glow;
        if (!isStatic) {
          r = clamp(n.rBase + Math.sin(now * n.pulseHz + n.phase) * 1.8, 8, 14);
          alpha = n.alpha + Math.sin(now * n.pulseHz * 1.1 + n.phase) * 0.08;
        }
        if (hasMagnet) {
          const dist = Math.hypot(mx - n.x, my - n.y);
          if (dist < MAGNET_RADIUS) {
            const boost = (1 - dist / MAGNET_RADIUS) * 0.25;
            alpha = clamp(alpha + boost, 0, 1);
            glow += boost * 16;
            r += boost * 2;
          }
        }
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = glow;
        ctx.shadowColor = rgba(n.glowColor, 0.75);
        ctx.fillStyle = rgba(n.color, 1);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha * 0.9;
        ctx.shadowBlur = glow * 0.5;
        ctx.fillStyle = rgba([255, 255, 255], n.layer >= 1 ? 0.45 : 0.25);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });
    };

    const spawnPulse = (links) => {
      const intra = links.filter(l => l.same);
      if (!intra.length || pulses.length >= 3) return;
      const link = intra[Math.floor(Math.random() * intra.length)];
      const flip = Math.random() > 0.5;
      pulses.push({
        from: flip ? link.i : link.j,
        to:   flip ? link.j : link.i,
        t: 0,
        speed: 0.007 + Math.random() * 0.006,
        trail: []
      });
    };

    const drawPulses = (pal) => {
      if (isStatic) return;
      pulses = pulses.filter(p => p.t <= 1.05);
      pulses.forEach(p => {
        const a = nodes[p.from], b = nodes[p.to];
        if (!a || !b) return;
        p.t += p.speed;
        const px = lerp(a.x, b.x, p.t);
        const py = lerp(a.y, b.y, p.t);
        p.trail.push({ x: px, y: py });
        if (p.trail.length > 12) p.trail.shift();
        p.trail.forEach((pt, idx) => {
          const fade = (idx + 1) / p.trail.length;
          ctx.globalAlpha = fade * 0.55;
          ctx.fillStyle = rgba(pal.pulse, fade * 0.7);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2 + fade * 2, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 22;
        ctx.shadowColor = rgba(pal.pulse, 0.95);
        ctx.fillStyle = rgba(pal.pulse, 1);
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    const draw = (now = 0) => {
      const W = w / dpr, H = h / dpr;
      const pal = paletteFor();
      ctx.clearRect(0, 0, W, H);

      nodes.forEach(n => nodePos(n, now, W, H));
      const links = collectLinks();
      drawLinks(links, pal);
      drawNodes(now);
      drawPulses(pal);

      if (!isStatic && now >= nextPulseAt) {
        spawnPulse(links);
        nextPulseAt = now + 2500 + Math.random() * 2000;
      }
    };

    resize();
    spawn();
    draw(0);

    addEventListener("resize", () => { resize(); spawn(); draw(performance.now()); }, { passive: true });
    window.addEventListener("ecodesa-theme-change", () => {
      const pal = paletteFor();
      nodes.forEach((n, i) => {
        n.color = pal.nodes[(n.cluster + i) % pal.nodes.length];
        n.glowColor = pal.glow;
      });
      draw(isStatic ? 0 : performance.now());
    });

    if (hasMagnet) {
      section.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mx = e.clientX - rect.left;
        my = e.clientY - rect.top;
      }, { passive: true });
      section.addEventListener("mouseleave", () => { mx = -9999; my = -9999; });
    }

    if (isStatic) return;

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 })
        .observe(section);
    }

    const frame = (now) => {
      if (!document.hidden && visible) {
        if (lowEnd) {
          frameSkip = (frameSkip + 1) % 2;
          if (frameSkip === 0) draw(now);
        } else {
          draw(now);
        }
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  function initConstellation() {
    if (!matchMedia("(min-width: 768px)").matches) return;

    const canvas  = $("#constellationCanvas");
    const section = $("#nosotros");
    if (!canvas || !section) return;

    const fallback = () => runConstellation2D(canvas, section);

    if (reduced) {
      fallback();
      return;
    }

    const boot3d = () => {
      if (window.EcodesaConstellation3D) {
        window.EcodesaConstellation3D.start(canvas, section, fallback);
      } else {
        fallback();
      }
    };

    if (window.EcodesaConstellation3D) {
      boot3d();
      return;
    }

    const script = document.createElement("script");
    script.src = "lib/constellation-3d.js?v=vendor3d6";
    script.async = true;
    script.onload = boot3d;
    script.onerror = fallback;
    document.head.appendChild(script);
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
     GROW-IN — IntersectionObserver reutilizable
  ═══════════════════════════════════════════════════════════ */
  function observeGrowIn(selector, opts) {
    const options = opts || {};
    const grownClass = options.grownClass || "is-grown";
    const threshold  = options.threshold  ?? 0.12;
    const rootMargin = options.rootMargin || "0px 0px -4% 0px";
    const safetyMs   = options.safetyMs   ?? 5000;

    const els = typeof selector === "string" ? $$(selector) : selector;
    if (!els.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add(grownClass));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add(grownClass);
        io.unobserve(e.target);
      });
    }, { threshold, rootMargin });

    els.forEach(el => io.observe(el));
    setTimeout(() => els.forEach(el => el.classList.add(grownClass)), safetyMs);
  }

  /* ═══════════════════════════════════════════════════════════
     SERVICE CARDS — grow-in al entrar en viewport
  ═══════════════════════════════════════════════════════════ */
  function initServiceCardGrow() {
    observeGrowIn(".service-card");
  }

  /* ═══════════════════════════════════════════════════════════
     NEGOCIOS COMERCIALES — grow-in 3D escalonado
  ═══════════════════════════════════════════════════════════ */
  function initNcCardGrow() {
    const grid = $("#ncGrid");
    if (!grid) return;
    observeGrowIn([grid], { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
  }

  function initNcCardTilt() {
    if (reduced || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const grid = $("#ncGrid");
    if (!grid) return;

    const MAX_DEG = () => readCssPx("--tilt-max-deg", 8);
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    $$(".nc-card").forEach((card) => {
      card.addEventListener("pointerenter", () => card.classList.add("nc-tilting"));
      card.addEventListener("pointermove", (e) => {
        if (!grid.classList.contains("is-grown")) return;
        const r = card.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--nc-ry", clamp(nx * MAX_DEG() * 2, -MAX_DEG(), MAX_DEG()) + "deg");
        card.style.setProperty("--nc-rx", clamp(-ny * MAX_DEG() * 2, -MAX_DEG(), MAX_DEG()) + "deg");
      });
      card.addEventListener("pointerleave", () => {
        card.classList.remove("nc-tilting");
        card.style.setProperty("--nc-rx", "0deg");
        card.style.setProperty("--nc-ry", "0deg");
      });
    });
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
     HERO DEPTH PARALLAX — translateY cross-platform (iOS-safe)
     Fondo 0.3x · media 0.6x · frente 1x · gama baja: 2 capas
  ═══════════════════════════════════════════════════════════ */
  function initHeroDepthParallax() {
    if (reduced) return;

    const hero = $("#hero");
    if (!hero) return;

    const back  = $(".hero-depth-layer[data-hero-layer='back']", hero);
    const mid   = $(".hero-depth-layer[data-hero-layer='mid']", hero);
    const front = $(".hero-depth-layer[data-hero-layer='front']", hero);
    if (!back || !front) return;

    const layers = [{ el: back, speed: 0.3 }];
    if (!lowEnd && mid) {
      layers.push({ el: mid, speed: 0.6 });
    }
    layers.push({ el: front, speed: 1 });

    hero.classList.add("is-depth-active");

    const MAX_TRAVEL = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--depth-travel").trim();
      const n = parseFloat(raw);
      return Number.isFinite(n) ? n : (lowEnd ? 140 : 180);
    };
    const FADE_MIN = () => readCssPx("--parallax-fade-min", 0.28);
    let inView = false;
    let ticking = false;
    let exitP = 0;

    const getScrollY = () => (lenis && typeof lenis.scroll === "number") ? lenis.scroll : scrollY;

    const apply = () => {
      ticking = false;
      const rect = hero.getBoundingClientRect();
      const heroH = Math.max(hero.offsetHeight, 1);
      const progress = clamp(-rect.top / heroH, 0, 1);
      exitP = progress;
      heroExitP = progress;

      if (!inView && progress <= 0) return;

      const offset = progress * MAX_TRAVEL();
      layers.forEach(({ el, speed }) => {
        const y = -(offset * speed);
        el.style.transform = "translate3d(0," + y.toFixed(2) + "px,0)";
      });

      if (progress > 0.001) {
        front.style.opacity = String(lerp(1, FADE_MIN(), progress));
      } else {
        front.style.opacity = "";
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };

    const setActive = (active) => {
      inView = active;
      const wc = active ? "transform" : "auto";
      layers.forEach(({ el }) => { el.style.willChange = wc; });
      front.style.willChange = active ? "transform, opacity" : "auto";
      if (!active) {
        layers.forEach(({ el }) => {
          el.style.transform = "";
          el.style.willChange = "auto";
        });
        front.style.opacity = "";
        front.style.willChange = "auto";
      } else {
        apply();
      }
    };

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
        root: null,
        threshold: 0,
        rootMargin: "10% 0px 10% 0px"
      }).observe(hero);
    } else {
      setActive(true);
    }

    if (lenis) {
      lenis.on("scroll", onScroll);
    } else {
      addEventListener("scroll", onScroll, { passive: true });
    }

    apply();
  }

  /* ═══════════════════════════════════════════════════════════
     PARALLAX — topo de la ficha (GSAP); hero usa depth layers
  ═══════════════════════════════════════════════════════════ */
  function initParallax() {
    initHeroDepthParallax();
    if (!hasGSAP() || reduced) return;

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

  function getPlanoPalette() {
    if (getTheme() === "dark") {
      return {
        ink: "rgba(232, 245, 233, ",
        inkStroke: "rgba(0, 230, 118, ",
        emerald: "#0C8A5F",
        aqua: "#3ECFB2",
        azure: "#0E86C8",
        waterFill: "rgba(62, 207, 178, ",
        hatch: "rgba(14, 134, 200, 0.5)",
        cota: "#69f0ae"
      };
    }
    return {
      ink: "rgba(6, 46, 36, ",
      inkStroke: "rgba(6, 46, 36, ",
      emerald: "#0C8A5F",
      aqua: "#3ECFB2",
      azure: "#0E86C8",
      waterFill: "rgba(62, 207, 178, ",
      hatch: "rgba(14, 134, 200, 0.5)",
      cota: "#0C8A5F"
    };
  }

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
    const P = getPlanoPalette();
    const textMul = getTheme() === "dark" ? 0.88 : 0.5;
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
      ctx.strokeStyle = P.inkStroke + (0.42 - k * 0.05) + ")";
      ctx.lineWidth = 1.1 * s;
      progStroke(ctx, Math.PI * 2 * r * 1.2, kk, () => {
        contourPath(ctx, cx, cy, r, k * 1.7 + 3, 0.78);
        ctx.stroke();
      });
    }
    /* espejo de agua (se llena en ejecución) */
    if (tC > 0) {
      ctx.fillStyle = P.waterFill + (0.16 * tC) + ")";
      contourPath(ctx, cx, cy, 30 * s, 3, 0.78);
      ctx.fill();
    }

    /* cruces de retícula */
    if (tA > 0.3) {
      const ga = (tA - 0.3) / 0.7;
      ctx.strokeStyle = P.inkStroke + (0.20 * ga) + ")";
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
      ctx.fillStyle = P.ink + (textMul * ga) + ")";
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
      ctx.strokeStyle = P.azure;
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
          ctx.fillStyle = P.ink + (getTheme() === "dark" ? "0.82)" : "0.55)");
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
        ctx.strokeStyle = P.hatch;
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
        ctx.strokeStyle = P.emerald;
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
        ctx.fillStyle = P.cota;
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
      ctx.strokeStyle = P.aqua;
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
        ctx.fillStyle = P.waterFill + (0.22 * kk) + ")";
        ctx.strokeStyle = P.emerald;
        ctx.lineWidth = 1.4 * s;
        ctx.beginPath(); ctx.arc(x, by, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });

      ctx.fillStyle = P.ink + (textMul * eC) + ")";
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

      ctx.strokeStyle = P.emerald;
      ctx.lineWidth = 2 * s;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1 * s;
      ctx.beginPath(); ctx.arc(0, 0, R - 7 * s, 0, Math.PI * 2); ctx.stroke();

      ctx.fillStyle = P.emerald;
      ctx.font = mono(13, 600);
      ctx.textAlign = "center";
      ctx.fillText("CUMPLE", 0, -2 * s);
      ctx.font = mono(7);
      ctx.fillText("AUTORIDAD AMBIENTAL", 0, 12 * s);

      /* chulo */
      const kV = phase(tD, 0.45, 1);
      if (kV > 0) {
        ctx.strokeStyle = P.emerald;
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

      ctx.fillStyle = P.ink + ((getTheme() === "dark" ? 0.78 : 0.6) * clamp(tD * 1.6, 0, 1)) + ")";
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
    window.addEventListener("ecodesa-theme-change", () => {
      lastFrame = -1;
      render(current);
    });

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
      window.open("https://wa.me/573246886824?text=" + parts.join("%0A"), "_blank", "noopener,noreferrer");
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
     CLOSE MESH — Contacto/Footer, red 3D con colapso suave
  ═══════════════════════════════════════════════════════════ */
  function initCloseMesh() {
    const zone   = $("#closeMeshZone");
    const canvas = $("#closeMeshCanvas");
    const scene  = zone ? $(".close-mesh-scene", zone) : null;
    if (!zone || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COUNT         = 22;
    const LINK_DIST     = 130;
    const CYCLE_MS      = 18000;
    const PERSPECTIVE   = 800;
    const isStatic      = reduced;
    const rgba          = (rgb, a) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;
    const paletteFor    = () => CLOSE_MESH_PALETTES[getTheme()] || CLOSE_MESH_PALETTES.light;
    const collapseFactor = (now) => {
      const t = (now % CYCLE_MS) / CYCLE_MS;
      return (1 - Math.cos(t * Math.PI * 2)) * 0.5;
    };

    let w = 0, h = 0, dpr = 1, nodes = [], visible = true, frameSkip = 0;

    const resize = () => {
      const rect = zone.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.width  = Math.round(rect.width  * dpr);
      h = canvas.height = Math.round(rect.height * dpr);
      canvas.style.width  = rect.width  + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const layerAlpha = (L) => getTheme() === "light"
      ? Math.min(L.alpha + 0.14, 0.62)
      : L.alpha;

    const spawn = () => {
      const pal = paletteFor();
      nodes = Array.from({ length: COUNT }, (_, i) => {
        const layer = i % 3;
        const L = CLOSE_LAYERS[layer];
        const angle = Math.random() * Math.PI * 2;
        const dist  = 0.14 + Math.random() * 0.4;
        return {
          layer,
          bx: 0.5 + Math.cos(angle) * dist * 0.88,
          by: 0.5 + Math.sin(angle) * dist * 0.82,
          z: L.z + (Math.random() - 0.5) * 24,
          rBase: L.rBase + Math.random() * L.rVar,
          alpha: layerAlpha(L),
          glow: L.glow,
          color: pal.nodes[layer % pal.nodes.length],
          glowColor: pal.glow,
          phase: Math.random() * Math.PI * 2
        };
      });
    };

    const project = (n, W, H, cx, cy, spread) => {
      const wx = cx + (n.bx - 0.5) * spread * W * 0.94;
      const wy = cy + (n.by - 0.5) * spread * H * 0.9;
      const wz = n.z * (0.55 + spread * 0.45);
      const scale = PERSPECTIVE / (PERSPECTIVE + wz);
      const x = cx + (wx - cx) * scale;
      const y = cy + (wy - cy) * scale;
      const blurFactor = n.layer === 0 ? 1.3 : n.layer === 1 ? 1 : 0.72;
      return {
        x, y, scale,
        r: n.rBase * scale,
        alpha: n.alpha * (0.68 + scale * 0.32),
        glow: n.glow * scale,
        blurFactor
      };
    };

    const nodePositions = (now, W, H) => {
      const cx = W * 0.5;
      const cy = H * 0.48;
      const collapse = isStatic ? 0 : collapseFactor(now);
      const spread = lerp(1, 0.36, collapse);
      return nodes.map(n => {
        const p = project(n, W, H, cx, cy, spread);
        if (!isStatic) {
          const t = now * 0.001;
          p.x += Math.sin(t * 0.38 + n.phase) * 5 * p.scale;
          p.y += Math.cos(t * 0.33 + n.phase) * 3.5 * p.scale;
        }
        return Object.assign({}, n, p);
      });
    };

    const collectLinks = (pos) => {
      const links = [];
      for (let i = 0; i < pos.length; i++) {
        for (let j = i + 1; j < pos.length; j++) {
          const a = pos[i], b = pos[j];
          if (Math.abs(a.layer - b.layer) > 1) continue;
          const dist = Math.hypot(b.x - a.x, b.y - a.y);
          if (dist > LINK_DIST) continue;
          const proximity = 1 - dist / LINK_DIST;
          links.push({ i, j, proximity, alpha: lerp(0.2, 0.35, proximity) * (getTheme() === "light" ? 1.15 : 1) });
        }
      }
      return links;
    };

    const drawLinks = (pos, links, pal) => {
      links.forEach(({ i, j, proximity, alpha }) => {
        const a = pos[i], b = pos[j];
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        const [lr, lg, lb] = pal.line;
        grad.addColorStop(0,   rgba([lr, lg, lb], alpha * 0.45));
        grad.addColorStop(0.5, rgba([lr, lg, lb], alpha));
        grad.addColorStop(1,   rgba([lr, lg, lb], alpha * 0.45));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.55 + proximity * 0.75;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });
    };

    const drawNodes = (pos) => {
      pos.slice().sort((a, b) => a.layer - b.layer).forEach(p => {
        const glow = p.glow * p.blurFactor;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = glow;
        ctx.shadowColor = rgba(p.glowColor, 0.88);
        ctx.fillStyle = rgba(p.color, 1);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = p.alpha * 0.88;
        ctx.shadowBlur = glow * 0.42;
        ctx.fillStyle = rgba([255, 255, 255], p.layer === 2 ? 0.52 : 0.28);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.34, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });
    };

    const syncScene = (now) => {
      if (!scene || isStatic) return;
      const collapse = collapseFactor(now);
      const scale = lerp(1, 0.93, collapse);
      const tz = lerp(0, -32, collapse);
      scene.style.transform = `scale(${scale}) translateZ(${tz}px)`;
    };

    const syncPause = () => {
      zone.classList.toggle("close-mesh--paused", document.hidden || !visible);
    };

    const draw = (now = 0) => {
      const W = w / dpr, H = h / dpr;
      const pal = paletteFor();
      const pos = nodePositions(now, W, H);
      ctx.clearRect(0, 0, W, H);
      drawLinks(pos, collectLinks(pos), pal);
      drawNodes(pos);
      syncScene(now);
    };

    resize();
    spawn();
    draw(0);

    addEventListener("resize", () => { resize(); spawn(); draw(performance.now()); }, { passive: true });
    document.addEventListener("visibilitychange", syncPause);
    window.addEventListener("ecodesa-theme-change", () => {
      const pal = paletteFor();
      nodes.forEach(n => {
        n.color = pal.nodes[n.layer % pal.nodes.length];
        n.glowColor = pal.glow;
        n.alpha = layerAlpha(CLOSE_LAYERS[n.layer]);
      });
      draw(isStatic ? 0 : performance.now());
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        syncPause();
      }, { threshold: 0 }).observe(zone);
    }

    if (isStatic) return;

    const frame = (now) => {
      if (!document.hidden && visible) draw(now);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* ═══════════════════════════════════════════════════════════
     TIENDA HUD — escaneo digital SaniCheck
  ═══════════════════════════════════════════════════════════ */
  function initTiendaHud() {
    if (reduced) return;

    const section   = $("#tienda");
    const hud       = $(".tienda-hud");
    const terminals = $(".tienda-terminals");
    const card      = $(".prod--sanichek");
    if (!section || !hud) return;

    const SCAN_MS   = 3500;
    const HIT_PAD   = 28;
    const SNIPPETS  = [
      "SCAN OK", "0x4F2A", "0xA3B1", "PSB:30+", "B/R/D OK", "PWA SYNC",
      "NODE 04", "CHK 100%", "SIG OK", "BUF CLR", "I/O RDY", "0x7E91",
      "TLS OK", "SYNC 1ms", "DATA OK"
    ];
    const ZONES = [
      { l: 0.04, t: 0.08 }, { l: 0.88, t: 0.12 }, { l: 0.06, t: 0.82 },
      { l: 0.90, t: 0.78 }, { l: 0.50, t: 0.04 }, { l: 0.48, t: 0.92 },
      { l: 0.02, t: 0.45 }, { l: 0.94, t: 0.52 }
    ];

    let visible = true, travel = 700, termTimer = 0;

    const easeInOut = (t) => t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const scanY = (now) => {
      const cycle = (now % SCAN_MS) / SCAN_MS;
      const prog  = cycle < 0.5
        ? easeInOut(cycle * 2)
        : 1 - easeInOut((cycle - 0.5) * 2);
      return prog * travel;
    };

    const syncPause = () => {
      hud.classList.toggle("tienda-hud--paused", document.hidden || !visible);
    };

    const resize = () => {
      const h = hud.offsetHeight;
      travel = Math.max(0, h - 3);
      hud.style.setProperty("--scan-travel", travel + "px");
    };

    const spawnTerminal = () => {
      if (!terminals || document.hidden || !visible) return;
      const zone = ZONES[Math.floor(Math.random() * ZONES.length)];
      const el   = document.createElement("span");
      el.className = "tienda-terminal";
      el.textContent = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
      el.style.left = (zone.l * 100 + (Math.random() - 0.5) * 4) + "%";
      el.style.top  = (zone.t * 100 + (Math.random() - 0.5) * 4) + "%";
      terminals.appendChild(el);
      requestAnimationFrame(() => el.classList.add("is-on"));
      const life = 1400 + Math.random() * 1600;
      setTimeout(() => {
        el.classList.remove("is-on");
        setTimeout(() => el.remove(), 380);
      }, life);
    };

    const scheduleTerminal = () => {
      if (document.hidden || !visible) {
        termTimer = setTimeout(scheduleTerminal, 800);
        return;
      }
      spawnTerminal();
      termTimer = setTimeout(scheduleTerminal, 2000 + Math.random() * 2000);
    };

    resize();
    scheduleTerminal();
    addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", syncPause);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        syncPause();
      }, { threshold: 0 }).observe(section);
    }

    const frame = (now) => {
      if (!document.hidden && visible && card) {
        const secRect  = section.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const y        = scanY(now) + 1.5;
        const cardTop  = cardRect.top - secRect.top;
        const cardBot  = cardRect.bottom - secRect.top;
        const hit      = y >= cardTop - HIT_PAD && y <= cardBot + HIT_PAD;
        card.classList.toggle("is-scan-hit", hit);
      } else if (card) {
        card.classList.remove("is-scan-hit");
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* ═══════════════════════════════════════════════════════════
     BOOT
  ═══════════════════════════════════════════════════════════ */
  function boot() {
    if (hasGSAP()) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (e) {}
    }

    safe(initThemeToggle,       "theme");
    safe(initLenis,            "lenis");
    safe(initNav,              "nav");
    safe(initHeroIntro,        "heroIntro");
    safe(initProgressFallback, "progress");
    safe(initShader,           "shader");
    safe(initParticles,        "particles");
    safe(initConstellation,    "constellation");
    safe(initCloseMesh,        "closeMesh");
    safe(initTiendaHud,        "tiendaHud");
    safe(initReveals,          "reveals");
    safe(initServiceCardGrow,  "serviceGrow");
    safe(initNcCardGrow,       "ncGrow");
    safe(initNcCardTilt,       "ncTilt");
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
