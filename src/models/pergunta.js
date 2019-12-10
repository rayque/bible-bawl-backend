module.exports = (sequelize, DataTypes) => {
  const Pergunta = sequelize.define('Pergunta', {
    status_id: DataTypes.INTEGER,
    pergunta_atual: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'perguntas',
    underscored: true
  });

  Pergunta.associate = (models) => {
    Pergunta.belongsToMany(models.Participante, {
      through: models.ParticipantePergunta,
      foreignKey: 'pergunta_id',
      as: 'participantes'
    });
    Pergunta.belongsTo(models.StatusPergunta, {
      foreignKey: 'status_id',
      as: 'status',
    });
  };
  return Pergunta;
};
