'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add seed data here
    await queryInterface.bulkInsert('roles', [
      {
        name: 'Admin',
        description: 'Administrator role',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'User',
        description: 'Regular user role',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove seed data here
    await queryInterface.bulkDelete('roles', null, {});
  },
};
