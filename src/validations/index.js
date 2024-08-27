const { createBookSchema, returnBookSchema } = require("./book");
const { createUserSchema } = require("./user");
const validateRequest = require("./validateRequest");

module.exports = {
  createBookSchema,
  createUserSchema,
  returnBookSchema,
  validateRequest,
};
