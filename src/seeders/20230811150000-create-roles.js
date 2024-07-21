"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminUuid = uuidv4();
    const employeeUuid = uuidv4();

    await queryInterface.bulkInsert("Roles", [
      {
        role_id: adminUuid,
        role_name: "admin",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: employeeUuid,
        role_name: "employee",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
