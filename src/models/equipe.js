module.exports = (sequelize, DataTypes) => {
  const Equipe = sequelize.define('Equipe', {
      nome: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      // define the table's name
      tableName: 'equipes',
    });
    Equipe.associate = function(models) {
      Equipe.hasMany(models.Participante, {
        foreignKey: 'equipe_id',
        as: 'participantes'
      });
    };

  return Equipe;
};
