const Carga = require('../models/Carga')
const Motorista = require('../models/Motorista')

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.descricao || !valores.peso || !valores.volume || !valores.codRastreio || !valores.idMotorista) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }

    try {
        const motorista = await Motorista.findByPk(valores.idMotorista)
        if (!motorista) {
            return res.status(404).json({ message: 'Motorista informado não existe!' })
        }

        await Carga.create(valores)
        return res.status(201).json({ message: 'Carga cadastrada com sucesso!' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao cadastrar carga!' })
    }
}

const listar = async (req, res) => {
    try {
        const cargas = await Carga.findAll()
        return res.status(200).json(cargas)
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao listar cargas!' })
    }
}

module.exports = { cadastrar, listar }
