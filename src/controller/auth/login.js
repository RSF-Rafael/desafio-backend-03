const knex = require('../bancodedados/conexao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginSchema = require('../../validations/loginSchema');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        await loginSchema.validate(req.body);

        const user = await knex('users').where({ email }).first();

        if (!user) return res.status(404).json({ message: 'O usuário não foi encontrado.' });

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) return res.status(400).json({ message: 'Email e senha não conferem.' });

        const token = jwt.sign({ id: user.id }, process.env.SENHA_JWT, { expiresIn: '8h' });

        const { password: _, ...userData } = user;

        return res.status(200).json({
            user: userData,
            token
        });
    } catch (error) {
        return res.status(400).json({ message: `${error.message}` });
    }
};

module.exports = login;