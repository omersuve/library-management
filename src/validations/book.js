const Joi = require("joi");

const createBookSchema = Joi.object({
  name: Joi.string().required(),
});

const returnBookSchema = Joi.object({
  score: Joi.number().integer().required(),
});

module.exports = {
  createBookSchema,
  returnBookSchema,
};
