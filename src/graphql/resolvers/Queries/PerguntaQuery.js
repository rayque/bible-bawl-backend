const {Pergunta, StatusPergunta, Respostas, Equipe, Categoria} = require('../../../models');
const EquipeService = require('./../../../services/equipeService');
const ResultadoService = require('./../../../services/resultadoService');
const PerguntaService = require('./../../../services/perguntaService');

module.exports = {
    async getPerguntaAtual() {
        return PerguntaService.getPerguntaAtual();
    },

    async getPrimeiraPerguntaNaoRespondida() {
        let transaction;
        try {
                transaction = await Pergunta.sequelize.transaction();

            const statusNaoResp = await StatusPergunta.findOne(
                {
                    where: {
                        nome: 'n_respondido',
                    }
                });

            const pergunta = Pergunta
                .findOne({
                    where: {status_id: statusNaoResp.id},
                    include: [
                        {association: 'status'},
                    ]
                });


            await Pergunta.update(
                {
                    pergunta_atual: true,
                    id: pergunta.id
                },
                {
                    where: {
                        id: pergunta
                    }
                },
                { transaction }
            );

            return pergunta;

        } catch (e) {
            if (transaction) {
                transaction.rollback();
            }

            throw new Error(e);
        }
    },

    async getperguntasRespondidas() {
        try {
            const statusRep = await StatusPergunta.findAll(
                {
                    where: {
                        nome: 'respondido',
                    }
                }
            );

            return Pergunta
                .findAll({
                        where: {status_id: statusRep[0].id},
                        include: [
                            {association: 'status'},
                        ]
                    }
                )
                .then(perguntas => {
                    if (!perguntas.length) {
                        return [];
                    }

                    return perguntas.map(pergunta => {
                        return {
                            id: pergunta.id,
                            pergunta_atual: pergunta.pergunta_atual,
                            status: {
                                id: pergunta.status.id,
                                nome: pergunta.status.nome,
                                descricao: pergunta.status.descricao,
                            }
                        }
                    });
                })
                .catch(() => {
                    throw new Error('Erro ao buscar perguntas respondidas');
                });
        } catch (e) {
            if (transaction) {
                transaction.rollback();
            }
            throw new Error(e);
        }
    },

    async getResultadoCopa(_, {nome_categoria, tipo}) {
        try {
            if ('equipe' === tipo) {
                return  await ResultadoService.getResultadoEquipe(nome_categoria);
            } else if ('individual' === tipo) {
                return  await ResultadoService.getResultadoIndividual(nome_categoria);
            }

            throw new Error("Tipo incorreto");

        } catch (e) {
            throw new Error(e);
        }
    },


    async getStatusPergunta(_) {
        try {
            return  StatusPergunta.findAll();
        } catch (e) {
            throw new Error(e);
        }
    },

};
