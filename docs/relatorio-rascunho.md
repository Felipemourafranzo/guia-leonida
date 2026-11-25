# Projeto Final: Guia Leonida (rascunho do relatório)

**Desenvolvimento de Interfaces 2/2026**. Prof. Dr. Felipe Batista da Silva

- **Nome:** Felipe Moura Franzo
- **RA:** [RA]
- **Site:** Guia Leonida, guia de fã não oficial de GTA VI
- **Repositório:** [URL DO REPOSITÓRIO NO GITHUB]
- **Site publicado:** [URL DO GITHUB PAGES]

> Este é um **rascunho** para montar o Word/PDF, atualizado em 25/11/2026 para o redesign "trailer de
> rolagem" (depois do lançamento do jogo). Revise o texto e ajuste tudo à sua voz. Os trechos entre
> colchetes são para você preencher. A **Parte C (redação) não foi escrita**, porque o enunciado exige
> que ela seja feita sem IA: aqui há só os tópicos e exemplos do site que você pode citar.

---

## Parte A: Paletas de cores e WCAG

### A.1 Paletas definidas

A identidade visual parte do **pôr do sol de Vice City** e da linguagem do site oficial de GTA VI (sem
copiá-lo): uma noite roxa, um degradê de pôr do sol (rosa → laranja → creme) e neon usado com moderação.
A paleta é um conjunto de *tokens* CSS (custom properties) em `css/themes.css`, com três versões: **escuro**
(padrão, "noite em Leonida"), **claro** ("Vice City de dia") e **alto contraste**.

**Cores da marca (degradês, brilhos e faixas):**

| Token | Hex | Uso |
|---|---|---|
| `--noite-1` → `--noite-2` | `#120B22` → `#1B1030` | Base roxo-noite do site |
| `--rosa` | `#FF4FA3` | Ação, títulos de seção, brilho do botão principal |
| `--laranja` | `#FF8A3D` | Meio do degradê de pôr do sol |
| `--creme` | `#FFE8A3` | Citações, rótulos, item ativo do menu, foco |
| `--ciano` | `#5EE7FF` | Só detalhe (ícones de status) |
| `--degrade-sol` | rosa → laranja → creme | Frase da abertura, botão principal, faixa do topo |

**Paleta de interface (texto e fundo):**

| Token | Escuro | Claro | Alto contraste | Função |
|---|---|---|---|---|
| `--cor-fundo` | `#120B22` | `#FBF4EA` | `#000000` | Fundo da página |
| `--cor-fundo-2` | `#1B1030` | `#F8E6D8` | `#000000` | Faixas alternadas (pêssego no claro) |
| `--cor-superficie` | `#1B1030` | `#FFFFFF` | `#000000` | Painéis, campos, modais |
| `--cor-texto` | `#F4EEFC` | `#1B1030` | `#FFFFFF` | Texto principal |
| `--cor-texto-suave` | `#C9BDDF` | `#4A3D63` | `#FFFFFF` | Texto secundário |
| `--cor-destaque` | `#FFE8A3` | `#A3410B` | `#FFFF00` | Sobretítulos, datas, rótulos |
| `--cor-primaria` (rosa) | `#FF4FA3` | `#B3135F` | `#FFFF00` | Links, botões, títulos de seção |
| `--cor-secundaria` (laranja) | `#FF8A3D` | `#A3410B` | `#FFFF00` | Destaques |
| `--cor-acento` (ciano) | `#5EE7FF` | `#0B6577` | `#00FFFF` | Detalhes |
| `--cor-borda-campo` | `#8F7CC0` | `#7D6F8F` | `#FFFFFF` | Borda de campos (3:1) |
| `--cor-foco` | `#FFE8A3` | `#5B2BC4` | `#FFFF00` | Contorno de foco |
| `--cor-erro` | `#FF9B9B` | `#B42318` | `#FF8080` | Mensagens de erro |
| `--cor-sucesso` | `#6EE7B0` | `#146C43` | `#7CFF7C` | Mensagens de sucesso |
| `--degrade-texto` | rosa → laranja → creme | `#B3135F` → `#9A3412` → `#8C3A0A` | amarelo | Títulos grandes em degradê |

As **cenas com foto** (vídeo de Jason e Lucia, tour das regiões, citação, galeria, topo das páginas
internas e o rodapé) ficam escuras nos três temas: o texto sempre fica sobre um véu escuro por cima da foto.

### A.2 Análise de contraste (WCAG 2.2)

A razão de contraste é **calculada** por um script próprio (`tools/contraste.py`) com a fórmula da WCAG:
luminância relativa de cada cor e razão `(L1 + 0,05) / (L2 + 0,05)`. A tabela completa está em
`docs/contraste.md`: 19 pares × 3 temas, mais 12 pares das cenas com foto e 6 títulos grandes do tema
claro. Resumo:

