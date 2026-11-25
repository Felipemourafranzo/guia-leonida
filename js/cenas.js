/* ==========================================================================
   Guia Leonida: cenas.js ("trailer de rolagem")
   --------------------------------------------------------------------------
   - Abertura: a marca aparece, depois o logo de GTA VI e a frase em degradê
     revelada palavra por palavra conforme a rolagem.
   - Cena de vídeo: quadros WebP extraídos de um videoclipe oficial (ffmpeg,
     ver tools/processar_kit.py) desenhados num <canvas> preso na tela; a
     rolagem escolhe o quadro. Os quadros carregam aos poucos (1 a cada 8,
     depois 1 a cada 4, 2 e 1) e a primeira imagem aparece enquanto isso.
     No celular (até 767 px) ou com "economia de dados", usa a versão leve
     (720 px, metade dos quadros).
   - Rolagem suave com Lenis.

   Acessibilidade (obrigatório):
   - Nada liga com prefers-reduced-motion ou com "Reduzir animações" do
     painel (GLA11y.movimentoReduzido()). Nesse modo o <html> recebe a
     classe .sem-movimento e o CSS mostra as cenas como imagens paradas em
     sequência. Mudou a opção no painel (evento "gl:a11y")? Tudo é desfeito
     ou religado na hora.
   - Todo texto está no HTML; a animação só muda opacidade e posição.
     Nunca visibility/display: o texto apagado continua para o leitor de
     tela, e um link apagado reaparece quando recebe foco (cenas.css).
   - Só transform/opacity; will-change só enquanto a cena está na tela.
   Depende de GSAP 3 + ScrollTrigger e Lenis (jsDelivr, versões fixas com SRI).
   ========================================================================== */
