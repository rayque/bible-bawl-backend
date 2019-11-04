const {Participante} = require('./../../../models')

module.exports = {
  async novoParticipante(_, dados) {
    try {
      console.log(dados);
      // dados.forEach(participante => {
      //   console.log("----");
      //   console.log(participante);
      // })

      Object.keys(dados.dados).forEach(function(key) {
        console.log(key);
        // var value = obj[key];
      });
      const participante =   await Participante.findAll({
        where: {
          nome: nome
        }
      });

      if (participante.length)  {
        throw new Error("Já existe um participante com este nome.");
      }

      const cod_acesso = Math.floor(Math.random() * 100000) + 100000;
      return await Participante.create({nome, cod_acesso});
    } catch (e) {
      throw new Error(e);
    }
  }
}
