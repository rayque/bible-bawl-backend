const {Equipe} = require('./../../../models')
const {Participante} = require('./../../../models')

module.exports = {
  async novaEquipe(_, {
    participante1,
    participante2,
    participante3,
    participante4
  }) {
    try {
      return await Participante.create({
        nome: participante1.nome, cod_acesso
      });
    } catch (e) {
      throw new Error("Erro ao cadastrar Respondedor");
    }
  }
}
