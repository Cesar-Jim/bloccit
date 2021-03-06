module.exports = {
  validatePosts(req, res, next) {
    // Check that the method used was POST and if so, use the methods provided by express-validator
    // to check URL parameters and body of the request for the validations we need.
    if (req.method === "POST") {
      // These methods return an object to which we can chain validation checkers like notEmpty and isLength.
      req
        .checkParams("topicId", "must be valid")
        .notEmpty()
        .isInt();
      req
        .checkBody("title", "must be at least 2 characters in length")
        .isLength({ min: 2 });
      req
        .checkBody("body", "must be at least 10 characters in length")
        .isLength({ min: 10 });
    }
    // Gather any validation errors.
    const errors = req.validationErrors();

    if (errors) {
      // If we find errors we need to let the user know so they adjust their input.
      req.flash("error", errors);
      return res.redirect(303, req.headers.referer);
    } else {
      return next();
    }
  },

  validateTopics(req, res, next) {
    if (req.method === "POST") {
      req
        .checkBody("title", "must be at least 5 characters in length")
        .isLength({ min: 5 });
      req
        .checkBody("description", "must be at least 10 characters in length")
        .isLength({ min: 10 });
    }

    const errors = req.validationErrors();

    if (errors) {
      req.flash("error", errors);
      return res.redirect(303, req.headers.referer);
    } else {
      return next();
    }
  },

  validateUsers(req, res, next) {
    if (req.method === "POST") {

      // In validateUsers, we call checkBody on the request object to confirm that email 
      // is a valid email address and password is at least six characters in length and that 
      // the passwordConfirmation, if provided, matches password. 
      req
        .checkBody("email", "must be valid")
        .isEmail();
      req
        .checkBody("password", "must be at least 6 character in length")
        .isLength({ min: 6 })
      req
        .checkBody("passwordConfirmation", "must match password provided")
        .optional()
        .matches(req.body.password);
    }

    const errors = req.validationErrors();

    // If there are errors, we load the flash message and redirect to the referer
    if (errors) {
      req.flash("error", errors);
      return res.redirect(req.headers.referer);

      // Otherwise we move to the next middleware function.
    } else {
      return next();
    }
  },

  validateComments(req, res, next) {
    if (req.method === "POST") {
      req.checkBody("body", "must not be empty").notEmpty();
    }

    const errors = req.validationErrors();

    if (errors) {
      req.flash("error", errors);
      return res.redirect(req.headers.referer);
    } else {
      return next()
    }
  }
};
