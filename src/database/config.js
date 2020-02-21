/* Gerar todas as seed para copa fake */
const copaFakeSeed = false;

/* Gerar seed  somente auxiliares e equipes */
const auxiliaresSeed = false;
const equipesSeed = false;

const runSeed = {
    auxiliares: copaFakeSeed || auxiliaresSeed,
    equipes: copaFakeSeed || equipesSeed,
    copaFake: copaFakeSeed,
};

module.exports = runSeed;