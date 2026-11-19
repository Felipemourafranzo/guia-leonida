# Projeto Final: Guia Leonida (rascunho do relatório)

**Desenvolvimento de Interfaces 2/2026**. Prof. Dr. Felipe Batista da Silva

- **Nome:** [NOME]
- **RA:** [RA]
- **Site:** Guia Leonida, guia de fã não oficial de GTA VI
- **Repositório:** [URL DO REPOSITÓRIO NO GITHUB]
- **Site publicado:** [URL DO GITHUB PAGES]

> Este é um **rascunho** para montar o Word/PDF. Revise o texto e ajuste tudo à sua voz. Os trechos entre
> colchetes são para você preencher. A **Parte C (redação) não foi escrita**, porque o enunciado exige
> que ela seja feita sem IA: aqui há só os tópicos e exemplos do site que você pode citar.

---

## Parte A: Paletas de cores e WCAG

### A.1 Paletas definidas

A identidade visual se inspira no **pôr do sol neon de Vice City/Miami**: rosa, laranja, roxo e ciano. A
paleta foi definida como *tokens* CSS (custom properties) em `css/themes.css`, com três versões: modo
escuro, modo claro e alto contraste.

**Cores da marca (só para decoração, nunca para texto):**

| Token | Hex | Uso |
|---|---|---|
| `--neon-rosa` | `#FF2D95` | Faixas, degradês e ilustrações |
| `--neon-laranja` | `#FF8A3D` | Faixas, degradês e ilustrações |
| `--neon-roxo` | `#7C3AED` | Faixas, degradês e ilustrações |
| `--neon-ciano` | `#22D3EE` | Ilustrações |

**Paleta de interface (cores de texto e de fundo):**

| Token | Modo escuro | Modo claro | Alto contraste | Função |
|---|---|---|---|---|
| `--cor-fundo` | `#0E0A1F` | `#FFF8F2` | `#000000` | Fundo da página |
| `--cor-superficie` | `#1A1433` | `#FFFFFF` | `#000000` | Cards, formulários |
| `--cor-superficie-2` | `#251C47` | `#F5EDFF` | `#000000` | Seções alternadas, destaques |
| `--cor-texto` | `#F5F0FF` | `#1C1230` | `#FFFFFF` | Texto principal |
| `--cor-texto-suave` | `#C9BEE8` | `#4F4566` | `#FFFFFF` | Texto secundário |
| `--cor-primaria` (rosa) | `#FF6BB0` | `#B8175E` | `#FFFF00` | Links, botões, ação |
| `--cor-secundaria` (laranja) | `#FF9F5A` | `#A3410B` | `#FFFF00` | Datas, selos, destaques |
| `--cor-acento` (ciano) | `#3FD8F0` | `#0B6577` | `#00FFFF` | Ícones, informação |
| `--cor-roxo` | `#B9A2FF` | `#5B2BC4` | `#FFFFFF` | Categoria "Dicas", código |
| `--cor-borda-campo` | `#8B7BC4` | `#7E7398` | `#FFFFFF` | Borda de campos (3:1) |
| `--cor-foco` | `#3FD8F0` | `#5B2BC4` | `#FFFF00` | Contorno de foco |
| `--cor-erro` | `#FF8F8F` | `#B42318` | `#FF8080` | Mensagens de erro |
| `--cor-sucesso` | `#5BE3A0` | `#146C43` | `#7CFF7C` | Mensagens de sucesso |

### A.2 Análise de contraste (WCAG 2.2)

A razão de contraste foi **calculada** por um script próprio (`tools/contraste.py`) que aplica a fórmula
da WCAG: luminância relativa de cada cor e razão `(L1 + 0,05) / (L2 + 0,05)`. A tabela completa, com
54 combinações, está em `docs/contraste.md`. Resumo:

| Par (modo escuro) | Razão | AA | AAA |
|---|---|---|---|
| Texto `#F5F0FF` sobre fundo `#0E0A1F` | 17,37:1 | ✅ | ✅ |
| Texto suave `#C9BEE8` sobre card `#1A1433` | 10,08:1 | ✅ | ✅ |
| Rosa `#FF6BB0` sobre fundo `#0E0A1F` | 7,38:1 | ✅ | ✅ |
| Texto do botão `#1A0612` sobre rosa `#FF6BB0` | 7,40:1 | ✅ | ✅ |
| Borda de campo `#8B7BC4` sobre card (UI) | 4,81:1 | ✅ | — |

