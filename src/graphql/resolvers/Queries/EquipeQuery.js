const { Equipe } = require('./../../../models');

module.exports = {
  getEquipes() {
    return Equipe
      .findAll({include: ['participantes', 'categoria']})
      .then(equipes => {
        return equipes.map(equipe => {

          const participantes = equipe.participantes.map(participante => {
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
      .catch(() => {
        throw new Error('Erro ao buscar equipes');
      });
  },
};
