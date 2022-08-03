const jwt = require('jsonwebtoken');

const verificarToken = async (req, res, next) => {
    const { token } = req.headers;

    try {
        const usuario = jwt.verify(token, 'secret');
        next();
    } catch {
        return res.status(400).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    }
};

module.exports = {
    verificarToken
}