/* Gerar todas as seed para copa fake */
const copaFakeSeed = true;

/* Gerar seed  somente auxiliares e equipes */
const auxiliaresSeed = true;
const equipesSeed = true;

const runSeed = {
    auxiliares: copaFakeSeed || auxiliaresSeed,
    equipes: copaFakeSeed || equipesSeed,
    copaFake: copaFakeSeed,
    deletarRespostas: true,
};

module.exports = runSeed;