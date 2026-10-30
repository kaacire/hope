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

  titulo: "Наша отрада",
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
    botaoContinuar: "Продолжить →",
    botaoVoltarPortas: "← двери",

    /* {n} = número da página atual, {total} = total de conteúdos */
    contador: "{n} из {total}",

    retomarTexto: "Ты остановилась на странице {n} из {total}.",
    botaoRetomar: "Продолжить с места остановки",
    botaoRecomecar: "Начать сначала",

    fimTitulo: "Прежде чем ты стала той, кто ты сегодня...",
    fimTexto:
      "Жила-была девочка, которая поливала свой маленький садик, училась у бабушки, смотрела на снег, искала небо на крышах и превращала детские площадки в целые миры. " +
      "Каждое место сохранило маленькую частичку той, кто ты есть. И каждое из них навсегда останется в твоей памяти.",
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
      instrucao: "Коснись одного фрагмента, а потом другого, чтобы поменять их местами.",

      /* O desenho montado (nome de um desenho de js/doodles.js) */
      desenho: "flor",

      /* Quantidade de peças = colunas x linhas (2 x 3 = 6 peças) */
      colunas: 2,
      linhas: 3,
    },

    jardim: {
      titulo: "Сад",
      instrucao:
        "Удерживай палец на каждом горшочке, чтобы полить растение.",
        

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
      instrucao: "Поверни диски, чтобы угадать комбинацию.",

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
      mensagemAcerto: "Замок открыт!",
    },
  },

  /* ========================================================
     7b. ÚLTIMA SEÇÃO: O CÉU
     --------------------------------------------------------
     Depois da página final, o site sobe para um céu de espaço
     com estrelas e constelações. No meio aparece o título e,
     abaixo, as estrelas formam um bolo com uma vela.
     ======================================================== */

  ceu: {
    /* false = desliga a seção (o alento termina na página final) */
    ativo: true,

    /* O texto que aparece no meio do céu */
    titulo: "С днём рождения!",

    /* Duração da subida (o mundo de papel saindo por cima) */
    subidaMs: 2200,
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
      titulo: "Сад",
      nota: "Солнечный день",
      texto: "С лейкой в руках ты ухаживала за растениями в саду, внимательно поливая каждое. Среди земли, листьев и цветов этот маленький уголок был частью твоих детских дней.",
      ilustracao: "flor",
      imagem: "assets/illustrations/memoria-07.jpg",
      fundo: null,
    },
    {
      id: "memoria-02",
      titulo: "Ночь Wijnruit",
      nota: "Видишь звёзды?",
      texto: "Лучи солнца, что понемногу разгораются<br>Лучи солнца, что понемногу омывают Землю, стирают следы, оставленные на тонком слое снега.<br>Не бойся быть обманутой: даже если мир полон разочарований, всё ещё есть те, кто хочет защитить твою улыбку.",
      ilustracao: "coracao",
      imagem: "assets/illustrations/memoria-04.jpg",
      fundo: null,
    },
    {
      id: "memoria-03",
      titulo: "Падение неба",
      nota: "становится поздно",
      texto: "Снег медленно падал, укрывая белым улицы, крыши и сады.<br>Пейзаж менялся у тебя на глазах, и зима дарила иную красоту знакомым тебе местам.",
      ilustracao: "estrela",
      imagem: "assets/illustrations/memoria-01.jpg",
      fundo: null,
    },
    {
      id: "memoria-04",
      titulo: "Детская площадка",
      nota: "так красиво",
      texto: "На площадке дни были наполнены играми, качелями и открытиями. Каждая забава дарила новое приключение, и это место становилось целым миром, где можно исследовать, бегать и веселиться.",
      ilustracao: "arvore",
      imagem: "assets/illustrations/memoria-12.jpg",
      fundo: null,
    },
    {
      id: "memoria-05",
      titulo: "Мы",
      nota: "В день, когда мне довелось увидеть<br>тысячу закатов",
      texto: "Как один: мы переплетены.<br>Как два: у нас не одна и та же форма.<br>Как три: у нас нет глаз.<br>Как четыре: у нас есть надежда.<br>В пятом: там, где находится сердце.",
      ilustracao: "portao",
      imagem: "assets/illustrations/memoria-03.jpg",
      fundo: null,
    },
    {
      id: "memoria-06",
      titulo: "Все слова",
      nota: "Для всех",
      texto: "Слова — лучший способ общения.<br>«Я тебя люблю», «ты мне дорога», «я тебя обожаю».<br>Какой в них смысл... если тебя нет рядом со мной?",
      ilustracao: "chave",
      imagem: "assets/illustrations/memoria-10.jpg",
      fundo: null,
    },
    {
      id: "memoria-07",
      titulo: "Уроки у бабушки",
      nota: "немного ностальгично, правда?",
      texto: "Рядом с бабушкой ты училась шить, узнавая ткани, нитки и стежки. Между делами вы делились мгновениями, которые становились частью твоей истории и сохранённых воспоминаний о том времени.",
      ilustracao: "sol",
      imagem: "assets/illustrations/memoria-02.jpg",
      fundo: null,
    },
    {
      id: "memoria-08",
      titulo: "Ночь синего неба",
      nota: "сберечь твою улыбку",
      texto: "Даже если мир приносит разочарования, всё равно есть люди, которые хотят заботиться о тебе и беречь твою улыбку.",
      ilustracao: "lua",
      imagem: "assets/illustrations/memoria-05.jpg",
      fundo: null,
    },
    {
      id: "memoria-09",
      titulo: "Твой лучший страх",
      nota: "страх потерпеть неудачу",
      texto: "Иногда страх неудачи мешает выразить то, что мы по-настоящему чувствуем. И всё же есть чувства, которые заслуживают найти путь к тебе.",
      ilustracao: "casa",
      imagem: "assets/illustrations/memoria-06.jpg",
      fundo: null,
    },
    {
      id: "memoria-10",
      titulo: "Моя последняя смелость",
      nota: "смелость опустить меч",
      texto: "Сила не только в том, чтобы поднять меч и защитить кого-то, но и в том, чтобы знать, когда его опустить и подарить объятие.",
      ilustracao: "borboleta",
      imagem: "assets/illustrations/memoria-11.jpg",
      fundo: null,
    },
    {
      id: "memoria-11",
      titulo: "Между крышами и небом",
      nota: "маленькие частички тебя",
      texto: "Ты поднималась на крыши, чтобы смотреть на небо, находя место, откуда можно взглянуть на мир иначе.<br>Между домами и облаками эти мгновения были частью твоих детских приключений.",
      ilustracao: "envelope",
      imagem: "assets/illustrations/memoria-09.jpg",
      fundo: null,
    },
    {
      id: "memoria-12",
      titulo: "Воспоминания под дождём",
      nota: "Даже если день солнечный...",
      texto: "Будь я дождём, смогло бы моё сердце соединиться с твоим?<br>Так же, как он соединяет вечно далёкие небо и землю.<br>Расстояние может разделить два мира, но сердце всегда ищет способ приблизиться к тому, кто ему дорог.",
      ilustracao: "livro",
      imagem: "assets/illustrations/memoria-08.jpg",
      fundo: null,
    }
  ],
};
