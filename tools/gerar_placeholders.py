"""
Gerador das imagens provisórias (placeholders) do Guia Leonida.

Cria ilustrações SVG no estilo "pôr do sol neon" em assets/img/, uma para
cada item do catálogo, para o carrossel e para as páginas. Elas existem só
para o site não ficar sem imagens enquanto as imagens reais não são
colocadas. A lista do que colocar em cada arquivo está em
assets/img/IMAGENS.md.

Como rodar (na raiz do projeto):
    python tools/gerar_placeholders.py

Nenhuma imagem foi baixada da internet: tudo é desenhado aqui com formas
simples (sol listrado, palmeiras, prédios, ondas, silhuetas).
"""

from pathlib import Path
import math

DESTINO = Path(__file__).resolve().parent.parent / "assets" / "img"

# Paletas de céu (topo, meio, horizonte) inspiradas no pôr do sol de Vice City
CEUS = {
    "noite":   ("#120A2E", "#5B1A73", "#FF4F8B"),
    "sunset":  ("#2B0F4C", "#C2185B", "#FF9A3D"),
    "dia":     ("#1E3A8A", "#7C3AED", "#FF7AB6"),
    "verde":   ("#0B2A2E", "#155E63", "#F2A65A"),
    "industria": ("#1B1530", "#4A2A5E", "#E0613D"),
    "roxo":    ("#160B33", "#3B1D7A", "#22D3EE"),
}


def ceu(largura, altura, chave, uid):
    topo, meio, horizonte = CEUS[chave]
    return f"""
  <defs>
    <linearGradient id="ceu-{uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{topo}"/>
      <stop offset=".55" stop-color="{meio}"/>
      <stop offset="1" stop-color="{horizonte}"/>
    </linearGradient>
    <linearGradient id="sol-{uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFE066"/>
      <stop offset="1" stop-color="#FF2D95"/>
    </linearGradient>
    <linearGradient id="chao-{uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2A0F4C"/>
      <stop offset="1" stop-color="#0E0A1F"/>
    </linearGradient>
  </defs>
  <rect width="{largura}" height="{altura}" fill="url(#ceu-{uid})"/>"""


def sol(cx, cy, r, uid):
    """Sol retrô com listras horizontais."""
    listras = "".join(
        f'<rect x="{cx - r}" y="{cy + r * (0.15 + i * 0.17):.1f}" width="{2 * r}" '
        f'height="{r * (0.04 + i * 0.025):.1f}" fill="#000" />'
        for i in range(5)
    )
    return f"""
  <mask id="mask-sol-{uid}">
    <rect x="{cx - r}" y="{cy - r}" width="{2 * r}" height="{2 * r}" fill="#fff"/>
    {listras}
  </mask>
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#sol-{uid})" mask="url(#mask-sol-{uid})" opacity=".95"/>"""


def palmeira(x, base, altura, escala=1.0, cor="#140826"):
    """Silhueta de palmeira."""
    topo_x, topo_y = x + 30 * escala, base - altura
    folhas = []
    for ang in (-160, -125, -90, -55, -20, 10, 200):
        rad = math.radians(ang)
        fx = topo_x + math.cos(rad) * 70 * escala
        fy = topo_y + math.sin(rad) * 35 * escala + 25 * escala
        folhas.append(
            f'<path d="M{topo_x:.1f},{topo_y:.1f} Q{(topo_x + fx) / 2:.1f},{topo_y - 30 * escala:.1f} '
            f'{fx:.1f},{fy:.1f} Q{(topo_x + fx) / 2:.1f},{topo_y - 5 * escala:.1f} {topo_x:.1f},{topo_y:.1f}Z"/>'
        )
    return f"""
  <g fill="{cor}">
    <path d="M{x},{base} Q{x + 25 * escala:.1f},{base - altura / 2:.1f} {topo_x:.1f},{topo_y:.1f}
             l{6 * escala:.1f},2 Q{x + 35 * escala:.1f},{base - altura / 2:.1f} {x + 12 * escala:.1f},{base} Z"/>
    {''.join(folhas)}
  </g>"""


