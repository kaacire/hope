/* ==========================================================
   puzzle.js — Minijogo 2: montar a lembrança
   ----------------------------------------------------------
   Um desenho é cortado em peças e embaralhado. Toque numa peça
   e depois em outra para trocá-las de lugar. Quando todas
   estiverem certas, o jogo termina.

   Configuração em config.minijogos.quebraCabeca:
     desenho  = nome de um desenho de js/doodles.js
     colunas  = peças na horizontal
     linhas   = peças na vertical

   Funciona só com toques/cliques (sem arrastar), o que também
   serve como alternativa acessível por teclado (Tab + Enter).
   ========================================================== */

window.Diario = window.Diario || {};
Diario.minijogos = Diario.minijogos || {};

Diario.minijogos.quebraCabeca = (function () {

  const util = Diario.util;

  const LARGURA_DESENHO = 200;


  /* Posiciona um desenho pequeno dentro da imagem */
  function canto(nome, x, y, escala) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + escala + ')">'
         + Diario.rabiscos.interno(nome)
         + "</g>";
  }


  /* O desenho completo que será cortado em peças */
  function montarDesenho(nome, largura, altura) {
    const escala = Math.min(largura, altura) / 200 * 0.8;
    const x      = largura / 2 - 100 * escala;
    const y      = altura  / 2 - 100 * escala;

    return ''
      + '<rect class="moldura-quebra" x="5" y="5" '
      +       'width="' + (largura - 10) + '" height="' + (altura - 10) + '" rx="6"/>'
      + '<g transform="translate(' + x + ' ' + y + ') scale(' + escala + ')">'
      +   Diario.rabiscos.interno(nome)
      + "</g>"
      + canto("estrela", 12, 12, 0.28)
      + canto("folha",   largura - 52, altura - 50, 0.25)
      + canto("coracao", 12, altura - 48, 0.22)
      + canto("capim",   largura - 50, 12, 0.22);
  }


  function montar(raiz, ctx) {
    const cfg     = ctx.config;
    const colunas = cfg.colunas;
    const linhas  = cfg.linhas;
    const total   = colunas * linhas;

    const largura = LARGURA_DESENHO;
    const altura  = LARGURA_DESENHO * linhas / colunas;

    const larguraPeca = largura / colunas;
    const alturaPeca  = altura  / linhas;

    const desenho = montarDesenho(cfg.desenho, largura, altura);


    /* ---- Estado ----
       slots[i] = qual peça está na posição i
       (a peça "certa" da posição i é a de número i) */

    const ordemCerta = [];
    for (let i = 0; i < total; i++) ordemCerta.push(i);

    function estaResolvido(lista) {
      return lista.every(function (peca, i) { return peca === i; });
    }

    let slots = util.embaralhar(ordemCerta);

    while (estaResolvido(slots)) {
      slots = util.embaralhar(ordemCerta);
    }

    let selecionado = null;
    let venceu      = false;


    /* ---- HTML ---- */

    raiz.innerHTML = ''
      + '<h2 class="mg-titulo">' + cfg.titulo + '</h2>'
      + '<p class="mg-instrucao">' + cfg.instrucao + '</p>'
      + '<div class="mg-pecas" style="--colunas:' + colunas + '"></div>';

    raiz.classList.add("mg-quebra-cabeca");

    const grade = raiz.querySelector(".mg-pecas");


    /* Cada peça é um recorte (viewBox) do desenho completo */
    function htmlPeca(numeroPeca, posicao) {
      const col = numeroPeca % colunas;
      const lin = Math.floor(numeroPeca / colunas);

      const classes = ["mg-peca"];

      if (posicao === selecionado)    classes.push("selecionada");
      if (numeroPeca === posicao)     classes.push("certa");

      return ''
        + '<button type="button" class="' + classes.join(" ") + '" '
        +         'data-posicao="' + posicao + '" '
        +         'aria-label="Фрагмент ' + (posicao + 1) + '">'
        +   '<svg viewBox="' + (col * larguraPeca) + " " + (lin * alturaPeca) + " "
        +                      larguraPeca + " " + alturaPeca + '" '
        +        'class="rabisco-svg" aria-hidden="true">'
        +     desenho
        +   "</svg>"
        + "</button>";
    }


    function desenharGrade() {
      grade.innerHTML = slots.map(htmlPeca).join("");
    }


    /* ---- Interação ---- */

    function aoClicar(evento) {
      if (venceu || !ctx.ativo()) return;

      const botao = evento.target.closest("button[data-posicao]");

      if (!botao) return;

      const posicao = Number(botao.getAttribute("data-posicao"));

      /* Primeiro toque: seleciona. Toque na mesma: desseleciona. */
      if (selecionado === null) {
        selecionado = posicao;
      } else if (selecionado === posicao) {
        selecionado = null;
      } else {
        /* Segundo toque em outra peça: troca as duas de lugar */
        const guardada      = slots[selecionado];
        slots[selecionado]  = slots[posicao];
        slots[posicao]      = guardada;
        selecionado         = null;
      }

      desenharGrade();

      if (estaResolvido(slots)) {
        venceu = true;
        raiz.classList.add("venceu");
        ctx.aoVencer();
      }
    }

    grade.addEventListener("click", aoClicar);

    desenharGrade();


    return {
      destruir: function () {
        grade.removeEventListener("click", aoClicar);
      }
    };
  }


  return { montar: montar };

})();
