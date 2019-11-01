module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('respondedores',
    [
      {
        nome: 'Gus Fring',
        cod_acesso: '123',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Mike Ehrmantraut',
        cod_acesso: '2019',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('respondedores', null, {}),
}
