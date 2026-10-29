/* ==========================================================
   sequence.js — embaralhamento e montagem da sequência
   ----------------------------------------------------------
   A sequência é uma lista de "passos". Cada passo é um destes:

     { tipo: "conteudo", conteudoId, posicao }   uma página de texto
     { tipo: "minijogo", jogo, numero }          um desafio
     { tipo: "fim" }                             tela final

   Com 12 conteúdos e minijogoACada = 3, fica assim:
     C C C [M1] C C C [M2] C C C [M3] C C C FIM

   Os minijogos NÃO entram no embaralhamento: ficam em posições
   fixas, então nunca aparecem antes da hora.
   ========================================================== */

window.Diario = window.Diario || {};

Diario.sequencia = (function () {

  /* Lista de ids dos conteúdos na ordem sorteada.
     indicePorta = número da porta aberta (0 a 11). */
  function criarOrdem(indicePorta) {
    const config = Diario.config;
    const ids    = config.conteudos.map(function (c) { return c.id; });

    if (config.primeiroConteudoEhDaPorta && ids[indicePorta] !== undefined) {
      const primeiro = ids[indicePorta];
      const restantes = ids.filter(function (id) { return id !== primeiro; });

      return [primeiro].concat(Diario.util.embaralhar(restantes));
    }

    return Diario.util.embaralhar(ids);
  }


  /* Transforma a ordem sorteada na lista de passos */
  function montarPassos(ordem) {
    const regras = Diario.config.sequencia;
    const cada   = Math.max(1, regras.minijogoACada);
    const passos = [];

    let minijogosUsados = 0;

    ordem.forEach(function (id, i) {
      passos.push({ tipo: "conteudo", conteudoId: id, posicao: i });

      const fechouGrupo  = (i + 1) % cada === 0;
      const aindaTemMais = i < ordem.length - 1;
      const temMinijogo  = minijogosUsados < regras.minijogos.length;

      if (fechouGrupo && aindaTemMais && temMinijogo) {
        passos.push({
          tipo:   "minijogo",
          jogo:   regras.minijogos[minijogosUsados],
          numero: minijogosUsados + 1
        });

        minijogosUsados++;
      }
    });

    passos.push({ tipo: "fim" });

    return passos;
  }


  /* Busca um conteúdo pelo id */
  function buscarConteudo(id) {
    return Diario.config.conteudos.find(function (c) { return c.id === id; });
  }


  return {
    criarOrdem:     criarOrdem,
    montarPassos:   montarPassos,
    buscarConteudo: buscarConteudo
  };

})();
