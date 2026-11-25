#!/usr/bin/env python3
"""Processa o kit de mídia oficial de GTA VI para o Guia Leonida.

Uso:
    python3 tools/processar_kit.py <pasta-do-kit-descompactado> [etapas]
    etapas (opcional, separadas por vírgula): artes,logo,capturas,miniaturas,quadros
    (quadros:<nome> refaz só a cena com esse nome, ex.: quadros:jason)

A pasta do kit deve ter os quatro ZIPs oficiais descompactados lado a lado
(https://www.rockstargames.com/VI/media):
    GTAVI_Artwork_Wallpapers/   GTAVI_Screenshots/
    GTAVI_Videos/               GTAVI_Vintage_Vice_City_Pack/
    GTAVI_Ultimate_Edition_Benefits/

O que o script gera:
1. Ilustrações oficiais, cartões-postais e pôster do mapa em WebP
   (1600 e 800 px; o mapa em 2400 e 1200 px) em assets/img/jogo/.
2. O logo de GTA VI recortado com transparência (diferença entre a arte
   "com logotipo" e a mesma arte sem logotipo), em assets/img/jogo/.
3. Miniaturas (480 px) das capturas ainda não usadas e do pacote Vintage
   Vice City para a folha de contato, em docs/folha-de-contato/.
4. Os quadros da cena de vídeo controlada pela rolagem (ffmpeg), em
   assets/cenas/<nome>/<largura>/.
5. O manifesto (assets/img/jogo/manifesto.json) com origem e alt de cada
   imagem nova, sem apagar as que já estavam lá.

Requer Python 3 + Pillow + numpy e o ffmpeg no PATH.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / 'assets' / 'img' / 'jogo'
CENAS = RAIZ / 'assets' / 'cenas'
FOLHA = RAIZ / 'docs' / 'folha-de-contato'
MANIFESTO = DESTINO / 'manifesto.json'

PAGINA_ARTES = 'https://www.rockstargames.com/VI/media/artwork-wallpapers'
ZIP_ARTES = ('https://media-rockstargames-com.akamaized.net/VI/downloads/'
             'artwork_wallpapers/GTAVI_Artwork_Wallpapers.zip')
PAGINA_CAPTURAS = 'https://www.rockstargames.com/VI/media/screenshots'
ZIP_CAPTURAS = ('https://media-rockstargames-com.akamaized.net/VI/downloads/'
                'screenshots/GTAVI_Screenshots.zip')
ZIP_VINTAGE = ('https://media-rockstargames-com.akamaized.net/VI/downloads/'
               'screenshots/GTAVI_Vintage_Vice_City_Pack.zip')
PAGINA_VIDEOS = 'https://www.rockstargames.com/VI/media/videos'
ZIP_VIDEOS = ('https://media-rockstargames-com.akamaized.net/VI/downloads/'
              'videos/GTAVI_Videos.zip')

# (arquivo de saída, caminho no ZIP de ilustrações, grupo, alt)
ARTES = [
    ('arte-jason-lucia-praia', 'Jason_and_Lucia_Beach/Jason_and_Lucia_Beach_landscape.jpg', 'arte',
     'Ilustração oficial: Lucia abraçada a Jason na beira da baía ao pôr do sol, com palmeiras e os '
     'prédios de Vice City atrás'),
    ('arte-jason-lucia-terraco', 'Jason_and_Lucia_Rooftop/Jason_Lucia_Rooftop_landscape.jpg', 'arte',
     'Ilustração oficial: Jason com uma pistola e Lucia com uma espingarda num terraço, com a baía de '
     'Vice City iluminada atrás'),
    ('arte-jason-lucia-a-postos',
     'Jason_and_Lucia_Lock_and_Load/Jason_Lucia_Lock_And_Load_landscape.jpg', 'arte',
     'Ilustração oficial: Jason de regata em pé e Lucia sentada no capô de um carro vermelho, '
     'conferindo as armas ao entardecer'),
    ('arte-jason-lucia-motel', 'Jason_Lucia_Motel/Jason_and_Lucia_Motel_landscape.jpg', 'arte',
     'Ilustração oficial: Jason e Lucia descansando numa cama de motel, com uma bolsa de viagem ao lado'),
    ('arte-boobie-ike', 'Boobie_Ike/Boobie_Ike_landscape.jpg', 'arte',
     'Ilustração oficial: Boobie Ike de jaqueta estampada e corrente de ouro, com uma taça na mão numa boate'),
    ('arte-brian-heder', 'Brian_Heder/Brian_Heder_landscape.jpg', 'arte',
     'Ilustração oficial: Brian Heder de camisa estampada debruçado sobre um mapa numa mesa com uma faca '
     'e garrafas de cerveja, num galpão de barcos'),
    ('arte-cal-hampton', 'Cal_Hampton/Cal_Hampton_landscape.jpg', 'arte',
     'Ilustração oficial: Cal Hampton de boné e óculos escuros sentado na proa de um barco com uma '
     'garrafa na mão, perto de uma ponte'),
    ('arte-dre-quan-priest', 'DreQuan_Priest/DreQuan_Priest_landscape.jpg', 'arte',
     'Ilustração oficial: Dre’Quan Priest sentado no capô de um utilitário preto em frente à casa '
     'noturna Jack of Hearts'),
    ('arte-raul-bautista', 'Raul_Bautista/Raul_Bautista_landscape.jpg', 'arte',
     'Ilustração oficial: Raul Bautista de terno branco com uma bolsa de couro no ombro, ajustando as '
     'luvas em frente a um muro grafitado'),
    ('arte-real-dimez', 'Real_Dimez/Real_Dimez_landscape.jpg', 'arte',
     'Ilustração oficial: Bae-Luxe e Roxy, da dupla Real Dimez, posando diante de um hotel art déco'),
    # Cartões-postais das 6 regiões
    ('postal-vice-city', 'Postcards/Vice_City/Vice_City_Postcard_landscape.jpg', 'postal',
     'Cartão-postal oficial “Visit Leonida” de Vice City: prédios da cidade à beira da baía turquesa, '
     'com jet skis na água'),
    ('postal-leonida-keys', 'Postcards/Leonida_Keys/Leonida_Keys_Postcard_landscape.jpg', 'postal',
     'Cartão-postal oficial “Visit Leonida” das Leonida Keys: ilhas e mar turquesa vistos do alto, '
     'com um hidroavião'),
    ('postal-grassrivers', 'Postcards/Grassrivers/Grassrivers_Postcard_landscape.jpg', 'postal',
     'Cartão-postal oficial “Visit Leonida” de Grassrivers: pântano visto do alto ao pôr do sol, com '
     'um barco deixando rastro na água'),
    ('postal-port-gellhorn', 'Postcards/Port_Gellhorn/Port_Gellhorn_Postcard_landscape.jpg', 'postal',
     'Cartão-postal oficial “Visit Leonida” de Port Gellhorn: a cidade vista do alto ao anoitecer, '
     'com as ruas iluminadas'),
    ('postal-ambrosia', 'Postcards/Ambrosia/Ambrosia_Postcard_landscape.jpg', 'postal',
     'Cartão-postal oficial “Visit Leonida” de Ambrosia: fábricas e chaminés soltando fumaça ao pôr do sol'),
    ('postal-mount-kalaga',
     'Postcards/Mount_Kalaga_National_Park/Mount_Kalaga_National_Park_Postcard_landscape.jpg', 'postal',
     'Cartão-postal oficial “Visit Leonida” do Mount Kalaga National Park: rio no meio da mata fechada, '
     'com o sol atravessando as árvores'),
]

# Versões em retrato (celular) de algumas artes: (saída, caminho, alt igual ao da paisagem)
RETRATOS = [
    ('arte-jason-lucia-praia-retrato', 'Jason_and_Lucia_Beach/Jason_and_Lucia_Beach_phone.jpg',
     'arte-jason-lucia-praia'),
]

MAPA = ('mapa-leonida-poster', 'Leonida_Map_and_Cover_Art_Poster/Leonida_Map_Poster.jpg',
        'Pôster oficial do mapa do estado de Leonida: a ilha principal com Vice City, Vice Beach, '
        'Port Gellhorn, Ambrosia, Grassrivers e o Mount Kalaga, os condados, as estradas e as Leonida '
        'Keys ao sul')

# Logo: a mesma ilustração com e sem o logotipo
LOGO = ('logo-gta-vi',
        'Jason_and_Lucia_Robbery/Jason_and_Lucia_Robbery_landscape.jpg',
        'Jason_and_Lucia_Robbery_With_Logo/Jason_and_Lucia_Robbery_With_Logo_landscape.jpg',
        (200, 160, 1440, 1080))  # área onde o logo está na arte 3840×2160

ZIP_ULTIMATE = ('https://media-rockstargames-com.akamaized.net/VI/downloads/'
                'screenshots/GTAVI_Ultimate_Edition_Benefits.zip')

# Capturas escolhidas na folha de contato: (saída, arquivo original, pacote, grupo, alt)
# pacote: 'capturas' | 'ultimate' | 'vintage'
CAPTURAS = [
    # Tour pelas 6 regiões (página inicial)
    ('tour-vice-city', 'Vice_City_11.jpg', 'capturas', 'tour',
     'Prédio alto de Vice City ao pôr do sol, com a baía, as ilhas e um helicóptero ao fundo'),
    ('tour-leonida-keys', 'Leonida_Keys_06.jpg', 'capturas', 'tour',
     'Iguana verde tomando sol numa pedra, com o mar azul e uma ilhota das Leonida Keys atrás'),
    ('tour-grassrivers', 'Grassrivers_02.jpg', 'capturas', 'tour',
     'Casas e um restaurante sobre palafitas na água verde de Grassrivers, com um barco passando'),
    ('tour-port-gellhorn', 'Port_Gellhorn_01.jpg', 'capturas', 'tour',
     'Letreiro de neon do Starlit Motel aceso no começo da noite em Port Gellhorn, entre palmeiras'),
    ('tour-ambrosia', 'Ambrosia_01.jpg', 'capturas', 'tour',
     'Grupo de motociclistas numa estrada de Ambrosia, com postes, lojas e um letreiro antigo ao fundo'),
    ('tour-mount-kalaga', 'Mount_Kalaga_National_Park_05.jpg', 'capturas', 'tour',
     'Veados bebendo água num riacho no meio da mata do Mount Kalaga National Park'),
    # Bloco editorial de Jason e Lucia
    ('editorial-lucia-noite', 'Jason_and_Lucia_10.jpg', 'capturas', 'editorial',
     'Lucia de vestido sentada na beira de uma cama, com a janela aberta para os prédios iluminados de Vice City'),
    ('editorial-jason-lucia-carro', 'Jason_and_Lucia_17.jpg', 'capturas', 'editorial',
     'Lucia e Jason de pistola na mão, vistos de dentro de um carro, sob um céu de fim de tarde'),
    ('editorial-jason-moto', 'Jason_Duval_11.jpg', 'capturas', 'editorial',
     'Jason pilotando uma moto azul à noite, iluminado pelas luzes de uma viatura'),
    ('citacao-vice-city-posto', 'Vice_City_22.jpg', 'capturas', 'editorial',
     'Avenida de Vice City ao anoitecer, com o letreiro de um posto de gasolina e os prédios do centro atrás'),
    # Veículos com nome oficial
    ('veiculo-grotti-cheetah', 'ULTIMATE_EDITION_GROTTI_CHEETAH_01.jpg', 'ultimate', 'veiculo',
     'Grotti Cheetah (1995) branco com faixas vermelhas na frente de um estacionamento circular'),
    ('veiculo-shitzu-squalo', 'ULTIMATE_EDITION_SQUALO_01.jpg', 'ultimate', 'veiculo',
     'Lancha Shitzu Squalo branca cortando a baía ao entardecer, com os prédios de Vice City ao fundo'),
    ('veiculo-dinka-enduro', 'ULTIMATE_EDITION_SAFEHOUSE_VEHICLES_02.jpg', 'ultimate', 'veiculo',
     'Moto Dinka Enduro verde-oliva estacionada na frente de uma porta de garagem verde-água'),
    ('veiculo-crest-kayak', 'ULTIMATE_EDITION_SAFEHOUSE_VEHICLES_03.jpg', 'ultimate', 'veiculo',
     'Jason remando um caiaque Crest laranja num canal das Keys ao pôr do sol'),
    ('veiculo-vapid-dominator-buggy', 'ULTIMATE_EDITION_VAPID_BUGGY_01.jpg', 'ultimate', 'veiculo',
     'Vapid Dominator Buggy (1967) preto e amarelo com faróis no teto, espirrando lama numa trilha'),
    ('veiculo-vapid-ganado', 'ULTIMATE_EDITION_VAPID_GANADO_RETRO_BUILD_01.jpg', 'ultimate', 'veiculo',
     'Picape Vapid Ganado amarela com faixas vermelhas e laranja derrapando numa estrada à beira-mar'),
    ('veiculo-vapid-stanier', 'VINTAGE_VICE_CITY_PACK_VAPID_STANIER_01.jpg', 'vintage', 'veiculo',
     'Vapid Stanier (1955) amarelo e branco estacionado numa rua de Vice City à noite, sob luzes de neon'),
]

# Cenas de vídeo: (nome, arquivo no ZIP de vídeos, alt do primeiro quadro)
CENAS_VIDEO = [
    ('lucia', 'Lucia_Caminos_Video_Clip.mp4',
     'Lucia Caminos se debruça na janela de um carro parado numa avenida de Vice City à noite, '
     'com prédios de neon rosa ao fundo'),
    ('jason', 'Jason_Duval_Video_Clip.mp4',
     'Jason Duval, de bandana vermelha e óculos amarelos, entra numa loja de conveniência e aponta '
     'uma pistola para a frente'),
]


def webp(img, destino, largura, qualidade=78):
    w, h = img.size
    altura = round(h * largura / w)
    img.resize((largura, altura), Image.LANCZOS).save(destino, 'WEBP', quality=qualidade, method=6)
    return [altura, destino.stat().st_size]


def abrir(caminho):
    img = Image.open(caminho)
    return img.convert('RGB'), img.size


def registro(arquivo, grupo, alt, original, pagina, zip_, tamanho, tamanhos):
    return {'arquivo': arquivo, 'grupo': grupo, 'alt': alt, 'original': original,
            'pagina': pagina, 'zip': zip_, 'largura_original': tamanho[0],
            'altura_original': tamanho[1], 'tamanhos': tamanhos}


def processar_artes(kit, novos):
    pasta = kit / 'GTAVI_Artwork_Wallpapers'
    alts = {}
    for nome, rel, grupo, alt in ARTES:
        img, tam = abrir(pasta / rel)
        tamanhos = {str(l): webp(img, DESTINO / f'{nome}-{l}.webp', l) for l in (1600, 800)}
        novos.append(registro(nome, grupo, alt, Path(rel).name, PAGINA_ARTES, ZIP_ARTES, tam, tamanhos))
        alts[nome] = alt
        print('ok', nome)
    for nome, rel, base in RETRATOS:
        img, tam = abrir(pasta / rel)
        tamanhos = {'900': webp(img, DESTINO / f'{nome}-900.webp', 900)}
        novos.append(registro(nome, 'arte', alts[base], Path(rel).name, PAGINA_ARTES, ZIP_ARTES, tam, tamanhos))
        print('ok', nome)
    nome, rel, alt = MAPA
    img, tam = abrir(pasta / rel)
    tamanhos = {str(l): webp(img, DESTINO / f'{nome}-{l}.webp', l, 82) for l in (2400, 1200)}
    novos.append(registro(nome, 'mapa', alt, Path(rel).name, PAGINA_ARTES, ZIP_ARTES, tam, tamanhos))
    print('ok', nome)


def recortar_logo(kit, novos):
    """O logo é branco; com a arte sem logo (fundo) e a arte com logo (resultado),
    a opacidade de cada pixel sai de: resultado = a·255 + (1 − a)·fundo."""
    nome, sem, com, (x0, y0, x1, y1) = LOGO
    pasta = kit / 'GTAVI_Artwork_Wallpapers'
    fundo = np.asarray(Image.open(pasta / sem).convert('RGB'), dtype=float)[y0:y1, x0:x1]
    final = np.asarray(Image.open(pasta / com).convert('RGB'), dtype=float)[y0:y1, x0:x1]
    alfa = ((final - fundo) / np.maximum(255 - fundo, 1)).clip(0, 1).min(axis=2)
    # Fica só o que encosta num traço firme do logo (some o ruído do JPEG e um avião
    # que mudou de lugar entre as duas artes)
    firme = Image.fromarray(((alfa > 0.85) * 255).astype('uint8')).filter(ImageFilter.MaxFilter(9))
    alfa = alfa * (np.asarray(firme) > 0)
    alfa = np.where(alfa > 0.9, 1, alfa)
    ys, xs = np.where(alfa > 0.5)
    alfa = alfa[ys.min() - 4:ys.max() + 5, xs.min() - 4:xs.max() + 5]
    rgba = np.zeros(alfa.shape + (4,), dtype='uint8')
    rgba[..., :3] = 255
    rgba[..., 3] = (alfa * 255).round()
    logo = Image.fromarray(rgba, 'RGBA')
    tamanhos = {}
    for largura in (1100, 550):
        altura = round(logo.size[1] * largura / logo.size[0])
        destino = DESTINO / f'{nome}-{largura}.webp'
        logo.resize((largura, altura), Image.LANCZOS).save(destino, 'WEBP', quality=90, method=6)
        tamanhos[str(largura)] = [altura, destino.stat().st_size]
    novos.append(registro(nome, 'logo', 'Grand Theft Auto VI', Path(com).name + ' (recorte)',
                          PAGINA_ARTES, ZIP_ARTES, logo.size, tamanhos))
    print('ok', nome, logo.size)


def processar_capturas(kit, novos):
    """Converte as capturas escolhidas na folha de contato (1600 e 800 px)."""
    pastas = {'capturas': ('GTAVI_Screenshots', PAGINA_CAPTURAS, ZIP_CAPTURAS),
              'ultimate': ('GTAVI_Ultimate_Edition_Benefits', PAGINA_CAPTURAS, ZIP_ULTIMATE),
              'vintage': ('GTAVI_Vintage_Vice_City_Pack', PAGINA_CAPTURAS, ZIP_VINTAGE)}
    for nome, original, pacote, grupo, alt in CAPTURAS:
        pasta, pagina, zip_ = pastas[pacote]
        caminho = next((kit / pasta).rglob(original))
        img, tam = abrir(caminho)
        tamanhos = {str(l): webp(img, DESTINO / f'{nome}-{l}.webp', l) for l in (1600, 800)}
        novos.append(registro(nome, grupo, alt, original, pagina, zip_, tam, tamanhos))
        print('ok', nome)


def miniaturas(kit, usados):
    """Miniaturas das capturas que ainda não usamos, para a folha de contato."""
    FOLHA.mkdir(parents=True, exist_ok=True)
    itens = []
    fontes = [(p, 'Capturas de tela', ZIP_CAPTURAS) for p in sorted((kit / 'GTAVI_Screenshots').rglob('*.jpg'))]
    fontes += [(p, 'Vintage Vice City', ZIP_VINTAGE)
               for p in sorted((kit / 'GTAVI_Vintage_Vice_City_Pack').glob('*.jpg'))]
    for caminho, pacote, zip_ in fontes:
        if caminho.name in usados:
            continue
        slug = caminho.stem.lower().replace('_', '-')
        img = Image.open(caminho)
        img.draft('RGB', (960, 540))
        img = img.convert('RGB')
        destino = FOLHA / f'{slug}.webp'
        webp(img, destino, 480, 70)
        pasta = caminho.parent.name if pacote == 'Capturas de tela' else 'Vintage Vice City'
        itens.append({'arquivo': destino.name, 'original': caminho.name, 'pacote': pacote,
                      'pasta': pasta, 'zip': zip_})
    (FOLHA / 'candidatas.json').write_text(json.dumps(itens, ensure_ascii=False, indent=1), encoding='utf-8')
    print('ok', len(itens), 'miniaturas')


def quadros(kit, so=None):
    """Quadros da cena de vídeo. Os videoclipes têm só 30 a 45 quadros (1 a 1,5 s em 30 fps),
    então o ffmpeg cria os quadros intermediários (minterpolate) para a rolagem ficar macia.
    Desktop: 1280 px, ~87 quadros. Celular: 720 px, metade dos quadros."""
    for nome, video, _alt in CENAS_VIDEO:
        if so and nome not in so:
            continue
        origem = kit / 'GTAVI_Videos' / video
        for largura, fps in ((1280, 60), (720, 30)):
            pasta = CENAS / nome / str(largura)
            pasta.mkdir(parents=True, exist_ok=True)
            for antigo in pasta.glob('*.webp'):
                antigo.unlink()
            filtro = (f'scale={largura}:-2:flags=lanczos,'
                      f'minterpolate=fps={fps}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1')
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(origem), '-vf', filtro,
                            '-c:v', 'libwebp', '-quality', '74', '-compression_level', '6',
                            str(pasta / 'q%03d.webp')], check=True)
            total = len(list(pasta.glob('*.webp')))
            peso = sum(p.stat().st_size for p in pasta.glob('*.webp'))
            print('ok cena', nome, largura, total, 'quadros', round(peso / 1024), 'KB')
        (CENAS / nome / 'cena.json').write_text(json.dumps({
            'nome': nome, 'original': video, 'pagina': PAGINA_VIDEOS, 'zip': ZIP_VIDEOS,
            'quadros': {str(l): len(list((CENAS / nome / str(l)).glob('*.webp'))) for l in (1280, 720)},
            'alt': _alt}, ensure_ascii=False, indent=1), encoding='utf-8')


def main():
    if len(sys.argv) not in (2, 3):
        sys.exit(__doc__)
    kit = Path(sys.argv[1]).resolve()
    manifesto = json.loads(MANIFESTO.read_text(encoding='utf-8'))
    usados = {item['original'] for item in manifesto}
    novos = []
    etapas = set(sys.argv[2].split(',')) if len(sys.argv) > 2 else {'artes', 'logo', 'capturas', 'miniaturas', 'quadros'}
    if 'artes' in etapas:
        processar_artes(kit, novos)
    if 'logo' in etapas:
        recortar_logo(kit, novos)
    if 'capturas' in etapas:
        processar_capturas(kit, novos)
    if 'miniaturas' in etapas:
        miniaturas(kit, usados | {c[1] for c in CAPTURAS})
    if 'quadros' in etapas:
        quadros(kit)
    cenas = [e.split(':', 1)[1] for e in etapas if e.startswith('quadros:')]
    if cenas:
        quadros(kit, cenas)
    nomes = {n['arquivo'] for n in novos}
    manifesto = [m for m in manifesto if m['arquivo'] not in nomes] + novos
    MANIFESTO.write_text(json.dumps(manifesto, ensure_ascii=False, indent=1), encoding='utf-8')
    print('manifesto:', len(manifesto), 'imagens')


if __name__ == '__main__':
    main()
