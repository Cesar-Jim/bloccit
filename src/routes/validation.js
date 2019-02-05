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
  }
};
