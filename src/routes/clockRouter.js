const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const clockInOutController = require("../controllers/clockInOut");

router.post("/in", authenticate, clockInOutController.clockIn);
router.post("/out", authenticate, clockInOutController.clockOut);

module.exports = router;
