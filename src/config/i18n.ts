// ============================================================
//  O DICIONÁRIO — TODO O TEXTO DAS DUAS VERSÕES DA PÁGINA
// ============================================================
//  `br` é a página brasileira, `pt` é a portuguesa. A linha que
//  faz este arquivo valer a pena é esta:
//
//      const pt: typeof br = { ... }
//
//  O tipo de `pt` é travado no de `br`. Esquecer uma chave, errar
//  um nome ou deixar um texto para trás não passa despercebido:
//  o TypeScript recusa compilar e `npm run build` falha. Não é
//  disciplina de quem edita, é o compilador barrando.
//
//  Para acrescentar um terceiro idioma: copie o bloco inteiro de
//  `br`, traduza, e acrescente a sigla em `Lang`. O compilador
//  aponta o que ficou faltando.
//
//  O que NÃO mora aqui: imagens, endereços dos sites dos clientes
//  e o endereço desta página. Isso é igual nas duas versões e fica
//  em site.ts.
// ============================================================

export type Lang = "br" | "pt";

const br = {
  // --- identidade da versão ---------------------------------
  /** Valor do atributo lang do <html>. Muda como o corretor e o
      leitor de tela tratam o texto. */
  htmlLang: "pt-BR",
  /** og:locale, para a prévia do WhatsApp e das redes. */
  ogLocale: "pt_BR",
  /** Prefixo das URLs desta versão. A brasileira é a raiz. */
  rota: "/",
  /** Rótulo do botão desta versão no seletor do cabeçalho. */
  sigla: "BR",
  /** Nome por extenso, para quem usa leitor de tela. */
  idioma: "Português do Brasil",
  /** Simbolo da moeda com o espacamento que cada lugar usa: o Brasil
      escreve "R$ 980" e Portugal escreve "€980". */
  moeda: "R$ ",

  /** WhatsApp desta versão: DDI + DDD + número, só dígitos.
      É o mesmo nas duas versões — WhatsApp Business, atende Brasil e
      Portugal. Fica por versão mesmo assim: no dia em que houver um
      número português, muda uma linha e só a /pt/ sente. */
  whatsapp: "554588121303",

  // --- cabeça da página -------------------------------------
  meta: {
    tagline: "páginas e propostas para fotógrafos",
    descricao:
      "Páginas e páginas de proposta para fotógrafos. Pagamento único, domínio no seu nome, painel próprio. Primeira versão em até 3 dias.",
    ogImageAlt: "Página de uma fotógrafa cliente, no ar",
    trocaIdioma: "Versão do site",
  },

  /** Mensagem já preenchida no botão principal de WhatsApp. */
  waPadrao: "Oi! Vi a página e quero saber mais sobre os formatos.",

  // --- o topo -----------------------------------------------
  hero: {
    eyebrow: "Seu trabalho em um link só",
    tituloInicio: "Página própria e propostas com ",
    tituloEnfase: "link no seu nome",
    tituloFim: ".",
    sub: "Nada de PDF pesado nem plataforma de terceiro com propaganda em cima do seu trabalho. Pagamento único, domínio no seu nome e uma página que só tem a sua cara.",
    ctaWhatsapp: "Falar no WhatsApp",
    ctaComoFunciona: "Ver como funciona",

    /**
     * O cartão à direita do título. É a objeção número um — "e se eu
     * pagar e não gostar?" — respondida antes de ser feita. O título
     * vem partido em três porque o meio vai em itálico dourado.
     */
    promessa: {
      tituloInicio: "Você vê a página pronta",
      tituloEnfase: "antes",
      tituloFim: "de pagar.",
      colunaRuimRotulo: "por aí",
      colunaRuimTexto: "paga, torce e espera ver no que deu",
      colunaBoaRotulo: "aqui",
      colunaBoaTexto: "vê no ar, depois",
      colunaBoaEnfase: "decide se vale",
    },

    /** Os três números na faixa abaixo do botão. */
    stats: [
      { value: "até 3 dias", label: "para a primeira página no ar" },
      { value: "pagamento único", label: "sem mensalidade, sem taxa escondida" },
      { value: "no seu nome", label: "domínio registrado no seu CPF" },
    ],
  },

  // --- 01 · os sites no ar ----------------------------------
  exemplos: {
    numero: "01",
    kicker: "Exemplos no ar",
    titulo: "Estes são os exemplos desta página.",
    sub: "Sites de clientes, rodando de verdade. O site e as propostas são os mesmos que as clientes deles recebem no WhatsApp.",
    tarjaSite: "o site",
    tarjaPropostas: "as propostas",
    /** Prefixos dos dois links de cada cartão; o nome curto vem depois. */
    verSite: "Ver o site",
    verPropostas: "Ver as propostas",
    altSite: "Site de",
    altPropostas: "Propostas de",
    /** Rótulo de origem sob o depoimento. Vazio esconde a linha. */
    origemDepoimento: "",

    /**
     * A parte textual de cada cliente, casada por id com o que está
     * em site.ts (imagens e endereços, que não mudam de versão).
     *
     * Os depoimentos são literais, como as pessoas escreveram. Mexer
     * numa aspas é atribuir à pessoa palavra que ela não disse.
     */
    clientes: {
      tatiane: {
        shortName: "da Tatiane",
        niche: "fotografia de família",
        stats: [
          { label: "Formato", value: "Completo" },
          { label: "Propostas", value: "12 ativas" },
          { label: "Datas especiais", value: "4 mini sessões" },
        ],
        quote:
          "Estou adorando. Ficou super intuitivo, fácil para o cliente acessar as propostas e pra eu enviar pra eles também.",
      },
      topazio: {
        shortName: "da Topázio",
        niche: "casamento, família e ensaios",
        stats: [
          { label: "Formato", value: "Completo" },
          { label: "Propostas", value: "7 ativas" },
          { label: "Galeria", value: "página própria" },
        ],
        quote:
          "Cara, sem palavras, perfeito. Amei de verdade. Com toda certeza vou indicar seu trabalho pra outros amigos.",
      },
    },
  },

  // --- 02 · o painel ----------------------------------------
  painel: {
    numero: "02",
    kicker: "O painel, agora",
    titulo: "Parece simples? Mexe aí e confere.",
    sub: 'Todo mundo pensa a mesma coisa: "parece fácil, mas na hora eu vou travar". Então em vez de explicar, é melhor você mexer. Este é o painel, de verdade. Mude o nome do pacote ou o valor e salve.',
    dica: "↓ muda o valor aqui embaixo e vê o site mudar ao lado",

    estudio: "Seu estúdio",
    admin: "admin",
    privado: "painel privado",
    pacotes: "Pacotes",
    pacotesSub: "Edite e salve. O site atualiza na hora, sem depender de ninguém.",
    labelNome: "Nome do pacote",
    labelValor: "Valor (R$)",
    enter: "Aperte Enter ou clique em salvar.",
    salvar: "Salvar alterações",
    salvando: "salvando…",
    publicadoBotao: "publicado no seu site",
    rodapePainel:
      "No painel de verdade você também troca fotos, textos e os ensaios da página inicial. Tudo assim, do mesmo jeito.",

    urlPreview: "seuestudio.com.br/gestante",
    ensaioKicker: "ensaio gestante",
    ensaioTitulo: "A doce espera, do seu jeito.",
    rotuloPacote: "pacote",
    publicadoSite: "pronto, já está no ar para as suas clientes",
    reservar: "Reservar pelo WhatsApp",
    /** Mensagem da região viva, para leitor de tela. %n e %v são
        trocados pelo nome e pelo valor no script. */
    avisoPublicado: "Publicado: %n, R$ %v.",
    /** Nome usado quando a pessoa apaga o campo e salva vazio. */
    pacoteVazio: "Seu pacote",

    /** Valores iniciais do mini-painel editável. */
    exemploNome: "Doce Espera Premium",
    exemploValor: "980",

    /** A janela com o painel inteiro. Local: a CSP tem frame-src 'self'. */
    embedUrl: "/demos/painel.html",
    embedTitulo: "Painel de administração, versão de demonstração",
    embedUrlBarra: "estudionome.com.br/admin",
    embedIntro:
      "Aquele ali é um pedaço. Este é o painel inteiro, do jeito que você recebe: propostas, fotos, textos e datas especiais, cada um na sua aba.",
    embedNota: "Role dentro da janela. Nada do que você mexer aqui sai daqui.",
  },

  // --- 03 · o template --------------------------------------
  template: {
    numero: "03",
    kicker: "Nosso template",
    titulo: "A base é uma só. O que muda é tudo o que entra na sua página.",
    /** %a e %b viram os nomes dos dois clientes. */
    amarra:
      "Você acabou de ver: %a e %b saíram desta mesma base e não parecem a mesma coisa.",
    /** Usada se um dia a lista de clientes tiver menos de dois nomes. */
    amarraSozinha:
      "A base é a mesma; o que entra nela é que faz a diferença.",
    corpo1:
      "É a estrutura pronta e testada que todo mundo fecha hoje: início, sobre mim, ensaios, galeria, propostas e contato. As fotos, os textos, as cores e os pacotes passam a ser os seus.",
    corpo2:
      "Novos templates estão em desenho. Quando entrarem, aparecem aqui, e quem já tem a sua página continua com ela, funcionando do mesmo jeito.",
    navegar: "Navegar no template inteiro ↗",
    tablistLabel: "O que mostrar na janela",
    frameTitulo: "Template base, versão de demonstração",
    nota: "Role dentro da janela para conhecer a estrutura inteira.",

    /** A primeira da lista é a que abre. O src é local pela CSP. */
    abas: [
      {
        id: "site",
        rotulo: "O site",
        src: "/demos/site/index.html",
        url: "estudionome.com.br",
      },
      {
        id: "propostas",
        rotulo: "As propostas",
        src: "/demos/propostas.html",
        url: "estudionome.com.br/propostas",
      },
    ],
    pages: ["início", "sobre mim", "ensaios", "galeria", "propostas", "contato"],
    highlight: "propostas",
  },

  // --- 04 · como funciona -----------------------------------
  comoFunciona: {
    numero: "04",
    kicker: "Como funciona",
    titulo: "Do primeiro oi à página no ar.",
    sub: "O seu único trabalho é separar o material. O resto é comigo.",
    cardTituloInicio: "Você só fecha depois de ver a ",
    cardTituloEnfase: "sua página",
    cardTituloFim: " pronta.",
    cardCorpo:
      "A primeira versão sai antes de qualquer pagamento. Você abre o link, vê as suas fotos e as suas propostas na página, e só então decide. Se não gostar, a gente para por aqui sem custo.",
    ctaExemplos: "Ver os sites no ar",
    ctaExemplosNota:
      "Dois sites de clientes rodando de verdade, com as propostas que as clientes recebem.",

    passos: [
      {
        n: "01",
        title: "Você escolhe o formato",
        body: "Propostas, página ou completo. Me chama no WhatsApp e a gente decide junto o que faz sentido pro seu momento.",
        aside: "hoje mesmo",
        note: null as { title: string; body: string } | null,
      },
      {
        n: "02",
        title: "Você separa o material",
        body: "Quanto mais conteúdo, mais completa sai a primeira versão. Pode mandar do jeito que for mais fácil: Google Fotos, link, pasta ou PDF das propostas antigas.",
        aside: "no seu tempo",
        note: null as { title: string; body: string } | null,
      },
      {
        n: "03",
        title: "Eu monto a primeira versão da sua página",
        body: "Recebi o material, começo. Você recebe o link da sua página pronta para ver, dar palpite e pedir ajuste. Dependendo da demanda, sai em menos de 2 dias.",
        aside: "até 3 dias",
        note: null as { title: string; body: string } | null,
      },
      {
        n: "04",
        title: "Você vê a sua página pronta e decide",
        body: "Só aqui você fecha. Com a página existindo, com as suas fotos e as suas propostas dentro, não no escuro e não por promessa. Se não for o que você imaginou, a gente para por aqui sem custo nenhum.",
        aside: "sem compromisso",
        note: null as { title: string; body: string } | null,
      },
      {
        n: "05",
        title: "Você registra o seu domínio",
        body: "Fechado, aí sim entra o endereço: registrado por você, no seu nome, direto no registro.br ou na Hostinger, entre R$ 40 e R$ 65 por ano.",
        aside: "10 minutos",
        note: {
          title: "Por que eu peço o acesso",
          body: "Depois do registro você me passa só o acesso dessa plataforma de domínio, que serve exclusivamente para isso e não guarda nenhum dado pessoal seu. É lá dentro que ficam os dados técnicos para apontar o domínio para o site. Em poucos minutos o seu link está no ar.",
        } as { title: string; body: string } | null,
      },
      {
        n: "06",
        title: "Você assume o painel",
        body: "No ar, o controle passa a ser seu: troca fotos, muda valores, edita textos sem depender de mim. E a gente segue se falando sempre que precisar.",
        aside: "daí em diante",
        note: null as { title: string; body: string } | null,
      },
    ],
  },

  // --- 05 · os formatos -------------------------------------
  formatos: {
    numero: "05",
    kicker: "Os três formatos",
    titulo: "O primeiro passo é escolher o que você precisa.",
    sub: "Pagamento único nos três. Sem mensalidade, sem taxa escondida, sem plano para remover selo de ninguém.",
    selo: "mais escolhido",
    pagamentoUnico: "pagamento único",

    lista: [
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
        featured: false,
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
        featured: false,
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
    ],

    /** A faixa do domínio, embaixo dos três cartões. */
    dominio: {
      kicker: "O domínio é à parte",
      destaque: "R$ 40 a R$ 65 por ano, pagos por você, no seu nome.",
      corpo:
        "Você registra direto no registro.br ou na Hostinger, com o seu CPF. É o único custo que se repete, e ele nunca passa por mim: o endereço é seu de verdade.",
      /** Lista de opções de extensão. Vazia esconde o bloco. */
      opcoes: [] as { rotulo: string; preco: string; corpo: string }[],
    },
  },

  // --- 06 · o que vem junto ---------------------------------
  incluso: {
    numero: "06",
    kicker: "O que vem junto, sempre",
    itens: [
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
    ],
  },

  // --- o fecho ----------------------------------------------
  cta: {
    kicker: "A próxima página pode ser a sua",
    titulo: "Me conta o que você precisa: página, propostas ou os dois.",
    botao: "Chamar no WhatsApp",
    nota: "Sem formulário e sem compromisso. É só uma conversa.",
  },

  // --- a página de erro -------------------------------------
  erro404: {
    tituloAba: "Página não encontrada",
    descricao: "Esta página não existe ou mudou de endereço.",
    titulo: "Esta página não existe (ou mudou de endereço).",
    corpo:
      "Pode ser um link antigo ou um erro de digitação. A página principal continua no lugar de sempre.",
    voltar: "Voltar para o início",
    whatsapp: "Falar no WhatsApp",
  },
};

