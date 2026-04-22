async function getExecutiveSummary() {
  return {
    receitaConsolidada: {
      valor: 284900,
      formatado: 'R$ 284,9 mil',
      variacao: '+14,8%',
      descricao: 'em relação ao último ciclo'
    },
    pedidosAtivos: {
      total: 1248,
      emPreparacao: 312,
      emRota: 89
    },
    lojasOnline: {
      total: 186,
      estabilidade: '94,2%'
    },
    satisfacaoMedia: {
      nota: 4.8,
      escala: '/5',
      npsEstimado: 79
    }
  }
}

async function getExecutiveKpis() {
  return {
    updatedAt: '2026-04-20T09:30:00-03:00',
    gmvMarketplace: {
      valor: 148320,
      variacao: '+12,4%'
    },
    taxaConversao: {
      valor: '8,7%',
      variacao: '+1,1 p.p.'
    },
    ticketMedio: {
      valor: 118.84,
      formatado: 'R$ 118,84',
      observacao: 'Atenção em produtos premium'
    },
    cancelamentos: {
      valor: '2,3%',
      variacao: '+0,4 p.p.',
      tendencia: 'queda'
    }
  }
}

async function getRevenueWeek() {
  return {
    periodo: 'Últimos 7 dias',
    dias: [
      { dia: 'Seg', valor: 22000 },
      { dia: 'Ter', valor: 28000 },
      { dia: 'Qua', valor: 31000 },
      { dia: 'Qui', valor: 25000 },
      { dia: 'Sex', valor: 36000 },
      { dia: 'Sáb', valor: 41000 },
      { dia: 'Dom', valor: 33000 }
    ]
  }
}

async function getRecentOrders() {
  return {
    modo: 'Monitoramento em tempo real',
    pedidos: [
      {
        codigo: 'JB-10429',
        cliente: 'Amanda Lima',
        categoria: 'Supermercado',
        lojaPrestador: 'Mercado Central',
        valor: 248.9,
        status: 'Concluído'
      },
      {
        codigo: 'JB-10430',
        cliente: 'Marcos Silva',
        categoria: 'Serviço residencial',
        lojaPrestador: 'Resolve Já',
        valor: 180,
        status: 'Em rota'
      },
      {
        codigo: 'JB-10431',
        cliente: 'Bianca Souza',
        categoria: 'Tecnologia',
        lojaPrestador: 'BeeTech Store',
        valor: 1299,
        status: 'Preparando'
      },
      {
        codigo: 'JB-10432',
        cliente: 'Rafael Cruz',
        categoria: 'Beleza',
        lojaPrestador: 'Studio Prime',
        valor: 95,
        status: 'Atrasado'
      },
      {
        codigo: 'JB-10433',
        cliente: 'Juliana Rocha',
        categoria: 'Casa e móveis',
        lojaPrestador: 'Lar Ideal',
        valor: 740,
        status: 'Em separação'
      }
    ]
  }
}

async function getCategoryPerformance() {
  return {
    titulo: 'Mix de operação',
    categorias: [
      { nome: 'Supermercado', ocupacao: 91 },
      { nome: 'Tecnologia', ocupacao: 84 },
      { nome: 'Serviços residenciais', ocupacao: 79 },
      { nome: 'Moda', ocupacao: 68 },
      { nome: 'Beleza e cuidados', ocupacao: 74 }
    ]
  }
}

async function getOperationalAgenda() {
  return {
    janela: 'Próximas 48h',
    eventos: [
      {
        hora: '09h',
        titulo: 'Disparo da campanha “Sextou na Jobee”',
        descricao: 'Segmentação por clientes recorrentes e cupons regionais.',
        area: 'Marketing'
      },
      {
        hora: '11h',
        titulo: 'Revisão do SLA de entregas da zona norte',
        descricao: 'Análise de atraso acima de 20 min em operações críticas.',
        area: 'Operações'
      },
      {
        hora: '14h',
        titulo: 'Onboarding de novos parceiros locais',
        descricao: 'Entrada de 12 lojas do segmento de alimentação.',
        area: 'Expansão'
      },
      {
        hora: '17h',
        titulo: 'Fechamento parcial do relatório executivo',
        descricao: 'Consolidação de receita, CAC, retenção e churn de lojistas.',
        area: 'BI'
      }
    ]
  }
}

