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
if (primeiroAno) { const anos = new Date().getFullYear() - primeiroAno; $("#desde").textContent = `${anos} anos de história ❤️`; }
digitar($("#maquina"), primeiroAno ? `Em ${primeiroAno}, começou a história de…` : "Esta é a história de…").then(() => {
  $("#nome").classList.add("on");
  setTimeout(() => $("#casal").classList.add("on"), 700);
  setTimeout(() => $("#desde").classList.add("on"), 1400);
});

if (PESSOA.aniversario) {
  const [a, m, d] = PESSOA.aniversario.split("-").map(Number);
  const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  const h = new Date(); const hoje = new Date(h.getFullYear(), h.getMonth(), h.getDate());
  let idade = h.getFullYear() - a; const prox = new Date(h.getFullYear(), m - 1, d);
  if (prox < hoje) { prox.setFullYear(prox.getFullYear() + 1); idade++; }
  const dias = Math.round((prox - hoje) / 864e5);
  $("#aniv").textContent = `${d} de ${meses[m - 1]} · ` + (dias === 0 ? "🎉 hoje é o grande dia!" : `faltam ${dias} dia${dias > 1 ? "s" : ""} para os ${idade} anos`);
  $("#aniv").hidden = false;
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
  destaque(c, box) {
    const [prim, ...resto] = c.fotos;
    const d = el("div", "destaque"); d.append(foto(prim, "min(640px, 100vw)")); box.append(d);
    if (resto.length) { const m = el("div", "mini"); resto.forEach((f) => m.append(foto(f, "min(44vw, 300px)"))); box.append(m); }
  },
};

// ---------- monta capítulos ----------
const historia = $("#historia");
let anoCorrente = primeiroAno || "";
CAPITULOS.forEach((c, i) => {
  if (c.ano) anoCorrente = c.ano;
  const cap = el("section", "capitulo layout-" + c.layout);
  cap.id = "cap-" + (i + 1);
  cap.dataset.titulo = c.titulo;
  galeriaAtual = c.fotos;
  cap.dataset.ano = c.ano || "";
  const v0 = (c.videos || [])[0];
  cap.dataset.foto = c.fotos[0] ? leve(c.fotos[0]) : v0 ? "midia/" + v0.replace(/\.mp4$/, ".jpg") : "";

  const ab = el("header", "abertura");
  ab.append(el("p", "num", `capítulo ${i + 1}`));
  if (c.ano) ab.append(el("div", "marco", c.ano));
  ab.append(el("h2", "", c.titulo));
  if (c.frase) ab.append(el("p", "frase", c.frase));
  cap.append(ab);

  const corpo = el("div", "corpo");
  (LAYOUTS[c.layout] || LAYOUTS.mosaico)(c, corpo);
  const vids = c.videos || (c.video ? [c.video] : []);
  if (vids.length) {
    const g = el("div", "videos");
    vids.forEach((n) => { const b = el("div", "video-box"); b.append(video(n)); g.append(b); });
    corpo.append(g);
  }
  cap.append(corpo);
  historia.append(cap);
});

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
$$(".abertura, .polaroid, .cel, .tela, .destaque, .mini, .carrossel-wrap, .video-box").forEach((n) => rev.observe(n));

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
$$(".capitulo").forEach((c, i) => {
  const li = el("li"), b = el("button", "", "");
  b.append(el("span", "mn", String(i + 1)), document.createTextNode(c.dataset.titulo));
  b.onclick = () => irPara(c); b.dataset.alvo = c.id; li.append(b); menuLista.append(li);
});
{
  const li = el("li", "especial"), b = el("button", "", "🎂 A surpresa");
  b.onclick = () => irPara($("#aniversario")); b.dataset.alvo = "aniversario"; li.append(b); menuLista.append(li);
}
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
new IntersectionObserver(([e]) => { if (e.isIntersecting) marcarMenu("aniversario"); }, { rootMargin: "-45% 0px -45% 0px" }).observe($("#aniversario"));
const capObs = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  trocarFundo(e.target.dataset.foto); mostrarAno(e.target.dataset.ano); marcarMenu(e.target.id); explodir(12);
}), { rootMargin: "-45% 0px -45% 0px" });
$$(".capitulo").forEach((c) => capObs.observe(c));

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
function coracao(x, y, s, a) {
  cx.globalAlpha = a; cx.fillStyle = "#ff8a7a"; cx.beginPath(); cx.moveTo(x, y + s / 4);
  cx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + s / 4); cx.bezierCurveTo(x - s / 2, y + s / 2, x, y + s * .7, x, y + s);
  cx.bezierCurveTo(x, y + s * .7, x + s / 2, y + s / 2, x + s / 2, y + s / 4); cx.bezierCurveTo(x + s / 2, y, x, y, x, y + s / 4); cx.fill();
}
function explodir(n = 10) {
  if (calmo) return;
  for (let i = 0; i < n; i++) parts.push({ x: Math.random() * innerWidth, y: innerHeight + 20, vy: 1 + Math.random() * 2, vx: (Math.random() - .5) * .8, s: 8 + Math.random() * 14, a: .2 + Math.random() * .35, w: Math.random() * 6 });
}
(function loop(t) {
  cx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.y > -40);
  parts.forEach((p) => { p.y -= p.vy; p.x += p.vx + Math.sin(t / 600 + p.w) * .4; coracao(p.x, p.y, p.s, p.a); });
  requestAnimationFrame(loop);
})(0);
if (!calmo) setInterval(() => parts.length < 20 && explodir(1), 1100);

new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && explodir(40)), { threshold: .6 }).observe($(".fim"));
$("#replay").onclick = () => scrollTo({ top: 0, behavior: calmo ? "auto" : "smooth" });
$("#aniv-foto")?.addEventListener("click", (e) => { e.stopPropagation(); abrirGaleria([ANIVERSARIO.foto], 0); });
