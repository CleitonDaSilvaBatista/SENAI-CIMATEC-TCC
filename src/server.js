require('dotenv').config()
const app = require('./app')

const PORT = process.env.PORT || 3000

// Em produção/serverless (Vercel), o app precisa ser exportado.
// Localmente, quando rodar `npm start` ou `npm run dev`, ele inicia o servidor normalmente.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
  })
}

module.exports = app
