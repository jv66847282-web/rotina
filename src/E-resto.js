
/* ===== SEMANA e MES ===== */
function veredito(box, t, tipo, seed, extra){
  box.textContent = '';
  var pouco = t.p != null && t.total < 6, n = pouco ? 0 : nivel(t.p), v = el('div', 'verdict t' + n);
  var top = el('div', 'v-top'), num = el('div', 'v-num');
  if(t.p == null) num.textContent = '–'; else { num.appendChild(document.createTextNode(String(t.p))); num.appendChild(el('small', null, '%')); }
  top.appendChild(num); top.appendChild(el('span', 'v-label', pouco ? 'Começando' : ROTULO[n])); v.appendChild(top);
  var msg = pouco ? 'Pouco jogo ainda pra dar veredito. Segue marcando que eu te digo a verdade no fim.' : n === 0 ? 'Ainda não tem dia contado aqui. O placar começa a valer na terça, 22/09.' : escolhe(FALA[tipo][n], seed)({p:t.p, fraco:t.fraco});
  v.appendChild(el('p', 'v-msg', msg));
  if(t.p != null) v.appendChild(el('p', 'v-meta', t.feito + ' de ' + t.total + ' estações · ' + t.dias + (t.dias === 1 ? ' dia' : ' dias') + (extra ? ' · ' + extra : '')));
  box.appendChild(v);
}
function horaPorHora(box, t){
  box.textContent = '';
  var ids = Object.keys(t.por).sort(function(a, b){ return mins(horaDe(a)) - mins(horaDe(b)); });
  if(!ids.length){ box.appendChild(el('p', 'empty', 'Ainda sem dados. Marca o dia e volta aqui.')); return; }
  ids.forEach(function(id){
    var o = t.por[id], row = el('div', 'hh-row'); row.style.setProperty('--c', sky(mins(horaDe(id))));
    row.appendChild(el('span', 'time', hora(horaDe(id))));
    var nm = el('span', 'name', nomeDe(id));
    if(t.fraco === id) nm.appendChild(el('span', 'tag late', 'ponto fraco'));
    row.appendChild(nm);
    row.appendChild(el('span', 'cnt', o.feito + '/' + o.total));
    var me = el('div', 'meter'), f = el('span'); f.style.width = Math.round(o.feito / o.total * 100) + '%';
    me.appendChild(f); row.appendChild(me); box.appendChild(row);
  });
}
function abrirDia(d){ sel = d; editing = false; setTab('hoje'); }
function renderSemana(){
  var hoje = midnight(agora()), datas = [], ant = [], i;
  for(i = 0; i < 7; i++){ datas.push(addDays(wk, i)); ant.push(addDays(wk, i - 7)); }
  var fim = datas[6];
  $('wkRange').textContent = wk.getDate() + (wk.getMonth() !== fim.getMonth() ? ' ' + MES3[wk.getMonth()] : '') + ' a ' + fim.getDate() + ' ' + MES3[fim.getMonth()];
  $('wkPrev').disabled = addDays(wk, -1) < monday(CONTA_DESDE);
  $('wkNext').disabled = addDays(wk, 7) > hoje;
  var t = periodo(datas), a = periodo(ant), extra = null;
  if(t.p != null && a.p != null){ var df = t.p - a.p; extra = (df > 0 ? '▲ ' + df : df < 0 ? '▼ ' + Math.abs(df) : '= 0') + ' pts vs. semana anterior'; }
  veredito($('wkVerdict'), t, 'semana', Math.floor(wk.getTime() / 6048e5), extra);
  var box = $('wkBars'); box.textContent = '';
  datas.forEach(function(d, i){
    var r = placar(d), off = !r.conta || r.p == null;
    var b = el('button', 'bar' + (off ? ' off' : (r.p === 0 ? ' zero' : '')) + (same(d, hoje) ? ' today' : ''));
    b.type = 'button'; b.id = 'bar-' + i;
    b.setAttribute('aria-label', DOWL[d.getDay()] + (r.p != null ? ', ' + r.p + '%' : ', sem placar'));
    b.appendChild(el('b', null, off ? '' : String(r.p)));
    var col = el('span', 'col'), f = el('span'); f.style.height = (off ? 0 : r.p) + '%'; f.style.background = 'hsl(' + hue(r.p || 0) + ' 62% 48%)'; col.appendChild(f); b.appendChild(col);
    b.appendChild(el('span', null, DOW3[d.getDay()]));
    b.addEventListener('click', function(){ abrirDia(d); });
    box.appendChild(b);
  });
  var meta = T.treino.filter(function(x){ return x >= 1 && x <= 5; }).length;
  $('wkGym').textContent = t.treinos + (t.treinos === 1 ? ' treino' : ' treinos') + ' · meta ' + meta;
  horaPorHora($('wkHH'), t);
}
function renderMes(){
  var hoje = midnight(agora()), y = mo.getFullYear(), mth = mo.getMonth(), n = new Date(y, mth + 1, 0).getDate(), datas = [], i;
  for(i = 1; i <= n; i++) datas.push(new Date(y, mth, i));
  $('moName').textContent = MESL[mth]; $('moSub').textContent = String(y);
  $('moPrev').disabled = new Date(y, mth, 0) < CONTA_DESDE;
  $('moNext').disabled = new Date(y, mth + 1, 1) > hoje;
  var t = periodo(datas);
  veredito($('moVerdict'), t, 'mes', mth, null);
  var st = $('moStats'); st.textContent = '';
  [[t.cheios, 'dias 100%'], [sequencia(), 'dias seguidos acima de 80%'], [t.treinos, 'treinos no mês']].forEach(function(x){
    var s = el('div', 'stat'); s.appendChild(el('b', null, String(x[0]))); s.appendChild(el('span', null, x[1])); st.appendChild(s);
  });
  var cal = $('cal'); cal.textContent = '';
  ['S','T','Q','Q','S','S','D'].forEach(function(l){ cal.appendChild(el('span', 'wd', l)); });
  for(i = 0; i < (datas[0].getDay() + 6) % 7; i++) cal.appendChild(el('span'));
  datas.forEach(function(d){
    var r = placar(d), cls = 'tile';
    if(r.futuro) cls += ' future';
    else if(!r.conta) cls += ' rest';
    else if(r.p == null) cls += ' rest';
    else if(r.p === 0 && !r.hoje) cls += ' zero';
    else if(r.p === 0) cls += ' rest';
    else cls += ' scored';
    if(same(d, hoje)) cls += ' today';
    if(picked && same(d, picked)) cls += ' picked';
    var b = el('button', cls); b.type = 'button'; b.id = 'cal-' + d.getDate(); b.style.setProperty('--h', hue(r.p || 0));
    b.setAttribute('aria-label', 'Dia ' + d.getDate() + (r.p != null ? ', ' + r.feito + ' de ' + r.total + ', ' + r.p + '%' : ''));
    b.appendChild(el('span', 'n', String(d.getDate())));
    b.appendChild(el('span', 'f', r.conta && !r.futuro && r.total ? r.feito + '/' + r.total : (r.futuro || !r.conta ? '' : '–')));
    if(r.p === 100 && !r.hoje){ var ok = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); ok.setAttribute('viewBox', '0 0 24 24'); ok.setAttribute('class', 'ok'); ok.innerHTML = '<path d="M5 12.5l4.5 4.5L19 7.5"/>'; b.appendChild(ok); }
    b.addEventListener('click', function(){ picked = (picked && same(d, picked)) ? null : d; renderMes(); });
    cal.appendChild(b);
  });
  var det = $('calDetail'); det.textContent = '';
  if(picked && picked.getMonth() === mth && picked.getFullYear() === y){
    var r = placar(picked), rr = dias[keyOf(picked)], top = el('div', 'top');
    top.appendChild(el('span', null, DOWL[picked.getDay()] + ', ' + picked.getDate() + ': ' + (r.futuro ? 'ainda não chegou' : !r.conta ? 'fora do placar' : r.feito + ' de ' + r.total + ' (' + (r.p || 0) + '%)')));
    var go = el('button', 'linkbtn', 'Abrir'); go.type = 'button'; go.id = 'calOpen'; go.addEventListener('click', function(){ abrirDia(picked); });
    top.appendChild(go); det.appendChild(top);
    if(r.conta && !r.futuro){
      var ul = el('ul');
      r.ids.forEach(function(id){ ul.appendChild(el('li', marcado(rr, id) ? 'ok' : 'no', (marcado(rr, id) ? '✓ ' : '✕ ') + nomeDe(id))); });
      det.appendChild(ul);
    }
  } else det.appendChild(el('span', 'note', 'Toca num dia pra ver o que foi feito.'));
  horaPorHora($('moHH'), t);
}

