const Funcionario = require('../models/Funcionario')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.nome || !valores.email || !valores.senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }

    try {
        await Funcionario.create({
            nome: valores.nome,
            email: valores.email,
            senha: CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()
        })
        return res.status(201).json({ message: 'Funcionário cadastrado com sucesso!' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao cadastrar funcionário!' })
    }
}

module.exports = { cadastrar }
