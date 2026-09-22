
/* ===== FINANCAS ===== */
var CATS = [
  {id:'moradia', n:'Moradia', c:'#6F8CFF', g:'ess'},
  {id:'contas', n:'Contas da casa', c:'#4FB3E8', g:'ess'},
  {id:'mercado', n:'Mercado', c:'#3DDC97', g:'ess'},
  {id:'transporte', n:'Transporte', c:'#FFC24B', g:'ess'},
  {id:'saude', n:'Saúde', c:'#FF7486', g:'ess'},
  {id:'educacao', n:'Educação', c:'#B9A2FF', g:'ess'},
  {id:'familia', n:'Família', c:'#F2669F', g:'ess'},
  {id:'dividas', n:'Dívidas e juros', c:'#E04B5A', g:'ess'},
  {id:'restaurante', n:'Restaurante e iFood', c:'#FF9A4D', g:'nao'},
  {id:'assinaturas', n:'Assinaturas', c:'#A97BFF', g:'nao'},
  {id:'compras', n:'Compras', c:'#FF7A66', g:'nao'},
  {id:'lazer', n:'Lazer', c:'#F2A34A', g:'nao'},
  {id:'academia', n:'Academia', c:'#2FC4B2', g:'nao'},
  {id:'cuidados', n:'Cuidados pessoais', c:'#E88AC0', g:'nao'},
  {id:'presentes', n:'Presentes', c:'#FFD166', g:'nao'},
  {id:'outros', n:'Outros', c:'#9A9CBA', g:'nao'}
];
var CATS_G = [
  {id:'cliente', n:'Cliente / agência', c:'#3DDC97'},
  {id:'prolabore', n:'Pró-labore', c:'#2FC4B2'},
  {id:'freela', n:'Freelance', c:'#4FB3E8'},
  {id:'reembolso', n:'Reembolso', c:'#9A9CBA'},
  {id:'outrosg', n:'Outros', c:'#B9A2FF'}
];
var TIPOS_CONTA = [['credito','Cartão de crédito'],['debito','Débito / conta'],['pix','Pix'],['dinheiro','Dinheiro']];
var CORES = ['#8A05BE','#FF7A00','#00A868','#EC7000','#CC092F','#0057FF','#FFC24B','#6F8CFF','#3DDC97','#F2669F','#2FC4B2','#9A9CBA'];
var CLASSES = [
  {id:'rf', n:'Renda fixa', c:'#5B9CF6', d:'Tesouro Selic, CDB, LCI/LCA. É onde mora a reserva.'},
  {id:'fii', n:'Fundos imobiliários', c:'#A78BFA', d:'Cotas de fundos que vivem de aluguel. Pagam renda mensal, oscilam.'},
  {id:'acao', n:'Ações', c:'#F472B6', d:'Pedaços de empresas. Longo prazo, sobe e desce.'},
  {id:'rv', n:'Renda variável (outros)', c:'#22C7D6', d:'ETFs, fundos multimercado, BDRs.'},
  {id:'cripto', n:'Bitcoin e cripto', c:'#F7931A', d:'Altíssima oscilação. Só o que você aguenta ver cair pela metade.'}
];
function catDe(id, tipo){ var L = tipo === 'ganho' ? CATS_G : CATS; return L.filter(function(c){ return c.id === id; })[0] || (tipo === 'ganho' ? CATS_G[CATS_G.length-1] : CATS[CATS.length-1]); }
function classeDe(id){ return CLASSES.filter(function(c){ return c.id === id; })[0] || CLASSES[0]; }
function contaDe(id){ return FIN.contas.filter(function(c){ return c.id === id; })[0] || null; }

var BRL = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
function fmt(n){ return BRL.format(Math.round((n || 0) * 100) / 100); }
var BRL0 = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL', maximumFractionDigits:0});
function fmtK(n){ n = n || 0; return Math.abs(n) >= 100000 ? 'R$ ' + (n/1000).toLocaleString('pt-BR', {maximumFractionDigits:0}) + ' mil' : BRL0.format(Math.round(n)); }
function parseBRL(s){
  s = String(s || '').replace(/[^\d.,-]/g, '');
  if(!s) return 0;
  if(s.indexOf(',') > -1) s = s.replace(/\./g, '').replace(',', '.');
  else if(/\.\d{1,2}$/.test(s) && (s.match(/\./g) || []).length === 1){ /* 12.5 -> decimal */ }
  else s = s.replace(/\./g, '');
  var v = parseFloat(s); return isNaN(v) ? 0 : v;
}
function pct(a, b){ return b > 0 ? Math.round(a / b * 100) : null; }
function mesKey(d){ return d.getFullYear() + '-' + pad(d.getMonth() + 1); }
function dataBR(k){ var p = k.split('-'); return p[2] + '/' + p[1]; }

