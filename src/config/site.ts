// ============================================================
//  O QUE É IGUAL NAS DUAS VERSÕES DA PÁGINA
// ============================================================
//  Marca, endereços, imagens e os ajudantes de link moram aqui.
//
//  TODO O TEXTO mora em src/config/i18n.ts, separado por versão
//  (br e pt). Se você veio trocar uma palavra, um preço ou uma
//  mensagem de WhatsApp, é lá.
// ============================================================

import type { ImageMetadata } from "astro";

import tatianeSite from "../assets/cliente-tatiane-site.png";
import tatianePropostas from "../assets/cliente-tatiane-propostas.png";
import topazioSite from "../assets/cliente-topazio-site.png";
import topazioPropostas from "../assets/cliente-topazio-propostas.png";

import { translations, type Lang } from "./i18n";

// ------------------------------------------------------------
// Identidade
// ------------------------------------------------------------

/** Nome que assina o topo e o rodapé. O mesmo nas duas versões. */
export const brand = "Bernardo Paranhos";

/** Portfólio pessoal, linkado no rodapé. */
export const portfolio = "https://engenheiroparanhos.com.br";

/**
 * Endereço final do site: com https, sem barra no fim.
 *
 * Enquanto estiver vazio:
 *   - canonical, hreflang e Open Graph não são gerados (link errado
 *     no WhatsApp é pior do que link nenhum);
 *   - o sitemap.xml sai vazio e o robots.txt não aponta para ele.
 */
export const SITE = "https://fotografos.engenheiroparanhos.com.br";

/**
 * Monta um link de WhatsApp com mensagem pronta, no número da
 * versão pedida. O replace tira qualquer símbolo do número: a API
 * só aceita dígitos.
 */
export function wa(lang: Lang, message: string): string {
  return (
    "https://wa.me/" +
    translations[lang].whatsapp.replace(/\D/g, "") +
    "?text=" +
    encodeURIComponent(message)
  );
}

// ------------------------------------------------------------
// Clientes no ar — a prova da seção 01
// ------------------------------------------------------------
//  Só o que não muda de versão. Nicho, nome curto, números e
//  depoimento são texto e ficam em i18n.ts, casados por `id`.

export type Client = {
  /** A chave que casa com exemplos.clientes[id] no dicionário. */
  id: "tatiane" | "topazio";
  name: string;
  /** Inicial no avatar do depoimento. */
  initial: string;
  siteUrl: string;
  proposalsUrl: string;
  /** Importado de src/assets/: o Astro converte para WebP no build. */
  shotSite: ImageMetadata;
  shotProposals: ImageMetadata;
};

export const clients: Client[] = [
  {
    id: "tatiane",
    name: "Tatiane Piasecki",
    initial: "T",
    siteUrl: "https://www.tatianepiaseckifotografia.com.br/",
    proposalsUrl: "https://www.tatianepiaseckifotografia.com.br/propostas",
    shotSite: tatianeSite,
    shotProposals: tatianePropostas,
  },
  {
    id: "topazio",
    name: "Fotos Topázio",
    initial: "E",
    siteUrl: "https://fotostopazio.com.br/",
    proposalsUrl: "https://fotostopazio.com.br/propostas",
    shotSite: topazioSite,
    shotProposals: topazioPropostas,
  },
];

// ------------------------------------------------------------
// O template publicado
// ------------------------------------------------------------

/**
 * Para onde vai o "navegar no template" — abre em aba nova, fora
 * daqui. É o template publicado, navegável inteiro.
 */
export const templateLiveUrl =
  "https://paranhos-dev.github.io/template-fot-grafos/";

// ------------------------------------------------------------
// Derivados — normalmente não precisa mexer daqui para baixo.
// ------------------------------------------------------------

/** SITE sem barras sobrando no fim; string vazia se não configurado. */
export const base = SITE.trim().replace(/\/+$/, "");

/** URL canônica de uma versão, ou null enquanto SITE não estiver preenchido. */
export function canonicalDe(lang: Lang): string | null {
  return base ? `${base}${translations[lang].rota}` : null;
}

/** Título da aba de uma versão. */
export function tituloDe(lang: Lang): string {
  return `${brand} · ${translations[lang].meta.tagline}`;
}
