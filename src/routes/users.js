const express = require("express");

const {
  createUserSchema,
  returnBookSchema,
  validateRequest,
} = require("../validations");

const db = require("../models");

const User = db.user;
const Book = db.book;
const UserBooks = db.userBook;

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Book,
          as: "books",
          through: {
            attributes: ["userScore", "category"],
          },
        },
      ],
    });

    if (user) {
      const books = user.books.reduce(
        (acc, book) => {
          const { category, userScore } = book.UserBook || {};

          if (!acc[category]) {
            acc[category] = [];
          }

          const bookData = {
            name: book.name,
          };
          if (category === "past") {
            bookData.userScore = userScore !== null ? userScore : -1;
          }

          acc[category].push(bookData);
          return acc;
        },
        { past: [], present: [] }
      );

      res.json({
        id: user.id,
        name: user.name,
        books,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", validateRequest(createUserSchema), async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/borrow/:bookId", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    const book = await Book.findByPk(req.params.bookId);

    if (!user || !book) {
      return res.status(404).json({ error: "User or Book not found" });
    }

    const existingBorrow = await UserBooks.findOne({
      where: {
        bookId: book.id,
        category: "present",
      },
    });

    if (existingBorrow) {
      return res.status(400).json({
        error: "Book has already borrowed and has not returned yet.",
      });
    }

    const userHadBefore = await UserBooks.findOne({
      where: {
        userId: user.id,
        bookId: book.id,
        category: "past",
      },
    });

    if (userHadBefore) {
      userHadBefore.category = "present";
      await userHadBefore.save();
    } else {
      await UserBooks.create({
        userId: user.id,
        bookId: book.id,
        category: "present",
      });
    }

    res.json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/:id/return/:bookId",
  validateRequest(returnBookSchema),
  async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      const book = await Book.findByPk(req.params.bookId);

      if (!user || !book) {
        return res.status(404).json({ error: "User or Book not found" });
      }

      const existingBorrow = await UserBooks.findOne({
        where: {
          userId: user.id,
          bookId: book.id,
        },
      });

      if (!existingBorrow) {
        return res.status(400).json({
          error: "User has not borrowed this book.",
        });
      }

      if (existingBorrow && existingBorrow.category == "past") {
        return res.status(400).json({
          error: "Book has already returned by the given User.",
        });
      }

      const { score } = req.body;

      existingBorrow.userScore = score;
      existingBorrow.category = "past";
      await existingBorrow.save();

      res.json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
