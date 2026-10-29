/* ==========================================================
   background.js — o caminho desenhado do fundo
   ----------------------------------------------------------
   Cada página do alento tem o seu trecho do caminho. O fim de
   um trecho encaixa no começo do seguinte, então o caminho
   parece contínuo conforme o usuário avança.

   O desenho é gerado por código (SVG), de forma repetível:
   a mesma config.fundo.semente gera sempre o mesmo caminho.

   Quer usar suas próprias ilustrações? Em config.js, preencha
   "fundo" em cada conteúdo com o caminho de uma imagem. Se a
   imagem não carregar, o caminho desenhado entra no lugar.
   ========================================================== */

window.Diario = window.Diario || {};

Diario.fundo = (function () {
  const util = Diario.util;

  const LARGURA = 400; // área do desenho (proporção 1:2, celular em pé)
  const ALTURA = 800;

  let camadas = []; // as duas camadas que se alternam
  let camadaAtual = 0;
  let chaveAtual = null; // evita redesenhar a mesma cena
  let ancoras = null; // posição horizontal onde cada trecho começa/termina

  /* Guarda as duas camadas de fundo do HTML */
  function iniciar(container) {
    camadas = Array.prototype.slice.call(
      container.querySelectorAll(".fundo-camada"),
    );
  }

  /* Limpa tudo (usado ao voltar às portas) */
  function reiniciar() {
    chaveAtual = null;

    camadas.forEach(function (camada) {
      camada.classList.remove("visivel");
      camada.innerHTML = "";
    });
  }

  /* ------------------------------------------------------
     Pontos de encaixe entre os trechos do caminho
     ------------------------------------------------------ */

  function calcularAncoras(total) {
    const rand = util.criarGerador(Diario.config.fundo.semente);
    const lista = [200];

    for (let i = 0; i < total; i++) {
      let x;

      do {
        x = 105 + rand() * 190;
      } while (Math.abs(x - lista[lista.length - 1]) < 45);

      lista.push(x);
    }

    return lista;
  }

  /* ------------------------------------------------------
     A curva do caminho
     ------------------------------------------------------ */

  /* Pontos de controle: de baixo (y = 840) até o topo (y = -40) */
  function criarControles(xIni, xFim, rand) {
    function entre(t, variacao) {
      const x = xIni + (xFim - xIni) * t + (rand() - 0.5) * variacao;
      return util.limitar(x, 85, 315);
    }

    return [
      { x: xIni, y: 840 },
      { x: entre(0.3, 130), y: 640 },
      { x: entre(0.55, 150), y: 420 },
      { x: entre(0.78, 130), y: 200 },
      { x: xFim, y: -40 },
    ];
  }

  /* Posição horizontal do caminho numa certa altura (curva suave) */
  function xNaAltura(controles, y) {
    for (let i = 0; i < controles.length - 1; i++) {
      const a = controles[i];
      const b = controles[i + 1];

      if (y <= a.y && y >= b.y) {
        const t = (a.y - y) / (a.y - b.y);
        const suave = (1 - Math.cos(Math.PI * t)) / 2;

        return a.x + (b.x - a.x) * suave;
      }
    }

    return controles[0].x;
  }

  /* Transforma a curva num atributo "d" de <path> com leve tremido */
  function montarTrilha(controles, rand) {
    const pontos = [];

    for (let y = 840; y >= -40; y -= 55) {
      pontos.push({
        x: xNaAltura(controles, y) + (rand() - 0.5) * 7,
        y: y + (rand() - 0.5) * 4,
      });
    }

    let d =
      "M " + util.arredondar(pontos[0].x) + " " + util.arredondar(pontos[0].y);

    for (let i = 1; i < pontos.length - 1; i++) {
      const meioX = (pontos[i].x + pontos[i + 1].x) / 2;
      const meioY = (pontos[i].y + pontos[i + 1].y) / 2;

      d +=
        " Q " +
        util.arredondar(pontos[i].x) +
        " " +
        util.arredondar(pontos[i].y) +
        " " +
        util.arredondar(meioX) +
        " " +
        util.arredondar(meioY);
    }

    const ultimo = pontos[pontos.length - 1];
    d += " L " + util.arredondar(ultimo.x) + " " + util.arredondar(ultimo.y);

    return d;
  }

  /* ------------------------------------------------------
     Desenhinhos ao redor do caminho
     ------------------------------------------------------ */

  /* Posiciona um desenho de doodles.js (200x200) na cena */
  function colocarDesenho(nome, centroX, centroY, escala, espelhar) {
    const lado = espelhar ? -1 : 1;
    const x = centroX - 100 * escala * lado;
    const y = centroY - 100 * escala;

    return (
      '<g class="deco" transform="translate(' +
      util.arredondar(x) +
      " " +
      util.arredondar(y) +
      ") scale(" +
      util.arredondar(escala * lado) +
      " " +
      escala +
      ')">' +
      Diario.rabiscos.interno(nome) +
      "</g>"
    );
  }

  function montarDecoracoes(controles, rand) {
    const cfg = Diario.config.fundo;
    let svg = "";

    for (let i = 0; i < cfg.quantidadeDecoracoes; i++) {
      const y = 50 + (i + rand() * 0.8) * (700 / cfg.quantidadeDecoracoes);
      const lado = i % 2 === 0 ? -1 : 1; // alterna esquerda/direita
      const distancia = 78 + rand() * 55;
      const x = util.limitar(
        xNaAltura(controles, y) + lado * distancia,
        30,
        370,
      );
      const nome = cfg.decoracoes[Math.floor(rand() * cfg.decoracoes.length)];
      const escala = 0.26 + rand() * 0.2;

      svg += colocarDesenho(nome, x, y, escala, rand() > 0.5);
    }

    return svg;
  }

  /* ------------------------------------------------------
     A cena completa (um SVG)
     ------------------------------------------------------ */

  function criarCena(posicao, total) {
    const config = Diario.config;
    const rand = util.criarGerador(
      config.fundo.semente * 1000 + posicao * 97 + 13,
    );

    const xIni = ancoras[posicao];
    const xFim = ancoras[posicao + 1];

    const controles = criarControles(xIni, xFim, rand);
    const trilha = montarTrilha(controles, rand);
    const decoracoes = montarDecoracoes(controles, rand);

    /* O portão marca o início do caminho; a casa, o fim */
    let marcos = "";

    if (posicao === 0)
      marcos += colocarDesenho("portao", xIni, 762, 0.6, false);
    if (posicao === total - 1)
      marcos += colocarDesenho("casa", xFim, 78, 0.55, false);

    const filtro = config.estilo.filtroRabisco ? ' filter="url(#rabisco)"' : "";

    return (
      "" +
      '<svg class="cena" viewBox="0 0 ' +
      LARGURA +
      " " +
      ALTURA +
      '" ' +
      'preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<g class="deco-grupo"' +
      filtro +
      ">" +
      decoracoes +
      "</g>" +
      '<path class="trilha-borda"  pathLength="1" d="' +
      trilha +
      '"/>' +
      '<path class="trilha-miolo"  pathLength="1" d="' +
      trilha +
      '"/>' +
      '<path class="trilha-centro" d="' +
      trilha +
      '"/>' +
      '<g class="deco-grupo"' +
      filtro +
      ">" +
      marcos +
      "</g>" +
      "</svg>"
    );
  }

  /* Coloca uma imagem do usuário por cima (se existir) */
  function anexarImagem(camada, conteudo) {
    if (!conteudo || !conteudo.fundo) return;

    const imagem = new Image();

    imagem.className = "cena-imagem";
    imagem.alt = "";

    /* Se não carregar, some e o caminho desenhado continua visível */
    imagem.onerror = function () {
      imagem.remove();
    };
    imagem.src = conteudo.fundo;

    camada.appendChild(imagem);
  }

  /* ------------------------------------------------------
     Mostrar uma cena
     posicao  = número do conteúdo na ordem sorteada (0 a 11)
     imediato = true para não fazer transição suave
     ------------------------------------------------------ */

  function mostrar(posicao, conteudo, imediato) {
    const total = Diario.config.conteudos.length;

    if (posicao === chaveAtual) return;
    chaveAtual = posicao;

    if (!ancoras) ancoras = calcularAncoras(total);

    const antiga = camadas[camadaAtual];

    camadaAtual = (camadaAtual + 1) % 2;

    const nova = camadas[camadaAtual];

    nova.innerHTML = criarCena(posicao, total);
    anexarImagem(nova, conteudo);

    if (imediato) {
      nova.classList.add("sem-transicao");
      antiga.classList.add("sem-transicao");
    }

    void nova.offsetWidth; // força o navegador a aplicar o estado inicial

    nova.classList.add("visivel");
    antiga.classList.remove("visivel");

    if (imediato) {
      setTimeout(function () {
        nova.classList.remove("sem-transicao");
        antiga.classList.remove("sem-transicao");
      }, 60);
    }
  }

  /* Carrega a imagem de fundo antes de precisar dela */
  function preCarregar(conteudo) {
    if (conteudo && conteudo.fundo) {
      new Image().src = conteudo.fundo;
    }
  }

  return {
    iniciar: iniciar,
    reiniciar: reiniciar,
    mostrar: mostrar,
    preCarregar: preCarregar,
  };
})();
