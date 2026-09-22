# -*- coding: utf-8 -*-
import io, re
def rd(p): return io.open(p, encoding='utf-8').read()
def wr(p, s): io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
def patch(path, pairs):
    s = rd(path)
    for a, b in pairs:
        assert s.count(a) == 1, (path, a[:70], s.count(a))
        s = s.replace(a, b)
    wr(path, s)

# ---------- B-body: abas ----------
b = rd('src/B-body.html')
i1 = b.index('  <!-- SEMANA -->'); i2 = b.index('  <!-- MAIS -->')
semana = b[b.index('  <!-- SEMANA -->'):b.index('  <!-- MES -->')]
mes = b[b.index('  <!-- MES -->'):b.index('  <!-- ROTINA (editor) -->')]
rotina = b[b.index('  <!-- ROTINA (editor) -->'):i2]
def inner(sec):
    # tira <section ...> e </section>, devolve o miolo
    m = re.search(r'<section[^>]*>\n(.*)\n  </section>\n', sec, re.S)
    return m.group(1)
placar = ('  <!-- PLACAR -->\n  <section class="tab" id="tab-placar" hidden>\n'
          '    <div class="segctl" role="tablist"><button type="button" role="tab" id="pl-semana" aria-selected="true">Semana</button><button type="button" role="tab" id="pl-mes" aria-selected="false">Mês</button></div>\n'
          '    <div class="tab" id="pl-sem">\n' + inner(semana) + '\n    </div>\n'
          '    <div class="tab" id="pl-m" hidden>\n' + inner(mes) + '\n    </div>\n'
          '  </section>\n\n')
b = b[:i1] + placar + b[i2:]
# rotina vai pra dentro de Mais, depois do check-in
rot_inner = inner(rotina)
b = b.replace('    <div class="sec-head"><h2>Como eu te cobro</h2></div>',
              '    <div class="sec-head"><h2>Minha rotina padrão</h2><button type="button" class="linkbtn" id="rotToggle">Abrir</button></div>\n    <div class="tab" id="rotBox" hidden>\n' + rot_inner.replace('    <div class="sec-head"><h2>Minha rotina</h2><span>padrão</span></div>\n', '') + '\n    </div>\n    <div class="sec-head"><h2>Como eu te cobro</h2></div>', 1)
# barra de abas
tab_old = b[b.index('<nav class="tabbar"'):b.index('</div></nav>') + len('</div></nav>')]
tab_new = '''<nav class="tabbar" aria-label="Seções"><div role="tablist">
  <button type="button" role="tab" id="tb-hoje" data-tab="hoje" aria-selected="true"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>Hoje</button>
  <button type="button" role="tab" id="tb-placar" data-tab="placar" aria-selected="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20v-9M12 20V4M19 20v-6"/></svg>Placar</button>
  <button type="button" role="tab" id="tb-financas" data-tab="financas" aria-selected="false"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M7 15h3"/></svg>Finanças</button>
  <button type="button" role="tab" id="tb-investir" data-tab="investir" aria-selected="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18l5-6 4 3 7-8"/><path d="M16 7h4v4"/></svg>Investir</button>
  <button type="button" role="tab" id="tb-mais" data-tab="mais" aria-selected="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>Mais</button>
</div></nav>'''
b = b.replace(tab_old, tab_new)
# markup de financas entra antes do </main>
fin = rd('src/F-fin.html')
style_end = fin.index('</style>') + len('</style>')
fin_style, fin_markup = fin[:style_end], fin[style_end:]
b = b.replace('</main>\n', fin_markup.strip() + '\n</main>\n', 1)
wr('src/B-body.html', b)
# estilo de financas vai pro head
a = rd('src/A-head.html')
a = a.replace('</style>\n</head>', '</style>\n' + fin_style + '\n</head>', 1)
# paleta: verde da marca (Supabase) pro dinheiro que entra, bordas mais finas
a = a.replace('--good:#3DDC97;', '--good:#3ECF8E;', 1)
wr('src/A-head.html', a)

