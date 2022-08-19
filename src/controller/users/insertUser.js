const knex = require('../../database/connection');
const bcrypt = require('bcrypt');
const insertUserSchema = require('../../validations/insertUserSchema');

const insertUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        await insertUserSchema.validate(req.body);

        const userExists = await knex('user').where({ email }).first();
        if (userExists) return res.status(400).json({ message: 'O email já existe.' });

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await knex('users')
            .insert({
                name,
                email,
                password: encryptedPassword
            })
            .returning('*');

        if (!user) return res.status(400).json({ message: 'O usuário não foi cadastrado.' });

        return res.status(200).json(user[0]);

    } catch (error) {
        return res.status(400).json({ message: `${error.message}` });
    }
};

module.exports = insertUser;