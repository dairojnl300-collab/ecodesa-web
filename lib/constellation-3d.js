/* ECODESA — Constelación 3D (Nosotros) · mint/cyan glow network · self-hosted Three.js r128 */
(function (global) {
  "use strict";

  const THREE_SRC = "lib/three.min.js";
  const INTRA_DIST = 162;
  const BRIDGE_DIST = 78;
  const MAX_LINKS = 480;
  const BOUNDS = { x: 420, y: 300, z: 190 };

  const CLUSTERS = [
    { cx: 0.17, cy: 0.30, rx: 0.15, ry: 0.17, n: 12 },
    { cx: 0.83, cy: 0.26, rx: 0.14, ry: 0.16, n: 11 },
    { cx: 0.30, cy: 0.76, rx: 0.16, ry: 0.15, n: 12 },
    { cx: 0.78, cy: 0.70, rx: 0.15, ry: 0.16, n: 10 }
  ];

  const LAYERS = [
    { speed: 0.42, sizeMul: 0.88, alpha: 0.62, glow: 0.58 },
    { speed: 0.72, sizeMul: 1.0, alpha: 0.78, glow: 0.76 },
    { speed: 1.12, sizeMul: 1.14, alpha: 0.92, glow: 0.94 }
  ];

  const PALETTES = {
    light: {
      nodes: [
        [8 / 255, 190 / 255, 130 / 255],
        [0, 210 / 255, 185 / 255],
        [0, 175 / 255, 230 / 255]
      ],
      line: [10 / 255, 210 / 255, 160 / 255],
      fog: 0xf7fbf9,
      fogDensity: 0.00042,
      ambient: 0xe8f5ef,
      lineAlphaIntra: [0.32, 0.52],
      lineAlphaBridge: [0.1, 0.2],
      nodeGlow: 0.68,
      exposure: 1.08,
      blending: "normal"
    },
    dark: {
      nodes: [
        [60 / 255, 1, 170 / 255],
        [100 / 255, 1, 220 / 255],
        [80 / 255, 220 / 255, 1]
      ],
      line: [80 / 255, 1, 200 / 255],
      fog: 0x030806,
      fogDensity: 0.00075,
      ambient: 0x0a1810,
      lineAlphaIntra: [0.26, 0.46],
      lineAlphaBridge: [0.07, 0.16],
      nodeGlow: 1.05,
      exposure: 1.12,
      blending: "additive"
    }
  };

  function loadThree() {
    return new Promise((resolve, reject) => {
      if (global.THREE) return resolve(global.THREE);
      const existing = document.querySelector("script[data-ecodesa-three]");
      if (existing) {
        existing.addEventListener("load", () => (global.THREE ? resolve(global.THREE) : reject()));
        existing.addEventListener("error", reject);
        return;
      }
      const script = document.createElement("script");
      script.src = THREE_SRC;
      script.async = true;
      script.dataset.ecodesaThree = "1";
      script.onload = () => (global.THREE ? resolve(global.THREE) : reject(new Error("THREE unavailable")));
      script.onerror = () => reject(new Error("Three.js load failed"));
      document.head.appendChild(script);
    });
  }

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function palette() {
    return PALETTES[getTheme()] || PALETTES.light;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function start(canvas, section, onFail) {
    return loadThree()
      .then((THREE) => run(THREE, canvas, section))
      .catch((err) => {
        console.warn("[ECODESA:constellation3d]", err);
        if (typeof onFail === "function") onFail();
      });
  }

  function createNodeMaterial(THREE, pal) {
    const isDark = pal.blending === "additive";
    return new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(global.devicePixelRatio || 1, 2) },
        uGlow: { value: pal.nodeGlow },
        uSizeMul: { value: isDark ? 1.08 : 1.0 }
      },
      vertexShader: [
        "attribute vec3 aColor;",
        "attribute float aActivity;",
        "attribute float aLayerAlpha;",
        "attribute float aLayerGlow;",
        "attribute float aLayerSize;",
        "uniform float uPixelRatio;",
        "uniform float uGlow;",
        "uniform float uSizeMul;",
        "varying vec3 vColor;",
        "varying float vAlpha;",
        "varying float vGlow;",
        "void main() {",
        "  float pulse = 0.82 + aActivity * 0.28;",
        "  vColor = aColor * pulse;",
        "  vGlow = aLayerGlow * uGlow;",
        "  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
        "  float dist = max(-mvPosition.z, 38.0);",
        "  vAlpha = aLayerAlpha * clamp(1.22 - dist / 880.0, 0.38, 1.0);",
        "  float size = (8.0 + aActivity * 6.0) * aLayerSize * uSizeMul * uPixelRatio * (330.0 / dist);",
        "  gl_PointSize = clamp(size, 5.0, 30.0);",
        "  gl_Position = projectionMatrix * mvPosition;",
        "}"
      ].join("\n"),
      fragmentShader: [
        "varying vec3 vColor;",
        "varying float vAlpha;",
        "varying float vGlow;",
        "void main() {",
        "  vec2 uv = gl_PointCoord - 0.5;",
        "  float d = length(uv);",
        "  if (d > 0.5) discard;",
        "  float core = exp(-d * d * 34.0);",
        "  float inner = exp(-d * d * 9.5) * 0.62;",
        "  float halo = smoothstep(0.5, 0.04, d) * vGlow;",
        "  vec3 col = vColor * (core + inner * 0.55) + vColor * halo * 0.95;",
        "  col += vec3(1.0) * core * 0.18;",
        "  float alpha = clamp((core + inner * 0.35 + halo * 0.72) * vAlpha, 0.0, 1.0);",
        "  gl_FragColor = vec4(col, alpha);",
        "}"
      ].join("\n"),
      transparent: true,
      depthWrite: false,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending
    });
  }

  function run(THREE, canvas, section) {
    const clock = new THREE.Clock();
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power"
    });
    renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 10, 2400);
    camera.position.set(0, 0, 560);

    let pal = palette();
    let theme = getTheme();
    renderer.toneMappingExposure = pal.exposure;
    scene.fog = new THREE.FogExp2(pal.fog, pal.fogDensity);
    scene.add(new THREE.AmbientLight(pal.ambient, theme === "dark" ? 0.55 : 0.38));

    const COUNT = CLUSTERS.reduce((sum, c) => sum + c.n, 0);
    const particles = [];
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const activities = new Float32Array(COUNT);
    const layerAlphas = new Float32Array(COUNT);
    const layerGlows = new Float32Array(COUNT);
    const layerSizes = new Float32Array(COUNT);

    const seedParticles = () => {
      pal = palette();
      let idx = 0;
      particles.length = 0;

      CLUSTERS.forEach((c, ci) => {
        for (let k = 0; k < c.n; k++) {
          const layerIdx = k % 3;
          const L = LAYERS[layerIdx];
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.sqrt(Math.random());
          const nx = c.cx + Math.cos(angle) * c.rx * dist;
          const ny = c.cy + Math.sin(angle) * c.ry * dist;
          const ax = (nx - 0.5) * BOUNDS.x * 2;
          const ay = (ny - 0.5) * BOUNDS.y * 2;
          const az = (layerIdx - 1) * 72 + (Math.random() - 0.5) * 36;
          const nodeColor = pal.nodes[(ci + k) % pal.nodes.length];

          positions[idx * 3] = ax;
          positions[idx * 3 + 1] = ay;
          positions[idx * 3 + 2] = az;
          colors[idx * 3] = nodeColor[0];
          colors[idx * 3 + 1] = nodeColor[1];
          colors[idx * 3 + 2] = nodeColor[2];
          activities[idx] = 0.45 + Math.random() * 0.55;
          layerAlphas[idx] = L.alpha;
          layerGlows[idx] = L.glow;
          layerSizes[idx] = L.sizeMul;

          particles.push({
            cluster: ci,
            layer: layerIdx,
            ax, ay, az,
            x: ax, y: ay, z: az,
            color: nodeColor.slice(),
            speed: L.speed,
            seed: Math.random() * Math.PI * 2,
            seed2: Math.random() * Math.PI * 2,
            seed3: Math.random() * Math.PI * 2,
            f1: 0.22 + Math.random() * 0.18,
            f2: 0.38 + Math.random() * 0.24,
            f3: 0.30 + Math.random() * 0.18,
            f4: 0.48 + Math.random() * 0.22,
            a1: 18 + Math.random() * 26,
            a2: 10 + Math.random() * 16,
            phase: Math.random() * Math.PI * 2,
            pulseHz: 0.0016 + Math.random() * 0.001
          });
          idx++;
        }
      });
    };

    seedParticles();

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    pointsGeo.setAttribute("aActivity", new THREE.BufferAttribute(activities, 1));
    pointsGeo.setAttribute("aLayerAlpha", new THREE.BufferAttribute(layerAlphas, 1));
    pointsGeo.setAttribute("aLayerGlow", new THREE.BufferAttribute(layerGlows, 1));
    pointsGeo.setAttribute("aLayerSize", new THREE.BufferAttribute(layerSizes, 1));

    const pointsMat = createNodeMaterial(THREE, pal);
    const points = new THREE.Points(pointsGeo, pointsMat);
    scene.add(points);

    const lineVerts = new Float32Array(MAX_LINKS * 6);
    const lineCols = new Float32Array(MAX_LINKS * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(lineVerts, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineCols, 3));
    lineGeo.setDrawRange(0, 0);

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    let visible = false;
    let disposed = false;
    let rafId = 0;
    let scrollT = 0.5;
    let linkCount = 0;
    let elapsed = 0;

    const refreshNodeColors = () => {
      pal = palette();
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        const nodeColor = pal.nodes[(p.cluster + i) % pal.nodes.length];
        p.color = nodeColor.slice();
        colors[i * 3] = nodeColor[0];
        colors[i * 3 + 1] = nodeColor[1];
        colors[i * 3 + 2] = nodeColor[2];
      }
      pointsGeo.attributes.aColor.needsUpdate = true;
    };

    const applyThemeVisuals = () => {
      pal = palette();
      theme = getTheme();
      renderer.toneMappingExposure = pal.exposure;
      scene.fog.color.setHex(pal.fog);
      scene.fog.density = pal.fogDensity;
      pointsMat.uniforms.uGlow.value = pal.nodeGlow;
      pointsMat.uniforms.uSizeMul.value = theme === "dark" ? 1.08 : 1.0;
      pointsMat.blending = theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending;
      pointsMat.needsUpdate = true;
      lineMat.blending = theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending;
      lineMat.needsUpdate = true;
      refreshNodeColors();
    };

    const resize = () => {
      const rect = section.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      pointsMat.uniforms.uPixelRatio.value = Math.min(global.devicePixelRatio || 1, 2);
    };

    const updateLines = (now) => {
      const [lr, lg, lb] = pal.line;
      let vi = 0;
      let ci = 0;
      linkCount = 0;

      for (let i = 0; i < COUNT && linkCount < MAX_LINKS; i++) {
        const a = particles[i];
        for (let j = i + 1; j < COUNT && linkCount < MAX_LINKS; j++) {
          const b = particles[j];
          const same = a.cluster === b.cluster;
          const maxDist = same ? INTRA_DIST : BRIDGE_DIST;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist > maxDist) continue;

          const proximity = 1 - dist / maxDist;
          const pulse = 0.54 + 0.46 * Math.sin(now * 0.001 + (i * 0.37 + j * 0.21));
          const alphaRange = same ? pal.lineAlphaIntra : pal.lineAlphaBridge;
          const edgeMul = same ? 0.08 : 0.22;
          const midAlpha = lerp(alphaRange[0], alphaRange[1], proximity) * pulse;
          const cr = (lr + a.color[0] + b.color[0]) / 3;
          const cg = (lg + a.color[1] + b.color[1]) / 3;
          const cb = (lb + a.color[2] + b.color[2]) / 3;

          lineVerts[vi++] = a.x;
          lineVerts[vi++] = a.y;
          lineVerts[vi++] = a.z;
          lineVerts[vi++] = b.x;
          lineVerts[vi++] = b.y;
          lineVerts[vi++] = b.z;

          lineCols[ci++] = cr * midAlpha * edgeMul;
          lineCols[ci++] = cg * midAlpha * edgeMul;
          lineCols[ci++] = cb * midAlpha * edgeMul;
          lineCols[ci++] = cr * midAlpha;
          lineCols[ci++] = cg * midAlpha;
          lineCols[ci++] = cb * midAlpha;
          linkCount++;
        }
      }

      lineGeo.setDrawRange(0, linkCount * 2);
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;
    };

    const sectionScrollProgress = () => {
      const rect = section.getBoundingClientRect();
      const vh = global.innerHeight || 1;
      const center = rect.top + rect.height * 0.5;
      return Math.min(1, Math.max(0, 1 - (center - vh * 0.5) / (vh * 0.85 + rect.height * 0.35)));
    };

    const tick = () => {
      if (disposed) return;
      rafId = global.requestAnimationFrame(tick);
      if (!visible || document.hidden) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt * 1000;

      if (getTheme() !== theme) applyThemeVisuals();

      const t = elapsed * 0.001;
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        const s = p.speed;
        p.x = p.ax
          + Math.sin(t * p.f1 + p.seed) * p.a1 * s
          + Math.sin(t * p.f2 + p.seed2) * p.a2 * s * 0.65;
        p.y = p.ay
          + Math.cos(t * p.f3 + p.seed3) * p.a1 * s * 0.82
          + Math.sin(t * p.f4 + p.seed) * p.a2 * s * 0.55;
        p.z = p.az + Math.sin(t * p.f2 + p.phase) * 14 * s;

        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;

        const activityWave = 0.5 + 0.5 * Math.sin(elapsed * p.pulseHz + p.phase);
        activities[i] = 0.32 + activityWave * 0.68;
      }
      pointsGeo.attributes.position.needsUpdate = true;
      pointsGeo.attributes.aActivity.needsUpdate = true;

      updateLines(elapsed);

      const target = sectionScrollProgress();
      scrollT += (target - scrollT) * 0.05;
      const orbit = scrollT * Math.PI * 2;
      camera.position.x = Math.sin(orbit) * 58;
      camera.position.y = (scrollT - 0.5) * 38;
      camera.position.z = 560 - scrollT * 28;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0 });
    io.observe(section);

    const onTheme = () => applyThemeVisuals();
    const onResize = () => resize();
    window.addEventListener("ecodesa-theme-change", onTheme);
    global.addEventListener("resize", onResize, { passive: true });

    resize();
    rafId = global.requestAnimationFrame(tick);

    return () => {
      disposed = true;
      global.cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("ecodesa-theme-change", onTheme);
      global.removeEventListener("resize", onResize);
      pointsGeo.dispose();
      pointsMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }

  global.EcodesaConstellation3D = { start, loadThree };
})(window);
