'use strict';

module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    body: {
      type: DataTypes.STRING,
      allowNull: false
    },

    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }

  }, {});

  Post.associate = function (models) {

    Post.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });

    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments"
    });

    Post.hasMany(models.Vote, {
      foreignKey: "postId",
      as: "votes"
    });

    Post.hasMany(models.Favorite, {
      foreignKey: "postId",
      as: "favorites"
    });

    Post.afterCreate((post, callback) => {
      return models.Favorite.create({
        userId: post.userId,
        postId: post.id
      });
    });

    Post.afterCreate((post, callback) => {
      debugger;
      return models.Vote.create({
        userId: post.userId,
        postId: post.id,
        value: 1
      });
    });
  };

  Post.prototype.getPoints = function () {

    //check to see if the post has any votes. If not, return 0.
    if (this.votes.length === 0) return 0;

    // If a post has votes, get a count of all values, add them and return the result. 
    return this.votes
      .map((v) => { return v.value })
      .reduce((prev, next) => { return prev + next });
  };

  Post.prototype.hasUpvoteFor = function (userId) {
    //check to see if the post has any votes. If not, return false.
    if (this.votes.length === 0) return false;

    return this.votes
      .map(vote => {
        if (vote.userId === userId && vote.value === 1) {
          return true;
        }
      })
  };

  Post.prototype.hasDownvoteFor = function (userId) {
    //check to see if the post has any votes. If not, return false.
    if (this.votes.length === 0) return false;

    return this.votes
      .map(vote => {
        if (vote.userId === userId && vote.value === -1) {
          return true;
        }
      })
  };

  Post.prototype.getFavoriteFor = function (userId) {
    return this.favorites.find((favorite) => { return favorite.userId == userId });
  };


  return Post;
};