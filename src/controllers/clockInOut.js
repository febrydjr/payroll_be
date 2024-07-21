const { User, Logging, Salary, Salarylog } = require("../models");
const { Sequelize } = require("sequelize");

exports.clockIn = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const getToday = new Date().setHours(0, 0, 0, 0);

    const todayDate = new Date(getToday);
    const today = {
      date: todayDate.getDate(),
      month: todayDate.getMonth() + 1, // Months are zero-indexed, so add 1
      year: todayDate.getFullYear(),
    };

    const checkThisDayAlreadyClockedIn = await Salarylog.findOne({
      where: {
        user_id: user.user_id,
        day: today.date,
        month: today.month,
        year: today.year,
      },
    });

    if (checkThisDayAlreadyClockedIn) {
      return res.status(400).json({ message: "You already clocked in today" });
    }

    const latestLog = await Logging.findOne({
      where: {
        user_id: user.user_id,
        clockOut: null,
        clockIn: {
          [Sequelize.Op.between]: [
            new Date().setHours(0, 0, 0, 0),
            new Date().setHours(23, 59, 59, 999),
          ],
        },
      },
      order: [["clockIn", "DESC"]],
    });

    if (latestLog) {
      return res
        .status(400)
        .json({ message: "You need to clock out before clocking in" });
    }

    await Logging.create({
      user_id: user.user_id,
      clockIn: new Date(),
    });

    return res.status(200).json({ message: "Clock-in successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.clockOut = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({
      where: { username },
      include: [Salary],
    });

    const checkAlreadyClocledIn = await Logging.findOne({
      where: {
        user_id: user.user_id,
        clockOut: null,
        clockIn: {
          [Sequelize.Op.between]: [
            new Date().setHours(0, 0, 0, 0),
            new Date().setHours(23, 59, 59, 999),
          ],
        },
      },
    });

    if (!checkAlreadyClocledIn) {
      return res
        .status(400)
        .json({ message: "You need to clock in before clocking out" });
    }


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const getToday = new Date().setHours(0, 0, 0, 0);

    const todayDate = new Date(getToday);
    const today = {
      date: todayDate.getDate(),
      month: todayDate.getMonth() + 1, // Months are zero-indexed, so add 1
      year: todayDate.getFullYear(),
    };

    const checkThisDayAlreadyClockedIn = await Salarylog.findOne({
      where: {
        user_id: user.user_id,
        day: today.date,
        month: today.month,
        year: today.year,
      },
    });

    if (checkThisDayAlreadyClockedIn) {
      return res.status(400).json({ message: "You already clocked in today" });
    }

    const latestLog = await Logging.findOne({
      where: {
        user_id: user.user_id,
        clockOut: null,
        clockIn: {
          [Sequelize.Op.between]: [
            new Date().setHours(0, 0, 0, 0),
            new Date().setHours(23, 59, 59, 999),
          ],
        },
      },
      order: [["clockIn", "DESC"]],
    });

    const currentTime = new Date();

    if (latestLog) {
      const workMinutes = Math.min(
        480,
        (currentTime - latestLog.clockIn) / (1000 * 60)
      );

      const perMinuteSalary = (user.Salary.perhour_salary || 0) / 60;
      const earnings = perMinuteSalary * workMinutes;

      await Logging.update(
        { clockOut: currentTime },
        { where: { logging_id: latestLog.logging_id } }
      );
      const currentTotalSalary = user.Salary.total_salary || 0;
      const newTotalSalary = currentTotalSalary + earnings;
      await Salary.update(
        { total_salary: newTotalSalary },
        { where: { user_id: user.user_id } }
      );
      const getToday = new Date().setHours(0, 0, 0, 0);

      const todayDate = new Date(getToday);
      const today = {
        date: todayDate.getDate(),
        month: todayDate.getMonth() + 1, // Months are zero-indexed, so add 1
        year: todayDate.getFullYear(),
      };

      await Salarylog.create({
        user_id: user.user_id,
        day: today.date,
        month: today.month,
        year: today.year,
        getted_salary: earnings,
      });

      return res.status(200).json({
        message: "Clock-out successful",
        totalSalary: newTotalSalary,
        TodayEarnings: earnings,
      });
    } else {
      const previousDayLogs = await Logging.findAll({
        where: {
          user_id: user.user_id,
          clockOut: {
            [Sequelize.Op.between]: [
              new Date().setHours(0, 0, 0, 0),
              new Date().setHours(23, 59, 59, 999),
            ],
          },
        },
        order: [["clockIn", "ASC"]],
      });

      const previousDayWorkMinutes = previousDayLogs.reduce(
        (totalMinutes, log) =>
          totalMinutes +
          Math.min(480, (log.clockOut - log.clockIn) / (1000 * 60)),
        0
      );

      const previousDayEarnings =
        ((user.Salary.perhour_salary || 0) / 60) * previousDayWorkMinutes * 0.5;

      const currentTotalSalary = user.Salary.total_salary || 0;
      const newTotalSalary = currentTotalSalary + previousDayEarnings;
      await Salary.update(
        { total_salary: newTotalSalary },
        { where: { user_id: user.user_id } }
      );

      const getToday = new Date().setHours(0, 0, 0, 0);

      const todayDate = new Date(getToday);
      const today = {
        date: todayDate.getDate(),
        month: todayDate.getMonth() + 1, // Months are zero-indexed, so add 1
        year: todayDate.getFullYear(),
      };

      await Salarylog.create({
        user_id: user.user_id,
        day: today.date,
        month: today.month,
        year: today.year,
        getted_salary: previousDayEarnings,
      });

      return res.status(200).json({
        message:
          "Clock-out successful (50% rate applied for the forgotten day)",
        totalSalary: newTotalSalary,
        TodayEarnings: previousDayEarnings,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
