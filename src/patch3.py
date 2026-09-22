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

# ---- markup: alvo, aporte, checkup ----
patch('src/B-body.html', [
 ('  <div class="card" id="reservaCard"></div>\n  <div id="assets" style="display:flex;flex-direction:column;gap:6px"></div>',
  '  <div class="card" id="reservaCard"></div>\n  <div class="card" id="checkup"></div>\n  <div class="sec-head"><h2>Meta × real</h2><button type="button" class="linkbtn" id="editAlvo">Editar meta</button></div>\n  <div class="card" id="alvoCard"></div>\n  <div class="card" id="aporteCard"></div>\n  <div class="sec-head"><h2>Ativos</h2><span id="assetsSub"></span></div>\n  <div id="assets" style="display:flex;flex-direction:column;gap:6px"></div>'),
])

# ---- css ----
patch('src/A-head.html', [
 ('.classhead{display:flex;justify-content:space-between;align-items:baseline;font-size:13px;color:var(--muted);font-family:var(--mono);text-transform:uppercase;letter-spacing:.06em;padding:10px 4px 2px}',
  '.classhead{display:flex;justify-content:space-between;align-items:baseline;font-size:13px;color:var(--muted);font-family:var(--mono);text-transform:uppercase;letter-spacing:.06em;padding:10px 4px 2px}\n'
  '.idade{color:var(--muted)}.idade.warn{color:var(--mid)}.idade.bad{color:var(--bad)}\n'
  '.alvo{display:flex;flex-direction:column;gap:12px}\n'
  '.alvo-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 10px;align-items:baseline}\n'
  '.alvo-row .n{font-weight:600;font-size:14.5px;display:flex;align-items:center;gap:8px}.alvo-row .n i{width:10px;height:10px;border-radius:3px;background:var(--cc);display:inline-block}\n'
  '.alvo-row .s{font-family:var(--mono);font-size:12.5px;color:var(--muted);white-space:nowrap}\n'
  '.alvo-row .s b{font-weight:500;color:var(--ink)}\n'
  '.alvo-row .bar2{grid-column:1/3;position:relative;height:8px;border-radius:8px;background:var(--surface-2);overflow:visible}\n'
  '.alvo-row .bar2 span{display:block;height:100%;border-radius:8px;background:var(--cc);transition:width .4s}\n'
  '.alvo-row .bar2 i{position:absolute;top:-4px;bottom:-4px;width:2px;background:var(--ink);opacity:.7}\n'
  '.alvo-row .bar2 em{position:absolute;top:-4px;bottom:-4px;background:var(--ink);opacity:.08;border-radius:4px}\n'
  '.st{font-family:var(--mono);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;padding:2px 7px;border-radius:999px}\n'
  '.st.ok{background:var(--good-soft);color:var(--good)}.st.falta{background:var(--mid-soft);color:var(--mid)}.st.sobra{background:var(--bad-soft);color:var(--bad)}\n'
  '.chk{display:flex;flex-direction:column;gap:8px}\n'
  '.chk div{display:grid;grid-template-columns:12px minmax(0,1fr);gap:10px;align-items:start;font-size:14px}\n'
  '.chk i{width:12px;height:12px;border-radius:50%;margin-top:5px;background:var(--line)}.chk .ok i{background:var(--good)}.chk .mid i{background:var(--mid)}.chk .bad i{background:var(--bad)}\n'
  '.chk small{display:block;color:var(--muted);font-size:12.5px}\n'
  '.aporte{display:flex;flex-direction:column;gap:10px}\n'
  '.aporte .dest{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;font-size:14.5px;padding:8px 0;border-bottom:1px solid var(--line)}\n'
  '.aporte .dest:last-child{border-bottom:0}.aporte .dest b{font-family:var(--mono);font-weight:500}'),
])

