// ============================================================
//  DADOS DO QUIZ — 16 anos da nossa história
//  tipos: "certa" (c = índice da resposta certa), "livre" (sem errada),
//         "situacoes" (pergunta 14)
//  msg: texto único, ou lista com uma mensagem por alternativa
// ============================================================
const QUIZ = [
  { t: "Em que dia demos nosso primeiro beijo?", tipo: "certa", c: 1,
    o: ["12/03/2010", "13/03/2010", "15/03/2010", "20/03/2010"],
    msg: "13/03/2010. O dia em que tudo começou, e a data que a gente nunca esquece! ❤️" },

  { t: "Qual é a data do nosso aniversário de namoro?", tipo: "certa", c: 2,
    o: ["13/06/2010", "18/06/2010", "20/06/2010", "23/06/2010"],
    msg: "20/06/2010. Foi aí que o nosso começo virou namoro! 💕" },

  { t: "Qual é a data do nosso casamento?", tipo: "certa", c: 2,
    o: ["13/03/2010", "10/03/2021", "13/03/2021", "20/03/2021"],
    msg: "13/03/2021. Onze anos depois do primeiro beijo, no mesmíssimo dia e mês! 💍" },

  { t: "Onde foi nosso primeiro beijo?", tipo: "certa", c: 3,
    o: ["No ginásio 249", "Na praça do Jardim Europa", "Na escola ROOSEVELT", "Na escada da 249"],
    msg: "Na escada da 249. Um cantinho qualquer que virou lugar de história! 🥰" },

  { t: "Qual foi nossa primeira viagem juntos de avião?", tipo: "certa", c: 1,
    o: ["Maceió", "Jericoacoara / Fortaleza", "Porto de Galinhas", "Arraial do Cabo"],
    msg: "Jericoacoara / Fortaleza. A primeira de muitas aventuras! ✈️" },

  { t: "Qual foi uma das nossas maiores aventuras juntos?", tipo: "certa", c: 1,
    o: ["Nossa primeira viagem juntos de avião ✈️", "Um passeio de helicóptero 🚁", "A conquista da nossa casa nova 🏡", "Uma viagem para Angra, na Casa da Rosa 😂"],
    msg: "O passeio de helicóptero! Foi lá do alto que a gente viu o mundo pequenininho e o nosso amor gigante. 🚁❤️" },

  { t: "Qual das nossas viagens foi a mais inesquecível?", tipo: "livre",
    o: ["Jericoacoara ✈️", "Maceió 🌴", "Porto de Galinhas 🏖️", "Arraial do Cabo 🌊"],
    msg: [
      "Nossa primeira viagem juntos de avião, uma experiência que abriu as portas para tantas outras aventuras. Que venham muitas mais!",
      "Uma viagem que guardamos com carinho, porque vivemos uma experiência diferente: já sabíamos da chegada da Manu, mas ainda não tínhamos contado para ninguém. Foi um segredo lindo que pudemos viver juntinhos, só nós dois. E a nossa família ❤️",
      "Uma viagem ainda mais especial: a Manu já estava pequenininha com a gente, e pudemos viver a experiência de viajar em família. Nossa primeira aventura com ela! 🥹",
      "Nossa viagem mais recente, que foi simplesmente perfeita! Um momento em que parecia que estávamos reescrevendo a nossa história, vivendo uma nova fase e criando novas lembranças juntos. ❤️"
    ],
    extra: "Talvez não exista uma viagem mais inesquecível que a outra. Cada uma marcou uma fase diferente da nossa vida. Fomos dois, depois três, e continuamos descobrindo novos caminhos para viver nossa história. Que Deus nos permita conhecer muitos outros lugares, sempre juntos!" },

  { t: "Qual foi o momento em que nossa família ganhou um novo sentido?", tipo: "certa", c: 2,
    o: ["Quando decidimos nos casar 💍", "Quando compramos nossa primeira casa 🏡", "Com a chegada da Manu 🎀 ❤️", "Quando começamos a construir nossos sonhos juntos ❤️"],
    msg: "Com a chegada da nossa Manu, nosso amor ganhou um novo significado. Deixamos de ser apenas dois sonhando com o futuro e nos tornamos uma família. O melhor presente que Deus poderia nos dar. ❤️" },

  { t: "Qual é o nosso maior sonho atualmente?", tipo: "certa", c: 3,
    o: ["Conhecer vários países juntos ✈️", "Ver a Manu crescer e realizar seus sonhos 🎀", "Construir uma vida tranquila, com nossa família e nossa casa 🏡", "Conquistar tudo isso juntos!"],
    msg: "Porque, no fim das contas, não importa quantos sonhos ainda temos para realizar. O que mais queremos é continuar realizando todos eles lado a lado." },

  { t: "Quem é o mais ciumento nessa relação?", tipo: "certa", c: 0,
    o: ["Erica 🤭", "Alisson", "Os dois, cada um do seu jeito", "Nenhum dos dois, somos a definição de tranquilidade 😂"],
    msg: "Não precisava nem pensar muito, né? KKKKK. Quem ama, cuida… mas às vezes a Erica exagera um pouquinho! 🤣❤️" },

  { t: "Se pudéssemos reviver um dia da nossa história, qual seria?", tipo: "livre",
    o: ["O dia do nosso primeiro beijo 💋", "O dia do nosso casamento 💍", "O nascimento da Manu 🎀", "Nossa viagem mais recente para Arraial do Cabo 🌊"],
    msg: "Cada um desses dias tem um significado único. Se pudéssemos voltar no tempo, viveríamos tudo outra vez, porque cada momento nos trouxe até aqui. E ainda temos tanta história pela frente! ❤️" },

  { t: "O que não pode faltar na nossa vida, independentemente de onde estivermos?", tipo: "certa", c: 3,
    o: ["Amor ❤️", "Nossa família 👨‍👩‍👧", "Deus 🙏", "Tudo isso junto! ❤️"],
    msg: "Porque aprendemos que não precisamos ter tudo perfeito para sermos felizes. Com Deus à frente, amor no coração e nossa família juntinha, temos o essencial para enfrentar qualquer caminho." },

  { t: "Qual é o símbolo que representa o início da nossa história?", tipo: "certa", c: 2,
    o: ["Uma aliança 💍", "Um coração ❤️", "Um cubo mágico 🧩", "Uma rosa 🌹"],
    msg: "Quem diria que um simples cubo mágico seria o começo de uma história que já dura tantos anos? Tudo começou na escola, em uma conversa despretensiosa, na aula de educação física. E olha quanta coisa construímos desde aquele dia! ❤️" },

  { t: "Quem é mais provável de…?", tipo: "situacoes",
    o: ["Começar uma discussão e depois esquecer o motivo 😂", "Ficar com fome e mudar completamente o humor 🍔", "Demorar mais para se arrumar ⏰", "Fazer planos mirabolantes para o futuro ✈️"],
    res: ["Erica", "Erica e Alisson", "Erica", "Erica"],
    msg: [
      "Começa com um assunto, puxa outro, lembra de mais três coisas e, quando percebe, já está discutindo algo completamente diferente! Mas calma, que na cabeça dela tudo tem conexão! 😂",
      "É melhor não deixar nenhum dos dois com fome! A paciência acaba, o humor muda e qualquer coisinha vira motivo de estresse. A solução? Alimentar os dois antes que seja tarde! 😂❤️",
      "Ela sempre fala que já está terminando… mas esse “já” pode durar mais uns bons 40 minutos! E o Alisson? Só esperando! 😂",
      "Enquanto o Alisson está pensando no próximo fim de semana, a Erica já está planejando a casa nova, o carro, a próxima viagem, a África, a Disney, a Europa, Noronha, a carreira de blogueira e uma vida trabalhando de casa! Tudo isso, de preferência, para ontem! 😂✈️🌍"
    ] },

  { t: "Se você pudesse fazer um pedido para a nossa história, qual seria?", tipo: "livre",
    o: ["Que nosso amor continue crescendo a cada ano. ❤️", "Que Deus proteja nossa família e nossos caminhos. 🙏", "Que a gente realize todos os sonhos que ainda temos juntos. ✈️", "Que, independentemente do que aconteça, a gente nunca deixe de escolher um ao outro. 💍"],
    msg: "Pedido feito. Guardado com carinho. ✨" }
];