| Par (escuro) | Razão | AA | AAA |
|---|---|---|---|
| Texto `#F4EEFC` sobre fundo `#120B22` | 16,85:1 | ✅ | ✅ |
| Texto suave `#C9BDDF` sobre painel `#1B1030` | 10,17:1 | ✅ | ✅ |
| Rosa `#FF4FA3` sobre fundo `#120B22` | 6,29:1 | ✅ | ❌ |
| Texto do botão `#0C0818` sobre rosa `#FF4FA3` | 6,49:1 | ✅ | ❌ |
| Borda de campo `#8F7CC0` sobre painel (UI) | 5,00:1 | ✅ | — |

| Par (claro) | Razão | AA | AAA |
|---|---|---|---|
| Texto `#1B1030` sobre fundo `#FBF4EA` | 16,53:1 | ✅ | ✅ |
| Rosa `#B3135F` sobre fundo `#FBF4EA` | 6,06:1 | ✅ | ❌ |
| Branco sobre botão rosa `#B3135F` | 6,61:1 | ✅ | ❌ |
| Laranja `#A3410B` sobre fundo `#FBF4EA` | 5,80:1 | ✅ | ❌ |
| Borda de campo `#7D6F8F` sobre fundo (UI) | 4,23:1 | ✅ | — |

| Cenas com foto (iguais em todos os temas) | Razão | AA |
|---|---|---|
| Texto claro `#F4EEFC` sobre o véu `#0C0818` | 17,38:1 | ✅ |
| Título rosa `#FF4FA3` da cena de vídeo sobre o véu | 6,49:1 | ✅ |
| Citação creme `#FFE8A3` sobre o véu | 16,29:1 | ✅ |
| Texto do botão em degradê sobre o ponto rosa (pior caso) | 6,49:1 | ✅ |

**Resultado: nenhum par usado no site fica abaixo do AA**, nos três temas e nas cenas com foto. O alto
contraste chega a 21:1 (branco sobre preto) e 19,56:1 (amarelo sobre preto).

**Antes e depois (cores que falharam e foram corrigidas):**

| Caso | Antes | Depois |
|---|---|---|
| Rosa principal no tema claro (sobre `#FBF4EA`) | `#FF4FA3`: 2,79:1 ❌ | `#B3135F`: 6,06:1 ✅ |
| Laranja como texto no tema claro (sobre `#FBF4EA`) | `#FF8A3D`: 2,15:1 ❌ | `#A3410B`: 5,80:1 ✅ |
| Laranja do degradê dos títulos grandes, tema claro (sobre o sol, `#FF9EC4`) | `#C2410C`: 2,70:1 ❌ | `#9A3412`: 3,81:1 ✅ (texto grande) |
| Ciano no tema claro (sobre `#FFFFFF`) | `#5EE7FF`: 1,46:1 ❌ | `#0B6577`: 6,68:1 ✅ |

O caso mais útil para o relatório é o primeiro: o rosa `#FF4FA3` é a cor que mais "parece" Vice City e
passa com folga no escuro, mas sobre a areia do tema claro não chega a 3:1. A solução foi manter o
**matiz** e escurecer a cor até passar, separando a "cor da marca" da "cor de texto". O terceiro caso só
apareceu no redesign: no tema claro, os títulos em degradê passam por cima do sol listrado da abertura,
e o ponto laranja do degradê precisou escurecer.

**Como verificar:** rode `python3 tools/contraste.py` ou confira os pares em
<https://webaim.org/resources/contrastchecker/>.

### A.3 Psicologia das cores aplicada ao site

| Cor | Associações | Onde e por que usamos |
|---|---|---|
| **Roxo-noite** | Noite, mistério, cinema, luxo | Fundo do tema escuro: dá o clima de **trailer** e faz as fotos brilharem |
| **Rosa / magenta** | Energia, ousadia, vida noturna | Botão principal, links e títulos de seção: é a cor da **ação** |
| **Laranja** | Calor, sol, entusiasmo | Meio do degradê de pôr do sol e sobretítulos no claro: **atenção** sem alarmar |
| **Creme** | Luz de fim de tarde, neon antigo | Citações, rótulos, item ativo do menu e foco: **orientação** discreta |
| **Ciano** | Mar, tecnologia, frescor | Só detalhe (ícone de status "com fonte") |
| **Areia e pêssego** | Praia, dia, leveza | Tema claro "Vice City de dia": cansa menos que o branco puro |
| **Verde e vermelho** | Convenções de sucesso e erro | Mensagens de formulário, sempre com ícone e texto |
| **Preto, branco e amarelo** | Máxima legibilidade | Alto contraste |

### A.4 Texto: a escolha das cores e suas implicações

As cores do Guia Leonida vêm do pôr do sol de Miami, que inspira a Vice City de GTA VI, e da linguagem
do site oficial do jogo: fundo roxo-noite, degradê de pôr do sol e neon aplicado só onde importa. Isso é
**branding**: o fã reconhece o clima do jogo antes de ler qualquer texto, sem que o site copie a marca da
Rockstar (o guia tem marca própria, um sol cortado por faixas).

