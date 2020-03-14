const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('usuarios',
      [
        {
          nome: 'Rayque',
          email: 'rayque@email.com',
          password: bcrypt.hashSync("bacon", bcrypt.genSaltSync(10)),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nome: 'Erlon',
          email: 'erlon@email.com',
          password: bcrypt.hashSync("bacon", bcrypt.genSaltSync(10)),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('usuarios', null, {}),
};
