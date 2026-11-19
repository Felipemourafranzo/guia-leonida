/* ==========================================================================
   Guia Leonida: a11y.js (painel de acessibilidade)
   --------------------------------------------------------------------------
   Cria os controles do painel de acessibilidade dentro de qualquer
   elemento com o atributo [data-painel-a11y]. O painel existe:
     - no offcanvas do cabeçalho (todas as páginas)  data-painel-a11y="oc"
     - na página acessibilidade.html                  data-painel-a11y="pg"
   O valor do atributo vira prefixo dos ids, para não repetir ids quando
   os dois painéis estão na mesma página.

   Preferências salvas no localStorage (chave "gl-a11y"):
     escala            tamanho da fonte (0.875 a 1.5)
     contraste         alto contraste (true/false)
     reduzirMovimento  desliga animações e o carrossel automático
     dislexia          fonte Atkinson Hyperlegible
     espacamento       mais espaço entre linhas, letras e palavras
     sublinhar         sublinha todos os links
   O tema claro/escuro é guardado à parte por theme.js ("gl-tema").
   ========================================================================== */
(function () {
  'use strict';

  var CHAVE = 'gl-a11y';
  var ESCALAS = [0.875, 1, 1.125, 1.25, 1.375, 1.5];
  var raiz = document.documentElement;

  /* Opções liga/desliga: chave, rótulo, descrição e classe no <html> */
  var OPCOES = [
    { chave: 'contraste', rotulo: 'Alto contraste', descricao: 'Fundo preto, texto branco e destaques em amarelo.' },
    { chave: 'reduzirMovimento', rotulo: 'Reduzir animações', descricao: 'Desliga transições e a troca automática do carrossel.', classe: 'a11y-reduzir-movimento' },
    { chave: 'dislexia', rotulo: 'Fonte para dislexia', descricao: 'Usa a fonte Atkinson Hyperlegible, com letras mais fáceis de distinguir.', classe: 'a11y-dislexia' },
    { chave: 'espacamento', rotulo: 'Mais espaçamento', descricao: 'Aumenta o espaço entre linhas, letras e palavras.', classe: 'a11y-espacamento' },
    { chave: 'sublinhar', rotulo: 'Sublinhar links', descricao: 'Todos os links ficam sublinhados.', classe: 'a11y-sublinhar' }
  ];

  var PADRAO = { escala: 1, contraste: false, reduzirMovimento: false, dislexia: false, espacamento: false, sublinhar: false };

  function ler() {
    var salvo = window.GL ? GL.lerJSON(CHAVE, {}) : {};
    return Object.assign({}, PADRAO, salvo || {});
  }

  function salvar(prefs) {
    if (window.GL) { GL.salvarJSON(CHAVE, prefs); }
  }

  /* Aplica as preferências no <html> */
  function aplicar(prefs) {
    if (prefs.contraste) {
      raiz.setAttribute('data-contraste', 'alto');
    } else {
      raiz.removeAttribute('data-contraste');
    }
    raiz.style.setProperty('--escala-fonte', prefs.escala);
    OPCOES.forEach(function (op) {
      if (op.classe) { raiz.classList.toggle(op.classe, !!prefs[op.chave]); }
    });
    // Avisa outros scripts (ex.: o carrossel para de girar sozinho)
    document.dispatchEvent(new CustomEvent('gl:a11y', { detail: prefs }));
  }

  function porcentagem(escala) {
    return Math.round(escala * 100) + '%';
  }

  /* -------------------------------------------------------------------
     Monta o HTML de um painel
     ------------------------------------------------------------------- */
  function montarPainel(container) {
    var p = container.getAttribute('data-painel-a11y') || 'a11y';

    var htmlOpcoes = OPCOES.map(function (op) {
      var id = p + '-' + op.chave;
      return '<div class="form-check form-switch">' +
        '<input class="form-check-input" type="checkbox" role="switch" id="' + id + '" data-opcao="' + op.chave + '"' +
        ' aria-describedby="' + id + '-desc">' +
        '<label class="form-check-label" for="' + id + '">' + op.rotulo +
        '<span class="descricao-opcao" id="' + id + '-desc">' + op.descricao + '</span></label>' +
        '</div>';
    }).join('');

    container.innerHTML =
      // Tema
      '<fieldset>' +
        '<legend>Tema de cores</legend>' +
        '<div class="opcoes-tema">' +
          radioTema(p, 'sistema', 'Sistema', 'bi-circle-half') +
          radioTema(p, 'claro', 'Claro', 'bi-sun-fill') +
          radioTema(p, 'escuro', 'Escuro', 'bi-moon-stars-fill') +
        '</div>' +
        '<p class="small texto-suave mt-2 mb-0">"Sistema" segue a configuração do seu aparelho.</p>' +
      '</fieldset>' +
      // Fonte
      '<div class="grupo-a11y" role="group" aria-labelledby="' + p + '-fonte-titulo">' +
        '<p class="grupo-a11y-titulo" id="' + p + '-fonte-titulo">Tamanho do texto</p>' +
        '<div class="controle-fonte">' +
          '<button type="button" class="btn btn-outline-secondary" data-fonte="-1" aria-label="Diminuir o texto">' +
            '<span aria-hidden="true">A−</span></button>' +
          '<output id="' + p + '-fonte-valor" aria-live="polite">100%</output>' +
          '<button type="button" class="btn btn-outline-secondary" data-fonte="1" aria-label="Aumentar o texto">' +
            '<span aria-hidden="true">A+</span></button>' +
          '<button type="button" class="btn btn-link" data-fonte="0">Padrão</button>' +
        '</div>' +
      '</div>' +
      // Liga/desliga
      '<fieldset>' +
        '<legend>Leitura e movimento</legend>' +
        htmlOpcoes +
      '</fieldset>' +
      '<button type="button" class="btn btn-outline-primary w-100" data-a11y-redefinir>' +
        '<i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i> Restaurar padrões</button>';

    ligarEventos(container);
  }

  function radioTema(prefixo, valor, rotulo, icone) {
    var id = prefixo + '-tema-' + valor;
    return '<input type="radio" class="btn-check" name="' + prefixo + '-tema" id="' + id + '" value="' + valor + '" data-tema>' +
      '<label class="btn" for="' + id + '"><i class="bi ' + icone + '" aria-hidden="true"></i>' + rotulo + '</label>';
  }

  /* -------------------------------------------------------------------
     Eventos dos controles
     ------------------------------------------------------------------- */
  function ligarEventos(container) {
    container.addEventListener('change', function (evento) {
      var alvo = evento.target;
      if (alvo.hasAttribute('data-tema') && window.GLTema) {
        GLTema.definir(alvo.value);
        anunciar('Tema: ' + alvo.nextElementSibling.textContent.trim() + '.');
        sincronizar();
        return;
      }
      var chave = alvo.getAttribute('data-opcao');
      if (chave) {
        var prefs = ler();
        prefs[chave] = alvo.checked;
        salvar(prefs);
        aplicar(prefs);
        var op = OPCOES.filter(function (o) { return o.chave === chave; })[0];
        anunciar(op.rotulo + (alvo.checked ? ' ativado.' : ' desativado.'));
        sincronizar();
      }
    });

    container.addEventListener('click', function (evento) {
      var botaoFonte = evento.target.closest('[data-fonte]');
      if (botaoFonte) {
        var passo = parseInt(botaoFonte.getAttribute('data-fonte'), 10);
        var prefs = ler();
        var indice = ESCALAS.indexOf(prefs.escala);
        if (indice === -1) { indice = 1; }
        indice = passo === 0 ? 1 : Math.min(ESCALAS.length - 1, Math.max(0, indice + passo));
        prefs.escala = ESCALAS[indice];
        salvar(prefs);
        aplicar(prefs);
        sincronizar();
        return;
      }
      if (evento.target.closest('[data-a11y-redefinir]')) {
        salvar(PADRAO);
        aplicar(PADRAO);
        if (window.GLTema) { GLTema.definir('sistema'); }
        sincronizar();
        anunciar('Preferências de acessibilidade restauradas para o padrão.');
      }
    });
  }

  /* Atualiza TODOS os painéis da página para refletir as preferências */
  function sincronizar() {
    var prefs = ler();
    var tema = window.GLTema ? GLTema.ler() : 'sistema';
    document.querySelectorAll('[data-painel-a11y]').forEach(function (painel) {
      painel.querySelectorAll('[data-tema]').forEach(function (radio) {
        radio.checked = radio.value === tema;
      });
      painel.querySelectorAll('[data-opcao]').forEach(function (chk) {
        chk.checked = !!prefs[chk.getAttribute('data-opcao')];
      });
      var saida = painel.querySelector('output');
      if (saida) { saida.textContent = porcentagem(prefs.escala); }
      var menos = painel.querySelector('[data-fonte="-1"]');
      var mais = painel.querySelector('[data-fonte="1"]');
      if (menos) { menos.disabled = prefs.escala <= ESCALAS[0]; }
      if (mais) { mais.disabled = prefs.escala >= ESCALAS[ESCALAS.length - 1]; }
    });
  }

  function anunciar(msg) {
    if (window.GL) { GL.anunciar(msg); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    aplicar(ler());
    document.querySelectorAll('[data-painel-a11y]').forEach(montarPainel);
    sincronizar();
    // Se o tema mudar pelo botão do cabeçalho, o painel acompanha
    document.addEventListener('gl:tema', sincronizar);
  });

  /* API usada por outros scripts (ex.: carrossel) */
  window.GLA11y = {
    preferencias: ler,
    movimentoReduzido: function () {
      return ler().reduzirMovimento ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  };
})();
