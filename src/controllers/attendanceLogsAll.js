const { User, Logging, Salary } = require("../models");
const { Sequelize } = require("sequelize");

exports.getAllAttendanceLogs = async (req, res) => {
  try {
    const users = await User.findAll();
    const attendanceData = [];

    for (const user of users) {
      const attendanceLogs = await Logging.findAll({
        where: {
          user_id: user.user_id,
        },
        order: [["clockIn", "DESC"]],
      });

      const salary = await Salary.findOne({ where: { user_id: user.user_id } });

      attendanceLogs.forEach((log) => {
        const schedule_in = new Date(log.clockIn);
        schedule_in.setHours(8, 0, 0, 0); // Schedule in at 08:00 AM

        const schedule_out = new Date(log.clockIn);
        schedule_out.setHours(16, 0, 0, 0); // Schedule out at 16:00 PM

        const total_salary = salary ? salary.total_salary : 0;

        const attendanceEntry = {
          date: log.clockIn,
          fullname: user.fullname,
          schedule_in: "08.00",
          schedule_out: "16.00",
          clockIn: log.clockIn.toLocaleTimeString(),
          clockOut: log.clockOut ? log.clockOut.toLocaleTimeString() : "-",
          total_salary: total_salary,
        };

        attendanceData.push(attendanceEntry);
      });
    }

    return res.status(200).json(attendanceData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
