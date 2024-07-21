"use strict";

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("Admin12@", 10);
    const adminUuid = uuidv4();

    return queryInterface.bulkInsert("Users", [
      {
        user_id: adminUuid,
        username: "admin",
        password: hashedPassword,
        email: "admin@gmail.com",
        fullname: "Admin User",
        birthdate: "1990-01-01",
        join_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", { username: "admin" });
  },
};
