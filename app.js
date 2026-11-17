const $ = (s) => document.querySelector(s);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- intro: texto de máquina de escrever ----------
function digitar(alvo, texto, ms = 55) {
  return new Promise((ok) => {
    if (calmo) { alvo.textContent = texto; alvo.classList.add("fim-digitar"); return ok(); }
    let i = 0; alvo.textContent = "";
    const t = setInterval(() => { alvo.textContent = texto.slice(0, ++i); if (i >= texto.length) { clearInterval(t); alvo.classList.add("fim-digitar"); ok(); } }, ms);
  });
}
$("#nome").textContent = PESSOA.nome;
digitar($("#maquina"), "Em 2010, começou a história de…").then(() => $("#nome").classList.add("on"));

// ---------- aniversário (opcional) ----------
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

// ---------- monta as cenas ----------
const historia = $("#historia");
let anoAtual = MOMENTOS.find((m) => m.ano)?.ano || 2010;
MOMENTOS.forEach((mo, i) => {
  if (mo.ano) anoAtual = mo.ano;
  const fotos = mo.fotos || (mo.foto ? [mo.foto] : []);
  const sec = el("section", "momento");
  sec.dataset.ano = anoAtual;
  sec.dataset.foto = fotos[0] ? "fotos/" + fotos[0] : "";
  const giro = (i % 2 ? 1 : -1) * (2 + (i * 7) % 4);       // rotação "aleatória" mas estável
  sec.style.setProperty("--r", giro + "deg");
  sec.style.setProperty("--r0", (giro * -4) + "deg");
  sec.style.setProperty("--fita", (i % 3 - 1) * 4 + "deg");

  const wrap = el("div");
  if (mo.ano) wrap.append(el("div", "marco", mo.ano));
  const pol = el("figure", "polaroid"); pol.style.margin = "0 auto";
  const f = el("div", "foto");
  if (fotos[0]) {
    const img = el("img"); img.src = "fotos/" + fotos[0]; img.alt = mo.titulo || `Momento ${i + 1}`; img.loading = i < 2 ? "eager" : "lazy";
    img.onclick = () => { const z = $("#zoom"); z.querySelector("img").src = img.src; z.showModal(); };
    f.append(img);
  }
  pol.append(f);
  const leg = el("figcaption", "legenda", mo.titulo || "");
  if (mo.data) leg.append(el("small", "", mo.data));
  pol.append(leg);
  wrap.append(pol);
  if (mo.texto) wrap.append(el("p", "texto", mo.texto));
  sec.append(wrap);
  historia.append(sec);
});

// ---------- fundo em crossfade + contador de ano ----------
const bgs = [...document.querySelectorAll(".bg")]; let qual = 0, fotoFundo = "";
function trocarFundo(src) {
  if (!src || src === fotoFundo) return; fotoFundo = src;
  qual ^= 1; bgs[qual].style.backgroundImage = `url("${src}")`;
  bgs[qual].classList.add("on"); bgs[qual ^ 1].classList.remove("on");
}
const anoEl = $("#ano");
function mostrarAno(a) {
  if (anoEl.textContent == a) return;
  anoEl.textContent = a; anoEl.classList.remove("vira"); void anoEl.offsetWidth; anoEl.classList.add("vira");
}
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("vis");
  trocarFundo(e.target.dataset.foto); mostrarAno(e.target.dataset.ano);
  explodir();
}), { threshold: .45 });
document.querySelectorAll(".momento").forEach((s) => io.observe(s));

addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  $(".progresso span").style.width = (scrollY / max * 100) + "%";
  $(".contador").classList.toggle("on", scrollY > innerHeight * .6 && scrollY < max - innerHeight * .5);
}, { passive: true });

// ---------- corações flutuando ----------
const cv = $("#coracoes"), cx = cv.getContext("2d"); let parts = [];
function tam() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; cx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
tam(); addEventListener("resize", tam);
function coracao(x, y, s, a) {
  cx.globalAlpha = a; cx.fillStyle = "#ff8a7a"; cx.beginPath();
  cx.moveTo(x, y + s / 4);
  cx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + s / 4); cx.bezierCurveTo(x - s / 2, y + s / 2, x, y + s * .7, x, y + s);
  cx.bezierCurveTo(x, y + s * .7, x + s / 2, y + s / 2, x + s / 2, y + s / 4); cx.bezierCurveTo(x + s / 2, y, x, y, x, y + s / 4);
  cx.fill();
}
function explodir(n = 10) {
  if (calmo) return;
  for (let i = 0; i < n; i++) parts.push({ x: Math.random() * innerWidth, y: innerHeight + 20, vy: 1 + Math.random() * 2, vx: (Math.random() - .5) * .8, s: 8 + Math.random() * 14, a: .25 + Math.random() * .4, w: Math.random() * 6 });
}
(function loop(t) {
  cx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.y > -40);
  parts.forEach((p) => { p.y -= p.vy; p.x += p.vx + Math.sin(t / 600 + p.w) * .4; coracao(p.x, p.y, p.s, p.a); });
  requestAnimationFrame(loop);
})(0);
if (!calmo) setInterval(() => parts.length < 25 && explodir(1), 900);

// ---------- fim ----------
const fimObs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && explodir(40)), { threshold: .6 });
fimObs.observe($(".fim"));
$("#replay").onclick = () => scrollTo({ top: 0, behavior: calmo ? "auto" : "smooth" });

const z = $("#zoom"); z.addEventListener("click", () => z.close());
