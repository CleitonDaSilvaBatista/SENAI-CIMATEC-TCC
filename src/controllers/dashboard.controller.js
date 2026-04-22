const dashboardService = require('../services/dashboard.service')

async function getExecutiveSummary(req, res, next) {
  try {
    const data = await dashboardService.getExecutiveSummary()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

async function getExecutiveKpis(req, res, next) {
  try {
    const data = await dashboardService.getExecutiveKpis()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

async function getRevenueWeek(req, res, next) {
  try {
    const data = await dashboardService.getRevenueWeek()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

async function getRecentOrders(req, res, next) {
  try {
    const data = await dashboardService.getRecentOrders()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

async function getCategoryPerformance(req, res, next) {
  try {
    const data = await dashboardService.getCategoryPerformance()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

async function getOperationalAgenda(req, res, next) {
  try {
    const data = await dashboardService.getOperationalAgenda()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

async function getOperationalHealth(req, res, next) {
  try {
    const data = await dashboardService.getOperationalHealth()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

async function getTopPartners(req, res, next) {
  try {
    const data = await dashboardService.getTopPartners()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

async function getRegionalCoverage(req, res, next) {
  try {
    const data = await dashboardService.getRegionalCoverage()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

async function getAlerts(req, res, next) {
  try {
    const data = await dashboardService.getAlerts()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

async function getStrategicBlock(req, res, next) {
  try {
    const data = await dashboardService.getStrategicBlock()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

async function getQuickActions(req, res, next) {
  try {
    const data = await dashboardService.getQuickActions()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

async function getExecutiveFull(req, res, next) {
  try {
    const data = await dashboardService.getExecutiveFull()
    res.json(data)
  } catch (error) {
    next(error)
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