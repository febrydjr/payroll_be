const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Salary extends Model {
    static associate(models) {
      Salary.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  Salary.init(
    {
      salary_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
      },
      perhour_salary: {
        type: DataTypes.FLOAT,
      },
      monthly_salary: {
        type: DataTypes.FLOAT,
      },
      total_salary: {
        type: DataTypes.FLOAT,
      },
    },
    {
      sequelize,
      modelName: "Salary",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Salary;
};
