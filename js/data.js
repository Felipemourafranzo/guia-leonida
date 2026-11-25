/* ==========================================================================
   Guia Leonida: data.js
   --------------------------------------------------------------------------
   Todos os dados do site (catálogo, novidades, checklist e status do
   lançamento) ficam aqui, num único objeto global "GLDados".

   Por que um arquivo .js e não .json?
   Ler um .json exige fetch(), e o fetch() é bloqueado quando a página é
   aberta direto pelo arquivo (file://). Com um .js comum o site funciona
   tanto no GitHub Pages quanto com um duplo clique no index.html.

   Regras de conteúdo:
   - Tudo foi conferido em fontes oficiais (site da Rockstar, Newswire, kit
     de mídia oficial) ou em veículos confiáveis. A fonte de cada item fica
     no campo "fonte".
   - status:
       "confirmado"       anunciado pela Rockstar ou mostrado no material oficial
       "sem-confirmacao"  a Rockstar ainda não divulgou (o campo "checado"
                          guarda a data da última checagem)
       "serie"            dica que vale para os GTAs anteriores; checada contra
                          o material oficial de GTA VI na data de "checado"
   - Nada foi inventado. Pesquisa atualizada em 25/11/2026, seis dias depois
     do lançamento (19/11/2026).
   ========================================================================== */
