// Requiring our models and passport as we've configured it
const db = require('../models')
const passport = require('../config/passport')
//sams code
// const {accessibleRole} = require('./../middleware/permissionMiddleware');

module.exports = function (app) {
  // Using the passport.authenticate middleware with  local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea


    // add session to the website as the user is log in

    db.Role.findOne({
      where: {
        id: req.user.id,
      }
    }).then(data => {
      req.session.user = req.user.email;
      console.log('d', req.user.email)
      req.session.type = data.get('title');
      console.log('session', req.session)
      console.log('title', data.get('title'))
      req.session.save();
    });


    res.json({
      email: req.user.email,
      id: req.user.id
    })
  })

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post('/api/signup', async (req, res) => {
    console.log('signup route hit', req.body)
    const user = await db.User.create({
      email: req.body.email,
      password: req.body.password
    })
    // .then((d) => {
    //   db.Role.create({
    //
    //   })
    //   res.redirect(307, "/api/login");
    // })
    // .catch(err => {
    //   res.status(401).json(err);
    // });
    console.log('ddd ', user.id)
    if (user instanceof db.User) {

      db.Role.create({
        id: user.id,
        title: req.body.role
      }).then(() => {
        console.log('done role')
        res.redirect(307, '/api/login')
      }).catch((e) => {
        console.log('error role', e)

      })

    } else {
      res.status(401)

    }

  })

  //sam's code

  // app.get('/volunteer-dashboard', accessibleRole(['volunteer']), (req, res) => {
  //   res.json({
  //     data: 'success'
  //   })
  // })

  // Route for logging user out
  app.get('/logout', (req, res) => {
    req.logout()
    // res.redirect("/");
    res.render('index')
  })

  // Route for getting some data about our user to be used client side
  app.get('/api/user_data', (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({})
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      })
    }
  })
}
