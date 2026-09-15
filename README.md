# Ateliê Paranhos · Landing

Landing page de uma página só que vende sites para fotógrafos. Estática: o que
vai para o ar é HTML, CSS, um arquivo de JavaScript e imagens. Não existe
servidor, banco de dados nem login — e é de propósito, porque nada disso pode
quebrar nem ser invadido.

Dentro dela, a seção 04 mostra três demonstrações navegáveis (o site, a
proposta e o painel administrativo) dentro de uma "janela" de navegador.

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
npm run build      # gera dist/ (HTML estático, ~640 KB)
npm run preview    # confere o build localmente antes de subir
```

Passo a passo de hospedagem, domínio e cabeçalhos: **[docs/DEPLOY.md](docs/DEPLOY.md)**.

## Conferir antes de subir

```bash
npm run verificar   # tipos + build + auditoria de dependências
```

---

## O que editar

### Para publicar: `src/config.ts`

É o único arquivo que precisa de ajuste. Ele traz marca, WhatsApp, descrição e —
o mais importante — o endereço final do site:

```ts
export const SITE = "";   // ex.: "https://atelieparanhos.com.br"
```

Enquanto estiver vazio, o site funciona normalmente, mas **sem** canonical, sem
prévia de compartilhamento (Open Graph) e com o `sitemap.xml` vazio. É de
propósito: um endereço errado nessas tags é pior do que tag nenhuma. Preencha
antes de publicar.

### Conteúdo e estética

| O quê | Onde |
|---|---|
| Textos, seções e visual da landing | [`src/pages/index.astro`](src/pages/index.astro) |
| Página de erro | [`src/pages/404.astro`](src/pages/404.astro) |
| Fotos do topo | [`src/assets/`](src/assets/) — o Astro redimensiona e converte sozinho |
| Demonstração: o site | [`public/demos/site/`](public/demos/site/) |
| Demonstração: a proposta | [`public/demos/proposta.html`](public/demos/proposta.html) |
| Demonstração: o painel | [`public/demos/painel.html`](public/demos/painel.html) + [`painel.js`](public/demos/painel.js) |
| Fontes | [`public/fonts/`](public/fonts/) — auto-hospedadas |
| Cabeçalhos de segurança | [`public/_headers`](public/_headers) e [`vercel.json`](vercel.json) |

> **Fotos do topo vão em `src/assets/`, não em `public/`.** O que está em
> `src/assets/` passa pelo otimizador (vira WebP, ganha `srcset` e
> `width`/`height`); o que está em `public/` é copiado cru. As duas fotos do
> hero pesavam 6 MB em `public/` e hoje pesam 62 KB.

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

Fontes: Cormorant Garamond (títulos) + Jost (texto), auto-hospedadas.
Paleta: tinta `#14110f` · papel `#e9e6e1` · ouro `#8a6f4a` · texto `#3b3630`.
