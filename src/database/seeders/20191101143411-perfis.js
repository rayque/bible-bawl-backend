module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('perfis',
    [
      {
        nome: 'adminstrador',
        descricao: 'Adminstrador',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'apresentador',
        descricao: 'Apresentador',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'respondedor',
        descricao: 'Respondedor',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('perfis', null, {}),
};
