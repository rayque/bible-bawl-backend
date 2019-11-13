module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('respondedores',
    [
      {
        nome: 'Gus Fring',
        cod_acesso: Math.floor(Math.random() * 100000) + 100000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Mike Ehrmantraut',
        cod_acesso: Math.floor(Math.random() * 100000) + 100000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('respondedores', null, {}),
};
