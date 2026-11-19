(() => {
  const $ = (s) => document.querySelector(s);
  const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LETRAS = ["A", "B", "C", "D"];
  const total = QUIZ.length;
  let i = 0;

  const telas = { capa: $("#tela-capa"), pergunta: $("#tela-pergunta"), transicao: $("#tela-transicao") };
  function mostrar(nome) {
    Object.entries(telas).forEach(([k, el]) => el.classList.toggle("on", k === nome));
    window.scrollTo(0, 0);
  }

  // ---------- efeito subindo na tela ----------
  const camada = $("#subindo");
  const SIMBOLOS = ["❤️", "💖", "💕", "🎈", "✨", "💗"];
  function subir(qtd = 36, simbolos = SIMBOLOS) {
    if (calmo) qtd = 8;
    for (let n = 0; n < qtd; n++) {
      const e = document.createElement("span");
      e.className = "sobe";
      e.textContent = simbolos[(Math.random() * simbolos.length) | 0];
      e.style.setProperty("--x", Math.random() * 96 + "%");
      e.style.setProperty("--s", 18 + Math.random() * 30 + "px");
      e.style.setProperty("--d", 3 + Math.random() * 2.5 + "s");
      e.style.setProperty("--a", Math.random() * 0.9 + "s");
      e.style.setProperty("--w", (Math.random() * 60 - 30) + "px");
      e.style.setProperty("--r", (Math.random() * 60 - 30) + "deg");
      e.addEventListener("animationend", () => e.remove());
      camada.append(e);
    }
  }

  const XIS = ["❌", "✖️", "❌", "💔"];

  // ---------- perguntas ----------
  const elOpcoes = $("#opcoes"), ret = $("#retorno");
  const set = (id, txt) => { $(id).textContent = txt || ""; };

  function renderPergunta() {
    const q = QUIZ[i];
    set("#contagem", `Pergunta ${i + 1} de ${total}`);
    set("#titulo", q.t);
    $("#barra").style.width = (i / total) * 100 + "%";
    ret.hidden = true;
    $("#proxima").hidden = false;
    elOpcoes.replaceChildren();
    q.o.forEach((txt, k) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "op"; b.dataset.k = k;
      b.innerHTML = `<span class="l">${LETRAS[k]}</span><span></span>`;
      b.lastChild.textContent = txt;
      b.addEventListener("click", () => responder(k));
      elOpcoes.append(b);
    });
    $("#proxima").textContent = i === total - 1 ? "Terminar ❤️" : "Próxima";
    mostrar("pergunta");
  }

  function mostrarRetorno({ selo, cls, resultado, texto, extra }) {
    const s = $("#selo"); s.className = "selo " + (cls || "");
    set("#selo", selo); set("#resultado", resultado); set("#texto", texto); set("#extra", extra);
    ret.hidden = false;
    ret.scrollIntoView({ behavior: calmo ? "auto" : "smooth", block: "nearest" });
  }

  function responder(k) {
    const q = QUIZ[i];
    const btns = [...elOpcoes.children];
    if (q.tipo === "certa") {
      btns.forEach((b) => (b.disabled = true));
      const acertou = k === q.c;
      btns[q.c].classList.add("certa");
      if (!acertou) btns[k].classList.add("errada");
      mostrarRetorno({
        selo: acertou ? "Acertou! 🎉" : "Ops, errou! 😅",
        cls: acertou ? "ok" : "no",
        resultado: acertou ? "" : "A resposta certa era: " + q.o[q.c].replace(/\s*❤️$/, ""),
        texto: q.msg
      });
      if (acertou) subir(); else subir(24, XIS);
      return;
    }
    if (q.tipo === "livre") {
      // sem resposta errada: pode trocar de escolha quantas vezes quiser
      btns.forEach((b) => b.classList.remove("escolhida"));
      btns[k].classList.add("escolhida");
      mostrarRetorno({
        selo: "Sem resposta errada ❤️ (pode trocar!)", cls: "li",
        texto: Array.isArray(q.msg) ? q.msg[k] : q.msg, extra: q.extra
      });
      subir(22);
      return;
    }
    // situacoes (pergunta 14): precisa ver as quatro
    btns[k].classList.add("vista");
    btns[k].dataset.visto = "1";
    const todas = btns.every((b) => b.dataset.visto);
    mostrarRetorno({
      selo: "O mais provável é…", cls: "li",
      resultado: q.res[k], texto: q.msg[k],
      extra: todas ? "" : `Toque nas outras situações (${btns.filter((b) => b.dataset.visto).length}/4).`
    });
    $("#proxima").hidden = !todas;
    if (todas) $("#extra").textContent = "";
    subir(14);
  }

  $("#voltar").addEventListener("click", () => {
    if (i > 0) { i--; renderPergunta(); } else { mostrar("capa"); }
  });
  $("#comecar").addEventListener("click", () => { i = 0; renderPergunta(); });
  $("#proxima").addEventListener("click", () => {
    $("#proxima").hidden = false;
    if (i < total - 1) { i++; renderPergunta(); } else transicao();
  });

  // ---------- transição e declaração ----------
  function transicao() {
    $("#barra").style.width = "100%";
    set("#tr-titulo", QUIZ_TRANSICAO.titulo);
    set("#tr-msg", QUIZ_TRANSICAO.msg);
    set("#tr-parabens", QUIZ_TRANSICAO.parabens);
    mostrar("transicao");
    subir(40);
  }

  $("#ver-declaracao").addEventListener("click", () => {
    $("#app").hidden = true;
    const dec = $("#declaracao"); dec.hidden = false;
    set("#dec-titulo", DECLARACAO.titulo);
    const corpo = $("#dec-corpo");
    const paras = DECLARACAO.texto.trim().split(/\n\s*\n/);
    paras.forEach((p, n) => {
      const el = document.createElement("p");
      el.textContent = p.trim();
      if (n === 0) el.className = "abre";
      if (n === paras.length - 1) el.className = "ultima";
      corpo.append(el);
    });
    window.scrollTo(0, 0);
    const obs = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); }
    }), { threshold: .25 });
    corpo.querySelectorAll("p").forEach((p) => obs.observe(p));
    setTimeout(() => $(".dec-topo").classList.add("on"), 100);
    subir(40);
    // corações sobem de vez em quando durante a leitura
    if (!calmo) setInterval(() => subir(5), 4000);
  });
})();
