const  { Respondedor }  = require('../models')
class AuxiliarService {
    async novoRespondedor(nome) {
        try {
            const respondedor = await Respondedor.findAll({
                where: {
                    nome,
                },
            });

            if (respondedor.length) {
                throw new Error('Já existe um auxiliar com este nome.');
            }

            const codAcesso = Math.floor(Math.random() * 1000)  + 1000;
            return await Respondedor.create({ nome, cod_acesso: codAcesso });
        } catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = new AuxiliarService();