# ---- js ----
patch('src/I-fin2.js', [
 ("var invSel = null;",
  "var invSel = null, aporteVal = 0;\n"
  "var ALVO_PADRAO = {rf:60, fii:10, acao:15, rv:5, cripto:10}, BANDA = 5;\n"
  "function alvoDe(){ var a = (FIN.cfg && FIN.cfg.alvo) || ALVO_PADRAO; var o = {}; CLASSES.forEach(function(c){ o[c.id] = +a[c.id] || 0; }); return o; }\n"
  "function diasDesde(iso){ if(!iso) return null; return Math.floor((agora().getTime() - new Date(iso).getTime()) / 864e5); }\n"
  "function sheetAlvo(){\n"
  "  var a = alvoDe();\n"
  "  openSheet(function(sh){\n"
  "    sh.appendChild(el('h3', null, 'Meta de alocação'));\n"
  "    sh.appendChild(el('p', 'mini', 'Quanto de cada classe você quer na carteira (fora a reserva). Tem que somar 100%. Tolerância de ' + BANDA + ' pontos pra cada lado antes de acusar desvio.'));\n"
  "    var soma = el('p', 'mini'); function upd(){ var t = 0; CLASSES.forEach(function(c){ t += +a[c.id] || 0; }); soma.textContent = 'Soma: ' + t + '%' + (t === 100 ? ' ✓' : ' (precisa dar 100)'); soma.style.color = t === 100 ? 'var(--good)' : 'var(--bad)'; return t; }\n"
  "    CLASSES.forEach(function(c){ var i = el('input'); i.type = 'number'; i.min = 0; i.max = 100; i.step = 5; i.inputMode = 'numeric'; i.value = a[c.id]; i.addEventListener('input', function(){ a[c.id] = Math.max(0, Math.min(100, +i.value || 0)); upd(); }); sh.appendChild(campo(c.n + ' (%)', i, 'alvo-' + c.id)); });\n"
  "    sh.appendChild(soma); upd();\n"
  "    var b = el('button', 'btn primary wide', 'Salvar meta'); b.type = 'button'; b.id = 'alvoSave';\n"
  "    b.addEventListener('click', function(){ if(upd() !== 100){ toast('A soma precisa dar 100%.'); return; } FIN.cfg = FIN.cfg || {}; FIN.cfg.alvo = a; finSave(); closeSheet(); renderInv(); toast('Meta salva.'); });\n"
  "    sh.appendChild(b);\n"
  "  });\n"
  "}\n"
  "$('editAlvo').addEventListener('click', sheetAlvo);"),
 ("      var dd = el('span'); dd.appendChild(el('span', 't', a.nome)); dd.appendChild(el('span', 's', (a.inst ? a.inst + ' · ' : '') + 'atualizado ' + (a.atualizadoEm ? dataBR(a.atualizadoEm.slice(0, 10)) : '–'))); b.appendChild(dd);",
  "      var dd = el('span'); dd.appendChild(el('span', 't', a.nome)); var ds = diasDesde(a.atualizadoEm), sub = el('span', 's', a.inst ? a.inst + ' · ' : ''); var id2 = el('span', 'idade' + (ds == null ? '' : ds > 90 ? ' bad' : ds > 30 ? ' warn' : ''), ds == null ? 'sem data' : ds === 0 ? 'atualizado hoje' : ds === 1 ? 'atualizado ontem' : 'atualizado há ' + ds + ' dias'); sub.appendChild(id2); dd.appendChild(sub); b.appendChild(dd);"),
 ("  var ig = $('invGuide'); ig.textContent = '';",
  "  $('assetsSub').textContent = FIN.inv.length ? 'toca pra editar o valor' : '';\n"
  "  /* checkup */\n"
  "  var ck = $('checkup'); ck.textContent = ''; ck.appendChild(el('h3', null, 'Checkup da carteira'));\n"
  "  var alvo = alvoDe(), maior = 0, maiorN = ''; CLASSES.forEach(function(cl){ var v = por[cl.id] || 0; if(v > maior){ maior = v; maiorN = cl.n; } });\n"
  "  var maiorPct = total ? maior / total * 100 : 0, criptoPct = total ? (por.cripto || 0) / total * 100 : 0, mesesRes = ess > 0 ? res / ess : null;\n"
  "  var maxDias = 0; FIN.inv.forEach(function(a){ var d0 = diasDesde(a.atualizadoEm); if(d0 != null && d0 > maxDias) maxDias = d0; });\n"
  "  var checks = [\n"
  "    {f: mesesRes == null ? 'na' : mesesRes >= 3 ? 'ok' : mesesRes >= 1 ? 'mid' : 'bad', t: mesesRes == null ? 'Reserva: preenche as despesas essenciais na Planilha.' : 'Reserva cobre ' + mesesRes.toFixed(1).replace('.', ',') + ' meses.', s: mesesRes == null ? '' : mesesRes >= 3 ? 'Bom. Alvo final: 6.' : 'Meta 3 meses: faltam ' + fmt(Math.max(0, ess * 3 - res)) + '. Aporte vai aqui primeiro.'},\n"
  "    {f: !total ? 'na' : maiorPct <= 70 ? 'ok' : maiorPct <= 85 ? 'mid' : 'bad', t: !total ? 'Carteira vazia.' : maiorN + ' é ' + Math.round(maiorPct) + '% da carteira.', s: !total ? '' : maiorPct <= 70 ? 'Concentração ok.' : 'Concentrado demais numa classe só.'},\n"
  "    {f: !total ? 'na' : criptoPct <= alvo.cripto + BANDA ? 'ok' : criptoPct <= alvo.cripto + 2 * BANDA ? 'mid' : 'bad', t: 'Cripto em ' + Math.round(criptoPct) + '% (meta ' + alvo.cripto + '%).', s: criptoPct <= alvo.cripto + BANDA ? 'Dentro da faixa.' : 'Acima da meta: não aporta mais aqui até equilibrar.'},\n"
  "    {f: !FIN.inv.length ? 'na' : maxDias <= 30 ? 'ok' : maxDias <= 90 ? 'mid' : 'bad', t: !FIN.inv.length ? 'Sem ativos.' : 'Valor mais antigo: ' + maxDias + (maxDias === 1 ? ' dia' : ' dias') + ' sem atualizar.', s: maxDias <= 30 ? 'Carteira em dia.' : 'Abre o app do banco e atualiza os valores. Número velho parece número certo.'}\n"
  "  ];\n"
  "  var cb2 = el('div', 'chk'); checks.forEach(function(c){ var d = el('div', c.f); d.appendChild(el('i')); var sp = el('span', null, c.t); if(c.s) sp.appendChild(el('small', null, c.s)); d.appendChild(sp); cb2.appendChild(d); }); ck.appendChild(cb2);\n"
  "  /* alvo x real */\n"
  "  var ac = $('alvoCard'); ac.textContent = ''; var al = el('div', 'alvo');\n"
  "  CLASSES.forEach(function(cl){\n"
  "    var v = por[cl.id] || 0, real = total ? v / total * 100 : 0, meta = alvo[cl.id], diff = real - meta, stt = Math.abs(diff) <= BANDA ? 'ok' : diff < 0 ? 'falta' : 'sobra';\n"
  "    var row = el('div', 'alvo-row'); row.style.setProperty('--cc', cl.c);\n"
  "    var n = el('span', 'n'); n.appendChild(el('i')); n.appendChild(document.createTextNode(cl.n)); n.appendChild(el('span', 'st ' + stt, stt === 'ok' ? 'na meta' : stt === 'falta' ? 'falta ' + Math.round(-diff) + ' pts' : 'sobra ' + Math.round(diff) + ' pts')); row.appendChild(n);\n"
  "    var s = el('span', 's'); s.appendChild(el('b', null, Math.round(real) + '%')); s.appendChild(document.createTextNode(' / meta ' + meta + '%')); row.appendChild(s);\n"
  "    var bar = el('div', 'bar2'), f = el('span'); f.style.width = Math.min(100, real) + '%'; bar.appendChild(f);\n"
  "    var band = el('em'); band.style.left = Math.max(0, meta - BANDA) + '%'; band.style.width = (Math.min(100, meta + BANDA) - Math.max(0, meta - BANDA)) + '%'; bar.appendChild(band);\n"
  "    var mk = el('i'); mk.style.left = meta + '%'; bar.appendChild(mk); row.appendChild(bar); al.appendChild(row);\n"
  "  });\n"
  "  ac.appendChild(al); ac.appendChild(el('p', 'small', 'A marca é a meta; a faixa clara é a tolerância de ' + BANDA + ' pontos. Você não vende pra ajustar: manda o dinheiro novo pra onde falta.'));\n"
  "  /* onde aportar */\n"
  "  var ap = $('aporteCard'); ap.textContent = ''; ap.appendChild(el('h3', null, 'Onde aportar este mês'));\n"
  "  var am = el('div', 'amount'); am.appendChild(el('span', null, 'R$')); var ia = el('input'); ia.type = 'text'; ia.inputMode = 'decimal'; ia.id = 'aporteIn'; ia.placeholder = '0,00'; ia.value = aporteVal ? aporteVal.toLocaleString('pt-BR', {minimumFractionDigits:2}) : ''; ia.setAttribute('aria-label', 'Valor do aporte'); ia.addEventListener('change', function(){ aporteVal = parseBRL(ia.value); renderInv(); }); am.appendChild(ia); ap.appendChild(am);\n"
  "  if(aporteVal > 0){\n"
  "    var lista = el('div', 'aporte'), resto = aporteVal;\n"
  "    if(ess > 0 && res < ess * 3){ var pr = Math.min(resto, ess * 3 - res); var d1 = el('div', 'dest'); d1.appendChild(el('span', null, 'Reserva de emergência (até 3 meses)')); d1.appendChild(el('b', null, fmt(pr))); lista.appendChild(d1); resto -= pr; }\n"
  "    if(resto > 0){\n"
  "      var tot2 = total + resto, gaps = {}, soma = 0; CLASSES.forEach(function(cl){ var g = alvo[cl.id] / 100 * tot2 - (por[cl.id] || 0); if(g > 0){ gaps[cl.id] = g; soma += g; } });\n"
  "      CLASSES.forEach(function(cl){ if(!gaps[cl.id]) return; var v = resto * gaps[cl.id] / soma; var d2 = el('div', 'dest'); d2.appendChild(el('span', null, cl.n)); d2.appendChild(el('b', null, fmt(v))); lista.appendChild(d2); });\n"
  "      if(!soma){ var d3 = el('div', 'dest'); d3.appendChild(el('span', null, 'Tudo na meta: divide na proporção da meta')); d3.appendChild(el('b', null, fmt(resto))); lista.appendChild(d3); }\n"
  "    }\n"
  "    ap.appendChild(lista); ap.appendChild(el('p', 'small', 'Regra: reserva primeiro até 3 meses; depois o dinheiro novo vai pra classe que está mais atrás da meta. Sem vender nada.'));\n"
  "  } else ap.appendChild(el('p', 'small', 'Digita quanto vai investir este mês e o app diz onde colocar.'));\n"
  "  var ig = $('invGuide'); ig.textContent = '';"),
])
patch('src/C-core.js', [("var VERSAO = '3.1.1';", "var VERSAO = '3.2';")])
wr('sw.js', rd('sw.js').replace("rotina-v3.1.1", "rotina-v3.2.0"))
print('patch3 ok')
