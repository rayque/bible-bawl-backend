module.exports = (sequelize, DataTypes) => {
  const Participante = sequelize.define('Participante', {
      nome: DataTypes.STRING,
      data_nascimento: DataTypes.DATEONLY,
      equipe_id: DataTypes.INTEGER,
    },
    {
      freezeTableName: true,
      // define the table's name
      tableName: 'participantes',
    });

    Participante.associate = function(models) {
      Participante.belongsTo(models.Equipe, {
        foreignKey: 'equipe_id'
      });
    };

  return Participante;
};
