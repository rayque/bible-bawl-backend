const { Participante: ParticipanteMutation } = require('./../../../models');

module.exports = {
  async novoParticipante(_, dados) {
    try {
      const data = dados.dados || {};

      if (!data.length) {
        throw new Error('Não há dados suficientes para salvar.');
      }

      // Object.keys(data).forEach((key) => {
      //
      //
      // });

      const codAcesso = Math.floor(Math.random() * 100000) + 100000;
      const nome = '';
      return await ParticipanteMutation.create({ nome, codAcesso });
    } catch (e) {
      throw new Error(e);
    }
  },
};
