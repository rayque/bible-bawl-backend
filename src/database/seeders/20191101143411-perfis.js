module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('perfis',
    [
      {
        nome: 'adminstrador',
        descricao: 'Adminstrador',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'apresentador',
        descricao: 'Apresentador',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'respondedor',
        descricao: 'Respondedor',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('perfis', null, {}),
}
