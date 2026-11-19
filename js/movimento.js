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
    var sobreHero = true;
    function atualizar() {
      cabecalho.classList.toggle('com-fundo', menuAberto || !sobreHero);
    }
    var menu = document.getElementById('menu-principal');
    if (menu) {
      menu.addEventListener('show.bs.collapse', function () { menuAberto = true; atualizar(); });
      menu.addEventListener('hidden.bs.collapse', function () { menuAberto = false; atualizar(); });
    }
    /* O observador avisa quando a base do hero passa por baixo do cabeçalho,
       inclusive quando a página já abre rolada (link com #âncora). */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        sobreHero = entradas[0].isIntersecting;
        atualizar();
      }, { rootMargin: '-' + (cabecalho.offsetHeight + 8) + 'px 0px 0px 0px' }).observe(hero);
    } else {
      sobreHero = false;
    }
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
    if (!hero) { return null; }
    var foto = hero.querySelector('.hero-foto');
    var sombra = hero.querySelector('.hero-sombra');
    var nome = hero.querySelector('.hero-nome');
    var conteudo = hero.querySelector('.hero-conteudo');
    var resto = hero.querySelectorAll('[data-entrada]');

    // Só o nome visível (aria-hidden) é dividido em letras; o leitor de tela lê o texto escondido do h1
    var letras = SplitText.create(nome, { type: 'chars,lines', mask: 'lines', linesClass: 'linha-titulo', aria: 'none' });

    liberarEntrada();
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from(foto, { scale: 1.15, duration: 2.4, ease: 'power3.out' }, 0)
      .from(letras.chars, { yPercent: 108, duration: 1.4, stagger: 0.05 }, 0.3)
      .from(resto, { autoAlpha: 0, y: 16, duration: 1, stagger: 0.1 }, 0.9);

    /* Camadas: a foto anda devagar, o texto sobe um pouco mais rápido
       e um véu escurece a cena até a próxima seção. */
    gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
    })
      .to(foto, { yPercent: 18, scale: 1.08, ease: 'none' }, 0)
      .to(sombra, { opacity: 0.8, ease: 'none' }, 0)
      .to(conteudo, { yPercent: -12, ease: 'none' }, 0);

    return function () { letras.revert(); };
  }

  /* ---------------------------------------------------------------------
     Colagem: cada coluna de fotos anda numa velocidade diferente
     (data-velocidade) e cada foto dá um leve zoom de dentro do quadro.
     --------------------------------------------------------------------- */
  function animarColagem() {
    document.querySelectorAll('.colagem-fotos').forEach(function (bloco) {
      bloco.querySelectorAll('[data-velocidade]').forEach(function (coluna) {
        var v = parseFloat(coluna.getAttribute('data-velocidade')) || 1;
        gsap.fromTo(coluna, { y: (v - 1) * 260 }, {
          y: (1 - v) * 260,
          ease: 'none',
          scrollTrigger: { trigger: bloco, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
      bloco.querySelectorAll('.foto-quadro img').forEach(function (img) {
        gsap.fromTo(img, { scale: 1.18 }, {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom 40%', scrub: true }
        });
      });
    });
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
      animarColagem();
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
