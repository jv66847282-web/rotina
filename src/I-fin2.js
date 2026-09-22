
/* ===== GUIA ===== */
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
var invSel = null, aporteVal = 0;
var ALVO_PADRAO = {rf:50, fii:10, acao:15, rv:5, ext:10, cripto:10}, BANDA = 5;
function alvoDe(){ var a = (FIN.cfg && FIN.cfg.alvo) || ALVO_PADRAO; var o = {}; CLASSES.forEach(function(c){ o[c.id] = +a[c.id] || 0; }); return o; }
function diasDesde(iso){ if(!iso) return null; return Math.floor((agora().getTime() - new Date(iso).getTime()) / 864e5); }
function sheetAlvo(){
  var a = alvoDe();
  openSheet(function(sh){
    sh.appendChild(el('h3', null, 'Meta de alocação'));
    sh.appendChild(el('p', 'mini', 'Quanto de cada classe você quer na carteira (fora a reserva). Tem que somar 100%. Tolerância de ' + BANDA + ' pontos pra cada lado antes de acusar desvio.'));
    var soma = el('p', 'mini'); function upd(){ var t = 0; CLASSES.forEach(function(c){ t += +a[c.id] || 0; }); soma.textContent = 'Soma: ' + t + '%' + (t === 100 ? ' ✓' : ' (precisa dar 100)'); soma.style.color = t === 100 ? 'var(--good)' : 'var(--bad)'; return t; }
    CLASSES.forEach(function(c){ var i = el('input'); i.type = 'number'; i.min = 0; i.max = 100; i.step = 5; i.inputMode = 'numeric'; i.value = a[c.id]; i.addEventListener('input', function(){ a[c.id] = Math.max(0, Math.min(100, +i.value || 0)); upd(); }); sh.appendChild(campo(c.n + ' (%)', i, 'alvo-' + c.id)); });
    sh.appendChild(soma); upd();
    var b = el('button', 'btn primary wide', 'Salvar meta'); b.type = 'button'; b.id = 'alvoSave';
    b.addEventListener('click', function(){ if(upd() !== 100){ toast('A soma precisa dar 100%.'); return; } FIN.cfg = FIN.cfg || {}; FIN.cfg.alvo = a; finSave(); closeSheet(); renderInv(); toast('Meta salva.'); });
    sh.appendChild(b);
  });
}
$('editAlvo').addEventListener('click', sheetAlvo);
function sheetInv(a){
  var novo = !a; a = a ? clone(a) : {id:uid(), nome:'', classe:'rf', inst:'', aplicado:0, atual:0, reserva:false};
  openSheet(function(sh){
    sh.appendChild(el('h3', null, novo ? 'Novo investimento' : 'Editar investimento'));
    var inm = el('input'); inm.type = 'text'; inm.value = a.nome; inm.maxLength = 40; inm.placeholder = 'Ex.: CDB 110% CDI, Tesouro Selic, MXRF11'; inm.addEventListener('input', function(){ a.nome = inm.value; });
    sh.appendChild(campo('Nome', inm, 'inome'));
    sh.appendChild(el('p', 'mini', 'Classe')); sh.appendChild(chipsDe(CLASSES, a.classe, function(id){ a.classe = id; tickerRow.hidden = !MERCADO[id]; }, 'ic'));
    var tickerRow = el('div', 'field'); var lt = el('label', null, 'Código (ticker), se tiver'); lt.htmlFor = 'iticker'; var it = el('input'); it.type = 'text'; it.id = 'iticker'; it.value = a.ticker || ''; it.placeholder = 'Ex.: MXRF11, PETR4, IVVB11'; it.setAttribute('list', 'tickers'); it.autocapitalize = 'characters';
    var dl = el('datalist'); dl.id = 'tickers'; ['fii', 'acao', 'ext'].forEach(function(c){ MERCADO[c].forEach(function(m){ var op = el('option'); op.value = m[0]; op.label = m[1]; dl.appendChild(op); }); });
    it.addEventListener('change', function(){ a.ticker = it.value.toUpperCase().trim(); var hit = null; ['fii', 'acao', 'ext'].forEach(function(c){ MERCADO[c].forEach(function(m){ if(m[0] === a.ticker) hit = {c:c, m:m}; }); }); if(hit){ if(!a.nome || a.nome === a.ticker) { a.nome = hit.m[0] + ' · ' + hit.m[1]; inm.value = a.nome; } } var lk = linkMercado(a.classe, a.ticker); linkA.hidden = !lk; if(lk) linkA.href = lk; });
    tickerRow.appendChild(lt); tickerRow.appendChild(it); tickerRow.appendChild(dl); var linkA = el('a', 'linkbtn', 'Ver o ativo no Investidor10 →'); linkA.target = '_blank'; linkA.rel = 'noopener'; var lk0 = linkMercado(a.classe, a.ticker); linkA.hidden = !lk0; if(lk0) linkA.href = lk0; tickerRow.appendChild(linkA); tickerRow.hidden = !MERCADO[a.classe]; sh.appendChild(tickerRow);
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
  $('inv-carteira').hidden = invSeg !== 'carteira'; $('inv-aprender').hidden = invSeg !== 'aprender';
  $('invSegs').querySelectorAll('button').forEach(function(b){ b.setAttribute('aria-selected', b.getAttribute('data-seg') === invSeg ? 'true' : 'false'); });
  renderGloss();
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
    var lb = el('em', 'lbar'); var ls = el('s'); ls.style.width = (total ? v / total * 100 : 0) + '%'; lb.appendChild(ls); row.appendChild(lb);
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
      var dd = el('span'); dd.appendChild(el('span', 't', a.nome + (a.ticker && a.nome.indexOf(a.ticker) < 0 ? ' · ' + a.ticker : ''))); var ds = diasDesde(a.atualizadoEm), sub = el('span', 's', a.inst ? a.inst + ' · ' : ''); var id2 = el('span', 'idade' + (ds == null ? '' : ds > 90 ? ' bad' : ds > 30 ? ' warn' : ''), ds == null ? 'sem data' : ds === 0 ? 'atualizado hoje' : ds === 1 ? 'atualizado ontem' : 'atualizado há ' + ds + ' dias'); sub.appendChild(id2); dd.appendChild(sub); b.appendChild(dd);
      var v = el('span', 'v', fmt(a.atual)); if(+a.aplicado > 0){ var df = a.atual - a.aplicado; v.appendChild(el('small', df >= 0 ? 'g' : 'r', (df >= 0 ? '+' : '−') + fmt(Math.abs(df)))); } b.appendChild(v);
      b.addEventListener('click', function(){ sheetInv(a); }); box.appendChild(b);
    });
  });
  $('assetsSub').textContent = FIN.inv.length ? 'toca pra editar o valor' : '';
  renderJogo(); renderSugestao(); renderMercado(); renderPatrimonio();
  if(!aporteVal){ var sg0 = sugestaoMes(); if(sg0.valor > 0) aporteVal = Math.max(0, sg0.valor - sg0.jaFoi); }
  /* checkup */
  var ck = $('checkup'); ck.textContent = ''; ck.appendChild(el('h3', null, 'Checkup da carteira'));
  var alvo = alvoDe(), maior = 0, maiorN = ''; CLASSES.forEach(function(cl){ var v = por[cl.id] || 0; if(v > maior){ maior = v; maiorN = cl.n; } });
  var maiorPct = total ? maior / total * 100 : 0, criptoPct = total ? (por.cripto || 0) / total * 100 : 0, mesesRes = ess > 0 ? res / ess : null;
  var maxDias = 0; FIN.inv.forEach(function(a){ var d0 = diasDesde(a.atualizadoEm); if(d0 != null && d0 > maxDias) maxDias = d0; });
  var checks = [
    {f: mesesRes == null ? 'na' : mesesRes >= 3 ? 'ok' : mesesRes >= 1 ? 'mid' : 'bad', t: mesesRes == null ? 'Reserva: preenche as despesas essenciais na Planilha.' : 'Reserva cobre ' + mesesRes.toFixed(1).replace('.', ',') + ' meses.', s: mesesRes == null ? '' : mesesRes >= 3 ? 'Bom. Alvo final: 6.' : 'Meta 3 meses: faltam ' + fmt(Math.max(0, ess * 3 - res)) + '. Aporte vai aqui primeiro.'},
    {f: !total ? 'na' : maiorPct <= 70 ? 'ok' : maiorPct <= 85 ? 'mid' : 'bad', t: !total ? 'Carteira vazia.' : maiorN + ' é ' + Math.round(maiorPct) + '% da carteira.', s: !total ? '' : maiorPct <= 70 ? 'Concentração ok.' : 'Concentrado demais numa classe só.'},
    {f: !total ? 'na' : criptoPct <= alvo.cripto + BANDA ? 'ok' : criptoPct <= alvo.cripto + 2 * BANDA ? 'mid' : 'bad', t: 'Cripto em ' + Math.round(criptoPct) + '% (meta ' + alvo.cripto + '%).', s: criptoPct <= alvo.cripto + BANDA ? 'Dentro da faixa.' : 'Acima da meta: não aporta mais aqui até equilibrar.'},
    {f: !FIN.inv.length ? 'na' : maxDias <= 30 ? 'ok' : maxDias <= 90 ? 'mid' : 'bad', t: !FIN.inv.length ? 'Sem ativos.' : 'Valor mais antigo: ' + maxDias + (maxDias === 1 ? ' dia' : ' dias') + ' sem atualizar.', s: maxDias <= 30 ? 'Carteira em dia.' : 'Abre o app do banco e atualiza os valores. Número velho parece número certo.'}
  ];
  var cb2 = el('div', 'chk'); checks.forEach(function(c){ var d = el('div', c.f); d.appendChild(el('i')); var sp = el('span', null, c.t); if(c.s) sp.appendChild(el('small', null, c.s)); d.appendChild(sp); cb2.appendChild(d); }); ck.appendChild(cb2);
  /* alvo x real */
  var ac = $('alvoCard'); ac.textContent = ''; var al = el('div', 'alvo');
  CLASSES.forEach(function(cl){
    var v = por[cl.id] || 0, real = total ? v / total * 100 : 0, meta = alvo[cl.id], diff = real - meta, stt = Math.abs(diff) <= BANDA ? 'ok' : diff < 0 ? 'falta' : 'sobra';
    var row = el('div', 'alvo-row'); row.style.setProperty('--cc', cl.c);
    var n = el('span', 'n'); n.appendChild(el('i')); n.appendChild(document.createTextNode(cl.n)); n.appendChild(el('span', 'st ' + stt, stt === 'ok' ? 'na meta' : stt === 'falta' ? 'falta ' + Math.round(-diff) + ' pts' : 'sobra ' + Math.round(diff) + ' pts')); row.appendChild(n);
    var s = el('span', 's'); s.appendChild(el('b', null, Math.round(real) + '%')); s.appendChild(document.createTextNode(' / meta ' + meta + '%')); row.appendChild(s);
    var bar = el('div', 'bar2'), f = el('span'); f.style.width = Math.min(100, real) + '%'; bar.appendChild(f);
    var band = el('em'); band.style.left = Math.max(0, meta - BANDA) + '%'; band.style.width = (Math.min(100, meta + BANDA) - Math.max(0, meta - BANDA)) + '%'; bar.appendChild(band);
    var mk = el('i'); mk.style.left = meta + '%'; bar.appendChild(mk); row.appendChild(bar); al.appendChild(row);
  });
  ac.appendChild(al); ac.appendChild(el('p', 'small', 'A marca é a meta; a faixa clara é a tolerância de ' + BANDA + ' pontos. Você não vende pra ajustar: manda o dinheiro novo pra onde falta.'));
  /* onde aportar */
  var ap = $('aporteCard'); ap.textContent = ''; ap.appendChild(el('h3', null, 'Onde aportar este mês'));
  var am = el('div', 'amount'); am.appendChild(el('span', null, 'R$')); var ia = el('input'); ia.type = 'text'; ia.inputMode = 'decimal'; ia.id = 'aporteIn'; ia.placeholder = '0,00'; ia.value = aporteVal ? aporteVal.toLocaleString('pt-BR', {minimumFractionDigits:2}) : ''; ia.setAttribute('aria-label', 'Valor do aporte'); ia.addEventListener('change', function(){ aporteVal = parseBRL(ia.value); renderInv(); }); am.appendChild(ia); ap.appendChild(am);
  if(aporteVal > 0){
    var lista = el('div', 'aporte'), resto = aporteVal;
    if(ess > 0 && res < ess * 3){ var pr = Math.min(resto, ess * 3 - res); var d1 = el('div', 'dest'); d1.appendChild(el('span', null, 'Reserva de emergência (até 3 meses)')); d1.appendChild(el('b', null, fmt(pr))); lista.appendChild(d1); resto -= pr; }
    if(resto > 0){
      var tot2 = total + resto, gaps = {}, soma = 0; CLASSES.forEach(function(cl){ var g = alvo[cl.id] / 100 * tot2 - (por[cl.id] || 0); if(g > 0){ gaps[cl.id] = g; soma += g; } });
      CLASSES.forEach(function(cl){ if(!gaps[cl.id]) return; var v = resto * gaps[cl.id] / soma; var d2 = el('div', 'dest'); d2.appendChild(el('span', null, cl.n)); d2.appendChild(el('b', null, fmt(v))); lista.appendChild(d2); });
      if(!soma){ var d3 = el('div', 'dest'); d3.appendChild(el('span', null, 'Tudo na meta: divide na proporção da meta')); d3.appendChild(el('b', null, fmt(resto))); lista.appendChild(d3); }
    }
    ap.appendChild(lista); ap.appendChild(el('p', 'small', 'Regra: reserva primeiro até 3 meses; depois o dinheiro novo vai pra classe que está mais atrás da meta. Sem vender nada.'));
  } else ap.appendChild(el('p', 'small', 'Digita quanto vai investir este mês e o app diz onde colocar.'));
  var ig = $('invGuide'); ig.textContent = '';
  var itens = [['Rotativo antes de tudo', 'Dívida de cartão passa de 400% ao ano. Nenhum investimento paga isso. Zera primeiro.'], ['Reserva antes de carteira', 'Meio mês de custo essencial em CDB de liquidez diária ou Tesouro Selic, em conta separada. Depois 3, 6 e 12 meses. Só então renda variável.'], ['Aporte no dia em que o salário cai', 'Transferência agendada no mesmo dia que o dinheiro entra. O que fica na conta corrente vira gasto.']];
  CLASSES.forEach(function(cl){ itens.push([cl.n, CLASSE_INFO[cl.id]]); });
  itens.forEach(function(x){ var c = el('div', 'step open'); var h = el('div', 'step-head'); h.style.gridTemplateColumns = 'minmax(0,1fr)'; h.appendChild(el('span', 't', x[0])); c.appendChild(h); var bd = el('div', 'step-body'); bd.appendChild(el('p', null, x[1])); c.appendChild(bd); ig.appendChild(c); });
}
var invSeg = 'carteira';
$('invSegs').addEventListener('click', function(e){ var b = e.target.closest('button'); if(!b) return; invSeg = b.getAttribute('data-seg'); renderInv(); window.scrollTo(0, 0); });
var GLOSS = [['CDI', 'Taxa que os bancos usam entre si; anda colada na Selic. "100% do CDI" = rende igual a essa taxa.'], ['Selic', 'A taxa básica de juros do país, definida pelo Banco Central a cada 45 dias. Tudo de renda fixa gira em torno dela.'], ['Tesouro Selic', 'Título do governo que rende a Selic. Liquidez diária, risco mínimo. O padrão da reserva.'], ['CDB', 'Você empresta pro banco e ele te paga juros. Coberto pelo FGC até R$ 250 mil por banco.'], ['FGC', 'Fundo que devolve seu dinheiro (até R$ 250 mil por CPF por banco) se o banco quebrar. Cobre CDB, LCI, LCA, poupança. Não cobre fundos, ações nem Tesouro (que não precisa).'], ['Liquidez', 'Quão rápido o dinheiro volta pra sua conta. Diária = no mesmo dia ou no seguinte. Reserva precisa de liquidez diária.'], ['Marcação a mercado', 'O preço de um título muda todo dia conforme os juros. Se você vende antes do vencimento, pode receber menos do que colocou. Só afeta quem vende antes.'], ['ETF', 'Um fundo negociado em bolsa que compra uma cesta inteira (ex.: as 500 maiores dos EUA). Uma cota, centenas de empresas, taxa baixa.'], ['BDR', 'Recibo negociado na B3 que representa uma ação de fora (Apple, Microsoft). Jeito de ter dólar sem abrir conta fora.'], ['FII', 'Fundo imobiliário: cotas de um fundo que tem imóveis ou títulos imobiliários e distribui aluguel mensal, isento de IR pra pessoa física.'], ['Dividendo / provento', 'Parte do lucro que a empresa ou o fundo distribui pra quem tem a cota. Cai na conta, sem vender nada.'], ['IR regressivo', 'Imposto da renda fixa: 22,5% até 6 meses, caindo até 15% depois de 2 anos. Quanto mais tempo, menos imposto.'], ['Aporte', 'Dinheiro novo que você coloca num investimento. É o que o jogo conta.'], ['Alocação', 'Como a carteira se divide entre as classes. A meta é a divisão que você quer; o real é a de hoje.']];
function renderGloss(){ var ul = $('gloss'); ul.textContent = ''; GLOSS.forEach(function(g){ var li = el('li'); li.appendChild(el('b', null, g[0])); li.appendChild(el('span', null, g[1])); ul.appendChild(li); }); }
$('addAsset').addEventListener('click', function(){ sheetInv(); });
$('addAporte').addEventListener('click', function(){ sheetAporte(); });

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
$('finSegs').addEventListener('click', function(e){ var b = e.target.closest('button'); if(!b) return; finSeg = b.getAttribute('data-seg'); renderFin(); $('fab').hidden = finSeg === 'guia'; window.scrollTo(0, 0); });
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
  if(FIN.dividas && FIN.dividas.length){ var dv = dividasMes(); L.push('Dívidas: ' + FIN.dividas.length + ' · total ' + fmt(dv.saldo) + ' · parcelas ' + fmt(dv.parcelas) + '/mês' + (dv.rotativo ? ' · ROTATIVO' : '')); }
  if(cortes.length) L.push('Cortado da planilha: ' + fmt(cortes.reduce(function(a, o){ return a + (+o.valor || 0); }, 0)) + '/mês (' + cortes.map(function(o){ return o.nome; }).join(', ') + ')');
  var g = GUIA.filter(function(x){ return FIN.guia[x.id]; }).length; L.push('Guia: ' + g + ' de ' + GUIA.length + ' passos');
  return L.join('\n');
}
