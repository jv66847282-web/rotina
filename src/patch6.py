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

# ---------- A-head: tema claro, script cedo, estilos novos ----------
patch('src/A-head.html', [
 ('<meta name="color-scheme" content="dark">', '<meta name="color-scheme" content="dark light">\n<script>try{var _t=localStorage.getItem("rotina.v3.tema")||"dark";if(_t==="auto")_t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",_t);}catch(e){}</script>'),
 ('*{box-sizing:border-box}\n[hidden]{display:none!important}',
  ':root[data-theme="light"]{--bg:#F4F4FA;--surface:#FFFFFF;--surface-2:#ECECF5;--surface-3:#DFDFEE;--line:#DCDCEA;--ink:#17152B;--muted:#5F5F7A;--accent:#6D4AE8;--good:#178A5A;--bad:#D23B4F;--mid:#B26A06;--good-soft:#DDF3E9;--bad-soft:#FBE1E4;--mid-soft:#FAEBD2;color-scheme:light}\n'
  ':root[data-theme="light"] .hero.pos{background:linear-gradient(150deg,#DDF3E9,#EEF9F3)}:root[data-theme="light"] .hero.neg{background:linear-gradient(150deg,#FBE1E4,#FDF0F2)}\n'
  ':root[data-theme="light"] .hero.pos .lbl,:root[data-theme="light"] .hero.neg .lbl,:root[data-theme="light"] .hero.pos .two span,:root[data-theme="light"] .hero.neg .two span,:root[data-theme="light"] .hero.pos .livre span,:root[data-theme="light"] .hero.neg .livre span{color:var(--muted)}\n'
  ':root[data-theme="light"] .hero .two div{background:rgba(23,21,43,.05)}:root[data-theme="light"] .ratio{background:rgba(23,21,43,.1)}:root[data-theme="light"] .ratio i{background:rgba(23,21,43,.45)}:root[data-theme="light"] .livre{border-top-color:rgba(23,21,43,.1)}\n'
  ':root[data-theme="light"] .segctl button[aria-selected="true"],:root[data-theme="light"] .segs5 button[aria-selected="true"]{box-shadow:0 1px 4px rgba(0,0,0,.12)}:root[data-theme="light"] .fab{box-shadow:0 8px 24px rgba(0,0,0,.2)}:root[data-theme="light"] .sheet-bg{background:rgba(20,20,40,.35)}\n'
  ':root[data-theme="light"] .now-btn{color:#fff}:root[data-theme="light"] .ring.zero,:root[data-theme="light"] .ring.full{color:#fff}:root[data-theme="light"] .tile.scored{color:#fff}\n'
  '*{box-sizing:border-box}\n[hidden]{display:none!important}'),
 ('button.stop:disabled{cursor:default;opacity:.75}',
  'button.stop:disabled{cursor:default;opacity:.75}\n.stop.minor .node{width:22px;height:22px;margin-top:11px;border-width:2px;opacity:.8}.stop.minor .node svg{width:12px;height:12px}.stop.minor.done .t{text-decoration:line-through}\n'
  '.chart3{display:flex;flex-direction:column;gap:8px}.chart3 svg{width:100%;height:auto;display:block}.chart3 text{font-family:var(--mono);font-size:10px;fill:var(--muted)}.chart3 .leg{display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--muted);font-family:var(--mono)}.chart3 .leg i{width:10px;height:10px;border-radius:3px;display:inline-block;margin-right:5px;vertical-align:-1px}\n'
  '.corte{display:flex;flex-direction:column;gap:6px}.corte .orc-row{grid-template-columns:minmax(0,1fr) auto auto}.corte .sb b{color:var(--good);font-weight:500}\n'
  '.tema{display:grid;grid-template-columns:repeat(3,1fr)}'),
])

