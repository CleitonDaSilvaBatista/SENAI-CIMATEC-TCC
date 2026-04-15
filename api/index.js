require('dotenv').config();
const express = require('express');
const path = require('path');

const authRoutes = require('../src/routes/auth.routes');
const userRoutes = require('../src/routes/user.routes');
const passwordRoutes = require('../src/routes/password.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/password', passwordRoutes);

// ROTAS DE PÁGINA (mantidas)
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/home.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/login.html'));
});

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/criarcont.html'));
});

app.get('/produto', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/produto.html'));
});

app.get('/carrinho', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/cart.html'));
});

module.exports = app;