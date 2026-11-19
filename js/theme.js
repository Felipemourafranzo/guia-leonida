/* ==========================================================================
   Guia Leonida: theme.js
   --------------------------------------------------------------------------
   Controla o modo claro/escuro e aplica, o mais cedo possível, as
   preferências de acessibilidade salvas.

   Este arquivo é carregado no <head> SEM "defer" de propósito: assim o tema
   é aplicado antes de a página ser desenhada e não acontece o "flash" de
   tema errado (a página piscar branca antes de ficar escura).

   Preferência salva no localStorage (chave "gl-tema"):
     "sistema"  segue o prefers-color-scheme do sistema operacional (padrão)
     "claro"    força o modo claro
     "escuro"   força o modo escuro
   ========================================================================== */
(function () {
  'use strict';

  var CHAVE_TEMA = 'gl-tema';
  var CHAVE_A11Y = 'gl-a11y';
  var raiz = document.documentElement;
  var consultaEscuro = window.matchMedia('(prefers-color-scheme: dark)');

  /* localStorage pode falhar (modo privado, bloqueio de cookies): por isso
     toda leitura/escrita fica dentro de try/catch. */
  function lerPreferencia() {
    try {
      var valor = localStorage.getItem(CHAVE_TEMA);
      return valor === 'claro' || valor === 'escuro' ? valor : 'sistema';
    } catch (erro) {
      return 'sistema';
    }
  }

  /* Converte a preferência ("claro", "escuro", "sistema") no valor que o
     Bootstrap entende em data-bs-theme ("light" ou "dark"). */
  function temaEfetivo(preferencia) {
    if (preferencia === 'sistema') {
      return consultaEscuro.matches ? 'dark' : 'light';
    }
    return preferencia === 'escuro' ? 'dark' : 'light';
  }

  /* Atualiza o texto e o ícone de todos os botões de alternar tema. */
  function atualizarBotoes() {
    var escuro = raiz.getAttribute('data-bs-theme') === 'dark';
    var botoes = document.querySelectorAll('[data-alternar-tema]');
    botoes.forEach(function (botao) {
      var rotulo = escuro ? 'Mudar para o modo claro' : 'Mudar para o modo escuro';
      botao.setAttribute('aria-label', rotulo);
      botao.setAttribute('title', rotulo);
      var icone = botao.querySelector('i');
      if (icone) {
        icone.className = escuro ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
      }
    });
  }

  function aplicar(preferencia) {
    raiz.setAttribute('data-bs-theme', temaEfetivo(preferencia));
    atualizarBotoes();
  }

  /* Salva a escolha do usuário e avisa os outros scripts (ex.: o painel de
     acessibilidade, que mostra a opção marcada). */
  function definir(preferencia) {
    try {
      localStorage.setItem(CHAVE_TEMA, preferencia);
    } catch (erro) { /* sem armazenamento: o tema vale só nesta página */ }
    aplicar(preferencia);
    document.dispatchEvent(new CustomEvent('gl:tema', {
      detail: { preferencia: preferencia, tema: raiz.getAttribute('data-bs-theme') }
    }));
  }

  function alternar() {
    var escuro = raiz.getAttribute('data-bs-theme') === 'dark';
    definir(escuro ? 'claro' : 'escuro');
  }

  /* Se a preferência for "sistema", acompanha a troca do sistema em tempo real */
  consultaEscuro.addEventListener('change', function () {
    if (lerPreferencia() === 'sistema') {
      aplicar('sistema');
    }
  });

  /* ---- Aplicação antecipada das preferências de acessibilidade ----------
     O painel completo fica em a11y.js; aqui só aplicamos o que já estava
     salvo, para a página já nascer com fonte maior, alto contraste etc. */
  function aplicarA11ySalva() {
    var prefs = {};
    try {
      prefs = JSON.parse(localStorage.getItem(CHAVE_A11Y)) || {};
    } catch (erro) { prefs = {}; }

    if (prefs.contraste) { raiz.setAttribute('data-contraste', 'alto'); }
    if (prefs.escala && prefs.escala !== 1) {
      raiz.style.setProperty('--escala-fonte', prefs.escala);
    }
    raiz.classList.toggle('a11y-reduzir-movimento', !!prefs.reduzirMovimento);
    raiz.classList.toggle('a11y-dislexia', !!prefs.dislexia);
    raiz.classList.toggle('a11y-espacamento', !!prefs.espacamento);
    raiz.classList.toggle('a11y-sublinhar', !!prefs.sublinhar);
  }

  aplicar(lerPreferencia());
  aplicarA11ySalva();

  /* Liga os botões de alternar tema quando o HTML terminar de carregar */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-alternar-tema]').forEach(function (botao) {
      botao.addEventListener('click', alternar);
    });
    atualizarBotoes();
  });

  /* API pública usada por a11y.js */
  window.GLTema = {
    ler: lerPreferencia,
    definir: definir,
    alternar: alternar
  };
})();
