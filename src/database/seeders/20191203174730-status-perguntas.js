module.exports = {
    up: (queryInterface) => queryInterface.bulkInsert('status_perguntas',
        [
            {
                nome: 'n_respondido',
                descricao: 'Não respondido',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                nome: 'respondido',
                descricao: 'Respondido',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                nome: 'cancelado',
                descricao: 'Cancelado',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ], {}),

    down: (queryInterface) => queryInterface.bulkDelete('status_perguntas', null, {}),
};
