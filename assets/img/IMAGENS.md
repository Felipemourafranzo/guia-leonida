# Imagens do Guia Leonida

Todas as imagens desta pasta são **ilustrações provisórias** (SVG no estilo pôr do sol neon), geradas por
`tools/gerar_placeholders.py`. Nenhuma foi baixada da internet. Esta lista diz o que colocar em cada arquivo
quando você for trocar pelas imagens reais.

## Regras para trocar uma imagem

1. **Use só fontes oficiais.** O melhor lugar é o site oficial, que tem trailers, capturas e artes:
   <https://www.rockstargames.com/VI>. Também servem a Rockstar Newswire
   (<https://www.rockstargames.com/newswire>) e o kit de imprensa oficial, se você tiver acesso.
   Não use imagens de sites de fãs, wikis nem de buscas no Google.
2. **Dê o crédito.** Embaixo de cada imagem real, ou na seção de créditos do rodapé, escreva:
   *"Imagem: Rockstar Games (rockstargames.com/VI). Uso não comercial em trabalho acadêmico."*
3. **Mantenha o nome do arquivo** ou atualize o caminho em `js/data.js` (catálogo) ou no HTML (carrossel,
   hero e ilustrações). Se trocar SVG por JPG ou WebP, mude a extensão nos dois lugares.
4. **Reescreva o texto alternativo (`alt`).** Hoje o `alt` descreve a ilustração provisória
   ("Ilustração provisória: …"). Depois da troca, ele precisa descrever a imagem nova. A coluna "Alt sugerido"
   abaixo traz uma base que você deve ajustar ao que aparece de fato na imagem.
5. **Otimize.** Prefira WebP ou JPG com qualidade em torno de 80%. Use até 200 KB nos cards e até
   400 KB no carrossel e no hero.
6. **Contraste.** Se a imagem nova ficar atrás de texto (hero), confira se o texto continua legível. No
   carrossel e nos cards o texto já fica sobre um fundo sólido.

## Lista de arquivos

### Página inicial

| Arquivo | Onde aparece | Tamanho recomendado | O que colocar | Alt sugerido |
|---|---|---|---|---|
| `hero-leonida.svg` | Fundo decorativo do topo da home (`alt=""`) | 1600 × 900 | Panorama de Vice City ao pôr do sol (captura oficial) | Fica `alt=""`, porque é decorativa |
| `carrossel-01-vice-city-noite.svg` | Carrossel, slide 1 | 1600 × 800 (2:1) | Vice City à noite, com neon e orla | "Orla de Vice City à noite, com prédios iluminados em neon e palmeiras" |
| `carrossel-02-leonida-keys.svg` | Carrossel, slide 2 | 1600 × 800 | Ilhas e pontes das Leonida Keys | "Ponte ligando ilhas das Leonida Keys sobre mar azul-turquesa" |
| `carrossel-03-jason-e-lucia.svg` | Carrossel, slide 3 | 1600 × 800 | Arte oficial de Jason e Lucia juntos | "Jason e Lucia lado a lado em arte oficial de GTA VI" |
| `carrossel-04-grassrivers.svg` | Carrossel, slide 4 | 1600 × 800 | Pântano de Grassrivers (captura oficial) | "Canal do pântano de Grassrivers com vegetação alta ao entardecer" |
| `carrossel-05-mount-kalaga.svg` | Carrossel, slide 5 | 1600 × 800 | Montanhas e floresta do Mount Kalaga | "Floresta e montanhas do Mount Kalaga National Park" |

### Personagens (`js/data.js`)

Fonte ideal: página de personagens do site oficial (rockstargames.com/VI), com as artes de cada um.

| Arquivo | Tamanho | O que colocar |
|---|---|---|
| `personagem-jason-duval.svg` | 800 × 500 (16:10) | Arte oficial de Jason Duval |
| `personagem-lucia-caminos.svg` | 800 × 500 | Arte oficial de Lucia Caminos |
| `personagem-cal-hampton.svg` | 800 × 500 | Arte oficial de Cal Hampton |
| `personagem-boobie-ike.svg` | 800 × 500 | Arte oficial de Boobie Ike |
| `personagem-dre-quan-priest.svg` | 800 × 500 | Arte oficial de Dre'Quan Priest |
| `personagem-real-dimez.svg` | 800 × 500 | Arte oficial da dupla Real Dimez (Bae-Luxe e Roxy) |
| `personagem-raul-bautista.svg` | 800 × 500 | Arte oficial de Raul Bautista |
| `personagem-brian-heder.svg` | 800 × 500 | Arte oficial de Brian Heder |

Alt sugerido: "Arte oficial de [Nome], [descrição curta do que aparece: roupa, cenário]".

### Regiões (`js/data.js`, também usadas em `mapa.html`)

Fonte ideal: páginas de lugares (Places) do site oficial.

| Arquivo | Tamanho | O que colocar |
|---|---|---|
| `regiao-vice-city.svg` | 800 × 500 | Captura oficial de Vice City |
| `regiao-leonida-keys.svg` | 800 × 500 | Captura oficial das Leonida Keys |
| `regiao-grassrivers.svg` | 800 × 500 | Captura oficial de Grassrivers |
| `regiao-port-gellhorn.svg` | 800 × 500 | Captura oficial de Port Gellhorn |
| `regiao-ambrosia.svg` | 800 × 500 | Captura oficial de Ambrosia |
| `regiao-mount-kalaga.svg` | 800 × 500 | Captura oficial do Mount Kalaga National Park |

### Veículos (`js/data.js`)

Os nomes e modelos oficiais ainda estão **a confirmar**. Use capturas oficiais onde o tipo de veículo
aparece com clareza (trailers ou galeria de screenshots). Se não houver imagem oficial de um tipo, mantenha
o placeholder.

| Arquivo | Tamanho | O que colocar |
|---|---|---|
| `veiculo-conversivel.svg` | 800 × 500 | Conversível em Vice City |
| `veiculo-muscle-car.svg` | 800 × 500 | Muscle car |
| `veiculo-esportivo.svg` | 800 × 500 | Superesportivo |
| `veiculo-moto.svg` | 800 × 500 | Moto esportiva |
| `veiculo-lancha.svg` | 800 × 500 | Lancha nas Keys |
| `veiculo-aerobarco.svg` | 800 × 500 | Aerobarco no pântano (se houver imagem oficial) |
| `veiculo-picape.svg` | 800 × 500 | Picape em estrada de terra |
| `veiculo-jet-ski.svg` | 800 × 500 | Jet ski na praia (se houver imagem oficial) |

### Outras

| Arquivo | Onde aparece | Tamanho | O que colocar |
|---|---|---|---|
| `ilustracao-contato.svg` | Lateral da página de contato | 800 × 500 | Praia de Vice City ao entardecer |
| `ilustracao-login.svg` | Lateral da página de login | 800 × 500 | Skyline de Vice City em tons de roxo |
| `logo-guia-leonida.svg` | Logo do site (cabeçalho e rodapé) | 64 × 64 (SVG) | **Mantenha**: é a marca do guia, criada para o projeto |
| `favicon.svg` | Ícone da aba do navegador | 64 × 64 (SVG) | **Mantenha** |

> Lembrete legal: o logotipo oficial de GTA VI e as marcas da Rockstar **não** devem ser usados como logo
> do guia. O site é não oficial e o aviso legal do rodapé precisa continuar visível.
