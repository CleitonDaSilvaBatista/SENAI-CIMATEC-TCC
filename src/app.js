const express = require('express')
const path = require('path')

const webRoutes = require('./routes/web.routes')
const authRoutes = require('./routes/auth.routes')
const lojaRoutes = require('./routes/loja.routes')
const itemRoutes = require('./routes/item.routes')
const userRoutes = require('./routes/user.routes')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(process.cwd(), 'src', 'public')))

app.use('/', webRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/lojas', lojaRoutes)
app.use('/api/itens', itemRoutes)
app.use('/api/users', userRoutes)

app.use(errorMiddleware)

module.exports = app