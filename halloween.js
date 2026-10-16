/* Edición Halloween: temporada del 15-oct al 2-nov. ?halloween=1 fuerza, ?halloween=0 apaga. El cliente decide con el botón calabaza. */
(function () {
  try {
    var q = new URLSearchParams(location.search).get("halloween"), d = new Date(), m = d.getMonth(), day = d.getDate();
    var season = (m === 9 && day >= 15) || (m === 10 && day <= 2) || q === "1";
    if (q === "0") season = false;
    var off = false; try { off = localStorage.getItem("ecodesa-hw") === "off"; } catch (e) {}
    var on = season && (q === "1" || !off), root = document.documentElement;
    function setTheme(t) { root.setAttribute("data-theme", t); try { localStorage.setItem("ecodesa-theme", t); } catch (e) {} }
    if (on) {
      root.classList.add("hw");
      /* primera vez en temporada: versión noche; después se respeta lo que elija el cliente */
      var seen = false; try { seen = localStorage.getItem("ecodesa-hw-seen") === "1"; localStorage.setItem("ecodesa-hw-seen", "1"); } catch (e) {}
      if (!seen) setTheme("dark");
    }
    if (!season) return;
    function mount() {
      var t = document.getElementById("themeBtn"); if (!t || document.getElementById("hwBtn")) return;
      var b = document.createElement("button");
      b.type = "button"; b.id = "hwBtn"; b.className = "hw-btn"; b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", on ? "Quitar edición Halloween" : "Activar edición Halloween"); b.title = "Edición Halloween";
      b.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 11c-1-4-3-6-6-7 1 3 2 5 3 7z" fill="#4f8a2a"/><ellipse cx="24" cy="28" rx="19" ry="15" fill="#ff7a18"/><ellipse cx="14" cy="28" rx="7" ry="14" fill="#f06a08"/><ellipse cx="34" cy="28" rx="7" ry="14" fill="#f06a08"/><ellipse cx="24" cy="28" rx="6" ry="15" fill="#ff8a2e"/><path d="M13 24l5 3-5 1zM35 24l-5 3 5 1zM20 33l4-2 4 2-1 2-3-1-3 1z" fill="#2a1200"/></svg><span class="hw-btn-t">Edición Halloween</span>';
      b.addEventListener("click", function () {
        var next = !root.classList.contains("hw");
        try { localStorage.setItem("ecodesa-hw", next ? "on" : "off"); localStorage.setItem("ecodesa-hw-seen", "1"); } catch (e) {}
        setTheme(next ? "dark" : "light");
        var u = new URL(location.href); u.searchParams.delete("halloween");
        if (next) { location.href = u.toString(); } else { location.href = u.toString(); }
      });
      t.parentNode.insertBefore(b, t);
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
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


/* Telaraña realista: radios + hilos de captura con caída (catenaria) + gotas de rocío */
(function () {
  function webSVG() {
    var N = 7, R = 150, rad = [], i, k, s = "";
    for (i = 0; i <= N; i++) { var a = (i / N) * Math.PI / 2 + (i % 2 ? 0.012 : -0.01) * (i && i < N ? 1 : 0); rad.push([Math.cos(a), Math.sin(a)]); }
    s += '<g fill="none" stroke="currentColor" stroke-linecap="round">';
    s += '<g stroke-width="1.5">'; for (i = 0; i <= N; i++) s += '<path d="M0 0L' + (rad[i][0] * R).toFixed(1) + " " + (rad[i][1] * R).toFixed(1) + '"/>'; s += "</g>";
    s += '<g stroke-width="1">';
    var rings = [16, 28, 41, 55, 70, 86, 103, 121, 140];
    for (k = 0; k < rings.length; k++) {
      var r = rings[k] * (1 + ((k * 7) % 5) * 0.01);
      for (i = 0; i < N; i++) {
        var x1 = rad[i][0] * r, y1 = rad[i][1] * r, x2 = rad[i + 1][0] * r, y2 = rad[i + 1][1] * r;
        var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, sag = 0.3 + 0.02 * k;
        s += '<path d="M' + x1.toFixed(1) + " " + y1.toFixed(1) + "Q" + (mx * (1 - sag * 0.5)).toFixed(1) + " " + (my * (1 - sag * 0.5)).toFixed(1) + " " + x2.toFixed(1) + " " + y2.toFixed(1) + '"/>';
      }
    }
    s += "</g></g>";
    s += '<g fill="currentColor" opacity=".9">';
    [[0.31,70],[0.62,86],[0.18,103],[0.8,55],[0.45,121],[0.7,28]].forEach(function (d) { var a = d[0] * Math.PI / 2; s += '<circle cx="' + (Math.cos(a) * d[1] * 0.97).toFixed(1) + '" cy="' + (Math.sin(a) * d[1] * 0.97).toFixed(1) + '" r="1.7"/>'; });
    s += "</g>";
    return '<svg viewBox="0 0 150 150" aria-hidden="true">' + s + "</svg>";
  }
  function apply() {
    if (!document.documentElement.classList.contains("hw")) return;
    var svg = webSVG();
    Array.prototype.forEach.call(document.querySelectorAll(".hw-web"), function (w) { w.innerHTML = svg; });
  }
  window.__hwWeb = apply;
})();

/* Decoración en toda la página: telarañas realistas con araña bajando, fantasmas, nubes y neblina */
(function () {
  function webSVG(mir) {
    var R = 170, n = 8, rings = [20, 38, 58, 80, 104, 130, 156], d = "", rad = "", dew = "";
    var ang = []; for (var k = 0; k <= n; k++) ang.push((Math.PI / 2) * k / n);
    ang.forEach(function (a, k) {
      var jit = 1 - (k % 3 === 1 ? 0.07 : 0);
      rad += "M0 0 L" + (R * jit * Math.cos(a)).toFixed(1) + " " + (R * jit * Math.sin(a)).toFixed(1);
    });
    rings.forEach(function (r, ri) {
      for (var k = 0; k < n; k++) {
        var a1 = ang[k], a2 = ang[k + 1], am = (a1 + a2) / 2, sag = r * (0.86 + 0.02 * ((k + ri) % 3));
        var x1 = r * Math.cos(a1), y1 = r * Math.sin(a1), x2 = r * Math.cos(a2), y2 = r * Math.sin(a2);
        d += "M" + x1.toFixed(1) + " " + y1.toFixed(1) + " Q" + (sag * Math.cos(am)).toFixed(1) + " " + (sag * Math.sin(am)).toFixed(1) + " " + x2.toFixed(1) + " " + y2.toFixed(1);
        if ((k + ri) % 4 === 0) dew += '<circle cx="' + (x2).toFixed(1) + '" cy="' + (y2).toFixed(1) + '" r="1.7"/>';
      }
    });
    return '<svg viewBox="0 0 170 170" aria-hidden="true"' + (mir ? ' style="transform:scaleX(-1)"' : "") + '><g fill="none" stroke="currentColor" stroke-linecap="round"><path stroke-width="1.5" d="' + rad + '"/><path stroke-width="0.9" d="' + d + '"/></g><g fill="currentColor" opacity=".95">' + dew + "</g></svg>";
  }
  function cloud(w, op) {
    return '<svg viewBox="0 0 220 80" width="' + w + '" aria-hidden="true" style="opacity:' + op + '"><g fill="currentColor"><ellipse cx="60" cy="56" rx="54" ry="20"/><ellipse cx="110" cy="46" rx="50" ry="26"/><ellipse cx="150" cy="56" rx="56" ry="20"/><ellipse cx="90" cy="34" rx="30" ry="22"/><ellipse cx="130" cy="32" rx="26" ry="18"/></g></svg>';
  }
  function go() {
    var root = document.documentElement;
    if (!root.classList.contains("hw")) return;
    var hang = document.querySelector(".hw-hang.h1"), ghost = document.querySelector(".hw-ghost.g1");
    var pks = document.querySelector(".hw-pks");
    /* telarañas del hero: más reales */
    Array.prototype.forEach.call(document.querySelectorAll(".hero .hw-web"), function (w) { w.innerHTML = webSVG(w.classList.contains("hw-web-r") ? false : false); });
    var hl = document.querySelector(".hero .hw-web-r"); if (hl) hl.innerHTML = webSVG(false);
    /* nubes y neblina en el hero */
    var hl2 = document.querySelector(".hero .hw-layer");
    if (hl2) {
      var sky = document.createElement("div"); sky.className = "hw-sky";
      sky.innerHTML = '<i class="hw-fog f1"></i><i class="hw-fog f2"></i>';
      hl2.insertBefore(sky, hl2.firstChild);
    }
    var secs = document.querySelectorAll("main .sec:not(.hw-sec), .foot");
    Array.prototype.forEach.call(secs, function (s, i) {
      var L = document.createElement("div"); L.className = "hw-wide"; L.setAttribute("aria-hidden", "true");
      var right = i % 2 === 0;
      /* telaraña + araña que baja desde ella */
      var c = document.createElement("div"); c.className = "hw-corner " + (right ? "cr" : "cl");
      c.innerHTML = '<i class="hw-web">' + webSVG(right) + "</i>";
      if (hang) {
        var h = hang.cloneNode(true); h.className = "hw-hang hw-hs"; h.style.animationDelay = (-i * 1.1) + "s";
        h.style.setProperty("--len", (70 + (i % 3) * 38) + "px");
        h.querySelector(".hw-thread2").style.animationDelay = (-i * 0.9) + "s";
        c.appendChild(h);
      }
      L.appendChild(c);
      if (ghost) {
        var g = ghost.cloneNode(true); g.className = "hw-ghost hw-gs " + (right ? "gs-l" : "gs-r"); g.style.animationDelay = (-i * 1.7) + "s"; L.appendChild(g);
        if (i % 2 === 0) { var g2 = ghost.cloneNode(true); g2.className = "hw-ghost hw-gs gs-m"; g2.style.animationDelay = (-i * 0.8 - 2) + "s"; L.appendChild(g2); }
      }
      var f = document.createElement("i"); f.className = "hw-fog hw-fs"; L.appendChild(f);
      if (s.classList.contains("foot") && pks) { var p = pks.cloneNode(true); p.classList.add("hw-pks-f"); L.appendChild(p); }
      s.style.position = s.style.position || "relative";
      s.insertBefore(L, s.firstChild);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
