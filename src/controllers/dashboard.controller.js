async function getDashboard(req, res) {
  try {
    const { plano } = req.query

    if (!plano) {
      return res.status(400).json({ erro: 'Plano não informado' })
    }

    const data = await dashboardService.getExecutiveByPlan(plano)

    return res.json(data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ erro: 'Erro interno' })
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
  getExecutiveFull,
  getDashboard
}