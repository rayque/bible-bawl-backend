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

            const status = await StatusPergunta.findOne(
                {
                    where: {
                        nome: 'respondido',
                    }
                },
                { transaction });

            const result = await Pergunta.update(
                {
                    pergunta_atual: true,
                    // status_id: status.id
                },
                {
                    where: {
                        id: pergunta
                    }
                },
                { transaction }
            );

            await transaction.commit();

            /* refac */
            const perguntaAtual =  Pergunta.findOne({
                where: {pergunta_atual: 1},
                include: [
                    {association: 'status'},
                ]
            });

            pubsub.publish('NOVA_PERGUNTA_ATUAL', {
                novaPerguntaAtual: perguntaAtual
            });

            return pergunta;

        } catch (e) {
            if (transaction) {
                transaction.rollback();
            }
            throw new Error(e);
        }
    },

    async setStatusPergunta(_, {pergunta, status}) {
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
