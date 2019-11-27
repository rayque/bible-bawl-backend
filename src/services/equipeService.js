const { Equipe} = require("../models");
const { Op } = require('sequelize');

class EquipeService {
  async getEquipes(ids = {[Op.ne]: null}) {

    return Equipe
      .findAll({
          where: {id: ids},
          include: [
            { association: 'participantes' },
            { association: 'categoria' },
          ]
        }
      )
      .then(equipes => {
        return equipes.map(equipe => {
          let participantes = equipe.participantes || [];

          participantes = participantes.map(participante => {
            return {
              id: participante.id,
              nome: participante.nome,
              data_nascimento: participante.data_nascimento,
            }
          });

          const cat = equipe.categoria;
          let categoria = null;
          if (cat) {
            categoria = {
              id: cat.id,
              nome: cat.nome,
              descricao: cat.descricao,
              idade_min: cat.idade_min,
              idade_max: cat.idade_max,
            };
          }

          return {
            id: equipe.id,
            nome: equipe.nome,
            categoria,
            participantes
          }
        })
      })
      .catch((e) => {
        console.log(e);
        throw new Error('Erro ao buscar equipes');
      });
  }
};

module.exports = new EquipeService();
