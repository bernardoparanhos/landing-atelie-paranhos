# Manutenção

## Ritmo sugerido

| Quando | O quê |
|---|---|
| A cada mexida | `npm run verificar` antes do commit |
| Uma vez por mês | `npm audit` e `npm outdated` |
| Quando sair versão maior do Astro | Ler as notas, atualizar, conferir no navegador |

---

## Atualizar dependências

```bash
npm outdated          # o que mudou
npm update            # correções e versões menores, seguras
npm audit             # tem alerta de segurança?
npm run verificar
```

Para versão **maior** (ex.: Astro 7 → 8), que pode quebrar:

```bash
npx @astrojs/upgrade
npm run verificar
npm run build && npm run preview   # e abrir no navegador
```

Confira, no `preview`: as três abas da seção 05 carregam, a demo interativa
salva, e o console (F12) está limpo.

> Se `npm audit` acusar um pacote **`extraneous`**, é resto de uma atualização
> anterior. `npm prune` resolve.

### O que olhar de verdade num alerta

A maioria dos CVEs do Astro vale para renderização no servidor, middleware,
server islands ou adaptadores — nada disso existe aqui. O que **realmente**
importa para este projeto:

- falhas no **servidor de desenvolvimento** (afetam a sua máquina);
- falhas de **XSS na renderização de template** (afetam o HTML gerado);
- falhas no **processamento de imagem** no build (`sharp`/`libvips`).

Não é motivo para ignorar alerta — é para saber a urgência.

---

## Trocar as fotos do topo

As duas fotos do hero ficam em [`src/assets/`](../src/assets/), **não** em
`public/`. Substitua os arquivos mantendo os nomes e pronto: o Astro
redimensiona, converte para WebP, gera `srcset` e coloca `width`/`height`.

Pode jogar a foto original da câmera ali, do tamanho que for — as que estão hoje
têm 6240px de largura e chegam ao navegador com 24 KB.

Se mudar o nome do arquivo, ajuste também o `import` no topo de
[`src/pages/index.astro`](../src/pages/index.astro).

> **Nunca ponha foto pesada em `public/`.** O que está lá é copiado cru, sem
> otimização. Foi assim que as duas fotos do hero pesaram 6 MB por um tempo.

As imagens das demos (`public/demos/*/assets/`) são SVG de marcação de lugar,
leves de propósito. Se um dia forem trocadas por fotos de verdade, otimize antes
(exporte com no máximo 1600px de largura e qualidade 80).

---

## Trocar ou atualizar as fontes

