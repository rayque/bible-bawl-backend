const {Participante, StatusPergunta, Pergunta} = require('../../models');
const PerguntaService = require('../../services/perguntaService');
const faker = require('faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // await responderPerguntas();
    },

    down: (queryInterface, Sequelize) => {
    }
};

const responderPerguntas = async () => {

    const participantes = await Participante.findAll();

    for (let perguntaId = 1; perguntaId <= 120; perguntaId++) {

        for (const participante of participantes) {
            const dados = {
                participante_id: participante.id,
                pergunta_id: perguntaId,
                resposta: faker.random.boolean(),
            };

            const status = await StatusPergunta.findAll(
                {
                    where: {
                        nome: 'respondido',
                    }
                });

          await Pergunta.update(
                {
                    pergunta_atual: true,
                    status_id: status[0].id
                },
                {
                    where: {
                        id: perguntaId
                    }
                }
            );


            console.log(dados);
            await PerguntaService.setResposta(dados, null);

        }

    }


};
