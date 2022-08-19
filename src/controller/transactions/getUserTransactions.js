const knex = require('../../database/connection');

const getUserTransactions = async (req, res) => {
    const user = req.user;
    const { filtro } = req.query;

    try {
        const transactions = await knex('transactions')
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
            .where({ user_id: user.id });

        // testar essa validação
        if (transactions.length === 0) return res.status(400).json({ message: 'Nenhuma transação foi localizada.' });

        if (filtro) {
            for (let i = 0; i < filtro.length; i++) {
                filtro[i] = filtro[i].toLowerCase();
            }

            const filteredTransactions = [];
            transactions.filter((item) => {
                if (filtro.includes(item.category_name.toLowerCase()))
                    filteredTransactions.push(item);
            })

            return res.status(200).json(filteredTransactions);
        }

        return res.status(200).json(transactions);

    } catch (error) {
        return res.status(400).json({ message: `${error.message}` });
    }
};

module.exports = getUserTransactions;