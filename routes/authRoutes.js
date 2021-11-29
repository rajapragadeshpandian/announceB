const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

const User = require('../models/users');

router.get('/crypt', (req, res, next) => {

    var passwod = "raj";
    var newPass = "prag";

    bcrypt.hash(passwod, 10)
    .then((hash) => {
        console.log(hash);
        console.log("$2b$10$.8WvoZan/j3CBwf1mALWVeAJpifjusCVplWkeCkh47AL6VAMz6wyK");
            bcrypt.compare(newPass, hash)
            .then((result) => {
                console.log(result);
                res.send(result);
            })
            .catch(next);
            
    })
    .catch(next)

})

router.post('/register', 
passport.authenticate('local',
{ successRedirect: '/auth/registerSuccess',
failureRedirect: '/auth/registerFailure'}
));

router.post('/login',
passport.authenticate('local',
{ successRedirect : '/auth/loginSuccess',
failureRedirect : '/auth/loginFailure'}
));

router.get('/google/signup',
passport.authenticate('google',{
scope : ['profile', 'email'] 
}
));



// router.get('/google/signup', (req, res, next) => {
//     res.redirect('/auth/google/callback');
// })

// router.get('/google/callback', (req, res, next) => {
//     res.send("google signup");
// })

router.get('/google/callback', 
passport.authenticate('google',{
successRedirect : '/auth/registerSuccess',
failureRedirect : '/auth/registerFailure'
}
));        

router.get('/registerSuccess', (req, res, next) => {
    res.send("use registered successfully");
});

router.get('/registerFailure', (req, res, next) => {
    res.send("already existing user");
});

router.get('/loginSuccess', (req, res, next) => {
    res.send("login successful");
});

router.get('/loginFailure', (req, res, next) => {
    res.send("login failure");
});

router.get('/logout', (req, res) => {
    req.logout();
    res.send("user logged out");
});

module.exports = router;

