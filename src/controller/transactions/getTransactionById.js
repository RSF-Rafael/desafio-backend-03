const knex = require('../../database/connection');

const getTransactionsById = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    try {
        const transaction = await knex('transactions')
            .leftJoin('categories', 'transactions.category_id', 'categories.id')
            .select(
                'transactions.id',
                'transactions.type',
                'transactions.description',
                'transactions.value',
                'transactions.date',
                'transactions.user_id',
                'transactions.category_id',
                'categories.description as category_name'
            )
            .where({ user_id: user.id, 'transactions.id': id })
            .first();

        if (!transaction) return res.status(400).json({ message: 'Transação não localizada.' });

        return res.status(200).json(transaction);
    } catch (error) {
        return res.status(400).json({ message: `${error.message}` });
    }
};

module.exports = getTransactionsById;