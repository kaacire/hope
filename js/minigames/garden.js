/* ==========================================================
   garden.js — Minijogo 3: o jardim (regar os brotinhos)
   ----------------------------------------------------------
   Nove vasinhos em um quadrado. Segure o dedo (ou o mouse) em
   um vasinho para regar. Enquanto rega, a planta passa por
   estágios de crescimento até virar uma margarida:

     0 = só a terra   1 = broto   2 = botão   3 = margarida

   Você pode regar vários vasinhos ao mesmo tempo (vários dedos).
   Quando as nove viram margaridas, o jogo termina.

   TUDO se ajusta em config.minijogos.jardim:
     segundosPorEstagio = quanto tempo de rega para cada estágio
     colunas / linhas   = tamanho do jardim (3 x 3 = nove vasos)

   Para mexer no DESENHO das plantas, edite as funções
   "desenharEstagio..." logo abaixo: cada uma devolve um SVG
   numa área de 120 x 150.
   ========================================================== */

window.Diario = window.Diario || {};
Diario.minijogos = Diario.minijogos || {};

Diario.minijogos.jardim = (function () {

  const util = Diario.util;

  const ESTAGIO_FINAL = 3;


  /* ========================================================
     DESENHOS (área de 120 x 150; o solo fica em y = 104)
     ======================================================== */

  /* O vasinho com terra (igual em todos os estágios) */
  const VASO = ''
    + '<path class="tr rosa" d="M32 114 H88 L82 140 H38 Z"/>'
    + '<rect class="tr rosa" x="27" y="106" width="66" height="10" rx="3"/>'
    + '<path class="tr terra" d="M33 106 C44 98 76 98 87 106 Z"/>';


  /* Um par de folhinhas saindo do caule (altura y, tamanho t) */
  function folhas(y, tamanho) {
    const t = tamanho;

    return ''
      + '<path class="tr salvia" d="M60 ' + y + ' C' + (60 - t) + ' ' + (y - t * 0.6)
      +   ' ' + (60 - t * 1.4) + ' ' + (y - t * 0.1) + ' ' + (60 - t * 1.3) + ' ' + (y + t * 0.5)
      +   ' C' + (60 - t * 0.6) + ' ' + (y + t * 0.6) + ' 60 ' + (y + 2) + ' 60 ' + y + ' Z"/>'
      + '<path class="tr salvia" d="M60 ' + y + ' C' + (60 + t) + ' ' + (y - t * 0.6)
      +   ' ' + (60 + t * 1.4) + ' ' + (y - t * 0.1) + ' ' + (60 + t * 1.3) + ' ' + (y + t * 0.5)
      +   ' C' + (60 + t * 0.6) + ' ' + (y + t * 0.6) + ' 60 ' + (y + 2) + ' 60 ' + y + ' Z"/>';
  }


  /* Estágio 0: só a terra, com uma sementinha */
  function desenharEstagio0() {
    return VASO
      + '<ellipse class="tr vinho" cx="60" cy="103" rx="4" ry="2.6"/>';
  }


  /* Estágio 1: um brotinho */
  function desenharEstagio1() {
    return VASO
      + '<path class="tr" d="M60 104 C59 96 61 90 60 82"/>'
      + folhas(86, 11);
  }


  /* Estágio 2: planta mais alta, com o botão fechado */
  function desenharEstagio2() {
    return VASO
      + '<path class="tr" d="M60 104 C58 90 62 72 60 52"/>'
      + folhas(94, 14)
      + folhas(76, 11)
      + '<path class="tr salvia" d="M60 54 C48 50 48 30 60 24 C72 30 72 50 60 54 Z"/>'
      + '<path class="tr" d="M60 28 C57 36 57 44 60 52 M60 28 C63 36 63 44 60 52"/>';
  }


  /* Estágio 3: a margarida completa */
  function desenharEstagio3() {
    let petalas = "";

    for (let i = 0; i < 12; i++) {
      petalas += '<ellipse class="tr branca" cx="60" cy="25" rx="5.5" ry="13"'
               + ' transform="rotate(' + (i * 30) + ' 60 40)"/>';
    }

    return VASO
      + '<path class="tr" d="M60 104 C58 90 62 72 60 52"/>'
      + folhas(94, 14)
      + folhas(76, 11)
      + petalas
      + '<circle class="tr amarelo" cx="60" cy="40" r="8.5"/>';
  }


  const ESTAGIOS = [
    desenharEstagio0,
    desenharEstagio1,
    desenharEstagio2,
    desenharEstagio3
  ];


  /* O regador e as gotas (camada separada, sem o filtro de rabisco,
     para a animação continuar leve no celular) */
  const REGADOR = ''
    + '<g class="regador">'
    +   '<rect class="regador-corpo" x="68" y="8" width="34" height="26" rx="5"/>'
    +   '<path class="regador-corpo" d="M68 16 L50 8 L50 15 L68 26"/>'
    +   '<path class="regador-corpo" d="M102 13 C114 13 114 30 102 30"/>'
    + '</g>'
    + '<g class="gotas">'
    +   '<path class="gota gota-1" d="M46 22 v6"/>'
    +   '<path class="gota gota-2" d="M52 22 v6"/>'
    +   '<path class="gota gota-3" d="M40 22 v6"/>'
    + '</g>';


  /* ========================================================
     O MINIJOGO
     ======================================================== */

  function montar(raiz, ctx) {
    const cfg     = ctx.config;
    const colunas = cfg.colunas || 3;
    const linhas  = cfg.linhas  || 3;
    const total   = colunas * linhas;

    const segundosPorEstagio = cfg.segundosPorEstagio || 1.2;
    const segundosTotais     = segundosPorEstagio * ESTAGIO_FINAL;

    /* progresso[i] = segundos de rega acumulados no vaso i */
    const progresso = [];
    const estagios  = [];

    for (let i = 0; i < total; i++) {
      progresso.push(0);
      estagios.push(0);
    }

    /* Quem está regando agora: chave (dedo/tecla) -> índice do vaso */
    const regando = new Map();

    let venceu     = false;
    let quadro     = null;      // id do requestAnimationFrame
    let ultimoTemp = 0;


    /* ---- HTML ---- */

    let vasos = "";

    for (let i = 0; i < total; i++) {
      vasos += ''
        + '<button type="button" class="mg-vaso" data-vaso="' + i + '" '
        +         'aria-label="Полить растение ' + (i + 1) + '">'
        +   '<svg class="rabisco-svg planta-svg" viewBox="0 0 120 150" aria-hidden="true">'
        +     ESTAGIOS[0]()
        +   '</svg>'
        +   '<svg class="regador-svg" viewBox="0 0 120 150" aria-hidden="true">'
        +     REGADOR
        +   '</svg>'
        +   '<span class="mg-vaso-barra"><i></i></span>'
        + '</button>';
    }

    raiz.innerHTML = ''
      + '<h2 class="mg-titulo">' + cfg.titulo + '</h2>'
      + '<p class="mg-instrucao">' + cfg.instrucao + '</p>'
      + '<div class="mg-jardim" style="--colunas:' + colunas + '">' + vasos + '</div>'
      + '<p class="mg-mensagem" role="status"></p>';

    raiz.classList.add("mg-jardim-jogo");

    const grade    = raiz.querySelector(".mg-jardim");
    const botoes   = Array.prototype.slice.call(grade.querySelectorAll(".mg-vaso"));
    const mensagem = raiz.querySelector(".mg-mensagem");


    /* ---- Atualização visual ---- */

    function contarFloridas() {
      return estagios.filter(function (e) { return e === ESTAGIO_FINAL; }).length;
    }

    function atualizarMensagem() {
      mensagem.textContent = cfg.contador
        .replace("{n}", contarFloridas())
        .replace("{total}", total);
    }

    /* Redesenha a planta (só quando muda de estágio) */
    function trocarEstagio(i, novo) {
      estagios[i] = novo;

      botoes[i].querySelector(".planta-svg").innerHTML = ESTAGIOS[novo]();

      /* "pulinho" de crescimento */
      botoes[i].classList.remove("cresceu");
      void botoes[i].offsetWidth;
      botoes[i].classList.add("cresceu");

      atualizarMensagem();
    }

    function atualizarVaso(i) {
      /* Sempre um número inteiro entre 0 e ESTAGIO_FINAL */
      const novo = util.limitar(
        Math.floor(progresso[i] / segundosPorEstagio),
        0,
        ESTAGIO_FINAL
      );

      if (novo !== estagios[i]) trocarEstagio(i, novo);

      /* A barrinha mostra o progresso dentro do estágio atual */
      const dentro = (estagios[i] === ESTAGIO_FINAL)
        ? 1
        : (progresso[i] % segundosPorEstagio) / segundosPorEstagio;

      botoes[i].querySelector(".mg-vaso-barra i").style.width = Math.round(dentro * 100) + "%";
    }


    /* ---- Laço de tempo: roda só enquanto alguém está regando ---- */

    function passo(agora) {
      /* Limitado entre 0 e 0,1 s: o primeiro quadro pode chegar com
         um horário ligeiramente anterior e gerar um valor negativo. */
      const dt = util.limitar((agora - ultimoTemp) / 1000, 0, 0.1);
      ultimoTemp = agora;

      regando.forEach(function (indice) {
        if (estagios[indice] < ESTAGIO_FINAL) {
          progresso[indice] = Math.min(segundosTotais, progresso[indice] + dt);
          atualizarVaso(indice);
        }
      });

      if (contarFloridas() === total) {
        terminar();
        return;
      }

      quadro = regando.size > 0 ? requestAnimationFrame(passo) : null;
    }

    function garantirLaco() {
      if (quadro !== null) return;

      ultimoTemp = performance.now();
      quadro = requestAnimationFrame(passo);
    }

    function terminar() {
      venceu = true;
      quadro = null;

      regando.clear();
      botoes.forEach(function (b) { b.classList.remove("regando"); });

      raiz.classList.add("venceu");
      mensagem.textContent = cfg.mensagemVitoria;

      ctx.aoVencer();
    }


    /* ---- Começar / parar de regar ---- */

    function comecarARegar(chave, indice) {
      if (venceu || !ctx.ativo() || regando.has(chave)) return;

      regando.set(chave, indice);
      botoes[indice].classList.add("regando");

      garantirLaco();
    }

    function pararDeRegar(chave) {
      if (!regando.has(chave)) return;

      const indice = regando.get(chave);
      regando.delete(chave);

      /* O vaso só para de "regar" visualmente se ninguém mais o rega */
      const aindaRegado = Array.from(regando.values()).indexOf(indice) !== -1;

      if (!aindaRegado) botoes[indice].classList.remove("regando");
    }

    function indiceDoEvento(evento) {
      const botao = evento.target.closest("button[data-vaso]");

      return botao ? Number(botao.getAttribute("data-vaso")) : null;
    }


    /* ---- Entradas: toque/mouse e teclado ---- */

    function aoPressionar(evento) {
      const indice = indiceDoEvento(evento);

      if (indice !== null) comecarARegar("ponteiro-" + evento.pointerId, indice);
    }

    function aoSoltar(evento) {
      pararDeRegar("ponteiro-" + evento.pointerId);
    }

    function aoTeclarPara(evento) {
      if (evento.key !== " " && evento.key !== "Enter") return;
      if (evento.repeat) return;

      const indice = indiceDoEvento(evento);

      if (indice === null) return;

      evento.preventDefault();
      comecarARegar("tecla-" + indice, indice);
    }

    function aoSoltarTecla(evento) {
      const indice = indiceDoEvento(evento);

      if (indice !== null) pararDeRegar("tecla-" + indice);
    }

    function aoSairDoFoco(evento) {
      const indice = indiceDoEvento(evento);

      if (indice !== null) pararDeRegar("tecla-" + indice);
    }

    function semMenu(evento) {
      evento.preventDefault();            // evita o menu do toque longo
    }

    grade.addEventListener("pointerdown", aoPressionar);
    grade.addEventListener("keydown", aoTeclarPara);
    grade.addEventListener("keyup", aoSoltarTecla);
    grade.addEventListener("focusout", aoSairDoFoco);
    grade.addEventListener("contextmenu", semMenu);

    window.addEventListener("pointerup", aoSoltar);
    window.addEventListener("pointercancel", aoSoltar);

    atualizarMensagem();


    /* ---- Limpeza ---- */

    return {
      destruir: function () {
        if (quadro !== null) cancelAnimationFrame(quadro);

        grade.removeEventListener("pointerdown", aoPressionar);
        grade.removeEventListener("keydown", aoTeclarPara);
        grade.removeEventListener("keyup", aoSoltarTecla);
        grade.removeEventListener("focusout", aoSairDoFoco);
        grade.removeEventListener("contextmenu", semMenu);

        window.removeEventListener("pointerup", aoSoltar);
        window.removeEventListener("pointercancel", aoSoltar);
      }
    };
  }


  return { montar: montar };

})();
