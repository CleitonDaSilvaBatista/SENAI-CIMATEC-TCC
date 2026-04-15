const authService = require('../services/auth.service');

async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
}

async function register(req, res) {
  try {
    const result = await authService.register(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
}

function logout(req, res) {
  return res.json({ success: true, message: 'Logout realizado com sucesso.' });
}

module.exports = { login, register, logout };