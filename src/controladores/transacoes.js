const knex = require('../bancodedados/conexao');

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
    const usuario = req.usuario;
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    try {
        // fazer validação com yup

        const categoria = await knex('categorias')
            .where({ id: categoria_id })
            .first();


        if (!categoria)
            return res.status(404).json({ mensagem: 'Nenhuma categoria foi encontrada para o id informado.' });

        const transacaoAtualizada = await knex('transacoes')
            .update({
                descricao,
                valor,
                data,
                categoria_id,
                tipo
            })
            .where({ id, usuario_id: usuario.id })
            .returning('*');

        if (!transacaoAtualizada[0])
            return res.status(400).json({ mensagem: 'Não foi possível atualizar a transação.' });

        return res.status(200).json({ mensagem: 'Transação atualizada com sucesso.' });
    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }
};

const excluirTransacao = async (req, res) => {
    const { id } = req.params;
    const usuario = req.usuario;

    try {
        const transacaoExcluida = await knex('transacoes')
            .where({ id, usuario_id: usuario.id })
            .del()
            .returning('*');

        if (!transacaoExcluida[0])
            return res.status(404).json({ mensagem: "Nenhuma transação foi encontrada para esse ID." });

        return res.status(200).json({ mensagem: 'Transação excluída com sucesso.' });
    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` });
    }
};

const obterExtratoTransacoes = async (req, res) => {
    const usuario = req.usuario;

    try {
        const extrato = await knex('transacoes')
            .where({ usuario_id: usuario.id })
            .sum('valor')
            .select('tipo')
            .groupBy('tipo')
            .orderBy('tipo')

        if (!extrato[0])
            return res.status(404).json({ mensagem: 'Não foi possível consultar o extrato.' });

        let entrada = extrato.filter((item) => item.tipo === 'entrada');
        entrada = !entrada[0] ? 0 : Number(entrada[0].sum);

        let saida = extrato.filter((item) => item.tipo === 'saida');
        saida = !saida[0] ? 0 : Number(saida[0].sum);

        const resumoExtrato = {
            entrada,
            saida
        }
        return res.status(200).json(resumoExtrato)
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