const knex = require('../../database/connection');
const bcrypt = require('bcrypt');
const updateUserSchema = require('../../validations/updateUserSchema');

const updateUser = async (req, res) => {
    let { password } = req.body;
    const { name, email } = req.body;
    const { id } = req.user;

    if (!name && !email && !password) return res.status(404).json({ message: 'É obrigatório informar ao menos um campo para atualização' });

    try {
        await updateUserSchema.validate(req.body);

        const userExists = await knex('users').where({ id }).first();
        if (!userExists) return res.status(404).json({ message: 'Usuário não encontrado.' });

        if (password)
            password = await bcrypt.hash(password, 10);

        if (email && email !== req.user.email) {
            const userEmailExists = await knex('users')
                .where({ email })
                .first();

            if (userEmailExists) return res.status(404).json({ message: 'O email já existe.' });
        }

        const updatedUser = await knex('users')
            .where({ id })
            .update({
                name,
                email,
                password
            })
            .returning('*');

        if (!updatedUser[0]) return res.status(400).json({ message: "O usuario não foi atualizado" });

        return res.status(200).json({ message: 'Usuario foi atualizado com sucesso.' });
    } catch (error) {
        return res.status(400).json({ message: `${error.message}` });
    }
};

module.exports = updateUser;