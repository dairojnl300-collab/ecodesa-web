/* Edición Halloween: activa del 15-oct al 2-nov de cada año. ?halloween=1 fuerza, ?halloween=0 apaga. */
(function () {
  try {
    var q = new URLSearchParams(location.search).get("halloween"), d = new Date(), m = d.getMonth(), day = d.getDate();
    var on = (m === 9 && day >= 15) || (m === 10 && day <= 2);
    if (q === "1") on = true; if (q === "0") on = false;
    if (on) document.documentElement.classList.add("hw");
  } catch (e) {}
})();