As fontes são auto-hospedadas em [`public/fonts/`](../public/fonts/) — ver o
porquê em [SEGURANCA.md](SEGURANCA.md#zero-terceiros). São **fontes variáveis**:
o mesmo `.woff2` atende todos os pesos, por isso há só 6 arquivos para 16
declarações de `@font-face`.

Para trocar por outra família:

1. Monte a URL no Google Fonts e baixe o CSS **com um User-Agent moderno** (sem
   isso vem `.ttf` em vez de `.woff2`):

   ```bash
   curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" \
     "https://fonts.googleapis.com/css2?family=SuaFonte:wght@400;500&display=swap" -o fontes.css
   ```

2. Fique só com os blocos `/* latin */` e `/* latin-ext */` (os outros são
   cirílico e vietnamita — peso à toa para um site em português).
3. Baixe cada `.woff2` para `public/fonts/`.
4. Reescreva as URLs no CSS para `/fonts/nome-do-arquivo.woff2`.
5. Atualize os dois `<link rel="preload">` no `<head>` do `index.astro`.
6. Troque o `font-family` nos estilos.

Não volte a carregar do `fonts.googleapis.com`: além da questão de privacidade,
a CSP vai bloquear.

---

## Mexer no visual da landing

O estilo é inline, elemento por elemento — ver
[ARQUITETURA.md](ARQUITETURA.md#o-estilo-é-inline-elemento-por-elemento). Ao
mexer:

- **Texto ou cor de um elemento:** edite o `style=""` dele direto.
- **Comportamento por tamanho de tela:** vá aos blocos `RESPONSIVO` /
  `ACESSIBILIDADE` no `<style>` do topo. Eles precisam de `!important` para
  vencer o inline — isso é esperado, não gambiarra solta.
- **Grade nova:** use `minmax(min(300px, 100%), 1fr)`, nunca
  `minmax(300px, 1fr)`. O porquê está em
  [RESPONSIVIDADE.md](RESPONSIVIDADE.md#as-armadilhas-que-já-custaram-caro-aqui).

Depois de qualquer mudança de layout, passe pelas larguras extremas (280px e
2560px) — o roteiro está em
[RESPONSIVIDADE.md](RESPONSIVIDADE.md#como-testar).

---

## Mexer no JavaScript

Duas regras, e elas não são estilo — são o que mantém a CSP funcionando:

1. **Nunca `innerHTML` com concatenação de string.** Use `textContent` para
   texto e `createElement` para estrutura. `public/demos/painel.js` é o modelo.
2. **Nunca `onclick=` no HTML.** Use `addEventListener` ou delegação por
   `data-acao`, como em `painel.js`. Handler inline é bloqueado pela CSP.

E não remova `vite.build.assetsInlineLimit: 0` do
[`astro.config.mjs`](../astro.config.mjs): sem ele o Astro embute o script no
HTML e a CSP derruba a própria página em produção. O `npm run verificar` **não**
pega isso — só o `npm run preview`.

---

## Trocar o favicon

A marca é um vaso com três folhas, em [`public/favicon.svg`](../public/favicon.svg).

São **quatro** arquivos, e eles não são o mesmo desenho reduzido:

| Arquivo | Tamanho | Traço | Para quem |
|---|---|---|---|
| `favicon.svg` | vetor | 3 | Todo navegador moderno; troca de cor em aba escura |
| `favicon-32.png` | 32px | 3 | Navegador antigo |
| `favicon-16.png` | 16px | **4.2** | Navegador antigo em tela 1x |
| `apple-touch-icon.png` | 180px | 3 | Tela de início do iOS (precisa ser opaco) |

### Por que a espessura muda

Um favicon de 16px tem 16 pixels para caber três folhas, os caules e o vaso. O
desenho original vinha com `stroke-width="1.4"` numa caixa de 150 unidades: a
16px isso rende **0,15 pixel**, e o ícone vira uma mancha cinza. Não existe um
valor único que sirva 16px e 180px — por isso o PNG de 16px é gerado à parte,
com traço mais grosso.

O `viewBox` também foi apertado. O original era `0 0 110 150`, mas o desenho
ocupa só `x 14..96` e `y 40..140` — sobravam 40 unidades vazias no topo, que o
`preserveAspectRatio` transformava em margem, encolhendo o ícone para uns 17px
de 32. Hoje é `-1 34 112 112`: a caixa quadrada justa em volta do desenho.

### Regerar depois de mexer no SVG

Edite `public/favicon.svg` e rode:

```bash
node -e "
const sharp=require('sharp'),fs=require('fs');
const base=fs.readFileSync('public/favicon.svg','utf8');
const com=sw=>Buffer.from(base.split('stroke-width=\"3\"').join('stroke-width=\"'+sw+'\"'));
(async()=>{
  await sharp(com('4.2'),{density:2400}).resize(16,16,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toFile('public/favicon-16.png');
  await sharp(com('3'),{density:2400}).resize(32,32,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toFile('public/favicon-32.png');
  await sharp(com('3'),{density:2400}).resize(160,160,{fit:'contain',background:'#e9e6e1'}).extend({top:10,bottom:10,left:10,right:10,background:'#e9e6e1'}).flatten({background:'#e9e6e1'}).png().toFile('public/apple-touch-icon.png');
})();
"
```

(`sharp` já vem com o Astro; não precisa instalar.)

**Confira o resultado no tamanho real, não ampliado.** Um ícone que parece ótimo
a 200px pode sumir a 16px. Para ver pixel a pixel:

```bash
node -e "
const sharp=require('sharp');
sharp('public/favicon-16.png').resize(320,320,{kernel:'nearest'}).toFile('zoom16.png');
"
```

### Se trocar por outro desenho

- Deixe o `viewBox` justo em volta do traçado, quadrado. Margem sobrando vira
  ícone pequeno.
- Evite detalhe fino: o que não sobrevive a 16px só atrapalha.
- Mantenha a classe `tinta` nos traços escuros — é ela que o bloco
  `prefers-color-scheme: dark` dentro do SVG usa para não sumir em aba escura.
- Se o arquivo vier com metadados (C2PA, editor gráfico), tire: num arquivo
  baixado a cada visita, são quilobytes por nada.

## Quando algo quebrar

| Sintoma | Causa provável |
|---|---|
| Nada interage e o console acusa CSP | Script virou inline — confira `assetsInlineLimit: 0` |
| As demos aparecem sem estilo/interação | `allow-same-origin` sumiu do `sandbox` do iframe |
| Fonte errada, tudo em Georgia | Caminho quebrado em `public/fonts/fontes.css` |
| Barra de rolagem horizontal | Alguma `minmax()` nova sem `min()`, ou largura fixa |
| Prévia sem imagem no WhatsApp | `SITE` vazio em `src/config.ts` no momento do build |
| `npm audit` acusa pacote `extraneous` | Resto de atualização; `npm prune` |
