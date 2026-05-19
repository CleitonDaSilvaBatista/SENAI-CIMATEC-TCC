const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não enviado.' })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token inválido.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
}

function verificarPlano(req, res, next) {
  const plano = req.user?.plano;

  if (!plano) {
    return res.status(403).json({ erro: 'Sem plano' });
  }

  req.plano = plano;
  next();
}

module.exports = authMiddleware