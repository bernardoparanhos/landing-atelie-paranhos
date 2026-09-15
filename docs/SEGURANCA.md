# Segurança

## Onde mora o risco neste projeto

Um site estático não tem servidor para invadir, banco para vazar nem sessão para
roubar. Isso elimina a maior parte das categorias de ataque de uma vez. O que
**sobra** é o que este documento trata:

| Risco | Situação |
|---|---|
| Script de terceiro injetado na página | Fechado por CSP (`script-src 'self'`) |
| XSS pelo campo da demo interativa | Fechado (`textContent`, nunca `innerHTML`) |
| Clickjacking (embutir o site num iframe hostil) | Fechado (`frame-ancestors 'self'`) |
| Vazamento de IP dos visitantes para terceiros | Fechado (zero requisições externas) |
| Falhas nas dependências | Zero pendências hoje; ver [Dependências](#dependências) |
| Servidor de desenvolvimento exposto na rede | Fechado por padrão |
| Conta da hospedagem / DNS | **Fora do código.** Ver [O que não está coberto](#o-que-não-está-coberto) |

---

## Cabeçalhos HTTP

Definidos em dois lugares, com o mesmo conteúdo, porque cada hospedagem lê um
formato: [`public/_headers`](../public/_headers) (Netlify, Cloudflare Pages) e
[`vercel.json`](../vercel.json) (Vercel).

| Cabeçalho | O que evita |
|---|---|
| `Content-Security-Policy` | Execução de qualquer script que não venha do próprio domínio |
| `Strict-Transport-Security` | Downgrade para HTTP e interceptação em Wi-Fi público |
| `X-Content-Type-Options: nosniff` | Um arquivo ser interpretado como tipo diferente do declarado |
| `X-Frame-Options: SAMEORIGIN` | Clickjacking (para navegadores antigos, sem CSP) |
| `Referrer-Policy` | Vazar o caminho completo da página para outros domínios |
| `Permissions-Policy` | Acesso a câmera, microfone, localização, pagamento etc. |
| `Cross-Origin-Opener-Policy` | Uma janela aberta daqui manipular esta |
| `Cross-Origin-Resource-Policy` | Outros sites embutirem recursos deste domínio |

### A CSP, linha por linha

```
default-src 'self'; base-uri 'none'; object-src 'none'; form-action 'none';
frame-ancestors 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'self';
upgrade-insecure-requests
```

- **`script-src 'self'`** — o ponto central. Sem `'unsafe-inline'` e sem
  `'unsafe-eval'`: mesmo que alguém consiga injetar `<script>` na página, o
  navegador não executa. Isso só é possível porque o JS da página é um arquivo
  externo (ver [ARQUITETURA.md](ARQUITETURA.md#o-javascript-fica-num-arquivo-externo-não-embutido)).
- **`style-src 'unsafe-inline'`** — necessário: a página usa `style=""` em cada
  elemento. Estilo inline não executa código. É o único ponto folgado da lista,
  e é aceito conscientemente.
- **`frame-ancestors 'self'`** — ninguém de fora embute esta página. O `'self'`
  (em vez de `'none'`) é obrigatório porque a própria seção 05 embute `/demos/`.
- **`base-uri 'none'`** — impede que um `<base>` injetado desvie todos os
  caminhos relativos da página para outro servidor.
- **`form-action 'none'`** — não há formulário nenhum; se aparecer um injetado,
  ele não consegue enviar nada para lugar algum.
- **`object-src 'none'`** — sem Flash, applets ou `<embed>`.

A mesma política também vai como `<meta http-equiv>` dentro do HTML (só no build
de produção). Assim ela vale mesmo em hospedagem que ignora cabeçalhos, como o
GitHub Pages, ou se alguém abrir o `dist/` direto. `frame-ancestors` não
funciona em `<meta>` — por isso os cabeçalhos continuam sendo a camada
principal.

---

## Zero terceiros

A página não faz **nenhuma** requisição para fora do próprio domínio. Sem
Google Fonts, sem CDN, sem analytics, sem pixel.

As fontes eram carregadas do Google Fonts e hoje são servidas de
`public/fonts/`. Além de deixar a CSP mais fechada, isso resolve um ponto de
LGPD: ao buscar uma fonte no servidor do Google, o navegador da visitante
entrega o IP dela a um terceiro, sem consentimento. Tribunais europeus já
trataram isso como violação de privacidade sob o GDPR, e a LGPD segue a mesma
lógica.

Efeito colateral bom: uma conexão a menos para abrir, o que acelera a primeira
pintura.

> **Se um dia entrar um analytics, um chat ou um pixel**, a CSP vai bloqueá-lo
> — e isso é o comportamento certo. Libere o domínio de propósito, no
> `_headers` e no `vercel.json`, sabendo que está reabrindo a porta.

---

## O campo da demo interativa

É a única entrada de texto do site. O que a pessoa digita vai para a tela por
`textContent`, que escreve texto literal — nunca marcação. Um nome como
`<img src=x onerror=alert(1)>` aparece como esses caracteres, e não como uma
tag.

A regra vale para o projeto inteiro: **nada aqui usa `innerHTML` com
concatenação de string.** A lista de propostas do painel de demonstração usava, e
foi reescrita com `createElement`/`textContent` — não havia falha (os dados eram
fixos no código), mas o padrão é uma armadilha para quem mexer depois.

---

## O iframe da seção 05

```html
sandbox="allow-scripts allow-same-origin" referrerpolicy="no-referrer"
```

`allow-same-origin` é obrigatório: sem ele o iframe ganha origem opaca e o
navegador bloqueia por CORS o JS e as fontes das demos. Com os dois valores o
sandbox deixa de ser barreira contra o conteúdo embutido — que é nosso, então a
perda é pequena — mas continua bloqueando **navegar a janela de cima, abrir
pop-ups, enviar formulários, iniciar downloads e abrir diálogos modais**.

Isso importa porque as demos são as páginas mais prováveis de serem editadas por
alguém no futuro. O sandbox limita o estrago de um acidente.

---

## O servidor de desenvolvimento

`npm run dev` sobe preso a `127.0.0.1`. Historicamente, Vite e Astro tiveram
falhas que valem **só** para o servidor de desenvolvimento — leitura de arquivo
arbitrário do disco, e qualquer site aberto no navegador conseguindo fazer
requisições a ele e ler a resposta. Em Windows houve ainda vazamento de hash
NTLM por caminho UNC.

Todas foram corrigidas nas versões que este projeto usa. A configuração é
defesa em profundidade, para a próxima que aparecer.

Para testar no celular: `npm run dev:rede`. Use só o tempo necessário, numa rede
de confiança. Nunca exponha o servidor de desenvolvimento à internet.

`astro.config.mjs` também traz `vite.server.fs.strict: true`, que impede o
servidor de entregar arquivos de fora da pasta do projeto.

---

## Dependências

```
astro 7.3.2 — 0 vulnerabilidades
```

O projeto estava em Astro 4.16.19, que acumulava **4 alertas (1 crítico, 2
altos, 1 moderado)**. A maioria dos CVEs listados não se aplicava a um site
estático — eram falhas de renderização no servidor, middleware, server islands e
adaptador Cloudflare, coisas que este projeto não usa. Mas as do servidor de
desenvolvimento se aplicavam, e a atualização para a 7.3.2 zerou tudo.

Confira a qualquer momento:

```bash
npm audit
```

Ver [MANUTENCAO.md](MANUTENCAO.md) para o ritmo de atualização.

---

## Como conferir

```bash
npm run verificar                 # tipos + build + npm audit
npm run build && npm run preview  # e abra http://localhost:4321
```

Com o `preview` no ar, o console do navegador (F12) deve estar **limpo**.
Qualquer violação de CSP aparece lá, em vermelho.

Depois de publicar, rode o domínio em <https://securityheaders.com> — a nota
esperada é **A**. Se vier abaixo disso, a hospedagem não está aplicando o
`_headers` / `vercel.json`; ver [DEPLOY.md](DEPLOY.md).

Teste manual de XSS, para confiar no que está escrito acima: na seção 02, cole
no campo "Nome do pacote"

```
<img src=x onerror=alert(1)>
```

e salve. O certo é o texto aparecer literalmente no cartão ao lado, sem nenhum
alerta.

---

## O que **não** está coberto

Isto aqui protege o código. O resto do risco é operacional e está com você:

- **Conta da hospedagem (Vercel/Netlify) e do GitHub.** Quem entra nelas publica
  o que quiser no seu domínio. Ative verificação em duas etapas nas duas.
- **Registro do domínio.** Ative o bloqueio de transferência e a verificação em
  duas etapas no registrador.
- **O número de WhatsApp em `src/config.ts`** é público por natureza — é o
  objetivo da página. Só confira se é o número certo antes de publicar.
- **Conteúdo de terceiros que você venha a colar** (script de chat, pixel de
  anúncio). Cada um desses é uma porta nova; leia a seção
  [Zero terceiros](#zero-terceiros) antes.