| Par (modo claro) | Razão | AA | AAA |
|---|---|---|---|
| Texto `#1C1230` sobre fundo `#FFF8F2` | 16,94:1 | ✅ | ✅ |
| Rosa `#B8175E` sobre fundo `#FFF8F2` | 6,01:1 | ✅ | ❌ |
| Branco sobre botão rosa `#B8175E` | 6,32:1 | ✅ | ❌ |
| Laranja `#A3410B` sobre card `#FFFFFF` | 6,33:1 | ✅ | ❌ |
| Borda de campo `#7E7398` sobre card (UI) | 4,38:1 | ✅ | — |

**Resultado: todos os pares usados no site passam no nível AA nos três modos.** O alto contraste chega
a 21:1 (branco sobre preto) e 19,56:1 (amarelo sobre preto).

**Antes e depois (cores que falharam e foram corrigidas):**

| Caso | Antes | Depois |
|---|---|---|
| Rosa do botão no modo claro (sobre `#FFF8F2`) | `#FF2D95`: 3,29:1 ❌ | `#B8175E`: 6,01:1 ✅ |
| Ciano dos links no modo claro (sobre `#FFFFFF`) | `#22D3EE`: 1,81:1 ❌ | `#0B6577`: 6,68:1 ✅ |
| Roxo dos rótulos no modo escuro (sobre `#1A1433`) | `#7C3AED`: 3,09:1 ❌ | `#B9A2FF`: 8,12:1 ✅ |
| Título em degradê no modo claro (sobre `#FFE9D6`) | laranja `#FF8A3D`: 2,00:1 ❌ | `#A3410B`: 5,39:1 ✅ |

O caso mais interessante para o relatório é o primeiro: o rosa neon `#FF2D95` é a cor que mais "parece"
Vice City, mas sobre um fundo claro ele não passa nem em 4,5:1. A solução foi manter o **matiz**
(framboesa) e escurecer a cor até ela passar, separando a "cor da marca" (decorativa) da "cor de texto".

**Como verificar:** rode `python tools/contraste.py` ou confira os pares em
<https://webaim.org/resources/contrastchecker/>.

### A.3 Psicologia das cores aplicada ao site

| Cor | Associações | Onde e por que usamos |
|---|---|---|
| **Rosa / magenta** | Energia, juventude, ousadia, vida noturna | Botões principais, links e página atual no menu: é a cor da **ação** |
| **Laranja** | Calor, entusiasmo, sol, urgência leve | Datas da linha do tempo, sobretítulos e selos "a confirmar": chama a **atenção** sem alarmar |
| **Roxo profundo** | Noite, mistério, criatividade, luxo | Fundo do modo escuro e categoria "Dicas": dá a atmosfera **noturna e imersiva** de um jogo |
| **Ciano** | Tecnologia, mar, frescor, confiança | Ícones informativos e foco do teclado: **informação** e **orientação** |
| **Areia / off-white** | Praia, leveza, calma | Fundo do modo claro: lembra a praia e cansa menos que o branco puro |
| **Verde e vermelho** | Convenções de sucesso e erro | Mensagens de formulário, sempre com ícone e texto, nunca só a cor |
| **Preto, branco e amarelo** | Máxima legibilidade | Alto contraste: o amarelo sobre preto é o par mais legível para baixa visão |

### A.4 Texto: a escolha das cores e suas implicações

As cores do Guia Leonida partiram de uma referência clara: o pôr do sol de Miami, que inspira a Vice
City de GTA VI, e a estética neon dos anos 80 que a série ajudou a popularizar. Rosa, laranja, roxo e
ciano criam reconhecimento imediato com o universo do jogo. Isso é **branding**: o fã sente que está num
lugar que "fala a língua" de Vice City antes mesmo de ler qualquer texto.

Essa escolha tem uma implicação séria. **Cores neon têm pouco contraste**, principalmente sobre fundo
claro. O rosa `#FF2D95` sobre o fundo areia tem 3,29:1 e o ciano `#22D3EE` sobre branco só 1,81:1, abaixo
do mínimo de 4,5:1 da WCAG para texto. Se a paleta fosse usada sem ajuste, pessoas com baixa visão,
daltonismo ou usando o celular sob o sol teriam dificuldade para ler os links e os botões.

