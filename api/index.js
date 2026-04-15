require('dotenv').config()
const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const supabase = require('../database')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(process.cwd(), 'public')))

// =================================
// ROTAS (ATUALIZAR PARA O FRONTEND)
// =================================

const authRoutes = require('./routes/auth')
app.use('/', authRoutes)

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'home.html'))
})
app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'forgot.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'login.html'))
})
app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'criarcont.html'))
})

app.get('/produto', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'produto.html'))
})

app.get('/carrinho', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'cart.html'))
})

app.get('/loja/:slug', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'loja.html'));
})

// =================================
//          ROTAS FOOTER
// =================================

app.get('/sobre', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'sobre.html'))
})

app.get('/ajuda', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'ajuda.html'))
})

app.get('/politica-privacidade', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'politica-privacidade.html'))
})

// =================================
//         FIM ROTAS FOOTER
// =================================

// Configurar transporter de e-mail verificando se há variáveis de ambiente
let transporter

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
  
  // Testar conexão
  transporter.verify((error, success) => {
    if (error) {
      console.error('Erro na conexão SMTP:', error)
    } else {
      console.log('✓ Conexão SMTP estabelecida com sucesso')
    }
  })
} else {
  console.warn('⚠ Variáveis SMTP não configuradas. Alguns recursos de e-mail estarão desativados.')
}
app.get('/api/user-info', async (req, res) => {
  try {

    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.json({ logado: false })
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { data, error } = await supabase
      .from('usuarios')
      .select('nome, email')
      .eq('id_usuario', decoded.id)
      .single()

    if (error || !data) {
      return res.json({ logado: false })
    }

    return res.json({
      logado: true,
      nome: data.nome,
      email: data.email
    })

  } catch (err) {

    return res.json({ logado: false })

  }
})

app.post('/api/logout', (req, res) => {
  return res.json({
    success: true,
    message: 'Logout realizado com sucesso.'
  })
})

