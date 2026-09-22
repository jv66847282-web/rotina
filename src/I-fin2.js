
/* ===== GUIA ===== */
var GUIA = [
  {id:'raiox', t:'Raio-x de 90 dias', o:'Baixa o extrato de 90 dias de todas as contas e das faturas. Lança os gastos aqui (ou importa o CSV no Extrato) e marca "me arrependo" no que não precisava.', why:'Ninguém corta o que não vê. O total marcado como besteira é o seu vazamento, e é ele que vira mesada semanal.', crit:'90 dias lançados e cada gasto avulso com a etiqueta certa.', ev:'convenção'},
  {id:'planilha', t:'Planilha com o mês fraco', o:'Na aba Planilha, coloca a entrada prevista usando o seu mês FRACO, não o forte. Preenche o valor médio de cada despesa.', why:'Renda variável só cabe num orçamento se ele for feito pro pior cenário. Quem orça pelo mês bom vira dívida no mês ruim.', crit:'Entrada prevista preenchida e "sobra por mês" positiva.', ev:'moderada'},
  {id:'prolabore', t:'Pró-labore fixo, PJ separado da PF', o:'Define um valor fixo que a agência te paga todo mês no mesmo dia (Pix agendado da conta PJ pra PF). Fora dessa data, nada sai da PJ pra você.', why:'Transforma renda imprevisível em salário previsível. O que sobrar na PJ vira reserva da empresa.', crit:'Pix agendado recorrente criado e primeiro pagamento feito.', ev:'moderada'},
  {id:'friccao', t:'Tirar a tentação do caminho', o:'Apaga o cartão salvo dos apps de compra e delivery. Desinstala esses apps do celular. Descadastra de todo e-mail e notificação de promoção.', why:'Gente disciplinada não resiste mais: ela evita a tentação. E-mail de promoção aumentou o gasto em 37% em 70 experimentos.', crit:'Nenhum cartão salvo em app de compra e zero e-mail de loja na caixa de entrada.', ev:'forte'},
  {id:'depois', t:'Lista do Depois (72h)', o:'Deu vontade de comprar algo que não é essencial? Anota o nome e o valor e decide na sexta. Nada de "nunca": é "depois".', why:'Adiar sem data reduziu o desejo mais do que se proibir, em 4 experimentos.', crit:'Uma semana inteira sem compra não essencial no impulso.', ev:'moderada'},
  {id:'dividas', t:'Dívidas: rotativo e cheque especial primeiro', o:'Consulta o Registrato (Banco Central) e o Serasa. Lista cada dívida com saldo e juros em reais por mês. Rotativo do cartão e cheque especial vêm primeiro, sempre; pede parcelamento ou portabilidade pra uma linha mais barata. Entre dívidas parecidas, ataca a menor.', why:'O rotativo passa de 400% ao ano. Nenhum investimento chega perto disso: pagar essa dívida É o melhor investimento que existe.', crit:'Nenhum saldo em rotativo ou cheque especial.', ev:'forte'},
  {id:'mesada', t:'Caixinhas e mesada semanal', o:'No dia do pró-labore, um Pix agendado divide o dinheiro em caixinhas: contas fixas, dívida-alvo, exceções e "livre da semana". Toda segunda, só a mesada da semana vai pro cartão virtual.', why:'Dividir cria uma pausa antes de gastar e um marcador de meta. Acabou a mesada, acabou até segunda.', crit:'Caixinhas criadas e mesada da semana definida.', ev:'moderada'},
  {id:'reserva1', t:'Reserva: 1º degrau', o:'Guarda 1 mês de custo essencial num CDB de liquidez diária (100% do CDI ou mais) ou Tesouro Selic, em OUTRO banco, sem app na tela inicial. Marca esse investimento como "reserva" na aba Investir.', why:'Ter reserva foi o maior preditor de bem-estar financeiro numa pesquisa com 12 mil pessoas. Longe dos olhos, fica.', crit:'Reserva ≥ 1 mês de custo essencial.', ev:'forte'},
  {id:'revisao', t:'Revisão de sexta, 20 minutos', o:'Toda sexta: saldo das caixinhas, gasto da semana × mesada, Lista do Depois (compra ou apaga), quanto falta da dívida-alvo. Anota os três números e manda pra alguém de confiança.', why:'Monitorar o progresso aumenta a chance de bater a meta (138 estudos). Hora marcada tira a decisão de "olhar ou não".', crit:'4 sextas seguidas com a revisão feita.', ev:'forte'},
  {id:'reserva6', t:'Reserva: 3 e depois 6 meses', o:'Continua o Pix automático pra reserva até 3 meses de custo essencial. Como a sua renda varia, o alvo final é 6.', why:'Renda variável pede reserva maior: é ela que segura o mês fraco sem virar dívida.', crit:'Reserva ≥ 6 meses de custo essencial.', ev:'convenção'},
  {id:'investir', t:'Só agora: investir de verdade', o:'Com o rotativo zerado e a reserva no 1º degrau, começa a investir o que sobra, todo mês, no dia do pró-labore. Renda fixa primeiro; renda variável só com o que você aguenta ver cair.', why:'Investir com dívida cara é enxugar gelo. Investir sem reserva vira resgate no primeiro aperto.', crit:'Aporte mensal automático acontecendo há 3 meses.', ev:'moderada'}
];
var INDIC = [
  {t:'Sobra do mês', f:'(entrou − saiu) ÷ entrou', d:'Verde de 20% pra cima. Âmbar entre 10 e 20. Vermelho abaixo de 10. Poupar 20% da renda é a regra prática mais usada; com renda variável, a sobra do mês bom é o colchão do mês fraco.'},
  {t:'Custo essencial', f:'despesas essenciais da planilha ÷ renda base', d:'Verde até 50%. Âmbar até 70. Vermelho acima. Quanto mais o essencial come, menos sobra pra reserva e menor a margem no mês fraco.'},
  {t:'Reserva', f:'investimentos marcados como reserva ÷ custo essencial mensal', d:'Vermelho abaixo de 3 meses, âmbar de 3 a 6, verde de 6 pra cima. A planilha do Primo Pobre usa 6 × essenciais; com renda variável, é o mínimo.'},
  {t:'Besteira', f:'gastos marcados "me arrependo" ÷ entrou', d:'Verde até 5%. Âmbar até 15. Vermelho acima. É o único indicador que depende da sua honestidade na hora de lançar.'}
];
var MITOS = [
  ['"Poupança rende."', 'Rende menos que o CDB de liquidez diária e o Tesouro Selic, os dois com a mesma segurança e liquidez.'],
  ['"Parcelado sem juros não pesa."', 'Parcelar aumentou o gasto total, não só adiou. E parcelado com juros do cartão passou de 200% ao ano.'],
  ['"É só ganhar mais."', 'Ter reserva mínima esteve mais ligada ao bem-estar financeiro do que renda alta. Ganhar mais sem estrutura vira gasto.'],
  ['"Bitcoin é reserva."', 'Reserva é o que não pode cair pela metade no mês em que você precisa dela. Cripto pode.'],
  ['"Todo delivery é desperdício."', 'Gastar pra comprar tempo está ligado a mais satisfação. O corte é no que você marca como arrependimento, não em toda conveniência.']
];
function renderGuia(){
  var box = $('guide'); box.textContent = ''; var ok = 0;
  GUIA.forEach(function(g, i){
    var done = !!FIN.guia[g.id]; if(done) ok++;
    var card = el('div', 'step' + (done ? ' done' : '') + (stepOpen[g.id] ? ' open' : ''));
    var head = el('button', 'step-head'); head.type = 'button'; head.id = 'g-' + g.id; head.setAttribute('aria-expanded', stepOpen[g.id] ? 'true' : 'false');
    var num = el('span', 'num'); if(done) num.innerHTML = CHECK.replace('aria-hidden="true"', 'aria-hidden="true" style="width:14px;height:14px;stroke:currentColor;stroke-width:3;fill:none"'); else num.textContent = String(i + 1);
    head.appendChild(num); head.appendChild(el('span', 't', g.t));
    var ch = el('span', 'chev'); ch.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>'; head.appendChild(ch);
    head.addEventListener('click', function(){ stepOpen[g.id] = !stepOpen[g.id]; renderGuia(); });
    card.appendChild(head);
    var body = el('div', 'step-body');
    body.appendChild(el('p', null, g.o));
    body.appendChild(el('p', 'why', 'Por quê: ' + g.why));
    body.appendChild(el('p', 'why', 'Feito quando: ' + g.crit));
    body.appendChild(el('p', 'ev', 'evidência ' + g.ev));
    var b = el('button', 'btn small' + (done ? '' : ' primary'), done ? 'Desmarcar' : 'Marcar como feito'); b.type = 'button'; b.id = 'gd-' + g.id;
    b.addEventListener('click', function(){ FIN.guia[g.id] = !done; finSave(); renderGuia(); if(!done){ toast('Passo ' + (i + 1) + ' feito. Próximo.'); try{ if(navigator.vibrate) navigator.vibrate(12); }catch(e){} } });
    body.appendChild(b); card.appendChild(body); box.appendChild(card);
  });
  $('guideCount').textContent = ok + ' de ' + GUIA.length;
  var ib = $('indicadores'); ib.textContent = '';
  INDIC.forEach(function(x){ var c = el('div', 'step open'); var h = el('div', 'step-head'); h.style.gridTemplateColumns = 'minmax(0,1fr)'; h.appendChild(el('span', 't', x.t)); c.appendChild(h); var bd = el('div', 'step-body'); bd.appendChild(el('p', 'ev', x.f)); bd.appendChild(el('p', null, x.d)); c.appendChild(bd); ib.appendChild(c); });
  var mb = $('mitos'); mb.textContent = '';
  MITOS.forEach(function(m){ var li = el('li'); li.appendChild(el('span', 'entao', m[0])); li.appendChild(el('span', 'se', m[1])); mb.appendChild(li); });
}