def skyline(largura, base, uid, cor="#1A0B33"):
    """Prédios com janelas acesas em neon."""
    partes = []
    x = 0
    i = 0
    alturas = [140, 220, 170, 300, 190, 260, 150, 330, 210, 180, 280, 160]
    while x < largura:
        w = 70 + (i * 37) % 60
        h = alturas[i % len(alturas)] * (largura / 1600 + 0.5) / 1.0
        partes.append(f'<rect x="{x}" y="{base - h:.0f}" width="{w}" height="{h:.0f}" fill="{cor}"/>')
        # janelas
        for jy in range(int(base - h + 18), int(base - 10), 26):
            for jx in range(x + 10, x + w - 12, 20):
                if (jx * 7 + jy * 3 + i) % 5 == 0:
                    cor_j = ("#FF6BB0", "#3FD8F0", "#FFD166")[(jx + jy) % 3]
                    partes.append(f'<rect x="{jx}" y="{jy}" width="8" height="12" fill="{cor_j}" opacity=".85"/>')
        x += w + 6
        i += 1
    return "\n  ".join(partes)


def ondas(largura, y, altura, cor1="#1B1150", cor2="#3FD8F0"):
    linhas = "".join(
        f'<path d="M0,{y + 18 + k * 22} ' +
        " ".join(f"Q{x + 20},{y + 10 + k * 22} {x + 40},{y + 18 + k * 22}" for x in range(0, largura, 40)) +
        f'" fill="none" stroke="{cor2}" stroke-opacity="{0.5 - k * 0.08:.2f}" stroke-width="2"/>'
        for k in range(5)
    )
    return f'<rect x="0" y="{y}" width="{largura}" height="{altura}" fill="{cor1}"/>{linhas}'


def montanhas(largura, base, cor="#1C0F3A", cor2="#2E1A5C"):
    return f"""
  <path d="M0,{base} L{largura * .18:.0f},{base - 260} L{largura * .33:.0f},{base - 120} L{largura * .5:.0f},{base - 320}
           L{largura * .68:.0f},{base - 150} L{largura * .82:.0f},{base - 280} L{largura},{base - 90} L{largura},{base} Z" fill="{cor2}"/>
  <path d="M0,{base} L{largura * .1:.0f},{base - 120} L{largura * .28:.0f},{base - 40} L{largura * .45:.0f},{base - 180}
           L{largura * .63:.0f},{base - 60} L{largura * .9:.0f},{base - 170} L{largura},{base - 70} L{largura},{base} Z" fill="{cor}"/>"""


def capim(largura, base, cor="#0C2622"):
    folhas = "".join(
        f'<path d="M{x},{base} q{(x % 7) - 3},-{40 + (x * 13) % 50} {(x % 11) - 5},-{70 + (x * 7) % 60}" '
        f'stroke="{cor}" stroke-width="4" fill="none"/>'
        for x in range(0, largura, 9)
    )
    return folhas


def fabrica(largura, base, cor="#160C2B"):
    partes = [f'<rect x="0" y="{base - 120}" width="{largura}" height="120" fill="{cor}"/>']
    for i, x in enumerate(range(80, largura, 260)):
        partes.append(f'<rect x="{x}" y="{base - 330}" width="38" height="220" fill="{cor}"/>')
        partes.append(f'<rect x="{x + 120}" y="{base - 230}" width="110" height="120" fill="{cor}"/>')
        partes.append(
            f'<circle cx="{x + 30}" cy="{base - 370}" r="34" fill="#C9BEE8" opacity=".25"/>'
            f'<circle cx="{x + 70}" cy="{base - 410}" r="46" fill="#C9BEE8" opacity=".18"/>'
        )
    return "".join(partes)


def porto(largura, base, cor="#160C2B"):
    partes = [ondas(largura, base, 200)]
    partes.append(f'<rect x="0" y="{base - 20}" width="{largura * .6:.0f}" height="24" fill="{cor}"/>')
    for x in range(40, int(largura * .6), 90):
        partes.append(f'<rect x="{x}" y="{base - 20}" width="10" height="70" fill="{cor}"/>')
    # guindaste e roda-gigante (cidade turística)
    gx = largura * .72
    partes.append(
        f'<path d="M{gx:.0f},{base} l0,-300 l220,0 l0,16 l-200,0 l0,284 Z" fill="{cor}"/>'
        f'<circle cx="{largura * .25:.0f}" cy="{base - 150}" r="110" fill="none" stroke="{cor}" stroke-width="10"/>'
        f'<path d="M{largura * .25:.0f},{base - 150} l-60,150 M{largura * .25:.0f},{base - 150} l60,150" stroke="{cor}" stroke-width="10"/>'
    )
    return "".join(partes)


