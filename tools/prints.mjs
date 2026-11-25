#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [url, tamanho, saida, alvo = 'topo', ...resto] = process.argv.slice(2);
if (!url || !tamanho || !saida) {
  console.error('Uso: node tools/prints.mjs <url> <largura>x<altura> <saida.jpg> [alvo] [--reduzir] [--espera=ms] [--pagina]');
  process.exit(1);
}
const [largura, altura] = tamanho.split('x').map(Number);
const reduzir = resto.includes('--reduzir');
const paginaInteira = resto.includes('--pagina');
const comAxe = resto.includes('--axe');
const opcao = (nome) => { const o = resto.find((x) => x.startsWith(`--${nome}=`)); return o ? o.slice(nome.length + 3) : null; };
const armazenar = opcao('armazenar');
const antes = opcao('antes');
const tabs = Number(opcao('tab') || 0);
const depois = opcao('depois');
const medir = resto.includes('--medir');
const espera = Number((resto.find((o) => o.startsWith('--espera=')) || '--espera=1800').split('=')[1]);
const dormir = (ms) => new Promise((ok) => setTimeout(ok, ms));

const perfil = mkdtempSync(join(tmpdir(), 'gl-chrome-'));
const porta = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn('google-chrome', [
  '--headless=new', `--remote-debugging-port=${porta}`, `--user-data-dir=${perfil}`,
  '--no-first-run', '--hide-scrollbars', '--mute-audio', `--window-size=${largura},${altura}`, 'about:blank'
], { stdio: 'ignore' });

let ws;
try {
  let alvos;
  for (let i = 0; i < 50 && !alvos; i++) {
    await dormir(150);
    try { alvos = await (await fetch(`http://127.0.0.1:${porta}/json`)).json(); } catch {  }
  }
  const pagina = alvos.find((t) => t.type === 'page');
  ws = new WebSocket(pagina.webSocketDebuggerUrl);
  await new Promise((ok) => ws.addEventListener('open', ok));
  let id = 0;
  const pendentes = new Map();
  const erros = [];
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pendentes.has(msg.id)) { pendentes.get(msg.id)(msg); pendentes.delete(msg.id); return; }
    if (msg.method === 'Runtime.exceptionThrown') { erros.push('JS: ' + msg.params.exceptionDetails.exception?.description?.split('\n')[0]); }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      erros.push('console: ' + msg.params.args.map((a) => a.value ?? a.description).join(' '));
    }
    if (msg.method === 'Network.responseReceived' && msg.params.response.status >= 400) {
      erros.push(`HTTP ${msg.params.response.status}: ${msg.params.response.url}`);
    }
  });
  const cdp = (method, params = {}) => new Promise((ok) => {
    const n = ++id;
    pendentes.set(n, ok);
    ws.send(JSON.stringify({ id: n, method, params }));
  });
  const avaliar = async (expr) => (await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;

  await cdp('Runtime.enable');
  await cdp('Network.enable');
  await cdp('Page.enable');
  await cdp('Emulation.setDeviceMetricsOverride', { width: largura, height: altura, deviceScaleFactor: 1, mobile: largura < 768 });
  if (reduzir) { await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }); }
  await cdp('Page.navigate', { url });
  await dormir(2500);
  if (armazenar) {
    const dados = JSON.parse(armazenar);
    await avaliar(`(() => { const d = ${JSON.stringify(dados)};
      Object.keys(d).forEach(k => localStorage.setItem(k, typeof d[k] === 'string' ? d[k] : JSON.stringify(d[k]))); })()`);
    await cdp('Page.reload');
    await dormir(2500);
  }
  if (antes) { await avaliar(`(async () => { ${antes} })()`); await dormir(600); }

  if (medir) {
    await avaliar(`(() => { window.__fps = []; let t0 = performance.now();
      (function quadro(t) { window.__fps.push(t - t0); t0 = t; requestAnimationFrame(quadro); })(performance.now()); })()`);
  }
  if (alvo !== 'topo') {
    const y = alvo === 'fim' ? 'document.documentElement.scrollHeight'
      : /^\d+$/.test(alvo) ? alvo
      : (() => {
          const [sel, p] = alvo.split('@');
          return `(() => { const s = document.querySelector(${JSON.stringify(sel)});
            return s.getBoundingClientRect().top + scrollY + Math.max(0, s.offsetHeight - innerHeight) * ${Number(p || 0)}; })()`;
        })();

    await avaliar(`(async () => { const alvo = ${y}; const passos = 12;
      for (let i = 1; i <= passos; i++) { window.scrollTo(0, scrollY + (alvo - scrollY) / (passos - i + 1)); await new Promise(r => setTimeout(r, 60)); }
      window.scrollTo(0, alvo); })()`);
  }
  await dormir(espera);
  for (let i = 0; i < tabs; i++) {
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await dormir(120);
  }
  if (tabs) { await dormir(500); }
  if (depois) { console.log('depois:', JSON.stringify(await avaliar(`(async () => { ${depois} })()`))); }

  const opcoes = { format: 'jpeg', quality: 82 };
  if (paginaInteira) {
    const h = await avaliar('document.documentElement.scrollHeight');
    opcoes.clip = { x: 0, y: 0, width: largura, height: h, scale: 1 };
    opcoes.captureBeyondViewport = true;
  }
  const print = await cdp('Page.captureScreenshot', opcoes);
  writeFileSync(saida, Buffer.from(print.result.data, 'base64'));
  const info = await avaliar('({ larguraRolagem: document.documentElement.scrollWidth, larguraTela: innerWidth, classes: document.documentElement.className })');
  console.log(`ok ${saida}`, JSON.stringify(info));
  if (info && info.larguraRolagem > info.larguraTela) { console.log(`AVISO: rolagem horizontal (${info.larguraRolagem}px > ${info.larguraTela}px)`); }
  if (medir) {
    const m = await avaliar(`(async () => {
      const lcp = await new Promise(ok => { let v = 0; new PerformanceObserver(l => { l.getEntries().forEach(e => { v = e.startTime; }); })
        .observe({ type: 'largest-contentful-paint', buffered: true }); setTimeout(() => ok(v), 300); });
      const bytes = performance.getEntriesByType('resource').reduce((t, e) => t + (e.transferSize || 0), 0);
      const q = window.__fps.slice(5); const media = q.reduce((a, b) => a + b, 0) / Math.max(1, q.length);
      const lentos = q.filter(x => x > 1000 / 50).length;
      return { lcp_ms: Math.round(lcp), baixado_kb: Math.round(bytes / 1024), fps_medio: Math.round(1000 / media), quadros_lentos: lentos, quadros: q.length };
    })()`);
    console.log('medidas', JSON.stringify(m));
  }
  if (comAxe) {
    const violacoes = await avaliar(`(async () => {
      if (!window.axe) {
        await new Promise((ok, falha) => { const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js'; s.onload = ok; s.onerror = falha;
          document.head.appendChild(s); });
      }
      const r = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] });
      return r.violations.map(v => v.id + ' (' + v.impact + ', ' + v.nodes.length + '): ' +
        v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | '));
    })()`);
    console.log(violacoes && violacoes.length ? violacoes.map((v) => 'AXE ' + v).join('\n') : 'axe: nenhuma violação');
  }
  erros.forEach((e) => console.log('ERRO ' + e));
} finally {
  if (ws) { ws.close(); }
  chrome.kill();
}
