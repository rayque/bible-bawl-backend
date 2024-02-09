'use strict';
const {ParticipantePergunta, StatusPergunta, Pergunta} = require('../../models');
const {Op} = require('sequelize');



module.exports = {
  up: async (queryInterface, Sequelize) => {
    if ('true' === process.env.APP_DELETEAR_RESPOSTAS) {
        console.log();
        console.log("======================================");
        console.log("========== DELETAR RESPOSTAS =========");
        console.log("======================================");
        await deletarRespostas();
    }
    return true;
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};


async function deletarRespostas(){
    /* Remover pergunta Atual */
    await Pergunta.update(
        {pergunta_atual: false},
        {
            where: {
                pergunta_atual: true
            }
        }
      )
      
      log("REMOVEU PERGUNTA COM STATUS ATUAL")

    /* colocar evento para de pergunta atual/ bloquear respostas */


    /* remover  status de respondido*/
    const status = await StatusPergunta.findOne(
        {
          where: {
            nome: 'n_respondido',
          }
        });
    await Pergunta.update(
        {status_id: status.id},
        {
          where: {
            status_id: {
              [Op.ne]: status.id
            }
          }
        }
    );
    log("REMOVEU O STATUS DE 'RESPONDIDO' DAS PERGUNTAS")


    /* remover  repostas dod participantes da piviot*/

    await ParticipantePergunta.destroy({
      where: {},
      truncate: true
    });
    log("REMOVEU REPOSTAS DOS PARTICIPANTES")
    
}

const log = msg => {
  console.log();
  console.log(`========== ${msg} ==========`);
}