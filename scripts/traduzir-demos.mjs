// Gera public/demos/pt/ a partir de public/demos/.
//
// As três demonstrações embutidas nas janelas das seções 02 e 03 têm
// texto visível: nomes de proposta, rótulos do painel, o tour guiado. Um
// visitante português que abre a janela e lê "Gestante", "Dia das Mães" e
// "Salvar" vê, dentro da prova, que a página não é dele.
//
// Por que um script e não editar à mão: as demos brasileiras continuam
// sendo as originais e vão mudar. Com o mapa aqui, regenerar a versão
// portuguesa é um comando; à mão seria duas cópias divergindo em silêncio.
//
// O resultado É versionado (public/demos/pt/ entra no git). O script
// existe para refazer, não para o build depender dele.
//
// Rodar:  node scripts/traduzir-demos.mjs
//
// Duas travas, porque traduzir pela metade é pior do que não traduzir:
//   1. toda entrada do mapa tem de casar em algum arquivo — se uma deixar
//      de casar, a demo brasileira mudou e o mapa envelheceu;
//   2. a saída passa por uma lista de marcas brasileiras — se sobrar uma,
//      o script falha e diz qual, em que arquivo e em que linha.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";

const ORIGEM = "public/demos";
const DESTINO = "public/demos/pt";

// Arquivos com texto. O resto (SVG, CSS, main.js do site) é copiado cru.
const COM_TEXTO = new Set([
  "propostas.html",
  "painel.html",
  "painel.js",
  "site/index.html",
]);

// ------------------------------------------------------------
//  O MAPA
// ------------------------------------------------------------
//  Aplicado da frase mais longa para a mais curta, senão "15 Anos"
//  comeria "Cobertura 15 Anos" antes de ele ser traduzido.
//
//  Não é o texto brasileiro com o sotaque trocado: ensaio → sessão,
//  salvar → guardar, aba → separador, contato → contacto, gerúndio →
//  "a + infinitivo". "Cobertura 15 Anos" vira "Cobertura 18 Anos"
//  porque a festa de 15 anos é brasileira; em Portugal a data é a
//  dos 18.
// ------------------------------------------------------------