A primeira implicação é o **contraste**. Cores vibrantes sobre fundo claro falham: o rosa `#FF4FA3`
sobre a areia do tema claro fica em 2,79:1 e o ciano em 1,46:1, abaixo dos 4,5:1 da WCAG. Por isso a paleta
separa **cores de marca** (degradês, brilhos, faixas) de **cores de texto**, que são versões do mesmo matiz
calculadas por script até passarem no AA. No escuro o rosa e o laranja funcionam puros; no claro o rosa
vira framboesa, o laranja vira laranja queimado e o degradê dos títulos usa tons escuros do pôr do sol.

A segunda é o **excesso de neon**. Brilho em tudo cansa e tira a hierarquia. O redesign limita o
`text-shadow`/`box-shadow` aos títulos de seção, ao item ativo do menu, ao botão principal e à citação.

A terceira é a **foto**. Como as imagens oficiais variam muito de luz, todo texto sobre foto fica sobre
um véu escuro (degradê de `#0C0818`), e as cenas com foto são escuras nos três temas. Assim o contraste
não depende de qual captura aparece.

Também foi preciso garantir que **nenhuma informação dependa só da cor** (critério 1.4.1): cada categoria
do catálogo tem nome escrito, a aba selecionada fica preenchida, os erros têm ícone e texto, o favorito
troca o coração vazio pelo cheio e a página atual do menu tem um traço embaixo.

Por fim, o site oferece três temas e respeita as preferências do sistema (`prefers-color-scheme` no modo
"Sistema" e `prefers-reduced-motion`). Não existe uma paleta ideal para todo mundo; dar o controle ao
usuário faz parte do bom design de cores.

---

## Parte B: Design do site

### B.1 O que é o site e para que serve

O **Guia Leonida** é um guia de fã não oficial de *Grand Theft Auto VI*, lançado em 19/11/2026 para
PlayStation 5 e Xbox Series X|S. Ele serve para quem acabou de começar a jogar conhecer o estado de
**Leonida**, suas **seis regiões**, os **personagens**, os **veículos** e **dicas para iniciantes**.

A página inicial funciona como um **"trailer de rolagem"**, na linha do site oficial: cada bloco é uma
cena que avança conforme a pessoa rola a página. Todas as imagens são oficiais, do kit de mídia da
Rockstar, com crédito.

O diferencial continua sendo a **honestidade com as fontes**: cada item tem a fonte, e o que a Rockstar
ainda não divulgou (o modelo de alguns veículos, a versão para PC e o modo online) aparece com a **data da
última checagem**, em vez de boato.

### B.2 Como o usuário se mantém engajado

| Recurso | Como funciona | Por que engaja |
|---|---|---|
| **Cenas de rolagem** | Abertura com o logo, cenas de vídeo de Jason e Lucia, tour das 6 regiões, mapa que se afasta de Vice City | A curiosidade de "ver a próxima cena" puxa a leitura, como um trailer |
| **Favoritos** | Coração em cada card, salvo por usuário; lista "Meus favoritos" e filtro no guia | O usuário monta a própria coleção e tem motivo para criar conta e voltar |
| **Checklist de progresso** | 18 tarefas em 4 grupos com barra de porcentagem salva por conta | Gamificação: dá vontade de "fechar os 100%", como no próprio jogo |
| **Já disponível** | Contador de dias desde o lançamento e links oficiais | Situa o usuário no tempo e leva às fontes |
| **Novidades** | Linha do tempo até 23/11/2026; o que saiu depois da última visita ganha o selo "Novo" | Motivo para voltar |
| **Mapa explorável** | Pôster oficial com zoom e cartões-postais das regiões | Exploração, como abrir o mapa no jogo |
| **Busca compartilhável** | A URL acompanha a busca (`guia.html?q=barco&cat=veiculos`) | Dá para mandar um resultado para alguém |

### B.3 Recursos e elementos do site

**Faixa e cabeçalho (todas as páginas):** faixa fina "GTA VI já disponível" com palmeiras; cabeçalho mínimo,
transparente sobre a foto do topo e sólido ao rolar; marca própria; menu com a página atual marcada (cor,
brilho e traço); botões de tema e de acessibilidade; no celular, menu em tela cheia.

**Rodapé (todas as páginas):** escuro, com uma fileira de palmeiras e a linha do horizonte em degradê (no
tema claro, contra um céu de fim de tarde); navegação, canais oficiais, acessibilidade, **aviso legal** e
créditos (© Rockstar Games nas imagens).

**Página inicial (`index.html`), em cenas:**
1. *Abertura:* a marca aparece; depois o logo de GTA VI (recortado da arte oficial) e a frase "Seis regiões,
   dois fugitivos e um estado inteiro para explorar." acendendo palavra por palavra.
2. *Hero em camadas:* arte oficial de Jason e Lucia andando mais devagar que as palmeiras da frente, com a
   busca rápida.
3. *Já disponível:* dias desde o lançamento, links oficiais e o status de PC e modo online.
4. *Cenas de vídeo de Lucia e de Jason:* quadros dos videoclipes oficiais desenhados num `<canvas>` que
   avança conforme a rolagem.
