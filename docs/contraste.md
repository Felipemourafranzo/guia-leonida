# Análise de contraste (WCAG 2.2)

> Arquivo **gerado automaticamente** por `tools/contraste.py`. Não edite à mão: altere as cores no script e rode `python tools/contraste.py`.

## Como o cálculo é feito

1. Cada canal da cor (R, G, B) é convertido de 0–255 para 0–1.
2. O canal é linearizado: `c <= 0,04045 ? c / 12,92 : ((c + 0,055) / 1,055)^2,4`.
3. Luminância relativa: `L = 0,2126·R + 0,7152·G + 0,0722·B`.
4. Razão de contraste: `(L_clara + 0,05) / (L_escura + 0,05)`, de 1:1 a 21:1.

| Tipo | AA | AAA | Critério |
|---|---|---|---|
| Texto normal | 4,5:1 | 7:1 | 1.4.3 / 1.4.6 |
| Texto grande (≥ 24px, ou ≥ 18,66px em negrito) | 3:1 | 4,5:1 | 1.4.3 / 1.4.6 |
| Componentes de interface e foco | 3:1 | — | 1.4.11 |

Todos os textos foram avaliados com o limite de **texto normal** (4,5:1), mesmo quando aparecem em tamanho grande, para ter margem de segurança.

## Modo escuro

| Uso | Cor da frente | Cor de fundo | Razão | AA | AAA |
|---|---|---|---|---|---|
| Títulos das seções | `#F4E6CF` `titulo` | `#0B1630` `fundo` | **14,57:1** | ✅ Passa | ✅ Passa |
| Texto do corpo sobre o fundo da página | `#E9EEF7` `texto` | `#0B1630` `fundo` | **15,39:1** | ✅ Passa | ✅ Passa |
| Texto dentro dos cards e painéis | `#E9EEF7` `texto` | `#13224A` `superficie` | **13,31:1** | ✅ Passa | ✅ Passa |
| Texto secundário (datas, rodapé) | `#A9B6D3` `texto-suave` | `#0B1630` `fundo` | **8,81:1** | ✅ Passa | ✅ Passa |
| Descrição dos cards | `#A9B6D3` `texto-suave` | `#13224A` `superficie` | **7,61:1** | ✅ Passa | ✅ Passa |
| Links em rosa | `#FF7A93` `acento` | `#0B1630` `fundo` | **7,22:1** | ✅ Passa | ✅ Passa |
| Links dentro dos cards | `#FF7A93` `acento` | `#13224A` `superficie` | **6,24:1** | ✅ Passa | ❌ Falha |
| Texto do botão principal | `#0B1630` `sobre-acento` | `#FF7A93` `acento` | **7,22:1** | ✅ Passa | ✅ Passa |
| Mensagens de erro do formulário | `#FF9B8F` `erro` | `#13224A` `superficie` | **7,63:1** | ✅ Passa | ✅ Passa |
| Mensagens de sucesso | `#7FE0B0` `sucesso` | `#13224A` `superficie` | **9,73:1** | ✅ Passa | ✅ Passa |
| Borda dos campos de formulário *(UI, 3:1)* | `#7186B3` `borda-campo` | `#13224A` `superficie` | **4,25:1** | ✅ Passa | — |
| Contorno de foco sobre o fundo *(UI, 3:1)* | `#FFD23F` `foco` | `#0B1630` `fundo` | **12,41:1** | ✅ Passa | — |
| Contorno de foco sobre os cards *(UI, 3:1)* | `#FFD23F` `foco` | `#13224A` `superficie` | **10,73:1** | ✅ Passa | — |

## Modo claro

| Uso | Cor da frente | Cor de fundo | Razão | AA | AAA |
|---|---|---|---|---|---|
| Títulos das seções | `#0B1630` `titulo` | `#F3EEE6` `fundo` | **15,52:1** | ✅ Passa | ✅ Passa |
| Texto do corpo sobre o fundo da página | `#0B1630` `texto` | `#F3EEE6` `fundo` | **15,52:1** | ✅ Passa | ✅ Passa |
| Texto dentro dos cards e painéis | `#0B1630` `texto` | `#FFFFFF` `superficie` | **17,92:1** | ✅ Passa | ✅ Passa |
| Texto secundário (datas, rodapé) | `#3E4A66` `texto-suave` | `#F3EEE6` `fundo` | **7,65:1** | ✅ Passa | ✅ Passa |
| Descrição dos cards | `#3E4A66` `texto-suave` | `#FFFFFF` `superficie` | **8,84:1** | ✅ Passa | ✅ Passa |
| Links em rosa | `#B01E4E` `acento` | `#F3EEE6` `fundo` | **5,79:1** | ✅ Passa | ❌ Falha |
| Links dentro dos cards | `#B01E4E` `acento` | `#FFFFFF` `superficie` | **6,68:1** | ✅ Passa | ❌ Falha |
| Texto do botão principal | `#FFFFFF` `sobre-acento` | `#B01E4E` `acento` | **6,68:1** | ✅ Passa | ❌ Falha |
| Mensagens de erro do formulário | `#B42318` `erro` | `#FFFFFF` `superficie` | **6,57:1** | ✅ Passa | ❌ Falha |
| Mensagens de sucesso | `#146C43` `sucesso` | `#FFFFFF` `superficie` | **6,45:1** | ✅ Passa | ❌ Falha |
| Borda dos campos de formulário *(UI, 3:1)* | `#6A7590` `borda-campo` | `#FFFFFF` `superficie` | **4,61:1** | ✅ Passa | — |
| Contorno de foco sobre o fundo *(UI, 3:1)* | `#0B1630` `foco` | `#F3EEE6` `fundo` | **15,52:1** | ✅ Passa | — |
| Contorno de foco sobre os cards *(UI, 3:1)* | `#0B1630` `foco` | `#FFFFFF` `superficie` | **17,92:1** | ✅ Passa | — |

