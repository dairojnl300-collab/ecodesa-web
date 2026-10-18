(function () {
  var ZONAS = [
    { id: 1, loc: "Localidad 1 · Histórica y del Caribe Norte", barrios: "Bocagrande, Castillogrande, Centro, Chambacú, Crespo, El Cabrero, El Laguito, Getsemaní, La Matuna, Manga, Marbella, Pie de la Popa, San Diego", servicios: ["Caracterización de aguas residuales de hoteles y comercio", "Trampas de grasas para restaurantes", "Gestión de residuos sólidos y peligrosos", "Inspecciones técnicas y simulacros"] },
    { id: 2, loc: "Localidad 1 · Histórica y del Caribe Norte", barrios: "Cerro de la Popa, Espinal, La Paz, Loma Fresca, Los Comuneros, Nariño, Pablo VI, Palestina, Paraíso II, Pedro Salazar, Petare, San Pedro y Libertad, Torices", servicios: ["Diagnóstico de saneamiento básico", "Plan de gestión del riesgo de desastres", "Asesoría en permisos de vertimiento"] },
    { id: 4, loc: "Localidad 2 · De la Virgen y Turística", barrios: "Alcibia, Boston, La Candelaria, La Esperanza, La María, La Quinta", servicios: ["Caracterización de aguas residuales de hoteles", "Plan de cumplimiento de vertimientos", "Gestión de aceites de cocina usados", "Capacitación del personal"] },
    { id: 6, loc: "Localidad 2 · De la Virgen y Turística", barrios: "El Pozón, Fredonia, Flor del Campo, La India, Nuevo Paraíso, Villa Estrella, Olaya (Playa Blanca, La Puntilla, Progreso)", servicios: ["Diagnóstico ambiental de establecimientos", "Gestión de residuos sólidos", "Riesgo tecnológico y planes de emergencia"] },
    { id: 11, loc: "Localidad 3 · Industrial y de la Bahía", barrios: "Albornoz, Antonio José de Sucre, Arroz Barato, Bellavista, Ceballos, El Libertador, Policarpa, Puerta de Hierro, Santa Clara, Villa Barraza, Villa Rosa", servicios: ["Vertimientos industriales y caracterización", "Residuos peligrosos y gestores autorizados", "Riesgo tecnológico y PGRDEPP", "SG-SST para obras y talleres"] },
    { id: 14, loc: "Localidad 3 · Industrial y de la Bahía", barrios: "Alameda La Victoria, Camilo Torres, César Flórez, Ciudadela 2000, Jorge Eliécer Gaitán, La Esmeralda I y II, Nelson Mandela, Nueva Delhi, Villa Hermosa, Villa Rubia", servicios: ["Diagnóstico de saneamiento básico", "Gestión del riesgo de desastres", "Asesoría ambiental para proyectos"] }
  ];

  var status = document.getElementById("status");
  var card = document.getElementById("card");
  var zoneCard = document.getElementById("zones-card");
  var zoneList = document.getElementById("zone-list");
  var mapNotice = document.getElementById("map-notice");
  var empty = document.getElementById("empty");
  var layers = {};
  var active = null;

  function setStatus(t) { status.textContent = t; }

  function animateCount(el) {
    var to = Number(el.getAttribute("data-to")) || 0;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.textContent = to; return; }
    var start = null;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / 900, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var totalServicios = ZONAS.reduce(function (n, z) { return n + z.servicios.length; }, 0);
  var totalLoc = Object.keys(ZONAS.reduce(function (o, z) { o[z.loc] = 1; return o; }, {})).length;
  document.getElementById("n-ucg").setAttribute("data-to", ZONAS.length);
  document.getElementById("n-loc").setAttribute("data-to", totalLoc);
  document.getElementById("n-srv").setAttribute("data-to", totalServicios);

  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 }) : null;
  document.querySelectorAll(".reveal").forEach(function (el) {
    if (io) io.observe(el); else el.classList.add("in");
  });
  document.querySelectorAll(".stat b").forEach(animateCount);

  var map = L.map("map", { zoomControl: true, attributionControl: true }).setView([10.41, -75.50], 12);
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "Esri, Maxar, Earthstar Geographics"
  }).addTo(map);

  function getFeature(geo, id) {
    if (!geo || !Array.isArray(geo.features)) return null;
    return geo.features.find(function (f) {
      return f && f.properties && f.properties.ucg != null && String(f.properties.ucg) === String(id);
    }) || null;
  }

  function renderZoneList(polygonIds, showList) {
    zoneCard.hidden = !showList;
    zoneList.replaceChildren.apply(zoneList, ZONAS.map(function (z) {
      var item = document.createElement("div");
      item.setAttribute("role", "listitem");
      var button = document.createElement("button");
      button.className = "zone";
      button.type = "button";
      button.setAttribute("aria-pressed", "false");
      var copy = document.createElement("span");
      copy.className = "zone-copy";
      var title = document.createElement("span");
      title.className = "zone-title";
      title.textContent = "UCG " + z.id;
      var loc = document.createElement("span");
      loc.className = "zone-loc";
      loc.textContent = z.loc;
      copy.appendChild(title);
      copy.appendChild(loc);
      var tag = document.createElement("span");
      tag.className = "zone-tag";
      tag.textContent = polygonIds[z.id] ? "polígono oficial" : "zona aproximada";
      button.appendChild(copy);
      button.appendChild(tag);
      button.addEventListener("click", function () { select(z); });
      item.appendChild(button);
      return item;
    }));
  }

  function select(z) {
    active = z;
    document.getElementById("ct").textContent = "UCG " + z.id;
    document.getElementById("cl").textContent = z.loc;
    document.getElementById("cb").textContent = "Barrios: " + z.barrios;
    var ul = document.getElementById("cs");
    ul.replaceChildren.apply(ul, z.servicios.map(function (s) {
      var li = document.createElement("li"); li.textContent = s; return li;
    }));
    document.getElementById("cc").href = "https://wa.me/573246886824?text=" +
      encodeURIComponent("Hola, estoy en UCG " + z.id + " (" + z.loc + "). Quiero información de servicios ambientales.");
    card.hidden = false;
    empty.hidden = true;
    Array.prototype.forEach.call(zoneList.querySelectorAll(".zone"), function (b, i) {
      b.setAttribute("aria-pressed", String(ZONAS[i] === z));
    });
    Object.keys(layers).forEach(function (k) {
      layers[k].setStyle({ weight: k == z.id ? 3 : 1.5, fillOpacity: k == z.id ? 0.35 : 0.15 });
    });
    if (window.matchMedia && window.matchMedia("(max-width: 819px)").matches) {
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function clearSelection() {
    card.hidden = true;
    empty.hidden = false;
    active = null;
    Array.prototype.forEach.call(zoneList.querySelectorAll(".zone"), function (b) {
      b.setAttribute("aria-pressed", "false");
    });
    Object.keys(layers).forEach(function (k) {
      layers[k].setStyle({ weight: 1.5, fillOpacity: 0.15 });
    });
  }

  function drawZonas(geo) {
    var polygonIds = {};
    ZONAS.forEach(function (z) {
      var feat = getFeature(geo, z.id);
      if (!feat) return;
      polygonIds[z.id] = true;
      var layer = L.geoJSON(feat, { style: { color: "#4fd19c", weight: 1.5, fillOpacity: 0.15 } });
      layer.addTo(map);
      layer.bindTooltip("UCG " + z.id, { permanent: true, direction: "center", className: "ucg-label" });
      layer.on("click", function () { select(z); });
      layers[z.id] = layer;
    });
    var polygonCount = Object.keys(polygonIds).length;
    renderZoneList(polygonIds, polygonCount < ZONAS.length);
    if (!polygonCount) {
      mapNotice.textContent = "No hay polígonos oficiales disponibles. Consulta la lista: zona aproximada.";
      mapNotice.hidden = false;
      setStatus("Selecciona una zona de la lista; su ubicación es aproximada.");
    } else {
      mapNotice.hidden = true;
      setStatus(polygonCount === ZONAS.length
        ? "Polígonos oficiales de UCG cargados."
        : "Algunas zonas no tienen polígono oficial; revisa la etiqueta zona aproximada.");
    }
  }

  renderZoneList({}, true);
  fetch("ucg.geojson", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .catch(function () { return null; })
    .then(drawZonas);

  document.getElementById("reset").addEventListener("click", function () {
    map.setView([10.41, -75.50], 12);
    clearSelection();
    setStatus("");
  });

  document.getElementById("close").addEventListener("click", clearSelection);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && active) clearSelection();
  });
})();
