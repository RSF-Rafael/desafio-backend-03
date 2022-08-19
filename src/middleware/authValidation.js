const knex = require('../database/connection');
const jwt = require('jsonwebtoken');

const authValidation = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json({ message: 'Não autorizado' });

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, process.env.SENHA_JWT);

        const userExists = await knex('users').where({ id }).first();
        if (!userExists) return res.status(404).json({ message: 'Usuario não encontrado.' });

        const { password, ...user } = userExists;
        req.user = user;
        next();
    } catch {
        return res.status(400).json({ message: "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    }
};

module.exports = authValidation;