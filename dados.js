// ============================================================
//  ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR
// ============================================================

const PESSOA = {
  nome: "Alisson Henrique",
  esposa: "Erica Ricardo",
  filha: "Manuella",
  aniversario: "",   // formato "AAAA-MM-DD"; vazio = não mostra
};

// A história é dividida em CAPÍTULOS, na ordem desta lista.
//  titulo  : nome do capítulo
//  ano     : ex. 2014 (ou null se não souber) — aparece grande na abertura e no contador
//  frase   : uma frase curta que abre o capítulo (opcional)
//  layout  : como as fotos aparecem — varie para não ficar repetitivo:
//            "mural"     polaroids espalhadas (a 1ª fica em destaque)
//            "mosaico"   grade estilo revista
//            "carrossel" fotos lado a lado, desliza para o lado
//            "telacheia" cada foto ocupa a tela inteira
//            "destaque"  uma foto grande (as demais logo abaixo)
//            "videos"    só os vídeos (fotos pode ficar vazio)
//            "pedido"    caixinha de aliança que abre e mostra o vídeo
//            "raspadinha" raspe para revelar a 1ª foto (revelacao: texto que aparece depois)
//  fotos   : arquivos da pasta fotos/ — a PRIMEIRA é a foto principal do capítulo
//  videos  : (opcional) lista de arquivos da pasta midia/
// Vídeo que fecha o site (montagem com música)
const VIDEO_FINAL = "retrospectiva.mp4";

const CAPITULOS = [
  {
    titulo: "O começo",
    ano: 2010,
    frase: "Um beijo, e tudo mudou.",
    layout: "mural",
    fotos: [
      "2010-06.jpg",
      "2010-01.jpg",
      "2010-02.jpg",
      "2010-03.jpg",
      "2010-04.jpg",
      "2010-05.jpg",
      "2010-07.jpg",
      "2010-08.jpg",
      "2010-09.jpg",
      "2010-10.jpg",
      "2010-11.jpg",
      "2010-12.jpg",
      "2010-13.jpg",
      "2010-14.jpg",
      "2010-15.jpg",
      "2010-16.jpg",
      "2010-17.jpg",
    ],
  },
  {
    titulo: "Crescendo juntos",
    ano: null,
    frase: "",
    layout: "mosaico",
    fotos: [
      "namoro-01.jpg",
      "namoro-02.jpg",
      "namoro-03.jpg",
      "namoro-04.jpg",
      "namoro-05.jpg",
      "namoro-06.jpg",
      "namoro-07.jpg",
      "namoro-08.jpg",
      "namoro-09.jpg",
      "namoro-10.jpg",
      "namoro-11.jpg",
      "namoro-12.jpg",
      "namoro-13.jpg",
    ],
  },
  {
    titulo: "Uma conquista",
    ano: null,
    frase: "",
    layout: "destaque",
    fotos: [
      "formatura-01.jpg",
    ],
  },
  {
    titulo: "O pedido",
    ano: null,
    frase: "Quer casar comigo?",
    layout: "pedido",
    videos: ["pedido.mp4"],
    fotos: [],
  },
  {
    titulo: "O ensaio",
    ano: null,
    frase: "",
    layout: "telacheia",
    fotos: [
      "ensaio-01.jpg",
      "ensaio-02.jpg",
      "ensaio-03.jpg",
    ],
  },
  {
    titulo: "O casamento",
    ano: null,
    frase: "",
    layout: "carrossel",
    fotos: [
      "casamento-01.jpg",
      "casamento-02.jpg",
      "casamento-03.jpg",
      "casamento-04.jpg",
      "casamento-05.jpg",
      "casamento-06.jpg",
      "casamento-07.jpg",
      "casamento-08.jpg",
      "casamento-09.jpg",
      "casamento-10.jpg",
    ],
  },
  {
    titulo: "Mais aventuras",
    ano: null,
    frase: "",
    layout: "mural",
    videos: ["aventuras-show.mp4"],
    fotos: [
      "aventuras-01.jpg",
      "aventuras-02.jpg",
      "aventuras-03.jpg",
      "aventuras-04.jpg",
      "aventuras-05.jpg",
      "aventuras-06.jpg",
      "aventuras-07.jpg",
      "aventuras-08.jpg",
      "aventuras-09.jpg",
    ],
  },
  {
    titulo: "A notícia",
    ano: null,
    frase: "Uma mensagem que mudou tudo…",
    layout: "raspadinha",
    revelacao: "Oi, papai! 💗",
    fotos: [
      "noticia-01.jpg",
    ],
  },
  {
    titulo: "A espera",
    ano: null,
    frase: "",
    layout: "telacheia",
    videos: ["espera-ultrassom-3d.mp4", "espera-ultrassom.mp4", "espera-caminhada.mp4", "espera-estudio.mp4"],
    fotos: [
      "espera-01.jpg",
      "espera-02.jpg",
      "espera-03.jpg",
    ],
  },
  {
    titulo: "A Manuella chegou",
    ano: null,
    frase: "",
    layout: "destaque",
    videos: ["chegada-colo.mp4", "chegada-passeio.mp4"],
    fotos: [
      "chegada-02.jpg",
      "chegada-03.jpg",
      "chegada-04.jpg",
      "chegada-05.jpg",
      "chegada-06.jpg",
      "chegada-07.jpg",
    ],
  },
  {
    titulo: "Nossa família",
    ano: null,
    frase: "",
    layout: "mosaico",
    videos: ["familia.mp4", "familia-barco.mp4", "familia-arara.mp4", "familia-passeio.mp4", "familia-aniversario.mp4"],
    fotos: [
      "familia-01.jpg",
      "familia-02.jpg",
      "familia-03.jpg",
      "familia-04.jpg",
      "familia-05.jpg",
      "familia-06.jpg",
      "familia-07.jpg",
      "familia-08.jpg",
      "familia-09.jpg",
      "familia-10.jpg",
      "familia-11.jpg",
      "familia-12.jpg",
      "familia-13.jpg",
      "familia-14.jpg",
      "familia-15.jpg",
      "familia-16.jpg",
      "familia-17.jpg",
      "familia-18.jpg",
      "familia-19.jpg",
      "familia-20.jpg",
      "familia-21.jpg",
      "familia-22.jpg",
      "familia-23.jpg",
      "familia-24.jpg",
      "familia-25.jpg",
    ],
  },
  {
    titulo: "Por aí, nós três",
    ano: null,
    frase: "",
    layout: "videos",
    videos: [
      "passeio-estadio.mp4",
      "passeio-aquario.mp4",
      "passeio-maozinha.mp4",
      "passeio-trilha.mp4",
      "passeio-pedras.mp4",
      "passeio-praia.mp4",
      "passeio-por-do-sol.mp4",
      "passeio-mirante.mp4",
      "passeio-fim-de-tarde.mp4",
      "passeio-festa-junina.mp4",
    ],
    fotos: [],
  },
  {
    titulo: "Hoje",
    ano: null,
    frase: "",
    layout: "carrossel",
    antesDepois: ["ad-antes.jpg", "ad-depois.jpg"],   // arraste para comparar
    videos: ["hoje.mp4"],
    fotos: [
      "hoje-01.jpg",
      "hoje-02.jpg",
      "hoje-03.jpg",
      "hoje-04.jpg",
      "hoje-05.jpg",
      "hoje-07.jpg",
      "hoje-08.jpg",
    ],
  },
];

