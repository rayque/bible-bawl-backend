const { Op } = require('sequelize');
const moment = require('moment');
const { Equipe } = require('./../../../models');
const { Participante, Categoria } = require('./../../../models');

async function getCategoria(participantes = []) {
  const allCategorias = [];

  for (const participante of participantes) {
    const idade = moment().diff(participante.data_nascimento, 'years');

    const categorias = await Categoria.findAll({
      where: {
        idade_min: {
          [Op.lte]: idade, // >=
        },
        idade_max: {
          [Op.gte]: idade, // <=
        },
      },
    });

    if (!categorias.length) {
      throw new Error('Não há categoria para a idade do participante.');
    }

    allCategorias.push(categorias[0].id);
  }

  const totalCategorias = Array.from(new Set(allCategorias));

  if (totalCategorias.length !== 1) {
    throw new Error('Há participantes em categorias diferentes.');
  }

  return allCategorias[0];
}


module.exports = {
  async novaEquipe(_, dados) {
    let transaction;
    try {
      transaction = await Equipe.sequelize.transaction();
      const data = dados.dados || {};

      const catedoriaId = await getCategoria(data);

      // Cadastro da Equipe
      const nomes = [];
      for (let i = 0; i < data.length; i += 1) {
        const words = data[i].nome.split(' ');
        nomes.push(words[0]);
      }
      const nomeEquipe = nomes.join(' ');
      const equipe = await Equipe.create({
        nome: nomeEquipe,
        categoria_id: catedoriaId,
      },
      { transaction })
        .catch((e) => {
          throw new Error(e.errors[0].message);
        });

      // Cadastro dos Participantes
      const promises = Object.keys(data).map(async (key) => Participante.create({
        nome: data[key].nome,
        data_nascimento: data[key].data_nascimento,
        equipe_id: equipe.id,
      },
      { transaction })
        .catch((e) => {
          throw new Error(e.errors[0].message);
        }));

      const allParticipantes = await Promise.all(promises);

      const participantes = allParticipantes.map((part) => ({
        id: part.id,
        nome: part.nome,
        data_nascimento: part.data_nascimento,
      }));


      await transaction.commit();

      return {
        id: equipe.id,
        nome: equipe.nome,
        participantes,
      };
    } catch (err) {
      if (transaction) {
        transaction.rollback();
      }
      throw new Error(err);
    }
  },
};