/* ===== ROTINA (editor) ===== */
var aberto = {};
function renderRotina(){
  $('tpl-util').setAttribute('aria-selected', tplLista === 'util' ? 'true' : 'false');
  $('tpl-fds').setAttribute('aria-selected', tplLista === 'fds' ? 'true' : 'false');
  $('treinoField').hidden = tplLista !== 'util';
  var days = $('days'); days.textContent = '';
  [1,2,3,4,5].forEach(function(dow){
    var b = el('button', null, DOW3[dow]); b.type = 'button'; b.id = 'dt-' + dow;
    b.setAttribute('aria-pressed', T.treino.indexOf(dow) > -1 ? 'true' : 'false');
    b.addEventListener('click', function(){ var i = T.treino.indexOf(dow); if(i > -1) T.treino.splice(i, 1); else T.treino.push(dow); T.treino.sort(); salvarT(); renderRotina(); });
    days.appendChild(b);
  });
  var box = $('blocks'); box.textContent = '';
  var lista = T[tplLista].slice().sort(function(a, b){ return mins(a.h) - mins(b.h); });
  lista.forEach(function(b){
    var card = el('div', 'blk' + (aberto[b.k] ? ' open' : ''));
    var head = el('button', 'blk-head'); head.type = 'button'; head.id = 'bh-' + b.k; head.setAttribute('aria-expanded', aberto[b.k] ? 'true' : 'false');
    head.appendChild(el('span', 'h', hora(b.h)));
    head.appendChild(el('span', 't' + (b.vale || b.opcional ? '' : ' minor'), b.t));
    head.appendChild(el('span', 'k', b.vale ? 'ponto' : b.opcional ? 'opcional' : 'passagem'));
    var ch = el('span', 'chev'); ch.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>'; head.appendChild(ch);
    head.addEventListener('click', function(){ aberto[b.k] = !aberto[b.k]; renderRotina(); });
    card.appendChild(head);
    var body = el('div', 'blk-body');
    function campo(label, input){ var f = el('div', 'field'); var l = el('label', null, label); l.htmlFor = input.id; f.appendChild(l); f.appendChild(input); return f; }
    var g = el('div', 'grid2');
    var ih = el('input'); ih.type = 'time'; ih.id = 'bh-h-' + b.k; ih.value = b.h; ih.step = 300;
    ih.addEventListener('change', function(){ if(ih.value){ b.h = ih.value; salvarT(); renderRotina(); } });
    g.appendChild(campo('Hora', ih));
    var iq = el('select'); iq.id = 'bh-q-' + b.k;
    QUANDO.forEach(function(o){ var op = el('option', null, o[1]); op.value = o[0]; if(b.quando === o[0]) op.selected = true; iq.appendChild(op); });
    iq.addEventListener('change', function(){ b.quando = iq.value; salvarT(); });
    g.appendChild(campo('Quando', iq));
    body.appendChild(g);
    var it = el('input'); it.type = 'text'; it.id = 'bh-t-' + b.k; it.value = b.t; it.maxLength = 40;
    it.addEventListener('input', function(){ b.t = it.value; }); it.addEventListener('change', function(){ salvarT(); renderRotina(); });
    body.appendChild(campo('Nome', it));
    var id = el('textarea'); id.id = 'bh-d-' + b.k; id.value = b.d; id.rows = 2;
    id.addEventListener('input', function(){ b.d = id.value; }); id.addEventListener('change', salvarT);
    body.appendChild(campo('O que fazer', id));
    var ir = el('input'); ir.type = 'text'; ir.id = 'bh-r-' + b.k; ir.value = b.r; ir.placeholder = 'Se..., então...';
    ir.addEventListener('input', function(){ b.r = ir.value; }); ir.addEventListener('change', salvarT);
    body.appendChild(campo('Regra (opcional)', ir));
    var sw = el('div', 'row');
    function chave(label, prop, id2){ var l = el('label', 'switch'); var c = el('input'); c.type = 'checkbox'; c.id = id2; c.checked = !!b[prop]; c.addEventListener('change', function(){ b[prop] = c.checked; if(prop === 'vale' && c.checked) b.opcional = false; if(prop === 'opcional' && c.checked) b.vale = false; salvarT(); renderRotina(); }); l.appendChild(c); l.appendChild(document.createTextNode(label)); return l; }
    sw.appendChild(chave('Vale ponto', 'vale', 'bh-v-' + b.k));
    sw.appendChild(chave('Opcional', 'opcional', 'bh-o-' + b.k));
    sw.appendChild(chave('É treino', 'treino', 'bh-tr-' + b.k));
    body.appendChild(sw);
    var del = el('button', 'btn small danger', 'Remover bloco'); del.type = 'button'; del.id = 'bh-x-' + b.k;
    del.addEventListener('click', function(){ if(!confirm('Remover "' + b.t + '" da rotina padrão?')) return; T[tplLista] = T[tplLista].filter(function(x){ return x !== b; }); salvarT(); renderRotina(); toast('Removido.'); });
    body.appendChild(del);
    card.appendChild(body);
    box.appendChild(card);
  });
}
$('tpl-util').addEventListener('click', function(){ tplLista = 'util'; renderRotina(); });
$('tpl-fds').addEventListener('click', function(){ tplLista = 'fds'; renderRotina(); });
$('addBlock').addEventListener('click', function(){
  var lista = T[tplLista], ult = lista.length ? lista.slice().sort(function(a, b){ return mins(a.h) - mins(b.h); })[lista.length - 1].h : '12:00';
  var nb = B(uid(), hhmm(Math.min(1439, mins(ult) + 30)), 'Novo bloco', '', {vale:true});
  lista.push(nb); aberto[nb.k] = true; salvarT(); renderRotina();
  setTimeout(function(){ var i = $('bh-t-' + nb.k); if(i){ i.focus(); i.select(); } }, 50);
});
$('tplReset').addEventListener('click', function(){ if(!confirm('Voltar a rotina padrão para a original? Os dias já marcados continuam.')) return; T = rotinaOriginal(); salvarT(); renderRotina(); toast('Rotina original de volta.'); });

