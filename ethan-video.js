(function () {
  var v = document.getElementById("evVid"); if (!v) return;
  var root = document.documentElement, snd = document.getElementById("evSnd"),
    pp = document.getElementById("evPP"), sk = document.getElementById("evSk"),
    skf = document.getElementById("evSkf"), tm = document.getElementById("evTm"),
    cta = document.getElementById("evCta"), DUR = 84.5, key = "", near = false, vis = false, started = false, userPaused = false, sent = false;
  function th() { return root.getAttribute("data-theme") === "dark" ? "d" : "l"; }
  function lay() { return window.innerWidth >= 760 ? "w" : "v"; }
  function fmt(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function want() { return lay() + th(); }
  /* Video con transparencia: cada archivo "alfa-*" trae el color en la mitad de arriba y el canal alfa en la de abajo.
     Un lienzo WebGL los une, así la escena queda sobre el fondo real de la página en cualquier edición o tema.
     Sin WebGL se usa el video anterior, con fondo propio. */
  var stage = v.parentNode, can = document.createElement("canvas"), gl = null, alpha = false, prog, uPx, drawn = false, lastT = -1, loop = 0;
  can.className = "evp-can"; can.setAttribute("aria-hidden", "true");
  function initGL() {
    try { gl = can.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "low-power" }); } catch (e) { gl = null; }
    if (!gl) return false;
    function sh(type, src) { var o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; }
    var vs = sh(gl.VERTEX_SHADER, "attribute vec2 p;varying vec2 uv;void main(){uv=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}"),
      fs = sh(gl.FRAGMENT_SHADER, "precision mediump float;uniform sampler2D t;uniform float px;varying vec2 uv;void main(){float y=uv.y*.5;vec3 c=texture2D(t,vec2(uv.x,min(y,.5-px))).rgb;float a=texture2D(t,vec2(uv.x,max(y+.5,.5+px))).r;gl_FragColor=vec4(min(c,vec3(a)),a);}");
    if (!vs || !fs) return false;
    prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    uPx = gl.getUniformLocation(prog, "px");
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return true;
  }
  function draw(force) {
    if (!alpha || v.readyState < 2 || !v.videoWidth) return;
    if (!force && v.currentTime === lastT) return;
    lastT = v.currentTime;
    var w = v.videoWidth, h = v.videoHeight >> 1;
    if (can.width !== w || can.height !== h) { can.width = w; can.height = h; gl.viewport(0, 0, w, h); }
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v);
      gl.uniform1f(uPx, 1 / v.videoHeight); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } catch (e) { return; }
    if (!drawn) { drawn = true; can.style.backgroundImage = "none"; }
  }
  function tick() { loop = 0; draw(); if (!v.paused && !v.ended) loop = requestAnimationFrame(tick); }
  function run() { if (alpha && !loop) loop = requestAnimationFrame(tick); }
  alpha = initGL();
  if (alpha) {
    stage.insertBefore(can, v); stage.classList.add("evp-a");
    can.addEventListener("webglcontextlost", function (e) { e.preventDefault(); });
    can.addEventListener("webglcontextrestored", function () { alpha = initGL(); draw(true); });
    ["play", "playing"].forEach(function (e) { v.addEventListener(e, run); });
    ["loadeddata", "seeked", "pause", "ended"].forEach(function (e) { v.addEventListener(e, function () { draw(true); }); });
  }
  function base() { return "assets/v2/ev/" + (alpha ? "alfa-" : "escena-") + want(); }
  function apply(force) {
    var k = want(); if (k === key && !force) return;
    var t = key ? v.currentTime : 0, was = !v.paused; key = k;
    v.poster = base() + ".webp";
    if (alpha && !drawn) can.style.backgroundImage = 'url("' + base() + '.webp")';
    if (!near) return;
    v.src = base() + ".mp4"; v.load();
    v.addEventListener("loadedmetadata", function f() {
      v.removeEventListener("loadedmetadata", f);
      if (t > 0 && t < DUR - 0.3) try { v.currentTime = t; } catch (e) {}
      if (was) v.play().catch(function () {});
    });
  }
  function ui() {
    var t = v.currentTime || 0, d = v.duration || DUR, end = v.ended;
    skf.style.width = Math.min(100, t / d * 100) + "%";
    sk.setAttribute("aria-valuenow", Math.round(t));
    tm.textContent = fmt(t) + " / " + fmt(d);
    pp.textContent = end ? "↻" : (v.paused ? "▶" : "❚❚");
    pp.setAttribute("aria-label", end ? "Volver a ver" : (v.paused ? "Reproducir" : "Pausar"));
  }
  function play() {
    if (!v.src) { near = true; apply(true); }
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }
  function toggle() {
    if (v.ended) { v.currentTime = 0; userPaused = false; play(); }
    else if (v.paused) { userPaused = false; play(); }
    else { userPaused = true; v.pause(); }
  }
  v.addEventListener("play", function () {
    started = true;
    if (!sent) { sent = true; (window.dataLayer = window.dataLayer || []).push({ event: "induccion_play" }); }
  });
  ["timeupdate", "play", "pause", "ended", "loadedmetadata"].forEach(function (e) { v.addEventListener(e, ui); });
  v.addEventListener("click", toggle); can.addEventListener("click", toggle); pp.addEventListener("click", toggle);
  snd.addEventListener("click", function () {
    v.muted = !v.muted; snd.setAttribute("aria-pressed", String(!v.muted));
    snd.setAttribute("aria-label", v.muted ? "Activar sonido" : "Silenciar");
    if (!v.muted && v.paused && !v.ended) { userPaused = false; play(); }
  });
  function seek(x) {
    var r = sk.getBoundingClientRect(), p = Math.min(1, Math.max(0, (x - r.left) / r.width));
    if (!v.src) { near = true; apply(true); }
    var d = v.duration || DUR; try { v.currentTime = p * d; } catch (e) {}
  }
  var drag = false;
  sk.addEventListener("pointerdown", function (e) { drag = true; sk.setPointerCapture(e.pointerId); seek(e.clientX); });
  sk.addEventListener("pointermove", function (e) { if (drag) seek(e.clientX); });
  sk.addEventListener("pointerup", function () { drag = false; });
  sk.addEventListener("keydown", function (e) {
    var d = e.key === "ArrowRight" ? 5 : e.key === "ArrowLeft" ? -5 : 0; if (!d) return;
    e.preventDefault(); v.currentTime = Math.max(0, Math.min((v.duration || DUR) - 0.1, v.currentTime + d));
  });
  cta.addEventListener("click", function () { var b = document.querySelector(".as-btn"); if (b) b.click(); });
  var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      near = es[0].isIntersecting; if (near) apply(true); else if (v.src && !started) { v.removeAttribute("src"); v.load(); }
    }, { rootMargin: "600px 0px" }).observe(v);
    new IntersectionObserver(function (es) {
      vis = es[0].isIntersecting;
      if (vis && !userPaused && !v.ended && !calm) { if (!v.src) { near = true; apply(true); } play(); }
      else if (!vis && !v.paused) v.pause();
    }, { threshold: 0.35 }).observe(v);
  }
  new MutationObserver(function () { apply(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(apply, 250); });
  apply(); ui();
})();
