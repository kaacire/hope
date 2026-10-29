/* ==========================================================
   doodles.js — biblioteca de desenhos "feitos à mão" (SVG)
   ----------------------------------------------------------
   Cada desenho cabe numa área de 200 x 200.

   Classes de cor usadas dentro dos desenhos (ver style.css):
     tr           contorno de lápis
     tr rosa      contorno + preenchimento rosa
     tr salvia    contorno + preenchimento verde-sálvia
     tr vinho     contorno + preenchimento vinho
     tr papel     contorno + preenchimento cor de papel

   COMO CRIAR UM DESENHO NOVO
   1. Adicione uma função em "desenhos" com o nome que quiser.
   2. Devolva o SVG interno (sem a tag <svg>).
   3. Use o nome em config.js (ilustracao) ou em
      config.fundo.decoracoes.

   Você também pode desenhar no iPad / Inkscape, exportar como
   SVG e colar o conteúdo aqui.
   ========================================================== */

window.Diario = window.Diario || {};

Diario.rabiscos = (function () {

  const desenhos = {

    flor: function () {
      let petalas = "";

      for (let i = 0; i < 5; i++) {
        petalas += '<ellipse class="tr rosa" cx="100" cy="58" rx="15" ry="26"'
                 + ' transform="rotate(' + (i * 72) + ' 100 88)"/>';
      }

      return ''
        + '<path class="tr" d="M100 112 C94 135 106 158 99 186"/>'
        + '<path class="tr salvia" d="M100 152 C78 138 62 146 58 158 C76 168 94 164 100 152 Z"/>'
        + '<path class="tr salvia" d="M101 138 C124 122 142 130 146 142 C128 152 108 150 101 138 Z"/>'
        + petalas
        + '<circle class="tr vinho" cx="100" cy="88" r="11"/>';
    },


    coracao: function () {
      return ''
        + '<path class="tr vinho" d="M100 165 C28 112 46 48 100 86 C154 48 172 112 100 165 Z"/>'
        + '<path class="tr" d="M70 78 C62 84 60 94 64 102"/>';
    },


    estrela: function () {
      const pontas = [];

      for (let i = 0; i < 10; i++) {
        const raio   = (i % 2 === 0) ? 74 : 32;
        const angulo = -Math.PI / 2 + i * Math.PI / 5;

        pontas.push(
          (100 + raio * Math.cos(angulo)).toFixed(1) + " " +
          (104 + raio * Math.sin(angulo)).toFixed(1)
        );
      }

      return '<path class="tr rosa" d="M' + pontas.join(" L") + ' Z"/>';
    },


    arvore: function () {
      return ''
        + '<path class="tr" d="M92 190 C94 160 92 140 94 118 M108 190 C106 160 108 140 106 118"/>'
        + '<path class="tr salvia" d="M60 122 C30 120 26 84 56 80 C54 50 90 36 106 58 '
        + 'C128 40 162 62 150 88 C178 96 168 130 140 126 Z"/>'
        + '<path class="tr" d="M80 90 C86 84 94 84 98 90"/>';
    },


    portao: function () {
      return ''
        + '<path class="tr" d="M44 188 V92 C44 50 156 50 156 92 V188"/>'
        + '<path class="tr" d="M72 188 V76 M100 188 V62 M128 188 V76"/>'
        + '<path class="tr" d="M30 188 H170"/>'
        + '<circle class="tr vinho" cx="100" cy="150" r="7"/>';
    },


    chave: function () {
      return ''
        + '<circle class="tr vinho" cx="62" cy="100" r="30"/>'
        + '<circle class="tr papel" cx="62" cy="100" r="11"/>'
        + '<path class="tr" d="M92 100 H178 M150 100 V128 M168 100 V120"/>';
    },


    sol: function () {
      let raios = "";

      for (let i = 0; i < 12; i++) {
        const angulo = i * Math.PI / 6;
        const interno = 48;
        const externo = (i % 2 === 0) ? 80 : 68;

        raios += 'M' + (100 + interno * Math.cos(angulo)).toFixed(1)
               + ' '  + (100 + interno * Math.sin(angulo)).toFixed(1)
               + ' L' + (100 + externo * Math.cos(angulo)).toFixed(1)
               + ' '  + (100 + externo * Math.sin(angulo)).toFixed(1) + ' ';
      }

      return ''
        + '<circle class="tr rosa" cx="100" cy="100" r="34"/>'
        + '<path class="tr" d="' + raios + '"/>';
    },


    lua: function () {
      return ''
        + '<path class="tr rosa" d="M130 30 A72 72 0 1 0 172 140 A60 60 0 1 1 130 30 Z"/>'
        + '<path class="tr" d="M150 54 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z"/>';
    },


    casa: function () {
      return ''
        + '<path class="tr" d="M44 110 V180 H156 V110"/>'
        + '<path class="tr vinho" d="M30 116 L100 54 L170 116 Z"/>'
        + '<path class="tr" d="M88 180 V140 H112 V180"/>'
        + '<rect class="tr rosa" x="124" y="128" width="22" height="22"/>'
        + '<path class="tr" d="M135 128 V150 M124 139 H146"/>'
        + '<path class="tr" d="M134 72 V50 H148 V84"/>';
    },


    borboleta: function () {
      return ''
        + '<path class="tr rosa" d="M100 100 C70 40 20 50 36 100 C44 122 80 120 100 100 Z"/>'
        + '<path class="tr rosa" d="M100 100 C130 40 180 50 164 100 C156 122 120 120 100 100 Z"/>'
        + '<path class="tr salvia" d="M100 104 C76 128 52 160 78 168 C96 172 100 130 100 104 Z"/>'
        + '<path class="tr salvia" d="M100 104 C124 128 148 160 122 168 C104 172 100 130 100 104 Z"/>'
        + '<path class="tr" d="M100 70 V150"/>'
        + '<path class="tr" d="M100 72 C94 52 84 46 78 44 M100 72 C106 52 116 46 122 44"/>';
    },


    envelope: function () {
      return ''
        + '<rect class="tr rosa" x="30" y="56" width="140" height="94" rx="4"/>'
        + '<path class="tr" d="M30 60 L100 112 L170 60"/>'
        + '<path class="tr" d="M30 148 L80 100 M170 148 L120 100"/>'
        + '<path class="tr vinho" d="M100 132 C86 120 84 110 94 106 C98 105 100 107 100 110 '
        + 'C100 107 102 105 106 106 C116 110 114 120 100 132 Z"/>';
    },


    livro: function () {
      return ''
        + '<path class="tr rosa" d="M100 70 C80 54 50 52 30 60 V150 C50 142 80 144 100 160 Z"/>'
        + '<path class="tr salvia" d="M100 70 C120 54 150 52 170 60 V150 C150 142 120 144 100 160 Z"/>'
        + '<path class="tr" d="M44 78 C60 74 78 76 88 84 M44 96 C60 92 78 94 88 102 '
        + 'M112 84 C122 76 140 74 156 78 M112 102 C122 94 140 92 156 96"/>';
    },


    folha: function () {
      return ''
        + '<path class="tr salvia" d="M60 160 C40 100 80 50 150 40 C160 100 120 150 60 160 Z"/>'
        + '<path class="tr" d="M60 160 C84 120 110 90 140 54"/>';
    },


    capim: function () {
      return ''
        + '<path class="tr" d="M60 190 C62 150 56 130 46 112 M80 190 C82 140 90 120 104 100 '
        + 'M100 190 C100 160 108 140 124 124 M120 190 C124 160 140 150 154 142"/>';
    }
  };


  /* Devolve só o miolo do SVG (para encaixar em outro SVG) */
  function interno(nome) {
    const desenho = desenhos[nome] || desenhos.flor;
    return desenho();
  }


  /* Devolve um <svg> completo, pronto para colocar na página */
  function svg(nome) {
    return '<svg class="rabisco-svg" viewBox="0 0 200 200" '
         + 'aria-hidden="true" focusable="false">'
         + interno(nome)
         + '</svg>';
  }


  /* Lista dos nomes disponíveis */
  function nomes() {
    return Object.keys(desenhos);
  }


  return {
    interno: interno,
    svg:     svg,
    nomes:   nomes
  };

})();
