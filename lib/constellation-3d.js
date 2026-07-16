/* ECODESA — Constelación 3D (Nosotros) · premium network · self-hosted Three.js r128 */
(function (global) {
  "use strict";

  const THREE_SRC = "lib/three.min.js";
  const COUNT = 45;
  const LINK_DIST = 155;
  const MAX_LINKS = 420;
  const BOUNDS = { x: 360, y: 260, z: 220 };

  const PALETTES = {
    light: {
      deep: [0.02, 0.46, 0.31],
      bright: [0.0, 0.78, 0.42],
      line: [0.03, 0.72, 0.48],
      fog: 0xf7fbf9,
      fogDensity: 0.00055,
      ambient: 0xd4f5e4,
      point: 0x00c853,
      lineAlpha: 0.62,
      nodeSize: 1.05,
      glow: 0.32,
      exposure: 1.1,
      blending: "normal"
    },
    dark: {
      deep: [0.1, 0.48, 0.32],
      bright: [0.42, 1.0, 0.82],
      line: [0.34, 1.0, 0.76],
      fog: 0x050a07,
      fogDensity: 0.0012,
      ambient: 0x1a3d28,
      point: 0x69f0ae,
      lineAlpha: 0.82,
      nodeSize: 1.18,
      glow: 0.52,
      exposure: 1.06,
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
        uDeep: { value: new THREE.Color(pal.deep[0], pal.deep[1], pal.deep[2]) },
        uBright: { value: new THREE.Color(pal.bright[0], pal.bright[1], pal.bright[2]) },
        uLightPos: { value: new THREE.Vector3(140, 90, 420) },
        uGlow: { value: pal.glow },
        uSizeMul: { value: pal.nodeSize },
        uMinAlpha: { value: isDark ? 0.42 : 0.58 }
      },
      vertexShader: [
        "attribute float aActivity;",
        "uniform float uPixelRatio;",
        "uniform vec3 uDeep;",
        "uniform vec3 uBright;",
        "uniform vec3 uLightPos;",
        "uniform float uSizeMul;",
        "uniform float uMinAlpha;",
        "varying vec3 vColor;",
        "varying float vAlpha;",
        "void main() {",
        "  vColor = mix(uDeep, uBright, clamp(aActivity, 0.0, 1.0));",
        "  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
        "  float dist = max(-mvPosition.z, 40.0);",
        "  vec3 lit = vColor * (0.72 + 0.28 * clamp(dot(normalize(uLightPos - position), vec3(0.0, 0.0, 1.0)), 0.0, 1.0));",
        "  vColor = lit;",
        "  vAlpha = clamp(1.18 - dist / 820.0, uMinAlpha, 1.0);",
        "  float size = (4.8 + aActivity * 3.6) * uSizeMul * uPixelRatio * (300.0 / dist);",
        "  gl_PointSize = clamp(size, 2.5, 16.0);",
        "  gl_Position = projectionMatrix * mvPosition;",
        "}"
      ].join("\n"),
      fragmentShader: [
        "uniform float uGlow;",
        "varying vec3 vColor;",
        "varying float vAlpha;",
        "void main() {",
        "  vec2 uv = gl_PointCoord - 0.5;",
        "  float d = length(uv);",
        "  if (d > 0.5) discard;",
        "  float core = smoothstep(0.5, 0.06, d);",
        "  float halo = smoothstep(0.5, 0.0, d) * uGlow;",
        "  vec3 col = vColor + halo * 0.4;",
        "  gl_FragColor = vec4(col, (core * 0.92 + halo) * vAlpha);",
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
    const camera = new THREE.PerspectiveCamera(52, 1, 10, 2200);
    camera.position.set(0, 0, 540);

    let pal = palette();
    let theme = getTheme();
    renderer.toneMappingExposure = pal.exposure;
    scene.fog = new THREE.FogExp2(pal.fog, pal.fogDensity);

    const ambient = new THREE.AmbientLight(pal.ambient, theme === "dark" ? 0.42 : 0.32);
    scene.add(ambient);

    const keyLight = new THREE.PointLight(pal.point, theme === "dark" ? 0.95 : 0.58, 1400, 1.6);
    keyLight.position.set(120, 80, 360);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(theme === "dark" ? 0x8affc8 : 0xa5d6a7, theme === "dark" ? 0.35 : 0.18, 1100, 2);
    fillLight.position.set(-160, -60, 280);
    scene.add(fillLight);

    const particles = [];
    const positions = new Float32Array(COUNT * 3);
    const activities = new Float32Array(COUNT);

    const seedParticles = () => {
      pal = palette();
      for (let i = 0; i < COUNT; i++) {
        const x = (Math.random() - 0.5) * BOUNDS.x * 2;
        const y = (Math.random() - 0.5) * BOUNDS.y * 2;
        const z = (Math.random() - 0.5) * BOUNDS.z * 2;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        activities[i] = 0.35 + Math.random() * 0.65;
        particles[i] = {
          x, y, z,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.34,
          vz: (Math.random() - 0.5) * 0.24,
          phase: Math.random() * Math.PI * 2,
          pulseHz: 0.0009 + Math.random() * 0.0007
        };
      }
    };

    seedParticles();

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeo.setAttribute("aActivity", new THREE.BufferAttribute(activities, 1));

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

    const applyThemeVisuals = () => {
      pal = palette();
      theme = getTheme();
      renderer.toneMappingExposure = pal.exposure;
      scene.fog.color.setHex(pal.fog);
      scene.fog.density = pal.fogDensity;
      ambient.color.setHex(pal.ambient);
      ambient.intensity = theme === "dark" ? 0.42 : 0.32;
      keyLight.color.setHex(pal.point);
      keyLight.intensity = theme === "dark" ? 0.95 : 0.58;
      fillLight.color.setHex(theme === "dark" ? 0x8affc8 : 0xa5d6a7);
      fillLight.intensity = theme === "dark" ? 0.35 : 0.18;
      pointsMat.uniforms.uDeep.value.setRGB(pal.deep[0], pal.deep[1], pal.deep[2]);
      pointsMat.uniforms.uBright.value.setRGB(pal.bright[0], pal.bright[1], pal.bright[2]);
      pointsMat.uniforms.uGlow.value = pal.glow;
      pointsMat.uniforms.uSizeMul.value = pal.nodeSize;
      pointsMat.uniforms.uMinAlpha.value = theme === "dark" ? 0.42 : 0.58;
      pointsMat.blending = theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending;
      pointsMat.needsUpdate = true;
      lineMat.blending = theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending;
      lineMat.needsUpdate = true;
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
      const [dr, dg, db] = pal.deep;
      const [br, bg, bb] = pal.bright;
      let vi = 0;
      let ci = 0;
      linkCount = 0;

      for (let i = 0; i < COUNT && linkCount < MAX_LINKS; i++) {
        const a = particles[i];
        for (let j = i + 1; j < COUNT && linkCount < MAX_LINKS; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist > LINK_DIST) continue;

          const proximity = 1 - dist / LINK_DIST;
          const pulse = 0.56 + 0.44 * Math.sin(now * 0.00115 + (i * 0.37 + j * 0.19));
          const energy = proximity * pulse;
          const mixT = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(now * a.pulseHz + a.phase + j * 0.11));
          const cr = dr + (br - dr) * mixT;
          const cg = dg + (bg - dg) * mixT;
          const cb = db + (bb - db) * mixT;
          const alpha = energy * pal.lineAlpha;

          lineVerts[vi++] = a.x;
          lineVerts[vi++] = a.y;
          lineVerts[vi++] = a.z;
          lineVerts[vi++] = b.x;
          lineVerts[vi++] = b.y;
          lineVerts[vi++] = b.z;

          lineCols[ci++] = cr * alpha;
          lineCols[ci++] = cg * alpha;
          lineCols[ci++] = cb * alpha;
          lineCols[ci++] = cr * alpha * 0.85;
          lineCols[ci++] = cg * alpha * 0.85;
          lineCols[ci++] = cb * alpha * 0.85;
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

      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        if (Math.abs(p.x) > BOUNDS.x) p.vx *= -1;
        if (Math.abs(p.y) > BOUNDS.y) p.vy *= -1;
        if (Math.abs(p.z) > BOUNDS.z) p.vz *= -1;
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;

        const activityWave = 0.5 + 0.5 * Math.sin(elapsed * p.pulseHz + p.phase);
        activities[i] = 0.28 + activityWave * 0.72;
      }
      pointsGeo.attributes.position.needsUpdate = true;
      pointsGeo.attributes.aActivity.needsUpdate = true;

      updateLines(elapsed);

      const target = sectionScrollProgress();
      scrollT += (target - scrollT) * 0.06;
      const orbit = scrollT * Math.PI * 2;
      camera.position.x = Math.sin(orbit) * 72;
      camera.position.y = (scrollT - 0.5) * 48;
      camera.position.z = 540 - scrollT * 36;
      camera.lookAt(0, 0, 0);

      keyLight.position.x = 120 + Math.sin(elapsed * 0.00035) * 40;
      keyLight.position.y = 80 + Math.cos(elapsed * 0.00028) * 28;
      pointsMat.uniforms.uLightPos.value.copy(keyLight.position);

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
