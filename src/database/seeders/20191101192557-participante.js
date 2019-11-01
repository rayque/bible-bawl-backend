function participantes(){
  let membros = [];

  for (let i = 1; i <= 4; i++) {
    const equipeId = i;
    const equipeNome

    for (let i = 1; i <=  4; i++) {
      const membro = {
        nome: `Participante ${i}`,
        data_nascimento: new Date(),
        equipe_id: equipeId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      membros.push(membro);
    }
  }

  return membros;
};

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('participantes',
    participantes(), {}),

  down: (queryInterface) => queryInterface.bulkDelete('participantes', null, {}),
}
