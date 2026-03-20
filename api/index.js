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

const authRoutes = require('./routes/auth')
app.use('/', authRoutes)

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'home.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'login.html'))
})


app.get('/testejwt', (req, res) => {
  res.json({ secret: process.env.JWT_SECRET ? 'OK' : 'ERRO' })
})

app.get('/teste', (req, res) => {
  res.status(200).json({ funcionando: true })
})

app.get('/testedbjobee', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Erro Supabase:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.json({ status: 'ok', data })
  } catch (err) {
    console.error('Erro /testedbjobee:', err)
    return res.status(500).json({ error: 'Erro interno no servidor.' })
  }
})
app.get('/testeinsertjobee', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          id_tipo_usuario: 1,
          nome: 'Usuário Teste',
          email: 'teste@email.com',
          senha_hash: await bcrypt.hash('123456', 10)
        }
      ])
      .select()

    if (error) {
      console.error('Erro ao inserir:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.json({ message: 'Inserido com sucesso!', data })
  } catch (err) {
    console.error('Erro em /testeinsertjobee:', err)
    return res.status(500).json({ error: 'Erro interno no servidor.' })
  }
})

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'E-mail é obrigatório.' })
    }

    const { data: user, error: userError } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString()

    const { error: insertError } = await supabase
      .from('password_resets')
      .insert([{
        user_id: user.id_usuario,
        token,
        expires_at: expiresAt
      }])

    if (insertError) {
      console.error('Erro ao salvar token:', insertError)
      return res.status(500).json({ message: 'Erro ao gerar token.' })
    }

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Redefinição de senha',
      text: resetLink
    })

    return res.json({ message: 'Link enviado!' })
  } catch (err) {
    console.error('Erro em /forgot-password:', err)
    return res.status(500).json({ message: 'Erro interno no servidor.' })
  }
})

app.post('/reset-password', async (req, res) => {
  try {
    const { token, novaSenha } = req.body

    if (!token || !novaSenha) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' })
    }

    const { data, error } = await supabase
      .from('password_resets')
      .select('*')
      .eq('token', token)
      .single()

    if (error || !data) {
      return res.status(400).json({ error: 'Token inválido.' })
    }

    if (new Date(data.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Token expirado.' })
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10)

    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ senha_hash: senhaHash })
      .eq('id_usuario', data.user_id)

    if (updateError) {
      console.error('Erro ao atualizar senha:', updateError)
      return res.status(500).json({ error: 'Erro ao atualizar senha.' })
    }

    await supabase
      .from('password_resets')
      .delete()
      .eq('token', token)

    return res.json({ message: 'Senha redefinida!' })
  } catch (err) {
    console.error('Erro em /reset-password:', err)
    return res.status(500).json({ error: 'Erro interno no servidor.' })
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

module.exports = app