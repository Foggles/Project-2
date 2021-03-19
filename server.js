// Requiring necessary npm packages
const nodemailer = require('nodemailer');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
// Requiring passport as we've configured it
const passport = require('./config/passport');
const apiRouter = require('./routes/api-routes');

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8000;
const db = require('./models');

// Creating express app and configuring middleware needed for authentication
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
// We need to use sessions to keep track of our user's login status
// app.use(
//   session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
// );

app.use(session({

  secret: 'key',


  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }

}))

// Set Handlebars.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Passport initialisation
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require('./routes/html-routes.js')(app);
app.use(apiRouter);

// Set Handlebars.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//configuring the emmail service
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'volunteersteam2021@gmail.com',
        pass: 'backend-warriors'
    }
});

let mailOptions ={
    from: '',
    to: 'volunteersteam2021@gmail.com',
    subject: 'I need help please',
    text: 'It works'
};
transporter.sendMail(mailOptions, function(err,data){
    if (err) {
        console.log('Error occurs');
    }else {
        console.log('Email sent!!');
    }
});

// Syncing our database and logging a message to the user upon success
db.sequelize.sync({force:true}).then(() => {

  db.Role.create({
    title: 'volunteer'
  });

  db.Role.create({
    title: 'customer'
  });
  app.listen(PORT, () => {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});
