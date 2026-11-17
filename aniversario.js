// ============================================================
//  GRANDE FINAL: aniversário com fogos que escrevem no céu
// ============================================================
(() => {
  if (typeof ANIVERSARIO === "undefined") return;
  const $ = (s) => document.querySelector(s);
  const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sec = $("#aniversario"), ceu = $("#ceu");

  // ---------- conteúdo ----------
  $("#aniv-foto").src = "fotos/" + ANIVERSARIO.foto;
  const carta = $("#carta-texto");
  ANIVERSARIO.mensagem.trim().split(/\n\s*\n/).forEach((p, i) => {
    const el = document.createElement("p");
    el.textContent = p.trim();
    if (i === 0) el.className = "abre";
    carta.append(el);
  });
  $("#carta-assinatura").textContent = "— " + ANIVERSARIO.assinatura;

  const pObs = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("vis"); pObs.unobserve(e.target); }
  }), { threshold: .3 });
  document.querySelectorAll("#carta-texto p, .aniv-foto-box, .aniv-titulo, #carta-assinatura").forEach((n) => pObs.observe(n));

  // ---------- bolo: soprar as velas libera os fogos ----------
  const boloArea = $("#bolo-area"), micBtn = $("#soprar-mic");
  let apagou = false, micStream = null, micRaf = 0, micAc = null;
  function pararMic() {
    cancelAnimationFrame(micRaf); micStream?.getTracks().forEach((t) => t.stop()); micStream = null;
    micAc?.close().catch(() => {}); micAc = null;
  }
  function apagarVelas() {
    if (apagou) return; apagou = true;
    boloArea.classList.add("apagado");
    $("#bolo-dica").textContent = "🎉 que todos os seus pedidos se realizem!";
    micBtn.hidden = true; pararMic();
    document.dispatchEvent(new CustomEvent("velas-apagadas"));
  }
  $("#bolo").onclick = (ev) => { ev.stopPropagation(); apagarVelas(); };
  if (!navigator.mediaDevices?.getUserMedia) micBtn.hidden = true;
  micBtn.onclick = async (ev) => {
    ev.stopPropagation();
    if (micStream) return;
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micAc = new (window.AudioContext || window.webkitAudioContext)();
      const an = micAc.createAnalyser(); an.fftSize = 1024;
      micAc.createMediaStreamSource(micStream).connect(an);
      const buf = new Float32Array(an.fftSize); let forte = 0;
      micBtn.textContent = "🎤 pode soprar!"; micBtn.classList.add("ouvindo");
      const ouvir = () => {
        an.getFloatTimeDomainData(buf);
        let s = 0; for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
        const rms = Math.sqrt(s / buf.length);
        forte = rms > .12 ? forte + 1 : Math.max(0, forte - 1);   // sopro = som forte por alguns quadros seguidos
        if (forte > 6) { apagarVelas(); return; }
        micRaf = requestAnimationFrame(ouvir);
      };
      ouvir();
      setTimeout(() => { if (!apagou && micStream) { pararMic(); micBtn.textContent = "🎤 tentar de novo"; micBtn.classList.remove("ouvindo"); } }, 20000);
    } catch {
      pararMic(); micBtn.textContent = "sem microfone 😅 toque no bolo";
    }
  };

  // ---------- envelope: abre e mostra a carta ----------
  const envBtn = $("#env-btn"), carta2 = $("#carta");
  $("#env-para").textContent = "Para: " + PESSOA.nome.split(" ")[0] + " 💌";
  envBtn.onclick = (ev) => {
    ev.stopPropagation();
    if (envBtn.classList.contains("aberto")) return;
    envBtn.classList.add("aberto"); envBtn.setAttribute("aria-expanded", "true");
    setTimeout(() => {
      $("#envelope").classList.add("sumiu");
      carta2.hidden = false;
      requestAnimationFrame(() => carta2.classList.add("aberta"));
      setTimeout(() => { $("#envelope").hidden = true; }, 600);
    }, calmo ? 0 : 1000);
  };

  if (calmo) { $("#som-fogos").hidden = true; $(".olhe").hidden = true; return; }

  // ---------- som (só depois que a pessoa tocar no botão) ----------
  let audio = null, somLigado = false;
  const btnSom = $("#som-fogos");
  btnSom.setAttribute("aria-pressed", "false");
  btnSom.onclick = (ev) => {
    ev.stopPropagation();
    if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
    audio.resume();
    somLigado = !somLigado;
    btnSom.setAttribute("aria-pressed", String(somLigado));
    btnSom.textContent = somLigado ? "🔊 som dos fogos ligado" : "🔈 ligar o som dos fogos";
    if (somLigado) { lancar(); lancar(); }
  };
  function ruido(dur) {
    const b = audio.createBuffer(1, audio.sampleRate * dur, audio.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = audio.createBufferSource(); s.buffer = b; return s;
  }
  function somEstouro(forte = false) {
    if (!somLigado || !audio) return;
    const t = audio.currentTime, s = ruido(forte ? 2.2 : 1.4);
    const f = audio.createBiquadFilter(); f.type = "lowpass"; f.frequency.setValueAtTime(forte ? 1800 : 2600, t); f.frequency.exponentialRampToValueAtTime(120, t + 1.2);
    const g = audio.createGain(); g.gain.setValueAtTime(forte ? .9 : .5, t); g.gain.exponentialRampToValueAtTime(.001, t + (forte ? 2 : 1.3));
    s.connect(f).connect(g).connect(audio.destination); s.start(t);
    // estalinhos
    for (let i = 0; i < (forte ? 14 : 6); i++) {
      const ti = t + .25 + Math.random() * .9, c = ruido(.04), gc = audio.createGain();
      gc.gain.setValueAtTime(.12 + Math.random() * .1, ti); gc.gain.exponentialRampToValueAtTime(.001, ti + .04);
      c.connect(gc).connect(audio.destination); c.start(ti);
    }
  }
  function somAssobio(dur) {
    if (!somLigado || !audio) return;
    const t = audio.currentTime, o = audio.createOscillator(), g = audio.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(900 + Math.random() * 300, t); o.frequency.exponentialRampToValueAtTime(2200, t + dur);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.05, t + .1); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(audio.destination); o.start(t); o.stop(t + dur);
  }

  // ---------- fogos ----------
  const cv = $("#fogos"), cx = cv.getContext("2d");
  let W = 0, H = 0, dpr = 1;
  function tam() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener("resize", tam);

  const CORES = ["#ff3b6b", "#ffd23f", "#3bf7ff", "#a66bff", "#5bff8a", "#ff8a3b", "#ffffff", "#ff5ef1"];
  const cor = () => CORES[(Math.random() * CORES.length) | 0];
  const frases = ANIVERSARIO.fogosEscrevem || [ANIVERSARIO.nomeNosFogos || "Feliz aniversário"];
  let foguetes = [], faiscas = [], ativo = false, ceuVisivel = false, escrevendo = false, liberado = false;
  let proxFrase = 0, ultimoTexto = -1e9, ultimoFoguete = 0;
  const cachePts = {};

  // pontos de uma frase, desenhada num canvas escondido
  function pontosDoTexto(texto) {
    const chave = texto + W + "x" + H;
    if (cachePts[chave]) return cachePts[chave];
    const off = document.createElement("canvas"), o = off.getContext("2d");
    const larg = Math.min(W * .92, 1000);
    let fs = 200; o.font = `${fs}px Lobster, "Playfair Display", serif`;
    fs = Math.floor(fs * larg / o.measureText(texto).width);
    fs = Math.min(fs, H * .26);
    off.width = Math.ceil(larg) + 40; off.height = Math.ceil(fs * 1.5);
    o.font = `${fs}px Lobster, "Playfair Display", serif`;
    o.textAlign = "center"; o.textBaseline = "middle"; o.fillStyle = "#fff";
    o.fillText(texto, off.width / 2, off.height / 2);
    const img = o.getImageData(0, 0, off.width, off.height).data;
    // densidade: mais pontos no celular para o nome ficar legível, sem pesar
    const passo = Math.max(3, Math.round(fs / 26)), pts = [];
    for (let y = 0; y < off.height; y += passo)
      for (let x = 0; x < off.width; x += passo)
        if (img[(y * off.width + x) * 4 + 3] > 140) pts.push([x - off.width / 2, y - off.height / 2]);
    return (cachePts[chave] = pts);
  }

  function lancar(texto = null) {
    const x = texto ? W / 2 : W * (.1 + Math.random() * .8);
    const alvoY = texto ? H * .46 : H * (.1 + Math.random() * .38);
    const vy = -(Math.sqrt(2 * .12 * (H - alvoY)) + .3);
    foguetes.push({ x, y: H + 10, vx: texto ? 0 : (Math.random() - .5) * 1.6, vy, alvoY, texto, cor: texto ? "#ffd23f" : cor() });
    somAssobio(Math.min(1.6, Math.abs(vy) / 7));
  }

  function explodir(f) {
    if (f.texto) {
      escrevendo = true;
      const pts = pontosDoTexto(f.texto);
      const paleta = [["#ffd23f", "#fff3b0"], ["#ff3b6b", "#ff9ab3"], ["#3bf7ff", "#c6fbff"], ["#a66bff", "#e0c8ff"]][(proxFrase - 1 + 4) % 4];
      pts.forEach(([px, py]) => faiscas.push({
        x: f.x, y: f.y, tx: f.x + px, ty: f.y + py, modo: "texto",
        t: 0, atraso: Math.random() * 12, vida: 300 + Math.random() * 30,
        cor: Math.random() < .7 ? paleta[0] : paleta[1], r: W < 600 ? 1.7 : 2.3,
      }));
      for (let i = 0; i < 160; i++) bola(f.x, f.y, cor(), 9);
      // salva de fogos em volta do nome
      setTimeout(() => { for (let i = 0; i < 4; i++) setTimeout(() => lancar(), i * 180); }, 900);
      setTimeout(() => { escrevendo = false; }, 5200);
      somEstouro(true);
      return;
    }
    somEstouro();
    const tipo = Math.random(), c = f.cor, n = 90 + (Math.random() * 70 | 0);
    if (tipo < .22) { // coração
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2, k = .2 + Math.random() * .02;
        const hx = 16 * Math.sin(t) ** 3, hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        faiscas.push({ x: f.x, y: f.y, vx: hx * k, vy: hy * k, vida: 95, t: 0, cor: Math.random() < .8 ? "#ff3b6b" : "#ff9ab3", r: 2.2, g: .018 });
      }
    } else if (tipo < .38) { // anel duplo
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2, s = i % 2 ? 5.5 : 3;
        faiscas.push({ x: f.x, y: f.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, vida: 85, t: 0, cor: i % 2 ? c : "#ffffff", r: 2, g: .04 });
      }
    } else if (tipo < .52) { // chuva dourada (salgueiro)
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, s = Math.random() * 4;
        faiscas.push({ x: f.x, y: f.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, vida: 150 + Math.random() * 40, t: 0, cor: "#ffcf5a", r: 1.6, g: .035, rastro: true });
      }
    } else for (let i = 0; i < n; i++) bola(f.x, f.y, tipo < .76 ? c : cor(), 4 + Math.random() * 3);
  }
  function bola(x, y, c, v) {
    const a = Math.random() * Math.PI * 2, s = Math.random() * v;
    faiscas.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, vida: 70 + Math.random() * 40, t: 0, cor: c, r: 1.8 + Math.random(), g: .05, pisca: Math.random() < .3 });
  }

  function quadro(ts) {
    if (!ativo) return;
    cx.globalCompositeOperation = "destination-out";
    cx.fillStyle = "rgba(0,0,0,.2)"; cx.fillRect(0, 0, W, H);
    cx.globalCompositeOperation = "lighter";

    // ritmo: mais fogos no céu, menos enquanto o nome está escrito (pra ler bem)
    const intervalo = escrevendo ? 900 : ceuVisivel ? 420 : 750;
    if (liberado && ts - ultimoFoguete > intervalo + Math.random() * 400) {
      lancar(); if (!escrevendo && Math.random() < .35) lancar();
      ultimoFoguete = ts;
    }
    // uma frase a cada ~8s, só enquanto o "céu" está na tela
    if (liberado && ceuVisivel && !escrevendo && ts - ultimoTexto > 8000) {
      lancar(frases[proxFrase % frases.length]); proxFrase++; ultimoTexto = ts;
    }

    foguetes = foguetes.filter((f) => {
      f.x += f.vx; f.y += f.vy; f.vy += .12;
      cx.fillStyle = f.cor; cx.beginPath(); cx.arc(f.x, f.y, f.texto ? 3.5 : 2.4, 0, 7); cx.fill();
      faiscas.push({ x: f.x, y: f.y, vx: (Math.random() - .5) * .6, vy: Math.random() * .8, vida: 22, t: 0, cor: "#ffcf8a", r: 1.2, g: .02 });
      if (f.vy >= 0 || f.y <= f.alvoY) { explodir(f); return false; }
      return true;
    });

    const novas = [];
    faiscas = faiscas.filter((p) => {
      p.t++;
      if (p.modo === "texto") {
        const t = p.t - p.atraso;
        if (t < 0) return true;
        let px, py;
        if (t < 50) { const k = 1 - Math.pow(1 - t / 50, 3); px = p.x + (p.tx - p.x) * k; py = p.y + (p.ty - p.y) * k; }
        else if (t < p.vida - 70) { px = p.tx + (Math.random() - .5) * .9; py = p.ty + (Math.random() - .5) * .9; }
        else { p.vy2 = (p.vy2 || 0) + .04; p.ty += p.vy2; px = p.tx; py = p.ty; }
        const a = t > p.vida - 70 ? (p.vida - t) / 70 : 1;
        cx.globalAlpha = Math.max(0, a) * (.7 + Math.random() * .3);
        cx.fillStyle = p.cor; cx.beginPath(); cx.arc(px, py, p.r, 0, 7); cx.fill();
        cx.globalAlpha = 1;
        return t < p.vida;
      }
      p.vx *= .985; p.vy = p.vy * .985 + p.g; p.x += p.vx; p.y += p.vy;
      if (p.rastro && p.t % 3 === 0) novas.push({ x: p.x, y: p.y, vx: 0, vy: .3, vida: 30, t: 0, cor: "#a8742a", r: 1, g: .01 });
      const a = 1 - p.t / p.vida;
      if (p.pisca && Math.random() < .4) return p.t < p.vida;
      cx.globalAlpha = Math.max(0, a); cx.fillStyle = p.cor;
      cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill(); cx.globalAlpha = 1;
      return p.t < p.vida;
    });
    faiscas.push(...novas);
    requestAnimationFrame(quadro);
  }

  // só solta fogos enquanto a seção está na tela (economiza bateria)
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !ativo) {
      ativo = true; tam();
      // garante a fonte carregada antes de "escrever" com ela
      document.fonts?.load("100px Lobster");
      requestAnimationFrame(quadro);
    } else if (!e.isIntersecting) ativo = false;
  }, { threshold: .02 }).observe(sec);

  new IntersectionObserver(([e]) => { ceuVisivel = e.isIntersecting; }, { threshold: .55 }).observe(ceu);

  // velas apagadas: começa o show (salva de fogos e, logo depois, o nome no céu)
  document.addEventListener("velas-apagadas", () => {
    liberado = true; ceu.classList.add("liberado"); sec.classList.add("liberado");
    for (let i = 0; i < 8; i++) setTimeout(() => lancar(), 250 + i * 160);
    ultimoTexto = performance.now() - 5200;
  });

  // toque na tela = mais fogos (depois de soprar as velas)
  sec.addEventListener("click", (ev) => {
    if (!liberado || ev.target.closest("img, button, a, .carta, .envelope")) return;
    lancar(); lancar(); lancar();
  });
})();


