const { Pergunta, ParticipantePergunta, StatusPergunta} = require('./../../../models');
const { Op, Sequelize } = require('sequelize');
const EquipeService = require("./../../../services/equipeService");
const PerguntaService = require("./../../../services/perguntaService");

module.exports = {
    async setResposta(_, {dados}, {pubsub}) {
        return  PerguntaService.setResposta(dados, pubsub);
    },

    async setPerguntaAtual(_, {pergunta}, {pubsub}) {
        let transaction;
        try {
            transaction = await Pergunta.sequelize.transaction();

            await Pergunta.update(
                {pergunta_atual: false},
                {
                    where: {
                        pergunta_atual: true
                    }
                },
                { transaction }
            );

            const result = await Pergunta.update(
                {pergunta_atual: true},
                {
                    where: {
                        id: pergunta
                    }
                },
                { transaction }
            );


            const perguntaAtual =  Pergunta.findOne({
                where: {id: pergunta},
                include: [
                    {association: 'status'},
                ]
            });

            pubsub.publish('NOVA_PERGUNTA_ATUAL', {
                novaPerguntaAtual: perguntaAtual
            });

            await transaction.commit();

            return pergunta;

        } catch (e) {
            if (transaction) {
                transaction.rollback();
            }
            throw new Error(e);
        }
    },

    async setStatusPergunta(_, {pergunta, status}, {pubsub}) {
        let transaction;
        try {
            transaction = await Pergunta.sequelize.transaction();

            const statusPergunta = await StatusPergunta.findOne(
                {
                    where: {nome: status}
                },
                {transaction}
            );

            if (!statusPergunta) {
                throw new Error("Status não encontrado");
            }

            const result = await Pergunta.update(
                {status_id: statusPergunta.id},
                {
                    where: {id: pergunta}
                },
                { transaction }
            );

            if (!result.length) {
                throw new Error("Não foi possível atualizar status da pergunta");
            }


            const perguntaAtual =   PerguntaService.getPrimeiraPerguntaNaoRespondida();

            pubsub.publish('NOVA_PERGUNTA_ATUAL', {
                novaPerguntaAtual: perguntaAtual
            });

            await transaction.commit();

            return pergunta;

        } catch (e) {
            if (transaction) {
                transaction.rollback();
            }
            throw new Error(e);
        }
    }

};
