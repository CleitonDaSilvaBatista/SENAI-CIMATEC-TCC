const lojaService = require('../services/loja.service')

async function getLojas(req, res, next) {
  try {
    const result = await lojaService.getLojas()
    return res.json(result)
  } catch (error) {
    next(error)
  }
}

async function getLojaBySlug(req, res, next) {
  try {
    const result = await lojaService.getLojaBySlug(req.params.slug)
    return res.json(result)
  } catch (error) {
    next(error)
  }
}

async function getContagemItens(req, res, next) {
  try {
    const { id } = req.params
    const contagem = await lojaService.getItensCountByLoja(id)
    return res.json(contagem)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getLojas,
  getLojaBySlug,
  getContagemItens
}