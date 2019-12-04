'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('participante_pergunta', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      resposta: {
        type: Sequelize.INTEGER
      },
      pergunta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'perguntas', key: 'id' },
        onUpdate: 'CASCADE',
      },
      partiicpante_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'participantes', key: 'id' },
        onUpdate: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('participante_pergunta');
  }
};