function participantes() {
  const membros = [];

  for (let equipe = 1; equipe <= 4; equipe += 1) {
    for (let participante = 1; participante <= 4; participante += 1) {
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
  up: (queryInterface) => queryInterface.bulkInsert('participantes',
    participantes(), {}),

  down: (queryInterface) => queryInterface.bulkDelete('participantes', null, {}),
};
