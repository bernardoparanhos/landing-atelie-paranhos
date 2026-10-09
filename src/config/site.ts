// ============================================================
//  O ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR
// ============================================================
//  Textos, preços, clientes, formatos e WhatsApp moram todos aqui.
//  As seções em src/components/ só leem daqui — nenhuma tem texto
//  próprio cravado dentro. Trocar um preço é editar uma linha.
// ============================================================

import type { ImageMetadata } from "astro";

import tatianeSite from "../assets/cliente-tatiane-site.png";
import tatianePropostas from "../assets/cliente-tatiane-propostas.png";
import topazioSite from "../assets/cliente-topazio-site.png";
import topazioPropostas from "../assets/cliente-topazio-propostas.png";

// ------------------------------------------------------------
// Identidade e contato
// ------------------------------------------------------------

/** Nome que assina o topo e o rodapé. */
export const brand = "Bernardo Paranhos";

/** Aparece ao lado do nome, em minúscula. */
export const tagline = "páginas e propostas para fotógrafos";

/** WhatsApp com DDI + DDD + número. Pode escrever com símbolos: wa() limpa. */
export const whatsapp = "5524992810807";

/** Portfólio pessoal, linkado no rodapé. */
export const portfolio = "https://engenheiroparanhos.com.br";

/**
 * Endereço final do site: com https, sem barra no fim.
 *
 * Enquanto estiver vazio:
 *   - canonical e Open Graph não são gerados (link errado no WhatsApp é
 *     pior do que link nenhum);
 *   - o sitemap.xml sai vazio e o robots.txt não aponta para ele.
 */
export const SITE = "https://fotografos.engenheiroparanhos.com.br";

/** Texto que aparece no Google e na prévia de compartilhamento. */
export const DESCRICAO =
  "Páginas e páginas de proposta para fotógrafos. Pagamento único, domínio no seu nome, painel próprio. Primeira versão em até 3 dias.";

/** Mensagem já preenchida no botão principal de WhatsApp. */
export const defaultWaMessage =
  "Oi! Vi a página e quero saber mais sobre os formatos.";

/**
 * Monta um link de WhatsApp com mensagem pronta.
 * O replace tira qualquer símbolo do número: a API só aceita dígitos.
 */
export function wa(message: string): string {
  return (
    "https://wa.me/" +
    whatsapp.replace(/\D/g, "") +
    "?text=" +
    encodeURIComponent(message)
  );
}

// ------------------------------------------------------------
// Clientes no ar — a prova da seção 01
// ------------------------------------------------------------

export type ClientStat = { label: string; value: string };

export type Client = {
  id: string;
  name: string;
  /** Primeiro nome ou apelido curto, para rotulos de link sem quebra de linha. */
  shortName: string;
  niche: string;
  /** Inicial no avatar do depoimento. */
  initial: string;
  siteUrl: string;
  proposalsUrl: string;
  /** Importado de src/assets/: o Astro converte para WebP no build. */
  shotSite: ImageMetadata;
  shotProposals: ImageMetadata;
  stats: ClientStat[];
  /** Depoimento literal, como a pessoa escreveu. Opcional. */
  quote?: string;
};

export const clients: Client[] = [
  {
    id: "tatiane",
    name: "Tatiane Piasecki",
    shortName: "da Tatiane",
    niche: "fotografia de família",
    initial: "T",
    siteUrl: "https://www.tatianepiaseckifotografia.com.br/",
    proposalsUrl: "https://www.tatianepiaseckifotografia.com.br/propostas",
    shotSite: tatianeSite,
    shotProposals: tatianePropostas,
    stats: [
      { label: "Formato", value: "Completo" },
      { label: "Propostas", value: "12 ativas" },
      { label: "Datas especiais", value: "4 mini sessões" },
    ],
    quote:
      "Estou adorando. Ficou super intuitivo, fácil para o cliente acessar as propostas e pra eu enviar pra eles também.",
  },
  {
    id: "topazio",
    name: "Fotos Topázio",
    shortName: "da Topázio",
    niche: "casamento, família e ensaios",
    initial: "E",
    siteUrl: "https://fotostopazio.com.br/",
    proposalsUrl: "https://fotostopazio.com.br/propostas",
    shotSite: topazioSite,
    shotProposals: topazioPropostas,
    stats: [
      { label: "Formato", value: "Completo" },
      { label: "Propostas", value: "7 ativas" },
      { label: "Galeria", value: "página própria" },
    ],
    quote:
      "Cara, sem palavras, perfeito. Amei de verdade. Com toda certeza vou indicar seu trabalho pra outros amigos.",
  },
];

// ------------------------------------------------------------
// O template
// ------------------------------------------------------------

export const template = {
  /**
   * Para onde vai o "navegar no template" — abre em aba nova, fora daqui.
   * É o template publicado, navegável inteiro.
   */
  liveUrl: "https://paranhos-dev.github.io/template-fot-grafos/",
  /**
   * O que a janela desta página embute. Precisa ser local: a CSP tem
   * frame-src 'self' e bloquearia um domínio de fora. Também é o render
   * que de fato parece um site pronto, em vez de placeholder.
   */
  embedUrl: "/demos/site/index.html",
  pages: ["início", "sobre mim", "ensaios", "galeria", "propostas", "contato"],
  highlight: "propostas",
};

// ------------------------------------------------------------
// O painel — a demonstração que se usa com a mão
// ------------------------------------------------------------

export const painel = {
  /** A janela embutida com o painel inteiro. Local, pela mesma razão. */
  embedUrl: "/demos/painel.html",
  /** Valores iniciais do mini-painel editável. */
  exemplo: {
    nome: "Doce Espera Premium",
    valor: "980",
  },
};

// ------------------------------------------------------------
// Os formatos
// ------------------------------------------------------------

