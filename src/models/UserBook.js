module.exports = (sequelize, Sequelize) => {
  const UserBooks = sequelize.define(
    "UserBook",
    {
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        field: "userId",
      },
      bookId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Books",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        field: "bookId",
      },
      userScore: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      category: {
        type: Sequelize.ENUM("past", "present"),
        allowNull: false,
      },
    },
    {
      primaryKey: ["userId", "bookId"],
    }
  );

  return UserBooks;
};