def pessoa(cx, base, escala, cor="#140826", destaque="#FF6BB0"):
    """Silhueta de busto (personagem)."""
    cabeca_r = 70 * escala
    return f"""
  <g>
    <path d="M{cx - 190 * escala:.0f},{base} Q{cx - 180 * escala:.0f},{base - 200 * escala:.0f} {cx:.0f},{base - 215 * escala:.0f}
             Q{cx + 180 * escala:.0f},{base - 200 * escala:.0f} {cx + 190 * escala:.0f},{base} Z" fill="{cor}"/>
    <rect x="{cx - 32 * escala:.0f}" y="{base - 260 * escala:.0f}" width="{64 * escala:.0f}" height="{60 * escala:.0f}" fill="{cor}"/>
    <circle cx="{cx}" cy="{base - 320 * escala:.0f}" r="{cabeca_r:.0f}" fill="{cor}"/>
    <path d="M{cx - 190 * escala:.0f},{base} Q{cx - 180 * escala:.0f},{base - 200 * escala:.0f} {cx:.0f},{base - 215 * escala:.0f}
             Q{cx + 180 * escala:.0f},{base - 200 * escala:.0f} {cx + 190 * escala:.0f},{base}" fill="none" stroke="{destaque}" stroke-width="4" opacity=".9"/>
    <circle cx="{cx}" cy="{base - 320 * escala:.0f}" r="{cabeca_r:.0f}" fill="none" stroke="{destaque}" stroke-width="4" opacity=".9"/>
  </g>"""


def carro(cx, base, escala, tipo="esportivo", cor="#140826", neon="#3FD8F0"):
    s = escala
    if tipo == "picape":
        corpo = (f"M{cx - 230 * s:.0f},{base - 40 * s:.0f} l0,-70 l140,0 l40,-70 l130,0 l20,70 l130,0 l0,70 Z")
    elif tipo == "conversivel":
        corpo = (f"M{cx - 240 * s:.0f},{base - 40 * s:.0f} l20,-60 l130,-10 l40,-40 l20,0 l-20,40 l220,0 l60,30 l10,40 Z")
    elif tipo == "muscle":
        corpo = (f"M{cx - 240 * s:.0f},{base - 40 * s:.0f} l0,-55 l90,-10 l60,-55 l170,0 l50,55 l100,10 l10,55 Z")
    else:  # esportivo
        corpo = (f"M{cx - 250 * s:.0f},{base - 40 * s:.0f} l10,-40 l120,-20 l70,-45 l140,0 l80,45 l80,15 l0,45 Z")
    return f"""
  <g>
    <path d="{corpo}" fill="{cor}" stroke="{neon}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="{cx - 140 * s:.0f}" cy="{base - 40 * s:.0f}" r="{42 * s:.0f}" fill="{cor}" stroke="{neon}" stroke-width="4"/>
    <circle cx="{cx + 150 * s:.0f}" cy="{base - 40 * s:.0f}" r="{42 * s:.0f}" fill="{cor}" stroke="{neon}" stroke-width="4"/>
  </g>"""


def moto(cx, base, s, cor="#140826", neon="#FF6BB0"):
    return f"""
  <g fill="none" stroke="{neon}" stroke-width="5" stroke-linejoin="round">
    <circle cx="{cx - 130 * s:.0f}" cy="{base - 60 * s:.0f}" r="{58 * s:.0f}" fill="{cor}"/>
    <circle cx="{cx + 130 * s:.0f}" cy="{base - 60 * s:.0f}" r="{58 * s:.0f}" fill="{cor}"/>
    <path d="M{cx - 130 * s:.0f},{base - 60 * s:.0f} l90,-80 l120,0 l50,80 M{cx - 20 * s:.0f},{base - 150 * s:.0f} l-40,-40 M{cx + 60 * s:.0f},{base - 140 * s:.0f} l40,-50 l40,0" fill="{cor}"/>
  </g>"""


