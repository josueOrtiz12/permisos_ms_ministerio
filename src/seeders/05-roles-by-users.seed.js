'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add seed data for the RolesByUsers model
    await queryInterface.bulkInsert('rolesByUsers', [
      {
        id: 1,
        userId: 1, // Assuming user with ID 1 exists
        roleId: 1, // Assuming role with ID 1 exists
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        userId: 2, // Assuming user with ID 2 exists
        roleId: 2, // Assuming role with ID 2 exists
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more seed data as needed
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove seed data if needed
    await queryInterface.bulkDelete('rolesByUsers', null, {});
  },
};
