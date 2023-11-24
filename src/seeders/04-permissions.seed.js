'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add seed data for the Permission model
    await queryInterface.bulkInsert('permissions', [
      {
        roleId: 1, // Assuming role with ID 1 exists
        resourceId: 1, // Assuming resource with ID 1 exists
        execute: true,
        read: true,
        write: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 1, // Assuming role with ID 2 exists
        resourceId: 2, // Assuming resource with ID 2 exists
        execute: true,
        read: true,
        write: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more seed data as needed
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove seed data if needed
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
