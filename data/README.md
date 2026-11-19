# Pasta `data/`

Os dados do site (catálogo, novidades, checklist e status do lançamento) ficam em **`js/data.js`**, e
não em arquivos `.json` aqui.

**Motivo:** ler um `.json` exige `fetch()`, e o navegador bloqueia o `fetch()` quando a página é aberta
direto pelo arquivo (`file://`). Com um `.js` comum, o site funciona tanto no GitHub Pages quanto com um
duplo clique no `index.html`, que é como o professor pode abrir o trabalho.

Cada item em `js/data.js` tem um campo `fonte` com o título e a URL de onde a informação veio. O que não
foi confirmado oficialmente tem `status: 'a-confirmar'` e aparece no site como "a confirmar".
