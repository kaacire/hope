/* ==========================================================
   music.js — música de fundo
   ----------------------------------------------------------
   Começa quando a primeira porta é aberta (ou quando o
   progresso é retomado) e continua em looping até a página
   ser fechada. Arquivo e volume ficam em config.js (musica).
   ========================================================== */

window.Diario = window.Diario || {};

Diario.musica = (function () {
  const config = Diario.config.musica || {};

  let audio = null;

  /* Precisa ser chamado dentro de um clique (regra dos navegadores) */
  function tocar() {
    if (!config.arquivo) return;

    if (!audio) {
      audio = new Audio(config.arquivo);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = config.volume !== undefined ? config.volume : 0.6;
    }

    /* Já está tocando: não reinicia ao abrir outra porta */
    if (!audio.paused) return;

    const promessa = audio.play();

    if (promessa && promessa.catch) {
      promessa.catch(function () {
        /* arquivo ausente ou bloqueado: o site segue normal, sem som */
      });
    }
  }

  return { tocar: tocar };
})();
