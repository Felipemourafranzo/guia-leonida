(function () {
  'use strict';

  var CHAVE_TEMA = 'gl-tema';
  var CHAVE_A11Y = 'gl-a11y';
  var raiz = document.documentElement;
  var consultaEscuro = window.matchMedia('(prefers-color-scheme: dark)');

  function lerPreferencia() {
    try {
      var valor = localStorage.getItem(CHAVE_TEMA);

      return valor === 'claro' || valor === 'escuro' || valor === 'sistema' ? valor : 'escuro';
    } catch (erro) {
      return 'escuro';
    }
  }

  function temaEfetivo(preferencia) {
    if (preferencia === 'sistema') {
      return consultaEscuro.matches ? 'dark' : 'light';
    }
    return preferencia === 'escuro' ? 'dark' : 'light';
  }

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

  function definir(preferencia) {
    try {
      localStorage.setItem(CHAVE_TEMA, preferencia);
    } catch (erro) { }
    aplicar(preferencia);
    document.dispatchEvent(new CustomEvent('gl:tema', {
      detail: { preferencia: preferencia, tema: raiz.getAttribute('data-bs-theme') }
    }));
  }

  function alternar() {
    var escuro = raiz.getAttribute('data-bs-theme') === 'dark';
    definir(escuro ? 'claro' : 'escuro');
  }

  consultaEscuro.addEventListener('change', function () {
    if (lerPreferencia() === 'sistema') {
      aplicar('sistema');
    }
  });

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

    var reduzido = !!prefs.reduzirMovimento ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    raiz.classList.toggle('gl-entrada', !reduzido);

    raiz.classList.toggle('movimento', !reduzido);
  }

  aplicar(lerPreferencia());
  aplicarA11ySalva();

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-alternar-tema]').forEach(function (botao) {
      botao.addEventListener('click', alternar);
    });
    atualizarBotoes();
  });

  window.GLTema = {
    ler: lerPreferencia,
    definir: definir,
    alternar: alternar
  };
})();
