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

IMPORTANTE: as cores abaixo precisam ser as mesmas de css/themes.css
(e as fixas das cenas, de css/style.css e css/cenas.css).
Se mudar uma cor lá, mude aqui e rode o script de novo.
"""

from pathlib import Path

# ---------------------------------------------------------------------------
# Paletas (espelho dos tokens de css/themes.css)
# ---------------------------------------------------------------------------
PALETAS = {
    "Escuro": {
        "fundo": "#120B22",
        "fundo-2": "#1B1030",
        "superficie": "#1B1030",
        "superficie-2": "#2A1A47",
        "texto": "#F4EEFC",
        "texto-suave": "#C9BDDF",
        "destaque": "#FFE8A3",
        "primaria": "#FF4FA3",
        "sobre-primaria": "#0C0818",
        "secundaria": "#FF8A3D",
        "acento": "#5EE7FF",
        "borda-campo": "#8F7CC0",
        "foco": "#FFE8A3",
        "erro": "#FF9B9B",
        "sucesso": "#6EE7B0",
    },
    "Claro": {
        "fundo": "#FBF4EA",
        "fundo-2": "#F3E8DA",
        "superficie": "#FFFFFF",
        "superficie-2": "#F3E8DA",
        "texto": "#1B1030",
        "texto-suave": "#4A3D63",
        "destaque": "#A3410B",
        "primaria": "#B3135F",
        "sobre-primaria": "#FFFFFF",
        "secundaria": "#A3410B",
        "acento": "#0B6577",
        "borda-campo": "#7D6F8F",
        "foco": "#5B2BC4",
        "erro": "#B42318",
        "sucesso": "#146C43",
    },
    "Alto contraste": {
        "fundo": "#000000",
        "fundo-2": "#000000",
        "superficie": "#000000",
        "superficie-2": "#000000",
        "texto": "#FFFFFF",
        "texto-suave": "#FFFFFF",
        "destaque": "#FFFF00",
        "primaria": "#FFFF00",
        "sobre-primaria": "#000000",
        "secundaria": "#FFFF00",
        "acento": "#00FFFF",
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
    ("texto", "fundo-2", "Texto nas faixas alternadas", "texto"),
    ("texto", "superficie", "Texto em painéis, campos e modais", "texto"),
    ("texto", "superficie-2", "Texto em painéis destacados", "texto"),
    ("texto-suave", "fundo", "Texto secundário (legendas, datas)", "texto"),
    ("texto-suave", "superficie", "Texto secundário em painéis", "texto"),
    ("destaque", "fundo", "Sobretítulos e datas da linha do tempo", "texto"),
    ("destaque", "superficie", "Rótulos do painel de acessibilidade", "texto"),
    ("primaria", "fundo", "Links e títulos de seção em rosa", "texto"),
    ("primaria", "superficie", "Links dentro de painéis", "texto"),
    ("sobre-primaria", "primaria", "Texto do botão principal", "texto"),
    ("secundaria", "fundo", "Destaques em laranja", "texto"),
    ("acento", "fundo", "Detalhes em ciano", "texto"),
    ("erro", "superficie", "Mensagens de erro do formulário", "texto"),
    ("sucesso", "superficie", "Mensagens de sucesso", "texto"),
    ("borda-campo", "superficie", "Borda dos campos de formulário", "ui"),
    ("borda-campo", "fundo", "Borda dos botões de contorno", "ui"),
    ("foco", "fundo", "Contorno de foco sobre o fundo", "ui"),
    ("foco", "superficie", "Contorno de foco sobre painéis", "ui"),
]

# Cores FIXAS das cenas com foto (página inicial, topo das páginas, cards e
# rodapé): ficam iguais em qualquer tema. O fundo é o ponto mais claro do
# véu escuro que fica sob o texto (cor do véu com a opacidade mínima usada
# atrás do texto). (frente, fundo, uso)
CENAS = [
    ("#F4EEFC", "#0C0818", "Texto claro nas cenas, nos cards do catálogo e no rodapé"),
    ("#C9BDDF", "#0C0818", "Resumo dos cards e textos secundários das cenas"),
    ("#FF4FA3", "#0C0818", "Título rosa da cena de vídeo"),
    ("#FFE8A3", "#0C0818", "Citação gigante, rótulos e item ativo do menu"),
    ("#FF8CC4", "#0C0818", "Rótulo 'Personagem' nos cards"),
    ("#FFB27D", "#0C0818", "Rótulo 'Veículo' nos cards"),
    ("#8EEEFF", "#0C0818", "Rótulo 'Região' nos cards"),
    ("#0C0818", "#FF4FA3", "Texto do botão em degradê (ponto rosa, o pior caso)"),
    ("#0C0818", "#FF8A3D", "Faixa do topo (ponto laranja)"),
    ("#0C0818", "#FFE8A3", "Botão 'pular para o conteúdo'"),
    ("#FFFFFF", "#120B22", "Marcadores das regiões no mapa"),
    ("#F4EEFC", "#2D2440", "Texto sobre o véu mais claro das cenas (véu de 85% sobre foto clara)"),
]

# Exemplo "antes e depois" para o relatório
ANTES_DEPOIS = [
    {
        "nome": "Rosa da paleta nova no modo claro",
        "antes": "#FF4FA3",
        "depois": "#B3135F",
        "fundo": "#FBF4EA",
        "explicacao": (
            "O rosa #FF4FA3 é a cor principal do redesign e passa com folga no escuro (6,29:1), "
            "mas sobre a areia do modo claro fica perto de 2,8:1. No claro, links e botões usam "
            "um rosa framboesa do mesmo matiz."
        ),
    },
    {
        "nome": "Laranja do pôr do sol como texto no modo claro",
        "antes": "#FF8A3D",
        "depois": "#A3410B",
        "fundo": "#FBF4EA",
        "explicacao": (
            "O laranja #FF8A3D só aparece em degradês e brilhos. Quando vira texto no modo claro "
            "(sobretítulos), usa o laranja queimado #A3410B."
        ),
    },
    {
        "nome": "Ciano de detalhe no modo claro",
        "antes": "#5EE7FF",
        "depois": "#0B6577",
        "fundo": "#FFFFFF",
        "explicacao": (
            "O ciano é só detalhe no escuro. No branco ele quase desaparece, então o modo claro "
            "usa um azul-petróleo do mesmo matiz."
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
        "## Cores fixas das cenas com foto",
        "",
        "A página inicial, o topo das páginas internas, os cards do catálogo e o rodapé ficam escuros "
        "em qualquer tema. O texto fica sempre sobre um véu escuro (degradê de #0C0818 com 55% a 96% de "
        "opacidade) por cima da foto; a tabela mede contra o fundo do véu e contra o caso mais claro.",
        "",
        "| Uso | Cor da frente | Cor de fundo | Razão | AA |",
        "|---|---|---|---|---|",
    ]
    for frente, fundo, uso in CENAS:
        r = razao(frente, fundo)
        aa, _ = avaliar(r, "texto")
        if "Falha" in aa:
            falhas += 1
        linhas.append(f"| {uso} | {amostra(frente)} | {amostra(fundo)} | **{fmt(r)}** | {aa} |")
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
