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
      type: DataTypes.STRING,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('respondedores'),
};
