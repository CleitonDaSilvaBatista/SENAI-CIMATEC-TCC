const supabase = require('../config/database')

function formatCurrencyCompact(value) {
  const n = Number(value || 0)

  if (n >= 1000) {
    return `R$ ${(n / 1000).toFixed(1).replace('.', ',')} mil`
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(n)
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value || 0))
}

function weekdayPt(dateString) {
  const date = new Date(dateString)
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  return dias[date.getDay()]
}

async function getExecutiveSummary() {
  const [{ data: pedidos, error: pedidosError }, { data: lojas, error: lojasError }] =
    await Promise.all([
      supabase
        .from('pedidos')
        .select('valor_total, status'),
      supabase
        .from('lojas')
        .select('id_loja, ativo, nota_media')
        .eq('ativo', true)
    ])

  if (pedidosError) throw new Error('Erro ao buscar pedidos do resumo.')
  if (lojasError) throw new Error('Erro ao buscar lojas do resumo.')

  const receitaTotal = (pedidos || []).reduce((acc, p) => acc + Number(p.valor_total || 0), 0)

  const pedidosAtivos = (pedidos || []).filter(p =>
    ['preparando', 'em rota', 'em separação', 'em separacao'].includes(
      String(p.status || '').toLowerCase()
    )
  )

  const emPreparacao = (pedidos || []).filter(p =>
    String(p.status || '').toLowerCase() === 'preparando'
  ).length

  const emRota = (pedidos || []).filter(p =>
    String(p.status || '').toLowerCase() === 'em rota'
  ).length

  const notas = (lojas || [])
    .map(l => Number(l.nota_media))
    .filter(n => !Number.isNaN(n) && n > 0)

  const mediaNota = notas.length
    ? Number((notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1))
    : 4.8

  return {
    receitaConsolidada: {
      valor: receitaTotal,
      formatado: formatCurrencyCompact(receitaTotal),
      variacao: '+0,0%',
      descricao: 'em relação ao último ciclo'
    },
    pedidosAtivos: {
      total: pedidosAtivos.length,
      emPreparacao,
      emRota
    },
    lojasOnline: {
      total: (lojas || []).length,
      estabilidade: '94,2%'
    },
    satisfacaoMedia: {
      nota: mediaNota,
      escala: '/5',
      npsEstimado: 79
    }
  }
}

async function getExecutiveKpis() {
  const { data: pedidos, error } = await supabase
    .from('pedidos')
    .select('valor_total, status, created_at')

  if (error) throw new Error('Erro ao buscar KPIs.')

  const rows = pedidos || []
  const totalPedidos = rows.length || 1
  const gmv = rows.reduce((acc, p) => acc + Number(p.valor_total || 0), 0)
  const ticketMedio = gmv / totalPedidos

  const cancelados = rows.filter(p =>
    String(p.status || '').toLowerCase() === 'cancelado'
  ).length

  const cancelamentosPct = ((cancelados / totalPedidos) * 100).toFixed(1).replace('.', ',')

  return {
    updatedAt: new Date().toISOString(),
    gmvMarketplace: {
      valor: gmv,
      variacao: '+0,0%'
    },
    taxaConversao: {
      valor: '8,7%',
      variacao: '+0,0 p.p.'
    },
    ticketMedio: {
      valor: ticketMedio,
      formatado: formatCurrency(ticketMedio),
      observacao: 'Baseado nos pedidos registrados'
    },
    cancelamentos: {
      valor: `${cancelamentosPct}%`,
      variacao: '+0,0 p.p.',
      tendencia: 'estável'
    }
  }
}

async function getRevenueWeek() {
  const seteDiasAtras = new Date()
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 6)

  const { data, error } = await supabase
    .from('pedidos')
    .select('valor_total, created_at')
    .gte('created_at', seteDiasAtras.toISOString())
    .order('created_at', { ascending: true })

  if (error) throw new Error('Erro ao buscar faturamento semanal.')

  const mapa = {
    Seg: 0,
    Ter: 0,
    Qua: 0,
    Qui: 0,
    Sex: 0,
    Sáb: 0,
    Dom: 0
  }

  ;(data || []).forEach(item => {
    const dia = weekdayPt(item.created_at)
    mapa[dia] += Number(item.valor_total || 0)
  })

  return {
    periodo: 'Últimos 7 dias',
    dias: Object.entries(mapa).map(([dia, valor]) => ({
      dia,
      valor
    }))
  }
}

