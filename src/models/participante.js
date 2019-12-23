module.exports = (sequelize, DataTypes) => {
  const Participante = sequelize.define('Participante', {
    nome: DataTypes.STRING,
    data_nascimento: DataTypes.DATEONLY,
    equipe_id: DataTypes.INTEGER,
  },
  {
    freezeTableName: true,
    tableName: 'participantes',
  });

  Participante.associate = (models) => {
    Participante.belongsTo(models.Equipe, {
      foreignKey: 'equipe_id',
      as: 'equipe'
    });
    Participante.belongsToMany(models.Pergunta, {
      through: models.ParticipantePergunta,
      foreignKey: 'participante_id',
      as: 'perguntas'
    });
  };

  return Participante;
};