A solução foi separar dois papéis. As **cores de marca** (neon puro) ficam só em elementos decorativos:
a faixa no topo do cabeçalho, as ilustrações e os degradês de fundo. As **cores de interface** são
versões do mesmo matiz, ajustadas e calculadas por script até passarem no AA. No modo escuro o neon
funciona bem, porque o fundo roxo-noite é muito escuro. No modo claro o rosa vira framboesa e o ciano
vira azul-petróleo. A identidade continua reconhecível e o texto continua legível.

Também foi preciso garantir que **nenhuma informação dependa só da cor** (critério 1.4.1). Cada
categoria do catálogo tem cor, ícone **e** nome; a aba selecionada fica preenchida e não só colorida; os
erros do formulário têm ícone e texto; o botão de favorito troca o coração vazio por cheio. Assim, quem
não distingue rosa de laranja recebe a mesma informação.

Por fim, o site oferece três paletas (claro, escuro e alto contraste) e respeita a preferência do
sistema operacional. Isso reconhece que não existe uma paleta "ideal" para todo mundo: há quem prefira
o escuro à noite, quem precise de alto contraste e quem leia melhor no claro. Dar o controle ao usuário
é parte do bom design de cores.

---

## Parte B: Design do site

### B.1 O que é o site e para que serve

O **Guia Leonida** é um guia de fã não oficial de *Grand Theft Auto VI*, lançado em 19/11/2026 para
PlayStation 5 e Xbox Series X|S. Ele serve para quem vai jogar (ou acabou de começar) conhecer o mundo do
jogo: o estado de **Leonida**, inspirado na Flórida, suas **seis regiões**, os **personagens**
apresentados pela Rockstar, os **tipos de veículo** vistos nos trailers e **dicas para iniciantes**.

O diferencial é a **honestidade com as fontes**: cada item tem a fonte da informação, e o que não foi
confirmado oficialmente aparece como "a confirmar", com um selo próprio. Isso evita boatos, comuns em
sites sobre jogos ainda não lançados.

### B.2 Como o usuário se mantém engajado

| Recurso | Como funciona | Por que engaja |
|---|---|---|
| **Favoritos** | Coração em cada card, salvo por usuário; lista "Meus favoritos" e filtro "Mostrar só meus favoritos" no guia | O usuário monta a própria coleção e tem motivo para criar conta e voltar |
| **Checklist de progresso** | 18 tarefas em 4 grupos (Antes de jogar, Primeiros passos, Explorar Leonida, Veículos) com barra de porcentagem salva por conta; parabéns ao completar | Gamificação: a barra mostra o avanço e dá vontade de "fechar os 100%", como no próprio jogo |
| **Status do lançamento** | Contagem regressiva que vira "Já disponível, lançado há N dias" automaticamente | Cria expectativa antes do lançamento e continua útil depois |
| **Novidades** | Linha do tempo com fontes; itens publicados depois da última visita ganham o selo "Novo desde sua última visita" | Dá um motivo para voltar e ver o que mudou |
| **Busca compartilhável** | A URL acompanha a busca (`guia.html?q=barco&cat=veiculos`) | O usuário pode mandar um resultado para um amigo |
| **Resumo na home** | Quem está logado vê a própria barra de progresso na página inicial | Lembra o usuário do que falta fazer |

### B.3 Recursos e elementos do site

**Cabeçalho (todas as páginas):** link "Pular para o conteúdo" (aparece com Tab), logo, menu com indicação
da página atual (cor + sublinhado), botão de tema claro/escuro, botão "Acessibilidade" e menu
hambúrguer no celular. Fica fixo no topo ao rolar a página.

**Rodapé completo (todas as páginas):** descrição do site, status do lançamento, navegação, canais
oficiais da Rockstar (site, Newswire, YouTube, X, Instagram), links de acessibilidade (declaração, ajustes,
relatar barreira, GitHub), **aviso legal** e créditos.

**Página inicial (`index.html`):**
- *Hero:* título com "Leonida" em degradê, busca rápida que leva ao guia e cartão de status do lançamento
  com contagem (dias, horas, minutos) e botão para pausar a atualização (WCAG 2.2.2).
- *Carrossel de imagens:* 5 slides com legenda, botão pausar/reproduzir, setas, indicadores e teclado.
  Não gira sozinho se o usuário preferir menos movimento.
