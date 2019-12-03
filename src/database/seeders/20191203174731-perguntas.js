function perguntas() {
  const perguntas = [];

    for (let participante = 1; participante <= 4; participante += 1) {
      const pergunta = {
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      perguntas.push(pergunta);
    }

  return perguntas;
}

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('perguntas',
    perguntas(), {}),

  down: (queryInterface) => queryInterface.bulkDelete('perguntas', null, {}),
};
