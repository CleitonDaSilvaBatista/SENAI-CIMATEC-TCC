const express = require('express')
const router = express.Router()
const lojaController = require('../controllers/loja.controller')

router.get('/', lojaController.getLojas)
router.get('/:slug', lojaController.getLojaBySlug)
router.get('/:id/contagem', lojaController.getContagemItens)

module.exports = router