/* estado */
var FIN = null, fm = new Date(agora().getFullYear(), agora().getMonth(), 1), finSeg = 'mes', txFiltro = '', stepOpen = {};
function planilhaOriginal(){
  var ess = ['Moradia (aluguel/financiamento)','Condomínio','Supermercado','Água','Luz','Gás','IPTU','Plano de saúde','Seguro de vida','Investimentos (todo mês)'];
  var nao = ['Academia','Aplicativos e assinaturas','Celular','Combustível','Empréstimos','Cursos','Farmácia','Financiamento de veículo','Gastos com animais','Imprevistos (média)','Transporte','Internet','Lazer','Streaming','Padaria e feira','Restaurantes e iFood','Salão e barbeiro','Tarifas bancárias'];
  var mapa = {'Moradia':'moradia','Condomínio':'moradia','Supermercado':'mercado','Água':'contas','Luz':'contas','Gás':'contas','IPTU':'moradia','Plano':'saude','Seguro':'saude','Investimentos':'outros','Academia':'academia','Aplicativos':'assinaturas','Celular':'contas','Combustível':'transporte','Empréstimos':'dividas','Cursos':'educacao','Farmácia':'saude','Financiamento':'transporte','Gastos com animais':'familia','Imprevistos':'outros','Transporte':'transporte','Internet':'contas','Lazer':'lazer','Streaming':'assinaturas','Padaria':'mercado','Restaurantes':'restaurante','Salão':'cuidados','Tarifas':'outros'};
  function cat(n){ for(var k in mapa) if(n.indexOf(k) === 0) return mapa[k]; return 'outros'; }
  return {
    rec: [{id:'r_prolabore', nome:'Pró-labore (agência)', valor:0}],
    ess: ess.map(function(n){ return {id:uid(), nome:n, valor:0, cat:cat(n), cortadoEm:null}; }),
    nao: nao.map(function(n){ return {id:uid(), nome:n, valor:0, cat:cat(n), cortadoEm:null}; })
  };
}
function finVazio(){ return {contas:[{id:'c_pix', nome:'Pix / conta', tipo:'pix', cor:'#6F8CFF'}], lanc:[], orc:planilhaOriginal(), inv:[], guia:{}, cfg:{}}; }
function finLoad(){ FIN = ler('fin', null); if(!FIN || !FIN.orc || !FIN.contas){ FIN = finVazio(); } if(!FIN.inv) FIN.inv = []; if(!FIN.guia) FIN.guia = {}; if(!FIN.lanc) FIN.lanc = []; }
function finSave(){ gravar('fin', FIN); }

/* contas do mes */
function lancMes(d){ var k = mesKey(d); return FIN.lanc.filter(function(t){ return t.data && t.data.slice(0, 7) === k; }); }
function somaTipo(L, tipo){ return L.filter(function(t){ return t.tipo === tipo; }).reduce(function(a, t){ return a + (+t.valor || 0); }, 0); }
function orcAtivo(lista){ return lista.filter(function(o){ return !o.cortadoEm && (+o.valor || 0) > 0; }); }
function orcTotal(lista){ return orcAtivo(lista).reduce(function(a, o){ return a + (+o.valor || 0); }, 0); }
function pagos(d){ var m = {}; lancMes(d).forEach(function(t){ if(t.orc) m[t.orc] = (m[t.orc] || 0) + (+t.valor || 0); }); return m; }
function rendaBase(d){
  /* renda prevista da planilha; se nao tiver, media dos ganhos dos ultimos 3 meses; se nao, ganhos do mes */
  var prev = FIN.orc.rec.reduce(function(a, r){ return a + (+r.valor || 0); }, 0);
  if(prev > 0) return prev;
  var soma = 0, n = 0;
  for(var i = 0; i < 3; i++){ var dd = new Date(d.getFullYear(), d.getMonth() - i, 1), g = somaTipo(lancMes(dd), 'ganho'); if(g > 0){ soma += g; n++; } }
  return n ? soma / n : 0;
}
function reservaTotal(){ return FIN.inv.filter(function(i){ return i.reserva; }).reduce(function(a, i){ return a + (+i.atual || 0); }, 0); }
function essenciaisMes(){ var t = orcTotal(FIN.orc.ess); if(t > 0) return t; var L = lancMes(fm).filter(function(x){ return x.tipo === 'gasto' && catDe(x.cat).g === 'ess'; }); return L.reduce(function(a, x){ return a + (+x.valor || 0); }, 0); }
function resumoMes(d){
  var L = lancMes(d), ganhos = somaTipo(L, 'ganho'), gastos = somaTipo(L, 'gasto');
  var pg = pagos(d), aPagar = 0;
  FIN.orc.ess.concat(FIN.orc.nao).forEach(function(o){ if(!o.cortadoEm && (+o.valor || 0) > 0 && !pg[o.id]) aPagar += +o.valor; });
  var arrep = L.filter(function(t){ return t.tipo === 'gasto' && t.arrep; }).reduce(function(a, t){ return a + (+t.valor || 0); }, 0);
  var nArrep = L.filter(function(t){ return t.tipo === 'gasto' && t.arrep; }).length;
  return {ganhos:ganhos, gastos:gastos, sobra:ganhos - gastos, aPagar:aPagar, projecao:gastos + aPagar, arrep:arrep, nArrep:nArrep, n:L.length};
}
function saude(d){
  var r = resumoMes(d), renda = rendaBase(d), ess = essenciaisMes(), res = reservaTotal();
  function faixa(v, verde, ambar, inverso){ if(v == null) return 'na'; if(inverso) return v <= verde ? 'ok' : v <= ambar ? 'mid' : 'bad'; return v >= verde ? 'ok' : v >= ambar ? 'mid' : 'bad'; }
  var poup = r.ganhos > 0 ? (r.sobra / r.ganhos) * 100 : null;
  var fixo = renda > 0 && ess > 0 ? (ess / renda) * 100 : null;
  var meses = ess > 0 ? res / ess : null;
  var best = r.ganhos > 0 ? (r.arrep / r.ganhos) * 100 : (r.gastos > 0 ? (r.arrep / r.gastos) * 100 : null);
  return {
    r:r, renda:renda, ess:ess, res:res,
    poup:{v:poup, f:faixa(poup, 20, 10), txt: poup == null ? '–' : Math.round(poup) + '%', s:'do que entrou sobrou'},
    fixo:{v:fixo, f:faixa(fixo, 50, 70, true), txt: fixo == null ? '–' : Math.round(fixo) + '%', s:'da renda vai pro essencial'},
    reserva:{v:meses, f:faixa(meses, 6, 3), txt: meses == null ? '–' : (meses >= 10 ? Math.round(meses) : meses.toFixed(1).replace('.', ',')) + ' meses', s:'de custo essencial guardados'},
    best:{v:best, f:faixa(best, 5, 15, true), txt: best == null ? '–' : Math.round(best) + '%', s:'foi pra besteira'}
  };
}

