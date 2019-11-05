module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('categorias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nome: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      descricao: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('categorias');
  }
};
