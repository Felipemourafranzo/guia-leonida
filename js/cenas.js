(function () {
  'use strict';

  var raiz = document.documentElement;

  function movimentoPermitido() {
    if (!window.gsap || !window.ScrollTrigger) { return false; }
    var reduzido = window.GLA11y ? GLA11y.movimentoReduzido()
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !reduzido;
  }

  function iniciarCabecalho() {
    var cabecalho = document.querySelector('.cabecalho');
    if (!cabecalho) { return; }
    var temHero = !!document.querySelector('.hero-pagina, .abertura');
    document.body.classList.toggle('sem-hero', !temHero);

    document.body.classList.toggle('hero-claro', !!document.querySelector('.abertura'));
    var ticando = false;
    function atualizar() {
      var limite = document.querySelector('.abertura') ? window.innerHeight * 0.6 : 40;
      cabecalho.classList.toggle('com-fundo', window.scrollY > limite);
      ticando = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticando) { ticando = true; requestAnimationFrame(atualizar); }
    }, { passive: true });
    atualizar();
  }

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

  function animarAbertura() {
    var secao = document.querySelector('.abertura');
    if (!secao) { return; }
    var marca = secao.querySelector('.abertura-marca');
    var logo = secao.querySelector('.abertura-logo');
    var frase = secao.querySelector('.frase-sol');
    var dica = secao.querySelector('.dica-rolar');
    var palavras = prepararFrase(frase);

    gsap.from(marca.querySelectorAll('.titulo-cena'), {
      opacity: 0, y: 30, scale: 1.04, duration: 1.4, ease: 'expo.out'
    });

    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: secao, start: 'top top', end: 'bottom bottom', scrub: 0.6 }
    })
      .to(dica, { opacity: 0, duration: 0.05 }, 0)
      .to(marca, { opacity: 0, scale: 0.86, duration: 0.18 }, 0.04)
      .fromTo(logo, { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: 0.22, ease: 'power2.out' }, 0.16)
      .fromTo(frase, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 0.24)
      .fromTo(palavras, { opacity: 0.15 }, { opacity: 1, duration: 0.05, stagger: 0.045 }, 0.38)
      .to({}, { duration: 0.12 });
  }

  function animarParalaxe() {
    document.querySelectorAll('[data-velocidade]').forEach(function (el) {
      var v = parseFloat(el.getAttribute('data-velocidade')) || 0;
      var secao = el.closest('section') || el.parentNode;
      gsap.fromTo(el, { yPercent: -v * 60 }, {
        yPercent: v * 60,
        ease: 'none',
        scrollTrigger: { trigger: secao, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    document.querySelectorAll('[data-parallax]').forEach(function (foto) {
      var secao = foto.closest('section');
      gsap.fromTo(foto, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power3.out' });
      gsap.to(foto, {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: { trigger: secao, start: 'top top', end: 'bottom top', scrub: true }
      });
    });

    var conteudo = document.querySelector('.hero-camadas-conteudo');
    if (conteudo) {
      gsap.from(conteudo.children, {
        opacity: 0, y: 40, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: conteudo, start: 'top 95%', end: 'top 60%', scrub: 0.5 }
      });
    }
  }

  function CenaVideo(secao) {
    this.secao = secao;
    this.palco = secao.querySelector('.cena-palco');
    this.canvas = secao.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    var leve = window.matchMedia('(max-width: 767.98px)').matches ||
      !!(navigator.connection && navigator.connection.saveData);
    var largura = leve ? '720' : '1280';
    this.total = parseInt(secao.getAttribute('data-quadros-' + largura), 10) || 1;
    this.pasta = secao.getAttribute('data-pasta') + largura + '/';

    this.focoX = parseFloat(secao.getAttribute('data-foco-x'));
    if (isNaN(this.focoX)) { this.focoX = 0.5; }
    this.quadros = new Array(this.total);
    this.atual = 0;
    this.posicao = 0;
    this.desenhado = null;
    this.mistura = -1;
    this.carregando = false;
    this.destruida = false;
    this.redimensionar = this.redimensionar.bind(this);
    window.addEventListener('resize', this.redimensionar);
    this.redimensionar();
  }
  CenaVideo.prototype.url = function (i) {
    return this.pasta + 'q' + String(i + 1).padStart(3, '0') + '.webp';
  };

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
        return window.createImageBitmap ? createImageBitmap(img) : img;
      }).then(function (quadro) {
        self.quadros[i] = quadro;
        if (i === 0) { self.palco.classList.add('pronta'); }
        self.desenhar(true);
      }).catch(function () { }).then(baixar);
    }
    for (var n = 0; n < 4; n++) { baixar(); }
  };
  CenaVideo.prototype.vizinho = function (i) {
    for (var d = 0; d < this.total; d++) {
      if (this.quadros[i - d]) { return this.quadros[i - d]; }
      if (this.quadros[i + d]) { return this.quadros[i + d]; }
    }
    return null;
  };
  CenaVideo.prototype.irPara = function (progresso) {
    this.posicao = Math.min(this.total - 1, Math.max(0, progresso * (this.total - 1)));
    this.atual = Math.floor(this.posicao);
    this.desenhar(false);
  };
  CenaVideo.prototype.pintar = function (img, alfa) {
    var c = this.canvas;
    var iw = img.naturalWidth || img.width;
    var ih = img.naturalHeight || img.height;
    var escala = Math.max(c.width / iw, c.height / ih);
    var w = iw * escala;
    var h = ih * escala;
    this.ctx.globalAlpha = alfa;
    this.ctx.drawImage(img, (c.width - w) * this.focoX, (c.height - h) / 2, w, h);
    this.ctx.globalAlpha = 1;
  };
  CenaVideo.prototype.desenhar = function (forcar) {
    var img = this.vizinho(this.atual);
    if (!img) { return; }
    var seguinte = this.atual + 1 < this.total ? this.quadros[this.atual + 1] : null;
    var fracao = seguinte && seguinte !== img ? Math.round((this.posicao - this.atual) * 12) / 12 : 0;
    if (!forcar && img === this.desenhado && fracao === this.mistura) { return; }
    this.desenhado = img;
    this.mistura = fracao;
    this.pintar(img, 1);
    if (fracao > 0) { this.pintar(seguinte, fracao); }
  };
  CenaVideo.prototype.redimensionar = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.palco.clientWidth * dpr);
    this.canvas.height = Math.round(this.palco.clientHeight * dpr);
    this.desenhado = null;
    this.desenhar(true);
  };
  CenaVideo.prototype.destruir = function () {
    this.destruida = true;
    this.quadros.forEach(function (q) { if (q && q.close) { q.close(); } });
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

  function animarTour() {
    var palco = document.querySelector('.tour-palco');
    if (!palco) { return; }
    var slides = palco.querySelectorAll('.tour-slide');
    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: palco, start: 'top top', end: 'bottom bottom', scrub: 0.6,
        onToggle: function (st) {
          slides.forEach(function (s) { s.style.willChange = st.isActive ? 'opacity' : ''; });
        }
      }
    });
    slides.forEach(function (slide, i) {
      var foto = slide.querySelector('img');
      var texto = slide.querySelectorAll('.tour-texto > *');
      if (i > 0) {
        tl.to(slides[i - 1].querySelectorAll('.tour-texto > *'), { opacity: 0, y: -30, duration: 0.15, stagger: 0.02 }, i - 0.3);
        tl.fromTo(slide, { opacity: 0 }, { opacity: 1, duration: 0.3 }, i - 0.15);
      }
      tl.fromTo(foto, { scale: 1.16 }, { scale: 1, duration: 1.3 }, Math.max(0, i - 0.15));
      tl.fromTo(texto, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.05, ease: 'power2.out' }, i === 0 ? 0 : i + 0.05);
    });
    tl.to({}, { duration: 0.6 });
  }

  function animarMapaCena() {
    var secao = document.querySelector('.mapa-cena');
    if (!secao) { return; }
    var poster = secao.querySelector('.mapa-cena-poster');
    var pinos = secao.querySelectorAll('.mapa-pino');
    var itens = secao.querySelectorAll('.mapa-cena-lista li');
    poster.style.transformOrigin = '67.3% 52.1%';
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: secao, start: 'top top', end: 'bottom bottom', scrub: 0.6,
        onToggle: function (st) { poster.style.willChange = st.isActive ? 'transform' : ''; }
      }
    })
      .fromTo(poster, { scale: 3.2 }, { scale: 1, duration: 0.45, ease: 'power1.inOut' }, 0)
      .fromTo(itens, { opacity: 0.75, x: -14 }, { opacity: 1, x: 0, duration: 0.06, stagger: 0.07 }, 0.42)
      .fromTo(pinos, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.06, stagger: 0.07, ease: 'back.out(2)' }, 0.42)
      .to({}, { duration: 0.1 });
  }

  var faixa = null;
  function animarFaixa() {
    var secao = document.querySelector('.destaques');
    var trilho = secao && secao.querySelector('.destaques-trilho');
    if (!trilho || trilho.children.length < 2) { return null; }
    var janela = secao.querySelector('.destaques-janela');
    raiz.classList.add('com-faixa-animada');
    function distancia() {
      return Math.max(0, trilho.scrollWidth - janela.clientWidth + parseFloat(getComputedStyle(janela).paddingLeft) * 2);
    }
    function medir() { secao.style.setProperty('--altura-faixa-animada', (distancia() + window.innerHeight * 1.2) + 'px'); }
    medir();
    var tween = gsap.to(trilho, {
      x: function () { return -distancia(); },
      ease: 'none',
      scrollTrigger: {
        trigger: secao, start: 'top top', end: 'bottom bottom', scrub: 0.5,
        invalidateOnRefresh: true, onRefreshInit: medir
      }
    });
    faixa = { tween: tween, distancia: distancia };
    return function () {
      raiz.classList.remove('com-faixa-animada');
      secao.style.removeProperty('--altura-faixa-animada');
      faixa = null;
    };
  }

  function iniciarBotoesFaixa() {
    var secao = document.querySelector('.destaques');
    if (!secao) { return; }
    var janela = secao.querySelector('.destaques-janela');
    var trilho = secao.querySelector('.destaques-trilho');
    var indice = 0;
    function itens() { return Array.prototype.slice.call(trilho.children); }
    function irPara(i) {
      var lista = itens();
      indice = Math.max(0, Math.min(lista.length - 1, i));
      var alvo = lista[indice];
      if (faixa && faixa.tween.scrollTrigger) {
        var st = faixa.tween.scrollTrigger;
        var p = Math.min(1, alvo.offsetLeft / Math.max(1, faixa.distancia()));
        rolarPara(st.start + (st.end - st.start) * p);
      } else {
        janela.scrollTo({ left: alvo.offsetLeft, behavior: 'auto' });
      }
    }
    secao.querySelector('[data-destaques-anterior]').addEventListener('click', function () { irPara(indice - 1); });
    secao.querySelector('[data-destaques-proximo]').addEventListener('click', function () { irPara(indice + 1); });

    trilho.addEventListener('focusin', function (e) {
      var i = itens().indexOf(e.target.closest('.destaque-item'));
      if (i < 0) { return; }
      if (i !== indice && faixa) { irPara(i); }
      indice = i;
    });
  }

  function iniciarLightbox() {
    var modal = document.getElementById('lightbox');
    if (!modal || !window.bootstrap) { return; }
    var img = modal.querySelector('[data-lightbox-img]');
    var legenda = modal.querySelector('[data-lightbox-legenda]');
    document.addEventListener('click', function (e) {
      var botao = e.target.closest('[data-ampliar]');
      if (!botao) { return; }
      var miniatura = botao.querySelector('img');
      img.src = botao.getAttribute('data-ampliar');
      img.alt = miniatura.alt;
      legenda.textContent = miniatura.alt + '. Foto: © Rockstar Games.';
      bootstrap.Modal.getOrCreateInstance(modal).show();
    });
  }

  var lenis = null;
  var tick = null;
  function rolarPara(y) {
    if (lenis) { lenis.scrollTo(y); } else { window.scrollTo({ top: y, behavior: 'auto' }); }
  }
  function pausarLenis() { if (lenis) { lenis.stop(); } }
  function retomarLenis() { if (lenis) { lenis.start(); } }
  function ancora(e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2 || !lenis) { return; }
    var alvo = document.getElementById(a.getAttribute('href').slice(1));
    if (alvo) { lenis.scrollTo(alvo, { immediate: true }); }
  }
  function ligarLenis() {
    if (lenis || !window.Lenis) { return; }
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    tick = function (t) { lenis.raf(t * 1000); };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', ancora);
  }
  function desligarLenis() {
    if (!lenis) { return; }
    gsap.ticker.remove(tick);
    document.removeEventListener('click', ancora);
    lenis.destroy();
    lenis = null;
  }

  var desfazer = null;
  var estado = null;
  function configurar() {
    var permitido = movimentoPermitido();
    if (permitido === estado) { return; }
    estado = permitido;
    if (desfazer) { desfazer(); desfazer = null; }
    raiz.classList.toggle('movimento', permitido);
    if (!permitido) { return; }

    gsap.registerPlugin(ScrollTrigger);
    var pararCenas = null;
    var pararFaixa = null;
    var ctx = gsap.context(function () {
      animarAbertura();
      animarParalaxe();
      pararCenas = animarCenas();
      animarTour();
      animarMapaCena();
      pararFaixa = animarFaixa();
    });
    ligarLenis();
    ScrollTrigger.refresh();
    raiz.classList.add('cenas-prontas');
    desfazer = function () {
      raiz.classList.remove('cenas-prontas');
      desligarLenis();
      if (pararCenas) { pararCenas(); }
      if (pararFaixa) { pararFaixa(); }
      ctx.revert();
    };
  }

  if (!window.gsap || !window.ScrollTrigger) { raiz.classList.remove('movimento'); }

  document.addEventListener('DOMContentLoaded', function () {
    iniciarCabecalho();
    iniciarLightbox();
    iniciarBotoesFaixa();

    ['show.bs.modal', 'show.bs.offcanvas'].forEach(function (ev) { document.addEventListener(ev, pausarLenis); });
    ['hidden.bs.modal', 'hidden.bs.offcanvas'].forEach(function (ev) { document.addEventListener(ev, retomarLenis); });

    configurar();
    var fontes = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontes.then(function () {
      document.querySelectorAll('.frase-sol[data-pronta]').forEach(posicionarDegrade);
      if (estado && window.ScrollTrigger) { ScrollTrigger.refresh(); }
    });
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
})();
