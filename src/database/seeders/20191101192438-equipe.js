module.exports = {
    up: (queryInterface) => queryInterface.bulkInsert('equipes',
        [
            {
                nome: 'Equipe 1',
                categoria_id: 1,
                respondedor_id: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                nome: 'Equipe 2',
                categoria_id: 1,
                respondedor_id: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                nome: 'Equipe 3',
                categoria_id: 1,
                respondedor_id: 2,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                nome: 'Equipe 4',
                categoria_id: 1,
                respondedor_id: 2,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ], {}),

    down: (queryInterface) => queryInterface.bulkDelete('equipes', null, {}),
};