const MAPA = {
  // --- idioma do documento ---
  'lang="pt-BR"': 'lang="pt-PT"',

  // --- frases inteiras: o site ---
  "Trabalho com luz natural, tempo e silêncio. Meu papel é desaparecer o suficiente para que o dia aconteça — e estar no lugar certo quando ele acontece.":
    "Trabalho com luz natural, tempo e silêncio. O meu papel é desaparecer o suficiente para que o dia aconteça — e estar no sítio certo quando ele acontece.",
  "Atendo casamentos, ensaios de casal e família em todo o país. Cada entrega é pensada para durar décadas, não semanas.":
    "Faço casamentos, sessões de casal e família em todo o país. Cada entrega é pensada para durar décadas, não semanas.",
  "Fotografia de casamentos, casal e família.": "Fotografia de casamentos, casal e família.",
  "Prazer, eu fotografo histórias": "Prazer, eu fotografo histórias",
  "Deixe-me contar a sua história": "Deixa-me contar a tua história",
  "Conheça meu trabalho": "Conhece o meu trabalho",
  "acompanhe meu trabalho": "acompanha o meu trabalho",
  "clique para abrir a galeria": "clica para abrir a galeria",
  "Retrato do fotógrafo": "Retrato do fotógrafo",
  "Template de apresentação": "Template de apresentação",
  "Galeria de fotos": "Galeria de fotos",
  "Fale comigo": "Fala comigo",
  "@seu.instagram": "@oteu.instagram",

  // --- frases inteiras: o painel ---
  "Aqui você edita tudo do seu site sozinha. Nada é técnico: é só trocar textos e fotos e salvar.":
    "Aqui editas tudo do teu site sozinha. Nada é técnico: é só trocar textos e fotos e guardar.",
  "Abre o site público em uma nova aba. Use para conferir como ficou depois de salvar.":
    "Abre o site público num separador novo. Usa para veres como ficou depois de guardares.",
  "O nome que aparece no topo, no rodapé e no título das páginas.":
    "O nome que aparece no topo, no rodapé e no título das páginas.",
  "As fotos grandes que se alternam na primeira dobra. Clique numa foto para trocar.":
    "As fotos grandes que se alternam na primeira dobra. Clica numa foto para a trocares.",
  "Seu retrato e o texto de apresentação, do seu jeito.":
    "O teu retrato e o texto de apresentação, à tua maneira.",
  "Escolha quantos ensaios aparecem na home e quais são eles.":
    "Escolhe quantas sessões aparecem na home e quais são.",
  "Suas fotos favoritas. Cada uma mostra onde está sendo usada.":
    "As tuas fotos preferidas. Cada uma mostra onde está a ser usada.",
  "A faixa que convida a cliente a agendar, perto do rodapé.":
    "A faixa que convida a cliente a marcar, perto do rodapé.",
  "A última linha do site e seus links de Instagram e WhatsApp.":
    "A última linha do site e os teus links de Instagram e WhatsApp.",
  "Aqui do lado ficam as propostas por tipo de ensaio, cada uma com link próprio. Clique para ver.":
    "Aqui ao lado ficam as propostas por tipo de sessão, cada uma com link próprio. Clica para veres.",
  "Cada proposta tem um link próprio para compartilhar pelo WhatsApp. Esse link nunca muda, mesmo que você altere o conteúdo.":
    "Cada proposta tem um link próprio para partilhares pelo WhatsApp. Esse link nunca muda, mesmo que alteres o conteúdo.",
  "Quantas estão visíveis no índice, quantas têm pacotes preenchidos e quantas já têm fotos.":
    "Quantas estão visíveis no índice, quantas têm pacotes preenchidos e quantas já têm fotos.",
  "Clique em Editar para trocar a capa, as fotos, os textos e os pacotes daquela proposta.":
    "Clica em Editar para trocares a capa, as fotos, os textos e os pacotes dessa proposta.",
  "Copia o link daquela proposta, pronto para colar direto na conversa do WhatsApp.":
    "Copia o link dessa proposta, pronto a colar direto na conversa do WhatsApp.",
  "Esconde a proposta da lista pública, mas mantém o link funcionando para quem já recebeu.":
    "Esconde a proposta da lista pública, mas mantém o link a funcionar para quem já o recebeu.",
  "Aparece no cabeçalho, no rodapé e no título das páginas. Use letras maiúsculas se quiser o estilo clássico.":
    "Aparece no cabeçalho, no rodapé e no título das páginas. Usa letras maiúsculas se quiseres o estilo clássico.",
  "Os blocos que se alternam no topo do site a cada 5 segundos, cada um com duas imagens. Clique em qualquer uma para enviar outra foto.":
    "Os blocos que se alternam no topo do site a cada 5 segundos, cada um com duas imagens. Clica em qualquer uma para enviares outra foto.",
  "O retrato, o título e o texto de apresentação.": "O retrato, o título e o texto de apresentação.",
  "Fotografo gestante, recém-nascido, família e primeiro aniversário. Trabalho com luz natural, sem pressa, deixando cada família à vontade.":
    "Fotografo gravidez, recém-nascido, família e primeiro aniversário. Trabalho com luz natural, sem pressa, a deixar cada família à vontade.",
  "Os ensaios da home. Você escolhe quantos aparecem e quais são eles.":
    "As sessões da home. Escolhes quantas aparecem e quais são.",
  "Digite um número maior para caber mais ensaios, ou menor para mostrar menos. De 1 a 12.":
    "Escreve um número maior para caberem mais sessões, ou menor para mostrar menos. De 1 a 12.",
  "As fotos da home. Toda foto fica marcada com uma faixa mostrando onde está em uso.":
    "As fotos da home. Cada foto fica marcada com uma faixa a mostrar onde está a ser usada.",
  "A faixa larga perto do rodapé. Troque o fundo e edite os textos que aparecem sobre a imagem.":
    "A faixa larga perto do rodapé. Troca o fundo e edita os textos que aparecem sobre a imagem.",
  "A linha final do site, mais os links de Instagram e WhatsApp.":
    "A linha final do site, mais os links de Instagram e WhatsApp.",
  "As suas propostas, cada uma com um link próprio para mandar no WhatsApp. Clique em uma para editar os textos, a capa, as fotos e os pacotes. O link de uma proposta nunca muda, então pode enviar sem medo.":
    "As tuas propostas, cada uma com um link próprio para enviares no WhatsApp. Clica numa para editares os textos, a capa, as fotos e os pacotes. O link de uma proposta nunca muda, por isso podes enviar sem receio.",
  "Tirar do índice esconde a proposta da página /propostas, mas o link continua abrindo. É de propósito: se você já mandou o link para alguém, essa pessoa não bate numa página de erro.":
    "Tirar do índice esconde a proposta da página /propostas, mas o link continua a abrir. É de propósito: se já enviaste o link a alguém, essa pessoa não vai dar a uma página de erro.",
  "As fases passam rápido. As fotos ficam.": "As fases passam depressa. As fotos ficam.",
  "Delicado, real, para sempre.": "Delicado, real, para sempre.",
  "Bem-vinda ao seu painel": "Bem-vinda ao teu painel",
  "Situação das propostas": "Situação das propostas",
  "Ver o site ao vivo": "Ver o site em direto",
  "Agendar meu ensaio": "Marcar a minha sessão",
  "Rodapé e contatos": "Rodapé e contactos",
  "Suas propostas": "As tuas propostas",
  "Sobre você": "Sobre ti",

  // --- títulos e rótulos curtos ---
  "Gestante · Newborn · Família · Smash": "Gravidez · Newborn · Família · Smash",
  "Ensaio Comemorativo · Smash": "Sessão Comemorativa · Smash",
  "Especial Dia das Crianças": "Especial Dia da Criança",
  "Cobertura de Batizado": "Cobertura de Batizado",
  "4 mini sessões de época": "4 mini-sessões de época",
  "Especial Dia das Mães": "Especial Dia da Mãe",
  "Cobertura Batizado": "Cobertura Batizado",
  "Cobertura 15 Anos": "Cobertura 18 Anos",
  "Especial de Páscoa": "Especial de Páscoa",
  "Especial de Natal": "Especial de Natal",
  "Tempo de Brincar": "Tempo de Brincar",
  "Ensaio Feminino": "Sessão Feminina",
  "Sessão Newborn": "Sessão Newborn",
  "Recém-nascido": "Recém-nascido",
  "Datas especiais": "Datas especiais",
  "Smash the Cake": "Smash the Cake",
  "Salvar rodapé": "Guardar rodapé",
  "Salvar textos": "Guardar textos",
  "Acompanhamento": "Acompanhamento",
  "Nossos Laços": "Os Nossos Laços",
  "Tirar do índice": "Tirar do índice",
  "+ Novo ensaio": "+ Nova sessão",
  "Abrir tour guiado": "Abrir tour guiado",
  "Primeiro Ano": "Primeiro Ano",
  "Ver proposta": "Ver proposta",
  "Salvar nome": "Guardar nome",
  "Profissional": "Profissional",
  "Chamada final": "Chamada final",
  "Nome do estúdio": "Nome do estúdio",
  "Colo de Mãe": "Colo de Mãe",
  "Doce Páscoa": "Doce Páscoa",
  "Nascimento": "Nascimento",
  "Copiar link": "Copiar link",
  "Pular tour": "Saltar tour",
  "Fechar tour": "Fechar tour",
  "Tour guiado": "Tour guiado",
  "15-anos": "18-anos",
  "Gestante": "Gravidez",
  "gestante": "gravidez",
  "Feminino": "Feminino",
  "Família": "Família",
  "Ensaios": "Sessões",
  "ensaios": "sessões",
  "Galeria": "Galeria",
  "Contato": "Contacto",
  "contato": "contacto",
  "Concluir": "Concluir",
  "Próximo": "Próximo",
  "Anterior": "Anterior",

  // --- identidade do estúdio de demonstração ---
  "instagram.com/seuestudio/": "instagram.com/oteuestudio/",
  "voce@seuestudio.com.br": "tu@oteuestudio.pt",
  "© SEU ESTÚDIO · 2026": "© O TEU ESTÚDIO · 2026",
  "Painel · Seu Estúdio": "Painel · O Teu Estúdio",
  "Propostas · Seu Estúdio": "Propostas · O Teu Estúdio",
  "© Seu Estúdio · Fotografia · Todos os direitos reservados":
    "© O Teu Estúdio · Fotografia · Todos os direitos reservados",
  "SEU ESTÚDIO": "O TEU ESTÚDIO",
  "Seu Estúdio": "O Teu Estúdio",
};

