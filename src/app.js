const { ApolloServer, gql } = require('apollo-server');
const { importSchema } = require('graphql-import');
const resolvers = require('./graphql/resolvers');

const schemaPath = 'src/graphql/schemas/index.graphql';
const server = new ApolloServer({
  typeDefs: importSchema(schemaPath),
  resolvers
});


const { sequelize } = require('./models');
sequelize
  .sync()
  .then(() => {

    server
      .listen()
      .then(({ url }) => {
        const { User } = require('./models');

        User.create({ name: 'Claudio', email: 'claudio@rocketseat.com.br', password: '123456' });
        console.log(`Executando em ${url}`);
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  });


