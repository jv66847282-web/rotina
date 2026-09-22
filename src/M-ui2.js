
/* ===== GRAFICO ESTILO BOLSA (reutilizavel) ===== */
function stockChart(box, opts){
  /* opts: series [{n,c,pts:[{x,v}],on}], xmax, labels [{x,t}], marca, fmtV(v), fmtX(x) */
  var ns = 'http://www.w3.org/2000/svg', W = 360, H = 200, padL = 6, padR = 8, top = 22, base = H - 24;
  var series = opts.series.filter(function(s){ return s.on !== false && s.pts.length; }), maxV = 0;
  series.forEach(function(s){ s.pts.forEach(function(p){ if(p.v > maxV) maxV = p.v; }); });
  if(!maxV){ box.appendChild(el('p', 'empty', opts.vazio || 'Sem dados ainda.')); return; }
  maxV *= 1.08;
  var wrap = el('div', 'sc'), svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('preserveAspectRatio', 'none');
  function X(x){ return padL + x / (opts.xmax || 1) * (W - padL - padR); } function Y(v){ return base - v / maxV * (base - top); }
  var defs = document.createElementNS(ns, 'defs'); svg.appendChild(defs);
  for(var gl = 1; gl <= 3; gl++){ var y = base - (base - top) * gl / 3, ln = document.createElementNS(ns, 'line'); ln.setAttribute('x1', 0); ln.setAttribute('x2', W); ln.setAttribute('y1', y); ln.setAttribute('y2', y); ln.setAttribute('stroke', 'currentColor'); ln.style.opacity = '.07'; svg.appendChild(ln); }
  function smooth(pts){
    if(pts.length < 3) return pts.map(function(p, i){ return (i ? 'L' : 'M') + X(p.x).toFixed(1) + ' ' + Y(p.v).toFixed(1); }).join(' ');
    var d = 'M' + X(pts[0].x).toFixed(1) + ' ' + Y(pts[0].v).toFixed(1);
    for(var i = 0; i < pts.length - 1; i++){
      var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      var c1x = X(p1.x) + (X(p2.x) - X(p0.x)) / 6, c1y = Y(p1.v) + (Y(p2.v) - Y(p0.v)) / 6, c2x = X(p2.x) - (X(p3.x) - X(p1.x)) / 6, c2y = Y(p2.v) - (Y(p3.v) - Y(p1.v)) / 6;
      c1y = Math.min(base, Math.max(top - 4, c1y)); c2y = Math.min(base, Math.max(top - 4, c2y));
      d += ' C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ',' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ',' + X(p2.x).toFixed(1) + ' ' + Y(p2.v).toFixed(1);
    }
    return d;
  }
  series.forEach(function(s, k){
    var gid = 'g' + k + Math.random().toString(36).slice(2, 6), g = document.createElementNS(ns, 'linearGradient'); g.setAttribute('id', gid); g.setAttribute('x1', '0'); g.setAttribute('x2', '0'); g.setAttribute('y1', '0'); g.setAttribute('y2', '1');
    var s1 = document.createElementNS(ns, 'stop'); s1.setAttribute('offset', '0'); s1.setAttribute('stop-color', s.c); s1.setAttribute('stop-opacity', '.35'); var s2 = document.createElementNS(ns, 'stop'); s2.setAttribute('offset', '1'); s2.setAttribute('stop-color', s.c); s2.setAttribute('stop-opacity', '0'); g.appendChild(s1); g.appendChild(s2); defs.appendChild(g);
    var d = smooth(s.pts), last = s.pts[s.pts.length - 1], first = s.pts[0];
    var ap = document.createElementNS(ns, 'path'); ap.setAttribute('d', d + ' L' + X(last.x).toFixed(1) + ' ' + base + ' L' + X(first.x).toFixed(1) + ' ' + base + ' Z'); ap.setAttribute('fill', 'url(#' + gid + ')'); svg.appendChild(ap);
    var lp = document.createElementNS(ns, 'path'); lp.setAttribute('d', d); lp.setAttribute('fill', 'none'); lp.setAttribute('stroke', s.c); lp.setAttribute('stroke-width', '2.4'); lp.setAttribute('stroke-linejoin', 'round'); lp.setAttribute('stroke-linecap', 'round'); lp.setAttribute('vector-effect', 'non-scaling-stroke'); svg.appendChild(lp);
    var c = document.createElementNS(ns, 'circle'); c.setAttribute('cx', X(last.x)); c.setAttribute('cy', Y(last.v)); c.setAttribute('r', '4'); c.setAttribute('fill', s.c); c.setAttribute('stroke', 'var(--surface)'); c.setAttribute('stroke-width', '2'); svg.appendChild(c);
    var halo = document.createElementNS(ns, 'circle'); halo.setAttribute('cx', X(last.x)); halo.setAttribute('cy', Y(last.v)); halo.setAttribute('r', '8'); halo.setAttribute('fill', s.c); halo.style.opacity = '.25'; svg.appendChild(halo);
  });
  if(opts.marca != null){ var ml = document.createElementNS(ns, 'line'); ml.setAttribute('x1', X(opts.marca)); ml.setAttribute('x2', X(opts.marca)); ml.setAttribute('y1', top - 8); ml.setAttribute('y2', base); ml.setAttribute('stroke', 'currentColor'); ml.setAttribute('stroke-dasharray', '3 3'); ml.style.opacity = '.35'; svg.appendChild(ml); }
  var cross = document.createElementNS(ns, 'g'); cross.style.display = 'none';
  var cl = document.createElementNS(ns, 'line'); cl.setAttribute('y1', top - 8); cl.setAttribute('y2', base); cl.setAttribute('stroke', 'currentColor'); cl.style.opacity = '.5'; cross.appendChild(cl);
  var cdots = series.map(function(s){ var c = document.createElementNS(ns, 'circle'); c.setAttribute('r', '4.5'); c.setAttribute('fill', s.c); c.setAttribute('stroke', 'var(--bg)'); c.setAttribute('stroke-width', '2'); cross.appendChild(c); return c; });
  svg.appendChild(cross);
  (opts.labels || []).forEach(function(l){ var t = document.createElementNS(ns, 'text'); t.setAttribute('x', X(l.x)); t.setAttribute('y', H - 7); t.setAttribute('text-anchor', l.x === 0 ? 'start' : l.x >= (opts.xmax || 1) ? 'end' : 'middle'); t.textContent = l.t; t.style.fontSize = '11px'; svg.appendChild(t); });
  wrap.appendChild(svg);
  var tip = el('div', 'sc-tip'); tip.hidden = true; wrap.appendChild(tip);
  var pills = el('div', 'sc-pills'); series.forEach(function(s){ var p = el('span', 'sc-pill'); p.style.setProperty('--cc', s.c); var last = s.pts[s.pts.length - 1]; p.appendChild(el('i')); p.appendChild(document.createTextNode(s.n + ' ' + (opts.fmtV || fmtK)(last.v))); pills.appendChild(p); }); wrap.appendChild(pills);
  box.appendChild(wrap);
  function nearest(s, x){ var best = s.pts[0]; s.pts.forEach(function(p){ if(Math.abs(p.x - x) < Math.abs(best.x - x)) best = p; }); return best; }
  function mover(ev){
    var r = svg.getBoundingClientRect(), px = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left, xv = Math.max(0, Math.min(opts.xmax || 1, (px / r.width * W - padL) / (W - padL - padR) * (opts.xmax || 1)));
    var xs = series.length ? nearest(series[0], xv).x : xv; cross.style.display = ''; cl.setAttribute('x1', X(xs)); cl.setAttribute('x2', X(xs));
    var linhas = []; series.forEach(function(s, k){ var p = nearest(s, xs); cdots[k].setAttribute('cx', X(p.x)); cdots[k].setAttribute('cy', Y(p.v)); linhas.push('<span style="--cc:' + s.c + '"><i></i>' + s.n + ' <b>' + (opts.fmtV || fmtK)(p.v) + '</b></span>'); });
    tip.innerHTML = '<small>' + (opts.fmtX ? opts.fmtX(xs) : xs) + '</small>' + linhas.join(''); tip.hidden = false;
    var tw = tip.offsetWidth, left = px / r.width * wrap.clientWidth; tip.style.left = Math.max(0, Math.min(wrap.clientWidth - tw, left - tw / 2)) + 'px';
  }
  function sair(){ cross.style.display = 'none'; tip.hidden = true; }
  svg.addEventListener('pointermove', mover); svg.addEventListener('pointerdown', mover); svg.addEventListener('pointerleave', sair);
  svg.addEventListener('touchmove', function(e){ mover(e); e.preventDefault(); }, {passive:false}); svg.addEventListener('touchend', sair);
}

