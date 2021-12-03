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

router.get('/', (req, res) => {

    res.render("index");

});

router.get('/SignUpPage', (req, res) => {

    res.render("signup");

});

router.get('/LogInPage', (req, res) => {

    res.render("login");

});

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
scope : ['profile', 'email'] ,
state : "signup"
}
));

router.get('/google/login',
    passport.authenticate('google',{
    scope : ['profile', 'email'],
    state : 'login'
}
));
         


router.get('/google/callback', 
passport.authenticate('google',{
successRedirect : '/auth/success',
failureRedirect : '/auth/failure'
}
));       

router.get('/success', (req, res, next) => {
    res.send(req.user);
});

router.get('/failure', (req, res, next) => {
    res.render("failure");
});

router.get('/registerSuccess', (req, res, next) => {
    res.send(req.user);
});

router.get('/registerFailure', (req, res, next) => {
    res.send("already existing user");
});

router.get('/loginSuccess', (req, res, next) => {
    res.send(req.user);
});

router.get('/loginFailure', (req, res, next) => {
    res.send("Authentication failed.Bad credentials");
});

router.get('/inviteteam', (req, res, next) => {
    //console.log(req.user);
    if(req.user) {
        res.send(req.user);
    } else {
        res.send("no active user");
    }

})


router.get('/logout', (req, res) => {
    req.logout();
    res.send("user logged out");
});



module.exports = router;

