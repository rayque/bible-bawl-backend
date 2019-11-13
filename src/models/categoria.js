
module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
  }, {
    freezeTableName: true,
    // define the table's name
    tableName: 'categorias',
  });
  // Categoria.associate = function (models) {
  //   // associations can be defined here
  // };
  return Categoria;
};
