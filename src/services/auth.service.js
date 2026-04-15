const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

async function login({ email, senha }) {
  if (!email || !senha) {
    throw { status: 400, message: 'Email e senha são obrigatórios.' };
  }

  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    throw { status: 401, message: 'E-mail ou senha incorretos.' };
  }

  const senhaCorreta = await bcrypt.compare(senha, data.senha_hash);

  if (!senhaCorreta) {
    throw { status: 401, message: 'E-mail ou senha incorretos.' };
  }

  const token = jwt.sign(
    { id: data.id_usuario, email: data.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    success: true,
    token,
    usuario: {
      id: data.id_usuario,
      nome: data.nome,
      email: data.email,
      tipo: data.id_tipo_usuario
    }
  };
}

async function register({ id_tipo_usuario, nome, email, senha }) {
  if (!id_tipo_usuario || !nome || !email || !senha) {
    throw { status: 400, message: 'Preencha todos os campos.' };
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const { error } = await supabase
    .from('usuarios')
    .insert([{
      id_tipo_usuario,
      nome,
      email,
      senha_hash: senhaHash
    }]);

  if (error) {
    throw { status: 500, message: 'Erro ao cadastrar.' };
  }

  return { success: true, message: 'Cadastro realizado!' };
}

module.exports = { login, register };