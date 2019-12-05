const respondedorMutation = require('./Mutations/RespondedorMutation');
const participanteMutation = require('./Mutations/ParticipanteMutation');
const equipeMutation = require('./Mutations/EquipeMutation');
const respostaMutation = require('./Mutations/RespostaMutation');

module.exports = {
  ...respondedorMutation,
  ...participanteMutation,
  ...equipeMutation,
  ...respostaMutation,
};