// ------------------------------------------------------------
//  A LISTA DE MARCAS BRASILEIRAS
// ------------------------------------------------------------
//  O que não pode sobrar na saída. Cada uma delas já apareceu nas
//  demos; se reaparecer, é porque alguém editou a versão brasileira e
//  esqueceu de regenerar esta.

const PROIBIDO = [
  "R$", "CPF", "registro.br", ".com.br", "pt-BR",
  "você", "Você", "Dia das Mães", "Dia das Crianças", "celular",
  "Pular", "Salvar", "salvar.", "Gestante", "gestante",
  "Ensaio", "ensaio", "Contato", "contato", "Clique", "clique em",
  "Digite", "15 Anos", "15-anos", "seuestudio", "Seu Estúdio",
  "SEU ESTÚDIO", "seu.instagram",
];

// ------------------------------------------------------------

function listar(dir, prefixo = "") {
  const saida = [];
  for (const nome of readdirSync(dir)) {
    if (prefixo === "" && nome === "pt") continue; // não copiar a si mesma
    const caminho = join(dir, nome);
    const rel = prefixo ? `${prefixo}/${nome}` : nome;
    if (statSync(caminho).isDirectory()) saida.push(...listar(caminho, rel));
    else saida.push(rel);
  }
  return saida;
}