5. *Tour pelas 6 regiões:* cada região em tela cheia com zoom lento (Ken Burns), troca suave e "Ver no mapa".
6. *Jason e Lucia:* bloco editorial com fotos em paralaxe que ampliam numa janela (lightbox acessível) e uma
   citação gigante sobre foto.
7. *Destaques do catálogo:* faixa que anda de lado enquanto a página desce, com botões para teclado.
8. *Galeria:* carrossel acessível (pausar, setas, indicadores, teclado).
9. *Linha do tempo e checklist.*

**Guia (`guia.html`):** busca em tempo real (sem diferenciar acentos), abas por categoria com contador,
filtro de favoritos, estado "nenhum resultado" com botão de limpar e **cards com foto grande e texto por
cima**. "Ver detalhes" abre uma janela com a descrição, a fonte e, nos coadjuvantes, a ilustração oficial.

**Mapa (`mapa.html`):** cena de rolagem em que o **pôster oficial** começa aproximado em Vice City e se
afasta até o estado inteiro, com as 6 regiões acendendo; depois o mapa interativo com zoom (roda, pinça,
botões e teclado), marcadores numerados, lista das regiões com miniatura e o **cartão-postal oficial** de
cada uma; e a tabela das regiões como alternativa em texto.

**Checklist, Contato, Login e Acessibilidade:** mesmo funcionamento de antes (progresso por conta,
formulário com validação acessível e envio simulado, login simulado, painel e declaração de
acessibilidade), agora com foto oficial em tela cheia e título condensado no topo.

### B.4 Prints: quais tirar e o que explicar

Os prints abaixo **já foram tirados** no visual novo, em `docs/prints/` (1440 × 900 no computador e
375 × 812 no celular), pelo script `tools/prints.mjs`.

| Arquivo | Página / estado / modo | Legenda sugerida | O que explicar |
|---|---|---|---|
| `01-inicio-modo-escuro.jpg` | Início, abertura, escuro | Figura 1: abertura no tema escuro | Logo de GTA VI e a frase acendendo palavra por palavra |
| `02-inicio-modo-claro.jpg` | Início, abertura, claro | Figura 2: a mesma cena no tema claro | Céu de amanhecer, sol listrado, logo escurecido e degradê escuro (contraste) |
| `03-carrossel.jpg` | Início, galeria pausada | Figura 3: carrossel acessível | Pausar/reproduzir, indicadores, setas e legenda |
| `04-cena-video.jpg` | Início, cena da Lucia | Figura 4: cena de vídeo controlada pela rolagem | Quadros oficiais no canvas, véu escuro sob o texto, barra de progresso |
| `05-novidades-e-progresso.jpg` | Início, linha do tempo, usuário logado | Figura 5: novidades e progresso | Fontes em cada marco e barra de progresso |
| `06-guia-busca-e-abas.jpg` | Guia, busca "barco" | Figura 6: busca em tempo real e abas | Contadores por aba e cards com foto |
| `07-guia-nenhum-resultado.jpg` | Guia, termo inexistente | Figura 7: estado "nenhum resultado" | Mensagem clara e botão para limpar |
| `08-guia-detalhes-modal.jpg` | Guia, detalhes do Cal Hampton | Figura 8: detalhes com fonte | Ilustração oficial, descrição, status e fonte |
| `09-mapa-regioes.jpg` | Mapa interativo, Vice City | Figura 9: mapa oficial com zoom | Marcadores, lista das regiões e cartão-postal |
| `10-contato-erros.jpg` | Contato, enviado vazio | Figura 10: validação acessível | Resumo de erros com links e campos marcados |
| `11-contato-sucesso.jpg` | Contato, enviado | Figura 11: confirmação | Protocolo e aviso de envio simulado |
| `12-login.jpg` | Login | Figura 12: login simulado | Aviso de que não é autenticação real |
| `13-checklist-progresso.jpg` | Checklist, logado | Figura 13: checklist com porcentagem | Itens marcados e dados por conta |
| `14-painel-acessibilidade.jpg` | Guia com painel aberto | Figura 14: painel de acessibilidade | Tema, fonte, contraste, reduzir animações, dislexia, espaçamento |
| `15-alto-contraste-fonte-150.jpg` | Guia, alto contraste + 150% | Figura 15: alto contraste e fonte ampliada | Preto/amarelo e menu que quebra de linha (reflow) |
| `16-rodape.jpg` | Rodapé | Figura 16: rodapé | Palmeiras, links, aviso legal e créditos |
| `17-foco-visivel-teclado.jpg` | Guia, foco pelo Tab | Figura 17: foco visível | Contorno creme de 3px |
| `18-celular-inicio.jpg` | Início, 375 px | Figura 18: celular | Hero em camadas e busca numa coluna |
| `19-celular-reduzir-animacoes.jpg` | Início, 375 px, sem animação | Figura 19: "Reduzir animações" | As cenas viram imagens paradas em sequência |
| `20-cena-jason.jpg` | Início, cena do Jason | Figura 20: segunda cena de vídeo | Texto do lado direito para variar o ritmo |
| `21-tour-regioes.jpg` | Início, tour | Figura 21: tour pelas 6 regiões | Nome gigante no canto, Ken Burns, "Ver no mapa" |
| `22-editorial-jason-lucia.jpg` | Início, bloco editorial | Figura 22: Jason e Lucia | Fotos em paralaxe que ampliam (lightbox) |
| `23-mapa-cena-rolagem.jpg` | Mapa, cena de rolagem | Figura 23: o mapa se afastando | Regiões numeradas acendendo no mapa e na lista |
| `24-tema-claro-catalogo.jpg` | Guia, tema claro | Figura 24: tema claro | Cards com corpo claro e cabeçalho creme |
| `25-tema-claro-rodape.jpg` | Rodapé, tema claro | Figura 25: pôr do sol no rodapé | Palmeiras em silhueta contra o céu |
| `26-celular-mapa.jpg` | Mapa, 375 px | Figura 26: mapa no celular | Pôster inteiro com as regiões e a lista compacta |

