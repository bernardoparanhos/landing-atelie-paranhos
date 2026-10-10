import type { APIRoute } from "astro";
import { canonical } from "@/config/site";

// Site de uma página só: não vale puxar uma dependência de sitemap para isto.
// Enquanto SITE não estiver preenchido em src/config/site.ts, o sitemap sai vazio
// (um sitemap com URL errada é pior do que nenhum).
export const GET: APIRoute = () => {
  const urls = canonical
    ? `  <url>\n    <loc>${canonical}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`
    : "";

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls +
    "</urlset>\n";

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
