const { User, Salarylog } = require("../models");
const { Sequelize, Op } = require("sequelize");

exports.getTodaySalary = async (req, res) => {
  try {
    const { id } = req.params;

    const getSalary = await Salarylog.findOne({
      where: {
        user_id: id,
        day: new Date().getDate().toString(),
        month: (new Date().getMonth() + 1).toString(), // Month is zero-based
        year: new Date().getFullYear().toString(),
      },
    });

    if (!getSalary) {
      return res.status(404).json({ error: "Salary not found for today." });
    }

    return res.status(200).json({ revenue: getSalary.getted_salary });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the salary." });
  }
};

exports.getThisMonthSalary = async (req, res) => {
  try {
    const { id } = req.params;

    const currentMonth = (new Date().getMonth() + 1).toString(); // Month is zero-based
    const currentYear = new Date().getFullYear().toString();

    const getSalary = await Salarylog.findOne({
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("getted_salary")), "total_salary"],
      ],
      where: {
        user_id: id,
        month: currentMonth,
        year: currentYear,
      },
    });

    if (!getSalary || getSalary.dataValues.total_salary === null) {
      return res
        .status(404)
        .json({ error: "Salary not found for this month." });
    }

    return res.status(200).json({ revenue: getSalary.dataValues.total_salary });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the salary." });
  }
};

exports.getLastMonthSalary = async (req, res) => {
  try {
    const { id } = req.params;

    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth(); // handle December correctly
    const lastYear =
      now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    const getSalary = await Salarylog.findOne({
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("getted_salary")), "total_salary"],
      ],
      where: {
        user_id: id,
        month: lastMonth.toString(),
        year: lastYear.toString(),
      },
    });

    if (!getSalary || getSalary.dataValues.total_salary === null) {
      return res
        .status(404)
        .json({ error: "Salary not found for last month." });
    }

    return res.status(200).json({ revenue: getSalary.dataValues.total_salary });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the salary." });
  }
};

exports.getLastYearSalary = async (req, res) => {
  try {
    const { id } = req.params;

    const today = new Date();
    const lastYear = new Date();
    lastYear.setDate(today.getDate() - 365);

    const getSalary = await Salarylog.findOne({
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("getted_salary")), "total_salary"],
      ],
      where: {
        user_id: id,
        created_at: {
          [Op.between]: [lastYear, today],
        },
      },
    });

    if (!getSalary || getSalary.dataValues.total_salary === null) {
      return res
        .status(404)
        .json({ error: "Salary not found for the last year." });
    }

    return res.status(200).json({ revenue: getSalary.dataValues.total_salary });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the salary." });
  }
};

exports.getThisYearSalary = async (req, res) => {
  try {
    const { id } = req.params;

    const currentYear = new Date().getFullYear().toString();

    const getSalary = await Salarylog.findOne({
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("getted_salary")), "total_salary"],
      ],
      where: {
        user_id: id,
        year: currentYear,
      },
    });

    if (!getSalary || getSalary.dataValues.total_salary === null) {
      return res.status(404).json({ error: "Salary not found for this year." });
    }

    return res.status(200).json({ revenue: getSalary.dataValues.total_salary });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the salary." });
  }
};
