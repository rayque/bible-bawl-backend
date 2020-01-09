const { Equipe } = require('./../../../models');
const EquipeService = require("./../../../services/equipeService");


module.exports = {
  getEquipes() {
    return EquipeService.getEquipes();
  },
  async getPontuacaoEquipesByResposta(_, {pergunta_id}) {
    return  await EquipeService.getPontuacaoEquipesByPegunta(pergunta_id);
  }
};
