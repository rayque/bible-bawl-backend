const {Equipe} = require('./../../../models')
const {Participante, Categoria} = require('./../../../models')
const { Op } = require('sequelize');
const moment = require('moment')


module.exports = {
  async novaEquipe(_, dados) {
    let transaction;
    try {
      transaction = await Equipe.sequelize.transaction();
      const data = dados.dados || {};

      const catedoriaId = await getCategoria(data) 
      
      // Cadastro da Equipe
      const nomes = [];
      for (let i = 0; i < data.length; i++) {
        const words = data[i].nome.split(" ");
        nomes.push(words[0]);
      }
      const nomeEquipe = nomes.join(' ');
      const equipe = await Equipe.create({
        nome: nomeEquipe, 
        categoria_id: catedoriaId
      },
      {transaction}
      )
      .catch(e => {
        throw new Error(e.errors[0].message);
      });

      // Cadastro dos Participantes
      const promises = Object.keys(data).map(async key => {
        return Participante.create({
          nome: data[key].nome,
          data_nascimento: data[key].data_nascimento,
          equipe_id: equipe.id,
        },
        {transaction})
        .catch(e => {
          throw new Error(e.errors[0].message);
        });
      });

      const allParticipantes = await Promise.all(promises);

      const participantes = allParticipantes.map(part => {
        return {
          id: part.id,
          nome: part.nome,
          data_nascimento: part.data_nascimento,
        }
      });

      await transaction.commit();

      return {
        id: equipe.id,
        nome: equipe.nome,
        participantes
      };

    } catch (err) {
      if (transaction) {
        transaction.rollback();
      }
      throw new Error(err);
    }
  }
}


async function getCategoria(participantes = []){  
  let idades = 0;
  for (let i = 0; i < participantes.length; i++) {
    idades = idades + moment().diff(participantes[i].data_nascimento, 'years');      
  }  

  const idadeMedia = idades / participantes.length;

  return await Categoria.findAll({
    where: {
      idade_min: {
        [Op.lte ]: idadeMedia, // >=
      },
      idade_max: {
        [Op.gte]: idadeMedia, // <= 
      },
    },
  })
  .then(categorias => {
     if (!categorias.length) {
      throw new Error("Não foi possível cadastrar. Os participantes não estão na mesma categoria.");
     }
     return categorias[0].id;      
  });
  
}
