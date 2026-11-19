/* ==========================================================================
   Guia Leonida: checklist.js (checklist de progresso por usuário)
   --------------------------------------------------------------------------
   - Monta os grupos do checklist (GLDados.checklist) como <fieldset>
     com caixas de seleção, dentro de [data-checklist]
   - Salva o que foi marcado para o usuário logado (GLAuth)
   - Atualiza a barra de progresso (role="progressbar") e o texto
     "X de Y itens (Z%)"; a mudança é anunciada para leitores de tela
   - Visitante (sem login) vê o checklist desativado e um convite para entrar
   - [data-resumo-progresso] mostra um resumo em outras páginas (ex.: início)
   ========================================================================== */
(function () {
  'use strict';

  function todosOsItens() {
    return GLDados.checklist.reduce(function (lista, grupo) {
      return lista.concat(grupo.itens);
    }, []);
  }

  function calcular() {
    var estado = window.GLAuth ? GLAuth.lerChecklist() : {};
    var itens = todosOsItens();
    var feitos = itens.filter(function (i) { return estado[i.id]; }).length;
    return {
      feitos: feitos,
      total: itens.length,
      porcentagem: itens.length ? Math.round((feitos / itens.length) * 100) : 0
    };
  }

  function textoProgresso(p) {
    return p.feitos + ' de ' + p.total + ' itens concluídos (' + p.porcentagem + '%)';
  }

  /* Barra de progresso: role="progressbar" + texto visível */
  function htmlBarra(p, id) {
    return '<div class="d-flex justify-content-between flex-wrap gap-2 mb-2">' +
        '<span class="fw-semibold" id="' + id + '-rotulo">Seu progresso</span>' +
        '<span class="fw-bold texto-primaria" data-progresso-texto>' + textoProgresso(p) + '</span>' +
      '</div>' +
      '<div class="barra-progresso" role="progressbar" aria-labelledby="' + id + '-rotulo" ' +
        'aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + p.porcentagem + '" ' +
        'aria-valuetext="' + textoProgresso(p) + '">' +
        '<div class="barra-progresso-preenchida" style="width:' + p.porcentagem + '%"></div>' +
      '</div>';
  }

  function atualizarBarras() {
    var p = calcular();
    document.querySelectorAll('.barra-progresso').forEach(function (barra) {
      barra.setAttribute('aria-valuenow', p.porcentagem);
      barra.setAttribute('aria-valuetext', textoProgresso(p));
      barra.firstElementChild.style.width = p.porcentagem + '%';
    });
    document.querySelectorAll('[data-progresso-texto]').forEach(function (el) {
      el.textContent = textoProgresso(p);
    });
    return p;
  }

  /* Resumo para outras páginas */
  function renderizarResumo() {
    var alvo = document.querySelector('[data-resumo-progresso]');
    if (!alvo || !window.GLAuth) { return; }
    var usuario = GLAuth.usuarioAtual();
    if (!usuario) {
      alvo.innerHTML = '<p class="small texto-suave mb-0">Entre ou crie uma conta para salvar seu progresso.</p>';
      return;
    }
    alvo.innerHTML = htmlBarra(calcular(), 'resumo-progresso');
  }

  /* Página do checklist */
  function renderizarChecklist() {
    var container = document.querySelector('[data-checklist]');
    if (!container) { return; }
    var usuario = window.GLAuth && GLAuth.usuarioAtual();
    var estado = usuario ? GLAuth.lerChecklist() : {};
    var desativado = usuario ? '' : ' disabled';

    document.querySelector('[data-checklist-barra]').innerHTML = htmlBarra(calcular(), 'progresso-checklist');

    container.innerHTML = GLDados.checklist.map(function (grupo, g) {
      return '<div class="col-md-6">' +
        '<fieldset class="grupo-checklist">' +
          '<legend><i class="bi ' + grupo.icone + ' texto-acento" aria-hidden="true"></i>' + GL.escaparHTML(grupo.grupo) + '</legend>' +
          grupo.itens.map(function (item) {
            var id = 'check-' + item.id;
            return '<div class="form-check">' +
              '<input class="form-check-input" type="checkbox" id="' + id + '" data-item="' + item.id + '"' +
                (estado[item.id] ? ' checked' : '') + desativado + '>' +
              '<label class="form-check-label" for="' + id + '">' + GL.escaparHTML(item.texto) + '</label>' +
            '</div>';
          }).join('') +
        '</fieldset>' +
      '</div>';
    }).join('');

    var avisoVisitante = document.querySelector('[data-checklist-visitante]');
    var botaoReiniciar = document.querySelector('[data-checklist-reiniciar]');
    if (avisoVisitante) { avisoVisitante.hidden = !!usuario; }
    if (botaoReiniciar) { botaoReiniciar.hidden = !usuario; }
    var saudacao = document.querySelector('[data-checklist-usuario]');
    if (saudacao) {
      saudacao.textContent = usuario ? 'Progresso salvo na conta de ' + usuario.nome + '.' : '';
    }
  }

  function iniciarChecklist() {
    var container = document.querySelector('[data-checklist]');
    if (!container) { return; }

    container.addEventListener('change', function (evento) {
      var caixa = evento.target.closest('[data-item]');
      if (!caixa || !window.GLAuth) { return; }
      var estado = GLAuth.lerChecklist();
      if (caixa.checked) {
        estado[caixa.getAttribute('data-item')] = true;
      } else {
        delete estado[caixa.getAttribute('data-item')];
      }
      GLAuth.salvarChecklist(estado);
      var p = atualizarBarras();
      GL.anunciar('Progresso: ' + p.porcentagem + '%.' + (p.feitos === p.total ? ' Parabéns, checklist completo!' : ''));
      if (p.feitos === p.total) {
        GL.avisar('Você completou todo o checklist. Leonida é sua!', { icone: 'bi-trophy-fill', titulo: 'Parabéns!' });
      }
    });

    var botaoReiniciar = document.querySelector('[data-checklist-reiniciar]');
    if (botaoReiniciar) {
      botaoReiniciar.addEventListener('click', function () {
        if (!window.confirm('Desmarcar todos os itens do checklist? Esta ação não pode ser desfeita.')) { return; }
        GLAuth.salvarChecklist({});
        renderizarChecklist();
        GL.anunciar('Checklist reiniciado. Progresso: 0%.');
        document.getElementById('titulo-checklist-lista').focus();
      });
    }

    renderizarChecklist();
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.GLDados) { return; }
    iniciarChecklist();
    renderizarResumo();
    document.addEventListener('gl:sessao', function () {
      renderizarChecklist();
      renderizarResumo();
    });
  });
})();
