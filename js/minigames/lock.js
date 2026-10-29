/* ==========================================================
   lock.js — Minijogo 3: a fechadura
   ----------------------------------------------------------
   O jogador lê as pistas, gira os discos até formar a
   combinação e toca em "Abrir".

   TUDO se edita em config.minijogos.fechadura:
     pistas  = uma frase para cada dígito
     codigo  = os dígitos certos, ex.: [1, 3, 5]
   (a quantidade de discos acompanha o tamanho do código)
   ========================================================== */

window.Diario = window.Diario || {};
Diario.minijogos = Diario.minijogos || {};

Diario.minijogos.fechadura = (function () {

  const CADEADO_SVG = ''
    + '<svg class="rabisco-svg" viewBox="0 0 120 130" aria-hidden="true">'
    +   '<path class="tr grilhao" d="M38 58 V40 C38 14 82 14 82 40 V58"/>'
    +   '<rect class="tr vinho" x="24" y="56" width="72" height="58" rx="8"/>'
    +   '<circle class="tr papel" cx="60" cy="82" r="7"/>'
    +   '<path class="tr" d="M60 88 V102"/>'
    + "</svg>";


  function montar(raiz, ctx) {
    const cfg     = ctx.config;
    const codigo  = cfg.codigo;
    const digitos = codigo.map(function () { return 0; });

    let venceu = false;


    /* ---- HTML ---- */

    const pistas = cfg.pistas.map(function (pista) {
      return "<li>" + pista + "</li>";
    }).join("");

    const discos = digitos.map(function (_, i) {
      return ''
        + '<div class="mg-disco">'
        +   '<button type="button" class="mg-seta" data-disco="' + i + '" data-passo="1" '
        +           'aria-label="Увеличить цифру ' + (i + 1) + '">▲</button>'
        +   '<span class="mg-digito" data-digito="' + i + '">0</span>'
        +   '<button type="button" class="mg-seta" data-disco="' + i + '" data-passo="-1" '
        +           'aria-label="Уменьшить цифру ' + (i + 1) + '">▼</button>'
        + "</div>";
    }).join("");

    raiz.innerHTML = ''
      + '<h2 class="mg-titulo">' + cfg.titulo + '</h2>'
      + '<p class="mg-instrucao">' + cfg.instrucao + '</p>'
      + '<ul class="mg-pistas">' + pistas + '</ul>'
      + '<div class="mg-cadeado">' + CADEADO_SVG + '</div>'
      + '<div class="mg-discos">' + discos + '</div>'
      + '<button type="button" class="botao-nota mg-abrir">' + cfg.botaoAbrir + '</button>'
      + '<p class="mg-mensagem" role="status"></p>';

    raiz.classList.add("mg-fechadura");

    const areaDiscos = raiz.querySelector(".mg-discos");
    const mensagem   = raiz.querySelector(".mg-mensagem");
    const botaoAbrir = raiz.querySelector(".mg-abrir");


    /* ---- Interação ---- */

    function girar(disco, passo) {
      digitos[disco] = (digitos[disco] + passo + 10) % 10;

      raiz.querySelector('[data-digito="' + disco + '"]').textContent = digitos[disco];

      mensagem.textContent = "";
    }

    function aoClicarDisco(evento) {
      const botao = evento.target.closest("button[data-disco]");

      if (!botao || venceu || !ctx.ativo()) return;

      girar(
        Number(botao.getAttribute("data-disco")),
        Number(botao.getAttribute("data-passo"))
      );
    }

    function combinacaoCerta() {
      return digitos.every(function (digito, i) { return digito === codigo[i]; });
    }

    function aoClicarAbrir() {
      if (venceu || !ctx.ativo()) return;

      if (combinacaoCerta()) {
        venceu = true;

        raiz.classList.add("aberto", "venceu");
        mensagem.textContent = cfg.mensagemAcerto;

        ctx.aoVencer();
        return;
      }

      /* Errou: tremida + mensagem */
      mensagem.textContent = cfg.mensagemErro;

      areaDiscos.classList.remove("errou");
      void areaDiscos.offsetWidth;
      areaDiscos.classList.add("errou");
    }

    areaDiscos.addEventListener("click", aoClicarDisco);
    botaoAbrir.addEventListener("click", aoClicarAbrir);


    return {
      destruir: function () {
        areaDiscos.removeEventListener("click", aoClicarDisco);
        botaoAbrir.removeEventListener("click", aoClicarAbrir);
      }
    };
  }


  return { montar: montar };

})();
