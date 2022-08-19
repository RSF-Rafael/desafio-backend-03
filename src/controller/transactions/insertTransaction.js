const knex = require('../../database/connection');

const insertTransaction = async (req, res) => {
    const user = req.user
    const { description, value, date, category_id, type } = req.body;

    try {
        const category = await knex('categories').where({ id: category_id }).first();

        if (!category) return res.status(400).json('Nenhuma categoria foi encontrada para o id informado.');

        const transaction = await knex('transactions')
            .insert({
                type,
                description,
                value,
                date,
                user_id: user.id,
                category_id
            })
            .returning('*');

        if (!transaction[0]) return res.status(400).json({ message: 'Não foi possível cadastrar a transação.' });

        transaction[0].category_name = category.description;

        return res.status(200).json(transaction[0]);
    } catch (error) {
        return res.status(400).json({ message: `${error.message}` });
    }
};

module.exports = insertTransaction;