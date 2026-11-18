const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- intro ----------
function digitar(alvo, texto, ms = 55) {
  return new Promise((ok) => {
    if (calmo) { alvo.textContent = texto; alvo.classList.add("fim-digitar"); return ok(); }
    let i = 0; alvo.textContent = "";
    const t = setInterval(() => { alvo.textContent = texto.slice(0, ++i); if (i >= texto.length) { clearInterval(t); alvo.classList.add("fim-digitar"); ok(); } }, ms);
  });
}
$("#nome").textContent = PESSOA.nome;
if (PESSOA.esposa) $("#casal").textContent = "& " + PESSOA.esposa;
$("#assinatura").textContent = [PESSOA.nome.split(" ")[0], PESSOA.esposa?.split(" ")[0], PESSOA.filha].filter(Boolean).join(", ").replace(/, ([^,]*)$/, " e $1");
const primeiroAno = CAPITULOS.find((c) => c.ano)?.ano;
if (primeiroAno) { const anos = new Date().getFullYear() - primeiroAno; $("#desde").textContent = `${anos} ${typeof FRASE_ABERTURA !== "undefined" ? FRASE_ABERTURA : "anos de história"} ❤️`; }
if (typeof FRASE_FINAL !== "undefined") $("#frase-final").textContent = FRASE_FINAL;
digitar($("#maquina"), primeiroAno ? `Em ${primeiroAno}, começou a história de…` : "Esta é a história de…").then(() => {
  $("#nome").classList.add("on");
  setTimeout(() => $("#casal").classList.add("on"), 700);
  setTimeout(() => $("#desde").classList.add("on"), 1400);
});

// ---------- aniversário: contagem regressiva / "hoje é o seu dia" ----------
if (PESSOA.aniversario) {
  const partes = PESSOA.aniversario.split("-").map(Number);
  const [a, m, d] = partes.length === 3 ? partes : [null, ...partes];   // aceita "MM-DD" ou "AAAA-MM-DD"
  const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  const h = new Date(); const hoje = new Date(h.getFullYear(), h.getMonth(), h.getDate());
  const desteAno = new Date(h.getFullYear(), m - 1, d);
  const desde = Math.round((hoje - desteAno) / 864e5);       // dias desde o aniversário deste ano (negativo = ainda vai chegar)
  const idade = a ? h.getFullYear() - a : null;
  const data = `${d} de ${meses[m - 1]}`;
  let txt;
  if (desde === 0) {
    txt = `🎉 Hoje é o seu dia, meu amor!${idade ? ` ${idade} anos!` : ""}`;
    document.body.classList.add("dia-do-aniversario");
  } else if (desde > 0 && desde <= 30) {
    txt = `🎂 ${data} · feliz aniversário!`;                  // logo depois do dia, não vira "faltam 360 dias"
  } else {
    const prox = desde > 0 ? new Date(h.getFullYear() + 1, m - 1, d) : desteAno;
    const dias = Math.round((prox - hoje) / 864e5);
    const anos = a ? prox.getFullYear() - a : null;
    txt = dias === 1 ? `🎂 ${data} · é amanhã!` : `🎂 ${data} · faltam ${dias} dias${anos ? ` para os ${anos} anos` : " para o seu aniversário"}`;
  }
  $("#aniv").textContent = txt;
  $("#aniv").hidden = false;
  if (desde >= 0 && desde <= 30) $("#dica-surpresa").hidden = false;   // no dia (e depois): avisa que tem surpresa
}