**Prints que você ainda precisa tirar:**

| Print | Como tirar | Para que serve |
|---|---|---|
| Resultado do **Lighthouse** (Acessibilidade e Desempenho) | Chrome → F12 → Lighthouse → Analyze | Comprovar a nota (o axe-core já deu 0 violações) |
| **Performance** no DevTools | F12 → Performance → gravar enquanto rola a página inicial | Mostrar os quadros por segundo com GPU (só medi sem GPU) |
| Histórico de **commits** no GitHub | Página do repositório → "Commits" | Mostrar as versões do projeto |
| Configuração do **GitHub Pages** e site no ar | Settings → Pages; abrir a URL | Apêndice: formas de acesso |

---

## Parte C: Processo de construção do site

### C.1 Redação (fazer SEM IA)

> **Atenção:** o enunciado exige que esta redação seja escrita **sem o uso de IA**. O texto abaixo é só
> um roteiro de tópicos e de exemplos do seu próprio site que você pode citar. Escreva com suas palavras.

**Título sugerido:** *WCAG, heurísticas de Nielsen, UI/UX e cores no desenvolvimento do Guia Leonida*

**Tópicos que a redação precisa cobrir:**

1. **WCAG:** o que é (W3C), os 4 princípios (POUR: perceptível, operável, compreensível e robusto) e os
   níveis A, AA e AAA.
   *Exemplos do site:* contraste calculado (`docs/contraste.md`), foco visível, link "pular para o
   conteúdo", erros de formulário ligados aos campos, carrossel com pausa (2.2.2), alvos de 44px (2.5.8),
   reflow em 320px (1.4.10), espaçamento de texto (1.4.12), animações que podem ser desligadas (2.3.3, que é nível AAA: o site vai além do AA) e
   cenas que viram imagens paradas, mapa com zoom pelo teclado e tabela como alternativa.
2. **Heurísticas de Nielsen:** as 10 heurísticas.
   *Exemplos:* visibilidade do status (contador de resultados, "Enviando…", barra de progresso, barra de
   progresso das cenas de vídeo, nível de zoom do mapa);
   correspondência com o mundo real (linguagem simples, nomes do jogo); controle e liberdade (pausar o
   carrossel, limpar filtros, "Restaurar padrões", sair da conta); consistência (o mesmo card em todo o
   site); prevenção de erros (validação, mostrar senha, confirmação antes de reiniciar o checklist);
   reconhecer em vez de lembrar (abas com ícone e nome, página atual marcada); flexibilidade (atalhos de
   teclado, URL de busca compartilhável); design minimalista; ajudar a reconhecer e corrigir erros (resumo
   de erros com links); ajuda (cards "Como usar o guia" e "Antes de escrever").
3. **UI e UX:** diferença entre interface e experiência.
   *Exemplos:* UI = paleta roxo-noite, títulos condensados, cards com foto; UX = a página inicial contada
   como um trailer, o fluxo busca → detalhes → favoritar → checklist e o mapa que leva da visão geral à
   região.
4. **Paletas de cores:** como montar uma paleta (cores de marca, de interface e de estado) e como
   verificar o contraste.
   *Exemplos:* tokens em `themes.css`, os três temas, "antes e depois" do rosa no tema claro e do degradê
   sobre o sol da abertura.
5. **Importância das cores e como escolhê-las:** público, contexto, contraste e daltonismo.
   *Exemplos:* neon com moderação, véu escuro sob todo texto em foto, cores ajustadas no tema claro,
   nenhuma informação só por cor.
6. **Branding:** identidade visual e reconhecimento.
   *Exemplos:* linguagem do site oficial de GTA VI sem copiar a marca da Rockstar; marca própria (sol
   cortado por faixas); fotos oficiais com crédito; palmeiras no rodapé; nome "Leonida".
7. **Psicologia das cores:** roxo-noite = cinema e mistério, rosa = ação, laranja = calor e atenção,
   creme = luz de fim de tarde e orientação, areia/pêssego = dia e leveza (tema claro).
