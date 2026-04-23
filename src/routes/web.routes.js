const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'home.html'))
})

router.get('/compra', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'compra.html'))
})

router.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'forgot.html'))
})

router.get('/login', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'login.html'))
})

router.get('/cadastro', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'criarcont.html'))
})

router.get('/produto', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'produto.html'))
})

router.get('/carrinho', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'cart.html'))
})

router.get('/loja/:slug', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'loja.html'))
})

router.get('/reset-password', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'reset-password.html'))
})

router.get('/perfil', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'perfil.html'))
})

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'dashboard-jobee.html'))
})

router.get('/sobre', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'sobre.html'))
})

router.get('/ajuda', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'ajuda.html'))
})

router.get('/politica-privacidade', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'politica-privacidade.html'))
})

module.exports = router