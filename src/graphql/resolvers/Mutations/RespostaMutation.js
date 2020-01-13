const { Pergunta, ParticipantePergunta, StatusPergunta} = require('./../../../models');
const { Op, Sequelize } = require('sequelize');
const EquipeService = require("./../../../services/equipeService");
const PerguntaService = require("./../../../services/perguntaService");

module.exports = {
    async setResposta(_, {dados}, {pubsub}) {
        return  PerguntaService.setResposta(dados, pubsub);
    },

    async setPerguntaAtual(_, {pergunta}, {pubsub}) {
        console.clear();
        console.log(pergunta)
        console.log()
        console.log()
        console.log()

        console.log("=========");
        let transaction;
        try {
            transaction = await Pergunta.sequelize.transaction();

            await Pergunta.update(
                {pergunta_atual: false},
                {
                    where: {
                        pergunta_atual: true
                    }
                }
            );

            await Pergunta.update(
                {
                    pergunta_atual: true,
                },
                {
                    where: {
                        id: pergunta
                    }
                },
                { transaction }
            );
            console.log()
            console.log("----------    1 ---------- ");
            console.log()

            await transaction.commit();

            const perguntaAtual = await PerguntaService.getPerguntaAtual();
            console.log()
            console.log("----------    2   ---------- ");
            console.log()

            // console.log(perguntaAtual);


            pubsub.publish('NOVA_PERGUNTA_ATUAL', {
                novaPerguntaAtual: perguntaAtual
            });

            console.log()

            console.log("----------    3   ---------- ");
            console.log()

            return pergunta;

        } catch (e) {
            if (transaction) {
                transaction.rollback();
            }
            console.log("----------    4   ---------- ");

            console.log(e);
            throw new Error(e);
        }
    },

    async setStatusPergunta(_, {pergunta_id, status_name}) {
        let transaction;
        try {
            transaction = await Pergunta.sequelize.transaction();

            const status = await StatusPergunta.findOne(
                {
                    where: {
                        nome: status_name,
                    }
                },
                { transaction });

            const result = await Pergunta.update(
                {
                    status_id: status.id
                },
                {
                    where: {id: pergunta_id}
                },
                { transaction }
            );

            await transaction.commit();

            return result.length;
        } catch (e) {
            if (transaction) {
                transaction.rollback();
            }
            throw new Error(e);
        }
    }

};
