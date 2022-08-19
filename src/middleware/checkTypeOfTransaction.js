const checkTypeOfTransaction = (req, res, next) => {
    if (type !== 'entrada' & type !== 'saida')
        return res.status(400).json({ message: 'O tipo da transação deve ser "entrada" ou "saida"' });
    next()
};

module.exports = checkTypeOfTransaction