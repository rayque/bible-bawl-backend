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
      participante_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'participantes', key: 'id' },
        onUpdate: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('participante_pergunta');
  }
};