(function () {
  'use strict';

  var CHECADO = '25/11/2026';

  /* Fontes reutilizadas em vários itens */
  var FONTES = {
    siteOficial: {
      titulo: 'Rockstar Games: site oficial de Grand Theft Auto VI',
      url: 'https://www.rockstargames.com/VI'
    },
    soEmLeonida: {
      titulo: 'Rockstar Games: Só em Leonida (pessoas e lugares)',
      url: 'https://www.rockstargames.com/VI/only-in-leonida'
    },
    newswireLancamento: {
      titulo: 'Rockstar Newswire: Grand Theft Auto VI já disponível (19/11/2026)',
      url: 'https://www.rockstargames.com/br/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available'
    },
    newswirePreCarga: {
      titulo: 'Rockstar Newswire: pré-carregamento de GTA VI a partir de 10 de novembro (03/11/2026)',
      url: 'https://www.rockstargames.com/br/newswire/article/k4ak9okk485712/grand-theft-auto-vi-pre-load-begins-on-november-10'
    },
    newswireRadios: {
      titulo: 'Rockstar Newswire: a música de GTA VI, estações de rádio no jogo (08/10/2026)',
      url: 'https://www.rockstargames.com/br/newswire/article/o3982oa93a23k4/the-music-of-grand-theft-auto-vi-in-game-radio-stations'
    },
    newswireAlbumDeluxe: {
      titulo: 'Rockstar Newswire: Grand Theft Auto VI: The Album (Deluxe Edition) (23/11/2026)',
      url: 'https://www.rockstargames.com/br/newswire/article/178ok8411a55o5/grand-theft-auto-vi-the-album-deluxe-edition'
    },
    newswireGaleria: {
      titulo: 'Rockstar Newswire: explore a Galeria de Lançamento de GTA VI (05/11/2026)',
      url: 'https://www.rockstargames.com/br/newswire/article/39ak81277255o9/explore-the-grand-theft-auto-vi-launch-gallery'
    },
    newswireTrilha: {
      titulo: 'Rockstar Newswire: Grand Theft Auto VI: Original Score por Justice (29/10/2026)',
      url: 'https://www.rockstargames.com/br/newswire/article/39ak8a12395591/grand-theft-auto-vi-original-score-by-justice'
    },
    newswireTrailerLancamento: {
      titulo: 'Rockstar Newswire: veja o trailer de lançamento de GTA VI (15/10/2026)',
      url: 'https://www.rockstargames.com/br/newswire/article/517572321a549a/watch-the-grand-theft-auto-vi-launch-trailer'
    },
    newswireData: {
      titulo: 'Rockstar Newswire: GTA VI agora será lançado em 19 de novembro de 2026',
      url: 'https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026'
    },
    newswireBr: {
      titulo: 'Rockstar Newswire (página com todas as notícias)',
      url: 'https://www.rockstargames.com/br/newswire'
    },
    capturasUltimate: {
      titulo: 'Rockstar Games: capturas da Ultimate Edition e do Pacote Vintage Vice City (kit de mídia)',
      url: 'https://www.rockstargames.com/VI/media/screenshots'
    },
    capturas: {
      titulo: 'Rockstar Games: capturas de tela oficiais (kit de mídia)',
      url: 'https://www.rockstargames.com/VI/media/screenshots'
    },
    mapaOficial: {
      titulo: 'Rockstar Games: pôster oficial do mapa de Leonida (ilustrações do kit de mídia)',
      url: 'https://www.rockstargames.com/VI/media/artwork-wallpapers'
    },
    gameInformerRegioes: {
      titulo: 'Game Informer: Rockstar mostra seis grandes áreas de Leonida (06/05/2025)',
      url: 'https://gameinformer.com/2025/05/06/rockstar-shows-off-six-major-areas-of-vice-city-in-grand-theft-auto-vi'
    },
    pcGamerPersonagens: {
      titulo: 'PC Gamer: personagens de GTA 6',
      url: 'https://www.pcgamer.com/games/action/grand-theft-auto/gta6-characters'
    },
    gamesRadar: {
      titulo: 'GamesRadar+: GTA 6, tudo o que sabemos',
      url: 'https://www.gamesradar.com/gta-6-guide/'
    },
    classInd: {
      titulo: 'Portal Viciados: GTA 6 é classificado oficialmente no Brasil (18 anos)',
      url: 'https://viciados.net/exclusivo-gta-6-classificado-oficialmente-brasil/'
    }
  };

  /* ------------------------------------------------------------------------
     Status do lançamento (bloco "Já disponível" e rodapé)
     ------------------------------------------------------------------------ */
  var lancamento = {
    // Meia-noite de 19/11/2026 no horário de Brasília (UTC-3)
    dataISO: '2026-11-19T00:00:00-03:00',
    dataTexto: '19 de novembro de 2026',
    plataformas: 'PlayStation 5 e Xbox Series X|S',
    download: 'até 212 GB, dependendo do console',
    pc: 'sem anúncio oficial',
    online: 'sem anúncio oficial',
    checado: CHECADO,
    fonte: FONTES.newswireLancamento
  };

  /* ------------------------------------------------------------------------
     Catálogo: categorias e itens
     categoria: "veiculos" | "personagens" | "regioes" | "dicas"
     ------------------------------------------------------------------------ */
  var categorias = {
    veiculos: { rotulo: 'Veículos', singular: 'Veículo', icone: 'bi-car-front-fill' },
    personagens: { rotulo: 'Personagens', singular: 'Personagem', icone: 'bi-person-fill' },
    regioes: { rotulo: 'Regiões', singular: 'Região', icone: 'bi-geo-alt-fill' },
    dicas: { rotulo: 'Dicas', singular: 'Dica', icone: 'bi-lightbulb-fill' }
  };

  var itens = [
    /* ---------------------------- Personagens ---------------------------- */
    {
      id: 'jason-duval',
      categoria: 'personagens',
      nome: 'Jason Duval',
      resumo: 'Um dos dois protagonistas. Ex-militar que faz serviços para contrabandistas nas Keys e sonha com uma vida mais tranquila.',
      descricao: 'Jason cresceu cercado de golpistas e trapaceiros, passou pelo Exército e foi parar nas Leonida Keys fazendo trabalhos para contrabandistas locais. Segundo o site oficial, ele quer uma vida mais fácil, até que conhece Lucia e os dois se envolvem num serviço que dá errado.',
      imagem: 'assets/img/jogo/personagem-jason-duval-800.webp',
      alt: 'Jason Duval de boné e regata, com o braço apoiado na janela de um carro, sob luz de fim de tarde',
      tags: ['protagonista', 'jogável', 'Leonida Keys'],
      status: 'confirmado',
      fonte: FONTES.soEmLeonida
    },
    {
      id: 'lucia-caminos',
      categoria: 'personagens',
      nome: 'Lucia Caminos',
      resumo: 'A outra protagonista. Aprendeu a lutar com o pai e saiu da prisão decidida a construir uma vida melhor.',
      descricao: 'Lucia aprendeu a lutar ainda criança, com o pai, e passou boa parte da vida enfrentando batalhas. Lutar pela família a levou à Penitenciária de Leonida. Segundo o site oficial, ao sair ela quer agir de forma mais esperta e garantir um futuro melhor.',
      imagem: 'assets/img/jogo/personagem-lucia-caminos-800.webp',
      alt: 'Lucia Caminos dentro de um carro à noite, com luzes de neon roxas refletidas no vidro',
      tags: ['protagonista', 'jogável', 'Vice City'],
      status: 'confirmado',
      fonte: FONTES.soEmLeonida
    },
    {
      id: 'cal-hampton',
      categoria: 'personagens',
      nome: 'Cal Hampton',
      resumo: 'Amigo e parceiro de Jason. Prefere ficar em casa ouvindo as frequências da Guarda Costeira e adora uma teoria da conspiração.',
      descricao: 'Cal é amigo de Jason e parceiro de Brian. Desconfiado, passa o tempo monitorando rádios da Guarda Costeira e tem opinião sobre tudo. O site oficial o descreve como alguém feliz na "maré baixa" dos Estados Unidos.',
      imagem: 'assets/img/jogo/personagem-cal-hampton-800.webp',
      alt: 'Cal Hampton de chapéu e camisa havaiana verde, em pé num minigolfe com um taco na mão',
      arte: 'assets/img/jogo/arte-cal-hampton-1600.webp',
      arteAlt: "Ilustração oficial: Cal Hampton de boné e óculos escuros sentado na proa de um barco com uma garrafa na mão, perto de uma ponte",
      tags: ['coadjuvante', 'Leonida Keys'],
      status: 'confirmado',
      fonte: FONTES.soEmLeonida
    },
    {
      id: 'boobie-ike',
      categoria: 'personagens',
      nome: 'Boobie Ike',
      resumo: 'Lenda local de Vice City, com negócios que vão de imóveis a uma casa noturna e uma gravadora.',
      descricao: 'Boobie Ike é um empresário famoso nas ruas de Vice City. O site oficial o mostra à frente de vários negócios, entre eles a casa noturna Jack of Hearts e a gravadora Only Raw Records.',
      imagem: 'assets/img/jogo/personagem-boobie-ike-800.webp',
      alt: 'Boobie Ike sentado numa poltrona do escritório, de óculos escuros e camisa estampada',
      arte: 'assets/img/jogo/arte-boobie-ike-1600.webp',
      arteAlt: "Ilustração oficial: Boobie Ike de jaqueta estampada e corrente de ouro, com uma taça na mão numa boate",
      tags: ['coadjuvante', 'Vice City', 'Only Raw Records'],
      status: 'confirmado',
      fonte: FONTES.soEmLeonida
    },
    {
      id: 'dre-quan-priest',
      categoria: 'personagens',
      nome: "Dre'Quan Priest",
      resumo: 'Empresário musical que quer transformar a gravadora Only Raw em sucesso.',
      descricao: "Dre'Quan sempre foi mais malandro do que gângster. Trabalha com Boobie Ike e cuida dos artistas da Only Raw Records, como a dupla Real Dimez.",
      imagem: 'assets/img/jogo/personagem-dre-quan-priest-800.webp',
      alt: 'Dre’Quan Priest num estúdio de gravação, ao lado da mesa de som',
      arte: 'assets/img/jogo/arte-dre-quan-priest-1600.webp',
      arteAlt: "Ilustração oficial: Dre’Quan Priest sentado no capô de um utilitário preto em frente à casa noturna Jack of Hearts",
      tags: ['coadjuvante', 'música', 'Only Raw Records'],
      status: 'confirmado',
      fonte: FONTES.soEmLeonida
    },
    {
      id: 'real-dimez',
      categoria: 'personagens',
      nome: 'Real Dimez',
      resumo: 'Dupla de rap formada por Bae-Luxe e Roxy, que tenta estourar pela Only Raw.',
      descricao: 'Real Dimez é a dupla de rap formada por Bae-Luxe e Roxy, amigas desde a escola. Ficaram famosas nas redes e hoje fazem parte do elenco da Only Raw Records.',
      imagem: 'assets/img/jogo/personagem-real-dimez-800.webp',
      alt: 'Bae-Luxe e Roxy, da dupla Real Dimez, gravando ao microfone num estúdio iluminado em rosa',
      arte: 'assets/img/jogo/arte-real-dimez-1600.webp',
      arteAlt: "Ilustração oficial: Bae-Luxe e Roxy, da dupla Real Dimez, posando diante de um hotel art déco",
      tags: ['coadjuvante', 'música', 'dupla'],
      status: 'confirmado',
      fonte: FONTES.soEmLeonida
    },
    {
      id: 'raul-bautista',
      categoria: 'personagens',
      nome: 'Raul Bautista',
      resumo: 'Assaltante de bancos experiente e confiante, que recruta parceiros para golpes maiores.',
      descricao: 'Raul é apresentado como um ladrão de bancos veterano, carismático e que assume riscos cada vez maiores. Ele procura gente talentosa para trabalhos mais ambiciosos.',
      imagem: 'assets/img/jogo/personagem-raul-bautista-800.webp',
      alt: 'Raul Bautista de braços cruzados no convés de um barco, com prédios ao pôr do sol atrás',
      arte: 'assets/img/jogo/arte-raul-bautista-1600.webp',
      arteAlt: "Ilustração oficial: Raul Bautista de terno branco com uma bolsa de couro no ombro, ajustando as luvas em frente a um muro grafitado",
      tags: ['coadjuvante', 'assaltos'],
      status: 'confirmado',
      fonte: FONTES.soEmLeonida
    },
    {
      id: 'brian-heder',
      categoria: 'personagens',
      nome: 'Brian Heder',
      resumo: 'Contrabandista veterano das Keys. Deixa Jason morar num de seus imóveis em troca de ajuda.',
      descricao: 'Brian é um contrabandista "da velha guarda" das Leonida Keys. Jason mora sem pagar aluguel num de seus imóveis e, em troca, faz serviços para ele.',
      imagem: 'assets/img/jogo/personagem-brian-heder-800.webp',
      alt: 'Brian Heder de camisa florida e óculos no rosto, apontando para alguém enquanto segura um papel',
      arte: 'assets/img/jogo/arte-brian-heder-1600.webp',
      arteAlt: "Ilustração oficial: Brian Heder de camisa estampada debruçado sobre um mapa numa mesa com uma faca e garrafas de cerveja, num galpão de barcos",
      tags: ['coadjuvante', 'Leonida Keys'],
      status: 'confirmado',
      fonte: FONTES.soEmLeonida
    },

    /* ----------------------------- Regiões ------------------------------- */
    {
      id: 'vice-city',
      categoria: 'regioes',
      nome: 'Vice City',
      resumo: 'A cidade grande de Leonida, inspirada em Miami: praias, vida noturna, arte de rua e muito neon.',
      descricao: 'Vice City é o coração urbano do jogo e volta à série depois de GTA Vice City (2002). Fica na costa leste, no condado de Vice-Dale, com Vice Beach do outro lado da baía e o aeroporto VCIA a oeste, segundo o pôster oficial do mapa. Mistura praias lotadas, prédios art déco, festas e uma cena musical forte.',
      imagem: 'assets/img/jogo/regiao-vice-city-800.webp',
      alt: 'Duas torres residenciais curvas na beira da baía de Vice City, com lanchas e jet skis na água',
      postal: 'assets/img/jogo/postal-vice-city-800.webp',
      tags: ['cidade', 'praia', 'vida noturna'],
      inspiracao: 'Miami (Flórida)',
      condado: 'Vice-Dale',
      status: 'confirmado',
      fonte: FONTES.mapaOficial
    },
    {
      id: 'leonida-keys',
      categoria: 'regioes',
      nome: 'Leonida Keys',
      resumo: 'Arquipélago ligado por pontes, inspirado nas Florida Keys. É onde Jason vive no começo da história.',
      descricao: 'As Leonida Keys são ilhas ao sul do estado, ligadas por pontes longas, com marinas, barcos, pesca e bares à beira-mar. No pôster oficial do mapa, a estrada 1A desce de Hamlet até Key Lento e a base aérea Mile Zero. Segundo o site oficial, é ali que Jason vive e trabalha para contrabandistas locais.',
      imagem: 'assets/img/jogo/regiao-leonida-keys-800.webp',
      alt: 'Vista aérea das Leonida Keys: ilhas verdes, mar turquesa, uma ponte longa e um hidroavião',
      postal: 'assets/img/jogo/postal-leonida-keys-800.webp',
      tags: ['ilhas', 'barcos', 'pesca'],
      inspiracao: 'Florida Keys',
      status: 'confirmado',
      fonte: FONTES.mapaOficial
    },
    {
      id: 'grassrivers',
      categoria: 'regioes',
      nome: 'Grassrivers',
      resumo: 'Pântanos e canais cheios de vida selvagem, inspirados nos Everglades.',
      descricao: 'Grassrivers é a região de áreas alagadas, capim alto e canais no sudoeste do estado, no condado de Mariana, segundo o pôster oficial do mapa. As capturas oficiais mostram jacarés, palafitas e aerobarcos; a rádio Back Country "transmite" para a região.',
      imagem: 'assets/img/jogo/regiao-grassrivers-800.webp',
      alt: 'Pântano de Grassrivers com casas sobre palafitas e os prédios de Vice City no horizonte',
      postal: 'assets/img/jogo/postal-grassrivers-800.webp',
      tags: ['pântano', 'natureza', 'jacarés'],
      inspiracao: 'Everglades (Flórida)',
      condado: 'Mariana',
      status: 'confirmado',
      fonte: FONTES.mapaOficial
    },
    {
      id: 'port-gellhorn',
      categoria: 'regioes',
      nome: 'Port Gellhorn',
      resumo: 'Cidade litorânea do oeste, com motéis de estrada, áreas turísticas decadentes e um porto.',
      descricao: 'Port Gellhorn fica na costa oeste de Leonida, no condado de Kelly, segundo o pôster oficial do mapa. É uma cidade que já viveu dias melhores: atrações turísticas envelhecidas, motéis de beira de estrada, píeres e área portuária.',
      imagem: 'assets/img/jogo/regiao-port-gellhorn-800.webp',
      alt: 'Cidade de Port Gellhorn vista do alto ao pôr do sol, com casas baixas e postos de gasolina',
      postal: 'assets/img/jogo/postal-port-gellhorn-800.webp',
      tags: ['litoral', 'porto', 'turismo'],
      condado: 'Kelly',
      status: 'confirmado',
      fonte: FONTES.mapaOficial
    },
    {
      id: 'ambrosia',
      categoria: 'regioes',
      nome: 'Ambrosia',
      resumo: 'O lado industrial de Leonida, no interior do estado, com fábricas e cidades pequenas.',
      descricao: 'Ambrosia fica no centro de Leonida, ao sul do lago Leonida e perto da rodovia 35, segundo o pôster oficial do mapa. Representa o lado industrial do estado, com fábricas e comunidades operárias; as capturas oficiais mostram clubes de motociclistas pelas estradas.',
      imagem: 'assets/img/jogo/regiao-ambrosia-800.webp',
      alt: 'Torres de energia e fábricas de Ambrosia ao pôr do sol, com fumaça no horizonte',
      postal: 'assets/img/jogo/postal-ambrosia-800.webp',
      tags: ['interior', 'indústria'],
      status: 'confirmado',
      fonte: FONTES.mapaOficial
    },
    {
      id: 'mount-kalaga',
      categoria: 'regioes',
      nome: 'Mount Kalaga National Park',
      resumo: 'Parque nacional no norte de Leonida, com trilhas, florestas e atividades como caça e pesca.',
      descricao: 'O Parque Nacional Mount Kalaga fica no norte do estado, no condado de Lummox, segundo o pôster oficial do mapa. É a área mais selvagem de Leonida, com trilhas, rios, mata fechada e, segundo o site oficial, caça e pesca.',
      imagem: 'assets/img/jogo/regiao-mount-kalaga-800.webp',
      alt: 'Estrada passando por um cânion de terra vermelha e mata no Mount Kalaga National Park',
      postal: 'assets/img/jogo/postal-mount-kalaga-800.webp',
      tags: ['natureza', 'trilhas', 'caça e pesca'],
      condado: 'Lummox',
      status: 'confirmado',
      fonte: FONTES.mapaOficial
    },

    /* ----------------------------- Veículos ------------------------------ */
    /* Com nome oficial: aparecem com o nome nas capturas da Ultimate Edition
       e do Pacote Vintage Vice City, publicadas pela Rockstar. */
    {
      id: 'grotti-cheetah',
      categoria: 'veiculos',
      nome: 'Grotti Cheetah (1995)',
      resumo: 'O superesportivo clássico da série, em versão anos 90. Faz parte dos bônus da Ultimate Edition.',
      descricao: 'O Grotti Cheetah (1995) é um dos itens da Ultimate Edition mostrados pela Rockstar no kit de mídia, ao lado de armas, roupas e outros veículos ligados à história de Jason e Lucia. Branco com faixas vermelhas, é o carro mais rápido entre os bônus divulgados.',
      imagem: 'assets/img/jogo/veiculo-grotti-cheetah-800.webp',
      alt: 'Grotti Cheetah (1995) branco com faixas vermelhas na frente de um estacionamento circular',
      tags: ['carro', 'superesportivo', 'Ultimate Edition'],
      status: 'confirmado',
      fonte: FONTES.capturasUltimate
    },
    {
      id: 'shitzu-squalo',
      categoria: 'veiculos',
      nome: 'Shitzu Squalo',
      resumo: 'Lancha veloz para circular entre as ilhas e pela baía de Vice City. Bônus da Ultimate Edition.',
      descricao: 'A Shitzu Squalo é a lancha mostrada nas capturas oficiais da Ultimate Edition. Com tanto litoral em Leonida, é um jeito rápido de ir de Vice City às Keys pela água.',
      imagem: 'assets/img/jogo/veiculo-shitzu-squalo-800.webp',
      alt: 'Lancha Shitzu Squalo branca cortando a baía ao entardecer, com os prédios de Vice City ao fundo',
      tags: ['barco', 'Ultimate Edition'],
      status: 'confirmado',
      fonte: FONTES.capturasUltimate
    },
    {
      id: 'vapid-dominator-buggy',
      categoria: 'veiculos',
      nome: 'Vapid Dominator Buggy (1967)',
      resumo: 'Muscle car antigo preparado para a lama, com faróis no teto. Bônus da Ultimate Edition.',
      descricao: 'O Vapid Dominator Buggy (1967) aparece nas capturas oficiais da Ultimate Edition atravessando trilhas de terra. É a escolha natural para o interior e para as estradas do Mount Kalaga.',
      imagem: 'assets/img/jogo/veiculo-vapid-dominator-buggy-800.webp',
      alt: 'Vapid Dominator Buggy (1967) preto e amarelo com faróis no teto, espirrando lama numa trilha',
      tags: ['carro', 'off-road', 'Ultimate Edition'],
      status: 'confirmado',
      fonte: FONTES.capturasUltimate
    },
    {
      id: 'vapid-ganado',
      categoria: 'veiculos',
      nome: 'Vapid Ganado (composição retrô)',
      resumo: 'Picape-cupê amarela com faixas setentistas, feita para derrapar na orla. Bônus da Ultimate Edition.',
      descricao: 'A Vapid Ganado em "composição retrô" é um dos veículos da Ultimate Edition mostrados pela Rockstar: uma picape-cupê amarela com faixas vermelhas e laranja, em estilo anos 70.',
      imagem: 'assets/img/jogo/veiculo-vapid-ganado-800.webp',
      alt: 'Picape Vapid Ganado amarela com faixas vermelhas e laranja derrapando numa estrada à beira-mar',
      tags: ['carro', 'picape', 'Ultimate Edition'],
      status: 'confirmado',
      fonte: FONTES.capturasUltimate
    },
    {
      id: 'dinka-enduro',
      categoria: 'veiculos',
      nome: 'Dinka Enduro',
      resumo: 'Moto de trilha que fica na casa segura de Jason. Bônus da Ultimate Edition.',
      descricao: 'A Dinka Enduro faz parte dos "veículos da casa segura do Jason", um dos bônus da Ultimate Edition mostrados no kit de mídia oficial. Leve e alta, é boa para atalhos de terra.',
      imagem: 'assets/img/jogo/veiculo-dinka-enduro-800.webp',
      alt: 'Moto Dinka Enduro verde-oliva estacionada na frente de uma porta de garagem verde-água',
      tags: ['moto', 'trilha', 'Ultimate Edition'],
      status: 'confirmado',
      fonte: FONTES.capturasUltimate
    },
    {
      id: 'crest-kayak',
      categoria: 'veiculos',
      nome: 'Crest Kayak',
      resumo: 'Caiaque para remar pelos canais das Keys e pelos rios do interior. Bônus da Ultimate Edition.',
      descricao: 'O caiaque Crest também está entre os veículos da casa segura de Jason na Ultimate Edition. As capturas oficiais mostram Jason remando nos canais das Keys ao pôr do sol.',
      imagem: 'assets/img/jogo/veiculo-crest-kayak-800.webp',
      alt: 'Jason remando um caiaque Crest laranja num canal das Keys ao pôr do sol',
      tags: ['barco', 'remo', 'Ultimate Edition'],
      status: 'confirmado',
      fonte: FONTES.capturasUltimate
    },
    {
      id: 'vapid-stanier',
      categoria: 'veiculos',
      nome: 'Vapid Stanier (1955)',
      resumo: 'Sedã clássico amarelo e branco do Pacote Vintage Vice City.',
      descricao: 'O Vapid Stanier (1955) é o carro do Pacote Vintage Vice City, complemento digital que, segundo a Rockstar, recorda a época em que o neon brilhava mais forte. Foi oferecido junto com a compra até o dia do lançamento.',
      imagem: 'assets/img/jogo/veiculo-vapid-stanier-800.webp',
      alt: 'Vapid Stanier (1955) amarelo e branco estacionado numa rua de Vice City à noite, sob luzes de neon',
      tags: ['carro', 'clássico', 'Vintage Vice City'],
      status: 'confirmado',
      fonte: FONTES.newswireLancamento
    },
    {
      id: 'aerobarco',
      categoria: 'veiculos',
      nome: 'Aerobarco de Grassrivers',
      resumo: 'Barco com hélice de avião, feito para o pântano. O modelo ainda não tem nome divulgado.',
      descricao: 'O aerobarco é o veículo típico dos Everglades, que inspiram Grassrivers. Ele aparece nas capturas oficiais e é citado pela Rockstar na apresentação da rádio Back Country. O nome do modelo não foi divulgado até a última checagem.',
      imagem: 'assets/img/jogo/veiculo-aerobarco-800.webp',
      alt: 'Aerobarco visto de cima atravessando a água escura de Grassrivers entre plantas aquáticas',
      tags: ['barco', 'Grassrivers', 'pântano'],
      status: 'confirmado',
      checado: CHECADO,
      fonte: FONTES.newswireRadios
    },
    {
      id: 'conversivel',
      categoria: 'veiculos',
      nome: 'Conversível vermelho',
      resumo: 'O carro aberto de Jason e Lucia nas capturas oficiais. Nome do modelo não divulgado.',
      descricao: 'Jason e Lucia aparecem num conversível vermelho à beira-mar nas capturas oficiais. A Rockstar não divulgou o nome do modelo até a última checagem. Bom para passear pela orla, mas não protege quem está dentro.',
      imagem: 'assets/img/jogo/veiculo-conversivel-800.webp',
      alt: 'Jason dirigindo um conversível vermelho com Lucia no banco do passageiro, à beira-mar',
      tags: ['carro', 'passeio', 'Vice City'],
      status: 'sem-confirmacao',
      checado: CHECADO,
      fonte: FONTES.capturas
    },
    {
      id: 'muscle-car',
      categoria: 'veiculos',
      nome: 'Muscle car rosa',
      resumo: 'Potente e barulhento, com pintura personalizada. Nome do modelo não divulgado.',
      descricao: 'Um muscle car rosa com pintura personalizada aparece numa rua de Vice City nas capturas oficiais. Na série, esse tipo de carro tem muita aceleração em linha reta e menos estabilidade nas curvas. O nome do modelo não foi divulgado até a última checagem.',
      imagem: 'assets/img/jogo/veiculo-muscle-car-800.webp',
      alt: 'Muscle car rosa com pintura personalizada estacionado numa rua de Vice City, com um rapaz sentado no capô',
      tags: ['carro', 'velocidade'],
      status: 'sem-confirmacao',
      checado: CHECADO,
      fonte: FONTES.capturas
    },
    {
      id: 'picape',
      categoria: 'veiculos',
      nome: 'Picape do pântano',
      resumo: 'Robusta para as estradas de terra e as áreas alagadas. Nome do modelo não divulgado.',
      descricao: 'Uma picape atravessa o pântano de Grassrivers perseguida pela polícia numa das capturas oficiais. Na série, picapes são a melhor escolha para terra e lama. O nome do modelo não foi divulgado até a última checagem.',
      imagem: 'assets/img/jogo/veiculo-picape-800.webp',
      alt: 'Picape atravessando o pântano de Grassrivers perseguida por uma viatura e um helicóptero',
      tags: ['carro', 'off-road', 'Grassrivers'],
      status: 'sem-confirmacao',
      checado: CHECADO,
      fonte: FONTES.capturas
    },
    {
      id: 'jet-ski',
      categoria: 'veiculos',
      nome: 'Jet ski',
      resumo: 'Diversão rápida nas praias de Vice City e nos canais das Keys. Nome do modelo não divulgado.',
      descricao: 'Jet skis aparecem em várias capturas oficiais, na baía de Vice City e nos canais das Keys. São rápidos e fáceis de pilotar, mas não levam muitos passageiros. O nome do modelo não foi divulgado até a última checagem.',
      imagem: 'assets/img/jogo/veiculo-jet-ski-800.webp',
      alt: 'Jet skis e lanchas reunidos num canal das Leonida Keys, com gente tomando sol nos barcos',
      tags: ['aquático', 'praia'],
      status: 'sem-confirmacao',
      checado: CHECADO,
      fonte: FONTES.capturas
    },

    /* ------------------------------ Dicas -------------------------------- */
    {
      id: 'dica-espaco',
      categoria: 'dicas',
      nome: 'Reserve até 212 GB',
      resumo: 'O download de GTA VI pode ocupar até 212 GB, dependendo do console. Libere espaço antes.',
      descricao: 'Segundo a Rockstar, o arquivo do jogo precisa de até 212 GB de espaço, dependendo do aparelho. No PS5, a pré-carga começou em 10/11 à meia-noite do horário local; no Xbox Series X|S, às 00:00 GMT do mesmo dia. As versões com código na caixa chegaram às lojas em 12/11.',
      imagem: 'assets/img/jogo/pagina-login-vice-city-noite-800.webp',
      alt: 'Vice City à noite com uma roda-gigante iluminada perto da baía',
      tags: ['iniciante', 'download'],
      status: 'confirmado',
      fonte: FONTES.newswirePreCarga
    },
    {
      id: 'dica-mapa',
      categoria: 'dicas',
      nome: 'Baixe o pôster do mapa',
      resumo: 'A Rockstar liberou de graça o pôster oficial do mapa de Leonida, pronto para imprimir.',
      descricao: 'No dia do lançamento, a Rockstar publicou no site oficial o pôster do mapa de Leonida e da arte de capa, prontos para imprimir. Uma versão física dupla-face sai na Loja da Rockstar. O nosso mapa usa esse pôster, com zoom e as seis regiões marcadas.',
      imagem: 'assets/img/jogo/mapa-leonida-poster-1200.webp',
      alt: 'Pôster oficial do mapa do estado de Leonida: a ilha principal com Vice City, Vice Beach, Port Gellhorn, Ambrosia, Grassrivers e o Mount Kalaga, os condados, as estradas e as Leonida Keys ao sul',
      tags: ['iniciante', 'mapa'],
      status: 'confirmado',
      fonte: FONTES.newswireLancamento
    },
    {
      id: 'dica-regioes',
      categoria: 'dicas',
      nome: 'Explore uma região de cada vez',
      resumo: 'Leonida é grande. Use o nosso mapa por regiões para planejar o passeio.',
      descricao: 'São seis regiões principais: Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia e Mount Kalaga. Explorar uma de cada vez ajuda a não se perder e a marcar o progresso no checklist.',
      imagem: 'assets/img/jogo/tour-ambrosia-800.webp',
      alt: 'Grupo de motociclistas numa estrada de Ambrosia, com postes, lojas e um letreiro antigo ao fundo',
      tags: ['iniciante', 'mapa'],
      status: 'confirmado',
      fonte: FONTES.mapaOficial
    },
    {
      id: 'dica-radio',
      categoria: 'dicas',
      nome: 'Ouça as rádios (e os podcasts)',
      resumo: 'Flash FM, Cocoteo FM, Back Country, AfroBank FM, The Chamber 106.6 e Dirty South Classics, entre outras.',
      descricao: 'A Rockstar diz que GTA VI tem a maior seleção de rádios da série. Pela primeira vez há podcasts sob demanda, e Jason e Lucia podem ouvir tudo a pé, com fones ligados ao celular. Algumas estações: Flash FM (pop), Cocoteo FM (música latina), Rádio Back Country (country), AfroBank FM (música africana), The Chamber 106.6 (metal) e Dirty South Classics (rap do Sul).',
      imagem: 'assets/img/jogo/colagem-lucia-bar-600.webp',
      alt: 'Lucia de jaqueta de couro sentada numa moto amarela em frente a um letreiro de neon de bar',
      tags: ['diversão', 'música'],
      status: 'confirmado',
      fonte: FONTES.newswireRadios
    },
    {
      id: 'dica-acessibilidade',
      categoria: 'dicas',
      nome: 'Ajuste legendas e controles antes',
      resumo: 'Antes da primeira missão, ajuste legendas, tamanho do texto, brilho e controles.',
      descricao: 'Jogos da Rockstar trazem opções de legendas, tamanho do texto e mapeamento de controles. Ajuste tudo antes de começar para não perder diálogos importantes.',
      imagem: 'assets/img/jogo/arte-jason-lucia-motel-800.webp',
      alt: 'Ilustração oficial: Jason e Lucia descansando numa cama de motel, com uma bolsa de viagem ao lado',
      tags: ['iniciante', 'configurações'],
      status: 'serie',
      checado: CHECADO,
      fonte: FONTES.gamesRadar
    },
    {
      id: 'dica-historia',
      categoria: 'dicas',
      nome: 'Comece pela história',
      resumo: 'As primeiras missões costumam ensinar os controles e liberar partes do mapa.',
      descricao: 'Nos GTAs anteriores, as missões iniciais funcionam como tutorial e liberam regiões e atividades aos poucos. Vale seguir a história antes de sair explorando tudo.',
      imagem: 'assets/img/jogo/editorial-jason-lucia-carro-800.webp',
      alt: 'Lucia e Jason de pistola na mão, vistos de dentro de um carro, sob um céu de fim de tarde',
      tags: ['iniciante', 'missões'],
      status: 'serie',
      checado: CHECADO,
      fonte: FONTES.gamesRadar
    },
    {
      id: 'dica-procurado',
      categoria: 'dicas',
      nome: 'Fique de olho no nível de procurado',
      resumo: 'Na série, sair da vista da polícia é a forma mais rápida de despistar uma perseguição.',
      descricao: 'Nos GTAs anteriores, o nível de procurado sobe com cada crime e cai quando você sai do campo de visão da polícia. Evite chamar atenção logo no começo.',
      imagem: 'assets/img/jogo/editorial-jason-moto-800.webp',
      alt: 'Jason pilotando uma moto azul à noite, iluminado pelas luzes de uma viatura',
      tags: ['iniciante', 'polícia'],
      status: 'serie',
      checado: CHECADO,
      fonte: FONTES.gamesRadar
    },
    {
      id: 'dica-online',
      categoria: 'dicas',
      nome: 'Modo online: sem anúncio',
      resumo: 'O lançamento de 19/11 é do modo história. A Rockstar não anunciou um modo online para GTA VI.',
      descricao: 'Até a última checagem, a Rockstar não anunciou modo online nem versão para PC de GTA VI. O GTA Online atual continua recebendo novidades no Newswire. Desconfie de sites que prometem acesso antecipado ou "dinheiro grátis".',
      imagem: 'assets/img/jogo/galeria-vice-city-noite-800.webp',
      alt: 'Prédios de Vice City iluminados à noite, vistos do alto, com um helicóptero sobre o centro',
      tags: ['online', 'segurança'],
      status: 'sem-confirmacao',
      checado: CHECADO,
      fonte: FONTES.newswireBr
    },
    {
      id: 'dica-pausas',
      categoria: 'dicas',
      nome: 'Respeite a classificação e faça pausas',
      resumo: 'Mature 17+ pela ESRB e 18 anos pela classificação indicativa brasileira.',
      descricao: 'GTA VI tem conteúdo adulto, com violência, linguagem forte e compras dentro do jogo. A ESRB classificou como Mature 17+, e a classificação indicativa brasileira é de 18 anos (não recomendado para menores de 18). Faça pausas e jogue com moderação.',
      imagem: 'assets/img/jogo/pagina-checklist-caiaque-800.webp',
      alt: 'Pessoa remando um caiaque laranja num rio do Mount Kalaga, perto de uma ponte de ferro',
      tags: ['saúde', 'classificação'],
      status: 'confirmado',
      fonte: FONTES.classInd
    }
  ];

  /* ------------------------------------------------------------------------
     Novidades (linha do tempo), da mais nova para a mais antiga
     ------------------------------------------------------------------------ */
  var novidades = [
    {
      data: '2026-11-23',
      dataTexto: '23/11/2026',
      titulo: 'The Album (Deluxe Edition)',
      texto: 'A Rockstar anunciou a edição deluxe de GTA VI: The Album, o disco de músicas originais lançado junto com o jogo.',
      fonte: FONTES.newswireAlbumDeluxe
    },
    {
      data: '2026-11-19',
      dataTexto: '19/11/2026',
      titulo: 'GTA VI já disponível',
      texto: 'O jogo chegou ao mundo inteiro no PS5 e no Xbox Series X|S. No mesmo dia, a Rockstar liberou de graça o pôster oficial do mapa de Leonida e o álbum com 34 músicas.',
      fonte: FONTES.newswireLancamento
    },
    {
      data: '2026-11-10',
      dataTexto: '10/11/2026',
      titulo: 'Pré-carga liberada',
      texto: 'O download antecipado começou no PS5 (meia-noite do horário local) e no Xbox Series X|S (00:00 GMT). O arquivo ocupa até 212 GB.',
      fonte: FONTES.newswirePreCarga
    },
    {
      data: '2026-11-05',
      dataTexto: '05/11/2026',
      titulo: 'Galeria de lançamento',
      texto: 'Uma coleção de novas capturas de tela de Leonida foi publicada no site oficial.',
      fonte: FONTES.newswireGaleria
    },
    {
      data: '2026-10-29',
      dataTexto: '29/10/2026',
      titulo: 'Trilha original por Justice',
      texto: 'A Rockstar apresentou a trilha original do jogo, assinada pela dupla francesa Justice.',
      fonte: FONTES.newswireTrilha
    },
    {
      data: '2026-10-15',
      dataTexto: '15/10/2026',
      titulo: 'Trailer de lançamento',
      texto: 'O último trailer antes da estreia foi publicado no site oficial e no YouTube.',
      fonte: FONTES.newswireTrailerLancamento
    },
    {
      data: '2026-10-08',
      dataTexto: '08/10/2026',
      titulo: 'As rádios de Leonida',
      texto: 'Seis estações foram apresentadas (entre elas Flash FM e Cocoteo FM), junto com a novidade dos podcasts sob demanda.',
      fonte: FONTES.newswireRadios
    },
    {
      data: '2025-11-06',
      dataTexto: '06/11/2025',
      titulo: 'Nova data: 19 de novembro de 2026',
      texto: 'A Rockstar mudou o lançamento de 26/05/2026 para 19/11/2026, para dar mais tempo de polimento ao jogo.',
      fonte: FONTES.newswireData
    },
    {
      data: '2025-05-06',
      dataTexto: '06/05/2025',
      titulo: 'Trailer 2 e novo site oficial',
      texto: 'O segundo trailer apresentou Jason e Lucia em detalhes, e o site oficial ganhou páginas sobre personagens e as seis regiões de Leonida.',
      fonte: FONTES.gameInformerRegioes
    },
    {
      data: '2023-12-05',
      dataTexto: '05/12/2023',
      titulo: 'Primeiro trailer',
      texto: 'O trailer 1 revelou a volta a Vice City, o estado de Leonida e a protagonista Lucia.',
      fonte: FONTES.gamesRadar
    }
  ];

  /* ------------------------------------------------------------------------
     Checklist de progresso (salvo por usuário em checklist.js)
     ------------------------------------------------------------------------ */
  var checklist = [
    {
      grupo: 'Antes de jogar',
      icone: 'bi-hourglass-split',
      itens: [
        { id: 'ler-dicas', texto: 'Ler as dicas para iniciantes do guia' },
        { id: 'espaco', texto: 'Liberar até 212 GB no console' },
        { id: 'pre-carga', texto: 'Baixar o jogo (pré-carga ou download)' },
        { id: 'config', texto: 'Ajustar legendas e opções de acessibilidade do jogo' }
      ]
    },
    {
      grupo: 'Primeiros passos',
      icone: 'bi-flag',
      itens: [
        { id: 'primeira-missao', texto: 'Concluir a primeira missão' },
        { id: 'jogar-jason', texto: 'Jogar uma missão com o Jason' },
        { id: 'jogar-lucia', texto: 'Jogar uma missão com a Lucia' },
        { id: 'radio', texto: 'Ouvir uma estação de rádio por uma viagem inteira' }
      ]
    },
    {
      grupo: 'Explorar Leonida',
      icone: 'bi-map',
      itens: [
        { id: 'visitar-vice-city', texto: 'Visitar Vice City' },
        { id: 'visitar-keys', texto: 'Visitar as Leonida Keys' },
        { id: 'visitar-grassrivers', texto: 'Visitar Grassrivers' },
        { id: 'visitar-port-gellhorn', texto: 'Visitar Port Gellhorn' },
        { id: 'visitar-ambrosia', texto: 'Visitar Ambrosia' },
        { id: 'visitar-kalaga', texto: 'Visitar o Mount Kalaga National Park' }
      ]
    },
    {
      grupo: 'Veículos',
      icone: 'bi-car-front',
      itens: [
        { id: 'dirigir-carro', texto: 'Dirigir um carro pela orla de Vice City' },
        { id: 'pilotar-barco', texto: 'Pilotar um barco entre as ilhas' },
        { id: 'pilotar-moto', texto: 'Pilotar uma moto' },
        { id: 'off-road', texto: 'Fazer uma trilha off-road no interior' }
      ]
    }
  ];

  /* Exporta tudo num objeto global, somente leitura */
  window.GLDados = Object.freeze({
    fontes: FONTES,
    lancamento: lancamento,
    categorias: categorias,
    itens: itens,
    novidades: novidades,
    checklist: checklist
  });
})();
