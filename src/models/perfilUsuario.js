
module.exports  = (sequelize, DataTypes) => {
  const PerfilUsuario = sequelize.define('PerfilUsuario', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario',
        key: 'id'
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Perfil',
        key: 'id'
      }
    }
  },
  {
    freezeTableName: true,
    // define the table's name
    tableName: 'perfil_usuario',
  });
  return PerfilUsuario;
};
