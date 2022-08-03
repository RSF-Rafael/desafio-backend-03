const validarCamposObrigatoriosTransacao = (req, res, next) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    if (!descricao || !valor || !data || !categoria_id || !tipo)
        return res.status(400).json({ mensagem: "Informe todos os campos obrigatórios: descrição, valor, data, categoria_id, tipo." });

    next()
};

module.exports = {
    validarCamposObrigatoriosTransacao
}