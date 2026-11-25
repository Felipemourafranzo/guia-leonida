#!/usr/bin/env python3
"""Gera docs/folha-de-contato-kit.html: a folha de contato do material novo do kit oficial.

Uso: python3 tools/folha_de_contato.py

Lê assets/img/jogo/manifesto.json (ilustrações, postais, mapa, logo),
docs/folha-de-contato/candidatas.json (capturas ainda não usadas, geradas por
tools/processar_kit.py) e assets/cenas/*/cena.json (quadros das cenas de vídeo).
Cada imagem tem uma caixa "Usar"; o botão "Copiar escolhidas" copia a lista
para colar na conversa. As marcações ficam só neste navegador (localStorage).
"""
import html
import json
from collections import OrderedDict
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / 'docs' / 'folha-de-contato-kit.html'
GRUPOS = OrderedDict([
    ('logo', 'Logo de GTA VI (recorte com transparência)'),
    ('arte', 'Ilustrações oficiais'),
    ('postal', 'Cartões-postais das 6 regiões'),
    ('mapa', 'Pôster do mapa de Leonida'),
    ('tour', 'Escolhidas: tour pelas 6 regiões'),
    ('editorial', 'Escolhidas: bloco Jason e Lucia'),
    ('veiculo', 'Escolhidas: veículos com nome oficial'),
])


def kb(n):
    return f'{round(n / 1024)} KB'


def figura(chave, src, alt, legenda, classe=''):
    e = html.escape
    return f'''
      <figure class="{classe}">
        <a href="{e(src)}"><img src="{e(src)}" alt="{e(alt)}" loading="lazy" decoding="async"></a>
        <figcaption>
          <label><input type="checkbox" data-chave="{e(chave)}"> <b>{e(chave)}</b></label>
          {legenda}
        </figcaption>
      </figure>'''


