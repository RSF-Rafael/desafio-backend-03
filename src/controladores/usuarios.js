const knex = require('../bancodedados/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        //inserir validações com yup

        const existeUsuario = await knex('usuarios').where({ email }).first();

        if (existeUsuario)
            return res.status(400).json('O email já existe.');

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuarios')
            .insert({
                nome,
                email,
                senha: senhaCriptografada
            })
            .returning('*');

        if (!usuario)
            return res.status(400).json('O usuário não foi cadastrado.');

        return res.status(200).json(usuario[0]);

    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }
};

const detalharUsuario = async (req, res) => {
    return res.status(200).json(req.usuario);
};

const atualizarUsuario = async (req, res) => {
    let { senha } = req.body;
    const { nome, email } = req.body;
    const { id } = req.usuario;

    if (!nome && !email && !senha)
        return res.status(404).json('É obrigatório informar ao menos um campo para atualização');

    try {
        // await atualizacaoUsuarioSchema.validate(req.body);
        const existeUsuario = await knex('usuarios').where({ id }).first();

        if (!existeUsuario)
            return res.status(404).json('Usuário não encontrado.');

        if (senha)
            senha = await bcrypt.hash(senha, 10);

        if (email && email !== req.usuario.email) {
            const existeEmailUsuario = await knex('usuarios')
                .where({ email })
                .first();

            if (existeEmailUsuario)
                return res.status(404).json('O e-mail já existe.');
        }

        const usuarioAtualizado = await knex('usuarios')
            .where({ id })
            .update({
                nome,
                email,
                senha
            });
        if (!usuarioAtualizado)
            return res.status(400).json("O usuario não foi atualizado");

        return res.status(200).json('Usuario foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }
};

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario,
};