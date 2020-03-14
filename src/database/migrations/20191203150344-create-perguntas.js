module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('perguntas', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'status_perguntas', key: 'id' },
      onUpdate: 'CASCADE',
    },
    pergunta_atual: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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

  down: (queryInterface) => queryInterface.dropTable('perguntas'),
};
