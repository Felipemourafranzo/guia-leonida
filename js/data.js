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
   - Tudo foi conferido em fontes oficiais (site da Rockstar, Newswire) ou
     em veículos confiáveis. A fonte de cada item fica no campo "fonte".
   - O que não foi confirmado oficialmente tem status "a-confirmar" e o
     texto diz "a confirmar". Nada foi inventado.
   - Pesquisa feita em 18/11/2026.
   ========================================================================== */
(function () {
  'use strict';

  /* Fontes reutilizadas em vários itens */
  var FONTES = {
    siteOficial: {
      titulo: 'Rockstar Games: site oficial de Grand Theft Auto VI',
      url: 'https://www.rockstargames.com/VI'
    },
    newswireData: {
      titulo: 'Rockstar Newswire: GTA VI agora será lançado em 19 de novembro de 2026',
      url: 'https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026'
    },
    gameInformerRegioes: {
      titulo: 'Game Informer: Rockstar mostra seis grandes áreas de Leonida (06/05/2025)',
      url: 'https://gameinformer.com/2025/05/06/rockstar-shows-off-six-major-areas-of-vice-city-in-grand-theft-auto-vi'
    },
    pcGamerPersonagens: {
      titulo: 'PC Gamer: personagens de GTA 6 conhecidos até agora',
      url: 'https://www.pcgamer.com/games/action/grand-theft-auto/gta6-characters'
    },
    gamesRadar: {
      titulo: 'GamesRadar+: GTA 6, tudo o que sabemos',
      url: 'https://www.gamesradar.com/gta-6-guide/'
    }
  };

  /* ------------------------------------------------------------------------
     Status do lançamento (usado na contagem regressiva da página inicial)
     ------------------------------------------------------------------------ */
  var lancamento = {
    // Meia-noite do dia 19/11/2026 no horário de Brasília (UTC-3).
    // O horário exato de liberação em cada loja: a confirmar.
    dataISO: '2026-11-19T00:00:00-03:00',
    dataTexto: '19 de novembro de 2026',
    plataformas: 'PlayStation 5 e Xbox Series X|S',
    pc: 'a confirmar (sem data oficial)',
    online: 'a confirmar (sem data oficial)',
    preco: 'a confirmar no Brasil (fontes internacionais citam US$ 79,99 para a edição padrão)',
    fonte: FONTES.siteOficial
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
      resumo: 'Um dos dois protagonistas. Ex-militar que hoje faz serviços para traficantes nas Keys e sonha com uma vida mais tranquila.',
      descricao: 'Jason cresceu cercado de golpistas e trapaceiros, passou pelo Exército e foi parar nas Leonida Keys fazendo trabalhos para contrabandistas locais. Segundo o site oficial, ele quer uma vida mais fácil, até que conhece Lucia e os dois se envolvem num golpe que dá errado.',
      imagem: 'assets/img/jogo/personagem-jason-duval-800.webp',
      alt: "Jason Duval de boné e regata, com o braço apoiado na janela de um carro, sob luz de fim de tarde",
      tags: ['protagonista', 'jogável', 'Leonida Keys'],
      status: 'confirmado',
      fonte: FONTES.siteOficial
    },
    {
      id: 'lucia-caminos',
      categoria: 'personagens',
      nome: 'Lucia Caminos',
      resumo: 'A outra protagonista. Aprendeu a lutar com o pai e saiu da prisão decidida a construir uma vida melhor.',
      descricao: 'Lucia aprendeu a lutar ainda criança, com o pai, e passou boa parte da vida enfrentando batalhas. Lutar pela família a levou à Penitenciária de Leonida. Segundo o site oficial, ao sair ela quer agir de forma mais esperta e garantir um futuro melhor.',
      imagem: 'assets/img/jogo/personagem-lucia-caminos-800.webp',
      alt: "Lucia Caminos dentro de um carro à noite, com luzes de neon roxas refletidas no vidro",
      tags: ['protagonista', 'jogável', 'Vice City'],
      status: 'confirmado',
      fonte: FONTES.siteOficial
    },
    {
      id: 'cal-hampton',
      categoria: 'personagens',
      nome: 'Cal Hampton',
      resumo: 'Amigo e parceiro de Jason. Prefere ficar em casa ouvindo as frequências da Guarda Costeira e adora uma teoria da conspiração.',
      descricao: 'Cal é amigo de Jason e um dos coadjuvantes apresentados no site oficial. É desconfiado, passa o tempo monitorando rádios da Guarda Costeira e tem opinião sobre tudo. O papel exato na história: a confirmar.',
      imagem: 'assets/img/jogo/personagem-cal-hampton-800.webp',
      alt: "Cal Hampton de chapéu e camisa havaiana verde, em pé num minigolfe com um taco na mão",
      tags: ['coadjuvante', 'Leonida Keys'],
      status: 'confirmado',
      fonte: FONTES.siteOficial
    },
    {
      id: 'boobie-ike',
      categoria: 'personagens',
      nome: 'Boobie Ike',
      resumo: 'Figura conhecida de Vice City, com negócios que vão de imóveis a um clube e uma gravadora.',
      descricao: 'Boobie Ike é um empresário famoso nas ruas de Vice City. O site oficial o mostra à frente de vários negócios, entre eles a gravadora Only Raw Records. O papel exato na história: a confirmar.',
      imagem: 'assets/img/jogo/personagem-boobie-ike-800.webp',
      alt: "Boobie Ike sentado numa poltrona do escritório, de óculos escuros e camisa estampada",
      tags: ['coadjuvante', 'Vice City', 'Only Raw Records'],
      status: 'confirmado',
      fonte: FONTES.siteOficial
    },
    {
      id: 'dre-quan-priest',
      categoria: 'personagens',
      nome: "Dre'Quan Priest",
      resumo: 'Empresário musical que quer transformar a gravadora Only Raw em sucesso.',
      descricao: "Dre'Quan trabalha com Boobie Ike e cuida dos artistas da Only Raw Records. Quer fazer a gravadora estourar em Vice City. O papel exato na história: a confirmar.",
      imagem: 'assets/img/jogo/personagem-dre-quan-priest-800.webp',
      alt: "Dre’Quan Priest num estúdio de gravação, ao lado da mesa de som",
      tags: ['coadjuvante', 'música', 'Only Raw Records'],
      status: 'confirmado',
      fonte: FONTES.siteOficial
    },
    {
      id: 'real-dimez',
      categoria: 'personagens',
      nome: 'Real Dimez',
      resumo: 'Dupla de rap formada por Bae-Luxe e Roxy, que tenta fazer sucesso pela Only Raw.',
      descricao: 'Real Dimez é a dupla de rap formada por Bae-Luxe e Roxy, amigas desde a escola. Elas fazem parte do elenco da Only Raw Records e ficaram famosas nas redes. O papel exato na história: a confirmar.',
      imagem: 'assets/img/jogo/personagem-real-dimez-800.webp',
      alt: "Bae-Luxe e Roxy, da dupla Real Dimez, gravando ao microfone num estúdio iluminado em rosa",
      tags: ['coadjuvante', 'música', 'dupla'],
      status: 'confirmado',
      fonte: FONTES.pcGamerPersonagens
    },
    {
      id: 'raul-bautista',
      categoria: 'personagens',
      nome: 'Raul Bautista',
      resumo: 'Assaltante de bancos experiente e confiante, que recruta parceiros para golpes maiores.',
      descricao: 'Raul é apresentado como um ladrão de bancos veterano, carismático e que assume riscos. Ele procura gente talentosa para trabalhos cada vez maiores. O papel exato na história: a confirmar.',
      imagem: 'assets/img/jogo/personagem-raul-bautista-800.webp',
      alt: "Raul Bautista de braços cruzados no convés de um barco, com prédios ao pôr do sol atrás",
      tags: ['coadjuvante', 'assaltos'],
      status: 'confirmado',
      fonte: FONTES.siteOficial
    },
    {
      id: 'brian-heder',
      categoria: 'personagens',
      nome: 'Brian Heder',
      resumo: 'Contrabandista veterano das Keys. Deixa Jason morar num de seus imóveis em troca de ajuda.',
      descricao: 'Brian é um traficante "da velha guarda" das Leonida Keys. Jason mora sem pagar aluguel em um de seus imóveis e, em troca, faz serviços para ele. O papel exato na história: a confirmar.',
      imagem: 'assets/img/jogo/personagem-brian-heder-800.webp',
      alt: "Brian Heder de camisa florida e óculos no rosto, apontando para alguém enquanto segura um papel",
      tags: ['coadjuvante', 'Leonida Keys'],
      status: 'confirmado',
      fonte: FONTES.pcGamerPersonagens
    },

    /* ----------------------------- Regiões ------------------------------- */
    {
      id: 'vice-city',
      categoria: 'regioes',
      nome: 'Vice City',
      resumo: 'A cidade grande de Leonida, inspirada em Miami: praias, vida noturna, arte de rua e muito neon.',
      descricao: 'Vice City é o coração urbano do jogo e volta à série depois de GTA Vice City (2002). Inspirada em Miami, mistura praias lotadas, prédios art déco, festas e uma cena musical forte. É o ponto de partida ideal para explorar.',
      imagem: 'assets/img/jogo/regiao-vice-city-800.webp',
      alt: "Duas torres residenciais curvas na beira da baía de Vice City, com lanchas e jet skis na água",
      tags: ['cidade', 'praia', 'vida noturna'],
      inspiracao: 'Miami (Flórida)',
      status: 'confirmado',
      fonte: FONTES.gameInformerRegioes
    },
    {
      id: 'leonida-keys',
      categoria: 'regioes',
      nome: 'Leonida Keys',
      resumo: 'Arquipélago ligado por pontes, inspirado nas Florida Keys. É onde Jason vive no começo da história.',
      descricao: 'As Leonida Keys são ilhas ligadas por pontes longas, com marinas, barcos, pesca e bares à beira-mar. Segundo o site oficial, é ali que Jason vive e trabalha para contrabandistas locais.',
      imagem: 'assets/img/jogo/regiao-leonida-keys-800.webp',
      alt: "Vista aérea das Leonida Keys: ilhas verdes, mar turquesa, uma ponte longa e um hidroavião",
      tags: ['ilhas', 'barcos', 'pesca'],
      inspiracao: 'Florida Keys',
      status: 'confirmado',
      fonte: FONTES.gameInformerRegioes
    },
    {
      id: 'grassrivers',
      categoria: 'regioes',
      nome: 'Grassrivers',
      resumo: 'Pântanos e canais cheios de vida selvagem, inspirados nos Everglades.',
      descricao: 'Grassrivers é a região de áreas alagadas, capim alto e canais, inspirada nos Everglades da Flórida. Os trailers mostram jacarés e embarcações próprias para o pântano.',
      imagem: 'assets/img/jogo/regiao-grassrivers-800.webp',
      alt: "Pântano de Grassrivers com casas sobre palafitas e os prédios de Vice City no horizonte",
      tags: ['pântano', 'natureza', 'jacarés'],
      inspiracao: 'Everglades (Flórida)',
      status: 'confirmado',
      fonte: FONTES.gameInformerRegioes
    },
    {
      id: 'port-gellhorn',
      categoria: 'regioes',
      nome: 'Port Gellhorn',
      resumo: 'Cidade litorânea com áreas turísticas decadentes, parques de diversão antigos e um porto.',
      descricao: 'Port Gellhorn é uma cidade costeira que já viveu dias melhores: atrações turísticas envelhecidas, píeres e área portuária. Inspiração exata no mundo real: a confirmar (veículos especializados citam o litoral do Golfo da Flórida).',
      imagem: 'assets/img/jogo/regiao-port-gellhorn-800.webp',
      alt: "Cidade de Port Gellhorn vista do alto ao pôr do sol, com casas baixas e postos de gasolina",
      tags: ['litoral', 'porto', 'turismo'],
      inspiracao: 'a confirmar',
      status: 'confirmado',
      fonte: FONTES.gameInformerRegioes
    },
    {
      id: 'ambrosia',
      categoria: 'regioes',
      nome: 'Ambrosia',
      resumo: 'O lado industrial de Leonida, no interior do estado, com fábricas e cidades pequenas.',
      descricao: 'Ambrosia fica no interior de Leonida e representa o lado industrial do estado, com fábricas e comunidades operárias. Mais detalhes sobre atividades na região: a confirmar.',
      imagem: 'assets/img/jogo/regiao-ambrosia-800.webp',
      alt: "Torres de energia e fábricas de Ambrosia ao pôr do sol, com fumaça no horizonte",
      tags: ['interior', 'indústria'],
      inspiracao: 'a confirmar',
      status: 'confirmado',
      fonte: FONTES.gameInformerRegioes
    },
    {
      id: 'mount-kalaga',
      categoria: 'regioes',
      nome: 'Mount Kalaga National Park',
      resumo: 'Parque nacional no norte de Leonida, com trilhas, florestas e atividades como caça e pesca.',
      descricao: 'O Parque Nacional Mount Kalaga fica na divisa norte do estado. É a área mais "selvagem" do mapa, com trilhas, mata fechada e, segundo o site oficial, caça e pesca.',
      imagem: 'assets/img/jogo/regiao-mount-kalaga-800.webp',
      alt: "Estrada passando por um cânion de terra vermelha e mata no Mount Kalaga National Park",
      tags: ['natureza', 'trilhas', 'caça e pesca'],
      inspiracao: 'a confirmar',
      status: 'confirmado',
      fonte: FONTES.gameInformerRegioes
    },

    /* ----------------------------- Veículos ------------------------------ */
    /* Os trailers mostram vários TIPOS de veículo, mas os nomes e modelos
       oficiais no jogo ainda não foram divulgados: por isso "a confirmar". */
    {
      id: 'conversivel',
      categoria: 'veiculos',
      nome: 'Conversível clássico',
      resumo: 'Carro aberto para curtir a orla de Vice City. Nome e modelo no jogo: a confirmar.',
      descricao: 'Conversíveis combinam com o clima de Vice City e aparecem nos materiais de divulgação. Bons para passeios e fotos, mas não protegem o motorista. Nome, modelo e desempenho no jogo: a confirmar.',
      imagem: 'assets/img/jogo/veiculo-conversivel-800.webp',
      alt: "Jason dirigindo um conversível vermelho com Lucia no banco do passageiro, à beira-mar",
      tags: ['carro', 'passeio', 'Vice City'],
      status: 'a-confirmar',
      fonte: FONTES.siteOficial
    },
    {
      id: 'muscle-car',
      categoria: 'veiculos',
      nome: 'Muscle car',
      resumo: 'Potente e barulhento, ótimo em retas. Nome e modelo no jogo: a confirmar.',
      descricao: 'Os muscle cars são clássicos da série GTA e aparecem nos trailers de GTA VI. Costumam ter muita aceleração em linha reta e menos estabilidade nas curvas. Nomes e números no jogo: a confirmar.',
      imagem: 'assets/img/jogo/veiculo-muscle-car-800.webp',
      alt: "Muscle car rosa com pintura personalizada estacionado numa rua de Vice City, com um rapaz sentado no capô",
      tags: ['carro', 'velocidade'],
      status: 'a-confirmar',
      fonte: FONTES.siteOficial
    },
    {
      id: 'superesportivo',
      categoria: 'veiculos',
      nome: 'Superesportivo',
      resumo: 'O mais rápido nas avenidas, mas sofre em estradas de terra. Nome e modelo no jogo: a confirmar.',
      descricao: 'Superesportivos fazem parte do estilo de vida de luxo de Vice City mostrado nos trailers. Na série, são os carros mais rápidos do asfalto. Nomes, preços e desempenho no jogo: a confirmar.',
      imagem: 'assets/img/jogo/veiculo-superesportivo-800.webp',
      alt: "Superesportivo Grotti Cheetah branco com faixas vermelhas na frente de um estacionamento circular",
      tags: ['carro', 'velocidade', 'luxo'],
      status: 'a-confirmar',
      fonte: FONTES.siteOficial
    },
    {
      id: 'moto',
      categoria: 'veiculos',
      nome: 'Moto esportiva',
      resumo: 'Ágil para escapar do trânsito, mas exige cuidado em batidas. Nome e modelo no jogo: a confirmar.',
      descricao: 'Motos aparecem nos trailers de GTA VI. Na série, são ótimas para passar entre carros e fazer curvas fechadas, mas o piloto cai com facilidade. Modelos no jogo: a confirmar.',
      imagem: 'assets/img/jogo/veiculo-moto-800.webp',
      alt: "Jason ao lado de uma moto esportiva verde estacionada sob palmeiras",
      tags: ['moto', 'agilidade'],
      status: 'a-confirmar',
      fonte: FONTES.siteOficial
    },
    {
      id: 'lancha',
      categoria: 'veiculos',
      nome: 'Lancha',
      resumo: 'Essencial para circular entre as ilhas das Keys. Nome e modelo no jogo: a confirmar.',
      descricao: 'Com tanto litoral, as lanchas devem ser muito úteis em Leonida, principalmente nas Keys. Barcos aparecem com destaque nos trailers. Modelos e onde encontrá-las: a confirmar.',
      imagem: 'assets/img/jogo/veiculo-lancha-800.webp',
      alt: "Lancha Squalo branca cortando a baía ao entardecer, com os prédios de Vice City ao fundo",
      tags: ['barco', 'Leonida Keys'],
      status: 'a-confirmar',
      fonte: FONTES.siteOficial
    },
    {
      id: 'aerobarco',
      categoria: 'veiculos',
      nome: 'Aerobarco',
      resumo: 'Barco com hélice de avião, feito para os pântanos de Grassrivers. Presença no jogo: a confirmar.',
      descricao: 'O aerobarco (airboat) é o veículo típico dos Everglades, que inspiram Grassrivers. Ele desliza sobre águas rasas e capim. Presença, nome e modelo no jogo: a confirmar.',
      imagem: 'assets/img/jogo/veiculo-aerobarco-800.webp',
      alt: "Aerobarco visto de cima atravessando a água escura de Grassrivers entre plantas aquáticas",
      tags: ['barco', 'Grassrivers', 'pântano'],
      status: 'a-confirmar',
      fonte: FONTES.gameInformerRegioes
    },
    {
      id: 'picape',
      categoria: 'veiculos',
      nome: 'Picape off-road',
      resumo: 'Robusta para as estradas de terra do interior e do Mount Kalaga. Nome e modelo no jogo: a confirmar.',
      descricao: 'Para o interior de Leonida, com estradas de terra e trilhas, uma picape costuma ser a melhor escolha na série. Modelos no jogo: a confirmar.',
      imagem: 'assets/img/jogo/veiculo-picape-800.webp',
      alt: "Picape atravessando o pântano de Grassrivers perseguida por uma viatura e um helicóptero",
      tags: ['carro', 'off-road', 'Mount Kalaga'],
      status: 'a-confirmar',
      fonte: FONTES.gameInformerRegioes
    },
    {
      id: 'jet-ski',
      categoria: 'veiculos',
      nome: 'Jet ski',
      resumo: 'Diversão rápida nas praias de Vice City. Presença no jogo: a confirmar.',
      descricao: 'Jet skis combinam com as praias de Vice City e das Keys. São rápidos e fáceis de pilotar, mas não levam passageiros extras. Presença e nome no jogo: a confirmar.',
      imagem: 'assets/img/jogo/veiculo-jet-ski-800.webp',
      alt: "Jet skis e lanchas reunidos num canal das Leonida Keys, com gente tomando sol nos barcos",
      tags: ['aquático', 'praia'],
      status: 'a-confirmar',
      fonte: FONTES.gameInformerRegioes
    },

    /* ------------------------------ Dicas -------------------------------- */
    {
      id: 'dica-acessibilidade',
      categoria: 'dicas',
      nome: 'Configure legendas e acessibilidade primeiro',
      resumo: 'Antes da primeira missão, ajuste legendas, tamanho do texto, brilho e controles.',
      descricao: 'Jogos da Rockstar costumam ter opções de legendas, tamanho do texto e mapeamento de controles. Ajuste tudo antes de começar para não perder diálogos importantes. A lista exata de opções de GTA VI: a confirmar.',
      icone: 'bi-universal-access',
      tags: ['iniciante', 'configurações'],
      status: 'confirmado',
      fonte: FONTES.siteOficial
    },
    {
      id: 'dica-pre-carga',
      categoria: 'dicas',
      nome: 'Faça a pré-carga do jogo',
      resumo: 'Quem comprou a versão digital pode baixar o jogo antes do lançamento e jogar assim que liberar.',
      descricao: 'A Rockstar liberou a pré-carga (pre-load) da versão digital em novembro de 2026. Confira na sua loja (PlayStation Store ou Microsoft Store) a data e o espaço necessário. Tamanho do download: a confirmar.',
      icone: 'bi-cloud-arrow-down',
      tags: ['iniciante', 'lançamento'],
      status: 'confirmado',
      fonte: FONTES.siteOficial
    },
    {
      id: 'dica-historia',
      categoria: 'dicas',
      nome: 'Comece pela história',
      resumo: 'As primeiras missões costumam ensinar os controles e liberar partes do mapa.',
      descricao: 'Nos GTAs anteriores, as missões iniciais funcionam como tutorial e liberam regiões e atividades aos poucos. Vale seguir a história antes de sair explorando tudo. Como isso funciona em GTA VI: a confirmar.',
      icone: 'bi-book',
      tags: ['iniciante', 'missões'],
      status: 'a-confirmar',
      fonte: FONTES.gamesRadar
    },
    {
      id: 'dica-regioes',
      categoria: 'dicas',
      nome: 'Explore uma região de cada vez',
      resumo: 'Leonida é grande. Use o nosso mapa por regiões para planejar o passeio.',
      descricao: 'São seis regiões principais: Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia e Mount Kalaga. Explorar uma de cada vez ajuda a não se perder e a marcar o progresso no checklist.',
      icone: 'bi-compass',
      tags: ['iniciante', 'mapa'],
      status: 'confirmado',
      fonte: FONTES.gameInformerRegioes
    },
    {
      id: 'dica-procurado',
      categoria: 'dicas',
      nome: 'Fique de olho no nível de procurado',
      resumo: 'Na série, sair da vista da polícia é a forma mais rápida de despistar uma perseguição.',
      descricao: 'Nos GTAs anteriores, o nível de procurado sobe com cada crime e cai quando você sai do campo de visão da polícia. Evite chamar atenção logo no começo. Como o sistema funciona em GTA VI: a confirmar.',
      icone: 'bi-star-half',
      tags: ['iniciante', 'polícia'],
      status: 'a-confirmar',
      fonte: FONTES.gamesRadar
    },
    {
      id: 'dica-radio',
      categoria: 'dicas',
      nome: 'Ouça as rádios',
      resumo: 'As rádios fazem parte da identidade de Vice City e contam muito sobre o mundo do jogo.',
      descricao: 'O site oficial destaca o rádio do jogo, a trilha sonora e a gravadora Only Raw Records. Trocar de estação é uma forma divertida de conhecer a cultura de Leonida.',
      icone: 'bi-broadcast',
      tags: ['diversão', 'música'],
      status: 'confirmado',
      fonte: FONTES.siteOficial
    },
    {
      id: 'dica-online',
      categoria: 'dicas',
      nome: 'GTA Online ainda não tem data',
      resumo: 'O lançamento de 19/11 é do modo história. O novo modo online: a confirmar.',
      descricao: 'Até a data desta pesquisa, a Rockstar não anunciou a data do modo online de GTA VI. Desconfie de sites que prometem acesso antecipado ou "dinheiro grátis".',
      icone: 'bi-wifi-off',
      tags: ['online', 'segurança'],
      status: 'a-confirmar',
      fonte: FONTES.gamesRadar
    },
    {
      id: 'dica-pausas',
      categoria: 'dicas',
      nome: 'Respeite a classificação e faça pausas',
      resumo: 'O jogo é classificado como Mature (17+) pela ESRB. Classificação no Brasil: a confirmar.',
      descricao: 'GTA VI tem conteúdo adulto, com violência, linguagem forte e compras dentro do jogo. A classificação ESRB é Mature 17+. A classificação indicativa brasileira: a confirmar. Faça pausas e jogue com moderação.',
      icone: 'bi-heart-pulse',
      tags: ['saúde', 'classificação'],
      status: 'confirmado',
      fonte: FONTES.siteOficial
    }
  ];

  /* ------------------------------------------------------------------------
     Novidades (linha do tempo)
     ------------------------------------------------------------------------ */
  var novidades = [
    {
      data: '2026-11-19',
      dataTexto: '19/11/2026',
      titulo: 'Dia de lançamento',
      texto: 'GTA VI chega ao PlayStation 5 e ao Xbox Series X|S. Versão para PC: a confirmar.',
      fonte: FONTES.siteOficial
    },
    {
      data: '2026-11-10',
      dataTexto: 'Novembro de 2026',
      titulo: 'Pré-carga liberada',
      texto: 'Quem comprou a versão digital já pode baixar o jogo. A data exata em cada loja varia (algumas fontes citam 10/11, outras 12/11): a confirmar na sua plataforma.',
      fonte: FONTES.siteOficial
    },
    {
      data: '2025-11-06',
      dataTexto: '06/11/2025',
      titulo: 'Novo adiamento: 19 de novembro de 2026',
      texto: 'A Rockstar anunciou a mudança da data de 26/05/2026 para 19/11/2026, para dar mais tempo de polimento ao jogo.',
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
      data: '2025-05-02',
      dataTexto: '02/05/2025',
      titulo: 'Primeiro adiamento',
      texto: 'O lançamento, antes previsto para o fim de 2025, foi movido para 26 de maio de 2026.',
      fonte: FONTES.gamesRadar
    },
    {
      data: '2023-12-05',
      dataTexto: 'Dezembro de 2023',
      titulo: 'Primeiro trailer',
      texto: 'O trailer 1 revelou a volta a Vice City, o estado de Leonida e a protagonista Lucia. O vídeo bateu recordes de visualização no YouTube.',
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
        { id: 'espaco', texto: 'Liberar espaço no console (tamanho exato: a confirmar)' },
        { id: 'pre-carga', texto: 'Fazer a pré-carga do jogo' },
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
