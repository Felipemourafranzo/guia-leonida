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

IMPORTANTE: as cores abaixo precisam ser as mesmas de css/themes.css.
Se mudar uma cor lá, mude aqui e rode o script de novo.
"""

from pathlib import Path

# ---------------------------------------------------------------------------
# Paletas (espelho dos tokens de css/themes.css)
# ---------------------------------------------------------------------------
PALETAS = {
    "Escuro": {
        "fundo": "#0E0A1F",
        "superficie": "#1A1433",
        "superficie-2": "#251C47",
        "texto": "#F5F0FF",
        "texto-suave": "#C9BEE8",
        "primaria": "#FF6BB0",
        "sobre-primaria": "#1A0612",
        "secundaria": "#FF9F5A",
        "acento": "#3FD8F0",
        "roxo": "#B9A2FF",
        "borda-campo": "#8B7BC4",
        "foco": "#3FD8F0",
        "erro": "#FF8F8F",
        "sucesso": "#5BE3A0",
    },
    "Claro": {
        "fundo": "#FFF8F2",
        "superficie": "#FFFFFF",
        "superficie-2": "#F5EDFF",
        "texto": "#1C1230",
        "texto-suave": "#4F4566",
        "primaria": "#B8175E",
        "sobre-primaria": "#FFFFFF",
        "secundaria": "#A3410B",
        "acento": "#0B6577",
        "roxo": "#5B2BC4",
        "borda-campo": "#7E7398",
        "foco": "#5B2BC4",
        "erro": "#B42318",
        "sucesso": "#146C43",
    },
    "Alto contraste": {
        "fundo": "#000000",
        "superficie": "#000000",
        "superficie-2": "#000000",
        "texto": "#FFFFFF",
        "texto-suave": "#FFFFFF",
        "primaria": "#FFFF00",
        "sobre-primaria": "#000000",
        "secundaria": "#FFFF00",
        "acento": "#00FFFF",
        "roxo": "#FFFFFF",
        "borda-campo": "#FFFFFF",
        "foco": "#FFFF00",
        "erro": "#FF8080",
        "sucesso": "#7CFF7C",
    },
}

# Pares usados de verdade no site: (frente, fundo, onde é usado, tipo)
# tipo: "texto" (4.5:1), "grande" (3:1) ou "ui" (3:1)
PARES = [
    ("texto", "fundo", "Texto do corpo sobre o fundo da página", "texto"),
    ("texto", "superficie", "Texto dentro dos cards", "texto"),
    ("texto", "superficie-2", "Texto em painéis destacados", "texto"),
    ("texto-suave", "fundo", "Texto secundário (legendas, datas)", "texto"),
    ("texto-suave", "superficie", "Descrição dos cards", "texto"),
    ("primaria", "fundo", "Links e títulos em rosa", "texto"),
    ("primaria", "superficie", "Links dentro dos cards", "texto"),
    ("sobre-primaria", "primaria", "Texto do botão principal", "texto"),
    ("secundaria", "fundo", "Destaques em laranja (selos, números)", "texto"),
    ("secundaria", "superficie", "Selos laranja nos cards", "texto"),
    ("acento", "fundo", "Links em ciano / ícones", "texto"),
    ("acento", "superficie", "Ícones ciano nos cards", "texto"),
    ("roxo", "superficie", "Rótulos de categoria em roxo", "texto"),
    ("erro", "superficie", "Mensagens de erro do formulário", "texto"),
    ("sucesso", "superficie", "Mensagens de sucesso", "texto"),
    ("borda-campo", "superficie", "Borda dos campos de formulário", "ui"),
    ("foco", "fundo", "Contorno de foco sobre o fundo", "ui"),
    ("foco", "superficie", "Contorno de foco sobre os cards", "ui"),
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
            "o card escuro fica abaixo de 3:1. Clareamos para um lilás que mantém "
            "o tom e passa até no AAA."
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
    destino.write_text(texto, encoding="utf-8")
    # Resumo no terminal
    for nome, paleta in PALETAS.items():
        for frente, fundo, uso, tipo in PARES:
            r = razao(paleta[frente], paleta[fundo])
            minimo = LIMITES[tipo][0]
            marca = "ok " if r >= minimo else "FALHA"
            print(f"[{marca}] {nome:15} {frente:15} sobre {fundo:13} {r:5.2f}:1")
    print(f"\nTabela salva em {destino}")
    print("Falhas:", falhas)
