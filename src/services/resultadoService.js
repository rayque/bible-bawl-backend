const {Pergunta, StatusPergunta, Participante, Equipe, Categoria} = require('./../models');
const EquipeService = require('./equipeService');
const {Op} = require('sequelize');
const R = require('ramda');

class ResultadoService {
    async getResultadoEquipe(nome_categoria) {
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

            const equipes = await Equipe.findAll({
                where: {categoria_id: categoria.id},
                include: [
                    {
                        association: 'participantes',
                        include: [
                            {
                                association: 'perguntas',
                                where: {status_id: statusRespondido.id}
                            }
                        ]
                    },
                ]
            });

            const pontuacoesAndBonusEquipes = await this.getPontuacoesAndBonusEquipes(equipes);
            if (!pontuacoesAndBonusEquipes.length) {
                return [];
            }

            const result = await this.getClassificacao(pontuacoesAndBonusEquipes);

            return result.map(classificacao => {
                return {
                    ...classificacao,
                    acertos_bonus: classificacao.bonus
                }
            })

        } catch (e) {
            throw new Error(e);
        }
    }

    async getResultadoIndividual(nome_categoria) {
        try {
            const categoria = await Categoria.findOne({
                where: {nome: nome_categoria}
            });

            const participantes = await Participante.findAll({
                include: [
                    {
                        association: 'perguntas'
                    },
                    {
                        association: 'equipe',
                        where: {categoria_id: categoria.id}
                    },
                    {
                        association: 'status'
                    }
                ]
            });
            
            const pontuacoesAndAcertosConsecutivos = await this.getPontuacoesIndividual(participantes);
            const result = await this.getClassificacao(pontuacoesAndAcertosConsecutivos);

            return result.map(classificacao => {
                return {
                    ...classificacao,
                    status_participante: classificacao.status,
                    acertos_consecutivos: classificacao.bonus
                }
            });

        } catch (e) {
            throw new Error(e);
        }
    }

    /* Pega a pontuação e acertos de 50 pontos(bonus) de cada equipe */
    async getPontuacoesAndBonusEquipes(equipes) {
        try {
            const qtdPerguntasRespondidas = await this.getQtdPerguntasRespondidas();

            return equipes.map(equipe => {
                let totalPontosEquipe = 0;
                let totalBonosEquipe = 0;

                for (let i = 1; i <= qtdPerguntasRespondidas; i++) {
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
                    bonus: totalBonosEquipe
                };
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    /* Retorna pontuação e acerto consecutivos de cada participante */
    async getPontuacoesIndividual(participantes) {
        try {

            // let participantes = [];
            // participantes.push(foo[0])

            // Array.prototype.insert = function ( index, item ) {
            //     this.splice( index, 0, item );
            // };

            const qtdPerguntasRespondidas = await this.getQtdPerguntasRespondidas();

            return participantes.map(participante => {
                let totalPontosParticipante = 0;
                let contAcertoSequencia = 0;
                let acertosSequencia = [contAcertoSequencia];

                participante.perguntas.forEach(pergunta => {
                    /* conta pontuação participante */
                    totalPontosParticipante += pergunta.ParticipantePergunta.resposta;
                });





                const a = participante.perguntas.map(p => {
                    return parseInt(p.id);
                })


                let maiorDistancia = 0;
                const sequencias = [];
                let ultimaSeq = 0;


                for (let i = 0; i < a.length-1; ++i) {
                    let dist = parseInt(a[i]-a[i+1]); //distancia entre este e o proximo

                    if ((a[i+1] - a[i]) == 1) {
                        contAcertoSequencia++;
                    } else {
                        acertosSequencia.push(contAcertoSequencia);
                        contAcertoSequencia = 0;
                    }

                    // if (dist > maiorDistancia) maiorDistancia = dist; //se maior atualiza
                    // if ((a[i+1] - a[i]) == 1){ //teste para sequencia
                    //     if (sequencias[ultimaSeq] !== undefined){
                    //
                    //         // sequencias[ultimaSeq][] = a[i+1]; //se ja existe uma sequencia acrescente
                    //         // sequencias[ultimaSeq].push(a[i+1])
                    //         sequencias.insert(ultimaSeq, i+1);
                    //     }
                    //     else { //se é uma nova insere os 2 primeiros elementos
                    //         // $sequencias[$ultimaSeq][0] = $a[$i];
                    //         // $sequencias[$ultimaSeq][1] = $a[$i+1];
                    //         sequencias[ultimaSeq].insert(0, i+1);
                    //         sequencias[ultimaSeq].insert(1, a[i+1]);
                    //     }
                    // } else {
                    //     ultimaSeq++;
                    // }
                }


                // console.log(ultimaSeq, sequencias);

                // for (let perguntaId = 1; perguntaId <= qtdPerguntasRespondidas; perguntaId++) {
                //     participante.perguntas.forEach(pergunta => {
                //
                //         /* Conta acertos consecutivos do participante */
                //         if (pergunta.id === perguntaId) {
                //             /* Se acertou a pergunta add ponto em sequência */
                //             if (pergunta.ParticipantePergunta.resposta) {
                //                 contAcertoSequencia++;
                //             } else {
                //                 contAcertoSequencia = 0;
                //             }
                //             acertosSequencia.push(contAcertoSequencia);
                //         }
                //     });
                // }
                console.log(a);
                acertosSequencia = R.uniq(acertosSequencia);
                console.log(acertosSequencia);
                const acertos_consecutivos = Math.max(...acertosSequencia);

                return {
                    id: participante.id,
                    nome: participante.nome,
                    pontuacao: totalPontosParticipante,
                    bonus: acertos_consecutivos,
                    status: {
                    id: participante.status.id,
                        nome: participante.status.nome,
                        descricao: participante.status.descricao
                }
                }
            })
        } catch (e) {
            throw new Error(e);
        }
    }

    async getClassificacao(jogadores) {
        /* Ordena por pontuacao */
        jogadores.sort((a, b) => b.pontuacao - a.pontuacao);

        /* Pegas as pontuações e retorna os valores unicos */
        let pontuacoes = jogadores.map(jogador => jogador.pontuacao);
        pontuacoes = R.uniq(pontuacoes);

        let classificacao = 1;
        let result = pontuacoes.map(pontos => {

            /* Verifica jogadores empatadas */
            const jogadoresEmpatados = jogadores.filter(jogador => jogador.pontuacao === pontos);

            let bonusJogadores = jogadoresEmpatados.map(jogador => jogador.bonus);
            bonusJogadores = R.uniq(bonusJogadores);

            if (jogadoresEmpatados.length > 1) { // Mais de uma equipe com a mesma pontuação
                /* Verifica se todas as equipes tem bonus igual */
                if (bonusJogadores.length === 1) {
                    /* Se tiver bonus igual, equipes recebem a mesma classificação */
                    const dados = jogadoresEmpatados.map(jogadorEmpatado => {
                        return {
                            classificacao,
                            ...jogadorEmpatado
                        }
                    });
                    classificacao++;
                    return dados;
                } else {

                    /* Ordena os acertos consecutivos do maior para o menor */
                    bonusJogadores = R.sort((a, b) => b - a, bonusJogadores);

                    /* Verifica se tem equipes com mesma quantidade de bonus */
                    /* Se houver equipes com mesma pontuação e mesmo bonus, recebem a mesma classificação */
                    return bonusJogadores.map(bonus => {

                        const jogadoresMesmaQtdBonus = jogadoresEmpatados.filter(jogador => {
                            return jogador.bonus === bonus;
                        });

                        if (jogadoresMesmaQtdBonus.length === 1) {
                            return jogadoresMesmaQtdBonus.map(jogadorEmpatado => {
                                const jogador = {
                                    classificacao,
                                    ...jogadorEmpatado
                                };

                                classificacao++;
                                return jogador;
                            });
                        }

                        const dados = jogadoresMesmaQtdBonus.map(jogadorEmpatado => {
                            const jogador = {
                                classificacao,
                                ...jogadorEmpatado
                            };

                            return jogador;
                        });
                        classificacao++;
                        return dados;
                    });
                }

            } else {
                /* Não há empate */
                const dados = jogadoresEmpatados.map(jogadorEmpatado => {
                    return {
                        classificacao,
                        ...jogadorEmpatado
                    }
                });
                classificacao++;
                return dados;
            }
        });

        return R.flatten(result);
    }

    async getQtdPerguntasRespondidas() {
        const perguntas = await Pergunta.findAll({
            include: [
                {
                    association: 'status',
                    where: {nome: 'respondido'}
                },
            ]
        });
        return perguntas.length;
    }
};


module.exports = new ResultadoService();
