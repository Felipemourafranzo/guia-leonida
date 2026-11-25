window.GLForm = (function () {
  'use strict';

  var regras = {
    obrigatorio: function (mensagem) {
      return function (valor) { return valor.trim() ? null : mensagem; };
    },
    email: function (mensagem) {
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

  function configurar(form, regrasPorCampo, aoEnviar) {
    var tentouEnviar = false;
    var resumo = form.querySelector('[data-resumo-erros]');
    var botao = form.querySelector('[type="submit"]');
    form.setAttribute('novalidate', '');

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

    if (resumo) {
      resumo.addEventListener('click', function (evento) {
        var link = evento.target.closest('a[href^="#"]');
        if (!link) { return; }
        evento.preventDefault();
        var campo = form.querySelector(link.getAttribute('href'));
        if (campo) { campo.focus(); }
      });
    }

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

    form.addEventListener('reset', function () {
      tentouEnviar = false;
      Object.keys(regrasPorCampo).forEach(function (id) { definirErro(form.querySelector('#' + id), null); });
      mostrarResumo([]);
    });
  }

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

  var ASSUNTOS = ['duvida', 'sugestao', 'correcao', 'acessibilidade', 'outro'];

  function iniciarContato() {
    var form = document.getElementById('form-contato');
    if (!form) { return; }
    var sucesso = document.getElementById('contato-sucesso');

    var assunto = new URLSearchParams(location.search).get('assunto');
    if (ASSUNTOS.indexOf(assunto) !== -1) {
      form.querySelector('#contato-assunto').value = assunto;
    }

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
