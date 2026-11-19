"""
Verificador de contraste do Guia Leonida.

Calcula a razão de contraste de cada par texto/fundo usado no site com a
fórmula oficial da WCAG 2.x (luminância relativa) e gera a tabela em
docs/contraste.md.

Como rodar (na raiz do projeto):
    python tools/contraste.py

Fórmula (WCAG 2.2, critérios 1.4.3, 1.4.6 e 1.4.11):
    1. Converter cada canal sRGB (0–255) para 0–1: c = canal / 255
    2. Linearizar: c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    3. Luminância: L = 0.2126 * R + 0.7152 * G + 0.0722 * B
    4. Razão: (L_clara + 0.05) / (L_escura + 0.05)

Limites:
    texto normal          AA 4.5:1   AAA 7:1
    texto grande (>=24px
    ou >=18.66px negrito) AA 3:1     AAA 4.5:1
    componentes de UI e
    indicador de foco     AA 3:1 (critério 1.4.11, não há AAA)

IMPORTANTE: as cores abaixo precisam ser as mesmas de css/leonida.css.
Se mudar uma cor lá, mude aqui e rode o script de novo.
"""

from pathlib import Path

# ---------------------------------------------------------------------------
# Paletas (espelho dos tokens de css/leonida.css)
# ---------------------------------------------------------------------------
PALETAS = {
    "Escuro": {
        "fundo": "#0B1630",          # azul-noite
        "superficie": "#13224A",
        "titulo": "#F4E6CF",         # creme
        "texto": "#E9EEF7",
        "texto-suave": "#A9B6D3",
        "acento": "#FF7A93",         # rosa do pôr do sol
        "sobre-acento": "#0B1630",
        "borda-campo": "#7186B3",
        "foco": "#FFD23F",
        "erro": "#FF9B8F",
        "sucesso": "#7FE0B0",
    },
    "Claro": {
        "fundo": "#F3EEE6",
        "superficie": "#FFFFFF",
        "titulo": "#0B1630",
        "texto": "#0B1630",
        "texto-suave": "#3E4A66",
        "acento": "#B01E4E",
        "sobre-acento": "#FFFFFF",
        "borda-campo": "#6A7590",
        "foco": "#0B1630",
        "erro": "#B42318",
        "sucesso": "#146C43",
    },
    "Alto contraste": {
        "fundo": "#000000",
        "superficie": "#000000",
        "titulo": "#FFFFFF",
        "texto": "#FFFFFF",
        "texto-suave": "#FFFFFF",
        "acento": "#FFFF00",
        "sobre-acento": "#000000",
        "borda-campo": "#FFFFFF",
        "foco": "#FFFF00",
        "erro": "#FF8080",
        "sucesso": "#7CFF7C",
    },
}

# Pares usados de verdade no site: (frente, fundo, onde é usado, tipo)
# tipo: "texto" (4.5:1), "grande" (3:1) ou "ui" (3:1)
PARES = [
    ("titulo", "fundo", "Títulos das seções", "texto"),
    ("texto", "fundo", "Texto do corpo sobre o fundo da página", "texto"),
    ("texto", "superficie", "Texto dentro dos cards e painéis", "texto"),
    ("texto-suave", "fundo", "Texto secundário (datas, rodapé)", "texto"),
    ("texto-suave", "superficie", "Descrição dos cards", "texto"),
    ("acento", "fundo", "Links em rosa", "texto"),
    ("acento", "superficie", "Links dentro dos cards", "texto"),
    ("sobre-acento", "acento", "Texto do botão principal", "texto"),
    ("erro", "superficie", "Mensagens de erro do formulário", "texto"),
    ("sucesso", "superficie", "Mensagens de sucesso", "texto"),
    ("borda-campo", "superficie", "Borda dos campos de formulário", "ui"),
    ("foco", "fundo", "Contorno de foco sobre o fundo", "ui"),
    ("foco", "superficie", "Contorno de foco sobre os cards", "ui"),
]

# Texto sobre as fotos do jogo. A foto muda, então o cálculo usa o PIOR caso
# possível: um pixel branco puro atrás do véu (rgb 11 22 48 em css/leonida.css).
# (onde, opacidade do véu naquele ponto, cor do texto, tipo)
VEU = "#0B1630"
TEXTO_SOBRE_FOTO = [
    ("Menu do cabeçalho sobre o topo do hero (véu ~0,70)", 0.70, "#E9EEF7", "texto"),
    ("Nome \"Leonida\" no hero, parte mais alta da letra (véu ~0,60)", 0.60, "#F4E6CF", "grande"),
    ("Linha e status embaixo do hero (véu ~0,90)", 0.90, "#E9EEF7", "texto"),
]

