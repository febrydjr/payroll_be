"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Logging, { foreignKey: "user_id" });
      this.belongsTo(models.Role, { foreignKey: "role_id" });
      this.hasOne(models.Salary, { foreignKey: "user_id" });
      this.hasMany(models.Salarylog, { foreignKey: "user_id" }); // Add this association
    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.UUID,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      fullname: DataTypes.STRING,
      birthdate: DataTypes.DATEONLY,
      join_date: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "User",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return User;
};
