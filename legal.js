/* Páginas legales: botón de tema claro u oscuro */
(function () {
  var b = document.getElementById("ltheme"), r = document.documentElement; if (!b) return;
  function s() { b.setAttribute("aria-label", r.getAttribute("data-theme") === "dark" ? "Cambiar a modo día" : "Cambiar a modo noche"); }
  b.addEventListener("click", function () {
    var t = r.getAttribute("data-theme") === "dark" ? "light" : "dark";
    r.setAttribute("data-theme", t);
    try { localStorage.setItem("ecodesa-theme", t); } catch (e) {}
    s();
  });
  s();
})();
