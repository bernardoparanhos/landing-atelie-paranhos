// ============================================================
//  O ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR PARA PUBLICAR
// ============================================================

/** Nome que aparece no topo, no título da aba e no rodapé. */
export const MARCA = "Ateliê Paranhos";

/** WhatsApp com DDI + DDD + número, só dígitos. 55 = Brasil, 24 = DDD. */
export const WHATSAPP = "5524992810807";

/** Mensagem já preenchida quando a pessoa clica no botão do WhatsApp. */
export const MENSAGEM_WHATSAPP =
  "Oi! Vi a página sobre propostas sem PDF e quero saber mais.";

/**
 * Endereço final do site: com https, sem barra no fim.
 * Ex.: "https://atelieparanhos.com.br"
 *
 * Enquanto estiver vazio:
 *   - as tags de canonical e Open Graph não são geradas (link errado no
 *     WhatsApp/Instagram é pior do que link nenhum);
 *   - o sitemap.xml sai vazio e o robots.txt não aponta para ele.
 * Preencha antes de publicar. Veja docs/DEPLOY.md.
 */
export const SITE = "";

/** Texto que aparece no Google e na prévia de compartilhamento. */
export const DESCRICAO =
  "A sua proposta pode ser uma página limpa, com link próprio, com a sua cara. E você edita sozinha.";

// ------------------------------------------------------------
// Derivados — normalmente não precisa mexer daqui para baixo.
// ------------------------------------------------------------

/** SITE sem barras sobrando no fim; string vazia se não configurado. */
export const base = SITE.trim().replace(/\/+$/, "");

/** URL canônica da home, ou null enquanto SITE não estiver preenchido. */
export const canonical = base ? `${base}/` : null;

export const TITULO = `${MARCA} · Sites para fotógrafos`;

export const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
  MENSAGEM_WHATSAPP,
)}`;