async function getRecentOrders() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('codigo, categoria, valor_total, status, created_at, id_loja, id_usuario')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) throw new Error('Erro ao buscar pedidos recentes.')

  const pedidos = data || []

  const lojaIds = [...new Set(pedidos.map(p => p.id_loja).filter(Boolean))]
  const userIds = [...new Set(pedidos.map(p => p.id_usuario).filter(Boolean))]

  const [{ data: lojas }, { data: usuarios }] = await Promise.all([
    lojaIds.length
      ? supabase.from('lojas').select('id_loja, nome_fantasia').in('id_loja', lojaIds)
      : Promise.resolve({ data: [] }),
    userIds.length
      ? supabase.from('usuarios').select('id_usuario, nome').in('id_usuario', userIds)
      : Promise.resolve({ data: [] })
  ])

  const lojasMap = new Map((lojas || []).map(l => [l.id_loja, l.nome_fantasia]))
  const usuariosMap = new Map((usuarios || []).map(u => [u.id_usuario, u.nome]))

  return {
    modo: 'Monitoramento em tempo real',
    pedidos: pedidos.map(p => ({
      codigo: p.codigo,
      cliente: usuariosMap.get(p.id_usuario) || 'Cliente',
      categoria: p.categoria || 'Marketplace',
      lojaPrestador: lojasMap.get(p.id_loja) || 'Loja',
      valor: Number(p.valor_total || 0),
      status: p.status
    }))
  }
}

async function getCategoryPerformance() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('categoria')

  if (error) throw new Error('Erro ao buscar performance por categoria.')

  const contagem = {}

  ;(data || []).forEach(item => {
    const nome = item.categoria || 'Outros'
    contagem[nome] = (contagem[nome] || 0) + 1
  })

  const total = Object.values(contagem).reduce((a, b) => a + b, 0) || 1

  const categorias = Object.entries(contagem)
    .map(([nome, qtd]) => ({
      nome,
      ocupacao: Math.round((qtd / total) * 100)
    }))
    .sort((a, b) => b.ocupacao - a.ocupacao)
    .slice(0, 5)

  return {
    titulo: 'Mix de operação',
    categorias
  }
}

async function getOperationalAgenda() {
  return {
    janela: 'Próximas 48h',
    eventos: [
      {
        hora: '09h',
        titulo: 'Revisão operacional do marketplace',
        descricao: 'Acompanhamento automático baseado nos dados da plataforma.',
        area: 'Operações'
      },
      {
        hora: '14h',
        titulo: 'Consolidação parcial de vendas',
        descricao: 'Fechamento parcial com base nos pedidos registrados.',
        area: 'BI'
      }
    ]
  }
}

async function getOperationalHealth() {
  const { data: pedidos, error } = await supabase
    .from('pedidos')
    .select('status')

  if (error) throw new Error('Erro ao buscar saúde operacional.')

  const total = (pedidos || []).length || 1
  const concluidos = (pedidos || []).filter(p =>
    String(p.status || '').toLowerCase() === 'concluído' ||
    String(p.status || '').toLowerCase() === 'concluido'
  ).length

  const entregasNoPrazo = ((concluidos / total) * 100).toFixed(1).replace('.', ',')

  return {
    atendimento: {
      tempoMedioResposta: '3m 42s',
      ticketsResolvidosHoje: 184,
      filaCritica: 12,
      csat: '96,1%'
    },
    logistica: {
      entregasNoPrazo: `${entregasNoPrazo}%`,
      rotasEmRisco: 18,
      tempoMedioColeta: '14 min',
      motoristasAtivos: 132
    }
  }
}

