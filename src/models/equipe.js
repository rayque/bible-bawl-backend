
module.exports = (sequelize, DataTypes) => {
  const Equipe = sequelize.define('Equipe', {
    nome: DataTypes.STRING,
    categoria_id: DataTypes.INTEGER,
  }, {
    freezeTableName: true,
    // define the table's name
    tableName: 'equipes',
  });
  Equipe.associate = (models) => {
    Equipe.hasMany(models.Participante, {
      foreignKey: 'equipe_id',
      as: 'participantes',
    });
    Equipe.belongsTo(models.Categoria, {
      foreignKey: 'categoria_id',
      as: 'categoria',
    });
    Equipe.belongsTo(models.Respondedor, {
      foreignKey: 'respondedor_id',
      as: 'respondedor',
    });
  };
  return Equipe;
};
