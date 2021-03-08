const express = require('express');
const passport = require('./../../config/passport');
const db = require('./../../models');
const router = express.Router();


// Using the passport.authenticate middleware with  local strategy.
// If the user has valid login credentials, send them to the members page.
// Otherwise the user will be sent an error
router.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
        email: req.user.email,
        id: req.user.id,
        RoleId: req.user.RoleId,
    });
});


// Route for getting some data about our user to be used client side
router.get("/api/user_data", (req, res) => {
    if (!req.user) {
        // The user is not logged in, send back an empty object
        res.json({});
    } else {
        // Otherwise send back the user's email and id
        // Sending back a password, even a hashed password, isn't a good idea
        res.json({
            email: req.user.email,
            id: req.user.id
        });
    }
});


// Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
// how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
// otherwise send back an error
router.post("/api/signup", async (req, res) => {

    let errors = [];
    const { email, password, RoleId } = req.body

    if (!email || !password) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (errors.length > 0) {
        // TODO: send err json
        return res.json({
            errors,
        })
    }

    console.log({ email });
    const user = await db.User.findOne({
        where: {
            email: email
        }
    })
    if (user) {
        errors.push({ msg: 'Email already exists' });
        // send err json
        return res.status(400).json({
            errors,
        })
    }

    db.User.create({
        email: email,
        password: password,
        RoleId: RoleId,
    }).then(() => {
        res.json({
            data: {
                success: true,
            }
        })
    })
        .catch(err => {
            res.status(500).json(err);
        });


})


// Route for logging user out
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
    
});

module.exports = router;