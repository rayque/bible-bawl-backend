module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('perfil_usuario', {
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         // User hasMany WorkingDays n:n
          model: 'usuarios',
          key: 'id'
        }
      },
      perfil_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         // WorkingDays hasMany Users n:n
          model: 'perfis',
          key: 'id'
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('perfil_usuario');
  }
};
