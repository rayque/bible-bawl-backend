const { Equipe } = require('./../../../models');
const { Participante } = require('./../../../models');

module.exports = {
  async novaEquipe(_, dados) {
    let transaction;
    try {
      transaction = await Equipe.sequelize.transaction();
      const data = dados.dados || {};

      // Add Categoria


      // Cadastro da Equipe
      const nomes = [];
      for (let i = 0; i < data.length; i += 1) {
        const words = data[i].nome.split(' ');
        nomes.push(words[0]);
      }
      const nomeEquipe = nomes.join(' ');
      const equipe = await Equipe.create({ nome: nomeEquipe });

      // Cadastro dos Participantes
      const promises = Object.keys(data).map(async (key) => Participante.create({
        nome: data[key].nome,
        data_nascimento: data[key].data_nascimento,
        equipe_id: equipe.id,
      }));

      const allParticipantes = await Promise.all(promises);

      const participantes = allParticipantes.map((part) => ({
        id: part.id,
        nome: part.nome,
        data_nascimento: part.data_nascimento,
      }));

      await transaction.commit();

      return {
        id: equipe.id,
        nome: equipe.nome,
        participantes,
      };
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw new Error(err);
    }
  },
};
