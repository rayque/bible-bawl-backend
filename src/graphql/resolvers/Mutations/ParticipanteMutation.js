const {Participante: ParticipanteMutation} = require('./../../../models')

module.exports = {
  async novoParticipante(_, dados) {
    try {
      const data = dados.dados || {};

      if (!data.length) {
        throw new Error("Não há dados suficientes para salvar.");
      }

        Object.keys(data).forEach(function(key) {


      });

      const cod_acesso = Math.floor(Math.random() * 100000) + 100000;
      return await ParticipanteMutation.create({nome, cod_acesso});
    } catch (e) {
      throw new Error(e);
    }
  }
}