def barco(cx, base, s, tipo="lancha", cor="#140826", neon="#3FD8F0"):
    if tipo == "aerobarco":
        extra = (f'<circle cx="{cx - 150 * s:.0f}" cy="{base - 150 * s:.0f}" r="{80 * s:.0f}" fill="none" stroke="{neon}" stroke-width="5"/>'
                 f'<path d="M{cx - 150 * s:.0f},{base - 230 * s:.0f} l0,160 M{cx - 230 * s:.0f},{base - 150 * s:.0f} l160,0" stroke="{neon}" stroke-width="3"/>')
        casco = f"M{cx - 260 * s:.0f},{base - 50 * s:.0f} l520,0 l-30,40 l-470,0 Z"
    elif tipo == "jetski":
        extra = f'<path d="M{cx - 20 * s:.0f},{base - 70 * s:.0f} l40,-60 l30,0" stroke="{neon}" stroke-width="5" fill="none"/>'
        casco = f"M{cx - 180 * s:.0f},{base - 40 * s:.0f} l40,-40 l200,0 l120,40 l-60,30 l-280,0 Z"
    else:
        extra = f'<path d="M{cx - 60 * s:.0f},{base - 90 * s:.0f} l60,-60 l120,0 l-20,60 Z" fill="{cor}" stroke="{neon}" stroke-width="4"/>'
        casco = f"M{cx - 280 * s:.0f},{base - 90 * s:.0f} l480,0 l120,40 l-60,50 l-500,0 Z"
    return f"""
  <g>
    {extra}
    <path d="{casco}" fill="{cor}" stroke="{neon}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M{cx - 320 * s:.0f},{base + 4} q60,-18 120,0 t120,0 t120,0 t120,0 t120,0" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="3" fill="none"/>
  </g>"""


def rotulo(largura, altura, titulo, subtitulo, uid):
    tamanho = max(28, int(largura / 26))
    return f"""
  <g font-family="'Segoe UI', Arial, sans-serif">
    <rect x="{largura * .04:.0f}" y="{altura - tamanho * 3.1:.0f}" width="{min(largura * .92, len(titulo) * tamanho * .62 + 80):.0f}"
          height="{tamanho * 2.6:.0f}" rx="14" fill="#0E0A1F" fill-opacity=".72"/>
    <text x="{largura * .04 + 28:.0f}" y="{altura - tamanho * 1.75:.0f}" font-size="{tamanho}" font-weight="700" fill="#FFFFFF">{titulo}</text>
    <text x="{largura * .04 + 28:.0f}" y="{altura - tamanho * .85:.0f}" font-size="{tamanho * .48:.0f}" fill="#FFD6EA">{subtitulo}</text>
  </g>"""


def svg(largura, altura, conteudo, titulo):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {largura} {altura}" '
            f'width="{largura}" height="{altura}" role="img" aria-label="{titulo} (imagem provisória)">\n'
            f'  <title>{titulo} (imagem provisória)</title>{conteudo}\n</svg>\n')


def cena(tipo, largura, altura, ceu_chave, uid, extra=None):
    """Monta a cena de fundo + elemento principal."""
    horizonte = int(altura * .68)
    partes = [ceu(largura, altura, ceu_chave, uid),
              sol(largura * .62, horizonte - altura * .2, altura * .26, uid)]
    if tipo == "cidade":
        partes.append(skyline(largura, horizonte + 10, uid))
        partes.append(ondas(largura, horizonte + 10, altura - horizonte))
        partes.append(palmeira(largura * .06, altura, altura * .55, altura / 520))
        partes.append(palmeira(largura * .86, altura, altura * .48, altura / 600))
    elif tipo == "praia":
        partes.append(ondas(largura, horizonte, altura - horizonte))
        partes.append(f'<path d="M0,{altura} Q{largura * .3:.0f},{altura - 90} {largura * .55:.0f},{altura} Z" fill="#F2A65A" opacity=".55"/>')
        partes.append(palmeira(largura * .1, altura, altura * .6, altura / 480))
        partes.append(palmeira(largura * .22, altura, altura * .45, altura / 640))
        partes.append(f'<rect x="{largura * .55:.0f}" y="{horizonte - 12}" width="{largura * .45:.0f}" height="10" fill="#140826"/>')
        for x in range(int(largura * .58), largura, 70):
            partes.append(f'<rect x="{x}" y="{horizonte - 12}" width="8" height="40" fill="#140826"/>')
    elif tipo == "pantano":
        partes.append(ondas(largura, horizonte, altura - horizonte, "#0B2A2E", "#5BE3A0"))
        partes.append(capim(largura, altura))
        partes.append(palmeira(largura * .78, horizonte + 30, altura * .35, altura / 700, "#081A1C"))
    elif tipo == "montanha":
        partes.append(montanhas(largura, horizonte + 40))
        partes.append(f'<rect x="0" y="{horizonte + 38}" width="{largura}" height="{altura - horizonte}" fill="#0C1F1C"/>')
        for x in range(0, largura, 46):
            partes.append(f'<path d="M{x},{altura} l23,-{90 + (x * 7) % 70} l23,{90 + (x * 7) % 70} Z" fill="#081512"/>')
    elif tipo == "industrial":
        partes.append(fabrica(largura, altura))
    elif tipo == "porto":
        partes.append(porto(largura, horizonte))
    else:  # chão neutro para personagens e veículos
        partes.append(f'<rect x="0" y="{horizonte}" width="{largura}" height="{altura - horizonte}" fill="url(#chao-{uid})"/>')
        for k in range(0, largura + 1, 80):
            partes.append(f'<path d="M{largura / 2:.0f},{horizonte} L{k},{altura}" stroke="#FF6BB0" stroke-opacity=".35" stroke-width="2"/>')
        for k, y in enumerate((horizonte + 20, horizonte + 50, horizonte + 95, horizonte + 160)):
            if y < altura:
                partes.append(f'<path d="M0,{y} L{largura},{y}" stroke="#FF6BB0" stroke-opacity=".35" stroke-width="2"/>')
    if extra:
        partes.append(extra)
    return "".join(partes)