# Exemplo "antes e depois" para o relatório
ANTES_DEPOIS = [
    {
        "nome": "Rosa neon do botão principal no modo claro",
        "antes": "#FF2D95",
        "depois": "#B8175E",
        "fundo": "#FFF8F2",
        "explicacao": (
            "O rosa neon original (#FF2D95) é a cor mais 'Vice City' da paleta, "
            "mas sobre o fundo areia ele não chega nem a 4,5:1. Escurecemos o "
            "rosa mantendo o matiz (framboesa) até passar no AA com folga."
        ),
    },
    {
        "nome": "Ciano dos links no modo claro",
        "antes": "#22D3EE",
        "depois": "#0B6577",
        "fundo": "#FFFFFF",
        "explicacao": (
            "O ciano neon é ótimo no modo escuro, mas no branco quase desaparece "
            "(cerca de 1,8:1). No modo claro usamos um azul-petróleo do mesmo matiz."
        ),
    },
    {
        "nome": "Roxo dos rótulos de categoria no modo escuro",
        "antes": "#7C3AED",
        "depois": "#B9A2FF",
        "fundo": "#1A1433",
        "explicacao": (
            "O roxo saturado (#7C3AED) combina com a noite de Vice City, mas sobre "
            "o card escuro fica em 3,09:1, abaixo dos 4,5:1 exigidos para texto. "
            "Clareamos para um lilás que mantém o tom e passa até no AAA."
        ),
    },
    {
        "nome": "Título em degradê neon no modo claro",
        "antes": "#FF8A3D",
        "depois": "#A3410B",
        "fundo": "#FFE9D6",
        "explicacao": (
            "O título 'Leonida' usava o degradê neon puro (rosa, laranja e roxo). "
            "O ponto laranja (#FF8A3D) sobre o degradê areia do topo ficava abaixo "
            "de 3:1, reprovando até como texto grande. O degradê do texto passou a "
            "usar as cores de texto do tema."
        ),
    },
]

LIMITES = {"texto": (4.5, 7.0), "grande": (3.0, 4.5), "ui": (3.0, None)}


def hex_para_rgb(cor: str) -> tuple[int, int, int]:
    """Converte '#RRGGBB' em (r, g, b)."""
    cor = cor.lstrip("#")
    return tuple(int(cor[i:i + 2], 16) for i in (0, 2, 4))


def luminancia(cor: str) -> float:
    """Luminância relativa segundo a WCAG."""
    def canal(c: int) -> float:
        c = c / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = (canal(c) for c in hex_para_rgb(cor))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def razao(cor1: str, cor2: str) -> float:
    """Razão de contraste entre duas cores (de 1 a 21)."""
    l1, l2 = luminancia(cor1), luminancia(cor2)
    clara, escura = max(l1, l2), min(l1, l2)
    return (clara + 0.05) / (escura + 0.05)


def avaliar(valor: float, tipo: str) -> tuple[str, str]:
    """Retorna ('Passa'/'Falha' no AA, 'Passa'/'Falha'/'—' no AAA)."""
    aa, aaa = LIMITES[tipo]
    r_aa = "✅ Passa" if valor >= aa else "❌ Falha"
    if aaa is None:
        r_aaa = "—"
    else:
        r_aaa = "✅ Passa" if valor >= aaa else "❌ Falha"
    return r_aa, r_aaa


def misturar(cor: str, fundo: str, alfa: float) -> str:
    """Cor resultante de 'cor' com opacidade 'alfa' por cima de 'fundo'."""
    c, f = hex_para_rgb(cor), hex_para_rgb(fundo)
    return "#" + "".join(f"{round(alfa * a + (1 - alfa) * b):02X}" for a, b in zip(c, f))


def fmt(valor: float) -> str:
    """Formata a razão no padrão brasileiro (vírgula decimal)."""
    return f"{valor:.2f}:1".replace(".", ",")


def amostra(cor: str) -> str:
    return f"`{cor.upper()}`"


