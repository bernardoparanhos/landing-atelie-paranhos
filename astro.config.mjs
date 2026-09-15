import { defineConfig } from "astro/config";

/**
 * Responde 204 ao probe automático do Chrome DevTools
 * (/.well-known/appspecific/com.chrome.devtools.json), que só existe em dev e
 * enchia o log de 404. Não vai para o build de produção.
 */
const silenciaProbeDevTools = {
  name: "silencia-probe-devtools",
  hooks: {
    "astro:server:setup": ({ server }) => {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/.well-known/appspecific/com.chrome.devtools.json")) {
          res.statusCode = 204;
          res.end();
          return;
        }
        next();
      });
    },
  },
};

// O servidor de desenvolvimento não é endurecido para uso em rede: ao longo dos
// anos, Vite e Astro tiveram falhas de leitura de arquivo local e de CSRF que só
// valem para ele. Por isso ele fica preso a 127.0.0.1 por padrão.
// Para testar no celular na mesma rede, rode:  npm run dev:rede
const exporNaRede = process.env.EXPOR_NA_REDE === "1";

// https://astro.build/config
export default defineConfig({
  server: { port: 4321, host: exporNaRede ? true : "127.0.0.1" },
  integrations: [silenciaProbeDevTools],
  build: {
    // Nomes com hash: permite cache eterno em /_astro/ (ver public/_headers).
    assets: "_astro",
    // CSS continua embutido no HTML: é pouca coisa e evita um pedido a mais
    // bloqueando a primeira pintura. Não afeta a CSP, que já precisa de
    // 'unsafe-inline' em style por causa dos style="" nos elementos.
    inlineStylesheets: "always",
  },
  vite: {
    build: {
      // Zero = o Astro NÃO embute o JS da página dentro do HTML.
      // É o que permite a CSP usar script-src 'self' sem 'unsafe-inline' e sem
      // hash: todo script é arquivo externo do próprio domínio. Se um dia isto
      // voltar para o padrão, a CSP bloqueia o próprio script da página.
      assetsInlineLimit: 0,
    },
    server: {
      fs: {
        // Não serve nada fora da pasta do projeto durante o desenvolvimento.
        strict: true,
      },
    },
  },
});
