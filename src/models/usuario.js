module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  },
  {
    freezeTableName: true,
    // define the table's name
    tableName: 'usuarios',
  });
  Usuario.associate = (models) => {
    Usuario.belongsToMany(models.Perfil, {
      through: 'PerfilUsuario',
      as: 'perfis',
      foreignKey: 'usuario_id'
    });
  };

  return Usuario;
};
