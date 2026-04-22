const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const supabase = require('../config/database')
const emailService = require('./email.service')

async function login({ email, senha }) {
  if (!email || !senha) {
    const error = new Error('Email e senha são obrigatórios.')
    error.statusCode = 400
    throw error
  }

  const { data: user, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    const err = new Error('E-mail ou senha incorretos.')
    err.statusCode = 401
    throw err
  }

  const senhaCorreta = await bcrypt.compare(senha, user.senha_hash)

  if (!senhaCorreta) {
    const err = new Error('E-mail ou senha incorretos.')
    err.statusCode = 401
    throw err
  }

  const token = jwt.sign(
    {
      id: user.id_usuario,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  return {
    success: true,
    token,
    usuario: {
      id: user.id_usuario,
      nome: user.nome,
      email: user.email,
      tipo: user.id_tipo_usuario
    }
  }
}

async function forgotPassword(email) {
  if (!email) {
    const err = new Error('E-mail é obrigatório.')
    err.statusCode = 400
    throw err
  }

  const { data: user, error } = await supabase
    .from('usuarios')
    .select('id_usuario, email')
    .eq('email', email)
    .single()

  if (error || !user) {
    const err = new Error('Usuário não encontrado.')
    err.statusCode = 404
    throw err
  }

  const resetToken = jwt.sign(
    { id: user.id_usuario, email: user.email, type: 'password-reset' },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  )

  await emailService.sendResetPasswordEmail(user.email, resetToken)

  return { message: 'Link de redefinição enviado para seu e-mail!' }
}

async function resetPassword({ token, novaSenha }) {
  if (!token || !novaSenha) {
    const err = new Error('Token e nova senha são obrigatórios.')
    err.statusCode = 400
    throw err
  }

  if (novaSenha.length < 6) {
    const err = new Error('A senha deve ter pelo menos 6 caracteres.')
    err.statusCode = 400
    throw err
  }

  let decoded

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.type !== 'password-reset') {
      const err = new Error('Token inválido.')
      err.statusCode = 400
      throw err
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const err = new Error('Token expirado. Solicite um novo link de redefinição.')
      err.statusCode = 400
      throw err
    }

    if (!error.statusCode) {
      const err = new Error('Token inválido.')
      err.statusCode = 400
      throw err
    }

    throw error
  }

  const senhaHash = await bcrypt.hash(novaSenha, 10)

  const { error: updateError } = await supabase
    .from('usuarios')
    .update({ senha_hash: senhaHash })
    .eq('id_usuario', decoded.id)

  if (updateError) {
    const err = new Error('Erro ao redefinir senha.')
    err.statusCode = 500
    throw err
  }

  return { message: 'Senha redefinida com sucesso!' }
}

module.exports = {
  login,
  forgotPassword,
  resetPassword
}