// ---------- helpers de mídia ----------
// fotos/p/ = versão leve (640px) para miniaturas e fundos; fotos/ = original para ver ampliada
const leve = (nome) => "fotos/p/" + nome;
const cheia = (nome) => "fotos/" + nome;
let galeriaAtual = [];  // fotos do capítulo sendo montado (para navegar na foto ampliada)
function foto(nome, sizes = "(max-width:600px) 50vw, 300px", cls = "", alt = "") {
  const img = el("img", cls);
  img.src = leve(nome);
  img.srcset = `${leve(nome)} 640w, ${cheia(nome)} 1400w`;
  img.sizes = sizes;
  img.alt = alt; img.loading = "lazy"; img.decoding = "async";
  const lista = galeriaAtual, i = lista.indexOf(nome);
  img.onclick = () => abrirGaleria(lista.length ? lista : [nome], Math.max(0, i));
  return img;
}
function polaroid(nome, i, legenda = "", sizes) {
  const p = el("figure", "polaroid");
  const r = ((i * 37) % 11) - 5; // rotação estável entre -5 e 5
  p.style.setProperty("--r", r + "deg");
  p.style.setProperty("--fita", ((i % 3) - 1) * 5 + "deg");
  const f = el("div", "foto"); f.append(foto(nome, sizes || "(max-width:600px) 45vw, 180px", "", legenda)); p.append(f);
  p.append(el("figcaption", "legenda", legenda));
  return p;
}
function mutar(v) {
  v.muted = true;
  const b = v.parentNode.querySelector(".som");
  if (b) { b.textContent = "🔇"; b.setAttribute("aria-label", "Ligar som"); }
}
function video(nome) {
  const v = el("video", "video");
  // preload "none": só baixa quando o vídeo aparece na tela (economiza 4G)
  Object.assign(v, { src: "midia/" + nome, poster: "midia/" + nome.replace(/\.mp4$/, ".jpg"), muted: true, loop: true, playsInline: true, preload: "none" });
  v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
  // tocar no vídeo liga/desliga o som (só um com som por vez)
  const wrap = el("div", "video-wrap"); const som = el("button", "som", "🔇");
  som.setAttribute("aria-label", "Ligar som");
  const alternar = () => {
    const ligar = v.muted;
    $$("video").forEach(mutar);
    if (ligar) { v.muted = false; som.textContent = "🔊"; som.setAttribute("aria-label", "Desligar som"); v.play().catch(() => {}); }
  };
  v.onclick = alternar; som.onclick = alternar;
  wrap.append(v, som);
  // respeita o formato original do vídeo (deitado ou em pé), sem cortar
  const pi = new Image();
  pi.onload = () => {
    v.style.setProperty("--ar", `${pi.naturalWidth} / ${pi.naturalHeight}`);
    if (pi.naturalWidth > pi.naturalHeight * 1.05) { wrap.classList.add("deitado"); setTimeout(() => wrap.parentElement?.classList.add("deitado")); }
  };
  pi.src = v.poster;
  return wrap;
}