/* ===== MAIS ===== */
var DIAG = [
  {id:'meq', t:'Cronotipo (questionário MEQ)', s:'5 min. Busque "questionário matutinidade vespertinidade Horne-Östberg".'},
  {id:'tempo', t:'Auditoria de tempo de 7 dias', s:'Toggl Track ou planilha, mais o tempo de tela do celular.'},
  {id:'extrato', t:'Raio-x do extrato de 90 dias', s:'Em cada gasto: me arrependo? S ou N.'},
  {id:'registrato', t:'Registrato, Serasa e Valores a Receber', s:'Mapa oficial das dívidas, grátis. registrato.bcb.gov.br'},
  {id:'febraban', t:'Índice de Saúde Financeira da Febraban', s:'10 min. indice.febraban.org.br. Refazer em 31/12.'}
];
function renderDiag(){
  var ul = $('diag'); ul.textContent = '';
  var ok = 0;
  DIAG.forEach(function(it){
    var on = !!diag[it.id]; if(on) ok++;
    var li = el('li'), b = el('button'); b.type = 'button'; b.id = 'dg-' + it.id; b.setAttribute('aria-pressed', on ? 'true' : 'false');
    var box = el('span', 'box'); box.innerHTML = CHECK; b.appendChild(box);
    var tx = el('span'); tx.appendChild(el('span', 't', it.t)); tx.appendChild(el('span', 's', it.s)); b.appendChild(tx);
    b.addEventListener('click', function(){ diag[it.id] = !diag[it.id]; gravar('diag', diag); renderDiag(); });
    li.appendChild(b); ul.appendChild(li);
  });
  $('diagCount').textContent = ok + ' de ' + DIAG.length;
}
function resumo(){
  var hoje = midnight(agora()), seg = monday(addDays(hoje, hoje.getDay() === 1 ? -1 : 0)), linhas = [], datas = [];
  for(var i = 0; i < 7; i++) datas.push(addDays(seg, i));
  var t = periodo(datas);
  linhas.push('Check-in da rotina (' + seg.getDate() + '/' + pad(seg.getMonth()+1) + ' a ' + datas[6].getDate() + '/' + pad(datas[6].getMonth()+1) + ')');
  linhas.push('Semana: ' + (t.p == null ? 'sem dados' : t.p + '% (' + t.feito + ' de ' + t.total + ')') + ' · treinos: ' + t.treinos + ' · sequência: ' + sequencia() + ' dias');
  datas.forEach(function(d){
    var r = placar(d); if(!r.conta) return;
    linhas.push(DOW3[d.getDay()] + ' ' + d.getDate() + ': ' + (r.total ? r.feito + '/' + r.total + ' (' + r.p + '%)' : '–') + (r.faltou.length ? ' furou: ' + nomes(r.faltou) : ''));
  });
  var hh = Object.keys(t.por).sort(function(a, b){ return mins(horaDe(a)) - mins(horaDe(b)); }).map(function(id){ return nomeDe(id) + ' ' + t.por[id].feito + '/' + t.por[id].total; });
  if(hh.length) linhas.push('Hora por hora: ' + hh.join(' · '));
  if(t.fraco) linhas.push('Ponto fraco: ' + nomeDe(t.fraco));
  var dg = DIAG.filter(function(x){ return diag[x.id]; }).map(function(x){ return x.t; });
  linhas.push('Diagnósticos feitos: ' + (dg.length ? dg.join(', ') : 'nenhum'));
  linhas.push(resumoFin());
  return linhas.join('\n');
}
function copiar(txt, ok){
  var done = function(){ toast(ok || 'Copiado. Agora cola na conversa.'); };
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function(){ prompt('Copia daqui:', txt); });
  else prompt('Copia daqui:', txt);
}
$('copyResumo').addEventListener('click', function(){ copiar(resumo()); });
$('exportBtn').addEventListener('click', function(){
  var data = JSON.stringify({versao:VERSAO, exportadoEm:new Date().toISOString(), template:T, dias:dias, diag:diag, cfg:cfg, fin:FIN});
  try{
    var blob = new Blob([data], {type:'application/json'}), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'rotina-backup-' + keyOf(midnight(agora())) + '.json';
    document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    toast('Backup salvo em Downloads.');
  }catch(e){ copiar(data, 'Backup copiado. Cola num bloco de notas.'); }
});
$('importBtn').addEventListener('click', function(){ $('importFile').click(); });
$('importFile').addEventListener('change', function(){
  var f = this.files && this.files[0]; if(!f) return;
  var rd = new FileReader();
  rd.onload = function(){
    try{
      var o = JSON.parse(rd.result);
      if(!o || !o.dias) throw new Error('x');
      if(!confirm('Importar o backup de ' + (o.exportadoEm || '?').slice(0, 10) + '? Ele substitui o que está no celular.')) return;
      if(o.template && o.template.util) T = o.template; dias = o.dias || {}; diag = o.diag || {}; cfg = o.cfg || {};
      if(o.fin && o.fin.orc){ FIN = o.fin; finSave(); }
      salvarT(); salvarDias(); gravar('diag', diag); gravar('cfg', cfg); render(); toast('Backup importado.');
    }catch(e){ toast('Esse arquivo não é um backup válido.'); }
  };
  rd.readAsText(f); this.value = '';
});
$('wipeBtn').addEventListener('click', function(){
  if(!confirm('Apagar TODOS os dias marcados, a rotina personalizada e as finanças? Não dá pra desfazer.')) return;
  if(!confirm('Certeza? Faz um backup antes se tiver dúvida.')) return;
  ['template','dias','diag','cfg','fin'].forEach(function(k){ try{ localStorage.removeItem('rotina.v3.' + k); }catch(e){} });
  carregar(); finLoad(); render(); toast('Tudo apagado.');
});