/* folha */
function openSheet(build){
  var sh = $('sheet'), bg = $('sheetBg'); sh.textContent = ''; sh.appendChild(el('div', 'grip'));
  build(sh); sh.hidden = false; bg.hidden = false;
  requestAnimationFrame(function(){ sh.classList.add('show'); bg.classList.add('show'); });
  document.body.style.overflow = 'hidden';
}
function closeSheet(){ var sh = $('sheet'), bg = $('sheetBg'); sh.classList.remove('show'); bg.classList.remove('show'); document.body.style.overflow = ''; setTimeout(function(){ sh.hidden = true; bg.hidden = true; sh.textContent = ''; }, 220); }
$('sheetBg').addEventListener('click', closeSheet);
function campo(label, input, id){ var f = el('div', 'field'); var l = el('label', null, label); if(id){ input.id = id; l.htmlFor = id; } f.appendChild(l); f.appendChild(input); return f; }
function chipsDe(lista, atual, onPick, idp){
  var box = el('div', 'chips');
  lista.forEach(function(c){
    var b = el('button'); b.type = 'button'; b.id = idp + '-' + c.id; b.setAttribute('aria-pressed', atual === c.id ? 'true' : 'false');
    if(c.c){ var i = el('i'); i.style.setProperty('--cc', c.c); b.appendChild(i); }
    b.appendChild(document.createTextNode(c.n));
    b.addEventListener('click', function(){ onPick(c.id); box.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); });
    box.appendChild(b);
  });
  return box;
}
function selectDe(opts, atual){ var s = el('select'); opts.forEach(function(o){ var op = el('option', null, o[1]); op.value = o[0]; if(o[0] === atual) op.selected = true; s.appendChild(op); }); return s; }

