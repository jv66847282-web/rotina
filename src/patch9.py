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
 ("  --sat:env(safe-area-inset-top,0px); --sab:env(safe-area-inset-bottom,0px);",
  "  --sat:env(safe-area-inset-top,0px); --sab:env(safe-area-inset-bottom,0px);\n  --grad:linear-gradient(135deg,#7C5CFF,#B9A2FF); --on-grad:#17152B; --raise:0 10px 24px -14px rgba(0,0,0,.7); --sky:#FFC24B;"),
 (":root[data-theme=\"light\"]{--bg:#F4F4FA;", ":root[data-theme=\"light\"]{--grad:linear-gradient(135deg,#5B3DF5,#8B6BFF);--on-grad:#FFFFFF;--raise:0 10px 22px -14px rgba(23,21,43,.35);--bg:#F4F4FA;"),
 ("/* linha do dia v2 */",
  "/* relevo e degrade (kits bike shop / task) */\n"
  ".card,.st2,.verdict,.acard,.orc-row,.asset,.hcard,.stat,.detail,.step,.blk{box-shadow:inset 0 0 0 1px var(--line),var(--raise)}\n"
  ".btn.primary,.now-btn,.fab,.qa-ic{background:var(--grad);color:var(--on-grad)}\n"
  ".btn.primary,.fab{box-shadow:0 10px 22px -10px #7C5CFF}\n"
  ".now-btn{color:#fff;background:var(--on-sky)}\n"
  ".segctl,.segs5{box-shadow:inset 3px 3px 8px rgba(0,0,0,.28),inset -2px -2px 6px rgba(255,255,255,.04)}\n"
  ".segctl button[aria-selected=\"true\"],.segs5 button[aria-selected=\"true\"]{box-shadow:0 4px 10px rgba(0,0,0,.35)}\n"
  ".tabbar button[aria-selected=\"true\"] svg{stroke:url(#tabgrad)}\n"
  "/* brilho do topo na cor da hora (kit weather) */\n"
  ".hoje-glow{position:absolute;left:0;right:0;top:0;height:300px;background:radial-gradient(90% 55% at 50% -12%,color-mix(in srgb,var(--sky) 38%,transparent),transparent 72%);pointer-events:none;z-index:0}\n"
  "body{position:relative}main{position:relative;z-index:1}\n"
  "/* faixa de dias como cartoes (kits task / prototyping) */\n"
  ".chip{background:var(--surface);box-shadow:inset 0 0 0 1px var(--line);border-radius:14px;padding:8px 0 7px}\n"
  ".chip.sel{background:var(--grad);color:var(--on-grad);box-shadow:0 8px 18px -8px #7C5CFF}\n"
  ".chip.sel .ring{--hole:#8E72FF}.chip.sel .ring.off{box-shadow:inset 0 0 0 1px rgba(255,255,255,.35)}.chip.sel .ring.off > span,.chip.sel .ring > span{color:var(--on-grad)}\n"
  ".chip.today i{background:var(--accent)}.chip.sel.today i{background:var(--on-grad)}\n"
  "/* faixa de horas (kit weather) */\n"
  ".hstrip{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin-inline:-16px;padding:2px 16px 4px}.hstrip::-webkit-scrollbar{display:none}\n"
  ".hp{--c:#FFC24B;flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:4px;width:64px;padding:10px 6px;border-radius:999px;background:var(--surface);box-shadow:inset 0 0 0 1px var(--line);color:var(--muted);font-size:11px;text-align:center}\n"
  ".hp b{font-family:var(--mono);font-weight:500;font-size:11px;color:var(--c)}.hp svg{width:18px;height:18px;stroke:var(--c);stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}.hp span{max-width:56px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n"
  ".hp.isnow{background:var(--grad);color:var(--on-grad);box-shadow:0 8px 18px -8px #7C5CFF}.hp.isnow b,.hp.isnow span{color:var(--on-grad)}.hp.isnow svg{stroke:var(--on-grad)}\n"
  ".hp.done{opacity:.55}.hp.done svg{stroke:var(--good)}\n"
  "/* cartao-heroi do dia (kit task) */\n"
  ".prog{background:var(--grad);color:var(--on-grad);border-radius:22px;padding:16px 16px 14px;display:grid;grid-template-columns:minmax(0,1fr) 84px;gap:12px;align-items:center;box-shadow:0 12px 26px -12px #7C5CFF}\n"
  ".prog .prog-top,.prog .prog-msg{grid-column:1}.prog .prog-top span,.prog .prog-msg{color:var(--on-grad);opacity:.85}.prog .prog-msg.full{opacity:1}\n"
  ".prog .segs{grid-column:1}.prog .segs i{background:rgba(23,21,43,.18)}.prog .segs i::after{background:var(--on-grad)}.prog .segs i.late{box-shadow:inset 0 0 0 1.5px rgba(23,21,43,.6)}\n"
  ".prog .ring{grid-column:2;grid-row:1/4;--hole:#8E72FF;width:84px;height:84px;--t:7px;background:conic-gradient(var(--on-grad) calc(var(--p)*1%),rgba(23,21,43,.22) 0)}\n"
  ".prog .ring > span{font-size:18px;font-weight:600;color:var(--on-grad)}.prog .ring.off{box-shadow:inset 0 0 0 1px rgba(23,21,43,.3)}.prog .ring.zero{background:rgba(23,21,43,.4)}.prog .ring.full{background:var(--on-grad)}.prog .ring.full > span{color:#fff}\n"
  ".prog .prog-cta{grid-column:1;justify-self:start;background:var(--on-grad);color:#fff;font-weight:700;font-size:13px;padding:8px 14px;border-radius:999px;margin-top:2px}\n"
  ":root[data-theme=\"light\"] .prog .ring{--hole:#7A5BF2}:root[data-theme=\"light\"] .prog .prog-cta{background:#fff;color:#5B3DF5}:root[data-theme=\"light\"] .prog .ring > span{color:#fff}:root[data-theme=\"light\"] .prog .ring.full > span{color:#5B3DF5}\n"
  "/* filtro do dia */\n"
  ".railf{display:flex;gap:6px}.railf button{font-size:12.5px;font-weight:600;padding:7px 12px;border-radius:999px;box-shadow:inset 0 0 0 1.5px var(--line);color:var(--muted)}.railf button[aria-pressed=\"true\"]{background:var(--ink);color:var(--bg);box-shadow:none}\n"
  "/* a pagar (kit iBank) */\n"
  ".apagar{display:flex;flex-direction:column;gap:8px}.apagar .row2{display:grid;grid-template-columns:36px minmax(0,1fr) auto auto;gap:10px;align-items:center}.apagar .ic{width:36px;height:36px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--cc) 22%,transparent);color:var(--cc);font-family:var(--mono);font-weight:700;font-size:13px}.apagar .t{display:block;font-weight:600;font-size:14.5px}.apagar .s{display:block;font-size:12px;color:var(--muted)}.apagar .v{font-family:var(--mono);font-size:14px}\n"
  "/* linha do dia v2 */"),
])

