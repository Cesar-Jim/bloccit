module.exports = {
   index: function (req, res, next) {
      res.render("static/index", { title: "Welcome to Bloccit" });
   }
}