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
| Texto do corpo sobre o fundo da página | `#F4EEFC` `texto` | `#120B22` `fundo` | **16,85:1** | ✅ Passa | ✅ Passa |
| Texto nas faixas alternadas | `#F4EEFC` `texto` | `#1B1030` `fundo-2` | **15,89:1** | ✅ Passa | ✅ Passa |
| Texto em painéis, campos e modais | `#F4EEFC` `texto` | `#1B1030` `superficie` | **15,89:1** | ✅ Passa | ✅ Passa |
| Texto em painéis destacados | `#F4EEFC` `texto` | `#2A1A47` `superficie-2` | **13,82:1** | ✅ Passa | ✅ Passa |
| Texto secundário (legendas, datas) | `#C9BDDF` `texto-suave` | `#120B22` `fundo` | **10,79:1** | ✅ Passa | ✅ Passa |
| Texto secundário em painéis | `#C9BDDF` `texto-suave` | `#1B1030` `superficie` | **10,17:1** | ✅ Passa | ✅ Passa |
| Sobretítulos e datas da linha do tempo | `#FFE8A3` `destaque` | `#120B22` `fundo` | **15,80:1** | ✅ Passa | ✅ Passa |
| Rótulos do painel de acessibilidade | `#FFE8A3` `destaque` | `#1B1030` `superficie` | **14,89:1** | ✅ Passa | ✅ Passa |
| Links e títulos de seção em rosa | `#FF4FA3` `primaria` | `#120B22` `fundo` | **6,29:1** | ✅ Passa | ❌ Falha |
| Links dentro de painéis | `#FF4FA3` `primaria` | `#1B1030` `superficie` | **5,93:1** | ✅ Passa | ❌ Falha |
| Texto do botão principal | `#0C0818` `sobre-primaria` | `#FF4FA3` `primaria` | **6,49:1** | ✅ Passa | ❌ Falha |
| Destaques em laranja | `#FF8A3D` `secundaria` | `#120B22` `fundo` | **8,17:1** | ✅ Passa | ✅ Passa |
| Detalhes em ciano | `#5EE7FF` `acento` | `#120B22` `fundo` | **13,09:1** | ✅ Passa | ✅ Passa |
| Mensagens de erro do formulário | `#FF9B9B` `erro` | `#1B1030` `superficie` | **8,95:1** | ✅ Passa | ✅ Passa |
| Mensagens de sucesso | `#6EE7B0` `sucesso` | `#1B1030` `superficie` | **11,79:1** | ✅ Passa | ✅ Passa |
| Borda dos campos de formulário *(UI, 3:1)* | `#8F7CC0` `borda-campo` | `#1B1030` `superficie` | **5,00:1** | ✅ Passa | — |
| Borda dos botões de contorno *(UI, 3:1)* | `#8F7CC0` `borda-campo` | `#120B22` `fundo` | **5,30:1** | ✅ Passa | — |
| Contorno de foco sobre o fundo *(UI, 3:1)* | `#FFE8A3` `foco` | `#120B22` `fundo` | **15,80:1** | ✅ Passa | — |
| Contorno de foco sobre painéis *(UI, 3:1)* | `#FFE8A3` `foco` | `#1B1030` `superficie` | **14,89:1** | ✅ Passa | — |

## Modo claro

| Uso | Cor da frente | Cor de fundo | Razão | AA | AAA |
|---|---|---|---|---|---|
| Texto do corpo sobre o fundo da página | `#1B1030` `texto` | `#FBF4EA` `fundo` | **16,53:1** | ✅ Passa | ✅ Passa |
| Texto nas faixas alternadas | `#1B1030` `texto` | `#F8E6D8` `fundo-2` | **14,87:1** | ✅ Passa | ✅ Passa |
| Texto em painéis, campos e modais | `#1B1030` `texto` | `#FFFFFF` `superficie` | **18,05:1** | ✅ Passa | ✅ Passa |
| Texto em painéis destacados | `#1B1030` `texto` | `#F3E8DA` `superficie-2` | **14,93:1** | ✅ Passa | ✅ Passa |
| Texto secundário (legendas, datas) | `#4A3D63` `texto-suave` | `#FBF4EA` `fundo` | **8,99:1** | ✅ Passa | ✅ Passa |
| Texto secundário em painéis | `#4A3D63` `texto-suave` | `#FFFFFF` `superficie` | **9,82:1** | ✅ Passa | ✅ Passa |
| Sobretítulos e datas da linha do tempo | `#A3410B` `destaque` | `#FBF4EA` `fundo` | **5,80:1** | ✅ Passa | ❌ Falha |
| Rótulos do painel de acessibilidade | `#A3410B` `destaque` | `#FFFFFF` `superficie` | **6,33:1** | ✅ Passa | ❌ Falha |
| Links e títulos de seção em rosa | `#B3135F` `primaria` | `#FBF4EA` `fundo` | **6,06:1** | ✅ Passa | ❌ Falha |
| Links dentro de painéis | `#B3135F` `primaria` | `#FFFFFF` `superficie` | **6,61:1** | ✅ Passa | ❌ Falha |
| Texto do botão principal | `#FFFFFF` `sobre-primaria` | `#B3135F` `primaria` | **6,61:1** | ✅ Passa | ❌ Falha |
| Destaques em laranja | `#A3410B` `secundaria` | `#FBF4EA` `fundo` | **5,80:1** | ✅ Passa | ❌ Falha |
| Detalhes em ciano | `#0B6577` `acento` | `#FBF4EA` `fundo` | **6,12:1** | ✅ Passa | ❌ Falha |
| Mensagens de erro do formulário | `#B42318` `erro` | `#FFFFFF` `superficie` | **6,57:1** | ✅ Passa | ❌ Falha |
| Mensagens de sucesso | `#146C43` `sucesso` | `#FFFFFF` `superficie` | **6,45:1** | ✅ Passa | ❌ Falha |
| Borda dos campos de formulário *(UI, 3:1)* | `#7D6F8F` `borda-campo` | `#FFFFFF` `superficie` | **4,62:1** | ✅ Passa | — |
| Borda dos botões de contorno *(UI, 3:1)* | `#7D6F8F` `borda-campo` | `#FBF4EA` `fundo` | **4,23:1** | ✅ Passa | — |
| Contorno de foco sobre o fundo *(UI, 3:1)* | `#5B2BC4` `foco` | `#FBF4EA` `fundo` | **7,43:1** | ✅ Passa | — |
| Contorno de foco sobre painéis *(UI, 3:1)* | `#5B2BC4` `foco` | `#FFFFFF` `superficie` | **8,12:1** | ✅ Passa | — |

