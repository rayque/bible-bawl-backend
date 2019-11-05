const {Equipe} = require('./../../../models')
const {Participante} = require('./../../../models')

module.exports = {
  async novaEquipe(_, dados) {
    let transaction;
    try {
      transaction = await Equipe.sequelize.transaction();
      const data = dados.dados || {};

      const promises =  Object.keys(data).map(async key => {
        return Participante.create({
          nome: data[key].nome,
          data_nascimento: data[key].data_nascimento,
        });
      });

      const participantes = await Promise.all(promises);

           

      // CRIAR EQUIPE E RETORNAR

      await transaction.commit();

    } catch (err){
      if (transaction) await transaction.rollback();
      throw new Error("Erro ao cadastrar Respondedor");
    }
  }
}
