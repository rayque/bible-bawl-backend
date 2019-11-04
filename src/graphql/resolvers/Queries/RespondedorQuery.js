const {Respondedor} = require('./../../../models')
module.exports = {
  getRespondedores() {
    return Respondedor
      .findAll()
      .then(respondedores => {
        return respondedores.map(resp => {
          return {
            id: resp.id,
            nome: resp.nome,
            cod_acesso: resp.cod_acesso,
          }
        })
      })
      .catch(err => {
        console.log(err);
      })
  }
}
