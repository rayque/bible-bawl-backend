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

            const status = await StatusPergunta.findAll(
                {
                    where: {
                        nome: 'respondido',
                    }
                },
                { transaction });

            const result = await Pergunta.update(
                {
                    pergunta_atual: true,
                    status_id: status[0].id
                },
                {
                    where: {
                        id: pergunta
                    }
                },
                { transaction }
            );

            await transaction.commit();

            pubsub.publish('NOVA_PERGUNTA_ATUAL', {
                novaPerguntaAtual: pergunta
            });

            return pergunta;

        } catch (e) {
            if (transaction) {
                transaction.rollback();
            }
            throw new Error(e);
        }
    }
};
