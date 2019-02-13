const User = require("./models").User;
const bcrypt = require("bcryptjs");
const Post = require("./models").Post;
const Comment = require("./models").Comment;

module.exports = {
  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
      .then((user) => {
        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      })
  },

  getUser(id, callback) {
    // Define a result object to hold the user, posts, and comments that 
    // we will return and request the User object from the database.
    let result = {};
    User.findById(id)
      .then((user) => {
        // If no user returns, we return an error.
        if (!user) {
          callback(404);
        } else {
          // Otherwise, we store the resulting user.
          result["user"] = user;
          // Otherwise, we store the resulting user.
          Post.scope({ method: ["lastFiveFor", id] }).all()
            .then((posts) => {
              // Store the result in the result object.
              result["posts"] = posts;
              // Then execute the scope on Comment to get the last five comments made by the user.
              Comment.scope({ method: ["lastFiveFor", id] }).all()
                .then((comments) => {
                  // Store the result in the object and pass the object to the callback.
                  result["comments"] = comments;
                  callback(null, result);
                })
                .catch((err) => {
                  callback(err);
                })
            })
        }
      })
  }
}