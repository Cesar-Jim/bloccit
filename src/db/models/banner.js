'use strict';
module.exports = (sequelize, DataTypes) => {
  const Banner = sequelize.define('Banner', {
    source: DataTypes.STRING,
    description: DataTypes.STRING,
    topicId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "Topics",
        key: "id",
        as: "topicId",
      }
    }
  }, {});

  Banner.associate = function (models) {
    // associations can be defined here
    // Associate banner objects with Topic objects
    // The associate method is called at runtime, and the associations defined here are bound.
    // belongsTo is used to indicate what foreign key to use in the banners table
    // onDelete specifies what happens when we delete an object a banner belongs to
    Banner.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE",
    });
  };

  return Banner;
};