# ---------- B-body: markup ----------
patch('src/B-body.html', [
 ('    <div id="finAlerts" style="display:flex;flex-direction:column;gap:8px"></div>',
  '    <div id="finAlerts" style="display:flex;flex-direction:column;gap:8px"></div>\n    <div class="sec-head"><h2>Entrou × essencial × não essencial</h2><span>últimos meses</span></div>\n    <div class="card chart3" id="chart3"></div>\n    <div class="sec-head"><h2>O que dá pra cortar</h2><span id="corteSub"></span></div>\n    <div class="corte" id="corteBox"></div>'),
 ('  <div class="sec-head"><h2>Investimentos</h2><span id="invSub"></span></div>\n  <div class="hero" id="invHero"></div>',
  '  <div class="sec-head"><h2>Investimentos</h2><span id="invSub"></span></div>\n  <div class="verdict t4" id="jogoCard"></div>\n  <div class="hero" id="invHero"></div>'),
 ('  <div class="sec-head"><h2>Meta × real</h2><button type="button" class="linkbtn" id="editAlvo">Editar meta</button></div>\n  <div class="card" id="alvoCard"></div>\n  <div class="card" id="aporteCard"></div>',
  '  <div class="card" id="sugestaoCard"></div>\n  <div class="sec-head"><h2>Meta × real</h2><button type="button" class="linkbtn" id="editAlvo">Editar meta</button></div>\n  <div class="card" id="alvoCard"></div>\n  <div class="card" id="aporteCard"></div>'),
 ('  <button type="button" class="btn" id="addAsset"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>Adicionar investimento</button>',
  '  <div class="row"><button type="button" class="btn primary" id="addAporte"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>Registrar aporte</button><button type="button" class="btn" id="addAsset">Adicionar investimento</button></div>\n  <div class="sec-head"><h2>Referência do mercado</h2><span>pra cadastrar</span></div>\n  <div id="mercado" style="display:flex;flex-direction:column;gap:6px"></div>'),
 ('    <div class="sec-head"><h2>No celular</h2></div>',
  '    <div class="sec-head"><h2>Tema</h2></div>\n    <div class="segctl tema" id="temaSeg" role="tablist"><button type="button" role="tab" data-tema="dark" aria-selected="true">Escuro</button><button type="button" role="tab" data-tema="light" aria-selected="false">Claro</button><button type="button" role="tab" data-tema="auto" aria-selected="false">Automático</button></div>\n    <div class="sec-head"><h2>Lembretes</h2><button type="button" class="linkbtn" id="icsBtn">Baixar todos (.ics)</button></div>\n    <p class="note">O app não consegue tocar alarme sozinho. Quem avisa é o Google Agenda: toca em cada bloco pra adicionar como evento que se repete toda semana, já com o seu horário. Pras 2 ou 3 horas que não podem falhar, cria alarme no app Relógio.</p>\n    <div class="orc" id="lembretes"></div>\n    <div class="sec-head"><h2>No celular</h2></div>'),
])

# ---------- C-core: todo bloco marcavel ----------
patch('src/C-core.js', [
 ("    out[i].check = out[i].vale || out[i].opcional;", "    out[i].check = true;"),
 ("var VERSAO = '3.2.1';", "var VERSAO = '3.3';"),
])

# ---------- D-hoje: no marcavel em tudo ----------
patch('src/D-hoje.js', [
 ("    var row = el(b.check ? 'button' : 'div', 'stop' + (b.check ? '' : ' minor') + (reached ? ' reached' : '') + (isnow ? ' isnow' : '') + (done ? ' done' : '') + (late ? (delay ? ' delay' : ' late') : '') + (b.check && popId === b.k ? ' pop' : ''));",
  "    var row = el('button', 'stop' + ((b.vale || b.opcional) ? '' : ' minor') + (reached ? ' reached' : '') + (isnow ? ' isnow' : '') + (done ? ' done' : '') + (late ? (delay ? ' delay' : ' late') : '') + (popId === b.k ? ' pop' : ''));"),
 ("    if(b.check){ var node = el('span', 'node'); node.innerHTML = CHECK; track.appendChild(node); } else track.appendChild(el('span', 'dot'));",
  "    var node = el('span', 'node'); node.innerHTML = CHECK; track.appendChild(node);"),
 ("  nowId = cur.check ? cur.k : null;", "  nowId = cur.k || null;"),
])

