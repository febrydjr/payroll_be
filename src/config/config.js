const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
import mysql2 from "mysql2";

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectModule: mysql2,
    dialectOptions: {
      ssl: {
        ca: process.env.DB_CA,
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectModule: mysql2,
    dialectOptions: {
      ssl: {
        ca: process.env.DB_CA,
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectModule: mysql2,
    dialectOptions: {
      ssl: {
        ca: process.env.DB_CA,
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
