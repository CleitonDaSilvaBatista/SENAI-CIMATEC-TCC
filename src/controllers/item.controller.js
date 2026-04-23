const itemService = require('../services/item.service')

async function getItemById(req, res, next) {
  try {
    const result = await itemService.getItemById(req.params.id)
    return res.json(result)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getItemById
}