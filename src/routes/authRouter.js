const express = require("express");
const router = express.Router();
const login = require("../controllers/login");
const register = require("../controllers/register");
const getAllUsers = require("../controllers/getAllUser");
const sendLink = require("../controllers/sendLink");
const { validator } = require("../middleware");

router.get("/", getAllUsers.getAllUsers);
router.post(
  "/login",
  validator.loginValidator,
  validator.ValidationResult,
  login.login
); //login
router.post("/send-link", sendLink.sendLink);
router.post("/register", register.register);

module.exports = router;
