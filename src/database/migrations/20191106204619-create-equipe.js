
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('equipes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    nome: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
    },
    categoria_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'categorias', key: 'id' },
      onUpdate: 'CASCADE',
    },
    respondedor_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'respondedores', key: 'id' },
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
  }),
  down: (queryInterface) => queryInterface.dropTable('equipes'),
};
