const faker = require('faker');
faker.locale = "pt_BR";
const EquipeService = require('../../services/equipeService');

module.exports = {
    up: async (queryInterface) => {
        await setEquipes();
    },

    down: (queryInterface) => queryInterface.bulkDelete('equipes', null, {}),
};

const qtdEquipes = 20;

async function setEquipes() {
    let categoria = 1;
    for (let equipe = 1; equipe <= qtdEquipes; equipe += 1) {

        if (equipe === 7 || equipe === 13) {
            categoria++;
        }

        let nascimento = getNascimento(categoria);
        const dados = getParticipantes(nascimento);
        await EquipeService.novaEquipe({dados});
    }
}


function getParticipantes(nascimento) {
    const membros = [];
    for (let participante = 1; participante <= 4; participante += 1) {
        const membro = {
            nome: faker.name.findName(),
            data_nascimento: nascimento,
        };

        membros.push(membro);
    }
    return membros;
}

const getNascimento = (categoria) => {
    const datas = {
        1: () => '2010-10-10',
        2: () => '1995-10-10',
        3: () => '1980-10-10',
    };
    return (datas[categoria])();
};