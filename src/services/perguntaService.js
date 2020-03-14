const {Pergunta, StatusPergunta, Participante, ParticipantePergunta, Equipe, Categoria} = require('./../models');
const EquipeService = require('./equipeService');
const {Op} = require('sequelize');

class PerguntaService {
    async setResposta(dados, pubsub = null) {
        let transaction;
        try {
            transaction = await ParticipantePergunta.sequelize.transaction();

            const perguntaAtual = await Pergunta.findOne({
                where: {pergunta_atual: 1}
            });

            if (!perguntaAtual) {
                throw new Error("Não há pergunta disponível para responder");
            }

            if (perguntaAtual.id !== dados.pergunta_id) {
                throw new Error("A pergunta que está tentando responder não é a pergunta atual");
            }

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

    async setPerguntaAtual(pergunta, context) {
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

            context.pubsub.publish('NOVA_PERGUNTA_ATUAL', {
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
}

module.exports = new PerguntaService();