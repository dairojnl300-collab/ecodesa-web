/* Bóveda IA: apertura en alta definición dibujada en canvas (nítida en cualquier pantalla, 60 fps) */
(function () {
  "use strict";
  var SRC = "boveda/boveda-puerta-recorte.webp";
  var IW = 747, IH = 775;                 // tamaño del recorte
  var CX = 377, HL = 205, HR = 550;       // centro y bisagras de las hojas
  var AT = 118, AY = 292, AB = 652;       // ápice del arco, arranque del arco, base de las hojas
  var LX = 372, LY = 425;                 // candado
  var img = null, imgP = null, layers = null;

  function loadImg() {
    if (imgP) return imgP;
    imgP = new Promise(function (ok, ko) { var i = new Image(); i.decoding = "async"; i.onload = function () { img = i; ok(i); }; i.onerror = ko; i.src = SRC; });
    return imgP;
  }
  function archPath(c, inset) {
    var l = HL + inset, r = HR - inset, rx = (r - l) / 2, cx = (l + r) / 2;
    c.beginPath(); c.moveTo(l, AB); c.lineTo(l, AY);
    c.ellipse(cx, AY, rx, AY - AT - inset, 0, Math.PI, 0); c.lineTo(r, AB); c.closePath();
  }
  function mk(w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  function build() {
    if (layers) return layers;
    var frame = mk(IW, IH), f = frame.getContext("2d");
    f.drawImage(img, 0, 0); f.globalCompositeOperation = "destination-out"; archPath(f, 2); f.fill();
    function leaf(x0, x1, dark) {
      var c = mk(IW, IH), g = c.getContext("2d");
      g.save(); archPath(g, 0); g.clip(); g.beginPath(); g.rect(x0, 0, x1 - x0, IH); g.clip(); g.drawImage(img, 0, 0); g.restore();
      if (dark) { g.globalCompositeOperation = "source-atop"; g.fillStyle = "rgba(20,10,0,.62)"; g.fillRect(0, 0, IW, IH); }
      return c;
    }
    layers = { frame: frame, L: leaf(HL - 4, CX, 0), R: leaf(CX, HR + 4, 0), Ld: leaf(HL - 4, CX, 1), Rd: leaf(CX, HR + 4, 1) };
    return layers;
  }

  var ease = function (t) { return t < 0 ? 0 : t > 1 ? 1 : t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var easeIn = function (t) { t = Math.max(0, Math.min(1, t)); return t * t * t; };
  var clamp = function (t) { return t < 0 ? 0 : t > 1 ? 1 : t; };

  /* portal verde en remolino */
  var parts = [];
  for (var i = 0; i < 90; i++) parts.push({ a: Math.random() * 6.283, r: Math.random(), s: .25 + Math.random() * .6, w: .6 + Math.random() * 1.6 });
  function portal(c, t, R, cx, cy, ci) {
    var g = c.createRadialGradient(cx, cy, 0, cx, cy, R * 1.35);
    g.addColorStop(0, "#ffffff"); g.addColorStop(.07, "#eafff0"); g.addColorStop(.2, "#7dff9a");
    g.addColorStop(.48, "#20c94e"); g.addColorStop(.8, "#0b7a2a"); g.addColorStop(1, "#04431a");
    c.fillStyle = g; c.fillRect(cx - R * 2, cy - R * 2, R * 4, R * 4);
    c.save(); c.globalCompositeOperation = "lighter"; c.lineCap = "round";
    var arms = 7, rot = t * 2.6;
    for (var k = 0; k < arms; k++) {
      for (var layer = 0; layer < 2; layer++) {
        c.beginPath();
        var off = k * 6.283 / arms + layer * .22;
        for (var s = 0; s <= 40; s++) {
          var u = s / 40, rr = R * (.06 + u * 1.25), an = off + rot + u * 4.2 * (layer ? 1.08 : 1);
          var x = cx + Math.cos(an) * rr, y = cy + Math.sin(an) * rr * .92;
          s ? c.lineTo(x, y) : c.moveTo(x, y);
        }
        c.strokeStyle = layer ? "rgba(190,255,200,.16)" : "rgba(235,255,235,.30)";
        c.lineWidth = R * (layer ? .09 : .035); c.stroke();
      }
    }
    for (var p = 0; p < parts.length; p++) {
      var q = parts[p], life = (q.r - t * q.s * .35) % 1; if (life < 0) life += 1;
      var rr2 = R * 1.2 * life, an2 = q.a + rot * 1.4 + (1 - life) * 3.2;
      c.globalAlpha = Math.min(1, life * 3) * (1 - life * .5) * .9;
      c.fillStyle = "#f2fff2"; c.beginPath(); c.arc(cx + Math.cos(an2) * rr2, cy + Math.sin(an2) * rr2 * .92, q.w * R / 120, 0, 6.283); c.fill();
    }
    c.globalAlpha = 1;
    var core = c.createRadialGradient(cx, cy, 0, cx, cy, R * .55);
    core.addColorStop(0, "rgba(255,255,255,1)"); core.addColorStop(.35, "rgba(230,255,235,.75)"); core.addColorStop(1, "rgba(120,255,150,0)");
    c.globalAlpha = ci; c.fillStyle = core; c.beginPath(); c.arc(cx, cy, R * .55, 0, 6.283); c.fill(); c.globalAlpha = 1;
    c.restore();
  }

  /* hoja en perspectiva real: se dibuja en franjas verticales proyectadas */
  function drawLeaf(c, src, dark, hinge, w, dir, th) {
    var N = 56, F = 1300, cy = (AT + AB) / 2, cos = Math.cos(th), sin = Math.sin(th), shade = Math.min(1, sin * 1.15);
    for (var i = 0; i < N; i++) {
      var u0 = i / N, u1 = (i + 1) / N;
      var sx = dir > 0 ? hinge + u0 * w : hinge - u1 * w, sw = w / N;
      function proj(u) { var X = hinge + dir * u * w * cos, Z = u * w * sin, k = F / (F + Z); return { x: CX + (X - CX) * k, k: k }; }
      var a = proj(dir > 0 ? u0 : u1), b = proj(dir > 0 ? u1 : u0);
      var x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x), k = (a.k + b.k) / 2;
      if (x1 - x0 < .05) continue;
      var top = cy + (0 - cy) * k, h = IH * k;
      c.drawImage(src, sx, 0, sw, IH, x0, top, x1 - x0 + .6, h);
      if (shade > .01) { c.globalAlpha = shade; c.drawImage(dark, sx, 0, sw, IH, x0, top, x1 - x0 + .6, h); c.globalAlpha = 1; }
    }
  }

  function play(stage, done) {
    loadImg().then(function () {
      var L = build(), cv = document.createElement("canvas"); cv.className = "bv-hd";
      stage.appendChild(cv);
      var ctx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2.5), W, H, sc, ox, oy;
      function size() {
        var r = stage.getBoundingClientRect(); W = Math.round(r.width * dpr); H = Math.round(r.height * dpr);
        cv.width = W; cv.height = H;
        // misma caja que la puerta en reposo (.bv-fly: inset 1% 1% 5%, contain)
        var bw = W * .98, bh = H * .94; sc = Math.min(bw / IW, bh / IH);
        ox = W * .01 + (bw - IW * sc) / 2; oy = H * .01 + (bh - IH * sc) / 2;
      }
      size();
      var t0 = performance.now(), PX = CX, PY = 410, TOTAL = 3.5, fired = false;
      function frame(now) {
        var t = (now - t0) / 1000;
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
        var z = 1 + 4.2 * easeIn((t - 1.85) / 1.45);                // acercamiento de cámara al portal
        ctx.setTransform(sc * z, 0, 0, sc * z, ox + PX * sc - PX * sc * z, oy + PY * sc - PY * sc * z);
        var th = ease((t - .95) / 1.15) * 1.86;                      // apertura de las hojas (≈107°)
        var R = (HR - HL) * .62;
        // portal (detrás de las hojas)
        ctx.save(); var pf = clamp((t - .7) / .35);
        if (pf > 0) {
          ctx.globalAlpha = pf;
          var outFrame = clamp((t - 2.5) / .45);
          if (outFrame < 1) { archPath(ctx, 0); ctx.clip(); }
          portal(ctx, t, R * (1 + outFrame * .5), CX, PY, 1 - .65 * outFrame);
        }
        ctx.restore();
        // hojas
        var fa = 1 - clamp((t - 2.45) / .5);
        if (fa > 0) {
          ctx.globalAlpha = fa;
          drawLeaf(ctx, L.L, L.Ld, HL, CX - HL, 1, th);
          drawLeaf(ctx, L.R, L.Rd, HR, HR - CX, -1, th);
          ctx.drawImage(L.frame, 0, 0);
          ctx.globalAlpha = 1;
        }
        // rendija de luz y candado
        var seam = clamp((t - .55) / .3) * (1 - clamp((t - 1.25) / .4));
        if (seam > 0) {
          ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = seam;
          var sg = ctx.createLinearGradient(CX - 30, 0, CX + 30, 0);
          sg.addColorStop(0, "rgba(80,255,120,0)"); sg.addColorStop(.5, "rgba(230,255,230,.95)"); sg.addColorStop(1, "rgba(80,255,120,0)");
          ctx.fillStyle = sg; var hh = (AB - AT) * clamp((t - .55) / .3); ctx.fillRect(CX - 30, (AT + AB) / 2 - hh / 2, 60, hh);
          ctx.restore();
        }
        var lk = clamp(t / .35) * (1 - clamp((t - .9) / .5));
        if (lk > 0) {
          ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = lk;
          var rr = 70 + 40 * Math.sin(t * 9);
          var lg = ctx.createRadialGradient(LX, LY, 0, LX, LY, rr);
          lg.addColorStop(0, "rgba(220,255,220,.95)"); lg.addColorStop(.4, "rgba(70,240,110,.6)"); lg.addColorStop(1, "rgba(40,200,80,0)");
          ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(LX, LY, rr, 0, 6.283); ctx.fill(); ctx.restore();
        }
        // bordes suaves al final del acercamiento
        var v = clamp((t - 1.95) / .7);
        if (v > 0) {
          ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = "destination-in";
          var m = Math.min(W, H) / 2, vg = ctx.createRadialGradient(W / 2, H / 2, m * (1 - .8 * v), W / 2, H / 2, m * (1.45 - .5 * v));
          vg.addColorStop(0, "#000"); vg.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = "source-over";
        }
        cv.style.opacity = String(1 - clamp((t - 3.05) / .4));
        if (t >= 3.1 && !fired) { fired = true; done(); }
        if (t < TOTAL) requestAnimationFrame(frame); else cv.remove();
      }
      requestAnimationFrame(frame);
    }, function () { done(); });
  }
  window.bvOpenHD = { preload: loadImg, play: play };
})();
