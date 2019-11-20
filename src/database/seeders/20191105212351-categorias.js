module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('categorias',
    [
      {
        nome: 'infantil',
        descricao: 'Infantil (de 6 até 12 anos)',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'juvenil',
        descricao: 'Juvenil (de 13 até 25 anos)',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'adulto',
        descricao: 'Adulto (acima de 25)',
        created_at: new Date(),
        updated_at: new Date()
      },
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('categorias', null, {}),
}