8. **Acessibilidade:** deficiências visuais, motoras, cognitivas e vestibulares, e o painel de
   acessibilidade.
   *Exemplos:* fonte para dislexia, alto contraste, "Reduzir animações" (as cenas viram fotos paradas, a
   rolagem suave desliga), `prefers-reduced-motion`, texto apagado pela animação que continua para o leitor
   de tela.
9. **Usabilidade:** facilidade de aprender, eficiência, poucos erros e satisfação.
   *Exemplos:* busca sem acentos, estado vazio com sugestões, formulário que já vem preenchido para quem
   está logado, roda do mouse que dá zoom no mapa sem rolar a página.

**Referências que ajudam na redação** (estão na Parte D): WCAG 2.2 (W3C), as 10 heurísticas (Nielsen
Norman Group), WebAIM e a documentação do Bootstrap.

### C.2 Documentação / README

A documentação completa da construção, passo a passo, está no **`README.md`** do repositório (seção 6,
"Passo a passo da construção"). Ela traz as tecnologias, a estrutura de pastas, como rodar e publicar e
as decisões de design. Cole o README no relatório ou anexe o arquivo.

---

## Parte D: Referências, IAs usadas e ferramentas

### D.1 Referências (ABNT)

> Acessadas em 25 nov. 2026. Confira se os links continuam funcionando antes de entregar.

**Sobre GTA VI (conteúdo e imagens do site):**

- ROCKSTAR GAMES. **Grand Theft Auto VI**. [S. l.]: Rockstar Games, 2026. Disponível em:
  https://www.rockstargames.com/VI. Acesso em: 25 nov. 2026.
- ROCKSTAR GAMES. **Só em Leonida**. [S. l.]: Rockstar Games, 2026. Disponível em:
  https://www.rockstargames.com/VI/only-in-leonida. Acesso em: 25 nov. 2026.
- ROCKSTAR GAMES. **Grand Theft Auto VI: mídia** (capturas de tela, ilustrações, pôster do mapa e
  videoclipes). [S. l.]: Rockstar Games, 2026. Disponível em: https://www.rockstargames.com/VI/media. Acesso
  em: 25 nov. 2026.
- ROCKSTAR GAMES. Grand Theft Auto VI já disponível. **Rockstar Newswire**, 19 nov. 2026. Disponível em:
  https://www.rockstargames.com/br/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available.
  Acesso em: 25 nov. 2026.
- ROCKSTAR GAMES. Pré-carregamento de Grand Theft Auto VI a partir de 10 de novembro. **Rockstar Newswire**,
  3 nov. 2026. Disponível em: https://www.rockstargames.com/br/newswire/article/k4ak9okk485712/grand-theft-auto-vi-pre-load-begins-on-november-10.
  Acesso em: 25 nov. 2026.
- ROCKSTAR GAMES. A música de Grand Theft Auto VI: estações de rádio no jogo. **Rockstar Newswire**, 8 out.
  2026. Disponível em: https://www.rockstargames.com/br/newswire/article/o3982oa93a23k4/the-music-of-grand-theft-auto-vi-in-game-radio-stations.
  Acesso em: 25 nov. 2026.
- ROCKSTAR GAMES. Grand Theft Auto VI: The Album (Deluxe Edition). **Rockstar Newswire**, 23 nov. 2026.
  Disponível em: https://www.rockstargames.com/br/newswire/article/178ok8411a55o5/grand-theft-auto-vi-the-album-deluxe-edition.
  Acesso em: 25 nov. 2026.
- ROCKSTAR GAMES. Grand Theft Auto VI is now set to launch November 19, 2026. **Rockstar Newswire**, 2025.
  Disponível em: https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026.
  Acesso em: 25 nov. 2026.
- GAME INFORMER. Rockstar shows off six major areas of Vice City in Grand Theft Auto VI. **Game Informer**,
  6 maio 2025. Disponível em: https://gameinformer.com/2025/05/06/rockstar-shows-off-six-major-areas-of-vice-city-in-grand-theft-auto-vi.
  Acesso em: 25 nov. 2026.
- GAMESRADAR+. GTA 6: everything we know so far. **GamesRadar+**, 2026. Disponível em:
  https://www.gamesradar.com/gta-6-guide/. Acesso em: 25 nov. 2026.
- PORTAL VICIADOS. Exclusivo: GTA 6 é classificado oficialmente no Brasil. **Portal Viciados**, 2026.
  Disponível em: https://viciados.net/exclusivo-gta-6-classificado-oficialmente-brasil/. Acesso em: 25 nov. 2026.

**Sobre acessibilidade, usabilidade e desenvolvimento:**

- W3C. **Web Content Accessibility Guidelines (WCAG) 2.2**. W3C Recommendation, 2023. Disponível em:
  https://www.w3.org/TR/WCAG22/. Acesso em: 25 nov. 2026.
- W3C. Understanding Success Criterion 1.4.3: Contrast (Minimum). **W3C WAI**. Disponível em:
  https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html. Acesso em: 25 nov. 2026.
