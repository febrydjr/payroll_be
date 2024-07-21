const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const setSalary = require("../controllers/setSalary");
const getUserSalary = require("../controllers/getUserSalary");
const getAllUsersWithSalaries = require("../controllers/getAllUserSalary");
const getAttendanceLogs = require("../controllers/attendanceLogs");
const getAllAttendanceLogs = require("../controllers/attendanceLogsAll");
const payroll = require("../controllers/payroll");
const getTodaySalary = require("../controllers/getTodaySalary");

router.get("/payroll/:user_id", payroll.payroll);
router.get(
  "/attendance/:user_id",
  authenticate,
  getAttendanceLogs.getAttendanceLogs
);
router.get("/attendance", getAllAttendanceLogs.getAllAttendanceLogs);
router.get("/", getAllUsersWithSalaries.getAllUsersWithSalaries);
router.post("/set", setSalary.setSalary);
router.get("/:user_id", getUserSalary.getSalaryByUserId);

router.get("/today/:id", getTodaySalary.getTodaySalary);
router.get("/month/:id", getTodaySalary.getThisMonthSalary);
router.get("/lastmonth/:id", getTodaySalary.getLastMonthSalary);
router.get("/year/:id", getTodaySalary.getThisYearSalary);
router.get("/lastyear/:id", getTodaySalary.getLastYearSalary);

module.exports = router;
