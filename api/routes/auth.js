const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()

const jwt = require('jsonwebtoken')

const supabase = require('../../database')

// ============================
// LOGIN
// ============================
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' })
    }

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !data) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' })
    }

    const senhaCorreta = await bcrypt.compare(senha, data.senha_hash)

    if (!senhaCorreta) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' })
    }

   // JWT
    const token = jwt.sign(
      {
        id: data.id_usuario,
        email: data.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    return res.json({
      success: true,
      token,
      usuario: {
        id: data.id_usuario,
        nome: data.nome,
        email: data.email,
        tipo: data.id_tipo_usuario
      }
    })

  } catch (err) {
    console.error('Erro no login:', err)
    return res.status(500).json({ error: 'Erro interno no servidor.' })
  }
})

// ============================
// LOGOUT
// ============================
router.get('/logout', (req, res) => {
  return res.json({ success: true, message: 'Logout realizado no cliente.' })
})

// ============================
// VER USUÁRIO LOGADO
// ============================
router.get('/user', (req, res) => {
  return res.status(400).json({
    logado: false,
    message: 'Sem session no servidor. Controle o login no frontend.'
  })
})

module.exports = router