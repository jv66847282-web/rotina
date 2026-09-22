
/* ===== HOJE ===== */
function rec(date){
  var k = keyOf(date), r = dias[k] ? clone(dias[k]) : {data:k, itens:{}};
  if(!r.itens) r.itens = {}; r.data = k;
  return r;
}
function commit(date, r){
  var k = keyOf(date);
  if(same(date, midnight(agora())) || !Array.isArray(r.plano)) r.plano = obrigatorios(date);
  r.atualizadoEm = new Date().toISOString();
  dias[k] = r; salvarDias();
}
function toggle(date, k){
  var r = rec(date), was = marcado(r, k), antes = placar(date).p;
  r.itens[k] = !was;
  commit(date, r);
  popId = was ? null : k;
  try{ if(navigator.vibrate) navigator.vibrate(was ? 6 : 14); }catch(e){}
  render();
  var depois = placar(date);
  if(!was && depois.p === 100 && antes !== 100 && depois.total >= 3){ confete(); toast(escolhe(FALA.cheio, date.getDate()), 3200); }
}

function anel(r, txt, size){
  var a = el('span', 'ring ' + size + ((!r.conta || r.p == null) ? ' off' : (r.p === 0 ? ' zero' : (r.p === 100 && !r.hoje ? ' full' : ''))));
  a.style.setProperty('--p', r.p || 0);
  a.appendChild(el('span', null, String(txt)));
  return a;
}
function fase(hoje){
  var diff = Math.round((hoje - INICIO) / 864e5);
  if(diff < 0) return 'ensaio';
  var w = Math.floor(diff / 7) + 1;
  return w <= 6 ? 'semana ' + w + ' de 6' : 'semana ' + w;
}
function coach(r){
  if(!r.conta) return 'Hoje é aquecimento. O placar começa a valer na terça, 22/09.';
  if(!r.total) return 'Dia sem estações. Ajusta a rotina na aba Rotina.';
  if(r.feito === r.total) return 'Dia cheio. É assim que o João de dezembro é construído.';
  if(r.feito === 0) return 'Dia começando. A primeira vitória é estar de pé às ' + hora(plano(sel)[0] ? plano(sel)[0].s : 420) + '.';
  return r.feito + ' de ' + r.total + '. Continua.';
}
function renderHead(){
  var now = agora(), hoje = midnight(now), ehHoje = same(sel, hoje), r = placar(sel), kk = $('kicker');
  kk.textContent = '';
  if(ehHoje){
    var seq = sequencia(), h = now.getHours();
    kk.appendChild(el('span', null, DOW3[sel.getDay()] + ' · ' + sel.getDate() + ' ' + MES3[sel.getMonth()] + ' · ' + fase(hoje)));
    if(seq >= 2){ var f = el('span', 'fire'); f.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/></svg>'; f.appendChild(document.createTextNode(seq + ' dias seguidos')); kk.appendChild(f); }
    $('hello').textContent = (h < 5 ? 'Boa noite' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite') + ', João.';
    $('sub').textContent = coach(r);
  } else {
    kk.appendChild(el('span', null, r.futuro ? 'ainda não chegou' : 'dia anterior'));
    $('hello').textContent = DOWL[sel.getDay()] + ', ' + sel.getDate() + ' de ' + MES3[sel.getMonth()];
    $('sub').textContent = r.futuro ? 'Dá pra ver e ajustar o plano, mas só marca quando o dia chegar.' : !r.conta ? 'Aquecimento: esse dia não entra no placar.' : r.feito + ' de ' + r.total + ' cumpridos. Esqueceu de marcar algo? Marca agora.';
  }
  $('back').hidden = ehHoje;
  var ring = $('dayRing');
  ring.className = 'ring ring-xl' + ((!r.conta || r.p == null) ? ' off' : (r.p === 0 ? ' zero' : (r.p === 100 ? ' full' : '')));
  tweenRing(ring, $('dayPct'), r.p);
}
var ringAnim = null;
function tweenRing(ring, label, alvo){
  var de = parseFloat(ring.getAttribute('data-p') || '0'), para = alvo == null ? 0 : alvo, t0 = performance.now();
  if(ringAnim) cancelAnimationFrame(ringAnim);
  if(alvo == null){ ring.style.setProperty('--p', 0); ring.setAttribute('data-p', '0'); label.textContent = '–'; return; }
  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  (function frame(now){
    var k = reduz ? 1 : Math.min(1, (now - t0) / 550), e = 1 - Math.pow(1 - k, 3), v = de + (para - de) * e;
    ring.style.setProperty('--p', v); label.textContent = Math.round(v) + '%';
    if(k < 1) ringAnim = requestAnimationFrame(frame); else ring.setAttribute('data-p', String(para));
  })(t0);
}
function renderStrip(){
  var box = $('strip'); box.textContent = '';
  var hoje = midnight(agora()), seg = monday(sel);
  for(var i = 0; i < 7; i++){
    (function(d, i){
      var r = placar(d), b = el('button', 'chip' + (same(d, sel) ? ' sel' : '') + (same(d, hoje) ? ' today' : ''));
      b.type = 'button'; b.id = 'chip-' + i;
      b.setAttribute('aria-label', DOWL[d.getDay()] + ', dia ' + d.getDate() + (r.p != null ? ', ' + r.p + '%' : ''));
      b.appendChild(el('span', null, DOW3[d.getDay()]));
      b.appendChild(anel(r, d.getDate(), 'ring-sm'));
      b.appendChild(el('i'));
      b.addEventListener('click', function(){ sel = d; editing = false; renderHoje(); });
      box.appendChild(b);
    })(addDays(seg, i), i);
  }
}
function renderOntem(){
  var box = $('ontem'); box.textContent = '';
  var now = agora(), hoje = midnight(now), on = addDays(hoje, -1), r = placar(on);
  if(!same(sel, hoje) || !r.conta || now.getHours() >= 12 || editing){ box.hidden = true; return; }
  box.hidden = false;
  var rr = dias[keyOf(on)];
  box.appendChild(el('h3', null, 'Ontem: ' + r.feito + ' de ' + r.total + ' · ' + (r.p || 0) + '%'));
  var txt = r.vazio ? 'Ontem ficou sem registro, e dia sem marcar conta zero. Marca o que fez ou assume o zero.' : escolhe(FALA.ontem[nivel(r.p)], on.getDate());
  if(!r.vazio && r.faltou.length && nivel(r.p) < 4) txt += ' Furou: ' + nomes(r.faltou) + '.';
  box.appendChild(el('p', null, txt));
  var falt = plano(on).filter(function(b){ return b.vale && !marcado(rr, b.k); });
  if(falt.length){
    box.appendChild(el('p', 'small', 'Fez e esqueceu de marcar? Toca:'));
    var qd = el('div', 'quick');
    falt.forEach(function(b){
      var p = el('button', 'pill', b.t); p.type = 'button'; p.id = 'on-' + b.k; p.setAttribute('aria-pressed', 'false');
      p.addEventListener('click', function(){ toggle(on, b.k); });
      qd.appendChild(p);
    });
    box.appendChild(qd);
  }
}
function renderRetorno(){
  var box = $('retorno'), hoje = midnight(agora());
  box.hidden = true;
  if(!same(sel, hoje) || editing) return;
  var hojeRec = dias[keyOf(hoje)], hojeTreino = plano(hoje).filter(function(b){ return b.treino; });
  if(hojeTreino.some(function(b){ return marcado(hojeRec, b.k); })) return;
  var d = addDays(hoje, -1);
  for(var n = 0; n < 7 && d >= CONTA_DESDE; n++, d = addDays(d, -1)){
    var P = plano(d), rr = dias[keyOf(d)];
    if(P.some(function(b){ return b.treino && marcado(rr, b.k); })) return;
    if(P.some(function(b){ return b.treino && b.vale; })){
      var temHoje = hojeTreino.some(function(b){ return b.vale; });
      box.textContent = 'Faltou o treino de ' + DOWL[d.getDay()].toLowerCase() + '. ' + (temHoje ? 'O de hoje é de retorno: nem que seja a versão de 20 min.' : 'O próximo é de retorno e não pode cair.') + ' Duas faltas seguidas, nunca.';
      box.hidden = false; return;
    }
  }
}
var nowId = null;
function renderNow(){
  var box = $('now'), now = agora(), hoje = midnight(now);
  if(!same(sel, hoje) || editing){ box.hidden = true; return; }
  box.hidden = false;
  var L = plano(hoje), m = now.getHours()*60 + now.getMinutes(), cur = null, nxt = null, k;
  for(k = 0; k < L.length; k++){ if(m >= L[k].s && m < L[k].e){ cur = L[k]; break; } }
  for(k = 0; k < L.length; k++){ if(L[k].s > m){ nxt = L[k]; break; } }
  var s0 = L.length ? L[0].s : 420;
  if(!cur) cur = m < s0 ? {s:0, e:s0, t:'Dormir', d:'Luz apagada. Às ' + hora(s0) + ', de pé.', r:''} : {s:m, e:1440, t:'Fim do dia', d:'', r:''};
  var falta = nxt ? nxt.s - m : (1440 - m) + (plano(addDays(hoje, 1))[0] || {s:420}).s;
  if(!nxt) nxt = plano(addDays(hoje, 1))[0] || {s:420, t:'Acordar'};
  box.style.setProperty('--a', sky(m)); box.style.setProperty('--b', sky(m + 150));
  $('nowEye').textContent = 'Agora · ' + hora(cur.s) + ' às ' + hora(cur.e);
  $('nowTitle').textContent = cur.t;
  $('nowDesc').textContent = cur.d;
  $('nowRule').textContent = cur.r || ''; $('nowRule').hidden = !cur.r;
  $('nowBar').style.width = Math.min(100, Math.max(0, (m - cur.s) / ((cur.e - cur.s) || 1) * 100)) + '%';
  $('nextTxt').textContent = 'Próximo · ' + hora(nxt.s) + ' ' + nxt.t;
  var h = Math.floor(falta / 60), mm = falta % 60;
  $('nextIn').textContent = 'em ' + (h ? h + 'h' + (mm ? pad(mm) : '') : mm + ' min');
  var btn = $('nowBtn');
  nowId = cur.k || null;
  btn.hidden = !nowId;
  if(nowId){
    var ok = marcado(dias[keyOf(hoje)], nowId);
    btn.setAttribute('aria-pressed', ok ? 'true' : 'false');
    btn.textContent = ok ? 'Cumprido ✓' : 'Marcar como cumprido';
  }
  /* acordou mais tarde: um toque empurra o dia inteiro */
  var sh = $('nowShift'), first = L[0], atraso = first ? m - first.s : 0;
  shiftInfo = null;
  if(first && first.check && !marcado(dias[keyOf(hoje)], first.k) && atraso >= 10 && m < 720){
    var arred = Math.round(atraso / 5) * 5;
    shiftInfo = {k:first.k, novo:first.s + arred};
    sh.textContent = 'Acordei agora → empurrar o dia ' + arred + ' min';
    sh.hidden = false;
  } else sh.hidden = true;
}
var shiftInfo = null;
$('nowShift').addEventListener('click', function(){
  if(!shiftInfo) return;
  var hoje = midnight(agora()), r = rec(hoje), L = plano(hoje), delta = shiftInfo.novo - L[0].s;
  r.horarios = r.horarios || {};
  L.forEach(function(b){ r.horarios[b.k] = hhmm(b.s + delta); });
  r.itens[shiftInfo.k] = true;
  commit(hoje, r); popId = shiftInfo.k; render();
  toast('Dia empurrado ' + delta + ' min. Bom dia.', 2600);
});
function renderProg(){
  var box = $('prog'), now = agora(), hoje = midnight(now), r = placar(sel);
  if(editing || r.futuro){ box.hidden = true; return; }
  box.hidden = false;
  var rr = dias[keyOf(sel)], P = plano(sel), m = now.getHours()*60 + now.getMinutes();
  var est = P.filter(function(b){ return b.vale; });
  $('progFeito').textContent = String(r.feito);
  $('progDe').textContent = 'de ' + r.total + ' ' + (r.total === 1 ? 'estação' : 'estações');
  $('progPct').textContent = r.p == null ? '' : r.p + '%';
  var segs = $('segs'); segs.textContent = '';
  segs.style.gridTemplateColumns = 'repeat(' + Math.max(1, est.length) + ',minmax(0,1fr))';
  est.forEach(function(b){
    var ok = marcado(rr, b.k), late = !ok && (sel < hoje || (same(sel, hoje) && m >= b.due));
    segs.appendChild(el('i', (ok ? 'on' : '') + (late ? ' late' : '')));
  });
  var msg = $('progMsg');
  msg.className = 'prog-msg' + (r.p === 100 ? ' full' : '');
  if(!r.conta) msg.textContent = 'Fora do placar.';
  else if(r.p === 100) msg.textContent = 'Fechou tudo.';
  else if(r.faltou.length && sel < hoje) msg.textContent = 'Furou: ' + nomes(r.faltou) + '.';
  else { var atras = est.filter(function(b){ return !marcado(rr, b.k) && m >= b.due; }); msg.textContent = atras.length ? 'Sem marcar: ' + nomes(atras.map(function(b){ return b.k; })) + '.' : (r.feito ? 'Em dia até agora.' : 'Toca na estação quando cumprir.'); }
}
function renderRail(){
  var box = $('rail'); box.textContent = '';
  if(editing){ box.hidden = true; return; }
  box.hidden = false;
  var now = agora(), hoje = midnight(now), ehHoje = same(sel, hoje), passado = sel < hoje, futuro = sel > hoje;
  var conta = sel >= CONTA_DESDE, rr = dias[keyOf(sel)], m = now.getHours()*60 + now.getMinutes();
  var L = plano(sel), temAjuste = rr && ((rr.horarios && Object.keys(rr.horarios).length) || (rr.pulados && rr.pulados.length));
  L.forEach(function(b){
    var reached = passado || (ehHoje && m >= b.s), isnow = ehHoje && m >= b.s && m < b.e;
    var done = b.check && marcado(rr, b.k);
    var late = b.vale && !done && conta && (passado || (ehHoje && m >= b.due));
    var delay = late && ehHoje && (m - b.due) < 30;
    var row = el('button', 'stop' + ((b.vale || b.opcional) ? '' : ' minor') + (reached ? ' reached' : '') + (isnow ? ' isnow' : '') + (done ? ' done' : '') + (late ? (delay ? ' delay' : ' late') : '') + (popId === b.k ? ' pop' : ''));
    row.style.setProperty('--c', sky(b.s)); row.style.setProperty('--c2', sky(b.e));
    row.appendChild(el('span', 'time', hora(b.s)));
    var track = el('span', 'track');
    var node = el('span', 'node'); node.innerHTML = CHECK; track.appendChild(node);
    row.appendChild(track);
    var body = el('span', 'body'), t = el('span', 't', b.t);
    if(late) t.appendChild(el('span', 'tag ' + (delay ? 'delay' : 'late'), passado ? 'furou' : delay ? 'atrasado ' + (m - b.due) + ' min' : 'sem marcar'));
    else if(b.opcional && !done) t.appendChild(el('span', 'tag opt', 'opcional'));
    else if(isnow) t.appendChild(el('span', 'tag nowtag', 'agora'));
    if(rr && rr.horarios && rr.horarios[b.k] && rr.horarios[b.k] !== horaDe(b.k) && !late && !isnow) t.appendChild(el('span', 'tag edit', 'ajustado'));
    body.appendChild(t);
    if(b.d) body.appendChild(el('span', 'd', b.d));
    row.appendChild(body);
    if(b.check){
      row.type = 'button'; row.id = 'st-' + b.k;
      row.setAttribute('aria-pressed', done ? 'true' : 'false');
      if(futuro) row.disabled = true;
      row.addEventListener('click', function(){ toggle(sel, b.k); });
    }
    box.appendChild(row);
  });
  if(temAjuste){ var n = el('p', 'note', 'Horários ajustados só neste dia.'); n.style.marginTop = '8px'; box.appendChild(n); }
  popId = null;
}

/* modo de ajuste */
function renderEdit(){
  var bar = $('editbar'); bar.hidden = !editing;
  $('editToggle').hidden = editing;
  if(!editing) return;
  var list = $('editList'); list.textContent = '';
  var rr = dias[keyOf(sel)] || {}, pul = rr.pulados || [];
  var Lfull = plano(sel, true), L = plano(sel);
  var mapa = {}; L.forEach(function(b){ mapa[b.k] = b; });
  Lfull.forEach(function(b0){
    var b = mapa[b0.k], skipped = pul.indexOf(b0.k) > -1;
    var row = el('div', 'estop' + (skipped ? ' skipped' : ''));
    var tx = el('span', 'txt'); tx.appendChild(el('span', 't', b0.t)); if(b0.vale) tx.appendChild(el('span', 'd', 'vale ponto')); row.appendChild(tx);
    var ctl = el('span', 'ctl'), atual = skipped ? b0.s : b.s;
    var inp = el('input'); inp.type = 'time'; inp.id = 'et-' + b0.k; inp.value = hhmm(atual); inp.step = 300; inp.disabled = skipped;
    inp.setAttribute('aria-label', 'Horário de ' + b0.t);
    inp.addEventListener('change', function(){ if(inp.value) mudarHora(b0.k, mins(inp.value)); });
    [-15, -5].forEach(function(dm){ var bt = el('button', null, String(dm)); bt.type = 'button'; bt.id = 'es' + dm + '-' + b0.k; bt.setAttribute('aria-label', dm + ' minutos em ' + b0.t); bt.addEventListener('click', function(){ mudarHora(b0.k, atual + dm); }); ctl.appendChild(bt); });
    ctl.appendChild(inp);
    [5, 15].forEach(function(dm){ var bt = el('button', null, '+' + dm); bt.type = 'button'; bt.id = 'es' + dm + '-' + b0.k; bt.setAttribute('aria-label', '+' + dm + ' minutos em ' + b0.t); bt.addEventListener('click', function(){ mudarHora(b0.k, atual + dm); }); ctl.appendChild(bt); });
    var x = el('button', 'x'); x.type = 'button'; x.id = 'ex-' + b0.k; x.setAttribute('aria-label', skipped ? 'Voltar ' + b0.t : 'Pular ' + b0.t + ' hoje');
    x.innerHTML = skipped ? '<svg viewBox="0 0 24 24"><path d="M4 12h16M13 6l6 6-6 6"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    x.addEventListener('click', function(){ pular(b0.k, !skipped); });
    row.appendChild(x);
    row.appendChild(ctl);
    list.appendChild(row);
  });
}
function mudarHora(k, novo){
  var L = plano(sel), i = -1;
  for(var j = 0; j < L.length; j++) if(L[j].k === k) i = j;
  if(i < 0) return;
  var delta = novo - L[i].s, r = rec(sel);
  r.horarios = r.horarios || {};
  L.forEach(function(b){ r.horarios[b.k] = hhmm(b.s); });
  r.horarios[k] = hhmm(novo);
  if($('empurrar').checked && delta !== 0){
    for(j = i + 1; j < L.length; j++) r.horarios[L[j].k] = hhmm(L[j].s + delta);
  }
  commit(sel, r); renderEdit(); renderHead();
}
function pular(k, sim){
  var r = rec(sel); r.pulados = (r.pulados || []).filter(function(x){ return x !== k; });
  if(sim) r.pulados.push(k);
  commit(sel, r); renderEdit(); renderHead();
}
$('editToggle').addEventListener('click', function(){ editing = true; renderHoje(); });
$('editDone').addEventListener('click', function(){ editing = false; renderHoje(); toast('Horários de ' + (same(sel, midnight(agora())) ? 'hoje' : DOWL[sel.getDay()].toLowerCase()) + ' ajustados.'); });
$('editReset').addEventListener('click', function(){ var r = rec(sel); delete r.horarios; delete r.pulados; commit(sel, r); renderEdit(); renderHead(); toast('Voltou pro padrão.'); });
$('back').addEventListener('click', function(){ sel = midnight(agora()); editing = false; renderHoje(); });
$('nowBtn').addEventListener('click', function(){ if(nowId) toggle(midnight(agora()), nowId); });

function renderHoje(){ renderHead(); renderStrip(); renderEdit(); renderOntem(); renderRetorno(); renderNow(); renderProg(); renderRail(); }