- *Cartões explicativos com ícones:* "Como usar o guia", "O que é Leonida", "Dicas para iniciantes" e
  "Feito para todo mundo".
- *Destaques do catálogo:* 4 cards de categorias diferentes.
- *Novidades:* linha do tempo com 6 marcos e fontes, ao lado do resumo de progresso.

**Guia (`guia.html`), as abas de pesquisa:**
- Campo de busca com resultados **em tempo real**, sem diferenciar acentos nem maiúsculas.
- **Abas** Todos, Veículos, Personagens, Regiões e Dicas, com contador de resultados em cada uma.
- Filtro "Mostrar só meus favoritos".
- **Estado "nenhum resultado encontrado"** com sugestões e botão "Limpar busca e filtros".
- **Cards** com imagem, selo de categoria, título, resumo, status (fonte confirmada ou "a confirmar"),
  botão "Ver detalhes" (abre um modal com a descrição completa e a fonte) e botão de favorito.

**Mapa (`mapa.html`):** mapa esquemático em SVG com as 6 regiões clicáveis (com aviso de que não é o mapa
oficial), tabela "Região × Inspiração × Veículo sugerido" e cards das regiões.

**Checklist (`checklist.html`):** barra de progresso, 4 grupos de tarefas, botão "Reiniciar progresso" e a
lista "Meus favoritos". Visitantes veem o checklist desativado e um convite para entrar.

**Contato (`contato.html`), o formulário:** nome, e-mail, assunto, mensagem (com contador de caracteres) e
consentimento. Tem validação em JavaScript, resumo de erros com links para os campos, mensagens ligadas
por `aria-describedby`, anúncio por `aria-live`, estado "Enviando…" e mensagem de sucesso com protocolo.
O envio é simulado. Se o usuário estiver logado, nome e e-mail já vêm preenchidos.

**Login (`login.html`):** abas "Entrar" e "Criar conta", botão para mostrar a senha, aviso visível de que
o login é simulado, painel "Você está conectado" com resumo de favoritos e checklist, e botão "Sair".

**Acessibilidade (`acessibilidade.html`) e painel lateral:** tema (sistema, claro, escuro), tamanho do
texto (87,5% a 150%), alto contraste, reduzir animações, fonte para dislexia (Atkinson Hyperlegible), mais
espaçamento (valores do critério 1.4.12) e sublinhar links. A página tem uma prévia ao vivo, a tabela de
atalhos de teclado e a **declaração de acessibilidade**.

### B.4 Prints: quais tirar e o que explicar

Os prints abaixo **já foram tirados** e estão em `docs/prints/`, com 800 px de largura (desktop) e 375 px
(celular). Para o relatório final, você pode tirar de novo em resolução maior (Win + Shift + S) e
**depois de colocar as imagens reais**.

