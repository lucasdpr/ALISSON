// ============================================================
//  ENCERRAMENTO: volta do quiz cai no vídeo final; ao terminar, fogos de artifício
// ============================================================
(() => {
  const fim = document.querySelector(".fim");
  const vid = document.querySelector("#final-video video");
  if (!fim || !vid) return;
  const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // vem do quiz (index.html#final): vai direto para o vídeo final
  if (location.hash === "#final") {
    const ir = () => {
      const r = fim.getBoundingClientRect();
      window.scrollTo({ top: scrollY + r.top, behavior: "instant" });
    };
    ir();
    addEventListener("load", ir);
    [400, 1200, 2500].forEach((ms) => setTimeout(ir, ms));
    vid.play().catch(() => {});
  }

  // o vídeo final toca uma vez só; ao acabar, vêm os fogos
  vid.loop = false;
  vid.addEventListener("ended", () => fogos());

  const cv = document.createElement("canvas");
  cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:30;pointer-events:none";
  document.body.append(cv);
  const g = cv.getContext("2d");
  const CORES = ["#ff8a7a", "#ffd27a", "#ff5c8a", "#ffffff", "#7ad7ff", "#c28bff"];
  let foguetes = [], faiscas = [], raf = 0, ativo = false;

  function tam() {
    const d = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * d; cv.height = innerHeight * d; g.setTransform(d, 0, 0, d, 0, 0);
  }
  addEventListener("resize", tam); tam();

  function lancar() {
    foguetes.push({ x: innerWidth * (.15 + Math.random() * .7), y: innerHeight, vy: 9 + Math.random() * 3,
      alvo: innerHeight * (.15 + Math.random() * .35), cor: CORES[(Math.random() * CORES.length) | 0] });
  }
  function explodir(f) {
    const n = calmo ? 24 : 70;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, v = 1.5 + Math.random() * 3.5;
      faiscas.push({ x: f.x, y: f.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, a: 1, cor: f.cor });
    }
  }
  function quadro() {
    g.clearRect(0, 0, innerWidth, innerHeight);
    foguetes = foguetes.filter((f) => {
      f.y -= f.vy; f.vy *= .985;
      g.fillStyle = f.cor; g.fillRect(f.x - 1.5, f.y, 3, 10);
      if (f.y <= f.alvo || f.vy < 2.2) { explodir(f); return false; }
      return true;
    });
    faiscas = faiscas.filter((p) => {
      p.x += p.vx; p.y += p.vy; p.vy += .05; p.vx *= .985; p.a -= .014;
      if (p.a <= 0) return false;
      g.globalAlpha = p.a; g.fillStyle = p.cor; g.beginPath(); g.arc(p.x, p.y, 2.2, 0, 7); g.fill();
      return true;
    });
    g.globalAlpha = 1;
    if (foguetes.length || faiscas.length || ativo) raf = requestAnimationFrame(quadro);
    else { raf = 0; g.clearRect(0, 0, innerWidth, innerHeight); }
  }
  function fogos() {
    ativo = true;
    const total = calmo ? 4 : 16;
    for (let i = 0; i < total; i++) setTimeout(lancar, i * 420 + Math.random() * 200);
    setTimeout(() => { ativo = false; }, total * 420 + 300);
    if (!raf) raf = requestAnimationFrame(quadro);
  }
})();