export type Format = {
  tag: string;
  name: string;
  price: string;
  blurb: string;
  features: string[];
  excludes: string;
  cta: string;
  waMessage: string;
  featured?: boolean;
};

export const formats: Format[] = [
  {
    tag: "Formato 01",
    name: "Só propostas",
    price: "R$ 500",
    blurb:
      "É o substituto direto do PDF. Uma página de propostas com cada pacote em link próprio, pronta para colar na conversa.",
    features: [
      "Página de propostas com todos os seus pacotes",
      "Cada proposta com link individual",
      "Bloco de datas especiais (Natal, Dia das Mães, Páscoa)",
      "Painel para editar valores e textos",
    ],
    excludes: "Não inclui: início, sobre mim, galeria e páginas de ensaios.",
    cta: "Quero só as propostas",
    waMessage:
      "Oi! Quero o formato só propostas (R$ 500). Pode me explicar como começa?",
  },
  {
    tag: "Formato 02",
    name: "Só a página",
    price: "R$ 600",
    blurb:
      "É a sua vitrine. Quem chega pelo Instagram encontra o seu trabalho inteiro em um endereço só, no seu nome. Uma página com a sua cara, pronta pra receber cliente.",
    features: [
      "Início, sobre mim e contato",
      "Galeria e páginas de ensaios",
      "Instagram conectado, atualizando sozinho",
      "Painel para trocar fotos e textos",
    ],
    excludes: "Não inclui: a área de propostas com pacotes e valores.",
    cta: "Quero só a página",
    waMessage:
      "Oi! Quero o formato só a página (R$ 600). Pode me explicar como começa?",
  },
  {
    tag: "Formato 03",
    name: "Completo",
    price: "R$ 700",
    blurb:
      "Os dois juntos, no mesmo domínio e no mesmo painel. A cliente conhece você e já abre a proposta sem sair do site.",
    // "página", não "site": o vocabulário da página inteira é página.
    features: [
      "Tudo da página completa",
      "Tudo da área de propostas",
      "Um único endereço para divulgar",
      "R$ 400 de economia em relação aos dois separados",
    ],
    excludes: "É o formato que a maioria fecha.",
    cta: "Quero o completo",
    waMessage:
      "Oi! Quero o formato completo, página mais propostas (R$ 700). Pode me explicar como começa?",
    featured: true,
  },
];

// ------------------------------------------------------------
// Como funciona
// ------------------------------------------------------------

export type Step = {
  n: string;
  title: string;
  body: string;
  aside: string;
  note?: { title: string; body: string };
};

export const steps: Step[] = [
  {
    n: "01",
    title: "Você escolhe o formato",
    body: "Propostas, página ou completo. Me chama no WhatsApp e a gente decide junto o que faz sentido pro seu momento.",
    aside: "hoje mesmo",
  },
  {
    n: "02",
    title: "Você separa o material",
    body: "Quanto mais conteúdo, mais completa sai a primeira versão. Pode mandar do jeito que for mais fácil: Google Fotos, link, pasta ou PDF das propostas antigas.",
    aside: "no seu tempo",
  },
  {
    n: "03",
    title: "Eu monto a primeira versão da sua página",
    body: "Recebi o material, começo. Você recebe o link da sua página pronta para ver, dar palpite e pedir ajuste. Dependendo da demanda, sai em menos de 2 dias.",
    aside: "até 3 dias",
  },
  {
    n: "04",
    title: "Você vê a sua página pronta e decide",
    body: "Só aqui você fecha. Com a página existindo, com as suas fotos e as suas propostas dentro, não no escuro e não por promessa. Se não for o que você imaginou, a gente para por aqui sem custo nenhum.",
    aside: "sem compromisso",
  },
  {
    n: "05",
    title: "Você registra o seu domínio",
    body: "Fechado, aí sim entra o endereço: registrado por você, no seu nome, direto no registro.br ou na Hostinger, entre R$ 40 e R$ 65 por ano.",
    aside: "10 minutos",
    note: {
      title: "Por que eu peço o acesso",
      body: "Depois do registro você me passa só o acesso dessa plataforma de domínio, que serve exclusivamente para isso e não guarda nenhum dado pessoal seu. É lá dentro que ficam os dados técnicos para apontar o domínio para o site. Em poucos minutos o seu link está no ar.",
    },
  },
  {
    n: "06",
    title: "Você assume o painel",
    body: "No ar, o controle passa a ser seu: troca fotos, muda valores, edita textos sem depender de mim. E a gente segue se falando sempre que precisar.",
    aside: "daí em diante",
  },
];

// ------------------------------------------------------------
// O que vem junto, sempre
// ------------------------------------------------------------

export const perks = [
  {
    title: "Domínio no seu nome",
    body: "Registrado no seu CPF. Se um dia você trocar de quem cuida do site, ele vai com você.",
  },
  {
    title: "Painel próprio",
    body: "Você edita fotos, textos e valores da sua página sozinha, na hora, sem precisar me chamar.",
  },
  {
    title: "Pagamento único",
    body: "Sem mensalidade e sem plano para remover selo de plataforma. Paga uma vez, é seu.",
  },
  {
    title: "Abre rápido no celular",
    body: "É de lá que a sua cliente abre o link. Carrega leve, sem download e sem espera.",
  },
];

// ------------------------------------------------------------
// Derivados — normalmente não precisa mexer daqui para baixo.
// ------------------------------------------------------------

/** SITE sem barras sobrando no fim; string vazia se não configurado. */
export const base = SITE.trim().replace(/\/+$/, "");

/** URL canônica da home, ou null enquanto SITE não estiver preenchido. */
export const canonical = base ? `${base}/` : null;

export const TITULO = `${brand} · ${tagline}`;