/* ===== FINANCAS: grafico de fluxo (estilo bolsa) ===== */
var chartPer = '1M', chartOn = {g:true, e:true, n:true};
function renderChart3(){
  var box = $('chart3'); box.textContent = '';
  var head = el('div', 'cmode');
  var segP = el('div', 'chips'); segP.style.margin = '0'; segP.style.padding = '0'; ['1M', '3M', '6M', '1A'].forEach(function(p){ var b = el('button', null, p); b.type = 'button'; b.id = 'cp-' + p; b.setAttribute('aria-pressed', chartPer === p ? 'true' : 'false'); b.addEventListener('click', function(){ chartPer = p; renderChart3(); }); segP.appendChild(b); }); head.appendChild(segP); box.appendChild(head);
  var togg = el('div', 'chips'); togg.style.margin = '0'; togg.style.padding = '0';
  [['g', 'Entrou', '#3ECF8E'], ['e', 'Essencial', '#6F8CFF'], ['n', 'Não essencial', '#FF6B7A']].forEach(function(s){ var b = el('button', null); b.type = 'button'; b.id = 'ct-' + s[0]; b.style.setProperty('--cc', s[2]); b.setAttribute('aria-pressed', chartOn[s[0]] ? 'true' : 'false'); var i = el('i'); b.appendChild(i); b.appendChild(document.createTextNode(s[1])); b.addEventListener('click', function(){ chartOn[s[0]] = !chartOn[s[0]]; renderChart3(); }); togg.appendChild(b); }); box.appendChild(togg);
  var S = {g:[], e:[], n:[]}, labels = [], xmax, marca = null, fmtX;
  function soma(L, o){ L.forEach(function(t){ if(t.tipo === 'ganho') o.g += +t.valor || 0; else if(t.tipo === 'gasto'){ if(catDe(t.cat).g === 'ess') o.e += +t.valor || 0; else o.n += +t.valor || 0; } }); }
  if(chartPer === '1M'){
    var dias = diasNoMes(fm), hoje = diaHoje(fm), porDia = {}; lancMes(fm).forEach(function(t){ var dd = +t.data.slice(8, 10); soma([t], porDia[dd] || (porDia[dd] = {g:0, e:0, n:0})); });
    var acc = {g:0, e:0, n:0}, lim = hoje > 0 ? hoje : dias; S.g.push({x:0, v:0}); S.e.push({x:0, v:0}); S.n.push({x:0, v:0});
    for(var dd = 1; dd <= lim; dd++){ var o = porDia[dd]; if(o){ acc.g += o.g; acc.e += o.e; acc.n += o.n; } S.g.push({x:dd, v:acc.g}); S.e.push({x:dd, v:acc.e}); S.n.push({x:dd, v:acc.n}); }
    xmax = dias; [1, 10, 20, dias].forEach(function(dd){ labels.push({x:dd, t:dd + ' ' + MES3[fm.getMonth()]}); }); marca = hoje > 0 && hoje < dias ? hoje : null; fmtX = function(x){ return 'até dia ' + Math.round(x); };
  } else {
    var nM = chartPer === '3M' ? 3 : chartPer === '6M' ? 6 : 12; xmax = nM - 1;
    for(var i = nM - 1; i >= 0; i--){ var d = new Date(fm.getFullYear(), fm.getMonth() - i, 1), o2 = {g:0, e:0, n:0}; soma(lancMes(d), o2); var x = nM - 1 - i; S.g.push({x:x, v:o2.g}); S.e.push({x:x, v:o2.e}); S.n.push({x:x, v:o2.n}); if(nM <= 6 || i % 2 === 0) labels.push({x:x, t:MES3[d.getMonth()]}); }
    fmtX = function(x){ var d = new Date(fm.getFullYear(), fm.getMonth() - (nM - 1 - Math.round(x)), 1); return MESL[d.getMonth()] + ' ' + d.getFullYear(); };
  }
  stockChart(box, {series:[{n:'Entrou', c:'#3ECF8E', pts:S.g, on:chartOn.g}, {n:'Essencial', c:'#6F8CFF', pts:S.e, on:chartOn.e}, {n:'Não essencial', c:'#FF6B7A', pts:S.n, on:chartOn.n}], xmax:xmax, labels:labels, marca:marca, fmtX:fmtX, vazio:'Sem lançamentos neste período.'});
  var lastG = S.g[S.g.length - 1], lastE = S.e[S.e.length - 1], lastN = S.n[S.n.length - 1];
  if(lastG && lastG.v > 0) box.appendChild(el('p', 'small', (chartPer === '1M' ? 'Este mês: ' : 'No último mês: ') + Math.round(lastE.v / lastG.v * 100) + '% do que entrou foi pro essencial e ' + Math.round(lastN.v / lastG.v * 100) + '% pro não essencial. O vermelho é a parte que você controla.'));
}

