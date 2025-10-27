const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 40001;

app.use(express.static(path.join(__dirname, 'public')));

//Rota Home (Raiz)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'home.html'));
});

//Rota Contato
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

//Rota Sobre
app.get('/cursos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cursos.html'));
});

//Rota Sobre
app.get('/sobre', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sobre.html'));
});

//ERRO 404
app.use((req, res) => {
    res.status(404).send('<h1> 404 - Página não encontrada</h1> <p><a href="/">Voltar para Home</a></p>');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});