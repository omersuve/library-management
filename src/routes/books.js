const express = require("express");

const { createBookSchema, validateRequest } = require("../validations");

const db = require("../models");

const sequelize = db.sequelize;
const Book = db.book;
const UserBooks = db.userBook;

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const books = await Book.findAll({
      attributes: ["id", "name"],
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      let avgScore = -1;

      try {
        const averageScore = await UserBooks.findOne({
          where: { bookId: req.params.id },
          attributes: [
            [sequelize.fn("AVG", sequelize.col("userScore")), "avgScore"],
          ],
        });

        if (
          averageScore &&
          averageScore.dataValues &&
          averageScore.dataValues.avgScore !== null
        ) {
          avgScore = parseFloat(averageScore.dataValues.avgScore);
        }
      } catch (queryError) {
        console.warn("Error querying average score: ", queryError.message);
      }

      res.json({
        id: book.id,
        name: book.name,
        score: avgScore,
      });
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", validateRequest(createBookSchema), async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
