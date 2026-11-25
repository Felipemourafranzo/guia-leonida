/* ==========================================================================
   Guia Leonida: main.js
   --------------------------------------------------------------------------
   Funções comuns a todas as páginas, expostas no objeto global "GL":
     - leitura/escrita segura no localStorage
     - anúncios para leitores de tela (região aria-live)
     - avisos visuais (toasts do Bootstrap)
     - bloco "Já disponível" (dias desde o lançamento) e status no rodapé
     - linha do tempo de novidades (com selo "Novo desde sua última visita")
   ========================================================================== */
window.GL = (function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Armazenamento: sempre com try/catch, porque o localStorage pode estar
     bloqueado (navegação privada, configurações do navegador).
     --------------------------------------------------------------------- */
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

  /* Evita injeção de HTML ao montar textos dinâmicos */
  function escaparHTML(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* Remove acentos e deixa minúsculo: "Região" -> "regiao" (usado na busca) */
  function normalizar(texto) {
    return String(texto)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim();
  }

  /* ---------------------------------------------------------------------
     Anúncios para leitores de tela.
     Esvaziamos a região antes de escrever para que a mesma mensagem
     repetida também seja lida.
     --------------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------------
     Toast (aviso visual). O texto também é anunciado pela região
     #anunciador, por isso o toast em si não é uma região "live".
     Quando o aviso tem um link de ação, ele NÃO some sozinho
     (WCAG 2.2.1: o usuário precisa de tempo para chegar ao link).
     --------------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------------
     Bloco "Já disponível" (página inicial): dias desde o lançamento.
     HTML: [data-disponivel] com [data-dias-lancamento] e [data-dias-rotulo].
     O número já vem escrito no HTML (funciona sem JS); aqui ele só é
     atualizado para o dia de hoje (horário de Brasília).
     --------------------------------------------------------------------- */
  function iniciarDisponivel() {
    var caixa = document.querySelector('[data-disponivel]');
    if (!caixa || !window.GLDados) { return; }
    var lancamento = new Date(GLDados.lancamento.dataISO).getTime();
    var dias = Math.max(0, Math.floor((Date.now() - lancamento) / 86400000));
    caixa.querySelector('[data-dias-lancamento]').textContent = dias;
    caixa.querySelector('[data-dias-rotulo]').textContent =
      dias === 0 ? 'lançado hoje' : (dias === 1 ? 'dia desde o lançamento' : 'dias desde o lançamento');
  }

  /* Status curto no rodapé (todas as páginas) */
  function atualizarStatusRodape() {
    var el = document.querySelector('[data-status-rodape]');
    if (!el || !window.GLDados) { return; }
    var l = GLDados.lancamento;
    el.textContent = 'Lançado em 19/11/2026 (PS5 e Xbox Series X|S). PC e modo online: ' + l.pc +
      ' (checado em ' + l.checado + ').';
  }

  /* ---------------------------------------------------------------------
     Novidades: linha do tempo. Marca como "Novo" o que foi publicado depois
     da última visita do usuário (engajamento: motivo para voltar).
     HTML: <ol class="linha-tempo" data-novidades data-limite="4"></ol>
     --------------------------------------------------------------------- */
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

  /* Preenche o ano atual onde houver [data-ano] */
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
