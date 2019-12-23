const { Respostas, Equipe} = require("../models");
const { Op } = require('sequelize');

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
        console.log(e);
        throw new Error('Erro ao buscar equipes');
      });
  }

  async getPontuacaoEquipesByPegunta(pergunta_id) {
    const equipes = await Equipe.findAll({
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
    });

    const allEquipes = equipes.map(equipe => {

      let nome = equipe.nome.split(" ",2).toString();

      const respostas = equipe.participantes.map(participante => {
        return participante.perguntas[0].ParticipantePergunta.resposta;
      });

      let pontuacao = respostas.reduce((total, num) => {
        return  total + num;
      }, 0);

      pontuacao =  this.getPontosPerguntaEquipeFormatado(pontuacao);

      return {
        nome,
        pontuacao,
      }
    });
    return allEquipes;
  }

  getPontosPerguntaEquipeFormatado(acertos) {
    const hasBonus = this.hasBonus(acertos);
    return hasBonus ?  50 : acertos * 10;
  }

  getPontosPerguntaIndividualFormatado(acertos) {
    return acertos * 10;
  }

  hasBonus(acertos) {
    return  acertos === 4 ? true : false;
  }



};


module.exports = new EquipeService();
