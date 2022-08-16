const knex = require('../bancodedados/conexao');
const bcrypt = require('bcrypt');

const listarTransacoesDoUsuario = async (req, res) => {
    const usuario = req.usuario;
    const { filtro } = req.query;

    try {
        const transacoes = await knex('transacoes')
            .leftJoin('categorias', 'transacoes.categoria_id', 'categorias.id')
            .select(
                'transacoes.id',
                'transacoes.tipo',
                'transacoes.descricao',
                'transacoes.valor',
                'transacoes.data',
                'transacoes.usuario_id',
                'transacoes.categoria_id',
                'categorias.descricao as categoria_nome'
            )
            .where({ usuario_id: usuario.id });

        if (transacoes.length === 0)
            return res.status(400).json({ mensagem: 'Nenhuma transação foi localizada.' });

        if (filtro) {
            for (let i = 0; i < filtro.length; i++) {
                filtro[i] = filtro[i].toLowerCase();
            }
            const transacoesFiltradas = [];
            transacoes.filter((item) => {
                if (filtro.includes(item.categoria_nome.toLowerCase()))
                    transacoesFiltradas.push(item);
            })

            return res.status(200).json(transacoesFiltradas);
        }

        return res.status(200).json(transacoes);

    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }
};

const detalharTransacao = async (req, res) => {
    const { id } = req.params;
    const usuario = req.usuario;

    try {
        const transacao = await knex('transacoes')
            .leftJoin('categorias', 'transacoes.categoria_id', 'categorias.id')
            .select(
                'transacoes.id',
                'transacoes.tipo',
                'transacoes.descricao',
                'transacoes.valor',
                'transacoes.data',
                'transacoes.usuario_id',
                'transacoes.categoria_id',
                'categorias.descricao as categoria_nome'
            )
            .where({ usuario_id: usuario.id, 'transacoes.id': id })
            .first();

        if (!transacao)
            return res.status(400).json({ mensagem: 'Transação não localizada.' });

        return res.status(200).json(transacao);
    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }
};

const cadastrarTransacao = async (req, res) => {
    const usuario = req.usuario
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    try {
        //fazer validações com yup

        const categoria = await knex('categorias').where({ id: categoria_id }).first();

        if (!categoria)
            return res.status(400).json('Nenhuma categoria foi encontrada para o id informado.');

        const transacao = await knex('transacoes')
            .insert({
                tipo,
                descricao,
                valor,
                data,
                usuario_id: usuario.id,
                categoria_id
            })
            .returning('*');

        if (!transacao[0])
            return res.status(400).json({ mensagem: 'Não foi possível cadastrar a transação.' });

        transacao[0].categoria_nome = categoria.descricao;

        return res.status(200).json(transacao[0]);
    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }
};

const atualizarTransacao = async (req, res) => {
    const { id } = req.params;
    const { token } = req.headers;
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    let categoria;

    try {
        const query = `select * from categorias where id = $1`;
        categoria = await conexao.query(query, [categoria_id]);

        if (categoria.rowCount === 0)
            return res.status(404).json({ mensagem: "Não foi encontrada nenhuma categoria para o id informado." });
    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }

    try {
        const usuario = jwt.verify(token, 'secret');
        const query = `update transacoes set
        descricao = $1, 
        valor = $2, 
        data = $3, 
        categoria_id = $4, 
        tipo = $5
        where id = $6 and usuario_id = $7`;
        const transacao = await conexao.query(query, [descricao, valor, data, categoria_id, tipo, id, usuario.id]);

        if (transacao.rowCount === 0)
            return res.status(404).json({ mensagem: "Nenhuma transação foi encontrada para esse ID." });

        return res.status(204).json();
    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }
};

const excluirTransacao = async (req, res) => {
    const { id } = req.params;
    const { token } = req.headers;

    try {
        const usuario = jwt.verify(token, 'secret');
        const query = `delete from transacoes where id = $1 and usuario_id = $2`;
        const transacao = await conexao.query(query, [id, usuario.id]);
        if (transacao.rowCount === 0)
            return res.status(404).json({ mensagem: "Nenhuma transação foi encontrada para esse ID." });

        return res.status(204).json();
    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }
};

const obterExtratoTransacoes = async (req, res) => {
    const { token } = req.headers;

    try {
        const usuario = jwt.verify(token, 'secret');
        const query = `select tipo, sum(valor) from transacoes where usuario_id = $1 group by tipo order by tipo`;
        const valores = await conexao.query(query, [usuario.id]);

        if (valores.rowCount === 0)
            return res.status(404).json({ mensagem: "error" });

        let entrada = valores.rows.filter((item) => item.tipo === 'entrada');
        entrada = !entrada[0] ? 0 : Number(entrada[0].sum);
        let saida = valores.rows.filter((item) => item.tipo === 'saida');
        saida = !saida[0] ? 0 : Number(saida[0].sum);

        const extrato = {
            entrada,
            saida
        }

        return res.status(200).json(extrato)
    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }
};

module.exports = {
    listarTransacoesDoUsuario,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao,
    obterExtratoTransacoes
}