/* lancamento */
function sheetLanc(t){
  var novo = !t; t = t ? clone(t) : {id:uid(), tipo:'gasto', valor:0, desc:'', cat:'', conta:(FIN.contas[0] || {}).id || '', data:keyOf(midnight(agora())), arrep:false, orc:null};
  if(!t.cat) t.cat = t.tipo === 'ganho' ? 'cliente' : '';
  openSheet(function(sh){
    sh.appendChild(el('h3', null, novo ? 'Lançar' : 'Editar lançamento'));
    var seg = el('div', 'segctl'); var bG = el('button', null, 'Gasto'), bR = el('button', null, 'Ganho'); bG.type = bR.type = 'button'; bG.id = 'lt-gasto'; bR.id = 'lt-ganho';
    function segSet(){ bG.setAttribute('aria-selected', t.tipo === 'gasto' ? 'true' : 'false'); bR.setAttribute('aria-selected', t.tipo === 'ganho' ? 'true' : 'false'); catBox.replaceWith(catBox = chipsDe(t.tipo === 'ganho' ? CATS_G : CATS, t.cat, function(id){ t.cat = id; }, 'lc')); arrepRow.hidden = t.tipo !== 'gasto'; orcRow.hidden = t.tipo !== 'gasto'; }
    bG.addEventListener('click', function(){ t.tipo = 'gasto'; if(!catDe(t.cat, 'gasto') || CATS_G.some(function(c){ return c.id === t.cat; })) t.cat = ''; segSet(); });
    bR.addEventListener('click', function(){ t.tipo = 'ganho'; t.arrep = false; t.orc = null; if(!CATS_G.some(function(c){ return c.id === t.cat; })) t.cat = 'cliente'; segSet(); });
    seg.appendChild(bG); seg.appendChild(bR); sh.appendChild(seg);
    var am = el('div', 'amount'); am.appendChild(el('span', null, 'R$'));
    var iv = el('input'); iv.type = 'text'; iv.inputMode = 'decimal'; iv.id = 'lv'; iv.placeholder = '0,00'; iv.value = t.valor ? t.valor.toLocaleString('pt-BR', {minimumFractionDigits:2}) : ''; iv.setAttribute('aria-label', 'Valor');
    iv.addEventListener('input', function(){ t.valor = parseBRL(iv.value); });
    am.appendChild(iv); sh.appendChild(am);
    var idesc = el('input'); idesc.type = 'text'; idesc.value = t.desc; idesc.placeholder = 'Ex.: iFood, Netflix, cliente X'; idesc.maxLength = 60;
    idesc.addEventListener('input', function(){ t.desc = idesc.value; });
    sh.appendChild(campo('Descrição', idesc, 'ldesc'));
    sh.appendChild(el('p', 'mini', 'Categoria'));
    var catBox = chipsDe(t.tipo === 'ganho' ? CATS_G : CATS, t.cat, function(id){ t.cat = id; }, 'lc'); sh.appendChild(catBox);
    var g2 = el('div', 'grid2');
    var sc = selectDe(FIN.contas.map(function(c){ return [c.id, c.nome]; }), t.conta); sc.addEventListener('change', function(){ t.conta = sc.value; });
    g2.appendChild(campo('Conta / cartão', sc, 'lconta'));
    var idt = el('input'); idt.type = 'date'; idt.value = t.data; idt.addEventListener('change', function(){ if(idt.value) t.data = idt.value; });
    g2.appendChild(campo('Data', idt, 'ldata'));
    sh.appendChild(g2);
    var arrepRow = el('label', 'switch'); var ca = el('input'); ca.type = 'checkbox'; ca.id = 'larrep'; ca.checked = !!t.arrep; ca.addEventListener('change', function(){ t.arrep = ca.checked; });
    arrepRow.appendChild(ca); arrepRow.appendChild(document.createTextNode('Me arrependo (besteira, dava pra não gastar)')); sh.appendChild(arrepRow);
    var orcRow = el('div', 'field'); var lo = el('label', null, 'É uma conta da planilha?'); lo.htmlFor = 'lorc';
    var so = selectDe([['', 'Não, gasto avulso']].concat(FIN.orc.ess.concat(FIN.orc.nao).filter(function(o){ return !o.cortadoEm; }).map(function(o){ return [o.id, o.nome + (o.valor ? ' · ' + fmt(o.valor) : '')]; })), t.orc || '');
    so.id = 'lorc'; so.addEventListener('change', function(){ t.orc = so.value || null; var o = FIN.orc.ess.concat(FIN.orc.nao).filter(function(x){ return x.id === so.value; })[0]; if(o){ if(!t.valor && o.valor){ t.valor = +o.valor; iv.value = t.valor.toLocaleString('pt-BR', {minimumFractionDigits:2}); } if(!t.desc){ t.desc = o.nome; idesc.value = o.nome; } if(!t.cat){ t.cat = o.cat; catBox.replaceWith(catBox = chipsDe(CATS, t.cat, function(id){ t.cat = id; }, 'lc')); } } });
    orcRow.appendChild(lo); orcRow.appendChild(so); sh.appendChild(orcRow);
    arrepRow.hidden = t.tipo !== 'gasto'; orcRow.hidden = t.tipo !== 'gasto';
    var row = el('div', 'row');
    var save = el('button', 'btn primary wide', novo ? 'Salvar' : 'Salvar alterações'); save.type = 'button'; save.id = 'lsave';
    save.addEventListener('click', function(){
      if(!(t.valor > 0)){ toast('Coloca o valor.'); iv.focus(); return; }
      if(!t.cat){ toast('Escolhe a categoria.'); return; }
      if(!t.desc) t.desc = catDe(t.cat, t.tipo).n;
      t.atualizadoEm = new Date().toISOString();
      var i = -1; FIN.lanc.forEach(function(x, k){ if(x.id === t.id) i = k; });
      if(i > -1) FIN.lanc[i] = t; else FIN.lanc.push(t);
      finSave(); closeSheet(); render(); toast(novo ? (t.tipo === 'gasto' ? 'Gasto anotado.' : 'Ganho anotado.') : 'Salvo.');
      try{ if(navigator.vibrate) navigator.vibrate(10); }catch(e){}
    });
    row.appendChild(save); sh.appendChild(row);
    if(!novo){ var del = el('button', 'btn small danger', 'Apagar lançamento'); del.type = 'button'; del.id = 'ldel'; del.addEventListener('click', function(){ if(!confirm('Apagar "' + t.desc + '"?')) return; FIN.lanc = FIN.lanc.filter(function(x){ return x.id !== t.id; }); finSave(); closeSheet(); render(); toast('Apagado.'); }); sh.appendChild(del); }
    setTimeout(function(){ if(novo) iv.focus(); }, 260);
  });
}

/* linha de lancamento */
function txRow(t){
  var c = catDe(t.cat, t.tipo), conta = contaDe(t.conta);
  var b = el('button', 'tx'); b.type = 'button'; b.id = 'tx-' + t.id; b.style.setProperty('--cc', c.c);
  b.appendChild(el('span', 'ic', c.n.slice(0, 2).toUpperCase()));
  var d = el('span', 'd'); d.appendChild(el('span', 't', t.desc || c.n)); d.appendChild(el('span', 's', c.n + (conta ? ' · ' + conta.nome : '') + (t.orc ? ' · planilha' : ''))); b.appendChild(d);
  var v = el('span', 'v ' + (t.tipo === 'ganho' ? 'g' : 'r'), (t.tipo === 'ganho' ? '+' : '−') + fmt(t.valor)); if(t.arrep) v.appendChild(el('small', null, 'besteira')); b.appendChild(v);
  b.addEventListener('click', function(){ sheetLanc(t); });
  return b;
}

