// ============================================================
//  ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR
// ============================================================

const PESSOA = {
  nome: "Alisson Henrique Ribeiro de Almeida",
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
//  fotos   : arquivos da pasta fotos/ — a PRIMEIRA é a foto principal do capítulo
//  video   : (opcional) arquivo da pasta midia/
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
    titulo: "O sim",
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
    frase: "Dois risquinhos.",
    layout: "destaque",
    fotos: [
      "noticia-01.jpg",
    ],
  },
  {
    titulo: "A espera",
    ano: null,
    frase: "",
    layout: "telacheia",
    fotos: [
      "espera-01.jpg",
      "espera-02.jpg",
      "espera-03.jpg",
    ],
  },
  {
    titulo: "Ela chegou",
    ano: null,
    frase: "",
    layout: "destaque",
    video: "chegada.mp4",
    fotos: [
      "chegada-01.jpg",
      "chegada-02.jpg",
    ],
  },
  {
    titulo: "Nossa família",
    ano: null,
    frase: "",
    layout: "mosaico",
    video: "familia.mp4",
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
];
