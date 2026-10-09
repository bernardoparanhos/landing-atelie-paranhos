# Arquitetura

## Em uma frase

Astro gera um HTML estático no build; o navegador baixa esse HTML, um CSS
embutido, um arquivo de JavaScript de ~1,2 KB e algumas imagens. Não há
servidor, banco, sessão, cookie nem chamada de rede depois que a página carrega.

Isso não é preguiça: é a escolha que faz a página ser rápida, barata de
hospedar e praticamente impossível de invadir. A maior parte das decisões deste
projeto existe para **não** perder essa propriedade.

---

## Mapa dos arquivos

```
src/
  config/
    site.ts             ← TODO o conteúdo: marca, clientes, formatos, passos,
                           preços, mensagens de WhatsApp, endereço do site
  assets/               ← imagens que passam pelo otimizador do Astro
  layouts/
    Base.astro          ← <head>, CSP, favicon, paleta em :root, fontes,
                           acessibilidade. Toda página passa por aqui.
  components/           ← uma seção por arquivo, todas lendo de config/site.ts
    Hero / Exemplos / Painel / Template / ComoFunciona /
    Formatos / Incluso / CTA / Footer
  pages/
    index.astro         ← 25 linhas: só a ordem das seções
    404.astro           ← página de erro, sobre o mesmo Base
    robots.txt.ts       ← gerado no build a partir de config/site.ts
    sitemap.xml.ts      ← idem
public/                 ← copiado cru para dist/, sem processamento
  _headers              ← cabeçalhos de segurança (Netlify / Cloudflare Pages)
  favicon.svg, favicon-32.png, apple-touch-icon.png
  fonts/                ← Outfit (a landing) + Cormorant Garamond e Jost
                           (as demos), todas auto-hospedadas
  assets/               ← os dois SVG de exemplo usados dentro da seção 02
  demos/                ← as duas demonstrações embutidas (site e painel)
vercel.json             ← os mesmos cabeçalhos, formato Vercel
astro.config.mjs
```

## As seções da landing

Uma seção por componente, na ordem em que `index.astro` as empilha.

| # | Seção | O que faz |
|---|---|---|
| — | Hero | Promessa principal + três números |
| 01 | Exemplos no ar | Dois sites de cliente reais, com print, link e depoimento |
| 02 | O painel, agora | Mini-painel editável na própria página + o painel inteiro em `<iframe>` |
| 03 | Nosso template | O template base em `<iframe>` + link para navegá-lo inteiro |
| 04 | Como funciona | Os seis passos, do primeiro oi à página no ar |
| 05 | Os três formatos | Preços, o que cada um inclui, e a faixa do domínio |
| 06 | O que vem junto | Os quatro itens que valem para os três formatos |
| — | CTA final | Botão do WhatsApp |

**Os números são escritos à mão** dentro de cada componente. Se você reordenar
as seções em `index.astro`, acerte-os também — nada os gera.

---

## Decisões que parecem estranhas (e por quê)

### O estilo é inline, elemento por elemento

A página veio de uma ferramenta de design, que escreve `style="..."` em cada
elemento. Reescrever tudo em classes seria dias de trabalho, com risco alto de
quebrar o visual, e ganho pequeno numa página só.

O que fizemos em vez disso: o `<style is:global>` do `Base.astro` tem blocos
separados e comentados — **travas de largura** e **acessibilidade** — que
corrigem o que o inline não consegue expressar (`:focus-visible`,
`prefers-reduced-motion`, `overflow-x`). Ajuste de tela específico de uma
seção mora no `<style>` daquele componente.

Onde uma dessas regras precisa vencer um `style=""`, ela usa `!important` —
estilo inline ganha da folha de estilo na precedência do CSS. **Isso é esperado
aqui** e cada bloco diz o que conserta.

As seções herdadas do layout novo usam `grid-template-columns:
repeat(auto-fit, minmax(...))`, que já se reorganiza sozinho: por isso quase
não há media query, e as poucas que existem resolvem casos pontuais (o zoom
automático do iOS em campo de texto, por exemplo).

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
mostradas dentro de um `<iframe>`. São duas: `/demos/site/` (o template, na
seção 03) e `/demos/painel.html` (o painel, na seção 02). Passá-las pelo Astro traria acoplamento sem
benefício. Em troca, elas não ganham otimização automática — por isso usam
apenas SVG leve como imagem de exemplo.

O `robots.txt` bloqueia `/demos/`: são páginas de conteúdo fictício que, soltas
no Google, confundiriam quem busca e roubariam relevância da landing.

### Os `<iframe>` das seções 02 e 03 têm `sandbox` com `allow-same-origin`

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
[SEGURANCA.md](SEGURANCA.md#o-iframe-das-seções-02-e-03).

### O `sitemap.xml` sai vazio até alguém preencher `SITE`

Um sitemap apontando para o endereço errado manda o Google indexar o que não
existe. Vazio ele é inofensivo. O mesmo vale para `canonical` e Open Graph, que
simplesmente não são gerados enquanto `SITE` estiver em branco.

---

## As duas janelas (seções 02 e 03)

Cada uma é um `<iframe loading="lazy"` apontando para uma página de `/demos/`,
dentro de uma moldura de navegador desenhada em CSS (os três pontinhos e a
barra de endereço falsa).

Duas coisas que não são óbvias:

**O `src` precisa ser local.** A CSP traz `frame-src 'self'`. Apontar a janela
para um domínio de fora — o template publicado no GitHub Pages, por exemplo —
faz o navegador bloquear em produção, e só em produção: em `npm run dev` a CSP
está desligada e parece funcionar. O link "navegar no template inteiro" existe
justamente para isso: ele **sai** da página, em aba nova, em vez de embutir.

**A barra de rolagem do iframe é escondida** (`.janela-frame`). Com a moldura
desenhada em volta, uma barra cinza do navegador por cima dela estraga a
ilusão de site pronto. O conteúdo continua rolável — só o indicador some.

## O mini-painel da seção 02

É a única parte da página que responde a quem digita.

1. A pessoa muda nome ou valor e clica em **Salvar alterações** (ou tecla
   Enter).
2. O script espera 750 ms **de propósito**: sem essa pausa a mudança é
   instantânea demais para o olho registrar que algo aconteceu do outro lado.
3. Escreve o resultado no "site" ao lado e pisca o cartão por 1,6 s.

A escrita usa `textContent`, **nunca `innerHTML`**. É o que faz um nome como
`<img src=x onerror=alert(1)>` aparecer como texto literal em vez de virar
marcação — ver [SEGURANCA.md](SEGURANCA.md#como-conferir).

O valor ainda passa por `replace(/[^\d.,]/g, "")`, que só deixa dígitos, ponto
e vírgula. É cinto e suspensório: `textContent` sozinho já bastaria.

Um `<p role="status" aria-live="polite">` invisível anuncia o que foi
publicado, para quem usa leitor de tela não precisar sair do formulário à
procura do que mudou.
