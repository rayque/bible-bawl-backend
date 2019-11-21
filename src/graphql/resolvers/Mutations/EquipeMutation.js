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
  
  let categorias = [];
  for (let i = 0; i < participantes.length; i++) {

    idade =  moment().diff(participantes[i].data_nascimento, 'years');  
    
    const categoria = await Categoria.findAll({
      where: {
        idade_min: {
          [Op.lte ]: idade, // >=
        },
        idade_max: {
          [Op.gte]: idade, // <= 
        },
      },
    })
    .then(categorias => {
      if (!categorias.length) {
        throw new Error("Não há categoria para a idade do participante.")
      }
      return categorias[0].id
    });

    categorias.push(categoria)
  } 
  
  const totalCategorias = Array.from(new Set(categorias))

  if (totalCategorias.length != 1) {
    throw new Error("Há participantes em categorias diferentes.")
  }
  
  return categorias[0];
}