// ============================================================
//  Fogos DENTRO da foto, subindo do horizonte (linha do mar)
// ============================================================
(() => {
  if (typeof ANIVERSARIO === "undefined") return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.getElementById("fogos-foto"); if (!cv) return;
  const cx = cv.getContext("2d");
  const HOR = ANIVERSARIO.horizonte || .53;
  const CORES = ["#ff3b6b", "#ffd23f", "#3bf7ff", "#a66bff", "#5bff8a", "#ff8a3b", "#ffffff", "#ff5ef1"];
  const cor = () => CORES[(Math.random() * CORES.length) | 0];
  let W = 0, H = 0, ativo = false, fog = [], fx = [], flashes = [], ultimo = 0;

  function tam() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener("resize", () => ativo && tam());

  function lancar() {
    const hy = H * HOR, alvo = H * (.06 + Math.random() * .24);
    // evita estourar em cima do rosto dele (lado direito, perto do horizonte)
    // nunca sobe na frente dele (ele está à direita da foto)
    let x = W * (.06 + Math.random() * .88);
    if (x > W * .6 && x < W * .88) x = Math.random() < .75 ? W * (.06 + Math.random() * .5) : W * (.89 + Math.random() * .06);
    const vy = -Math.sqrt(2 * .06 * (hy - alvo));
    fog.push({ x, y: hy, vy, vx: (Math.random() - .5) * .4, alvo, c: cor() });
  }
  function estourar(f) {
    const esc = W / 420, n = 55 + (Math.random() * 40 | 0), tipo = Math.random();
    flashes.push({ x: f.x, y: f.y, c: f.c, t: 0 });
    for (let i = 0; i < n; i++) {
      let vx, vy, c = tipo < .5 ? f.c : cor();
      if (tipo < .18) { // coração
        const t = (i / n) * Math.PI * 2, k = .11 * esc;
        vx = 16 * Math.sin(t) ** 3 * k; vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * k; c = "#ff3b6b";
      } else if (tipo < .32) { // chuva dourada
        const a = Math.random() * Math.PI * 2, s = Math.random() * 2.2 * esc; vx = Math.cos(a) * s; vy = Math.sin(a) * s; c = "#ffcf5a";
      } else { const a = Math.random() * Math.PI * 2, s = (1 + Math.random() * 2.2) * esc; vx = Math.cos(a) * s; vy = Math.sin(a) * s; }
      fx.push({ x: f.x, y: f.y, vx, vy, t: 0, vida: (tipo >= .18 && tipo < .32 ? 110 : 70) + Math.random() * 30, c, r: (1 + Math.random() * .8) * Math.max(.8, esc), g: .025 * esc });
    }
  }
  function quadro(ts) {
    if (!ativo) return;
    // rastro: apaga aos poucos só a camada de fogos, a foto fica intacta embaixo
    cx.globalCompositeOperation = "destination-out";
    cx.fillStyle = "rgba(0,0,0,.18)"; cx.fillRect(0, 0, W, H);
    cx.globalCompositeOperation = "lighter";
    if (ts - ultimo > 450 + Math.random() * 700) { lancar(); if (Math.random() < .3) lancar(); ultimo = ts; }

    // clarão no céu a cada estouro
    flashes = flashes.filter((f) => {
      f.t++; const a = (1 - f.t / 18) * .22; if (a <= 0) return false;
      const g = cx.createRadialGradient(f.x, f.y, 0, f.x, f.y, W * .45);
      g.addColorStop(0, f.c); g.addColorStop(1, "transparent");
      cx.globalAlpha = a; cx.fillStyle = g; cx.fillRect(0, 0, W, H * HOR); cx.globalAlpha = 1;
      return true;
    });
    fog = fog.filter((f) => {
      f.x += f.vx; f.y += f.vy; f.vy += .06;
      cx.fillStyle = "#ffe2a8"; cx.beginPath(); cx.arc(f.x, f.y, 1.5, 0, 7); cx.fill();
      if (f.vy >= 0 || f.y <= f.alvo) { estourar(f); return false; }
      return true;
    });
    const hy = H * HOR;
    fx = fx.filter((p) => {
      p.t++; p.vx *= .982; p.vy = p.vy * .982 + p.g; p.x += p.vx; p.y += p.vy;
      if (p.y > hy) return false; // some ao "cair no mar"
      const a = Math.max(0, 1 - p.t / p.vida);
      cx.globalAlpha = a; cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill();
      // reflexo bem suave na água, logo abaixo do horizonte
      const ry = 2 * hy - p.y;
      if (ry < hy + H * .045) { cx.globalAlpha = a * .18; cx.fillRect(p.x - p.r, ry, p.r * 2, p.r * 2.5); }
      cx.globalAlpha = 1;
      return p.t < p.vida;
    });
    requestAnimationFrame(quadro);
  }
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !ativo) { ativo = true; tam(); lancar(); lancar(); requestAnimationFrame(quadro); }
    else if (!e.isIntersecting) ativo = false;
  }, { threshold: .1 }).observe(cv);
})();
