/* ==========================================================
   utils.js — funções pequenas usadas pelo projeto inteiro
   ========================================================== */

window.Diario = window.Diario || {};

Diario.util = (function () {

  /* Gerador de números "aleatórios" repetíveis:
     a mesma semente sempre gera a mesma sequência. */
  function criarGerador(semente) {
    let a = semente >>> 0;

    return function () {
      a = (a + 0x6D2B79F5) >>> 0;

      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }


  /* Fisher–Yates: devolve uma CÓPIA embaralhada,
     sem repetir e sem perder nenhum item. */
  function embaralhar(lista, aleatorio) {
    const sortear = aleatorio || Math.random;
    const copia   = lista.slice();

    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(sortear() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
  }


  /* 3 -> "03" */
  function doisDigitos(numero) {
    return String(numero).padStart(2, "0");
  }


  /* Mantém um número entre um mínimo e um máximo */
  function limitar(valor, minimo, maximo) {
    return Math.min(maximo, Math.max(minimo, valor));
  }


  /* Pausa assíncrona: await util.esperar(500) */
  function esperar(ms) {
    return new Promise(function (resolver) {
      setTimeout(resolver, ms);
    });
  }


  /* A pessoa pediu menos movimento no celular/computador? */
  function reduzMovimento() {
    return window.matchMedia
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }


  /* Arredonda para 1 casa (deixa o SVG mais enxuto) */
  function arredondar(numero) {
    return Math.round(numero * 10) / 10;
  }


  return {
    criarGerador: criarGerador,
    embaralhar:   embaralhar,
    doisDigitos:  doisDigitos,
    limitar:      limitar,
    esperar:      esperar,
    reduzMovimento: reduzMovimento,
    arredondar:   arredondar
  };

})();
