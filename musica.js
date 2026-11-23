// ============================================================
//  MÚSICA DE FUNDO (YouTube) — site e quiz
//  - começa no 1º toque (o navegador não permite som automático)
//  - lembra a posição entre as páginas (sessionStorage)
//  - pausa quando um vídeo do site liga o som
// ============================================================
(() => {
  const VIDEO_ID = "2Vv-BfVoq4g";
  const VOLUME = 55;
  const ss = {
    get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch {} }
  };
  const naIndex = !!document.querySelector(".fim");
  const veioDoQuiz = location.hash === "#final";
  const primeiraVez = ss.get("m_on") === null;

  // ---------- abertura: tela "toque para abrir" (só na 1ª vez, na página principal) ----------
  let liberarAbertura;
  window.aberturaLiberada = new Promise((ok) => (liberarAbertura = ok));
  let splash = null;
  if (naIndex && primeiraVez && !veioDoQuiz) {
    splash = document.createElement("button");
    splash.type = "button"; splash.className = "splash";
    splash.innerHTML = '<span class="splash-i">💌</span><span class="splash-t">Toque para abrir</span><small>com som 🎵</small>';
    document.body.append(splash);
    document.documentElement.style.overflow = "hidden";
  } else liberarAbertura();

  // ---------- player ----------
  const holder = document.createElement("div");
  holder.style.cssText = "position:fixed;bottom:0;right:0;width:2px;height:2px;opacity:0;pointer-events:none;overflow:hidden";
  const alvo = document.createElement("div"); holder.append(alvo); document.body.append(holder);

  let player = null, pronto = false, liberado = false, querPlay = false, pausadoPorVideo = false;
  const ligado = () => ss.get("m_on") !== "0";

  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "musica-btn"; btn.setAttribute("aria-label", "Música");
  document.body.append(btn);
  function atualizar() {
    const tocando = pronto && liberado && ligado() && !pausadoPorVideo;
    btn.textContent = tocando ? "🎵" : "🔇";
    btn.classList.toggle("off", !tocando);
    btn.title = tocando ? "Pausar a música" : "Tocar a música";
  }

  function aplicar() {
    if (!pronto) return;
    if (ligado() && !pausadoPorVideo) {
      if (liberado) { player.unMute(); player.setVolume(VOLUME); }
      player.playVideo();
    } else player.pauseVideo();
    atualizar();
  }

  function criar() {
    player = new YT.Player(alvo, {
      width: 200, height: 200, videoId: VIDEO_ID,
      playerVars: { playsinline: 1, controls: 0, disablekb: 1, rel: 0, loop: 1, playlist: VIDEO_ID,
        start: Math.floor(Number(ss.get("m_t")) || 0), ...(location.protocol.startsWith("http") ? { origin: location.origin } : {}) },
      events: {
        onReady: () => {
          pronto = true;
          player.setVolume(VOLUME);
          // toca mudo logo de início (permitido) e liga o som no 1º toque
          if (ligado() && !liberado) { player.mute(); player.playVideo(); }
          if (querPlay) aplicar();
          atualizar();
        },
        onError: () => { btn.hidden = true; }   // vídeo sem permissão de incorporar etc.: some o botão, o site segue normal
      }
    });
  }
  const api = document.createElement("script");
  api.src = "https://www.youtube.com/iframe_api"; api.async = true;
  api.onerror = () => { btn.hidden = true; };
  window.onYouTubeIframeAPIReady = criar;
  document.head.append(api);

  // posição guardada para continuar na outra página
  const salvar = () => { try { if (pronto && player.getCurrentTime) ss.set("m_t", String(Math.floor(player.getCurrentTime()))); } catch {} };
  setInterval(salvar, 2000);
  addEventListener("pagehide", salvar);

  // ---------- 1º toque libera o som ----------
  function liberar() {
    if (liberado) return;
    liberado = true;
    if (ss.get("m_on") === null) ss.set("m_on", "1");
    querPlay = true;
    aplicar();
    removeEventListener("pointerdown", liberar, true);
    removeEventListener("keydown", liberar, true);
  }
  addEventListener("pointerdown", liberar, true);
  addEventListener("keydown", liberar, true);
  if (splash) splash.addEventListener("click", () => {
    liberar();
    splash.classList.add("some");
    document.documentElement.style.overflow = "";
    setTimeout(() => splash.remove(), 700);
    liberarAbertura();
  });

  // ---------- botão liga/desliga ----------
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    ss.set("m_on", ligado() ? "0" : "1");
    liberado = true; querPlay = true;
    aplicar();
  });

  // ---------- vídeo do site com som: a música dá lugar ----------
  document.addEventListener("volumechange", (e) => {
    if (!(e.target instanceof HTMLVideoElement)) return;
    const comSom = [...document.querySelectorAll("video")].some((v) => !v.muted && !v.paused);
    if (comSom !== pausadoPorVideo) { pausadoPorVideo = comSom; aplicar(); }
  }, true);
  document.addEventListener("pause", (e) => {
    if (!(e.target instanceof HTMLVideoElement)) return;
    const comSom = [...document.querySelectorAll("video")].some((v) => !v.muted && !v.paused);
    if (!comSom && pausadoPorVideo) { pausadoPorVideo = false; aplicar(); }
  }, true);
  atualizar();
})();