/* ===== FINANCAS: simulador de corte ===== */
function simSet(){ FIN.cfg = FIN.cfg || {}; if(!FIN.cfg.sim) FIN.cfg.sim = {}; return FIN.cfg.sim; }
function renderCorte(r){
  var box = $('corteBox'); box.textContent = ''; var itens = [], sim = simSet();
  orcAtivo(FIN.orc.nao).forEach(function(o){ itens.push({id:'orc:' + o.id, tipo:'planilha', o:o, nome:o.nome, valor:+o.valor, sub:'fixo da planilha'}); });
  var por = {}, best = {}; lancMes(fm).forEach(function(t){ if(t.tipo !== 'gasto' || t.orc) return; if(t.arrep){ var k = (t.desc || catDe(t.cat).n).toLowerCase().replace(/\s*·.*$/, '').trim(); var b = best[k] || (best[k] = {nome:t.desc || catDe(t.cat).n, n:0, v:0}); b.n++; b.v += +t.valor || 0; } else if(catDe(t.cat).g === 'nao') por[t.cat] = (por[t.cat] || 0) + (+t.valor || 0); });
  Object.keys(best).forEach(function(k){ itens.push({id:'best:' + k, tipo:'best', nome:best[k].nome, valor:best[k].v, sub:'besteira · ' + best[k].n + (best[k].n === 1 ? ' vez' : ' vezes') + ' no mês'}); });
  Object.keys(por).forEach(function(id){ itens.push({id:'cat:' + id, tipo:'cat', nome:catDe(id).n, valor:por[id], sub:'avulsos do mês (sem os de besteira)'}); });
  itens.sort(function(a, b){ return b.valor - a.valor; });
  var econ = 0, nSel = 0; itens.forEach(function(x){ if(sim[x.id]){ econ += x.valor; nSel++; } });
  var ganhos = r.ganhos > 0 ? r.ganhos : rendaBase(fm), sobraAtual = ganhos - r.gastos, sobraNova = sobraAtual + econ, ess = essenciaisMes(), res = reservaTotal();
  var card = el('div', 'card simcard'); card.appendChild(el('h3', null, nSel ? 'Cortando ' + nSel + (nSel === 1 ? ' item' : ' itens') + ' desses:' : 'Marca o que você cortaria'));
  if(nSel){
    var g3 = el('div', 'sim3');
    [[fmt(econ), 'a mais por mês'], [fmt(econ * 12), 'a mais por ano'], [ganhos > 0 ? Math.round(sobraNova / ganhos * 100) + '%' : '–', 'do salário sobra (era ' + (ganhos > 0 ? Math.round(sobraAtual / ganhos * 100) : 0) + '%)']].forEach(function(x){ var d = el('div'); d.appendChild(el('b', null, x[0])); d.appendChild(el('span', null, x[1])); g3.appendChild(d); }); card.appendChild(g3);
    if(ess > 0){ var alvo = Math.max(0, ess * 3 - res), f1 = function(m){ return m.toFixed(1).replace('.', ',') + (m < 1.05 ? ' mês' : ' meses'); }, mAntes = sobraAtual > 0 ? alvo / sobraAtual : null, mDepois = sobraNova > 0 ? alvo / sobraNova : null; card.appendChild(el('p', 'small', alvo === 0 ? 'Reserva de 3 meses já está feita.' : 'Reserva de 3 meses (' + fmt(ess * 3) + '): ' + (mDepois ? 'em ' + f1(mDepois) : 'não fecha') + (mAntes ? ' em vez de ' + f1(mAntes) + '.' : ', antes não fechava.'))); }
    card.appendChild(el('p', 'small', 'Simulação. Pra cortar de verdade um fixo, usa "cortar de verdade"; pra besteira, é não repetir no mês que vem.'));
  } else card.appendChild(el('p', 'small', 'Toca em "cortar" em cada item pra ver, na hora, o que muda no seu salário e na reserva.'));
  box.appendChild(card);
  $('corteSub').textContent = itens.length ? 'até ' + fmtK(itens.reduce(function(s, x){ return s + x.valor; }, 0)) + '/mês' : '';
  if(!itens.length){ box.appendChild(el('p', 'empty', 'Nada não essencial ainda. Preenche a planilha e lança os gastos.')); return; }
  itens.slice(0, 14).forEach(function(x){
    var on = !!sim[x.id], row = el('div', 'orc-row' + (on ? ' simon' : '')); row.style.gridTemplateColumns = 'minmax(0,1fr) auto auto';
    var tx = el('span'); tx.appendChild(el('span', 'nm', x.nome)); var sb = el('span', 'sb', x.sub + ' · '); sb.appendChild(el('b', null, '+' + fmtK(x.valor * 12) + '/ano')); tx.appendChild(sb);
    if(x.tipo === 'planilha'){ var real = el('button', 'linkbtn', 'cortar de verdade'); real.type = 'button'; real.id = 'real-' + x.o.id; real.style.cssText = 'padding:0;font-size:12px;display:block'; real.addEventListener('click', function(ev){ ev.stopPropagation(); if(!confirm('Marcar "' + x.o.nome + '" como cortado na planilha?')) return; x.o.cortadoEm = new Date().toISOString(); delete sim[x.id]; finSave(); render(); toast('Cortado. Menos ' + fmt(x.o.valor) + ' por mês.'); }); tx.appendChild(real); }
    row.appendChild(tx); row.appendChild(el('span', 'vl', fmt(x.valor)));
    var b = el('button', 'cutbtn', on ? 'Cortado ✓' : 'Cortar'); b.type = 'button'; b.id = 'sim-' + x.id.replace(/[^a-z0-9]/gi, ''); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.addEventListener('click', function(){ if(on) delete sim[x.id]; else sim[x.id] = true; finSave(); renderCorte(resumoMes(fm)); try{ if(navigator.vibrate) navigator.vibrate(8); }catch(e){} });
    row.appendChild(b); box.appendChild(row);
  });
  var cortes = FIN.orc.ess.concat(FIN.orc.nao).filter(function(o){ return o.cortadoEm; }), econReal = cortes.reduce(function(a, o){ return a + (+o.valor || 0); }, 0);
  if(cortes.length) box.appendChild(el('p', 'cut-banner', 'Cortado de verdade: ' + fmt(econReal) + ' por mês (' + cortes.map(function(o){ return o.nome; }).join(', ') + ').'));
}

