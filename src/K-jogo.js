
/* ===== MERCADO (referencia, sem preco, sem recomendacao) ===== */
var MERCADO = {
  fii: [['MXRF11','Maxi Renda','papel (CRI)'],['HGLG11','CSHG Logística','galpões'],['KNCR11','Kinea Rendimentos','papel (CRI)'],['XPML11','XP Malls','shoppings'],['BTLG11','BTG Logística','galpões'],['KNRI11','Kinea Renda Imobiliária','híbrido'],['VISC11','Vinci Shopping Centers','shoppings'],['HGRE11','CSHG Real Estate','lajes'],['XPLG11','XP Log','galpões'],['CPTS11','Capitânia Securities','papel (CRI)'],['VILG11','Vinci Logística','galpões'],['IRDM11','Iridium Recebíveis','papel (CRI)'],['HFOF11','Hedge Top FOFII','fundo de fundos'],['TGAR11','TG Ativo Real','desenvolvimento'],['RECR11','REC Recebíveis','papel (CRI)'],['BRCO11','Bresco Logística','galpões'],['PVBI11','VBI Prime Offices','lajes'],['HSML11','HSI Malls','shoppings'],['KNIP11','Kinea Índice de Preços','papel (IPCA)'],['TRXF11','TRX Real Estate','renda urbana']],
  acao: [['PETR4','Petrobras','petróleo'],['VALE3','Vale','mineração'],['ITUB4','Itaú Unibanco','banco'],['BBDC4','Bradesco','banco'],['BBAS3','Banco do Brasil','banco'],['WEGE3','WEG','indústria'],['ABEV3','Ambev','bebidas'],['B3SA3','B3','bolsa'],['ITSA4','Itaúsa','holding'],['RENT3','Localiza','aluguel de carros'],['ELET3','Eletrobras','energia'],['SUZB3','Suzano','papel e celulose'],['PRIO3','PRIO','petróleo'],['RADL3','Raia Drogasil','farmácias'],['EQTL3','Equatorial','energia'],['BBSE3','BB Seguridade','seguros'],['VIVT3','Vivo','telecom'],['SBSP3','Sabesp','saneamento'],['TAEE11','Taesa','transmissão'],['EGIE3','Engie Brasil','energia'],['CPLE6','Copel','energia'],['KLBN11','Klabin','papel'],['RAIL3','Rumo','logística'],['CMIG4','Cemig','energia'],['BOVA11','ETF Ibovespa','ETF (cesta)'],['SMAL11','ETF Small Caps','ETF (cesta)'],['DIVO11','ETF Dividendos','ETF (cesta)']],
  ext: [['IVVB11','ETF S&P 500 (na B3)','ETF em dólar'],['WRLD11','ETF mundo todo (na B3)','ETF em dólar'],['NASD11','ETF Nasdaq 100 (na B3)','ETF em dólar'],['SPXI11','ETF S&P 500 (na B3)','ETF em dólar'],['USDB11','ETF Tesouro americano','renda fixa em dólar'],['AAPL34','Apple (BDR)','BDR'],['MSFT34','Microsoft (BDR)','BDR'],['AMZO34','Amazon (BDR)','BDR'],['GOGL34','Alphabet (BDR)','BDR'],['NVDC34','Nvidia (BDR)','BDR'],['BERK34','Berkshire (BDR)','BDR'],['VOO','Vanguard S&P 500 (corretora fora)','ETF nos EUA'],['VT','Vanguard mundo (corretora fora)','ETF nos EUA'],['Dólar / conta global','Dólar parado em conta global','moeda']]
};
function linkMercado(classe, ticker){
  var t = String(ticker || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if(!t) return null;
  if(classe === 'fii') return 'https://investidor10.com.br/fiis/' + t + '/';
  if(classe === 'acao') return /11$/.test(t) ? 'https://investidor10.com.br/etfs/' + t + '/' : 'https://investidor10.com.br/acoes/' + t + '/';
  if(classe === 'ext') return /34$/.test(t) ? 'https://investidor10.com.br/bdrs/' + t + '/' : (/11$/.test(t) ? 'https://investidor10.com.br/etfs/' + t + '/' : null);
  return null;
}

/* ===== JOGO: pontos por investir do jeito certo ===== */
var PTS = {rf:10, fii:20, acao:20, ext:20, rv:15, cripto:5};
var NIVEIS = [[0, 'Começando'], [100, 'Poupador'], [300, 'Investidor'], [700, 'Estrategista'], [1500, 'Independente']];
function jogo(){ if(!FIN.jogo) FIN.jogo = {pontos:0, hist:[], meses:{}}; return FIN.jogo; }
function jogoDesde(){ return (FIN.cfg && FIN.cfg.jogoDesde) || '2026-10'; }
function jogoAtivo(mk){ return (mk || mesKey(fm)) >= jogoDesde(); }
function nomeMes(mk){ var p = mk.split('-'); return MESL[+p[1] - 1].toLowerCase() + '/' + p[0]; }
function nivelDe(p){ var n = NIVEIS[0], prox = null; for(var i = 0; i < NIVEIS.length; i++){ if(p >= NIVEIS[i][0]) n = NIVEIS[i]; else { prox = NIVEIS[i]; break; } } return {nome:n[1], base:n[0], prox:prox}; }
function darPontos(pts, motivo){ var j = jogo(); j.pontos += pts; j.hist.unshift({data:keyOf(midnight(agora())), pts:pts, motivo:motivo}); j.hist = j.hist.slice(0, 30); }
function sugestaoMes(){
  var pct = (FIN.cfg && FIN.cfg.pctInvestir) || 20, r = resumoMes(fm), base = r.ganhos > 0 ? r.ganhos : rendaBase(fm);
  return {pct:pct, base:base, valor:base * pct / 100, jaFoi:(FIN.aportes || []).filter(function(a){ return a.data && a.data.slice(0, 7) === mesKey(fm); }).reduce(function(s, a){ return s + (+a.valor || 0); }, 0)};
}
function sheetAporte(pre){
  var a = {id:uid(), data:keyOf(midnight(agora())), ativoId:pre && pre.ativoId || (FIN.inv[0] || {}).id || '', valor:0};
  openSheet(function(sh){
    sh.appendChild(el('h3', null, 'Registrar aporte'));
    if(!FIN.inv.length){ sh.appendChild(el('p', 'mini', 'Cadastra um investimento primeiro (o da reserva, de preferência).')); var b0 = el('button', 'btn primary wide', 'Cadastrar investimento'); b0.type = 'button'; b0.id = 'ap-novo'; b0.addEventListener('click', function(){ closeSheet(); setTimeout(function(){ sheetInv(); }, 240); }); sh.appendChild(b0); return; }
    var sel = selectDe(FIN.inv.map(function(x){ return [x.id, x.nome + (x.reserva ? ' (reserva)' : '')]; }), a.ativoId); sel.addEventListener('change', function(){ a.ativoId = sel.value; }); sh.appendChild(campo('Em qual investimento', sel, 'ap-ativo'));
    var am = el('div', 'amount'); am.appendChild(el('span', null, 'R$')); var iv = el('input'); iv.type = 'text'; iv.inputMode = 'decimal'; iv.id = 'ap-valor'; iv.placeholder = '0,00'; iv.setAttribute('aria-label', 'Valor do aporte'); iv.addEventListener('input', function(){ a.valor = parseBRL(iv.value); }); am.appendChild(iv); sh.appendChild(am);
    var idt = el('input'); idt.type = 'date'; idt.value = a.data; idt.addEventListener('change', function(){ if(idt.value) a.data = idt.value; }); sh.appendChild(campo('Data', idt, 'ap-data'));
    var sg = sugestaoMes(); sh.appendChild(el('p', 'mini', 'Sugestão do mês: ' + fmt(sg.valor) + ' (' + sg.pct + '% do que entrou). Já foi ' + fmt(sg.jaFoi) + '.'));
    var b = el('button', 'btn primary wide', 'Registrar e pontuar'); b.type = 'button'; b.id = 'ap-save';
    b.addEventListener('click', function(){
      if(!(a.valor > 0)){ toast('Coloca o valor.'); iv.focus(); return; }
      var at = FIN.inv.filter(function(x){ return x.id === a.ativoId; })[0]; if(!at){ toast('Escolhe o investimento.'); return; }
      at.aplicado = (+at.aplicado || 0) + a.valor; at.atual = (+at.atual || 0) + a.valor; at.atualizadoEm = new Date().toISOString();
      a.classe = at.reserva ? 'reserva' : at.classe; FIN.aportes = FIN.aportes || []; FIN.aportes.push(a);
      FIN.lanc.push({id:uid(), tipo:'transf', valor:a.valor, desc:'Aporte · ' + at.nome, cat:'transf', conta:(FIN.cfg && FIN.cfg.contaPadrao) || (FIN.contas[0] || {}).id || '', data:a.data, arrep:false, orc:null, aporte:a.id, atualizadoEm:new Date().toISOString()});
      /* regras do jogo */
      var ess = essenciaisMes(), res = reservaTotal(), meses = ess > 0 ? res / ess : 99, pts = 0, msg = '';
      if(!jogoAtivo(a.data.slice(0, 7))){ pts = 0; msg = 'Aporte registrado. O jogo começa em ' + nomeMes(jogoDesde()) + '.'; }
      else if(at.reserva){ pts = PTS.rf; msg = 'Reserva primeiro: +' + pts; }
      else if(meses < 3){ pts = 0; msg = 'Sem pontos: a reserva ainda não chegou a 3 meses. O jogo premia a ordem certa.'; }
      else { pts = PTS[at.classe] || 10; msg = classeDe(at.classe).n + ': +' + pts; }
      if(pts) darPontos(pts, msg);
      var novas = avaliarMissoes(true);
      if(novas.length) msg += ' · missão: ' + novas.join(', ');
      finSave(); closeSheet(); render(); toast(msg, 4600); if(pts || novas.length) confete();
    });
    sh.appendChild(b);
    setTimeout(function(){ iv.focus(); }, 260);
  });
}
var MISSOES = [
  {id:'reserva', t:'Aportar na reserva', pts:10, ok:function(c){ return c.aportes.some(function(x){ return x.classe === 'reserva'; }); }},
  {id:'cedo', t:'Primeiro aporte até o dia 10', pts:10, ok:function(c){ return c.aportes.some(function(x){ return +x.data.slice(8, 10) <= 10; }); }},
  {id:'meta', t:'Bater a fatia do mês', pts:25, ok:function(c){ return c.sg.valor > 0 && c.sg.jaFoi >= c.sg.valor; }},
  {id:'duas', t:'Aportar em 2 classes além da reserva', pts:15, ok:function(c){ var cl = {}; c.aportes.forEach(function(x){ if(x.classe !== 'reserva') cl[x.classe] = 1; }); return Object.keys(cl).length >= 2; }},
  {id:'atualizou', t:'Todos os ativos atualizados (30 dias)', pts:10, ok:function(c){ return FIN.inv.length > 0 && FIN.inv.every(function(a){ var d = diasDesde(a.atualizadoEm); return d != null && d <= 30; }); }},
  {id:'cripto', t:'Cripto dentro da meta', pts:5, ok:function(c){ var tot = 0, cr = 0; FIN.inv.forEach(function(a){ if(a.reserva) return; tot += +a.atual || 0; if(a.classe === 'cripto') cr += +a.atual || 0; }); return tot > 0 && cr / tot * 100 <= alvoDe().cripto + BANDA; }}
];
function avaliarMissoes(premiar){
  var j = jogo(), mk = mesKey(fm), c = {aportes:(FIN.aportes || []).filter(function(x){ return x.data && x.data.slice(0, 7) === mk; }), sg:sugestaoMes()};
  j.missoes = j.missoes || {}; var feitas = j.missoes[mk] = j.missoes[mk] || {}, novas = [], st = [];
  if(!jogoAtivo(mk)) premiar = false;
  MISSOES.forEach(function(m){ var ok = feitas[m.id] || !!m.ok(c); if(ok && !feitas[m.id] && premiar){ feitas[m.id] = true; darPontos(m.pts, m.t + ': +' + m.pts); novas.push(m.t); } st.push({m:m, ok:ok}); });
  var todas = st.every(function(x){ return x.ok; });
  if(todas && !feitas._fase && premiar){ feitas._fase = true; j.fases = (j.fases || 0) + 1; darPontos(50, 'Fase ' + j.fases + ' concluída: +50'); novas.push('fase ' + j.fases + ' concluída'); }
  return premiar ? novas : st;
}
function renderJogo(){
  var box = $('jogoCard'); if(!box) return; box.textContent = '';
  var j = jogo(), nv = nivelDe(j.pontos), sg = sugestaoMes();
  var top = el('div', 'v-top'); var num = el('div', 'v-num'); num.style.fontSize = '54px'; num.textContent = String(j.pontos); top.appendChild(num); top.appendChild(el('span', 'v-label', nv.nome)); box.appendChild(top);
  if(nv.prox){ var bar = el('div', 'ratio'), f = el('span'); f.style.width = Math.min(100, (j.pontos - nv.base) / (nv.prox[0] - nv.base) * 100) + '%'; bar.appendChild(f); box.appendChild(bar); box.appendChild(el('p', 'hint2', 'faltam ' + (nv.prox[0] - j.pontos) + ' pontos pra ' + nv.prox[1])); }
  else box.appendChild(el('p', 'hint2', 'nível máximo'));
  /* missoes do mes */
  avaliarMissoes(true);
  var st = avaliarMissoes(false), feitas = st.filter(function(x){ return x.ok; }).length;
  var ativo = jogoAtivo(); box.classList.toggle('jogo-off', !ativo);
  if(!ativo){ var off = el('p', 'small'); off.style.opacity = '1'; off.appendChild(document.createTextNode('O jogo começa em ' + nomeMes(jogoDesde()) + '. Até lá, o alvo é zerar o rotativo e montar o colchão. ')); var mud = el('button', 'linkbtn', 'Mudar o início'); mud.type = 'button'; mud.id = 'jogoInicio'; mud.style.padding = '0'; mud.addEventListener('click', function(){ openSheet(function(sh){ sh.appendChild(el('h3', null, 'Quando o jogo começa')); var im = el('input'); im.type = 'month'; im.value = jogoDesde(); sh.appendChild(campo('Mês de início', im, 'jogoMes')); var b = el('button', 'btn primary wide', 'Salvar'); b.type = 'button'; b.id = 'jogoMesSave'; b.addEventListener('click', function(){ if(!/^\d{4}-\d{2}$/.test(im.value)){ toast('Escolhe o mês.'); return; } FIN.cfg = FIN.cfg || {}; FIN.cfg.jogoDesde = im.value; finSave(); closeSheet(); renderInv(); toast('Jogo começa em ' + nomeMes(im.value) + '.'); }); sh.appendChild(b); }); }); off.appendChild(mud); box.appendChild(off); }
  var mh = el('div', 'orc-total'); mh.style.marginTop = '6px'; mh.appendChild(el('span', null, 'Missões de ' + MESL[fm.getMonth()].toLowerCase() + (j.fases ? ' · fase ' + (j.fases + 1) : ' · fase 1'))); mh.appendChild(el('b', null, feitas + ' de ' + st.length)); box.appendChild(mh);
  var segs = el('div', 'segs'); segs.style.gridTemplateColumns = 'repeat(' + st.length + ',minmax(0,1fr))'; st.forEach(function(x){ segs.appendChild(el('i', x.ok ? 'on' : '')); }); box.appendChild(segs);
  var ml = el('ul', 'diag'); ml.style.gap = '4px'; st.forEach(function(x){ var li = el('li'); var row = el('div', 'chk'); var d = el('div', x.ok ? 'ok' : ''); d.appendChild(el('i')); var sp = el('span', null, x.m.t); sp.appendChild(el('small', null, '+' + x.m.pts + (x.ok ? ' ✓' : ''))); d.appendChild(sp); row.appendChild(d); li.appendChild(row); ml.appendChild(li); }); box.appendChild(ml);
  box.appendChild(el('p', 'small', feitas === st.length ? 'Fase fechada. Mês que vem tem outra.' : 'Fecha as ' + st.length + ' e passa de fase (+50). Cada aporte também pontua: reserva +10 · FII, ações e exterior +20 · renda variável +15 · cripto +5. Sem reserva de 3 meses, só a reserva pontua.'));
  if(j.hist.length){ var ul = el('ul'); ul.style.cssText = 'list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px;font-size:13px;color:var(--muted)'; j.hist.slice(0, 4).forEach(function(h){ ul.appendChild(el('li', null, dataBR(h.data) + ' · +' + h.pts + ' · ' + h.motivo.replace(/: \+\d+$/, ''))); }); box.appendChild(ul); }
}
function renderSugestao(){
  var box = $('sugestaoCard'); if(!box) return; box.textContent = '';
  var sg = sugestaoMes();
  box.appendChild(el('h3', null, 'Quanto investir este mês'));
  var row = el('div', 'row'); row.style.justifyContent = 'space-between';
  var lbl = el('span', 'small', 'Fatia do que entra');
  var sel = selectDe([[10, '10%'], [15, '15%'], [20, '20%'], [25, '25%'], [30, '30%']], sg.pct); sel.style.width = '110px'; sel.id = 'pctInv'; sel.addEventListener('change', function(){ FIN.cfg = FIN.cfg || {}; FIN.cfg.pctInvestir = +sel.value; finSave(); renderInv(); });
  row.appendChild(lbl); row.appendChild(sel); box.appendChild(row);
  if(sg.base > 0){
    box.appendChild(el('div', 'money big', fmt(sg.valor)));
    box.appendChild(el('p', 'small', sg.pct + '% de ' + fmt(sg.base) + (resumoMes(fm).ganhos > 0 ? ' que entraram este mês' : ' (salário base)') + '. Já foi ' + fmt(sg.jaFoi) + (sg.jaFoi >= sg.valor ? ' · meta batida ✓' : ' · faltam ' + fmt(Math.max(0, sg.valor - sg.jaFoi))) + '. A divisão está logo abaixo, em "Onde aportar".'));
  } else box.appendChild(el('p', 'small', 'Lança o que entrou este mês na aba Finanças e a sugestão aparece aqui. Muda o salário, muda a fatia.'));
}
function renderMercado(){
  var box = $('mercado'); if(!box) return; box.textContent = '';
  [['fii', 'Fundos imobiliários'], ['acao', 'Ações e ETFs da B3'], ['ext', 'Exterior e dólar']].forEach(function(g){
    var hd = el('div', 'classhead'); hd.appendChild(el('span', null, g[1])); box.appendChild(hd);
    var chips = el('div', 'chips'); chips.style.marginInline = '0'; chips.style.paddingInline = '0'; chips.style.flexWrap = 'wrap'; chips.style.overflow = 'visible';
    MERCADO[g[0]].forEach(function(m){
      var b = el('button'); b.type = 'button'; b.id = 'mk-' + m[0].replace(/[^A-Za-z0-9]/g, ''); b.title = m[1] + ' · ' + m[2]; b.style.setProperty('--cc', classeDe(g[0]).c);
      var i = el('i'); b.appendChild(i); b.appendChild(document.createTextNode(m[0]));
      b.addEventListener('click', function(){ sheetInv({id:uid(), nome:m[0] + ' · ' + m[1], classe:g[0], inst:'', aplicado:0, atual:0, reserva:false, ticker:m[0]}); });
      chips.appendChild(b);
    });
    box.appendChild(chips);
  });
  box.appendChild(el('p', 'note', 'Lista de referência pelos mais negociados, sem preço e sem recomendação. Toca num nome pra cadastrar. Antes de comprar, abre a página do ativo (o app dá o link) e lê o que ele faz.'));
}

/* ===== LEMBRETES (Google Agenda) ===== */
function gcalLink(b, dias){
  var d = midnight(agora()), n = 0; while(dias.indexOf(d.getDay()) < 0 && n < 8){ d = addDays(d, 1); n++; }
  var ini = keyOf(d).replace(/-/g, '') + 'T' + hhmm(b.s).replace(':', '') + '00', fim = keyOf(d).replace(/-/g, '') + 'T' + hhmm(Math.min(1439, b.s + Math.max(10, Math.min(b.e - b.s, 60)))).replace(':', '') + '00';
  var by = dias.map(function(x){ return ['SU','MO','TU','WE','TH','FR','SA'][x]; }).join(',');
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(b.t) + '&dates=' + ini + '/' + fim + '&recur=' + encodeURIComponent('RRULE:FREQ=WEEKLY;BYDAY=' + by) + '&details=' + encodeURIComponent((b.d || '') + (b.r ? '\n' + b.r : '')) + '&ctz=America/Sao_Paulo';
}
function renderLembretes(){
  var box = $('lembretes'); if(!box) return; box.textContent = '';
  var hoje = midnight(agora()), seg = monday(hoje); var util = addDays(seg, hoje.getDay() === 0 || hoje.getDay() === 6 ? 7 : 0);
  var L = plano(util, true).filter(function(b){ return b.vale; }), F = plano(addDays(seg, 5), true).filter(function(b){ return b.vale; });
  function linha(b, dias, rot){ var row = el('div', 'orc-row'); row.style.gridTemplateColumns = 'minmax(0,1fr) auto'; var tx = el('span'); tx.appendChild(el('span', 'nm', b.t)); tx.appendChild(el('span', 'sb', hora(b.s) + ' · ' + rot)); row.appendChild(tx); var a = el('a', 'cutbtn', 'Google Agenda'); a.href = gcalLink(b, dias); a.target = '_blank'; a.rel = 'noopener'; a.style.textDecoration = 'none'; row.appendChild(a); return row; }
  L.forEach(function(b){ box.appendChild(linha(b, [1,2,3,4,5], 'seg a sex')); });
  F.forEach(function(b){ box.appendChild(linha(b, [6,0], 'sáb e dom')); });
}
function icsDaRotina(){
  var out = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Rotina//PT-BR','CALSCALE:GREGORIAN','X-WR-CALNAME:Rotina'];
  var hoje = midnight(agora()), seg = monday(hoje), k = 0;
  [[addDays(seg, 7), 'MO,TU,WE,TH,FR'], [addDays(seg, 12), 'SA,SU']].forEach(function(x){
    plano(x[0], true).filter(function(b){ return b.vale; }).forEach(function(b){
      var d = keyOf(x[0]).replace(/-/g, ''); k++;
      out.push('BEGIN:VEVENT', 'UID:rotina-' + k + '-' + b.k + '@app', 'DTSTAMP:' + d + 'T000000Z', 'DTSTART:' + d + 'T' + hhmm(b.s).replace(':', '') + '00', 'DTEND:' + d + 'T' + hhmm(Math.min(1439, b.s + Math.max(10, Math.min(b.e - b.s, 60)))).replace(':', '') + '00', 'RRULE:FREQ=WEEKLY;BYDAY=' + x[1], 'SUMMARY:' + b.t.replace(/,/g, '\\,'), 'DESCRIPTION:' + (b.d || '').replace(/,/g, '\\,'), 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + b.t.replace(/,/g, '\\,'), 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT');
    });
  });
  out.push('END:VCALENDAR'); return out.join('\r\n');
}

/* ===== TEMA ===== */
function aplicarTema(t){
  var real = t === 'auto' ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : t;
  document.documentElement.setAttribute('data-theme', real);
  var m = document.querySelector('meta[name=theme-color]'); if(m) m.content = real === 'light' ? '#F4F4FA' : '#0D0E1A';
  document.querySelectorAll('#temaSeg button').forEach(function(b){ b.setAttribute('aria-selected', b.getAttribute('data-tema') === t ? 'true' : 'false'); });
}
function temaAtual(){ try{ return localStorage.getItem('rotina.v3.tema') || 'dark'; }catch(e){ return 'dark'; } }
