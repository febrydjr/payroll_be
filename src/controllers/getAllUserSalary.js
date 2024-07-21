const { User, Salary, Role, Salarylog } = require("../models");
const { Sequelize, Op } = require("sequelize");

exports.getAllUsersWithSalaries = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["user_id", "username", "fullname"],
      include: [
        {
          model: Salary,
          attributes: ["perhour_salary", "monthly_salary"],
          required: true,
        },
        {
          model: Role,
          attributes: ["role_name"],
        },
        {
          model: Salarylog,
          attributes: [],
          where: {
            month: (new Date().getMonth() + 1).toString(), // current month
            year: new Date().getFullYear().toString(), // current year
          },
          required: false,
        },
      ],
    });

    // Summing up salaries for each user
    const usersWithSalaries = await Promise.all(
      users.map(async (user) => {
        const totalSalary = await Salarylog.sum("getted_salary", {
          where: {
            user_id: user.user_id,
            month: (new Date().getMonth() + 1).toString(),
            year: new Date().getFullYear().toString(),
          },
        });
        return {
          ...user.get({ plain: true }),
          total_salary: totalSalary || 0,
        };
      })
    );

    return res.status(200).json({ users: usersWithSalaries });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
