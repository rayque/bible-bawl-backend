function participantes() {
  const membros = [];

  for (let equipe = 1; equipe <= 4; equipe++) {
    for (let participante = 1; participante <= 4; participante++) {
      const membro = {
        nome: `Participante ${participante} [equipe ${equipe}]`,
        data_nascimento: new Date(),
        equipe_id: equipe,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      membros.push(membro);
    }
  }

  return membros;
}

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('participantes',
    participantes(), {}),

  down: (queryInterface) => queryInterface.bulkDelete('participantes', null, {}),
};
