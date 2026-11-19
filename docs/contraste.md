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
| Texto do corpo sobre o fundo da página | `#F5F0FF` `texto` | `#0E0A1F` `fundo` | **17,37:1** | ✅ Passa | ✅ Passa |
| Texto dentro dos cards | `#F5F0FF` `texto` | `#1A1433` `superficie` | **15,77:1** | ✅ Passa | ✅ Passa |
| Texto em painéis destacados | `#F5F0FF` `texto` | `#251C47` `superficie-2` | **14,07:1** | ✅ Passa | ✅ Passa |
| Texto secundário (legendas, datas) | `#C9BEE8` `texto-suave` | `#0E0A1F` `fundo` | **11,10:1** | ✅ Passa | ✅ Passa |
| Descrição dos cards | `#C9BEE8` `texto-suave` | `#1A1433` `superficie` | **10,08:1** | ✅ Passa | ✅ Passa |
| Links e títulos em rosa | `#FF6BB0` `primaria` | `#0E0A1F` `fundo` | **7,38:1** | ✅ Passa | ✅ Passa |
| Links dentro dos cards | `#FF6BB0` `primaria` | `#1A1433` `superficie` | **6,70:1** | ✅ Passa | ❌ Falha |
| Texto do botão principal | `#1A0612` `sobre-primaria` | `#FF6BB0` `primaria` | **7,40:1** | ✅ Passa | ✅ Passa |
| Destaques em laranja (selos, números) | `#FF9F5A` `secundaria` | `#0E0A1F` `fundo` | **9,57:1** | ✅ Passa | ✅ Passa |
| Selos laranja nos cards | `#FF9F5A` `secundaria` | `#1A1433` `superficie` | **8,69:1** | ✅ Passa | ✅ Passa |
| Links em ciano / ícones | `#3FD8F0` `acento` | `#0E0A1F` `fundo` | **11,36:1** | ✅ Passa | ✅ Passa |
| Ícones ciano nos cards | `#3FD8F0` `acento` | `#1A1433` `superficie` | **10,31:1** | ✅ Passa | ✅ Passa |
| Rótulos de categoria em roxo | `#B9A2FF` `roxo` | `#1A1433` `superficie` | **8,12:1** | ✅ Passa | ✅ Passa |
| Mensagens de erro do formulário | `#FF8F8F` `erro` | `#1A1433` `superficie` | **8,04:1** | ✅ Passa | ✅ Passa |
| Mensagens de sucesso | `#5BE3A0` `sucesso` | `#1A1433` `superficie` | **10,86:1** | ✅ Passa | ✅ Passa |
| Borda dos campos de formulário *(UI, 3:1)* | `#8B7BC4` `borda-campo` | `#1A1433` `superficie` | **4,81:1** | ✅ Passa | — |
| Contorno de foco sobre o fundo *(UI, 3:1)* | `#3FD8F0` `foco` | `#0E0A1F` `fundo` | **11,36:1** | ✅ Passa | — |
| Contorno de foco sobre os cards *(UI, 3:1)* | `#3FD8F0` `foco` | `#1A1433` `superficie` | **10,31:1** | ✅ Passa | — |

## Modo claro

| Uso | Cor da frente | Cor de fundo | Razão | AA | AAA |
|---|---|---|---|---|---|
| Texto do corpo sobre o fundo da página | `#1C1230` `texto` | `#FFF8F2` `fundo` | **16,94:1** | ✅ Passa | ✅ Passa |
| Texto dentro dos cards | `#1C1230` `texto` | `#FFFFFF` `superficie` | **17,82:1** | ✅ Passa | ✅ Passa |
| Texto em painéis destacados | `#1C1230` `texto` | `#F5EDFF` `superficie-2` | **15,65:1** | ✅ Passa | ✅ Passa |
| Texto secundário (legendas, datas) | `#4F4566` `texto-suave` | `#FFF8F2` `fundo` | **8,40:1** | ✅ Passa | ✅ Passa |
| Descrição dos cards | `#4F4566` `texto-suave` | `#FFFFFF` `superficie` | **8,84:1** | ✅ Passa | ✅ Passa |
| Links e títulos em rosa | `#B8175E` `primaria` | `#FFF8F2` `fundo` | **6,01:1** | ✅ Passa | ❌ Falha |
| Links dentro dos cards | `#B8175E` `primaria` | `#FFFFFF` `superficie` | **6,32:1** | ✅ Passa | ❌ Falha |
| Texto do botão principal | `#FFFFFF` `sobre-primaria` | `#B8175E` `primaria` | **6,32:1** | ✅ Passa | ❌ Falha |
| Destaques em laranja (selos, números) | `#A3410B` `secundaria` | `#FFF8F2` `fundo` | **6,02:1** | ✅ Passa | ❌ Falha |
| Selos laranja nos cards | `#A3410B` `secundaria` | `#FFFFFF` `superficie` | **6,33:1** | ✅ Passa | ❌ Falha |
| Links em ciano / ícones | `#0B6577` `acento` | `#FFF8F2` `fundo` | **6,35:1** | ✅ Passa | ❌ Falha |
| Ícones ciano nos cards | `#0B6577` `acento` | `#FFFFFF` `superficie` | **6,68:1** | ✅ Passa | ❌ Falha |
| Rótulos de categoria em roxo | `#5B2BC4` `roxo` | `#FFFFFF` `superficie` | **8,12:1** | ✅ Passa | ✅ Passa |
| Mensagens de erro do formulário | `#B42318` `erro` | `#FFFFFF` `superficie` | **6,57:1** | ✅ Passa | ❌ Falha |
| Mensagens de sucesso | `#146C43` `sucesso` | `#FFFFFF` `superficie` | **6,45:1** | ✅ Passa | ❌ Falha |
| Borda dos campos de formulário *(UI, 3:1)* | `#7E7398` `borda-campo` | `#FFFFFF` `superficie` | **4,38:1** | ✅ Passa | — |
| Contorno de foco sobre o fundo *(UI, 3:1)* | `#5B2BC4` `foco` | `#FFF8F2` `fundo` | **7,71:1** | ✅ Passa | — |
| Contorno de foco sobre os cards *(UI, 3:1)* | `#5B2BC4` `foco` | `#FFFFFF` `superficie` | **8,12:1** | ✅ Passa | — |

