const path = require("path");
const { body, validationResult } = require("express-validator");
require("dotenv").config({
  path: path.resolve("../../.env"),
});

const identifier = body("identifier").notEmpty().withMessage("ID is empty");
const email = body("email").isEmail().notEmpty().withMessage("Email is empty");
const password = body("password").notEmpty().withMessage("Password is empty");

function ValidationResult(req, res, next) {
  const { errors } = validationResult(req);
  if (errors.length > 0) return res.status(400).json(errors);
  next();
}

const loginValidator = [email, password];

module.exports = {
  loginValidator,
  ValidationResult,
};
