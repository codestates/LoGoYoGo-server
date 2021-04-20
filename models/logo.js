"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class logo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  logo.init(
    {
      userId: DataTypes.INTEGER,
      name: DataTypes.TEXT,
      setting: DataTypes.STRING,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "logo",
    },
  );
  return logo;
};
