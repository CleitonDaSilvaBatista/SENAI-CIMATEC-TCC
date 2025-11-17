const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 40001;

// ============================================
// CONFIGURAÇÃO DO BANCO DE DADOS
// ============================================
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'cimatec',
  database: 'jobee'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  console.log('✅ Conectado ao banco de dados MySQL.');
});

// ============================================
// CONFIGURAÇÃO DO NODEMAILER (ENV)
// ============================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Testa o login no SMTP
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erro ao verificar SMTP:', error.message);
  } else {
    console.log('📬 Conexão SMTP verificada com sucesso.');
  }
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// ROTAS DE PÁGINAS
// ============================================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/criarcont', (req, res) => res.sendFile(path.join(__dirname, 'public', 'criarcont.html')));
app.get('/buscar', (req, res) => res.sendFile(path.join(__dirname, 'public', 'buscar.html')));
app.get('/sobre', (req, res) => res.sendFile(path.join(__dirname, 'public', 'sobre.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, 'public', 'cart.html')));
app.get('/reset-password', (req, res) => res.sendFile(path.join(__dirname, 'public', 'reset-password.html')));
app.get('/forgot', (req, res) => res.sendFile(path.join(__dirname, 'public', 'forgot.html')));
app.get('/produto', (req, res) => res.sendFile(path.join(__dirname, 'public', 'produto.html')));


// ============================================
// ROTA: ESQUECI MINHA SENHA
// ============================================
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;

  const sql = 'SELECT id_usuario FROM usuarios WHERE email = ?';
  connection.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor.' });
    if (results.length === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });

    const userId = results[0].id_usuario;
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos

    const insertToken = 'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)';
    connection.query(insertToken, [userId, token, expiresAt], (err2) => {
      if (err2) return res.status(500).json({ error: 'Erro ao gerar token.' });

      const resetLink = `http://localhost:${PORT}/reset-password?token=${token}`;
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Redefinição de senha - Jobee',
        text: `\nOlá obrigado por entrar em contato!\nClique no link abaixo para redefinir sua senha:\n\n${resetLink}\n\nEste link expira em 30 minutos.`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erro ao enviar e-mail:', error);
          return res.status(500).json({ error: 'Erro ao enviar e-mail.' });
        }
        console.log('📧 E-mail enviado:', info.response);
        res.json({ message: 'Link de redefinição enviado para seu e-mail!' });
      });
    });
  });
});

// ============================================
// ROTA: REDEFINIR SENHA
// ============================================
app.post('/api/reset-password', async (req, res) => {
  const { token, novaSenha } = req.body;

  const sql = `
    SELECT pr.user_id, pr.expires_at
    FROM password_resets pr
    WHERE pr.token = ?`;

  connection.query(sql, [token], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor.' });
    if (results.length === 0) return res.status(400).json({ error: 'Token inválido.' });

    const { user_id, expires_at } = results[0];
    if (new Date(expires_at) < new Date()) {
      return res.status(400).json({ error: 'Token expirado.' });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);

    const updateUser = 'UPDATE usuarios SET senha_hash = ? WHERE id_usuario = ?';
    connection.query(updateUser, [senhaHash, user_id], (err2) => {
      if (err2) return res.status(500).json({ error: 'Erro ao atualizar senha.' });

      connection.query('DELETE FROM password_resets WHERE token = ?', [token]);
      res.json({ message: 'Senha redefinida com sucesso!' });
    });
  });
});

// ============================================
// CADASTRO DE USUÁRIO
// ============================================
app.post('/salvar', async (req, res) => {
  try {
    const { id_tipo_usuario, nome, email, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    const sql = 'INSERT INTO usuarios (id_tipo_usuario, nome, email, senha_hash) VALUES (?, ?, ?, ?)';
    connection.query(sql, [id_tipo_usuario, nome, email, senhaHash], (err) => {
      if (err) {
        console.error('❌ Erro ao inserir dados:', err);
        return res.status(500).send('Erro ao processar o cadastro.');
      }
      console.log('✅ Usuário cadastrado com sucesso!');
      res.send('✅ Cadastro realizado com sucesso!');
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).send('Erro interno do servidor.');
  }
});

// ============================================
// BUSCA DE USUÁRIOS
// ============================================
app.get('/api/buscar', (req, res) => {
  const { id_usuario, nome, email } = req.query;
  let sql = 'SELECT id_usuario, nome, email, telefone, data_cadastro FROM jobee.usuarios WHERE 1=1';
  const params = [];

  if (id_usuario) { sql += ' AND id_usuario = ?'; params.push(id_usuario); }
  if (nome) { sql += ' AND nome LIKE ?'; params.push(`%${nome}%`); }
  if (email) { sql += ' AND email LIKE ?'; params.push(`%${email}%`); }

  sql += ' ORDER BY id_usuario DESC LIMIT 100';

  connection.query(sql, params, (err, rows) => {
    if (err) {
      console.error('❌ Erro na consulta:', err);
      return res.status(500).json({ error: 'Erro na consulta.' });
    }
    res.json(rows);
  });
});

// ============================================
// ATUALIZAR USUÁRIO POR ID
// ============================================
app.put('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  const sql = 'UPDATE usuarios SET nome = ?, email = ? WHERE id_usuario = ?';
  connection.query(sql, [nome, email, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });

    res.json({ message: 'Usuário atualizado com sucesso!' });
  });
});

// ============================================
// 404
// ============================================
app.use((req, res) => {
  res.status(404).send('<h1>404 - Página não encontrada</h1><a href="/">Voltar para Home</a>');
});

// ============================================
// INICIA O SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});
