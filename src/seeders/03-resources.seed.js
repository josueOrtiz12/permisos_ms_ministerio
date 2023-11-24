'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add seed data for the Resource model
    await queryInterface.bulkInsert('resources', [
      {
        id: 1,
        name: 'Resource 1',
        description: 'Description for Resource 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Resource 2',
        description: 'Description for Resource 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more seed data as needed
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove seed data if needed
    await queryInterface.bulkDelete('resources', null, {});
  },
};
