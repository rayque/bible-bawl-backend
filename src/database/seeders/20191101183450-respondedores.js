const faker = require('faker');
// faker.locale = "pt_BR";
const AuxiliarService =  require('../../services/auxiliarService')


const getRespondedores = async () => {

    for (let i = 0; i < 10; i++) {
        const nome = faker.name.firstName() + ' ' + faker.name.lastName();
        await AuxiliarService.novoRespondedor(nome);
    }
}


module.exports = {
    up: async () => {
        if ('development' === process.env.NODE_ENV) {
            await getRespondedores();
        }
    },
    down: () =>{}
}