app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'E-mail é obrigatório.' })
    }

    const { data: user, error: userError } = await supabase
      .from('usuarios')
      .select('id_usuario, email')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' })
    }

    // Gerar JWT com expiração de 30 minutos
    const resetToken = jwt.sign(
      { id: user.id_usuario, email: user.email, type: 'password-reset' },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    )

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`

    // Enviar e-mail com nodemailer
    if (!transporter) {
      return res.status(500).json({ error: 'Serviço de e-mail não configurado.' })
    }

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Redefinição de senha - Jobee',
      html: `
        <h2>Redefinição de Senha</h2>
        <p>Você solicitou a redefinição de senha da sua conta.</p>
        <p><a href="${resetLink}">Clique aqui para redefinir sua senha</a></p>
        <p>Este link expira em 30 minutos.</p>
        <p>Se não solicitou esta redefinição, ignore este e-mail.</p>
      `
    })

    return res.status(200).json({ message: 'Link de redefinição enviado para seu e-mail!' })
  } catch (err) {
    console.error('Erro em /api/forgot-password:', err)
    return res.status(500).json({ error: 'Erro ao processar solicitação. Tente novamente mais tarde.' })
  }
})

app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, novaSenha } = req.body

    if (!token || !novaSenha) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' })
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' })
    }

    // Verificar JWT
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Validar que é um token de reset de senha
      if (decoded.type !== 'password-reset') {
        return res.status(400).json({ error: 'Token inválido.' })
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(400).json({ error: 'Token expirado. Solicite um novo link de redefinição.' })
      }
      return res.status(400).json({ error: 'Token inválido.' })
    }

    // Atualizar senha do usuário
    const senhaHash = await bcrypt.hash(novaSenha, 10)

    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ senha_hash: senhaHash })
      .eq('id_usuario', decoded.id)

    if (updateError) {
      console.error('Erro ao atualizar senha:', updateError)
      return res.status(500).json({ error: 'Erro ao redefinir senha.' })
    }

    return res.status(200).json({ message: 'Senha redefinida com sucesso!' })
  } catch (err) {
    console.error('Erro em /api/reset-password:', err)
    return res.status(500).json({ error: 'Erro ao processar redefinição de senha.' })
  }
})

app.post('/salvar', async (req, res) => {
  try {
    const { id_tipo_usuario, nome, email, senha } = req.body

    if (!id_tipo_usuario || !nome || !email || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos.' })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const { error } = await supabase
      .from('usuarios')
      .insert([{
        id_tipo_usuario,
        nome,
        email,
        senha_hash: senhaHash
      }])

    if (error) {
      console.error('Erro ao cadastrar:', error)
      return res.status(500).json({ error: 'Erro ao cadastrar.' })
    }

    return res.json({ message: 'Cadastro realizado!' })
  } catch (err) {
    console.error('Erro em /salvar:', err)
    return res.status(500).json({ error: 'Erro interno no servidor.' })
  }
})

app.get('/buscar', async (req, res) => {
  try {
    const { id_usuario, nome, email } = req.query

    let query = supabase
      .from('usuarios')
      .select('id_usuario, nome, email, telefone, data_cadastro')
      .order('id_usuario', { ascending: false })
      .limit(100)

    if (id_usuario) query = query.eq('id_usuario', id_usuario)
    if (nome) query = query.ilike('nome', `%${nome}%`)
    if (email) query = query.ilike('email', `%${email}%`)

    const { data, error } = await query

    if (error) {
      console.error('Erro na consulta:', error)
      return res.status(500).json({ error: 'Erro na consulta.' })
    }

    return res.json(data)
  } catch (err) {
    console.error('Erro em /buscar:', err)
    return res.status(500).json({ error: 'Erro interno no servidor.' })
  }
})

app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nome, email } = req.body

    if (!nome || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios.' })
    }

    const { error } = await supabase
      .from('usuarios')
      .update({ nome, email })
      .eq('id_usuario', id)

    if (error) {
      console.error('Erro ao atualizar:', error)
      return res.status(500).json({ error: 'Erro ao atualizar.' })
    }

    return res.json({ message: 'Atualizado!' })
  } catch (err) {
    console.error('Erro em PUT /usuarios/:id', err)
    return res.status(500).json({ error: 'Erro interno no servidor.' })
  }
})

// NOVA ROTA PARA LISTAR LOJAS
// Ela retorna todas as lojas ativas da tabela lojas, que hoje contém id_loja, nome_fantasia, descricao, imagem_url, ativo e demais campos.

app.get('/api/lojas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lojas')
      .select('id_loja, nome_fantasia, descricao, imagem_url, slug, ativo')
      .eq('ativo', true)
      .order('id_loja', { ascending: false })

    if (error) {
      console.error('Erro ao buscar lojas:', error)
      return res.status(500).json({ error: 'Erro ao buscar lojas.' })
    }

    return res.json(data || [])
  } catch (err) {
    console.error('Erro em /api/lojas:', err)
    return res.status(500).json({ error: 'Erro interno no servidor.' })
  }
})

// ROTA PARA LISTAR SERVIÇOS DE UMA LOJA
// Ela recebe o slug da loja como parâmetro e retorna os serviços ativos relacionados a essa loja, buscando na tabela serviços onde há id_servico, id_loja, nome_servico, descricao, preco, imagem_url, ativo e demais campos.

app.get('/api/lojas/:slug', async (req, res) => {
  try {
    const { slug } = req.params

    const ID_TIPO_PRODUTO = 1
    const ID_TIPO_SERVICO = 2

    const { data: loja, error: lojaError } = await supabase
      .from('lojas')
      .select('id_loja, nome_fantasia, descricao, imagem_url, slug, ativo')
      .eq('slug', slug)
      .eq('ativo', true)
      .single()

    if (lojaError || !loja) {
      console.error('Erro ao buscar loja:', lojaError)
      return res.status(404).json({ error: 'Loja não encontrada.' })
    }

    const { data: produtos, error: produtosError } = await supabase
      .from('itens')
      .select('id_item, nome, descricao, preco, imagem_url, estoque, duracao_minutos, ativo')
      .eq('id_loja', loja.id_loja)
      .eq('id_tipo_item', ID_TIPO_PRODUTO)
      .eq('ativo', true)
      .order('id_item', { ascending: false })

    if (produtosError) {
      console.error('Erro ao buscar produtos:', produtosError)
      return res.status(500).json({
        error: 'Erro ao buscar produtos.',
        details: produtosError.message
      })
    }

    const { data: servicos, error: servicosError } = await supabase
      .from('itens')
      .select('id_item, nome, descricao, preco, imagem_url, estoque, duracao_minutos, ativo')
      .eq('id_loja', loja.id_loja)
      .eq('id_tipo_item', ID_TIPO_SERVICO)
      .eq('ativo', true)
      .order('id_item', { ascending: false })

    if (servicosError) {
      console.error('Erro ao buscar serviços:', servicosError)
      return res.status(500).json({
        error: 'Erro ao buscar serviços.',
        details: servicosError.message
      })
    }

    return res.json({
      loja,
      produtos: produtos || [],
      servicos: servicos || []
    })
  } catch (err) {
    console.error('Erro em /api/lojas/:slug:', err)
    return res.status(500).json({ error: 'Erro interno no servidor.' })
  }
})

module.exports = app