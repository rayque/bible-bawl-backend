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
                return [];
            }
            return await this.getClassificacaoEquipes(pontuacoesAndBonusEquipes);


        } catch (e) {
            throw new Error(e);
        }
    }

    async getResultadoIndividual(nome_categoria) {
        try {
            const categoria = await Categoria.findOne({
                where: {nome: nome_categoria}
            });
            const statusRespondido = await StatusPergunta.findOne(
                {
                    where: {
                        nome: 'respondido',
                    }
                });

            const participantes = await Participante.findAll({
                include: [
                    {
                        association: 'perguntas',
                        where: {status_id: statusRespondido.id}
                    },
                    {
                        association: 'equipe',
                        where: {categoria_id: categoria.id}
                    }
                ]
            });

            const pontuacoesAndAcertosConsecutivos = await this.getPontuacoesIndividual(participantes);
            if (!pontuacoesAndAcertosConsecutivos.length) {
                return [];
            }
            return await this.getClassificacaoIndividual(pontuacoesAndAcertosConsecutivos);

        } catch (e) {
            throw new Error(e);
        }
    }

    /* Pega a pontuação e acertos de 50 pontos(bonus) de cada equipe */
    async getPontuacoesAndBonusEquipes(equipes) {
        return equipes.map(equipe => {
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

    /* Retorna pontuação e acerto consecutivos de cada participante */
    async getPontuacoesIndividual(participantes) {
        return participantes.map(participante => {
            let totalPontosParticipante = 0;
            let acertosSequencia = [];
            let contAcertoSequencia = 0;

            participante.perguntas.forEach(pergunta => {
                /* conta pontuação participante */
                totalPontosParticipante += pergunta.ParticipantePergunta.resposta;
            });

            for (let perguntaId = 1; perguntaId <= 120; perguntaId++) {

                participante.perguntas.forEach(pergunta => {
                    /* Conta acertos consecutivos do participante */
                    if (pergunta.id === perguntaId) {
                        /* Se acertou a pergunta add ponto em sequência */
                        if (pergunta.ParticipantePergunta.resposta) {
                            contAcertoSequencia++;
                        } else {
                            acertosSequencia.push(contAcertoSequencia);
                            contAcertoSequencia = 0;
                        }
                    }
                });
            }

            acertosSequencia = R.uniq(acertosSequencia);
            const acertos_consecutivos = Math.max(...acertosSequencia);

            return {
                id: participante.id,
                nome: participante.nome,
                pontuacao: totalPontosParticipante,
                acertos_consecutivos
            }
        })
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

                    /* Verifica se tem equipes com mesma quantidade de bonus */
                    /* Se houver equipes com mesma pontuação e mesmo bonus, recebem a mesma classificação */
                    return bonusEquipes.map(bonus => {

                        const equipesMesmaQtdBonus = equipesEmpatadas.filter(equipe => {
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

    async getClassificacaoIndividual(participantes) {
        /* Ordena por pontuacao */
        participantes.sort((a, b) => b.pontuacao - a.pontuacao);
        console.clear();
        console.log("-----");
        console.log("++++++");
        console.table(participantes);
        console.log("------------------------------------");

        /* Pegas as pontuações e retorna os valores unicos */
        let pontuacoes = participantes.map(participante => participante.pontuacao);
        pontuacoes = R.uniq(pontuacoes);

        let classificacao = pontuacoes.map((pontos, index) => {
            let classificacao = index + 1;

            /* Verifica participantes empatados */
            const participantesEmpatados = participantes.filter(participante => participante.pontuacao === pontos);
            let acertosConsecutivos = participantesEmpatados.map(participante => participante.acertos_consecutivos);

            acertosConsecutivos = R.uniq(acertosConsecutivos);

            if (participantesEmpatados.length > 1) { // Mais de um participante com a mesma pontuação

                /* Verifica se todos os participantes tem acertos consecutivos igual */
                if (acertosConsecutivos.length === 1) {
                    /* Se tiver bonus igual, participantes recebem a mesma classificação */
                    return participantesEmpatados.map(participanteEmpatado => {

                        return {
                            classificacao,
                            ...participanteEmpatado
                        }
                    });
                } else {
                    // console.log("########");
                    // console.log(pontos);
                    // console.log(participantesEmpatados.length);
                    // console.log(acertosConsecutivos);
                    // console.log("*******");

                    /* ordena os acertos consecutivos do maior para o menor */
                    acertosConsecutivos = R.sort((a, b) => b - a, acertosConsecutivos);

                    /*
                        Verifica se tem participantes com mesma quantidade de acertos consecutivos
                        Se houver participantes com mesma pontuação e mesma quantidade de acertos consecutivos,
                        recebem a mesma classificação
                     */
                    return acertosConsecutivos.map(acertoConsecutivo => {

                        const participantesMesmaQtdAcertosConsecutivos = participantesEmpatados.filter(participante => {
                            return participante.acertos_consecutivos === acertoConsecutivo;
                        });

                        const desempate = participantesMesmaQtdAcertosConsecutivos.map(participante => {
                            const parti = {
                                classificacao,
                                ...participante
                            };
                            classificacao++;
                            return parti;
                        });

                        // classificacao++;
                        return desempate;
                    });
                }

            } else {
                /* se não tiver ordena pelo bonus */
                return participantesEmpatados.map(participante => {
                    return {
                        classificacao,
                        ...participante
                    }
                });
            }

        });

        console.table(R.flatten(classificacao));

        return R.flatten(classificacao);

    }
};


module.exports = new ResultadoService();
