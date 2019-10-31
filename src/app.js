const { ApolloServer, gql } = require('apollo-server');
const { importSchema } = require('graphql-import');
const resolvers = require('./graphql/resolvers');

const schemaPath = 'src/graphql/schemas/index.graphql';
const server = new ApolloServer({
  typeDefs: importSchema(schemaPath),
  resolvers
});

server
  .listen()
  .then(({ url }) => {
    const { User } = require('./models');

    // User.create({ name: 'Claudio', email: 'claudio@rocketseat.com.br', password: '123456' });
    console.log("---------------------");
    console.log(`Executando em ${url}`);
    console.log("---------------------");
  })
  .catch(err => {
    console.log(err);
  });



// const { sequelize } = require('./models');
// sequelize
//   .sync()
//   .then(() => {

//     server
//       .listen()
//       .then(({ url }) => {
//         const { User } = require('./models');

//         User.create({ nome: 'Claudio', email: 'claudio@rocketseat.com.br', password: '123456' });
//         console.log("---------------------");
//         console.log(`Executando em ${url}`);
//         console.log("---------------------");
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   })
//   .catch(err => {
//     console.log(err);
//   });


