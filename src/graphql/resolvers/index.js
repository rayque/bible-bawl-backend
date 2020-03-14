const Query = require('./Query');
const Mutation = require('./Mutation');

module.exports = {
  Query,
  Mutation,
  Subscription: {
    novaPerguntaAtual: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NOVA_PERGUNTA_ATUAL')
    },
    getPontuacaoEquipesByResposta: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('PONTUACAO_EQUIPES_BY_RESPOSTA')
    }
  }

};
