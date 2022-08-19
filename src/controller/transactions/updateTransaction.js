const knex = require('../../database/connection');

const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const { description, value, date, category_id, type } = req.body;

    try {
        // verificar necessidade de validação dos campos com yup

        // verificar possibilidade de criar um middleware para fazer essa validação, pois há outra função que tbm usa ela.

        const category = await knex('categories')
            .where({ id: category_id })
            .first();

        if (!category) return res.status(404).json({ message: 'Nenhuma categoria foi encontrada para o id informado.' });

        const updatedTransaction = await knex('transactions')
            .update({
                description,
                value,
                date,
                category_id,
                type
            })
            .where({ id, user_id: user.id })
            .returning('*');

        if (!updatedTransaction[0]) return res.status(400).json({ message: 'Não foi possível atualizar a transação.' });

        return res.status(200).json({ message: 'Transação atualizada com sucesso.' });
    } catch (error) {
        return res.status(400).json({ message: `${error.message}` });
    }
};

module.exports = updateTransaction;