const dbConfig = require("../../config/database.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./User.js")(sequelize, Sequelize);
db.book = require("./Book.js")(sequelize, Sequelize);
db.userBook = require("./UserBook.js")(sequelize, Sequelize);

db.user.belongsToMany(db.book, {
  through: db.userBook,
  as: "books",
  foreignKey: "userId",
});
db.book.belongsToMany(db.user, {
  through: db.userBook,
  as: "users",
  foreignKey: "bookId",
});

module.exports = db;
