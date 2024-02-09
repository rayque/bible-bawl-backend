const faker = require('faker');
// faker.locale = "pt_BR";

const AuxiliarService =  require('../../services/auxiliarService')


const getRespondedores = async () => {
    console.log();
    console.log("--------------- AUXILIARES FAKE ---------------");
    console.log();

    for (let i = 0; i < 10; i++) {
        const nome = faker.name.firstName() + ' ' + faker.name.lastName();
        await AuxiliarService.novoRespondedor(nome);
    }
}


module.exports = {
    up: async () => {
         if ('true' === process.env.APP_COPA_FAKE) {
            await getRespondedores();
        }
    },
    down: () =>{}
}
