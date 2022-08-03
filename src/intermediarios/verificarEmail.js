const conexao = require('../conexao');

const verificarEmail = async (req, res, next) => {
    const { email, } = req.body;

    try {
        const query = `select * from usuarios where email = $1`;
        const emailExistente = await conexao.query(query, [email]);

        if (emailExistente.rowCount > 0)
            return res.status(400).json({ mensagem: "Já há um usuário cadastrado para esse e-mail." });
    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }

    next()
};

module.exports = {
    verificarEmail
}