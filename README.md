# Páginas para fotógrafos · Bernardo Paranhos

Landing de uma página só que vende páginas e páginas de proposta para
fotógrafos. Estática: o que vai para o ar é HTML, CSS, um arquivo de JavaScript
e imagens. Não existe servidor, banco de dados nem login — e é de propósito,
porque nada disso pode quebrar nem ser invadido.

Endereço final: **fotografos.engenheiroparanhos.com.br**

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

### Quase tudo: `src/config/site.ts`

**É o único arquivo que você precisa abrir para mudar o que a página diz.**
Nenhuma seção tem texto cravado dentro dela: todas leem daqui.

| Quero mudar | Edito |
|---|---|
| A linha e o cartão do topo | `hero` → `eyebrow`, `stats[]`, `promessa` |
| Preço de um formato | `formats[]` → o campo `price` |
| O que um formato inclui | `formats[]` → `features[]` |
| Adicionar um cliente novo | empurrar um objeto em `clients[]` + os dois prints em `src/assets/` |
| Um depoimento | `clients[]` → `quote` |
| Os passos do "como funciona" | `steps[]` |
| O que vem junto sempre | `perks[]` |
| Número de WhatsApp | `whatsapp` |
| Mensagem que já vem escrita no WhatsApp | `defaultWaMessage` e os `waMessage` de cada formato |
| Endereço do site | `SITE` |

`SITE` merece atenção. Se ficar vazio, o site funciona normalmente, mas **sem**
canonical, sem prévia de compartilhamento (Open Graph) e com o `sitemap.xml`
vazio. É de propósito: um endereço errado nessas tags é pior do que tag
nenhuma.

### A ordem das seções

[`src/pages/index.astro`](src/pages/index.astro) tem 25 linhas e é só a ordem em
que as seções entram. Trocar duas de lugar é trocar duas linhas.

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

Se você mudar a ordem, **os números são escritos à mão** dentro de cada
componente: acerte-os também.

### O resto

| O quê | Onde |
|---|---|
| `<head>`, CSP, favicon, paleta, fontes | [`src/layouts/Base.astro`](src/layouts/Base.astro) |
| Página de erro | [`src/pages/404.astro`](src/pages/404.astro) |
| Prints dos clientes | [`src/assets/`](src/assets/) — o Astro redimensiona e converte sozinho |
| Demonstração: o template | [`public/demos/site/`](public/demos/site/) |
| Demonstração: o painel | [`public/demos/painel.html`](public/demos/painel.html) + [`painel.js`](public/demos/painel.js) |
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
