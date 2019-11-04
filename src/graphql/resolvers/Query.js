const { Usuario } = require('./../../models')

module.exports = {
  usuarios() {
    return Usuario
    .findAll()
    .then( users => {
      return users.map(user => {
        return {
          id: user.id,
          nome: user.nome,
          email: user.email,
        }
      })
    })
    .catch(err => {
      console.log(err);
    })
  }
}