| Arquivo | Página / estado / modo | Legenda sugerida | O que explicar |
|---|---|---|---|
| `01-inicio-modo-escuro.jpg` | Início, topo, escuro | Figura 1: página inicial no modo escuro | Hero, busca rápida, contagem regressiva e menu com a página atual marcada |
| `02-inicio-modo-claro.jpg` | Início, topo, claro | Figura 2: a mesma tela no modo claro | Mesma estrutura com a paleta clara; rosa vira framboesa para manter o contraste |
| `03-carrossel.jpg` | Início, carrossel pausado | Figura 3: carrossel acessível | Botão Reproduzir/Pausar, indicadores, setas e legenda sobre fundo sólido |
| `04-cards-explicativos.jpg` | Início, "Comece por aqui" | Figura 4: cartões explicativos com ícones | Os 4 cards e o papel de cada um na orientação do usuário |
| `05-novidades-e-progresso.jpg` | Início, novidades | Figura 5: linha do tempo e progresso | Fontes em cada marco e barra de progresso do usuário logado |
| `06-guia-busca-e-abas.jpg` | Guia, busca "barco" | Figura 6: busca em tempo real e abas | Contadores por aba, resultados de várias categorias, selos com ícone |
| `07-guia-nenhum-resultado.jpg` | Guia, termo inexistente | Figura 7: estado "nenhum resultado" | Mensagem clara, sugestões e botão para limpar (heurística de recuperação de erros) |
| `08-guia-detalhes-modal.jpg` | Guia, modal da Lucia | Figura 8: detalhes com fonte | Descrição completa, etiquetas, status e link da fonte |
| `09-mapa-regioes.jpg` | Mapa | Figura 9: mapa esquemático e tabela | SVG clicável com aviso "não oficial" e tabela com cabeçalhos |
| `10-contato-erros.jpg` | Contato, enviado vazio | Figura 10: validação acessível | Resumo de erros com links, campo destacado e mensagem com ícone |
| `11-contato-sucesso.jpg` | Contato, enviado | Figura 11: confirmação de envio | Feedback de sucesso com protocolo e aviso de envio simulado |
| `12-login.jpg` | Login, aba Entrar | Figura 12: login simulado | Aviso de que não é autenticação real, botão mostrar senha, abas |
| `13-checklist-progresso.jpg` | Checklist, usuário logado | Figura 13: checklist com porcentagem | Barra 28%, itens riscados, dados salvos por conta |
| `14-painel-acessibilidade.jpg` | Guia com painel aberto | Figura 14: painel de acessibilidade | Todas as opções disponíveis em qualquer página |
| `15-alto-contraste-fonte-150.jpg` | Guia, alto contraste + fonte 150% | Figura 15: alto contraste e fonte ampliada | Paleta preto/amarelo e menu que quebra de linha sem sobrepor (reflow) |
| `16-rodape.jpg` | Rodapé | Figura 16: rodapé completo | Navegação, canais oficiais, acessibilidade, aviso legal e créditos |
| `17-foco-visivel-teclado.jpg` | Guia, foco no botão Acessibilidade | Figura 17: foco visível | Contorno ciano de 3px (WCAG 2.4.7) |
| `18-celular-inicio.jpg` | Início, 375 px | Figura 18: versão para celular | Layout em uma coluna, botões grandes, menu hambúrguer |
| `19-celular-status-apos-lancamento-simulado.jpg` | Início, 375 px, relógio adiantado | Figura 19: status depois do lançamento | A contagem vira "Já disponível" sozinha (estado simulado no teste) |

**Prints que você ainda precisa tirar:**

| Print | Como tirar | Para que serve |
|---|---|---|
| Resultado do **Lighthouse** (Acessibilidade) | Chrome → F12 → Lighthouse → Accessibility → Analyze | Comprovar a nota de acessibilidade |
| Histórico de **commits** no GitHub | Página do repositório → "Commits" | Mostrar as versões do projeto, como o enunciado pede |
| Configuração do **GitHub Pages** | Settings → Pages | Mostrar como o site foi publicado |
| Site no ar (GitHub Pages) | Abrir a URL publicada | Apêndice: formas de acesso |
| Menu aberto no celular | F12 → modo dispositivo → clicar no menu | Mostrar a navegação responsiva |
| Prints com as **imagens reais** | Depois de trocar os placeholders | Versão final do visual |

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
   reflow em 320px (1.4.10), espaçamento de texto (1.4.12).
2. **Heurísticas de Nielsen:** as 10 heurísticas.
   *Exemplos:* visibilidade do status (contador de resultados, "Enviando…", barra de progresso);
   correspondência com o mundo real (linguagem simples, nomes do jogo); controle e liberdade (pausar o
   carrossel, limpar filtros, "Restaurar padrões", sair da conta); consistência (o mesmo card em todo o
   site); prevenção de erros (validação, mostrar senha, confirmação antes de reiniciar o checklist);
   reconhecer em vez de lembrar (abas com ícone e nome, página atual marcada); flexibilidade (atalhos de
   teclado, URL de busca compartilhável); design minimalista; ajudar a reconhecer e corrigir erros (resumo
   de erros com links); ajuda (cards "Como usar o guia" e "Antes de escrever").
3. **UI e UX:** diferença entre interface e experiência.
   *Exemplos:* UI = paleta, tipografia, cards e ícones; UX = fluxo busca → detalhes → favoritar →
   checklist, e o feedback em cada passo.
4. **Paletas de cores:** como montar uma paleta (cores de marca, de interface e de estado) e como
   verificar o contraste.
   *Exemplos:* tokens em `themes.css`, os três modos, "antes e depois" do rosa neon.
5. **Importância das cores e como escolhê-las:** público, contexto, contraste e daltonismo.
   *Exemplos:* neon só na decoração e cores ajustadas no texto; nenhuma informação só por cor.
