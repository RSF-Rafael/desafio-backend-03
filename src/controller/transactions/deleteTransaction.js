const knex = require('../../database/connection');

const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    try {
        const deletedTransaction = await knex('transactions')
            .where({ id, user_id: user.id })
            .del()
            .returning('*');

        if (!deleteTransaction[0]) return res.status(404).json({ message: "Nenhuma transação foi encontrada para esse ID." });

        return res.status(200).json({ message: 'Transação excluída com sucesso.' });
    } catch (error) {
        return res.status(400).json({ message: `${error.message}` });
    }
};

module.exports = deleteTransaction;