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
    login,
    detalharUsuario,
    atualizarUsuario
} = require('./controladores/usuarios');

const { validarCamposObrigatoriosTransacao } = require('./intermediarios/validarCamposObrigatoriosTransacao');
const { validarEntradaOuSaida } = require('./intermediarios/validarEntradaOuSaida');
const { verificarEmail } = require('./intermediarios/verificarEmail');
const { verificarNomeEmailSenha } = require('./intermediarios/verificarNomeEmailSenha');
const { verificarToken } = require('./intermediarios/verificarToken');

const rotas = express();

rotas.post('/login', login);
rotas.post('/usuario', verificarNomeEmailSenha, verificarEmail, cadastrarUsuario);
rotas.get('/usuario', verificarToken, detalharUsuario);
rotas.put('/usuario', verificarToken, verificarNomeEmailSenha, verificarEmail, atualizarUsuario);

rotas.get('/categoria', verificarToken, listarCategorias);

rotas.get('/transacao', verificarToken, listarTransacoesDoUsuario);
rotas.get('/transacao/extrato', verificarToken, obterExtratoTransacoes)
rotas.get('/transacao/:id', verificarToken, detalharTransacao);
rotas.post('/transacao', verificarToken, validarCamposObrigatoriosTransacao, validarEntradaOuSaida, cadastrarTransacao);
rotas.put('/transacao/:id', verificarToken, validarCamposObrigatoriosTransacao, validarEntradaOuSaida, atualizarTransacao);
rotas.delete('/transacao/:id', verificarToken, excluirTransacao);

module.exports = rotas;