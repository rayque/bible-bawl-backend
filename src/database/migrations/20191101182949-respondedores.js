module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('respondedores', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    nome: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    cod_acesso: {
      allowNull: true,
      unique: true,
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('respondedores'),
};
