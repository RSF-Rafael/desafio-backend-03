const conexao = require('../conexao');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');

const pwd = securePassword();

function deixarUsuarioSemSenha(usuario) {
    const usuarioSemSenha = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
    }
    return usuarioSemSenha
}

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    console.log(nome);
    console.log(email);
    console.log(senha);

    try {
        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
        const query = `insert into usuarios (nome, email, senha)
        values ($1, $2, $3)`;
        const usuario = await conexao.query(query, [nome, email, hash]);

        if (usuario.rowCount === 0)
            return res.status(400).json('Não foi possivel cadastrar o usuário');

        return res.status(201).json('Usuário cadastrado com sucesso');
    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email) return res.status(400).json({ mensagem: "O campo email é obrigatório." });
    if (!senha) return res.status(400).json({ mensagem: "O campo senha é obrigatório." });

    try {
        const query = `select * from usuarios where email = $1`;
        const usuarioEncontrado = await conexao.query(query, [email]);

        if (usuarioEncontrado.rowCount === 0)
            return res.status(400).json({ mensagem: 'E-mail ou senha incorretos.' });

        const usuario = usuarioEncontrado.rows[0];

        const resultado = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, "hex"));

        switch (resultado) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json({ mensagem: 'E-mail ou senha incorretos.' });
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
                    const query = `update usuarios set senha = $1 where email = $2`;
                    await conexao.query(query, [hash, email]);
                } catch {
                }
                break;
        }
        const usuarioSemSenha = deixarUsuarioSemSenha(usuario);
        const token = jwt.sign({
            ...usuarioSemSenha
        }, 'secret')

        return res.json({ usuario: usuarioSemSenha, token });
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
    login,
    detalharUsuario,
    atualizarUsuario,
    deixarUsuarioSemSenha
};