/* ===== instalar (PWA) ===== */
var deferredPrompt = null;
function standalone(){ return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; }
function renderInstall(){
  var b1 = $('installBanner'), b2 = $('installBtn2'), help = $('installHelp');
  var dispensou = false; try{ dispensou = sessionStorage.getItem('inst-dep') === '1'; }catch(e){}
  if(standalone()){ b1.hidden = true; b2.hidden = true; help.textContent = 'Já está instalado neste celular. Abre pela gaveta de apps.'; return; }
  b1.hidden = !(deferredPrompt && !dispensou && tab === 'hoje');
  b2.hidden = !deferredPrompt;
  help.textContent = deferredPrompt ? 'Instalado, ele aparece na gaveta de apps, abre em tela cheia e funciona sem internet.' : 'No Chrome: menu ⋮ (ao lado da barra de endereço) → "Instalar e criar atalho" → "Instalar". Aí ele aparece na gaveta de apps.';
}
window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); deferredPrompt = e; renderInstall(); });
window.addEventListener('appinstalled', function(){ deferredPrompt = null; renderInstall(); toast('Instalado. Agora abre pela gaveta de apps.', 4000); });
function instalar(){ if(!deferredPrompt) return; var p = deferredPrompt; deferredPrompt = null; p.prompt(); p.userChoice.then(function(){ renderInstall(); }); }
$('installBtn').addEventListener('click', instalar);
$('installBtn2').addEventListener('click', instalar);
$('installLater').addEventListener('click', function(){ try{ sessionStorage.setItem('inst-dep', '1'); }catch(e){} renderInstall(); });

