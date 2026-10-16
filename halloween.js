/* Edición Halloween: activa del 15-oct al 2-nov de cada año. ?halloween=1 fuerza, ?halloween=0 apaga. */
(function () {
  try {
    var q = new URLSearchParams(location.search).get("halloween"), d = new Date(), m = d.getMonth(), day = d.getDate();
    var on = (m === 9 && day >= 15) || (m === 10 && day <= 2);
    if (q === "1") on = true; if (q === "0") on = false;
    if (on) document.documentElement.classList.add("hw");
  } catch (e) {}
})();

/* Araña: baja por un hilo desde la telaraña y camina sobre el contorno real de las letras */
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function start() {
    if (!document.documentElement.classList.contains("hw")) return;
    var hero = document.querySelector(".hero"), sp = document.getElementById("hwSpider");
    var img = document.querySelector(".hero-word img");
    if (!hero || !sp || !img || reduce) return;
    var thread = sp.querySelector(".hw-thread"), body = sp.querySelector(".hw-sp");
    var cont = null; /* contorno normalizado: [{x,y}] x,y en 0..1 del recuadro del logo */
    var W = 1400, H = 260;
    var src = new Image(); src.onload = function () {
      try {
        var c = document.createElement("canvas"); c.width = W; c.height = H;
        var g = c.getContext("2d"); g.drawImage(src, 0, 0, W, H);
        var d = g.getImageData(0, 0, W, H).data, pts = [];
        for (var x = 0; x < W; x += 3) {
          var top = -1;
          for (var y = 0; y < H; y++) { if (d[(y * W + x) * 4 + 3] > 140) { top = y; break; } }
          pts.push({ x: x / W, y: top < 0 ? null : top / H });
        }
        /* rellena huecos entre letras con línea recta y suaviza */
        var first = pts.findIndex(function (p) { return p.y !== null; }), last = pts.length - 1;
        while (last > 0 && pts[last].y === null) last--;
        pts = pts.slice(first, last + 1);
        for (var i = 0; i < pts.length; i++) if (pts[i].y === null) {
          var a = i - 1, b = i; while (b < pts.length && pts[b].y === null) b++;
          for (var k = i; k < b; k++) pts[k].y = pts[a].y + (pts[b].y - pts[a].y) * ((k - a) / (b - a));
          i = b;
        }
        var sm = pts.map(function (p, i) { var s = 0, n = 0; for (var j = -4; j <= 4; j++) { var q = pts[i + j]; if (q) { s += q.y; n++; } } return { x: p.x, y: s / n }; });
        cont = sm;
      } catch (e) { cont = null; }
      if (!cont) cont = [{ x: 0.02, y: 0.3 }, { x: 0.98, y: 0.3 }];
      run();
    };
    src.src = img.getAttribute("src");

    var visible = true;
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { threshold: 0 }).observe(hero);

    function geo() {
      var hr = hero.getBoundingClientRect(), ir = img.getBoundingClientRect();
      var S = Math.max(40, Math.min(96, ir.width * 0.065));
      return { ox: ir.left - hr.left, oy: ir.top - hr.top, w: ir.width, h: ir.height, S: S };
    }
    function pt(g, i) {
      var m = cont.length - 1; i = Math.max(0, Math.min(m, i));
      var a = Math.floor(i), f = i - a, p = cont[a], q = cont[Math.min(m, a + 1)];
      return { x: g.ox + (p.x + (q.x - p.x) * f) * g.w, y: g.oy + (p.y + (q.y - p.y) * f) * g.h };
    }

    function run() {
      var gait = 0, wasMoving = false, dir = 1, state = "wait", t0 = performance.now(), idx = 0, pos = { x: 0, y: -80 }, ang = 0, last = t0;
      function place(g, x, y, rot, bob) {
        sp.style.setProperty("--S", g.S + "px");
        body.style.transform = "translate(" + (x - g.S / 2) + "px," + (y - g.S * 0.72 + (bob || 0)) + "px) rotate(" + rot + "deg)";
        thread.style.left = x + "px"; thread.style.height = Math.max(0, y - g.S * 0.5) + "px";
      }
      function frame(now) {
        requestAnimationFrame(frame);
        if (!visible || document.hidden) { last = now; return; }
        var dt = Math.min(0.05, (now - last) / 1000); last = now;
        var g = geo();
        if (state === "wait") {
          sp.classList.remove("on", "walk", "hang"); thread.style.opacity = 0;
          if (now - t0 > (dir === 1 && idx === 0 ? 1400 : 7000)) {
            idx = dir === 1 ? 0 : cont.length - 1; pos = { x: pt(g, idx).x, y: -g.S };
            state = "down"; sp.classList.add("on", "hang"); thread.style.opacity = 1;
          }
        } else if (state === "down") {
          var target = pt(g, idx).y;
          pos.x = pt(g, idx).x + Math.sin(now / 420) * 2.5;
          pos.y += Math.max(70, Math.min(150, (target - pos.y) * 0.8 + 60)) * dt;
          place(g, pos.x, pos.y, Math.sin(now / 380) * 5);
          if (pos.y >= target - 1) { state = "walk"; gait = 0; wasMoving = true; sp.classList.remove("hang", "idle"); sp.classList.add("walk"); thread.style.opacity = 0; }
        } else if (state === "walk") {
          /* andar a ratos: avanza, se detiene un instante, vuelve a avanzar */
          gait += dt;
          var cyc = gait % 1.9, moving = cyc < 1.35;
          if (moving !== wasMoving) { wasMoving = moving; sp.classList.toggle("walk", moving); sp.classList.toggle("idle", !moving); }
          var speed = moving ? g.w * 0.1 * (0.6 + 0.4 * Math.sin(Math.PI * cyc / 1.35)) : 0;
          var p = pt(g, idx), n = pt(g, idx + dir * 2);
          var step = speed * dt, d = Math.hypot(n.x - p.x, n.y - p.y) || 1;
          idx += dir * 2 * step / d;
          idx = Math.max(0, Math.min(cont.length - 1, idx));
          var q = pt(g, idx);
          pos = { x: q.x, y: q.y };
          var q1 = pt(g, idx - 14), q2 = pt(g, idx + 14);
          var tgt = Math.atan2(q2.y - q1.y, q2.x - q1.x) * 180 / Math.PI;
          tgt = Math.max(-28, Math.min(28, tgt)); ang += (tgt - ang) * Math.min(1, dt * 5);
          place(g, pos.x, pos.y, ang, moving ? Math.sin(now / 55) * 0.8 : 0);
          if ((dir === 1 && idx >= cont.length - 1.5) || (dir === -1 && idx <= 1.5)) { state = "up"; sp.classList.remove("walk", "idle"); sp.classList.add("hang"); thread.style.opacity = 1; }
        } else if (state === "up") {
          pos.y -= 190 * dt; ang += (0 - ang) * Math.min(1, dt * 6);
          place(g, pos.x + Math.sin(now / 300) * 2, pos.y, ang);
          if (pos.y < -g.S) { state = "wait"; t0 = now; dir = -dir; sp.classList.remove("on", "hang", "walk"); }
        }
      }
      requestAnimationFrame(frame);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