## Modo alto contraste

| Uso | Cor da frente | Cor de fundo | Razão | AA | AAA |
|---|---|---|---|---|---|
| Texto do corpo sobre o fundo da página | `#FFFFFF` `texto` | `#000000` `fundo` | **21,00:1** | ✅ Passa | ✅ Passa |
| Texto nas faixas alternadas | `#FFFFFF` `texto` | `#000000` `fundo-2` | **21,00:1** | ✅ Passa | ✅ Passa |
| Texto em painéis, campos e modais | `#FFFFFF` `texto` | `#000000` `superficie` | **21,00:1** | ✅ Passa | ✅ Passa |
| Texto em painéis destacados | `#FFFFFF` `texto` | `#000000` `superficie-2` | **21,00:1** | ✅ Passa | ✅ Passa |
| Texto secundário (legendas, datas) | `#FFFFFF` `texto-suave` | `#000000` `fundo` | **21,00:1** | ✅ Passa | ✅ Passa |
| Texto secundário em painéis | `#FFFFFF` `texto-suave` | `#000000` `superficie` | **21,00:1** | ✅ Passa | ✅ Passa |
| Sobretítulos e datas da linha do tempo | `#FFFF00` `destaque` | `#000000` `fundo` | **19,56:1** | ✅ Passa | ✅ Passa |
| Rótulos do painel de acessibilidade | `#FFFF00` `destaque` | `#000000` `superficie` | **19,56:1** | ✅ Passa | ✅ Passa |
| Links e títulos de seção em rosa | `#FFFF00` `primaria` | `#000000` `fundo` | **19,56:1** | ✅ Passa | ✅ Passa |
| Links dentro de painéis | `#FFFF00` `primaria` | `#000000` `superficie` | **19,56:1** | ✅ Passa | ✅ Passa |
| Texto do botão principal | `#000000` `sobre-primaria` | `#FFFF00` `primaria` | **19,56:1** | ✅ Passa | ✅ Passa |
| Destaques em laranja | `#FFFF00` `secundaria` | `#000000` `fundo` | **19,56:1** | ✅ Passa | ✅ Passa |
| Detalhes em ciano | `#00FFFF` `acento` | `#000000` `fundo` | **16,75:1** | ✅ Passa | ✅ Passa |
| Mensagens de erro do formulário | `#FF8080` `erro` | `#000000` `superficie` | **8,65:1** | ✅ Passa | ✅ Passa |
| Mensagens de sucesso | `#7CFF7C` `sucesso` | `#000000` `superficie` | **16,45:1** | ✅ Passa | ✅ Passa |
| Borda dos campos de formulário *(UI, 3:1)* | `#FFFFFF` `borda-campo` | `#000000` `superficie` | **21,00:1** | ✅ Passa | — |
| Borda dos botões de contorno *(UI, 3:1)* | `#FFFFFF` `borda-campo` | `#000000` `fundo` | **21,00:1** | ✅ Passa | — |
| Contorno de foco sobre o fundo *(UI, 3:1)* | `#FFFF00` `foco` | `#000000` `fundo` | **19,56:1** | ✅ Passa | — |
| Contorno de foco sobre painéis *(UI, 3:1)* | `#FFFF00` `foco` | `#000000` `superficie` | **19,56:1** | ✅ Passa | — |

## Cores fixas das cenas com foto

