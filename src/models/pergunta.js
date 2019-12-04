module.exports = (sequelize, DataTypes) => {
  const Pergunta = sequelize.define('Pergunta', {
    status: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'perguntas',
  });

  Pergunta.associate = (models) => {
    Pergunta.belongsToMany(models.Participante, {
      through: models.ParticipantePergunta,
      foreignKey: 'pergunta_id',
      as: 'participantes'
    });
  };
  return Pergunta;
};
