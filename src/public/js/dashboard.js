function getToken() {
  return localStorage.getItem('jobee_token')
}

function requireAuth() {
  const token = getToken()

  if (!token) {
    alert('Você precisa fazer login para acessar o dashboard.')
    window.location.href = '/login'
    return false
  }

  return true
}

async function fetchDashboard() {
  const token = getToken()

  const response = await fetch('/api/dashboard/executive/full', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Erro ao carregar dashboard.')
  }

  return data
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value || 0))
}

function setText(id, value) {
  const el = document.getElementById(id)
  if (el) el.textContent = value
}

function clearContainer(id) {
  const el = document.getElementById(id)
  if (el) el.innerHTML = ''
  return el
}

function getStatusClass(status) {
  const normalized = String(status || '').toLowerCase()

  if (
    normalized.includes('concluído') ||
    normalized.includes('concluido') ||
    normalized.includes('success')
  ) {
    return 'success'
  }

  if (
    normalized.includes('rota') ||
    normalized.includes('separação') ||
    normalized.includes('separacao') ||
    normalized.includes('info')
  ) {
    return 'info'
  }

  if (
    normalized.includes('preparando') ||
    normalized.includes('warning') ||
    normalized.includes('médio') ||
    normalized.includes('medio')
  ) {
    return 'warning'
  }

  if (
    normalized.includes('atrasado') ||
    normalized.includes('danger') ||
    normalized.includes('alto')
  ) {
    return 'danger'
  }

  if (normalized.includes('oportunidade')) {
    return 'success'
  }

  return 'info'
}

function renderSummary(summary) {
  if (!summary) return

  setText('receita-consolidada', summary.receitaConsolidada?.formatado || '—')
  setText(
    'receita-variacao',
    `${summary.receitaConsolidada?.variacao || '—'} ${summary.receitaConsolidada?.descricao || ''}`.trim()
  )

  setText('pedidos-ativos', summary.pedidosAtivos?.total ?? '—')
  setText(
    'pedidos-detalhe',
    `${summary.pedidosAtivos?.emPreparacao ?? 0} em preparação e ${summary.pedidosAtivos?.emRota ?? 0} em rota`
  )

  setText('lojas-online', summary.lojasOnline?.total ?? '—')
  setText(
    'lojas-estabilidade',
    `${summary.lojasOnline?.estabilidade || '—'} da base com operação estável`
  )

  setText(
    'satisfacao-media',
    `${summary.satisfacaoMedia?.nota ?? '—'}${summary.satisfacaoMedia?.escala || ''}`
  )
  setText(
    'satisfacao-detalhe',
    `NPS estimado de ${summary.satisfacaoMedia?.npsEstimado ?? '—'} pontos`
  )
}

function renderKpis(kpis) {
  if (!kpis) return

  const updatedAt = kpis.updatedAt
    ? new Date(kpis.updatedAt).toLocaleString('pt-BR')
    : 'Atualizado recentemente'

  setText('kpi-updated-at', updatedAt)
  setText('gmv-valor', formatCurrency(kpis.gmvMarketplace?.valor))
  setText('gmv-variacao', `▲ ${kpis.gmvMarketplace?.variacao || '—'}`)

  setText('conversao-valor', kpis.taxaConversao?.valor || '—')
  setText('conversao-variacao', `▲ ${kpis.taxaConversao?.variacao || '—'}`)

  setText('ticket-medio-valor', kpis.ticketMedio?.formatado || '—')
  setText('ticket-medio-observacao', `● ${kpis.ticketMedio?.observacao || '—'}`)

  setText('cancelamentos-valor', kpis.cancelamentos?.valor || '—')
  setText('cancelamentos-variacao', `▼ ${kpis.cancelamentos?.variacao || '—'}`)
}

function renderRevenueWeek(revenueWeek) {
  const container = clearContainer('grafico-semana')
  if (!container || !revenueWeek?.dias?.length) return

  const max = Math.max(...revenueWeek.dias.map(item => Number(item.valor || 0)), 1)

  revenueWeek.dias.forEach(item => {
    const value = Number(item.valor || 0)
    const height = Math.max((value / max) * 100, 8)

    const col = document.createElement('div')
    col.className = 'bar-col'

    col.innerHTML = `
      <div class="bar-track">
        <div class="bar-fill" style="height: ${height}%;"></div>
      </div>
      <strong>${item.dia}</strong>
      <span>${formatCurrency(value)}</span>
    `

    container.appendChild(col)
  })
}

