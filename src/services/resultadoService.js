const {Pergunta, StatusPergunta, Participante, Equipe, Categoria} = require('./../models');
const EquipeService = require('./equipeService');
const {Op} = require('sequelize');
const R = require('ramda');

class ResultadoService {
    async getResultadoEquipe(nome_categoria) {
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

            const pontuacoesAndBonusEquipes = await this.getPontuacoesAndBonusEquipes(equipes);
            if (!pontuacoesAndBonusEquipes.length) {
                return  [];
            }
            const classificacao = await this.getClassificacaoEquipes(pontuacoesAndBonusEquipes);


            return  classificacao.map((equipe, index) => {
                return {
                    classificacao: index + 1,
                    ...equipe
                };
            });

        } catch (e) {
            throw new Error(e);
        }
    }

    async getResultadoIndividual(nome_categoria) {
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

            const participantes = await Participante.findAll({
                include: [
                    {
                        association: 'perguntas',
                        where: {status_id: statusRespondido[0].id}
                    },
                    {
                        association: 'equipe',
                        where: {categoria_id: categoria[0].id}
                    }
                ]
            });

            let allParticipantes = participantes.map(participante => {
                let perguntasRespondidas = [];
                let totalPontosParticipante = 0;
                let acertosEmSequencia = [];
                let contAcertosEmSequencia = 0;
                let perguntaAnterior = 0;



                participante.perguntas.forEach(pergunta => {
                    totalPontosParticipante += pergunta.ParticipantePergunta.resposta;
                    perguntasRespondidas.push(pergunta.id);
                });

                const ultimaPerguntaRespondida = perguntasRespondidas.pop()

                participante.perguntas.forEach(pergunta => {
                    if (perguntaAnterior === pergunta.id - 1) {
                        contAcertosEmSequencia++;
                        if (ultimaPerguntaRespondida === pergunta.id ) {
                            contAcertosEmSequencia++;
                        }
                    } else {
                        contAcertosEmSequencia = 0;
                    }

                    if (contAcertosEmSequencia) {
                        acertosEmSequencia.push(contAcertosEmSequencia);
                    }

                    perguntaAnterior = pergunta.id;
                });

                acertosEmSequencia = Math.max(...acertosEmSequencia);
                totalPontosParticipante = EquipeService.getPontosPerguntaIndividualFormatado(totalPontosParticipante);

                return {
                    nome: participante.nome,
                    pontuacao: totalPontosParticipante,
                    acertos_consecutivos: acertosEmSequencia
                };
            });

            if (!allParticipantes.length) {
                return [];
            }

            allParticipantes.sort(function (a, b) {
                return b.pontuacao - a.pontuacao
            });

            /*  Verifica empate */
            const maiorPontucacao = allParticipantes[0].pontuacao;
            const empate = allParticipantes.filter(participante => {
                return participante.pontuacao === maiorPontucacao
            });
            if (empate.length > 1) {
                allParticipantes.sort(function (a, b) {
                    return b.acertos_consecutivos - a.acertos_consecutivos
                });
            }

            allParticipantes = allParticipantes.map((participante, index) => {
                return {
                    classificacao: index + 1,
                    ...participante
                };
            });


            return allParticipantes;

        } catch (e) {
            throw new Error(e);
        }
    }

    /* Pega a pontuação e acertos de 50 pontos(bonus) de cada equipe */
    async getPontuacoesAndBonusEquipes(equipes) {
        return  equipes.map(equipe => {
            let totalPontosEquipe = 0;
            let totalBonosEquipe = 0;

            for (let i = 1; i <= 120; i++) {
                let totalAcertosPergunta = 0;

                equipe.participantes.forEach(participante => {

                    if (participante.perguntas.length) {
                        /* Verifica se o participante acertou esta pergunta */
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

                totalPontosEquipe += EquipeService.getPontosPerguntaEquipeFormatado(totalAcertosPergunta);
            }

            return {
                id: equipe.id,
                nome: equipe.nome,
                pontuacao: totalPontosEquipe,
                acertos_bonus: totalBonosEquipe
            };
        });


    }

    async getClassificacaoEquipes(equipes) {
        /* Ordena por pontuacao */
        equipes.sort((a, b) => b.pontuacao - a.pontuacao);

        /* Pegas as pontuações e retorna os valores unicos */
        let pontuacoes = equipes.map(equipe => equipe.pontuacao);
        pontuacoes = R.uniq(pontuacoes);

        let classificacao = pontuacoes.map((pontos, index) => {
            let classificacao = index + 1;
            /* Verifica equipes empatadas */
            const equipesEmpatadas = equipes.filter(equipe => equipe.pontuacao === pontos);

            let bonusEquipes = equipesEmpatadas.map(equipe => equipe.acertos_bonus);
            bonusEquipes = R.uniq(bonusEquipes);

            if (equipesEmpatadas.length > 1) { // Mais de uma equipe com a mesma pontuação
                /* Verifica se todas as equipes tem bonus igual */
                if (bonusEquipes.length === 1) {
                    /* Se tiver bonus igual, equipes recebem a mesma classificação */
                    return equipesEmpatadas.map(equipeEmpatada => {
                        return {
                            classificacao,
                            ...equipeEmpatada
                        }
                    });
                } else {

                    bonusEquipes = R.uniq(bonusEquipes);
                    /* Verifica se tem equipes com mesma quantidade de bonus */
                    /* Se houver equipes com mesma pontuação e mesmo bonus, recebem a mesma classificação */
                    let equipesEmpatadasMesmoBonus = bonusEquipes.map(bonus => {
                        const equipesMesmaQtdBonus =  equipesEmpatadas.filter(equipe => {
                            return equipe.acertos_bonus === bonus;
                        });
                        return equipesMesmaQtdBonus.map(equipeEmpatada => {
                            const equipe = {
                                classificacao,
                                ...equipeEmpatada
                            };
                            classificacao++;
                            return equipe;
                        });
                    });

                    return equipesEmpatadasMesmoBonus;
                }

            } else {
                /* se não tiver ordena pelo bonus */
                return equipesEmpatadas.map(equipeEmpatada => {
                    return {
                        classificacao,
                        ...equipeEmpatada
                    }
                });
            }

        });

        return R.flatten(classificacao);
    }
};


module.exports = new ResultadoService();
