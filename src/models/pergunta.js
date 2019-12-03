module.exports = (sequelize, DataTypes) => {
  const Pergunta = sequelize.define('Pergunta', {
    status: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'perguntas',
  });
  return Pergunta;
};
