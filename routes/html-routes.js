// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const db = require('./../models');
const { api } = require('./api')


// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");
const { accessibleRole } = require("../config/middleware/permissionMiddleware");

module.exports = function (app) {

  app.get("/", (req, res) => {
    // res.render('index', {
    //   style: "index.css"
    // })
    if (!req.user) {
      return res.redirect("/login");
    }
    if (req.user.RoleId === 1) {
      return res.redirect("/volunteer");
    } else {
      return res.redirect("/members");
    }
  });
  app.get('/api', api);

  app.get("/signup", (req, res) => {
    if (req.user) {
      return res.render('login', {
        style: "login.css"
      })
      return res.render("members", {
        style: "members.css"
      });
    }


    // TODO: load roles from DB and pass to view
    db.Role.findAll({})
      .then(roles => {

        console.log({ roles });

        for (let index = 0; index < roles.length; index++) {
          const role = roles[index].dataValues;
          console.log({ role });
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
      res.render("members", {
        style: "members.css"
      });
    }

    res.render('login', {
      style: "login.css"
    })

  });


  app.get("/members", accessibleRole(2), (req, res) => {
    // res.render('members')
    res.render('members', {
      style: "members.css"
    })
    

  });


  app.get('/volunteer', accessibleRole(1), (req, res) => {
    res.render('volunteer', {
      style: "volunteer.css"
    })
  });




  // Jack's Code
  app.post("/api/tickets", (request, response) => {
    console.log("ticket creation route hit");
    console.log(request.body);
    db.Ticket.create({
      service: request.body.service,
      description: request.body.description,
      postcode: request.body.postcode,
      status: request.body.status,
      UserId: request.user.id,
      // createdById: request.body.createdById,
      receivedUserId: request.body.receivedUserId
    })
      .then((ticket) => {
        console.log("successfully created ticket");
        response.json(ticket);
      })
      .catch(err => {
        console.log(err);
        response.status(401).json(err);
      });
  });
  // Jack's Code
  app.get("/api/tickets", (request, response) => {
    db.Ticket.findAll()
      .then((tickets) => {
        response.json(tickets);
      })
  });

  app.get("/about", (req,res)=> {
    res.render('about',{
      style: "about.css"
    })
  });

  app.get("/Post", (req,res)=> {
    res.render('Post',{
      style: "about.css"
    })
  });

  app.post("/api/post", (req,res) => {
    console.log(req.body);
    db.Post.create({
      Name: req.body.Name,
      Message: req.body.Message,
      Phone: req.body.Phone,
      Email: req.body.Email,
    })
     .then((post) => {
       res.json(post);
     })
     .catch(err => {
       res.status(401).json(err);
     })
  })


};
