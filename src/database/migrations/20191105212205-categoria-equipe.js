module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('categoria_equipe', {
      categoria_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categorias',
          key: 'id'
        }
      },
      equipe_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Equipes',
          key: 'id'
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('categoria_equipe');
  }
};
