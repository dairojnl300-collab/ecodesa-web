/* ECODESA — Constelación 3D (Nosotros) · carga bajo demanda, no global */
(function (global) {
  "use strict";

  const THREE_SRC = "lib/three.min.js";
  const COUNT = 45;
  const LINK_DIST = 155;
  const BOUNDS = { x: 360, y: 260, z: 220 };

  const PALETTES = {
    light: {
      nodes: [[0.03, 0.54, 0.37], [0.0, 0.82, 0.67], [0.05, 0.69, 0.9]],
      line: [0.04, 0.82, 0.63]
    },
    dark: {
      nodes: [[0.24, 1.0, 0.67], [0.39, 1.0, 0.86], [0.31, 0.86, 1.0]],
      line: [0.31, 1.0, 0.78]
    }
  };

  function loadThree() {
    return new Promise((resolve, reject) => {
      if (global.THREE) return resolve(global.THREE);
      const existing = document.querySelector('script[data-ecodesa-three]');
      if (existing) {
        existing.addEventListener("load", () => global.THREE ? resolve(global.THREE) : reject());
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

  function run(THREE, canvas, section) {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power"
    });
    renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 10, 2200);
    camera.position.set(0, 0, 540);

    const particles = [];
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    const seedParticles = () => {
      const pal = palette();
      for (let i = 0; i < COUNT; i++) {
        const x = (Math.random() - 0.5) * BOUNDS.x * 2;
        const y = (Math.random() - 0.5) * BOUNDS.y * 2;
        const z = (Math.random() - 0.5) * BOUNDS.z * 2;
        const rgb = pal.nodes[i % pal.nodes.length];
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        colors[i * 3] = rgb[0];
        colors[i * 3 + 1] = rgb[1];
        colors[i * 3 + 2] = rgb[2];
        particles[i] = {
          x, y, z,
          vx: (Math.random() - 0.5) * 0.42,
          vy: (Math.random() - 0.5) * 0.38,
          vz: (Math.random() - 0.5) * 0.28
        };
      }
    };

    seedParticles();

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 5.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      sizeAttenuation: true,
      depthWrite: false
    });
    const points = new THREE.Points(pointsGeo, pointsMat);
    scene.add(points);

    const lineGeo = new THREE.BufferGeometry();
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    let visible = false;
    let disposed = false;
    let rafId = 0;
    let scrollT = 0.5;
    let theme = getTheme();

    const resize = () => {
      const rect = section.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const updateColors = () => {
      const pal = palette();
      for (let i = 0; i < COUNT; i++) {
        const rgb = pal.nodes[i % pal.nodes.length];
        colors[i * 3] = rgb[0];
        colors[i * 3 + 1] = rgb[1];
        colors[i * 3 + 2] = rgb[2];
      }
      pointsGeo.attributes.color.needsUpdate = true;
    };

    const updateLines = () => {
      const pal = palette();
      const [lr, lg, lb] = pal.line;
      const verts = [];
      const cols = [];
      for (let i = 0; i < COUNT; i++) {
        const a = particles[i];
        for (let j = i + 1; j < COUNT; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist > LINK_DIST) continue;
          const t = 1 - dist / LINK_DIST;
          const c = t * 0.72;
          verts.push(a.x, a.y, a.z, b.x, b.y, b.z);
          cols.push(lr * c, lg * c, lb * c, lr * c, lg * c, lb * c);
        }
      }
      lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
      lineGeo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
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

      const nextTheme = getTheme();
      if (nextTheme !== theme) {
        theme = nextTheme;
        updateColors();
      }

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
      }
      pointsGeo.attributes.position.needsUpdate = true;
      updateLines();

      const target = sectionScrollProgress();
      scrollT += (target - scrollT) * 0.06;
      const orbit = scrollT * Math.PI * 2;
      camera.position.x = Math.sin(orbit) * 72;
      camera.position.y = (scrollT - 0.5) * 48;
      camera.position.z = 540 - scrollT * 36;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0 });
    io.observe(section);

    const onTheme = () => updateColors();
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