# ---------------------------------------------------------------------------
# Lista de imagens: (arquivo, título, tipo de cena, céu, elemento extra)
# ---------------------------------------------------------------------------
W, H = 800, 500  # cards (16:10)


def gerar():
    DESTINO.mkdir(parents=True, exist_ok=True)
    imagens = {}

    # Regiões
    regioes = [
        ("regiao-vice-city", "Vice City", "cidade", "noite"),
        ("regiao-leonida-keys", "Leonida Keys", "praia", "sunset"),
        ("regiao-grassrivers", "Grassrivers", "pantano", "verde"),
        ("regiao-port-gellhorn", "Port Gellhorn", "porto", "sunset"),
        ("regiao-ambrosia", "Ambrosia", "industrial", "industria"),
        ("regiao-mount-kalaga", "Mount Kalaga", "montanha", "dia"),
    ]
    for arq, titulo, tipo, c in regioes:
        imagens[arq] = svg(W, H, cena(tipo, W, H, c, arq) + rotulo(W, H, titulo, "Região de Leonida · imagem provisória", arq), titulo)

    # Personagens
    personagens = [
        ("personagem-jason-duval", "Jason Duval", "sunset", "#3FD8F0"),
        ("personagem-lucia-caminos", "Lucia Caminos", "noite", "#FF6BB0"),
        ("personagem-cal-hampton", "Cal Hampton", "roxo", "#FFD166"),
        ("personagem-boobie-ike", "Boobie Ike", "noite", "#FF9F5A"),
        ("personagem-dre-quan-priest", "Dre'Quan Priest", "industria", "#B9A2FF"),
        ("personagem-real-dimez", "Real Dimez", "dia", "#FF6BB0"),
        ("personagem-raul-bautista", "Raul Bautista", "sunset", "#5BE3A0"),
        ("personagem-brian-heder", "Brian Heder", "verde", "#FFD166"),
    ]
    for arq, titulo, c, destaque in personagens:
        corpo = pessoa(W * .5, H, 1.0, destaque=destaque)
        if arq == "personagem-real-dimez":  # dupla
            corpo = pessoa(W * .36, H, .85, destaque=destaque) + pessoa(W * .64, H, .85, destaque="#3FD8F0")
        imagens[arq] = svg(W, H, cena("neutro", W, H, c, arq, corpo).replace("&", "&amp;") +
                           rotulo(W, H, titulo.replace("'", "&#39;"), "Personagem · imagem provisória", arq), titulo.replace("'", "&#39;"))

    # Veículos
    veiculos = [
        ("veiculo-conversivel", "Conversível clássico", "sunset", carro(W * .5, H * .9, .9, "conversivel")),
        ("veiculo-muscle-car", "Muscle car", "noite", carro(W * .5, H * .9, .9, "muscle", neon="#FF9F5A")),
        ("veiculo-esportivo", "Superesportivo", "roxo", carro(W * .5, H * .9, .9, "esportivo", neon="#FF6BB0")),
        ("veiculo-moto", "Moto esportiva", "noite", moto(W * .5, H * .92, .9)),
        ("veiculo-lancha", "Lancha", "sunset", barco(W * .5, H * .82, .9, "lancha")),
        ("veiculo-aerobarco", "Aerobarco", "verde", barco(W * .5, H * .85, .9, "aerobarco", neon="#5BE3A0")),
        ("veiculo-picape", "Picape off-road", "dia", carro(W * .5, H * .9, .9, "picape", neon="#FFD166")),
        ("veiculo-jet-ski", "Jet ski", "sunset", barco(W * .5, H * .85, 1.0, "jetski", neon="#FF6BB0")),
    ]
    for arq, titulo, c, elemento in veiculos:
        tipo = "praia" if arq in ("veiculo-lancha", "veiculo-jet-ski") else (
            "pantano" if arq == "veiculo-aerobarco" else "neutro")
        imagens[arq] = svg(W, H, cena(tipo, W, H, c, arq, elemento) + rotulo(W, H, titulo, "Veículo · imagem provisória", arq), titulo)

    # Carrossel (2:1)
    CW, CH = 1600, 800
    slides = [
        ("carrossel-01-vice-city-noite", "Vice City à noite", "cidade", "noite", None),
        ("carrossel-02-leonida-keys", "Leonida Keys", "praia", "sunset", None),
        ("carrossel-03-jason-e-lucia", "Jason e Lucia", "neutro", "noite",
         pessoa(CW * .42, CH, 1.4, destaque="#3FD8F0") + pessoa(CW * .6, CH, 1.35, destaque="#FF6BB0")),
        ("carrossel-04-grassrivers", "Grassrivers", "pantano", "verde", barco(CW * .55, CH * .86, 1.2, "aerobarco", neon="#5BE3A0")),
        ("carrossel-05-mount-kalaga", "Mount Kalaga", "montanha", "dia", None),
    ]
    for arq, titulo, tipo, c, extra in slides:
        imagens[arq] = svg(CW, CH, cena(tipo, CW, CH, c, arq, extra) + rotulo(CW, CH, titulo, "Carrossel · imagem provisória", arq), titulo)

    # Hero e ilustrações de página
    imagens["hero-leonida"] = svg(1600, 900, cena("cidade", 1600, 900, "noite", "hero"), "Horizonte neon de Vice City ao pôr do sol")
    imagens["ilustracao-contato"] = svg(W, H, cena("praia", W, H, "sunset", "contato") + rotulo(W, H, "Fale com a gente", "Ilustração · imagem provisória", "contato"), "Praia de Leonida ao entardecer")
    imagens["ilustracao-login"] = svg(W, H, cena("cidade", W, H, "roxo", "login") + rotulo(W, H, "Sua conta no guia", "Ilustração · imagem provisória", "login"), "Vice City em tons de roxo")

    # Logo e favicon (sol listrado + palmeira)
    logo = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <title>Guia Leonida</title>
  <defs>
    <linearGradient id="l-fundo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2B0F4C"/><stop offset="1" stop-color="#0E0A1F"/>
    </linearGradient>
    <linearGradient id="l-sol" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFE066"/><stop offset="1" stop-color="#FF2D95"/>
    </linearGradient>
    <mask id="l-mask"><rect width="64" height="64" fill="#fff"/>
      <rect x="0" y="34" width="64" height="2" fill="#000"/><rect x="0" y="39" width="64" height="3" fill="#000"/><rect x="0" y="45" width="64" height="4" fill="#000"/>
    </mask>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#l-fundo)"/>
  <circle cx="34" cy="36" r="20" fill="url(#l-sol)" mask="url(#l-mask)"/>
  <path d="M12 56 Q18 38 22 24 l2 1 Q22 40 16 56Z" fill="#0E0A1F"/>
  <g fill="#0E0A1F"><path d="M23 24 q-10 -6 -16 2 q8 -3 16 -2Z"/><path d="M23 24 q2 -11 12 -12 q-8 5 -12 12Z"/><path d="M23 24 q12 -3 16 6 q-7 -6 -16 -6Z"/><path d="M23 24 q-4 -10 -14 -9 q9 2 14 9Z"/></g>
  <rect x="3" y="3" width="58" height="58" rx="12" fill="none" stroke="#3FD8F0" stroke-width="2"/>
</svg>
"""
    imagens["logo-guia-leonida"] = logo
    imagens["favicon"] = logo

    for nome, conteudo in imagens.items():
        (DESTINO / f"{nome}.svg").write_text(conteudo, encoding="utf-8", newline="\n")
    print(f"{len(imagens)} imagens geradas em {DESTINO}")


if __name__ == "__main__":
    gerar()
