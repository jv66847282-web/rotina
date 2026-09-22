# -*- coding: utf-8 -*-
import io
def rd(p): return io.open(p, encoding='utf-8').read()
def wr(p, s): io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
def patch(path, pairs):
    s = rd(path)
    for a, b in pairs:
        assert s.count(a) == 1, (path, a[:70], s.count(a))
        s = s.replace(a, b)
    wr(path, s)

# ---------- CSS ----------
patch('src/A-head.html', [
 ('/* modo de ajuste do dia */',
  '/* linha do dia v2 */\n'
  '.rail2{position:relative;display:flex;flex-direction:column;gap:6px;padding-left:2px}\n'
  '.rail2::before{content:"";position:absolute;left:19px;top:14px;bottom:14px;width:3px;border-radius:3px;background:linear-gradient(#FFC24B,#FF9A4D 35%,#FF7A66 55%,#F2669F 75%,#A97BFF);opacity:.45}\n'
  '.st2{--c:#FFC24B;position:relative;width:100%;display:grid;grid-template-columns:40px minmax(0,1fr) 30px;gap:10px;align-items:center;background:var(--surface);border-radius:18px;padding:12px 12px 12px 0;box-shadow:inset 0 0 0 1px var(--line);text-align:left;transition:transform .12s}\n'
  '.st2:active{transform:scale(.985)}\n'
  '.st2 .bd{width:38px;height:38px;border-radius:50%;margin-left:1px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 22%,var(--surface));color:var(--c);position:relative;z-index:1;box-shadow:0 0 0 4px var(--surface)}\n'
  '.st2 .bd svg{width:19px;height:19px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}\n'
  '.st2 .tm{font-family:var(--mono);font-size:12px;color:var(--c);letter-spacing:.04em;display:block;margin-bottom:1px}\n'
  '.st2 .t{display:block;font-weight:700;font-size:16.5px;line-height:1.2}\n'
  '.st2 .d{display:block;font-size:13.5px;color:var(--muted);margin-top:2px}\n'
  '.st2 .ck{width:28px;height:28px;border-radius:50%;border:2.5px solid var(--line);display:grid;place-items:center;justify-self:end}\n'
  '.st2 .ck svg{width:15px;height:15px;stroke:var(--on-sky);stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round;opacity:0}\n'
  '.st2.isnow{box-shadow:inset 0 0 0 2px var(--c);background:linear-gradient(135deg,color-mix(in srgb,var(--c) 14%,var(--surface)),var(--surface) 60%)}\n'
  '.st2.isnow .bd{background:var(--c);color:var(--on-sky);box-shadow:0 0 0 4px var(--surface),0 0 0 7px color-mix(in srgb,var(--c) 30%,transparent)}\n'
  '.st2.done{opacity:.72}.st2.done .bd{background:var(--good);color:var(--on-sky)}.st2.done .ck{background:var(--good);border-color:var(--good)}.st2.done .ck svg{opacity:1}.st2.done .t{color:var(--muted)}\n'
  '.st2.late .ck{border-color:var(--bad)}.st2.delay .ck{border-color:var(--mid)}\n'
  '.st2.pop .bd{animation:pop .32s ease}\n'
  '.st2:disabled{cursor:default;opacity:.7}\n'
  '.ps{--c:#FFC24B;display:grid;grid-template-columns:40px minmax(0,1fr);gap:10px;align-items:center;padding:6px 8px 6px 0;min-height:34px}\n'
  '.ps .dot2{width:10px;height:10px;border-radius:50%;background:var(--c);justify-self:center;position:relative;z-index:1;box-shadow:0 0 0 3px var(--bg)}\n'
  '.ps .pt{font-size:14px;color:var(--muted);font-weight:500}.ps .pt b{font-family:var(--mono);font-weight:400;font-size:12px;margin-right:8px;color:var(--c)}.ps .pd{display:block;font-size:12.5px;color:var(--muted);opacity:.8}\n'
  '.ps.isnow .pt{color:var(--ink)}.ps.isnow .dot2{box-shadow:0 0 0 3px var(--bg),0 0 0 6px color-mix(in srgb,var(--c) 30%,transparent)}\n'
  ':root[data-theme="light"] .st2 .bd{box-shadow:0 0 0 4px var(--surface)}\n'
  '/* grafico de linhas */\n'
  '.chart3 .cmode{display:flex;justify-content:space-between;align-items:center;gap:8px}.chart3 .segctl{width:150px}.chart3 .segctl button{padding:7px 8px;font-size:13px}\n'
  '.chart3 .now-line{stroke:var(--muted);stroke-dasharray:3 3;opacity:.6}\n'
  '/* modo de ajuste do dia */'),
 ('.tema{display:grid;grid-template-columns:repeat(3,1fr)}',
  '.tema{display:grid;grid-template-columns:repeat(3,1fr)}\n.jogo-off{opacity:.55}\n.gloss{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}.gloss li{padding:10px 0;border-bottom:1px solid var(--line);font-size:14.5px}.gloss b{display:block;font-weight:700}.gloss span{color:var(--muted)}'),
])

