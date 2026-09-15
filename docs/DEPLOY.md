# Publicar

## Antes de subir, uma vez

1. **Preencha o endereço** em [`src/config.ts`](../src/config.ts):

   ```ts
   export const SITE = "https://seudominio.com.br";
   ```

   Sem isso, o site vai ao ar sem `canonical`, sem prévia de compartilhamento no
   WhatsApp/Instagram e com o `sitemap.xml` vazio.

2. **Confira o número do WhatsApp** no mesmo arquivo. É o objetivo da página
   inteira; um dígito errado derruba a conversão a zero.

3. **Rode a verificação:**

   ```bash
   npm run verificar
   ```

4. **Olhe o build de verdade:**

   ```bash
   npm run build && npm run preview
   ```

   Abra <http://localhost:4321>, percorra as seções e confira que o console
   (F12) está limpo. É neste passo — e só neste — que problemas de CSP aparecem,
   porque a política só é aplicada no build de produção.

---

## Vercel (recomendado)

1. Suba o repositório no GitHub.
2. Em <https://vercel.com>, **Add New → Project** e escolha o repositório.
3. A Vercel detecta Astro sozinha. O [`vercel.json`](../vercel.json) já traz
   comando de build, pasta de saída e todos os cabeçalhos de segurança.
4. **Deploy.**

Domínio próprio: **Settings → Domains → Add**. A Vercel mostra os registros de
DNS para apontar no seu registrador. O HTTPS sai automático e de graça.

## Netlify

1. Suba o repositório no GitHub.
2. **Add new site → Import an existing project.**
3. Build: `npm run build` · Publish directory: `dist`
4. Os cabeçalhos vêm de [`public/_headers`](../public/_headers), que é copiado
   para `dist/` no build — a Netlify lê sozinha.

## Cloudflare Pages

Igual à Netlify: lê o mesmo `_headers`. Build `npm run build`, saída `dist`.

## GitHub Pages e outras hospedagens simples

Funciona, mas **não aplica cabeçalhos HTTP**. Nesse caso vale só a CSP embutida
no `<meta>` do HTML, que cobre quase tudo menos `frame-ancestors` — ou seja,
outro site conseguiria embutir a sua página num iframe. Para uma landing de
vendas o impacto é baixo, mas Vercel ou Netlify são melhores e igualmente
gratuitas.

---

## Depois de publicar

**Confira os cabeçalhos:** rode o domínio em <https://securityheaders.com>.
Esperado: **A**. Se vier abaixo, a hospedagem não está lendo o arquivo de
cabeçalhos — confira se `_headers` está dentro de `dist/` no build
(`ls dist/_headers`) ou se o `vercel.json` está na raiz do repositório.

**Confira a prévia de compartilhamento:** mande o link para você mesma no
WhatsApp. Tem que aparecer título, descrição e a foto. Se não aparecer, o `SITE`
provavelmente ficou vazio no build.

**Avise o Google:** em <https://search.google.com/search-console>, adicione a
propriedade e envie `https://seudominio.com.br/sitemap.xml`.

**Um cuidado com HSTS:** o cabeçalho `Strict-Transport-Security` manda o
navegador usar só HTTPS por dois anos, incluindo subdomínios — e o navegador
**lembra disso mesmo se você remover o cabeçalho depois**. Se algum subdomínio
seu ainda for HTTP puro, tire o `includeSubDomains` do `_headers` e do
`vercel.json` antes do primeiro deploy.

---

## Atualizar o conteúdo depois

Edite, confira local, e envie:

```bash
npm run dev            # confere a mudança
npm run verificar      # tipos + build + auditoria
git add -A && git commit -m "atualiza os valores dos pacotes"
git push
```

Vercel e Netlify republicam sozinhas a cada `push`. Leva cerca de um minuto.
