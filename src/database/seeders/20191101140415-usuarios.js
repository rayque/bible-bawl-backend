const bcrypt = require('bcryptjs');

const password = '123';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('usuarios',
    [
      {
        nome: 'Rayque Oliveira',
        email: 'rayque@email.com',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Walter White',
        email: 'hisenberg@brba.com',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('usuarios', null, {}),
};
