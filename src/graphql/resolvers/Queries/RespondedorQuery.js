const {Respondedor, Pergunta} = require('./../../../models');

module.exports = {
    getRespondedores(_, args, context) {
        context.validarAdmin();
        return Respondedor
            .findAll({include: ['equipes']})
            .then(respondedores => {
                return respondedores.map(resp => {
                    const equipes = resp.equipes.map(equipe => {
                        return {
                            id: equipe.id,
                            nome: equipe.nome
                        }
                    });
                    return {
                        id: resp.id,
                        nome: resp.nome,
                        cod_acesso: resp.cod_acesso,
                        equipes
                    }
                })
            })
            .catch(() => {
                throw new Error('Erro ao buscar respondedorees');
            });
    },
    async getRespondedor(_, {id}, context) {
        context.validarIsLogged();

        const perguntaAtual = await Pergunta.findOne(
            {
                where: {pergunta_atual: 1},
                attributes: ['id']
            }
        );

        return Respondedor
            .findByPk(id, {
                include: [
                    {
                        association: 'equipes',
                        // include: ['participantes', 'categoria'],
                        include: [
                            {
                                association: 'participantes',
                                include: [
                                    {association: 'perguntas'}
                                ],
                            },
                            {association: 'categoria'}
                        ],

                    },
                ]
            })
            .then(respondedor => {

                const equipes = respondedor.equipes.map(equipe => {

                    const cat = equipe.categoria;
                    let categoria = null;
                    if (cat) {
                        categoria = {
                            id: cat.id,
                            nome: cat.nome,
                            descricao: cat.descricao,
                            idade_min: cat.idade_min,
                            idade_max: cat.idade_max,
                        };
                    }

                    const sigla = equipe.participantes.map(participante => {
                        return participante.nome.charAt(0);
                    }).join('');

                    const participantes = equipe.participantes.map(participante => {

                        let respostas = [];
                        const pergunta = participante.perguntas.filter(pergunta => {
                            return pergunta.id === perguntaAtual.id;
                        });

                        respostas.push({
                            pergunta: perguntaAtual.id,
                            resposta: pergunta.length ? pergunta[0].ParticipantePergunta.resposta : false,
                        })

                        return {
                            id: participante.id,
                            nome: participante.nome,
                            respostas
                        };
                    });

                    return {
                        id: equipe.id,
                        nome: equipe.nome,
                        sigla,
                        categoria,
                        participantes
                    }
                });

                return {
                    id: respondedor.id,
                    nome: respondedor.nome,
                    cod_acesso: respondedor.cod_acesso,
                    equipes
                }

            })
            .catch(e => {
                console.log(e);
                throw new Error('Erro ao buscar respondedor');
            });
    },
};
