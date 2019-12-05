const { ParticipantePergunta} = require('./../../../models');
const { Op, Sequelize } = require('sequelize');
const EquipeService = require("./../../../services/equipeService")

module.exports = {
    async setResposta(_, {dados}) {
        let transaction;
        try {
            transaction = await ParticipantePergunta.sequelize.transaction();

            await ParticipantePergunta.findOrCreate(
                {
                    where: {
                        participante_id: dados.participante_id,
                        pergunta_id: dados.pergunta_id
                    }
                }
            );

            const result = await ParticipantePergunta.update(
                {resposta: dados.resposta},
                {
                    where: {
                        participante_id: dados.participante_id,
                        pergunta_id: dados.pergunta_id
                    }
                },
                { transaction }
            );


            await transaction.commit();

            return !!result;

        } catch (e) {
            if (transaction) {
                transaction.rollback();
            }
            throw new Error(e);
        }
    },

};
