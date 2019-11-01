module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('respondedores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nome: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      cod_acesso: {
        allowNull: true,
        type: DataTypes.STRING,
      }
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('respondedores');
  }
};