// ------------------------------------------------------------
//  PORTUGAL
// ------------------------------------------------------------
//  Travado em `typeof br`: o compilador exige as mesmas chaves.
//
//  Não é o texto brasileiro com o sotaque trocado. O tratamento é por
//  "tu" — em Portugal o "você" soa distante e até malcriado, que é o
//  contrário do tom desta página. O gerúndio brasileiro ("está
//  carregando") vira a construção portuguesa ("está a carregar"), e o
//  vocabulário acompanha: ensaio → sessão, celular → telemóvel, salvar
//  → guardar, aba → separador, contato → contacto, registrado →
//  registado, CPF → NIF.
//
//  Os depoimentos ficam exatamente como as pessoas escreveram, com o
//  "cara" e o "pra" no lugar. Reescrevê-los seria atribuir a elas
//  palavras que não disseram; `origemDepoimento` diz de onde vêm.
// ------------------------------------------------------------

const pt: typeof br = {
  htmlLang: "pt-PT",
  ogLocale: "pt_PT",
  rota: "/pt/",
  sigla: "PT",
  idioma: "Português de Portugal",
  moeda: "€",

  whatsapp: "554588121303",

  meta: {
    tagline: "páginas e propostas para fotógrafos",
    descricao:
      "Páginas e páginas de proposta para fotógrafos. Pagamento único, domínio em teu nome, painel próprio. Primeira versão em até 3 dias.",
    ogImageAlt: "Página de uma fotógrafa cliente, no ar",
    trocaIdioma: "Versão do site",
  },

  waPadrao: "Olá! Vi a página e queria saber mais sobre os formatos.",

  hero: {
    eyebrow: "O teu trabalho num link só",
    tituloInicio: "Página própria e propostas com ",
    tituloEnfase: "link em teu nome",
    tituloFim: ".",
    sub: "Nada de PDF pesado nem plataforma de terceiros com publicidade por cima do teu trabalho. Pagamento único, domínio em teu nome e uma página que só tem a tua cara.",
    ctaWhatsapp: "Falar no WhatsApp",
    ctaComoFunciona: "Ver como funciona",

    promessa: {
      tituloInicio: "Vês a página pronta",
      tituloEnfase: "antes",
      tituloFim: "de pagares.",
      colunaRuimRotulo: "por aí",
      colunaRuimTexto: "pagas e só depois vês no que deu",
      colunaBoaRotulo: "aqui",
      colunaBoaTexto: "vês no ar e só depois",
      colunaBoaEnfase: "decides se vale",
    },

    stats: [
      { value: "até 3 dias", label: "para a primeira página no ar" },
      { value: "pagamento único", label: "sem mensalidade, sem taxa escondida" },
      { value: "em teu nome", label: "domínio registado com o teu NIF" },
    ],
  },

  exemplos: {
    numero: "01",
    kicker: "Exemplos no ar",
    titulo: "Estes são os exemplos desta página.",
    sub: "Sites de clientes, a funcionar mesmo. O site e as propostas são os mesmos que as clientes deles recebem no WhatsApp.",
    tarjaSite: "o site",
    tarjaPropostas: "as propostas",
    verSite: "Ver o site",
    verPropostas: "Ver as propostas",
    altSite: "Site de",
    altPropostas: "Propostas de",
    /* Dito, e não escondido: quem lê em Portugal tem de saber que a
       fala é de uma cliente do Brasil. Omitir fazia a frase passar por
       local, que é o que ela não é. */
    origemDepoimento: "cliente no Brasil",

    clientes: {
      tatiane: {
        shortName: "da Tatiane",
        niche: "fotografia de família",
        stats: [
          { label: "Formato", value: "Completo" },
          { label: "Propostas", value: "12 ativas" },
          { label: "Datas especiais", value: "4 mini-sessões" },
        ],
        // Literal. Não se mexe.
        quote:
          "Estou adorando. Ficou super intuitivo, fácil para o cliente acessar as propostas e pra eu enviar pra eles também.",
      },
      topazio: {
        shortName: "da Topázio",
        niche: "casamento, família e sessões",
        stats: [
          { label: "Formato", value: "Completo" },
          { label: "Propostas", value: "7 ativas" },
          { label: "Galeria", value: "página própria" },
        ],
        // Literal. Não se mexe.
        quote:
          "Cara, sem palavras, perfeito. Amei de verdade. Com toda certeza vou indicar seu trabalho pra outros amigos.",
      },
    },
  },

  painel: {
    numero: "02",
    kicker: "O painel, agora",
    titulo: "Parece simples? Experimenta e confere.",
    sub: 'Toda a gente pensa o mesmo: "parece fácil, mas na hora vou encravar". Então, em vez de explicar, é melhor experimentares. Este é o painel, a sério. Muda o nome do pacote ou o valor e grava.',
    dica: "↓ muda o valor aqui em baixo e vê o site mudar ao lado",

    estudio: "O teu estúdio",
    admin: "admin",
    privado: "painel privado",
    pacotes: "Pacotes",
    pacotesSub: "Edita e guarda. O site atualiza na hora, sem dependeres de ninguém.",
    labelNome: "Nome do pacote",
    labelValor: "Valor (€)",
    enter: "Carrega em Enter ou clica em guardar.",
    salvar: "Guardar alterações",
    salvando: "a guardar…",
    publicadoBotao: "publicado no teu site",
    rodapePainel:
      "No painel a sério também trocas fotos, textos e as sessões da página inicial. Tudo assim, da mesma maneira.",

    urlPreview: "oteuestudio.pt/gravidez",
    ensaioKicker: "sessão de gravidez",
    ensaioTitulo: "A doce espera, à tua maneira.",
    rotuloPacote: "pacote",
    publicadoSite: "pronto, já está no ar para as tuas clientes",
    reservar: "Reservar pelo WhatsApp",
    avisoPublicado: "Publicado: %n, €%v.",
    pacoteVazio: "O teu pacote",

    exemploNome: "Doce Espera Premium",
    exemploValor: "290",

    embedUrl: "/demos/pt/painel.html",
    embedTitulo: "Painel de administração, versão de demonstração",
    embedUrlBarra: "estudionome.pt/admin",
    embedIntro:
      "Aquilo ali é um pedaço. Este é o painel inteiro, tal como o recebes: propostas, fotos, textos e datas especiais, cada um no seu separador.",
    embedNota: "Desliza dentro da janela. Nada do que mexeres aqui sai daqui.",
  },

  template: {
    numero: "03",
    kicker: "O nosso template",
    titulo: "A base é uma só. O que muda é tudo o que entra na tua página.",
    amarra:
      "Acabaste de ver: %a e %b saíram desta mesma base e não parecem a mesma coisa.",
    amarraSozinha: "A base é a mesma; o que entra nela é que faz a diferença.",
    corpo1:
      "É a estrutura pronta e testada que toda a gente fecha hoje: início, sobre mim, sessões, galeria, propostas e contacto. As fotos, os textos, as cores e os pacotes passam a ser os teus.",
    corpo2:
      "Novos templates estão em desenho. Quando entrarem, aparecem aqui, e quem já tiver a página dela continua com ela, a funcionar da mesma maneira.",
    navegar: "Navegar no template inteiro ↗",
    tablistLabel: "O que mostrar na janela",
    frameTitulo: "Template base, versão de demonstração",
    nota: "Desliza dentro da janela para conheceres a estrutura inteira.",

    abas: [
      {
        id: "site",
        rotulo: "O site",
        src: "/demos/pt/site/index.html",
        url: "estudionome.pt",
      },
      {
        id: "propostas",
        rotulo: "As propostas",
        src: "/demos/pt/propostas.html",
        url: "estudionome.pt/propostas",
      },
    ],
    pages: ["início", "sobre mim", "sessões", "galeria", "propostas", "contacto"],
    highlight: "propostas",
  },

  comoFunciona: {
    numero: "04",
    kicker: "Como funciona",
    titulo: "Do primeiro olá à página no ar.",
    sub: "O teu único trabalho é juntar o material. O resto é comigo.",
    cardTituloInicio: "Só fechas depois de veres a ",
    cardTituloEnfase: "tua página",
    cardTituloFim: " pronta.",
    cardCorpo:
      "A primeira versão sai antes de qualquer pagamento. Abres o link, vês as tuas fotos e as tuas propostas na página, e só então decides. Se não gostares, paramos por aqui sem custo.",
    ctaExemplos: "Ver os sites no ar",
    ctaExemplosNota:
      "Dois sites de clientes a funcionar mesmo, com as propostas que as clientes recebem.",

    passos: [
      {
        n: "01",
        title: "Escolhes o formato",
        body: "Propostas, página ou completo. Fala comigo no WhatsApp e decidimos juntos o que faz sentido para o teu momento.",
        aside: "hoje mesmo",
        note: null as { title: string; body: string } | null,
      },
      {
        n: "02",
        title: "Juntas o material",
        body: "Quanto mais conteúdo, mais completa sai a primeira versão. Podes enviar da forma que te for mais fácil: Google Fotos, link, pasta ou PDF das propostas antigas.",
        aside: "no teu tempo",
        note: null as { title: string; body: string } | null,
      },
      {
        n: "03",
        title: "Eu monto a primeira versão da tua página",
        body: "Recebido o material, começo. Recebes o link da tua página pronta para veres, dares palpite e pedires ajustes. Conforme a procura, sai em menos de 2 dias.",
        aside: "até 3 dias",
        note: null as { title: string; body: string } | null,
      },
      {
        n: "04",
        title: "Vês a tua página pronta e decides",
        body: "Só aqui é que fechas. Com a página a existir, com as tuas fotos e as tuas propostas lá dentro, não às escuras e não por promessa. Se não for o que imaginaste, paramos por aqui sem custo nenhum.",
        aside: "sem compromisso",
        note: null as { title: string; body: string } | null,
      },
      {
        n: "05",
        title: "Registas o teu domínio",
        body: "Fechado, aí sim entra o endereço: registado por ti, em teu nome, com o teu NIF, entre €12 e €25 por ano.",
        aside: "10 minutos",
        note: {
          title: "Porque te peço o acesso",
          body: "Depois do registo passas-me apenas o acesso a essa plataforma de domínios, que serve exclusivamente para isso e não guarda nenhum dado pessoal teu. É lá dentro que ficam os dados técnicos para apontar o domínio para o site. Em poucos minutos o teu link está no ar.",
        } as { title: string; body: string } | null,
      },
      {
        n: "06",
        title: "Assumes o painel",
        body: "No ar, o controlo passa a ser teu: trocas fotos, mudas valores, editas textos sem dependeres de mim. E continuamos a falar sempre que precisares.",
        aside: "daí em diante",
        note: null as { title: string; body: string } | null,
      },
    ],
  },

  formatos: {
    numero: "05",
    kicker: "Os três formatos",
    titulo: "O primeiro passo é escolheres o que precisas.",
    sub: "Pagamento único nos três. Sem mensalidade, sem taxa escondida, sem plano para tirar o selo de ninguém.",
    selo: "mais escolhido",
    pagamentoUnico: "pagamento único",

    lista: [
      {
        tag: "Formato 01",
        name: "Só propostas",
        price: "€150",
        blurb:
          "É o substituto direto do PDF. Uma página de propostas com cada pacote em link próprio, pronta para colares na conversa.",
        features: [
          "Página de propostas com todos os teus pacotes",
          "Cada proposta com link individual",
          "Bloco de datas especiais (Natal, Dia da Mãe, Páscoa)",
          "Painel para editares valores e textos",
        ],
        excludes: "Não inclui: início, sobre mim, galeria e páginas de sessões.",
        cta: "Quero só as propostas",
        waMessage:
          "Olá! Quero o formato só propostas (€150). Podes explicar-me como começa?",
        featured: false,
      },
      {
        tag: "Formato 02",
        name: "Só a página",
        price: "€190",
        blurb:
          "É a tua montra. Quem chega pelo Instagram encontra o teu trabalho inteiro num endereço só, em teu nome. Uma página com a tua cara, pronta a receber clientes.",
        features: [
          "Início, sobre mim e contacto",
          "Galeria e páginas de sessões",
          "Instagram ligado, a atualizar sozinho",
          "Painel para trocares fotos e textos",
        ],
        excludes: "Não inclui: a área de propostas com pacotes e valores.",
        cta: "Quero só a página",
        waMessage:
          "Olá! Quero o formato só a página (€190). Podes explicar-me como começa?",
        featured: false,
      },
      {
        tag: "Formato 03",
        name: "Completo",
        price: "€240",
        blurb:
          "Os dois juntos, no mesmo domínio e no mesmo painel. A cliente conhece-te e abre logo a proposta sem sair do site.",
        features: [
          "Tudo da página completa",
          "Tudo da área de propostas",
          "Um único endereço para divulgares",
          "€100 de poupança em relação aos dois em separado",
        ],
        excludes: "É o formato que a maioria fecha.",
        cta: "Quero o completo",
        waMessage:
          "Olá! Quero o formato completo, página mais propostas (€240). Podes explicar-me como começa?",
        featured: true,
      },
    ],

    /* O domínio fica sempre em nome da cliente, nunca no meu. O NIF
       entra como naturalidade, não como exigência: é o documento que
       ela já tem e usa para tudo, tal como o brasileiro usa o CPF. */
    dominio: {
      kicker: "O domínio é à parte",
      destaque: "€12 a €25 por ano, pagos por ti, em teu nome.",
      corpo:
        "Registas num registador português com o teu NIF, direto no dns.pt ou na Hostinger. O endereço é teu de verdade. É o único custo que se repete, e nunca passa por mim.",
      opcoes: [
        {
          rotulo: ".pt · recomendado",
          preco: "€15 a €19 no 1.º ano",
          corpo:
            "Dá identidade local, cara de negócio português. Registas em teu nome, com o teu NIF.",
        },
        {
          rotulo: ".com · alternativa",
          preco: "cerca de €12 por ano",
          corpo:
            "Mais simples e imediato: registas em qualquer lado, sem passar pela verificação de dados do .pt. Bom se quiseres estar no ar já.",
        },
      ] as { rotulo: string; preco: string; corpo: string }[],
    },
  },

  incluso: {
    numero: "06",
    kicker: "O que vem sempre incluído",
    itens: [
      {
        title: "Domínio em teu nome",
        body: "Registado com o teu NIF. Se um dia mudares de quem trata do site, ele vai contigo.",
      },
      {
        title: "Painel próprio",
        body: "Editas fotos, textos e valores da tua página sozinha, na hora, sem precisares de me chamar.",
      },
      {
        title: "Pagamento único",
        body: "Sem mensalidade e sem plano para tirar o selo da plataforma. Pagas uma vez, é teu.",
      },
      {
        title: "Abre depressa no telemóvel",
        body: "É de lá que a tua cliente abre o link. Carrega leve, sem download e sem espera.",
      },
    ],
  },

  cta: {
    kicker: "A próxima página pode ser a tua",
    titulo: "Diz-me o que precisas: página, propostas ou as duas coisas.",
    botao: "Falar no WhatsApp",
    nota: "Sem formulário e sem compromisso. É só uma conversa.",
  },

  erro404: {
    tituloAba: "Página não encontrada",
    descricao: "Esta página não existe ou mudou de endereço.",
    titulo: "Esta página não existe (ou mudou de endereço).",
    corpo:
      "Pode ser um link antigo ou um erro de escrita. A página principal continua no sítio do costume.",
    voltar: "Voltar ao início",
    whatsapp: "Falar no WhatsApp",
  },
};

export const translations: Record<Lang, typeof br> = { br, pt };

/** O formato de um dicionário. É o que as seções recebem por prop. */
export type Dict = typeof br;

/** As duas versões, na ordem em que aparecem no seletor. */
export const idiomas: Lang[] = ["br", "pt"];
