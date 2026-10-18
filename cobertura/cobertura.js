(function () {
  // Centroides aproximados: verificar contra polígonos oficiales UCG antes de publicar.
  // Si existe cobertura/ucg.geojson con propiedad "ucg" (1,2,4,6,11,14), se usan los polígonos reales.
  var ZONAS = [
    { id: 1, loc: "Localidad 1 · Histórica y del Caribe Norte", c: [10.4236, -75.5469], barrios: "Bocagrande, Castillogrande, Centro, Chambacú, Crespo, El Cabrero, El Laguito, Getsemaní, La Matuna, Manga, Marbella, Pie de la Popa, San Diego", servicios: ["Caracterización de aguas residuales de hoteles y comercio", "Trampas de grasas para restaurantes", "Gestión de residuos sólidos y peligrosos", "Inspecciones técnicas y simulacros"] },
    { id: 2, loc: "Localidad 1 · Histórica y del Caribe Norte", c: [10.4105, -75.5035], barrios: "Cerro de la Popa, Espinal, La Paz, Loma Fresca, Los Comuneros, Nariño, Pablo VI, Palestina, Paraíso II, Pedro Salazar, Petare, San Pedro y Libertad, Torices", servicios: ["Diagnóstico de saneamiento básico", "Plan de gestión del riesgo de desastres", "Asesoría en permisos de vertimiento"] },
    { id: 4, loc: "Localidad 2 · De la Virgen y Turística", c: [10.4015, -75.5140], barrios: "Alcibia, Boston, La Candelaria, La Esperanza, La María, La Quinta", servicios: ["Caracterización de aguas residuales de hoteles", "Plan de cumplimiento de vertimientos", "Gestión de aceites de cocina usados", "Capacitación del personal"] },
    { id: 6, loc: "Localidad 2 · De la Virgen y Turística", c: [10.4210, -75.4700], barrios: "El Pozón, Fredonia, Flor del Campo, La India, Nuevo Paraíso, Villa Estrella, Olaya (Playa Blanca, La Puntilla, Progreso)", servicios: ["Diagnóstico ambiental de establecimientos", "Gestión de residuos sólidos", "Riesgo tecnológico y planes de emergencia"] },
    { id: 11, loc: "Localidad 3 · Industrial y de la Bahía", c: [10.3780, -75.4880], barrios: "Albornoz, Antonio José de Sucre, Arroz Barato, Bellavista, Ceballos, El Libertador, Policarpa, Puerta de Hierro, Santa Clara, Villa Barraza, Villa Rosa", servicios: ["Vertimientos industriales y caracterización", "Residuos peligrosos y gestores autorizados", "Riesgo tecnológico y PGRDEPP", "SG-SST para obras y talleres"] },
    { id: 14, loc: "Localidad 3 · Industrial y de la Bahía", c: [10.3930, -75.4600], barrios: "Alameda La Victoria, Camilo Torres, César Flórez, Ciudadela 2000, Jorge Eliécer Gaitán, La Esmeralda I y II, Nelson Mandela, Nueva Delhi, Villa Hermosa, Villa Rubia", servicios: ["Diagnóstico de saneamiento básico", "Gestión del riesgo de desastres", "Asesoría ambiental para proyectos"] }
  ];

  var status = document.getElementById("status");
  var card = document.getElementById("card");
  var layers = {};
  var active = null;

  function setStatus(t) { status.textContent = t; }

  var map = L.map("map", { zoomControl: true, attributionControl: true }).setView([10.41, -75.50], 12);
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "Esri, Maxar, Earthstar Geographics"
  }).addTo(map);

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
    Object.keys(layers).forEach(function (k) {
      layers[k].setStyle({ weight: k == z.id ? 3 : 1.5, fillOpacity: k == z.id ? 0.35 : 0.15 });
    });
  }

  function drawZonas(geo) {
    ZONAS.forEach(function (z) {
      var feat = geo && geo.features.find(function (f) { return f.properties.ucg == z.id; });
      var layer = feat
        ? L.geoJSON(feat, { style: { color: "#4fd19c", weight: 1.5, fillOpacity: 0.15 } })
        : L.circle(z.c, { radius: 1100, color: "#4fd19c", weight: 1.5, fillOpacity: 0.15 });
      layer.addTo(map);
      layer.bindTooltip("UCG " + z.id, { permanent: true, direction: "center", className: "ucg-label" });
      layer.on("click", function () { select(z); });
      layers[z.id] = layer;
    });
  }

  var geo = null;
  fetch("ucg.geojson", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .catch(function () { return null; })
    .then(function (g) { geo = g; drawZonas(g); });

  document.getElementById("reset").addEventListener("click", function () {
    map.setView([10.41, -75.50], 12);
    card.hidden = true;
    active = null;
    setStatus("");
  });
})();