# ---------- markup ----------
patch('src/B-body.html', [
 ('    <div class="rail" id="rail"></div>', '    <div class="rail2" id="rail"></div>'),
 ('  <div class="sec-head"><h2>Investimentos</h2><span id="invSub"></span></div>\n  <div class="verdict t4" id="jogoCard"></div>',
  '  <div class="sec-head"><h2>Investimentos</h2><span id="invSub"></span></div>\n  <div class="segctl" role="tablist" id="invSegs"><button type="button" role="tab" data-seg="carteira" aria-selected="true">Carteira e jogo</button><button type="button" role="tab" data-seg="aprender" aria-selected="false">Aprender</button></div>\n  <div class="tab" id="inv-carteira">\n  <div class="verdict t4" id="jogoCard"></div>'),
 ('  <div class="sec-head"><h2>Referência do mercado</h2><span>pra cadastrar</span></div>\n  <div id="mercado" style="display:flex;flex-direction:column;gap:6px"></div>\n  <div class="sec-head"><h2>Antes de investir</h2></div>\n  <div class="guide" id="invGuide"></div>',
  '  <div class="sec-head"><h2>Referência do mercado</h2><span>pra cadastrar</span></div>\n  <div id="mercado" style="display:flex;flex-direction:column;gap:6px"></div>\n  </div>\n  <div class="tab" id="inv-aprender" hidden>\n  <div class="sec-head"><h2>A ordem certa</h2></div>\n  <ol class="how"><li><b>Rotativo e cheque especial zerados.</b> Juro de três dígitos ao ano; nada rende isso.</li><li><b>Reserva de emergência</b> em Tesouro Selic ou CDB de liquidez diária: meio mês, depois 3, 6 e 12 meses de custo essencial.</li><li><b>Aporte automático</b> no dia em que o salário cai, antes de gastar.</li><li><b>Renda fixa com prazo</b> pra objetivo com data (Tesouro IPCA+, CDB de prazo).</li><li><b>ETF de índice amplo</b> (Ibovespa, S&P 500 via B3) com aporte mensal e horizonte de 5 anos ou mais.</li><li><b>FIIs e ações escolhidas</b> só depois, diversificando.</li><li><b>Cripto</b> por último, pequeno, e só o que você aguenta perder.</li></ol>\n  <div class="sec-head"><h2>Cada classe, sem enrolação</h2></div>\n  <div class="guide" id="invGuide"></div>\n  <div class="sec-head"><h2>Glossário</h2></div>\n  <ul class="gloss" id="gloss"></ul>\n  </div>'),
 ('    <div class="sec-head"><h2>Diagnóstico</h2><span id="diagCount"></span></div>\n    <ul class="diag" id="diag"></ul>',
  '    <div class="sec-head"><h2>Testes pra fazer uma vez</h2><span id="diagCount"></span></div>\n    <p class="note">Cinco medições que ajustam a rotina e as finanças aos SEUS dados, em vez de a uma média. Você faz uma vez, marca aqui e me manda o resultado no check-in de segunda. Com eles eu mexo nos horários e nas metas.</p>\n    <ul class="diag" id="diag"></ul>'),
])