/* MES */
function renderFinMes(){
  var s = saude(fm), r = s.r, hero = $('finHero'); hero.textContent = '';
  var semDados = r.n === 0;
  hero.className = 'hero' + (semDados ? '' : r.sobra >= 0 ? ' pos' : ' neg');
  hero.appendChild(el('p', 'lbl', semDados ? 'Este mês' : r.sobra >= 0 ? 'Sobrou até agora' : 'Faltou até agora'));
  hero.appendChild(el('div', 'money big', semDados ? 'R$ 0' : fmt(Math.abs(r.sobra))));
  var two = el('div', 'two'); var a = el('div'); a.appendChild(el('span', null, 'Entrou')); a.appendChild(el('b', 'g', fmt(r.ganhos))); var b = el('div'); b.appendChild(el('span', null, 'Saiu')); b.appendChild(el('b', 'r', fmt(r.gastos))); two.appendChild(a); two.appendChild(b); hero.appendChild(two);
  if(r.ganhos > 0){ var ratio = r.gastos / r.ganhos, bar = el('div', 'ratio' + (ratio >= 1 ? ' over' : ratio >= 0.8 ? ' warn' : '')), f = el('span'); f.style.width = Math.min(100, ratio / 1.2 * 100) + '%'; bar.appendChild(f); var mk = el('i'); mk.style.left = (100 / 1.2) + '%'; bar.appendChild(mk); hero.appendChild(bar); hero.appendChild(el('p', 'hint2', Math.round(ratio * 100) + '% do que entrou já saiu' + (r.aPagar > 0 ? ' · faltam ' + fmt(r.aPagar) + ' da planilha' : ''))); }
  else if(r.aPagar > 0) hero.appendChild(el('p', 'hint2', 'Faltam ' + fmt(r.aPagar) + ' da planilha pra pagar este mês.'));
  if(semDados) hero.appendChild(el('p', 'msg', 'Nada lançado ainda. Toca no + e anota o primeiro gasto. Anotar é o que dá pra cortar.'));
  else if(r.aPagar > 0 && r.ganhos > 0) hero.appendChild(el('p', 'msg', 'Se tudo da planilha for pago, o mês fecha em ' + (r.ganhos - r.projecao >= 0 ? '+' : '−') + fmt(Math.abs(r.ganhos - r.projecao)) + '.'));

  var h = $('health'); h.textContent = '';
  [['Sobra', s.poup], ['Custo essencial', s.fixo], ['Reserva', s.reserva], ['Besteira', s.best]].forEach(function(x){
    var c = el('div', 'hcard ' + x[1].f); c.appendChild(el('span', 'n', x[0])); c.appendChild(el('span', 'v', x[1].txt)); c.appendChild(el('span', 's', x[1].s)); h.appendChild(c);
  });
  $('healthSub').textContent = s.renda > 0 ? 'renda base ' + fmtK(s.renda) : 'preenche a planilha';
  var al = $('finAlerts'); al.textContent = '';
  var frases = [];
  if(s.poup.f === 'bad' && r.ganhos > 0) frases.push(['Saiu mais do que entrou.', 'Antes de qualquer investimento: o que dá pra cortar da lista de besteiras e da planilha, hoje?']);
  if(s.fixo.f === 'bad') frases.push(['O essencial come ' + s.fixo.txt + ' da renda.', 'Com renda variável, acima de 70% qualquer mês fraco vira dívida. Mexe no maior item da planilha ou sobe a renda base.']);
  if(s.reserva.f === 'bad' && s.ess > 0) frases.push(['Reserva abaixo de 3 meses.', 'Primeiro degrau: 1 mês de custo essencial (' + fmt(s.ess) + ') num CDB de liquidez diária ou Tesouro Selic, em outro banco.']);
  if(s.best.f === 'bad') frases.push(['Besteira em ' + s.best.txt + '.', 'Tira o cartão salvo dos apps e usa a Lista do Depois: 72h antes de qualquer compra que não é essencial.']);
  frases.slice(0, 2).forEach(function(f){ var p = el('p', 'alert'); p.appendChild(el('b', null, f[0])); p.appendChild(document.createTextNode(f[1])); al.appendChild(p); });

  var L = lancMes(fm).filter(function(t){ return t.tipo === 'gasto'; }), por = {};
  L.forEach(function(t){ por[t.cat] = (por[t.cat] || 0) + (+t.valor || 0); });
  var ids = Object.keys(por).sort(function(a, b){ return por[b] - por[a]; }), max = ids.length ? por[ids[0]] : 1;
  var cb = $('cats'); cb.textContent = '';
  if(!ids.length) cb.appendChild(el('p', 'empty', 'Sem gastos lançados neste mês.'));
  ids.forEach(function(id){
    var c = catDe(id), row = el('div', 'cat'); row.style.setProperty('--cc', c.c);
    row.appendChild(el('span', 'ic', c.n.slice(0, 2).toUpperCase()));
    row.appendChild(el('span', 'nm', c.n));
    var v = el('span', 'vl', fmt(por[id])); v.appendChild(el('small', null, pct(por[id], r.gastos) + '%')); row.appendChild(v);
    var me = el('div', 'meter'), f = el('span'); f.style.width = Math.round(por[id] / max * 100) + '%'; me.appendChild(f); row.appendChild(me);
    cb.appendChild(row);
  });
  $('catSub').textContent = ids.length ? ids.length + (ids.length === 1 ? ' categoria' : ' categorias') : '';

  var rg = $('regretCard'); rg.textContent = '';
  $('regretSub').textContent = r.nArrep ? r.nArrep + (r.nArrep === 1 ? ' gasto' : ' gastos') : '';
  if(!r.nArrep) rg.appendChild(el('p', 'small', 'Nenhum gasto marcado como besteira. Ao lançar, marca "me arrependo" quando for o caso: é essa lista que mostra o que cortar.'));
  else {
    rg.appendChild(el('h3', null, fmt(r.arrep) + ' que você mesmo disse que não precisava'));
    rg.appendChild(el('p', 'small', 'Todo mês assim: ' + fmt(r.arrep * 12) + ' por ano. É uma reserva inteira indo embora.'));
    var top = lancMes(fm).filter(function(t){ return t.arrep; }).sort(function(a, b){ return b.valor - a.valor; }).slice(0, 3);
    var ul = el('div'); top.forEach(function(t){ ul.appendChild(txRow(t)); }); rg.appendChild(ul);
  }
  var lt = $('lastTx'); lt.textContent = '';
  var ult = lancMes(fm).slice().sort(function(a, b){ return b.data.localeCompare(a.data) || (b.atualizadoEm || '').localeCompare(a.atualizadoEm || ''); }).slice(0, 5);
  if(!ult.length) lt.appendChild(el('p', 'empty', 'Nada ainda.'));
  ult.forEach(function(t){ lt.appendChild(txRow(t)); });
}