- W3C. Understanding Success Criterion 2.3.3: Animation from Interactions. **W3C WAI**. Disponível em:
  https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html. Acesso em: 25 nov. 2026.
- W3C. Understanding Success Criterion 2.5.8: Target Size (Minimum). **W3C WAI**. Disponível em:
  https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html. Acesso em: 25 nov. 2026.
- W3C. Carousel (Slide Show or Image Rotator) Pattern. **ARIA Authoring Practices Guide**. Disponível em:
  https://www.w3.org/WAI/ARIA/apg/patterns/carousel/. Acesso em: 25 nov. 2026.
- W3C. Tabs Pattern. **ARIA Authoring Practices Guide**. Disponível em:
  https://www.w3.org/WAI/ARIA/apg/patterns/tabs/. Acesso em: 25 nov. 2026.
- NIELSEN, Jakob. 10 usability heuristics for user interface design. **Nielsen Norman Group**, 1994
  (atualizado). Disponível em: https://www.nngroup.com/articles/ten-usability-heuristics/. Acesso em: 25 nov. 2026.
- WEBAIM. Contrast Checker. **WebAIM**. Disponível em: https://webaim.org/resources/contrastchecker/.
  Acesso em: 25 nov. 2026.
- BOOTSTRAP. **Bootstrap 5.3 documentation**. Disponível em: https://getbootstrap.com/docs/5.3/.
  Acesso em: 25 nov. 2026.
- GREENSOCK. **GSAP 3 e ScrollTrigger**: documentation. Disponível em: https://gsap.com/docs/v3/.
  Acesso em: 25 nov. 2026.
- DARKROOM ENGINEERING. **Lenis**: smooth scroll. Disponível em: https://github.com/darkroomengineering/lenis.
  Acesso em: 25 nov. 2026.
- MDN WEB DOCS. prefers-reduced-motion. **Mozilla**. Disponível em:
  https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion. Acesso em: 25 nov. 2026.
- MDN WEB DOCS. Canvas API. **Mozilla**. Disponível em:
  https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API. Acesso em: 25 nov. 2026.
- DEQUE SYSTEMS. **axe-core**: accessibility engine for automated web UI testing. Versão 4.10.2. Disponível em:
  https://github.com/dequelabs/axe-core. Acesso em: 25 nov. 2026.
- FFMPEG. **FFmpeg filters documentation** (minterpolate). Disponível em:
  https://ffmpeg.org/ffmpeg-filters.html#minterpolate. Acesso em: 25 nov. 2026.
- BRAILLE INSTITUTE. **Atkinson Hyperlegible Font**. Disponível em: https://www.brailleinstitute.org/freefont/.
  Acesso em: 25 nov. 2026.

### D.2 IAs usadas

| IA | Como foi usada |
|---|---|
| **Claude Opus 5.5** (Anthropic), via **Claude Code** (aplicativo desktop) | Pesquisa sobre o status de GTA VI e as fontes; estudo do site oficial; download e processamento do kit de mídia oficial (WebP, recorte do logo, quadros dos videoclipes); geração do código HTML, CSS e JavaScript; scripts de contraste, folha de contato e prints; testes (axe-core, teclado, 320 a 1440 px, temas, "Reduzir animações"); rascunho do README, deste relatório e da documentação. |

**Uso honesto:** o código e os textos de documentação foram gerados com a IA a partir das minhas
instruções e revisados por mim: [descreva aqui o que você revisou, mudou ou decidiu, por exemplo a
aprovação do protótipo, a escolha da fonte e da frase da abertura e os pedidos de ajuste]. A **redação da
Parte C foi escrita por mim, sem IA**, como pede o enunciado.

### D.3 Ferramentas aplicadas

| Ferramenta | Para quê |
|---|---|
| Visual Studio Code + Live Server | Edição do código e prévia local |
| Git e GitHub | Controle de versão (commits por etapa) e hospedagem do repositório |
| GitHub Pages | Publicação do site |
| Bootstrap 5.3.3 e Bootstrap Icons 1.11.3 | Framework CSS e ícones |
| GSAP 3.15.0 + ScrollTrigger e Lenis 1.3.27 | Cenas ligadas à rolagem e rolagem suave |
| Google Fonts | Big Shoulders Display, Inter e Atkinson Hyperlegible |
| Python 3 + Pillow e FFmpeg | Processamento do kit oficial (`tools/processar_kit.py`) e folha de contato |
| `tools/contraste.py` e WebAIM Contrast Checker | Análise de contraste |
| Node + Google Chrome headless (`tools/prints.mjs`) | Prints, axe-core, rolagem horizontal e medidas de carregamento |
| axe-core 4.10.2 | Auditoria automática de acessibilidade |
| Lighthouse (Chrome DevTools) | Auditoria [rodar e anexar o print] |
| Claude Code | Assistente de IA (veja D.2) |

---

## Parte E: HTML, CSS, JS e CSS Frameworks

### E.1 Resumo técnico

O Guia Leonida é um site **estático** de 7 páginas, em **HTML5 semântico, CSS3 e JavaScript puro**, com
**Bootstrap 5.3.3** como framework CSS. Não tem etapa de build: funciona abrindo o arquivo, num servidor
simples (Live Server) ou no GitHub Pages.

