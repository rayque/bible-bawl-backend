module.exports = (sequelize, DataTypes) => {
  const Perfil = sequelize.define('Perfil', {
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    freezeTableName: true ,
    // define the table's name
    tableName: 'perfis',
  });

  // Perfil.associate = (models) => {
  //   Perfil.belongsToMany(models.Usuario, {
  //     through: 'PerfilUsuario',
  //     as: 'usuarios',
  //     foreignKey: 'perfil_id'
  //   });
  // };

  return Perfil;
};