/* EXTRATO */
function renderExtrato(){
  var sel = $('txFilter'); var atual = txFiltro; sel.textContent = '';
  [['', 'Todas as contas']].concat(FIN.contas.map(function(c){ return [c.id, c.nome]; })).forEach(function(o){ var op = el('option', null, o[1]); op.value = o[0]; if(o[0] === atual) op.selected = true; sel.appendChild(op); });
  var L = lancMes(fm).filter(function(t){ return !txFiltro || t.conta === txFiltro; }).sort(function(a, b){ return b.data.localeCompare(a.data) || (b.atualizadoEm || '').localeCompare(a.atualizadoEm || ''); });
  var box = $('txList'); box.textContent = '';
  if(!L.length){ box.appendChild(el('p', 'empty', 'Nenhum lançamento neste mês' + (txFiltro ? ' nessa conta' : '') + '. Toca no + ou importa um CSV do banco.')); return; }
  var dia = null;
  L.forEach(function(t){
    if(t.data !== dia){ dia = t.data; var d = new Date(+dia.slice(0, 4), +dia.slice(5, 7) - 1, +dia.slice(8, 10)); var soma = L.filter(function(x){ return x.data === dia && x.tipo === 'gasto'; }).reduce(function(a, x){ return a + (+x.valor || 0); }, 0); var hd = el('div', 'dayhead'); hd.appendChild(el('span', null, DOWL[d.getDay()] + ', ' + dataBR(dia))); if(soma) hd.appendChild(el('span', null, '−' + fmt(soma))); box.appendChild(hd); }
    box.appendChild(txRow(t));
  });
}
$('txFilter').addEventListener('change', function(){ txFiltro = this.value; renderExtrato(); });

