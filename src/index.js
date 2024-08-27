const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { userRouter, bookRouter } = require("./routes");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const db = require("./models");

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});

app.get("/", (req, res) => {
  res.send("Hello Invent Analytics!");
});

app.use(express.json());
app.use(cors());
app.use("/books", bookRouter);
app.use("/users", userRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({ status: "fail" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
