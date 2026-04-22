const authService = require('../services/auth.service')

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body)
    return res.json(result)
  } catch (error) {
    next(error)
  }
}

function logout(req, res) {
  return res.json({
    success: true,
    message: 'Logout realizado no cliente.'
  })
}

function getCurrentUser(req, res) {
  return res.status(400).json({
    logado: false,
    message: 'Sem session no servidor. Controle o login no frontend.'
  })
}

async function forgotPassword(req, res, next) {
  try {
    const result = await authService.forgotPassword(req.body.email)
    return res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

async function resetPassword(req, res, next) {
  try {
    const result = await authService.resetPassword(req.body)
    return res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword
}