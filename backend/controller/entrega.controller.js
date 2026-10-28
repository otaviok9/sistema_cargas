const Entrega = require('../models/Entrega')
const Carga = require('../models/Carga')

const STATUS = ['ENTREGUE', 'TRANSITO']

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.cidadeDestino || !valores.status || !valores.data || !valores.hora || !valores.idCarga) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }

    if (!STATUS.includes(valores.status)) {
        return res.status(400).json({ message: 'Status deve ser ENTREGUE ou TRANSITO!' })
    }

    try {
        const carga = await Carga.findByPk(valores.idCarga)
        if (!carga) {
            return res.status(404).json({ message: 'Carga informada não existe!' })
        }

        await Entrega.create(valores)
        return res.status(201).json({ message: 'Entrega cadastrada com sucesso!' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao cadastrar entrega!' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    if (!STATUS.includes(valores.status)) {
        return res.status(400).json({ message: 'Status deve ser ENTREGUE ou TRANSITO!' })
    }

    try {
        const entrega = await Entrega.findByPk(id)
        if (!entrega) {
            return res.status(404).json({ message: 'Entrega não encontrada!' })
        }

        await Entrega.update({ status: valores.status }, { where: { codEntrega: id } })
        return res.status(200).json({ message: 'Status da entrega atualizado com sucesso!' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao atualizar entrega!' })
    }
}

//aq é o  filtro: /entregas (mais antigas primeiro) ou DESC (mais recentes primeiro)
const listar = async (req, res) => {
    const ordem = req.query.ordem === 'DESC' ? 'DESC' : 'ASC'

    try {
        const entregas = await Entrega.findAll({ order: [['data', ordem], ['hora', ordem]] })
        return res.status(200).json(entregas)
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao listar entregas!' })
    }
}

module.exports = { cadastrar, atualizar, listar }
