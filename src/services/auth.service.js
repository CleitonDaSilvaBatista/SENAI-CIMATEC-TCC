const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const supabase = require('../config/database')
const { createClient } = require('@supabase/supabase-js')
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

function getOAuthConfig() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const err = new Error('Configure SUPABASE_URL e SUPABASE_ANON_KEY nas variáveis de ambiente.')
    err.statusCode = 500
    throw err
  }

  return {
    supabaseUrl,
    supabaseAnonKey
  }
}

async function loginWithGoogle({ accessToken }) {
  if (!accessToken) {
    const err = new Error('Token do Google/Supabase não enviado.')
    err.statusCode = 400
    throw err
  }

  const { supabaseUrl, supabaseAnonKey } = getOAuthConfig()
  const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey)

  const { data: authData, error: authError } = await supabaseAuth.auth.getUser(accessToken)

  if (authError || !authData?.user?.email) {
    const err = new Error('Login com Google inválido ou expirado.')
    err.statusCode = 401
    throw err
  }

  const googleUser = authData.user
  const email = googleUser.email
  const nome =
    googleUser.user_metadata?.full_name ||
    googleUser.user_metadata?.name ||
    email.split('@')[0]

  const { data: usuarioExistente } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .maybeSingle()

  let usuario = usuarioExistente

  if (!usuario) {
    const senhaHash = await bcrypt.hash(`google-oauth-${googleUser.id}`, 10)

    const { data: novoUsuario, error: createError } = await supabase
      .from('usuarios')
      .insert([{
        id_tipo_usuario: 1,
        nome,
        email,
        senha_hash: senhaHash,
        ativo: true
      }])
      .select('*')
      .single()

    if (createError || !novoUsuario) {
      const err = new Error('Erro ao criar usuário pelo Google.')
      err.statusCode = 500
      throw err
    }

    usuario = novoUsuario
  }

  const token = jwt.sign(
    {
      id: usuario.id_usuario,
      email: usuario.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  return {
    success: true,
    token,
    usuario: {
      id: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.id_tipo_usuario
    }
  }
}

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  getOAuthConfig,
  loginWithGoogle
}