const {Respondedor} = require('./../../../models')

module.exports = {
  async novoRespondedor(_, {nome}) {
    try {
      const respondedor =   await Respondedor.findAll({
        where: {
          nome: nome
        }
      });

      if (respondedor.length)  {
        throw new Error("Já existe um respondedor com este nome.");
      }

      const cod_acesso = Math.floor(Math.random() * 100000) + 100000;
      return await Respondedor.create({nome, cod_acesso});
    } catch (e) {
      throw new Error(e);
    }
  }
}
