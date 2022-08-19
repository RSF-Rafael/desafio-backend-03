const knex = require('../../database/connection');

const getTransactionsStatement = async (req, res) => {
    const user = req.user;

    try {
        const overview = await knex('transactions')
            .where({ user_id: user.id })
            .sum('value')
            .select('type')
            .groupBy('type')
            .orderBy('type')

        if (!overview[0]) return res.status(404).json({ message: 'Não foi possível consultar o extrato.' });

        let incoming = overview.filter((item) => item.type === 'entrada');
        incoming = !incoming[0] ? 0 : Number(incoming[0].sum);

        let outgoing = overview.filter((item) => item.type === 'saida');
        outgoing = !outgoing[0] ? 0 : Number(outgoing[0].sum);

        const statement = {
            incoming,
            outgoing
        }
        return res.status(200).json(statement);
    } catch (error) {
        return res.status(400).json({ message: `${error.message}` });
    }
};

module.exports = getTransactionsStatement;