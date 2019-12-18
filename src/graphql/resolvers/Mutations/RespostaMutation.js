const { Pergunta, ParticipantePergunta, StatusPergunta} = require('./../../../models');
const { Op, Sequelize } = require('sequelize');
const EquipeService = require("./../../../services/equipeService")

module.exports = {
    async setResposta(_, {dados}) {
        let transaction;
        try {
            transaction = await ParticipantePergunta.sequelize.transaction();

            await ParticipantePergunta.findOrCreate(
                {
                    where: {
                        participante_id: dados.participante_id,
                        pergunta_id: dados.pergunta_id
                    }
                }
            );

            const result = await ParticipantePergunta.update(
                {resposta: dados.resposta},
                {
                    where: {
                        participante_id: dados.participante_id,
                        pergunta_id: dados.pergunta_id
                    }
                },
                { transaction }
            );


            await transaction.commit();


            const  pontuacao =  await EquipeService.getPontuacaoEquipesByPegunta(dados.pergunta_id);

            console.log(pontuacao);


            return !!result;

        } catch (e) {
            if (transaction) {
                transaction.rollback();
            }
            throw new Error(e);
        }
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
