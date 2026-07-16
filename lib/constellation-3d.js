/* ECODESA — Red neuronal 3D (Nosotros) · bloom inline · Three.js r128 self-hosted */
(function (global) {
  "use strict";

  const THREE_SRC = "lib/three.min.js";
  const COUNT = 34;
  const LINK_DIST = 168;
  const MAX_CONNECTIONS = 200;
  const BOUNDS = { x: 340, y: 250, z: 210 };

  const PALETTES = {
    light: {
      deep: [0.02, 0.48, 0.32],
      bright: [0.15, 1.0, 0.55],
      line: [0.12, 0.95, 0.62],
      fog: 0x07110c,
      fogDensity: 0.00125,
      backdrop: 0x040806,
      backdropAlpha: 0.88
    },
    dark: {
      deep: [0.05, 0.55, 0.35],
      bright: [0.35, 1.0, 0.72],
      line: [0.28, 1.0, 0.68],
      fog: 0x020403,
      fogDensity: 0.00155,
      backdrop: 0x010201,
      backdropAlpha: 0.94
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

  function createFullscreenQuad(THREE) {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    scene.add(mesh);
    return { scene, camera, mesh };
  }

  function createBloomPipeline(THREE, renderer, w, h) {
    const bw = Math.max(128, Math.floor(w * 0.45));
    const bh = Math.max(128, Math.floor(h * 0.45));
    const rtOpts = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      depthBuffer: false,
      stencilBuffer: false
    };

    const rtScene = new THREE.WebGLRenderTarget(w, h, rtOpts);
    const rtExtract = new THREE.WebGLRenderTarget(bw, bh, rtOpts);
    const rtBlurA = new THREE.WebGLRenderTarget(bw, bh, rtOpts);
    const rtBlurB = new THREE.WebGLRenderTarget(bw, bh, rtOpts);

    const quad = createFullscreenQuad(THREE);

    const extractMat = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        threshold: { value: 0.42 },
        smoothWidth: { value: 0.28 }
      },
      vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }",
      fragmentShader: [
        "uniform sampler2D tDiffuse;",
        "uniform float threshold;",
        "uniform float smoothWidth;",
        "varying vec2 vUv;",
        "void main(){",
        "  vec4 c = texture2D(tDiffuse, vUv);",
        "  float lum = max(c.r, max(c.g, c.b));",
        "  float soft = smoothstep(threshold - smoothWidth, threshold + smoothWidth, lum);",
        "  gl_FragColor = vec4(c.rgb * soft, c.a * soft);",
        "}"
      ].join("\n"),
      depthTest: false,
      depthWrite: false
    });

    const blurMat = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        direction: { value: new THREE.Vector2(1, 0) },
        resolution: { value: new THREE.Vector2(bw, bh) }
      },
      vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }",
      fragmentShader: [
        "uniform sampler2D tDiffuse;",
        "uniform vec2 direction;",
        "uniform vec2 resolution;",
        "varying vec2 vUv;",
        "void main(){",
        "  vec2 off = direction / resolution;",
        "  vec4 c = texture2D(tDiffuse, vUv) * 0.227;",
        "  c += texture2D(tDiffuse, vUv + off * 1.0) * 0.194;",
        "  c += texture2D(tDiffuse, vUv - off * 1.0) * 0.194;",
        "  c += texture2D(tDiffuse, vUv + off * 2.0) * 0.121;",
        "  c += texture2D(tDiffuse, vUv - off * 2.0) * 0.121;",
        "  c += texture2D(tDiffuse, vUv + off * 3.0) * 0.071;",
        "  c += texture2D(tDiffuse, vUv - off * 3.0) * 0.071;",
        "  gl_FragColor = c;",
        "}"
      ].join("\n"),
      depthTest: false,
      depthWrite: false
    });

    const compositeMat = new THREE.ShaderMaterial({
      uniforms: {
        tScene: { value: null },
        tBloom: { value: null },
        bloomStrength: { value: 1.35 },
        exposure: { value: 1.05 }
      },
      vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }",
      fragmentShader: [
        "uniform sampler2D tScene;",
        "uniform sampler2D tBloom;",
        "uniform float bloomStrength;",
        "uniform float exposure;",
        "varying vec2 vUv;",
        "void main(){",
        "  vec4 scene = texture2D(tScene, vUv);",
        "  vec4 bloom = texture2D(tBloom, vUv);",
        "  vec3 col = scene.rgb * exposure + bloom.rgb * bloomStrength;",
        "  gl_FragColor = vec4(col, scene.a);",
        "}"
      ].join("\n"),
      transparent: true,
      depthTest: false,
      depthWrite: false
    });

    const renderBloom = (scene, camera) => {
      renderer.setRenderTarget(rtScene);
      renderer.clear();
      renderer.render(scene, camera);

      quad.mesh.material = extractMat;
      extractMat.uniforms.tDiffuse.value = rtScene.texture;
      renderer.setRenderTarget(rtExtract);
      renderer.render(quad.scene, quad.camera);

      blurMat.uniforms.tDiffuse.value = rtExtract.texture;
      blurMat.uniforms.direction.value.set(1.6 / bw, 0);
      quad.mesh.material = blurMat;
      renderer.setRenderTarget(rtBlurA);
      renderer.render(quad.scene, quad.camera);

      blurMat.uniforms.tDiffuse.value = rtBlurA.texture;
      blurMat.uniforms.direction.value.set(0, 1.6 / bh);
      renderer.setRenderTarget(rtBlurB);
      renderer.render(quad.scene, quad.camera);

      blurMat.uniforms.tDiffuse.value = rtBlurB.texture;
      blurMat.uniforms.direction.value.set(1.6 / bw, 0);
      renderer.setRenderTarget(rtBlurA);
      renderer.render(quad.scene, quad.camera);

      compositeMat.uniforms.tScene.value = rtScene.texture;
      compositeMat.uniforms.tBloom.value = rtBlurA.texture;
      quad.mesh.material = compositeMat;
      renderer.setRenderTarget(null);
      renderer.render(quad.scene, quad.camera);
    };

    const resize = (nw, nh) => {
      rtScene.setSize(nw, nh);
      const nbw = Math.max(128, Math.floor(nw * 0.45));
      const nbh = Math.max(128, Math.floor(nh * 0.45));
      rtExtract.setSize(nbw, nbh);
      rtBlurA.setSize(nbw, nbh);
      rtBlurB.setSize(nbw, nbh);
      blurMat.uniforms.resolution.value.set(nbw, nbh);
    };

    const dispose = () => {
      rtScene.dispose();
      rtExtract.dispose();
      rtBlurA.dispose();
      rtBlurB.dispose();
      extractMat.dispose();
      blurMat.dispose();
      compositeMat.dispose();
      quad.mesh.geometry.dispose();
    };

    return { renderBloom, resize, dispose };
  }

  function createNodeMaterial(THREE, pal) {
    return new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(global.devicePixelRatio || 1, 2) },
        uDeep: { value: new THREE.Color(pal.deep[0], pal.deep[1], pal.deep[2]) },
        uBright: { value: new THREE.Color(pal.bright[0], pal.bright[1], pal.bright[2]) },
        uTime: { value: 0 }
      },
      vertexShader: [
        "attribute float aActivity;",
        "uniform float uPixelRatio;",
        "uniform vec3 uDeep;",
        "uniform vec3 uBright;",
        "uniform float uTime;",
        "varying vec3 vColor;",
        "varying float vAlpha;",
        "void main(){",
        "  float breathe = 0.55 + 0.45 * sin(uTime * 0.0016 + aActivity * 6.28);",
        "  vColor = mix(uDeep, uBright, clamp(aActivity * breathe, 0.0, 1.0));",
        "  vec4 mv = modelViewMatrix * vec4(position, 1.0);",
        "  float dist = max(-mv.z, 35.0);",
        "  vAlpha = clamp(1.2 - dist / 780.0, 0.45, 1.0);",
        "  float size = (5.5 + aActivity * 5.0 + breathe * 2.0) * uPixelRatio * (310.0 / dist);",
        "  gl_PointSize = clamp(size, 3.0, 22.0);",
        "  gl_Position = projectionMatrix * mv;",
        "}"
      ].join("\n"),
      fragmentShader: [
        "varying vec3 vColor;",
        "varying float vAlpha;",
        "void main(){",
        "  vec2 uv = gl_PointCoord - 0.5;",
        "  float d = length(uv);",
        "  if (d > 0.5) discard;",
        "  float core = smoothstep(0.5, 0.04, d);",
        "  float glow = pow(max(0.0, 1.0 - d * 2.0), 2.2);",
        "  vec3 col = vColor * (core * 1.8 + glow * 1.4);",
        "  float alpha = (core * 0.95 + glow * 0.65) * vAlpha;",
        "  gl_FragColor = vec4(col, alpha);",
        "}"
      ].join("\n"),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }

  function run(THREE, canvas, section) {
    const clock = new THREE.Clock();
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
      premultipliedAlpha: false
    });
    renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.autoClear = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 10, 2000);
    camera.position.set(0, 0, 520);

    let pal = palette();
    scene.fog = new THREE.FogExp2(pal.fog, pal.fogDensity);

    const backdropMat = new THREE.MeshBasicMaterial({
      color: pal.backdrop,
      transparent: true,
      opacity: pal.backdropAlpha,
      depthWrite: false
    });
    const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400), backdropMat);
    backdrop.position.z = -420;
    scene.add(backdrop);

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
        activities[i] = 0.4 + Math.random() * 0.6;
        particles[i] = {
          x, y, z,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.16,
          vz: (Math.random() - 0.5) * 0.12,
          phase: Math.random() * Math.PI * 2,
          drift: 0.55 + Math.random() * 0.85,
          pulseHz: 0.00075 + Math.random() * 0.00055
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

    const maxSegments = MAX_CONNECTIONS * 2;
    const lineVerts = new Float32Array(maxSegments * 6);
    const lineCols = new Float32Array(maxSegments * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(lineVerts, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineCols, 3));
    lineGeo.setDrawRange(0, 0);

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 1
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    let bloom = null;
    let visible = false;
    let disposed = false;
    let rafId = 0;
    let scrollT = 0.5;
    let theme = getTheme();
    let elapsed = 0;
    let segmentCount = 0;

    const applyThemeVisuals = () => {
      pal = palette();
      theme = getTheme();
      scene.fog.color.setHex(pal.fog);
      scene.fog.density = pal.fogDensity;
      backdropMat.color.setHex(pal.backdrop);
      backdropMat.opacity = pal.backdropAlpha;
      pointsMat.uniforms.uDeep.value.setRGB(pal.deep[0], pal.deep[1], pal.deep[2]);
      pointsMat.uniforms.uBright.value.setRGB(pal.bright[0], pal.bright[1], pal.bright[2]);
    };

    const resize = () => {
      const rect = section.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      pointsMat.uniforms.uPixelRatio.value = Math.min(global.devicePixelRatio || 1, 2);
      if (bloom) bloom.resize(w, h);
    };

    const pushSegment = (ax, ay, az, ac, bx, by, bz, bc, vi, ci) => {
      lineVerts[vi] = ax; lineVerts[vi + 1] = ay; lineVerts[vi + 2] = az;
      lineVerts[vi + 3] = bx; lineVerts[vi + 4] = by; lineVerts[vi + 5] = bz;
      lineCols[ci] = ac[0]; lineCols[ci + 1] = ac[1]; lineCols[ci + 2] = ac[2];
      lineCols[ci + 3] = bc[0]; lineCols[ci + 4] = bc[1]; lineCols[ci + 5] = bc[2];
      return { vi: vi + 6, ci: ci + 6 };
    };

    const updateLines = (now) => {
      const [lr, lg, lb] = pal.line;
      let vi = 0;
      let ci = 0;
      segmentCount = 0;

      for (let i = 0; i < COUNT && segmentCount < maxSegments - 1; i++) {
        const a = particles[i];
        for (let j = i + 1; j < COUNT && segmentCount < maxSegments - 1; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist > LINK_DIST) continue;

          const proximity = 1 - dist / LINK_DIST;
          const pulse = 0.52 + 0.48 * Math.sin(now * 0.001 + (i * 0.41 + j * 0.23));
          const mx = (a.x + b.x) * 0.5;
          const my = (a.y + b.y) * 0.5;
          const mz = (a.z + b.z) * 0.5;
          const edge = proximity * pulse * 0.95;
          const mid = proximity * pulse * 0.12;
          const bright = [lr * edge, lg * edge, lb * edge];
          const faint = [lr * mid, lg * mid, lb * mid];

          let seg = pushSegment(a.x, a.y, a.z, bright, mx, my, mz, faint, vi, ci);
          vi = seg.vi; ci = seg.ci; segmentCount++;
          if (segmentCount >= maxSegments) break;

          seg = pushSegment(mx, my, mz, faint, b.x, b.y, b.z, bright, vi, ci);
          vi = seg.vi; ci = seg.ci; segmentCount++;
        }
      }

      lineGeo.setDrawRange(0, segmentCount * 2);
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
        const driftT = elapsed * 0.00045 * p.drift + p.phase;
        p.x += p.vx + Math.sin(driftT) * 0.06;
        p.y += p.vy + Math.cos(driftT * 1.17) * 0.05;
        p.z += p.vz + Math.sin(driftT * 0.83) * 0.04;
        if (Math.abs(p.x) > BOUNDS.x) p.vx *= -1;
        if (Math.abs(p.y) > BOUNDS.y) p.vy *= -1;
        if (Math.abs(p.z) > BOUNDS.z) p.vz *= -1;
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
        activities[i] = 0.32 + (0.5 + 0.5 * Math.sin(elapsed * p.pulseHz + p.phase)) * 0.68;
      }
      pointsGeo.attributes.position.needsUpdate = true;
      pointsGeo.attributes.aActivity.needsUpdate = true;
      pointsMat.uniforms.uTime.value = elapsed;

      updateLines(elapsed);

      const target = sectionScrollProgress();
      scrollT += (target - scrollT) * 0.05;
      const orbit = scrollT * Math.PI * 2;
      camera.position.x = Math.sin(orbit) * 64;
      camera.position.y = (scrollT - 0.5) * 42;
      camera.position.z = 520 - scrollT * 32;
      camera.lookAt(0, 0, 0);

      if (bloom) bloom.renderBloom(scene, camera);
      else renderer.render(scene, camera);
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
    try {
      bloom = createBloomPipeline(THREE, renderer, canvas.width || 1, canvas.height || 1);
    } catch (err) {
      console.warn("[ECODESA:constellation3d] Bloom fallback:", err);
      bloom = null;
    }
    rafId = global.requestAnimationFrame(tick);

    return () => {
      disposed = true;
      global.cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("ecodesa-theme-change", onTheme);
      global.removeEventListener("resize", onResize);
      if (bloom) bloom.dispose();
      backdrop.geometry.dispose();
      backdropMat.dispose();
      pointsGeo.dispose();
      pointsMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }

  global.EcodesaConstellation3D = { start, loadThree };
})(window);