const chaves = Object.keys(MAPA).sort((a, b) => b.length - a.length);
const usadas = new Set();

function traduzir(texto) {
  let fora = texto;
  for (const de of chaves) {
    if (!fora.includes(de)) continue;
    usadas.add(de);
    fora = fora.split(de).join(MAPA[de]);
  }
  return fora;
}

rmSync(DESTINO, { recursive: true, force: true });

const arquivos = listar(ORIGEM);
for (const rel of arquivos) {
  const destino = join(DESTINO, rel);
  mkdirSync(dirname(destino), { recursive: true });
  if (COM_TEXTO.has(rel)) {
    writeFileSync(destino, traduzir(readFileSync(join(ORIGEM, rel), "utf8")), "utf8");
  } else {
    copyFileSync(join(ORIGEM, rel), destino);
  }
}

// Trava 1: nenhuma entrada do mapa pode ter ficado sem casar.
const orfas = chaves.filter((k) => !usadas.has(k));

// Trava 2: nenhuma marca brasileira pode ter sobrado na saída.
const sobras = [];
for (const rel of arquivos) {
  if (!COM_TEXTO.has(rel)) continue;
  const linhas = readFileSync(join(DESTINO, rel), "utf8").split("\n");
  linhas.forEach((linha, i) => {
    for (const marca of PROIBIDO) {
      if (linha.includes(marca)) sobras.push(`  pt/${rel}:${i + 1}  "${marca}"  → ${linha.trim().slice(0, 90)}`);
    }
  });
}

console.log(`${arquivos.length} arquivos para ${DESTINO}/ (${COM_TEXTO.size} traduzidos)`);

if (orfas.length) {
  console.error(`\nFALHA: ${orfas.length} entrada(s) do mapa não casaram com nada.`);
  console.error("A demo brasileira mudou e este mapa envelheceu:\n");
  for (const k of orfas) console.error(`  "${k}"`);
}
if (sobras.length) {
  console.error(`\nFALHA: ${sobras.length} marca(s) brasileira(s) sobraram na saída:\n`);
  for (const s of sobras) console.error(s);
}
if (orfas.length || sobras.length) process.exit(1);

console.log("Sem entradas órfãs e sem marcas brasileiras na saída.");
