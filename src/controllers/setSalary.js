const { Salary, User, sequelize } = require("../models");

exports.setSalary = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { username, perhour_salary, monthly_salary } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    let salary = await Salary.findOne({ where: { user_id: user.user_id } });

    if (!salary) {
      salary = await Salary.create(
        {
          user_id: user.user_id,
          perhour_salary: perhour_salary !== undefined ? perhour_salary : null,
          monthly_salary: monthly_salary !== undefined ? monthly_salary : null,
        },
        { transaction: t }
      );
    } else {
      await Salary.update(
        {
          perhour_salary:
            perhour_salary !== undefined
              ? perhour_salary
              : salary.perhour_salary,
          monthly_salary:
            monthly_salary !== undefined
              ? monthly_salary
              : salary.monthly_salary,
        },
        { where: { user_id: user.user_id }, transaction: t }
      );
    }

    await t.commit();

    return res.status(200).json({ message: "Salary updated successfully" });
  } catch (error) {
    console.error(error);
    await t.rollback(); // Rollback the transaction in case of an error
    return res.status(500).json({ message: "Internal server error" });
  }
};
