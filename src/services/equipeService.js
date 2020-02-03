const { Respostas, Equipe, Participante, Categoria, StatusPergunta} = require("../models");
const { Op } = require('sequelize');
const moment = require('moment');

class EquipeService {
  async getEquipes(ids = {[Op.ne]: null}) {

    return Equipe
      .findAll({
          where: {id: ids},
          include: [
            { association: 'participantes' },
            { association: 'categoria' },
          ]
        }
      )
      .then(equipes => {
        return equipes.map(equipe => {
          let participantes = equipe.participantes || [];

          participantes = participantes.map(participante => {
            return {
              id: participante.id,
              nome: participante.nome,
              data_nascimento: participante.data_nascimento,
            }
          });

          const cat = equipe.categoria;
          let categoria = null;
          if (cat) {
            categoria = {
              id: cat.id,
              nome: cat.nome,
              descricao: cat.descricao,
              idade_min: cat.idade_min,
              idade_max: cat.idade_max,
            };
          }

          return {
            id: equipe.id,
            nome: equipe.nome,
            categoria,
            participantes
          }
        })
      })
      .catch((e) => {
        throw new Error('Erro ao buscar equipes');
      });
  }

  async getPontuacaoEquipesByPegunta(pergunta_id) {

    const status = await StatusPergunta.findOne({
      where: {nome: 'respondido'}
    });
    const categorias = await Categoria.findAll({
      include: [
        {
          association: 'equipes',
          include: [
            {
              association: 'participantes',
              include: [
                {
                  association: 'perguntas',
                  where: {id: pergunta_id}
                }
              ]
            },
          ]
        },
      ]
    });

    return categorias.map(categoria => {

      const equipes = categoria.equipes.map(equipe => {
        return equipe.participantes.map(participante => {
          let pontuacao = this.getPontuacaoIndividualFormatado(participante.perguntas[0].ParticipantePergunta.resposta);

          if (participante.perguntas[0].status_id !== status.id) {
             pontuacao = 0;
          }

          return {
            nome: participante.nome,
            pontuacao,
          };
        });
      });

      return {
        nome: categoria.nome,
        descricao: categoria.descricao,
        equipes,
      };
    });

  }

  async editarEquipe( {participantes}) {
    console.log(participantes);


    const promisses = participantes.map(participante => {
      return  Participante.update(
          {nome: participante.nome},
          {data_nascimento: participante.data_nascimento},
          {where: {id: participante.id}}
          );
    });



    const allParticipantes = await Promise.all(promises);

    console.log(allParticipantes);

    return true;


  }


  getPontuacaoIndividualFormatado(pontos) {
    return pontos ? pontos * 10 : 0;
  }

  getPontosPerguntaEquipeFormatado(acertos) {
    const hasBonus = this.hasBonus(acertos);
    return hasBonus ?  50 : acertos * 10;
  }

  getPontosPerguntaIndividualFormatado(acertos) {
    return acertos * 10;
  }

  /*
  * 4 acertos: todos os participantes acertaram aquela pergunta
  * */
  hasBonus(acertos){
    return acertos === 4;
  }

  async getCategoria(participantes = []) {
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

  async novaEquipe(dados) {
    let transaction;
    try {
      transaction = await Equipe.sequelize.transaction();
      const data = dados.dados || {};

      const catedoriaId = await this.getCategoria(data);

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
  }


};


module.exports = new EquipeService();
