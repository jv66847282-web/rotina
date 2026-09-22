
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
  {id:'prolabore', n:'Salário', c:'#2FC4B2'},
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
  {id:'ext', n:'Exterior e dólar', c:'#FFD166', d:'ETFs e BDRs de fora, dólar em conta global. Proteção contra o real.'},
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
    rec: [{id:'r_prolabore', nome:'Meu salário (o menor mês que costuma cair)', valor:0}],
    ess: ess.map(function(n){ return {id:uid(), nome:n, valor:0, cat:cat(n), cortadoEm:null}; }),
    nao: nao.map(function(n){ return {id:uid(), nome:n, valor:0, cat:cat(n), cortadoEm:null}; })
  };
}
function finVazio(){ return {contas:[{id:'c_pix', nome:'Pix / conta', tipo:'pix', cor:'#6F8CFF'}], lanc:[], orc:planilhaOriginal(), inv:[], dividas:[], guia:{}, cfg:{}}; }
function finLoad(){ FIN = ler('fin', null); if(!FIN || !FIN.orc || !FIN.contas){ FIN = finVazio(); } if(!FIN.inv) FIN.inv = []; if(!FIN.guia) FIN.guia = {}; if(!FIN.lanc) FIN.lanc = []; if(!FIN.dividas) FIN.dividas = []; if(!FIN.cfg) FIN.cfg = {}; }
function finSave(){ gravar('fin', FIN); }