/* ===== FINANCAS: acoes rapidas e cartoes ===== */
function renderQuick(){
  var q = $('quick'); if(!q) return; q.textContent = '';
  [['Gasto', 'gasto', '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>'], ['Ganho', 'ganho', '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'], ['Fatura', 'transf', '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/></svg>'], ['Aporte', 'aporte', '<svg viewBox="0 0 24 24"><path d="M4 18l5-6 4 3 7-8"/><path d="M16 7h4v4"/></svg>']].forEach(function(a){
    var b = el('button', 'qa'); b.type = 'button'; b.id = 'qa-' + a[1]; var ic = el('span', 'qa-ic'); ic.innerHTML = a[2]; b.appendChild(ic); b.appendChild(el('span', null, a[0]));
    b.addEventListener('click', function(){ if(a[1] === 'aporte') sheetAporte(); else sheetLanc({id:uid(), tipo:a[1], valor:0, desc:a[1] === 'transf' ? 'Pagamento de fatura' : '', cat:a[1] === 'ganho' ? 'cliente' : a[1] === 'transf' ? 'transf' : '', conta:(FIN.cfg && FIN.cfg.contaPadrao) || (FIN.contas[0] || {}).id || '', data:keyOf(midnight(agora())), arrep:false, orc:null}, false); });
    q.appendChild(b);
  });
  var cc = $('acards'); if(!cc) return; cc.textContent = ''; var L = lancMes(fm);
  FIN.contas.forEach(function(c){
    var g = L.filter(function(t){ return t.conta === c.id && t.tipo === 'gasto'; }).reduce(function(a, t){ return a + (+t.valor || 0); }, 0);
    var card = el('button', 'acard'); card.type = 'button'; card.id = 'ac-' + c.id; card.style.setProperty('--cc', c.cor);
    card.appendChild(el('span', 'ac-tipo', TIPOS_CONTA.filter(function(t){ return t[0] === c.tipo; })[0][1]));
    card.appendChild(el('span', 'ac-nome', c.nome));
    var v = el('span', 'ac-val', fmt(g)); card.appendChild(v); card.appendChild(el('span', 'ac-sub', 'saiu este mês'));
    card.addEventListener('click', function(){ txFiltro = c.id; finSeg = 'extrato'; renderFin(); window.scrollTo(0, 0); });
    cc.appendChild(card);
  });
  var add = el('button', 'acard add'); add.type = 'button'; add.id = 'ac-add'; add.innerHTML = '<span class="ac-nome">+ conta ou cartão</span>'; add.addEventListener('click', function(){ sheetConta(); }); cc.appendChild(add);
}