/*FINMARK*/
/* ===== abas, relogio, boot ===== */
var TABS = ['hoje','placar','financas','investir','mais'], plSeg = 'semana', rotAberta = true;
function irEditarRotina(){ rotAberta = true; editing = false; setTab('mais'); setTimeout(function(){ var h = $('rotBox'); if(h) window.scrollTo({top: h.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth'}); }, 60); }
$('editRotina').addEventListener('click', irEditarRotina);
$('editRotina2').addEventListener('click', irEditarRotina);
function render(){
  if(tab === 'hoje') renderHoje();
  else if(tab === 'placar'){ $('pl-sem').hidden = plSeg !== 'semana'; $('pl-m').hidden = plSeg !== 'mes'; $('pl-semana').setAttribute('aria-selected', plSeg === 'semana' ? 'true' : 'false'); $('pl-mes').setAttribute('aria-selected', plSeg === 'mes' ? 'true' : 'false'); if(plSeg === 'semana') renderSemana(); else renderMes(); }
  else if(tab === 'financas') renderFin();
  else if(tab === 'investir') renderInv();
  else { renderDiag(); renderLembretes(); $('rotBox').hidden = !rotAberta; $('rotToggle').textContent = rotAberta ? 'Fechar' : 'Abrir'; if(rotAberta) renderRotina(); }
  $('fab').hidden = tab !== 'financas' || finSeg === 'guia';
  renderInstall();
}
$('pl-semana').addEventListener('click', function(){ plSeg = 'semana'; render(); });
$('pl-mes').addEventListener('click', function(){ plSeg = 'mes'; render(); });
$('rotToggle').addEventListener('click', function(){ rotAberta = !rotAberta; render(); });
function setTab(t){
  tab = t;
  TABS.forEach(function(n){ $('tab-' + n).hidden = n !== t; $('tb-' + n).setAttribute('aria-selected', n === t ? 'true' : 'false'); });
  window.scrollTo(0, 0);
  render();
}
TABS.forEach(function(n){ $('tb-' + n).addEventListener('click', function(){ if(n === 'hoje' && tab === 'hoje'){ sel = midnight(agora()); editing = false; } setTab(n); }); });
$('wkPrev').addEventListener('click', function(){ wk = addDays(wk, -7); renderSemana(); });
$('wkNext').addEventListener('click', function(){ wk = addDays(wk, 7); renderSemana(); });
$('moPrev').addEventListener('click', function(){ mo = new Date(mo.getFullYear(), mo.getMonth() - 1, 1); picked = null; renderMes(); });
$('moNext').addEventListener('click', function(){ mo = new Date(mo.getFullYear(), mo.getMonth() + 1, 1); picked = null; renderMes(); });

var diaAtual = keyOf(midnight(agora())), balde = -1;
function tick(){
  var now = agora(), hoje = midnight(now);
  if(keyOf(hoje) !== diaAtual){
    var eraHoje = keyOf(sel) === diaAtual; diaAtual = keyOf(hoje);
    if(eraHoje){ sel = hoje; editing = false; }
    render(); return;
  }
  if(tab !== 'hoje' || editing) return;
  var b = Math.floor((now.getHours()*60 + now.getMinutes()) / 5);
  if(b !== balde){ balde = b; renderHoje(); } else renderNow();
}
carregar(); finLoad();
aplicarTema(temaAtual());
$('temaSeg').addEventListener('click', function(e){ var b = e.target.closest('button'); if(!b) return; var t = b.getAttribute('data-tema'); try{ localStorage.setItem('rotina.v3.tema', t); }catch(x){} aplicarTema(t); toast(t === 'light' ? 'Tema claro.' : t === 'dark' ? 'Tema escuro.' : 'Segue o celular.'); });
if(window.matchMedia) try{ window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(){ if(temaAtual() === 'auto') aplicarTema('auto'); }); }catch(e){}
$('icsBtn').addEventListener('click', function(){ try{ var blob = new Blob([icsDaRotina()], {type:'text/calendar'}), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'rotina.ics'; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1500); toast('Arquivo baixado. No computador: Google Agenda → Configurações → Importar.', 5000); }catch(e){ toast('Não consegui gerar o arquivo.'); } });
$('ver').textContent = 'Rotina v' + VERSAO;
setTab(TABS.indexOf(abrir) > -1 ? abrir : 'hoje');
try{ if(new URLSearchParams(location.search).get('acao') === 'lancar'){ setTab('financas'); setTimeout(function(){ sheetLanc(); }, 150); history.replaceState(null, '', location.pathname); } }catch(e){}
setInterval(tick, 20000);
document.addEventListener('visibilitychange', function(){ if(!document.hidden) tick(); });
if(navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function(){});
if('serviceWorker' in navigator && location.protocol === 'https:'){
  navigator.serviceWorker.register('sw.js').then(function(reg){
    reg.addEventListener('updatefound', function(){
      var nw = reg.installing; if(!nw) return;
      nw.addEventListener('statechange', function(){ if(nw.state === 'installed' && navigator.serviceWorker.controller) toast('Versão nova pronta. Fecha e abre o app.', 5000); });
    });
  }).catch(function(){});
}
})();
</script>
</body>
</html>
