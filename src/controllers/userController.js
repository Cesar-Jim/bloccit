const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {
  signUp(req, res, next) {
    res.render("users/sign_up");
  },

  create(req, res, next) {
    // Pull the values from the request's body and add them to a newUser object.
    let newUser = {
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    // Call the createUser function, passing in newUser and a callback.
    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash("error", err);
        res.redirect("/users/sign_up");

      } else {
        // If we created the user successfully, we authenticate the user by calling the  
        // authenticate method on the Passport object. Specify the strategy to use (local) 
        // and pass a function to call for an authenticated user. This function sets a message 
        // and redirects to the landing page. authenticate uses the function in  passport-config.js 
        // where we defined the local strategy.
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You have successfully signed in!");
          res.redirect("/");
        })
      }
    });
  },

  signInForm(req, res, next) {
    res.render("users/sign_in");
  },

  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function () {
      if (!req.user) {
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/sign_in");

      } else {
        req.flash("notice", "You have successfully signed in!");
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You have successfully signed out");
    res.redirect("/");
  },

  show(req, res, next) {

    // Call the getUser method, passing it the ID of the user we are trying to visit.
    userQueries.getUser(req.params.id, (err, result) => {

      // In getUser, send back an object. If the user property of result is not defined, 
      // that means we found no user with the passed in ID.
      if (err || result.user === undefined) {
        req.flash("notice", "No user found with that ID.");
        res.redirect("/")

      } else {
        // If the request was successfully handled, we render the view and pass in the unpacked object.
        res.render("users/show", { ...result });
      }
    });
  }

}