6. **Branding:** identidade visual e reconhecimento.
   *Exemplos:* estética Vice City/anos 80, logo com sol listrado e palmeira, faixa neon no cabeçalho e no
   rodapé, nome "Leonida".
7. **Psicologia das cores:** rosa = ação e energia, laranja = atenção, roxo = noite e mistério, ciano =
   informação e confiança.
8. **Acessibilidade:** deficiências visuais, motoras, cognitivas e vestibulares, e o painel de
   acessibilidade.
   *Exemplos:* fonte para dislexia, alto contraste, reduzir animações, `prefers-reduced-motion`.
9. **Usabilidade:** facilidade de aprender, eficiência, poucos erros e satisfação.
   *Exemplos:* busca sem acentos, estado vazio com sugestões, formulário que já vem preenchido para quem
   está logado.

**Referências que ajudam na redação** (estão na Parte D): WCAG 2.2 (W3C), as 10 heurísticas (Nielsen
Norman Group), WebAIM e a documentação do Bootstrap.

### C.2 Documentação / README

A documentação completa da construção, passo a passo, está no **`README.md`** do repositório (seção 6,
"Passo a passo da construção"). Ela traz as tecnologias, a estrutura de pastas, como rodar e publicar e
as decisões de design. Cole o README no relatório ou anexe o arquivo.

---

## Parte D: Referências, IAs usadas e ferramentas

### D.1 Referências (ABNT)

> Todas acessadas em 18 nov. 2026. Confira se os links continuam funcionando antes de entregar.

**Sobre GTA VI (conteúdo do site):**

- ROCKSTAR GAMES. **Grand Theft Auto VI**. [S. l.]: Rockstar Games, 2026. Disponível em:
  https://www.rockstargames.com/VI. Acesso em: 18 nov. 2026.
- ROCKSTAR GAMES. Grand Theft Auto VI is now set to launch November 19, 2026. **Rockstar Newswire**, 2025.
  Disponível em: https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026.
  Acesso em: 18 nov. 2026.
- ROCKSTAR GAMES. Hi everyone, Grand Theft Auto VI will now release on Thursday, November 19, 2026. [S. l.],
  2025. X (antigo Twitter): @RockstarGames. Disponível em: https://x.com/RockstarGames/status/1986540361011880167.
  Acesso em: 18 nov. 2026.
- GAME INFORMER. Rockstar shows off six major areas of Vice City in Grand Theft Auto VI. **Game Informer**,
  6 maio 2025. Disponível em: https://gameinformer.com/2025/05/06/rockstar-shows-off-six-major-areas-of-vice-city-in-grand-theft-auto-vi.
  Acesso em: 18 nov. 2026.
- GAMESRADAR+. GTA 6: everything we know so far. **GamesRadar+**, 2026. Disponível em:
  https://www.gamesradar.com/gta-6-guide/. Acesso em: 18 nov. 2026.
- PC GAMER. GTA 6 characters: everyone we know about so far. **PC Gamer**, 2026. Disponível em:
  https://www.pcgamer.com/games/action/grand-theft-auto/gta6-characters. Acesso em: 18 nov. 2026.
- NOTEBOOKCHECK. GTA 6 now officially delayed to November 2026. **Notebookcheck**, 2025. Disponível em:
  https://www.notebookcheck.net/GTA-6-now-officially-delayed-to-November-2026.1157152.0.html. Acesso em: 18 nov. 2026.
- MAKE TECH EASIER. Grand Theft Auto VI launches 19 November 2026 on PS5 and Xbox Series X|S at $79.99.
  **Make Tech Easier**, 2026. Disponível em: https://maketecheasier.com/gta-6-release-date-price-preload/.
  Acesso em: 18 nov. 2026.

**Sobre acessibilidade, usabilidade e desenvolvimento:**

- W3C. **Web Content Accessibility Guidelines (WCAG) 2.2**. W3C Recommendation, 2023. Disponível em:
  https://www.w3.org/TR/WCAG22/. Acesso em: 18 nov. 2026.
- W3C. Understanding Success Criterion 1.4.3: Contrast (Minimum). **W3C WAI**. Disponível em:
  https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html. Acesso em: 18 nov. 2026.
- W3C. Understanding Success Criterion 2.5.8: Target Size (Minimum). **W3C WAI**. Disponível em:
  https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html. Acesso em: 18 nov. 2026.