# ---------- E-resto: integracao ----------
patch('src/E-resto.js', [
 ("var TABS = ['hoje','semana','mes','rotina','mais'];\nfunction render(){ if(tab === 'hoje') renderHoje(); else if(tab === 'semana') renderSemana(); else if(tab === 'mes') renderMes(); else if(tab === 'rotina') renderRotina(); else renderDiag(); renderInstall(); }",
  "var TABS = ['hoje','placar','financas','investir','mais'], plSeg = 'semana', rotAberta = false;\nfunction render(){\n  if(tab === 'hoje') renderHoje();\n  else if(tab === 'placar'){ $('pl-sem').hidden = plSeg !== 'semana'; $('pl-m').hidden = plSeg !== 'mes'; $('pl-semana').setAttribute('aria-selected', plSeg === 'semana' ? 'true' : 'false'); $('pl-mes').setAttribute('aria-selected', plSeg === 'mes' ? 'true' : 'false'); if(plSeg === 'semana') renderSemana(); else renderMes(); }\n  else if(tab === 'financas') renderFin();\n  else if(tab === 'investir') renderInv();\n  else { renderDiag(); $('rotBox').hidden = !rotAberta; $('rotToggle').textContent = rotAberta ? 'Fechar' : 'Abrir'; if(rotAberta) renderRotina(); }\n  $('fab').hidden = tab !== 'financas' || finSeg === 'guia';\n  renderInstall();\n}\n$('pl-semana').addEventListener('click', function(){ plSeg = 'semana'; render(); });\n$('pl-mes').addEventListener('click', function(){ plSeg = 'mes'; render(); });\n$('rotToggle').addEventListener('click', function(){ rotAberta = !rotAberta; render(); });"),
 ("var data = JSON.stringify({versao:VERSAO, exportadoEm:new Date().toISOString(), template:T, dias:dias, diag:diag, cfg:cfg});",
  "var data = JSON.stringify({versao:VERSAO, exportadoEm:new Date().toISOString(), template:T, dias:dias, diag:diag, cfg:cfg, fin:FIN});"),
 ("      if(o.template && o.template.util) T = o.template; dias = o.dias || {}; diag = o.diag || {}; cfg = o.cfg || {};\n      salvarT(); salvarDias(); gravar('diag', diag); gravar('cfg', cfg); render(); toast('Backup importado.');",
  "      if(o.template && o.template.util) T = o.template; dias = o.dias || {}; diag = o.diag || {}; cfg = o.cfg || {};\n      if(o.fin && o.fin.orc){ FIN = o.fin; finSave(); }\n      salvarT(); salvarDias(); gravar('diag', diag); gravar('cfg', cfg); render(); toast('Backup importado.');"),
 ("  if(!confirm('Apagar TODOS os dias marcados e a rotina personalizada? Não dá pra desfazer.')) return;",
  "  if(!confirm('Apagar TODOS os dias marcados, a rotina personalizada e as finanças? Não dá pra desfazer.')) return;"),
 ("  ['template','dias','diag','cfg'].forEach(function(k){ try{ localStorage.removeItem('rotina.v3.' + k); }catch(e){} });\n  carregar(); render(); toast('Tudo apagado.');",
  "  ['template','dias','diag','cfg','fin'].forEach(function(k){ try{ localStorage.removeItem('rotina.v3.' + k); }catch(e){} });\n  carregar(); finLoad(); render(); toast('Tudo apagado.');"),
 ("  linhas.push('Diagnósticos feitos: ' + (dg.length ? dg.join(', ') : 'nenhum'));\n  return linhas.join('\\n');",
  "  linhas.push('Diagnósticos feitos: ' + (dg.length ? dg.join(', ') : 'nenhum'));\n  linhas.push(resumoFin());\n  return linhas.join('\\n');"),
 ("carregar();\n$('ver').textContent = 'Rotina v' + VERSAO;", "carregar(); finLoad();\n$('ver').textContent = 'Rotina v' + VERSAO;"),
 ("<p class=\"small\">Toda segunda: copia o resumo e cola na conversa. Ele ajusta a rotina com os seus números.</p>", "<p class=\"small\">Toda segunda: copia o resumo e cola na conversa. Ele ajusta a rotina com os seus números.</p>") if False else ("/* ===== abas, relogio, boot ===== */", "/*FINMARK*/\n/* ===== abas, relogio, boot ===== */"),
])
patch('src/C-core.js', [("var VERSAO = '3.0';", "var VERSAO = '3.1';")])
patch('src/B-body.html', [("Toda segunda: copia o resumo e cola na conversa. Ele ajusta a rotina com os seus números.", "Toda segunda: copia o resumo (rotina + finanças) e cola na conversa. Ele ajusta com os seus números.")])
# cores fixas por classe (pesquisa): renda fixa azul, RV ciano, FII roxo, acoes rosa, bitcoin laranja
patch('src/H-fin.js', [
 ("{id:'rf', n:'Renda fixa', c:'#3DDC97',", "{id:'rf', n:'Renda fixa', c:'#5B9CF6',"),
 ("{id:'fii', n:'Fundos imobiliários', c:'#4FB3E8',", "{id:'fii', n:'Fundos imobiliários', c:'#A78BFA',"),
 ("{id:'acao', n:'Ações', c:'#B9A2FF',", "{id:'acao', n:'Ações', c:'#F472B6',"),
 ("{id:'rv', n:'Renda variável (outros)', c:'#FFC24B',", "{id:'rv', n:'Renda variável (outros)', c:'#22C7D6',"),
 ("{id:'cripto', n:'Bitcoin e cripto', c:'#FF9A4D',", "{id:'cripto', n:'Bitcoin e cripto', c:'#F7931A',"),
])

# ---------- montar ----------
e = rd('src/E-resto.js')
fin_js = rd('src/H-fin.js') + rd('src/I-fin2.js')
e = e.replace('/*FINMARK*/\n', fin_js + '\n', 1)
parts = [rd('src/A-head.html'), rd('src/B-body.html'), rd('src/C-core.js'), rd('src/D-hoje.js'), e]
wr('index.html', ''.join(parts))
sw = rd('sw.js').replace("const VERSAO = 'rotina-v3.0.1';", "const VERSAO = 'rotina-v3.1.0';")
wr('sw.js', sw)
print('montado', len(''.join(parts)))
