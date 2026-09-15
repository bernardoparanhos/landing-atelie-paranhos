# Arquitetura

## Em uma frase

Astro gera um HTML estático no build; o navegador baixa esse HTML, um CSS
embutido, um arquivo de JavaScript de ~2,4 KB e algumas imagens. Não há
servidor, banco, sessão, cookie nem chamada de rede depois que a página carrega.

Isso não é preguiça: é a escolha que faz a página ser rápida, barata de
hospedar e praticamente impossível de invadir. A maior parte das decisões deste
projeto existe para **não** perder essa propriedade.

---

## Mapa dos arquivos

```
src/
  config.ts             ← marca, WhatsApp, endereço do site (único arquivo a editar)
  assets/               ← fotos que passam pelo otimizador do Astro
  pages/
    index.astro         ← a landing inteira: marcação, estilo e script
    404.astro           ← página de erro
    robots.txt.ts       ← gerado no build a partir de config.ts
    sitemap.xml.ts      ← idem
public/                 ← copiado cru para dist/, sem processamento
  _headers              ← cabeçalhos de segurança (Netlify / Cloudflare Pages)
  favicon.svg, favicon-32.png, apple-touch-icon.png
  fonts/                ← Cormorant Garamond + Jost, auto-hospedadas
  demos/                ← as três demonstrações da seção 05
vercel.json             ← os mesmos cabeçalhos, formato Vercel
astro.config.mjs
```

## As seções da landing

| # | Seção | O que faz |
|---|---|---|
| — | Hero | Promessa principal + colagem com dois cartões |
| 01 | Antes e depois | PDF com propaganda × página própria |
| 02 | Experimente agora | Demo interativa: edita e "publica" ao lado |
| 03 | Não é só a proposta | Rotas, painel, Instagram, domínio no seu nome |
| 04 | Seu Instagram, vivo no site | Prova visual: um feed que se troca sozinho |
| 05 | Veja ao vivo | Janela com as três demonstrações em `<iframe>` |
| 06 | Como funciona | Os três passos |
| — | CTA final | Botão do WhatsApp |

---

## Decisões que parecem estranhas (e por quê)

### O estilo é inline, elemento por elemento

A página veio de uma ferramenta de design, que escreve `style="..."` em cada
elemento. Reescrever tudo em classes seria dias de trabalho, com risco alto de
quebrar o visual, e ganho pequeno numa página só.

O que fizemos em vez disso: o `<style>` no topo do `index.astro` tem blocos
separados e comentados — **responsivo** e **acessibilidade** — que corrigem o
que o inline não consegue expressar (media queries, `:focus-visible`,
`prefers-reduced-motion`).

Como estilo inline vence folha de estilo na ordem de precedência do CSS, essas
regras usam `!important`. **Isso é esperado aqui** e cada bloco diz o que
conserta. Se um dia a página for reescrita com classes, esses `!important` saem
junto.

A única consequência de segurança é que a CSP precisa de `'unsafe-inline'` em
`style-src`. Estilo inline não executa código; o que importa —
`script-src 'self'`, sem `'unsafe-inline'` — continua fechado.

### O JavaScript fica num arquivo externo, não embutido

O Astro, por padrão, embute scripts pequenos direto no HTML. Isso quebraria a
CSP (`script-src 'self'` bloqueia script inline). Por isso o
`astro.config.mjs` traz:

```js
vite: { build: { assetsInlineLimit: 0 } }
```

**Se alguém remover essa linha, a própria página para de funcionar em
produção** — a CSP bloqueia o script embutido. O `npm run verificar` não pega
isso; só um teste no build (`npm run preview`) pega.

### As demos vivem em `public/`, não em `src/`

Elas são páginas independentes, com CSS e JS próprios, que existem para ser
mostradas dentro de um `<iframe>`. Passá-las pelo Astro traria acoplamento sem
benefício. Em troca, elas não ganham otimização automática — por isso usam
apenas SVG leve como imagem de exemplo.

O `robots.txt` bloqueia `/demos/`: são páginas de conteúdo fictício que, soltas
no Google, confundiriam quem busca e roubariam relevância da landing.

### O `<iframe>` da seção 05 tem `sandbox` com `allow-same-origin`

```html
sandbox="allow-scripts allow-same-origin"
```

`allow-same-origin` parece anular o sandbox — e de fato tira a barreira contra o
conteúdo embutido. Mas **sem ele nada funciona**: o iframe ganha origem opaca e
o navegador passa a bloquear por CORS o JavaScript e as fontes das demos, que
aparecem sem interação e com fonte errada.

Como o conteúdo embutido é nosso, a troca compensa: os dois valores juntos ainda
bloqueiam navegar a janela de cima, abrir pop-ups, enviar formulários, iniciar
downloads e abrir diálogos modais. Detalhes em
[SEGURANCA.md](SEGURANCA.md#o-iframe-da-seção-04).

### O `sitemap.xml` sai vazio até alguém preencher `SITE`

Um sitemap apontando para o endereço errado manda o Google indexar o que não
existe. Vazio ele é inofensivo. O mesmo vale para `canonical` e Open Graph, que
simplesmente não são gerados enquanto `SITE` estiver em branco.

---

## O fluxo da demo interativa (seção 02)

1. A pessoa digita nome e valor e clica em **Salvar alterações**.
2. O script espera 750 ms (simulando o salvamento) e escreve o resultado no
   "site" ao lado.
3. A escrita usa `textContent`, **nunca `innerHTML`**. É o que faz um nome como
   `<img src=x onerror=alert(1)>` aparecer como texto literal em vez de virar
   marcação. Há um teste automatizado disso — ver
   [SEGURANCA.md](SEGURANCA.md#como-conferir).

O valor ainda passa por `replace(/[^\d.,]/g, "")`, que só deixa dígitos, ponto e
vírgula. É cinto e suspensório: `textContent` sozinho já bastaria.

## O feed do Instagram (seção 04)

É uma prova visual, não uma integração: os nove quadros são SVG de
`public/assets/` girando numa lista fixa, para mostrar o que a pessoa vai ter.
Não há chamada ao Instagram — a CSP nem permitiria.

Três detalhes que não são óbvios:

**Os quadros são criados uma vez e só trocam de `src`.** Recriar o HTML a cada
volta piscaria e faria o navegador redecodificar as imagens.

**A regra de CSS da tarja usa `:global()`.** O Astro escopa o `<style>` marcando
os elementos do template com um atributo `data-astro-cid-*`. Os quadros nascem
em JavaScript e não recebem esse atributo, então uma regra normal
(`.ig-tile .ig-ov { ... }`) simplesmente não os alcança — a tarja "ver no
instagram" fica visível em todos. É uma armadilha silenciosa: o build passa, o
type-check passa, e só olhando a tela se percebe.

**Só gira enquanto está na tela.** Um `IntersectionObserver` liga e desliga o
`setInterval`. Sem isso, o laço rodaria a cada 3,2 s pela vida inteira da aba,
mesmo com a seção dez telas acima. E ele nem começa quando o sistema pede menos
movimento (`prefers-reduced-motion`) — ver
[RESPONSIVIDADE.md](RESPONSIVIDADE.md#acessibilidade-junto).

## O fluxo das abas (seção 05)

Os três botões são um `role="tablist"`. Clicar ou usar ← → troca a aba, o que:
trocar o `src` do iframe, atualizar a barra de endereço falsa e a legenda,
marcar `aria-selected` e esconder o link "abrir em nova aba" fora da aba do site
(com `hidden`, não `visibility`, para ele sair também da ordem de tabulação).
