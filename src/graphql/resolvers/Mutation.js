const respondedorMutation = require('./Mutations/RespondedorMutation');
const participanteMutation = require('./Mutations/ParticipanteMutation');
const equipeMutation = require('./Mutations/EquipeMutation');

module.exports = {
  ...respondedorMutation,
  ...participanteMutation,
  ...equipeMutation,
};