# ---------- markup ----------
patch('src/B-body.html', [
 ('<div class="app">\n<main>', '<div class="app">\n<div class="hoje-glow" id="hojeGlow"></div>\n<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="tabgrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC24B"/><stop offset=".5" stop-color="#FF7A66"/><stop offset="1" stop-color="#A97BFF"/></linearGradient></defs></svg>\n<main>'),
 ('      <div class="ring ring-xl" id="dayRing"><span id="dayPct"></span></div>\n    </header>\n    <div class="strip" id="strip"></div>',
  '    </header>\n    <div class="strip" id="strip"></div>\n    <div class="hstrip" id="hstrip"></div>'),
 ('    <div class="prog" id="prog">\n      <div class="prog-top"><span><b id="progFeito">0</b> <span id="progDe"></span></span><span id="progPct"></span></div>\n      <div class="segs" id="segs" aria-hidden="true"></div>\n      <p class="prog-msg" id="progMsg"></p>\n    </div>',
  '    <div class="prog" id="prog">\n      <div class="prog-top"><span><b id="progFeito">0</b> <span id="progDe"></span></span><span id="progPct" hidden></span></div>\n      <div class="segs" id="segs" aria-hidden="true"></div>\n      <p class="prog-msg" id="progMsg"></p>\n      <button type="button" class="prog-cta" id="progCta" hidden>Ir pro bloco de agora</button>\n      <div class="ring ring-xl" id="dayRing"><span id="dayPct"></span></div>\n    </div>'),
 ('    <div class="editbar" id="editbar" hidden>', '    <div class="railf" id="railf"><button type="button" data-f="tudo" aria-pressed="true">Tudo</button><button type="button" data-f="falta" aria-pressed="false">Falta</button><button type="button" data-f="feito" aria-pressed="false">Feito</button></div>\n    <div class="editbar" id="editbar" hidden>'),
 ('    <div class="acards" id="acards"></div>', '    <div class="acards" id="acards"></div>\n    <div class="card apagar" id="apagar" hidden></div>'),
 ('    <div class="sec-head"><h2>Sair do colapso</h2><span id="guideCount"></span></div>', '    <div class="sec-head"><h2>Sair do colapso</h2><span id="guideCount"></span></div>\n    <div class="ratio" id="guiaBar" style="background:var(--surface-2)"><span></span></div>'),
])

