module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('equipes',
    [
      {
        nome: 'Equipe 1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'Equipe 2',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'Equipe 3',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'Equipe 4',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('equipes', null, {}),
}