// ============================================================
//  GRANDE FINAL — aniversário
// ============================================================
const ANIVERSARIO = {
  foto: "aniversario.jpg",
  horizonte: 0.53,          // altura da linha do mar na foto (0 = topo, 1 = base): os fogos sobem dali
  fogosEscrevem: ["Alisson", "Te amo", "Parabéns!"],   // frases que os fogos escrevem no céu, em sequência
  assinatura: "Erica",
  mensagem: `Hoje é o seu dia, meu amor! ❤️

E eu não poderia deixar de agradecer a Deus pela sua vida e por mais um ano que Ele te concede.

São 16 anos de história, tantos momentos vividos, sonhos construídos, desafios enfrentados e tantas lembranças que carregamos juntos. Quando olho para a nossa caminhada, vejo que o nosso amor é feito de muito mais do que momentos felizes: é feito de parceria, escolhas diárias, amadurecimento e vontade de continuar caminhando lado a lado.

Que Deus continue guiando seus passos, abençoando seus planos, renovando suas forças e realizando os desejos do seu coração. Que nunca faltem saúde, sabedoria, paz e motivos para sorrir.

Eu desejo que a vida seja generosa com você, que seus sonhos floresçam e que você nunca se esqueça do quanto é amado.

Obrigada por dividir a vida comigo, por nossa família, por nossa história e por tudo o que ainda vamos viver.

Feliz aniversário, meu amor! Que venham muitos outros anos, muitas conquistas e novas histórias para escrevermos juntos.

Eu escolheria você em tantas outras vidas. Te amo! ♥️♥️♥️`,
};
