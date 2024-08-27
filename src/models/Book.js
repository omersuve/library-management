module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define("Book", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Book;
};