A página inicial, o topo das páginas internas, os cards do catálogo e o rodapé ficam escuros em qualquer tema. O texto fica sempre sobre um véu escuro (degradê de #0C0818 com 55% a 96% de opacidade) por cima da foto; a tabela mede contra o fundo do véu e contra o caso mais claro.

| Uso | Cor da frente | Cor de fundo | Razão | AA |
|---|---|---|---|---|
| Texto claro nas cenas, nos cards do catálogo e no rodapé | `#F4EEFC` | `#0C0818` | **17,38:1** | ✅ Passa |
| Resumo dos cards e textos secundários das cenas | `#C9BDDF` | `#0C0818` | **11,12:1** | ✅ Passa |
| Título rosa da cena de vídeo | `#FF4FA3` | `#0C0818` | **6,49:1** | ✅ Passa |
| Citação gigante, rótulos e item ativo do menu | `#FFE8A3` | `#0C0818` | **16,29:1** | ✅ Passa |
| Rótulo 'Personagem' nos cards | `#FF8CC4` | `#0C0818` | **9,21:1** | ✅ Passa |
| Rótulo 'Veículo' nos cards | `#FFB27D` | `#0C0818` | **11,20:1** | ✅ Passa |
| Rótulo 'Região' nos cards | `#8EEEFF` | `#0C0818` | **14,88:1** | ✅ Passa |
| Texto do botão em degradê (ponto rosa, o pior caso) | `#0C0818` | `#FF4FA3` | **6,49:1** | ✅ Passa |
| Faixa do topo (ponto laranja) | `#0C0818` | `#FF8A3D` | **8,42:1** | ✅ Passa |
| Botão 'pular para o conteúdo' | `#0C0818` | `#FFE8A3` | **16,29:1** | ✅ Passa |
| Marcadores das regiões no mapa | `#FFFFFF` | `#120B22` | **19,15:1** | ✅ Passa |
| Texto sobre o véu mais claro das cenas (véu de 85% sobre foto clara) | `#F4EEFC` | `#2D2440` | **12,85:1** | ✅ Passa |

## Tema claro: títulos grandes sobre o céu da abertura

Títulos com mais de 24px; o limite é o de texto grande (3:1).

| Uso | Cor da frente | Cor de fundo | Razão | AA (texto grande) |
|---|---|---|---|---|
| Degradê dos títulos (rosa) sobre o céu claro do topo | `#B3135F` | `#FFF6E6` | **6,17:1** | ✅ Passa |
| Degradê dos títulos (rosa) sobre a parte rosa do sol | `#B3135F` | `#FF9EC4` | **3,45:1** | ✅ Passa |
| Degradê dos títulos (laranja) sobre a parte rosa do sol | `#9A3412` | `#FF9EC4` | **3,81:1** | ✅ Passa |
| Degradê dos títulos (laranja) sobre a parte laranja do sol | `#9A3412` | `#FFC39A` | **4,71:1** | ✅ Passa |
| Degradê dos títulos (marrom) sobre o rosa do horizonte | `#8C3A0A` | `#FFC9D6` | **5,35:1** | ✅ Passa |
| Título "Guia Leonida" sobre o sol | `#1B1030` | `#FF9EC4` | **9,40:1** | ✅ Passa |

## Antes e depois: cores que falharam e foram corrigidas

| Caso | Antes | Razão antes | Depois | Razão depois | Fundo |
|---|---|---|---|---|---|
| Rosa da paleta nova no modo claro | `#FF4FA3` | 2,79:1 ❌ Falha | `#B3135F` | 6,06:1 ✅ Passa | `#FBF4EA` |
| Laranja do pôr do sol como texto no modo claro | `#FF8A3D` | 2,15:1 ❌ Falha | `#A3410B` | 5,80:1 ✅ Passa | `#FBF4EA` |
| Laranja do degradê dos títulos no tema claro | `#C2410C` | 2,70:1 ❌ Falha | `#9A3412` | 3,81:1 ✅ Passa | `#FF9EC4` |
| Ciano de detalhe no modo claro | `#5EE7FF` | 1,46:1 ❌ Falha | `#0B6577` | 6,68:1 ✅ Passa | `#FFFFFF` |

- **Rosa da paleta nova no modo claro:** O rosa #FF4FA3 é a cor principal do redesign e passa com folga no escuro (6,29:1), mas sobre a areia do modo claro fica perto de 2,8:1. No claro, links e botões usam um rosa framboesa do mesmo matiz.
- **Laranja do pôr do sol como texto no modo claro:** O laranja #FF8A3D só aparece em degradês e brilhos. Quando vira texto no modo claro (sobretítulos), usa o laranja queimado #A3410B.
- **Laranja do degradê dos títulos no tema claro:** No tema claro, os títulos em degradê passam por cima do sol listrado da abertura. O laranja #C2410C ficava abaixo de 3:1 sobre a parte rosa do sol (limite de texto grande); o ponto do meio do degradê virou #9A3412. Aqui o limite é o de texto grande.
- **Ciano de detalhe no modo claro:** O ciano é só detalhe no escuro. No branco ele quase desaparece, então o modo claro usa um azul-petróleo do mesmo matiz.

## Resultado

**Todos os pares usados no site passam no nível AA da WCAG 2.2.**
