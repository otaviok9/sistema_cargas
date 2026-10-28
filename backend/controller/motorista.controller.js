const Motorista = require('../models/Motorista')
const { Op } = require('sequelize')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const descriptografar = (texto) => {
    return CryptoJS.AES.decrypt(texto, CHAVE_SECRETA).toString(CryptoJS.enc.Utf8)
}

const montar = (el) => {
    return {
        codMotorista: el.codMotorista,
        nome: el.nome,
        cnh: descriptografar(el.cnh),
        cpf: descriptografar(el.cpf),
        telefone: el.telefone
    }
}

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.nome || !valores.cnh || !valores.cpf || !valores.telefone) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }

    if (valores.cpf.length !== 11) {
        return res.status(400).json({ message: 'O CPF deve conter exatamente 11 dígitos!' })
    }

    try {
        await Motorista.create({
            nome: valores.nome,
            cnh: CryptoJS.AES.encrypt(valores.cnh, CHAVE_SECRETA).toString(),
            cpf: CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString(),
            telefone: valores.telefone
        })
        return res.status(201).json({ message: 'Motorista cadastrado com sucesso!' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao cadastrar motorista!' })
    }
}

const listar = async (req, res) => {
    try {
        const motoristas = await Motorista.findAll()
        return res.status(200).json(motoristas.map(montar))
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao listar motoristas!' })
    }
}

const consultar = async (req, res) => {
    const id = req.params.id
    try {
        const motorista = await Motorista.findByPk(id)
        if (!motorista) {
            return res.status(404).json({ message: 'Motorista não encontrado!' })
        }
        return res.status(200).json(montar(motorista))
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao consultar motorista!' })
    }
}

// busca por nome (aceita parte do nome)
const consultarNome = async (req, res) => {
    const nome = req.params.nome
    try {
        const motoristas = await Motorista.findAll({ where: { nome: { [Op.like]: `%${nome}%` } } })
        if (motoristas.length === 0) {
            return res.status(404).json({ message: 'Motorista não encontrado!' })
        }
        return res.status(200).json(motoristas.map(montar))
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao consultar motorista por nome!' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const motorista = await Motorista.findByPk(id)
        if (!motorista) {
            return res.status(404).json({ message: 'Motorista não encontrado!' })
        }

        if (valores.cpf) {
            if (valores.cpf.length !== 11) {
                return res.status(400).json({ message: 'O CPF deve conter exatamente 11 dígitos!' })
            }
            valores.cpf = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        }

        if (valores.cnh) {
            valores.cnh = CryptoJS.AES.encrypt(valores.cnh, CHAVE_SECRETA).toString()
        }

        await Motorista.update(valores, { where: { codMotorista: id } })
        return res.status(200).json({ message: 'Motorista atualizado com sucesso!' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao atualizar motorista!' })
    }
}

const apagar = async (req, res) => {
    const id = req.params.id
    try {
        const motorista = await Motorista.findByPk(id)
        if (!motorista) {
            return res.status(404).json({ message: 'Motorista não encontrado!' })
        }

        await Motorista.destroy({ where: { codMotorista: id } })
        return res.status(200).json({ message: 'Motorista excluído com sucesso!' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao apagar motorista!' })
    }
}

module.exports = { cadastrar, listar, consultar, consultarNome, atualizar, apagar }