# ---------- core: passagem sem check ----------
patch('src/C-core.js', [
 ("    out[i].check = true;", "    out[i].check = out[i].vale || out[i].opcional;"),
 ("var VERSAO = '3.3.1';", "var VERSAO = '3.4';"),
])

# ---------- hoje: rail v2 ----------
d = rd('src/D-hoje.js')
i = d.index('function renderRail(){'); j = d.index('/* modo de ajuste */')
novo = r'''var ICONES = {
  sol:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>',
  cafe:'<svg viewBox="0 0 24 24"><path d="M4 9h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M16 11h2a2 2 0 0 1 0 4h-2M7 3v2M11 3v2"/></svg>',
  porta:'<svg viewBox="0 0 24 24"><path d="M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5M14 8l4 4-4 4M18 12H9"/></svg>',
  alvo:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/></svg>',
  lista:'<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/></svg>',
  prato:'<svg viewBox="0 0 24 24"><path d="M6 3v7a3 3 0 0 0 3 3v8M9 3v10M12 3v7M17 3c-2 0-3 3-3 6s1 4 3 4v8"/></svg>',
  chat:'<svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/></svg>',
  halter:'<svg viewBox="0 0 24 24"><path d="M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12"/></svg>',
  gota:'<svg viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>',
  livro:'<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h13"/></svg>',
  aberto:'<svg viewBox="0 0 24 24"><path d="M12 6c-2-2-5-2-9-1v13c4-1 7-1 9 1 2-2 5-2 9-1V5c-4-1-7-1-9 1z"/><path d="M12 6v13"/></svg>',
  laptop:'<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="11" rx="2"/><path d="M2 19h20"/></svg>',
  lua:'<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  estrela:'<svg viewBox="0 0 24 24"><path d="M12 3l2.4 5.2 5.6.6-4.2 3.9 1.2 5.6L12 15.6 7 18.3l1.2-5.6L4 8.8l5.6-.6z"/></svg>',
  cama:'<svg viewBox="0 0 24 24"><path d="M3 18V8M3 12h18v6M3 16h18M7 12V9h5v3"/></svg>',
  ponto:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/></svg>'
};
function iconeDe(b){
  var t = (b.k + ' ' + b.t).toLowerCase();
  if(b.treino || /academ|trein|corrid|esport/.test(t)) return ICONES.halter;
  if(/acord|levant|despert/.test(t)) return ICONES.sol;
  if(/cafe|café/.test(t)) return ICONES.cafe;
  if(/sair|saída|rua/.test(t)) return ICONES.porta;
  if(/planej|revis/.test(t)) return ICONES.lista;
  if(/foco|trabalh|entreg|terminar|profund/.test(t)) return ICONES.alvo;
  if(/almo|jant|comer|lanche/.test(t)) return ICONES.prato;
  if(/mensag|whats|rasa|e-mail|email/.test(t)) return ICONES.chat;
  if(/banho|duch/.test(t)) return ICONES.gota;
  if(/ler|leitura|livro/.test(t)) return ICONES.aberto;
  if(/estud|aula|curso/.test(t)) return ICONES.livro;
  if(/fech|expedient|notebook/.test(t)) return ICONES.laptop;
  if(/cama|dormir/.test(t)) return ICONES.cama;
  if(/noite|livre|descans/.test(t)) return ICONES.estrela;
  return ICONES.ponto;
}
function renderRail(){
  var box = $('rail'); box.textContent = '';
  if(editing){ box.hidden = true; return; }
  box.hidden = false;
  var now = agora(), hoje = midnight(now), ehHoje = same(sel, hoje), passado = sel < hoje, futuro = sel > hoje;
  var conta = sel >= CONTA_DESDE, rr = dias[keyOf(sel)], m = now.getHours()*60 + now.getMinutes();
  var L = plano(sel), temAjuste = rr && ((rr.horarios && Object.keys(rr.horarios).length) || (rr.pulados && rr.pulados.length));
  L.forEach(function(b){
    var isnow = ehHoje && m >= b.s && m < b.e;
    if(!b.check){
      var ps = el('div', 'ps' + (isnow ? ' isnow' : '')); ps.style.setProperty('--c', sky(b.s));
      ps.appendChild(el('span', 'dot2'));
      var pt = el('span', 'pt'); pt.appendChild(el('b', null, hora(b.s))); pt.appendChild(document.createTextNode(b.t)); if(b.d) pt.appendChild(el('span', 'pd', b.d)); ps.appendChild(pt);
      box.appendChild(ps); return;
    }
    var done = marcado(rr, b.k);
    var late = b.vale && !done && conta && (passado || (ehHoje && m >= b.due));
    var delay = late && ehHoje && (m - b.due) < 30;
    var row = el('button', 'st2' + (isnow ? ' isnow' : '') + (done ? ' done' : '') + (late ? (delay ? ' delay' : ' late') : '') + (popId === b.k ? ' pop' : ''));
    row.type = 'button'; row.id = 'st-' + b.k; row.style.setProperty('--c', sky(b.s)); row.setAttribute('aria-pressed', done ? 'true' : 'false');
    var bd = el('span', 'bd'); bd.innerHTML = done ? CHECK : iconeDe(b); row.appendChild(bd);
    var body = el('span'); body.appendChild(el('span', 'tm', hora(b.s) + ' – ' + hora(b.e)));
    var t = el('span', 't', b.t);
    if(late) t.appendChild(el('span', 'tag ' + (delay ? 'delay' : 'late'), passado ? 'furou' : delay ? 'atrasado ' + (m - b.due) + ' min' : 'sem marcar'));
    else if(b.opcional && !done) t.appendChild(el('span', 'tag opt', 'opcional'));
    else if(isnow) t.appendChild(el('span', 'tag nowtag', 'agora'));
    if(rr && rr.horarios && rr.horarios[b.k] && rr.horarios[b.k] !== horaDe(b.k) && !late && !isnow) t.appendChild(el('span', 'tag edit', 'ajustado'));
    body.appendChild(t);
    if(b.d) body.appendChild(el('span', 'd', b.d));
    row.appendChild(body);
    var ck = el('span', 'ck'); ck.innerHTML = CHECK; row.appendChild(ck);
    if(futuro) row.disabled = true;
    row.addEventListener('click', function(){ toggle(sel, b.k); });
    box.appendChild(row);
  });
  if(temAjuste){ var n = el('p', 'note', 'Horários ajustados só neste dia.'); n.style.marginTop = '8px'; box.appendChild(n); }
  popId = null;
}
'''
d = d[:i] + novo + d[j:]
d = d.replace("  nowId = cur.k || null;", "  nowId = cur.check ? cur.k : null;")
wr('src/D-hoje.js', d)

