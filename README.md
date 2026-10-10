# Páginas para fotógrafos · Bernardo Paranhos

Landing de uma página só que vende páginas e páginas de proposta para
fotógrafos. Estática: o que vai para o ar é HTML, CSS, um arquivo de JavaScript
e imagens. Não existe servidor, banco de dados nem login — e é de propósito,
porque nada disso pode quebrar nem ser invadido.

São **duas versões** da mesma página, geradas no build:

| | endereço | para quem |
|---|---|---|
| Brasil | `fotografos.engenheiroparanhos.com.br/` | mercado brasileiro, em reais |
| Portugal | `fotografos.engenheiroparanhos.com.br/pt/` | mercado português, em euros |

Não é a mesma página com o sotaque trocado: muda o tratamento (`tu` em vez de
`você`), o vocabulário (sessão, telemóvel, guardar, contacto), a moeda, o
bloco do domínio (`.pt` e NIF no lugar de `registro.br` e CPF) e as três
demonstrações embutidas. Ver **[Os dois idiomas](#os-dois-idiomas)**.

A prova da página são dois sites de cliente reais (seção 01). Duas seções
embutem uma "janela de navegador" com demonstrações navegáveis: o painel
administrativo (seção 02) e o template base (seção 03).

---

## Rodar na sua máquina

```bash
npm install
npm run dev
```

Abre em <http://127.0.0.1:4321>.

Para testar no celular, na mesma rede Wi-Fi:

```bash
npm run dev:rede
```

> O servidor de desenvolvimento fica preso a `127.0.0.1` por padrão **de
> propósito**: ele nunca foi endurecido para uso em rede e já teve falhas de
> leitura de arquivo local. Só exponha quando precisar. Ver
> [docs/SEGURANCA.md](docs/SEGURANCA.md#o-servidor-de-desenvolvimento).

## Publicar

```bash
npm run build      # gera dist/
npm run preview    # confere o build localmente antes de subir
```

Passo a passo de hospedagem, domínio e cabeçalhos: **[docs/DEPLOY.md](docs/DEPLOY.md)**.

## Conferir antes de subir

```bash
npm run verificar   # tipos + build + auditoria de dependências
```

---

## Onde mexer

### Todo o texto: `src/config/i18n.ts`

**É o único arquivo que você precisa abrir para mudar o que a página diz.**
Nenhuma seção tem texto cravado dentro dela: todas leem daqui.

Ele tem dois dicionários, `br` e `pt`, um por versão. Cada chave aparece nos
dois — e é o compilador que garante isso (ver [Os dois
idiomas](#os-dois-idiomas)).

| Quero mudar | Edito, dentro de `br` ou de `pt` |
|---|---|
| A linha e o cartão do topo | `hero` → `eyebrow`, `stats[]`, `promessa` |
| As abas da janela da seção 03 | `template.abas[]` |
| Preço de um formato | `formatos.lista[]` → o campo `price` |
| O que um formato inclui | `formatos.lista[]` → `features[]` |
| O bloco do domínio | `formatos.dominio` → `destaque`, `corpo`, `opcoes[]` |
| Um depoimento | `exemplos.clientes.<id>.quote` |
| Os passos do "como funciona" | `comoFunciona.passos[]` |
| O que vem junto sempre | `incluso.itens[]` |
| Número de WhatsApp | `whatsapp` (é por versão) |
| Mensagem que já vem escrita no WhatsApp | `waPadrao` e os `waMessage` de cada formato |

### O que não muda de versão: `src/config/site.ts`

| Quero mudar | Edito |
|---|---|
| Nome que assina a página | `brand` |
| Endereço do site | `SITE` |
| Adicionar um cliente novo | um objeto em `clients[]` + os dois prints em `src/assets/` **e** a parte textual dele nos dois dicionários |
| Link do template publicado | `templateLiveUrl` |

`SITE` merece atenção. Se ficar vazio, o site funciona normalmente, mas **sem**
canonical, sem prévia de compartilhamento (Open Graph) e com o `sitemap.xml`
vazio. É de propósito: um endereço errado nessas tags é pior do que tag
nenhuma.

### A ordem das seções

[`src/layouts/Landing.astro`](src/layouts/Landing.astro) é só a ordem em que as
seções entram, e serve as duas versões. Trocar duas de lugar é trocar duas
linhas, e vale para o Brasil e para Portugal ao mesmo tempo.

As páginas em `src/pages/` não fazem mais do que escolher o idioma:
[`index.astro`](src/pages/index.astro) é `<Landing lang="br" />` e
[`pt/index.astro`](src/pages/pt/index.astro) é `<Landing lang="pt" />`.

| # | Seção | Arquivo |
|---|---|---|
| — | topo | [`src/components/Hero.astro`](src/components/Hero.astro) |
| 01 | exemplos no ar + depoimentos | [`Exemplos.astro`](src/components/Exemplos.astro) |
| 02 | o painel, editável na própria página | [`Painel.astro`](src/components/Painel.astro) |
| 03 | o template, numa janela | [`Template.astro`](src/components/Template.astro) |
| 04 | como funciona | [`ComoFunciona.astro`](src/components/ComoFunciona.astro) |
| 05 | os três formatos | [`Formatos.astro`](src/components/Formatos.astro) |
| 06 | o que vem junto | [`Incluso.astro`](src/components/Incluso.astro) |
| — | chamada final | [`CTA.astro`](src/components/CTA.astro) |
| — | rodapé | [`Footer.astro`](src/components/Footer.astro) |

Se você mudar a ordem, **os números das seções estão no dicionário** (`numero`
em cada bloco): acerte-os nas duas versões.

### O resto

| O quê | Onde |
|---|---|
| `<head>`, CSP, favicon, paleta, fontes | [`src/layouts/Base.astro`](src/layouts/Base.astro) |
| Página de erro | [`src/pages/404.astro`](src/pages/404.astro) |
| Prints dos clientes | [`src/assets/`](src/assets/) — o Astro redimensiona e converte sozinho |
| Demonstração: o template, aba "o site" | [`public/demos/site/`](public/demos/site/) |
| Demonstração: o template, aba "as propostas" | [`public/demos/propostas.html`](public/demos/propostas.html) |
| Demonstração: o painel | [`public/demos/painel.html`](public/demos/painel.html) + [`painel.js`](public/demos/painel.js) |
| As três demonstrações em português de Portugal | `public/demos/pt/` — **geradas**, ver abaixo |
| Fontes | [`public/fonts/`](public/fonts/) — auto-hospedadas |
| Cabeçalhos de segurança | [`public/_headers`](public/_headers) e [`vercel.json`](vercel.json) |

> **Imagem nova vai em `src/assets/`, não em `public/`.** O que está em
> `src/assets/` passa pelo otimizador (vira WebP, ganha `srcset` e
> `width`/`height`); o que está em `public/` é copiado cru. Os quatro prints de
> cliente somavam 2,2 MB como PNG; hoje o navegador baixa **19 KB** cada um
> numa tela comum e 55 KB numa retina.
>
> **E toda imagem com largura em CSS precisa de `height: auto`.** A regra
> global do [`Base.astro`](src/layouts/Base.astro) já garante — não a remova.
> Sem ela, o atributo `height` que o `<Image>` emite passa a valer e a imagem
> fica numa caixa da altura do arquivo original. Ver
> [docs/ARQUITETURA.md](docs/ARQUITETURA.md#toda-imagem-precisa-de-heightauto).

---

## Os dois idiomas

### A trava que impede esquecer

Todo o texto mora em [`src/config/i18n.ts`](src/config/i18n.ts), em dois
dicionários. A linha que faz o arquivo valer a pena é esta:

```ts
const br = { /* ... */ };
const pt: typeof br = { /* ... */ };
```

O tipo do português é **travado no do brasileiro**. Esquecer uma chave, errar
um nome ou deixar um texto para trás não passa despercebido: o `npm run build`
falha e diz qual chave é. É a diferença entre traduzir a página e achar que
traduziu.

Para um terceiro idioma: copie o bloco de `br`, traduza, acrescente a sigla em
`Lang`, e crie `src/pages/<sigla>/index.astro` com `<Landing lang="<sigla>" />`.
O compilador aponta o que ficou faltando. Nenhuma seção muda.

### A trava que impede traduzir errado

O compilador vê chave faltando, mas não vê **chave preenchida com o texto
errado** — uma frase brasileira copiada para o lado português e esquecida ali.
É o erro mais fácil de cometer, porque as duas línguas são quase iguais e o
olho passa por cima.

Por isso o `npm run build` termina em
[`scripts/checar-idiomas.mjs`](scripts/checar-idiomas.mjs), que lê o `dist/` e
falha se achar:

- marca brasileira no lado português — `R$`, `CPF`, `registro.br`, `você`,
  `ensaio`, `gestante`, `contato`, `Salvar`, `em um`, `pra`, `a gente` no
  lugar de `nós`…
- marca portuguesa no lado brasileiro — `€`, `NIF`, `dns.pt`, `telemóvel`,
  `Guardar`, `contacto`…
- preço, `lang` ou caminho de demo que deveria estar e não está.

Os dois depoimentos são **falas literais de clientes brasileiras** e ficam
intactos na página portuguesa de propósito — reescrevê-los seria atribuir às
pessoas palavras que elas não disseram. Só eles saem da conferência, e o
rótulo `cliente no Brasil` diz de onde vêm.

Rodar sozinho: `npm run idiomas`.

### Por que rota e não botão

A troca podia ser um botão que troca o texto na hora, guardando a escolha no
`localStorage`. Seria menos arquivo. Mas aí existiria **uma URL só**: o Google
de Portugal indexaria a versão brasileira, e não haveria link português para
colar numa conversa de WhatsApp.

Então a troca é rota. As duas páginas saem prontas do build, como HTML
estático, sem um byte de JavaScript a mais, e o seletor no cabeçalho são dois
links `<a>`.

Como as duas são quase o mesmo texto em duas variantes de português, uma
canibalizaria a outra como conteúdo duplicado se o par não fosse declarado. O
`hreflang` sai nos dois lugares que o Google lê: nas `<link>` do `<head>` e
dentro do `sitemap.xml`, com `x-default` na brasileira.

### As demonstrações

As três demos embutidas nas janelas têm texto visível — nomes de proposta,
rótulos do painel, o tour guiado. A versão portuguesa delas vive em
`public/demos/pt/` e é **gerada**:

```bash
npm run demos:pt
```

[`scripts/traduzir-demos.mjs`](scripts/traduzir-demos.mjs) copia
`public/demos/` e aplica um mapa de frases. O resultado é versionado (entra no
git); o script existe para refazer, não para o build depender dele.

**Mexeu numa demo brasileira? Rode `npm run demos:pt` de novo.** O script tem
duas travas: falha se uma entrada do mapa deixar de casar (sinal de que a demo
mudou e o mapa envelheceu) e falha se sobrar marca brasileira na saída.

### O que é por versão

| | Brasil | Portugal |
|---|---|---|
| tratamento | você | tu |
| moeda | R$ 500 / 600 / 700 | €150 / €190 / €240 |
| domínio | registro.br ou Hostinger, CPF | dns.pt ou Hostinger, NIF — `.pt` ou `.com` |
| vocabulário | ensaio, celular, salvar, contato | sessão, telemóvel, guardar, contacto |
| WhatsApp | campo `whatsapp` do dicionário `br` | campo `whatsapp` do dicionário `pt` |
| demos | `/demos/` | `/demos/pt/` |
| `lang` e `og:locale` | `pt-BR` / `pt_BR` | `pt-PT` / `pt_PT` |

---

## Documentação

- **[docs/ARQUITETURA.md](docs/ARQUITETURA.md)** — como a página é montada e por
  que ela é assim (inclusive o estilo inline, que assusta à primeira vista).
- **[docs/SEGURANCA.md](docs/SEGURANCA.md)** — o que foi protegido, como, o que
  foi aceito como risco e como conferir.
- **[docs/RESPONSIVIDADE.md](docs/RESPONSIVIDADE.md)** — os pontos de quebra e
  como testar que nada vaza pelas laterais.
- **[docs/DEPLOY.md](docs/DEPLOY.md)** — publicar, domínio, cabeçalhos.
- **[docs/MANUTENCAO.md](docs/MANUTENCAO.md)** — atualizar dependências, fontes
  e imagens sem quebrar nada.

---

## Identidade

Fonte: **Outfit** (200 a 600), auto-hospedada. As demonstrações em `/demos/`
usam Cormorant Garamond + Jost de propósito: ali quem fala é o site da cliente,
não esta página.

Paleta, definida em `:root` no [`Base.astro`](src/layouts/Base.astro):

| token | valor | uso |
|---|---|---|
| `--bg` | `#fdf5ef` | papel |
| `--ink` | `#2e2521` | tinta, faixas escuras |
| `--ink-soft` | `#574b44` | texto corrido |
| `--muted` | `#8a7d74` | legendas |
| `--gold` | `#8a6f4a` | rótulos, destaques |
| `--gold-light` | `#c9b48d` | o mesmo, sobre fundo escuro |
| `--line` | `#edded3` | bordas |
| `--card-dark` | `#3a302b` | cartões na faixa escura |