/* ===== INVESTIR: patrimonio ao longo do tempo ===== */
function snapshotMes(){
  var tudo = FIN.inv.reduce(function(s, a){ return s + (+a.atual || 0); }, 0), apl = FIN.inv.reduce(function(s, a){ return s + (+a.aplicado || 0); }, 0), k = mesKey(midnight(agora()));
  FIN.snap = FIN.snap || {}; var cur = FIN.snap[k];
  if(!cur || Math.abs(cur.atual - tudo) > 0.005 || Math.abs(cur.aplicado - apl) > 0.005){ FIN.snap[k] = {atual:tudo, aplicado:apl}; finSave(); }
}
var patPer = '6M';
function renderPatrimonio(){
  var box = $('patChart'); if(!box) return; box.textContent = '';
  snapshotMes();
  var head = el('div', 'cmode'); head.appendChild(el('span', 'small', 'Patrimônio × quanto você colocou'));
  var segP = el('div', 'chips'); segP.style.margin = '0'; segP.style.padding = '0'; ['3M', '6M', '1A'].forEach(function(p){ var b = el('button', null, p); b.type = 'button'; b.id = 'pp-' + p; b.setAttribute('aria-pressed', patPer === p ? 'true' : 'false'); b.addEventListener('click', function(){ patPer = p; renderPatrimonio(); }); segP.appendChild(b); }); head.appendChild(segP); box.appendChild(head);
  var nM = patPer === '3M' ? 3 : patPer === '6M' ? 6 : 12, hoje = midnight(agora()), A = [], P = [], labels = [], ultimo = null;
  for(var i = nM - 1; i >= 0; i--){ var d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1), k = mesKey(d), s = (FIN.snap || {})[k], x = nM - 1 - i; if(s) ultimo = s; var v = s || ultimo; if(v){ A.push({x:x, v:v.atual}); P.push({x:x, v:v.aplicado}); } if(nM <= 6 || i % 2 === 0) labels.push({x:x, t:MES3[d.getMonth()]}); }
  if(A.length < 2){ box.appendChild(el('p', 'empty', 'O gráfico cresce a cada mês que você atualiza a carteira. Por enquanto, só o mês atual.')); return; }
  stockChart(box, {series:[{n:'Patrimônio', c:'#B9A2FF', pts:A}, {n:'Você colocou', c:'#3ECF8E', pts:P}], xmax:nM - 1, labels:labels, fmtX:function(x){ var d = new Date(hoje.getFullYear(), hoje.getMonth() - (nM - 1 - Math.round(x)), 1); return MESL[d.getMonth()] + ' ' + d.getFullYear(); }});
  var a0 = A[0].v, a1 = A[A.length - 1].v; if(a0 > 0) box.appendChild(el('p', 'small', 'No período: ' + (a1 >= a0 ? '+' : '−') + fmt(Math.abs(a1 - a0)) + ' (' + (a1 >= a0 ? '+' : '') + Math.round((a1 - a0) / a0 * 100) + '%), somando aportes e resultado.'));
}
