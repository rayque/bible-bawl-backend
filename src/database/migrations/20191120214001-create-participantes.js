module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('participantes', {
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
    data_nascimento: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    equipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'equipes', key: 'id' },
      onUpdate: 'CASCADE',
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'status_participantes', key: 'id' },
      onUpdate: 'CASCADE',
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

  down: (queryInterface) => queryInterface.dropTable('participantes'),
};
