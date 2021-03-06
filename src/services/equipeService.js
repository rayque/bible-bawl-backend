const {Pergunta, Equipe, Participante, Categoria, StatusPergunta, StatusParticipante} = require("../models");
const {Op} = require('sequelize');
const moment = require('moment');

class EquipeService {
    async getEquipes(ids = {[Op.ne]: null}) {

        return Equipe
            .findAll({
                    where: {id: ids},
                    include: [
                        {association: 'participantes'},
                        {association: 'categoria'},
                    ]
                }
            )
            .then(equipes => {
                return equipes.map(equipe => {
                    let participantes = equipe.participantes || [];

                    participantes = participantes.map(participante => {
                        return {
                            id: participante.id,
                            nome: participante.nome,
                            data_nascimento: participante.data_nascimento,
                        }
                    });

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

                    return {
                        id: equipe.id,
                        nome: equipe.nome,
                        categoria,
                        participantes
                    }
                })
            })
            .catch((e) => {
                throw new Error('Erro ao buscar equipes');
            });
    }

    async getPontuacaoEquipesByPegunta(pergunta_id) {

        const categorias = await Categoria.findAll({
            include: [
                {
                    association: 'equipes',
                    include: [
                        {
                            association: 'participantes',
                            include: [
                                {
                                    association: 'perguntas'
                                }
                            ]
                        },
                    ]
                },
            ]
        });

        return categorias.map(categoria => {
            const equipes = categoria.equipes.map(equipe => {
                return equipe.participantes.map(participante => {

                    let pontuacao = 0;
                    if (participante.perguntas.length) {

                        let perguntaAtual = participante.perguntas.filter(p => {
                            return p.id === pergunta_id
                        });
                        perguntaAtual = perguntaAtual.length > 0 ? perguntaAtual[0] : null

                        if (perguntaAtual) {
                            if (perguntaAtual.ParticipantePergunta.pergunta_id === pergunta_id) {
                                pontuacao = this.getPontuacaoIndividualFormatado(perguntaAtual.ParticipantePergunta.resposta);
                            }
                        }
                    }

                    return {
                        nome: participante.nome,
                        pontuacao,
                    };
                });
            });

            return {
                nome: categoria.nome,
                descricao: categoria.descricao,
                equipes,
            };
        });

    }

    async editarEquipe({participantes}) {
        let transaction;
        try {
            transaction = await Participante.sequelize.transaction();

            const catedoriaId = await this.getCategoria(participantes);

            const nomes = [];
            for (let i = 0; i < participantes.length; i += 1) {
                const words = participantes[i].nome.split(' ');
                nomes.push(words[0]);
            }
            const nomeEquipe = nomes.join(' ');

            const participante = await Participante.findByPk(participantes[0].id);

            await Equipe.update({
                    nome: nomeEquipe,
                    categoria_id: catedoriaId,
                },
                {where: {id: participante.equipe_id}},
                {transaction}
            );

            const copaIniciou = await  this.verificaCopaIniciou();
            const promises = participantes.map(async participante => {
                let dados = {
                    nome: participante.nome,
                    data_nascimento: participante.data_nascimento
                };

                const participanteBd = await Participante.findByPk(participante.id);
                /*
                    Verificar se a copa ja começou e mudar o status  do participante
                    para a pontuação não valer para classificação Individual
                */
                if (copaIniciou && (participanteBd.nome !== participante.nome)) {
                    dados.status_id = 2;
                }

                return Participante.update(
                    dados,
                    {where: {id: participante.id}},
                    {transaction}
                );
            });

            const allParticipantes = await Promise.all(promises);

            await transaction.commit();

            return !!allParticipantes.length;

        } catch (err) {
            if (transaction) {
                transaction.rollback();
            }
            throw new Error(err);
        }
    }


    getPontuacaoIndividualFormatado(pontos) {
        return pontos ? pontos * 10 : 0;
    }

    getPontosPerguntaEquipeFormatado(acertos) {
        const hasBonus = this.hasBonus(acertos);
        return hasBonus ? 50 : acertos * 10;
    }

    getPontosPerguntaIndividualFormatado(acertos) {
        return acertos * 10;
    }

    /*
    * 4 acertos: todos os participantes acertaram aquela pergunta
    * */
    hasBonus(acertos) {
        return acertos === 4;
    }

    async getCategoria(participantes = []) {
        const allCategorias = [];

        for (const participante of participantes) {
            const idade = moment().diff(participante.data_nascimento, 'years');

            const categorias = await Categoria.findAll({
                where: {
                    idade_min: {
                        [Op.lte]: idade, // >=
                    },
                    idade_max: {
                        [Op.gte]: idade, // <=
                    },
                },
            });

            if (!categorias.length) {
                throw new Error('Não há categoria para a idade do participante.');
            }

            allCategorias.push(categorias[0].id);
        }

        const totalCategorias = Array.from(new Set(allCategorias));

        if (totalCategorias.length !== 1) {
            throw new Error('Há participantes em categorias diferentes.');
        }

        return allCategorias[0];
    }

    async novaEquipe(dados) {
        let transaction;
        try {
            transaction = await Equipe.sequelize.transaction();
            const data = dados.dados || {};

            const catedoriaId = await this.getCategoria(data);

            // Cadastro da Equipe
            const nomes = [];
            for (let i = 0; i < data.length; i += 1) {
                const words = data[i].nome.split(' ');
                nomes.push(words[0]);
            }
            const nomeEquipe = nomes.join(' ');
            const equipe = await Equipe.create({
                    nome: nomeEquipe,
                    categoria_id: catedoriaId,
                },
                {transaction})
                .catch((e) => {
                    throw new Error(e.errors[0].message|| 'Ocoreu um erro ao salvar nome da equipe' );
                });

            const status = await StatusParticipante.findOne({
                where: { nome: 'titular'}
            });

            // Cadastro dos Participantes
            const promises = Object.keys(data).map(async (key) => Participante.create({
                    nome: data[key].nome,
                    data_nascimento: data[key].data_nascimento,
                    equipe_id: equipe.id,
                    status_id: status.id
                },
                {transaction})
                .catch((e) => {
                    throw new Error(e.errors[0].message || 'Ocoreu um erro ao slavar participantes'  );
                }));

            const allParticipantes = await Promise.all(promises);

            const participantes = allParticipantes.map((part) => ({
                id: part.id,
                nome: part.nome,
                data_nascimento: part.data_nascimento,
            }));

            await transaction.commit();

            return {
                id: equipe.id,
                nome: equipe.nome,
                participantes,
            };
        } catch (err) {
            if (transaction) {
                transaction.rollback();
            }
            throw new Error(err);
        }
    }

    async excluirEquipe({equipe_id}) {
        let transaction;
        try {
            transaction = await Equipe.sequelize.transaction();

            const copaIniciou = await this.verificaCopaIniciou();
            if (copaIniciou) {
                throw new Error("A copa já iniciou, portanto, não é possível excluir uma equipe.");
            }

            await Participante.destroy({
                where: {equipe_id: equipe_id}
            }, transaction);

            await  Equipe.destroy({
                where: {id: equipe_id}
            }, transaction);

            await transaction.commit();

            return true;
        } catch (err) {
            if (transaction) {
                transaction.rollback();
            }
            throw new Error(err);
        }
    }


    async verificaCopaIniciou() {
        const status = await StatusPergunta.findOne({
            where: {nome: 'respondido'}
        });

        const perguntaRespondida = await Pergunta.findAll({
            where: {status_id: status.id}
        });


        return !!perguntaRespondida.length;
    }

};


module.exports = new EquipeService();
