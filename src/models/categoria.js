
module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    idade_min: DataTypes.INTEGER,
    idade_max: DataTypes.INTEGER,
  }, {
    freezeTableName: true,
    // define the table's name
    tableName: 'categorias',
  });

  Categoria.associate = (models) => {
    Categoria.hasMany(models.Equipe, {
      foreignKey: 'categoria_id',
      as: 'equipes',
    });
  };

  return Categoria;
};