# ---------- H-fin: salario, classe exterior, grafico e corte ----------
patch('src/H-fin.js', [
 ("  {id:'prolabore', n:'Pró-labore', c:'#2FC4B2'},", "  {id:'prolabore', n:'Salário', c:'#2FC4B2'},"),
 ("  {id:'cripto', n:'Bitcoin e cripto', c:'#F7931A', d:'Altíssima oscilação. Só o que você aguenta ver cair pela metade.'}\n];",
  "  {id:'ext', n:'Exterior e dólar', c:'#FFD166', d:'ETFs e BDRs de fora, dólar em conta global. Proteção contra o real.'},\n  {id:'cripto', n:'Bitcoin e cripto', c:'#F7931A', d:'Altíssima oscilação. Só o que você aguenta ver cair pela metade.'}\n];"),
 ("    rec: [{id:'r_prolabore', nome:'Pró-labore (agência)', valor:0}],", "    rec: [{id:'r_prolabore', nome:'Meu salário (o menor mês que costuma cair)', valor:0}],"),
 ("  $('healthSub').textContent = s.renda > 0 ? (s.pisoReal ? 'piso ' : 'renda base ') + fmtK(s.renda) : 'preenche a planilha';",
  "  $('healthSub').textContent = s.renda > 0 ? (s.pisoReal ? 'salário base (menor mês) ' : 'salário base ') + fmtK(s.renda) : 'preenche a planilha';"),
 ("  if(s.fixo.f === 'bad') frases.push(['Fixos comem ' + s.fixo.txt + ' do pró-labore.', 'Próxima ação: abre a Planilha e renegocia ou corta 1 gasto fixo esta semana.']);",
  "  if(s.fixo.f === 'bad') frases.push(['Fixos comem ' + s.fixo.txt + ' do salário.', 'Próxima ação: abre a Planilha e renegocia ou corta 1 gasto fixo esta semana.']);"),
 ("inm.placeholder = grupo === 'rec' ? 'Ex.: pró-labore, cliente fixo' : 'Ex.: aluguel, Netflix';", "inm.placeholder = grupo === 'rec' ? 'Ex.: salário, cliente fixo' : 'Ex.: aluguel, Netflix';"),
 ("  if(rec === 0) rs.appendChild(el('p', 'small', 'Coloca a entrada prevista (o mês fraco, não o forte) pra planilha fechar a conta.'));",
  "  if(rec === 0) rs.appendChild(el('p', 'small', 'Coloca o seu salário (o menor mês que costuma cair, não o melhor) pra planilha fechar a conta.'));"),
 # grafico 3 cores + corte, chamados no fim de renderFinMes
 ("  var lt = $('lastTx'); lt.textContent = '';",
  "  renderChart3(); renderCorte(r);\n  var lt = $('lastTx'); lt.textContent = '';"),
 ("/* EXTRATO */",
  "function renderChart3(){\n  var box = $('chart3'); box.textContent = '';\n  var meses = [], maxV = 0;\n  for(var i = 5; i >= 0; i--){ var d = new Date(fm.getFullYear(), fm.getMonth() - i, 1), L = lancMes(d), e = 0, n = 0, g = 0; L.forEach(function(t){ if(t.tipo === 'ganho') g += +t.valor || 0; else if(t.tipo === 'gasto'){ if(catDe(t.cat).g === 'ess') e += +t.valor || 0; else n += +t.valor || 0; } }); meses.push({d:d, g:g, e:e, n:n}); maxV = Math.max(maxV, g, e, n); }\n  if(!maxV){ box.appendChild(el('p', 'empty', 'Sem lançamentos ainda. O gráfico aparece com o primeiro mês.')); return; }\n  var W = 360, H = 150, pad = 4, base = H - 22, gw = W / 6, bw = (gw - 14) / 3, ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);\n  meses.forEach(function(m, i){\n    [['g', '#3ECF8E'], ['e', '#6F8CFF'], ['n', '#FF6B7A']].forEach(function(k, j){ var h = m[k[0]] / maxV * (base - 14), r = document.createElementNS(ns, 'rect'); r.setAttribute('x', i * gw + 7 + j * bw); r.setAttribute('y', base - h); r.setAttribute('width', Math.max(0, bw - 2)); r.setAttribute('height', h); r.setAttribute('rx', '3'); r.setAttribute('fill', k[1]); r.style.opacity = same(m.d, fm) ? '1' : '.55'; svg.appendChild(r); });\n    var t = document.createElementNS(ns, 'text'); t.setAttribute('x', i * gw + gw / 2); t.setAttribute('y', H - 6); t.setAttribute('text-anchor', 'middle'); t.textContent = MES3[m.d.getMonth()]; if(same(m.d, fm)) t.style.fill = 'var(--ink)'; svg.appendChild(t);\n  });\n  box.appendChild(svg);\n  var cur = meses[5], lg = el('div', 'leg'); [['#3ECF8E', 'Entrou ' + fmtK(cur.g)], ['#6F8CFF', 'Essencial ' + fmtK(cur.e)], ['#FF6B7A', 'Não essencial ' + fmtK(cur.n)]].forEach(function(x){ var s = el('span'); var i = el('i'); i.style.background = x[0]; s.appendChild(i); s.appendChild(document.createTextNode(x[1])); lg.appendChild(s); }); box.appendChild(lg);\n  if(cur.g > 0) box.appendChild(el('p', 'small', 'Do que entrou, ' + Math.round(cur.e / cur.g * 100) + '% foi pro essencial e ' + Math.round(cur.n / cur.g * 100) + '% pro não essencial. O vermelho é a parte que você controla.'));\n}\nfunction renderCorte(r){\n  var box = $('corteBox'); box.textContent = ''; var itens = [];\n  orcAtivo(FIN.orc.nao).forEach(function(o){ itens.push({tipo:'planilha', o:o, nome:o.nome, valor:+o.valor, sub:'fixo da planilha · ' + catDe(o.cat).n}); });\n  var por = {}; lancMes(fm).forEach(function(t){ if(t.tipo === 'gasto' && catDe(t.cat).g === 'nao' && !t.orc) por[t.cat] = (por[t.cat] || 0) + (+t.valor || 0); });\n  Object.keys(por).forEach(function(id){ itens.push({tipo:'cat', nome:catDe(id).n, valor:por[id], sub:'avulsos deste mês'}); });\n  if(r.arrep > 0) itens.push({tipo:'best', nome:'Besteiras marcadas', valor:r.arrep, sub:r.nArrep + ' gastos que você disse que não precisava'});\n  itens.sort(function(a, b){ return b.valor - a.valor; });\n  var total = itens.reduce(function(s, x){ return s + x.valor; }, 0);\n  $('corteSub').textContent = itens.length ? 'até ' + fmtK(total) + '/mês' : '';\n  if(!itens.length){ box.appendChild(el('p', 'empty', 'Nada não essencial ainda. Preenche a planilha e lança os gastos.')); return; }\n  itens.slice(0, 10).forEach(function(x){\n    var row = el('div', 'orc-row'); if(x.tipo !== 'planilha') row.style.gridTemplateColumns = 'minmax(0,1fr) auto';\n    var tx = el('span'); tx.appendChild(el('span', 'nm', x.nome)); var sb = el('span', 'sb', x.sub + ' · '); var b = el('b', null, 'cortando: +' + fmtK(x.valor * 12) + '/ano'); sb.appendChild(b); tx.appendChild(sb); row.appendChild(tx);\n    row.appendChild(el('span', 'vl', fmt(x.valor)));\n    if(x.tipo === 'planilha'){ var c = el('button', 'cutbtn', 'Cortar'); c.type = 'button'; c.id = 'corte-' + x.o.id; c.addEventListener('click', function(){ if(!confirm('Marcar \"' + x.o.nome + '\" como cortado?')) return; x.o.cortadoEm = new Date().toISOString(); finSave(); render(); toast('Cortado. Menos ' + fmt(x.o.valor) + ' por mês.'); }); row.appendChild(c); }\n    box.appendChild(row);\n  });\n  var cortes = FIN.orc.ess.concat(FIN.orc.nao).filter(function(o){ return o.cortadoEm; }), econ = cortes.reduce(function(a, o){ return a + (+o.valor || 0); }, 0);\n  if(cortes.length) box.appendChild(el('p', 'cut-banner', 'Você já cortou ' + fmt(econ) + ' por mês (' + cortes.map(function(o){ return o.nome; }).join(', ') + ').'));\n}\n/* EXTRATO */"),
])

