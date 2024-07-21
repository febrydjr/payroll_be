const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Salarylog extends Model {
    static associate(models) {
      Salarylog.belongsTo(models.User, { foreignKey: "user_id" }); // Make sure this association exists
    }
  }
  Salarylog.init(
    {
      salaryLog_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
      },
      day: {
        type: DataTypes.STRING, // example: "1"
      },
      month: {
        type: DataTypes.STRING, // example: "12"
      },
      year: {
        type: DataTypes.STRING, // example: "2022"
      },
      getted_salary: {
        type: DataTypes.FLOAT, // example: "1000.00"
      },
    },
    {
      sequelize,
      modelName: "Salarylog",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Salarylog;
};