/* contas do mes */
function lancMes(d){ var k = mesKey(d); return FIN.lanc.filter(function(t){ return t.data && t.data.slice(0, 7) === k; }); }
function diasNoMes(d){ return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); }
function diaHoje(d){ var h = agora(); if(h.getFullYear() === d.getFullYear() && h.getMonth() === d.getMonth()) return h.getDate(); return h > d ? diasNoMes(d) : 0; }
function somaTipo(L, tipo){ return L.filter(function(t){ return t.tipo === tipo; }).reduce(function(a, t){ return a + (+t.valor || 0); }, 0); }
function orcAtivo(lista){ return lista.filter(function(o){ return !o.cortadoEm && (+o.valor || 0) > 0; }); }
function orcTotal(lista){ return orcAtivo(lista).reduce(function(a, o){ return a + (+o.valor || 0); }, 0); }
function pagos(d){ var m = {}; lancMes(d).forEach(function(t){ if(t.orc) m[t.orc] = (m[t.orc] || 0) + (+t.valor || 0); }); return m; }
function piso(d){
  /* 3o menor mes de ganhos entre os ultimos 12 (precisa de pelo menos 3 meses com entrada) */
  var vals = [];
  for(var i = 1; i <= 12; i++){ var dd = new Date(d.getFullYear(), d.getMonth() - i, 1), g = somaTipo(lancMes(dd), 'ganho'); if(g > 0) vals.push(g); }
  if(vals.length < 3) return null;
  vals.sort(function(a, b){ return a - b; });
  return vals[Math.min(2, vals.length - 1)];
}
function rendaBase(d){
  /* prioridade: piso real (3o menor mes) > entrada prevista da planilha > media dos ultimos 3 meses */
  var p = piso(d); if(p) return p;
  var prev = FIN.orc.rec.reduce(function(a, r){ return a + (+r.valor || 0); }, 0);
  if(prev > 0) return prev;
  var soma = 0, n = 0;
  for(var i = 0; i < 3; i++){ var dd = new Date(d.getFullYear(), d.getMonth() - i, 1), g = somaTipo(lancMes(dd), 'ganho'); if(g > 0){ soma += g; n++; } }
  return n ? soma / n : 0;
}
function dividasMes(){ var t = {parcelas:0, saldo:0, rotativo:false, n:FIN.dividas.length}; FIN.dividas.forEach(function(x){ t.parcelas += +x.parcela || 0; t.saldo += +x.saldo || 0; if(x.tipo === 'rotativo' || x.tipo === 'cheque') t.rotativo = true; }); return t; }
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
  var dv = dividasMes(), divp = dv.n ? (renda > 0 ? dv.parcelas / renda * 100 : (r.ganhos > 0 ? dv.parcelas / r.ganhos * 100 : null)) : null;
  var divf = !dv.n ? 'ok' : dv.rotativo ? 'bad' : faixa(divp, 20, 35, true);
  return {
    r:r, renda:renda, ess:ess, res:res, dv:dv, pisoReal: !!piso(d),
    poup:{v:poup, f:faixa(poup, 20, 10), txt: poup == null ? '–' : Math.round(poup) + '%', s:'do que entrou sobrou'},
    fixo:{v:fixo, f:faixa(fixo, 50, 70, true), txt: fixo == null ? '–' : Math.round(fixo) + '%', s:'da renda vai pro essencial'},
    reserva:{v:meses, f:faixa(meses, 6, 0.5), txt: meses == null ? '–' : (meses >= 10 ? Math.round(meses) : meses.toFixed(1).replace('.', ',')) + ' meses', s:'de custo essencial guardados'},
    best:{v:best, f:faixa(best, 5, 10, true), txt: best == null ? '–' : Math.round(best) + '%', s:'foi pra besteira'},
    div:{v:divp, f:divf, txt: !dv.n ? 'nenhuma' : dv.rotativo ? 'rotativo' : (divp == null ? fmtK(dv.parcelas) : Math.round(divp) + '%'), s: !dv.n ? 'cadastrada' : dv.rotativo ? 'crédito mais caro do país' : 'da renda vai pra parcelas'}
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
function sheetLanc(t, outro){
  var novo = !t; t = t ? clone(t) : {id:uid(), tipo:'gasto', valor:0, desc:'', cat:'', conta:(FIN.cfg && FIN.cfg.contaPadrao) || (FIN.contas[0] || {}).id || '', data:keyOf(midnight(agora())), arrep:false, orc:null};
  if(!t.cat) t.cat = t.tipo === 'ganho' ? 'cliente' : (t.tipo === 'transf' ? 'transf' : '');
  openSheet(function(sh){
    sh.appendChild(el('h3', null, novo ? 'Lançar' : 'Editar lançamento'));
    var seg = el('div', 'segctl'); seg.style.gridTemplateColumns = '1fr 1fr 1fr'; var bG = el('button', null, 'Gasto'), bR = el('button', null, 'Ganho'), bT = el('button', null, 'Transf.'); bG.type = bR.type = bT.type = 'button'; bG.id = 'lt-gasto'; bR.id = 'lt-ganho'; bT.id = 'lt-transf';
    var catLbl = el('p', 'mini', 'Categoria'), transfNote = el('p', 'mini', 'Pagamento de fatura, aporte na reserva, dinheiro entre contas. Não conta como gasto nem como ganho.'); transfNote.hidden = true;
    function segSet(){ bG.setAttribute('aria-selected', t.tipo === 'gasto' ? 'true' : 'false'); bR.setAttribute('aria-selected', t.tipo === 'ganho' ? 'true' : 'false'); bT.setAttribute('aria-selected', t.tipo === 'transf' ? 'true' : 'false'); var novoBox = t.tipo === 'transf' ? el('div') : chipsDe(t.tipo === 'ganho' ? CATS_G : CATS, t.cat, function(id){ t.cat = id; }, 'lc'); catBox.replaceWith(novoBox); catBox = novoBox; catLbl.hidden = t.tipo === 'transf'; transfNote.hidden = t.tipo !== 'transf'; arrepRow.hidden = t.tipo !== 'gasto'; orcRow.hidden = t.tipo !== 'gasto'; }
    bG.addEventListener('click', function(){ t.tipo = 'gasto'; if(CATS_G.some(function(c){ return c.id === t.cat; }) || t.cat === 'transf') t.cat = ''; segSet(); });
    bR.addEventListener('click', function(){ t.tipo = 'ganho'; t.arrep = false; t.orc = null; if(!CATS_G.some(function(c){ return c.id === t.cat; })) t.cat = 'cliente'; segSet(); });
    bT.addEventListener('click', function(){ t.tipo = 'transf'; t.arrep = false; t.orc = null; t.cat = 'transf'; segSet(); });
    seg.appendChild(bG); seg.appendChild(bR); seg.appendChild(bT); sh.appendChild(seg);
    var am = el('div', 'amount'); am.appendChild(el('span', null, 'R$'));
    var iv = el('input'); iv.type = 'text'; iv.inputMode = 'decimal'; iv.id = 'lv'; iv.placeholder = '0,00'; iv.value = t.valor ? t.valor.toLocaleString('pt-BR', {minimumFractionDigits:2}) : ''; iv.setAttribute('aria-label', 'Valor');
    iv.addEventListener('input', function(){ t.valor = parseBRL(iv.value); });
    am.appendChild(iv); sh.appendChild(am);
    sh.appendChild(catLbl); sh.appendChild(transfNote);
    var catBox = t.tipo === 'transf' ? el('div') : chipsDe(t.tipo === 'ganho' ? CATS_G : CATS, t.cat, function(id){ t.cat = id; }, 'lc'); sh.appendChild(catBox);
    var idesc = el('input'); idesc.type = 'text'; idesc.value = t.desc; idesc.placeholder = 'Ex.: iFood, Netflix, cliente X'; idesc.maxLength = 60;
    idesc.addEventListener('input', function(){ t.desc = idesc.value; });
    var arrepRow = el('label', 'switch'); var ca = el('input'); ca.type = 'checkbox'; ca.id = 'larrep'; ca.checked = !!t.arrep; ca.addEventListener('change', function(){ t.arrep = ca.checked; });
    arrepRow.appendChild(ca); arrepRow.appendChild(document.createTextNode('Me arrependo (besteira, dava pra não gastar)')); sh.appendChild(arrepRow);
    var det = el('details', 'mais'); if(!novo) det.open = true; var sm = el('summary', null, 'Descrição, conta, data e planilha'); det.appendChild(sm); var dBox = el('div'); det.appendChild(dBox); sh.appendChild(det);
    dBox.appendChild(campo('Descrição', idesc, 'ldesc'));
    var g2 = el('div', 'grid2');
    var sc = selectDe(FIN.contas.map(function(c){ return [c.id, c.nome]; }), t.conta); sc.addEventListener('change', function(){ t.conta = sc.value; });
    g2.appendChild(campo('Conta / cartão', sc, 'lconta'));
    var idt = el('input'); idt.type = 'date'; idt.value = t.data; idt.addEventListener('change', function(){ if(idt.value) t.data = idt.value; });
    g2.appendChild(campo('Data', idt, 'ldata'));
    dBox.appendChild(g2);
    var orcRow = el('div', 'field'); var lo = el('label', null, 'É uma conta da planilha?'); lo.htmlFor = 'lorc';
    var so = selectDe([['', 'Não, gasto avulso']].concat(FIN.orc.ess.concat(FIN.orc.nao).filter(function(o){ return !o.cortadoEm; }).map(function(o){ return [o.id, o.nome + (o.valor ? ' · ' + fmt(o.valor) : '')]; })), t.orc || '');
    so.id = 'lorc'; so.addEventListener('change', function(){ t.orc = so.value || null; var o = FIN.orc.ess.concat(FIN.orc.nao).filter(function(x){ return x.id === so.value; })[0]; if(o){ if(!t.valor && o.valor){ t.valor = +o.valor; iv.value = t.valor.toLocaleString('pt-BR', {minimumFractionDigits:2}); } if(!t.desc){ t.desc = o.nome; idesc.value = o.nome; } if(!t.cat){ t.cat = o.cat; catBox.replaceWith(catBox = chipsDe(CATS, t.cat, function(id){ t.cat = id; }, 'lc')); } } });
    orcRow.appendChild(lo); orcRow.appendChild(so); dBox.appendChild(orcRow);
    arrepRow.hidden = t.tipo !== 'gasto'; orcRow.hidden = t.tipo !== 'gasto';
    function salvar(maisUm){
      if(!(t.valor > 0)){ toast('Coloca o valor.'); iv.focus(); return; }
      if(t.tipo !== 'transf' && !t.cat){ toast('Escolhe a categoria.'); return; }
      if(!t.desc) t.desc = t.tipo === 'transf' ? 'Transferência' : catDe(t.cat, t.tipo).n;
      t.atualizadoEm = new Date().toISOString();
      var i = -1; FIN.lanc.forEach(function(x, k){ if(x.id === t.id) i = k; });
      if(i > -1) FIN.lanc[i] = t; else FIN.lanc.push(t);
      FIN.cfg = FIN.cfg || {}; FIN.cfg.contaPadrao = t.conta;
      finSave(); closeSheet(); render(); toast(novo ? (t.tipo === 'gasto' ? 'Gasto anotado.' : t.tipo === 'ganho' ? 'Ganho anotado.' : 'Transferência anotada.') : 'Salvo.');
      try{ if(navigator.vibrate) navigator.vibrate(10); }catch(e){}
      if(maisUm) setTimeout(function(){ sheetLanc(null, true); }, 260);
    }
    var row = el('div', 'row');
    var save = el('button', 'btn primary wide', novo ? 'Salvar' : 'Salvar alterações'); save.type = 'button'; save.id = 'lsave'; save.addEventListener('click', function(){ salvar(false); });
    row.appendChild(save); sh.appendChild(row);
    if(novo){ var mais = el('button', 'btn wide', 'Salvar e lançar outro'); mais.type = 'button'; mais.id = 'lmais'; mais.addEventListener('click', function(){ salvar(true); }); sh.appendChild(mais); }
    if(!novo){ var del = el('button', 'btn small danger', 'Apagar lançamento'); del.type = 'button'; del.id = 'ldel'; del.addEventListener('click', function(){ if(!confirm('Apagar "' + t.desc + '"?')) return; FIN.lanc = FIN.lanc.filter(function(x){ return x.id !== t.id; }); finSave(); closeSheet(); render(); toast('Apagado.'); }); sh.appendChild(del); }
    setTimeout(function(){ if(novo) iv.focus(); }, 260);
  });
}

/* linha de lancamento */
function txRow(t){
  var transf = t.tipo === 'transf', c = transf ? {n:'Transferência', c:'#9A9CBA'} : catDe(t.cat, t.tipo), conta = contaDe(t.conta);
  var b = el('button', 'tx' + (transf ? ' transf' : '')); b.type = 'button'; b.id = 'tx-' + t.id; b.style.setProperty('--cc', c.c);
  b.appendChild(el('span', 'ic', transf ? '⇄' : c.n.slice(0, 2).toUpperCase()));
  var d = el('span', 'd'); d.appendChild(el('span', 't', t.desc || c.n)); d.appendChild(el('span', 's', c.n + (conta ? ' · ' + conta.nome : '') + (t.orc ? ' · planilha' : ''))); b.appendChild(d);
  var v = el('span', 'v ' + (t.tipo === 'ganho' ? 'g' : transf ? 't' : 'r'), (t.tipo === 'ganho' ? '+' : transf ? '' : '−') + fmt(t.valor)); if(t.arrep) v.appendChild(el('small', null, 'besteira')); b.appendChild(v);
  b.addEventListener('click', function(){ sheetLanc(t); });
  return b;
}

/* MES */
function renderFinMes(){
  var s = saude(fm), r = s.r, hero = $('finHero'); hero.textContent = ''; var L0 = lancMes(fm);
  var semDados = r.n === 0;
  hero.className = 'hero' + (semDados ? '' : r.sobra >= 0 ? ' pos' : ' neg');
  hero.appendChild(el('p', 'lbl', semDados ? 'Este mês' : r.sobra >= 0 ? 'Sobrou até agora' : 'Faltou até agora'));
  hero.appendChild(el('div', 'money big', semDados ? 'R$ 0' : fmt(Math.abs(r.sobra))));
  var two = el('div', 'two'); var a = el('div'); a.appendChild(el('span', null, 'Entrou')); a.appendChild(el('b', 'g', fmt(r.ganhos))); var b = el('div'); b.appendChild(el('span', null, 'Saiu')); b.appendChild(el('b', 'r', fmt(r.gastos))); two.appendChild(a); two.appendChild(b); hero.appendChild(two);
  if(r.ganhos > 0){ var ratio = r.gastos / r.ganhos, bar = el('div', 'ratio' + (ratio >= 1 ? ' over' : ratio >= 0.8 ? ' warn' : '')), f = el('span'); f.style.width = Math.min(100, ratio / 1.2 * 100) + '%'; bar.appendChild(f); var mk = el('i'); mk.style.left = (100 / 1.2) + '%'; bar.appendChild(mk); hero.appendChild(bar); hero.appendChild(el('p', 'hint2', Math.round(ratio * 100) + '% do que entrou já saiu' + (r.aPagar > 0 ? ' · faltam ' + fmt(r.aPagar) + ' da planilha' : ''))); }
  else if(r.aPagar > 0) hero.appendChild(el('p', 'hint2', 'Faltam ' + fmt(r.aPagar) + ' da planilha pra pagar este mês.'));
  var orcMes = orcTotal(FIN.orc.ess) + orcTotal(FIN.orc.nao), avulsos = L0.filter(function(t){ return t.tipo === 'gasto' && !t.orc; }).reduce(function(a, t){ return a + (+t.valor || 0); }, 0);
  if(s.renda > 0 && orcMes > 0){
    var livre = s.renda - orcMes, resta = livre - avulsos, dias = diasNoMes(fm), hoje = diaHoje(fm), faltam = Math.max(1, dias - hoje + 1), lv = el('div', 'livre');
    var lb = el('div'); lb.appendChild(el('span', null, resta >= 0 ? 'Livre até o fim do mês' : 'Estourou o livre do mês')); lb.appendChild(el('b', null, (resta < 0 ? '−' : '') + fmt(Math.abs(resta)))); lb.querySelector('b').style.display = 'block'; lb.querySelector('b').style.color = resta >= 0 ? 'var(--good)' : 'var(--bad)'; lv.appendChild(lb);
    var ld = el('div', 'dia'); ld.appendChild(document.createTextNode(resta > 0 ? fmt(resta / faltam) + '/dia' : 'sem folga')); var ld2 = el('span'); ld2.style.display = 'block'; ld2.textContent = faltam + (faltam === 1 ? ' dia' : ' dias') + ' restantes'; ld.appendChild(ld2); lv.appendChild(ld); hero.appendChild(lv);
    hero.appendChild(el('p', 'hint2', 'Livre = renda base − planilha (' + fmt(livre) + '). Já foi ' + fmt(avulsos) + ' em avulsos.'));
  }
  if(semDados) hero.appendChild(el('p', 'msg', 'Nada lançado ainda. Toca no + e anota o primeiro gasto. Anotar é o que dá pra cortar.'));
  else if(r.aPagar > 0 && r.ganhos > 0) hero.appendChild(el('p', 'msg', 'Se tudo da planilha for pago, o mês fecha em ' + (r.ganhos - r.projecao >= 0 ? '+' : '−') + fmt(Math.abs(r.ganhos - r.projecao)) + '.'));

  var h = $('health'); h.textContent = '';
  [['Sobra', s.poup], ['Custo essencial', s.fixo], ['Reserva', s.reserva], ['Besteira', s.best], ['Dívidas', s.div]].forEach(function(x){
    var c = el('div', 'hcard ' + x[1].f); c.appendChild(el('span', 'n', x[0])); c.appendChild(el('span', 'v', x[1].txt)); c.appendChild(el('span', 's', x[1].s)); h.appendChild(c);
  });
  $('healthSub').textContent = s.renda > 0 ? (s.pisoReal ? 'salário base (menor mês) ' : 'salário base ') + fmtK(s.renda) : 'preenche a planilha';
  var al = $('finAlerts'); al.textContent = '';
  var frases = [];
  if(s.dv.rotativo) frases.push(['Você está no rotativo ou no cheque especial.', 'É o crédito mais caro do país. Próxima ação: parcela a fatura ou pede portabilidade hoje. Nunca paga o mínimo.']);
  if(s.poup.f === 'bad' && r.ganhos > 0) frases.push([r.sobra < 0 ? 'Saiu mais do que entrou este mês.' : 'Sobrou menos de 10%.', 'Próxima ação: abre a lista de besteiras do mês e corta o maior item agora.']);
  if(s.fixo.f === 'bad') frases.push(['Fixos comem ' + s.fixo.txt + ' do salário.', 'Próxima ação: abre a Planilha e renegocia ou corta 1 gasto fixo esta semana.']);
  if(s.div.f === 'bad' && !s.dv.rotativo) frases.push(['Mais de 35% da renda vai pra dívida.', 'Próxima ação: ordena as dívidas por taxa e leva a mais cara pra negociação (banco, Serasa Limpa Nome).']);
  if(s.reserva.f === 'bad' && s.ess > 0) frases.push(['Reserva abaixo de meio mês.', 'Qualquer imprevisto vira rotativo. Próxima ação: transfere hoje meio mês de custo essencial (' + fmt(s.ess / 2) + ') pra Tesouro Selic ou CDB de liquidez diária.']);
  if(s.best.f === 'bad') frases.push(['Besteira acima de 10% da renda.', 'Próxima ação: apaga o cartão salvo nos apps e usa a Lista do Depois: 72h antes de qualquer compra não planejada.']);
  var ultimo = FIN.lanc.length ? FIN.lanc.map(function(t){ return t.data; }).sort().pop() : null, semLancar = ultimo ? Math.floor((midnight(agora()) - new Date(+ultimo.slice(0,4), +ultimo.slice(5,7) - 1, +ultimo.slice(8,10))) / 864e5) : null;
  if(same(fm, new Date(agora().getFullYear(), agora().getMonth(), 1)) && semLancar != null && semLancar >= 3) frases.push([semLancar + ' dias sem lançar gasto: o raio-x ficou cego.', 'Próxima ação: abre o extrato do cartão e lança agora, leva 2 minutos.']);
  frases.slice(0, 2).forEach(function(f){ var p = el('p', 'alert'); p.appendChild(el('b', null, f[0])); p.appendChild(document.createTextNode(f[1])); al.appendChild(p); });

  var L = lancMes(fm).filter(function(t){ return t.tipo === 'gasto'; }), por = {};
  L.forEach(function(t){ por[t.cat] = (por[t.cat] || 0) + (+t.valor || 0); });
  var ids = Object.keys(por).sort(function(a, b){ return por[b] - por[a]; }), max = ids.length ? por[ids[0]] : 1;
  var stB = $('stackBox'); stB.textContent = '';
  if(r.gastos > 0){
    var essV = 0, livV = 0; L.forEach(function(t){ if(catDe(t.cat).g === 'ess') essV += +t.valor || 0; else livV += +t.valor || 0; });
    var st = el('div', 'stack'); var se = el('span', 'e'); se.style.width = (essV / r.gastos * 100) + '%'; var sl = el('span', 'l'); sl.style.width = ((livV - r.arrep) / r.gastos * 100) + '%'; var sb = el('span', 'b'); sb.style.width = (r.arrep / r.gastos * 100) + '%'; st.appendChild(se); st.appendChild(sl); st.appendChild(sb); stB.appendChild(st);
    var lg = el('p', 'stack-leg'); [['e', 'Essencial ' + Math.round(essV / r.gastos * 100) + '%'], ['l', 'Livre ' + Math.round((livV - r.arrep) / r.gastos * 100) + '%'], ['b', 'Besteira ' + Math.round(r.arrep / r.gastos * 100) + '%']].forEach(function(x){ var sp = el('span'); var i = el('i'); i.className = x[0] === 'e' ? '' : ''; i.style.background = x[0] === 'e' ? '#6F8CFF' : x[0] === 'l' ? '#3ECF8E' : 'var(--bad)'; sp.appendChild(i); sp.appendChild(document.createTextNode(x[1])); lg.appendChild(sp); }); stB.appendChild(lg);
  }
  var prevCat = {}, pagosCat = {}; orcAtivo(FIN.orc.ess.concat(FIN.orc.nao)).forEach(function(o){ prevCat[o.cat] = (prevCat[o.cat] || 0) + (+o.valor || 0); });
  L.forEach(function(t){ if(t.orc) pagosCat[t.cat] = (pagosCat[t.cat] || 0) + (+t.valor || 0); });
  var diaN = diaHoje(fm), diasN = diasNoMes(fm);
  var cb = $('cats'); cb.textContent = '';
  if(!ids.length) cb.appendChild(el('p', 'empty', 'Sem gastos lançados neste mês.'));
  ids.forEach(function(id){
    var c = catDe(id), row = el('div', 'cat'); row.style.setProperty('--cc', c.c);
    row.appendChild(el('span', 'ic', c.n.slice(0, 2).toUpperCase()));
    var nm = el('span', 'nm', c.n);
    if(prevCat[id] > 0 && diaN > 0){ var avulso = por[id] - (pagosCat[id] || 0), restante = prevCat[id] - (pagosCat[id] || 0), rt = por[id] > prevCat[id] * 1.02 ? 'bad' : (restante > 0 && avulso > restante * diaN / diasN * 1.15) ? 'mid' : 'ok'; nm.appendChild(el('span', 'ritmo ' + rt, rt === 'ok' ? 'no ritmo' : rt === 'mid' ? 'vai estourar' : 'estourou')); nm.title = 'Planilha: ' + fmt(prevCat[id]) + '/mês'; }
    row.appendChild(nm);
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
  renderChart3(); renderCorte(r);
  var lt = $('lastTx'); lt.textContent = '';
  var ult = lancMes(fm).slice().sort(function(a, b){ return b.data.localeCompare(a.data) || (b.atualizadoEm || '').localeCompare(a.atualizadoEm || ''); }).slice(0, 5);
  if(!ult.length) lt.appendChild(el('p', 'empty', 'Nada ainda.'));
  ult.forEach(function(t){ lt.appendChild(txRow(t)); });
}

function renderChart3(){
  var box = $('chart3'); box.textContent = '';
  var meses = [], maxV = 0;
  for(var i = 5; i >= 0; i--){ var d = new Date(fm.getFullYear(), fm.getMonth() - i, 1), L = lancMes(d), e = 0, n = 0, g = 0; L.forEach(function(t){ if(t.tipo === 'ganho') g += +t.valor || 0; else if(t.tipo === 'gasto'){ if(catDe(t.cat).g === 'ess') e += +t.valor || 0; else n += +t.valor || 0; } }); meses.push({d:d, g:g, e:e, n:n}); }
  /* so meses com dado (o atual sempre entra) */
  meses = meses.filter(function(m, k){ return k === meses.length - 1 || m.g || m.e || m.n; });
  meses.forEach(function(m){ maxV = Math.max(maxV, m.g, m.e, m.n); });
  if(!maxV){ box.appendChild(el('p', 'empty', 'Sem lançamentos ainda. O gráfico aparece com o primeiro mês.')); return; }
  var ns = 'http://www.w3.org/2000/svg', W = 360, H = 240, top = 26, base = H - 28, dep = 9, nM = meses.length, gw = W / nM, bw = Math.min(30, (gw - 18 - dep) / 3);
  var svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  function tone(hex, f){ var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); return 'rgb(' + Math.round(r * f) + ',' + Math.round(g * f) + ',' + Math.round(b * f) + ')'; }
  function poly(pts, fill, op){ var p = document.createElementNS(ns, 'polygon'); p.setAttribute('points', pts.map(function(q){ return q[0] + ',' + q[1]; }).join(' ')); p.setAttribute('fill', fill); if(op != null) p.style.opacity = op; return p; }
  /* linhas de grade */
  for(var gl = 1; gl <= 3; gl++){ var y = base - (base - top) * gl / 3, ln = document.createElementNS(ns, 'line'); ln.setAttribute('x1', 0); ln.setAttribute('x2', W); ln.setAttribute('y1', y); ln.setAttribute('y2', y); ln.setAttribute('stroke', 'currentColor'); ln.style.opacity = '.08'; svg.appendChild(ln); }
  var chao = document.createElementNS(ns, 'line'); chao.setAttribute('x1', 0); chao.setAttribute('x2', W); chao.setAttribute('y1', base); chao.setAttribute('y2', base); chao.setAttribute('stroke', 'currentColor'); chao.style.opacity = '.25'; svg.appendChild(chao);
  meses.forEach(function(m, i){
    var x0 = i * gw + (gw - (3 * bw + 4 + dep)) / 2, atual = same(m.d, fm);
    [['g', '#3ECF8E'], ['e', '#6F8CFF'], ['n', '#FF6B7A']].forEach(function(k, j){
      var v = m[k[0]], h = Math.max(v > 0 ? 3 : 0, v / maxV * (base - top)), x = x0 + j * (bw + 2), y = base - h, op = atual ? 1 : .6;
      if(h > 0){
        svg.appendChild(poly([[x + bw, y], [x + bw + dep, y - dep], [x + bw + dep, base - dep], [x + bw, base]], tone(k[1], .62), op));
        svg.appendChild(poly([[x, y], [x + dep, y - dep], [x + bw + dep, y - dep], [x + bw, y]], tone(k[1], 1.18 > 1 ? 1 : 1), op)); 
        var topo = svg.lastChild; topo.setAttribute('fill', k[1]); topo.style.filter = 'brightness(1.25)';
        svg.appendChild(poly([[x, y], [x + bw, y], [x + bw, base], [x, base]], k[1], op));
        if(v > 0 && (atual || nM <= 3)){ var t = document.createElementNS(ns, 'text'); t.setAttribute('x', x + bw / 2 + dep / 2); t.setAttribute('y', y - dep - 4); t.setAttribute('text-anchor', 'middle'); t.textContent = v >= 1000 ? (v / 1000).toLocaleString('pt-BR', {maximumFractionDigits:1}) + 'k' : Math.round(v); t.style.fill = 'var(--ink)'; t.style.fontSize = '10px'; svg.appendChild(t); }
      }
    });
    var lb = document.createElementNS(ns, 'text'); lb.setAttribute('x', i * gw + gw / 2); lb.setAttribute('y', H - 8); lb.setAttribute('text-anchor', 'middle'); lb.textContent = MES3[m.d.getMonth()] + (nM <= 3 ? ' ' + String(m.d.getFullYear()).slice(2) : ''); if(atual) lb.style.fill = 'var(--ink)'; svg.appendChild(lb);
  });
  box.appendChild(svg);
  var cur = meses[meses.length - 1], lg = el('div', 'leg3'); [['#3ECF8E', 'Entrou ' + fmtK(cur.g)], ['#6F8CFF', 'Essencial ' + fmtK(cur.e)], ['#FF6B7A', 'Não essencial ' + fmtK(cur.n)]].forEach(function(x){ var s = el('span'); var i = el('i'); i.style.background = x[0]; s.appendChild(i); s.appendChild(document.createTextNode(x[1])); lg.appendChild(s); }); box.appendChild(lg);
  if(cur.g > 0) box.appendChild(el('p', 'small', 'Do que entrou, ' + Math.round(cur.e / cur.g * 100) + '% foi pro essencial e ' + Math.round(cur.n / cur.g * 100) + '% pro não essencial. O vermelho é a parte que você controla.'));
}
function renderCorte(r){
  var box = $('corteBox'); box.textContent = ''; var itens = [];
  orcAtivo(FIN.orc.nao).forEach(function(o){ itens.push({tipo:'planilha', o:o, nome:o.nome, valor:+o.valor, sub:'fixo da planilha · ' + catDe(o.cat).n}); });
  var por = {}; lancMes(fm).forEach(function(t){ if(t.tipo === 'gasto' && catDe(t.cat).g === 'nao' && !t.orc) por[t.cat] = (por[t.cat] || 0) + (+t.valor || 0); });
  Object.keys(por).forEach(function(id){ itens.push({tipo:'cat', nome:catDe(id).n, valor:por[id], sub:'avulsos deste mês'}); });
  if(r.arrep > 0) itens.push({tipo:'best', nome:'Besteiras marcadas', valor:r.arrep, sub:r.nArrep + ' gastos que você disse que não precisava'});
  itens.sort(function(a, b){ return b.valor - a.valor; });
  var total = itens.reduce(function(s, x){ return s + x.valor; }, 0);
  $('corteSub').textContent = itens.length ? 'até ' + fmtK(total) + '/mês' : '';
  if(!itens.length){ box.appendChild(el('p', 'empty', 'Nada não essencial ainda. Preenche a planilha e lança os gastos.')); return; }
  itens.slice(0, 10).forEach(function(x){
    var row = el('div', 'orc-row'); if(x.tipo !== 'planilha') row.style.gridTemplateColumns = 'minmax(0,1fr) auto';
    var tx = el('span'); tx.appendChild(el('span', 'nm', x.nome)); var sb = el('span', 'sb', x.sub + ' · '); var b = el('b', null, 'cortando: +' + fmtK(x.valor * 12) + '/ano'); sb.appendChild(b); tx.appendChild(sb); row.appendChild(tx);
    row.appendChild(el('span', 'vl', fmt(x.valor)));
    if(x.tipo === 'planilha'){ var c = el('button', 'cutbtn', 'Cortar'); c.type = 'button'; c.id = 'corte-' + x.o.id; c.addEventListener('click', function(){ if(!confirm('Marcar "' + x.o.nome + '" como cortado?')) return; x.o.cortadoEm = new Date().toISOString(); finSave(); render(); toast('Cortado. Menos ' + fmt(x.o.valor) + ' por mês.'); }); row.appendChild(c); }
    box.appendChild(row);
  });
  var cortes = FIN.orc.ess.concat(FIN.orc.nao).filter(function(o){ return o.cortadoEm; }), econ = cortes.reduce(function(a, o){ return a + (+o.valor || 0); }, 0);
  if(cortes.length) box.appendChild(el('p', 'cut-banner', 'Você já cortou ' + fmt(econ) + ' por mês (' + cortes.map(function(o){ return o.nome; }).join(', ') + ').'));
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
    var inm = el('input'); inm.type = 'text'; inm.value = o.nome; inm.maxLength = 50; inm.placeholder = grupo === 'rec' ? 'Ex.: salário, cliente fixo' : 'Ex.: aluguel, Netflix'; inm.addEventListener('input', function(){ o.nome = inm.value; });
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
  if(rec === 0) rs.appendChild(el('p', 'small', 'Coloca o seu salário (o menor mês que costuma cair, não o melhor) pra planilha fechar a conta.'));
  var cortes = FIN.orc.ess.concat(FIN.orc.nao).filter(function(o){ return o.cortadoEm; }), econ = cortes.reduce(function(a, o){ return a + (+o.valor || 0); }, 0);
  var cb = $('cutBanner'); cb.hidden = !cortes.length; cb.textContent = '';
  if(cortes.length){ cb.appendChild(el('b', null, fmt(econ) + ' por mês cortados')); cb.appendChild(document.createTextNode(cortes.length + (cortes.length === 1 ? ' item' : ' itens') + ' que você parou de pagar. Em um ano são ' + fmt(econ * 12) + '.')); }
  renderDividas();
}
$('addRec').addEventListener('click', function(){ sheetOrc('rec'); });
/* dividas */
var TIPOS_DIV = [['rotativo','Rotativo do cartão'],['cheque','Cheque especial'],['fatura','Fatura parcelada'],['emprestimo','Empréstimo'],['financiamento','Financiamento'],['outra','Outra']];
function sheetDiv(x){
  var novo = !x; x = x ? clone(x) : {id:uid(), credor:'', saldo:0, taxa:0, parcela:0, tipo:'fatura'};
  openSheet(function(sh){
    sh.appendChild(el('h3', null, novo ? 'Nova dívida' : 'Editar dívida'));
    var ic = el('input'); ic.type = 'text'; ic.value = x.credor; ic.maxLength = 40; ic.placeholder = 'Ex.: Nubank, Itaú, financiamento do carro'; ic.addEventListener('input', function(){ x.credor = ic.value; }); sh.appendChild(campo('Credor', ic, 'dcredor'));
    sh.appendChild(el('p', 'mini', 'Tipo')); sh.appendChild(chipsDe(TIPOS_DIV.map(function(t){ return {id:t[0], n:t[1]}; }), x.tipo, function(id){ x.tipo = id; }, 'dt'));
    var g = el('div', 'grid2');
    var isal = el('input'); isal.type = 'text'; isal.inputMode = 'decimal'; isal.placeholder = '0,00'; isal.value = x.saldo ? (+x.saldo).toLocaleString('pt-BR', {minimumFractionDigits:2}) : ''; isal.addEventListener('input', function(){ x.saldo = parseBRL(isal.value); }); g.appendChild(campo('Saldo devedor', isal, 'dsaldo'));
    var ipar = el('input'); ipar.type = 'text'; ipar.inputMode = 'decimal'; ipar.placeholder = '0,00'; ipar.value = x.parcela ? (+x.parcela).toLocaleString('pt-BR', {minimumFractionDigits:2}) : ''; ipar.addEventListener('input', function(){ x.parcela = parseBRL(ipar.value); }); g.appendChild(campo('Parcela por mês', ipar, 'dparcela'));
    sh.appendChild(g);
    var itx = el('input'); itx.type = 'text'; itx.inputMode = 'decimal'; itx.placeholder = 'Ex.: 12,5'; itx.value = x.taxa ? String(x.taxa).replace('.', ',') : ''; itx.addEventListener('input', function(){ x.taxa = parseBRL(itx.value); }); sh.appendChild(campo('Juros ao mês (%)', itx, 'dtaxa'));
    sh.appendChild(el('p', 'mini', 'Está na fatura ou no contrato. Rotativo do cartão costuma passar de 10% ao mês.'));
    var save = el('button', 'btn primary wide', 'Salvar'); save.type = 'button'; save.id = 'dsave';
    save.addEventListener('click', function(){ if(!x.credor){ toast('Quem é o credor?'); return; } var i = -1; FIN.dividas.forEach(function(y, k){ if(y.id === x.id) i = k; }); if(i > -1) FIN.dividas[i] = x; else FIN.dividas.push(x); finSave(); closeSheet(); renderPlanilha(); toast('Salvo.'); });
    sh.appendChild(save);
    if(!novo){ var del = el('button', 'btn small danger', 'Quitei / remover'); del.type = 'button'; del.id = 'ddel'; del.addEventListener('click', function(){ if(!confirm('Remover "' + x.credor + '" da lista de dívidas?')) return; FIN.dividas = FIN.dividas.filter(function(y){ return y.id !== x.id; }); finSave(); closeSheet(); renderPlanilha(); toast('Uma a menos.'); }); sh.appendChild(del); }
    setTimeout(function(){ if(novo) ic.focus(); }, 260);
  });
}
function renderDividas(){
  var box = $('divList'); box.textContent = '';
  var L = FIN.dividas.slice().sort(function(a, b){ var pa = (a.tipo === 'rotativo' || a.tipo === 'cheque') ? 1 : 0, pb = (b.tipo === 'rotativo' || b.tipo === 'cheque') ? 1 : 0; return (pb - pa) || ((+b.taxa || 0) - (+a.taxa || 0)); });
  if(!L.length) box.appendChild(el('p', 'empty', 'Nenhuma dívida cadastrada. Se tem, cadastra: é o primeiro passo do guia.'));
  L.forEach(function(x, i){
    var caro = x.tipo === 'rotativo' || x.tipo === 'cheque', row = el('div', 'orc-row'); row.style.gridTemplateColumns = 'minmax(0,1fr) auto';
    var b = el('button'); b.type = 'button'; b.id = 'div-' + x.id; b.style.minWidth = '0'; var nm = el('span', 'nm', (i === 0 && L.length > 1 ? '1º alvo: ' : '') + x.credor); if(caro) nm.appendChild(el('span', 'tag late', 'mais caro')); b.appendChild(nm);
    b.appendChild(el('span', 'sb', TIPOS_DIV.filter(function(t){ return t[0] === x.tipo; })[0][1] + (x.taxa ? ' · ' + String(x.taxa).replace('.', ',') + '% ao mês' : ''))); b.addEventListener('click', function(){ sheetDiv(x); }); row.appendChild(b);
    var v = el('span', 'vl', fmt(x.saldo)); v.appendChild(el('small', null, x.parcela ? ' ' + fmt(x.parcela) + '/mês' : '')); v.style.display = 'flex'; v.style.flexDirection = 'column'; v.style.alignItems = 'flex-end'; v.querySelector('small').style.color = 'var(--muted)'; row.appendChild(v);
    box.appendChild(row);
  });
  var rs = $('divResumo'); rs.textContent = ''; rs.hidden = !L.length;
  if(L.length){ var dv = dividasMes(), s = saude(fm); var t1 = el('div', 'orc-total big'); t1.appendChild(el('span', null, 'Total devido')); t1.appendChild(el('b', null, fmt(dv.saldo))); rs.appendChild(t1); var t2 = el('div', 'orc-total'); t2.appendChild(el('span', null, 'Parcelas por mês')); t2.appendChild(el('b', null, fmt(dv.parcelas) + (s.div.v != null ? ' · ' + Math.round(s.div.v) + '% da renda' : ''))); rs.appendChild(t2); rs.appendChild(el('p', 'small', dv.rotativo ? 'Rotativo ou cheque especial na lista: esse vem primeiro, sempre. Parcela a fatura ou pede portabilidade.' : 'Ordem de ataque: juros mais alto primeiro. Entre parecidas, a menor, pra fechar contas.')); }
}
$('addDiv').addEventListener('click', function(){ sheetDiv(); });
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
