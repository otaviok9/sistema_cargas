const express = require('express')
const app = express()
const cors = require('cors')

const PORT = 3000
const hostname = 'localhost'

const conn = require('./db/conn')

require('./models/rel')

const authMiddleware = require('./middleware/auth.middleware')
const authController = require('./controller/auth.controller')
const funcionarioController = require('./controller/funcionario.controller')
const motoristaController = require('./controller/motorista.controller')
const cargaController = require('./controller/carga.controller')
const entregaController = require('./controller/entrega.controller')

// ---middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// Rotas publicas
app.post('/funcionario', funcionarioController.cadastrar)
app.post('/login', authController.login)

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API Logística Express Rodando!' })
})

// Rotas privadas
app.use(authMiddleware)

app.post('/motorista', motoristaController.cadastrar)
app.get('/motoristas', motoristaController.listar)
app.get('/motorista/buscarNome/:nome', motoristaController.consultarNome)
app.get('/motorista/:id', motoristaController.consultar)
app.put('/motorista/:id', motoristaController.atualizar)
app.delete('/motorista/:id', motoristaController.apagar)

app.post('/carga', cargaController.cadastrar)
app.get('/cargas', cargaController.listar)

app.post('/entrega', entregaController.cadastrar)
app.put('/entrega/:id', entregaController.atualizar)
app.get('/entregas', entregaController.listar)

conn.sync()
    .then(() => {
        app.listen(PORT, hostname, () => {
            console.log(`Servidor rodando em http://${hostname}:${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Erro ao conectar com o banco de dados!', err)
    })
