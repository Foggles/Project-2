const express = require('express');

const router = express.Router();

let path = require("path");

router.get('/',(req,res) => {
    res.render('frontPage')
})

router.get('/login', (req,res) => {
    res.render('login',{
        style: "login.css"
    } )
})

router.get('/signup', (req,res) => {
    res.render('signup', {
        style: "signup.css"
    })
})

module.exports = router;