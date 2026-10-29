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

    fimTitulo: "Fim do caminho",
    fimTexto:
      "Você chegou até aqui. Edite este texto em js/config.js " +
      "e escreva a mensagem final do alento.",
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
      titulo: "O começo",
      nota: "(lembra?)",
      texto:
        "Tu és pra mim, um garoto igual a cem mil outros." +
        " Como assim?",
      ilustracao: "flor",
      imagem: null,
      fundo: null,
    },
    {
      id: "memoria-02",
      titulo: "Um riso",
      nota: "",
      texto: "Aos teus olhos, não passo de uma raposa igual a cem mil outras.",
      ilustracao: "coracao",
      imagem: null,
      fundo: null,
    },
    {
      id: "memoria-03",
      titulo: "A primeira conversa",
      nota: "foi sem querer",
      texto: "Não tenho necessidade de ti, e tu também não tens necessidade de mim." + 
      " Então quer dizer que se eu te cativar...",
      ilustracao: "estrela",
      imagem: null,
      fundo: null,
    },
    {
      id: "memoria-04",
      titulo: "Uma tarde qualquer",
      nota: "",
      texto:
        "Teremos necessidade um do outro. " +
        "Serás pra mim único no mundo.",
      ilustracao: "arvore",
      imagem: null,
      fundo: null,
    },
    {
      id: "memoria-05",
      titulo: "O lugar favorito",
      nota: "só nosso",
      texto: "Eu acho que eu entendo agora.",
      ilustracao: "portao",
      imagem: null,
      fundo: null,
    },
    {
      id: "memoria-06",
      titulo: "A chave",
      nota: "",
      texto: "Os espinhos em volta de mim não são para me proteger disso...",
      ilustracao: "chave",
      imagem: null,
      fundo: null,
    },
    {
      id: "memoria-07",
      titulo: "Dia de sol",
      nota: "Porque, de fato",
      texto: "Não existe utilidade...",
      ilustracao: "sol",
      imagem: null,
      fundo: null,
    },
    {
      id: "memoria-08",
      titulo: "Noite de lua",
      nota: "",
      texto: "... Em ferir alguém pra poder se proteger.",
      ilustracao: "lua",
      imagem: null,
      fundo: null,
    },
    {
      id: "memoria-09",
      titulo: "Eu cantei sobre nós",
      nota: "um dia...",
      texto:
        "No dia em que eu observei, " +
        "mil pôr do sóis.",
      ilustracao: "casa",
      imagem: null,
      fundo: null,
    },
    {
      id: "memoria-10",
      titulo: "Me diga, o que você vê?",
      nota: "",
      texto: "Um desenho de elefante dentro de uma cobra. " + "Um chapéu de cowboy daqueles da TV?",
      ilustracao: "borboleta",
      imagem: null,
      fundo: null,
    },
    {
      id: "memoria-11",
      titulo: "eu acho que enxerga você",
      nota: "não abra antes",
      texto:
        "De repente, vendamos os olhos. " + "E nada tem mais brilho aos nossos.",
      ilustracao: "envelope",
      imagem: null,
      fundo: null,
    },
    {
      id: "memoria-12",
      titulo: "Pequeno Principe",
      nota: "",
      texto:
        "Deixa eu descansar no teu colo. " +
        "Deixa o amor apagar o meu ódio.",
      ilustracao: "livro",
      imagem: null,
      fundo: null,
    },
  ],
};
