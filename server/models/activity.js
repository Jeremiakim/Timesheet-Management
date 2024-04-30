"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Activity.belongsTo(models.Employee, { foreignKey: "employeeId" });
    }
  }
  Activity.init(
    {
      activityTitle: DataTypes.STRING,
      projectName: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
      duration: DataTypes.INTEGER,
      employeeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Activity",
    }
  );
  return Activity;
};
