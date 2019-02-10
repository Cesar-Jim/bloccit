const Comment = require("./models").Comment;
const Post = require("./models").Post;
const User = require("./models").User;

const Authorizer = require("../policies/comment");

module.exports = {

  // Call create on  Comment and pass the object in to create the comment requested.
  createComment(newComment, callback) {
    return Comment.create(newComment)
      .then((comment) => {
        callback(null, comment);
      })
      .catch((err) => {
        callback(err);
      });
  },

  // Query the comments table for the right comment and pass it and the user to the policy instance.
  deleteComment(req, callback) {
    return Comment.findById(req.params.id)
      .then((comment) => {
        const authorized = new Authorizer(req.user, comment).destroy();

        if (authorized) {
          comment.destroy();
          callback(null, comment)
        } else {
          req.flash("notice", "You are not authorized to do that.")
          callback(401)
        }
      })
  }

}