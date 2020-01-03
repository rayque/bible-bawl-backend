const faker = require('faker');
// faker.locale = "pt_BR";

const getRespondedores = () => {
    let respondedores = [];
    for (let i = 0; i < 10; i++) {
        const auxiliar = {
            nome:  faker.name.firstName() +' '+faker.name.lastName(),
            cod_acesso: Math.floor(Math.random() * 100000) + 100000,
            created_at: new Date(),
            updated_at: new Date(),
        };
        respondedores.push(auxiliar);
    }
    return respondedores;
}


module.exports = {
    up: (queryInterface) => queryInterface.bulkInsert(
        'respondedores',
        getRespondedores(),
        {}
    ),

    down: (queryInterface) => queryInterface.bulkDelete('respondedores', null, {}),
};