# ---------- I-fin2: exterior na meta, ticker, jogo, sugestao ----------
patch('src/I-fin2.js', [
 ("var ALVO_PADRAO = {rf:60, fii:10, acao:15, rv:5, cripto:10}, BANDA = 5;", "var ALVO_PADRAO = {rf:50, fii:10, acao:15, rv:5, ext:10, cripto:10}, BANDA = 5;"),
 ("    sh.appendChild(el('p', 'mini', 'Classe')); sh.appendChild(chipsDe(CLASSES, a.classe, function(id){ a.classe = id; }, 'ic'));",
  "    sh.appendChild(el('p', 'mini', 'Classe')); sh.appendChild(chipsDe(CLASSES, a.classe, function(id){ a.classe = id; tickerRow.hidden = !MERCADO[id]; }, 'ic'));\n    var tickerRow = el('div', 'field'); var lt = el('label', null, 'Código (ticker), se tiver'); lt.htmlFor = 'iticker'; var it = el('input'); it.type = 'text'; it.id = 'iticker'; it.value = a.ticker || ''; it.placeholder = 'Ex.: MXRF11, PETR4, IVVB11'; it.setAttribute('list', 'tickers'); it.autocapitalize = 'characters';\n    var dl = el('datalist'); dl.id = 'tickers'; ['fii', 'acao', 'ext'].forEach(function(c){ MERCADO[c].forEach(function(m){ var op = el('option'); op.value = m[0]; op.label = m[1]; dl.appendChild(op); }); });\n    it.addEventListener('change', function(){ a.ticker = it.value.toUpperCase().trim(); var hit = null; ['fii', 'acao', 'ext'].forEach(function(c){ MERCADO[c].forEach(function(m){ if(m[0] === a.ticker) hit = {c:c, m:m}; }); }); if(hit){ if(!a.nome || a.nome === a.ticker) { a.nome = hit.m[0] + ' · ' + hit.m[1]; inm.value = a.nome; } } var lk = linkMercado(a.classe, a.ticker); linkA.hidden = !lk; if(lk) linkA.href = lk; });\n    tickerRow.appendChild(lt); tickerRow.appendChild(it); tickerRow.appendChild(dl); var linkA = el('a', 'linkbtn', 'Ver o ativo no Investidor10 →'); linkA.target = '_blank'; linkA.rel = 'noopener'; var lk0 = linkMercado(a.classe, a.ticker); linkA.hidden = !lk0; if(lk0) linkA.href = lk0; tickerRow.appendChild(linkA); tickerRow.hidden = !MERCADO[a.classe]; sh.appendChild(tickerRow);"),
 ("  $('assetsSub').textContent = FIN.inv.length ? 'toca pra editar o valor' : '';",
  "  $('assetsSub').textContent = FIN.inv.length ? 'toca pra editar o valor' : '';\n  renderJogo(); renderSugestao(); renderMercado();\n  if(!aporteVal){ var sg0 = sugestaoMes(); if(sg0.valor > 0) aporteVal = Math.max(0, sg0.valor - sg0.jaFoi); }"),
 ("$('addAsset').addEventListener('click', function(){ sheetInv(); });", "$('addAsset').addEventListener('click', function(){ sheetInv(); });\n$('addAporte').addEventListener('click', function(){ sheetAporte(); });"),
 ("      var dd = el('span'); dd.appendChild(el('span', 't', a.nome));", "      var dd = el('span'); dd.appendChild(el('span', 't', a.nome + (a.ticker && a.nome.indexOf(a.ticker) < 0 ? ' · ' + a.ticker : '')));"),
])

