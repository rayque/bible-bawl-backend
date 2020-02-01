const respondedorMutation = require('./Mutations/RespondedorMutation');
const equipeMutation = require('./Mutations/EquipeMutation');
const respostaMutation = require('./Mutations/RespostaMutation');

module.exports = {
  ...respondedorMutation,
  ...equipeMutation,
  ...respostaMutation,
};
