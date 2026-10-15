/* ==========================================================
   ArchCorp · VarejoTech Omnichannel — TO-BE (Etapa 3)
   Protótipo visual interativo — dados 100% simulados (mock)
   ========================================================== */
'use strict';

/* ---------------------------------------------------------- *
 * Utilitários
 * ---------------------------------------------------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const icons = () => { if (window.lucide) window.lucide.createIcons(); };
let speed = 1;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms / speed));
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pad = (n, l = 2) => String(n).padStart(l, '0');
const clock = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
};
const today = () => {
  const d = new Date();
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};
const maskCpf = (cpf) => cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/, '***.$2.$3-**');
const fmtCpf = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
};

function toast(msg, type = 'info', icon = 'info') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4 shrink-0"></i><span>${msg}</span>`;
  $('#toasts').appendChild(el);
  icons();
  setTimeout(() => { el.style.transition = 'opacity .4s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 400); }, 3800);
}

/* ---------------------------------------------------------- *
 * Dados mockados
 * ---------------------------------------------------------- */
const initialProducts = () => ([
  { sku: 'SKU-1001', nome: 'Smartphone Orion X5 128GB', fisico: 12, digital: 20, preco: 1899 },
  { sku: 'SKU-1002', nome: 'Notebook Aero 14" i5 16GB', fisico: 6, digital: 9, preco: 3499 },
  { sku: 'SKU-1003', nome: 'Fone Bluetooth Pulse ANC', fisico: 25, digital: 40, preco: 349 },
  { sku: 'SKU-1004', nome: 'Smart TV 50" 4K VT', fisico: 4, digital: 7, preco: 2799 },
  { sku: 'SKU-1005', nome: 'Smartwatch Fit Pro', fisico: 10, digital: 14, preco: 899 },
  { sku: 'SKU-1006', nome: 'Console GameBox Series S', fisico: 2, digital: 3, preco: 2399 },
]);

const initialCustomers = () => ([
  {
    id: 'VT-0001', nome: 'Mariana Souza Albuquerque', cpf: '123.456.789-09', email: 'mariana.souza@email.com',
    tel: '(11) 98123-4567', cidade: 'São Paulo / SP', segmento: 'Ouro', desde: '03/2021', pref: 'Omnichannel',
    orders: [
      { id: 'PED-88231', data: '02/10/2026', canal: 'ecom', itens: '1× Fone Bluetooth Pulse ANC', valor: 349, status: 'Entregue' },
      { id: 'PED-88102', data: '18/09/2026', canal: 'loja', itens: '1× Smartwatch Fit Pro', valor: 899, status: 'Faturado (D-0)' },
      { id: 'PED-87540', data: '27/08/2026', canal: 'ecom', itens: '1× Notebook Aero 14" i5 16GB', valor: 3499, status: 'Entregue' },
      { id: 'PED-86977', data: '11/07/2026', canal: 'loja', itens: '2× Cabo USB-C 2m', valor: 78, status: 'Faturado (D-0)' },
    ],
  },
  {
    id: 'VT-0002', nome: 'Carlos Eduardo Lima', cpf: '987.654.321-00', email: 'cadu.lima@email.com',
    tel: '(21) 99876-5432', cidade: 'Rio de Janeiro / RJ', segmento: 'Prata', desde: '11/2022', pref: 'Loja Física',
    orders: [
      { id: 'PED-88190', data: '29/09/2026', canal: 'loja', itens: '1× Smart TV 50" 4K VT', valor: 2799, status: 'Faturado (D-0)' },
      { id: 'PED-87811', data: '04/09/2026', canal: 'loja', itens: '1× Console GameBox Series S', valor: 2399, status: 'Entregue' },
      { id: 'PED-86120', data: '22/06/2026', canal: 'ecom', itens: '1× Fone Bluetooth Pulse ANC', valor: 349, status: 'Entregue' },
    ],
  },
  {
    id: 'VT-0003', nome: 'Fernanda Oliveira Castro', cpf: '456.789.123-55', email: 'fe.castro@email.com',
    tel: '(31) 97788-1122', cidade: 'Belo Horizonte / MG', segmento: 'Bronze', desde: '06/2024', pref: 'E-commerce',
    orders: [
      { id: 'PED-88260', data: '08/10/2026', canal: 'ecom', itens: '1× Smartphone Orion X5 128GB', valor: 1899, status: 'Processando' },
      { id: 'PED-87002', data: '15/07/2026', canal: 'ecom', itens: '1× Smartwatch Fit Pro', valor: 899, status: 'Entregue' },
      { id: 'PED-85544', data: '30/05/2026', canal: 'loja', itens: '1× Capa Protetora Orion X5', valor: 89, status: 'Faturado (D-0)' },
    ],
  },
]);

let products = initialProducts();
let customers = initialCustomers();

/* ---------------------------------------------------------- *
 * Definição das camadas, componentes, requisitos
 * ---------------------------------------------------------- */
const LAYERS = [
  { id: 'L1', nome: 'Canais & Apresentação', desc: 'Pontos de contato com o cliente e o atendente: e-commerce, PDV e Portal do SAC.' },
  { id: 'L2', nome: 'Acesso & Segurança', desc: 'Ponto único de entrada: autenticação OAuth2, mTLS, rate limiting e túnel VPN entre Cloud e On-Premise.' },
  { id: 'L3', nome: 'Integração & Eventos', desc: 'Backbone orientado a eventos (Pub/Sub) que desacopla canais, serviços e sistemas legados.' },
  { id: 'L4', nome: 'Serviços de Negócio & Dados', desc: 'Microsserviços de domínio (Clientes 360°, Hub de Estoque) com seus repositórios PostgreSQL e Redis.' },
  { id: 'L5', nome: 'Legado & Backoffice', desc: 'Sistemas de retaguarda mantidos: WMS do CD, ERP da Sede e o adaptador (wrapper) que os protege.' },
];

