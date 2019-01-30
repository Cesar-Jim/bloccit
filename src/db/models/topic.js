'use strict';
module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define('Topic', {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});

  Topic.associate = function (models) {
    // Association with banners:
    Topic.hasMany(models.Banner, {
      foreignKey: "topicId",
      as: "banners",
    });

    // Association with rules:
    Topic.hasMany(models.Rule, {
      foreignKey: "topicId",
      as: "rules",
    });

  };




  return Topic;
};