// ---------- layouts ----------
const LAYOUTS = {
  mural(c, box) {
    const [prim, ...resto] = c.fotos;
    const m = el("div", "mural");
    const g = polaroid(prim, 0, c.titulo, "min(420px, 88vw)"); g.classList.add("grande"); m.append(g);
    resto.forEach((f, i) => m.append(polaroid(f, i + 1)));
    box.append(m);
  },
  mosaico(c, box) {
    const m = el("div", "mosaico");
    c.fotos.forEach((f, i) => {
      const grande = i % 7 === 0;
      const cel = el("div", "cel" + (grande ? " g" : i % 5 === 3 ? " alta" : ""));
      cel.style.setProperty("--d", (i % 6) * 70 + "ms");
      cel.append(foto(f, grande ? "(max-width:600px) 100vw, 440px" : "(max-width:600px) 50vw, 220px")); m.append(cel);
    });
    box.append(m);
  },
  carrossel(c, box) {
    const w = el("div", "carrossel-wrap");
    const t = el("div", "carrossel"); t.tabIndex = 0; t.setAttribute("aria-label", "Fotos — deslize para o lado");
    c.fotos.forEach((f) => { const s = el("div", "slide"); s.append(foto(f, "min(70vw, 420px)")); t.append(s); });
    const nav = (d) => t.scrollBy({ left: d * t.clientWidth * .8, behavior: calmo ? "auto" : "smooth" });
    const prev = el("button", "nav prev", "‹"), next = el("button", "nav next", "›");
    prev.setAttribute("aria-label", "Anterior"); next.setAttribute("aria-label", "Próxima");
    prev.onclick = () => nav(-1); next.onclick = () => nav(1);
    w.append(t, prev, next, el("p", "dica", "deslize →"));
    box.append(w);
  },
  telacheia(c, box) {
    c.fotos.forEach((f) => {
      const s = el("div", "tela");
      const bg = el("div", "tela-bg"); bg.style.backgroundImage = `url("${leve(f)}")`;
      const img = foto(f, "100vw"); s.append(bg, img); box.append(s);
    });
  },
  videos() {},
  pedido(c, box) {
    const p = el("div", "pedido");
    const caixa = el("button", "caixa"); caixa.type = "button"; caixa.setAttribute("aria-label", "Abrir a caixinha da aliança");
    const base = el("span", "caixa-base"), almofada = el("span", "caixa-almofada");
    almofada.append(el("span", "caixa-anel", "💍")); base.append(almofada);
    caixa.append(el("span", "caixa-brilho"), base, el("span", "caixa-tampa"));
    const dica = el("p", "pedido-dica", "toque na caixinha…");
    const revela = el("div", "pedido-revela"); revela.hidden = true;
    (c.videos || []).forEach((n) => { const b = el("div", "video-box pedido-video"); b.append(video(n)); revela.append(b); });
    const sim = el("p", "disse-sim", "Ela disse SIM! 💍");
    revela.append(sim);
    caixa.onclick = () => {
      if (p.classList.contains("aberta")) return;
      p.classList.add("aberta"); dica.textContent = "✨";
      const r = caixa.getBoundingClientRect(); explodirEm(r.left + r.width / 2, r.top + r.height / 3, 24);
      setTimeout(() => {
        revela.hidden = false;
        requestAnimationFrame(() => { revela.classList.add("on"); $$(".video-box", revela).forEach((b) => b.classList.add("vis")); });
        $(".video-box", revela)?.scrollIntoView({ behavior: calmo ? "auto" : "smooth", block: "center" });
      }, calmo ? 0 : 1300);
      setTimeout(() => {
        sim.classList.add("on");
        const s = sim.getBoundingClientRect(); explodirEm(s.left + s.width / 2, s.top + s.height / 2, 40);
      }, calmo ? 0 : 2900);
    };
    p.append(caixa, dica, revela); box.append(p);
    return true; // os vídeos já foram colocados aqui dentro
  },
  raspadinha(c, box) {
    const [prim, ...resto] = c.fotos;
    const r = el("div", "raspa-box");
    const card = el("div", "raspa");
    const img = foto(prim, "min(360px, 78vw)", "", "Foto surpresa"); img.loading = "eager";
    const cvs = el("canvas", "raspa-cv"); cvs.setAttribute("role", "img"); cvs.setAttribute("aria-label", "Raspadinha: raspe para revelar a foto");
    const msg = el("p", "raspa-msg", c.revelacao || "");
    const pular = el("button", "raspa-pular", "revelar sem raspar"); pular.type = "button";
    card.append(img, cvs);
    r.append(card, el("p", "raspa-dica", "raspe com o dedo ✨"), msg, pular);
    box.append(r);
    if (resto.length) { const m = el("div", "mini"); resto.forEach((f) => m.append(foto(f, "min(44vw, 300px)"))); box.append(m); }
    const revelar = iniciarRaspadinha(card, cvs, () => {
      r.classList.add("revelado");
      const b = card.getBoundingClientRect(); explodirEm(b.left + b.width / 2, b.top + b.height / 2, 50);
    });
    pular.onclick = revelar;
  },
  destaque(c, box) {
    const [prim, ...resto] = c.fotos;
    const d = el("div", "destaque"); d.append(foto(prim, "min(640px, 100vw)")); box.append(d);
    if (resto.length) { const m = el("div", "mini"); resto.forEach((f) => m.append(foto(f, "min(44vw, 300px)"))); box.append(m); }
  },
};

