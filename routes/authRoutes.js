const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');


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
    console.log(keys);

    res.render("index");

});

router.get('/SignUpPage', (req, res) => {

    res.render("signup", { message : req.flash('info')});

});

router.get('/LogInPage', (req, res) => {
    //res.render('dashboard', { changes : item });
    console.log(req.user);
    res.render("login", { message : req.flash('info')});

});

router.post('/register', 
passport.authenticate('local',
{ successRedirect: '/auth/registerSuccess',
failureRedirect: '/auth/SignUpPage',
failureFlash: true}
));

router.post('/login',
passport.authenticate('local',
{ successRedirect : '/auth/loginSuccess',
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
successRedirect : '/auth/loginSuccess',
failureRedirect : '/auth/SignUpPage',
failureFlash: true}
));  

router.get('/success', (req, res, next) => {
    res.render('success');
}) 

router.get('/registerSuccess', (req, res, next) => {

    console.log(req.user.identities[0].email);
    console.log(keys);

    sgMail.setApiKey(keys.sendGridKey);

    const message = {};
    message.to = req.user.identities[0].email,
    message.from = "pragadesh72@gmail.com";
    message.subject = "user verification";
    message.text = " hi from sendgrid";
    message.html = `<h1> hi from sendgrid</h1>
    <p>Please click on confirm to accept the invite<p>
    <div>
    <a href="http://localhost:5000/auth/confirmation">confirm</a>
    </div>
    `;

    sgMail.send(message)
    .then(response => {
            res.render("success");
    
    })
    .catch(next);
});


router.get('/loginSuccess', (req, res, next) => {

    // get account details by use mail
    console.log("active user",req.user._id);
     const id = req.user._id;
    Account.findOne({"users.__user" : id})
    .exec()
    .then((acc) =>{
      //res.redirect(`/changelog?accId=${acc._id}`);
      res.redirect(`/changelog?accId=announceB`);
    })

    // res.status(200).json({
    //     user : req.user
    // });

});


router.get('/inviteteam', (req, res, next) => {
    //console.log(req.user);
    if(req.user) {
        res.send(req.user);
    } else {
        res.send("no active user");
    }

});


router.get('/confirmation', (req, res) => {
 res.redirect(`/auth/LogInPage`);
});

router.post('/create/user', (req, res, next) => {
    
    const { email, name, password} = req.body;

    function updateDetails(user) {

        if(user) {

            function updateUser(hash) {

                User.updateOne(
                    {"identities.email" : email},
                    {$set : {
                        name : name,
                        password : hash
                    }}
                )
                .exec()
                .then(() => {
                    res.redirect('/auth/LogInPage');
                })
                .catch(next)
            }
            
            bcrypt.hash(password, 10)
            .then((hash) => updateUser(hash))
            .catch(err => done(err))                    

        } else {
            res.send("User not exist");
        }
        

    }

    User.findOne({"identities.email" : email})
    .exec()
    .then((user) => updateDetails(user))
    .catch(next)

})


router.get('/logout', (req, res) => {
    req.logout();
    res.send("user logged out");
});



module.exports = router;

