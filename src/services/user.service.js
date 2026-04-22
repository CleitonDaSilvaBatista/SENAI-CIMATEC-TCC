const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const supabase = require('../config/database')

async function createUser({ id_tipo_usuario, nome, email, senha }) {
  if (!id_tipo_usuario || !nome || !email || !senha) {
    const err = new Error('Preencha todos os campos.')
    err.statusCode = 400
    throw err
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
    const err = new Error('Erro ao cadastrar.')
    err.statusCode = 500
    throw err
  }

  return { message: 'Cadastro realizado!' }
}

async function updateUser(id, { nome, email }) {
  if (!nome || !email) {
    const err = new Error('Nome e email são obrigatórios.')
    err.statusCode = 400
    throw err
  }

  const { error } = await supabase
    .from('usuarios')
    .update({ nome, email })
    .eq('id_usuario', id)

  if (error) {
    const err = new Error('Erro ao atualizar.')
    err.statusCode = 500
    throw err
  }

  return { message: 'Atualizado!' }
}

async function getUserInfo(authHeader) {
  if (!authHeader) {
    return { logado: false, motivo: 'Sem token' }
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { data, error } = await supabase
      .from('usuarios')
      .select('nome, email')
      .eq('id_usuario', decoded.id)
      .single()

    if (error || !data) {
      return { logado: false, motivo: 'Usuário não encontrado' }
    }

    return {
      logado: true,
      nome: data.nome,
      email: data.email
    }
  } catch (error) {
    return { logado: false, motivo: 'Token inválido ou erro interno' }
  }
}

module.exports = {
  createUser,
  updateUser,
  getUserInfo
}