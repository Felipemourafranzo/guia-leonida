/* ==========================================================================
   Guia Leonida: movimento.js
   --------------------------------------------------------------------------
   Animações com GSAP (+ ScrollTrigger e SplitText) e rolagem suave com Lenis.

   Regras de acessibilidade (obrigatórias):
   - Tudo só liga quando o sistema NÃO pede menos movimento
     (prefers-reduced-motion) E a opção "Reduzir animações" do painel está
     desligada (window.GLA11y.movimentoReduzido()).
   - Se o usuário muda a opção no painel (evento "gl:a11y"), tudo é desfeito
     na hora com gsap.matchMedia().revert() e a página fica estática.
   - Nenhum conteúdo depende da animação para aparecer: sem JS, sem GSAP ou
     com movimento reduzido, tudo já está visível no lugar final.
   ========================================================================== */
(function () {
  'use strict';

  var raiz = document.documentElement;

  /* Libera o conteúdo escondido para a entrada (ver theme.js e leonida.css) */
  function liberarEntrada() { raiz.classList.remove('gl-entrada'); }

  function movimentoPermitido() {
    var reduzido = window.GLA11y ? GLA11y.movimentoReduzido()
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !reduzido;
  }

  /* ---------------------------------------------------------------------
     Cabeçalho: fica transparente sobre o hero e ganha fundo ao rolar.
     Funciona com ou sem animações.
     --------------------------------------------------------------------- */
  function iniciarCabecalho() {
    var cabecalho = document.querySelector('.cabecalho');
    var hero = document.querySelector('.hero');
    if (!cabecalho) { return; }
    if (!hero) { document.body.classList.add('sem-hero'); return; }
    var menuAberto = false;
    function atualizar() {
      var limite = hero.offsetHeight - cabecalho.offsetHeight - 8;
      cabecalho.classList.toggle('com-fundo', menuAberto || window.scrollY > limite);
    }
    var menu = document.getElementById('menu-principal');
    if (menu) {
      menu.addEventListener('show.bs.collapse', function () { menuAberto = true; atualizar(); });
      menu.addEventListener('hidden.bs.collapse', function () { menuAberto = false; atualizar(); });
    }
    window.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar);
    atualizar();
  }

  /* ---------------------------------------------------------------------
     Lenis (rolagem suave). Só com movimento permitido.
     O teclado continua usando a rolagem nativa do navegador.
     --------------------------------------------------------------------- */
  var lenis = null;
  var tickLenis = null;
  function ligarLenis() {
    if (lenis || !window.Lenis) { return; }
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, autoRaf: false });
    if (window.ScrollTrigger) { lenis.on('scroll', ScrollTrigger.update); }
    tickLenis = function (tempo) { lenis.raf(tempo * 1000); };
    gsap.ticker.add(tickLenis);
    gsap.ticker.lagSmoothing(0);
  }
  function desligarLenis() {
    if (!lenis) { return; }
    gsap.ticker.remove(tickLenis);
    lenis.destroy();
    lenis = null;
  }

  /* ---------------------------------------------------------------------
     Hero: entrada (foto + título por máscara + status gigante) e
     parallax em camadas com escurecimento ao rolar.
     --------------------------------------------------------------------- */
  function animarHero() {
    var hero = document.querySelector('.hero');
    if (!hero) { return; }
    var foto = hero.querySelector('.hero-foto');
    var sombra = hero.querySelector('.hero-sombra');
    var titulo = hero.querySelector('h1');
    var palavra = hero.querySelector('[data-status-palavra]');
    var conteudo = hero.querySelector('.hero-conteudo');
    var resto = hero.querySelectorAll('[data-entrada]');

    var linhas = SplitText.create(titulo, { type: 'lines', mask: 'lines', linesClass: 'linha-split' });
    var letras = palavra ? SplitText.create(palavra, { type: 'chars,lines', mask: 'lines', linesClass: 'linha-palavra' }) : null;

    liberarEntrada();
    var entrada = gsap.timeline({ defaults: { ease: 'expo.out' } });
    entrada
      .from(foto, { scale: 1.14, duration: 2.2, ease: 'power3.out' }, 0)
      .from(linhas.lines, { yPercent: 110, duration: 1.2, stagger: 0.09 }, 0.25)
      .from(resto, { autoAlpha: 0, y: 18, duration: 1, stagger: 0.08 }, 0.6);
    if (letras) {
      entrada.from(letras.chars, { yPercent: 105, duration: 1.3, stagger: 0.045 }, 0.45);
    }

    /* Camadas: a foto anda devagar, o status anda menos que o conteúdo,
       e um véu escurece a cena até a próxima seção. */
    var rolagem = gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
    });
    rolagem
      .to(foto, { yPercent: 16, scale: 1.08, ease: 'none' }, 0)
      .to(sombra, { opacity: 0.75, ease: 'none' }, 0)
      .to(conteudo, { y: -90, ease: 'none' }, 0);
    if (palavra) { rolagem.to(palavra, { yPercent: -18, ease: 'none' }, 0); }

    /* Ao desfazer (movimento reduzido ligado), devolve o texto original */
    return function () {
      linhas.revert();
      if (letras) { letras.revert(); }
    };
  }

  /* ---------------------------------------------------------------------
     Liga/desliga tudo de acordo com as preferências
     --------------------------------------------------------------------- */
  var mm = null;
  var estadoAtual = null;
  function configurar() {
    var permitido = !!window.gsap && movimentoPermitido();
    if (permitido === estadoAtual) { return; } // ex.: só mudou o tamanho da fonte
    estadoAtual = permitido;
    if (mm) { mm.revert(); mm = null; }
    desligarLenis();

    if (!window.gsap || !movimentoPermitido()) {
      liberarEntrada();
      return;
    }
    gsap.registerPlugin(ScrollTrigger, SplitText);
    mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', function () {
      ligarLenis();
      var desfazerHero = animarHero();
      return function () {
        if (desfazerHero) { desfazerHero(); }
        desligarLenis();
      };
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    iniciarCabecalho();
    // Espera as fontes para o SplitText medir as linhas certas
    var pronto = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    pronto.then(configurar);
    document.addEventListener('gl:a11y', function () { configurar(); });
  });
})();
