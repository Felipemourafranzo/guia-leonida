/* ==========================================================================
   Guia Leonida: mapa.js (pôster oficial do mapa com zoom e marcadores)
   --------------------------------------------------------------------------
   HTML esperado (mapa.html):
     .mapa-zoom[data-mapa]           janela do mapa (recebe foco pelo teclado)
       .mapa-camada                  imagem do pôster + marcadores (é ela que
                                     recebe translate/scale)
         img
         button.mapa-marcador[data-regiao][style="left: x%; top: y%"]
       .mapa-controles button[data-zoom="+1|-1|0"]
     [data-painel-regiao]            onde aparece o cartão-postal da região

   Como usar:
     - roda do mouse ou pinça (celular) para aproximar e afastar;
     - arrastar com o mouse ou o dedo para mover;
     - teclado (com o mapa focado): setas movem, + e − dão zoom, 0 centraliza;
     - botões + / − / centralizar para quem não usa mouse;
     - cada marcador abre o cartão-postal oficial da região logo abaixo.
   A tabela das regiões, na mesma página, é a alternativa em texto.
   Só transform na camada; sem animação quando o usuário pede menos movimento.
   ========================================================================== */
(function () {
  'use strict';

  var ESCALA_MIN = 1;
  var ESCALA_MAX = 6;

  function movimentoReduzido() {
    return window.GLA11y ? GLA11y.movimentoReduzido()
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function iniciarMapa(janela) {
    var camada = janela.querySelector('.mapa-camada');
    var img = camada.querySelector('img');
    var proporcao = img.getAttribute('height') / img.getAttribute('width'); // altura/largura do pôster
    var estado = { x: 0, y: 0, s: 1 };
    var base = { w: 0, h: 0 };

    /* Tamanho "inteiro na tela" (escala 1): o pôster cabe todo na janela */
    function medir() {
      var jw = janela.clientWidth;
      var jh = janela.clientHeight;
      base.w = Math.min(jw, jh / proporcao);
      base.h = base.w * proporcao;
      camada.style.width = base.w + 'px';
      camada.style.height = base.h + 'px';
      limitar();
      aplicar(false);
    }

    /* Não deixa o pôster sair todo da janela */
    function limitar() {
      var jw = janela.clientWidth;
      var jh = janela.clientHeight;
      var w = base.w * estado.s;
      var h = base.h * estado.s;
      estado.x = w <= jw ? (jw - w) / 2 : Math.min(0, Math.max(jw - w, estado.x));
      estado.y = h <= jh ? (jh - h) / 2 : Math.min(0, Math.max(jh - h, estado.y));
    }

    function aplicar(animar) {
      camada.style.transition = animar && !movimentoReduzido() ? 'transform .35s cubic-bezier(.16, 1, .3, 1)' : 'none';
      camada.style.transform = 'translate(' + estado.x + 'px, ' + estado.y + 'px) scale(' + estado.s + ')';
      camada.style.setProperty('--escala-inversa', (1 / estado.s).toFixed(4));
      var nivel = janela.querySelector('[data-nivel-zoom]');
      if (nivel) { nivel.textContent = 'Zoom: ' + Math.round(estado.s * 100) + '%'; }
    }

    /* Zoom mantendo fixo o ponto (px, py) da janela */
    function zoom(fator, px, py, animar) {
      var nova = Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, estado.s * fator));
      if (px === undefined) { px = janela.clientWidth / 2; py = janela.clientHeight / 2; }
      var k = nova / estado.s;
      estado.x = px - (px - estado.x) * k;
      estado.y = py - (py - estado.y) * k;
      estado.s = nova;
      limitar();
      aplicar(animar);
    }

    function centralizar(animar) {
      estado.s = 1;
      limitar();
      aplicar(animar);
    }

    /* Leva um ponto do pôster (em %) para o centro, com zoom */
    function focarPonto(px, py, escala) {
      estado.s = escala;
      estado.x = janela.clientWidth / 2 - (px / 100) * base.w * escala;
      estado.y = janela.clientHeight / 2 - (py / 100) * base.h * escala;
      limitar();
      aplicar(true);
    }

    /* Roda do mouse */
    janela.addEventListener('wheel', function (e) {
      e.preventDefault();
      var r = janela.getBoundingClientRect();
      zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top, false);
    }, { passive: false });

    /* Arraste e pinça (Pointer Events) */
    var ponteiros = {};
    var inicio = null;
    function lista() { return Object.keys(ponteiros).map(function (k) { return ponteiros[k]; }); }
    janela.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) { return; } // botões e marcadores continuam clicáveis
      janela.setPointerCapture(e.pointerId);
      ponteiros[e.pointerId] = { x: e.clientX, y: e.clientY };
      janela.classList.add('arrastando');
      inicio = null;
    });
    janela.addEventListener('pointermove', function (e) {
      if (!ponteiros[e.pointerId]) { return; }
      var antes = lista();
      ponteiros[e.pointerId] = { x: e.clientX, y: e.clientY };
      var agora = lista();
      if (agora.length === 1) {
        estado.x += agora[0].x - antes[0].x;
        estado.y += agora[0].y - antes[0].y;
        limitar();
        aplicar(false);
      } else if (agora.length === 2) {
        var d = Math.hypot(agora[0].x - agora[1].x, agora[0].y - agora[1].y);
        if (inicio) {
          var r = janela.getBoundingClientRect();
          zoom(d / inicio, (agora[0].x + agora[1].x) / 2 - r.left, (agora[0].y + agora[1].y) / 2 - r.top, false);
        }
        inicio = d;
      }
    });
    function soltar(e) {
      delete ponteiros[e.pointerId];
      if (!lista().length) { janela.classList.remove('arrastando'); }
      inicio = null;
    }
    janela.addEventListener('pointerup', soltar);
    janela.addEventListener('pointercancel', soltar);

    /* Teclado (com o foco no mapa) */
    janela.addEventListener('keydown', function (e) {
      if (e.target !== janela) { return; }
      var passo = 60;
      var tratado = true;
      switch (e.key) {
        case 'ArrowLeft': estado.x += passo; break;
        case 'ArrowRight': estado.x -= passo; break;
        case 'ArrowUp': estado.y += passo; break;
        case 'ArrowDown': estado.y -= passo; break;
        case '+': case '=': zoom(1.4, undefined, undefined, true); return e.preventDefault();
        case '-': case '_': zoom(1 / 1.4, undefined, undefined, true); return e.preventDefault();
        case '0': centralizar(true); return e.preventDefault();
        default: tratado = false;
      }
      if (tratado) { e.preventDefault(); limitar(); aplicar(true); }
    });

    /* Botões + / − / centralizar */
    janela.querySelectorAll('[data-zoom]').forEach(function (botao) {
      botao.addEventListener('click', function () {
        var v = botao.getAttribute('data-zoom');
        if (v === '0') { centralizar(true); } else { zoom(v === '1' ? 1.5 : 1 / 1.5, undefined, undefined, true); }
      });
    });

    window.addEventListener('resize', medir);
    if (img.complete) { medir(); } else { img.addEventListener('load', medir); }
    medir();
    return { focarPonto: focarPonto };
  }

  /* Cartão-postal da região escolhida */
  function iniciarMarcadores(mapa) {
    var painel = document.querySelector('[data-painel-regiao]');
    var marcadores = Array.prototype.slice.call(document.querySelectorAll('.mapa-marcador'));
    if (!painel || !window.GLDados) { return; }
    var esc = GL.escaparHTML;

    function abrir(id, focarNoMapa) {
      var item = GLDados.itens.filter(function (i) { return i.id === id; })[0];
      var botao = marcadores.filter(function (m) { return m.getAttribute('data-regiao') === id; })[0];
      if (!item || !botao) { return; }
      marcadores.forEach(function (m) { m.setAttribute('aria-expanded', String(m === botao)); });
      painel.hidden = false;
      painel.innerHTML =
        '<img src="' + esc(item.postal) + '" srcset="' + esc(item.postal) + ' 800w, ' + esc(item.postal.replace('-800.webp', '-1600.webp')) + ' 1600w"' +
          ' sizes="(min-width: 992px) 55vw, 100vw" width="800" height="450" alt="Cartão-postal oficial ‘Visit Leonida’ de ' + esc(item.nome) + '">' +
        '<div>' +
          '<p class="sobretitulo">Região' + (item.condado ? ' · condado de ' + esc(item.condado) : '') + '</p>' +
          '<h3 id="painel-regiao-titulo" tabindex="-1">' + esc(item.nome) + '</h3>' +
          '<p>' + esc(item.descricao) + '</p>' +
          '<p class="small texto-suave">Cartão-postal e mapa: © Rockstar Games, kit de mídia oficial.</p>' +
          '<button type="button" class="btn btn-outline-primary" data-detalhes="' + esc(item.id) + '">Ver a ficha completa<span class="visually-hidden"> de ' + esc(item.nome) + '</span></button>' +
        '</div>';
      if (focarNoMapa) {
        mapa.focarPonto(parseFloat(botao.style.left), parseFloat(botao.style.top), 2.4);
      }
      GL.anunciar('Cartão-postal de ' + item.nome + ' aberto abaixo do mapa.');
    }

    marcadores.forEach(function (m) {
      m.addEventListener('click', function () { abrir(m.getAttribute('data-regiao'), false); });
    });

    /* Links da página inicial ("Ver no mapa") chegam com #regiao-<id> */
    var alvo = location.hash.replace('#regiao-', '');
    if (alvo && alvo !== location.hash) {
      abrir(alvo, true);
      var secao = document.getElementById('mapa-oficial');
      if (secao) { secao.scrollIntoView(); }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var janela = document.querySelector('[data-mapa]');
    if (!janela) { return; }
    var mapa = iniciarMapa(janela);
    iniciarMarcadores(mapa);
  });
})();
