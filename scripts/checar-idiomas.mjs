// Confere o site construído: nenhuma marca de uma versão pode aparecer na
// outra.
//
// A trava de tipo do i18n.ts garante que nenhuma CHAVE ficou para trás. O
// que ela não consegue ver é uma chave preenchida com o texto errado —
// uma frase brasileira copiada para o lado português e esquecida ali. É
// o erro mais fácil de cometer e o mais difícil de notar, porque as duas
// línguas são quase iguais e o olho passa por cima.
//
// Rodar depois do build:  node scripts/checar-idiomas.mjs
// (o `npm run build` já chama; ver package.json)

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";

/** O separador de linha, numa constante para nao se perder em escapes. */
const QUEBRA = String.fromCharCode(10);

// ------------------------------------------------------------
//  O que não pode aparecer de um lado nem do outro
// ------------------------------------------------------------
//  Marcas de conteúdo, não de marcação: hreflang="pt-BR" tem de existir
//  nas duas páginas, e por isso a conferência só olha o texto visível e
//  os data-* que o script do painel escreve na tela.

const PROIBIDO_NA_PT = [
  "R$", "CPF", "registro.br", "você", "Você", "celular",
  "Dia das Mães", "registrado", "Salvar", "Digite", "Clique",
  // ensaio → sessão; gestante → gravidez; contato → contacto
  "ensaio", "Ensaio", "gestante", "Gestante", "contato", "Contato",
  // gramática, que pega a frase brasileira sem palavra-marca: Portugal
  // contrai ("num", "numa") e não usa "a gente" por "nós" nem "pra".
  "em um ", "em uma ", "pra ", "Pode me ", "Me chama",
  // "toda a gente" e portugues correto; so o "a gente" no lugar de
  // "nos" e brasileiro, dai a expressao regular em vez do texto cru.
  /(?<!toda )a gente /i,
];

const PROIBIDO_NA_BR = [
  "€", "NIF", "dns.pt", "telemóvel", "Registas", "registas",
  "contacto", "Contacto", "sessões de época", "Guardar",
];

// Os depoimentos são falas literais de clientes brasileiras e ficam
// intactos na página portuguesa de propósito. Saem da conferência para
// não dispararem alarme falso — e só eles.
const CITACOES_LITERAIS = [
  "Estou adorando. Ficou super intuitivo, fácil para o cliente acessar as propostas e pra eu enviar pra eles também.",
  "Cara, sem palavras, perfeito. Amei de verdade. Com toda certeza vou indicar seu trabalho pra outros amigos.",
];

// O que TEM de estar lá. Pega o caso em que uma seção inteira ficou com
// o conteúdo da outra versão.
const EXIGIDO_NA_PT = ["€150", "€190", "€240", 'lang="pt-PT"', "/demos/pt/", "o teu NIF"];
const EXIGIDO_NA_BR = ["R$ 500", "R$ 600", "R$ 700", 'lang="pt-BR"', "seu CPF"];

// ------------------------------------------------------------

/** O texto que uma pessoa vê, mais os data-* que o script escreve. */
function visivel(html) {
  let s = html;
  const dados = [...s.matchAll(/data-(?:salvar|salvando|vazio|moeda|aviso)="([^"]*)"/g)].map((m) => m[1]);
  s = s.replace(/<script[\s\S]*?<\/script>/g, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/g, " ");
  s = s.replace(/<head[\s\S]*?<\/head>/g, " ");
  s = s.replace(/<!--[\s\S]*?-->/g, " ");
  s = s.replace(/<[^>]+>/g, "\n");
  s = s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
  return s + "\n" + dados.join("\n");
}

function semCitacoes(texto) {
  let s = texto;
  for (const c of CITACOES_LITERAIS) s = s.split(c).join(" ");
  return s;
}

const problemas = [];

function conferir(rotulo, caminho, proibido, exigido, olharLang = true) {
  if (!existsSync(caminho)) {
    problemas.push(`${rotulo}: ${caminho} não existe — o build não gerou esta página.`);
    return;
  }
  const html = readFileSync(caminho, "utf8");
  const texto = semCitacoes(visivel(html));

  for (const marca of proibido) {
    const achou = marca instanceof RegExp ? marca.test(texto) : texto.includes(marca);
    if (!achou) continue;
    const casa = (l) => (marca instanceof RegExp ? marca.test(l) : l.includes(marca));
    const linha = texto.split(QUEBRA).find(casa) ?? "";
    problemas.push(`${rotulo}: achei ${marca} -> ${linha.trim().slice(0, 100)}`);
  }
  for (const marca of exigido) {
    // lang e caminhos vivem na marcação, não no texto visível
    const onde = olharLang && (marca.startsWith("lang=") || marca.startsWith("/")) ? html : texto;
    if (!onde.includes(marca)) problemas.push(`${rotulo}: faltou "${marca}".`);
  }
}

conferir("/ (Brasil)", join(DIST, "index.html"), PROIBIDO_NA_BR, EXIGIDO_NA_BR);
conferir("/pt/ (Portugal)", join(DIST, "pt", "index.html"), PROIBIDO_NA_PT, EXIGIDO_NA_PT);

// A versão brasileira não pode apontar para as demos portuguesas, nem o
// contrário: era assim que um preço em euro aparecia dentro da janela da
// página brasileira sem ninguém dar por isso.
const br = existsSync(join(DIST, "index.html")) ? readFileSync(join(DIST, "index.html"), "utf8") : "";
if (br.includes("/demos/pt/")) problemas.push("/ (Brasil): aponta para /demos/pt/ nas janelas.");

// As demonstrações portuguesas, já construídas.
const demosPt = join(DIST, "demos", "pt");
if (!existsSync(demosPt)) {
  problemas.push("dist/demos/pt/ não existe — rode `node scripts/traduzir-demos.mjs`.");
} else {
  const html = readdirSync(demosPt, { recursive: true })
    .map((f) => join(demosPt, String(f)))
    .filter((f) => statSync(f).isFile() && (f.endsWith(".html") || f.endsWith(".js")));
  for (const f of html) {
    const texto = visivel(readFileSync(f, "utf8"));
    for (const marca of PROIBIDO_NA_PT) {
      const achou = marca instanceof RegExp ? marca.test(texto) : texto.includes(marca);
      if (achou) problemas.push(`demo ${f}: achei ${marca}.`);
    }
  }
}

if (problemas.length) {
  console.error(`\nFALHA: ${problemas.length} problema(s) de idioma.\n`);
  for (const p of problemas) console.error("  " + p);
  process.exit(1);
}

console.log("Idiomas conferidos: nenhuma marca de uma versão vazou para a outra.");
