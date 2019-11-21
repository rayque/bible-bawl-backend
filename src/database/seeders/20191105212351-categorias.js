module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('categorias',
    [
      {
        nome: 'infantil',
        descricao: 'Infantil (de 6 até 12 anos)',
        idade_min: 6,
        idade_max: 12,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'juvenil',
        descricao: 'Juvenil (de 13 até 25 anos)',
        idade_min: 13,
        idade_max: 25,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'adulto',
        descricao: 'Adulto (acima de 25)',
        idade_min: 26,
        idade_max: 99,
        created_at: new Date(),
        updated_at: new Date()
      },
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('categorias', null, {}),
}
