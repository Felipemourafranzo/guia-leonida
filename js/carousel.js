(function () {
  'use strict';

  var INTERVALO = 6000;

  function iniciarCarrossel(raiz) {
    var trilho = raiz.querySelector('.carrossel-trilho');
    var slides = Array.prototype.slice.call(raiz.querySelectorAll('.carrossel-slide'));
    var listaIndicadores = raiz.querySelector('[data-carrossel-indicadores]');
    var botaoPausar = raiz.querySelector('[data-carrossel-pausar]');
    var botaoAnterior = raiz.querySelector('[data-carrossel-anterior]');
    var botaoProximo = raiz.querySelector('[data-carrossel-proximo]');
    var atual = 0;
    var temporizador = null;
    var pausadoPeloUsuario = false;
    var pausaTemporaria = false;

    if (!slides.length) { return; }

    slides.forEach(function (slide, i) {
      slide.id = slide.id || 'slide-' + (i + 1);
      var titulo = slide.querySelector('h3');
      var li = document.createElement('li');
      var botao = document.createElement('button');
      botao.type = 'button';
      botao.setAttribute('aria-controls', slide.id);
      botao.setAttribute('aria-label', 'Slide ' + (i + 1) + ': ' + (titulo ? titulo.textContent : ''));
      botao.addEventListener('click', function () {
        irPara(i, true);
      });
      li.appendChild(botao);
      listaIndicadores.appendChild(li);
    });
    var indicadores = listaIndicadores.querySelectorAll('button');

    function irPara(indice, peloUsuario) {
      atual = (indice + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        var ativo = i === atual;
        slide.classList.toggle('ativo', ativo);

        slide.setAttribute('aria-hidden', ativo ? 'false' : 'true');
      });
      indicadores.forEach(function (botao, i) {
        if (i === atual) {
          botao.setAttribute('aria-current', 'true');
        } else {
          botao.removeAttribute('aria-current');
        }
      });

      if (peloUsuario && temporizador) {
        pararTemporizador();
        iniciarTemporizador();
      }
    }

    function movimentoReduzido() {
      return window.GLA11y ? GLA11y.movimentoReduzido()
        : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function iniciarTemporizador() {
      if (temporizador || pausadoPeloUsuario || pausaTemporaria || movimentoReduzido()) { return; }
      trilho.setAttribute('aria-live', 'off');
      temporizador = setInterval(function () { irPara(atual + 1, false); }, INTERVALO);
    }

    function pararTemporizador() {
      clearInterval(temporizador);
      temporizador = null;
      trilho.setAttribute('aria-live', 'polite');
    }

    function atualizarBotaoPausar() {
      var girando = !pausadoPeloUsuario && !movimentoReduzido();
      botaoPausar.querySelector('span').textContent = girando ? 'Pausar' : 'Reproduzir';
      botaoPausar.querySelector('i').className = girando ? 'bi bi-pause-fill' : 'bi bi-play-fill';
      botaoPausar.setAttribute('aria-label', girando
        ? 'Pausar a troca automática de slides'
        : 'Reproduzir a troca automática de slides');
    }

    botaoPausar.addEventListener('click', function () {
      if (movimentoReduzido() && !pausadoPeloUsuario) {
        if (window.GL) { GL.anunciar('A troca automática está desligada porque a opção "Reduzir animações" está ativa.'); }
        return;
      }
      pausadoPeloUsuario = !pausadoPeloUsuario;
      if (pausadoPeloUsuario) { pararTemporizador(); } else { pausaTemporaria = false; iniciarTemporizador(); }
      atualizarBotaoPausar();
    });

    botaoAnterior.addEventListener('click', function () { irPara(atual - 1, true); });
    botaoProximo.addEventListener('click', function () { irPara(atual + 1, true); });

    raiz.addEventListener('keydown', function (evento) {
      var mapa = { ArrowLeft: atual - 1, ArrowRight: atual + 1, Home: 0, End: slides.length - 1 };
      if (!(evento.key in mapa)) { return; }
      evento.preventDefault();
      irPara(mapa[evento.key], true);

      if (document.activeElement && document.activeElement.parentElement &&
          document.activeElement.parentElement.parentElement === listaIndicadores) {
        indicadores[atual].focus();
      }
    });

    raiz.addEventListener('mouseenter', function () { pausaTemporaria = true; pararTemporizador(); });
    raiz.addEventListener('mouseleave', function () { pausaTemporaria = false; iniciarTemporizador(); });
    raiz.addEventListener('focusin', function () { pausaTemporaria = true; pararTemporizador(); });
    raiz.addEventListener('focusout', function (evento) {
      if (!raiz.contains(evento.relatedTarget)) { pausaTemporaria = false; iniciarTemporizador(); }
    });

    document.addEventListener('gl:a11y', function () {
      if (movimentoReduzido()) { pararTemporizador(); } else { iniciarTemporizador(); }
      atualizarBotaoPausar();
    });
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function () {
      if (movimentoReduzido()) { pararTemporizador(); } else { iniciarTemporizador(); }
      atualizarBotaoPausar();
    });

    irPara(0, false);
    trilho.setAttribute('aria-live', 'polite');
    atualizarBotaoPausar();
    iniciarTemporizador();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-carrossel]').forEach(iniciarCarrossel);
  });
})();
