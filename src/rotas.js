const express = require('express');

const { listarCategorias } = require('./controladores/categorias');

const {
    listarTransacoesDoUsuario,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao,
    obterExtratoTransacoes
} = require('./controladores/transacoes');

const {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
} = require('./controladores/usuarios');

const { login } = require('./controladores/autenticacao');
const { filtroLogin, validarEntradaOuSaida } = require('./intermediarios');

const rotas = express();

rotas.post('/login', login);
rotas.post('/usuario', cadastrarUsuario);

rotas.use(filtroLogin);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);

rotas.get('/categoria', listarCategorias);

rotas.get('/transacao', listarTransacoesDoUsuario);
rotas.get('/transacao/extrato', obterExtratoTransacoes)
rotas.get('/transacao/:id', detalharTransacao);
rotas.post('/transacao', validarEntradaOuSaida, cadastrarTransacao);
rotas.put('/transacao/:id', validarEntradaOuSaida, atualizarTransacao);
rotas.delete('/transacao/:id', excluirTransacao);

module.exports = rotas;