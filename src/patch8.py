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

OLD_PLAN = 'No máximo 3 metas, uma delas de receita ou de lead. Tudo vira bloco na agenda, com folga de 50% no tempo.'
NEW_PLAN = 'No máximo 3 metas da semana: uma de conteúdo, uma de equipe, uma de receita. Tudo vira bloco na agenda, com folga de 50% no tempo.'
OLD_FOCO = 'Na mesa, sentado, nunca deitado. Começa pela entrega nº 1. Mensagens só às 9h45 e às 11h45.'
NEW_FOCO = 'No PC, porta fechada. Começa pelo conteúdo mais difícil do dia. Mensagens da equipe só às 9h45 e às 11h45.'
OLD_FOCO_R = 'Lead novo é a exceção: responder em até 1h.'
NEW_FOCO_R = 'Se a equipe travar, resolve no bloco de mensagens, não no meio do foco.'
OLD_RASAS = 'WhatsApp, e-mail, financeiro, leads. Último café do dia até as 14h.'
NEW_RASAS = 'Equipe, aprovações de cliente, e-mail, financeiro. Último café do dia até as 14h.'

# ---------- rotina: textos + migracao ----------
patch('src/C-core.js', [
 (OLD_PLAN, NEW_PLAN), (OLD_FOCO, NEW_FOCO), (OLD_FOCO_R, NEW_FOCO_R), (OLD_RASAS, NEW_RASAS),
 ("  if(!Array.isArray(T.treino)) T.treino = [1,2,4,5];",
  "  if(!Array.isArray(T.treino)) T.treino = [1,2,4,5];\n  /* migracao de textos (so troca o que ainda esta igual ao padrao antigo) */\n  if((T.tv || 1) < 2){ var MIG = {planejar:[" + repr(OLD_PLAN) + ", " + repr(NEW_PLAN) + "], foco:[" + repr(OLD_FOCO) + ", " + repr(NEW_FOCO) + ", " + repr(OLD_FOCO_R) + ", " + repr(NEW_FOCO_R) + "], rasas:[" + repr(OLD_RASAS) + ", " + repr(NEW_RASAS) + "]}; (T.util || []).forEach(function(b){ var m = MIG[b.k]; if(!m) return; if(b.d === m[0]) b.d = m[1]; if(m[2] && b.r === m[2]) b.r = m[3]; }); T.tv = 2; salvarT(); }"),
 ("var VERSAO = '3.4.3';", "var VERSAO = '3.5';"),
])

# ---------- markup ----------
patch('src/B-body.html', [
 ('<li><span class="se"><em>Se</em>me peguei deitado com o notebook</span><span class="entao"><em>então</em>levanto e vou pra mesa.</span></li>',
  '<li><span class="se"><em>Se</em>abri rede social no bloco de foco</span><span class="entao"><em>então</em>fecho e volto pro conteúdo.</span></li>'),
 ('<li><span class="se"><em>Se</em>chegou lead novo fora da hora das mensagens</span><span class="entao"><em>então</em>respondo em até 1h.</span></li>',
  '<li><span class="se"><em>Se</em>alguém da equipe travou</span><span class="entao"><em>então</em>resolvo no bloco de mensagens, não no meio do foco.</span></li>'),
 ('    <div class="hero" id="finHero"></div>', '    <div class="hero" id="finHero"></div>\n    <div class="qrow" id="quick"></div>\n    <div class="acards" id="acards"></div>'),
 ('  <div class="hero" id="invHero"></div>', '  <div class="hero" id="invHero"></div>\n  <div class="card chart3" id="patChart"></div>'),
])

