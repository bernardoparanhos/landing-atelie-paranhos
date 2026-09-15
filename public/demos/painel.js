// Painel de demonstração (seção 05 da landing).
// Roda como módulo: nada vira global e não há handler inline no HTML, então
// este demo funciona sob Content-Security-Policy com script-src 'self'.
// A lista é montada com a API de DOM (createElement/textContent) em vez de
// innerHTML com concatenação de string: mesmo que um dia estes dados venham
// de fora, não há como injetar marcação.

const props = [
  { n: 'Primeiro Ano', slug: 'primeiro-ano', pac: 3, fotos: 62, img: 'assets/ph-p-01.svg' },
  { n: 'Família', slug: 'familia', pac: 3, fotos: 31, img: 'assets/ph-l-01.svg' },
  { n: 'Gestante', slug: 'gestante', pac: 3, fotos: 79, img: 'assets/ph-p-04.svg' },
  { n: 'Recém-nascido', slug: 'recem-nascido', pac: 4, fotos: 60, img: 'assets/ph-p-02.svg' },
  { n: 'Sessão Newborn', slug: 'newborn', pac: 4, fotos: 60, img: 'assets/ph-p-05.svg' },
  { n: 'Nascimento', slug: 'nascimento', pac: 3, fotos: 60, img: 'assets/ph-p-06.svg' },
  { n: 'Smash the Cake', slug: 'smash', pac: 3, fotos: 0, img: null },
  { n: 'Cobertura Batizado', slug: 'batizado', pac: 3, fotos: 0, img: null },
  { n: 'Cobertura 15 Anos', slug: '15-anos', pac: 3, fotos: 0, img: null },
  { n: 'Acompanhamento', slug: 'acompanhamento', pac: 3, fotos: 0, img: null },
  { n: 'Ensaio Feminino', slug: 'feminino', pac: 3, fotos: 0, img: null },
  { n: 'Profissional', slug: 'profissional', pac: 3, fotos: 0, img: null },
];

const pad = (i) => (i < 9 ? '0' : '') + (i + 1);

/** cria um elemento já com classe, texto e atributos */
function el(tag, { cls, txt, attrs } = {}, filhos = []) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (txt != null) n.textContent = txt;
  if (attrs) for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  for (const f of filhos) if (f) n.appendChild(f);
  return n;
}

function montarLinha(p, i) {
  const thumb = p.img
    ? el('img', { attrs: { src: p.img, alt: '', loading: 'lazy' } })
    : el('span', { txt: pad(i) });

  const meta = el('span', { cls: 'meta' }, [
    document.createTextNode('/propostas/'),
    el('b', { txt: p.slug }),
    document.createTextNode(' · ' + p.pac + ' pacotes · ' + p.fotos + ' fotos'),
  ]);

  const linha = el('div', { cls: 'linha' }, [
    el('div', { cls: 'thumb' }, [thumb]),
    el('div', { cls: 'info' }, [
      el('h3', { txt: p.n }),
      meta,
      el('div', { cls: 'row' }, [
        el('span', { cls: 'chip', txt: 'no índice' }),
        el('a', { cls: 'editar', txt: 'Editar →', attrs: { href: '#' } }),
      ]),
    ]),
    el('div', { cls: 'lado' }, [
      el('span', { cls: 'arrows' }, [el('span', { txt: '↑' }), el('span', { txt: '↓' })]),
      el('a', { cls: 'lk', txt: 'Copiar link', attrs: { href: '#' } }),
      el('a', { cls: 'tirar', txt: 'Tirar do índice', attrs: { href: '#' } }),
    ]),
  ]);

  if (i === 0) linha.dataset.tour = 'p-card';
  if (i === 1) linha.dataset.tour = 'p-lado';
  return linha;
}

const lista = document.getElementById('lista');
lista.replaceChildren(...props.map(montarLinha));

// ---- alternância entre as duas visões do painel ----
let view = 'site';
function setView(v) {
  view = v;
  document.getElementById('view-site').classList.toggle('hide', v !== 'site');
  document.getElementById('view-prop').classList.toggle('hide', v !== 'prop');
  const tSite = document.getElementById('tab-site');
  const tProp = document.getElementById('tab-prop');
  tSite.classList.toggle('on', v === 'site');
  tProp.classList.toggle('on', v === 'prop');
  tSite.setAttribute('aria-selected', String(v === 'site'));
  tProp.setAttribute('aria-selected', String(v === 'prop'));
  window.scrollTo(0, 0);
  endTour();
}

