/* ==========================================================
   maze.js — Minijogo 1: o labirinto desenhado
   ----------------------------------------------------------
   Tamanho do labirinto: config.minijogos.labirinto
   (colunas e linhas). Um labirinto novo é sorteado a cada vez.

   Controles: setas na tela, teclado (setas ou WASD) e deslizar
   o dedo. Cada comando move UMA casa por vez (sem movimento automático).

   Todos os minijogos seguem o mesmo contrato:
     montar(raiz, ctx) -> { destruir() }
       raiz = elemento onde o jogo se desenha
       ctx.config   = configurações deste minijogo
       ctx.ativo()  = o jogo pode receber comandos agora?
       ctx.aoVencer() = chame quando o jogador vencer
   ========================================================== */

window.Diario = window.Diario || {};
Diario.minijogos = Diario.minijogos || {};

Diario.minijogos.labirinto = (function () {

  const util = Diario.util;

  const TAMANHO = 40;          // tamanho de cada célula no desenho

  const DIRECOES = {
    cima:     { dx:  0, dy: -1, parede: "N", oposta: "baixo" },
    direita:  { dx:  1, dy:  0, parede: "E", oposta: "esquerda" },
    baixo:    { dx:  0, dy:  1, parede: "S", oposta: "cima" },
    esquerda: { dx: -1, dy:  0, parede: "W", oposta: "direita" }
  };


  /* ------------------------------------------------------
     Gerar o labirinto (busca em profundidade)
     ------------------------------------------------------ */

  function gerarLabirinto(colunas, linhas) {
    const celulas = [];

    for (let y = 0; y < linhas; y++) {
      const linha = [];

      for (let x = 0; x < colunas; x++) {
        linha.push({ N: true, E: true, S: true, W: true, visitada: false });
      }

      celulas.push(linha);
    }

    const pilha = [{ x: 0, y: 0 }];
    celulas[0][0].visitada = true;

    while (pilha.length > 0) {
      const atual = pilha[pilha.length - 1];

      const vizinhos = util.embaralhar(Object.keys(DIRECOES))
        .map(function (nome) {
          const d = DIRECOES[nome];
          return { nome: nome, x: atual.x + d.dx, y: atual.y + d.dy };
        })
        .filter(function (v) {
          return v.x >= 0 && v.x < colunas
              && v.y >= 0 && v.y < linhas
              && !celulas[v.y][v.x].visitada;
        });

      if (vizinhos.length === 0) {
        pilha.pop();
        continue;
      }

      const escolhido = vizinhos[0];
      const direcao   = DIRECOES[escolhido.nome];

      /* Derruba a parede entre as duas células */
      celulas[atual.y][atual.x][direcao.parede] = false;
      celulas[escolhido.y][escolhido.x][DIRECOES[direcao.oposta].parede] = false;

      celulas[escolhido.y][escolhido.x].visitada = true;
      pilha.push({ x: escolhido.x, y: escolhido.y });
    }

    /* Entrada (canto superior esquerdo) e saída (canto inferior direito) */
    celulas[0][0].W = false;
    celulas[linhas - 1][colunas - 1].E = false;

    return celulas;
  }


  /* ------------------------------------------------------
     Desenho
     ------------------------------------------------------ */

  /* Uma linha com leve curva, como feita à mão */
  function linhaTremida(x1, y1, x2, y2) {
    const meioX = (x1 + x2) / 2 + (Math.random() - 0.5) * 3;
    const meioY = (y1 + y2) / 2 + (Math.random() - 0.5) * 3;

    return "M" + x1 + " " + y1
         + " Q" + meioX.toFixed(1) + " " + meioY.toFixed(1)
         + " "  + x2 + " " + y2 + " ";
  }


  function desenharParedes(celulas, colunas, linhas) {
    let d = "";

    for (let y = 0; y < linhas; y++) {
      for (let x = 0; x < colunas; x++) {
        const c  = celulas[y][x];
        const x0 = x * TAMANHO;
        const y0 = y * TAMANHO;
        const x1 = x0 + TAMANHO;
        const y1 = y0 + TAMANHO;

        if (c.N) d += linhaTremida(x0, y0, x1, y0);
        if (c.W) d += linhaTremida(x0, y0, x0, y1);

        /* Bordas direita e de baixo só na última coluna/linha */
        if (x === colunas - 1 && c.E) d += linhaTremida(x1, y0, x1, y1);
        if (y === linhas  - 1 && c.S) d += linhaTremida(x0, y1, x1, y1);
      }
    }

    return d;
  }


  /* ------------------------------------------------------
     O minijogo
     ------------------------------------------------------ */

  function montar(raiz, ctx) {
    const cfg     = ctx.config;
    const colunas = cfg.colunas;
    const linhas  = cfg.linhas;
    const celulas = gerarLabirinto(colunas, linhas);

    const jogador = { x: 0, y: 0 };

    let venceu  = false;


    /* ---- HTML ---- */

    const largura = colunas * TAMANHO;
    const altura  = linhas  * TAMANHO;

    raiz.innerHTML = ''
      + '<h2 class="mg-titulo">' + cfg.titulo + '</h2>'
      + '<p class="mg-instrucao">' + cfg.instrucao + '</p>'

      + '<div class="mg-labirinto-area">'
      +   '<svg viewBox="-8 -8 ' + (largura + 16) + ' ' + (altura + 16) + '" '
      +        'aria-label="Лабиринт">'
      +     '<path class="mg-parede" d="' + desenharParedes(celulas, colunas, linhas) + '"/>'
      +     '<g transform="translate(' + ((colunas - 1) * TAMANHO) + ' ' + ((linhas - 1) * TAMANHO)
      +        ') scale(0.2)">' + Diario.rabiscos.interno("portao") + '</g>'
      +     '<g class="mg-jogador"><circle r="8" cx="0" cy="0"/></g>'
      +   '</svg>'
      + '</div>'

      + '<div class="mg-direcional">'
      +   '<button type="button" class="mg-seta-cima"     data-dir="cima"     aria-label="Вверх">▲</button>'
      +   '<button type="button" class="mg-seta-esquerda" data-dir="esquerda" aria-label="Влево">◀</button>'
      +   '<button type="button" class="mg-seta-baixo"    data-dir="baixo"    aria-label="Вниз">▼</button>'
      +   '<button type="button" class="mg-seta-direita"  data-dir="direita"  aria-label="Вправо">▶</button>'
      + '</div>';

    raiz.classList.add("mg-labirinto");

    const area     = raiz.querySelector(".mg-labirinto-area");
    const peca     = raiz.querySelector(".mg-jogador");


    /* ---- Movimento ---- */

    function posicionarJogador() {
      const px = (jogador.x + 0.5) * TAMANHO;
      const py = (jogador.y + 0.5) * TAMANHO;

      peca.style.transform = "translate(" + px + "px, " + py + "px)";
    }

    function direcoesLivres(x, y) {
      return Object.keys(DIRECOES).filter(function (nome) {
        const d  = DIRECOES[nome];
        const nx = x + d.dx;
        const ny = y + d.dy;

        const dentro = nx >= 0 && nx < colunas && ny >= 0 && ny < linhas;

        return dentro && !celulas[y][x][d.parede];
      });
    }

    /* Dá um passo. Devolve true se andou. */
    function darPasso(nome) {
      if (direcoesLivres(jogador.x, jogador.y).indexOf(nome) === -1) {
        return false;
      }

      jogador.x += DIRECOES[nome].dx;
      jogador.y += DIRECOES[nome].dy;
      posicionarJogador();

      if (jogador.x === colunas - 1 && jogador.y === linhas - 1) {
        venceu = true;
        raiz.classList.add("venceu");
        ctx.aoVencer();
      }

      return true;
    }

    /* Cada toque, tecla ou deslize move exatamente UMA casa */
    function mover(nome) {
      if (venceu || !ctx.ativo()) return;

      darPasso(nome);
    }


    /* ---- Entradas: botões, teclado e toque ---- */

    function aoClicarBotao(evento) {
      const botao = evento.target.closest("button[data-dir]");

      if (botao) mover(botao.getAttribute("data-dir"));
    }

    const TECLAS = {
      ArrowUp: "cima",    w: "cima",    W: "cima",
      ArrowDown: "baixo", s: "baixo",   S: "baixo",
      ArrowLeft: "esquerda", a: "esquerda", A: "esquerda",
      ArrowRight: "direita", d: "direita",  D: "direita"
    };

    function aoTeclar(evento) {
      const nome = TECLAS[evento.key];

      if (!nome || !ctx.ativo()) return;

      evento.preventDefault();
      mover(nome);
    }

    let inicioToque = null;

    function aoComecarToque(evento) {
      inicioToque = { x: evento.clientX, y: evento.clientY };
    }

    function aoTerminarToque(evento) {
      if (!inicioToque) return;

      const dx = evento.clientX - inicioToque.x;
      const dy = evento.clientY - inicioToque.y;

      inicioToque = null;

      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;   // foi só um toque

      if (Math.abs(dx) > Math.abs(dy)) {
        mover(dx > 0 ? "direita" : "esquerda");
      } else {
        mover(dy > 0 ? "baixo" : "cima");
      }
    }

    raiz.querySelector(".mg-direcional").addEventListener("click", aoClicarBotao);
    document.addEventListener("keydown", aoTeclar);
    area.addEventListener("pointerdown", aoComecarToque);
    area.addEventListener("pointerup", aoTerminarToque);

    posicionarJogador();


    /* ---- Limpeza ---- */

    return {
      destruir: function () {
        document.removeEventListener("keydown", aoTeclar);
      }
    };
  }


  return { montar: montar };

})();
