// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const db = require('./../models');

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");
const {accessibleRole} = require("../config/middleware/permissionMiddleware");

module.exports = function (app) {
  app.get("/", (req, res) => {
    res.render('index')
  });

  app.get("/signup", (req, res) => {
    if (req.user) {

    
      return   res.render('login', {
        style: "login.css"
      })
  

      return res.render("members");

    }


    // TODO: load roles from DB and pass to view
    db.Role.findAll({})
      .then(roles => {

        console.log({roles});

        for (let index = 0; index < roles.length; index++) {
          const role = roles[index].dataValues;
          console.log({role});
          console.log(role.title);
        }

        res.render('signup', {
          roles: roles.map(role => role.dataValues),
          style: "signup.css"
        })
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

  app.get('/volunteer', accessibleRole(['volunteer']), (req, res) => {

    // res.send("HIII");

  });

  app.get('/customer',  accessibleRole(['customer']), (req, res) => {

    // res.send("HIII");

  });


  app.post("/api/tickets", (request, response) => {
    console.log("ticket creation route hit");
    console.log(request.body);
    db.Ticket.create({
      service: request.body.service,
      description: request.body.description,
      postcode: request.body.postcode,
      status: request.body.status,
      createdById: request.body.createdById,
      receivedUserId: request.body.receivedUserId
    })
    .then((ticket) => {
      console.log("successfully created ticket");
      response.json(ticket);
    })
    .catch(err => {
      response.status(401).json(err);
    });
  });
  app.get("/api/tickets", (request, response) => {
    db.Ticket.findAll()
      .then((tickets) => {
          response.json(tickets);
      }) 
  });


};
