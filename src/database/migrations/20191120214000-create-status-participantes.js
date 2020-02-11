module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('status_participantes', {
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
    descricao: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
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

  down: (queryInterface) => queryInterface.dropTable('status_participantes'),
};
