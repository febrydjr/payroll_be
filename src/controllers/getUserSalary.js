const { User, Salary, Role } = require("../models");

exports.getSalaryByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({
      where: { user_id },
      include: [
        {
          model: Salary,
          attributes: ["perhour_salary", "monthly_salary", "total_salary"],
        },
        {
          model: Role,
          attributes: ["role_name"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email, fullname, Role: role, Salary: salary } = user;

    return res.status(200).json({
      username,
      fullname,
      email,
      role_name: role.role_name,
      perhour_salary: salary.perhour_salary,
      monthly_salary: salary.monthly_salary,
      total_salary: salary.total_salary,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
