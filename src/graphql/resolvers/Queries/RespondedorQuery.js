const { Respondedor } = require('./../../../models');

module.exports = {
  getRespondedores() {
    return Respondedor
      .findAll({include: ['equipes']})
      .then(respondedores => {
        return respondedores.map(resp => {
          console.log(resp.equipes.length);
          const equipes = resp.equipes.map(equipe => {
            return {
              id: equipe.id,
              nome: equipe.nome
            }
          });
          return {
            id: resp.id,
            nome: resp.nome,
            cod_acesso: resp.cod_acesso,
            equipes
          }
        })
      })
      .catch(() => {
        throw new Error('Erro ao buscar usuários');
      });
  },
};
