window.GL = (function () {
  'use strict';

  function lerJSON(chave, padrao) {
    try {
      var bruto = localStorage.getItem(chave);
      return bruto === null ? padrao : JSON.parse(bruto);
    } catch (erro) {
      return padrao;
    }
  }

  function salvarJSON(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
      return true;
    } catch (erro) {
      return false;
    }
  }

  function escaparHTML(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizar(texto) {
    return String(texto)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim();
  }

  var temporizadorAnuncio = null;
  function anunciar(mensagem) {
    var regiao = document.getElementById('anunciador');
    if (!regiao) { return; }
    regiao.textContent = '';
    clearTimeout(temporizadorAnuncio);
    temporizadorAnuncio = setTimeout(function () {
      regiao.textContent = mensagem;
    }, 100);
  }

  function avisar(mensagem, opcoes) {
    opcoes = opcoes || {};
    var area = document.getElementById('area-toasts');
    if (!area || !window.bootstrap) {
      anunciar(mensagem);
      return;
    }
    var temAcao = !!opcoes.acao;
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('aria-hidden', 'false');
    toast.innerHTML =
      '<div class="toast-header">' +
        '<i class="bi ' + (opcoes.icone || 'bi-info-circle-fill') + ' me-2" aria-hidden="true"></i>' +
        '<strong class="me-auto">' + escaparHTML(opcoes.titulo || 'Guia Leonida') + '</strong>' +
        '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Fechar aviso"></button>' +
      '</div>' +
      '<div class="toast-body">' + escaparHTML(mensagem) +
        (temAcao
          ? ' <a class="fw-semibold" href="' + escaparHTML(opcoes.acao.href) + '">' + escaparHTML(opcoes.acao.texto) + '</a>'
          : '') +
      '</div>';
    area.appendChild(toast);
    var instancia = new bootstrap.Toast(toast, { autohide: !temAcao, delay: 6000 });
    toast.addEventListener('hidden.bs.toast', function () { toast.remove(); });
    instancia.show();
    anunciar(mensagem + (temAcao ? ' ' + opcoes.acao.texto + ': link disponível no aviso.' : ''));
  }

  function iniciarDisponivel() {
    var caixa = document.querySelector('[data-disponivel]');
    if (!caixa || !window.GLDados) { return; }
    var lancamento = new Date(GLDados.lancamento.dataISO).getTime();
    var dias = Math.max(0, Math.floor((Date.now() - lancamento) / 86400000));
    caixa.querySelector('[data-dias-lancamento]').textContent = dias;
    caixa.querySelector('[data-dias-rotulo]').textContent =
      dias === 0 ? 'lançado hoje' : (dias === 1 ? 'dia desde o lançamento' : 'dias desde o lançamento');
  }

  function atualizarStatusRodape() {
    var el = document.querySelector('[data-status-rodape]');
    if (!el || !window.GLDados) { return; }
    var l = GLDados.lancamento;
    el.textContent = 'Lançado em 19/11/2026 (PS5 e Xbox Series X|S). PC e modo online: ' + l.pc +
      ' (checado em ' + l.checado + ').';
  }

  function renderizarNovidades() {
    var lista = document.querySelector('[data-novidades]');
    if (!lista || !window.GLDados) { return; }
    var limite = parseInt(lista.getAttribute('data-limite'), 10) || GLDados.novidades.length;
    var ultimaVisita = lerJSON('gl-ultima-visita', null);

    lista.innerHTML = GLDados.novidades.slice(0, limite).map(function (n) {
      var nova = ultimaVisita && new Date(n.data + 'T00:00:00-03:00').getTime() > ultimaVisita &&
        new Date(n.data + 'T00:00:00-03:00').getTime() <= Date.now();
      return '<li>' +
        '<time datetime="' + n.data + '">' + escaparHTML(n.dataTexto) + '</time>' +
        (nova ? ' <span class="badge rounded-pill text-bg-warning ms-1">Novo desde sua última visita</span>' : '') +
        '<h3>' + escaparHTML(n.titulo) + '</h3>' +
        '<p>' + escaparHTML(n.texto) + '</p>' +
        '<p class="small mb-0">Fonte: <a href="' + escaparHTML(n.fonte.url) + '" target="_blank" rel="noopener">' +
          escaparHTML(n.fonte.titulo) + '<span class="visually-hidden"> (abre em nova aba)</span></a></p>' +
        '</li>';
    }).join('');

    salvarJSON('gl-ultima-visita', Date.now());
  }

  function preencherAno() {
    document.querySelectorAll('[data-ano]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    iniciarDisponivel();
    atualizarStatusRodape();
    renderizarNovidades();
    preencherAno();
  });

  return {
    lerJSON: lerJSON,
    salvarJSON: salvarJSON,
    escaparHTML: escaparHTML,
    normalizar: normalizar,
    anunciar: anunciar,
    avisar: avisar
  };
})();
