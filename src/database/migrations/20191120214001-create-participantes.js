module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('participantes', {
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
      data_nascimento: {
        allowNull: false,
        type: DataTypes.DATE
      },
      equipe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'equipes', key: 'id' },
        onUpdate: 'CASCADE',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('participantes');
  }
};
