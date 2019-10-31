const { User } = require('./../../models')

module.exports = {
  usuarios() {
    return User
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
