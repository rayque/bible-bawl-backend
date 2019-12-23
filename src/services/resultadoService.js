const {Pergunta, StatusPergunta, Participante, Equipe, Categoria} = require('./../models');
const EquipeService = require('./equipeService');
const {Op} = require('sequelize');

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

                    totalPontosEquipe += EquipeService.getPontosPerguntaEquipeFormatado(totalAcertosPergunta);
                }

                return {
                    nome: equipe.nome,
                    pontuacao: totalPontosEquipe,
                    acertos_50_pontos: totalBonosEquipe
                };

            });

            allEquipes.sort(function (a, b) {
                return b.pontuacao - a.pontuacao
            });

            /*  Verifica empate */
            const maiorPontucacao = allEquipes[0].pontuacao;
            const empate = allEquipes.filter(equipe => {
                return equipe.pontuacao === maiorPontucacao
            });

            if (empate.length > 1) {
                allEquipes.sort(function (a, b) {
                    return b.acertos_50_pontos - a.acertos_50_pontos
                });
            }

            allEquipes = allEquipes.map((equipe, index) => {
                return {
                    classificacao: index + 1,
                    ...equipe
                };
            });

            return allEquipes;
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
                let totalPontosParticipante = 0;
                    participante.perguntas.forEach(pergunta => {
                        totalPontosParticipante += pergunta.ParticipantePergunta.resposta;;
                    });

                    totalPontosParticipante = EquipeService.getPontosPerguntaIndividualFormatado(totalPontosParticipante);

                return {
                    nome: participante.nome,
                    pontuacao: totalPontosParticipante,
                    acertos_consecutivos: 65
                };

            });

            allParticipantes.sort(function (a, b) {
                return b.pontuacao - a.pontuacao
            });

            /*  Verifica empate */
            // const maiorPontucacao = allEquipes[0].pontuacao;
            // const empate = allEquipes.filter(equipe => {
            //     return equipe.pontuacao === maiorPontucacao
            // });
            //
            // if (empate.length > 1) {
            //     allEquipes.sort(function (a, b) {
            //         return b.acertos_50_pontos - a.acertos_50_pontos
            //     });
            // }

            allParticipantes = allParticipantes.map((equipe, index) => {
                return {
                    classificacao: index + 1,
                    ...equipe
                };
            });


            return  allParticipantes;

        } catch (e) {
            throw new Error(e);
        }
    }


};


module.exports = new ResultadoService();
