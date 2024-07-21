"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Logging extends Model {
    static associate(models) {
      this.belongsTo(models["User"], { foreignKey: "user_id" });
    }
  }

  Logging.init(
    {
      logging_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      clockIn: DataTypes.DATE,
      clockOut: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Logging",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Logging;
};
