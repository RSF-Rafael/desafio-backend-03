const conexao = require('../conexao');

const listarCategorias = async (req, res) => {

    try {
        const query = `select * from categorias`;
        const { rows, rowCount } = await conexao.query(query);

        if (rowCount === 0)
            return res.status(404).json({ mensagem: 'Nenhuma categoria foi encontrada.' })

        return res.status(200).json(rows)
    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }
};

module.exports = {
    listarCategorias
}