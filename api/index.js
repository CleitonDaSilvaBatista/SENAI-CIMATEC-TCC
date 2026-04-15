const express = require('express');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const passwordRoutes = require('./routes/password.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/pages/home.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/pages/login.html'));
});

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/pages/criarcont.html'));
});

app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/pages/forgot.html'));
});

app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/pages/reset-password.html'));
});

app.get('/produto', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/pages/produto.html'));
});

app.get('/carrinho', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/pages/cart.html'));
});

module.exports = app;