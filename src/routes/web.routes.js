const express = require('express')
const path = require('path')
const { resourceLimits } = require('worker_threads')

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

router.get('/compra', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'compra.html'))
})

router.get('/login', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'login.html'))
})

router.get('/criarcont', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'criarcont.html'))
})

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'dashboard-jobee.html'))
} )

router.get('/perfil', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'perfil-cliente.html'))
})
      
router.get('/perfilempreendedor', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'perfil-empreendedor.html'))
})


router.get('/perfil-cliente', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'perfil-cliente.html'))
})

router.get('/perfil-empreendedor', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'perfil-empreendedor.html'))
})

router.get('/cadastrar-loja', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'cadastrar-loja.html'))
})

router.get('/produto', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'produto-shorts.html'))
})
router.get('/contato', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'contato.html'))
})

const paginasProduto = {
  '/produto-shorts': 'produto-shorts.html',
  '/produto-tv': 'produto-tv.html',
  '/produto-ferramentas': 'produto-ferramentas.html',
  '/produto-painel-tv': 'produto-painel-tv.html',
  '/produto-espelho': 'produto-espelho.html',
  '/produto-mesa-cadeiras': 'produto-mesa-cadeiras.html',
  '/produto-smartwatch': 'produto-smartwatch.html',
  '/produto-placa-video': 'produto-placa-video.html'
}

Object.entries(paginasProduto).forEach(([rota, arquivo]) => {
  router.get(rota, (req, res) => {
    res.sendFile(path.join(process.cwd(), 'src', 'public', arquivo))
  })

  router.get(`${rota}.html`, (req, res) => {
    res.sendFile(path.join(process.cwd(), 'src', 'public', arquivo))
  })
})


router.get('/agendamento-servico', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'agendamento-servico.html'))
})

router.get('/agendamento-servico.html', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'agendamento-servico.html'))
})


router.get('/buscar', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'buscar.html'))
})

router.get('/buscar.html', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'buscar.html'))
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





router.get('/planos', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'planos.html'))
})

router.get('/planos.html', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'planos.html'))
})

router.get('/dicas-vendas', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'dicas-vendas.html'))
})

router.get('/dicas-vendas.html', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'dicas-vendas.html'))
})

router.get('/contato', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'contato.html'))
})

router.get('/contato.html', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'public', 'contato.html'))
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