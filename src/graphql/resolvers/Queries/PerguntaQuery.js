const {Pergunta, StatusPergunta} = require('../../../models');

module.exports = {
    getPerguntaAtual() {
        return Pergunta
            .findAll({where: {pergunta_atual: 1}})
            .then(perguntas => {
                if (!perguntas.length) {
                    return 0;
                }

                return perguntas[0].id;
            })
            .catch(() => {
                throw new Error('Erro ao buscar pergunta atual');
            });
    },
    async getPrimeiraPerguntaNaoRespondida() {
        try {
        const statusNaoResp = await StatusPergunta.findAll(
            {
                where: {
                    nome: 'n_respondido',
                }
            });

        return Pergunta
            .findAll({where: {status_id: statusNaoResp[0].id}})
            .then(perguntas => {
                if (!perguntas.length) {
                    return 0;
                }

                return perguntas[0].id;
            })
            .catch(() => {
                throw new Error('Erro ao buscar primeira pergunta não respondida');
            });
        } catch (e) {
            if (transaction) {
                transaction.rollback();
            }
            throw new Error(e);
        }
    },
};
