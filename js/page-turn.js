/* ==========================================================
   page-turn.js — a virada de página em 3D
   ----------------------------------------------------------
   Como funciona (em ordem):

     1. A PRÓXIMA página é montada "embaixo", escondida.
     2. A página atual (frente) gira em torno da borda esquerda.
     3. No meio da virada, quando a folha já cobre o conteúdo,
        o fundo troca (callback "aoMeio").
     4. Terminada a rotação, o conteúdo de baixo é movido para a
        frente e a folha volta à posição inicial, sem ninguém notar.
     5. Só então os cliques são liberados.

   Quem usa esta peça só precisa chamar:
     Diario.virada.virar(construir, aoMeio)

   "construir" recebe um elemento e deve preencher ele com a
   página nova.
   ========================================================== */

window.Diario = window.Diario || {};

Diario.virada = (function () {

  const util = Diario.util;

  let bloqueado = false;      // true enquanto a folha está girando

  const el = {};              // elementos do HTML


  function iniciar() {
    el.pilha   = document.getElementById("pilha");
    el.folha   = document.getElementById("folha-virando");
    el.frente  = document.getElementById("pagina-frente");
    el.embaixo = document.getElementById("pagina-embaixo");
  }


  function estaBloqueado() {
    return bloqueado;
  }


  /* Esvazia as duas páginas (usado ao voltar às portas) */
  function limpar() {
    el.frente.replaceChildren();
    el.embaixo.replaceChildren();
  }


  /* Mostra uma página SEM virar (primeira página, ao retomar) */
  function mostrar(construir) {
    el.frente.replaceChildren();
    construir(el.frente);

    if (util.reduzMovimento()) return;

    el.frente.classList.remove("surgindo");
    void el.frente.offsetWidth;
    el.frente.classList.add("surgindo");

    el.frente.addEventListener("animationend", function remover() {
      el.frente.classList.remove("surgindo");
      el.frente.removeEventListener("animationend", remover);
    });
  }


  /* Vira a página.
     Devolve uma Promise: true = virou, false = ignorado (já virando). */
  function virar(construir, aoMeio) {
    if (bloqueado) return Promise.resolve(false);

    bloqueado = true;

    /* 1. Prepara a próxima página embaixo */
    el.embaixo.replaceChildren();
    construir(el.embaixo);

    const duracao = util.reduzMovimento() ? 0 : Diario.config.virada.duracaoMs;

    /* Sem animação: troca direto */
    if (duracao === 0) {
      if (aoMeio) aoMeio();
      concluir();
      return Promise.resolve(true);
    }

    /* 2. Começa a girar */
    el.pilha.classList.add("virando");
    el.folha.classList.add("virando");

    return new Promise(function (resolver) {
      let terminou = false;

      /* 3. No meio da virada, troca o fundo */
      const temporizadorMeio = setTimeout(function () {
        if (aoMeio) aoMeio();
      }, duracao * 0.5);

      function terminar() {
        if (terminou) return;
        terminou = true;

        clearTimeout(temporizadorMeio);
        el.folha.removeEventListener("transitionend", aoTerminarTransicao);

        concluir();
        resolver(true);
      }

      function aoTerminarTransicao(evento) {
        if (evento.target === el.folha && evento.propertyName === "transform") {
          terminar();
        }
      }

      el.folha.addEventListener("transitionend", aoTerminarTransicao);

      /* Segurança: se o evento não vier, termina um pouco depois */
      setTimeout(terminar, duracao + 150);
    });
  }


  /* 4. Move o conteúdo de baixo para a frente e reseta a folha */
  function concluir() {
    el.frente.replaceChildren.apply(
      el.frente,
      Array.prototype.slice.call(el.embaixo.childNodes)
    );

    el.folha.style.transition = "none";
    el.folha.classList.remove("virando");

    void el.folha.offsetWidth;

    el.folha.style.transition = "";
    el.pilha.classList.remove("virando");

    /* 5. Libera os cliques */
    bloqueado = false;
  }


  return {
    iniciar:       iniciar,
    estaBloqueado: estaBloqueado,
    limpar:        limpar,
    mostrar:       mostrar,
    virar:         virar
  };

})();
