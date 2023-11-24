'use strict';
const { hashString } = require('../utils/crypto')
// const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate a hashed password
    const hashedString = hashString('yourpassword');

    // Add seed data for the User model
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        username: 'admin',
        password: hashedString,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        username: 'user',
        password: hashedString,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more seed data as needed
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove seed data if needed
    await queryInterface.bulkDelete('users', null, {});
  },
};
