const {ApolloServer, gql} = require('apollo-server');

const typeDefs = gql`
    type Query {
        foo: String
    }
`;

const resolvers = {
  Query: {
    foo() {
      return "bar";
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});


server.listen().then(({url}) => {
  console.log(`Executando na porta ${url}`);
});
