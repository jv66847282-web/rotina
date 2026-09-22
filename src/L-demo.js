
/* ===== MODO DEMONSTRACAO (?demo=1): dados de exemplo num espaco separado ===== */
function demoSeed(){
  var seed = 7; function rnd(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  var hoje = midnight(agora());
  /* rotina: de 22/09 ate ontem, ~80% cumprido, um dia ruim, um dia perfeito por semana */
  var D = {};
  for(var d = new Date(CONTA_DESDE); d < hoje; d = addDays(d, 1)){
    var k = keyOf(d), ob = obrigatorios(d), it = {}, dia = d.getDate();
    var chance = dia % 9 === 0 ? 0.3 : dia % 6 === 0 ? 1 : 0.8;
    ob.forEach(function(id){ it[id] = rnd() < chance; });
    if(dia % 6 === 0) ob.forEach(function(id){ it[id] = true; });
    D[k] = {data:k, itens:it, plano:ob, atualizadoEm:d.toISOString()};
  }
  var hk = keyOf(hoje), hob = obrigatorios(hoje), hit = {}; hob.slice(0, 2).forEach(function(id){ hit[id] = true; });
  D[hk] = {data:hk, itens:hit, plano:hob, horarios:{acordar:'07:45', cafe:'08:00', sair:'08:35', foco:'08:50'}, atualizadoEm:hoje.toISOString()};
  dias = D; salvarDias();
  /* financas */
  var mk = function(nome, valor, cat, cortadoEm){ return {id:uid(), nome:nome, valor:valor, cat:cat, cortadoEm:cortadoEm || null}; };
  var ess = [mk('Aluguel', 1800, 'moradia'), mk('Condomínio', 0, 'moradia'), mk('Supermercado', 700, 'mercado'), mk('Luz', 180, 'contas'), mk('Água', 60, 'contas'), mk('Plano de saúde', 420, 'saude'), mk('Investimentos (todo mês)', 0, 'outros')];
  var nao = [mk('Academia', 120, 'academia'), mk('Aplicativos e assinaturas', 140, 'assinaturas', '2026-10-03T12:00:00Z'), mk('Celular', 60, 'contas'), mk('Internet', 110, 'contas'), mk('Streaming', 85, 'assinaturas'), mk('Restaurantes e iFood', 600, 'restaurante'), mk('Combustível', 0, 'transporte'), mk('Farmácia', 0, 'saude')];
  var L = [], y = hoje.getFullYear(), m0 = hoje.getMonth();
  function add(mOff, dia, tipo, v, desc, cat, conta, arrep, orc){ var dt = new Date(y, m0 - mOff, dia); if(dt > hoje) return; var k2 = keyOf(dt); L.push({id:uid(), tipo:tipo, valor:v, desc:desc, cat:cat, conta:conta, data:k2, arrep:!!arrep, orc:orc || null, atualizadoEm:dt.toISOString()}); }
  [2, 1, 0].forEach(function(off){
    add(off, 2, 'ganho', off === 1 ? 5200 : off === 2 ? 4100 : 4200, 'Cliente A · mensalidade', 'cliente', 'c_pix');
    add(off, 5, 'ganho', 1800, 'Cliente B', 'cliente', 'c_pix');
    add(off, 1, 'gasto', 1800, 'Aluguel', 'moradia', 'c_inter', false, ess[0].id);
    add(off, 3, 'gasto', 120, 'Smart Fit', 'academia', 'c_nu', false, nao[0].id);
    add(off, 3, 'gasto', 89.9, 'iFood', 'restaurante', 'c_nu', true);
    add(off, 4, 'gasto', 312, 'Mercado Assaí', 'mercado', 'c_inter');
    add(off, 6, 'gasto', 55.9, 'Netflix', 'assinaturas', 'c_nu', false, nao[4].id);
    add(off, 7, 'gasto', off === 1 ? 890 : 149, off === 1 ? 'Shopee · fone e roupa' : 'Shopee · fone', 'compras', 'c_nu', true);
    add(off, 8, 'gasto', 64.5, 'iFood', 'restaurante', 'c_nu', true);
    add(off, 9, 'gasto', 38, 'Uber', 'transporte', 'c_nu');
    add(off, 10, 'gasto', 210, 'Farmácia', 'saude', 'c_inter');
    add(off, 11, 'gasto', 120, 'Bar com amigos', 'lazer', 'c_nu', true);
    add(off, 12, 'gasto', 420, 'Mercado', 'mercado', 'c_inter');
    add(off, 13, 'gasto', 72.4, 'iFood', 'restaurante', 'c_nu', true);
    add(off, 14, 'gasto', 29.9, 'Spotify', 'assinaturas', 'c_nu');
    add(off, 16, 'gasto', 180, 'Luz', 'contas', 'c_inter', false, ess[3].id);
    add(off, 18, 'gasto', 260, 'Mercado', 'mercado', 'c_inter');
    add(off, 20, 'gasto', 95, 'Barbeiro', 'cuidados', 'c_pix');
    add(off, 22, 'gasto', 140, 'Presente', 'presentes', 'c_nu');
    add(off, 25, 'gasto', 310, 'Mercado', 'mercado', 'c_inter');
    add(off, 27, 'gasto', 58, 'iFood', 'restaurante', 'c_nu', true);
    add(off, 28, 'transf', 900, 'Pagamento da fatura Nubank', 'transf', 'c_inter');
  });
  var inv = [
    {id:uid(), nome:'CDB 102% CDI', classe:'rf', inst:'Nubank', aplicado:2500, atual:2610, reserva:true, atualizadoEm:addDays(hoje, -4).toISOString()},
    {id:uid(), nome:'Tesouro Selic', classe:'rf', inst:'Tesouro Direto', aplicado:3000, atual:3095, reserva:false, atualizadoEm:addDays(hoje, -4).toISOString()},
    {id:uid(), nome:'MXRF11 · Maxi Renda', classe:'fii', inst:'XP', aplicado:1200, atual:1160, reserva:false, ticker:'MXRF11', atualizadoEm:addDays(hoje, -12).toISOString()},
    {id:uid(), nome:'BOVA11 · ETF Ibovespa', classe:'acao', inst:'XP', aplicado:1500, atual:1720, reserva:false, ticker:'BOVA11', atualizadoEm:addDays(hoje, -4).toISOString()},
    {id:uid(), nome:'IVVB11 · ETF S&P 500', classe:'ext', inst:'XP', aplicado:1000, atual:1085, reserva:false, ticker:'IVVB11', atualizadoEm:addDays(hoje, -4).toISOString()},
    {id:uid(), nome:'Bitcoin', classe:'cripto', inst:'Binance', aplicado:800, atual:1040, reserva:false, atualizadoEm:addDays(hoje, -40).toISOString()}
  ];
  var ap1 = {id:uid(), data:keyOf(new Date(y, m0, 3)), ativoId:inv[0].id, valor:800, classe:'reserva'};
  L.push({id:uid(), tipo:'transf', valor:800, desc:'Aporte · CDB 102% CDI', cat:'transf', conta:'c_pix', data:ap1.data, arrep:false, orc:null, aporte:ap1.id, atualizadoEm:new Date().toISOString()});
  FIN = {
    contas:[{id:'c_nu', nome:'Nubank crédito', tipo:'credito', cor:'#8A05BE'}, {id:'c_inter', nome:'Inter débito', tipo:'debito', cor:'#FF7A00'}, {id:'c_pix', nome:'Pix', tipo:'pix', cor:'#6F8CFF'}],
    lanc:L,
    orc:{rec:[{id:'r_prolabore', nome:'Meu salário (o menor mês que costuma cair)', valor:5500}], ess:ess, nao:nao},
    inv:inv, aportes:[ap1],
    dividas:[{id:uid(), credor:'Nubank · fatura atrasada', saldo:2350, taxa:14.5, parcela:300, tipo:'rotativo'}, {id:uid(), credor:'Empréstimo pessoal Inter', saldo:4800, taxa:4.2, parcela:420, tipo:'emprestimo'}],
    guia:{raiox:true, prolabore:true},
    jogo:{pontos:10, hist:[{data:ap1.data, pts:10, motivo:'Reserva primeiro: +10'}], meses:{}, missoes:{}},
    cfg:{pctInvestir:20, jogoDesde:'2026-10', contaPadrao:'c_nu'}
  };
  diag = {meq:true, tempo:true}; gravar('diag', diag);
  finSave(); gravar('demo-ok', true);
}
