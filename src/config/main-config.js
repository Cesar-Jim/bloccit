// This file is used to configure all middleware used in the application

require("dotenv").config();

const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const flash = require("express-flash");

module.exports = {
  init(app, express) {
    app.set("views", viewsFolder); // Including path so that the app knows where to find the assets
    app.set("view engine", "ejs"); // Setting the path where the templating engine will find the views
    app.use(bodyParser.urlencoded({ extended: true }));
    // We tell bodyParser what to parse by using the required method. As we are parsing urlencoded,
    // we'd like to be able to send rich objects, so we set the extended option to true.
    app.use(express.static(path.join(__dirname, "..", "assets"))); // Mounting the view engine and telling Express where to find the static assets
    app.use(expressValidator());
    app.use(
      session({
        secret: process.env.cookieSecret,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60000 }
      }));
    app.use(flash());
  }
};