// ---------- raspadinha ----------
function iniciarRaspadinha(card, cvs, aoRevelar) {
  const ctx = cvs.getContext("2d");
  let feito = false, riscos = 0, desenhando = false, ultimo = null;
  function pintar() {
    const w = card.clientWidth, h = card.clientHeight; if (!w || !h || feito) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cvs.width = w * dpr; cvs.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    const g = ctx.createLinearGradient(0, 0, w, h);
    [["#cfcfd4", 0], ["#f7f7fa", .22], ["#b9b9c2", .45], ["#efeff3", .7], ["#a9a9b3", 1]].forEach(([c, o]) => g.addColorStop(o, c));
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) { ctx.fillStyle = `rgba(255,255,255,${Math.random() * .7})`; ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    ctx.textAlign = "center"; ctx.fillStyle = "#6d4c7d";
    ctx.font = `700 ${Math.round(w / 7)}px Caveat, cursive`; ctx.fillText("Raspe aqui", w / 2, h / 2 - w / 16);
    ctx.font = `${Math.round(w / 6)}px serif`; ctx.fillText("💗", w / 2, h / 2 + w / 6);
  }
  new ResizeObserver(() => { if (!riscos) pintar(); }).observe(card);
  document.fonts?.ready.then(() => { if (!riscos) pintar(); });
  const pos = (e) => { const b = cvs.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  function riscar(a, b) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = Math.max(30, card.clientWidth / 8); ctx.lineCap = ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  }
  function checar() {
    const d = ctx.getImageData(0, 0, cvs.width, cvs.height).data; let limpo = 0, total = 0;
    for (let i = 3; i < d.length; i += 4 * 29) { total++; if (d[i] < 40) limpo++; }
    if (total && limpo / total > .45) revelar();
  }
  cvs.addEventListener("pointerdown", (e) => {
    if (feito) return; desenhando = true; cvs.setPointerCapture(e.pointerId);
    ultimo = pos(e); riscar(ultimo, [ultimo[0] + .1, ultimo[1]]); riscos++;
  });
  cvs.addEventListener("pointermove", (e) => {
    if (!desenhando || feito) return;
    const p = pos(e); riscar(ultimo, p); ultimo = p;
    if (++riscos % 12 === 0) checar();
  });
  const parar = () => { if (desenhando) { desenhando = false; checar(); } };
  cvs.addEventListener("pointerup", parar); cvs.addEventListener("pointercancel", parar);
  function revelar() {
    if (feito) return; feito = true;
    cvs.classList.add("sumir"); setTimeout(() => cvs.remove(), 900);
    aoRevelar();
  }
  return revelar;
}

// ---------- antes & depois (arrastar para comparar) ----------
function antesDepois([antes, depois]) {
  const box = el("div", "ad-box");
  const w = el("div", "ad");
  const b = el("img", "ad-img"); b.src = leve(depois); b.alt = "Hoje"; b.loading = "lazy";
  const topo = el("div", "ad-topo"); const a = el("img", "ad-img"); a.src = leve(antes); a.alt = String(primeiroAno || "Antes"); a.loading = "lazy"; topo.append(a);
  const linha = el("div", "ad-linha"); const alca = el("button", "ad-alca", "‹ ›"); alca.type = "button";
  alca.setAttribute("aria-label", "Comparar antes e hoje: use as setas do teclado"); linha.append(alca);
  w.append(b, topo, linha, el("span", "ad-tag ad-esq", String(primeiroAno || "antes")), el("span", "ad-tag ad-dir", "hoje"));
  let p = 50;
  const set = (v) => { p = Math.max(0, Math.min(100, v)); w.style.setProperty("--p", p + "%"); };
  set(50);
  const deX = (e) => { const r = w.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); };
  let arrastando = false;
  w.addEventListener("pointerdown", (e) => { arrastando = true; w.classList.remove("demo"); if (e.pointerType === "mouse") deX(e); });
  w.addEventListener("pointermove", (e) => { if (arrastando) deX(e); });
  ["pointerup", "pointercancel", "pointerleave"].forEach((t) => w.addEventListener(t, () => { arrastando = false; }));
  alca.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { set(p - 5); e.preventDefault(); }
    if (e.key === "ArrowRight") { set(p + 5); e.preventDefault(); }
  });
  // quando aparece, a linha "balança" uma vez para mostrar que dá pra arrastar
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { if (!calmo) w.classList.add("demo"); o.disconnect(); } }, { threshold: .6 }).observe(w);
  box.append(el("p", "ad-titulo", `${primeiroAno || "antes"} → hoje`), w, el("p", "ad-dica", "arraste para os lados ↔"));
  return box;
}

