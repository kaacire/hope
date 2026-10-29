/* ==========================================================
   storage.js — salvar e recuperar o progresso (localStorage)
   ----------------------------------------------------------
   O que é salvo:
     portaInicial       qual porta foi aberta
     ordem              a ordem sorteada dos conteúdos (ids)
     passoAtual         em que passo da sequência está
     minijogosVencidos  quais minijogos já foram vencidos

   Nada é salvo se config.salvarProgresso for false.
   Se o navegador bloquear o armazenamento, o site continua
   funcionando normalmente, só não guarda o progresso.
   ========================================================== */

window.Diario = window.Diario || {};

Diario.armazenamento = (function () {

  function ativo() {
    return Diario.config.salvarProgresso;
  }

  function chave() {
    return Diario.config.chaveArmazenamento;
  }


  function salvar(estado) {
    if (!ativo()) return;

    try {
      localStorage.setItem(chave(), JSON.stringify(estado));
    } catch (erro) {
      /* armazenamento indisponível: ignora */
    }
  }


  function carregar() {
    if (!ativo()) return null;

    try {
      const texto = localStorage.getItem(chave());
      return texto ? JSON.parse(texto) : null;
    } catch (erro) {
      return null;
    }
  }


  function limpar() {
    try {
      localStorage.removeItem(chave());
    } catch (erro) {
      /* ignora */
    }
  }


  return {
    salvar:  salvar,
    carregar: carregar,
    limpar:  limpar
  };

})();