## Modo alto contraste

| Uso | Cor da frente | Cor de fundo | Razão | AA | AAA |
|---|---|---|---|---|---|
| Texto do corpo sobre o fundo da página | `#FFFFFF` `texto` | `#000000` `fundo` | **21,00:1** | ✅ Passa | ✅ Passa |
| Texto dentro dos cards | `#FFFFFF` `texto` | `#000000` `superficie` | **21,00:1** | ✅ Passa | ✅ Passa |
| Texto em painéis destacados | `#FFFFFF` `texto` | `#000000` `superficie-2` | **21,00:1** | ✅ Passa | ✅ Passa |
| Texto secundário (legendas, datas) | `#FFFFFF` `texto-suave` | `#000000` `fundo` | **21,00:1** | ✅ Passa | ✅ Passa |
| Descrição dos cards | `#FFFFFF` `texto-suave` | `#000000` `superficie` | **21,00:1** | ✅ Passa | ✅ Passa |
| Links e títulos em rosa | `#FFFF00` `primaria` | `#000000` `fundo` | **19,56:1** | ✅ Passa | ✅ Passa |
| Links dentro dos cards | `#FFFF00` `primaria` | `#000000` `superficie` | **19,56:1** | ✅ Passa | ✅ Passa |
| Texto do botão principal | `#000000` `sobre-primaria` | `#FFFF00` `primaria` | **19,56:1** | ✅ Passa | ✅ Passa |
| Destaques em laranja (selos, números) | `#FFFF00` `secundaria` | `#000000` `fundo` | **19,56:1** | ✅ Passa | ✅ Passa |
| Selos laranja nos cards | `#FFFF00` `secundaria` | `#000000` `superficie` | **19,56:1** | ✅ Passa | ✅ Passa |
| Links em ciano / ícones | `#00FFFF` `acento` | `#000000` `fundo` | **16,75:1** | ✅ Passa | ✅ Passa |
| Ícones ciano nos cards | `#00FFFF` `acento` | `#000000` `superficie` | **16,75:1** | ✅ Passa | ✅ Passa |
| Rótulos de categoria em roxo | `#FFFFFF` `roxo` | `#000000` `superficie` | **21,00:1** | ✅ Passa | ✅ Passa |
| Mensagens de erro do formulário | `#FF8080` `erro` | `#000000` `superficie` | **8,65:1** | ✅ Passa | ✅ Passa |
| Mensagens de sucesso | `#7CFF7C` `sucesso` | `#000000` `superficie` | **16,45:1** | ✅ Passa | ✅ Passa |
| Borda dos campos de formulário *(UI, 3:1)* | `#FFFFFF` `borda-campo` | `#000000` `superficie` | **21,00:1** | ✅ Passa | — |
| Contorno de foco sobre o fundo *(UI, 3:1)* | `#FFFF00` `foco` | `#000000` `fundo` | **19,56:1** | ✅ Passa | — |
| Contorno de foco sobre os cards *(UI, 3:1)* | `#FFFF00` `foco` | `#000000` `superficie` | **19,56:1** | ✅ Passa | — |

## Antes e depois: cores que falharam e foram corrigidas

| Caso | Antes | Razão antes | Depois | Razão depois | Fundo |
|---|---|---|---|---|---|
| Rosa neon do botão principal no modo claro | `#FF2D95` | 3,29:1 ❌ Falha | `#B8175E` | 6,01:1 ✅ Passa | `#FFF8F2` |
| Ciano dos links no modo claro | `#22D3EE` | 1,81:1 ❌ Falha | `#0B6577` | 6,68:1 ✅ Passa | `#FFFFFF` |
| Roxo dos rótulos de categoria no modo escuro | `#7C3AED` | 3,09:1 ❌ Falha | `#B9A2FF` | 8,12:1 ✅ Passa | `#1A1433` |

- **Rosa neon do botão principal no modo claro:** O rosa neon original (#FF2D95) é a cor mais 'Vice City' da paleta, mas sobre o fundo areia ele não chega nem a 4,5:1. Escurecemos o rosa mantendo o matiz (framboesa) até passar no AA com folga.
- **Ciano dos links no modo claro:** O ciano neon é ótimo no modo escuro, mas no branco quase desaparece (cerca de 1,8:1). No modo claro usamos um azul-petróleo do mesmo matiz.
- **Roxo dos rótulos de categoria no modo escuro:** O roxo saturado (#7C3AED) combina com a noite de Vice City, mas sobre o card escuro fica abaixo de 3:1. Clareamos para um lilás que mantém o tom e passa até no AAA.

## Resultado

**Todos os pares usados no site passam no nível AA da WCAG 2.2.**
