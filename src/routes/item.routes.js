const express = require('express')
const router = express.Router()
const itemController = require('../controllers/item.controller')

router.get('/:id', itemController.getItemById)

router.get('/loja/:id/contagem', async (req, res) => {
  try {
    const { id } = req.params
    const data = await getItensCountByLoja(id)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router