const usuarioQuery = require('./Queries/UsuarioQuery');
const respondedorQuery = require('./Queries/RespondedorQuery');
const equipeQuery = require('./Queries/EquipeQuery');

module.exports = {
  ...usuarioQuery,
  ...respondedorQuery,
  ...equipeQuery,
};