(function () {
  'use strict';

  var raiz = document.documentElement;

  function movimentoPermitido() {
    if (!window.gsap || !window.ScrollTrigger) { return false; }
    var reduzido = window.GLA11y ? GLA11y.movimentoReduzido()
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !reduzido;
  }

  /* ---------------------------------------------------------------------
     Cabeçalho: transparente no topo, sólido depois de rolar
     --------------------------------------------------------------------- */
  function iniciarCabecalho() {
    var cabecalho = document.querySelector('.cabecalho-cena');
    if (!cabecalho) { return; }
    var ticando = false;
    function atualizar() {
      cabecalho.classList.toggle('com-fundo', window.scrollY > window.innerHeight * 0.6);
      ticando = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticando) { ticando = true; requestAnimationFrame(atualizar); }
    }, { passive: true });
    atualizar();
  }

  /* ---------------------------------------------------------------------
     Frase em degradê: quebra em palavras (só para quem vê; o leitor de
     tela lê o texto inteiro num span escondido) e posiciona o degradê de cada
     palavra para formar um degradê contínuo.
     --------------------------------------------------------------------- */
  function prepararFrase(frase) {
    if (frase.dataset.pronta) { return frase.querySelectorAll('.palavra'); }
    var texto = frase.textContent.trim().replace(/\s+/g, ' ');
    frase.textContent = '';
    var lido = document.createElement('span');
    lido.className = 'visually-hidden';
    lido.textContent = texto;
    var visto = document.createElement('span');
    visto.setAttribute('aria-hidden', 'true');
    texto.split(' ').forEach(function (p, i) {
      if (i) { visto.appendChild(document.createTextNode(' ')); }
      var s = document.createElement('span');
      s.className = 'palavra';
      s.textContent = p;
      visto.appendChild(s);
    });
    frase.appendChild(lido);
    frase.appendChild(visto);
    frase.dataset.pronta = '1';
    posicionarDegrade(frase);
    return frase.querySelectorAll('.palavra');
  }
  function posicionarDegrade(frase) {
    var caixa = frase.getBoundingClientRect();
    frase.querySelectorAll('.palavra').forEach(function (p) {
      var r = p.getBoundingClientRect();
      p.style.setProperty('--x', (r.left - caixa.left) + 'px');
      p.style.setProperty('--w', caixa.width + 'px');
    });
  }

  /* ---------------------------------------------------------------------
     Abertura
     --------------------------------------------------------------------- */
  function animarAbertura() {
    var secao = document.querySelector('.abertura');
    if (!secao) { return; }
    var marca = secao.querySelector('.abertura-marca');
    var logo = secao.querySelector('.abertura-logo');
    var frase = secao.querySelector('.frase-sol');
    var dica = secao.querySelector('.dica-rolar');
    var palavras = prepararFrase(frase);

    // Entrada ao abrir a página (não depende da rolagem)
    gsap.from(marca.children, { opacity: 0, y: 30, scale: 1.04, duration: 1.4, ease: 'expo.out', stagger: 0.12 });

    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: secao, start: 'top top', end: 'bottom bottom', scrub: 0.6 }
    })
      .to(dica, { opacity: 0, duration: 0.05 }, 0)
      .to(marca, { opacity: 0, scale: 0.86, duration: 0.18 }, 0.04)
      .fromTo(logo, { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: 0.22, ease: 'power2.out' }, 0.16)
      .fromTo(frase, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 0.24)
      .fromTo(palavras, { opacity: 0.15 }, { opacity: 1, duration: 0.05, stagger: 0.045 }, 0.38)
      .to({}, { duration: 0.12 }); // respiro antes da próxima cena
  }

  /* ---------------------------------------------------------------------
     Cena de vídeo em canvas
     --------------------------------------------------------------------- */
  function CenaVideo(secao) {
    this.secao = secao;
    this.palco = secao.querySelector('.cena-palco');
    this.canvas = secao.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    var leve = window.matchMedia('(max-width: 767.98px)').matches ||
      (navigator.connection && navigator.connection.saveData);
    var largura = leve ? '720' : '1280';
    this.total = parseInt(secao.getAttribute('data-quadros-' + largura), 10) || 1;
    this.pasta = secao.dataset.pasta + largura + '/';
    this.quadros = new Array(this.total);
    this.atual = 0;
    this.desenhado = -1;
    this.carregando = false;
    this.destruida = false;
    this.redimensionar = this.redimensionar.bind(this);
    window.addEventListener('resize', this.redimensionar);
    this.redimensionar();
  }
  CenaVideo.prototype.url = function (i) {
    return this.pasta + 'q' + String(i + 1).padStart(3, '0') + '.webp';
  };
  /* Ordem de carga: 0, 8, 16… depois 4, 12… depois 2, 6… depois o resto.
     Assim a cena inteira fica "rolável" cedo, e vai ganhando detalhe. */
  CenaVideo.prototype.carregar = function () {
    if (this.carregando) { return; }
    this.carregando = true;
    var ordem = [];
    var visto = {};
    [8, 4, 2, 1].forEach(function (passo) {
      for (var i = 0; i < this.total; i += passo) {
        if (!visto[i]) { visto[i] = 1; ordem.push(i); }
      }
    }, this);
    if (!visto[this.total - 1]) { ordem.push(this.total - 1); }
    var self = this;
    var proximo = 0;
    function baixar() {
      if (self.destruida || proximo >= ordem.length) { return; }
      var i = ordem[proximo++];
      var img = new Image();
      img.decoding = 'async';
      img.src = self.url(i);
      var pronto = img.decode ? img.decode() : new Promise(function (ok) { img.onload = ok; });
      pronto.then(function () {
        self.quadros[i] = img;
        if (i === 0) { self.palco.classList.add('pronta'); }
        self.desenhar(true);
      }).catch(function () { /* quadro faltando: usa o vizinho */ }).then(baixar);
    }
    for (var n = 0; n < 4; n++) { baixar(); } // 4 downloads em paralelo
  };
  CenaVideo.prototype.vizinho = function (i) {
    for (var d = 0; d < this.total; d++) {
      if (this.quadros[i - d]) { return this.quadros[i - d]; }
      if (this.quadros[i + d]) { return this.quadros[i + d]; }
    }
    return null;
  };
  CenaVideo.prototype.irPara = function (progresso) {
    this.atual = Math.min(this.total - 1, Math.max(0, Math.round(progresso * (this.total - 1))));
    this.desenhar(false);
  };
  CenaVideo.prototype.desenhar = function (forcar) {
    var img = this.vizinho(this.atual);
    if (!img || (!forcar && img === this.desenhado)) { return; }
    this.desenhado = img;
    var c = this.canvas;
    // Equivalente a object-fit: cover
    var escala = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
    var w = img.naturalWidth * escala;
    var h = img.naturalHeight * escala;
    this.ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
  };
  CenaVideo.prototype.redimensionar = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.palco.clientWidth * dpr);
    this.canvas.height = Math.round(this.palco.clientHeight * dpr);
    this.desenhado = -1;
    this.desenhar(true);
  };
  CenaVideo.prototype.destruir = function () {
    this.destruida = true;
    window.removeEventListener('resize', this.redimensionar);
    this.palco.classList.remove('pronta');
  };

  function animarCenas() {
    var cenas = [];
    document.querySelectorAll('.cena[data-pasta]').forEach(function (secao) {
      var cena = new CenaVideo(secao);
      cenas.push(cena);
      var texto = secao.querySelectorAll('.cena-texto > *');
      var barra = secao.querySelector('.cena-progresso span');

      // Começa a baixar quando a cena está a ~1,5 tela de distância
      ScrollTrigger.create({
        trigger: secao, start: 'top bottom+=150%', once: true,
        onEnter: function () { cena.carregar(); }
      });

      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: secao, start: 'top top', end: 'bottom bottom', scrub: 0.4,
          onUpdate: function (st) { cena.irPara(st.progress); },
          onToggle: function (st) { cena.canvas.style.willChange = st.isActive ? 'contents' : ''; }
        }
      })
        .to(barra, { scaleY: 1, duration: 1 }, 0)
        .fromTo(texto, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.12, stagger: 0.06, ease: 'power2.out' }, 0.18)
        .to(texto, { opacity: 0, y: -30, duration: 0.1, stagger: 0.03 }, 0.86);
    });
    return function () { cenas.forEach(function (c) { c.destruir(); }); };
  }

  /* ---------------------------------------------------------------------
     Lenis (rolagem suave) ligado ao relógio do GSAP
     --------------------------------------------------------------------- */
  var lenis = null;
  var tick = null;
  function ligarLenis() {
    if (lenis || !window.Lenis) { return; }
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    tick = function (t) { lenis.raf(t * 1000); };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Âncoras internas (ex.: "Pular para o conteúdo") passam pelo Lenis
    document.addEventListener('click', ancora);
  }
  function desligarLenis() {
    if (!lenis) { return; }
    gsap.ticker.remove(tick);
    document.removeEventListener('click', ancora);
    lenis.destroy();
    lenis = null;
  }
  function ancora(e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) { return; }
    var alvo = document.querySelector(a.getAttribute('href'));
    if (alvo && lenis) { lenis.scrollTo(alvo, { immediate: true }); }
  }

  /* ---------------------------------------------------------------------
     Liga e desliga tudo conforme as preferências
     --------------------------------------------------------------------- */
  var desfazer = null;
  var estado = null;
  function configurar() {
    var permitido = movimentoPermitido();
    if (permitido === estado) { return; }
    estado = permitido;
    if (desfazer) { desfazer(); desfazer = null; }
    raiz.classList.toggle('sem-movimento', !permitido);
    if (!permitido) { return; }

    gsap.registerPlugin(ScrollTrigger);
    var ctx = gsap.context(function () {});
    var pararCenas;
    ctx.add(function () {
      animarAbertura();
      pararCenas = animarCenas();
    });
    ligarLenis();
    ScrollTrigger.refresh();
    desfazer = function () {
      desligarLenis();
      if (pararCenas) { pararCenas(); }
      ctx.revert(); // devolve todo elemento ao estado original (visível)
    };
  }

  // Antes do primeiro desenho: decide o modo para não "piscar" a versão errada
  var reduzidoAgora = window.GLA11y ? GLA11y.movimentoReduzido()
    : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  raiz.classList.toggle('sem-movimento', reduzidoAgora || !window.gsap);

  document.addEventListener('DOMContentLoaded', function () {
    iniciarCabecalho();
    var fontes = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontes.then(configurar);
    document.addEventListener('gl:a11y', configurar);
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', configurar);
    var espera;
    window.addEventListener('resize', function () {
      clearTimeout(espera);
      espera = setTimeout(function () {
        document.querySelectorAll('.frase-sol[data-pronta]').forEach(posicionarDegrade);
      }, 150);
    });
  });

  // Usado pela barra do protótipo para refazer o degradê depois de trocar a fonte
  window.GLCenas = {
    refazerDegrade: function () {
      document.querySelectorAll('.frase-sol[data-pronta]').forEach(posicionarDegrade);
      if (window.ScrollTrigger) { ScrollTrigger.refresh(); }
    }
  };
})();