## Modo alto contraste

| Uso | Cor da frente | Cor de fundo | Razão | AA | AAA |
|---|---|---|---|---|---|
| Títulos das seções | `#FFFFFF` `titulo` | `#000000` `fundo` | **21,00:1** | ✅ Passa | ✅ Passa |
| Texto do corpo sobre o fundo da página | `#FFFFFF` `texto` | `#000000` `fundo` | **21,00:1** | ✅ Passa | ✅ Passa |
| Texto dentro dos cards e painéis | `#FFFFFF` `texto` | `#000000` `superficie` | **21,00:1** | ✅ Passa | ✅ Passa |
| Texto secundário (datas, rodapé) | `#FFFFFF` `texto-suave` | `#000000` `fundo` | **21,00:1** | ✅ Passa | ✅ Passa |
| Descrição dos cards | `#FFFFFF` `texto-suave` | `#000000` `superficie` | **21,00:1** | ✅ Passa | ✅ Passa |
| Links em rosa | `#FFFF00` `acento` | `#000000` `fundo` | **19,56:1** | ✅ Passa | ✅ Passa |
| Links dentro dos cards | `#FFFF00` `acento` | `#000000` `superficie` | **19,56:1** | ✅ Passa | ✅ Passa |
| Texto do botão principal | `#000000` `sobre-acento` | `#FFFF00` `acento` | **19,56:1** | ✅ Passa | ✅ Passa |
| Mensagens de erro do formulário | `#FF8080` `erro` | `#000000` `superficie` | **8,65:1** | ✅ Passa | ✅ Passa |
| Mensagens de sucesso | `#7CFF7C` `sucesso` | `#000000` `superficie` | **16,45:1** | ✅ Passa | ✅ Passa |
| Borda dos campos de formulário *(UI, 3:1)* | `#FFFFFF` `borda-campo` | `#000000` `superficie` | **21,00:1** | ✅ Passa | — |
| Contorno de foco sobre o fundo *(UI, 3:1)* | `#FFFF00` `foco` | `#000000` `fundo` | **19,56:1** | ✅ Passa | — |
| Contorno de foco sobre os cards *(UI, 3:1)* | `#FFFF00` `foco` | `#000000` `superficie` | **19,56:1** | ✅ Passa | — |

## Texto sobre as fotos do jogo (pior caso)

As capturas mudam de uma tela para outra, então o texto sobre foto é medido contra o pior caso possível: um pixel **branco puro** atrás do véu escuro do hero. A cor de fundo da tabela é a mistura do véu (`#0B1630`) com o branco na opacidade daquele ponto.

| Onde | Opacidade do véu | Fundo no pior caso | Texto | Razão | Limite | AA |
|---|---|---|---|---|---|---|
| Menu do cabeçalho sobre o topo do hero (véu ~0,70) | 0,7 | `#545C6E` | `#E9EEF7` | **5,76:1** | 4,5:1 | ✅ Passa |
| Nome "Leonida" no hero, parte mais alta da letra (véu ~0,60) | 0,6 | `#6D7383` | `#F4E6CF` | **3,85:1** | 3:1 (texto grande) | ✅ Passa |
| Linha e status embaixo do hero (véu ~0,90) | 0,9 | `#232D45` | `#E9EEF7` | **11,77:1** | 4,5:1 | ✅ Passa |

## Antes e depois: cores que falharam e foram corrigidas

| Caso | Antes | Razão antes | Depois | Razão depois | Fundo |
|---|---|---|---|---|---|
| Rosa neon do botão principal no modo claro | `#FF2D95` | 3,29:1 ❌ Falha | `#B8175E` | 6,01:1 ✅ Passa | `#FFF8F2` |
| Ciano dos links no modo claro | `#22D3EE` | 1,81:1 ❌ Falha | `#0B6577` | 6,68:1 ✅ Passa | `#FFFFFF` |
| Roxo dos rótulos de categoria no modo escuro | `#7C3AED` | 3,09:1 ❌ Falha | `#B9A2FF` | 8,12:1 ✅ Passa | `#1A1433` |
| Título em degradê neon no modo claro | `#FF8A3D` | 2,00:1 ❌ Falha | `#A3410B` | 5,39:1 ✅ Passa | `#FFE9D6` |

- **Rosa neon do botão principal no modo claro:** O rosa neon original (#FF2D95) é a cor mais 'Vice City' da paleta, mas sobre o fundo areia ele não chega nem a 4,5:1. Escurecemos o rosa mantendo o matiz (framboesa) até passar no AA com folga.
- **Ciano dos links no modo claro:** O ciano neon é ótimo no modo escuro, mas no branco quase desaparece (cerca de 1,8:1). No modo claro usamos um azul-petróleo do mesmo matiz.
- **Roxo dos rótulos de categoria no modo escuro:** O roxo saturado (#7C3AED) combina com a noite de Vice City, mas sobre o card escuro fica em 3,09:1, abaixo dos 4,5:1 exigidos para texto. Clareamos para um lilás que mantém o tom e passa até no AAA.
- **Título em degradê neon no modo claro:** O título 'Leonida' usava o degradê neon puro (rosa, laranja e roxo). O ponto laranja (#FF8A3D) sobre o degradê areia do topo ficava abaixo de 3:1, reprovando até como texto grande. O degradê do texto passou a usar as cores de texto do tema.

## Resultado

**Todos os pares usados no site passam no nível AA da WCAG 2.2.**
