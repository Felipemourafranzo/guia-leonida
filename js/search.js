/* ==========================================================================
   Guia Leonida: search.js (catálogo, busca, abas e favoritos)
   --------------------------------------------------------------------------
   Responsável por:
     1. Criar os cards do catálogo a partir de GLDados (data.js)
     2. Busca por texto em tempo real + abas de categoria (guia.html)
     3. Estado "nenhum resultado encontrado"
     4. Botão de favoritar (só para usuário logado, ver auth.js)
     5. Janela de detalhes (modal do Bootstrap) com a fonte da informação
     6. Destaques da página inicial, regiões (mapa.html) e lista de
        favoritos (checklist.html), que reaproveitam o mesmo card

   As abas seguem o padrão "Tabs" do WAI-ARIA: role="tablist"/"tab"/
   "tabpanel", aria-selected, e as setas ← → movem entre as abas.
   ========================================================================== */
window.GLCatalogo = (function () {
  'use strict';

  var esc = function (t) { return GL.escaparHTML(t); };

  function buscarItem(id) {
    return GLDados.itens.filter(function (item) { return item.id === id; })[0];
  }

  /* ---------------------------------------------------------------------
     Card de um item. nivel = nível do título (h2/h3) para manter a
     hierarquia correta em cada página.
     --------------------------------------------------------------------- */
  function criarCard(item, nivel) {
    nivel = nivel || 3;
    var cat = GLDados.categorias[item.categoria];
    var favorito = window.GLAuth && GLAuth.ehFavorito(item.id);
    var idTitulo = 'titulo-' + item.id;

    var midia = item.imagem
      ? '<img class="card-imagem" src="' + esc(item.imagem) + '" alt="' + esc(item.alt) + '" width="800" height="500" loading="lazy">'
      : '<div class="card-imagem-icone" aria-hidden="true"><i class="bi ' + esc(item.icone || cat.icone) + '"></i></div>';

    var status = item.status === 'a-confirmar'
      ? '<span class="selo-status a-confirmar"><i class="bi bi-hourglass-split" aria-hidden="true"></i>Detalhes a confirmar</span>'
      : '<span class="selo-status"><i class="bi bi-patch-check" aria-hidden="true"></i>Com fonte oficial ou confiável</span>';

    return '<article class="card-guia" aria-labelledby="' + idTitulo + '">' +
      midia +
      '<div class="card-corpo">' +
        '<span class="selo-categoria cat-' + item.categoria + '"><i class="bi ' + cat.icone + '" aria-hidden="true"></i>' + cat.singular + '</span>' +
        '<h' + nivel + ' id="' + idTitulo + '">' + esc(item.nome) + '</h' + nivel + '>' +
        '<p class="resumo">' + esc(item.resumo) + '</p>' +
        status +
        '<div class="card-acoes">' +
          '<button type="button" class="btn btn-sm btn-outline-primary" data-detalhes="' + esc(item.id) + '">' +
            'Ver detalhes<span class="visually-hidden"> de ' + esc(item.nome) + '</span></button>' +
          '<button type="button" class="btn-favorito" data-favoritar="' + esc(item.id) + '" aria-pressed="' + (favorito ? 'true' : 'false') + '">' +
            '<i class="bi bi-heart" aria-hidden="true"></i>Favorito<span class="visually-hidden">: ' + esc(item.nome) + '</span></button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  /* Quando um card some enquanto tinha o foco, o foco não pode se perder
     (WCAG 2.4.3). Vai para o elemento [data-foco-alternativo] mais próximo. */
  function focarAlternativo(lista) {
    var secao = lista.closest('section') || document;
    var alvo = secao.querySelector('[data-foco-alternativo]');
    if (alvo) { alvo.focus(); }
  }

  /* Lista de cards dentro de <li> (a lista informa a quantidade ao leitor de tela) */
  function listaDeCards(itens, nivel, classeColuna) {
    classeColuna = classeColuna || 'col-sm-6 col-lg-4 col-xl-3';
    return itens.map(function (item) {
      return '<li class="' + classeColuna + '">' + criarCard(item, nivel) + '</li>';
    }).join('');
  }

  /* ---------------------------------------------------------------------
     Favoritos (delegação de eventos: funciona em qualquer card da página)
     --------------------------------------------------------------------- */
  function aoClicarFavorito(botao) {
    var id = botao.getAttribute('data-favoritar');
    var item = buscarItem(id);
    var novoEstado = window.GLAuth ? GLAuth.alternarFavorito(id) : null;

    if (novoEstado === null) {
      // Visitante: explica e oferece o login, voltando para esta página depois
      var pagina = location.pathname.split('/').pop() || 'index.html';
      GL.avisar('Entre na sua conta para salvar favoritos.', {
        icone: 'bi-person-lock',
        titulo: 'Favoritos',
        acao: { href: 'login.html?voltar=' + encodeURIComponent(pagina), texto: 'Entrar ou criar conta' }
      });
      return;
    }
    // Atualiza todos os botões do mesmo item (pode haver mais de um na página)
    document.querySelectorAll('[data-favoritar="' + id + '"]').forEach(function (b) {
      b.setAttribute('aria-pressed', novoEstado ? 'true' : 'false');
    });
    GL.anunciar(novoEstado
      ? item.nome + ' adicionado aos favoritos.'
      : item.nome + ' removido dos favoritos.');
  }

  /* ---------------------------------------------------------------------
     Modal de detalhes (criado uma vez; o Bootstrap cuida do foco)
     --------------------------------------------------------------------- */
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
      extras += '<li><i class="bi bi-pin-map" aria-hidden="true"></i><span><strong>Inspiração no mundo real:</strong> ' + esc(item.inspiracao) + '</span></li>';
    }
    extras += '<li><i class="bi bi-tags" aria-hidden="true"></i><span><strong>Etiquetas:</strong> ' + esc(item.tags.join(', ')) + '</span></li>';
    extras += '<li><i class="bi ' + (item.status === 'a-confirmar' ? 'bi-hourglass-split' : 'bi-patch-check') + '" aria-hidden="true"></i><span><strong>Status:</strong> ' +
      (item.status === 'a-confirmar' ? 'detalhes a confirmar' : 'confirmado em fonte oficial ou confiável') + '</span></li>';

    document.getElementById('modal-detalhes-titulo').textContent = item.nome;
    document.getElementById('modal-detalhes-corpo').innerHTML =
      (item.imagem
        ? '<img class="img-fluid rounded mb-3" src="' + esc(item.imagem) + '" alt="' + esc(item.alt) + '" width="800" height="500">'
        : '') +
      '<p><span class="selo-categoria cat-' + item.categoria + '"><i class="bi ' + cat.icone + '" aria-hidden="true"></i>' + cat.singular + '</span></p>' +
      '<p>' + esc(item.descricao) + '</p>' +
      '<ul class="lista-fatos mb-3">' + extras + '</ul>' +
      '<p class="small mb-0">Fonte: <a href="' + esc(item.fonte.url) + '" target="_blank" rel="noopener">' + esc(item.fonte.titulo) +
        '<span class="visually-hidden"> (abre em nova aba)</span></a></p>';
    modal.show();
  }

  /* ---------------------------------------------------------------------
     Página do guia: busca + abas
     --------------------------------------------------------------------- */
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
        // Todas as palavras digitadas precisam aparecer (busca "E")
        return palavras.every(function (p) { return texto.indexOf(p) !== -1; });
      });
    }

    var temporizadorAnuncio = null;
    function renderizar(anunciarResultado) {
      var itens = filtrar(estado.categoria);

      // Contadores em cada aba (respeitando o texto digitado)
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

      // O painel é rotulado pela aba selecionada (padrão WAI-ARIA Tabs)
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

      // Mantém a URL atualizada: dá para compartilhar a busca
      var novaUrl = new URLSearchParams();
      if (estado.termo) { novaUrl.set('q', estado.termo); }
      if (estado.categoria !== 'todos') { novaUrl.set('cat', estado.categoria); }
      history.replaceState(null, '', location.pathname + (novaUrl.toString() ? '?' + novaUrl : ''));

      // Anuncia o total só depois que a pessoa para de digitar
      if (anunciarResultado) {
        clearTimeout(temporizadorAnuncio);
        temporizadorAnuncio = setTimeout(function () { GL.anunciar(frase); }, 700);
      }
    }

    campo.addEventListener('input', function () {
      estado.termo = campo.value.trim();
      renderizar(true);
    });

    /* Enter no campo não recarrega a página */
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

    // Com "só favoritos" ligado, desfavoritar remove o card da lista
    document.addEventListener('gl:favoritos', function () {
      if (estado.favoritos) { renderizar(false); }
    });

    renderizar(false);
  }

  /* Destaques da página inicial: <ul data-destaques="id1,id2"> */
  function iniciarDestaques() {
    var lista = document.querySelector('[data-destaques]');
    if (!lista) { return; }
    var itens = lista.getAttribute('data-destaques').split(',').map(buscarItem).filter(Boolean);
    lista.innerHTML = listaDeCards(itens, 3, 'col-sm-6 col-xl-3');
  }

  /* Regiões em mapa.html: <ul data-lista-regioes> */
  function iniciarRegioes() {
    var lista = document.querySelector('[data-lista-regioes]');
    if (!lista) { return; }
    var regioes = GLDados.itens.filter(function (i) { return i.categoria === 'regioes'; });
    lista.innerHTML = regioes.map(function (item) {
      return '<li class="col-md-6 col-xl-4" id="regiao-' + item.id + '">' + criarCard(item, 3) + '</li>';
    }).join('');
  }

  /* Favoritos em checklist.html: <ul data-lista-favoritos> */
  function renderizarFavoritos() {
    var lista = document.querySelector('[data-lista-favoritos]');
    var vazio = document.querySelector('[data-favoritos-vazio]');
    if (!lista) { return; }
    var usuario = window.GLAuth && GLAuth.usuarioAtual();
    var itens = usuario ? GLAuth.favoritos().map(buscarItem).filter(Boolean) : [];
    var focoDentro = lista.contains(document.activeElement);
    lista.innerHTML = listaDeCards(itens, 3, 'col-sm-6 col-lg-4');
    // Se o botão focado sumiu (item desfavoritado), o foco vai para o título da seção
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

    // Cliques nos botões dos cards (funciona para cards criados depois também)
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