- **CSS:** os *tokens* de cor e tipografia ficam em `themes.css`, redefinidos para os temas escuro,
  claro e alto contraste e ligados às variáveis do Bootstrap. `style.css` traz os componentes e
  `cenas.css` as cenas da página inicial. As cenas só ficam presas na tela e animadas com a classe
  `movimento` no `<html>`; sem ela (preferência de menos movimento, painel ou JavaScript desligado), o CSS
  mostra a versão parada.
- **JavaScript:** um arquivo por responsabilidade, comentados em português. `cenas.js` liga GSAP,
  ScrollTrigger e Lenis: abertura, paralaxe, as cenas de vídeo (`CenaVideo`, que carrega os quadros aos
  poucos e desenha no `<canvas>`), o tour, a cena do mapa e a faixa horizontal; tudo é desfeito na hora
  quando o usuário pede menos movimento. `mapa.js` faz o zoom do pôster (roda, Pointer Events para arraste e
  pinça, teclado). Os dados ficam em `data.js` e são renderizados por `search.js`.
- **Bootstrap usado:** grid, offcanvas (painel de acessibilidade e menu em tela cheia), modal (detalhes e
  lightbox), tabs (login), toasts, breadcrumb e `data-bs-theme` para os temas.
- **Acessibilidade:** WAI-ARIA para carrossel e abas, `aria-live`, `aria-describedby`/`aria-invalid` nos
  formulários, `role="progressbar"`, `aria-pressed`/`aria-expanded` nos controles do mapa; a animação só usa
  `opacity` e `transform`, então o texto apagado continua acessível.
- **Versões:** 33 commits em português, um por etapa (veja `git log --oneline`).

### E.2 Índice de arquivos (anexar)

| Arquivo | Linhas | Descrição |
|---|---|---|
| `index.html` | 621 | Página inicial em cenas ("trailer de rolagem") |
| `guia.html` | 294 | Catálogo com busca, abas e estado vazio |
| `mapa.html` | 387 | Cena do mapa, mapa interativo, tabela e fichas das regiões |
| `checklist.html` | 275 | Checklist de progresso e favoritos |
| `contato.html` | 331 | Formulário de contato |
| `login.html` | 374 | Login e cadastro simulados |
| `acessibilidade.html` | 342 | Painel e declaração de acessibilidade |
| `css/themes.css` | 260 | Tokens dos três temas e integração com o Bootstrap |
| `css/style.css` | 1252 | Componentes, mapa, layout e classes de acessibilidade |
| `css/cenas.css` | 517 | Cenas da página inicial (com e sem movimento) |
| `js/cenas.js` | 521 | Cabeçalho, rolagem suave, cenas, tour, cena do mapa e faixa de destaques |
| `js/mapa.js` | 228 | Zoom do pôster, arraste, teclado e cartões-postais |
| `js/data.js` | 731 | Catálogo, novidades e checklist, com fontes |
| `js/search.js` | 373 | Cards, busca, abas, favoritos e janela de detalhes |
| `js/main.js` | 180 | Utilidades, anúncios, "Já disponível" e novidades |
| `js/theme.js` | 136 | Tema e aplicação antecipada das preferências |
| `js/a11y.js` | 210 | Painel de acessibilidade |
| `js/auth.js` | 256 | Login/cadastro simulados, favoritos e checklist por usuário |
| `js/carousel.js` | 157 | Carrossel acessível |
| `js/form.js` | 337 | Validação acessível de formulários |
| `js/checklist.js` | 154 | Checklist e barra de progresso |
| `tools/processar_kit.py` | 340 | Processamento do kit de mídia oficial |
| `tools/folha_de_contato.py` | 187 | Folha de contato das imagens |
| `tools/contraste.py` | ~360 | Cálculo de contraste e `docs/contraste.md` |
| `tools/prints.mjs` | 169 | Prints, axe-core e medidas com o Chrome headless |

> Para a Parte E, anexe a pasta do projeto compactada (.zip) ou o link do repositório, como o enunciado
> permite.

---

## Apêndice: formas de acessar o site

1. **Site publicado (GitHub Pages):** [https://felipemourafranzo.github.io/guia-leonida/]
2. **Repositório (código e histórico de versões):** [URL DO REPOSITÓRIO NO GITHUB]
3. **Localmente, sem instalar nada:** baixe ou descompacte o projeto e dê dois cliques em `index.html`.
4. **Localmente, com servidor (recomendado):** extensão Live Server do VS Code, ou
   `python -m http.server 8000` na pasta do projeto e abrir http://localhost:8000.
5. **No celular:** abra a URL do GitHub Pages. Sugestão: inclua um QR Code da URL no relatório.

**Navegadores testados:** Chromium (navegador do ambiente de desenvolvimento e Google Chrome em modo
headless, de 320 a 1440 px). Recomenda-se conferir também no Firefox, no Safari do iPhone e num celular
Android antes da entrega.
