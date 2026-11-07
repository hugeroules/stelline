/* ==== DA MODIFICARE (solo questi tre valori) ==== */

// ID del video YouTube che parte dopo il tuo (la parte dopo "youtu.be/", senza "?si=...")
const YT_VIDEO_ID = "HDaaoQ6h_Xc";

// Dove porta il pulsante a fine video. Deve iniziare con https://
// Per ora rimanda al video stesso su YouTube: sostituiscilo con il link che vuoi.
const BUTTON_URL = "https://www.youtube.com/watch?v=" + YT_VIDEO_ID;

// Testo del pulsante
const BUTTON_TEXT = "Clicca qui per aprire il link";

/* ================================================ */

"use strict";

const $ = (id) => document.getElementById(id);
const myVideo = $("myVideo");
const intro = $("intro");
const ytBox = $("yt");
const cta = $("cta");

// Sicurezza: il pulsante accetta solo indirizzi https, mai "javascript:" o simili.
function safeUrl(u) {
  try {
    const url = new URL(u);
    return url.protocol === "https:" ? url.href : null;
  } catch (_) { return null; }
}

function showButton() {
  const href = safeUrl(BUTTON_URL);
  if (!href) return;
  cta.href = href;
  cta.textContent = BUTTON_TEXT;   // textContent, non innerHTML
  cta.classList.remove("hidden");
  cta.scrollIntoView({ behavior: "smooth", block: "center" });
}

let player = null;
let apiTimer = null;

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