const QUIZ_TRANSICAO = {
  titulo: "Antes de terminar, tenho algo para te dizer… ❤️",
  msg: "Fim do quiz. Mas a nossa história está longe de terminar.",
  parabens: "Feliz aniversário, meu amor! ❤️"
};

const DECLARACAO = {
  titulo: "16 anos da nossa história. E eu ainda escolheria você. ❤️",
  texto: `
Meu amor,

Se alguém tivesse me contado, naquela época da escola, que uma conversa sobre um cubo mágico me levaria a viver uma história tão grande com você, talvez eu nem acreditasse.

Tudo começou com um primeiro beijo, em 13 de março de 2010, e desde então vivemos tantas coisas… Foram sonhos, planos, conquistas, desafios, viagens, risadas, lágrimas e momentos que só nós dois sabemos contar.

Naquela época, não fazíamos ideia de tudo o que a vida nos reservava. Não sabíamos quantas vezes precisaríamos ser fortes, quantas batalhas enfrentaríamos, quantas vezes precisaríamos aprender, amadurecer e escolher um ao outro novamente.

O tempo passou, nós crescemos, mudamos e construímos nossa história. E, embora nem tudo tenha sido fácil, chegamos até aqui com algo muito maior do que poderíamos imaginar naquele primeiro encontro: uma família.

Nossa história nunca foi um conto de fadas. Somos dois seres humanos, com defeitos, diferenças, manias e, claro, algumas discussões que às vezes começam porque eu me enrolo no raciocínio e você nem sabe mais onde tudo começou! KKKKK. 🤣

Mas é a nossa história. E eu não trocaria tudo o que vivemos por uma história perfeita, porque cada fase, cada desafio e cada conquista fazem parte de quem somos hoje.

E então Deus nos presenteou com a Manu. Nossa menina, que chegou para transformar tudo e dar um novo significado ao nosso amor. Deixamos de ser apenas dois sonhando com o futuro e nos tornamos uma família. E, quando olho para ela, consigo enxergar uma das partes mais bonitas de tudo o que construímos juntos.

Hoje estamos vivendo mais uma fase especial: a conquista da nossa casa, novos planos, novos desafios e tantos sonhos que ainda queremos realizar.

E você sabe que, quando o assunto é sonhar, eu não tenho limites! KKKKK. Ainda quero conhecer a África, a Disney, a Europa, Fernando de Noronha e tantos outros lugares. Quero viajar pelo Brasil e pelo mundo, conquistar nosso carro novo, realizar meus projetos, virar blogueira, ganhar dinheiro trabalhando de casa e cuidar de perto da nossa família. Minha lista parece não ter fim! 😂

Mas sabe o que existe por trás de todos esses planos? O desejo de construir uma vida feliz ao seu lado. De ter liberdade para viver momentos com nossos filhos, conhecer lugares novos, colecionar histórias e, daqui a muitos anos, olhar para trás e perceber o quanto fomos abençoados.

Porque, no meio de tantos sonhos, existe um que é maior do que todos: continuar tendo você ao meu lado.

Não sei quantos capítulos ainda teremos pela frente, quantas viagens faremos ou quantas conquistas celebraremos. Mas sei que quero continuar escrevendo cada um deles com você.

Se eu pudesse voltar àquele dia do nosso primeiro beijo, sabendo de tudo o que viria pela frente, eu ainda escolheria me aproximar de você. Escolheria viver essa história, construir nossa família e enfrentar os caminhos que nos trouxeram até aqui.

Que Deus continue sendo o centro da nossa família, protegendo nossos passos, fortalecendo nosso amor e nos dando sabedoria para viver tudo o que ainda está por vir.

Obrigada por fazer parte da minha história e por construir a sua comigo.

Depois de 16 anos, tantos beijos, tantas aventuras, tantas mudanças e tantos sonhos, eu ainda quero você. Para a nossa história, para a nossa família e para todos os planos malucos que ainda vamos realizar.

Feliz aniversário, meu amor!

Que venham muitos outros anos, muitas viagens, novas conquistas, muitos sonhos realizados e, principalmente, muitos momentos nossos.

Eu escolheria você de novo. E espero que a vida nos permita continuar nos escolhendo por muitos e muitos anos.

Eu amo você! ❤️
`
};