/* PLANILHA */
function sheetOrc(grupo, o){
  var novo = !o; o = o ? clone(o) : {id:uid(), nome:'', valor:0, cat: grupo === 'ess' ? 'moradia' : 'outros', cortadoEm:null};
  openSheet(function(sh){
    sh.appendChild(el('h3', null, novo ? (grupo === 'rec' ? 'Nova entrada prevista' : 'Nova despesa da planilha') : 'Editar'));
    var inm = el('input'); inm.type = 'text'; inm.value = o.nome; inm.maxLength = 50; inm.placeholder = grupo === 'rec' ? 'Ex.: pró-labore, cliente fixo' : 'Ex.: aluguel, Netflix'; inm.addEventListener('input', function(){ o.nome = inm.value; });
    sh.appendChild(campo('Nome', inm, 'onome'));
    var am = el('div', 'amount'); am.appendChild(el('span', null, 'R$'));
    var iv = el('input'); iv.type = 'text'; iv.inputMode = 'decimal'; iv.id = 'ovalor'; iv.placeholder = '0,00'; iv.value = o.valor ? (+o.valor).toLocaleString('pt-BR', {minimumFractionDigits:2}) : ''; iv.addEventListener('input', function(){ o.valor = parseBRL(iv.value); }); iv.setAttribute('aria-label', 'Valor por mês');
    am.appendChild(iv); sh.appendChild(am); sh.appendChild(el('p', 'mini', grupo === 'rec' ? 'Quanto você espera que entre por mês. Renda variável: usa o mês fraco, não o forte.' : 'Valor médio por mês.'));
    if(grupo !== 'rec'){ sh.appendChild(el('p', 'mini', 'Categoria')); sh.appendChild(chipsDe(CATS, o.cat, function(id){ o.cat = id; }, 'oc')); }
    var save = el('button', 'btn primary wide', 'Salvar'); save.type = 'button'; save.id = 'osave';
    save.addEventListener('click', function(){ if(!o.nome){ toast('Dá um nome.'); return; } var lista = FIN.orc[grupo], i = -1; lista.forEach(function(x, k){ if(x.id === o.id) i = k; }); if(i > -1) lista[i] = o; else lista.push(o); finSave(); closeSheet(); renderPlanilha(); toast('Salvo.'); });
    sh.appendChild(save);
    if(!novo){ var del = el('button', 'btn small danger', 'Remover da planilha'); del.type = 'button'; del.id = 'odel'; del.addEventListener('click', function(){ if(!confirm('Remover "' + o.nome + '"?')) return; FIN.orc[grupo] = FIN.orc[grupo].filter(function(x){ return x.id !== o.id; }); finSave(); closeSheet(); renderPlanilha(); }); sh.appendChild(del); }
    setTimeout(function(){ if(novo) inm.focus(); }, 260);
  });
}
function orcRow(grupo, o, pg){
  var cut = !!o.cortadoEm, pago = pg && pg[o.id];
  var row = el('div', 'orc-row' + (cut ? ' cut' : '') + (pago ? ' paid' : ''));
  var tx = el('button'); tx.type = 'button'; tx.id = 'orc-' + o.id; tx.style.minWidth = '0'; tx.appendChild(el('span', 'nm', o.nome));
  var sub = grupo === 'rec' ? 'por mês' : cut ? 'cortado ' + dataBR(o.cortadoEm.slice(0, 10)) : pago ? 'pago este mês' : (+o.valor > 0 ? 'a pagar' : 'sem valor');
  tx.appendChild(el('span', 'sb', sub)); tx.addEventListener('click', function(){ sheetOrc(grupo, o); }); row.appendChild(tx);
  row.appendChild(el('span', 'vl', +o.valor > 0 ? fmt(o.valor) : '–'));
  if(grupo === 'rec'){ row.appendChild(el('span')); return row; }
  if(!cut && !(+o.valor > 0)){ row.appendChild(el('span')); return row; }
  var b = el('button', 'cutbtn', cut ? 'Cortado ✓' : (!pago && +o.valor > 0 ? 'Pagar' : 'Cortar')); b.type = 'button'; b.id = 'oc-' + o.id;
  b.addEventListener('click', function(){
    if(cut){ o.cortadoEm = null; finSave(); renderPlanilha(); toast('Voltou pra planilha.'); return; }
    if(!pago && +o.valor > 0){ sheetLanc({id:uid(), tipo:'gasto', valor:+o.valor, desc:o.nome, cat:o.cat, conta:(FIN.contas[0] || {}).id || '', data:keyOf(midnight(agora())), arrep:false, orc:o.id}); return; }
    if(!confirm('Marcar "' + o.nome + '" como cortado? Ele sai da conta do mês e vira economia.')) return;
    o.cortadoEm = new Date().toISOString(); finSave(); renderPlanilha(); toast('Cortado. Menos ' + fmt(o.valor) + ' por mês.');
  });
  row.appendChild(b);
  if(!cut && !pago && +o.valor > 0){ var c2 = el('button', 'cutbtn', 'Cortar'); c2.type = 'button'; c2.id = 'ox-' + o.id; c2.addEventListener('click', function(){ if(!confirm('Marcar "' + o.nome + '" como cortado?')) return; o.cortadoEm = new Date().toISOString(); finSave(); renderPlanilha(); toast('Cortado. Menos ' + fmt(o.valor) + ' por mês.'); }); row.style.gridTemplateColumns = 'minmax(0,1fr) auto auto auto'; row.appendChild(c2); }
  return row;
}
function renderPlanilha(){
  var pg = pagos(fm);
  [['rec', 'orcRec'], ['ess', 'orcEss'], ['nao', 'orcNao']].forEach(function(x){
    var box = $(x[1]); box.textContent = '';
    var lista = FIN.orc[x[0]].slice().sort(function(a, b){ return (!!a.cortadoEm - !!b.cortadoEm) || ((+b.valor || 0) - (+a.valor || 0)); });
    lista.forEach(function(o){ box.appendChild(orcRow(x[0], o, pg)); });
    var tot = el('div', 'orc-total'); tot.appendChild(el('span', null, 'Total')); tot.appendChild(el('b', null, fmt(x[0] === 'rec' ? FIN.orc.rec.reduce(function(a, r){ return a + (+r.valor || 0); }, 0) : orcTotal(FIN.orc[x[0]])))); box.appendChild(tot);
  });
  var rec = FIN.orc.rec.reduce(function(a, r){ return a + (+r.valor || 0); }, 0), ess = orcTotal(FIN.orc.ess), nao = orcTotal(FIN.orc.nao), sobra = rec - ess - nao;
  var rs = $('orcResumo'); rs.textContent = '';
  var t1 = el('div', 'orc-total big'); t1.appendChild(el('span', null, 'Se a planilha estiver certa, sobra por mês')); t1.appendChild(el('b', null, fmt(sobra))); t1.querySelector('b').style.color = sobra >= 0 ? 'var(--good)' : 'var(--bad)'; rs.appendChild(t1);
  var t2 = el('div', 'orc-total'); t2.appendChild(el('span', null, 'Reserva ideal (6 × essenciais)')); t2.appendChild(el('b', null, fmt(ess * 6))); rs.appendChild(t2);
  var t3 = el('div', 'orc-total'); t3.appendChild(el('span', null, 'Custo essencial sobre a renda')); t3.appendChild(el('b', null, rec > 0 ? Math.round(ess / rec * 100) + '%' : '–')); rs.appendChild(t3);
  if(rec === 0) rs.appendChild(el('p', 'small', 'Coloca a entrada prevista (o mês fraco, não o forte) pra planilha fechar a conta.'));
  var cortes = FIN.orc.ess.concat(FIN.orc.nao).filter(function(o){ return o.cortadoEm; }), econ = cortes.reduce(function(a, o){ return a + (+o.valor || 0); }, 0);
  var cb = $('cutBanner'); cb.hidden = !cortes.length; cb.textContent = '';
  if(cortes.length){ cb.appendChild(el('b', null, fmt(econ) + ' por mês cortados')); cb.appendChild(document.createTextNode(cortes.length + (cortes.length === 1 ? ' item' : ' itens') + ' que você parou de pagar. Em um ano são ' + fmt(econ * 12) + '.')); }
}
$('addRec').addEventListener('click', function(){ sheetOrc('rec'); });
$('addEss').addEventListener('click', function(){ sheetOrc('ess'); });
$('addNao').addEventListener('click', function(){ sheetOrc('nao'); });