/* ===== INVESTIR ===== */
var invSel = null;
function sheetInv(a){
  var novo = !a; a = a ? clone(a) : {id:uid(), nome:'', classe:'rf', inst:'', aplicado:0, atual:0, reserva:false};
  openSheet(function(sh){
    sh.appendChild(el('h3', null, novo ? 'Novo investimento' : 'Editar investimento'));
    var inm = el('input'); inm.type = 'text'; inm.value = a.nome; inm.maxLength = 40; inm.placeholder = 'Ex.: CDB 110% CDI, Tesouro Selic, MXRF11'; inm.addEventListener('input', function(){ a.nome = inm.value; });
    sh.appendChild(campo('Nome', inm, 'inome'));
    sh.appendChild(el('p', 'mini', 'Classe')); sh.appendChild(chipsDe(CLASSES, a.classe, function(id){ a.classe = id; }, 'ic'));
    var ii = el('input'); ii.type = 'text'; ii.value = a.inst; ii.maxLength = 30; ii.placeholder = 'Ex.: Nubank, XP, Binance'; ii.addEventListener('input', function(){ a.inst = ii.value; });
    sh.appendChild(campo('Onde está', ii, 'iinst'));
    var g2 = el('div', 'grid2');
    var ia = el('input'); ia.type = 'text'; ia.inputMode = 'decimal'; ia.placeholder = '0,00'; ia.value = a.aplicado ? (+a.aplicado).toLocaleString('pt-BR', {minimumFractionDigits:2}) : ''; ia.addEventListener('input', function(){ a.aplicado = parseBRL(ia.value); });
    g2.appendChild(campo('Quanto você colocou', ia, 'iapl'));
    var iv = el('input'); iv.type = 'text'; iv.inputMode = 'decimal'; iv.placeholder = '0,00'; iv.value = a.atual ? (+a.atual).toLocaleString('pt-BR', {minimumFractionDigits:2}) : ''; iv.addEventListener('input', function(){ a.atual = parseBRL(iv.value); });
    g2.appendChild(campo('Vale hoje', iv, 'iatual'));
    sh.appendChild(g2);
    var rw = el('label', 'switch'); var cr = el('input'); cr.type = 'checkbox'; cr.id = 'ires'; cr.checked = !!a.reserva; cr.addEventListener('change', function(){ a.reserva = cr.checked; });
    rw.appendChild(cr); rw.appendChild(document.createTextNode('É reserva de emergência (fica fora do gráfico)')); sh.appendChild(rw);
    sh.appendChild(el('p', 'mini', 'Reserva é só o que tem liquidez diária e não cai: CDB de liquidez diária, Tesouro Selic.'));
    var save = el('button', 'btn primary wide', 'Salvar'); save.type = 'button'; save.id = 'isave';
    save.addEventListener('click', function(){ if(!a.nome){ toast('Dá um nome.'); return; } if(!(a.atual > 0)){ toast('Quanto vale hoje?'); return; } a.atualizadoEm = new Date().toISOString(); var i = -1; FIN.inv.forEach(function(x, k){ if(x.id === a.id) i = k; }); if(i > -1) FIN.inv[i] = a; else FIN.inv.push(a); finSave(); closeSheet(); renderInv(); toast('Salvo.'); });
    sh.appendChild(save);
    if(!novo){ var del = el('button', 'btn small danger', 'Apagar'); del.type = 'button'; del.id = 'idel'; del.addEventListener('click', function(){ if(!confirm('Apagar "' + a.nome + '"?')) return; FIN.inv = FIN.inv.filter(function(x){ return x.id !== a.id; }); finSave(); closeSheet(); renderInv(); }); sh.appendChild(del); }
    setTimeout(function(){ if(novo) inm.focus(); }, 260);
  });
}
function renderInv(){
  var carteira = FIN.inv.filter(function(a){ return !a.reserva; }), total = carteira.reduce(function(s, a){ return s + (+a.atual || 0); }, 0);
  var aplicado = carteira.reduce(function(s, a){ return s + (+a.aplicado || 0); }, 0), res = reservaTotal(), tudo = total + res;
  $('invSub').textContent = FIN.inv.length ? FIN.inv.length + (FIN.inv.length === 1 ? ' ativo' : ' ativos') : '';
  var hero = $('invHero'); hero.textContent = ''; hero.className = 'hero';
  hero.appendChild(el('p', 'lbl', 'Patrimônio investido'));
  hero.appendChild(el('div', 'money big', fmt(tudo)));
  var two = el('div', 'two'); var a1 = el('div'); a1.appendChild(el('span', null, 'Carteira')); a1.appendChild(el('b', null, fmt(total))); var a2 = el('div'); a2.appendChild(el('span', null, 'Resultado')); var rent = aplicado > 0 ? (total - aplicado) : null; var bb = el('b', rent == null ? '' : rent >= 0 ? 'g' : 'r', rent == null ? '–' : (rent >= 0 ? '+' : '−') + fmt(Math.abs(rent)) + ' (' + (rent >= 0 ? '+' : '') + Math.round(rent / aplicado * 100) + '%)'); a2.appendChild(bb); two.appendChild(a1); two.appendChild(a2); hero.appendChild(two);
  if(!FIN.inv.length) hero.appendChild(el('p', 'msg', 'Nada cadastrado. Começa pela reserva de emergência, depois o resto.'));
  /* donut */
  var por = {}; carteira.forEach(function(a){ por[a.classe] = (por[a.classe] || 0) + (+a.atual || 0); });
  var d = $('donut'); d.textContent = ''; var leg = $('donutLeg'); leg.textContent = '';
  var svgNS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(svgNS, 'svg'); svg.setAttribute('viewBox', '0 0 120 120');
  var off = 0, fatias = CLASSES.filter(function(c){ return por[c.id] > 0; });
  if(!fatias.length){ var bg = document.createElementNS(svgNS, 'circle'); bg.setAttribute('r', '46'); bg.setAttribute('cx', '60'); bg.setAttribute('cy', '60'); bg.setAttribute('stroke', 'var(--surface-2)'); svg.appendChild(bg); }
  fatias.forEach(function(c){
    var p = por[c.id] / total * 100, gap = fatias.length > 1 ? 1.2 : 0, ci = document.createElementNS(svgNS, 'circle');
    ci.setAttribute('r', '46'); ci.setAttribute('cx', '60'); ci.setAttribute('cy', '60'); ci.setAttribute('pathLength', '100');
    ci.setAttribute('stroke', c.c); ci.setAttribute('stroke-dasharray', Math.max(0, p - gap) + ' ' + (100 - Math.max(0, p - gap))); ci.setAttribute('stroke-dashoffset', String(-off));
    ci.style.opacity = invSel && invSel !== c.id ? '.3' : '1'; ci.style.cursor = 'pointer'; ci.setAttribute('data-classe', c.id);
    ci.addEventListener('click', function(){ invSel = invSel === c.id ? null : c.id; renderInv(); });
    svg.appendChild(ci); off += p;
  });
  d.appendChild(svg);
  var c = el('div', 'c'), selC = invSel && por[invSel] ? classeDe(invSel) : null;
  if(selC){ c.appendChild(el('b', null, Math.round(por[invSel] / total * 100) + '%')); c.appendChild(el('span', null, selC.n)); }
  else { c.appendChild(el('b', null, total ? fmtK(total) : '–')); c.appendChild(el('span', null, 'carteira')); }
  d.appendChild(c);
  CLASSES.forEach(function(cl){
    var v = por[cl.id] || 0, row = el('div'); row.style.setProperty('--cc', cl.c); row.style.opacity = invSel && invSel !== cl.id ? '.45' : '1'; row.style.cursor = 'pointer';
    row.appendChild(el('i')); row.appendChild(el('span', null, cl.n)); row.appendChild(el('b', null, total ? Math.round(v / total * 100) + '% · ' + fmtK(v) : '0%'));
    row.addEventListener('click', function(){ invSel = invSel === cl.id ? null : cl.id; renderInv(); });
    leg.appendChild(row);
  });
  /* reserva */
  var rc = $('reservaCard'); rc.textContent = ''; var ess = essenciaisMes(), meta = ess * 6;
  rc.appendChild(el('h3', null, 'Reserva de emergência: ' + fmt(res)));
  if(ess > 0){
    var meses = res / ess, bar = el('div', 'ratio' + (meses >= 6 ? '' : meses >= 3 ? ' warn' : ' over')), f = el('span'); f.style.width = Math.min(100, res / meta * 100) + '%'; bar.appendChild(f);
    [1, 3].forEach(function(m){ var mk = el('i'); mk.style.left = (m / 6 * 100) + '%'; bar.appendChild(mk); }); rc.appendChild(bar);
    rc.appendChild(el('p', 'small', meses.toFixed(1).replace('.', ',') + ' meses de custo essencial. Degraus: 1 mês (' + fmt(ess) + '), 3 meses (' + fmt(ess * 3) + '), 6 meses (' + fmt(meta) + ').'));
  } else rc.appendChild(el('p', 'small', 'Preenche as despesas essenciais na Planilha pra calcular quantos meses a reserva cobre.'));
  /* lista */
  var box = $('assets'); box.textContent = '';
  var grupos = [{n:'Reserva de emergência', itens:FIN.inv.filter(function(a){ return a.reserva; }), c:'var(--good)'}].concat(CLASSES.map(function(cl){ return {n:cl.n, itens:carteira.filter(function(a){ return a.classe === cl.id; }), c:cl.c}; }));
  grupos.forEach(function(g){
    if(!g.itens.length) return;
    var hd = el('div', 'classhead'); hd.appendChild(el('span', null, g.n)); hd.appendChild(el('span', null, fmt(g.itens.reduce(function(s, a){ return s + (+a.atual || 0); }, 0)))); box.appendChild(hd);
    g.itens.forEach(function(a){
      var b = el('button', 'asset'); b.type = 'button'; b.id = 'inv-' + a.id; b.style.setProperty('--cc', g.c);
      var dd = el('span'); dd.appendChild(el('span', 't', a.nome)); dd.appendChild(el('span', 's', (a.inst ? a.inst + ' · ' : '') + 'atualizado ' + (a.atualizadoEm ? dataBR(a.atualizadoEm.slice(0, 10)) : '–'))); b.appendChild(dd);
      var v = el('span', 'v', fmt(a.atual)); if(+a.aplicado > 0){ var df = a.atual - a.aplicado; v.appendChild(el('small', df >= 0 ? 'g' : 'r', (df >= 0 ? '+' : '−') + fmt(Math.abs(df)))); } b.appendChild(v);
      b.addEventListener('click', function(){ sheetInv(a); }); box.appendChild(b);
    });
  });
  var ig = $('invGuide'); ig.textContent = '';
  [['Rotativo antes de tudo', 'Dívida de cartão passa de 400% ao ano. Nenhum investimento paga isso. Zera primeiro.'], ['Reserva antes de carteira', 'Um mês de custo essencial em CDB de liquidez diária ou Tesouro Selic, em outro banco. Só depois entra renda variável.'], ['Aporte no dia do pró-labore', 'Pix automático no mesmo dia que o dinheiro entra. O que fica na conta corrente vira gasto.'], ['Cripto é aposta, não reserva', 'Só o que você aguenta ver cair pela metade sem mexer na sua vida.']].forEach(function(x){ var c = el('div', 'step open'); var h = el('div', 'step-head'); h.style.gridTemplateColumns = 'minmax(0,1fr)'; h.appendChild(el('span', 't', x[0])); c.appendChild(h); var bd = el('div', 'step-body'); bd.appendChild(el('p', null, x[1])); c.appendChild(bd); ig.appendChild(c); });
}
$('addAsset').addEventListener('click', function(){ sheetInv(); });

