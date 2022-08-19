const express = require('express');

const login = require('./controller/auth/login');

const getCategories = require('./controller/categories/getCategories');

const getUserTransactions = require('./controller/transactions/getUserTransactions');
const getTransactionById = require('./controller/transactions/getTransactionById');
const insertTransaction = require('./controller/transactions/insertTransaction');
const updateTransaction = require('./controller/transactions/updateTransaction');
const deleteTransaction = require('./controller/transactions/deleteTransaction');
const getTransactionsStatement = require('./controller/transactions/getTransactionsStatement');

const insertUser = require('./controller/users/insertUser');
const getUser = require('./controller/users/getUser');
const updateUser = require('./controller/users/updateUser');

const authValidation = require('./middleware/authValidation');
const checkTypeOfTransaction = require('./middleware/checkTypeOfTransaction');

const routes = express();

routes.post('/login', login);
routes.post('/usuario', insertUser);

routes.use(authValidation);

routes.get('/usuario', getUser);
routes.put('/usuario', updateUser);

routes.get('/categoria', getCategories);

routes.get('/transacao', getUserTransactions);
routes.get('/transacao/extrato', getTransactionsStatement)
routes.get('/transacao/:id', getTransactionById);
routes.post('/transacao', checkTypeOfTransaction, insertTransaction);
routes.put('/transacao/:id', checkTypeOfTransaction, updateTransaction);
routes.delete('/transacao/:id', deleteTransaction);

module.exports = routes;