- W3C. Carousel (Slide Show or Image Rotator) Pattern. **ARIA Authoring Practices Guide**. Disponível em:
  https://www.w3.org/WAI/ARIA/apg/patterns/carousel/. Acesso em: 18 nov. 2026.
- W3C. Tabs Pattern. **ARIA Authoring Practices Guide**. Disponível em:
  https://www.w3.org/WAI/ARIA/apg/patterns/tabs/. Acesso em: 18 nov. 2026.
- NIELSEN, Jakob. 10 usability heuristics for user interface design. **Nielsen Norman Group**, 1994
  (atualizado). Disponível em: https://www.nngroup.com/articles/ten-usability-heuristics/. Acesso em: 18 nov. 2026.
- WEBAIM. Contrast Checker. **WebAIM**. Disponível em: https://webaim.org/resources/contrastchecker/.
  Acesso em: 18 nov. 2026.
- BOOTSTRAP. **Bootstrap 5.3 documentation**. Disponível em: https://getbootstrap.com/docs/5.3/.
  Acesso em: 18 nov. 2026.
- BOOTSTRAP. Color modes. **Bootstrap 5.3 documentation**. Disponível em:
  https://getbootstrap.com/docs/5.3/customize/color-modes/. Acesso em: 18 nov. 2026.
- MDN WEB DOCS. prefers-reduced-motion. **Mozilla**. Disponível em:
  https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion. Acesso em: 18 nov. 2026.
- MDN WEB DOCS. prefers-color-scheme. **Mozilla**. Disponível em:
  https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme. Acesso em: 18 nov. 2026.
- DEQUE SYSTEMS. **axe-core**: accessibility engine for automated web UI testing. Versão 4.10.2. Disponível em:
  https://github.com/dequelabs/axe-core. Acesso em: 18 nov. 2026.
- BRAILLE INSTITUTE. **Atkinson Hyperlegible Font**. Disponível em: https://www.brailleinstitute.org/freefont/.
  Acesso em: 18 nov. 2026.

### D.2 IAs usadas

| IA | Como foi usada |
|---|---|
| **Claude Opus 5.5** (Anthropic), via **Claude Code** (aplicativo desktop) | Pesquisa na web sobre o status de GTA VI e as fontes; proposta do plano (nome, páginas, paleta); geração do código HTML, CSS e JavaScript; script de cálculo de contraste; geração das imagens provisórias em SVG; testes no navegador embutido (teclado, formulário, login, 320px, alto contraste); auditoria com axe-core e correção dos problemas encontrados; prints; rascunho do README, deste relatório e da documentação. |

**Uso honesto:** o código e os textos de documentação foram gerados com a IA a partir das minhas
instruções e revisados por mim: [descreva aqui o que você revisou, mudou ou decidiu]. A **redação da
Parte C foi escrita por mim, sem IA**, como pede o enunciado.

### D.3 Ferramentas aplicadas

| Ferramenta | Para quê |
|---|---|
| Visual Studio Code | Edição do código |
| Git | Controle de versão (commits por etapa) |
| GitHub | Hospedagem do repositório e histórico de versões |
| GitHub Pages | Publicação do site |
| Bootstrap 5.3.3 e Bootstrap Icons 1.11.3 | Framework CSS e ícones |
| Google Fonts | Fontes Inter, Sora e Atkinson Hyperlegible |
| Python 3 | Script de contraste e gerador de imagens provisórias |
| `tools/contraste.py` (verificador próprio) e WebAIM Contrast Checker | Análise de contraste |
| axe-core 4.10.2 | Auditoria automática de acessibilidade |
| Lighthouse (Chrome DevTools) | Auditoria de acessibilidade [rodar e anexar o print] |
| Chrome/Edge DevTools | Modo dispositivo (320px e 375px), console e depuração |
| Claude Code | Assistente de IA (veja D.2) |

---

## Parte E: HTML, CSS, JS e CSS Frameworks

### E.1 Resumo técnico

O Guia Leonida é um site **estático** de 7 páginas, feito em **HTML5 semântico, CSS3 e JavaScript puro**,
com **Bootstrap 5.3.3** como framework CSS. Não tem etapa de build: funciona abrindo o arquivo, num
servidor simples ou no GitHub Pages.

