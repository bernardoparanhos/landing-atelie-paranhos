import type { APIRoute } from "astro";
import { canonicalDe } from "@/config/site";
import { translations, idiomas } from "@/config/i18n";

// Site de duas páginas: não vale puxar uma dependência de sitemap para isto.
// Enquanto SITE não estiver preenchido em src/config/site.ts, o sitemap sai
// vazio (um sitemap com URL errada é pior do que nenhum).
//
// Cada entrada declara as duas versões em xhtml:link, que é como o Google
// pede o hreflang dentro de um sitemap. Dizer isto nos dois lugares — aqui
// e nas <link> do <head> — é o recomendado: as páginas são quase o mesmo
// texto em duas variantes de português, e sem o par declarado uma
// canibaliza a outra como conteúdo duplicado.
export const GET: APIRoute = () => {
  const alternates = idiomas
    .map((l) => ({ lang: translations[l].htmlLang, href: canonicalDe(l) }))
    .filter((a): a is { lang: string; href: string } => a.href !== null);

  const linksAlternativos =
    alternates
      .map(
        (a) =>
          `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}"/>\n`,
      )
      .join("") +
    (alternates.length > 0
      ? `    <xhtml:link rel="alternate" hreflang="x-default" href="${alternates[0].href}"/>\n`
      : "");

  const urls = alternates
    .map(
      (a) =>
        `  <url>\n    <loc>${a.href}</loc>\n${linksAlternativos}    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`,
    )
    .join("");

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    urls +
    "</urlset>\n";

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