# ---------- css ----------
patch('src/A-head.html', [
 ('.tema{display:grid;', '.sc{position:relative}.sc svg{width:100%;height:200px;display:block;overflow:visible}.sc text{font-family:var(--mono);font-size:11px;fill:var(--muted)}\n'
  '.sc-tip{position:absolute;top:0;background:var(--ink);color:var(--bg);border-radius:10px;padding:6px 10px;font-size:12px;display:flex;flex-direction:column;gap:2px;pointer-events:none;z-index:3;white-space:nowrap;box-shadow:0 6px 18px rgba(0,0,0,.35)}\n'
  '.sc-tip small{color:color-mix(in srgb,var(--bg) 70%,transparent);font-family:var(--mono)}.sc-tip span{display:flex;align-items:center;gap:6px}.sc-tip i{width:8px;height:8px;border-radius:50%;background:var(--cc)}.sc-tip b{font-family:var(--mono);font-weight:500}\n'
  '.sc-pills{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}.sc-pill{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:12px;color:var(--muted);padding:4px 10px;border-radius:999px;background:var(--surface-2)}.sc-pill i{width:8px;height:8px;border-radius:50%;background:var(--cc)}\n'
  '.chart3 .chips{flex-wrap:wrap;overflow:visible}.chart3 .chips button{padding:6px 11px;font-size:12.5px}.chart3 .chips button[aria-pressed="false"]{opacity:.55}\n'
  '.qrow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}\n'
  '.qa{display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 4px;border-radius:16px;background:var(--surface);box-shadow:inset 0 0 0 1px var(--line);font-size:12.5px;font-weight:600;color:var(--muted);text-align:center}\n'
  '.qa-ic{width:40px;height:40px;border-radius:14px;background:color-mix(in srgb,var(--accent) 18%,var(--surface));color:var(--accent);display:grid;place-items:center}.qa-ic svg{width:20px;height:20px;stroke:currentColor;stroke-width:2.2;fill:none;stroke-linecap:round;stroke-linejoin:round}\n'
  '.acards{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;margin-inline:-16px;padding-inline:16px;padding-bottom:4px}.acards::-webkit-scrollbar{display:none}\n'
  '.acard{flex:0 0 150px;height:96px;border-radius:16px;padding:12px;display:flex;flex-direction:column;justify-content:space-between;text-align:left;background:linear-gradient(135deg,color-mix(in srgb,var(--cc) 88%,#000),color-mix(in srgb,var(--cc) 55%,#000));color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}\n'
  '.acard .ac-tipo{font-family:var(--mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;opacity:.75}.acard .ac-nome{font-weight:700;font-size:14px}.acard .ac-val{font-family:var(--mono);font-size:15px}.acard .ac-sub{font-size:11px;opacity:.75}\n'
  '.acard.add{background:none;box-shadow:inset 0 0 0 1.5px var(--line);color:var(--muted);justify-content:center;align-items:center}\n'
  '.simcard{gap:10px}.sim3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.sim3 div{background:var(--surface-2);border-radius:12px;padding:10px}.sim3 b{display:block;font-family:var(--display);font-stretch:80%;font-weight:800;font-size:18px;line-height:1.1;color:var(--good)}.sim3 span{font-size:11.5px;color:var(--muted)}\n'
  '.orc-row.simon{box-shadow:inset 0 0 0 1.5px var(--good)}.orc-row.simon .nm{text-decoration:line-through;color:var(--muted)}\n'
  '.leg .lbar{grid-column:1/4;display:block;height:4px;border-radius:4px;background:var(--surface-2);overflow:hidden}.leg .lbar s{display:block;height:100%;background:var(--cc);text-decoration:none}\n'
  '.donut circle{stroke-width:16}.donut .c b{font-size:17px;max-width:92px}\n'
  '.tema{display:grid;'),
])

# ---------- financas: chamadas ----------
patch('src/H-fin.js', [("  renderChart3(); renderCorte(r);", "  renderQuick(); renderChart3(); renderCorte(r);")])

# ---------- investir: legenda com barra, patrimonio ----------
patch('src/I-fin2.js', [
 ("    leg.appendChild(row);\n  });\n  /* reserva */", "    var lb = el('em', 'lbar'); var ls = el('s'); ls.style.width = (total ? v / total * 100 : 0) + '%'; lb.appendChild(ls); row.appendChild(lb);\n    leg.appendChild(row);\n  });\n  /* reserva */"),
 ("  renderJogo(); renderSugestao(); renderMercado();", "  renderJogo(); renderSugestao(); renderMercado(); renderPatrimonio();"),
])

# ---------- demo: snapshots de patrimonio ----------
patch('src/L-demo.js', [
 ("    cfg:{pctInvestir:20, jogoDesde:'2026-10', contaPadrao:'c_nu'}\n  };",
  "    cfg:{pctInvestir:20, jogoDesde:'2026-10', contaPadrao:'c_nu'},\n    snap:(function(){ var s = {}, vals = [[4100, 4000], [4900, 4700], [5600, 5300], [6500, 6100], [7600, 7000], [8100, 7500]]; for(var i = 5; i >= 0; i--){ var d = new Date(y, m0 - i, 1); s[mesKey(d)] = {atual:vals[5 - i][0], aplicado:vals[5 - i][1]}; } return s; })()\n  };"),
])

# ---------- montar + sw ----------
m = rd('src/montar.py').replace("rd('src/L-demo.js') + rd('src/I-fin2.js')", "rd('src/L-demo.js') + rd('src/I-fin2.js') + rd('src/M-ui2.js')")
wr('src/montar.py', m)
wr('sw.js', rd('sw.js').replace("rotina-v3.4.3", "rotina-v3.5.0"))
print('patch8 ok')
