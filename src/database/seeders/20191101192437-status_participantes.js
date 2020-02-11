module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('status_participantes',
      [
        {
          nome: 'titular',
          descricao: 'Titular',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nome: 'substituto',
          descricao: 'Substituto',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('status_participantes', null, {}),
};
