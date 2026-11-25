# Guia Leonida

**Guia de fã não oficial de *Grand Theft Auto VI*.** Ele reúne veículos, personagens, regiões do mapa,
dicas para iniciantes, novidades e um checklist de progresso. Foi feito como projeto final da disciplina
**Desenvolvimento de Interfaces (2/2026)**, com foco em acessibilidade (WCAG 2.2 AA), contraste de cores e
usabilidade.

> **Aviso legal:** o Guia Leonida é um site de fã, não oficial e sem fins lucrativos. Ele não tem
> afiliação com a Rockstar Games nem com a Take-Two Interactive. Grand Theft Auto, GTA e Rockstar Games são
> marcas dos seus respectivos donos.

---

## Sumário

1. [O que é o site](#1-o-que-é-o-site)
2. [Tecnologias e por que foram escolhidas](#2-tecnologias-e-por-que-foram-escolhidas)
3. [Estrutura de pastas](#3-estrutura-de-pastas)
4. [Como rodar localmente](#4-como-rodar-localmente)
5. [Como publicar no GitHub e ativar o GitHub Pages](#5-como-publicar-no-github-e-ativar-o-github-pages)
6. [Passo a passo da construção (diário de desenvolvimento)](#6-passo-a-passo-da-construção-diário-de-desenvolvimento)
7. [Decisões de design](#7-decisões-de-design)
8. [Acessibilidade](#8-acessibilidade)
9. [Login simulado: não é autenticação real](#9-login-simulado-não-é-autenticação-real)
10. [Dados e fontes](#10-dados-e-fontes)
11. [Créditos](#11-créditos)

---

## 1. O que é o site

O Guia Leonida ajuda quem vai jogar GTA VI (lançado em 19/11/2026 para PS5 e Xbox Series X|S) a conhecer
o mundo do jogo antes e durante as primeiras horas. Tudo que está no site tem fonte, e o que ainda não foi
confirmado oficialmente aparece como **"a confirmar"**.

| Página | O que tem |
|---|---|
| `index.html` | Hero com busca rápida e status do lançamento (contagem que vira "Já disponível"), carrossel, cards explicativos, destaques do catálogo, linha do tempo de novidades e resumo do progresso |
| `guia.html` | Catálogo com **busca em tempo real**, **abas por categoria** (Veículos, Personagens, Regiões e Dicas), filtro "só favoritos", estado "nenhum resultado" e janela de detalhes com a fonte |
| `mapa.html` | Mapa esquemático clicável de Leonida, tabela das regiões e cards das seis regiões |
| `checklist.html` | Checklist de progresso com **barra de porcentagem salva por usuário** e lista "Meus favoritos" |
| `contato.html` | **Formulário** com validação acessível e envio simulado |
| `login.html` | **Login e cadastro** simulados (localStorage) |
| `acessibilidade.html` | **Painel de acessibilidade** completo e declaração de acessibilidade |

Em todas as páginas há um botão **Acessibilidade** no cabeçalho, que abre um painel lateral (offcanvas)
com tema claro/escuro, tamanho do texto, alto contraste, reduzir animações, fonte para dislexia, mais
espaçamento e sublinhar links.

## 2. Tecnologias e por que foram escolhidas

| Tecnologia | Uso | Por quê |
|---|---|---|
| **HTML5 semântico** | Estrutura das 7 páginas | `header`, `nav`, `main`, `footer`, `section`, `article` e títulos em ordem dão estrutura para leitores de tela e buscadores |
| **CSS3 com custom properties** | `css/themes.css` e `css/style.css` | A paleta vira "tokens" (`--cor-primaria` etc.) e cada tema só redefine os tokens |
| **Bootstrap 5.3.3** (CDN jsDelivr, versão fixa e SRI) | Grid, navbar, offcanvas, modal, abas do login e toasts | Framework CSS pedido no enunciado. A versão 5.3 tem modo escuro nativo por `data-bs-theme` e componentes com bom suporte a acessibilidade. A versão é fixa (`@5.3.3`) e tem hash de integridade (SRI) para o site não quebrar nem carregar código alterado |
| **Bootstrap Icons 1.11.3** | Ícones | Combina com o Bootstrap; os ícones são decorativos (`aria-hidden="true"`) e sempre vêm com texto |
| **JavaScript puro** (sem framework) | Busca, carrossel, formulário, login, tema e painel | Sem etapa de build: funciona abrindo o arquivo, num servidor simples ou no GitHub Pages |
| **Google Fonts** | Inter (texto), Sora (títulos) e Atkinson Hyperlegible (opção para dislexia) | Fontes legíveis e gratuitas |
| **Python** (só nas ferramentas) | `tools/contraste.py` e `tools/gerar_placeholders.py` | Cálculo de contraste pela fórmula da WCAG e geração das imagens provisórias |

**Por que não há build:** o enunciado pede um site simples de publicar e avaliar. Sem npm, bundler nem
framework, qualquer pessoa abre o `index.html` e vê o site funcionando.

## 3. Estrutura de pastas

```
guiaGta6/
├── index.html              Início
├── guia.html               Catálogo com busca e abas
├── mapa.html               Regiões de Leonida
├── checklist.html          Checklist de progresso e favoritos
├── contato.html            Formulário de contato
├── login.html              Login e cadastro (simulados)
├── acessibilidade.html     Painel e declaração de acessibilidade
├── css/
│   ├── themes.css          Paleta (tokens) dos modos claro, escuro e alto contraste + ligação com o Bootstrap
│   └── style.css           Componentes, layout e classes de acessibilidade
├── js/
│   ├── theme.js            Tema claro/escuro (carregado no <head> para evitar "flash")
│   ├── main.js             Utilidades comuns, anúncios aria-live, toasts, contagem e novidades
│   ├── a11y.js             Painel de acessibilidade
│   ├── auth.js             Login/cadastro simulados, favoritos e checklist por usuário
│   ├── data.js             Dados do catálogo, novidades e checklist (com fontes)
│   ├── search.js           Cards, busca em tempo real, abas, favoritos e modal de detalhes
│   ├── carousel.js         Carrossel acessível
│   ├── form.js             Validação acessível dos formulários
│   └── checklist.js        Checklist e barra de progresso
├── assets/img/             Imagens provisórias em SVG + IMAGENS.md (o que colocar em cada uma)
├── data/README.md          Explica por que os dados estão em js/data.js
├── docs/
│   ├── contraste.md        Tabela de contraste gerada pelo script
│   ├── auditoria-acessibilidade.md   Resultado do axe-core e dos testes manuais
│   ├── relatorio-rascunho.md         Rascunho do relatório (Partes A a E e apêndice)
│   └── prints/             Capturas de tela para o relatório
└── tools/
    ├── contraste.py        Calcula a razão de contraste (WCAG) e gera docs/contraste.md
    └── gerar_placeholders.py   Gera as imagens provisórias
```

## 4. Como rodar localmente

**Opção 1: abrir direto.** Dê dois cliques em `index.html`. O site funciona assim porque os dados estão
em `js/data.js`, e não num `.json` que precisaria de servidor. O login também funciona (no Chrome e no
Edge, a senha usa a Web Crypto API).

**Opção 2 (recomendada): servidor local.** Na pasta do projeto, rode:

```bash
python -m http.server 8000
```

Depois abra <http://localhost:8000>. Outra opção é usar a extensão **Live Server** do VS Code
(botão direito no `index.html` → *Open with Live Server*).

**Regenerar a tabela de contraste** (depois de mudar alguma cor):

```bash
python tools/contraste.py
```

## 5. Como publicar no GitHub e ativar o GitHub Pages

O repositório git já existe nesta pasta, com o histórico de commits. Falta só enviar para o GitHub:

1. Entre em <https://github.com/new> e crie um repositório **público** chamado, por exemplo,
   `guia-leonida`. **Não** marque "Add a README" (o projeto já tem um).
2. No terminal, dentro da pasta do projeto, ligue o repositório local ao remoto e envie:

   ```bash
   git remote add origin https://github.com/SEU-USUARIO/guia-leonida.git
   ```

   ```bash
   git push -u origin main
   ```
3. No GitHub, abra **Settings → Pages**. Em *Build and deployment*, escolha **Source: Deploy from a
   branch**, **Branch: `main`** e a pasta **`/ (root)`**. Clique em **Save**.
4. Espere de 1 a 2 minutos. O site vai ficar em `https://SEU-USUARIO.github.io/guia-leonida/`.
5. Atualize o link "Código no GitHub" do rodapé: nos 7 arquivos HTML, troque o `href="https://github.com/"`
   do link marcado com `data-link-repositorio` pela URL do seu repositório. No VS Code, use
   *Localizar e substituir em arquivos* (Ctrl+Shift+H).

Como todos os caminhos do site são relativos (`css/style.css`, `js/main.js`), ele funciona dentro da
subpasta do GitHub Pages sem nenhuma configuração extra.

## 6. Passo a passo da construção (diário de desenvolvimento)

Cada etapa virou um ou mais commits. O histórico completo está em `git log --oneline`.

### Etapa 0: pesquisa e planejamento
- Leitura do enunciado (`ProjetoFinal_DI.docx`) e lista dos requisitos obrigatórios.
- Pesquisa do status de GTA VI em 18/11/2026: lançamento confirmado para **19/11/2026** (PS5 e Xbox
  Series X|S), PC e GTA Online sem data. Fontes: site oficial e Newswire da Rockstar, Game Informer,
  GamesRadar+ e PC Gamer (lista completa no relatório).
- Plano aprovado: nome **Guia Leonida**, 7 páginas e paleta "pôr do sol neon".

### Etapa 1: estrutura (`Estrutura inicial do projeto Guia Leonida`)
- `git init`, pastas, `.gitignore` e README inicial.

### Etapa 2: paleta, temas e contraste (`Paleta neon, temas claro/escuro/alto contraste…`)
- Paleta como tokens CSS em `css/themes.css`, com três conjuntos: claro, escuro e alto contraste.
- Tokens ligados às variáveis do Bootstrap (`--bs-body-bg`, `--bs-link-color`…) e aos botões.
- `tools/contraste.py`: script que aplica a fórmula da WCAG a cada par texto/fundo e gera
  `docs/contraste.md`. As cores foram ajustadas até **todos os pares** passarem no AA.
- `js/theme.js`: alternância claro/escuro que respeita `prefers-color-scheme` e salva a escolha no
  `localStorage`. Ele é carregado no `<head>` para evitar o "flash" de tema errado.

### Etapa 3: layout base e página inicial (`Layout base, página inicial e imagens provisórias`)
- Cabeçalho com link "Pular para o conteúdo", menu responsivo, botão de tema e botão de acessibilidade.
- Rodapé completo: navegação, canais oficiais, links de acessibilidade, aviso legal e créditos.
- Home: hero com busca rápida e status do lançamento, cards explicativos e linha do tempo.
- `js/data.js` com todo o conteúdo e a fonte de cada item.
- Imagens provisórias SVG desenhadas por `tools/gerar_placeholders.py`, sem baixar nada da internet.

### Etapa 4: carrossel (`Carrossel de imagens acessível`)
- Padrão "Carousel" do WAI-ARIA: botão pausar/reproduzir, setas, indicadores, teclado (← → Home End),
  pausa ao passar o mouse ou focar, e respeito a `prefers-reduced-motion`.

### Etapa 5: catálogo, busca e abas (`Catálogo com busca em tempo real…`)
- Busca sem acentos e sem diferenciar maiúsculas, com contadores por aba e estado "nenhum resultado".
- Abas no padrão WAI-ARIA Tabs (setas do teclado); a URL acompanha a busca (`?q=barco&cat=veiculos`).
- Modal de detalhes (Bootstrap) com a fonte de cada informação.

### Etapa 6: mapa (`Página de regiões com mapa esquemático e tabela`)
- SVG clicável e fora de escala (com aviso de que não é o mapa oficial), tabela e cards das regiões.

### Etapa 7: contato (`Formulário de contato com validação acessível…`)
- `js/form.js`: erros ligados por `aria-describedby`, `aria-invalid`, resumo de erros com links e foco,
  anúncios por `aria-live`, contador de caracteres e envio simulado com protocolo.

### Etapa 8: login, favoritos e checklist (`Login e cadastro simulados…`)
- Abas Entrar/Criar conta, botão "mostrar senha" e aviso de que o login é simulado.
- Favoritos e checklist salvos **por usuário**; barra de progresso com `role="progressbar"`.

### Etapa 9: acessibilidade (`Painel e página de acessibilidade…`)
- Painel offcanvas em todas as páginas e página com a declaração de acessibilidade.

### Etapa 10: testes e correções (`Correções da auditoria…` e seguintes)
- **axe-core 4.10.2** em todas as páginas, nos modos claro, escuro e alto contraste. Problemas
  encontrados e corrigidos: contraste do `<code>`, `<aside>` dentro do `<main>`, título em degradê com
  laranja neon (abaixo de 3:1 no modo claro).
- Testes manuais: teclado, 320px e 375px, fonte em 150%, formulário, login e carrossel.
- Correções de layout: rolagem horizontal em 320px, menu que se sobrepunha com fonte grande, rótulo das
  imagens do carrossel e tamanho da imagem no modal.
- Prints em `docs/prints/`.

### Etapa 11: documentação
- Este README, `docs/relatorio-rascunho.md`, `docs/auditoria-acessibilidade.md` e `assets/img/IMAGENS.md`.

### Etapa 12: redesign "trailer de rolagem", parte 1 (material oficial e protótipo)
- Estudo do site oficial (rockstargames.com/VI e /VI/only-in-leonida): fundo roxo-noite (#0c0d1b),
  títulos condensados art déco em caixa alta, texto curto, fotos em tela cheia, rolagem suave (Lenis),
  cenas presas na tela com o texto entrando aos poucos.
- Kit de mídia oficial baixado após o lançamento: ilustrações (com o pôster do mapa e os cartões-postais
  das 6 regiões), videoclipes e o pacote Vintage Vice City. `tools/processar_kit.py` converte tudo para
  WebP, recorta o logo de GTA VI com transparência (diferença entre a arte com e sem logotipo) e extrai os
  quadros da cena de vídeo com o ffmpeg. Os clipes oficiais têm só 1 a 1,5 s, então os quadros
  intermediários são interpolados (`minterpolate`).
- `docs/folha-de-contato-kit.html` (gerada por `tools/folha_de_contato.py`) mostra o material novo e as
  112 capturas ainda não usadas, com caixas para escolher as que entram no site.
- Protótipo em `prototipo/abertura.html` (`css/cenas.css` + `js/cenas.js`): abertura com a marca, o logo de
  GTA VI e a frase em degradê acendendo palavra por palavra, e a cena da Lucia desenhada num `<canvas>`
  conforme a rolagem (87 quadros em 1280 px; 44 em 720 px no celular). GSAP 3.15.0 + ScrollTrigger e
  Lenis 1.3.27 pelo jsDelivr, com SRI. Com "Reduzir animações" ou `prefers-reduced-motion`, a página fica
  parada e a cena vira três imagens em sequência; a troca no painel vale na hora, sem recarregar.
- axe-core sem violações em quatro pontos da rolagem. O axe mostrou que `autoAlpha` (visibility: hidden)
  tirava o `<h1>` do leitor de tela quando a abertura passava; a animação agora usa só `opacity`, e um link
  apagado reaparece ao receber foco.
- Prints em `docs/prints/redesign/prototipo-*.jpg`.

## 7. Decisões de design

- **Identidade "pôr do sol neon":** rosa, laranja, roxo e ciano lembram a Vice City dos anos 80 e o
  pôr do sol de Miami. No modo escuro a base é um roxo-noite (`#0E0A1F`); no claro, um tom areia de praia
  (`#FFF8F2`).
- **Neon só como decoração:** as cores neon puras (`#FF2D95`, `#FF8A3D`) reprovam no contraste, por isso
  ficam apenas em faixas e ilustrações. O texto usa versões ajustadas (veja `docs/contraste.md`).
- **Cards como unidade de conteúdo:** todo item do catálogo tem o mesmo card (imagem, selo de categoria
  com ícone e texto, resumo, status e ações). Isso deixa a interface previsível (heurística de
  consistência).
- **"A confirmar" visível:** os itens sem confirmação oficial têm selo com ícone de ampulheta. Assim a
  interface é honesta sobre o status de cada informação.
- **Engajamento:** favoritos, checklist com porcentagem, status do lançamento que muda sozinho e
  selo "Novo desde sua última visita" na linha do tempo.

## 8. Acessibilidade

Meta: **WCAG 2.2 nível AA**. Resumo do que foi aplicado (detalhes em `acessibilidade.html` e em
`docs/auditoria-acessibilidade.md`):

- `lang="pt-BR"`, link "Pular para o conteúdo", landmarks e títulos em ordem.
- Foco visível de 3px em tudo; o site inteiro funciona pelo teclado.
- Contraste calculado: todos os pares de texto passam de 4,5:1 nos três modos.
- `alt` em todas as imagens; as decorativas usam `alt=""`.
- Formulários com rótulos, erros em texto ligados por `aria-describedby` e anunciados por `aria-live`.
- Alvos de toque de pelo menos 44px (a WCAG 2.5.8 pede 24px).
- Nenhuma informação só por cor: categorias, abas, erros e favoritos também têm ícone ou texto.
- `prefers-reduced-motion` e `prefers-color-scheme` respeitados.
- Layout de 320px até desktop, sem rolagem horizontal, e funcional com fonte em 150%.

## 9. Login simulado: NÃO é autenticação real

O site não tem servidor. O "login" guarda as contas no **localStorage** do navegador:

- Qualquer pessoa com acesso ao navegador pode ver ou apagar os dados nas ferramentas de desenvolvedor.
- A senha é guardada como hash SHA-256 só para não ficar em texto puro. Sem servidor, isso **não** é
  segurança de verdade.
- Os dados não passam de um navegador para outro nem de um computador para outro.

O objetivo é apenas demonstrar a interface de login e permitir favoritos e checklist por usuário. Num
site real, a autenticação precisaria de um backend com HTTPS, senhas com hash e *salt* no servidor
(bcrypt ou Argon2) e sessões seguras. O mesmo vale para o formulário de contato, que simula o envio.

## 10. Dados e fontes

Todo o conteúdo está em `js/data.js`, e cada item tem o campo `fonte` com título e URL. A pesquisa foi
feita em **18/11/2026**. As referências completas, em formato ABNT, estão em
`docs/relatorio-rascunho.md` (Parte D).

## 11. Créditos

- Desenvolvimento: **Felipe Moura Franzo**, disciplina Desenvolvimento de Interfaces (2/2026).
- Assistência de IA: Claude Opus 5.5 (Anthropic), via Claude Code. O uso está descrito na Parte D do
  relatório.
- [Bootstrap](https://getbootstrap.com/) e [Bootstrap Icons](https://icons.getbootstrap.com/) (licença MIT).
- Fontes: [Inter](https://fonts.google.com/specimen/Inter), [Sora](https://fonts.google.com/specimen/Sora)
  e [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible) (SIL Open Font License).
- Ilustrações provisórias: criadas pelo script `tools/gerar_placeholders.py`.
- Grand Theft Auto VI, personagens e lugares: © Rockstar Games / Take-Two Interactive. Site sem afiliação.
