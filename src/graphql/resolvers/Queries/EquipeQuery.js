const { Equipe } = require('./../../../models');
const EquipeService = require("./../../../services/equipeService");


module.exports = {
  getEquipes(_, args, context) {
    context.validarAdmin();
    return EquipeService.getEquipes();
  },
  async getPontuacaoEquipesByResposta(_, {pergunta_id}, context) {
    context.validarIsLogged();
    return  await EquipeService.getPontuacaoEquipesByPegunta(pergunta_id);
  }
};