// ---------- monta capítulos ----------
const historia = $("#historia");
let anoCorrente = primeiroAno || "", nParte = 0, menuAtual = "";
// tela de abertura de um capítulo grande (Capítulo I, II… e o Epílogo)
function aberturaParte(p, foto, ano) {
  const s = el("section", "parte");
  s.id = p.id || "parte-" + (++nParte);
  s.dataset.titulo = p.titulo; s.dataset.numero = p.numero;
  s.dataset.foto = foto || ""; s.dataset.ano = ano || ""; s.dataset.menu = s.id;
  const inn = el("div", "parte-in");
  inn.append(el("p", "parte-num", p.numero), el("span", "parte-orn", "✦"), el("h2", "parte-titulo", p.titulo));
  if (p.subtitulo) inn.append(el("p", "parte-sub", p.subtitulo));
  s.append(inn);
  return s;
}
const fotoDe = (c) => { const v0 = (c.videos || [])[0]; return c.fotos[0] ? leve(c.fotos[0]) : v0 ? "midia/" + v0.replace(/\.mp4$/, ".jpg") : ""; };
CAPITULOS.forEach((c, i) => {
  if (c.ano) anoCorrente = c.ano;
  if (c.parte) historia.append(aberturaParte(c.parte, fotoDe(c), c.ano));
  const cap = el("section", "capitulo layout-" + c.layout + (c.titulo ? "" : " continuacao"));
  cap.id = "cap-" + (i + 1);
  cap.dataset.titulo = c.titulo || "";
  if (c.titulo) menuAtual = cap.id;
  cap.dataset.menu = menuAtual;
  galeriaAtual = c.fotos;
  cap.dataset.ano = c.ano || "";
  cap.dataset.foto = fotoDe(c);

  if (c.titulo) {
    const ab = el("header", "abertura");
    if (c.ano) ab.append(el("div", "marco", c.ano));
    ab.append(el("h2", "", c.titulo));
    if (c.frase) ab.append(el("p", "frase", c.frase));
    cap.append(ab);
  } else {
    // continua o subcapítulo anterior: só um enfeite e uma legenda pequena
    const ct = el("header", "continua");
    ct.append(el("span", "continua-orn", "✦ ✦ ✦"));
    if (c.rotulo) ct.append(el("p", "rotulo", c.rotulo));
    cap.append(ct);
  }

  const corpo = el("div", "corpo");
  if (c.antesDepois) corpo.append(antesDepois(c.antesDepois));
  const tratouVideos = (LAYOUTS[c.layout] || LAYOUTS.mosaico)(c, corpo);
  const vids = c.videos || (c.video ? [c.video] : []);
  if (vids.length && !tratouVideos) {
    const g = el("div", "videos");
    vids.forEach((n) => { const b = el("div", "video-box"); b.append(video(n)); g.append(b); });
    corpo.append(g);
  }
  cap.append(corpo);
  historia.append(cap);
});

// epílogo: abre o grande final do aniversário
if (typeof EPILOGO !== "undefined") $("#aniversario").before(aberturaParte({ ...EPILOGO, id: "epilogo" }, "fotos/p/" + (typeof ANIVERSARIO !== "undefined" ? ANIVERSARIO.foto : ""), ""));

