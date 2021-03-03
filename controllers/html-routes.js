// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  app.get("/", (req, res) => {
    res.render('index')
  });

  app.get("/signup", (req, res) => {
    if (req.user) {
      res.render("members");
    }

    res.render('signup', {
      style: "signup.css"
    })
  });


  app.get("/login", (req, res) => {

    if (req.user) {
      res.render("members");
    }

    res.render('login', {
      style: "login.css"
    })

  });


  app.get("/members", isAuthenticated, (req, res) => {
    res.render('members')

  });

};
