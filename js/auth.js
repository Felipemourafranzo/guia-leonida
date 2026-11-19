/* ==========================================================================
   Guia Leonida: auth.js (login e cadastro SIMULADOS)
   --------------------------------------------------------------------------
   ATENÇÃO: ISTO NÃO É AUTENTICAÇÃO DE VERDADE.
   O site não tem servidor (backend). As contas ficam apenas no
   localStorage do navegador de quem está usando. Qualquer pessoa com
   acesso ao navegador consegue ver e apagar esses dados pelas ferramentas
   de desenvolvedor. A senha é guardada como hash SHA-256 só para não ficar
   em texto puro, mas sem servidor isso NÃO é segurança real.
   Serve apenas para demonstrar a interface de login e permitir que cada
   "usuário" tenha seus próprios favoritos e checklist.

   Chaves no localStorage:
     gl-usuarios            lista de contas [{nome, email, senhaHash, criadoEm}]
     gl-sessao              conta logada {nome, email}
     gl-favoritos:<email>   ids dos itens favoritados
     gl-checklist:<email>   {idDoItem: true}
   ========================================================================== */
window.GLAuth = (function () {
  'use strict';

  var CHAVE_USUARIOS = 'gl-usuarios';
  var CHAVE_SESSAO = 'gl-sessao';

  /* Páginas para onde podemos voltar depois do login (evita redirecionar
     para sites externos através do parâmetro ?voltar=) */
  var PAGINAS_PERMITIDAS = ['index.html', 'guia.html', 'mapa.html', 'checklist.html', 'contato.html', 'acessibilidade.html'];

  function usuarios() { return GL.lerJSON(CHAVE_USUARIOS, []); }
  function usuarioAtual() { return GL.lerJSON(CHAVE_SESSAO, null); }

  /* Hash SHA-256 da senha (Web Crypto). Se o navegador não oferecer a
     API (ex.: página aberta sem HTTPS em alguns navegadores), usamos um
     hash simples, só para não guardar a senha em texto puro. */
  function gerarHash(texto) {
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto)).then(function (buffer) {
        return Array.from(new Uint8Array(buffer)).map(function (b) {
          return b.toString(16).padStart(2, '0');
        }).join('');
      });
    }
    var h = 5381;
    for (var i = 0; i < texto.length; i++) { h = ((h << 5) + h + texto.charCodeAt(i)) >>> 0; }
    return Promise.resolve('simples-' + h.toString(16));
  }

  function normalizarEmail(email) { return String(email).trim().toLowerCase(); }

  /* Cria a conta. Retorna Promise com {ok, erro, campo} */
  function cadastrar(nome, email, senha) {
    email = normalizarEmail(email);
    var lista = usuarios();
    if (lista.some(function (u) { return u.email === email; })) {
      return Promise.resolve({ ok: false, campo: 'email', erro: 'Já existe uma conta com este e-mail. Use a aba "Entrar".' });
    }
    return gerarHash(email + ':' + senha).then(function (hash) {
      var usuario = { nome: String(nome).trim(), email: email, senhaHash: hash, criadoEm: new Date().toISOString() };
      lista.push(usuario);
      if (!GL.salvarJSON(CHAVE_USUARIOS, lista)) {
        return { ok: false, erro: 'Não foi possível salvar: o armazenamento do navegador está bloqueado.' };
      }
      GL.salvarJSON(CHAVE_SESSAO, { nome: usuario.nome, email: usuario.email });
      atualizarCabecalho();
      return { ok: true, usuario: usuario };
    });
  }

  /* Faz login. Retorna Promise com {ok, erro, campo} */
  function entrar(email, senha) {
    email = normalizarEmail(email);
    var usuario = usuarios().filter(function (u) { return u.email === email; })[0];
    if (!usuario) {
      return Promise.resolve({ ok: false, campo: 'email', erro: 'Não encontramos uma conta com este e-mail. Confira ou crie uma conta.' });
    }
    return gerarHash(email + ':' + senha).then(function (hash) {
      if (hash !== usuario.senhaHash) {
        return { ok: false, campo: 'senha', erro: 'Senha incorreta. Confira e tente de novo.' };
      }
      GL.salvarJSON(CHAVE_SESSAO, { nome: usuario.nome, email: usuario.email });
      atualizarCabecalho();
      return { ok: true, usuario: usuario };
    });
  }

  function sair() {
    try { localStorage.removeItem(CHAVE_SESSAO); } catch (erro) { /* ignora */ }
    atualizarCabecalho();
  }

  /* ---------------------------- Favoritos ---------------------------- */
  function chaveFavoritos() {
    var u = usuarioAtual();
    return u ? 'gl-favoritos:' + u.email : null;
  }
  function favoritos() {
    var chave = chaveFavoritos();
    return chave ? GL.lerJSON(chave, []) : [];
  }
  function ehFavorito(id) { return favoritos().indexOf(id) !== -1; }

  /* Alterna o favorito. Retorna true/false (novo estado) ou null se não
     houver usuário logado. */
  function alternarFavorito(id) {
    var chave = chaveFavoritos();
    if (!chave) { return null; }
    var lista = favoritos();
    var posicao = lista.indexOf(id);
    if (posicao === -1) { lista.push(id); } else { lista.splice(posicao, 1); }
    GL.salvarJSON(chave, lista);
    document.dispatchEvent(new CustomEvent('gl:favoritos', { detail: { id: id, favoritos: lista } }));
    return posicao === -1;
  }

  /* ---------------------------- Checklist ---------------------------- */
  function lerChecklist() {
    var u = usuarioAtual();
    return u ? GL.lerJSON('gl-checklist:' + u.email, {}) : {};
  }
  function salvarChecklist(estado) {
    var u = usuarioAtual();
    if (u) { GL.salvarJSON('gl-checklist:' + u.email, estado); }
  }

  /* ------------------ Link "Entrar / Minha conta" no menu ------------------ */
  function primeiroNome(nome) { return String(nome).split(' ')[0]; }

  function atualizarCabecalho() {
    var u = usuarioAtual();
    document.querySelectorAll('[data-link-conta]').forEach(function (link) {
      var texto = link.querySelector('[data-link-conta-texto]');
      var icone = link.querySelector('.bi');
      if (u) {
        texto.textContent = 'Olá, ' + primeiroNome(u.nome);
        link.setAttribute('aria-label', 'Minha conta: ' + u.nome);
        if (icone) { icone.className = 'bi bi-person-check-fill'; }
      } else {
        texto.textContent = 'Entrar';
        link.removeAttribute('aria-label');
        if (icone) { icone.className = 'bi bi-person-circle'; }
      }
    });
    // Elementos que só fazem sentido para quem não está logado (ex.: "Criar conta")
    document.querySelectorAll('[data-somente-visitante]').forEach(function (el) {
      el.hidden = !!u;
    });
    document.dispatchEvent(new CustomEvent('gl:sessao', { detail: { usuario: u } }));
  }

  /* --------------------------- Página de login --------------------------- */
  function destinoDepoisDoLogin() {
    var voltar = new URLSearchParams(location.search).get('voltar');
    return PAGINAS_PERMITIDAS.indexOf(voltar) !== -1 ? voltar : null;
  }

  function mostrarPainelConta() {
    var painelConta = document.getElementById('painel-conta');
    var areaForms = document.getElementById('area-formularios-login');
    if (!painelConta || !areaForms) { return; }
    var u = usuarioAtual();
    painelConta.hidden = !u;
    areaForms.hidden = !!u;
    if (u) {
      painelConta.querySelector('[data-conta-nome]').textContent = u.nome;
      painelConta.querySelector('[data-conta-email]').textContent = u.email;
      var favs = favoritos().length;
      var check = Object.keys(lerChecklist()).filter(function (k) { return lerChecklist()[k]; }).length;
      painelConta.querySelector('[data-conta-resumo]').textContent =
        favs + (favs === 1 ? ' favorito' : ' favoritos') + ' · ' + check + (check === 1 ? ' item concluído' : ' itens concluídos') + ' no checklist';
    }
  }

  function iniciarPaginaLogin() {
    var formEntrar = document.getElementById('form-entrar');
    var formCadastro = document.getElementById('form-cadastro');
    if (!formEntrar || !formCadastro || !window.GLForm) { return; }

    // Ao concluir: mostra o painel da conta (ou volta para a página de origem)
    function concluir(mensagem) {
      var destino = destinoDepoisDoLogin();
      GL.avisar(mensagem, { icone: 'bi-check-circle-fill', titulo: 'Tudo certo' });
      if (destino) {
        setTimeout(function () { location.href = destino; }, 900);
        return;
      }
      mostrarPainelConta();
      var titulo = document.getElementById('painel-conta-titulo');
      if (titulo) { titulo.focus(); }
    }

    GLForm.configurar(formEntrar, {
      'entrar-email': [GLForm.regras.obrigatorio('Informe seu e-mail.'), GLForm.regras.email()],
      'entrar-senha': [GLForm.regras.obrigatorio('Informe sua senha.')]
    }, function (dados) {
      return entrar(dados['entrar-email'], dados['entrar-senha']).then(function (r) {
        if (!r.ok) {
          return { erros: [{ campo: r.campo === 'senha' ? 'entrar-senha' : 'entrar-email', mensagem: r.erro }] };
        }
        concluir('Você entrou como ' + r.usuario.nome + '.');
        return { ok: true };
      });
    });

    GLForm.configurar(formCadastro, {
      'cadastro-nome': [GLForm.regras.obrigatorio('Informe seu nome.'), GLForm.regras.minimo(2, 'O nome precisa ter pelo menos 2 letras.')],
      'cadastro-email': [GLForm.regras.obrigatorio('Informe um e-mail.'), GLForm.regras.email()],
      'cadastro-senha': [GLForm.regras.obrigatorio('Crie uma senha.'), GLForm.regras.minimo(8, 'A senha precisa ter pelo menos 8 caracteres.')],
      'cadastro-confirmar': [GLForm.regras.obrigatorio('Repita a senha.'), GLForm.regras.igualA('cadastro-senha', 'As senhas não são iguais.')],
      'cadastro-ciente': [GLForm.regras.marcado('Marque a caixa para confirmar que entendeu que a conta é simulada.')]
    }, function (dados) {
      return cadastrar(dados['cadastro-nome'], dados['cadastro-email'], dados['cadastro-senha']).then(function (r) {
        if (!r.ok) {
          return { erros: [{ campo: r.campo === 'email' ? 'cadastro-email' : 'cadastro-nome', mensagem: r.erro }] };
        }
        concluir('Conta criada! Bem-vindo(a), ' + primeiroNome(r.usuario.nome) + '.');
        return { ok: true };
      });
    });

    var botaoSair = document.querySelector('[data-sair]');
    if (botaoSair) {
      botaoSair.addEventListener('click', function () {
        sair();
        mostrarPainelConta();
        GL.avisar('Você saiu da sua conta.', { icone: 'bi-box-arrow-right' });
        var aba = document.getElementById('aba-entrar');
        if (aba) { aba.focus(); }
      });
    }

    // Abre direto na aba "Cadastrar" com ?aba=cadastro
    if (new URLSearchParams(location.search).get('aba') === 'cadastro' && window.bootstrap) {
      var abaCadastro = document.getElementById('aba-cadastro');
      if (abaCadastro) { bootstrap.Tab.getOrCreateInstance(abaCadastro).show(); }
    }

    mostrarPainelConta();
  }

  document.addEventListener('DOMContentLoaded', function () {
    atualizarCabecalho();
    iniciarPaginaLogin();
  });

  return {
    usuarioAtual: usuarioAtual,
    entrar: entrar,
    cadastrar: cadastrar,
    sair: sair,
    favoritos: favoritos,
    ehFavorito: ehFavorito,
    alternarFavorito: alternarFavorito,
    lerChecklist: lerChecklist,
    salvarChecklist: salvarChecklist
  };
})();
