const usuarioQuery = require('./Queries/UsuarioQuery');
const respondedorQuery = require('./Queries/RespondedorQuery');
const equipeQuery = require('./Queries/EquipeQuery');
const perguntaQuery = require('./Queries/PerguntaQuery');
const authQuery = require('./Queries/AuthQuery');

module.exports = {
  ...usuarioQuery,
  ...respondedorQuery,
  ...equipeQuery,
  ...perguntaQuery,
  ...authQuery,
};
