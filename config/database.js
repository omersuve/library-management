const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASS,
  DB: process.env.DB_NAME,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
