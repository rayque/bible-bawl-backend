const { ApolloServer, gql } = require('apollo-server');
const { importSchema } = require('graphql-import');
const resolvers = require('./graphql/resolvers');

const schemaPath = 'src/graphql/schemas/index.graphql';
const server = new ApolloServer({
  typeDefs: importSchema(schemaPath),
  resolvers,
});


// server
//   .listen()
//   .then(({ url }) => {
//
//     console.log("---------------------");
//     console.log(`Executando em ${url}`);
//     console.log("---------------------");
//   })
//   .catch(err => {
//
//     console.log("......................");
//     console.log(`Server error`);
//     console.log("......................");
//     console.log(err);
//
//   });


const { sequelize } = require('./models');

sequelize
  .sync({ force: true })
  // .sync()
  .then(() => {
    server
      .listen()
      .then(({ url }) => {
        console.log('---------------------');
        console.log(`Executando em ${url}`);
        console.log('---------------------');
      })
      .catch((err) => {
        console.log('......................');
        console.log('Server error');
        console.log('......................');
        console.log(err);
      });
  })
  .catch((err) => {
    console.log('......................');
    console.log('Sequelize error');
    console.log('......................');
    console.log(err);
  });
