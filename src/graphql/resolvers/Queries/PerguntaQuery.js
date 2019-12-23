const {Pergunta, StatusPergunta, Respostas, Equipe, Categoria} = require('../../../models');
const EquipeService = require('./../../../services/equipeService');

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
            const categoria = await Categoria.findAll({
                where: {nome: nome_categoria}
            });
            const statusRespondido = await StatusPergunta.findAll(
                {
                    where: {
                        nome: 'respondido',
                    }
                });
            /*
            todo
            add where status respondido
            * */
            const equipes = await Equipe.findAll({
                where: {categoria_id: categoria[0].id},
                include: [
                    {
                        association: 'participantes',
                        include: [
                            {
                                association: 'perguntas',
                                where: {status_id: statusRespondido[0].id}

                            }
                        ]
                    },
                ]
            });

            let allEquipes = equipes.map(equipe => {
                let totalPontosEquipe = 0;
                let totalBonosEquipe = 0;


                for (let i = 1; i <= 120; i++) {
                    let totalAcertosPergunta = 0;

                    equipe.participantes.forEach(participante => {

                        if (participante.perguntas.length) {
                            const pergunta = participante.perguntas.filter(pergunta => {
                                return pergunta.id === i;
                            });
                            if (pergunta.length) {
                                totalAcertosPergunta += pergunta[0].ParticipantePergunta.resposta;
                            }
                        }
                    });

                    const hasBonus = EquipeService.hasBonus(totalAcertosPergunta);
                    if (hasBonus) {
                        totalBonosEquipe++;
                    }

                    totalPontosEquipe += EquipeService.getPontosPerguntaFormatado(totalAcertosPergunta);
                }

                return {
                    nome: equipe.nome,
                    pontuacao: totalPontosEquipe,
                    acertos_50_pontos: totalBonosEquipe
                };

            });

            allEquipes.sort(function(a, b){return b.pontuacao - a.pontuacao });

            /*  Verifica empate */
            const maiorPontucacao = allEquipes[0].pontuacao;
            const empate = allEquipes.filter(equipe => {
                return equipe.pontuacao  === maiorPontucacao
            });

            if (empate.length > 1) {
                allEquipes.sort(function(a, b){return b.acertos_50_pontos - a.acertos_50_pontos });
            }

            allEquipes = allEquipes.map((equipe, index) => {
                return {
                    classificacao: index+1,
                    ...equipe
                };
            });

            return allEquipes;
        } catch (e) {
            throw new Error(e);
        }

    }

};
