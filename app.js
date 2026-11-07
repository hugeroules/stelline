/* ==== DA MODIFICARE (solo questi tre valori) ==== */

// ID del video YouTube di presentazione, che parte dopo il tuo (la parte dopo "youtu.be/", senza "?si=...")
const YT_VIDEO_ID = "HDaaoQ6h_Xc";

// Dove porta il pulsante a fine video. Deve iniziare con https://
// Qui c'è il video finale, senza il codice "?si=..." che identifica chi ha condiviso il link.
const BUTTON_URL = "https://www.youtube.com/watch?v=jRmKWCcjTbA";

// Testo del pulsante
const BUTTON_TEXT = "Ora clicca e goditi il video su YouTube";

/* ================================================ */

"use strict";

const $ = (id) => document.getElementById(id);
const myVideo = $("myVideo");
const intro = $("intro");
const ytBox = $("yt");
const endBox = $("end");
const cta = $("cta");

// Sicurezza: il pulsante accetta solo indirizzi https, mai "javascript:" o simili.
function safeUrl(u) {
  try {
    const url = new URL(u);
    return url.protocol === "https:" ? url.href : null;
  } catch (_) { return null; }
}

// Schermata nera finale con il pulsante, al posto del player YouTube.
function showButton() {
  const href = safeUrl(BUTTON_URL);
  if (!href) return;
  clearTimeout(apiTimer);

  // Se il player era a schermo intero, esci prima di mostrare la schermata finale.
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
  // Rimuove il player: così YouTube non mostra i video suggeriti.
  try { if (player && player.destroy) player.destroy(); } catch (_) {}
  player = null;

  cta.href = href;
  cta.textContent = BUTTON_TEXT;   // textContent, non innerHTML
  ytBox.classList.add("hidden");
  endBox.classList.remove("hidden");
  endBox.scrollIntoView({ behavior: "smooth", block: "center" });
}

let player = null;
var apiTimer = null;

function startYouTube() {
  intro.classList.add("hidden");
  ytBox.classList.remove("hidden");

  // Il player YouTube si carica solo ora (prima la pagina non contatta YouTube).
  // Se non si carica entro 6 secondi (rete lenta o bloccato), compare comunque il pulsante.
  apiTimer = setTimeout(showButton, 6000);

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  tag.onerror = () => { clearTimeout(apiTimer); showButton(); };
  document.head.appendChild(tag);
}

// Chiamata da YouTube quando l'API è pronta.
window.onYouTubeIframeAPIReady = function () {
  clearTimeout(apiTimer);
  player = new YT.Player("ytPlayer", {
    host: "https://www.youtube-nocookie.com",   // niente cookie di tracciamento
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 1,
      playsinline: 1,
      rel: 0,                  // a fine video, solo suggerimenti dello stesso canale
      modestbranding: 1,
      origin: location.origin
    },
    events: {
      onStateChange: (e) => { if (e.data === YT.PlayerState.ENDED) showButton(); },
      onError: showButton      // video non incorporabile o rimosso: il pulsante compare comunque
    }
  });
};

myVideo.addEventListener("ended", startYouTube);