# ---------- hoje: faixa de horas, filtro, cta, brilho ----------
patch('src/D-hoje.js', [
 ("function renderHoje(){ renderHead(); renderStrip(); renderEdit(); renderOntem(); renderRetorno(); renderNow(); renderProg(); renderRail(); }",
  "var railFiltro = 'tudo';\n$('railf').addEventListener('click', function(e){ var b = e.target.closest('button'); if(!b) return; railFiltro = b.getAttribute('data-f'); $('railf').querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); renderRail(); });\nfunction renderHStrip(){\n  var box = $('hstrip'); box.textContent = ''; var now = agora(), hoje = midnight(now), ehHoje = same(sel, hoje), m = now.getHours()*60 + now.getMinutes(), rr = dias[keyOf(sel)], atual = null;\n  if(editing){ box.hidden = true; return; } box.hidden = false;\n  plano(sel).forEach(function(b){\n    var isnow = ehHoje && m >= b.s && m < b.e, done = b.check && marcado(rr, b.k);\n    var p = el('button', 'hp' + (isnow ? ' isnow' : '') + (done ? ' done' : '')); p.type = 'button'; p.id = 'hp-' + b.k; p.style.setProperty('--c', sky(b.s));\n    p.appendChild(el('b', null, hora(b.s))); var ic = el('span'); ic.innerHTML = done ? CHECK : iconeDe(b); p.appendChild(ic); p.appendChild(el('span', null, b.t.split(' ')[0]));\n    p.addEventListener('click', function(){ var t = $('st-' + b.k) || $('ps-' + b.k); if(t){ t.scrollIntoView({behavior:'smooth', block:'center'}); } });\n    box.appendChild(p); if(isnow) atual = p;\n  });\n  if(atual) setTimeout(function(){ try{ atual.scrollIntoView({inline:'center', block:'nearest'}); }catch(e){} }, 30);\n}\nfunction renderGlow(){ var g = $('hojeGlow'); if(!g) return; var now = agora(); g.style.setProperty('--sky', sky(now.getHours()*60 + now.getMinutes())); }\n$('progCta').addEventListener('click', function(){ var t = document.querySelector('#rail .isnow'); if(t) t.scrollIntoView({behavior:'smooth', block:'center'}); });\nfunction renderHoje(){ renderGlow(); renderHead(); renderStrip(); renderHStrip(); renderEdit(); renderOntem(); renderRetorno(); renderNow(); renderProg(); renderRail(); }"),
 # cta visivel so hoje
 ("  var msg = $('progMsg');\n  msg.className = 'prog-msg' + (r.p === 100 ? ' full' : '');",
  "  $('progCta').hidden = !same(sel, hoje) || r.p === 100 || !document.querySelector('#rail .isnow');\n  var msg = $('progMsg');\n  msg.className = 'prog-msg' + (r.p === 100 ? ' full' : '');"),
 # filtro no trilho + id nas passagens
 ("  L.forEach(function(b){\n    var isnow = ehHoje && m >= b.s && m < b.e;\n    if(!b.check){\n      var ps = el('div', 'ps' + (isnow ? ' isnow' : '')); ps.style.setProperty('--c', sky(b.s));",
  "  L.forEach(function(b){\n    var isnow = ehHoje && m >= b.s && m < b.e;\n    if(railFiltro !== 'tudo'){ if(!b.check) return; var dn = marcado(rr, b.k); if(railFiltro === 'feito' && !dn) return; if(railFiltro === 'falta' && dn) return; }\n    if(!b.check){\n      var ps = el('div', 'ps' + (isnow ? ' isnow' : '')); ps.id = 'ps-' + b.k; ps.style.setProperty('--c', sky(b.s));"),
])
# renderProg roda depois de renderRail? nao: ordem e prog, rail. O cta depende do rail -> reordenar
patch('src/D-hoje.js', [
 ("function renderHoje(){ renderGlow(); renderHead(); renderStrip(); renderHStrip(); renderEdit(); renderOntem(); renderRetorno(); renderNow(); renderProg(); renderRail(); }",
  "function renderHoje(){ renderGlow(); renderHead(); renderStrip(); renderHStrip(); renderEdit(); renderOntem(); renderRetorno(); renderNow(); renderRail(); renderProg(); }"),
])