/* ===== IMPORTAR CSV ===== */
function palpiteCat(desc){
  var d = (desc || '').toLowerCase();
  var R = [[/ifood|rappi|restaurante|lanch|burger|pizza|sushi|bar |padaria|cafe|café|mc ?donald|subway|outback|delivery/, 'restaurante'], [/netflix|spotify|amazon prime|disney|hbo|max\b|youtube|icloud|google one|apple\.com|assinatura|chatgpt|openai|adobe|canva|microsoft|notion/, 'assinaturas'], [/uber|99|taxi|posto|combust|gasolina|shell|ipiranga|estacion|pedagio|pedágio|onibus|ônibus|metro|metrô/, 'transporte'], [/mercado|supermerc|carrefour|assai|assaí|atacad|hortifruti|extra|pão de açúcar|pao de acucar|feira/, 'mercado'], [/farmac|farmác|drogaria|drogasil|raia|pague menos|medic|consulta|dentista|hospital|unimed|amil|hapvida/, 'saude'], [/aluguel|condom|iptu|imobili/, 'moradia'], [/luz|energia|enel|cemig|copel|light|agua|água|sabesp|gas\b|gás|internet|vivo|claro|tim\b|oi\b|net\b/, 'contas'], [/academia|smart ?fit|bluefit|crossfit|gym/, 'academia'], [/shopee|mercado livre|mercadolivre|amazon|aliexpress|magalu|magazine|americanas|casas bahia|renner|riachuelo|zara|shein|loja/, 'compras'], [/cinema|ingresso|show|steam|playstation|xbox|nintendo|jogo|viagem|hotel|airbnb|passagem/, 'lazer'], [/curso|udemy|hotmart|alura|escola|faculdade|livro/, 'educacao'], [/barbear|salao|salão|cabel|estetic|estétic/, 'cuidados'], [/juros|iof|tarifa|anuidade|encargo|multa|emprest|emprést|financ/, 'dividas']];
  for(var i = 0; i < R.length; i++) if(R[i][0].test(d)) return R[i][1];
  return 'outros';
}
function parseCSV(txt){
  var sep = (txt.match(/;/g) || []).length > (txt.match(/,/g) || []).length ? ';' : ',', linhas = [], cur = [], campo = '', q = false;
  for(var i = 0; i < txt.length; i++){ var ch = txt[i];
    if(q){ if(ch === '"'){ if(txt[i+1] === '"'){ campo += '"'; i++; } else q = false; } else campo += ch; }
    else if(ch === '"') q = true; else if(ch === sep){ cur.push(campo); campo = ''; } else if(ch === '\n' || ch === '\r'){ if(ch === '\r' && txt[i+1] === '\n') i++; cur.push(campo); if(cur.some(function(x){ return x.trim(); })) linhas.push(cur); cur = []; campo = ''; } else campo += ch; }
  cur.push(campo); if(cur.some(function(x){ return x.trim(); })) linhas.push(cur);
  return linhas;
}
function dataISO(s){
  s = String(s || '').trim(); var m;
  if((m = s.match(/^(\d{4})-(\d{2})-(\d{2})/))) return m[1] + '-' + m[2] + '-' + m[3];
  if((m = s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/))) return m[3] + '-' + pad(m[2]) + '-' + pad(m[1]);
  if((m = s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2})$/))) return '20' + m[3] + '-' + pad(m[2]) + '-' + pad(m[1]);
  return null;
}
function importarCSV(txt){
  var L = parseCSV(txt); if(L.length < 2){ toast('Arquivo vazio ou sem cabeçalho.'); return; }
  var head = L[0].map(function(h){ return h.toLowerCase().trim(); });
  function col(re){ for(var i = 0; i < head.length; i++) if(re.test(head[i])) return i; return -1; }
  var cD = col(/^data|date|dia/), cV = col(/valor|amount|value|montante/), cT = col(/descri|hist|title|t[ií]tulo|memo|estabelec|lan[cç]amento|nome/), cC = col(/categ/);
  if(cD < 0 || cV < 0){ toast('Não achei as colunas de data e valor. Precisa ter cabeçalho com "data" e "valor".'); return; }
  var itens = [];
  for(var i = 1; i < L.length; i++){
    var r = L[i], dt = dataISO(r[cD]), v = parseBRL(r[cV]); if(!dt || !v) continue;
    itens.push({data:dt, valor:Math.abs(v), neg:v < 0, desc:(cT > -1 ? r[cT] : '').trim().slice(0, 60), catSrc:cC > -1 ? r[cC] : ''});
  }
  if(!itens.length){ toast('Nenhuma linha válida.'); return; }
  var temNeg = itens.some(function(x){ return x.neg; }), temPos = itens.some(function(x){ return !x.neg; });
  openSheet(function(sh){
    sh.appendChild(el('h3', null, 'Importar ' + itens.length + ' lançamentos'));
    sh.appendChild(el('p', 'mini', 'De ' + dataBR(itens.reduce(function(a, x){ return x.data < a ? x.data : a; }, itens[0].data)) + ' a ' + dataBR(itens.reduce(function(a, x){ return x.data > a ? x.data : a; }, itens[0].data)) + '. A categoria é um palpite pelo nome; você ajusta depois tocando no lançamento.'));
    var sc = selectDe(FIN.contas.map(function(c){ return [c.id, c.nome]; }), (FIN.contas[0] || {}).id); sh.appendChild(campo('Conta / cartão desses lançamentos', sc, 'impconta'));
    var modo = 'auto';
    var so = selectDe([['auto', temNeg && temPos ? 'Negativo = gasto, positivo = ganho (extrato)' : 'Tudo é gasto (fatura de cartão)'], ['gasto', 'Tudo é gasto'], ['auto2', 'Negativo = gasto, positivo = ganho']], 'auto'); so.addEventListener('change', function(){ modo = so.value; }); sh.appendChild(campo('Como ler os valores', so, 'impmodo'));
    var b = el('button', 'btn primary wide', 'Importar'); b.type = 'button'; b.id = 'impok';
    b.addEventListener('click', function(){
      var n = 0, dup = 0;
      itens.forEach(function(x){
        var tipo = (modo === 'gasto' || (modo === 'auto' && !(temNeg && temPos))) ? 'gasto' : (x.neg ? 'gasto' : 'ganho');
        var ja = FIN.lanc.some(function(t){ return t.data === x.data && Math.abs(t.valor - x.valor) < 0.005 && (t.desc || '') === x.desc; }); if(ja){ dup++; return; }
        FIN.lanc.push({id:uid(), tipo:tipo, valor:x.valor, desc:x.desc || (tipo === 'gasto' ? 'Gasto importado' : 'Entrada importada'), cat:tipo === 'gasto' ? palpiteCat(x.desc + ' ' + x.catSrc) : 'outrosg', conta:sc.value, data:x.data, arrep:false, orc:null, importado:true, atualizadoEm:new Date().toISOString()}); n++;
      });
      finSave(); closeSheet(); render(); toast(n + ' importados' + (dup ? ', ' + dup + ' já existiam' : '') + '.', 3500);
    });
    sh.appendChild(b);
  });
}
$('importCsv').addEventListener('click', function(){ $('csvFile').click(); });
$('csvFile').addEventListener('change', function(){ var f = this.files && this.files[0]; if(!f) return; var rd = new FileReader(); rd.onload = function(){ importarCSV(String(rd.result)); }; rd.readAsText(f, 'utf-8'); this.value = ''; });

