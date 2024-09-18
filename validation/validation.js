const Joi = require("joi");
const { userSchema } = require("../models/user.model");

const validateUser = Joi.object({
  username: Joi.string().min(3).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.ref("password"),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = { validateUser, forgotPasswordSchema };
