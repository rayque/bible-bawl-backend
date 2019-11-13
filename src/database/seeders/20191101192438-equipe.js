module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('equipes',
    [
      {
        nome: 'Equipe 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Equipe 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Equipe 3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Equipe 4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('equipes', null, {}),
};
