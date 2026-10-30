/* ==========================================================
   ceu.js — a última seção: a subida para o céu
   ----------------------------------------------------------
   Depois da página final do alento, o mundo de papel desliza
   para cima enquanto o site inteiro vira um céu de espaço:
   estrelas passam correndo (como se a câmera subisse), vão
   desacelerando e, no fim, aparecem constelações. No meio da
   tela surge "Feliz aniversário!" e, logo abaixo, as estrelas
   se ligam formando, vagamente, um bolo com uma vela.

   Tudo é desenhado num <canvas>, sem imagens externas.

   Quem usa esta peça só precisa chamar:
     Diario.ceu.iniciar()        uma vez, ao abrir o site
     Diario.ceu.entrar(imediato) sobe para o céu (Promise)
     Diario.ceu.sair()           volta ao tema de papel

   Textos e tempos ficam em config.js (ceu).
   ========================================================== */

window.Diario = window.Diario || {};

Diario.ceu = (function () {
  const util = Diario.util;

  const el = {};

  let ctx = null;
  let w = 0;
  let h = 0;

  let raf = null; // id do requestAnimationFrame
  let t0 = 0; // instante em que a subida começou
  let ultimo = 0; // instante do quadro anterior
  let ativo = false; // o céu está na tela?
  let estatico = false; // menos movimento: desenha um quadro só

  let estrelas = [];
  let constelacoes = [];
  let bolo = null;
  let fagulhas = [];
  let cadente = null;
  let proximaFagulha = 0;
  let proximaCadente = 0;

  let temporizadorTitulo = null;
  let temporizadorSubida = null;

  /* Cores (R, G, B) */
  const BRANCA = [236, 241, 255];
  const AZUL = [170, 196, 255];
  const OURO = [255, 214, 130];
  const ROSA = [255, 176, 196];
  const LILAS = [200, 178, 255];
  const LINHA = [196, 212, 255];

  /* ========================================================
     O BOLO — desenhado numa caixa de x = -1 a 1 e y = 0 a 1,76
     (y = 0 é a chama; y = 1,76 é a base do prato).
     Cada estrela tem [x, y]; as ligações dizem quais se unem.
     ======================================================== */

  const NOS = {
    /* chama (um losango pequeno) e pavio */
    f1: [0, 0.0],
    f2: [-0.055, 0.12],
    f3: [0.055, 0.12],
    pv: [0, 0.25],

    /* vela */
    c1: [-0.07, 0.25],
    c2: [0.07, 0.25],
    c3: [-0.07, 0.52],
    c4: [0.07, 0.52],

    /* andar de cima */
    t1: [-0.5, 0.52],
    t2: [0.5, 0.52],
    z1: [-0.5, 0.66],
    z2: [-0.25, 0.76],
    z3: [0, 0.66],
    z4: [0.25, 0.76],
    z5: [0.5, 0.66],
    b1: [-0.5, 0.94],
    b2: [0.5, 0.94],

    /* andar de baixo */
    u1: [-0.9, 0.94],
    u2: [0.9, 0.94],
    y1: [-0.9, 1.08],
    y2: [-0.45, 1.2],
    y3: [0, 1.08],
    y4: [0.45, 1.2],
    y5: [0.9, 1.08],
    d1: [-0.9, 1.52],
    d2: [0.9, 1.52],

    /* confeitos (sem ligação) */
    s1: [-0.62, 1.34],
    s2: [-0.28, 1.42],
    s3: [0.08, 1.32],
    s4: [0.42, 1.42],
    s5: [0.7, 1.32],

    /* prato */
    p1: [-1.12, 1.6],
    p2: [1.12, 1.6],
    p3: [0.92, 1.76],
    p4: [-0.92, 1.76],
  };

  const LIGACOES = [
    /* chama e vela */
    ["f1", "f2"], ["f1", "f3"], ["f2", "pv"], ["f3", "pv"],
    ["c1", "pv"], ["pv", "c2"], ["c1", "c3"], ["c2", "c4"],
    /* andar de cima */
    ["t1", "c3"], ["c3", "c4"], ["c4", "t2"],
    ["t1", "z1"], ["z1", "z2"], ["z2", "z3"], ["z3", "z4"], ["z4", "z5"], ["z5", "t2"],
    ["z1", "b1"], ["z5", "b2"], ["b1", "b2"],
    /* andar de baixo */
    ["b1", "u1"], ["b2", "u2"],
    ["u1", "y1"], ["y1", "y2"], ["y2", "y3"], ["y3", "y4"], ["y4", "y5"], ["y5", "u2"],
    ["y1", "d1"], ["y5", "d2"], ["d1", "d2"],
    /* prato */
    ["p1", "p2"], ["p2", "p3"], ["p3", "p4"], ["p4", "p1"],
  ];

  /* Cor de cada grupo de estrelas do bolo */
  function corDoNo(nome) {
    if (nome[0] === "f" || nome === "pv") return OURO;
    if (nome === "s1" || nome === "s4") return ROSA;
    if (nome === "s2" || nome === "s5") return OURO;
    if (nome === "s3") return LILAS;
    return BRANCA;
  }

  /* ========================================================
     INÍCIO
     ======================================================== */

  function iniciar() {
    el.tela = document.getElementById("tela-diario");
    el.ceu = document.getElementById("ceu");
    el.canvas = document.getElementById("ceu-canvas");
    el.titulo = document.getElementById("ceu-titulo");

    if (!el.tela || !el.ceu || !el.canvas || !el.titulo) return;

    ctx = el.canvas.getContext("2d");

    montarTitulo();

    window.addEventListener("resize", aoRedimensionar);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(aoRedimensionar);
    }
  }

  function configuracao() {
    return Diario.config.ceu || {};
  }

  /* "Feliz aniversário!" em letrinhas que aparecem uma a uma */
  function montarTitulo() {
    const texto = configuracao().titulo || "С днём рождения!";
    let indice = 0;

    el.titulo.setAttribute("aria-label", texto);
    el.titulo.textContent = "";

    texto.split(" ").forEach(function (palavra, i) {
      const bloco = document.createElement("span");

      bloco.className = "ceu-palavra";
      bloco.setAttribute("aria-hidden", "true");

      palavra.split("").forEach(function (letra) {
        const span = document.createElement("span");

        span.className = "ceu-letra";
        span.style.setProperty("--i", indice++);
        span.textContent = letra;

        bloco.appendChild(span);
      });

      if (i > 0) el.titulo.appendChild(document.createTextNode(" "));
      el.titulo.appendChild(bloco);
    });
  }

  /* ========================================================
     ENTRAR E SAIR
     ======================================================== */

  /* Sobe para o céu. imediato = true pula a animação.
     A Promise termina quando o mundo de papel já saiu da tela. */
  function entrar(imediato) {
    const cfg = configuracao();
    const semMovimento = util.reduzMovimento();
    const subidaMs = imediato || semMovimento ? 0 : cfg.subidaMs || 2200;

    estatico = semMovimento;
    el.tela.style.setProperty("--ceu-subida-ms", subidaMs + "ms");
    el.tela.classList.toggle("ceu-instantaneo", subidaMs === 0);

    medir();

    ativo = true;
    t0 = performance.now() - (imediato || semMovimento ? 60000 : 0);
    ultimo = performance.now();
    proximaFagulha = 0;
    proximaCadente = 0;
    fagulhas = [];
    cadente = null;

    void el.tela.offsetWidth; // aplica o estado inicial antes de animar

    el.tela.classList.add("tema-espaco");
    corDoNavegador("#070b24");

    clearTimeout(temporizadorTitulo);

    if (subidaMs === 0) {
      el.tela.classList.add("ceu-pronto");
    } else {
      temporizadorTitulo = setTimeout(function () {
        el.tela.classList.add("ceu-pronto");
      }, subidaMs * 0.7);
    }

    if (estatico) {
      desenhar(performance.now());
    } else {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(quadro);
    }

    return new Promise(function (resolver) {
      clearTimeout(temporizadorSubida);
      temporizadorSubida = setTimeout(resolver, subidaMs);
    });
  }

  /* Volta ao tema de papel (sem animação) */
  function sair() {
    if (!el.tela) return;

    ativo = false;

    cancelAnimationFrame(raf);
    raf = null;

    clearTimeout(temporizadorTitulo);
    clearTimeout(temporizadorSubida);

    el.tela.classList.add("ceu-instantaneo");
    el.tela.classList.remove("tema-espaco", "ceu-pronto");

    void el.tela.offsetWidth;

    setTimeout(function () {
      el.tela.classList.remove("ceu-instantaneo");
    }, 60);

    corDoNavegador("#F5EBDD");

    if (ctx) ctx.clearRect(0, 0, w, h);
  }

  /* Cor da barra do navegador no celular */
  function corDoNavegador(cor) {
    const meta = document.querySelector('meta[name="theme-color"]');

    if (meta) meta.setAttribute("content", cor);
  }

  function aoRedimensionar() {
    if (!ativo) return;

    medir();

    if (estatico) desenhar(performance.now());
  }

  /* ========================================================
     MEDIDAS E LAYOUT
     ======================================================== */

  function medir() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    w = el.tela.clientWidth || window.innerWidth;
    h = el.tela.clientHeight || window.innerHeight;

    el.canvas.width = Math.round(w * dpr);
    el.canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* Título e bolo: o conjunto fica centralizado na tela */
    const topo = 64;
    const rodape = 112; // espaço do botão
    const disponivel = h - topo - rodape;

    el.titulo.style.setProperty("--ceu-titulo-y", "0px");

    const tituloH = el.titulo.offsetHeight || 80;
    const tituloL = el.titulo.offsetWidth || 300;
    const folga = Math.max(18, h * 0.03);

    let escala = Math.min(
      (w * 0.88) / 2 / 1.12,
      (disponivel - tituloH - folga) / 1.78,
      210,
    );

    escala = Math.max(escala, 56);

    const alturaTotal = tituloH + folga + 1.78 * escala;
    const y0 = topo + Math.max(0, (disponivel - alturaTotal) / 2);
    const tituloY = y0 + tituloH / 2;
    const topoBolo = y0 + tituloH + folga;

    el.titulo.style.setProperty("--ceu-titulo-y", Math.round(tituloY) + "px");

    const rand = util.criarGerador((Diario.config.fundo.semente || 1) + 505);

    construirEstrelas(rand);
    construirBolo(w / 2, topoBolo, escala, rand);

    const reservados = [
      /* título */
      {
        x: w / 2 - tituloL / 2 - 24,
        y: tituloY - tituloH / 2 - 24,
        l: tituloL + 48,
        a: tituloH + 48,
      },
      /* bolo */
      {
        x: w / 2 - 1.25 * escala,
        y: topoBolo - 14,
        l: 2.5 * escala,
        a: 1.78 * escala + 28,
      },
      /* botões */
      { x: w / 2 - 120, y: h - 110, l: 240, a: 110 },
      { x: 0, y: 0, l: 130, a: 60 },
    ];

    construirConstelacoes(rand, reservados);
  }

  /* ========================================================
     CONSTRUÇÃO DOS ELEMENTOS
     ======================================================== */

  function construirEstrelas(rand) {
    const quantidade = util.limitar(Math.round((w * h) / 4200), 90, 280);
    const cores = [BRANCA, BRANCA, BRANCA, AZUL, OURO];

    estrelas = [];

    for (let i = 0; i < quantidade; i++) {
      const profundidade = 0.3 + rand() * 0.7;

      estrelas.push({
        x: rand() * w,
        y: rand() * h,
        prof: profundidade,
        r: (0.35 + rand() * rand() * 1.9) * (0.5 + profundidade * 0.7),
        fase: rand() * Math.PI * 2,
        vel: 0.0008 + rand() * 0.002,
        cor: cores[Math.floor(rand() * cores.length)],
      });
    }
  }

  function construirBolo(cx, topo, escala, rand) {
    const nomes = Object.keys(NOS);
    const subida = configuracao().subidaMs || 2200;

    /* As estrelas surgem de cima para baixo, uma depois da outra */
    const inicioNos = subida + 450;
    const passo = 62;
    const indice = {};

    const nos = nomes.map(function (nome, i) {
      const base = NOS[nome];
      const fixo = nome[0] === "f" || nome === "pv";
      const tremor = fixo ? 0 : 0.018;

      indice[nome] = i;

      return {
        nome: nome,
        x: cx + (base[0] + (rand() - 0.5) * tremor * 2) * escala,
        y: topo + (base[1] + (rand() - 0.5) * tremor * 2) * escala,
        ini: inicioNos + i * passo,
        fase: rand() * Math.PI * 2,
        cor: corDoNo(nome),
        brilho: nome === "f1" || nome === "pv",
        confeito: nome[0] === "s",
        r: nome === "f1" ? 3.6 : nome[0] === "s" ? 2.4 : 2.7,
      };
    });

    const ligacoes = LIGACOES.map(function (par) {
      const a = nos[indice[par[0]]];
      const b = nos[indice[par[1]]];
      const quente = a.cor === OURO && b.cor === OURO;

      return {
        a: a,
        b: b,
        quente: quente,
        ini: Math.max(a.ini, b.ini) + 220,
        dur: 520,
      };
    });

    /* Pontinhos extras ao longo das linhas longas (dá "volume") */
    const pontos = [];

    ligacoes.forEach(function (lig) {
      const dx = lig.b.x - lig.a.x;
      const dy = lig.b.y - lig.a.y;
      const comprimento = Math.hypot(dx, dy);
      const quantidade = Math.floor(comprimento / 46);

      for (let k = 1; k <= quantidade; k++) {
        const f = k / (quantidade + 1);

        pontos.push({
          x: lig.a.x + dx * f + (rand() - 0.5) * 3,
          y: lig.a.y + dy * f + (rand() - 0.5) * 3,
          ini: lig.ini + lig.dur * f,
          fase: rand() * Math.PI * 2,
          r: 0.9 + rand() * 0.7,
        });
      }
    });

    bolo = {
      nos: nos,
      ligacoes: ligacoes,
      pontos: pontos,
      chama: nos[indice.f1],
      miolo: nos[indice.pv],
      escala: escala,
    };
  }

  function intersecta(a, b) {
    return !(
      a.x + a.l < b.x ||
      b.x + b.l < a.x ||
      a.y + a.a < b.y ||
      b.y + b.a < a.y
    );
  }

  /* Pequenas constelações espalhadas, longe do título e do bolo */
  function construirConstelacoes(rand, reservados) {
    const alvo = w > 700 ? 8 : 5;
    const k = util.limitar(Math.min(w, h) / 420, 0.75, 1.5);
    const subida = configuracao().subidaMs || 2200;

    constelacoes = [];

    for (let tentativa = 0; tentativa < 400 && constelacoes.length < alvo; tentativa++) {
      const n = 4 + Math.floor(rand() * 3);

      let x = 30 + rand() * (w - 60);
      let y = 66 + rand() * (h - 180);
      let angulo = rand() * Math.PI * 2;

      const pts = [{ x: x, y: y }];

      for (let i = 1; i < n; i++) {
        angulo += (rand() - 0.5) * 2.3;

        const passo = (24 + rand() * 30) * k;

        x += Math.cos(angulo) * passo;
        y += Math.sin(angulo) * passo;

        pts.push({ x: x, y: y });
      }

      const xs = pts.map(function (p) { return p.x; });
      const ys = pts.map(function (p) { return p.y; });
      const caixa = {
        x: Math.min.apply(null, xs) - 12,
        y: Math.min.apply(null, ys) - 12,
        l: Math.max.apply(null, xs) - Math.min.apply(null, xs) + 24,
        a: Math.max.apply(null, ys) - Math.min.apply(null, ys) + 24,
      };

      if (caixa.x < 12 || caixa.y < 56) continue;
      if (caixa.x + caixa.l > w - 12 || caixa.y + caixa.a > h - 96) continue;
      if (reservados.some(function (r) { return intersecta(caixa, r); })) continue;
      if (constelacoes.some(function (c) { return intersecta(caixa, c.caixa); })) continue;

      const ini = subida + 2000 + constelacoes.length * 520;

      constelacoes.push({
        pts: pts.map(function (p, i) {
          return {
            x: p.x,
            y: p.y,
            ini: ini + i * 230,
            fase: rand() * Math.PI * 2,
            r: 1.3 + rand() * 1.3,
          };
        }),
        caixa: caixa,
      });
    }
  }

  /* ========================================================
     DESENHO
     ======================================================== */

  function cor(rgb, alfa) {
    return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + alfa.toFixed(3) + ")";
  }

  function limitar01(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  function suavizar(p) {
    return 1 - Math.pow(1 - limitar01(p), 3);
  }

  /* Uma estrela brilhante: halo + miolo (+ cruzinha, se pedido) */
  function estrelaBrilhante(x, y, raio, alfa, rgb, cruz) {
    if (alfa <= 0.01) return;

    const halo = ctx.createRadialGradient(x, y, 0, x, y, raio * 5);

    halo.addColorStop(0, cor(rgb, alfa * 0.5));
    halo.addColorStop(1, cor(rgb, 0));

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, raio * 5, 0, Math.PI * 2);
    ctx.fill();

    if (cruz) {
      const braco = raio * 3.4;

      ctx.strokeStyle = cor(rgb, alfa * 0.75);
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(x - braco, y);
      ctx.lineTo(x + braco, y);
      ctx.moveTo(x, y - braco);
      ctx.lineTo(x, y + braco);
      ctx.stroke();
    }

    ctx.fillStyle = cor([255, 255, 255], Math.min(1, alfa));
    ctx.beginPath();
    ctx.arc(x, y, raio * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }

  /* Estrelas do fundo. Na subida, correm para baixo (a câmera
     sobe) e vão desacelerando até parar. */
  function desenharFundo(t) {
    const subida = configuracao().subidaMs || 2200;
    const duracao = subida + 1700;
    const distancia = h * 2.4;
    const p = limitar01(t / duracao);

    const deslocamento = distancia * (1 - Math.pow(1 - p, 3));
    const velocidade = p >= 1 ? 0 : ((distancia * 3 * Math.pow(1 - p, 2)) / duracao);

    estrelas.forEach(function (e) {
      const y = (((e.y + deslocamento * e.prof) % h) + h) % h;
      const v = velocidade * e.prof; // px por ms
      const comprimento = Math.min(v * 42, 170);
      const piscar = estatico ? 1 : 0.62 + 0.38 * Math.sin(t * e.vel + e.fase);
      const alfa = 0.35 + 0.65 * piscar * (0.5 + e.prof * 0.5);

      if (comprimento > 2.5) {
        const rastro = ctx.createLinearGradient(e.x, y - comprimento, e.x, y);

        rastro.addColorStop(0, cor(e.cor, 0));
        rastro.addColorStop(1, cor(e.cor, alfa * 0.8));

        ctx.strokeStyle = rastro;
        ctx.lineWidth = Math.max(0.8, e.r * 1.1);
        ctx.beginPath();
        ctx.moveTo(e.x, y - comprimento);
        ctx.lineTo(e.x, y);
        ctx.stroke();
      }

      ctx.fillStyle = cor(e.cor, alfa);
      ctx.beginPath();
      ctx.arc(e.x, y, e.r, 0, Math.PI * 2);
      ctx.fill();

      /* As maiores ganham um brilho suave */
      if (e.r > 1.5 && comprimento < 4) {
        const halo = ctx.createRadialGradient(e.x, y, 0, e.x, y, e.r * 4.5);

        halo.addColorStop(0, cor(e.cor, alfa * 0.35));
        halo.addColorStop(1, cor(e.cor, 0));

        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(e.x, y, e.r * 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  /* Uma linha de constelação que vai se desenhando */
  function linha(a, b, progresso, rgb, alfa) {
    if (progresso <= 0) return;

    const p = suavizar(progresso);
    const x = a.x + (b.x - a.x) * p;
    const y = a.y + (b.y - a.y) * p;

    ctx.lineCap = "round";

    /* brilho largo e fraco por baixo, traço fino por cima */
    ctx.strokeStyle = cor(rgb, alfa * 0.14);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.strokeStyle = cor(rgb, alfa);
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    /* ponta acesa enquanto a linha corre */
    if (progresso < 1) {
      ctx.fillStyle = cor([255, 255, 255], 0.9);
      ctx.beginPath();
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function desenharConstelacoes(t) {
    constelacoes.forEach(function (c) {
      for (let i = 0; i < c.pts.length - 1; i++) {
        const a = c.pts[i];
        const b = c.pts[i + 1];

        linha(a, b, (t - b.ini + 120) / 520, LINHA, 0.3);
      }

      c.pts.forEach(function (p) {
        const entrada = limitar01((t - p.ini) / 500);
        const piscar = estatico ? 1 : 0.8 + 0.2 * Math.sin(t * 0.0026 + p.fase);

        estrelaBrilhante(p.x, p.y, p.r * (0.4 + 0.6 * entrada), entrada * piscar * 0.9, BRANCA, p.r > 2);
      });
    });
  }

  function desenharBolo(t) {
    if (!bolo) return;

    bolo.ligacoes.forEach(function (lig) {
      linha(lig.a, lig.b, (t - lig.ini) / lig.dur, lig.quente ? OURO : LINHA, lig.quente ? 0.85 : 0.55);
    });

    bolo.pontos.forEach(function (p) {
      const entrada = limitar01((t - p.ini) / 400);
      const piscar = estatico ? 1 : 0.7 + 0.3 * Math.sin(t * 0.003 + p.fase);

      ctx.fillStyle = cor(BRANCA, entrada * piscar * 0.8);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    bolo.nos.forEach(function (n) {
      const entrada = suavizar((t - n.ini) / 500);

      if (entrada <= 0) return;

      let piscar = estatico ? 1 : 0.85 + 0.15 * Math.sin(t * 0.0032 + n.fase);

      /* A chama tremula como a de uma vela de verdade */
      if (n.brilho && !estatico) {
        piscar = 0.82 + 0.18 * Math.sin(t * 0.011 + n.fase) * Math.sin(t * 0.0047);
      }

      estrelaBrilhante(
        n.x,
        n.y,
        n.r * (0.4 + 0.6 * entrada),
        entrada * piscar,
        n.cor,
        n.brilho || n.confeito || n.nome[0] === "p" && (n.nome === "p1" || n.nome === "p2"),
      );
    });

    /* Brilho quente ao redor da chama */
    const chama = bolo.chama;
    const acesa = suavizar((t - chama.ini - 200) / 900);

    if (acesa > 0) {
      const tremida = estatico ? 1 : 0.9 + 0.1 * Math.sin(t * 0.013);
      const raio = bolo.escala * 0.55 * tremida;
      const y = chama.y + bolo.escala * 0.1;
      const luz = ctx.createRadialGradient(chama.x, y, 0, chama.x, y, raio);

      luz.addColorStop(0, cor(OURO, 0.34 * acesa));
      luz.addColorStop(0.4, cor([255, 170, 90], 0.12 * acesa));
      luz.addColorStop(1, cor(OURO, 0));

      ctx.fillStyle = luz;
      ctx.beginPath();
      ctx.arc(chama.x, y, raio, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* Fagulhas douradas que sobem da vela */
  function atualizarFagulhas(t, dt) {
    if (!bolo || estatico) return;

    const chama = bolo.chama;

    if (t > chama.ini + 900 && t > proximaFagulha) {
      proximaFagulha = t + 260 + Math.random() * 360;

      fagulhas.push({
        x: chama.x + (Math.random() - 0.5) * 6,
        y: chama.y + 2,
        vx: (Math.random() - 0.5) * 0.012,
        vy: -(0.018 + Math.random() * 0.02),
        vida: 0,
        max: 1500 + Math.random() * 1200,
        r: 0.8 + Math.random() * 1.2,
        fase: Math.random() * 6,
      });
    }

    fagulhas = fagulhas.filter(function (f) {
      f.vida += dt;
      f.x += f.vx * dt + Math.sin(f.vida * 0.004 + f.fase) * 0.12;
      f.y += f.vy * dt;

      const p = f.vida / f.max;

      if (p >= 1) return false;

      ctx.fillStyle = cor(OURO, (1 - p) * 0.85);
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * (1 - p * 0.4), 0, Math.PI * 2);
      ctx.fill();

      return true;
    });
  }

  /* De vez em quando, uma estrela cadente */
  function desenharCadente(t, dt) {
    if (estatico) return;

    if (!cadente && t > 6500 && t > proximaCadente) {
      proximaCadente = t + 5000 + Math.random() * 5000;

      cadente = {
        x: w * (0.45 + Math.random() * 0.55),
        y: h * Math.random() * 0.28,
        vida: 0,
        max: 950,
      };
    }

    if (!cadente) return;

    cadente.vida += dt;

    const p = cadente.vida / cadente.max;

    if (p >= 1) {
      cadente = null;
      return;
    }

    const vx = -0.55;
    const vy = 0.3;
    const x = cadente.x + vx * cadente.vida;
    const y = cadente.y + vy * cadente.vida;
    const alfa = Math.sin(p * Math.PI);
    const rastro = ctx.createLinearGradient(x, y, x - vx * 170, y - vy * 170);

    rastro.addColorStop(0, cor([255, 255, 255], alfa));
    rastro.addColorStop(1, cor(AZUL, 0));

    ctx.strokeStyle = rastro;
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - vx * 170, y - vy * 170);
    ctx.stroke();
  }

  function desenhar(agora) {
    const t = agora - t0;
    const dt = Math.min(64, agora - ultimo);

    ultimo = agora;

    ctx.clearRect(0, 0, w, h);

    desenharFundo(t);
    desenharConstelacoes(t);
    desenharBolo(t);
    atualizarFagulhas(t, dt);
    desenharCadente(t, dt);
  }

  function quadro(agora) {
    if (!ativo) return;

    desenhar(agora);
    raf = requestAnimationFrame(quadro);
  }

  return {
    iniciar: iniciar,
    entrar: entrar,
    sair: sair,
  };
})();
