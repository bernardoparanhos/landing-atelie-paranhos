// troca das imagens da capa
const SEGUNDOS = 5;
const slides = [...document.querySelectorAll('.hero-slide')];
const pontos = [...document.querySelectorAll('.pontos i')];
let atual = 0;

// WCAG 2.2.2: conteúdo que se move sozinho precisa parar para quem pediu
// menos movimento no sistema. Fica no primeiro slide.
const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
let timer = null;
function girar() {
  slides[atual].classList.remove('on'); pontos[atual].classList.remove('on');
  atual = (atual + 1) % slides.length;
  slides[atual].classList.add('on'); pontos[atual].classList.add('on');
}
function ajustarCarrossel() {
  clearInterval(timer);
  timer = semMovimento.matches ? null : setInterval(girar, SEGUNDOS * 1000);
}
ajustarCarrossel();
semMovimento.addEventListener('change', ajustarCarrossel);

// lightbox
const lb = document.getElementById('lb');
const foto = document.getElementById('lb-foto');
const contador = document.getElementById('lb-contador');
let lista = [], i = 0;

let focoAnterior = null;
function abrir(srcs, inicio = 0) {
  focoAnterior = document.activeElement;
  lista = srcs; i = inicio;
  lb.classList.add('on');
  lb.setAttribute('aria-hidden', 'false');
  pintar();
  document.body.style.overflow = 'hidden';
  lb.querySelector('.fechar')?.focus();
}
function fechar() {
  lb.classList.remove('on');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // devolve o foco a quem abriu, senão o teclado volta para o topo da página
  focoAnterior?.focus?.();
}
function passo(d) { i = (i + d + lista.length) % lista.length; pintar(); }
function pintar() { foto.src = lista[i]; contador.textContent = (i + 1) + ' / ' + lista.length; }

const galeria = document.querySelector('.galeria');
function abrirDaGaleria(alvo) {
  const todas = [...galeria.querySelectorAll('img')].map(n => n.getAttribute('src'));
  abrir(todas, todas.indexOf(alvo.getAttribute('src')));
}
galeria.addEventListener('click', e => {
  const alvo = e.target.closest('img');
  if (alvo) abrirDaGaleria(alvo);
});
// Enter/Espaço abrem igual ao clique (as fotos têm role=button e tabindex=0)
galeria.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const alvo = e.target.closest('img');
  if (!alvo) return;
  e.preventDefault();
  abrirDaGaleria(alvo);
});

document.querySelectorAll('.card').forEach(card => {
  const abrirCard = () => abrir(JSON.parse(card.dataset.fotos), 0);
  card.addEventListener('click', abrirCard);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirCard(); }
  });
});

lb.addEventListener('click', e => {
  const acao = e.target.dataset.acao;
  if (acao === 'fechar') return fechar();
  if (acao === 'anterior') return passo(-1);
  if (acao === 'proxima') return passo(1);
  if (e.target === lb) fechar();
});

addEventListener('keydown', e => {
  if (!lb.classList.contains('on')) return;
  if (e.key === 'Escape') fechar();
  if (e.key === 'ArrowRight') passo(1);
  if (e.key === 'ArrowLeft') passo(-1);
});
