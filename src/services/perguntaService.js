const {Pergunta, StatusPergunta, Participante, ParticipantePergunta, Equipe, Categoria} = require('./../models');
const EquipeService = require('./equipeService');
const {Op} = require('sequelize');

class PerguntaService {
    async setResposta(dados, pubsub = null) {
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


            if (pubsub) {
                const  pontuacao =  await EquipeService.getPontuacaoEquipesByPegunta(dados.pergunta_id);
                pubsub.publish('PONTUACAO_EQUIPES_BY_RESPOSTA', {
                    getPontuacaoEquipesByResposta: pontuacao
                });
            }

            return !!result;

        } catch (e) {
            if (transaction) {
                transaction.rollback();
            }
            throw new Error(e);
        }
    }
    async getPrimeiraPerguntaNaoRespondida() {
        try {
            const statusNaoResp = await StatusPergunta.findOne(
                {
                    where: {
                        nome: 'n_respondido',
                    }
                });

            return Pergunta.findOne({
                where: {status_id: statusNaoResp.id},
                include: [
                    {association: 'status'},
                ]
            });
        } catch (e) {
            if (transaction) {
                transaction.rollback();
            }
            throw new Error(e);
        }
    }
}

module.exports = new PerguntaService();