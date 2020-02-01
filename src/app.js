require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const { importSchema } = require('graphql-import');
const resolvers = require('./graphql/resolvers');
const  context = require('./config/context')

const schemaPath = 'src/graphql/schemas/index.graphql';
const server = new ApolloServer({
    typeDefs: importSchema(schemaPath),
    resolvers,
    context
});

// server.listen();

server
  .listen()
  .then(({ url }) => {
    console.clear();
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


// const { sequelize } = require('./models');
// sequelize
//   .sync({force: true})
//   // .sync()
//   .then(() => {

//     server
//       .listen()
//       .then(({ url }) => {

//         console.log("---------------------");
//         console.log(`Executando em ${url}`);
//         console.log("---------------------");
//       })
//       .catch(err => {

//         console.log("......................");
//         console.log(`Server error`);
//         console.log("......................");
//         console.log(err);

//       });

//   })
//   .catch(err => {

//     console.log("......................");
//     console.log(`Sequelize error`);
//     console.log("......................");
//     console.log(err);
//   });
