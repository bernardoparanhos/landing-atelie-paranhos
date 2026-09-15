# Responsividade

A regra que vale para tudo aqui: **em nenhuma largura pode haver barra de
rolagem horizontal, e nada pode ser cortado pelas laterais.** Testado de 280px
(menor que qualquer telefone em uso) a 2560px.

## Pontos de quebra

Não há um "grid system": a página usa `clamp()` e `repeat(auto-fit, ...)` para
se adaptar sozinha, e as media queries entram só onde isso não basta.

| Largura | O que muda |
|---|---|
| ≤ 900px | Hero e demo interativa passam a uma coluna |
| ≤ 860px | A colagem do hero deixa de ser posicionada em absoluto e empilha |
| ≤ 700px | Somem os traços de ligação entre as rotas (`/gestante`, `/familia`...) |
| ≤ 600px | Topo empilha; abas da vitrine ocupam a linha toda; some o sufixo da barra de endereço; inputs vão a 16px |

Cada bloco está comentado dentro do `<style>` de
[`src/pages/index.astro`](../src/pages/index.astro), dizendo o que conserta.

## As armadilhas que já custaram caro aqui

**`minmax(300px, 1fr)` estoura em tela estreita.** Com `repeat(auto-fit,
minmax(300px, 1fr))`, a coluna nunca fica menor que 300px — então num aparelho
de 320px, com 24px de recuo de cada lado, sobram 272px e a grade vaza 28px para
fora. A correção é `minmax(min(300px, 100%), 1fr)`: o `min()` deixa a coluna
encolher junto com a tela. Todas as cinco grades da página usam essa forma.

**Fonte menor que 16px em `<input>` faz o iOS dar zoom** ao tocar no campo, e a
página fica torta. Por isso os dois campos da demo sobem para 16px abaixo de
600px.

**`visibility: hidden` não tira do teclado.** O link "abrir em nova aba" some
fora da aba do site; se escondido por `visibility`, ele continuaria recebendo
foco no Tab. Usa `hidden`.

**`overflow: hidden` esconde o problema em vez de resolver.** O cartão de baixo
do hero estava sendo cortado no celular e ninguém via, porque o `<header>` tem
`overflow: hidden`. A auditoria automatizada abaixo ignora o que está clipado
justamente para não ser enganada — por isso o defeito foi encontrado olhando as
capturas, não o número.

Como rede de proteção final, o `<body>` tem `overflow-x: clip` (e não `hidden`,
que criaria um contexto de rolagem). Isso é a última linha de defesa, não a
solução: os problemas foram corrigidos na origem.

## Como testar

Rodando `npm run dev` (ou `npm run preview`), abra o DevTools (F12), ative o
modo de dispositivo (Ctrl+Shift+M) e percorra as larguras. Vale conferir:

- `/` — a landing
- `/demos/site/index.html`, `/demos/proposta.html`, `/demos/painel.html` — as
  demos também são vistas dentro do iframe estreito da seção 05, onde a área
  útil é de uns 340px num celular
- uma URL inexistente, para a página 404

O teste objetivo é comparar `document.documentElement.scrollWidth` com
`clientWidth`. No console:

```js
const de = document.documentElement;
console.log(de.scrollWidth, de.clientWidth, de.scrollWidth > de.clientWidth ? 'ESTOUROU' : 'ok');
```

Se estourou, para achar o culpado:

```js
const vw = document.documentElement.clientWidth;
[...document.body.querySelectorAll('*')]
  .filter(el => el.getBoundingClientRect().right > vw + 1)
  .forEach(el => console.log(Math.round(el.getBoundingClientRect().right - vw), el));
```

O número é quantos pixels o elemento passa da borda.

## Acessibilidade, junto

Alguns ajustes andam com a responsividade e estão no mesmo arquivo:

- **Foco visível** (`:focus-visible`) com contraste próprio nas faixas escuras —
  sem isso, quem navega por teclado se perde na seção 05.
- **`prefers-reduced-motion`** desliga a seta que pisca em laço na seção 02, o
  feed do Instagram da seção 04 e o carrossel automático da demo do site
  (WCAG 2.2.2 e 2.3.3).
- **Alvos de toque de 44px** nos botões e links de ação.
- As fotos da galeria e os cartões de ensaio da demo do site abriam a lightbox
  só no clique; hoje têm `role="button"`, `tabindex="0"` e respondem a
  Enter/Espaço, e o foco volta para onde estava ao fechar.
- As abas da seção 05 são um `role="tablist"` de verdade: ← e → trocam de aba e
  `aria-selected` acompanha.