# ---------- financas: grafico de linhas ----------
h = rd('src/H-fin.js')
i = h.index('function renderChart3(){'); j = h.index('function renderCorte(r){')
novo = r'''var chartModo = 'mes';
function renderChart3(){
  var box = $('chart3'); box.textContent = '';
  var head = el('div', 'cmode'); head.appendChild(el('span', 'small', chartModo === 'mes' ? 'Acumulado, dia a dia' : 'Total por mês'));
  var seg = el('div', 'segctl'); [['mes', 'Este mês'], ['6m', '6 meses']].forEach(function(o){ var b = el('button', null, o[1]); b.type = 'button'; b.id = 'cm-' + o[0]; b.setAttribute('aria-selected', chartModo === o[0] ? 'true' : 'false'); b.addEventListener('click', function(){ chartModo = o[0]; renderChart3(); }); seg.appendChild(b); }); head.appendChild(seg); box.appendChild(head);
  var series = [{k:'g', c:'#3ECF8E', n:'Entrou'}, {k:'e', c:'#6F8CFF', n:'Essencial'}, {k:'n', c:'#FF6B7A', n:'Não essencial'}], pts = [], labels = [], marca = null;
  if(chartModo === 'mes'){
    var dias = diasNoMes(fm), hoje = diaHoje(fm), L = lancMes(fm), acc = {g:0, e:0, n:0}, porDia = {};
    L.forEach(function(t){ var dd = +t.data.slice(8, 10), o = porDia[dd] || (porDia[dd] = {g:0, e:0, n:0}); if(t.tipo === 'ganho') o.g += +t.valor || 0; else if(t.tipo === 'gasto'){ if(catDe(t.cat).g === 'ess') o.e += +t.valor || 0; else o.n += +t.valor || 0; } });
    pts.push({x:0, g:0, e:0, n:0});
    for(var dd = 1; dd <= dias; dd++){ var o = porDia[dd]; if(o){ acc.g += o.g; acc.e += o.e; acc.n += o.n; } if(dd <= Math.max(hoje, 1) || hoje === 0) pts.push({x:dd, g:acc.g, e:acc.e, n:acc.n}); }
    for(dd = 1; dd <= dias; dd++) if(dd === 1 || dd % 5 === 0) labels.push({x:dd, t:String(dd)});
    marca = hoje > 0 && hoje < dias ? hoje : null;
    var xmax = dias;
  } else {
    var xmax = 5;
    for(var i = 5; i >= 0; i--){ var d = new Date(fm.getFullYear(), fm.getMonth() - i, 1), Lm = lancMes(d), g = 0, e = 0, n = 0; Lm.forEach(function(t){ if(t.tipo === 'ganho') g += +t.valor || 0; else if(t.tipo === 'gasto'){ if(catDe(t.cat).g === 'ess') e += +t.valor || 0; else n += +t.valor || 0; } }); pts.push({x:5 - i, g:g, e:e, n:n}); labels.push({x:5 - i, t:MES3[d.getMonth()]}); }
  }
  var maxV = 0; pts.forEach(function(p){ maxV = Math.max(maxV, p.g, p.e, p.n); });
  if(!maxV){ box.appendChild(el('p', 'empty', 'Sem lançamentos ainda. O gráfico aparece com o primeiro.')); return; }
  var ns = 'http://www.w3.org/2000/svg', W = 360, H = 210, padL = 8, padR = 44, top = 18, base = H - 26, svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  function X(x){ return padL + x / xmax * (W - padL - padR); } function Y(v){ return base - v / maxV * (base - top); }
  for(var gl = 1; gl <= 3; gl++){ var y = base - (base - top) * gl / 3, ln = document.createElementNS(ns, 'line'); ln.setAttribute('x1', 0); ln.setAttribute('x2', W); ln.setAttribute('y1', y); ln.setAttribute('y2', y); ln.setAttribute('stroke', 'currentColor'); ln.style.opacity = '.08'; svg.appendChild(ln); var ty = document.createElementNS(ns, 'text'); ty.setAttribute('x', W - 2); ty.setAttribute('y', y - 3); ty.setAttribute('text-anchor', 'end'); ty.textContent = fmtK(maxV * gl / 3).replace('R$ ', ''); ty.style.opacity = '.7'; svg.appendChild(ty); }
  if(marca){ var ml = document.createElementNS(ns, 'line'); ml.setAttribute('class', 'now-line'); ml.setAttribute('x1', X(marca)); ml.setAttribute('x2', X(marca)); ml.setAttribute('y1', top - 6); ml.setAttribute('y2', base); svg.appendChild(ml); }
  series.forEach(function(s){
    var d = '', area = '';
    pts.forEach(function(p, k){ var cmd = (k ? ' L' : 'M') + X(p.x).toFixed(1) + ' ' + Y(p[s.k]).toFixed(1); d += cmd; });
    area = d + ' L' + X(pts[pts.length - 1].x).toFixed(1) + ' ' + base + ' L' + X(pts[0].x).toFixed(1) + ' ' + base + ' Z';
    var ap = document.createElementNS(ns, 'path'); ap.setAttribute('d', area); ap.setAttribute('fill', s.c); ap.style.opacity = '.10'; svg.appendChild(ap);
    var lp = document.createElementNS(ns, 'path'); lp.setAttribute('d', d); lp.setAttribute('fill', 'none'); lp.setAttribute('stroke', s.c); lp.setAttribute('stroke-width', '2.5'); lp.setAttribute('stroke-linejoin', 'round'); lp.setAttribute('stroke-linecap', 'round'); svg.appendChild(lp);
    var last = pts[pts.length - 1], c = document.createElementNS(ns, 'circle'); c.setAttribute('cx', X(last.x)); c.setAttribute('cy', Y(last[s.k])); c.setAttribute('r', '4'); c.setAttribute('fill', s.c); c.setAttribute('stroke', 'var(--surface)'); c.setAttribute('stroke-width', '2'); svg.appendChild(c);
    if(chartModo === '6m') pts.forEach(function(p){ if(p[s.k] > 0){ var c2 = document.createElementNS(ns, 'circle'); c2.setAttribute('cx', X(p.x)); c2.setAttribute('cy', Y(p[s.k])); c2.setAttribute('r', '3'); c2.setAttribute('fill', s.c); svg.appendChild(c2); } });
  });
  labels.forEach(function(l){ var t = document.createElementNS(ns, 'text'); t.setAttribute('x', X(l.x)); t.setAttribute('y', H - 8); t.setAttribute('text-anchor', 'middle'); t.textContent = l.t; svg.appendChild(t); });
  box.appendChild(svg);
  var last = pts[pts.length - 1], lg = el('div', 'leg3'); series.forEach(function(s){ var sp = el('span'); var i = el('i'); i.style.background = s.c; sp.appendChild(i); sp.appendChild(document.createTextNode(s.n + ' ' + fmtK(last[s.k]))); lg.appendChild(sp); }); box.appendChild(lg);
  if(last.g > 0) box.appendChild(el('p', 'small', 'Do que entrou, ' + Math.round(last.e / last.g * 100) + '% foi pro essencial e ' + Math.round(last.n / last.g * 100) + '% pro não essencial. O vermelho é a parte que você controla.'));
}
'''
h = h[:i] + novo + h[j:]
wr('src/H-fin.js', h)

