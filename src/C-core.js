<script>
(function(){
'use strict';
var VERSAO = '3.4';
var CONTA_DESDE = new Date(2026, 8, 22);
var INICIO = new Date(2026, 8, 28);
var DOW3 = ['dom','seg','ter','qua','qui','sex','sáb'];
var DOWL = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
var MES3 = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
var MESL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
var CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
var QUANDO = [['sempre','Todo dia'],['treino','Só dia de treino'],['semtreino','Só dia sem treino'],['seg','Só segunda'],['sex','Só sexta'],['sab','Só sábado'],['dom','Só domingo']];

/* relogio (?hoje=2026-10-14T10:20 pra testar) */
var t0 = Date.now(), fake = null, abrir = null;
try{
  var qs = new URLSearchParams(location.search);
  var q = qs.get('hoje'); if(q){ var f = new Date(q); if(!isNaN(f.getTime())) fake = f.getTime(); }
  abrir = qs.get('tab');
}catch(e){}
function agora(){ return fake ? new Date(fake + (Date.now() - t0)) : new Date(); }

function pad(n){ return String(n).padStart(2,'0'); }
function keyOf(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
function mins(s){ var p = String(s || '00:00').split(':'); return (+p[0])*60 + (+p[1] || 0); }
function hhmm(m){ m = Math.max(0, Math.min(1439, Math.round(m))); return pad(Math.floor(m/60)) + ':' + pad(m%60); }
function hora(m){ if(typeof m === 'string') m = mins(m); var h = Math.floor(m/60) % 24, mm = m % 60; return mm ? h+'h'+pad(mm) : h+'h'; }
function midnight(d){ return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function addDays(d,n){ var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate()+n); return x; }
function same(a,b){ return keyOf(a) === keyOf(b); }
function monday(d){ return addDays(d, -((d.getDay()+6)%7)); }
function clone(o){ return JSON.parse(JSON.stringify(o == null ? {} : o)); }
function $(id){ return document.getElementById(id); }
function el(tag, cls, txt){ var e = document.createElement(tag); if(cls) e.className = cls; if(txt != null) e.textContent = txt; return e; }
function uid(){ return 'b' + Math.random().toString(36).slice(2, 8); }

/* cor do ceu por horario */
var SKY = [[0,[111,140,255]],[300,[111,140,255]],[420,[255,194,75]],[720,[255,154,77]],[900,[255,122,102]],[1080,[242,102,159]],[1230,[169,123,255]],[1380,[111,140,255]],[1440,[111,140,255]]];
function sky(m){
  m = Math.max(0, Math.min(1440, m));
  for(var i = 1; i < SKY.length; i++){
    if(m <= SKY[i][0]){
      var a = SKY[i-1], b = SKY[i], t = (m - a[0]) / ((b[0] - a[0]) || 1);
      return 'rgb(' + [0,1,2].map(function(k){ return Math.round(a[1][k] + (b[1][k]-a[1][k])*t); }).join(',') + ')';
    }
  }
  return 'rgb(111,140,255)';
}
function hue(p){ return p >= 90 ? 150 : p >= 75 ? 85 : p >= 50 ? 42 : 8; }

/* rotina padrao */
function B(k,h,t,d,o){ o = o || {}; return {k:k,h:h,t:t,d:d||'',r:o.r||'',vale:!!o.vale,opcional:!!o.opcional,treino:!!o.treino,quando:o.quando||'sempre',dur:o.dur||0}; }
function rotinaOriginal(){
  return {
    treino: [1,2,4,5],
    util: [
      B('acordar','07:00','Acordar','De pé até 7h30. Janela aberta, sol na cara, celular longe da cama.',{vale:true}),
      B('cafe','07:15','Café na casa da mãe','O notebook fica em casa.'),
      B('sair','07:50','Sair da casa da mãe','Xícara na pia, tchau e rua. No caminho, decide as 3 entregas da manhã.',{vale:true,r:'Se o alarme das 7h50 tocou, então levanto da mesa na hora.'}),
      B('planejar','08:05','Planejar a semana','No máximo 3 metas, uma delas de receita ou de lead. Tudo vira bloco na agenda, com folga de 50% no tempo.',{vale:true,quando:'seg',dur:30}),
      B('foco','08:05','Bloco de foco','Na mesa, sentado, nunca deitado. Começa pela entrega nº 1. Mensagens só às 9h45 e às 11h45.',{vale:true,r:'Lead novo é a exceção: responder em até 1h.'}),
      B('almoco','12:00','Almoço','Longe da tela de trabalho. Em dia de treino, mais leve.'),
      B('rasas','13:00','Tarefas rasas','WhatsApp, e-mail, financeiro, leads. Último café do dia até as 14h.'),
      B('academia','14:10','Academia','Trocado na porta às 14h15, treinando às 14h30. O podcast que só toca lá.',{vale:true,treino:true,quando:'treino',r:'Sem energia? Vai e faz 20 min. Perdeu a hora? Reserva às 17h.'}),
      B('academia_reserva','14:10','Treino reserva','Só se faltou algum treino na semana. Se não, descansa.',{opcional:true,treino:true,quando:'semtreino'}),
      B('banho','15:45','Banho e lanche','Direto pro que faltou.'),
      B('terminar','16:00','Terminar o que faltou','Mensagens no começo do bloco. Depois, só o que ficou da manhã.'),
      B('revisao','17:30','Revisão da semana','O que andou, o que travou, 1 melhoria pra semana que vem.',{vale:true,quando:'sex',dur:30}),
      B('fechar','18:00','Fechar o expediente','Cada pendência ganha dia e hora. Notebook fechado. Expediente encerrado.',{vale:true,dur:10}),
      B('cafezinho','18:10','Café da tarde','Sai da mesa de trabalho. É a virada pro modo estudo.'),
      B('estudo','18:30','Estudar','30 a 60 min de curso. No fim, fecha o material e escreve de memória 3 ideias.',{vale:true}),
      B('leitura','19:30','Ler','20 a 30 min de livro. Pode ser o de negócios que você quer ler de qualquer jeito.',{vale:true}),
      B('noite','20:00','Noite livre','Casa da mãe, descanso, o que quiser. Trabalho só em emergência.'),
      B('cama','22:30','Ir pra cama','Celular carregando fora do quarto. Luz apagada às 23h.',{vale:true})
    ],
    fds: [
      B('acordar','07:00','Acordar','Mesmo horário da semana, até 7h30 vale. É a regularidade que acerta o relógio do corpo.',{vale:true,r:'Se dormi tarde, então acordo às 7h do mesmo jeito e tiro um cochilo de 20 min depois do almoço.'}),
      B('livre','07:30','Dia livre','Descanso de verdade. Trabalho só se for emergência.'),
      B('academia_reserva','10:00','Treino reserva','Só se faltou algum treino na semana.',{opcional:true,treino:true,quando:'sab'}),
      B('cama','22:30','Ir pra cama','Celular carregando fora do quarto. 20 min de livro de papel.',{vale:true})
    ]
  };
}

/* estado */
var T = null, dias = {}, diag = {}, cfg = {};
var sel = midnight(agora()), tab = 'hoje', popId = null, editing = false, tplLista = 'util';
var wk = monday(midnight(agora())), mo = new Date(agora().getFullYear(), agora().getMonth(), 1), picked = null;

function ler(k, def){ try{ var v = localStorage.getItem('rotina.v3.' + k); return v ? JSON.parse(v) : def; }catch(e){ return def; } }
function gravar(k, v){ try{ localStorage.setItem('rotina.v3.' + k, JSON.stringify(v)); }catch(e){ toast('Não consegui salvar. Está sem espaço?'); } }
function carregar(){
  T = ler('template', null);
  if(!T || !T.util || !T.fds){ T = rotinaOriginal(); }
  if(!Array.isArray(T.treino)) T.treino = [1,2,4,5];
  dias = ler('dias', {}) || {};
  diag = ler('diag', {}) || {};
  cfg = ler('cfg', {}) || {};
}
function salvarDias(){ gravar('dias', dias); }
function salvarT(){ gravar('template', T); }

/* plano do dia */
function quandoOk(q, dow, treino){
  if(!q || q === 'sempre') return true;
  if(q === 'treino') return treino;
  if(q === 'semtreino') return !treino;
  if(q === 'seg') return dow === 1;
  if(q === 'sex') return dow === 5;
  if(q === 'sab') return dow === 6;
  if(q === 'dom') return dow === 0;
  return true;
}
function ehTreino(date){ return T.treino.indexOf(date.getDay()) > -1 && !(date.getDay() === 0 || date.getDay() === 6); }
function plano(date, ignorarOverrides){
  var dow = date.getDay(), fds = dow === 0 || dow === 6, lista = fds ? T.fds : T.util, treino = ehTreino(date);
  var rec = dias[keyOf(date)] || {}, out = [];
  lista.forEach(function(b, i){
    if(!quandoOk(b.quando, dow, treino)) return;
    if(!ignorarOverrides && rec.pulados && rec.pulados.indexOf(b.k) > -1) return;
    var h = (!ignorarOverrides && rec.horarios && rec.horarios[b.k]) || b.h;
    out.push({k:b.k, s:mins(h), t:b.t, d:b.d, r:b.r, vale:!!b.vale, opcional:!!b.opcional, treino:!!b.treino, dur:b.dur||0, i:i});
  });
  out.sort(function(a,b){ return a.s - b.s || a.i - b.i; });
  for(var i = 1; i < out.length; i++) if(out[i].s <= out[i-1].s) out[i].s = Math.min(1439, out[i-1].s + (out[i-1].dur || 30));
  for(i = 0; i < out.length; i++){
    out[i].e = i < out.length - 1 ? out[i+1].s : 1440;
    out[i].check = out[i].vale || out[i].opcional;
    var due = 1440;
    for(var j = i + 1; j < out.length; j++) if(out[j].vale){ due = out[j].s; break; }
    out[i].due = due;
  }
  return out;
}
function obrigatorios(date){ return plano(date).filter(function(b){ return b.vale; }).map(function(b){ return b.k; }); }
function nomeDe(k){
  var b = T.util.concat(T.fds).filter(function(x){ return x.k === k; })[0];
  return b ? b.t : k;
}
function horaDe(k){
  var b = T.util.concat(T.fds).filter(function(x){ return x.k === k; })[0];
  return b ? b.h : '00:00';
}
function marcado(rec, k){ return !!(rec && rec.itens && rec.itens[k] === true); }

/* placar */
function placar(date){
  var hoje = midnight(agora()), k = keyOf(date), rec = dias[k];
  var r = {conta:false, futuro:date > hoje, total:0, feito:0, p:null, faltou:[], ids:[], hoje:same(date, hoje), vazio:!rec};
  if(date < CONTA_DESDE || r.futuro) return r;
  r.conta = true;
  var P = plano(date), base = (!r.hoje && rec && Array.isArray(rec.plano)) ? rec.plano.slice() : P.filter(function(b){ return b.vale; }).map(function(b){ return b.k; });
  P.forEach(function(b){ if(b.opcional && marcado(rec, b.k) && base.indexOf(b.k) < 0) base.push(b.k); });
  base.forEach(function(id){
    r.ids.push(id); r.total++;
    if(marcado(rec, id)) r.feito++; else r.faltou.push(id);
  });
  r.p = r.total ? Math.round(r.feito / r.total * 100) : null;
  return r;
}
function periodo(datas){
  var t = {total:0, feito:0, p:null, dias:0, cheios:0, treinos:0, por:{}};
  datas.forEach(function(d){
    var rec = dias[keyOf(d)];
    if(d >= CONTA_DESDE && rec) plano(d).forEach(function(b){ if(b.treino && marcado(rec, b.k)) t.treinos++; });
    var r = placar(d);
    if(!r.conta || !r.total) return;
    t.dias++; t.total += r.total; t.feito += r.feito;
    if(!r.hoje && r.p === 100) t.cheios++;
    r.ids.forEach(function(id){
      var o = t.por[id] || (t.por[id] = {total:0, feito:0});
      o.total++; if(r.faltou.indexOf(id) < 0) o.feito++;
    });
  });
  t.p = t.total ? Math.round(t.feito / t.total * 100) : null;
  var pior = null;
  Object.keys(t.por).forEach(function(id){
    var o = t.por[id]; if(o.total < 2) return;
    var p = o.feito / o.total;
    if(p < 0.6 && (!pior || p < pior.p)) pior = {id:id, p:p};
  });
  t.fraco = pior ? pior.id : null;
  return t;
}
function sequencia(){
  /* dias seguidos com 80% ou mais; um dia ruim a cada 7 nao quebra a corrente (mas nao conta) */
  var d = addDays(midnight(agora()), -1), n = 0, folga = 0, desde = 0;
  while(d >= CONTA_DESDE){
    var r = placar(d);
    if(r.p != null && r.p >= 80){ n++; desde++; if(desde >= 7){ folga = 0; desde = 0; } }
    else { var ant = placar(addDays(d, -1)); if(folga === 0 && n > 0 && ant.p != null && ant.p >= 80){ folga = 1; } else break; }
    d = addDays(d, -1);
  }
  var h = placar(midnight(agora()));
  if(h.total && h.p === 100) n++;
  return n;
}
function nivel(p){ return p == null ? 0 : p >= 90 ? 4 : p >= 75 ? 3 : p >= 50 ? 2 : 1; }
var ROTULO = ['Ainda sem jogo','Esporro','Meia-boca','Bom, mas dá mais','Mandou muito'];

/* as falas */
function fr(c, com, sem){ return c.fraco ? com.replace('{f}', nomeDe(c.fraco).toLowerCase()) : sem; }
var FALA = {
  semana: {
    4: [
      function(){ return 'Semana de quem manda no próprio dia. É esse João que cobra mais caro, entrega sem embolar e sai do aperto. Repete.'; },
      function(){ return 'Isso separa quem fala que vai mudar de quem muda. Mais algumas iguais a essa e a rotina anda sozinha.'; },
      function(){ return 'Você prometeu e cumpriu. Guarda essa sensação: é ela que te tira da cama às 7h na semana ruim.'; }
    ],
    3: [
      function(c){ return 'Semana boa, ainda não perfeita. ' + fr(c, 'Seu ponto fraco: {f}. Fecha esse buraco e você entra nos 90.', 'Aperta um pouco mais e você entra nos 90.'); },
      function(c){ return 'Tá no caminho, mas bom é inimigo do ótimo. ' + fr(c, 'O que ainda te derruba: {f}. Resolve isso primeiro.', 'Não relaxa agora.'); }
    ],
    2: [
      function(c){ return 'Metade de um plano não é plano, é intenção. ' + fr(c, 'O que mais furou: {f}. ', '') + 'O João de dezembro está olhando pra essa semana.'; },
      function(){ return 'Você cumpre quando é fácil e some quando aperta. É no dia ruim que a rotina se paga. Semana que vem, sem desculpa.'; }
    ],
    1: [
      function(c){ return 'Tá de brincadeira? Você pediu essa rotina porque disse que estava em colapso. Cumprir ' + c.p + '% dela é escolher continuar nele.'; },
      function(){ return 'Esporro merecido. Ninguém vai organizar a sua vida por você. O plano está pronto, quem faltou foi você. Amanhã, 7h, de pé, sem negociar.'; },
      function(c){ return c.p + '%. Com esse número o faturamento não sobe, as finanças não saem do colapso e o dia continua embolado. Você sabe fazer melhor. Então faz.'; }
    ]
  },
  mes: {
    4: [function(){ return 'Mês de respeito. Trinta dias assim mudam faturamento, corpo e cabeça. Você está virando quem disse que queria ser.'; }],
    3: [function(c){ return 'Mês bom. ' + fr(c, 'O que falta pra ser ótimo tem nome: {f}.', 'Falta pouco pra ser ótimo.'); }],
    2: [function(){ return 'Mês pela metade. Você não está em colapso por falta de plano, está por falta de constância. O mês que vem começa amanhã.'; }],
    1: [function(){ return 'Rotina que só existe no aplicativo não paga conta nem conquista cliente. Volta pro básico: 7h de pé, mesa, academia. O resto vem depois.'; }]
  },
  ontem: {
    4: ['Ontem foi dia cheio. Mais um tijolo.','Ontem você fez o que disse que ia fazer. É só isso, todo dia.'],
    3: ['Ontem foi bom. Faltou pouco.'],
    2: ['Ontem foi pela metade. Hoje compensa.'],
    1: ['Ontem você sumiu da própria rotina. Hoje é dia de retorno: começa pelo próximo bloco, agora.']
  },
  cheio: ['Dia cheio. É assim que o João de dezembro é construído.','100%. Guarda essa sensação e repete amanhã.','Fechou o dia inteiro. Isso é constância, não sorte.']
};
function escolhe(lista, n){ return lista[Math.abs(n) % lista.length]; }
function nomes(ids){ return ids.map(function(id){ return nomeDe(id).toLowerCase(); }).join(', '); }

/* toast + confete */
var toastTimer = null;
function toast(t, ms){ var s = $('toast'); s.textContent = t; s.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(function(){ s.classList.remove('show'); }, ms || 2200); }
function confete(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var c = $('confetti'), ctx = c.getContext('2d'), W = c.width = innerWidth, H = c.height = innerHeight;
  c.hidden = false;
  var cores = ['#FFC24B','#FF7A66','#A97BFF','#3DDC97','#F2F1FB'], ps = [];
  for(var i = 0; i < 110; i++) ps.push({x:W/2 + (Math.random()-.5)*80, y:H*0.35, vx:(Math.random()-.5)*14, vy:-Math.random()*13-4, r:Math.random()*5+3, c:cores[i%cores.length], a:Math.random()*Math.PI, va:(Math.random()-.5)*.3});
  var t = 0;
  (function frame(){
    ctx.clearRect(0,0,W,H); t++;
    ps.forEach(function(p){ p.x += p.vx; p.y += p.vy; p.vy += .45; p.vx *= .99; p.a += p.va; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - t/70); ctx.fillRect(-p.r, -p.r/2, p.r*2, p.r); ctx.restore(); });
    if(t < 75) requestAnimationFrame(frame); else { ctx.clearRect(0,0,W,H); c.hidden = true; }
  })();
}
