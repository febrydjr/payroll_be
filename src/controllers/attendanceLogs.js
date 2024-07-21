const { User, Logging, Salary } = require("../models");
const { Sequelize } = require("sequelize");

exports.getAttendanceLogs = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const attendanceLogs = await Logging.findAll({
      where: {
        user_id: user.user_id,
      },
      order: [["clockIn", "DESC"]],
    });

    const salary = await Salary.findOne({ where: { user_id: user.user_id } });

    const attendanceData = attendanceLogs.map((log) => {
      const schedule_in = new Date(log.clockIn);
      schedule_in.setHours(8, 0, 0, 0);

      const schedule_out = new Date(log.clockIn);
      schedule_out.setHours(16, 0, 0, 0);

      const total_salary = salary ? salary.total_salary : 0;

      return {
        date: log.clockIn,
        fullname: user.fullname,
        schedule_in: "08.00",
        schedule_out: "16.00",
        clockIn: log.clockIn.toLocaleTimeString(),
        clockOut: log.clockOut ? log.clockOut.toLocaleTimeString() : "-",
        total_salary: total_salary,
      };
    });

    return res.status(200).json(attendanceData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