async function getOperationalHealth() {
  return {
    atendimento: {
      tempoMedioResposta: '3m 42s',
      ticketsResolvidosHoje: 184,
      filaCritica: 12,
      csat: '96,1%'
    },
    logistica: {
      entregasNoPrazo: '93,8%',
      rotasEmRisco: 18,
      tempoMedioColeta: '14 min',
      motoristasAtivos: 132
    }
  }
}

async function getTopPartners() {
  return {
    titulo: 'Top 5 da semana',
    itens: [
      {
        posicao: 1,
        nome: 'Mercado Central',
        resumo: 'R$ 28,4 mil • 98,2% no prazo • nota 4,9',
        variacao: '+22%'
      },
      {
        posicao: 2,
        nome: 'BeeTech Store',
        resumo: 'R$ 24,7 mil • alto ticket médio • destaque em eletrônicos',
        variacao: '+18%'
      },
      {
        posicao: 3,
        nome: 'Resolve Já',
        resumo: '210 ordens concluídas • liderança em serviços residenciais',
        variacao: '+15%'
      },
      {
        posicao: 4,
        nome: 'Studio Prime',
        resumo: 'Conversão de 12,3% • boa recorrência de clientes',
        variacao: '+11%'
      },
      {
        posicao: 5,
        nome: 'Lar Ideal',
        resumo: 'Baixa taxa de devolução • crescimento contínuo no segmento',
        variacao: '+9%'
      }
    ]
  }
}

async function getRegionalCoverage() {
  return {
    titulo: '5 cidades mais fortes',
    cidades: [
      { nome: 'Salvador', lojas: 48 },
      { nome: 'Feira de Santana', lojas: 31 },
      { nome: 'Camaçari', lojas: 24 },
      { nome: 'Lauro de Freitas', lojas: 19 },
      { nome: 'Vitória da Conquista', lojas: 16 }
    ]
  }
}

async function getAlerts() {
  return {
    alertas: [
      {
        tipo: 'acao',
        icone: '!',
        titulo: 'Pico de cancelamento em tecnologia',
        descricao: 'Concentrado em dois parceiros com ruptura de estoque.',
        nivel: 'Médio'
      },
      {
        tipo: 'risco',
        icone: '⏱',
        titulo: 'Atraso acima da meta em rotas centrais',
        descricao: 'Necessário redimensionar 6 motoristas no turno da tarde.',
        nivel: 'Alto'
      },
      {
        tipo: 'oportunidade',
        icone: '★',
        titulo: 'Campanha local com alta adesão',
        descricao: 'Categoria mercado teve CTR 31% acima da média.',
        nivel: 'Oportunidade'
      }
    ]
  }
}

async function getStrategicBlock() {
  return {
    retencaoLojistas: {
      valor: '92,6%',
      descricao: 'Expansão saudável da base com churn sob controle e boa recorrência.'
    },
    clientesRecorrentes: {
      valor: '64%',
      descricao: 'Base fidelizada sustentando crescimento com melhor eficiência de aquisição.'
    },
    disponibilidadePlataforma: {
      valor: '99,94%',
      descricao: 'Estabilidade técnica mantendo a jornada de compra e contratação sem fricção.'
    }
  }
}

async function getQuickActions() {
  return {
    acoes: [
      {
        titulo: 'Gerenciar parceiros',
        descricao: 'Entrar no painel de aprovação, ativação e acompanhamento de lojistas e prestadores.',
        rota: '/dashboard/parceiros'
      },
      {
        titulo: 'Monitorar pedidos',
        descricao: 'Acessar a fila operacional com filtros por SLA, atraso, categoria e região.',
        rota: '/dashboard/pedidos'
      },
      {
        titulo: 'Ver campanha ativa',
        descricao: 'Analisar desempenho de promoções, cupons e ativações sazonais do marketplace.',
        rota: '/dashboard/campanhas'
      },
      {
        titulo: 'Exportar BI',
        descricao: 'Baixar a consolidação de métricas financeiras, comerciais e operacionais.',
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