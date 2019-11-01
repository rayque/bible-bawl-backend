
module.exports  = (sequelize, DataTypes) => {
  const PerfilUsuario = sequelize.define('PerfilUsuario', {
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario',
        key: 'id'
      }
    },
    perfil_id: {
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

