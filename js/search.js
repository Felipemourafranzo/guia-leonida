window.GLCatalogo = (function () {
  'use strict';

  var esc = function (t) { return GL.escaparHTML(t); };

  function buscarItem(id) {
    return GLDados.itens.filter(function (item) { return item.id === id; })[0];
  }

  function criarCard(item, nivel) {
    nivel = nivel || 3;
    var cat = GLDados.categorias[item.categoria];
    var favorito = window.GLAuth && GLAuth.ehFavorito(item.id);
    var idTitulo = 'titulo-' + item.id;

    return '<article class="card-guia" aria-labelledby="' + idTitulo + '">' +
      '<div class="card-foto">' +
        '<img class="card-imagem" src="' + esc(item.imagem) + '" alt="' + esc(item.alt) + '" width="800" height="450" loading="lazy" decoding="async">' +
        '<div class="card-titulo">' +
          '<span class="selo-categoria cat-' + item.categoria + '">' + cat.singular + '</span>' +
          '<h' + nivel + ' id="' + idTitulo + '">' + esc(item.nome) + '</h' + nivel + '>' +
        '</div>' +
      '</div>' +
      '<div class="card-corpo">' +
        '<p class="resumo">' + esc(item.resumo) + '</p>' +
        seloStatus(item) +
        '<div class="card-acoes">' +
          '<button type="button" class="btn btn-sm btn-outline-primary" data-detalhes="' + esc(item.id) + '">' +
            'Ver detalhes<span class="visually-hidden"> de ' + esc(item.nome) + '</span></button>' +
          '<button type="button" class="btn-favorito" data-favoritar="' + esc(item.id) + '" aria-pressed="' + (favorito ? 'true' : 'false') + '">' +
            '<i class="bi bi-heart" aria-hidden="true"></i>Favorito<span class="visually-hidden">: ' + esc(item.nome) + '</span></button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function textoStatus(item) {
    if (item.status === 'sem-confirmacao') { return 'Ainda não divulgado · checado em ' + item.checado; }
    if (item.status === 'serie') { return 'Vale nos GTAs anteriores · checado em ' + item.checado; }
    return 'Com fonte oficial ou confiável';
  }
  function seloStatus(item) {
    var classe = item.status === 'confirmado' ? '' : ' sem-confirmacao';
    var icone = item.status === 'confirmado' ? 'bi-patch-check' : 'bi-clock-history';
    return '<span class="selo-status' + classe + '"><i class="bi ' + icone + '" aria-hidden="true"></i>' + esc(textoStatus(item)) + '</span>';
  }

  function focarAlternativo(lista) {
    var secao = lista.closest('section') || document;
    var alvo = secao.querySelector('[data-foco-alternativo]');
    if (alvo) { alvo.focus(); }
  }

  function listaDeCards(itens, nivel, classeColuna) {
    classeColuna = classeColuna || 'col-sm-6 col-lg-4 col-xl-3';
    return itens.map(function (item) {
      return '<li class="' + classeColuna + '">' + criarCard(item, nivel) + '</li>';
    }).join('');
  }

  function aoClicarFavorito(botao) {
    var id = botao.getAttribute('data-favoritar');
    var item = buscarItem(id);
    var novoEstado = window.GLAuth ? GLAuth.alternarFavorito(id) : null;

    if (novoEstado === null) {
      var pagina = location.pathname.split('/').pop() || 'index.html';
      GL.avisar('Entre na sua conta para salvar favoritos.', {
        icone: 'bi-person-lock',
        titulo: 'Favoritos',
        acao: { href: 'login.html?voltar=' + encodeURIComponent(pagina), texto: 'Entrar ou criar conta' }
      });
      return;
    }

    document.querySelectorAll('[data-favoritar="' + id + '"]').forEach(function (b) {
      b.setAttribute('aria-pressed', novoEstado ? 'true' : 'false');
    });
    GL.anunciar(novoEstado
      ? 'Adicionado aos favoritos: ' + item.nome + '.'
      : 'Removido dos favoritos: ' + item.nome + '.');
  }

  var modal = null;
  function abrirDetalhes(id) {
    var item = buscarItem(id);
    if (!item || !window.bootstrap) { return; }
    var cat = GLDados.categorias[item.categoria];
    var elemento = document.getElementById('modal-detalhes');
    if (!elemento) {
      elemento = document.createElement('div');
      elemento.className = 'modal fade';
      elemento.id = 'modal-detalhes';
      elemento.tabIndex = -1;
      elemento.setAttribute('aria-labelledby', 'modal-detalhes-titulo');
      elemento.innerHTML =
        '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">' +
          '<div class="modal-content">' +
            '<div class="modal-header">' +
              '<h2 class="modal-title h4" id="modal-detalhes-titulo"></h2>' +
              '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar detalhes"></button>' +
            '</div>' +
            '<div class="modal-body" id="modal-detalhes-corpo"></div>' +
            '<div class="modal-footer">' +
              '<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Fechar</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      document.body.appendChild(elemento);
      modal = new bootstrap.Modal(elemento);
    }

    var extras = '';
    if (item.inspiracao) {
      extras += '<li><span><strong>Inspiração no mundo real:</strong> ' + esc(item.inspiracao) + '</span></li>';
    }
    extras += '<li><span><strong>Etiquetas:</strong> ' + esc(item.tags.join(', ')) + '</span></li>';
    if (item.condado) {
      extras += '<li><span><strong>Condado no mapa oficial:</strong> ' + esc(item.condado) + '</span></li>';
    }
    extras += '<li><span><strong>Status:</strong> ' + esc(textoStatus(item)) + '</span></li>';

    document.getElementById('modal-detalhes-titulo').textContent = item.nome;
    document.getElementById('modal-detalhes-corpo').innerHTML =
      (item.arte
        ? '<figure class="mb-3"><img class="img-fluid" src="' + esc(item.arte) + '" alt="' + esc(item.arteAlt) + '" width="1600" height="900">' +
          '<figcaption class="small texto-suave mt-1">Ilustração oficial: © Rockstar Games</figcaption></figure>'
        : '<img class="img-fluid mb-3" src="' + esc(item.imagem.replace('-800.webp', '-1600.webp').replace('-600.webp', '-1200.webp')) + '" alt="' + esc(item.alt) + '" width="1600" height="900">') +
      '<p class="sobretitulo mb-2">' + cat.singular + '</p>' +
      '<p>' + esc(item.descricao) + '</p>' +
      '<ul class="lista-fatos mb-3">' + extras + '</ul>' +
      '<p class="small mb-0">Fonte: <a href="' + esc(item.fonte.url) + '" target="_blank" rel="noopener">' + esc(item.fonte.titulo) +
        '<span class="visually-hidden"> (abre em nova aba)</span></a></p>';
    modal.show();
  }

  function iniciarGuia() {
    var campo = document.getElementById('busca');
    var listaAbas = document.getElementById('abas-categorias');
    var resultados = document.getElementById('resultados');
    var contador = document.getElementById('contagem-resultados');
    var vazio = document.getElementById('estado-vazio');
    var soFavoritos = document.getElementById('so-favoritos');
    if (!campo || !listaAbas || !resultados) { return; }

    var abas = Array.prototype.slice.call(listaAbas.querySelectorAll('[role="tab"]'));
    var params = new URLSearchParams(location.search);
    var estado = {
      termo: params.get('q') || '',
      categoria: GLDados.categorias[params.get('cat')] ? params.get('cat') : 'todos',
      favoritos: false
    };
    campo.value = estado.termo;

    function filtrar(categoria) {
      var termo = GL.normalizar(estado.termo);
      var palavras = termo.split(/\s+/).filter(Boolean);
      var favs = window.GLAuth ? GLAuth.favoritos() : [];
      return GLDados.itens.filter(function (item) {
        if (categoria !== 'todos' && item.categoria !== categoria) { return false; }
        if (estado.favoritos && favs.indexOf(item.id) === -1) { return false; }
        if (!palavras.length) { return true; }
        var texto = GL.normalizar([item.nome, item.resumo, item.tags.join(' '),
          GLDados.categorias[item.categoria].rotulo, item.inspiracao || ''].join(' '));

        return palavras.every(function (p) { return texto.indexOf(p) !== -1; });
      });
    }

    var temporizadorAnuncio = null;
    function renderizar(anunciarResultado) {
      var itens = filtrar(estado.categoria);

      abas.forEach(function (aba) {
        var cat = aba.getAttribute('data-categoria');
        var span = aba.querySelector('.contador');
        if (span) { span.textContent = filtrar(cat).length; }
        var selecionada = cat === estado.categoria;
        aba.setAttribute('aria-selected', selecionada ? 'true' : 'false');
        aba.tabIndex = selecionada ? 0 : -1;
      });

      var focoDentro = resultados.contains(document.activeElement);
      resultados.innerHTML = listaDeCards(itens, 3);
      resultados.hidden = itens.length === 0;
      vazio.hidden = itens.length !== 0;
      if (focoDentro) { focarAlternativo(resultados); }

      var abaAtual = abas.filter(function (a) { return a.getAttribute('data-categoria') === estado.categoria; })[0];
      if (abaAtual) { resultados.parentElement.setAttribute('aria-labelledby', abaAtual.id); }

      var nomeCat = estado.categoria === 'todos' ? 'todas as categorias' : GLDados.categorias[estado.categoria].rotulo;
      var frase = itens.length === 0
        ? 'Nenhum resultado encontrado'
        : itens.length + (itens.length === 1 ? ' resultado' : ' resultados');
      frase += ' em ' + nomeCat + (estado.termo ? ' para "' + estado.termo + '"' : '') +
        (estado.favoritos ? ', só favoritos' : '') + '.';
      contador.textContent = frase;

      var termoVazio = document.getElementById('termo-vazio');
      if (termoVazio) { termoVazio.textContent = estado.termo ? '"' + estado.termo + '"' : 'esses filtros'; }

      var novaUrl = new URLSearchParams();
      if (estado.termo) { novaUrl.set('q', estado.termo); }
      if (estado.categoria !== 'todos') { novaUrl.set('cat', estado.categoria); }
      history.replaceState(null, '', location.pathname + (novaUrl.toString() ? '?' + novaUrl : ''));

      if (anunciarResultado) {
        clearTimeout(temporizadorAnuncio);
        temporizadorAnuncio = setTimeout(function () { GL.anunciar(frase); }, 700);
      }
    }

    campo.addEventListener('input', function () {
      estado.termo = campo.value.trim();
      renderizar(true);
    });

    campo.form && campo.form.addEventListener('submit', function (e) { e.preventDefault(); });

    function selecionarAba(aba, focar) {
      estado.categoria = aba.getAttribute('data-categoria');
      renderizar(true);
      if (focar) { aba.focus(); }
    }

    abas.forEach(function (aba, i) {
      aba.addEventListener('click', function () { selecionarAba(aba, false); });
      aba.addEventListener('keydown', function (e) {
        var destino = null;
        if (e.key === 'ArrowRight') { destino = abas[(i + 1) % abas.length]; }
        if (e.key === 'ArrowLeft') { destino = abas[(i - 1 + abas.length) % abas.length]; }
        if (e.key === 'Home') { destino = abas[0]; }
        if (e.key === 'End') { destino = abas[abas.length - 1]; }
        if (destino) {
          e.preventDefault();
          selecionarAba(destino, true);
        }
      });
    });

    if (soFavoritos) {
      soFavoritos.addEventListener('change', function () {
        if (soFavoritos.checked && !(window.GLAuth && GLAuth.usuarioAtual())) {
          soFavoritos.checked = false;
          GL.avisar('Entre na sua conta para ver seus favoritos.', {
            icone: 'bi-person-lock', titulo: 'Favoritos',
            acao: { href: 'login.html?voltar=guia.html', texto: 'Entrar ou criar conta' }
          });
          return;
        }
        estado.favoritos = soFavoritos.checked;
        renderizar(true);
      });
    }

    document.querySelectorAll('[data-limpar-filtros]').forEach(function (botao) {
      botao.addEventListener('click', function () {
        estado.termo = '';
        estado.categoria = 'todos';
        estado.favoritos = false;
        campo.value = '';
        if (soFavoritos) { soFavoritos.checked = false; }
        renderizar(true);
        campo.focus();
      });
    });

    document.addEventListener('gl:favoritos', function () {
      if (estado.favoritos) { renderizar(false); }
    });

    renderizar(false);
  }

  function iniciarDestaques() {
    var lista = document.querySelector('[data-destaques]');
    if (!lista) { return; }
    var itens = lista.getAttribute('data-destaques').split(',').map(buscarItem).filter(Boolean);
    lista.innerHTML = listaDeCards(itens, 3, lista.getAttribute('data-classe') || 'col-sm-6 col-xl-3');
  }

  function iniciarRegioes() {
    var lista = document.querySelector('[data-lista-regioes]');
    if (!lista) { return; }
    var regioes = GLDados.itens.filter(function (i) { return i.categoria === 'regioes'; });
    lista.innerHTML = regioes.map(function (item) {
      return '<li class="col-md-6 col-xl-4" id="ficha-' + item.id + '">' + criarCard(item, 3) + '</li>';
    }).join('');
  }

  function renderizarFavoritos() {
    var lista = document.querySelector('[data-lista-favoritos]');
    var vazio = document.querySelector('[data-favoritos-vazio]');
    if (!lista) { return; }
    var usuario = window.GLAuth && GLAuth.usuarioAtual();
    var itens = usuario ? GLAuth.favoritos().map(buscarItem).filter(Boolean) : [];
    var focoDentro = lista.contains(document.activeElement);
    lista.innerHTML = listaDeCards(itens, 3, 'col-sm-6 col-lg-4');

    if (focoDentro) { focarAlternativo(lista); }
    lista.hidden = itens.length === 0;
    if (vazio) {
      vazio.hidden = itens.length !== 0;
      vazio.querySelector('[data-favoritos-mensagem]').textContent = usuario
        ? 'Você ainda não favoritou nada. Abra o guia e toque no coração dos itens que quer guardar.'
        : 'Entre na sua conta para ver e salvar seus favoritos.';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.GLDados) { return; }

    document.addEventListener('click', function (evento) {
      var fav = evento.target.closest('[data-favoritar]');
      if (fav) { aoClicarFavorito(fav); return; }
      var det = evento.target.closest('[data-detalhes]');
      if (det) { abrirDetalhes(det.getAttribute('data-detalhes')); }
    });

    iniciarGuia();
    iniciarDestaques();
    iniciarRegioes();
    renderizarFavoritos();
    document.addEventListener('gl:favoritos', renderizarFavoritos);
  });

  return { criarCard: criarCard, abrirDetalhes: abrirDetalhes };
})();
