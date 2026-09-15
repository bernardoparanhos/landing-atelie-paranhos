import type { APIRoute } from "astro";
import { base } from "../config";

// Gerado no build a partir de src/config.ts, para não haver duas fontes de
// verdade sobre o endereço do site.
export const GET: APIRoute = () => {
  const linhas = [
    "User-agent: *",
    "Allow: /",
    // As demonstrações existem só para serem vistas dentro da janela da
    // seção 05. Indexá-las separadamente confunde o Google (páginas soltas,
    // sem contexto, com conteúdo fictício) e canibaliza a landing.
    "Disallow: /demos/",
  ];
  if (base) linhas.push("", `Sitemap: ${base}/sitemap.xml`);

  return new Response(linhas.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
