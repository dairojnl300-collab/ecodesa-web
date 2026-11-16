/* Arranque de la Bóveda IA (antes de pintar): defensa contra incrustación en sitios ajenos, modo incrustado, tema, edición y puerta. */
(function () {
  try {
    if (window.top !== window.self) {
      var same = false;
      try { same = window.top.location.hostname === location.hostname; } catch (e) {}
      if (!same) window.top.location = location.href;
    }
  } catch (e) {}
})();
(function(){var r=document.documentElement;try{if(window.self!==window.top)r.classList.add("embed")}catch(e){r.classList.add("embed")}var t=null,f=null;try{t=localStorage.getItem("boveda-theme");f=localStorage.getItem("boveda-fi")}catch(e){}if(t!=="light"&&t!=="dark")t=window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";r.setAttribute("data-theme",t);if(f==="on")r.classList.add("fi")})();
(function(){var r=document.documentElement,q=null,s=null;try{q=new URLSearchParams(location.search).get("puerta")}catch(e){}try{s=sessionStorage.getItem("boveda-puerta")}catch(e){}if(q!=="0"&&(q==="1"||!s))r.classList.add("gated")})();
