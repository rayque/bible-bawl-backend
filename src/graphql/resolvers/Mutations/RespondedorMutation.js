const { Respondedor, Equipe} = require('./../../../models');
const { Op, Sequelize } = require('sequelize');
const EquipeService = require("./../../../services/equipeService")

module.exports = {
  async novoRespondedor(_, { nome }) {
    try {
      const respondedor = await Respondedor.findAll({
        where: {
          nome,
        },
      });

      if (respondedor.length) {
        throw new Error('Já existe um respondedor com este nome.');
      }

      const codAcesso = Math.floor(Math.random() * 100000) + 100000;
      return await Respondedor.create({ nome, cod_acesso: codAcesso });
    } catch (e) {
      throw new Error(e);
    }
  },
  async setEquipesRespondedor(_, {dados}) {
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