// ---------- nossas conquistas ----------
(function montarConquistas() {
  const grade = $("#conq-grade");
  if (!grade || typeof CONQUISTAS === "undefined") { $("#conquistas")?.remove(); return; }
  const total = CONQUISTAS.length; let feitas = 0;
  $("#conq-total").textContent = total;
  const comFoto = CONQUISTAS.filter((c) => c.foto).map((c) => c.foto);
  const toast = $("#toast"); let toastT = 0;
  const avisar = (txt) => { toast.textContent = txt; toast.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove("on"), 2600); };
  CONQUISTAS.forEach((c, i) => {
    const b = el("button", "conq"); b.type = "button";
    b.setAttribute("aria-label", "Desbloquear conquista: " + c.titulo); b.setAttribute("aria-pressed", "false");
    b.style.setProperty("--d", i * 120 + "ms");
    const inn = el("span", "conq-in");
    const frente = el("span", "conq-frente");
    frente.append(el("span", "conq-icone", c.icone), el("span", "conq-cadeado", "🔒"), el("span", "conq-nome", c.titulo));
    const verso = el("span", "conq-verso");
    if (c.foto) { const im = el("img"); im.src = leve(c.foto); im.alt = c.titulo; im.loading = "lazy"; if (c.enquadrar) im.style.objectPosition = c.enquadrar; verso.append(im); }
    else verso.append(el("span", "conq-embreve", c.icone + "\nfoto em breve"));
    const faixa = el("span", "conq-faixa"); faixa.append(el("strong", "", c.icone + " " + c.titulo));
    if (c.detalhe) faixa.append(el("small", "", c.detalhe));
    verso.append(faixa);
    inn.append(frente, verso); b.append(inn); grade.append(b);
    b.onclick = () => {
      if (b.classList.contains("on")) { if (c.foto) abrirGaleria(comFoto, comFoto.indexOf(c.foto)); return; }
      b.classList.add("on"); b.setAttribute("aria-pressed", "true");
      b.setAttribute("aria-label", c.titulo + " — desbloqueada (toque para ampliar)");
      feitas++;
      $("#conq-cont").textContent = feitas;
      $(".conq-barra i").style.width = (feitas / total * 100) + "%";
      const r = b.getBoundingClientRect(); explodirEm(r.left + r.width / 2, r.top + r.height / 2, 26);
      avisar("🏆 Conquista desbloqueada: " + c.titulo);
      if (feitas === total) setTimeout(() => {
        $("#conq-final").classList.add("on");
        const f = $("#conq-final").getBoundingClientRect();
        for (let k = 0; k < 4; k++) setTimeout(() => explodirEm(innerWidth * (.2 + Math.random() * .6), f.top, 30), k * 220);
      }, 900);
    };
  });
})();

// ---------- vídeo final ----------
if (typeof VIDEO_FINAL !== "undefined" && VIDEO_FINAL) {
  const b = el("div", "video-box final"); b.append(video(VIDEO_FINAL));
  b.append(el("p", "dica-som", "toque para ouvir 🔊"));
  $("#final-video").append(b);
}

// ---------- revelar ao rolar ----------
const rev = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("vis"); rev.unobserve(e.target); }
}), { threshold: .2, rootMargin: "0px 0px -8% 0px" });
$$(".abertura, .continua, .parte, .polaroid, .cel, .tela, .destaque, .mini, .carrossel-wrap, .video-box, .ad-box, .raspa-box, .pedido, .conq").forEach((n) => rev.observe(n));

// vídeos só tocam quando visíveis (economiza bateria/dados)
const vio = new IntersectionObserver((es) => es.forEach((e) => {
  const v = e.target;
  if (e.isIntersecting) { if (!calmo) v.play().catch(() => {}); }
  else { v.pause(); mutar(v); }   // saiu da tela: para e volta mudo
}), { threshold: .4 });
$$("video").forEach((v) => vio.observe(v));
// trocou de aba / bloqueou o celular: pausa tudo e tira o som
document.addEventListener("visibilitychange", () => { if (document.hidden) $$("video").forEach((v) => { v.pause(); mutar(v); }); });