/* CONTAS */
function sheetConta(c){
  var novo = !c; c = c ? clone(c) : {id:uid(), nome:'', tipo:'credito', cor:CORES[FIN.contas.length % CORES.length]};
  openSheet(function(sh){
    sh.appendChild(el('h3', null, novo ? 'Conta ou cartão' : 'Editar conta'));
    var inm = el('input'); inm.type = 'text'; inm.value = c.nome; inm.maxLength = 30; inm.placeholder = 'Ex.: Nubank crédito, Inter, Pix'; inm.addEventListener('input', function(){ c.nome = inm.value; });
    sh.appendChild(campo('Nome', inm, 'cnome'));
    sh.appendChild(el('p', 'mini', 'Tipo')); sh.appendChild(chipsDe(TIPOS_CONTA.map(function(t){ return {id:t[0], n:t[1]}; }), c.tipo, function(id){ c.tipo = id; }, 'ct'));
    sh.appendChild(el('p', 'mini', 'Cor'));
    var sw = el('div', 'swatches'); CORES.forEach(function(cor, i){ var b = el('button'); b.type = 'button'; b.id = 'cor-' + i; b.style.background = cor; b.setAttribute('aria-label', 'cor ' + (i + 1)); b.setAttribute('aria-pressed', c.cor === cor ? 'true' : 'false'); b.addEventListener('click', function(){ c.cor = cor; sw.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); }); sw.appendChild(b); }); sh.appendChild(sw);
    var save = el('button', 'btn primary wide', 'Salvar'); save.type = 'button'; save.id = 'csave';
    save.addEventListener('click', function(){ if(!c.nome){ toast('Dá um nome.'); return; } var i = -1; FIN.contas.forEach(function(x, k){ if(x.id === c.id) i = k; }); if(i > -1) FIN.contas[i] = c; else FIN.contas.push(c); finSave(); closeSheet(); renderContas(); toast('Salvo.'); });
    sh.appendChild(save);
    if(!novo){ var usos = FIN.lanc.filter(function(t){ return t.conta === c.id; }).length; var del = el('button', 'btn small danger', usos ? 'Apagar (tem ' + usos + ' lançamentos)' : 'Apagar conta'); del.type = 'button'; del.id = 'cdel'; del.addEventListener('click', function(){ if(FIN.contas.length === 1){ toast('Precisa ter pelo menos uma conta.'); return; } if(!confirm('Apagar "' + c.nome + '"? Os lançamentos dela ficam sem conta.')) return; FIN.contas = FIN.contas.filter(function(x){ return x.id !== c.id; }); FIN.lanc.forEach(function(t){ if(t.conta === c.id) t.conta = ''; }); finSave(); closeSheet(); renderContas(); }); sh.appendChild(del); }
    setTimeout(function(){ if(novo) inm.focus(); }, 260);
  });
}
function renderContas(){
  var box = $('acctList'); box.textContent = ''; var L = lancMes(fm);
  FIN.contas.forEach(function(c){
    var g = L.filter(function(t){ return t.conta === c.id && t.tipo === 'gasto'; }).reduce(function(a, t){ return a + (+t.valor || 0); }, 0);
    var e = L.filter(function(t){ return t.conta === c.id && t.tipo === 'ganho'; }).reduce(function(a, t){ return a + (+t.valor || 0); }, 0);
    var b = el('button', 'acct'); b.type = 'button'; b.id = 'acct-' + c.id; b.style.setProperty('--cc', c.cor);
    b.appendChild(el('span', 'sw', c.tipo === 'credito' ? 'CARD' : c.tipo === 'pix' ? 'PIX' : c.tipo === 'dinheiro' ? 'R$' : 'DÉB'));
    var d = el('span'); d.appendChild(el('span', 't', c.nome)); d.appendChild(el('span', 's', TIPOS_CONTA.filter(function(t){ return t[0] === c.tipo; })[0][1])); b.appendChild(d);
    var v = el('span', 'v', '−' + fmt(g)); v.appendChild(el('small', null, e ? '+' + fmt(e) + ' no mês' : 'no mês')); b.appendChild(v);
    b.addEventListener('click', function(){ sheetConta(c); });
    box.appendChild(b);
  });
}
$('addAcct').addEventListener('click', function(){ sheetConta(); });
