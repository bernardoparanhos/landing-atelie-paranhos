// Teste de responsividade de ponta a ponta.
//
// COMO RODAR
//   1. npm run build && npm run preview        (em outro terminal)
//   2. npm i -D puppeteer-core                 (nao fica no package.json de
//                                               proposito: so serve para este
//                                               teste, e o site nao depende dele)
//   3. node scripts/checar-responsividade.mjs
//
// Dirige o Chrome que ja existe na maquina — nao baixa navegador nenhum.
// Se o caminho do Chrome for outro, ajuste CHROME abaixo, ou aponte para o
// Edge: "C:/Program Files (x86)/Microsoft Edge/Application/msedge.exe".
//
// O QUE ELE MEDE, e que so da para medir renderizando de verdade:
//   - se a pagina rola na horizontal em alguma largura, e qual elemento e o
//     culpado quando rola (o criterio da casa: nunca, de 280px a 2560px);
//   - alvos de clique menores que 24px, o minimo da WCAG 2.5.8;
//   - campo de texto com fonte menor que 16px, que faz o iOS dar zoom
//     sozinho ao focar e desalinhar a pagina inteira.
//
// Nenhuma dessas tres coisas aparece no astro check nem no build: os tres
// passam com a pagina vazando.

import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE || "http://localhost:4321";

// 280 e menor que qualquer telefone em uso; 2560 e um monitor grande.
const LARGURAS = [280, 320, 360, 390, 414, 540, 600, 700, 768, 820, 900, 1024, 1180, 1280, 1440, 1920, 2560];

// As duas versoes da landing e as duas familias de demo: a portuguesa tem
// texto mais longo em varios pontos ("Registas num registador portugues
// com o teu NIF"), e e justamente onde um vazamento aparece primeiro.
const PAGINAS = [
  ["home BR", "/"],
  ["home PT", "/pt/"],
  ["404", "/404.html"],
  ["demo site", "/demos/site/index.html"],
  ["demo propostas", "/demos/propostas.html"],
  ["demo painel", "/demos/painel.html"],
  ["demo site PT", "/demos/pt/site/index.html"],
  ["demo propostas PT", "/demos/pt/propostas.html"],
  ["demo painel PT", "/demos/pt/painel.html"],
];

const navegador = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars"],
});

let falhas = 0;

for (const [nome, rota] of PAGINAS) {
  const pagina = await navegador.newPage();
  const problemas = [];

  for (const largura of LARGURAS) {
    await pagina.setViewport({ width: largura, height: 900, deviceScaleFactor: 1 });
    await pagina.goto(BASE + rota, { waitUntil: "networkidle0", timeout: 60000 });
    // deixa fontes e imagens assentarem antes de medir
    await pagina.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 180));

    const r = await pagina.evaluate(() => {
      const d = document.documentElement;
      const vazamento = d.scrollWidth - d.clientWidth;
      const culpados = [];
      if (vazamento > 1) {
        for (const el of document.querySelectorAll("body *")) {
          const c = el.getBoundingClientRect();
          if (c.width === 0 && c.height === 0) continue;
          if (c.right > d.clientWidth + 1 || c.left < -1) {
            culpados.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className && typeof el.className === "string" ? el.className : "").slice(0, 28),
              id: el.id || "",
              esq: Math.round(c.left),
              dir: Math.round(c.right),
              texto: (el.textContent || "").trim().slice(0, 34),
            });
          }
        }
      }
      // elementos clicaveis pequenos demais para o dedo (WCAG 2.5.8 = 24px;
      // a recomendacao de toque confortavel e 44px)
      const miudos = [];
      for (const el of document.querySelectorAll("a, button, input, [role=tab]")) {
        const c = el.getBoundingClientRect();
        if (c.width === 0 && c.height === 0) continue;
        if (c.height < 24 || c.width < 24) {
          miudos.push({
            tag: el.tagName.toLowerCase(),
            w: Math.round(c.width),
            h: Math.round(c.height),
            texto: (el.textContent || "").trim().slice(0, 26),
          });
        }
      }
      // campo de texto com fonte < 16px faz o iOS dar zoom sozinho
      const zoomIOS = [];
      for (const el of document.querySelectorAll("input, textarea, select")) {
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs < 16) zoomIOS.push({ id: el.id || el.name || el.tagName, fs });
      }
      return { vazamento, culpados: culpados.slice(0, 6), miudos: miudos.slice(0, 6), zoomIOS };
    });

    if (r.vazamento > 1) {
      falhas++;
      problemas.push(`    ${largura}px  VAZA ${r.vazamento}px na horizontal`);
      for (const c of r.culpados) {
        problemas.push(`             <${c.tag}${c.id ? "#" + c.id : ""}${c.cls ? "." + c.cls : ""}> ${c.esq}..${c.dir}  "${c.texto}"`);
      }
    }
    if (r.miudos.length) {
      falhas++;
      problemas.push(`    ${largura}px  alvo de toque pequeno:`);
      for (const m of r.miudos) problemas.push(`             <${m.tag}> ${m.w}x${m.h}px  "${m.texto}"`);
    }
    if (r.zoomIOS.length) {
      falhas++;
      problemas.push(`    ${largura}px  campo com fonte <16px (iOS da zoom): ` + r.zoomIOS.map((z) => `${z.id}=${z.fs}px`).join(", "));
    }
  }

  console.log(`\n${nome}  (${rota})`);
  if (problemas.length === 0) {
    console.log(`    OK em todas as ${LARGURAS.length} larguras: ${LARGURAS[0]}px a ${LARGURAS[LARGURAS.length - 1]}px`);
  } else {
    for (const p of problemas) console.log(p);
  }
  await pagina.close();
}

await navegador.close();
console.log(`\n=== ${falhas === 0 ? "SEM PROBLEMAS" : falhas + " problema(s) encontrado(s)"} ===`);
