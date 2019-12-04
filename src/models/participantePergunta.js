'use strict';
module.exports = (sequelize, DataTypes) => {
  const ParticipantePergunta = sequelize.define('ParticipantePergunta', {
    resposta: DataTypes.STRING
  }, {
    tableName: 'participante_pergunta',
    underscored: true
  });
  ParticipantePergunta.associate = function(models) {
    // associations can be defined here
  };
  return ParticipantePergunta;
};