/* ==========================================================================
   Guia Leonida: form.js (validação acessível de formulários)
   --------------------------------------------------------------------------
   Um "mini-framework" de validação usado pelo formulário de contato e
   pelos formulários de login/cadastro (auth.js).

   Como os erros ficam acessíveis (WCAG 3.3.1, 3.3.3, 4.1.3):
     - cada campo tem um <p id="CAMPO-erro" class="mensagem-erro"> ligado
       pelo aria-describedby do campo
     - campos com erro recebem aria-invalid="true" e borda mais grossa,
       e a mensagem tem ícone (não depende só da cor)
     - ao tentar enviar com erros, aparece um RESUMO no topo do formulário
       com links para cada campo; o foco vai para esse resumo e a
       quantidade de erros é anunciada pela região aria-live
     - depois da primeira tentativa, os erros somem/aparecem enquanto a
       pessoa corrige (validação "ao vivo" só depois de tentar enviar)

   O envio é SIMULADO: o site não tem servidor.
   ========================================================================== */
window.GLForm = (function () {
  'use strict';

  /* ------------------------------------------------------------------
     Regras: cada uma recebe (valor, campo, formulário) e devolve a
     mensagem de erro ou null quando está tudo certo.
     ------------------------------------------------------------------ */
  var regras = {
    obrigatorio: function (mensagem) {
      return function (valor) { return valor.trim() ? null : mensagem; };
    },
    email: function (mensagem) {
      // Formato simples: algo@algo.dominio (sem espaços)
      var padrao = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      return function (valor) {
        if (!valor.trim()) { return null; }
        return padrao.test(valor.trim()) ? null : (mensagem || 'Digite um e-mail válido, no formato nome@exemplo.com.');
      };
    },
    minimo: function (n, mensagem) {
      return function (valor) {
        if (!valor.trim()) { return null; }
        return valor.trim().length >= n ? null : mensagem;
      };
    },
    maximo: function (n, mensagem) {
      return function (valor) { return valor.length <= n ? null : mensagem; };
    },
    igualA: function (idOutro, mensagem) {
      return function (valor, campo, form) {
        if (!valor) { return null; }
        return valor === form.querySelector('#' + idOutro).value ? null : mensagem;
      };
    },
    marcado: function (mensagem) {
      return function (valor, campo) { return campo.checked ? null : mensagem; };
    }
  };

  function valorDe(campo) {
    return campo.type === 'checkbox' ? (campo.checked ? 'sim' : '') : campo.value;
  }

  /* Mostra ou limpa o erro de um campo */
  function definirErro(campo, mensagem) {
    var saida = document.getElementById(campo.id + '-erro');
    if (mensagem) {
      campo.setAttribute('aria-invalid', 'true');
      if (saida) { saida.textContent = mensagem; }
    } else {
      campo.removeAttribute('aria-invalid');
      if (saida) { saida.textContent = ''; }
    }
  }

  /* ------------------------------------------------------------------
     configurar(form, regrasPorCampo, aoEnviar)
       aoEnviar(dados) deve devolver uma Promise com
         { ok: true }  ou  { erros: [{ campo: 'id', mensagem: '...' }] }
     ------------------------------------------------------------------ */
  function configurar(form, regrasPorCampo, aoEnviar) {
    var tentouEnviar = false;
    var resumo = form.querySelector('[data-resumo-erros]');
    var botao = form.querySelector('[type="submit"]');
    form.setAttribute('novalidate', ''); // usamos a nossa validação, não a do navegador

    function validarCampo(id) {
      var campo = form.querySelector('#' + id);
      var lista = regrasPorCampo[id] || [];
      for (var i = 0; i < lista.length; i++) {
        var msg = lista[i](valorDe(campo), campo, form);
        if (msg) { return msg; }
      }
      return null;
    }

    function mostrarResumo(erros) {
      if (!resumo) { return; }
      if (!erros.length) {
        resumo.hidden = true;
        return;
      }
      var titulo = erros.length === 1 ? 'Há 1 erro no formulário' : 'Há ' + erros.length + ' erros no formulário';
      resumo.innerHTML =
        '<h2 id="' + form.id + '-resumo-titulo">' +
          '<i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i> ' + titulo + '</h2>' +
        '<ul>' + erros.map(function (e) {
          return '<li><a href="#' + e.campo + '">' + GL.escaparHTML(e.mensagem) + '</a></li>';
        }).join('') + '</ul>';
      resumo.setAttribute('aria-labelledby', form.id + '-resumo-titulo');
      resumo.hidden = false;
    }

    function validarTudo() {
      var erros = [];
      Object.keys(regrasPorCampo).forEach(function (id) {
        var msg = validarCampo(id);
        definirErro(form.querySelector('#' + id), msg);
        if (msg) { erros.push({ campo: id, mensagem: msg }); }
      });
      return erros;
    }

    function mostrarErros(erros) {
      erros.forEach(function (e) { definirErro(form.querySelector('#' + e.campo), e.mensagem); });
      mostrarResumo(erros);
      GL.anunciar(erros.length === 1 ? 'O formulário tem 1 erro.' : 'O formulário tem ' + erros.length + ' erros.');
      if (resumo) {
        resumo.focus();
      } else {
        form.querySelector('#' + erros[0].campo).focus();
      }
    }

    /* Links do resumo: levam o foco para o campo certo */
    if (resumo) {
      resumo.addEventListener('click', function (evento) {
        var link = evento.target.closest('a[href^="#"]');
        if (!link) { return; }
        evento.preventDefault();
        var campo = form.querySelector(link.getAttribute('href'));
        if (campo) { campo.focus(); }
      });
    }

    /* Validação ao vivo depois da primeira tentativa de envio.
       Antes disso, valida só ao sair de um campo já preenchido. */
    Object.keys(regrasPorCampo).forEach(function (id) {
      var campo = form.querySelector('#' + id);
      var evento = campo.type === 'checkbox' || campo.tagName === 'SELECT' ? 'change' : 'input';
      campo.addEventListener(evento, function () {
        if (tentouEnviar) {
          definirErro(campo, validarCampo(id));
          mostrarResumo(validarTudoSilencioso());
        }
      });
      campo.addEventListener('blur', function () {
        if (!tentouEnviar && valorDe(campo).trim()) {
          definirErro(campo, validarCampo(id));
        }
      });
    });

    function validarTudoSilencioso() {
      return Object.keys(regrasPorCampo).map(function (id) {
        var msg = validarCampo(id);
        return msg ? { campo: id, mensagem: msg } : null;
      }).filter(Boolean);
    }

    function ocupado(sim) {
      if (!botao) { return; }
      botao.disabled = sim;
      form.setAttribute('aria-busy', sim ? 'true' : 'false');
      if (sim) {
        botao.dataset.textoOriginal = botao.innerHTML;
        botao.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Enviando…';
      } else if (botao.dataset.textoOriginal) {
        botao.innerHTML = botao.dataset.textoOriginal;
      }
    }

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();
      tentouEnviar = true;
      var erros = validarTudo();
      if (erros.length) {
        mostrarErros(erros);
        return;
      }
      mostrarResumo([]);

      var dados = {};
      Object.keys(regrasPorCampo).forEach(function (id) {
        var campo = form.querySelector('#' + id);
        dados[id] = campo.type === 'checkbox' ? campo.checked : campo.value.trim();
      });
      // Campos sem regra (ex.: opcionais) também entram nos dados
      Array.prototype.forEach.call(form.elements, function (campo) {
        if (campo.id && !(campo.id in dados) && campo.name) {
          dados[campo.id] = campo.type === 'checkbox' ? campo.checked : campo.value.trim();
        }
      });

      ocupado(true);
      Promise.resolve(aoEnviar(dados)).then(function (resultado) {
        ocupado(false);
        if (resultado && resultado.erros && resultado.erros.length) {
          mostrarErros(resultado.erros);
        } else {
          tentouEnviar = false;
        }
      }).catch(function () {
        ocupado(false);
        GL.avisar('Algo deu errado. Tente de novo.', { icone: 'bi-exclamation-triangle-fill' });
      });
    });

    /* Limpa erros quando o formulário é reiniciado */
    form.addEventListener('reset', function () {
      tentouEnviar = false;
      Object.keys(regrasPorCampo).forEach(function (id) { definirErro(form.querySelector('#' + id), null); });
      mostrarResumo([]);
    });
  }

  /* ------------------------------------------------------------------
     Botões "mostrar senha" (WCAG 3.3.8: ajuda a não errar a senha)
     <button data-mostrar-senha="idDoCampo" aria-pressed="false">
     ------------------------------------------------------------------ */
  function iniciarMostrarSenha() {
    document.querySelectorAll('[data-mostrar-senha]').forEach(function (botao) {
      var campo = document.getElementById(botao.getAttribute('data-mostrar-senha'));
      botao.addEventListener('click', function () {
        var mostrar = campo.type === 'password';
        campo.type = mostrar ? 'text' : 'password';
        botao.setAttribute('aria-pressed', mostrar ? 'true' : 'false');
        botao.querySelector('i').className = mostrar ? 'bi bi-eye-slash' : 'bi bi-eye';
      });
    });
  }

  /* Contador de caracteres: <span data-contador-de="idDoCampo" data-maximo="1000"> */
  function iniciarContadores() {
    document.querySelectorAll('[data-contador-de]').forEach(function (saida) {
      var campo = document.getElementById(saida.getAttribute('data-contador-de'));
      var maximo = parseInt(saida.getAttribute('data-maximo'), 10);
      function atualizar() {
        var restam = maximo - campo.value.length;
        saida.textContent = campo.value.length + ' de ' + maximo + ' caracteres';
        saida.classList.toggle('text-danger', restam < 0);
      }
      campo.addEventListener('input', atualizar);
      campo.form && campo.form.addEventListener('reset', function () { setTimeout(atualizar, 0); });
      atualizar();
    });
  }

  /* ------------------------------------------------------------------
     Formulário de contato (contato.html)
     ------------------------------------------------------------------ */
  var ASSUNTOS = ['duvida', 'sugestao', 'correcao', 'acessibilidade', 'outro'];

  function iniciarContato() {
    var form = document.getElementById('form-contato');
    if (!form) { return; }
    var sucesso = document.getElementById('contato-sucesso');

    // Pré-seleciona o assunto vindo do link (ex.: rodapé "Relatar uma barreira")
    var assunto = new URLSearchParams(location.search).get('assunto');
    if (ASSUNTOS.indexOf(assunto) !== -1) {
      form.querySelector('#contato-assunto').value = assunto;
    }

    // Se a pessoa está logada, já preenche nome e e-mail (WCAG 3.3.7: evitar digitar de novo)
    var usuario = window.GLAuth && GLAuth.usuarioAtual();
    if (usuario) {
      form.querySelector('#contato-nome').value = usuario.nome;
      form.querySelector('#contato-email').value = usuario.email;
    }

    configurar(form, {
      'contato-nome': [regras.obrigatorio('Informe seu nome.'), regras.minimo(2, 'O nome precisa ter pelo menos 2 letras.')],
      'contato-email': [regras.obrigatorio('Informe seu e-mail para podermos responder.'), regras.email()],
      'contato-assunto': [regras.obrigatorio('Escolha um assunto.')],
      'contato-mensagem': [
        regras.obrigatorio('Escreva sua mensagem.'),
        regras.minimo(20, 'A mensagem precisa ter pelo menos 20 caracteres.'),
        regras.maximo(1000, 'A mensagem pode ter no máximo 1000 caracteres.')
      ],
      'contato-consentimento': [regras.marcado('Marque a caixa de consentimento para enviar.')]
    }, function (dados) {
      // ENVIO SIMULADO: espera 1,2 s como se fosse a rede e guarda no navegador
      return new Promise(function (resolver) {
        setTimeout(function () {
          var protocolo = 'GL-' + Date.now().toString(36).toUpperCase().slice(-6);
          var mensagens = GL.lerJSON('gl-mensagens', []);
          mensagens.unshift({
            protocolo: protocolo,
            nome: dados['contato-nome'],
            email: dados['contato-email'],
            assunto: dados['contato-assunto'],
            mensagem: dados['contato-mensagem'],
            enviadaEm: new Date().toISOString()
          });
          GL.salvarJSON('gl-mensagens', mensagens.slice(0, 20));

          form.hidden = true;
          sucesso.querySelector('[data-sucesso-nome]').textContent = dados['contato-nome'].split(' ')[0];
          sucesso.querySelector('[data-sucesso-protocolo]').textContent = protocolo;
          sucesso.hidden = false;
          sucesso.focus();
          GL.anunciar('Mensagem enviada com sucesso. Protocolo ' + protocolo + '.');
          resolver({ ok: true });
        }, 1200);
      });
    });

    document.querySelector('[data-nova-mensagem]').addEventListener('click', function () {
      form.reset();
      if (usuario) {
        form.querySelector('#contato-nome').value = usuario.nome;
        form.querySelector('#contato-email').value = usuario.email;
      }
      sucesso.hidden = true;
      form.hidden = false;
      form.querySelector('#contato-nome').focus();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    iniciarMostrarSenha();
    iniciarContadores();
    iniciarContato();
  });

  return { configurar: configurar, regras: regras };
})();
