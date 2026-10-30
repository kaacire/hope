/* ==========================================================
   main.js — liga todas as peças do site
   ----------------------------------------------------------
   Responsabilidades:
     - criar as 12 portas a partir de config.js
     - controlar a tela atual (portas ou alento)
     - controlar a progressão (a "função central" do projeto:
       TODO avanço passa por irParaPasso)
     - montar o conteúdo de cada página
     - conectar os minijogos

   Estados (ver direcao_artistica_diario_interativo.md):
     PORTAS -> C C C [minijogo] C C C [minijogo] C C C [minijogo] C C C -> FIM
   ========================================================== */

window.Diario = window.Diario || {};

Diario.app = (function () {
  const config = Diario.config;
  const util = Diario.util;
  const rabiscos = Diario.rabiscos;
  const armazenamento = Diario.armazenamento;
  const sequencia = Diario.sequencia;
  const fundo = Diario.fundo;
  const virada = Diario.virada;
  const ceu = Diario.ceu;

  const textos = config.textos;

  const el = {}; // elementos do HTML

  let estado = null; // progresso atual (ver iniciarJogo)
  let passos = []; // lista de passos da sequência

  let ocupado = false; // trava durante uma troca de página
  let portaAbrindo = false; // trava durante a animação da porta
  let minijogoVencido = false; // o minijogo atual já foi vencido?
  let destruirMinijogo = null; // função que limpa o minijogo atual

  /* ========================================================
     INÍCIO
     ======================================================== */

  function iniciar() {
    guardarElementos();
    aplicarConfigNoCss();
    preencherTextos();
    construirPortas();

    fundo.iniciar(el.fundo);
    virada.iniciar();
    ceu.iniciar();

    ligarEventos();
    atualizarAvisoRetomar();
  }

  function guardarElementos() {
    el.telaPortas = document.getElementById("tela-portas");
    el.telaDiario = document.getElementById("tela-diario");
    el.titulo = document.getElementById("titulo-portas");
    el.subtitulo = document.getElementById("subtitulo-portas");
    el.colunaPortas = document.getElementById("coluna-portas");
    el.avisoRetomar = document.getElementById("aviso-retomar");
    el.textoRetomar = document.getElementById("texto-retomar");
    el.btnRetomar = document.getElementById("btn-retomar");
    el.btnRecomecar = document.getElementById("btn-recomecar");
    el.fundo = document.getElementById("fundo");
    el.btnPortas = document.getElementById("btn-portas");
    el.btnContinuar = document.getElementById("btn-continuar");
  }

  /* Passa as configurações de config.js para o CSS */
  function aplicarConfigNoCss() {
    const raiz = document.documentElement.style;

    raiz.setProperty("--virada-ms", config.virada.duracaoMs + "ms");
    raiz.setProperty(
      "--virada-perspectiva",
      config.virada.perspectivaPx + "px",
    );
    raiz.setProperty("--virada-easing", config.virada.easing);

    document.body.classList.toggle("sem-rabisco", !config.estilo.filtroRabisco);

    const deslocamento = document.querySelector("#rabisco feDisplacementMap");

    if (deslocamento) {
      deslocamento.setAttribute("scale", config.estilo.intensidadeRabisco);
    }
  }

  function preencherTextos() {
    document.title = config.titulo;

    el.titulo.textContent = config.titulo;
    el.subtitulo.textContent = config.subtitulo;
    el.btnRetomar.textContent = textos.botaoRetomar;
    el.btnRecomecar.textContent = textos.botaoRecomecar;
    el.btnPortas.textContent = textos.botaoVoltarPortas;
    el.btnContinuar.textContent = textos.botaoContinuar;
  }

  /* ========================================================
     TELAS
     ======================================================== */

  function trocarTela(nome) {
    el.telaPortas.classList.toggle("ativa", nome === "portas");
    el.telaDiario.classList.toggle("ativa", nome === "diario");
  }

  /* ========================================================
     AS PORTAS
     ======================================================== */

  function construirPortas() {
    const rand = util.criarGerador(config.fundo.semente + 11);

    el.colunaPortas.innerHTML = "";

    config.conteudos.forEach(function (conteudo, i) {
      const numero = util.doisDigitos(i + 1);
      const botao = document.createElement("button");

      botao.type = "button";
      botao.className = "porta";

      /* Pequenas imperfeições: cada porta é um pouco torta */
      botao.style.setProperty(
        "--inclinacao",
        ((rand() - 0.5) * 4).toFixed(2) + "deg",
      );
      botao.style.setProperty(
        "--deslocamento",
        Math.round((rand() - 0.5) * 60) + "px",
      );

      botao.setAttribute("aria-label", textos.portaRotulo + " " + numero);

      botao.innerHTML =
        "" +
        '<span class="porta-moldura">' +
        '<span class="porta-interior">' +
        rabiscos.svg(conteudo.ilustracao) +
        "</span>" +
        '<span class="porta-folha">' +
        '<span class="porta-numero">' +
        numero +
        "</span>" +
        '<span class="porta-simbolo">' +
        rabiscos.svg(conteudo.ilustracao) +
        "</span>" +
        '<span class="porta-macaneta"></span>' +
        "</span>" +
        "</span>";

      botao.addEventListener("click", function () {
        abrirPorta(i, botao);
      });

      el.colunaPortas.appendChild(botao);
    });
  }

  async function abrirPorta(indice, botao) {
    if (portaAbrindo) return;

    Diario.musica.tocar(); // dentro do clique: o navegador libera o som

    portaAbrindo = true;
    botao.classList.add("aberta");

    await util.esperar(util.reduzMovimento() ? 0 : 750);

    iniciarJogo(indice);

    botao.classList.remove("aberta");
    portaAbrindo = false;
  }

  /* Mostra o aviso "continuar de onde parou" se houver progresso salvo */
  function atualizarAvisoRetomar() {
    const salvo = armazenamento.carregar();

    if (!progressoValido(salvo)) {
      el.avisoRetomar.classList.add("oculto");
      return;
    }

    const passosSalvos = sequencia.montarPassos(salvo.ordem);

    const lidos = passosSalvos
      .slice(0, salvo.passoAtual + 1)
      .filter(function (p) {
        return p.tipo === "conteudo";
      }).length;

    el.textoRetomar.textContent = textos.retomarTexto
      .replace("{n}", lidos)
      .replace("{total}", config.conteudos.length);

    el.avisoRetomar.classList.remove("oculto");
  }

  /* O progresso salvo ainda combina com o config atual? */
  function progressoValido(salvo) {
    if (!salvo || !Array.isArray(salvo.ordem)) return false;

    const idsAtuais = config.conteudos
      .map(function (c) {
        return c.id;
      })
      .sort()
      .join("|");
    const idsSalvos = salvo.ordem.slice().sort().join("|");

    if (idsAtuais !== idsSalvos) return false;

    const total = sequencia.montarPassos(salvo.ordem).length;

    return (
      Number.isInteger(salvo.passoAtual) &&
      salvo.passoAtual >= 0 &&
      salvo.passoAtual < total - 1
    ); // não retoma se já estava no fim
  }

  /* ========================================================
     INICIAR / RETOMAR / VOLTAR
     ======================================================== */

  function iniciarJogo(indicePorta) {
    estado = {
      portaInicial: indicePorta,
      ordem: sequencia.criarOrdem(indicePorta),
      passoAtual: 0,
      minijogosVencidos: [],
    };

    comecar();
  }

  function retomarJogo() {
    Diario.musica.tocar();

    const salvo = armazenamento.carregar();

    if (!progressoValido(salvo)) return;

    estado = {
      portaInicial: salvo.portaInicial,
      ordem: salvo.ordem,
      passoAtual: salvo.passoAtual,
      minijogosVencidos: salvo.minijogosVencidos || [],
    };

    comecar();
  }

  function comecar() {
    passos = sequencia.montarPassos(estado.ordem);
    minijogoVencido = false;

    ceu.sair(); // começa sempre no tema de papel

    trocarTela("diario");
    fundo.reiniciar();
    virada.limpar();

    irParaPasso(estado.passoAtual, false);
  }

  function voltarParaPortas(concluido) {
    if (ocupado || virada.estaBloqueado()) return;

    limparMinijogo();
    ceu.sair();

    if (concluido) armazenamento.limpar();

    estado = null;
    passos = [];

    virada.limpar();
    trocarTela("portas");
    atualizarAvisoRetomar();
  }

  function limparMinijogo() {
    if (destruirMinijogo) {
      destruirMinijogo();
      destruirMinijogo = null;
    }
  }

  /* ========================================================
     PROGRESSÃO (função central)
     --------------------------------------------------------
     Todo avanço passa por aqui. Assim, um clique duplo, um
     clique no fundo ou uma animação incompleta nunca revelam
     conteúdo fora de hora.
     ======================================================== */

  function passoAtual() {
    return estado ? passos[estado.passoAtual] : null;
  }

  /* Última seção: o mundo de papel sobe e o céu toma a tela */
  async function irParaCeu(indice, comVirada) {
    const minijogoAnterior = destruirMinijogo;

    el.btnContinuar.classList.add("invisivel");

    await ceu.entrar(!comVirada);

    /* Pode ter saído do alento durante a subida */
    if (!estado || passos[indice] === undefined) return;

    if (minijogoAnterior) minijogoAnterior();

    destruirMinijogo = null;
    minijogoVencido = false;
    estado.passoAtual = indice;

    armazenamento.limpar(); // chegou ao fim: nada a retomar

    atualizarBotao();
  }

  async function irParaPasso(indice, comVirada) {
    const passo = passos[indice];

    if (!passo) return;

    if (passo.tipo === "ceu") {
      await irParaCeu(indice, comVirada);
      return;
    }

    let handleNovo = null;

    function construir(container) {
      handleNovo = montarPasso(container, passo);
    }

    function aoMeio() {
      atualizarFundo(passo, comVirada);
    }

    const minijogoAnterior = destruirMinijogo;

    if (comVirada) {
      const virou = await virada.virar(construir, aoMeio);

      if (!virou) return;
    } else {
      aoMeio();
      virada.mostrar(construir);
    }

    /* A página nova já está na frente: agora pode limpar a anterior */
    if (minijogoAnterior) minijogoAnterior();

    destruirMinijogo = handleNovo ? handleNovo.destruir : null;
    minijogoVencido = false;
    estado.passoAtual = indice;

    if (indice >= passos.length - 1) {
      armazenamento.limpar(); // última página: nada a retomar
    } else {
      salvarProgresso();
    }

    atualizarBotao();
    preCarregarProximo();
  }

  async function avancar() {
    if (!estado || ocupado || virada.estaBloqueado()) return;

    const passo = passoAtual();

    if (ehUltimoPasso()) return;
    if (passo.tipo === "minijogo" && !minijogoVencido) return; // não dá para pular

    ocupado = true;

    try {
      await irParaPasso(estado.passoAtual + 1, true);
    } finally {
      ocupado = false;
    }
  }

  function ehUltimoPasso() {
    return !estado || estado.passoAtual >= passos.length - 1;
  }

  function salvarProgresso() {
    armazenamento.salvar({
      portaInicial: estado.portaInicial,
      ordem: estado.ordem,
      passoAtual: estado.passoAtual,
      minijogosVencidos: estado.minijogosVencidos,
    });
  }

  /* ========================================================
     FUNDO, BOTÃO E PRÉ-CARREGAMENTO
     ======================================================== */

  function atualizarFundo(passo, comVirada) {
    let posicao = null;
    let conteudo = null;

    if (passo.tipo === "conteudo") {
      posicao = passo.posicao;
      conteudo = sequencia.buscarConteudo(passo.conteudoId);
    } else {
      /* Minijogo e fim ficam no mesmo trecho do caminho do conteúdo anterior */
      for (let i = passos.indexOf(passo) - 1; i >= 0; i--) {
        if (passos[i].tipo === "conteudo") {
          posicao = passos[i].posicao;
          conteudo = sequencia.buscarConteudo(passos[i].conteudoId);
          break;
        }
      }
    }

    if (posicao !== null) fundo.mostrar(posicao, conteudo, !comVirada);
  }

  function atualizarBotao() {
    const passo = passoAtual();
    const botao = el.btnContinuar;
    const regras = config.sequencia;

    let escondido = false;

    if (passo.tipo === "minijogo") {
      /* O botão só aparece depois da vitória, e só se não for automático */
      escondido = !(minijogoVencido && !regras.avancarAutomaticoAposVitoria);
    }

    botao.classList.toggle("invisivel", escondido);
    botao.textContent = ehUltimoPasso()
      ? textos.botaoVoltar
      : textos.botaoContinuar;
  }

  function preCarregarProximo() {
    const proximo = passos[estado.passoAtual + 1];

    if (proximo && proximo.tipo === "conteudo") {
      const conteudo = sequencia.buscarConteudo(proximo.conteudoId);

      fundo.preCarregar(conteudo);

      if (conteudo.imagem) new Image().src = conteudo.imagem;
    }
  }

  /* ========================================================
     CONTEÚDO DAS PÁGINAS
     ======================================================== */

  /* Preenche o container com a página do passo. Devolve um
     "handle" ({ destruir }) apenas para minijogos. */
  function montarPasso(container, passo) {
    if (passo.tipo === "conteudo") {
      renderizarConteudo(container, passo);
      return null;
    }

    if (passo.tipo === "fim") {
      renderizarFim(container);
      return null;
    }

    return montarMinijogo(container, passo);
  }

  function renderizarConteudo(container, passo) {
    const conteudo = sequencia.buscarConteudo(passo.conteudoId);

    const contador = textos.contador
      .replace("{n}", util.doisDigitos(passo.posicao + 1))
      .replace("{total}", config.conteudos.length);

    container.innerHTML =
      "" +
      '<article class="folha">' +
      '<header class="folha-topo">' +
      '<span class="folha-contador">' +
      contador +
      "</span>" +
      (conteudo.nota
        ? '<span class="folha-nota">' + conteudo.nota + "</span>"
        : "") +
      "</header>" +
      '<h2 class="folha-titulo">' +
      conteudo.titulo +
      "</h2>" +
      '<div class="folha-ilustracao"></div>' +
      '<p class="folha-texto">' +
      conteudo.texto +
      "</p>" +
      "</article>";

    colocarIlustracao(container.querySelector(".folha-ilustracao"), conteudo);
  }

  /* Imagem do usuário, se houver; senão (ou se falhar) o desenho */
  function colocarIlustracao(area, conteudo) {
    const desenho = rabiscos.svg(conteudo.ilustracao);

    if (!conteudo.imagem) {
      area.innerHTML = desenho;
      return;
    }

    const imagem = new Image();

    imagem.alt = conteudo.titulo;
    imagem.onerror = function () {
      area.innerHTML = desenho;
    };
    imagem.src = conteudo.imagem;

    area.appendChild(imagem);
  }

  function renderizarFim(container) {
    container.innerHTML =
      "" +
      '<article class="folha folha-fim">' +
      '<h2 class="folha-titulo">' +
      textos.fimTitulo +
      "</h2>" +
      '<div class="folha-ilustracao">' +
      rabiscos.svg("coracao") +
      "</div>" +
      '<p class="folha-texto">' +
      textos.fimTexto +
      "</p>" +
      "</article>";
  }

  /* ========================================================
     MINIJOGOS
     ======================================================== */

  function montarMinijogo(container, passo) {
    const modulo = Diario.minijogos[passo.jogo];
    const raiz = document.createElement("div");

    raiz.className = "mg";
    container.appendChild(raiz);

    /* Se o nome em config.sequencia.minijogos estiver errado,
       o jogo não trava: libera a passagem. */
    if (!modulo) {
      raiz.innerHTML =
        '<p class="mg-instrucao">Мини-игра «' +
        passo.jogo +
        '» не найдена. Проверьте config.sequencia.minijogos.</p>';

      setTimeout(function () {
        aoVencerMinijogo(passo);
      }, 0);
      return null;
    }

    const contexto = {
      config: config.minijogos[passo.jogo] || {},

      /* Só aceita comandos quando esta página já está na frente e parada */
      ativo: function () {
        return passoAtual() === passo && !virada.estaBloqueado();
      },

      aoVencer: function () {
        aoVencerMinijogo(passo);
      },
    };

    return modulo.montar(raiz, contexto);
  }

  async function aoVencerMinijogo(passo) {
    if (minijogoVencido || passoAtual() !== passo) return;

    const estadoDaVitoria = estado;

    minijogoVencido = true;
    estado.minijogosVencidos.push(passo.jogo);

    salvarProgresso();
    atualizarBotao();

    if (config.sequencia.avancarAutomaticoAposVitoria) {
      await util.esperar(config.sequencia.atrasoAposVitoriaMs);

      /* Só avança se o usuário não saiu do alento nesse meio tempo */
      if (estado === estadoDaVitoria && passoAtual() === passo) avancar();
    }
  }

  /* ========================================================
     EVENTOS
     ======================================================== */

  function ligarEventos() {
    /* Botão "Continuar" (ou "Voltar às portas", na última página) */
    el.btnContinuar.addEventListener("click", function () {
      const passo = passoAtual();

      if (!passo) return;

      if (ehUltimoPasso()) {
        voltarParaPortas(true);
      } else {
        avancar();
      }
    });

    /* Clicar em qualquer ponto da tela também avança (só em páginas de conteúdo) */
    el.telaDiario.addEventListener("click", function (evento) {
      if (!config.avancarClicandoNaTela) return;
      if (evento.target.closest("button, a, .mg")) return;

      const passo = passoAtual();

      if (passo && passo.tipo === "conteudo") avancar();
    });

    /* Seta para a direita também avança */
    document.addEventListener("keydown", function (evento) {
      const passo = passoAtual();

      if (evento.key === "ArrowRight" && passo && passo.tipo === "conteudo") {
        avancar();
      }
    });

    el.btnPortas.addEventListener("click", function () {
      voltarParaPortas(false); // mantém o progresso salvo
    });

    el.btnRetomar.addEventListener("click", retomarJogo);

    el.btnRecomecar.addEventListener("click", function () {
      armazenamento.limpar();
      atualizarAvisoRetomar();
    });
  }

  /* Inicia quando o HTML estiver pronto */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }

  return {
    iniciar: iniciar,
  };
})();