# ---------- jogo: inicio em outubro ----------
patch('src/K-jogo.js', [
 ("function jogo(){ if(!FIN.jogo) FIN.jogo = {pontos:0, hist:[], meses:{}}; return FIN.jogo; }",
  "function jogo(){ if(!FIN.jogo) FIN.jogo = {pontos:0, hist:[], meses:{}}; return FIN.jogo; }\nfunction jogoDesde(){ return (FIN.cfg && FIN.cfg.jogoDesde) || '2026-10'; }\nfunction jogoAtivo(mk){ return (mk || mesKey(fm)) >= jogoDesde(); }\nfunction nomeMes(mk){ var p = mk.split('-'); return MESL[+p[1] - 1].toLowerCase() + '/' + p[0]; }"),
 ("      var ess = essenciaisMes(), res = reservaTotal(), meses = ess > 0 ? res / ess : 99, pts = 0, msg = '';\n      if(at.reserva){ pts = PTS.rf; msg = 'Reserva primeiro: +' + pts; }",
  "      var ess = essenciaisMes(), res = reservaTotal(), meses = ess > 0 ? res / ess : 99, pts = 0, msg = '';\n      if(!jogoAtivo(a.data.slice(0, 7))){ pts = 0; msg = 'Aporte registrado. O jogo começa em ' + nomeMes(jogoDesde()) + '.'; }\n      else if(at.reserva){ pts = PTS.rf; msg = 'Reserva primeiro: +' + pts; }"),
 ("  j.missoes = j.missoes || {}; var feitas = j.missoes[mk] = j.missoes[mk] || {}, novas = [], st = [];",
  "  j.missoes = j.missoes || {}; var feitas = j.missoes[mk] = j.missoes[mk] || {}, novas = [], st = [];\n  if(!jogoAtivo(mk)) premiar = false;"),
 ("  var mh = el('div', 'orc-total'); mh.style.marginTop = '6px';",
  "  var ativo = jogoAtivo(); box.classList.toggle('jogo-off', !ativo);\n  if(!ativo){ var off = el('p', 'small'); off.style.opacity = '1'; off.appendChild(document.createTextNode('O jogo começa em ' + nomeMes(jogoDesde()) + '. Até lá, o alvo é zerar o rotativo e montar o colchão. ')); var mud = el('button', 'linkbtn', 'Mudar o início'); mud.type = 'button'; mud.id = 'jogoInicio'; mud.style.padding = '0'; mud.addEventListener('click', function(){ openSheet(function(sh){ sh.appendChild(el('h3', null, 'Quando o jogo começa')); var im = el('input'); im.type = 'month'; im.value = jogoDesde(); sh.appendChild(campo('Mês de início', im, 'jogoMes')); var b = el('button', 'btn primary wide', 'Salvar'); b.type = 'button'; b.id = 'jogoMesSave'; b.addEventListener('click', function(){ if(!/^\\d{4}-\\d{2}$/.test(im.value)){ toast('Escolhe o mês.'); return; } FIN.cfg = FIN.cfg || {}; FIN.cfg.jogoDesde = im.value; finSave(); closeSheet(); renderInv(); toast('Jogo começa em ' + nomeMes(im.value) + '.'); }); sh.appendChild(b); }); }); off.appendChild(mud); box.appendChild(off); }\n  var mh = el('div', 'orc-total'); mh.style.marginTop = '6px';"),
])

