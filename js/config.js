/* ==========================================================
   config.js — TUDO que você provavelmente vai querer mudar
   ----------------------------------------------------------
   Textos, regras da sequência, tempos da virada de página,
   conteúdos das 12 portas e ajustes dos 3 minijogos.

   Dica: quase nunca é preciso mexer nos outros arquivos .js.
   Para trocar cores, veja o início de css/style.css.
   ========================================================== */

window.Diario = window.Diario || {};

Diario.config = {
  /* ========================================================
     1. GERAL
     ======================================================== */

  titulo: "Nosso alento",
  subtitulo: "Escolha uma porta para começar",

  /* Guarda o progresso no navegador (localStorage).
     Se o site for recarregado, dá para continuar de onde parou. */
  salvarProgresso: true,
  chaveArmazenamento: "diario-interativo-v1",

  /* true  = clicar em qualquer ponto da tela avança a página
     false = só o botão "Continuar" avança */
  avancarClicandoNaTela: true,

  /* true  = a porta escolhida mostra o conteúdo de mesmo número
              (porta 05 -> conteúdo 05) e os outros 11 vêm embaralhados.
     false = os 12 conteúdos vêm embaralhados, em qualquer porta. */
  primeiroConteudoEhDaPorta: true,

  /* Música de fundo: começa ao abrir qualquer porta e toca em
     looping. Coloque o arquivo em assets/audio/ e ajuste o nome.
     volume: de 0 (mudo) a 1 (máximo). */
  musica: {
    arquivo: "assets/audio/musica.mp3",
    volume: 0.6,
  },

  /* ========================================================
     2. SEQUÊNCIA (conteúdos + minijogos)
     ======================================================== */

  sequencia: {
    /* Um minijogo aparece depois de cada N conteúdos.
       Com 12 conteúdos e N = 3, os minijogos surgem depois do
       3º, 6º e 9º conteúdo. */
    minijogoACada: 3,

    /* Ordem dos minijogos. Nomes válidos:
       "labirinto", "quebraCabeca", "jardim", "fechadura" */
    minijogos: ["labirinto", "quebraCabeca", "jardim"],

    /* Depois de vencer, avança sozinho (true)
       ou mostra o botão "Continuar" (false)? */
    avancarAutomaticoAposVitoria: true,
    atrasoAposVitoriaMs: 1100,
  },

  /* ========================================================
     3. VIRADA DE PÁGINA
     ======================================================== */

  virada: {
    duracaoMs: 800, // 650 a 850 funciona bem
    perspectivaPx: 1400, // 1200 a 1600
    easing: "cubic-bezier(.65, 0, .35, 1)",
  },

  /* ========================================================
     4. ESTILO DE RABISCO
     ======================================================== */

  estilo: {
    /* Filtro SVG que deixa as linhas "tremidas" como lápis.
       Se o celular ficar lento, coloque false. */
    filtroRabisco: true,

    /* Força do tremido. 0 = nenhuma, 2 a 4 = sutil, 6+ = bem torto */
    intensidadeRabisco: 3,
  },

  /* ========================================================
     5. FUNDO (o caminho desenhado)
     ======================================================== */

  fundo: {
    /* Mesma semente = mesmo caminho sempre.
       Troque o número para sortear outro desenho de caminho. */
    semente: 2026,

    /* Quantos desenhinhos (flores, árvores...) ao redor do caminho */
    quantidadeDecoracoes: 9,

    /* Quais desenhos podem aparecer ao redor do caminho.
       Nomes disponíveis: veja js/doodles.js */
    decoracoes: ["flor", "folha", "estrela", "arvore", "capim", "borboleta"],
  },

  /* ========================================================
     6. TEXTOS DA INTERFACE
     ======================================================== */

  textos: {
    portaRotulo: "Abrir porta",
    botaoContinuar: "Continuar →",
    botaoVoltarPortas: "← portas",

    /* {n} = número da página atual, {total} = total de conteúdos */
    contador: "{n} de {total}",

    retomarTexto: "Você deixou o alento na página {n} de {total}.",
    botaoRetomar: "Continuar de onde parei",
    botaoRecomecar: "Recomeçar do zero",

    fimTitulo: "Antes de você se tornar quem é hoje...",
    fimTexto:
      "Existiu uma menina que regava seu pequeno jardim, aprendia com a avó, observava a neve, procurava o céu nos telhados e transformava parquinhos em mundos inteiros. " +
      "Cada lugar guardou uma pequena parte de quem você é. E cada um deles estará para sempre guardado em sua memória.",
    botaoVoltar: "Voltar às portas",
  },

  /* ========================================================
     7. MINIJOGOS
     ======================================================== */

  minijogos: {
    labirinto: {
      titulo: "O labirinto desenhado",
      instrucao:
        "Encontre o caminho até a porta. " +
        "Use as setas, o teclado ou deslize o dedo.",
      colunas: 7,
      linhas: 8,
    },

    quebraCabeca: {
      titulo: "Monte a lembrança",
      instrucao: "Toque em uma peça e depois em outra para trocar de lugar.",

      /* O desenho montado (nome de um desenho de js/doodles.js) */
      desenho: "flor",

      /* Quantidade de peças = colunas x linhas (2 x 3 = 6 peças) */
      colunas: 2,
      linhas: 3,
    },

    jardim: {
      titulo: "O jardim",
      instrucao:
        "Segure o dedo em cada vasinho para regar. ",
        

      /* Segundos de rega para passar de um estágio ao próximo.
         São 3 estágios (broto, botão, margarida), então cada planta
         leva 3 x este valor. Menor = mais rápido. */
      segundosPorEstagio: 1.2,

      /* 3 x 3 = nove vasinhos */
      colunas: 3,
      linhas: 3,

      /* {n} = margaridas prontas, {total} = quantidade de vasos */
      contador: "{n} de {total} floridas",
      mensagemVitoria: "O jardim floresceu!",
    },

    /* (Opcional) Minijogo da fechadura: não está na sequência
       por padrão. Para usar, coloque "fechadura" em
       sequencia.minijogos. */
    fechadura: {
      titulo: "A fechadura",
      instrucao: "Gire os discos para descobrir a combinação.",

      /* Uma pista para cada dígito do código, na ordem.
         TROQUE por pistas que só vocês dois entendam. */
      pistas: [
        "1º número: quantos dedos tem uma mão, menos quatro.",
        "2º número: quantos lados tem um triângulo.",
        "3º número: quantos dedos tem uma mão.",
      ],

      /* Código certo. Precisa ter a mesma quantidade de dígitos
         que de pistas (cada dígito vai de 0 a 9). */
      codigo: [1, 3, 5],

      botaoAbrir: "Abrir",
      mensagemErro: "Ainda não... tente de novo.",
      mensagemAcerto: "Destrancou!",
    },
  },

  /* ========================================================
     8. OS 12 CONTEÚDOS (um por porta)
     --------------------------------------------------------
     A porta 01 corresponde ao 1º item da lista, a 02 ao 2º...

     id          nome único (não repita)
     titulo      título manuscrito
     nota        anotação pequena na margem (opcional, pode ser "")
     texto       o texto da página (aceita HTML simples: <br>, <em>)
     ilustracao  desenho de js/doodles.js que aparece na página
     imagem      (opcional) caminho de uma imagem sua para usar no
                 lugar do desenho. Ex.: "assets/illustrations/foto1.webp"
     fundo       (opcional) imagem de fundo sua para esta página.
                 Ex.: "assets/backgrounds/caminho-01.webp"
                 Se for null, usa o caminho desenhado pelo código.
     ======================================================== */

  conteudos: [
    {
      id: "memoria-01",
      titulo: "Memories in the Rain",
      nota: "poema",
      texto: "Se eu fosse a chuva, poderia unir meu coração ao seu?<br>Assim como ela une os eternamente distantes céu e terra.",
      ilustracao: "flor",
      imagem: "assets/illustrations/memoria-07.jpg",
      fundo: null,
    },
    {
      id: "memoria-02",
      titulo: "Night of Wijnruit",
      nota: "poema",
      texto: "Os raios de sol que aos poucos brilham<br>Os raios de sol que aos poucos banham a Terra apagam as pegadas deixadas na fina camada de neve.<br>Não tema ser iludida, pois, mesmo que o mundo esteja repleto de decepções, ainda existem aqueles que desejam proteger seu sorriso.",
      ilustracao: "coracao",
      imagem: "assets/illustrations/memoria-04.jpg",
      fundo: null,
    },
    {
      id: "memoria-03",
      titulo: "Medo",
      nota: "poema",
      texto: "Se minhas palavras tomassem forma,<br>seria como se meu fracasso chegasse até você, parado na escuridão.",
      ilustracao: "estrela",
      imagem: "assets/illustrations/memoria-01.jpg",
      fundo: null,
    },
    {
      id: "memoria-04",
      titulo: "My Last Words",
      nota: "poema",
      texto: "A menos que eu agarre a espada, eu não poderei proteger você.<br>Enquanto agarro a espada, eu não posso abraçar você.",
      ilustracao: "arvore",
      imagem: "assets/illustrations/memoria-12.jpg",
      fundo: null,
    },
    {
      id: "memoria-05",
      titulo: "Nós",
      nota: "poema",
      texto: "Como um: estamos entrelaçados.<br>Como dois: não compartilhamos uma mesma forma.<br>Como três: não temos olhos.<br>Como quatro: temos esperança.<br>No quinto: é onde está o coração.",
      ilustracao: "portao",
      imagem: "assets/illustrations/memoria-03.jpg",
      fundo: null,
    },
    {
      id: "memoria-06",
      titulo: "All the Words",
      nota: "poema",
      texto: "As palavras são a melhor forma de comunicação.<br>“Te amo”, “te quero”, “te adoro”.<br>De que me serve tudo isso... se não te tenho ao meu lado?",
      ilustracao: "chave",
      imagem: "assets/illustrations/memoria-10.jpg",
      fundo: null,
    },
    {
      id: "memoria-07",
      titulo: "Memories",
      nota: "a distância não decide tudo",
      texto: "A distância pode separar dois mundos, mas o coração sempre procura uma maneira de se aproximar de quem é especial.",
      ilustracao: "sol",
      imagem: "assets/illustrations/memoria-02.jpg",
      fundo: null,
    },
    {
      id: "memoria-08",
      titulo: "Night of Blue Skie",
      nota: "preservar o teu sorriso",
      texto: "Mesmo que o mundo traga decepções, ainda existem pessoas que desejam cuidar de você e preservar o seu sorriso.",
      ilustracao: "lua",
      imagem: "assets/illustrations/memoria-05.jpg",
      fundo: null,
    },
    {
      id: "memoria-09",
      titulo: "Your Best Fear",
      nota: "o medo de falhar",
      texto: "Às vezes, o medo de falhar torna difícil expressar aquilo que realmente sentimos. Ainda assim, há sentimentos que merecem encontrar o caminho até você.",
      ilustracao: "casa",
      imagem: "assets/illustrations/memoria-06.jpg",
      fundo: null,
    },
    {
      id: "memoria-10",
      titulo: "My Last Bravery",
      nota: "a coragem de baixar a espada",
      texto: "A força não está apenas em empunhar uma espada para proteger alguém, mas também em saber quando baixá-la para oferecer um abraço.",
      ilustracao: "borboleta",
      imagem: "assets/illustrations/memoria-11.jpg",
      fundo: null,
    },
    {
      id: "memoria-11",
      titulo: "Nós",
      nota: "pequenas partes de quem você é",
      texto: "Duas pessoas podem ser diferentes e viver em mundos distintos, mas ainda encontrar esperança e conexão uma na outra.",
      ilustracao: "envelope",
      imagem: "assets/illustrations/memoria-09.jpg",
      fundo: null,
    },
    {
      id: "memoria-12",
      titulo: "It's For You",
      nota: "para guardar no coração",
      texto: "As palavras podem expressar o que sentimos, mas nada substitui a felicidade de poder estar ao lado de quem queremos.",
      ilustracao: "livro",
      imagem: "assets/illustrations/memoria-08.jpg",
      fundo: null,
    }
  ],
};
