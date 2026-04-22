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

async function getContagemItens(req, res) {
  try {
    const { id } = req.params
    const contagem = await lojaService.getItensCountByLoja(id)

    return res.status(200).json(contagem)
  } catch (error) {
    console.error('Erro ao buscar contagem de itens da loja:', error)
    return res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getLojas,
  getLojaBySlug,
  getContagemItens
}