- **CSS:** a paleta é um conjunto de *tokens* (custom properties) em `themes.css`, redefinidos para os modos
  claro (`data-bs-theme="light"`), escuro (`data-bs-theme="dark"`) e alto contraste
  (`data-contraste="alto"`). Os tokens alimentam as variáveis do próprio Bootstrap (`--bs-body-bg`,
  `--bs-link-color`, botões), então os componentes do framework seguem a paleta sem CSS duplicado.
  `style.css` traz os componentes (cards, carrossel, abas, formulários, linha do tempo) e as classes de
  acessibilidade aplicadas no `<html>`.
- **JavaScript:** um arquivo por responsabilidade, todos comentados em português. `theme.js` roda no
  `<head>` para evitar o "flash" de tema. Os dados ficam em `data.js` (objeto `GLDados`) e são
  renderizados dinamicamente por `search.js`. A comunicação entre módulos usa eventos personalizados
  (`gl:tema`, `gl:a11y`, `gl:favoritos`, `gl:sessao`). O `localStorage` guarda tema, preferências de
  acessibilidade, contas simuladas, favoritos e checklist, sempre dentro de `try/catch`.
- **Bootstrap usado:** grid, navbar com collapse, offcanvas (painel de acessibilidade), modal (detalhes),
  tabs (login), toasts (avisos), breadcrumb, utilitários e `data-bs-theme` para o modo escuro.
- **Acessibilidade:** padrões WAI-ARIA para carrossel e abas, `aria-live` para anúncios,
  `aria-describedby` e `aria-invalid` nos formulários, `role="progressbar"` no checklist e
  `aria-pressed` nos botões de alternância.
- **Versões:** 12 ou mais commits em português, um por etapa (veja `git log --oneline`).

### E.2 Índice de arquivos (anexar)

| Arquivo | Linhas | Descrição |
|---|---|---|
| `index.html` | 395 | Página inicial: hero, status do lançamento, carrossel, cards explicativos, destaques, novidades |
| `guia.html` | 241 | Catálogo com busca, abas e estado vazio |
| `mapa.html` | 283 | Mapa SVG, tabela e cards das regiões |
| `checklist.html` | 222 | Checklist de progresso e favoritos |
| `contato.html` | 278 | Formulário de contato |
| `login.html` | 321 | Login e cadastro simulados |
| `acessibilidade.html` | 289 | Painel e declaração de acessibilidade |
| `css/themes.css` | 218 | Tokens de cor dos três modos e integração com o Bootstrap |
| `css/style.css` | ~920 | Componentes, layout responsivo e classes de acessibilidade |
| `js/theme.js` | 124 | Tema claro/escuro e aplicação antecipada das preferências |
| `js/main.js` | ~243 | Utilidades, anúncios `aria-live`, toasts, contagem e novidades |
| `js/a11y.js` | 210 | Painel de acessibilidade |
| `js/auth.js` | ~260 | Login/cadastro simulados, favoritos e checklist por usuário |
| `js/data.js` | 547 | Dados do catálogo, novidades e checklist, com fontes |
| `js/search.js` | 361 | Cards, busca, abas, favoritos e modal |
| `js/carousel.js` | 157 | Carrossel acessível |
| `js/form.js` | 337 | Validação acessível de formulários |
| `js/checklist.js` | 154 | Checklist e barra de progresso |
| `tools/contraste.py` | ~315 | Cálculo de contraste (WCAG) e geração de `docs/contraste.md` |
| `tools/gerar_placeholders.py` | ~400 | Gerador das imagens provisórias SVG |

> Para a Parte E, anexe a pasta do projeto compactada (.zip) ou o link do repositório, como o enunciado
> permite.

---

## Apêndice: formas de acessar o site

1. **Site publicado (GitHub Pages):** [https://SEU-USUARIO.github.io/guia-leonida/]
2. **Repositório (código e histórico de versões):** [https://github.com/SEU-USUARIO/guia-leonida]
3. **Localmente, sem instalar nada:** baixe ou descompacte o projeto e dê dois cliques em `index.html`.
4. **Localmente, com servidor (recomendado):** na pasta do projeto, rode `python -m http.server 8000` e
   abra http://localhost:8000. Outra opção é a extensão Live Server do VS Code.
5. **No celular:** abra a URL do GitHub Pages. Sugestão: inclua um QR Code da URL no relatório.

**Navegadores testados:** Chromium (navegador embutido do ambiente de desenvolvimento). Recomenda-se
conferir também no Firefox e no celular antes da entrega.
