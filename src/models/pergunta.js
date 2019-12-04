module.exports = (sequelize, DataTypes) => {
  const Pergunta = sequelize.define('Pergunta', {
    status: DataTypes.INTEGER,
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
  };
  return Pergunta;
};
