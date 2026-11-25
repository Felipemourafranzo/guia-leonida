# Imagens do Guia Leonida

Todas as imagens de `assets/img/jogo/` são **capturas reais de Grand Theft Auto VI** tiradas do
**kit de mídia oficial da Rockstar Games** (<https://www.rockstargames.com/VI/media>), baixadas direto
do CDN da Rockstar. Nenhuma é fan art, montagem ou imagem gerada por IA, e nenhuma tem o logo, a marca
"VI" ou textos da Rockstar por cima.

**Crédito:** © Rockstar Games. Uso não comercial em trabalho acadêmico, com o aviso legal do rodapé.

## Formato

- Cada imagem existe em dois tamanhos WebP (qualidade 78): `nome-1600.webp` e `nome-800.webp`, 16:9.
- No HTML: `srcset` com os dois tamanhos, `width`/`height` e `loading="lazy"` (menos no hero, que usa
  `fetchpriority="high"`).
- O texto alternativo sugerido de cada uma está na tabela e em `assets/img/jogo/manifesto.json`.
- A folha de contato fica em `docs/folha-de-contato.html` e `docs/prints/redesign/etapa1-folha-de-contato.jpg`.

## Origem

| Pacote oficial | URL |
|---|---|
| Capturas de tela (138 imagens, 3840×2160) | <https://media-rockstargames-com.akamaized.net/VI/downloads/screenshots/GTAVI_Screenshots.zip> |
| Benefícios da Ultimate Edition (51 imagens) | <https://media-rockstargames-com.akamaized.net/VI/downloads/screenshots/GTAVI_Ultimate_Edition_Benefits.zip> |
| Ilustrações e fundos de tela (28 artes, inclui o pôster do mapa e os cartões-postais) | <https://media-rockstargames-com.akamaized.net/VI/downloads/artwork_wallpapers/GTAVI_Artwork_Wallpapers.zip> |
| Pacote Vintage Vice City (12 imagens) | <https://media-rockstargames-com.akamaized.net/VI/downloads/screenshots/GTAVI_Vintage_Vice_City_Pack.zip> |
| Videoclipes (9 clipes) | <https://media-rockstargames-com.akamaized.net/VI/downloads/videos/GTAVI_Videos.zip> |

Páginas de onde os pacotes são baixados: <https://www.rockstargames.com/VI/media> (capturas, ilustrações e vídeos).
O processamento (WebP, recorte do logo e quadros das cenas) é feito por `tools/processar_kit.py`.


## Galeria (carrossel da página inicial)

| Arquivo | Original no kit | Pacote | Alt |
|---|---|---|---|
| `galeria-vice-city-noite` | `Vice_City_27.jpg` | Capturas de tela | Prédios de Vice City iluminados à noite, vistos do alto, com um helicóptero sobre o centro |
| `galeria-keys-mergulho` | `Leonida_Keys_04.jpg` | Capturas de tela | Mergulhadores sob a água azul das Leonida Keys, ao lado de uma tartaruga marinha e de um navio afundado |
| `galeria-jason-lucia-abraco` | `Jason_and_Lucia_13.jpg` | Capturas de tela | Jason e Lucia abraçados à beira d’água ao entardecer, com um helicóptero no céu |
| `galeria-grassrivers-noite` | `Grassrivers_08.jpg` | Capturas de tela | Lanterna iluminando um jacaré no pântano de Grassrivers à noite, sob a lua crescente |
| `galeria-kalaga-helicoptero` | `Mount_Kalaga_National_Park_02.jpg` | Capturas de tela | Helicóptero vermelho e branco sobrevoando a mata do Mount Kalaga com o sol baixo atrás |

## Regiões (catálogo e mapa)

| Arquivo | Original no kit | Pacote | Alt |
|---|---|---|---|
| `regiao-vice-city` | `Vice_City_10.jpg` | Capturas de tela | Duas torres residenciais curvas na beira da baía de Vice City, com lanchas e jet skis na água |
| `regiao-leonida-keys` | `Leonida_Keys_01.jpg` | Capturas de tela | Vista aérea das Leonida Keys: ilhas verdes, mar turquesa, uma ponte longa e um hidroavião |
| `regiao-grassrivers` | `Grassrivers_05.jpg` | Capturas de tela | Pântano de Grassrivers com casas sobre palafitas e os prédios de Vice City no horizonte |
| `regiao-port-gellhorn` | `Port_Gellhorn_06.jpg` | Capturas de tela | Cidade de Port Gellhorn vista do alto ao pôr do sol, com casas baixas e postos de gasolina |
| `regiao-ambrosia` | `Ambrosia_04.jpg` | Capturas de tela | Torres de energia e fábricas de Ambrosia ao pôr do sol, com fumaça no horizonte |
| `regiao-mount-kalaga` | `Mount_Kalaga_National_Park_04.jpg` | Capturas de tela | Estrada passando por um cânion de terra vermelha e mata no Mount Kalaga National Park |

## Tour pelas 6 regiões (página inicial)

Escolhidas na folha de contato entre as capturas que o site ainda não usava.

| Arquivo | Original no kit | Pacote | Alt |
|---|---|---|---|
| `tour-vice-city` | `Vice_City_11.jpg` | Capturas de tela | Prédio alto de Vice City ao pôr do sol, com a baía, as ilhas e um helicóptero ao fundo |
| `tour-leonida-keys` | `Leonida_Keys_06.jpg` | Capturas de tela | Iguana verde tomando sol numa pedra, com o mar azul e uma ilhota das Leonida Keys atrás |
| `tour-grassrivers` | `Grassrivers_02.jpg` | Capturas de tela | Casas e um restaurante sobre palafitas na água verde de Grassrivers, com um barco passando |
| `tour-port-gellhorn` | `Port_Gellhorn_01.jpg` | Capturas de tela | Letreiro de neon do Starlit Motel aceso no começo da noite em Port Gellhorn, entre palmeiras |
| `tour-ambrosia` | `Ambrosia_01.jpg` | Capturas de tela | Grupo de motociclistas numa estrada de Ambrosia, com postes, lojas e um letreiro antigo ao fundo |
| `tour-mount-kalaga` | `Mount_Kalaga_National_Park_05.jpg` | Capturas de tela | Veados bebendo água num riacho no meio da mata do Mount Kalaga National Park |

## Bloco "Jason e Lucia" e citação (página inicial)

| Arquivo | Original no kit | Pacote | Alt |
|---|---|---|---|
| `editorial-lucia-noite` | `Jason_and_Lucia_10.jpg` | Capturas de tela | Lucia de vestido sentada na beira de uma cama, com a janela aberta para os prédios iluminados de Vice City |
| `editorial-jason-lucia-carro` | `Jason_and_Lucia_17.jpg` | Capturas de tela | Lucia e Jason de pistola na mão, vistos de dentro de um carro, sob um céu de fim de tarde |
| `editorial-jason-moto` | `Jason_Duval_11.jpg` | Capturas de tela | Jason pilotando uma moto azul à noite, iluminado pelas luzes de uma viatura |
| `citacao-vice-city-posto` | `Vice_City_22.jpg` | Capturas de tela | Avenida de Vice City ao anoitecer, com o letreiro de um posto de gasolina e os prédios do centro atrás |

## Veículos com nome oficial (catálogo)

Os nomes vêm das legendas oficiais das capturas da Ultimate Edition e do Pacote Vintage Vice City
(<https://www.rockstargames.com/VI/media/screenshots>).

| Arquivo | Original no kit | Pacote | Alt |
|---|---|---|---|
| `veiculo-conversivel` | `Jason_and_Lucia_11.jpg` | Capturas de tela | Jason dirigindo um conversível vermelho com Lucia no banco do passageiro, à beira-mar |
| `veiculo-muscle-car` | `Vice_City_24.jpg` | Capturas de tela | Muscle car rosa com pintura personalizada estacionado numa rua de Vice City, com um rapaz sentado no capô |
| `veiculo-aerobarco` | `Grassrivers_03.jpg` | Capturas de tela | Aerobarco visto de cima atravessando a água escura de Grassrivers entre plantas aquáticas |
| `veiculo-picape` | `Grassrivers_04.jpg` | Capturas de tela | Picape atravessando o pântano de Grassrivers perseguida por uma viatura e um helicóptero |
| `veiculo-jet-ski` | `Leonida_Keys_05.jpg` | Capturas de tela | Jet skis e lanchas reunidos num canal das Leonida Keys, com gente tomando sol nos barcos |
| `veiculo-grotti-cheetah` | `ULTIMATE_EDITION_GROTTI_CHEETAH_01.jpg` | Ultimate Edition | Grotti Cheetah (1995) branco com faixas vermelhas na frente de um estacionamento circular |
| `veiculo-shitzu-squalo` | `ULTIMATE_EDITION_SQUALO_01.jpg` | Ultimate Edition | Lancha Shitzu Squalo branca cortando a baía ao entardecer, com os prédios de Vice City ao fundo |
| `veiculo-dinka-enduro` | `ULTIMATE_EDITION_SAFEHOUSE_VEHICLES_02.jpg` | Ultimate Edition | Moto Dinka Enduro verde-oliva estacionada na frente de uma porta de garagem verde-água |
| `veiculo-crest-kayak` | `ULTIMATE_EDITION_SAFEHOUSE_VEHICLES_03.jpg` | Ultimate Edition | Jason remando um caiaque Crest laranja num canal das Keys ao pôr do sol |
| `veiculo-vapid-dominator-buggy` | `ULTIMATE_EDITION_VAPID_BUGGY_01.jpg` | Ultimate Edition | Vapid Dominator Buggy (1967) preto e amarelo com faróis no teto, espirrando lama numa trilha |
| `veiculo-vapid-ganado` | `ULTIMATE_EDITION_VAPID_GANADO_RETRO_BUILD_01.jpg` | Ultimate Edition | Picape Vapid Ganado amarela com faixas vermelhas e laranja derrapando numa estrada à beira-mar |
| `veiculo-vapid-stanier` | `VINTAGE_VICE_CITY_PACK_VAPID_STANIER_01.jpg` | Vintage Vice City | Vapid Stanier (1955) amarelo e branco estacionado numa rua de Vice City à noite, sob luzes de neon |

## Personagens (catálogo)

| Arquivo | Original no kit | Pacote | Alt |
|---|---|---|---|
| `personagem-jason-duval` | `Jason_Duval_02.jpg` | Capturas de tela | Jason Duval de boné e regata, com o braço apoiado na janela de um carro, sob luz de fim de tarde |
| `personagem-lucia-caminos` | `Lucia_Caminos_10.jpg` | Capturas de tela | Lucia Caminos dentro de um carro à noite, com luzes de neon roxas refletidas no vidro |
| `personagem-cal-hampton` | `Cal_Hampton_01.jpg` | Capturas de tela | Cal Hampton de chapéu e camisa havaiana verde, em pé num minigolfe com um taco na mão |
| `personagem-boobie-ike` | `Boobie_Ike_01.jpg` | Capturas de tela | Boobie Ike sentado numa poltrona do escritório, de óculos escuros e camisa estampada |
| `personagem-dre-quan-priest` | `DreQuan_Priest_04.jpg` | Capturas de tela | Dre’Quan Priest num estúdio de gravação, ao lado da mesa de som |
| `personagem-real-dimez` | `Real_Dimez_04.jpg` | Capturas de tela | Bae-Luxe e Roxy, da dupla Real Dimez, gravando ao microfone num estúdio iluminado em rosa |
| `personagem-raul-bautista` | `Raul_Bautista_03.jpg` | Capturas de tela | Raul Bautista de braços cruzados no convés de um barco, com prédios ao pôr do sol atrás |
| `personagem-brian-heder` | `Brian_Heder_03.jpg` | Capturas de tela | Brian Heder de camisa florida e óculos no rosto, apontando para alguém enquanto segura um papel |

## Veículos sem nome divulgado (catálogo)

| Arquivo | Original no kit | Pacote | Alt |
|---|---|---|---|
| `veiculo-conversivel` | `Jason_and_Lucia_11.jpg` | Capturas de tela | Jason dirigindo um conversível vermelho com Lucia no banco do passageiro, à beira-mar |
| `veiculo-muscle-car` | `Vice_City_24.jpg` | Capturas de tela | Muscle car rosa com pintura personalizada estacionado numa rua de Vice City, com um rapaz sentado no capô |
| `veiculo-aerobarco` | `Grassrivers_03.jpg` | Capturas de tela | Aerobarco visto de cima atravessando a água escura de Grassrivers entre plantas aquáticas |
| `veiculo-picape` | `Grassrivers_04.jpg` | Capturas de tela | Picape atravessando o pântano de Grassrivers perseguida por uma viatura e um helicóptero |
| `veiculo-jet-ski` | `Leonida_Keys_05.jpg` | Capturas de tela | Jet skis e lanchas reunidos num canal das Leonida Keys, com gente tomando sol nos barcos |

## Dica das rádios (recorte vertical 4:5 em 1200 e 600 px)

| Arquivo | Original no kit | Pacote | Alt |
|---|---|---|---|
| `colagem-lucia-bar` | `Lucia_Caminos_03.jpg` | Capturas de tela | Lucia de jaqueta de couro sentada numa moto amarela em frente a um letreiro de neon de bar |

## Páginas internas

| Arquivo | Original no kit | Pacote | Alt |
|---|---|---|---|
| `pagina-contato-rusty-anchor` | `Leonida_Keys_03.jpg` | Capturas de tela | Bar de praia The Rusty Anchor nas Leonida Keys, com mesas ao ar livre e palmeiras |
| `pagina-login-vice-city-noite` | `Vice_City_08.jpg` | Capturas de tela | Vice City à noite com uma roda-gigante iluminada perto da baía |
| `pagina-guia-murais` | `Vice_City_09.jpg` | Capturas de tela | Rua de Vice City sob um viaduto coberto de murais coloridos, com um carro azul e motos |
| `pagina-checklist-caiaque` | `Mount_Kalaga_National_Park_06.jpg` | Capturas de tela | Pessoa remando um caiaque laranja num rio do Mount Kalaga, perto de uma ponte de ferro |

## Mapa de Leonida

| Arquivo | Original no kit | Pacote | Alt |
|---|---|---|---|
| `mapa-leonida-poster` (2400 e 1200 px, retrato) | `Leonida_Map_Poster.jpg` (2805×3840) | Ilustrações e fundos de tela | Pôster oficial do mapa do estado de Leonida: a ilha principal com Vice City, Vice Beach, Port Gellhorn, Ambrosia, Grassrivers e o Mount Kalaga, os condados, as estradas e as Leonida Keys ao sul |

O pôster foi publicado pela Rockstar no dia do lançamento (19/11/2026) na página de ilustrações do kit de mídia.
O `mapa.html` usa o pôster com zoom e marcadores (`js/mapa.js`); o arquivo antigo `mapa-leonida.webp`, sem origem
registrada, foi apagado.

## Logo de GTA VI (abertura da página inicial)

| Arquivo | Original no kit | Pacote | Alt |
|---|---|---|---|
| `logo-gta-vi` (1100 e 550 px, fundo transparente) | `Jason_and_Lucia_Robbery_With_Logo_landscape.jpg` | Ilustrações e fundos de tela | Grand Theft Auto VI |

O logo branco foi **recortado** da arte oficial "com logotipo": a mesma arte existe sem o logo, então a
opacidade de cada pixel sai da diferença entre as duas (`tools/processar_kit.py`). O logo da Rockstar (R\*)
**não** é usado em nenhum lugar do site.

## Ilustrações oficiais

| Arquivo | Original no kit | Alt |
|---|---|---|
| `arte-jason-lucia-praia` (+ `-retrato-900`) | `Jason_and_Lucia_Beach_landscape.jpg` / `_phone.jpg` | Ilustração oficial: Lucia abraçada a Jason na beira da baía ao pôr do sol, com palmeiras e os prédios de Vice City atrás |
| `arte-jason-lucia-terraco` (+ `-retrato-900`) | `Jason_Lucia_Rooftop_landscape.jpg` / `_phone.jpg` | Ilustração oficial: Jason com uma pistola e Lucia com uma espingarda num terraço, com a baía de Vice City iluminada atrás |
| `arte-jason-lucia-a-postos` | `Jason_Lucia_Lock_And_Load_landscape.jpg` | Ilustração oficial: Jason de regata em pé e Lucia sentada no capô de um carro vermelho, conferindo as armas ao entardecer |
| `arte-jason-lucia-motel` | `Jason_and_Lucia_Motel_landscape.jpg` | Ilustração oficial: Jason e Lucia descansando numa cama de motel, com uma bolsa de viagem ao lado |
| `arte-boobie-ike` | `Boobie_Ike_landscape.jpg` | Ilustração oficial: Boobie Ike de jaqueta estampada e corrente de ouro, com uma taça na mão numa boate |
| `arte-brian-heder` | `Brian_Heder_landscape.jpg` | Ilustração oficial: Brian Heder de camisa estampada debruçado sobre um mapa numa mesa com uma faca e garrafas de cerveja, num galpão de barcos |
| `arte-cal-hampton` | `Cal_Hampton_landscape.jpg` | Ilustração oficial: Cal Hampton de boné e óculos escuros sentado na proa de um barco com uma garrafa na mão, perto de uma ponte |
| `arte-dre-quan-priest` | `DreQuan_Priest_landscape.jpg` | Ilustração oficial: Dre’Quan Priest sentado no capô de um utilitário preto em frente à casa noturna Jack of Hearts |
| `arte-raul-bautista` | `Raul_Bautista_landscape.jpg` | Ilustração oficial: Raul Bautista de terno branco com uma bolsa de couro no ombro, ajustando as luvas em frente a um muro grafitado |
| `arte-real-dimez` | `Real_Dimez_landscape.jpg` | Ilustração oficial: Bae-Luxe e Roxy, da dupla Real Dimez, posando diante de um hotel art déco |

A arte do álbum, a arte de capa oficial e as versões "com logotipos" **não** são usadas: elas trazem o logo da Rockstar.
As ilustrações dos coadjuvantes aparecem na janela de detalhes de cada personagem no guia.

## Cartões-postais das 6 regiões

| Arquivo | Original no kit | Alt |
|---|---|---|
| `postal-vice-city` | `Vice_City_Postcard_landscape.jpg` | Cartão-postal oficial “Visit Leonida” de Vice City: prédios da cidade à beira da baía turquesa, com jet skis na água |
| `postal-leonida-keys` | `Leonida_Keys_Postcard_landscape.jpg` | Cartão-postal oficial “Visit Leonida” das Leonida Keys: ilhas e mar turquesa vistos do alto, com um hidroavião |
| `postal-grassrivers` | `Grassrivers_Postcard_landscape.jpg` | Cartão-postal oficial “Visit Leonida” de Grassrivers: pântano visto do alto ao pôr do sol, com um barco deixando rastro na água |
| `postal-port-gellhorn` | `Port_Gellhorn_Postcard_landscape.jpg` | Cartão-postal oficial “Visit Leonida” de Port Gellhorn: a cidade vista do alto ao anoitecer, com as ruas iluminadas |
| `postal-ambrosia` | `Ambrosia_Postcard_landscape.jpg` | Cartão-postal oficial “Visit Leonida” de Ambrosia: fábricas e chaminés soltando fumaça ao pôr do sol |
| `postal-mount-kalaga` | `Mount_Kalaga_National_Park_Postcard_landscape.jpg` | Cartão-postal oficial “Visit Leonida” do Mount Kalaga National Park: rio no meio da mata fechada, com o sol atravessando as árvores |

## Cenas de vídeo (quadros em `assets/cenas/`)

| Pasta | Original no kit | Pacote | Quadros |
|---|---|---|---|
| `assets/cenas/lucia/` | `Lucia_Caminos_Video_Clip.mp4` (3840×2160, 45 quadros, 1,5 s) | Videoclipes | 87 em 1280 px (computador) e 44 em 720 px (celular), WebP |

Os videoclipes oficiais são curtos (30 a 45 quadros). Para a cena andar macia com a rolagem, o ffmpeg cria
os quadros intermediários (`minterpolate`, interpolação por movimento). O texto alternativo do primeiro
quadro e de cada imagem parada (modo "Reduzir animações") está no HTML da cena e em `cena.json`.

## Folha de contato

`docs/folha-de-contato-kit.html` mostra todo o material novo e, em miniatura (480 px, `docs/folha-de-contato/`),
as capturas do kit que ainda não usamos e o pacote Vintage Vice City, para escolher as que entram no site.

## Marca do Guia Leonida

`assets/img/favicon.svg` e `assets/img/logo-guia-leonida.svg` são a marca própria do guia: um sol de fim de
tarde cortado por faixas, em degradê pôr do sol. **Não** imitam o logo oficial de GTA VI nem o da Rockstar.
As ilustrações SVG provisórias antigas (e o `tools/gerar_placeholders.py`, que as gerava) foram apagadas:
toda imagem do site agora é oficial.
