const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const connection = require('../database'); // <-- conexão compartilhada

router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const sql = "SELECT id_usuario, nome, email, senha_hash, id_tipo_usuario FROM usuarios WHERE email = ?";
    connection.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Erro no servidor." });

        if (results.length === 0) {
            return res.status(401).json({ error: "E-mail ou senha incorretos." });
        }

        const usuario = results[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ error: "E-mail ou senha incorretos." });
        }

        // Salvando dados na sessão
        req.session.user = {
            id: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.id_tipo_usuario
        };

        res.json({ success: true, nome: usuario.nome });
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

router.get('/user', (req, res) => {
    if (!req.session.user) {
        return res.json({ logado: false });
    }

    return res.json({
        logado: true,
        nome: req.session.user.nome
    });
});


module.exports = router;
