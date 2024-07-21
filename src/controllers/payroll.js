const { User, Salary, Logging } = require("../models");

exports.payroll = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { range } = req.query;

    const user = await User.findByPk(user_id, {
      include: Salary,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salary = user.Salary;
    if (!salary) {
      return res.status(404).json({ message: "Salary information not found" });
    }

    let startDate, endDate;
    const currentDate = new Date();

    if (range === "monthly") {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
    } else if (range === "yearly") {
      startDate = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      endDate = currentDate;
    } else {
      return res.status(400).json({ message: "Invalid range parameter" });
    }

    const totalEarningsFormatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(salary.total_salary);

    return res.status(200).json({
      user_id: user.user_id,
      fullname: user.fullname,
      range,
      startDate,
      endDate,
      totalEarnings: totalEarningsFormatted,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
