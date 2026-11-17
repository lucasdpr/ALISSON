const $ = (s) => document.querySelector(s);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };

$("#nome").textContent = PESSOA.nome;

// Aniversário: mostra data por extenso e idade/contagem (sem depender de fuso horário)
if (PESSOA.aniversario) {
  const [a, m, d] = PESSOA.aniversario.split("-").map(Number);
  const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  const hoje = new Date();
  let idade = hoje.getFullYear() - a;
  const proximo = new Date(hoje.getFullYear(), m - 1, d);
  if (proximo < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())) { idade++; proximo.setFullYear(proximo.getFullYear() + 1); }
  const dias = Math.round((proximo - new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())) / 864e5);
  const extra = dias === 0 ? "🎉 Hoje é aniversário!" : `Faltam ${dias} dia${dias > 1 ? "s" : ""} para completar ${idade} anos`;
  $("#aniv").textContent = `Nascido em ${d} de ${meses[m - 1]} de ${a} · ${extra}`;
  $("#aniv").hidden = false;
}

const linha = $("#linha");
[...MOMENTOS].sort((x, y) => x.ano - y.ano).forEach((mo) => {
  const item = el("section", "item");
  item.append(el("div", "ano", mo.ano));
  const card = el("article", "card");
  const fotos = mo.fotos || (mo.foto ? [mo.foto] : []);
  if (fotos.length) {
    const g = el("div", fotos.length > 1 ? "galeria" : "");
    fotos.forEach((f, i) => {
      const img = el("img"); img.src = "fotos/" + f; img.alt = `${mo.titulo || "Foto"} — ${mo.ano} (${i + 1})`; img.loading = "lazy";
      img.onclick = () => { const z = $("#zoom"); z.querySelector("img").src = img.src; z.showModal(); };
      g.append(img);
    });
    card.append(g);
  } else card.append(el("div", "vazio", "Foto em breve"));
  const corpo = el("div", "corpo");
  if (mo.data) corpo.append(el("p", "data", mo.data));
  if (mo.titulo) corpo.append(el("h2", "", mo.titulo));
  if (mo.texto) corpo.append(el("p", "", mo.texto));
  if (corpo.children.length) card.append(corpo);
  item.append(card);
  linha.append(item);
});

const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("vis"), io.unobserve(e.target))), { threshold: .15 });
document.querySelectorAll(".item").forEach((i) => io.observe(i));

const z = $("#zoom");
z.addEventListener("click", () => z.close());
