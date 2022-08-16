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
    const { token } = req.headers;

    const usuario = jwt.verify(token, 'secret');

    try {
        const query = `select * from usuarios where id = $1`;
        const { rows, rowCount } = await conexao.query(query, [usuario.id]);

        if (rowCount === 0)
            return res.status(404).json({ mensagem: 'Nenhum usuário foi encontrado.' })

        return res.status(200).json(deixarUsuarioSemSenha(rows[0]))
    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }
};

const atualizarUsuario = async (req, res) => {
    const { token } = req.headers;
    const { nome, email, senha } = req.body;

    const usuario = jwt.verify(token, 'secret');
    const id = usuario.id;

    try {
        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
        const query = `update usuarios set
        nome = $1,
        email = $2,
        senha = $3
        where id = $4`;
        const usuario = await conexao.query(query, [nome, email, hash, id]);

        if (usuario.rowCount === 0)
            return res.status(400).json({ mensagem: 'Não foi possivel atualizar o usuário' });

        const token = jwt.sign({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }, 'secret');

        return res.status(200).json(token);
    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }
};

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario,
};