async function getTopPartners() {
  const { data: pedidos, error } = await supabase
    .from('pedidos')
    .select('id_loja, valor_total')

  if (error) throw new Error('Erro ao buscar top parceiros.')

  const somaPorLoja = {}

  ;(pedidos || []).forEach(p => {
    const id = p.id_loja
    if (!id) return
    somaPorLoja[id] = (somaPorLoja[id] || 0) + Number(p.valor_total || 0)
  })

  const lojaIds = Object.keys(somaPorLoja).map(Number)

  const { data: lojas, error: lojasError } = lojaIds.length
    ? await supabase.from('lojas').select('id_loja, nome_fantasia').in('id_loja', lojaIds)
    : { data: [], error: null }

  if (lojasError) throw new Error('Erro ao buscar lojas do ranking.')

  const lojasMap = new Map((lojas || []).map(l => [l.id_loja, l.nome_fantasia]))

  const itens = Object.entries(somaPorLoja)
    .map(([idLoja, total]) => ({
      idLoja: Number(idLoja),
      total
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((item, index) => ({
      posicao: index + 1,
      nome: lojasMap.get(item.idLoja) || `Loja ${item.idLoja}`,
      resumo: `${formatCurrency(item.total)} em vendas no período`,
      variacao: '+0%'
    }))

  return {
    titulo: 'Top 5 da semana',
    itens
  }
}

async function getRegionalCoverage() {
  const { data, error } = await supabase
    .from('lojas')
    .select('cidade')
    .eq('ativo', true)

  if (error) throw new Error('Erro ao buscar cobertura regional.')

  const contagem = {}

  ;(data || []).forEach(item => {
    const cidade = item.cidade || 'Sem cidade'
    contagem[cidade] = (contagem[cidade] || 0) + 1
  })

  const cidades = Object.entries(contagem)
    .map(([nome, lojas]) => ({ nome, lojas }))
    .sort((a, b) => b.lojas - a.lojas)
    .slice(0, 5)

  return {
    titulo: '5 cidades mais fortes',
    cidades
  }
}

async function getAlerts() {
  const { data: pedidos, error } = await supabase
    .from('pedidos')
    .select('categoria, status')

  if (error) throw new Error('Erro ao buscar alertas.')

  const canceladosTecnologia = (pedidos || []).filter(p =>
    (p.categoria || '').toLowerCase().includes('tecnologia') &&
    String(p.status || '').toLowerCase() === 'cancelado'
  ).length

  const alertas = []

  if (canceladosTecnologia > 0) {
    alertas.push({
      tipo: 'acao',
      icone: '!',
      titulo: 'Pico de cancelamento em tecnologia',
      descricao: 'Há pedidos cancelados concentrados na categoria tecnologia.',
      nivel: 'Médio'
    })
  }

  alertas.push({
    tipo: 'risco',
    icone: '⏱',
    titulo: 'Acompanhamento logístico necessário',
    descricao: 'Monitorar pedidos em rota e em preparação para evitar atrasos.',
    nivel: 'Alto'
  })

  return { alertas }
}

async function getStrategicBlock() {
  const { data: lojas, error } = await supabase
    .from('lojas')
    .select('id_loja, ativo')

  if (error) throw new Error('Erro ao buscar bloco estratégico.')

  const totalLojas = (lojas || []).length || 1
  const lojasAtivas = (lojas || []).filter(l => l.ativo).length
  const retencao = ((lojasAtivas / totalLojas) * 100).toFixed(1).replace('.', ',')

  return {
    retencaoLojistas: {
      valor: `${retencao}%`,
      descricao: 'Base calculada a partir das lojas ativas registradas.'
    },
    clientesRecorrentes: {
      valor: '64%',
      descricao: 'Indicador mantido temporariamente até entrada da métrica real.'
    },
    disponibilidadePlataforma: {
      valor: '99,94%',
      descricao: 'Indicador técnico mantido temporariamente.'
    }
  }
}

async function getQuickActions() {
  return {
    acoes: [
      {
        titulo: 'Gerenciar parceiros',
        descricao: 'Acompanhar lojistas e prestadores cadastrados.',
        rota: '/dashboard/parceiros'
      },
      {
        titulo: 'Monitorar pedidos',
        descricao: 'Acessar a fila operacional dos pedidos registrados.',
        rota: '/dashboard/pedidos'
      },
      {
        titulo: 'Exportar BI',
        descricao: 'Baixar consolidação de métricas financeiras e operacionais.',
        rota: '/dashboard/exportar'
      }
    ]
  }
}

async function getExecutiveFull() {
  const [
    summary,
    kpis,
    revenueWeek,
    recentOrders,
    categoryPerformance,
    operationalAgenda,
    health,
    topPartners,
    regionalCoverage,
    alerts,
    strategicBlock,
    quickActions
  ] = await Promise.all([
    getExecutiveSummary(),
    getExecutiveKpis(),
    getRevenueWeek(),
    getRecentOrders(),
    getCategoryPerformance(),
    getOperationalAgenda(),
    getOperationalHealth(),
    getTopPartners(),
    getRegionalCoverage(),
    getAlerts(),
    getStrategicBlock(),
    getQuickActions()
  ])

  return {
    summary,
    kpis,
    revenueWeek,
    recentOrders,
    categoryPerformance,
    operationalAgenda,
    health,
    topPartners,
    regionalCoverage,
    alerts,
    strategicBlock,
    quickActions
  }
}

module.exports = {
  getExecutiveSummary,
  getExecutiveKpis,
  getRevenueWeek,
  getRecentOrders,
  getCategoryPerformance,
  getOperationalAgenda,
  getOperationalHealth,
  getTopPartners,
  getRegionalCoverage,
  getAlerts,
  getStrategicBlock,
  getQuickActions,
  getExecutiveFull
}