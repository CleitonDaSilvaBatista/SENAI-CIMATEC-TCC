const authService = require('../../src/services/auth.service')

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'GET') {
    return res.status(405).json({
      error: 'Método não permitido. Use POST para redefinir senha.',
      rota: '/api/auth/reset-password'
    })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
    const result = await authService.resetPassword(body)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Erro ao redefinir senha.'
    })
  }
}
