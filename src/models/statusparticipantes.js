module.exports = (sequelize, DataTypes) => {
  const StatusParticipante = sequelize.define('StatusParticipante', {
        nome: DataTypes.STRING,
        descricao: DataTypes.STRING,
      },
      {
        freezeTableName: true,
        tableName: 'status_participantes',
        underscored: true
      });



  return StatusParticipante;
};