# ---------- investir: sub-abas e glossario ----------
patch('src/I-fin2.js', [
 ("$('addAsset').addEventListener('click', function(){ sheetInv(); });",
  "var invSeg = 'carteira';\n$('invSegs').addEventListener('click', function(e){ var b = e.target.closest('button'); if(!b) return; invSeg = b.getAttribute('data-seg'); renderInv(); window.scrollTo(0, 0); });\nvar GLOSS = [['CDI', 'Taxa que os bancos usam entre si; anda colada na Selic. \"100% do CDI\" = rende igual a essa taxa.'], ['Selic', 'A taxa básica de juros do país, definida pelo Banco Central a cada 45 dias. Tudo de renda fixa gira em torno dela.'], ['Tesouro Selic', 'Título do governo que rende a Selic. Liquidez diária, risco mínimo. O padrão da reserva.'], ['CDB', 'Você empresta pro banco e ele te paga juros. Coberto pelo FGC até R$ 250 mil por banco.'], ['FGC', 'Fundo que devolve seu dinheiro (até R$ 250 mil por CPF por banco) se o banco quebrar. Cobre CDB, LCI, LCA, poupança. Não cobre fundos, ações nem Tesouro (que não precisa).'], ['Liquidez', 'Quão rápido o dinheiro volta pra sua conta. Diária = no mesmo dia ou no seguinte. Reserva precisa de liquidez diária.'], ['Marcação a mercado', 'O preço de um título muda todo dia conforme os juros. Se você vende antes do vencimento, pode receber menos do que colocou. Só afeta quem vende antes.'], ['ETF', 'Um fundo negociado em bolsa que compra uma cesta inteira (ex.: as 500 maiores dos EUA). Uma cota, centenas de empresas, taxa baixa.'], ['BDR', 'Recibo negociado na B3 que representa uma ação de fora (Apple, Microsoft). Jeito de ter dólar sem abrir conta fora.'], ['FII', 'Fundo imobiliário: cotas de um fundo que tem imóveis ou títulos imobiliários e distribui aluguel mensal, isento de IR pra pessoa física.'], ['Dividendo / provento', 'Parte do lucro que a empresa ou o fundo distribui pra quem tem a cota. Cai na conta, sem vender nada.'], ['IR regressivo', 'Imposto da renda fixa: 22,5% até 6 meses, caindo até 15% depois de 2 anos. Quanto mais tempo, menos imposto.'], ['Aporte', 'Dinheiro novo que você coloca num investimento. É o que o jogo conta.'], ['Alocação', 'Como a carteira se divide entre as classes. A meta é a divisão que você quer; o real é a de hoje.']];\nfunction renderGloss(){ var ul = $('gloss'); ul.textContent = ''; GLOSS.forEach(function(g){ var li = el('li'); li.appendChild(el('b', null, g[0])); li.appendChild(el('span', null, g[1])); ul.appendChild(li); }); }\n$('addAsset').addEventListener('click', function(){ sheetInv(); });"),
 ("function renderInv(){\n  var carteira = FIN.inv.filter(function(a){ return !a.reserva; }), total = carteira.reduce(function(s, a){ return s + (+a.atual || 0); }, 0);",
  "function renderInv(){\n  $('inv-carteira').hidden = invSeg !== 'carteira'; $('inv-aprender').hidden = invSeg !== 'aprender';\n  $('invSegs').querySelectorAll('button').forEach(function(b){ b.setAttribute('aria-selected', b.getAttribute('data-seg') === invSeg ? 'true' : 'false'); });\n  renderGloss();\n  var carteira = FIN.inv.filter(function(a){ return !a.reserva; }), total = carteira.reduce(function(s, a){ return s + (+a.atual || 0); }, 0);"),
])