function renderRecentOrders(recentOrders) {
  const tbody = clearContainer('tabela-pedidos')
  if (!tbody) return

  const pedidos = recentOrders?.pedidos || []

  if (!pedidos.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">Nenhum pedido encontrado.</td>
      </tr>
    `
    return
  }

  pedidos.forEach(pedido => {
    const tr = document.createElement('tr')
    const statusClass = getStatusClass(pedido.status)

    tr.innerHTML = `
      <td>#${pedido.codigo || '—'}</td>
      <td>${pedido.cliente || '—'}</td>
      <td>${pedido.categoria || '—'}</td>
      <td>${pedido.lojaPrestador || '—'}</td>
      <td>${formatCurrency(pedido.valor)}</td>
      <td><span class="status ${statusClass}">${pedido.status || '—'}</span></td>
    `

    tbody.appendChild(tr)
  })
}

function renderCategoryPerformance(categoryPerformance) {
  const container = clearContainer('lista-categorias')
  if (!container) return

  const categorias = categoryPerformance?.categorias || []

  categorias.forEach(item => {
    const el = document.createElement('div')
    el.className = 'progress-item'

    el.innerHTML = `
      <div class="progress-meta">
        <span>${item.nome}</span>
        <span>${item.ocupacao}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-value" style="width: ${item.ocupacao}%;"></div>
      </div>
    `

    container.appendChild(el)
  })
}

function renderOperationalAgenda(operationalAgenda) {
  const container = clearContainer('agenda-operacional')
  if (!container) return

  const eventos = operationalAgenda?.eventos || []

  eventos.forEach(item => {
    const el = document.createElement('div')
    el.className = 'timeline-item'

    el.innerHTML = `
      <div class="timeline-dot">${item.hora || '—'}</div>
      <div>
        <strong>${item.titulo || '—'}</strong>
        <span>${item.descricao || '—'}</span>
      </div>
      <span class="pill">${item.area || '—'}</span>
    `

    container.appendChild(el)
  })
}

function renderHealth(health) {
  if (!health) return

  setText('atendimento-tempo', health.atendimento?.tempoMedioResposta || '—')
  setText('atendimento-tickets', health.atendimento?.ticketsResolvidosHoje ?? '—')
  setText('atendimento-fila', health.atendimento?.filaCritica ?? '—')
  setText('atendimento-csat', health.atendimento?.csat || '—')

  setText('logistica-prazo', health.logistica?.entregasNoPrazo || '—')
  setText('logistica-risco', health.logistica?.rotasEmRisco ?? '—')
  setText('logistica-coleta', health.logistica?.tempoMedioColeta || '—')
  setText('logistica-motoristas', health.logistica?.motoristasAtivos ?? '—')
}

function renderTopPartners(topPartners) {
  const container = clearContainer('ranking-parceiros')
  if (!container) return

  const itens = topPartners?.itens || []

  itens.forEach(item => {
    const el = document.createElement('div')
    el.className = 'ranking-item'

    el.innerHTML = `
      <div class="ranking-index">${item.posicao || '—'}</div>
      <div>
        <strong>${item.nome || '—'}</strong>
        <span>${item.resumo || '—'}</span>
      </div>
      <span class="pill">${item.variacao || '—'}</span>
    `

    container.appendChild(el)
  })
}

function renderRegionalCoverage(regionalCoverage) {
  const container = clearContainer('cidades-fortes')
  if (!container) return

  const cidades = regionalCoverage?.cidades || []

  cidades.forEach(item => {
    const el = document.createElement('span')
    el.className = 'city-chip'
    el.textContent = `${item.nome} • ${item.lojas} lojas`
    container.appendChild(el)
  })
}

function renderAlerts(alerts) {
  const container = clearContainer('lista-alertas')
  if (!container) return

  const itens = alerts?.alertas || []

  itens.forEach(item => {
    const el = document.createElement('div')
    el.className = 'alert-item'

    const statusClass = getStatusClass(item.nivel)

    el.innerHTML = `
      <div class="alert-icon">${item.icone || '!'}</div>
      <div>
        <strong>${item.titulo || '—'}</strong>
        <span>${item.descricao || '—'}</span>
      </div>
      <span class="status ${statusClass}">${item.nivel || '—'}</span>
    `

    container.appendChild(el)
  })
}

function renderStrategicBlock(strategicBlock) {
  if (!strategicBlock) return

  setText('retencao-valor', strategicBlock.retencaoLojistas?.valor || '—')
  setText('retencao-desc', strategicBlock.retencaoLojistas?.descricao || '—')

  setText('clientes-recorrentes-valor', strategicBlock.clientesRecorrentes?.valor || '—')
  setText('clientes-recorrentes-desc', strategicBlock.clientesRecorrentes?.descricao || '—')

  setText('disponibilidade-valor', strategicBlock.disponibilidadePlataforma?.valor || '—')
  setText('disponibilidade-desc', strategicBlock.disponibilidadePlataforma?.descricao || '—')
}

function renderQuickActions(quickActions) {
  const container = clearContainer('acoes-rapidas')
  if (!container) return

  const acoes = quickActions?.acoes || []

  acoes.forEach(item => {
    const el = document.createElement('div')
    el.className = 'action-card'

    el.innerHTML = `
      <strong>${item.titulo || '—'}</strong>
      <p>${item.descricao || '—'}</p>
    `

    if (item.rota) {
      el.style.cursor = 'pointer'
      el.addEventListener('click', () => {
        window.location.href = item.rota
      })
    }

    container.appendChild(el)
  })
}

function renderDashboard(data) {
  renderSummary(data.summary)
  renderKpis(data.kpis)
  renderRevenueWeek(data.revenueWeek)
  renderRecentOrders(data.recentOrders)
  renderCategoryPerformance(data.categoryPerformance)
  renderOperationalAgenda(data.operationalAgenda)
  renderHealth(data.health)
  renderTopPartners(data.topPartners)
  renderRegionalCoverage(data.regionalCoverage)
  renderAlerts(data.alerts)
  renderStrategicBlock(data.strategicBlock)
  renderQuickActions(data.quickActions)
}

async function initDashboard() {
  if (!requireAuth()) return

  try {
    const data = await fetchDashboard()
    renderDashboard(data)
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
    alert(error.message || 'Erro ao carregar dashboard.')
  }
}

document.addEventListener('DOMContentLoaded', initDashboard)