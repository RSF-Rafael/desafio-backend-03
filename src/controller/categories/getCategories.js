const knex = require('../../database/connection');

const getCategories = async (req, res) => {

    try {
        const categories = await knex('categories').orderBy('id');

        if (!categories) return res.status(400).json({ message: 'Nenhuma categoria foi encontrada.' });

        return res.status(200).json(categories);
    } catch (error) {
        return res.status(400).json({ message: `${error.message}` });
    }
};

module.exports = getCategories;