# ---------- E-resto: lembretes, tema, ics ----------
patch('src/E-resto.js', [
 ("  else { renderDiag(); $('rotBox').hidden = !rotAberta; $('rotToggle').textContent = rotAberta ? 'Fechar' : 'Abrir'; if(rotAberta) renderRotina(); }",
  "  else { renderDiag(); renderLembretes(); $('rotBox').hidden = !rotAberta; $('rotToggle').textContent = rotAberta ? 'Fechar' : 'Abrir'; if(rotAberta) renderRotina(); }"),
 ("carregar(); finLoad();\n$('ver').textContent = 'Rotina v' + VERSAO;",
  "carregar(); finLoad();\naplicarTema(temaAtual());\n$('temaSeg').addEventListener('click', function(e){ var b = e.target.closest('button'); if(!b) return; var t = b.getAttribute('data-tema'); try{ localStorage.setItem('rotina.v3.tema', t); }catch(x){} aplicarTema(t); toast(t === 'light' ? 'Tema claro.' : t === 'dark' ? 'Tema escuro.' : 'Segue o celular.'); });\nif(window.matchMedia) try{ window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(){ if(temaAtual() === 'auto') aplicarTema('auto'); }); }catch(e){}\n$('icsBtn').addEventListener('click', function(){ try{ var blob = new Blob([icsDaRotina()], {type:'text/calendar'}), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'rotina.ics'; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1500); toast('Arquivo baixado. No computador: Google Agenda → Configurações → Importar.', 5000); }catch(e){ toast('Não consegui gerar o arquivo.'); } });\n$('ver').textContent = 'Rotina v' + VERSAO;"),
])

