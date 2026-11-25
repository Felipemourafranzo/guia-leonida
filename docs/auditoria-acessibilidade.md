# Auditoria de acessibilidade do Guia Leonida

Data: 25/11/2026 (redesign "trailer de rolagem"). Meta: **WCAG 2.2, nível AA**.
A auditoria anterior (18/11/2026, visual antigo) está no histórico do git.

## 1. Verificação automática com axe-core

- **Ferramenta:** axe-core 4.10.2 (Deque Systems), a mesma engine do Lighthouse e do axe DevTools.
- **Regras:** tags `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa` e `best-practice`.
- **Como foi rodado:** pelo script `tools/prints.mjs --axe`, que abre cada página no Google Chrome em modo
  headless, prepara o estado (tema, preferências, rolagem) e injeta o axe:

  ```bash
  node tools/prints.mjs http://localhost:8000/mapa.html 1440x900 print.jpg ".mapa-cena@0.1" --axe
  ```

- **Lighthouse:** não foi rodado aqui. Para rodar: Chrome → F12 → **Lighthouse** → Accessibility (e
  Performance) → *Analyze page load*, e incluir o print no relatório.

### Problemas encontrados e corrigidos durante o redesign

| Problema | Regra do axe | Onde | Correção |
|---|---|---|---|
| `aria-label` num `<p>` (frase da abertura) | `aria-prohibited-attr` | início | A frase inteira vai num `span` escondido; as palavras animadas ficam com `aria-hidden` |
| Conteúdo fora de landmarks (faixa do topo) | `region` | todas | Faixa com `role="region"` e rótulo |
| `<h1>` sumia do leitor de tela depois da abertura | `page-has-heading-one` | início | A animação usava `visibility: hidden` (`autoAlpha`); agora só muda `opacity` |
| `<aside>` dentro do `<main>` (painel do mapa) | `landmark-complementary-is-top-level` | mapa | Trocado por `<section aria-label>` |
| Tabela com rolagem lateral sem foco do teclado | `scrollable-region-focusable` | mapa, acessibilidade (celular) | `.table-responsive` com `tabindex="0"`, `role="region"` e rótulo |
| Lista da cena do mapa apagada demais no início | `color-contrast` | mapa (tema claro) | O item começa em 75% de opacidade e desliza ao acender, em vez de começar em 40% |

### Rodada final

| Configuração | index | guia | mapa | checklist | contato | login | acessibilidade |
|---|---|---|---|---|---|---|---|
| Tema escuro, 1440 px | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tema claro, 1440 px | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| "Reduzir animações", 375 px | 0 | — | 0 | — | — | — | 0 |
| Alto contraste + fonte 150% | — | 0 | — | — | — | — | — |

Na página inicial e no mapa, o axe também rodou **no meio das cenas** (abertura, cenas de Jason e Lucia,
tour, faixa de destaques, cena do mapa), nos dois temas: **0 violações**.

## 2. Contraste calculado

Script `tools/contraste.py`, com a fórmula de luminância relativa da WCAG. Resultado em
[`contraste.md`](contraste.md):

- 19 pares × 3 temas = 57 combinações: **todas passam no AA**.
- 12 pares das cenas com foto (texto sobre o véu escuro, botão em degradê, faixa do topo, marcadores do
  mapa): **todos passam**.
- 6 títulos grandes do tema claro sobre o céu e o sol da abertura (limite de 3:1): **todos passam**.
- 4 exemplos de "antes e depois" de cores que falharam e foram corrigidas.

## 3. Testes manuais e com o navegador

| Teste | Como | Resultado |
|---|---|---|
| Pular para o conteúdo | Tab ao abrir a página | ✅ Primeiro item focado; leva ao `<main>` |
| Navegação por teclado | Tab/Shift+Tab | ✅ Ordem lógica, foco sempre visível (3px, creme no escuro e roxo no claro) |
| Links dentro das cenas | Tab até o botão de uma cena que já se apagou | ✅ O texto reaparece ao receber foco (`:focus-within`) |
| Faixa de destaques | Tab pelos cards e botões ← → | ✅ A faixa anda até o card focado |
| Mapa pelo teclado | Foco no mapa: setas, + e −, 0 | ✅ Move, aproxima e centraliza; botões +, − e centralizar também |
| Mapa com o mouse | Roda sobre o mapa | ✅ Só o zoom muda; a página não rola junto (`data-lenis-prevent`) |
| Tour das regiões | Descer até o fim e voltar | ✅ Um texto de região por vez (cada slide isola o próprio texto) |
| "Reduzir animações" | Ligar no painel com a página aberta | ✅ Na hora: cenas viram imagens paradas, rolagem suave desliga, carrossel para |
| `prefers-reduced-motion` | Emulado no Chrome | ✅ Mesmo resultado, já ao abrir |
| Sem JavaScript | Classe `movimento` ausente | ✅ Versão parada, todo o conteúdo visível |
| Painel de acessibilidade | Abrir pelo cabeçalho, Esc para fechar | ✅ Foco entra e volta ao botão; rolagem da página pausa |
| Abas do guia | Setas ← →, Home, End | ✅ |
| Carrossel | Setas, pausar, indicadores | ✅ |
| Formulário de contato | Enviar vazio e depois preenchido | ✅ Resumo com 5 erros, `aria-invalid` e sucesso anunciado |
| Larguras | 320, 375, 768 e 1440 px, nos dois temas | ✅ Sem rolagem horizontal em nenhuma página |
| Fonte em 150% e alto contraste | Painel | ✅ O menu quebra de linha sem sobrepor; fotos continuam visíveis acima do véu preto |
| Carregamento da página inicial | `tools/prints.mjs --medir`, servidor local | ✅ Maior elemento (LCP) em ~0,4 s (computador) e ~0,5 s (375 px) |

## 4. Limitações conhecidas

- **Quadros por segundo:** no Chrome headless **sem GPU**, a rolagem fica em 60 fps no topo e nas
  páginas internas e em 48 a 56 fps dentro das cenas de vídeo e do tour. Falta medir no DevTools →
  Performance de um navegador com GPU.
- **Leitores de tela reais** (NVDA, VoiceOver) não foram testados neste ambiente. Recomendação: um teste
  rápido com o NVDA antes da entrega, passando pela página inicial e pelo mapa.
- O pôster oficial do mapa tem letras pequenas; a mesma informação está na tabela e nas fichas da página.
- As cenas usam imagens grandes (cerca de 3 MB por cena no computador; metade no celular). Elas só
  começam a baixar quando a cena está perto da tela.
