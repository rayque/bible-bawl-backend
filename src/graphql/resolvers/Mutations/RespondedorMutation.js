const { Respondedor, Equipe} = require('./../../../models');
const { Op, Sequelize } = require('sequelize');
const EquipeService = require("./../../../services/equipeService")
const AuxiliarService = require("./../../../services/auxiliarService")

module.exports = {
  async novoRespondedor(_, { nome }, context) {
    context.validarAdmin();
    return AuxiliarService.novoRespondedor(nome);
  },
  async setEquipesRespondedor(_, {dados},context) {
    context.validarAdmin();
    let transaction;
    try {
      transaction = await Equipe.sequelize.transaction();
      const idRespondedor  = dados.idRespondedor;
      const idsEquipes  = dados.idsEquipes;

      const resetEquipe = await Equipe.update(
        {respondedor_id: null},
        {where: {respondedor_id: idRespondedor}},
        { transaction }
      );

      if (!resetEquipe.length) {
        throw new Error('Não possível atualizar as equipes.');
      }

      const setEquipe = await Equipe.update(
        {respondedor_id: idRespondedor},
        {where: {id: idsEquipes}},
        { transaction }
      );

      if (!setEquipe.length) {
        throw new Error('Não possível encontrar as equipes.');
      }

      await transaction.commit();

      const respondedor = await Respondedor.findByPk(idRespondedor);
      const equipes = await EquipeService.getEquipes(idsEquipes);

      return {
        respondedor,
        equipes
      };

    } catch (e) {
      if (transaction) {
        transaction.rollback();
      }
      throw new Error(e);
    }
  },

};
