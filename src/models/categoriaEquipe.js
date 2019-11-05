
module.exports  = (sequelize, DataTypes) => {
  const CategoriaEquipe = sequelize.define('CategoriaEquipe', {
      categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Categoria',
          key: 'id'
        }
      },
      equipe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Equipe',
          key: 'id'
        }
      }
    },
    {
      freezeTableName: true,
      // define the table's name
      tableName: 'categoria_equipe',
    });
  return CategoriaEquipe;
};

