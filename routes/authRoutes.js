const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

const User = require('../models/users');
const Account = require('../models/account');


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

    res.render("signup", { message : req.flash('info')});

});

router.get('/LogInPage', (req, res) => {

    res.render("login", { message : req.flash('info')});

});

router.post('/register', 
passport.authenticate('local',
{ successRedirect: '/auth/success',
failureRedirect: '/auth/SignUpPage',
failureFlash: true}
));

router.post('/login',
passport.authenticate('local',
{ successRedirect : '/auth/success',
failureRedirect : '/auth/LogInPage',
failureFlash: true}
));

router.get('/google/signup',
passport.authenticate('google',{
scope : ['profile', 'email'] ,
state : "signup"}
));

router.get('/google/login',
    passport.authenticate('google',{
    scope : ['profile', 'email'],
    state : 'login'}
));
         


router.get('/google/callback', 
passport.authenticate('google',{
successRedirect : '/auth/success',
failureRedirect : '/auth/SignUpPage',
failureFlash: true}
));   

// router.get('/auth/SignUpPage', (req, res ,next) => {
//     res.render("SignUpPage", { message : req.flash('info')});
// });


// router.get('/auth/LogInPage', (req, res ,next) => {
//     res.render("LogInPage", { message : req.flash('info')});
// });
router.get('/success', (req, res, next) => {

    Account.findOne({_id : "61aa1acd5cda43c11a14e65c"})
    .exec()
    .then((acc) =>{
        res.redirect(`/auth?accId=${acc._id}`);
    })
    
    
    //res.render("success", { message : req.flash('info')});
    //res.render('login', { message : req.flash('info')});
});

// router.get('/SignUpPage', (req, res, next) => {

//     console.log(req.url);
//     res.render("SignUpPage", { message : req.flash('info')});
// });

/*router.get('/registerSuccess', (req, res, next) => {
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
});*/

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

