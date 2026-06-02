const express = require('express')
const router = express.Router()
const lojaController = require('../controllers/loja.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/', lojaController.getLojas)
router.post('/', authMiddleware, lojaController.criarLoja)
router.get('/:id/contagem', lojaController.getContagemItens)
router.get('/:slug', lojaController.getLojaBySlug)

module.exports = router