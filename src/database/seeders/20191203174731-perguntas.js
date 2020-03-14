function perguntas() {
    const perguntas = [];

    for (let participante = 1; participante <= 150; participante += 1) {
        const pergunta = {
            status_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
        };

        perguntas.push(pergunta);
    }

    return perguntas;
}

module.exports = {
    up: (queryInterface) => queryInterface.bulkInsert(
        'perguntas',
        perguntas(),
        {}),

    down: (queryInterface) => queryInterface.bulkDelete('perguntas', null, {}),
};
