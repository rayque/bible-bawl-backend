const {Participante, StatusPergunta, Pergunta} = require('../../models');
const PerguntaService = require('../../services/perguntaService');
const faker = require('faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
         if ('true' === process.env.APP_COPA_FAKE) {
            await responderPerguntas();
        }
    },

    down: (queryInterface, Sequelize) => {
    }
};

const responderPerguntas = async () => {
    console.log();
    console.log("--------------- COPA FAKE ---------------");
    console.log();

    const participantes = await Participante.findAll();

    for (let perguntaId = 1; perguntaId <= 5; perguntaId++) {

        for (const participante of participantes) {

            const resp =  faker.random.boolean();

            console.log({ perguntaId,  participante_id: participante.id, resp});

            const dados = {
                participante_id: participante.id,
                pergunta_id: perguntaId,
                resposta: resp,
            };

            await Pergunta.update(
                {pergunta_atual: false},
                {
                    where: {
                        pergunta_atual: true
                    }
                }
            );

            const result = await Pergunta.update(
                {pergunta_atual: true},
                {
                    where: {
                        id: perguntaId
                    }
                }
            );

            const status = await StatusPergunta.findOne(
                {
                    where: {
                        nome: 'respondido',
                    }
                });

          await Pergunta.update(
                {
                    pergunta_atual: true,
                    status_id: status.id
                },
                {
                    where: {
                        id: perguntaId
                    }
                }
            );


            await PerguntaService.setResposta(dados, null);

        }

    }


};
