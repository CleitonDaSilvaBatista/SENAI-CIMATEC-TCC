const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const senhaCorreta = await bcrypt.compare(senha, data.senha_hash);

  if (!senhaCorreta) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    { id: data.id_usuario },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ success: true, token });
});

router.post('/register', async (req, res) => {
  const { nome, email, senha, id_tipo_usuario } = req.body;

  const hash = await bcrypt.hash(senha, 10);

  const { error } = await supabase.from('usuarios').insert([{
    nome,
    email,
    senha_hash: hash,
    id_tipo_usuario
  }]);

  if (error) return res.status(500).json({ error: 'Erro ao cadastrar' });

  res.json({ success: true });
});

module.exports = router;