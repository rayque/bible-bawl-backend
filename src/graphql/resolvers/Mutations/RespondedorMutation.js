const { Respondedor } = require('./../../../models');

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
      return await Respondedor.create({ nome, codAcesso });
    } catch (e) {
      throw new Error(e);
    }
  },
};