const NODES = [
  { id: 'ecom', nome: 'E-commerce SaaS', zona: 'cloud', layer: 'L1', icon: 'shopping-cart', tech: 'SaaS Nuvem · Storefront + API', reqs: ['RF-01', 'RF-02', 'RNF-03'], links: ['gw'], desc: 'Loja virtual hospedada em SaaS. Envia pedidos via REST/HTTPS ao API Gateway e consulta disponibilidade ao Hub de Estoque.' },
  { id: 'sac', nome: 'Portal Único do SAC', zona: 'cloud', layer: 'L1', icon: 'headset', tech: 'SPA Web · BFF Node.js', reqs: ['RF-01', 'RF-04'], links: ['gw', 'cli360'], desc: 'Interface única do atendimento com histórico consolidado de pedidos de todos os canais, via Cliente 360°.' },
  { id: 'pdv', nome: 'PDV Loja Física', zona: 'onprem', layer: 'L1', icon: 'store', tech: 'PDV + SQLite local (Offline-First)', reqs: ['RNF-01', 'RF-02'], links: ['sync', 'vpn'], desc: 'Caixa da loja com banco SQLite local: vende mesmo sem rede e sincroniza as transações quando a conectividade retorna.' },
  { id: 'gw', nome: 'API Gateway Central', zona: 'cloud', layer: 'L2', icon: 'shield-check', tech: 'Kong / AWS API Gateway', reqs: ['RNF-03', 'RNF-02'], links: ['iam', 'cli360', 'broker'], desc: 'Porta única de entrada: valida OAuth2, mTLS, aplica Rate Limiting, roteia requisições REST para os microsserviços.' },
  { id: 'iam', nome: 'Identity Provider', zona: 'cloud', layer: 'L2', icon: 'key-round', tech: 'OAuth2 / OIDC · WAF', reqs: ['RNF-03'], links: ['gw'], desc: 'Emite e valida tokens JWT. Segregação de escopos por canal e conformidade com a LGPD.' },
  { id: 'vpn', nome: 'VPN Gateway (Edge)', zona: 'onprem', layer: 'L2', icon: 'lock-keyhole', tech: 'IPsec site-to-site + mTLS', reqs: ['RNF-03'], links: ['pdv', 'gw'], desc: 'Extremo On-Premise do túnel criptografado que conecta lojas, CD e Sede à nuvem.' },
  { id: 'broker', nome: 'Event Broker Central', zona: 'cloud', layer: 'L3', icon: 'radio-tower', tech: 'Kafka / RabbitMQ · Pub/Sub', reqs: ['RNF-01', 'RF-02', 'RF-03'], links: ['cli360', 'hub', 'wms', 'adapter'], desc: 'Publica e retém eventos (PedidoCriado, EstoqueAtualizado, ClienteUnificado). Mensagens aguardam na fila se um consumidor estiver indisponível.' },
  { id: 'sync', nome: 'Sync Agent do PDV', zona: 'onprem', layer: 'L3', icon: 'refresh-cw', tech: 'Outbox Pattern · Retry/Backoff', reqs: ['RNF-01'], links: ['pdv', 'broker'], desc: 'Lê a outbox do SQLite e reenvia transações ao Gateway quando a rede volta, com idempotência por ID de pedido.' },
  { id: 'cli360', nome: 'Serviço Clientes 360°', zona: 'cloud', layer: 'L4', icon: 'user-round-search', tech: 'Node.js / Java · REST', reqs: ['RF-01', 'RF-04'], links: ['pg', 'broker'], desc: 'Mantém o ID Único do cliente por CPF e consolida o histórico de todos os canais.' },
  { id: 'pg', nome: 'PostgreSQL', zona: 'cloud', layer: 'L4', icon: 'database', tech: 'Cadastro único · SQL', reqs: ['RF-01'], links: ['cli360'], desc: 'Repositório transacional do cadastro unificado de clientes (CPF único) e histórico de pedidos.' },
  { id: 'hub', nome: 'Hub de Estoque', zona: 'cloud', layer: 'L4', icon: 'boxes', tech: 'Consumer assíncrono · Java', reqs: ['RF-02', 'RNF-02'], links: ['redis', 'broker'], desc: 'Consome eventos de pedido, faz baixa e reserva do saldo unificado (físico + digital) evitando overselling.' },
  { id: 'redis', nome: 'Cache Redis', zona: 'cloud', layer: 'L4', icon: 'zap', tech: 'In-memory · DECRBY atômico', reqs: ['RF-02', 'RNF-02'], links: ['hub'], desc: 'Saldo de estoque em memória com operações atômicas e latência inferior a 200 ms.' },
  { id: 'wms', nome: 'WMS Armazém (CD)', zona: 'onprem', layer: 'L5', icon: 'warehouse', tech: 'WMS · Consumer assíncrono', reqs: ['RF-02'], links: ['broker'], desc: 'Gera automaticamente a ordem de separação e embalagem ao consumir o evento de pedido.' },
  { id: 'adapter', nome: 'Adaptador ERP Legado', zona: 'onprem', layer: 'L5', icon: 'plug-zap', tech: 'REST Wrapper / Worker', reqs: ['RF-03', 'RNF-01'], links: ['broker', 'erp'], desc: 'Camada anticorrupção: traduz eventos em chamadas ao ERP, faz retry e protege o legado de picos de carga.' },
  { id: 'erp', nome: 'ERP Legado (Sede)', zona: 'onprem', layer: 'L5', icon: 'server', tech: 'ERP monolítico · Fiscal/Contábil', reqs: ['RF-03'], links: ['adapter'], desc: 'Sistema de registro fiscal e contábil. Recebe os lançamentos em D-0 de forma automática.' },
];

const REQS = [
  { id: 'RF-01', tipo: 'RF', titulo: 'Cliente Único (360°)', req: 'Identificar o cliente por CPF único, unificando cadastros de todos os canais.', decisao: 'Serviço Clientes 360° com PostgreSQL e ID Único; eventos ClienteUnificado publicados no broker.', nodes: ['cli360', 'pg', 'ecom', 'sac'], layers: ['L1', 'L4'], demo: { view: 'view-business', label: 'Consulta Cliente 360°' } },
  { id: 'RF-02', tipo: 'RF', titulo: 'Estoque Unificado em Tempo Real', req: 'Saldo único físico + digital, atualizado imediatamente e sem overselling.', decisao: 'Hub de Estoque consumindo eventos, com baixa/reserva atômica no cache Redis.', nodes: ['hub', 'redis', 'broker', 'wms'], layers: ['L3', 'L4', 'L5'], demo: { view: 'view-simulator', label: 'Etapas 3, 4 e 5' } },
  { id: 'RF-03', tipo: 'RF', titulo: 'Faturamento Automático D-0', req: 'Integração fiscal e contábil automática no mesmo dia, sem exportação manual.', decisao: 'Adaptador (REST Wrapper/Worker) consome eventos e integra ao ERP legado.', nodes: ['adapter', 'erp', 'broker'], layers: ['L3', 'L5'], demo: { view: 'view-simulator', label: 'Etapa 6' } },
  { id: 'RF-04', tipo: 'RF', titulo: 'Portal Único do SAC', req: 'Atendimento com histórico único de pedidos de e-commerce e lojas físicas.', decisao: 'Portal SAC consome a API do Clientes 360° através do API Gateway.', nodes: ['sac', 'cli360', 'gw'], layers: ['L1', 'L2', 'L4'], demo: { view: 'view-business', label: 'Portal do SAC' } },
  { id: 'RNF-01', tipo: 'RNF', titulo: 'Disponibilidade e Resiliência', req: 'Operação contínua mesmo com falha de rede no PDV ou indisponibilidade do ERP.', decisao: 'PDV Offline-First (SQLite + outbox) e retenção de eventos na fila do broker.', nodes: ['pdv', 'sync', 'broker', 'adapter'], layers: ['L1', 'L3', 'L5'], demo: { view: 'view-simulator', label: 'Toggles de resiliência' } },
  { id: 'RNF-02', tipo: 'RNF', titulo: 'Desempenho < 200 ms', req: 'Atualização e consulta de estoque em menos de 200 ms.', decisao: 'Saldo em memória no Redis com operações atômicas e consumo assíncrono.', nodes: ['redis', 'hub', 'gw'], layers: ['L2', 'L4'], demo: { view: 'view-business', label: 'Monitor Redis' } },
  { id: 'RNF-03', tipo: 'RNF', titulo: 'Segurança e Conformidade', req: 'Comunicação protegida, autenticação forte e aderência à LGPD.', decisao: 'OAuth2, mTLS, rate limiting no Gateway e túnel VPN IPsec entre Cloud e On-Premise.', nodes: ['gw', 'iam', 'vpn', 'ecom'], layers: ['L2'], demo: { view: 'view-simulator', label: 'Etapa 1' } },
];

/* ---------------------------------------------------------- *
 * Navegação
 * ---------------------------------------------------------- */
