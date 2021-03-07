const express = require('express');
const router = express.Router();

// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
//sams code 
// const {accessibleRole} = require('./../middleware/permissionMiddleware');
// app.get('/volunteer-dashboard', accessibleRole(['volunteer']), (req, res) => {
//   res.json({
//     data: 'success'
//   })
// })

const authRouter = require('./api/auth');

router.use(authRouter)

module.exports = router;