# ---------- E-resto: brilho so na aba hoje; glow tambem no tick ----------
patch('src/E-resto.js', [
 ("  $('fab').hidden = tab !== 'financas' || finSeg === 'guia';\n  renderInstall();\n}",
  "  $('fab').hidden = tab !== 'financas' || finSeg === 'guia';\n  var gl = $('hojeGlow'); if(gl) gl.hidden = tab !== 'hoje';\n  renderInstall();\n}"),
])

# ---------- financas: a pagar ----------
patch('src/H-fin.js', [
 ("  renderQuick(); renderChart3(); renderCorte(r);",
  "  renderQuick(); renderApagar(); renderChart3(); renderCorte(r);"),
 ("function renderChart3(){",
  "function renderApagar(){\n  var box = $('apagar'); if(!box) return; box.textContent = ''; var pg = pagos(fm);\n  var L = FIN.orc.ess.concat(FIN.orc.nao).filter(function(o){ return !o.cortadoEm && (+o.valor || 0) > 0 && !pg[o.id]; }).sort(function(a, b){ return (+b.valor) - (+a.valor); });\n  box.hidden = !L.length; if(!L.length) return;\n  var tot = L.reduce(function(s, o){ return s + (+o.valor || 0); }, 0);\n  var hd = el('div', 'orc-total'); hd.style.padding = '0'; hd.appendChild(el('span', null, 'A pagar este mês · ' + L.length + (L.length === 1 ? ' conta' : ' contas'))); hd.appendChild(el('b', null, fmt(tot))); box.appendChild(hd);\n  L.slice(0, 4).forEach(function(o){\n    var c = catDe(o.cat), row = el('div', 'row2'); row.style.setProperty('--cc', c.c);\n    row.appendChild(el('span', 'ic', c.n.slice(0, 2).toUpperCase()));\n    var tx = el('span'); tx.appendChild(el('span', 't', o.nome)); tx.appendChild(el('span', 's', c.n)); row.appendChild(tx);\n    row.appendChild(el('span', 'v', fmt(o.valor)));\n    var b = el('button', 'cutbtn', 'Pagar'); b.type = 'button'; b.id = 'pg-' + o.id; b.addEventListener('click', function(){ sheetLanc({id:uid(), tipo:'gasto', valor:+o.valor, desc:o.nome, cat:o.cat, conta:(FIN.cfg && FIN.cfg.contaPadrao) || (FIN.contas[0] || {}).id || '', data:keyOf(midnight(agora())), arrep:false, orc:o.id}); }); row.appendChild(b);\n    box.appendChild(row);\n  });\n  if(L.length > 4){ var mais = el('button', 'linkbtn', 'Ver as outras ' + (L.length - 4) + ' na Planilha'); mais.type = 'button'; mais.id = 'apagarMais'; mais.addEventListener('click', function(){ finSeg = 'planilha'; renderFin(); window.scrollTo(0, 0); }); box.appendChild(mais); }\n}\nfunction renderChart3(){"),
])
# a segunda definicao (M-ui2) de renderChart3 ganha; a de H-fin fica so como host do renderApagar

# ---------- guia: barra ----------
patch('src/I-fin2.js', [
 ("  $('guideCount').textContent = ok + ' de ' + GUIA.length;",
  "  $('guideCount').textContent = ok + ' de ' + GUIA.length;\n  var gb = $('guiaBar'); if(gb){ gb.firstChild.style.width = Math.round(ok / GUIA.length * 100) + '%'; gb.className = 'ratio' + (ok >= GUIA.length ? '' : ok >= 6 ? '' : ' warn'); }"),
])

patch('src/C-core.js', [("var VERSAO = '3.5';", "var VERSAO = '3.6';")])
wr('sw.js', rd('sw.js').replace("rotina-v3.5.0", "rotina-v3.6.0"))
print('patch9 ok')