# ---------- J-guia: pessoa fisica, salario ----------
j = rd('src/J-guia.js')
j = j.replace("{id:'prolabore', t:'Separar PF de PJ e fixar o pró-labore no piso', o:'Tudo que a agência recebe entra na conta PJ; todo custo da agência sai dela. Você recebe um pró-labore fixo, no mesmo dia todo mês. O valor é o PISO: o 3º menor mês dos últimos 12, não a média. O INSS sobre o pró-labore é o seu piso de aposentadoria e de auxílio-doença: pra quem vive de PJ, ficar doente é renda zero.', why:'A média descreve o ano, não descreve nenhum mês. O piso é o único número que cabe em todo mês.', crit:'2 meses seguidos de pró-labore no mesmo valor e na mesma data, sem gasto pessoal no cartão da PJ.', ev:'convenção'},",
              "{id:'prolabore', t:'Um salário fixo, mesmo que o dinheiro varie', o:'Se o que entra muda todo mês, define um salário fixo pra você: o menor valor que costuma entrar (o 3º menor dos últimos 12 meses). É esse número que paga as contas. O que entrar acima disso vai pra uma conta separada, que completa o salário no mês fraco. Se você recebe pela sua empresa: é ela que te paga esse salário, no mesmo dia, todo mês, e o INSS em cima dele é o seu piso de aposentadoria e de auxílio-doença.', why:'A média descreve o ano, não descreve nenhum mês. O menor mês é o único número que cabe em todo mês.', crit:'2 meses seguidos recebendo o mesmo salário na mesma data, sem gasto pessoal saindo da conta da empresa.', ev:'convenção'},")
j = j.replace("{id:'planilha', t:'Planilha: essenciais cabem no pró-labore', o:'Na aba Planilha, a entrada prevista é o pró-labore (o piso). Os essenciais têm que caber dentro dele. Gasto anual (IPVA, IPTU, seguro, DAS) entra dividido por 12, senão o mês do IPVA vira uma sobra negativa falsa. O que a PJ ganhar acima do piso fica na PJ como \"conta de nivelamento\", que paga o pró-labore inteiro no mês fraco.', why:'É assim que renda variável vira renda previsível: o mês bom banca o mês ruim em vez de virar gasto.', crit:'Conta de nivelamento com pelo menos 1 pró-labore guardado e 3 meses com essenciais ≤ 100% do pró-labore.', ev:'convenção'},",
              "{id:'planilha', t:'Planilha: o essencial cabe no salário', o:'Na aba Planilha, a entrada prevista é o seu salário base. As despesas essenciais têm que caber dentro dele. Gasto anual (IPVA, IPTU, seguro) entra dividido por 12, senão o mês do IPVA vira uma sobra negativa falsa. O que entrar acima do salário base vai pra conta separada, que completa o salário no mês fraco.', why:'É assim que renda que varia vira renda previsível: o mês bom banca o mês ruim em vez de virar gasto.', crit:'Pelo menos 1 salário guardado na conta separada e 3 meses com essenciais ≤ 100% do salário.', ev:'convenção'},")
j = j.replace("d:'Verde de 20% pra cima (regra 50/30/20: 20% pra poupança e dívida). Âmbar de 10 a 20. Vermelho abaixo de 10. Com renda variável, o que entra é o pró-labore; o excedente fica na PJ. Enquanto houver dívida cara, pagar a mais conta como sobra.'",
              "d:'Verde de 20% pra cima (regra 50/30/20: 20% pra poupança e dívida). Âmbar de 10 a 20. Vermelho abaixo de 10. Se a renda varia, o que conta é o salário base; o excedente vai pra conta separada. Enquanto houver dívida cara, pagar a mais conta como sobra.'")
j = j.replace('pró-labore', 'salário').replace('Pró-labore', 'Salário')
j = j.replace("{t:'Custo essencial', f:'essenciais da planilha ÷ renda base (o piso, quando houver 3+ meses de ganhos)'", "{t:'Custo essencial', f:'essenciais da planilha ÷ salário base (o menor mês, quando houver 3+ meses de ganhos)'")
assert 'pró-labore' not in j
wr('src/J-guia.js', j)

# ---------- montar + sw ----------
m = rd('src/montar.py').replace("rd('src/J-guia.js') + rd('src/I-fin2.js')", "rd('src/J-guia.js') + rd('src/K-jogo.js') + rd('src/I-fin2.js')")
wr('src/montar.py', m)
wr('sw.js', rd('sw.js').replace("rotina-v3.2.1", "rotina-v3.3.0"))
print('patch6 ok')