# ---------- diagnostico explicado ----------
patch('src/E-resto.js', [
 ("  {id:'meq', t:'Cronotipo (questionário MEQ)', s:'5 min. Busque \"questionário matutinidade vespertinidade Horne-Östberg\".'},\n  {id:'tempo', t:'Auditoria de tempo de 7 dias', s:'Toggl Track ou planilha, mais o tempo de tela do celular.'},\n  {id:'extrato', t:'Raio-x do extrato de 90 dias', s:'Em cada gasto: me arrependo? S ou N.'},\n  {id:'registrato', t:'Registrato, Serasa e Valores a Receber', s:'Mapa oficial das dívidas, grátis. registrato.bcb.gov.br'},\n  {id:'febraban', t:'Índice de Saúde Financeira da Febraban', s:'10 min. indice.febraban.org.br. Refazer em 31/12.'}",
  "  {id:'meq', t:'Cronotipo (questionário MEQ)', s:'Diz se você é de manhã, de tarde ou de noite. 19 perguntas, 5 min. Busque \"questionário matutinidade vespertinidade Horne-Östberg\". Resultado: confirma (ou muda) o horário de acordar e o bloco de foco.'},\n  {id:'tempo', t:'Auditoria de tempo de 7 dias', s:'Onde as horas vão de verdade. Toggl Track ou uma planilha de meia em meia hora, mais o Tempo de uso do celular. Resultado: mostra quanto a casa da mãe e o celular comem do dia.'},\n  {id:'extrato', t:'Raio-x do extrato de 90 dias', s:'Lança (ou importa) os gastos dos últimos 90 dias na aba Finanças e marca \"me arrependo\" em cada um. Resultado: o total de besteira vira a sua mesada semanal.'},\n  {id:'registrato', t:'Registrato, Serasa e Valores a Receber', s:'O mapa oficial das suas dívidas e contas, grátis: registrato.bcb.gov.br (login gov.br), serasa.com.br e valoresareceber.bcb.gov.br. Resultado: a lista de dívidas da Planilha fica completa e em ordem.'},\n  {id:'febraban', t:'Índice de Saúde Financeira da Febraban', s:'Nota de 0 a 100 da sua saúde financeira, 10 min, anônimo: indice.febraban.org.br. Resultado: a linha de partida. Refaz em 31/12 pra ver o quanto andou.'}"),
])
wr('sw.js', rd('sw.js').replace("rotina-v3.3.1", "rotina-v3.4.0"))
print('patch7 ok')