// ---- tour guiado ----
const toursDef = {
  site: [
    { sel: '[data-tour=marca]', t: 'Bem-vinda ao seu painel', x: 'Aqui você edita tudo do seu site sozinha. Nada é técnico: é só trocar textos e fotos e salvar.' },
    { sel: '[data-tour=versite]', t: 'Ver o site ao vivo', x: 'Abre o site público em uma nova aba. Use para conferir como ficou depois de salvar.' },
    { sel: '[data-tour=nome]', t: 'Nome do estúdio', x: 'O nome que aparece no topo, no rodapé e no título das páginas.' },
    { sel: '[data-tour=hero]', t: 'O topo do site', x: 'As fotos grandes que se alternam na primeira dobra. Clique numa foto para trocar.' },
    { sel: '[data-tour=sobre]', t: 'Sobre você', x: 'Seu retrato e o texto de apresentação, do seu jeito.' },
    { sel: '[data-tour=ensaios]', t: 'Ensaios', x: 'Escolha quantos ensaios aparecem na home e quais são eles.' },
    { sel: '[data-tour=galeria]', t: 'Galeria', x: 'Suas fotos favoritas. Cada uma mostra onde está sendo usada.' },
    { sel: '[data-tour=cta]', t: 'Chamada final', x: 'A faixa que convida a cliente a agendar, perto do rodapé.' },
    { sel: '[data-tour=rodape]', t: 'Rodapé e contatos', x: 'A última linha do site e seus links de Instagram e WhatsApp.' },
    { sel: '#tab-prop', t: 'Suas propostas', x: 'Aqui do lado ficam as propostas por tipo de ensaio, cada uma com link próprio. Clique para ver.' },
  ],
  prop: [
    { sel: '[data-tour=p-intro]', t: 'Suas propostas', x: 'Cada proposta tem um link próprio para compartilhar pelo WhatsApp. Esse link nunca muda, mesmo que você altere o conteúdo.' },
    { sel: '[data-tour=p-status]', t: 'Situação das propostas', x: 'Quantas estão visíveis no índice, quantas têm pacotes preenchidos e quantas já têm fotos.' },
    { sel: '[data-tour=p-card]', t: 'Editar uma proposta', x: 'Clique em Editar para trocar a capa, as fotos, os textos e os pacotes daquela proposta.' },
    { sel: '[data-tour=p-lado]', t: 'Copiar o link', x: 'Copia o link daquela proposta, pronto para colar direto na conversa do WhatsApp.' },
    { sel: '[data-tour=p-lado]', t: 'Tirar do índice', x: 'Esconde a proposta da lista pública, mas mantém o link funcionando para quem já recebeu.' },
  ],
};

let tour = null;
let ti = 0;

function startTour() { tour = toursDef[view]; ti = 0; renderTip(); }

function tourStep(d) {
  if (!tour) return;
  ti += d;
  if (ti < 0) ti = 0;
  if (ti >= tour.length) { endTour(); return; }
  renderTip();
}

function endTour() {
  tour = null;
  document.getElementById('spot').classList.add('hide');
  document.getElementById('tip').classList.add('hide');
}

function renderTip() {
  const step = tour[ti];
  const alvo = document.querySelector(step.sel);
  if (!alvo) { tourStep(1); return; }
  const r = alvo.getBoundingClientRect();
  const need = r.top - 140;
  if (r.top < 90 || r.bottom > window.innerHeight - 200) {
    window.scrollTo({ top: Math.max(0, window.scrollY + need), behavior: 'smooth' });
    setTimeout(placeTip, 340);
  } else {
    placeTip();
  }
  function placeTip() {
    const rr = alvo.getBoundingClientRect();
    const spot = document.getElementById('spot');
    spot.classList.remove('hide');
    spot.style.top = rr.top - 8 + 'px';
    spot.style.left = rr.left - 8 + 'px';
    spot.style.width = rr.width + 16 + 'px';
    spot.style.height = rr.height + 16 + 'px';
    const tip = document.getElementById('tip');
    tip.classList.remove('hide');
    document.getElementById('tip-g').textContent = 'Guia · ' + (ti + 1) + ' / ' + tour.length;
    document.getElementById('tip-title').textContent = step.t;
    document.getElementById('tip-text').textContent = step.x;
    document.getElementById('tip-ant').style.visibility = ti === 0 ? 'hidden' : 'visible';
    document.getElementById('tip-prox').textContent = ti === tour.length - 1 ? 'Concluir' : 'Próximo';
    const th = tip.offsetHeight;
    const tw = tip.offsetWidth;
    const below = rr.bottom + 14;
    const top = below + th < window.innerHeight - 10 ? below : Math.max(10, rr.top - th - 14);
    const left = Math.min(Math.max(10, rr.left), window.innerWidth - tw - 10);
    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
  }
}

// ---- delegação: substitui os onclick= que existiam no HTML ----
const acoes = {
  ver: (arg) => setView(arg),
  'tour-inicia': () => startTour(),
  'tour-fecha': () => endTour(),
  'tour-passo': (arg) => tourStep(Number(arg)),
};

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-acao]');
  if (!btn) return;
  const fn = acoes[btn.dataset.acao];
  if (fn) fn(btn.dataset.arg);
});

// Esc fecha o tour
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && tour) endTour(); });
window.addEventListener('resize', () => { if (tour) renderTip(); });
