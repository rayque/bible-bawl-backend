const {ApolloServer, gql} = require('apollo-server');
const {importSchema} = require('graphql-import');


const resolvers = {
  Query: {
    ola() {
      return "foo bar ...";
    }
  }
};

const server = new ApolloServer({
  typeDefs: importSchema('./schemas/index.graphql'),
  resolvers
});


server.listen().then(({url}) => {
  console.log(`Executando na porta ${url}`);
});
