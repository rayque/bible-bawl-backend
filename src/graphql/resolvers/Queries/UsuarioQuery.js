const { Usuario } = require('../../../models');

module.exports = {
  getUsuarios(_, args, context) {
    context.validarIsLogged();
    return Usuario
      .findAll()
      .then((users) => users.map((user) => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
      })))
      .catch(() => {
        throw new Error('Erro ao buscar usuários');
      });
  },
};
