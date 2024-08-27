const Joi = require("joi");

const createUserSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = {
  createUserSchema,
};