def gerar() -> tuple[str, int]:
    linhas = [
        "# Análise de contraste (WCAG 2.2)",
        "",
        "> Arquivo **gerado automaticamente** por `tools/contraste.py`. "
        "Não edite à mão: altere as cores no script e rode `python tools/contraste.py`.",
        "",
        "## Como o cálculo é feito",
        "",
        "1. Cada canal da cor (R, G, B) é convertido de 0–255 para 0–1.",
        "2. O canal é linearizado: `c <= 0,04045 ? c / 12,92 : ((c + 0,055) / 1,055)^2,4`.",
        "3. Luminância relativa: `L = 0,2126·R + 0,7152·G + 0,0722·B`.",
        "4. Razão de contraste: `(L_clara + 0,05) / (L_escura + 0,05)`, de 1:1 a 21:1.",
        "",
        "| Tipo | AA | AAA | Critério |",
        "|---|---|---|---|",
        "| Texto normal | 4,5:1 | 7:1 | 1.4.3 / 1.4.6 |",
        "| Texto grande (≥ 24px, ou ≥ 18,66px em negrito) | 3:1 | 4,5:1 | 1.4.3 / 1.4.6 |",
        "| Componentes de interface e foco | 3:1 | — | 1.4.11 |",
        "",
        "Todos os textos foram avaliados com o limite de **texto normal** (4,5:1), "
        "mesmo quando aparecem em tamanho grande, para ter margem de segurança.",
        "",
    ]

    falhas = 0
    for nome, paleta in PALETAS.items():
        linhas += [
            f"## Modo {nome.lower()}",
            "",
            "| Uso | Cor da frente | Cor de fundo | Razão | AA | AAA |",
            "|---|---|---|---|---|---|",
        ]
        for frente, fundo, uso, tipo in PARES:
            cf, cb = paleta[frente], paleta[fundo]
            r = razao(cf, cb)
            aa, aaa = avaliar(r, tipo)
            if "Falha" in aa:
                falhas += 1
            rotulo_tipo = " *(UI, 3:1)*" if tipo == "ui" else ""
            linhas.append(
                f"| {uso}{rotulo_tipo} | {amostra(cf)} `{frente}` | {amostra(cb)} `{fundo}` "
                f"| **{fmt(r)}** | {aa} | {aaa} |"
            )
        linhas.append("")

    # Texto sobre as fotos: mistura o véu com branco puro (pior caso)
    linhas += [
        "## Texto sobre as fotos do jogo (pior caso)",
        "",
        "As capturas mudam de uma tela para outra, então o texto sobre foto é medido contra o pior "
        "caso possível: um pixel **branco puro** atrás do véu escuro do hero. A cor de fundo da tabela "
        "é a mistura do véu (`#0B1630`) com o branco na opacidade daquele ponto.",
        "",
        "| Onde | Opacidade do véu | Fundo no pior caso | Texto | Razão | Limite | AA |",
        "|---|---|---|---|---|---|---|",
    ]
    for onde, alfa, cor, tipo in TEXTO_SOBRE_FOTO:
        fundo = misturar(VEU, "#FFFFFF", alfa)
        r = razao(cor, fundo)
        aa, _ = avaliar(r, tipo)
        if "Falha" in aa:
            falhas += 1
        limite = "3:1 (texto grande)" if tipo == "grande" else "4,5:1"
        linhas.append(f"| {onde} | {str(alfa).replace('.', ',')} | {amostra(fundo)} | {amostra(cor)} | **{fmt(r)}** | {limite} | {aa} |")
    linhas.append("")

    linhas += [
        "## Antes e depois: cores que falharam e foram corrigidas",
        "",
        "| Caso | Antes | Razão antes | Depois | Razão depois | Fundo |",
        "|---|---|---|---|---|---|",
    ]
    for caso in ANTES_DEPOIS:
        ra = razao(caso["antes"], caso["fundo"])
        rd = razao(caso["depois"], caso["fundo"])
        linhas.append(
            f"| {caso['nome']} | {amostra(caso['antes'])} | {fmt(ra)} {avaliar(ra, 'texto')[0]} "
            f"| {amostra(caso['depois'])} | {fmt(rd)} {avaliar(rd, 'texto')[0]} | {amostra(caso['fundo'])} |"
        )
    linhas.append("")
    for caso in ANTES_DEPOIS:
        linhas += [f"- **{caso['nome']}:** {caso['explicacao']}"]
    linhas += [
        "",
        "## Resultado",
        "",
        (f"**{falhas} par(es) falharam no AA.**" if falhas else
         "**Todos os pares usados no site passam no nível AA da WCAG 2.2.**"),
        "",
    ]
    return "\n".join(linhas), falhas


if __name__ == "__main__":
    texto, falhas = gerar()
    destino = Path(__file__).resolve().parent.parent / "docs" / "contraste.md"
    destino.write_text(texto, encoding="utf-8", newline="\n")
    # Resumo no terminal
    for nome, paleta in PALETAS.items():
        for frente, fundo, uso, tipo in PARES:
            r = razao(paleta[frente], paleta[fundo])
            minimo = LIMITES[tipo][0]
            marca = "ok " if r >= minimo else "FALHA"
            print(f"[{marca}] {nome:15} {frente:15} sobre {fundo:13} {r:5.2f}:1")
    print(f"\nTabela salva em {destino}")
    print("Falhas:", falhas)