def main():
    manifesto = json.loads((RAIZ / 'assets/img/jogo/manifesto.json').read_text(encoding='utf-8'))
    candidatas = json.loads((RAIZ / 'docs/folha-de-contato/candidatas.json').read_text(encoding='utf-8'))
    secoes = []
    total = 0

    for grupo, titulo in GRUPOS.items():
        itens = [m for m in manifesto if m['grupo'] == grupo]
        figs = []
        for m in itens:
            tamanhos = sorted(m['tamanhos'].items(), key=lambda t: -int(t[0]))
            maior, menor = tamanhos[0], tamanhos[-1]
            src = f'../assets/img/jogo/{m["arquivo"]}-{menor[0]}.webp'
            if grupo == 'mapa':
                src = f'../assets/img/jogo/{m["arquivo"]}-{maior[0]}.webp'
            legenda = (f'<span>Original: {html.escape(m["original"])} ({m["largura_original"]}×{m["altura_original"]})'
                       f' · {" / ".join(t[0] + " px" for t in tamanhos)} · maior: {kb(maior[1][1])}</span>'
                       f'<span class="alt">alt: {html.escape(m["alt"])}</span>')
            classe = 'larga' if grupo == 'mapa' else ('fundo-roxo' if grupo == 'logo' else '')
            figs.append(figura(m['arquivo'], src, m['alt'], legenda, classe))
        total += len(figs)
        secoes.append(f'<section><h2>{titulo} <small>{len(figs)}</small></h2>'
                      f'<p class="nota">Já convertidas em WebP e no manifesto. Fonte: © Rockstar Games, '
                      f'<a href="https://www.rockstargames.com/VI/media">kit de mídia oficial</a>.</p>'
                      f'<div class="grade">{"".join(figs)}</div></section>')

    # Cenas de vídeo
    for cena_json in sorted((RAIZ / 'assets/cenas').glob('*/cena.json')):
        cena = json.loads(cena_json.read_text(encoding='utf-8'))
        n = cena['quadros']['1280']
        idx = sorted({1, n // 4, n // 2, 3 * n // 4, n})
        figs = ''.join(
            f'<figure><img src="../assets/cenas/{cena["nome"]}/1280/q{i:03d}.webp" alt="Quadro {i} de {n}" loading="lazy">'
            f'<figcaption>Quadro {i} de {n}</figcaption></figure>' for i in idx)
        secoes.append(f'<section><h2>Cena de vídeo: {html.escape(cena["nome"])} <small>{n} quadros</small></h2>'
                      f'<p class="nota">Do {html.escape(cena["original"])} (Videoclipes, kit oficial). '
                      f'{cena["quadros"]["1280"]} quadros em 1280 px e {cena["quadros"]["720"]} em 720 px; '
                      f'os intermediários foram criados pelo ffmpeg (minterpolate), porque o clipe tem só 1,5 s.</p>'
                      f'<div class="grade grade-quadros">{figs}</div></section>')

    # Candidatas
    por_pasta = OrderedDict()
    for c in candidatas:
        por_pasta.setdefault(c['pasta'], []).append(c)
    for pasta, itens in por_pasta.items():
        figs = []
        for c in itens:
            legenda = f'<span>{html.escape(c["pacote"])} · {html.escape(c["original"])}</span>'
            figs.append(figura(c['original'], f'folha-de-contato/{c["arquivo"]}',
                               f'Captura oficial {c["original"]}', legenda))
        total += len(figs)
        secoes.append(f'<section><h2>Candidatas: {html.escape(pasta)} <small>{len(figs)}</small></h2>'
                      f'<div class="grade grade-mini">{"".join(figs)}</div></section>')

    pagina = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Folha de contato do kit oficial | Guia Leonida</title>
<style>
  :root {{ color-scheme: dark; }}
  body {{ margin: 0; font: 15px/1.5 system-ui, sans-serif; background: #120b22; color: #f4eefc; }}
  main {{ padding: 32px clamp(16px, 4vw, 56px) 120px; }}
  h1 {{ font-size: 28px; margin: 0 0 8px; }}
  .intro, .nota {{ max-width: 75ch; color: #c9bddf; }}
  h2 {{ font-size: 20px; margin: 48px 0 8px; border-top: 1px solid #2a1a47; padding-top: 16px; }}
  h2 small {{ color: #c9bddf; font-weight: 400; }}
  .grade {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)); gap: 24px; }}
  .grade-mini {{ grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr)); gap: 16px; }}
  .grade-quadros {{ grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr)); gap: 12px; }}
  figure {{ margin: 0; }}
  figure.larga {{ grid-column: 1 / -1; max-width: 900px; }}
  figure.fundo-roxo img {{ background: #1b1030; padding: 24px; box-sizing: border-box; }}
  img {{ width: 100%; height: auto; display: block; }}
  figcaption {{ display: grid; gap: 2px; padding-top: 8px; font-size: 13px; color: #c9bddf; }}
  figcaption b {{ color: #f4eefc; font-weight: 600; }}
  label {{ display: flex; gap: 8px; align-items: center; min-height: 32px; cursor: pointer; }}
  input[type=checkbox] {{ width: 20px; height: 20px; accent-color: #ff4fa3; }}
  figure:has(input:checked) img {{ outline: 3px solid #ff4fa3; outline-offset: 2px; }}
  .alt {{ font-style: italic; }}
  a {{ color: #ffe8a3; }}
  :focus-visible {{ outline: 3px solid #ffe8a3; outline-offset: 3px; }}
  .barra {{ position: fixed; bottom: 0; left: 0; right: 0; display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
           padding: 12px clamp(16px, 4vw, 56px); background: rgb(12 8 24 / .95); border-top: 1px solid #2a1a47; }}
  .barra button {{ min-height: 44px; padding: 0 18px; border-radius: 999px; border: 0; font-weight: 700;
                  background: linear-gradient(90deg, #ff4fa3, #ff8a3d); color: #0c0818; }}
  .barra button.secundario {{ background: transparent; color: #f4eefc; border: 1px solid #c9bddf; }}
</style>
</head>
<body>
<main>
  <h1>Folha de contato: material novo do kit oficial de GTA VI</h1>
  <p class="intro">{total} imagens do kit de mídia oficial da Rockstar Games (rockstargames.com/VI/media),
  baixadas do CDN da Rockstar em 25/11/2026. As ilustrações, os postais, o mapa e o logo já estão convertidos;
  as capturas candidatas aparecem em miniatura (480 px) e só serão convertidas depois da escolha. Marque
  <b>Usar</b> nas que devem entrar no site e clique em <b>Copiar escolhidas</b>. Clique numa imagem para
  ver maior. Todas: © Rockstar Games.</p>
  {"".join(secoes)}
</main>
<div class="barra" role="region" aria-label="Escolhas">
  <span id="contagem" aria-live="polite">0 escolhidas</span>
  <button type="button" id="copiar">Copiar escolhidas</button>
  <button type="button" class="secundario" id="limpar">Limpar</button>
</div>
<script>
(function () {{
  var CHAVE = 'gl-folha-kit';
  var caixas = Array.prototype.slice.call(document.querySelectorAll('[data-chave]'));
  var salvas = [];
  try {{ salvas = JSON.parse(localStorage.getItem(CHAVE) || '[]'); }} catch (e) {{}}
  caixas.forEach(function (c) {{ c.checked = salvas.indexOf(c.dataset.chave) >= 0; }});
  function escolhidas() {{ return caixas.filter(function (c) {{ return c.checked; }}).map(function (c) {{ return c.dataset.chave; }}); }}
  function atualizar() {{
    var lista = escolhidas();
    document.getElementById('contagem').textContent = lista.length + (lista.length === 1 ? ' escolhida' : ' escolhidas');
    try {{ localStorage.setItem(CHAVE, JSON.stringify(lista)); }} catch (e) {{}}
  }}
  caixas.forEach(function (c) {{ c.addEventListener('change', atualizar); }});
  document.getElementById('copiar').addEventListener('click', function () {{
    var texto = escolhidas().join('\\n');
    var aviso = document.getElementById('contagem');
    if (navigator.clipboard) {{
      navigator.clipboard.writeText(texto).then(function () {{ aviso.textContent = 'Lista copiada (' + escolhidas().length + ')'; }});
    }} else {{ window.prompt('Copie a lista:', texto); }}
  }});
  document.getElementById('limpar').addEventListener('click', function () {{
    caixas.forEach(function (c) {{ c.checked = false; }}); atualizar();
  }});
  atualizar();
}})();
</script>
</body>
</html>
'''
    SAIDA.write_text(pagina, encoding='utf-8')
    print('ok', SAIDA.relative_to(RAIZ), total, 'imagens')


if __name__ == '__main__':
    main()