// ---------- galeria ampliada ----------
const z = $("#zoom"), zImg = $(".zoom-img", z), zCont = $(".zoom-cont", z);
let gLista = [], gI = 0;
function mostrarFoto(i) {
  gI = (i + gLista.length) % gLista.length;
  zImg.src = cheia(gLista[gI]);
  zCont.textContent = gLista.length > 1 ? `${gI + 1} / ${gLista.length}` : "";
  z.classList.toggle("unica", gLista.length < 2);
  if (gLista.length > 1) new Image().src = cheia(gLista[(gI + 1) % gLista.length]); // pré-carrega a próxima
}
function abrirGaleria(lista, i) { gLista = lista; mostrarFoto(i); if (!z.open) z.showModal(); }
$(".zoom-prev", z).onclick = (e) => { e.stopPropagation(); mostrarFoto(gI - 1); };
$(".zoom-next", z).onclick = (e) => { e.stopPropagation(); mostrarFoto(gI + 1); };
$(".zoom-fechar", z).onclick = () => z.close();
z.addEventListener("click", (e) => { if (e.target === z || e.target.classList.contains("zoom-palco")) z.close(); });
z.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") mostrarFoto(gI - 1); if (e.key === "ArrowRight") mostrarFoto(gI + 1); });
let toqueX = null;
z.addEventListener("touchstart", (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
z.addEventListener("touchend", (e) => {
  if (toqueX == null) return; const dx = e.changedTouches[0].clientX - toqueX; toqueX = null;
  if (Math.abs(dx) > 45 && gLista.length > 1) mostrarFoto(gI + (dx < 0 ? 1 : -1));
});

// ---------- menu de capítulos ----------
const menuBtn = $("#menu-btn"), menu = $("#menu"), menuLista = $("ol", menu);
const irPara = (alvo) => { fecharMenu(); alvo.scrollIntoView({ behavior: calmo ? "auto" : "smooth" }); };
$$(".parte, .capitulo, #conquistas").forEach((s) => {
  let li, b;
  if (s.classList.contains("parte")) {
    const romano = s.dataset.numero.replace(/^Capítulo\s*/i, "");
    li = el("li", "grupo" + (s.id === "epilogo" ? " especial" : "")); b = el("button");
    b.append(el("span", "mn", s.id === "epilogo" ? "🎂" : romano), document.createTextNode(s.dataset.titulo));
  } else if (s.id === "conquistas") {
    li = el("li", "sub"); b = el("button", "", "🏆 " + $("#conq-h").textContent);
  } else if (s.dataset.titulo) {
    li = el("li", "sub"); b = el("button", "", s.dataset.titulo);
  } else return; // blocos de continuação não entram no menu
  b.onclick = () => irPara(s); b.dataset.alvo = s.id; li.append(b); menuLista.append(li);
});
function fecharMenu() { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); }
menuBtn.onclick = (e) => { e.stopPropagation(); const abrir = menu.hidden; menu.hidden = !abrir; menuBtn.setAttribute("aria-expanded", String(abrir)); };
document.addEventListener("click", (e) => { if (!menu.hidden && !menu.contains(e.target)) fecharMenu(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharMenu(); });
function marcarMenu(id) { $$("button", menuLista).forEach((b) => b.classList.toggle("atual", b.dataset.alvo === id)); }

// ---------- fundo + contador por capítulo ----------
const bgs = $$(".bg"); let qual = 0, fotoFundo = "";
function trocarFundo(src) {
  if (!src || src === fotoFundo) return; fotoFundo = src;
  qual ^= 1; bgs[qual].style.backgroundImage = `url("${src}")`;
  bgs[qual].classList.add("on"); bgs[qual ^ 1].classList.remove("on");
}
const anoEl = $("#ano"), cont = $(".contador");
function mostrarAno(a) {
  cont.dataset.tem = a ? "1" : "";
  if (!a || anoEl.textContent == a) return;
  anoEl.textContent = a; anoEl.classList.remove("vira"); void anoEl.offsetWidth; anoEl.classList.add("vira");
}
trocarFundo($(".capitulo")?.dataset.foto);
new IntersectionObserver(([e]) => { if (e.isIntersecting) marcarMenu("epilogo"); }, { rootMargin: "-45% 0px -45% 0px" }).observe($("#aniversario"));
if ($("#conquistas")) new IntersectionObserver(([e]) => { if (e.isIntersecting) { marcarMenu("conquistas"); trocarFundo(leve((CONQUISTAS.find((c) => c.foto) || {}).foto || "")); } }, { rootMargin: "-45% 0px -45% 0px" }).observe($("#conquistas"));
const capObs = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  trocarFundo(e.target.dataset.foto); mostrarAno(e.target.dataset.ano); marcarMenu(e.target.dataset.menu || e.target.id);
  if (!e.target.classList.contains("continuacao")) explodir(12);
}), { rootMargin: "-45% 0px -45% 0px" });
$$(".capitulo, .parte").forEach((c) => capObs.observe(c));

addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  $(".progresso span").style.width = (scrollY / max * 100) + "%";
  cont.classList.toggle("on", scrollY > innerHeight * .6 && scrollY < max - innerHeight * .5);
  menuBtn.classList.toggle("on", scrollY > innerHeight * .7);
}, { passive: true });

// ---------- corações ----------
const cv = $("#coracoes"), cx = cv.getContext("2d"); let parts = [];
function tam() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; cx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
tam(); addEventListener("resize", tam);
function coracao(x, y, s, a, c = "#ff8a7a") {
  cx.globalAlpha = a; cx.fillStyle = c; cx.beginPath(); cx.moveTo(x, y + s / 4);
  cx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + s / 4); cx.bezierCurveTo(x - s / 2, y + s / 2, x, y + s * .7, x, y + s);
  cx.bezierCurveTo(x, y + s * .7, x + s / 2, y + s / 2, x + s / 2, y + s / 4); cx.bezierCurveTo(x + s / 2, y, x, y, x, y + s / 4); cx.fill();
}
function explodir(n = 10) {
  if (calmo) return;
  for (let i = 0; i < n; i++) parts.push({ x: Math.random() * innerWidth, y: innerHeight + 20, vy: 1 + Math.random() * 2, vx: (Math.random() - .5) * .8, s: 8 + Math.random() * 14, a: .2 + Math.random() * .35, w: Math.random() * 6 });
}
// explosão de corações num ponto da tela (toques, surpresas)
function explodirEm(x, y, n = 16) {
  if (calmo) return;
  const cores = ["#ff4d7d", "#ff8a7a", "#ffd23f", "#ff5ef1", "#ffffff"];
  for (let i = 0; i < n; i++) {
    const ang = Math.random() * Math.PI * 2, v = 1.5 + Math.random() * 4.5;
    parts.push({ x, y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v * .7 + 1.4, s: 10 + Math.random() * 16, a: .95, w: Math.random() * 6, f: .95, fade: .011, c: cores[i % cores.length] });
  }
}
(function loop(t) {
  cx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.y > -40 && p.a > 0);
  parts.forEach((p) => {
    if (p.f) p.vx *= p.f; if (p.fade) p.a -= p.fade;
    p.y -= p.vy; p.x += p.vx + Math.sin(t / 600 + p.w) * .4; coracao(p.x, p.y, p.s, Math.max(0, p.a), p.c);
  });
  requestAnimationFrame(loop);
})(0);
if (!calmo) setInterval(() => parts.length < 20 && explodir(1), 1100);

new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && explodir(40)), { threshold: .6 }).observe($(".fim"));
// tocar em qualquer lugar da história solta corações
document.addEventListener("click", (e) => {
  if (calmo || e.target.closest("button, a, img, video, canvas, input, dialog, .menu, #aniversario, .ad")) return;
  explodirEm(e.clientX, e.clientY, 14);
});
$("#replay").onclick = () => scrollTo({ top: 0, behavior: calmo ? "auto" : "smooth" });
$("#aniv-foto")?.addEventListener("click", (e) => { e.stopPropagation(); abrirGaleria([ANIVERSARIO.foto], 0); });
