/* Arranque de ecodesa.co. Se carga antes de pintar la página:
   1) consentimiento de Google denegado por defecto (Consent Mode v2),
   2) defensa contra incrustación del sitio en páginas ajenas (clickjacking),
   3) tema claro u oscuro sin parpadeo,
   4) edición Fiestas en los documentos (atributo data-fi). */
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag("consent", "default", { ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
(function () {
  var d = document.documentElement, me = document.currentScript, t;
  try {
    if (window.top !== window.self) {
      var same = false;
      try { same = window.top.location.hostname === location.hostname; } catch (e) {}
      if (!same) window.top.location = location.href;
    }
  } catch (e) {}
  try { t = localStorage.getItem("ecodesa-theme"); } catch (e) {}
  if (t !== "light" && t !== "dark") { var hr = new Date().getHours(); t = hr >= 6 && hr < 18 ? "light" : "dark"; }
  d.setAttribute("data-theme", t);
  if (me && me.hasAttribute("data-fi")) {
    /* documentos: misma edición que la portada (Fiestas 1–16 de noviembre; ?fiestas=1 la fuerza, ?fiestas=0 la apaga; el botón de la bandera la recuerda) */
    var q = null, dt = new Date(), off = false;
    try { q = new URLSearchParams(location.search).get("fiestas"); } catch (e) {}
    try { off = localStorage.getItem("ecodesa-fi") === "off"; } catch (e) {}
    var season = (dt.getMonth() === 10 && dt.getDate() <= 16) || q === "1";
    if (q === "0") season = false;
    if (season && (q === "1" || !off)) d.classList.add("fi");
  }
  if (me && me.hasAttribute("data-js")) {
    d.classList.add("js");
    setTimeout(function () { if (!window.__v2) d.classList.remove("js"); }, 3500);
  }
})();
