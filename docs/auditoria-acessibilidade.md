# Auditoria de acessibilidade do Guia Leonida

Data: 18/11/2026. Meta: **WCAG 2.2, nível AA**.

## 1. Verificação automática com axe-core

- **Ferramenta:** axe-core 4.10.2 (Deque Systems), a mesma engine do Lighthouse e do axe DevTools.
- **Regras:** tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` e `best-practice`.
- **Como foi rodado:** o script do axe foi injetado em cada página no navegador, com a janela em
  1280 × 900, em três configurações: modo claro, modo escuro e alto contraste.
- **Lighthouse:** não estava disponível no ambiente de desenvolvimento (sem Node.js). Para rodar, abra o
  site no Chrome → F12 → aba **Lighthouse** → marque **Accessibility** → *Analyze page load*. Vale
  incluir o print do resultado no relatório.

### Primeira rodada (antes das correções)

| Problema | Regra do axe | Páginas | Correção |
|---|---|---|---|
| `<code>` com contraste de 3,95:1 (cor padrão `#D63384` do Bootstrap sobre `#F5EDFF`) | `color-contrast` (1.4.3) | acessibilidade (modo claro) | `--bs-code-color` passou a usar o token roxo do tema (7,2:1) |
| `<aside>` dentro do `<main>` | `landmark-complementary-is-top-level` | início, contato, login | Trocado por `<section aria-labelledby>` |

Além disso, o axe marcou como **"precisa de revisão"** os textos sobre degradê, porque ele não consegue
calcular contraste em fundo degradê. Fizemos essa verificação manualmente (seção 2) e ela revelou uma
falha real: o laranja neon do título em degradê ficava abaixo de 3:1 no modo claro. A correção foi
montar o degradê do título só com as cores de texto do tema.

### Rodada final (depois das correções)

| Modo | index | guia | mapa | checklist | contato | login | acessibilidade |
|---|---|---|---|---|---|---|---|
| Claro | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Escuro | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Alto contraste | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

**0 violações em 21 execuções** (7 páginas × 3 modos). Entre 43 e 52 regras passaram em cada página. O
único item "precisa de revisão" que restou é o contraste sobre degradê, coberto pela seção 2.

## 2. Contraste calculado

Script `tools/contraste.py`, com a fórmula de luminância relativa da WCAG. Resultado completo em
[`contraste.md`](contraste.md):

- 18 pares de cores × 3 modos = 54 combinações: **todas passam no AA**.
- Textos sobre o degradê do hero, medidos contra cada ponto do degradê (pior caso): **todos passam**.
- 4 exemplos de "antes e depois" de cores que falharam e foram corrigidas.

## 3. Testes manuais

| Teste | Como | Resultado |
|---|---|---|
| Pular para o conteúdo | Tab ao abrir a página | ✅ É o primeiro item focado e leva o foco ao `<main>` |
| Navegação por teclado | Tab/Shift+Tab em todas as páginas | ✅ Ordem lógica, foco sempre visível (3px) |
| Painel de acessibilidade | Abrir pelo cabeçalho, Esc para fechar | ✅ O foco entra no painel e volta ao botão ao fechar |
| Abas do guia | Setas ← →, Home, End | ✅ Trocam a categoria e o foco acompanha |
| Carrossel | Setas, pausar, indicadores | ✅ Pausa com o foco dentro e não gira com "reduzir animações" ligado |
| Busca | "barco" e um termo inexistente | ✅ 3 resultados; estado "nenhum resultado" com botão de limpar |
| Formulário de contato | Enviar vazio e depois preenchido | ✅ Resumo com 5 erros focado, `aria-invalid` nos campos e sucesso anunciado |
| Cadastro e login | Senhas diferentes, senha errada | ✅ Mensagens específicas ligadas ao campo certo |
| Favoritos e checklist | Marcar com dois usuários | ✅ Dados separados por conta; barra com `aria-valuenow` |
| Largura de 320px | Todas as páginas | ✅ Sem rolagem horizontal (`scrollWidth` = 320) |
| Fonte em 150% | Painel → A+ | ✅ O menu quebra de linha sem sobrepor a marca |
| Alto contraste | Painel → Alto contraste | ✅ Preto, branco, amarelo e ciano; bordas em todos os cards |
| Modo escuro do sistema | `prefers-color-scheme` | ✅ Seguido quando o tema está em "Sistema" |
| Status do lançamento | Relógio adiantado em teste | ✅ Troca para "GTA VI já está disponível!" |

## 4. Limitações conhecidas

- As imagens são provisórias. Ao trocar pelas reais, o texto alternativo precisa ser revisto
  (veja `assets/img/IMAGENS.md`).
- Os rótulos do mapa esquemático ficam pequenos em telas estreitas. A mesma informação está em texto
  nos cards e na tabela da página.
- Não foi possível testar com leitores de tela reais (NVDA ou VoiceOver) neste ambiente. Recomendação: fazer
  um teste rápido com o NVDA (gratuito) no Windows antes da entrega.
