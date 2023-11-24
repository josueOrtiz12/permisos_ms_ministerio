'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add seed data here
    await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        name: 'Admin',
        description: 'Administrator role',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
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