/* ===== integracao ===== */
function renderFin(){
  $('fmName').textContent = MESL[fm.getMonth()]; $('fmSub').textContent = String(fm.getFullYear());
  $('fmNext').disabled = new Date(fm.getFullYear(), fm.getMonth() + 1, 1) > new Date(agora().getFullYear(), agora().getMonth() + 1, 1);
  ['mes', 'extrato', 'planilha', 'contas', 'guia'].forEach(function(s){ $('fin-' + s).hidden = s !== finSeg; });
  $('finSegs').querySelectorAll('button').forEach(function(b){ b.setAttribute('aria-selected', b.getAttribute('data-seg') === finSeg ? 'true' : 'false'); });
  if(finSeg === 'mes') renderFinMes(); else if(finSeg === 'extrato') renderExtrato(); else if(finSeg === 'planilha') renderPlanilha(); else if(finSeg === 'contas') renderContas(); else renderGuia();
}
$('finSegs').addEventListener('click', function(e){ var b = e.target.closest('button'); if(!b) return; finSeg = b.getAttribute('data-seg'); renderFin(); window.scrollTo(0, 0); });
$('fmPrev').addEventListener('click', function(){ fm = new Date(fm.getFullYear(), fm.getMonth() - 1, 1); renderFin(); });
$('fmNext').addEventListener('click', function(){ fm = new Date(fm.getFullYear(), fm.getMonth() + 1, 1); renderFin(); });
$('verExtrato').addEventListener('click', function(){ finSeg = 'extrato'; renderFin(); window.scrollTo(0, 0); });
$('fab').addEventListener('click', function(){ sheetLanc(); });
function resumoFin(){
  var s = saude(fm), r = s.r, L = [];
  L.push('Finanças (' + MESL[fm.getMonth()].toLowerCase() + '): entrou ' + fmt(r.ganhos) + ' · saiu ' + fmt(r.gastos) + ' · sobra ' + fmt(r.sobra) + ' · besteira ' + fmt(r.arrep) + ' (' + r.nArrep + ')');
  L.push('Indicadores: sobra ' + s.poup.txt + ' · essencial/renda ' + s.fixo.txt + ' · reserva ' + s.reserva.txt + ' · besteira ' + s.best.txt);
  var por = {}; lancMes(fm).filter(function(t){ return t.tipo === 'gasto'; }).forEach(function(t){ por[t.cat] = (por[t.cat] || 0) + (+t.valor || 0); });
  var top = Object.keys(por).sort(function(a, b){ return por[b] - por[a]; }).slice(0, 3).map(function(id){ return catDe(id).n + ' ' + fmt(por[id]); });
  if(top.length) L.push('Top gastos: ' + top.join(' · '));
  var cortes = FIN.orc.ess.concat(FIN.orc.nao).filter(function(o){ return o.cortadoEm; });
  if(cortes.length) L.push('Cortado da planilha: ' + fmt(cortes.reduce(function(a, o){ return a + (+o.valor || 0); }, 0)) + '/mês (' + cortes.map(function(o){ return o.nome; }).join(', ') + ')');
  var g = GUIA.filter(function(x){ return FIN.guia[x.id]; }).length; L.push('Guia: ' + g + ' de ' + GUIA.length + ' passos');
  return L.join('\n');
}