function showView(id) {
  $$('.view').forEach((v) => v.classList.toggle('active', v.id === id));
  $$('.tab-btn').forEach((b) => b.classList.toggle('active', b.dataset.view === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
}
$$('.tab-btn').forEach((b) => b.addEventListener('click', () => showView(b.dataset.view)));
$$('[data-goto]').forEach((b) => b.addEventListener('click', () => showView(b.dataset.goto)));

/* ---------------------------------------------------------- *
 * ABA 1 — Visão Geral
 * ---------------------------------------------------------- */
const KPIS = [
  { icon: 'timer', label: 'Latência do estoque', from: 'até 24h', to: '< 200 ms', color: 'emerald' },
  { icon: 'receipt', label: 'Faturamento', from: 'D+1 (manual)', to: 'D-0 automático', color: 'indigo' },
  { icon: 'users', label: 'Visão do cliente', from: 'Fragmentada', to: 'Única (CPF)', color: 'sky' },
  { icon: 'wifi-off', label: 'Operação do PDV', from: 'Depende da rede', to: 'Offline-First', color: 'amber' },
];
const ASIS = [
  { icon: 'moon', t: 'Processamento batch noturno (FTP)', d: 'Arquivos trocados uma vez por noite entre lojas, e-commerce e ERP.' },
  { icon: 'file-spreadsheet', t: 'Exportações manuais de CSV', d: 'Equipes consolidam planilhas à mão — sujeito a erros e retrabalho.' },
  { icon: 'user-x', t: 'Sem visão unificada do cliente', d: 'Cadastros duplicados por canal; SAC não enxerga o histórico completo.' },
  { icon: 'clock-alert', t: 'Estoque atrasado em até 24h', d: 'Saldo exibido nos canais não reflete as vendas do dia.' },
  { icon: 'package-x', t: 'Risco de overselling', d: 'Mesmo item vendido simultaneamente em canais diferentes.' },
];
const TOBE = [
  { icon: 'radio-tower', t: 'Event Broker em tempo real (Kafka/RabbitMQ)', d: 'Eventos Pub/Sub substituem o FTP noturno e desacoplam os sistemas.' },
  { icon: 'cloud-cog', t: 'Integração D-0 via Adaptador de ERP', d: 'Faturamento fiscal e contábil automático, sem planilhas (RF-03).' },
  { icon: 'user-round-check', t: 'Serviço de Clientes 360° (CPF Único)', d: 'ID Único e histórico consolidado de todos os canais (RF-01, RF-04).' },
  { icon: 'zap', t: 'Hub de Estoque com Redis (< 200 ms)', d: 'Saldo unificado em memória, atualizado a cada evento (RF-02, RNF-02).' },
  { icon: 'database-zap', t: 'PDV Offline-First (SQLite)', d: 'Loja vende sem rede e sincroniza depois, sem perda de transações (RNF-01).' },
];
const colorMap = {
  emerald: ['text-emerald-300', 'bg-emerald-500/15', 'border-emerald-400/40'],
  indigo: ['text-indigo-300', 'bg-indigo-500/15', 'border-indigo-400/40'],
  sky: ['text-sky-300', 'bg-sky-500/15', 'border-sky-400/40'],
  amber: ['text-amber-300', 'bg-amber-500/15', 'border-amber-400/40'],
};

function renderOverview() {
  $('#kpi-grid').innerHTML = KPIS.map((k) => {
    const c = colorMap[k.color];
    return `<div class="glass p-4 transition hover:-translate-y-1">
      <div class="flex items-center gap-2 text-xs text-slate-400 font-semibold"><span class="w-8 h-8 rounded-lg ${c[1]} border ${c[2]} grid place-items-center"><i data-lucide="${k.icon}" class="w-4 h-4 ${c[0]}"></i></span>${k.label}</div>
      <div class="mt-3 text-xs text-slate-500 line-through">${k.from}</div>
      <div class="kpi-num text-xl font-black ${c[0]}">${k.to}</div></div>`;
  }).join('');

  $('#list-asis').innerHTML = ASIS.map((i) => `<li class="flex gap-3 p-3 rounded-xl bg-rose-950/30 border border-rose-400/15">
    <i data-lucide="${i.icon}" class="w-5 h-5 text-rose-300 shrink-0 mt-0.5"></i>
    <div><div class="font-bold text-sm text-rose-50">${i.t}</div><div class="text-xs text-rose-200/70 mt-0.5">${i.d}</div></div></li>`).join('');
  $('#list-tobe').innerHTML = TOBE.map((i) => `<li class="flex gap-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-400/15">
    <i data-lucide="${i.icon}" class="w-5 h-5 text-emerald-300 shrink-0 mt-0.5"></i>
    <div><div class="font-bold text-sm text-emerald-50">${i.t}</div><div class="text-xs text-emerald-200/70 mt-0.5">${i.d}</div></div></li>`).join('');
  renderFlow('asis');
}

function chip(label, icon, cls = '') {
  return `<span class="flow-chip ${cls}"><i data-lucide="${icon}" class="w-3.5 h-3.5"></i>${label}</span>`;
}
const arrow = (cls = 'text-slate-500') => `<i data-lucide="chevron-right" class="w-4 h-4 ${cls}"></i>`;

function renderFlow(kind) {
  $$('[data-flow]').forEach((b) => b.classList.toggle('active', b.dataset.flow === kind));
  const el = $('#flow-view');
  if (kind === 'asis') {
    el.innerHTML = [
      chip('PDV Loja', 'store'), arrow('text-rose-400'),
      chip('Arquivo FTP (noturno)', 'hard-drive-upload', '!border-rose-400/50 !text-rose-200'), arrow('text-rose-400'),
      chip('ERP Legado', 'server'), arrow('text-rose-400'),
      chip('CSV manual', 'file-spreadsheet', '!border-rose-400/50 !text-rose-200'), arrow('text-rose-400'),
      chip('E-commerce (estoque defasado)', 'shopping-cart', '!border-rose-400/50 !text-rose-200'),
    ].join('');
    $('#flow-caption').textContent = 'Informações trafegam em lotes noturnos e dependem de intervenção manual: até 24h de defasagem.';
  } else {
    el.innerHTML = [
      chip('E-commerce / PDV', 'shopping-cart', '!border-emerald-400/50'), arrow('text-emerald-400'),
      chip('API Gateway', 'shield-check', '!border-emerald-400/50'), arrow('text-emerald-400'),
      chip('Event Broker', 'radio-tower', '!border-violet-400/60 !text-violet-200'), arrow('text-emerald-400'),
      `<div class="flex flex-wrap gap-2 p-2 rounded-xl border border-dashed border-emerald-400/40 bg-emerald-500/5">
        ${chip('Clientes 360°', 'user-round-search')}${chip('Hub Estoque (Redis)', 'zap')}${chip('WMS CD', 'warehouse')}${chip('ERP (Adaptador)', 'server')}</div>`,
    ].join('');
    $('#flow-caption').textContent = 'Cada venda vira um evento publicado uma única vez e consumido em paralelo por todos os serviços — em tempo real.';
  }
  icons();
}
$$('[data-flow]').forEach((b) => b.addEventListener('click', () => renderFlow(b.dataset.flow)));

/* ---------------------------------------------------------- *
 * ABA 2 — Simulador
 * ---------------------------------------------------------- */
const STEPS = [
  { n: 1, title: 'Início da Transação', proto: 'REST/HTTPS', icon: 'globe', tech: ['API Gateway (Kong/AWS)', 'OAuth2', 'mTLS', 'Rate Limiting'], desc: 'Compra enviada pelo canal ao API Gateway Central, que valida identidade e limita taxa.' },
  { n: 2, title: 'Identificação do Cliente', proto: 'REST/SQL', icon: 'user-round-search', tech: ['Clientes 360°', 'Node.js/Java', 'PostgreSQL', 'RF-01'], desc: 'Associa a compra ao ID Único do cliente através do CPF.' },
  { n: 3, title: 'Publicação de Eventos', proto: 'Async Pub/Sub', icon: 'radio-tower', tech: ['Kafka/RabbitMQ', 'PedidoCriado', 'EstoqueAtualizado', 'ClienteUnificado'], desc: 'Eventos publicados no Event Broker Central, desacoplando os consumidores.' },
  { n: 4, title: 'Baixa de Estoque', proto: 'Async Consumer', icon: 'boxes', tech: ['Hub de Estoque', 'Redis', '< 200 ms', 'RF-02 · RNF-02'], desc: 'Baixa e reserva instantânea no cache em memória, evitando overselling.' },
  { n: 5, title: 'Expedição', proto: 'Async Consumer', icon: 'warehouse', tech: ['WMS Armazém (CD)', 'Separação', 'Embalagem'], desc: 'WMS gera a ordem automática de separação e embalagem.' },
  { n: 6, title: 'Faturamento', proto: 'REST Wrapper/Worker', icon: 'receipt', tech: ['Adaptador ERP Legado', 'Fiscal', 'Contábil', 'D-0 · RF-03'], desc: 'Integração fiscal e contábil automática com o ERP legado.' },
];

const sim = {
  channel: 'ecom',
  running: false,
  erpDown: false,
  netDown: false,
  pending: [],       // vendas gravadas no SQLite aguardando sync
  erpQueue: [],      // eventos retidos aguardando o ERP
  topics: { PedidoCriado: 0, EstoqueAtualizado: 0, ClienteUnificado: 0 },
  offset: 4210,
  seq: 90001,
  nfe: 18432,
  tlOrder: null,
  sacCpf: null,
};

function renderTimeline() {
  $('#timeline').innerHTML = STEPS.map((s) => `
    <div class="step-wrap" data-step="${s.n}" data-state="idle">
      <div class="step-num">${s.n}</div>
      <div class="step-card">
        <div class="flex items-center gap-2 flex-wrap">
          <i data-lucide="${s.icon}" class="w-4 h-4 text-indigo-300"></i>
          <h3 class="font-bold text-sm text-white">${s.title}</h3>
          <span class="proto-badge">${s.proto}</span>
        </div>
        <p class="text-xs text-slate-400 mt-1.5">${s.desc}</p>
        <div class="flex flex-wrap gap-1.5 mt-2">${s.tech.map((t) => `<span class="tech-chip">${t}</span>`).join('')}</div>
        <div class="step-bar"><span></span></div>
        <div class="step-status">Aguardando execução</div>
      </div>
    </div>`).join('');
  icons();
}

function setStep(n, state, text) {
  const w = $(`.step-wrap[data-step="${n}"]`);
  w.dataset.state = state;
  if (text !== undefined) w.querySelector('.step-status').innerHTML = text;
}
function resetTimeline() {
  STEPS.forEach((s) => {
    const w = $(`.step-wrap[data-step="${s.n}"]`);
    const bar = w.querySelector('.step-bar > span');
    bar.style.transition = 'none'; bar.style.width = '0';
    setStep(s.n, 'idle', 'Aguardando execução');
  });
}
function setSimState(text, cls = 'b-info', icon = 'circle-dot') {
  const el = $('#sim-state');
  el.className = `badge ${cls}`;
  el.innerHTML = `<i data-lucide="${icon}" class="w-3 h-3"></i>${text}`;
  icons();
}

function log(level, tag, msg) {
  const el = document.createElement('div');
  el.className = `log-line log-${level}`;
  el.innerHTML = `<span class="log-ts">${clock()}</span><span class="log-tag">${tag}</span><span class="break-words min-w-0">${msg}</span>`;
  const box = $('#log');
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
}

async function stepRun(n, dur, text, logs) {
  setStep(n, 'active', text);
  const bar = $(`.step-wrap[data-step="${n}"] .step-bar > span`);
  bar.style.transition = 'none'; bar.style.width = '0';
  void bar.offsetWidth;
  bar.style.transition = `width ${dur / speed}ms linear`;
  bar.style.width = '100%';
  const gap = dur / (logs.length + 1);
  for (const l of logs) { await sleep(gap); log(...l); }
  await sleep(gap);
}

/* ---- Configuração / pedido ---- */
function readConfig() {
  const prod = products.find((p) => p.sku === $('#sim-product').value);
  const qty = Math.max(1, Math.min(20, parseInt($('#sim-qty').value, 10) || 1));
  $('#sim-qty').value = qty;
  return { channel: sim.channel, prod, qty, custKey: $('#sim-customer').value };
}
function buildOrder(cfg) {
  return {
    id: 'PED-' + sim.seq++, canal: cfg.channel === 'pdv' ? 'loja' : 'ecom', channel: cfg.channel,
    prod: cfg.prod, qty: cfg.qty, valor: cfg.prod.preco * cfg.qty, custKey: cfg.custKey,
    nodeLabel: cfg.channel === 'pdv' ? 'PDV-LOJA-07' : 'ECOM-SaaS',
  };
}
const NEW_CPF = '321.654.987-11';
function resolveCustomer(order) {
  if (order.custKey !== 'novo') return { cust: customers.find((c) => c.cpf === order.custKey), created: false };
  let c = customers.find((x) => x.cpf === NEW_CPF);
  if (c) return { cust: c, created: false };
  c = {
    id: 'VT-' + pad(customers.length + 1, 4), nome: 'Cliente Novo (Demo)', cpf: NEW_CPF, email: 'novo.cliente@email.com',
    tel: '(41) 99000-1234', cidade: 'Curitiba / PR', segmento: 'Bronze', desde: today().slice(3), pref: 'Omnichannel', orders: [],
  };
  customers.push(c);
  renderSacSamples();
  return { cust: c, created: true };
}
function setOrderStatus(order, status) {
  if (order.record) order.record.status = status;
  renderSac();
}

/* ---- Execução ---- */
async function onRun() {
  if (sim.running) return;
  const cfg = readConfig();
  const order = buildOrder(cfg);
  resetTimeline();
  $('#log').insertAdjacentHTML('beforeend', '<div class="log-line log-sys"><span class="log-ts">────────</span><span class="log-tag">SIM</span><span>Nova execução iniciada</span></div>');
  sim.tlOrder = order.id;
  const pill = $('#order-pill');
  pill.classList.remove('hidden');
  pill.innerHTML = `<i data-lucide="hash" class="w-3 h-3"></i>${order.id} · ${order.qty}× ${order.prod.nome.split(' ').slice(0, 2).join(' ')}`;
  icons();
  if (cfg.channel === 'pdv' && sim.netDown) return offlineSale(order);
  return runPipeline(order);
}

async function offlineSale(order) {
  setBusy(true);
  setSimState('PDV offline · gravando local', 'b-warn', 'wifi-off');
  await stepRun(1, 1500, 'PDV sem conectividade — gravando no SQLite local…', [
    ['info', 'PDV-07', `POST /v1/pedidos → api.varejotech.com`],
    ['err', 'PDV-07', 'ERR_NETWORK: timeout após 3000 ms (link WAN indisponível)'],
    ['warn', 'OFFLINE', 'Ativando modo Offline-First: venda não será bloqueada'],
    ['ok', 'SQLite', `INSERT INTO outbox (id, sku, qty, total, status) VALUES ('${order.id}', '${order.prod.sku}', ${order.qty}, ${order.valor}, 'PENDING_SYNC')`],
  ]);
  setStep(1, 'warn', '<b>Venda gravada no SQLite Local</b> — aguardando restauração da rede');
  for (let n = 2; n <= 6; n++) setStep(n, 'idle', 'Aguardando sincronização');
  sim.pending.push(order);
  renderPanels();
  log('warn', 'OFFLINE', 'Cliente atendido normalmente. Estoque central <b>ainda não reflete</b> a venda (consistência eventual).');
  log('sys', 'HINT', 'Clique em “Restaurar Rede e Sincronizar” para reenviar a outbox.');
  setSimState('Venda pendente de sincronização', 'b-warn', 'database');
  toast(`Venda ${order.id} gravada no SQLite local do PDV`, 'warn', 'database');
  setBusy(false);
}

async function syncPdv() {
  if (sim.running || !sim.pending.length) return;
  sim.netDown = false;
  $('#tg-offline').checked = false;
  updatePdvNet();
  log('ok', 'REDE', 'Conectividade restaurada — Sync Agent detectou link WAN ativo');
  toast('Rede restaurada — sincronizando outbox do PDV', 'ok', 'wifi');
  const queue = sim.pending.splice(0);
  renderPanels();
  for (const order of queue) {
    log('info', 'SYNC', `Reenviando ${order.id} da outbox (idempotency-key: ${order.id})`);
    resetTimeline();
    sim.tlOrder = order.id;
    $('#order-pill').innerHTML = `<i data-lucide="hash" class="w-3 h-3"></i>${order.id} · sincronizado`;
    icons();
    await runPipeline(order, true);
    await sleep(300);
  }
}

async function runPipeline(order, resumed = false) {
  setBusy(true);
  setSimState('Executando…', 'b-info', 'loader');
  const chLabel = order.channel === 'pdv' ? 'PDV Loja Física' : 'E-commerce SaaS';
  const { cust, created } = resolveCustomer(order);
  const cpfMasked = maskCpf(cust ? cust.cpf : NEW_CPF);

  /* 1 — Gateway */
  await stepRun(1, 1700, `${chLabel} → API Gateway Central…`, [
    ['info', order.nodeLabel, `POST /v1/pedidos (${order.qty}× ${order.prod.sku}) via HTTPS / TLS 1.3`],
    order.channel === 'pdv'
      ? ['info', 'VPN', 'Túnel IPsec site-to-site ativo · tráfego do PDV via mTLS']
      : ['info', 'WAF', 'Requisição do SaaS validada pelo WAF (sem ameaças)'],
    ['ok', 'GW', 'OAuth2: JWT válido · scope pedidos:write · mTLS: certificado do cliente confiável'],
    ['ok', 'GW', `Rate Limiting: ${rnd(40, 400)}/1000 req/min — OK · roteando para Clientes 360°`],
  ]);
  setStep(1, 'done', 'Autenticado e autorizado · <b>HTTP 202 Accepted</b>');

  /* 2 — Cliente */
  await stepRun(2, 1500, 'Consultando Serviço Clientes 360°…', [
    ['info', 'CLI360', `GET /clientes?cpf=${cpfMasked}`],
    ['info', 'PG', `SELECT id_unico FROM clientes WHERE cpf_hash = sha256(...) — ${rnd(8, 35)} ms`],
    created
      ? ['ok', 'CLI360', `CPF inédito → novo ID Único criado: <b>${cust.id}</b> (cadastro unificado)`]
      : ['ok', 'CLI360', `Cliente localizado → ID Único <b>${cust.id}</b> · ${cust.nome} (RF-01)`],
  ]);
  setStep(2, 'done', `ID Único <b>${cust.id}</b> · ${cust.nome}`);
  order.cust = cust;
  order.record = {
    id: order.id, data: today(), canal: order.canal, itens: `${order.qty}× ${order.prod.nome}`, valor: order.valor, status: 'Processando',
  };
  cust.orders.unshift(order.record);
  renderSac();

  /* 3 — Eventos */
  const base = sim.offset;
  sim.offset += 3;
  await stepRun(3, 1600, 'Publicando eventos no Event Broker…', [
    ['evt', 'KAFKA', `PUBLISH topic=<b>PedidoCriado</b> partition=${rnd(0, 5)} offset=${base + 1} key=${order.id}`],
    ['evt', 'KAFKA', `PUBLISH topic=<b>EstoqueAtualizado</b> partition=${rnd(0, 5)} offset=${base + 2} key=${order.prod.sku}`],
    ['evt', 'KAFKA', `PUBLISH topic=<b>ClienteUnificado</b> partition=${rnd(0, 5)} offset=${base + 3} key=${cust.id}`],
  ]);
  Object.keys(sim.topics).forEach((k) => sim.topics[k]++);
  renderPanels();
  setStep(3, 'done', '3 eventos publicados · <b>ack=all</b> (replicação confirmada)');

  /* 4 — Estoque */
  const p = order.prod;
  const before = p.fisico + p.digital;
  const lat = rnd(38, 142);
  const enough = before >= order.qty;
  await stepRun(4, 1500, 'Hub de Estoque consumindo evento…', [
    ['evt', 'HUB', `CONSUME PedidoCriado ${order.id} · reservando ${order.qty}× ${p.sku}`],
    enough
      ? ['ok', 'REDIS', `DECRBY estoque:${p.sku} ${order.qty} → saldo ${before} → <b>${before - order.qty}</b> · ${lat} ms ${lat < 200 ? '✓ &lt; 200 ms' : ''}`]
      : ['err', 'REDIS', `Saldo ${before} &lt; ${order.qty} solicitado · reserva atômica <b>REJEITADA</b>`],
  ]);
  if (!enough) {
    setStep(4, 'error', `<b>Estoque insuficiente</b> (${before} un.) — overselling evitado`);
    setStep(5, 'skip', 'Cancelado');
    setStep(6, 'skip', 'Cancelado');
    log('err', 'SAGA', `Compensação: publicando PedidoCancelado ${order.id} · cliente notificado`);
    redisFeed(`GET estoque:${p.sku} → ${before} (reserva negada)`, 'err');
    flashStock(p.sku, 'red');
    setOrderStatus(order, 'Cancelado (sem estoque)');
    setSimState('Venda rejeitada — sem estoque', 'b-err', 'octagon-x');
    toast('Overselling evitado: estoque insuficiente', 'err', 'shield-alert');
    setBusy(false);
    return;
  }
  consumeStock(p, order.qty, order.channel);
  redisFeed(`DECRBY estoque:${p.sku} ${order.qty} → ${p.fisico + p.digital} (${lat} ms)`, 'ok');
  renderStock(p.sku);
  setStep(4, 'done', `Saldo unificado: ${before} → <b>${p.fisico + p.digital}</b> un. · <b>${lat} ms</b>`);

  /* 5 — WMS */
  const os = `OS-SEP-${rnd(10000, 99999)}`;
  await stepRun(5, 1400, 'WMS do CD gerando ordem de separação…', [
    ['evt', 'WMS', `CONSUME PedidoCriado ${order.id}`],
    ['ok', 'WMS', `Ordem <b>${os}</b> criada · endereço ${rnd(1, 9)}${String.fromCharCode(65 + rnd(0, 5))}-${rnd(10, 99)} · embalagem padrão M`],
  ]);
  setStep(5, 'done', `Ordem de separação <b>${os}</b> gerada`);

  /* 6 — ERP */
  if (sim.erpDown) {
    await stepRun(6, 1500, 'Adaptador tentando acionar o ERP…', [
      ['evt', 'ADAPTER', `CONSUME PedidoCriado ${order.id} · POST /erp/faturamento`],
      ['err', 'ERP', 'HTTP 503 Service Unavailable — janela de manutenção do ERP legado'],
      ['warn', 'ADAPTER', 'Retry/backoff exponencial agendado · mensagem <b>retida na fila do Broker</b> (RNF-01)'],
    ]);
    setStep(6, 'queued', '<b>Aguardando na fila do Broker</b> — ERP em manutenção · nenhuma perda de dados');
    sim.erpQueue.push(order);
    setOrderStatus(order, 'Aguardando ERP');
    renderPanels();
    log('ok', 'RNF-01', 'Etapas 1–5 concluídas. Venda confirmada ao cliente; faturamento será processado ao restabelecer o ERP.');
    setSimState('Concluída · faturamento em fila', 'b-warn', 'hourglass');
    toast('ERP em manutenção — evento retido na fila do Broker', 'warn', 'hourglass');
  } else {
    await billOrder(order, 1500, true);
    setSimState('Venda concluída com sucesso', 'b-ok', 'check-circle-2');
    toast(`Venda ${order.id} concluída — faturada em D-0`, 'ok', 'check-circle-2');
  }
  setBusy(false);
}

async function billOrder(order, dur, animate) {
  const nf = sim.nfe++;
  const lines = [
    ['evt', 'ADAPTER', `CONSUME PedidoCriado ${order.id} · POST /erp/faturamento`],
    ['ok', 'ERP', `NF-e <b>${nf}</b> autorizada na SEFAZ · chave 3526${rnd(10, 99)}…${rnd(1000, 9999)}`],
    ['ok', 'ERP', `Lançamento contábil #${rnd(500000, 599999)} registrado em D-0 · ${brl(order.valor)} (RF-03)`],
  ];
  if (animate) await stepRun(6, dur, 'Adaptador integrando com o ERP…', lines);
  else lines.forEach((l) => log(...l));
  if (animate || sim.tlOrder === order.id) setStep(6, 'done', `NF-e <b>${nf}</b> emitida · lançamento contábil <b>D-0</b>`);
  setOrderStatus(order, 'Faturado (D-0)');
}

async function drainErp() {
  if (sim.running || !sim.erpQueue.length) return;
  setBusy(true);
  log('ok', 'ERP', 'ERP restabelecido — drenando mensagens retidas na fila do Broker');
  setSimState('Drenando fila do ERP…', 'b-info', 'loader');
  const queue = sim.erpQueue.splice(0);
  renderPanels();
  for (const order of queue) {
    const current = sim.tlOrder === order.id;
    if (current) setStep(6, 'active', 'ERP online — processando mensagem retida…');
    await sleep(900);
    await billOrder(order, 0, false);
    renderPanels();
  }
  setSimState('Fila drenada · tudo faturado', 'b-ok', 'check-circle-2');
  toast('Fila do ERP drenada — pedidos faturados', 'ok', 'check-circle-2');
  setBusy(false);
}

/* ---- Painéis de infra ---- */
function renderPanels() {
  // SQLite
  $('#sqlite-list').innerHTML = sim.pending.length
    ? sim.pending.map((o) => `<div class="sqlite-row"><span class="mono">${o.id} · ${o.qty}× ${o.prod.sku}</span><span class="font-bold text-rose-300">PENDING_SYNC</span></div>`).join('')
    : '<div class="text-xs text-slate-500 italic py-2">Outbox vazia — nenhuma transação pendente.</div>';
  $('#btn-sync').classList.toggle('hidden', !sim.pending.length);

  // Broker
  const held = sim.erpQueue.length;
  $('#broker-topics').innerHTML = Object.entries(sim.topics).map(([t, v]) => `
    <div class="flex items-center justify-between text-xs glass-soft px-3 py-2">
      <span class="mono text-violet-200">${t}</span><span class="font-bold kpi-num">${v} <span class="text-slate-500 font-medium">msgs</span></span></div>`).join('') + `
    <div class="flex items-center justify-between text-xs px-3 py-2 rounded-xl border ${held ? 'border-amber-400/50 bg-amber-500/10' : 'border-slate-700/40'}">
      <span class="${held ? 'text-amber-200' : 'text-slate-400'}">Retidas p/ ERP</span><b class="${held ? 'text-amber-300' : 'text-slate-400'}">${held}</b></div>`;

  // ERP
  const erp = $('#erp-net');
  erp.className = `node-status ${sim.erpDown ? 'ns-down' : 'ns-ok'}`;
  erp.innerHTML = `<span class="dot"></span>${sim.erpDown ? 'Em manutenção' : 'Online'}`;
  $('#erp-queue').innerHTML = held
    ? sim.erpQueue.map((o) => `<div class="queue-msg"><i data-lucide="mail" class="w-3.5 h-3.5 text-amber-300"></i><span class="mono">${o.id}</span><span class="text-amber-200/80">aguardando faturamento</span><span class="ml-auto font-bold">${brl(o.valor)}</span></div>`).join('')
    : '<div class="text-xs text-slate-500 italic py-2">Fila vazia — faturamento em dia (D-0).</div>';
  $('#btn-drain').classList.toggle('hidden', !held);
  updatePdvNet();
  icons();
}

function updatePdvNet() {
  const el = $('#pdv-net');
  if (sim.netDown && sim.channel === 'pdv') {
    el.className = 'node-status ns-down'; el.innerHTML = '<span class="dot"></span>Rede offline';
  } else if (sim.pending.length) {
    el.className = 'node-status ns-warn'; el.innerHTML = `<span class="dot"></span>Online · ${sim.pending.length} pendente(s)`;
  } else {
    el.className = 'node-status ns-ok'; el.innerHTML = '<span class="dot"></span>Rede online';
  }
}

function setBusy(b) {
  sim.running = b;
  const btn = $('#btn-run');
  btn.disabled = b;
  btn.innerHTML = b
    ? '<i data-lucide="loader" class="w-4 h-4 spin"></i>Executando…'
    : '<i data-lucide="zap" class="w-4 h-4"></i>Executar Venda Omnichannel';
  $('#btn-sync').disabled = b;
  $('#btn-drain').disabled = b;
  icons();
}

/* ---- Controles ---- */
function renderSimSelects() {
  const sel = $('#sim-product');
  const cur = sel.value;
  sel.innerHTML = products.map((p) => `<option value="${p.sku}">${p.nome} — ${brl(p.preco)} (saldo ${p.fisico + p.digital})</option>`).join('');
  if (cur) sel.value = cur;
  const cs = $('#sim-customer');
  const ccur = cs.value;
  cs.innerHTML = customers.filter((c) => c.cpf !== NEW_CPF).map((c) => `<option value="${c.cpf}">${c.nome} · ${maskCpf(c.cpf)}</option>`).join('')
    + `<option value="novo">+ Cliente novo (CPF ${maskCpf(NEW_CPF)})</option>`;
  if (ccur) cs.value = ccur;
}

function setChannel(ch) {
  sim.channel = ch;
  $$('[data-channel]').forEach((b) => {
    const on = b.dataset.channel === ch;
    b.classList.toggle('active', on);
    b.setAttribute('aria-checked', on);
  });
  const tg = $('#tg-offline');
  tg.disabled = ch !== 'pdv';
  $('#lbl-offline').style.opacity = ch === 'pdv' ? '1' : '.5';
  $('#lbl-offline').title = ch === 'pdv' ? '' : 'Disponível apenas para o canal PDV Loja Física';
  if (ch !== 'pdv') { tg.checked = false; sim.netDown = false; }
  updatePdvNet();
}

$$('[data-channel]').forEach((b) => b.addEventListener('click', () => { if (!sim.running) setChannel(b.dataset.channel); }));
$('#tg-offline').addEventListener('change', (e) => {
  sim.netDown = e.target.checked;
  updatePdvNet();
  if (sim.netDown) log('err', 'REDE', 'Link WAN do PDV-LOJA-07 <b>derrubado</b> — próximas vendas usarão o SQLite local');
  else log('ok', 'REDE', 'Link WAN do PDV-LOJA-07 restaurado');
});
$('#tg-erp').addEventListener('change', (e) => {
  sim.erpDown = e.target.checked;
  renderPanels();
  if (sim.erpDown) log('warn', 'ERP', 'ERP Legado entrou em <b>manutenção</b> — faturamentos serão retidos no Broker');
  else {
    log('ok', 'ERP', 'ERP Legado voltou ao ar');
    if (sim.erpQueue.length) drainErp();
  }
});
$('#btn-run').addEventListener('click', onRun);
$('#btn-sync').addEventListener('click', syncPdv);
$('#btn-drain').addEventListener('click', () => {
  if (sim.erpDown) { $('#tg-erp').checked = false; sim.erpDown = false; renderPanels(); }
  drainErp();
});
$('#btn-clear-log').addEventListener('click', () => { $('#log').innerHTML = ''; });
$('#sim-speed').addEventListener('change', (e) => { speed = parseFloat(e.target.value); });
$('#btn-reset').addEventListener('click', () => {
  if (sim.running) return;
  products = initialProducts();
  customers = initialCustomers();
  Object.assign(sim, { pending: [], erpQueue: [], erpDown: false, netDown: false, tlOrder: null, seq: 90001, nfe: 18432, offset: 4210, topics: { PedidoCriado: 0, EstoqueAtualizado: 0, ClienteUnificado: 0 } });
  $('#tg-erp').checked = false; $('#tg-offline').checked = false;
  $('#log').innerHTML = '';
  $('#order-pill').classList.add('hidden');
  $('#redis-feed').innerHTML = '';
  resetTimeline();
  setChannel('ecom');
  renderSimSelects(); renderPanels(); renderStock(); renderSacSamples(); renderSac();
  setSimState('Aguardando execução');
  toast('Demonstração reiniciada', 'info', 'rotate-ccw');
  log('sys', 'SIM', 'Ambiente de demonstração reiniciado');
});

/* ---------------------------------------------------------- *
 * ABA 3 — Telas de negócio
 * ---------------------------------------------------------- */
const statusBadge = (s) => {
  if (/Entregue|Faturado/.test(s)) return 'b-ok';
  if (/Aguardando/.test(s)) return 'b-warn';
  if (/Cancelado/.test(s)) return 'b-err';
  return 'b-info';
};
const canalBadge = (c) => c === 'ecom'
  ? '<span class="badge b-ecom"><i data-lucide="shopping-cart" class="w-3 h-3"></i>E-commerce</span>'
  : '<span class="badge b-loja"><i data-lucide="store" class="w-3 h-3"></i>Loja Física</span>';

function renderSacSamples() {
  $('#sac-samples').innerHTML = customers.map((c) => `<button type="button" class="badge b-info hover:brightness-125 cursor-pointer" data-cpf="${c.cpf}">${c.nome.split(' ')[0]} · <span class="mono">${c.cpf}</span></button>`).join('');
  $$('#sac-samples [data-cpf]').forEach((b) => b.addEventListener('click', () => {
    $('#sac-cpf').value = b.dataset.cpf;
    sacSearch(b.dataset.cpf);
  }));
}

function sacSearch(cpf) {
  sim.sacCpf = cpf;
  renderSac(true);
}

function renderSac(fresh = false) {
  const box = $('#sac-result');
  if (!sim.sacCpf) {
    box.innerHTML = `<div class="text-center py-10 text-slate-500 text-sm"><i data-lucide="search-code" class="w-10 h-10 mx-auto mb-3 opacity-40"></i>
      Informe um CPF ou escolha um cliente de exemplo para ver o perfil unificado e o histórico de todos os canais.</div>`;
    icons();
    return;
  }
  const c = customers.find((x) => x.cpf === sim.sacCpf);
  if (!c) {
    box.innerHTML = `<div class="p-5 rounded-xl border border-rose-400/40 bg-rose-500/10 text-sm text-rose-200 flex items-center gap-3">
      <i data-lucide="user-x" class="w-5 h-5"></i>Nenhum cliente encontrado para o CPF <b class="mono">${sim.sacCpf}</b>. Em produção, o SAC poderia iniciar um novo cadastro único.</div>`;
    icons();
    return;
  }
  const valid = c.orders.filter((o) => !/Cancelado/.test(o.status));
  const total = valid.reduce((s, o) => s + o.valor, 0);
  const ecom = c.orders.filter((o) => o.canal === 'ecom').length;
  const loja = c.orders.filter((o) => o.canal === 'loja').length;
  const pct = c.orders.length ? Math.round((ecom / c.orders.length) * 100) : 0;
  const segCls = { Ouro: 'b-warn', Prata: 'b-info', Bronze: 'b-loja' }[c.segmento] || 'b-info';
  const lat = rnd(22, 64);
  box.innerHTML = `
    <div class="grid lg:grid-cols-3 gap-5 ${fresh ? 'animate-[fadeUp_.45s_ease_both]' : ''}">
      <div class="glass-soft p-5">
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-400 grid place-items-center text-xl font-black text-white">${c.nome.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
          <div><div class="font-extrabold text-white leading-tight">${c.nome}</div>
            <div class="flex gap-1.5 mt-1.5 flex-wrap"><span class="badge b-ok"><i data-lucide="fingerprint" class="w-3 h-3"></i>${c.id}</span><span class="badge ${segCls}">${c.segmento}</span></div></div>
        </div>
        <dl class="mt-4 space-y-2 text-xs">
          <div class="flex justify-between gap-3"><dt class="text-slate-400">CPF</dt><dd class="mono text-slate-200">${c.cpf}</dd></div>
          <div class="flex justify-between gap-3"><dt class="text-slate-400">E-mail</dt><dd class="text-slate-200 truncate">${c.email}</dd></div>
          <div class="flex justify-between gap-3"><dt class="text-slate-400">Telefone</dt><dd class="text-slate-200">${c.tel}</dd></div>
          <div class="flex justify-between gap-3"><dt class="text-slate-400">Cidade</dt><dd class="text-slate-200">${c.cidade}</dd></div>
          <div class="flex justify-between gap-3"><dt class="text-slate-400">Cliente desde</dt><dd class="text-slate-200">${c.desde}</dd></div>
          <div class="flex justify-between gap-3"><dt class="text-slate-400">Perfil de compra</dt><dd class="text-slate-200">${c.pref}</dd></div>
        </dl>
        <div class="mt-4 text-[11px] text-slate-500 flex items-center gap-1.5"><i data-lucide="zap" class="w-3 h-3 text-emerald-400"></i>GET /clientes?cpf=… · ${lat} ms · PostgreSQL</div>
        <div class="flex gap-2 mt-4">
          <button class="btn btn-ghost btn-sm flex-1" data-act="Chamado aberto no SAC para ${c.nome.split(' ')[0]}"><i data-lucide="ticket" class="w-3.5 h-3.5"></i>Abrir chamado</button>
          <button class="btn btn-ghost btn-sm flex-1" data-act="2ª via da NF-e enviada por e-mail"><i data-lucide="mail" class="w-3.5 h-3.5"></i>2ª via NF-e</button>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-4">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="glass-soft p-3"><div class="text-[11px] text-slate-400">Pedidos</div><div class="text-xl font-black text-white kpi-num">${c.orders.length}</div></div>
          <div class="glass-soft p-3"><div class="text-[11px] text-slate-400">Total gasto</div><div class="text-xl font-black text-emerald-300 kpi-num">${brl(total)}</div></div>
          <div class="glass-soft p-3"><div class="text-[11px] text-slate-400">E-commerce</div><div class="text-xl font-black text-indigo-300 kpi-num">${ecom}</div></div>
          <div class="glass-soft p-3"><div class="text-[11px] text-slate-400">Loja Física</div><div class="text-xl font-black text-amber-300 kpi-num">${loja}</div></div>
        </div>
        <div class="glass-soft p-3">
          <div class="flex justify-between text-[11px] text-slate-400 mb-1.5"><span>Distribuição por canal (visão única)</span><span>${pct}% digital · ${100 - pct}% loja</span></div>
          <div class="h-2 rounded-full bg-amber-400/70 overflow-hidden"><div class="h-full bg-indigo-400 transition-all duration-700" style="width:${pct}%"></div></div>
        </div>
        <div class="overflow-x-auto scroll-thin rounded-xl border border-slate-700/40">
          <table class="tbl" aria-label="Histórico unificado de pedidos">
            <thead><tr><th>Pedido</th><th>Data</th><th>Canal</th><th>Itens</th><th>Valor</th><th>Status</th></tr></thead>
            <tbody>${c.orders.length ? c.orders.map((o, i) => `
              <tr class="${i === 0 && o.id.startsWith('PED-9') ? 'flash-green' : ''}">
                <td class="mono font-semibold text-slate-100">${o.id}</td><td class="text-slate-300">${o.data}</td><td>${canalBadge(o.canal)}</td>
                <td class="text-slate-300">${o.itens}</td><td class="font-semibold kpi-num">${brl(o.valor)}</td>
                <td><span class="badge ${statusBadge(o.status)}">${o.status}</span></td></tr>`).join('')
              : '<tr><td colspan="6" class="text-center text-slate-500 py-6">Sem pedidos.</td></tr>'}</tbody>
          </table>
        </div>
      </div>
    </div>`;
  $$('[data-act]', box).forEach((b) => b.addEventListener('click', () => toast(b.dataset.act, 'ok', 'check')));
  icons();
}

$('#sac-cpf').addEventListener('input', (e) => { e.target.value = fmtCpf(e.target.value); });
$('#sac-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const v = $('#sac-cpf').value.trim();
  if (v.length < 14) { toast('Informe um CPF completo (11 dígitos)', 'warn', 'alert-circle'); return; }
  sacSearch(v);
});

/* ---- Estoque ---- */
function consumeStock(p, qty, channel) {
  const primary = channel === 'pdv' ? 'fisico' : 'digital';
  const other = primary === 'fisico' ? 'digital' : 'fisico';
  const take = Math.min(p[primary], qty);
  p[primary] -= take;
  p[other] -= qty - take;
}
function stockLevel(total) {
  if (total <= 5) return { cls: 'b-err', txt: 'Crítico', color: '#f43f5e' };
  if (total <= 12) return { cls: 'b-warn', txt: 'Baixo', color: '#f59e0b' };
  return { cls: 'b-ok', txt: 'Saudável', color: '#10b981' };
}
function renderStock(flashSku) {
  $('#stock-body').innerHTML = products.map((p) => {
    const t = p.fisico + p.digital;
    const lv = stockLevel(t);
    const pct = Math.min(100, Math.round((t / 65) * 100));
    return `<tr id="row-${p.sku}">
      <td class="mono text-slate-400">${p.sku}</td>
      <td class="font-semibold text-slate-100">${p.nome}</td>
      <td class="kpi-num">${p.fisico}</td><td class="kpi-num">${p.digital}</td>
      <td class="kpi-num font-black text-white text-base">${t}</td>
      <td><div class="stock-bar"><span style="width:${pct}%;background:${lv.color}"></span></div></td>
      <td><span class="badge ${lv.cls}">${lv.txt}</span></td></tr>`;
  }).join('');
  if (flashSku) flashStock(flashSku, 'green');
  $('#stock-updated').textContent = clock();
  renderSimSelects();
}
function flashStock(sku, color) {
  const row = $(`#row-${sku}`);
  if (!row) return;
  row.classList.remove('flash-green', 'flash-red');
  void row.offsetWidth;
  row.classList.add(color === 'red' ? 'flash-red' : 'flash-green');
}
function redisFeed(msg, level = 'ok') {
  const box = $('#redis-feed');
  const el = document.createElement('div');
  el.className = `log-line log-${level}`;
  el.innerHTML = `<span class="log-ts">${clock().slice(0, 8)}</span><span class="break-words min-w-0">${msg}</span>`;
  box.appendChild(el);
  while (box.children.length > 30) box.firstChild.remove();
  box.scrollTop = box.scrollHeight;
}

/* ---------------------------------------------------------- *
 * ABA 4 — Arquitetura & Matriz
 * ---------------------------------------------------------- */
const arch = { selNode: null, selLayer: null, animating: false };

function nodeHtml(n) {
  return `<button type="button" class="node ${n.zona}" data-node="${n.id}" id="node-${n.id}" title="${n.nome}">
    <span class="ni"><i data-lucide="${n.icon}" class="w-4 h-4"></i></span>
    <span><span class="nt block">${n.nome}</span><span class="ns block">${n.tech}</span></span></button>`;
}

function renderArch() {
  let h = `
    <div style="grid-column:1;grid-row:1"></div>
    <div class="zone-head zone-cloud" style="grid-column:2;grid-row:1"><i data-lucide="cloud" class="w-4 h-4"></i>AMBIENTE CLOUD <span class="font-medium opacity-70 text-[11px]">SaaS · IaaS</span></div>
    <div style="grid-column:3;grid-row:2 / span 5" class="vpn-col"><div class="vpn-tunnel"></div><div class="vpn-label">TÚNEL VPN IPsec + mTLS</div></div>
    <div class="zone-head zone-onprem" style="grid-column:4;grid-row:1"><i data-lucide="building-2" class="w-4 h-4"></i>ON-PREMISE / EDGE <span class="font-medium opacity-70 text-[11px]">Lojas · CD · Sede</span></div>`;
  LAYERS.forEach((l, i) => {
    const row = i + 2;
    const cloud = NODES.filter((n) => n.layer === l.id && n.zona === 'cloud');
    const onp = NODES.filter((n) => n.layer === l.id && n.zona === 'onprem');
    h += `<button type="button" class="layer-label" data-layer="${l.id}" style="grid-column:1;grid-row:${row}">
        <span class="block text-[10px] font-extrabold text-indigo-300 tracking-widest">${l.id}</span>
        <span class="block text-[11px] font-bold text-slate-100 leading-tight mt-0.5">${l.nome}</span></button>
      <div class="arch-cell cell-cloud" style="grid-column:2;grid-row:${row}">${cloud.map(nodeHtml).join('') || '<span class="m-auto text-slate-600 text-xs">—</span>'}</div>
      <div class="arch-cell cell-onprem" style="grid-column:4;grid-row:${row}">${onp.map(nodeHtml).join('') || '<span class="m-auto text-slate-600 text-xs">—</span>'}</div>`;
  });
  $('#arch-map').innerHTML = h;
  $$('#arch-map [data-node]').forEach((b) => b.addEventListener('click', () => selectNode(b.dataset.node)));
  $$('#arch-map [data-layer]').forEach((b) => b.addEventListener('click', () => selectLayer(b.dataset.layer)));
  renderArchDetail();
  icons();
}

function applyArchHighlight() {
  const sn = NODES.find((n) => n.id === arch.selNode);
  $$('#arch-map .node').forEach((el) => {
    const n = NODES.find((x) => x.id === el.dataset.node);
    el.classList.remove('selected', 'dim');
    if (sn) {
      if (n.id === sn.id) el.classList.add('selected');
      else if (!sn.links.includes(n.id) && !n.links.includes(sn.id)) el.classList.add('dim');
    } else if (arch.selLayer && n.layer !== arch.selLayer) el.classList.add('dim');
  });
  $$('#arch-map .layer-label').forEach((el) => el.classList.toggle('active', el.dataset.layer === arch.selLayer || (sn && el.dataset.layer === sn.layer)));
}

function selectNode(id) {
  arch.selNode = id; arch.selLayer = null;
  applyArchHighlight(); renderArchDetail();
}
function selectLayer(id) {
  arch.selLayer = id; arch.selNode = null;
  applyArchHighlight(); renderArchDetail();
}

function reqBadge(id) { return `<span class="badge ${id.startsWith('RNF') ? 'b-rnf' : 'b-rf'}">${id}</span>`; }

function renderArchDetail() {
  const box = $('#arch-detail');
  const n = NODES.find((x) => x.id === arch.selNode);
  if (n) {
    const layer = LAYERS.find((l) => l.id === n.layer);
    const linked = NODES.filter((o) => n.links.includes(o.id) || o.links.includes(n.id));
    box.innerHTML = `<div class="grid lg:grid-cols-3 gap-5 items-start">
      <div class="lg:col-span-2">
        <div class="flex flex-wrap items-center gap-2 mb-2">
          <h3 class="text-lg font-extrabold text-white">${n.nome}</h3>
          <span class="badge ${n.zona === 'cloud' ? 'b-info' : 'b-loja'}">${n.zona === 'cloud' ? 'Cloud' : 'On-Premise / Edge'}</span>
          <span class="badge b-ecom">${layer.id} · ${layer.nome}</span></div>
        <p class="text-sm text-slate-300">${n.desc}</p>
        <p class="text-xs text-slate-400 mt-2"><b class="text-slate-300">Tecnologia:</b> ${n.tech}</p>
      </div>
      <div class="space-y-3">
        <div><div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Requisitos atendidos</div><div class="flex flex-wrap gap-1.5">${n.reqs.map(reqBadge).join('')}</div></div>
        <div><div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Conecta-se com</div><div class="flex flex-wrap gap-1.5">${linked.map((l) => `<button type="button" class="badge b-info cursor-pointer hover:brightness-125" data-jump="${l.id}">${l.nome}</button>`).join('')}</div></div>
      </div></div>`;
    $$('[data-jump]', box).forEach((b) => b.addEventListener('click', () => selectNode(b.dataset.jump)));
    return;
  }
  const l = LAYERS.find((x) => x.id === arch.selLayer);
  if (l) {
    box.innerHTML = `<h3 class="text-lg font-extrabold text-white">${l.id} · ${l.nome}</h3><p class="text-sm text-slate-300 mt-1">${l.desc}</p>
      <div class="flex flex-wrap gap-1.5 mt-3">${NODES.filter((x) => x.layer === l.id).map((x) => `<button type="button" class="badge ${x.zona === 'cloud' ? 'b-info' : 'b-loja'} cursor-pointer hover:brightness-125" data-jump="${x.id}">${x.nome}</button>`).join('')}</div>`;
    $$('[data-jump]', box).forEach((b) => b.addEventListener('click', () => selectNode(b.dataset.jump)));
    return;
  }
  box.innerHTML = `<div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
    <span class="font-bold text-slate-200 flex items-center gap-2"><i data-lucide="mouse-pointer-click" class="w-4 h-4 text-indigo-300"></i>Selecione um componente ou camada para ver detalhes.</span>
    <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-sky-400/40 border border-sky-400"></span>Cloud</span>
    <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-amber-400/40 border border-amber-400"></span>On-Premise / Edge</span>
    <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-indigo-500 border border-indigo-300"></span>Túnel VPN IPsec + mTLS</span></div>`;
  icons();
}

$('#btn-clear-arch').addEventListener('click', () => { arch.selNode = null; arch.selLayer = null; applyArchHighlight(); renderArchDetail(); });

const FLOW_STAGES = [
  { ids: ['ecom', 'pdv'], t: '1 · Canal envia a compra' },
  { ids: ['vpn', 'iam', 'gw'], t: '1 · Gateway valida OAuth2 / mTLS / Rate Limit' },
  { ids: ['cli360', 'pg'], t: '2 · Identificação por CPF (ID Único)' },
  { ids: ['broker'], t: '3 · Eventos publicados no Broker' },
  { ids: ['hub', 'redis'], t: '4 · Baixa de estoque no Redis' },
  { ids: ['wms'], t: '5 · Ordem de separação no WMS' },
  { ids: ['adapter', 'erp'], t: '6 · Faturamento D-0 no ERP' },
];
$('#btn-animate-flow').addEventListener('click', async () => {
  if (arch.animating) return;
  arch.animating = true;
  arch.selNode = null; arch.selLayer = null; applyArchHighlight();
  const box = $('#arch-detail');
  for (const st of FLOW_STAGES) {
    box.innerHTML = `<div class="flex items-center gap-3 text-sm font-semibold text-emerald-200"><i data-lucide="activity" class="w-4 h-4"></i>${st.t}</div>`;
    icons();
    st.ids.forEach((id) => $(`#node-${id}`).classList.add('pulse'));
    await new Promise((r) => setTimeout(r, 1000));
    st.ids.forEach((id) => $(`#node-${id}`).classList.remove('pulse'));
  }
  renderArchDetail();
  arch.animating = false;
});

/* ---- Matriz ---- */
const mx = { filter: 'all', q: '' };
function renderMatrix() {
  const rows = REQS.filter((r) => (mx.filter === 'all' || r.tipo === mx.filter)
    && (!mx.q || (r.id + r.titulo + r.req + r.decisao).toLowerCase().includes(mx.q.toLowerCase())));
  $('#cnt-all').textContent = `(${REQS.length})`;
  $('#cnt-rf').textContent = `(${REQS.filter((r) => r.tipo === 'RF').length})`;
  $('#cnt-rnf').textContent = `(${REQS.filter((r) => r.tipo === 'RNF').length})`;
  $('#matrix-body').innerHTML = rows.length ? rows.map((r) => `
    <tr>
      <td>${reqBadge(r.id)}</td>
      <td><div class="font-bold text-slate-100">${r.titulo}</div><div class="text-xs text-slate-400 mt-0.5 max-w-xs">${r.req}</div></td>
      <td class="text-xs text-slate-300 max-w-sm">${r.decisao}</td>
      <td><div class="flex flex-wrap gap-1 max-w-xs">${r.nodes.map((id) => `<button type="button" class="tech-chip cursor-pointer hover:brightness-125" data-node-jump="${id}">${NODES.find((n) => n.id === id).nome}</button>`).join('')}</div></td>
      <td><div class="flex flex-wrap gap-1">${r.layers.map((l) => `<span class="badge b-ecom">${l}</span>`).join('')}</div></td>
      <td><button type="button" class="btn btn-ghost btn-sm" data-demo="${r.demo.view}"><i data-lucide="play-circle" class="w-3.5 h-3.5"></i>${r.demo.label}</button></td>
    </tr>`).join('') : '<tr><td colspan="6" class="text-center text-slate-500 py-8">Nenhum requisito encontrado.</td></tr>';
  $$('#matrix-body [data-node-jump]').forEach((b) => b.addEventListener('click', () => {
    selectNode(b.dataset.nodeJump);
    $('#arch-map').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));
  $$('#matrix-body [data-demo]').forEach((b) => b.addEventListener('click', () => showView(b.dataset.demo)));
  $$('[data-req-filter]').forEach((b) => b.classList.toggle('active', b.dataset.reqFilter === mx.filter));
  icons();
}
$$('[data-req-filter]').forEach((b) => b.addEventListener('click', () => { mx.filter = b.dataset.reqFilter; renderMatrix(); }));
$('#req-search').addEventListener('input', (e) => { mx.q = e.target.value; renderMatrix(); });

/* ---------------------------------------------------------- *
 * Inicialização
 * ---------------------------------------------------------- */
function init() {
  renderOverview();
  renderTimeline();
  renderSimSelects();
  renderPanels();
  renderStock();
  renderSacSamples();
  renderSac();
  renderArch();
  renderMatrix();
  setChannel('ecom');
  log('sys', 'SIM', 'Ambiente VarejoTech TO-BE pronto · selecione o canal e execute a venda');
  const h = location.hash.replace('#', '');
  if (h && $('#' + h) && $('#' + h).classList.contains('view')) showView(h);
  icons();
}
document.addEventListener('DOMContentLoaded', init);
