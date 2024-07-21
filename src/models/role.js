"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      this.hasMany(models["User"], { foreignKey: "role_id" });
    }
  }

  Role.init(
    {
      role_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      role_name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Role",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Role;
};
