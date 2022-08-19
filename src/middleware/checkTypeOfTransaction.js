const checkTypeOfTransaction = (req, res, next) => {
    const { type } = req.body;

    if (type !== 'entrada' & type !== 'saida')
        return res.status(400).json({ message: 'O tipo da transação deve ser "entrada" ou "saida"' });
    next()
};

module.exports = checkTypeOfTransaction