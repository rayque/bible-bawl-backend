const { Equipe } = require('./../../../models');
const EquipeService = require("./../../../services/equipeService");


module.exports = {
  getEquipes() {
    return EquipeService.getEquipes();
  },
  getPontuacaoEquipesByResposta(_, {pergunta_id}) {
    return EquipeService.getPontuacaoEquipesByPegunta(pergunta_id);
  }
};
