const { Equipe } = require('./../../../models');
const EquipeService = require("./../../../services/equipeService");


module.exports = {
  getEquipes() {
    return EquipeService.getEquipes();
  },
};
