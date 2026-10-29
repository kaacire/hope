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

  titulo: "Наша надежда",
  subtitulo: "Выбери дверь, чтобы начать",

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
    portaRotulo: "Открыть дверь",
    botaoContinuar: "Дальше →",
    botaoVoltarPortas: "← двери",

    /* {n} = número da página atual, {total} = total de conteúdos */
    contador: "{n} из {total}",

    retomarTexto: "Ты остановилась на странице {n} из {total}.",
    botaoRetomar: "Продолжить с того места, где остановилась",
    botaoRecomecar: "Начать сначала",

    fimTitulo: "Прежде чем ты стала той, кто ты сейчас...",
    fimTexto:
      "Жила-была девочка: она поливала свой маленький садик, училась у бабушки, смотрела на снег, искала небо на крышах и превращала детские площадки в целые миры. " +
      "Каждое место сохранило маленькую частицу тебя. И каждое из них навсегда останется в твоей памяти.",
    botaoVoltar: "Вернуться к дверям",
  },

  /* ========================================================
     7. MINIJOGOS
     ======================================================== */

  minijogos: {
    labirinto: {
      titulo: "Нарисованный лабиринт",
      instrucao:
        "Найди путь к двери. " +
        "Используй стрелки, клавиатуру или проведи пальцем.",
      colunas: 7,
      linhas: 8,
    },

    quebraCabeca: {
      titulo: "Собери воспоминание",
      instrucao: "Коснись одной детали, а затем другой, чтобы поменять их местами.",

      /* O desenho montado (nome de um desenho de js/doodles.js) */
      desenho: "flor",

      /* Quantidade de peças = colunas x linhas (2 x 3 = 6 peças) */
      colunas: 2,
      linhas: 3,
    },

    jardim: {
      titulo: "Сад",
      instrucao:
        "Удерживай палец на каждом горшочке, чтобы полить цветок.",
        

      /* Segundos de rega para passar de um estágio ao próximo.
         São 3 estágios (broto, botão, margarida), então cada planta
         leva 3 x este valor. Menor = mais rápido. */
      segundosPorEstagio: 1.2,

      /* 3 x 3 = nove vasinhos */
      colunas: 3,
      linhas: 3,

      /* {n} = margaridas prontas, {total} = quantidade de vasos */
      contador: "Расцвело: {n} из {total}",
      mensagemVitoria: "Сад расцвёл!",
    },

    /* (Opcional) Minijogo da fechadura: não está na sequência
       por padrão. Para usar, coloque "fechadura" em
       sequencia.minijogos. */
    fechadura: {
      titulo: "Замок",
      instrucao: "Вращай диски, чтобы угадать комбинацию.",

      /* Uma pista para cada dígito do código, na ordem.
         TROQUE por pistas que só vocês dois entendam. */
      pistas: [
        "1-я цифра: сколько пальцев на одной руке, минус четыре.",
        "2-я цифра: сколько сторон у треугольника.",
        "3-я цифра: сколько пальцев на одной руке.",
      ],

      /* Código certo. Precisa ter a mesma quantidade de dígitos
         que de pistas (cada dígito vai de 0 a 9). */
      codigo: [1, 3, 5],

      botaoAbrir: "Открыть",
      mensagemErro: "Ещё нет... попробуй снова.",
      mensagemAcerto: "Открылось!",
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
      titulo: "Воспоминания под дождём",
      nota: "стихотворение",
      texto: "Если бы я был дождём, смог бы я соединить своё сердце с твоим?<br>Так же, как дождь соединяет вечно далёкие друг от друга небо и землю.",
      ilustracao: "flor",
      imagem: "assets/illustrations/memoria-07.jpg",
      fundo: null,
    },
    {
      id: "memoria-02",
      titulo: "Ночь Вейнрёйт",
      nota: "стихотворение",
      texto: "Лучи солнца, что понемногу разгораются,<br>Лучи солнца, что понемногу омывают землю, стирают следы, оставленные на тонком слое снега.<br>Не бойся, что тебя обманут: пусть даже мир полон разочарований, всё равно есть те, кто хочет защитить твою улыбку.",
      ilustracao: "coracao",
      imagem: "assets/illustrations/memoria-04.jpg",
      fundo: null,
    },
    {
      id: "memoria-03",
      titulo: "Страх",
      nota: "стихотворение",
      texto: "Если бы мои слова обрели форму,<br>это было бы так, словно моя неудача дошла до тебя, застывшей во тьме.",
      ilustracao: "estrela",
      imagem: "assets/illustrations/memoria-01.jpg",
      fundo: null,
    },
    {
      id: "memoria-04",
      titulo: "Мои последние слова",
      nota: "стихотворение",
      texto: "Пока я не возьмусь за меч, я не смогу тебя защитить.<br>Пока я сжимаю меч, я не могу тебя обнять.",
      ilustracao: "arvore",
      imagem: "assets/illustrations/memoria-12.jpg",
      fundo: null,
    },
    {
      id: "memoria-05",
      titulo: "Мы",
      nota: "стихотворение",
      texto: "Как один — мы сплетены.<br>Как два — у нас не одно обличье.<br>Как три — у нас нет глаз.<br>Как четыре — у нас есть надежда.<br>А в пятом — там, где живёт сердце.",
      ilustracao: "portao",
      imagem: "assets/illustrations/memoria-03.jpg",
      fundo: null,
    },
    {
      id: "memoria-06",
      titulo: "Все слова",
      nota: "стихотворение",
      texto: "Слова — лучший способ говорить друг с другом.<br>«Люблю тебя», «ты мне нужна», «обожаю тебя».<br>Какой мне прок от всего этого... если тебя нет рядом?",
      ilustracao: "chave",
      imagem: "assets/illustrations/memoria-10.jpg",
      fundo: null,
    },
    {
      id: "memoria-07",
      titulo: "Воспоминания",
      nota: "расстояние решает не всё",
      texto: "Расстояние может разделить два мира, но сердце всегда ищет способ приблизиться к тому, кто ему дорог.",
      ilustracao: "sol",
      imagem: "assets/illustrations/memoria-02.jpg",
      fundo: null,
    },
    {
      id: "memoria-08",
      titulo: "Ночь синего неба",
      nota: "беречь твою улыбку",
      texto: "Даже если мир приносит разочарования, всё равно есть люди, которые хотят заботиться о тебе и беречь твою улыбку.",
      ilustracao: "lua",
      imagem: "assets/illustrations/memoria-05.jpg",
      fundo: null,
    },
    {
      id: "memoria-09",
      titulo: "Твой главный страх",
      nota: "страх не справиться",
      texto: "Иногда страх не справиться мешает выразить то, что мы на самом деле чувствуем. И всё же есть чувства, которые заслуживают найти дорогу к тебе.",
      ilustracao: "casa",
      imagem: "assets/illustrations/memoria-06.jpg",
      fundo: null,
    },
    {
      id: "memoria-10",
      titulo: "Моя последняя отвага",
      nota: "смелость опустить меч",
      texto: "Сила не только в том, чтобы поднять меч ради защиты любимого человека, но и в умении вовремя опустить его, чтобы обнять.",
      ilustracao: "borboleta",
      imagem: "assets/illustrations/memoria-11.jpg",
      fundo: null,
    },
    {
      id: "memoria-11",
      titulo: "Мы",
      nota: "маленькие частицы тебя",
      texto: "Два человека могут быть разными и жить в разных мирах, но всё равно найти друг в друге надежду и близость.",
      ilustracao: "envelope",
      imagem: "assets/illustrations/memoria-09.jpg",
      fundo: null,
    },
    {
      id: "memoria-12",
      titulo: "Это для тебя",
      nota: "хранить в сердце",
      texto: "Слова могут выразить то, что мы чувствуем, но ничто не заменит счастья быть рядом с теми, кого мы любим.",
      ilustracao: "livro",
      imagem: "assets/illustrations/memoria-08.jpg",
      fundo: null,
    }
  ],
};
