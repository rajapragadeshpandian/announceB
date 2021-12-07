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
successRedirect : '/auth/success',
failureRedirect : '/auth/SignUpPage',
failureFlash: true}
));  

router.get('/success', (req, res, next) => {
    res.render('success');
}) 

router.get('/registerSuccess', (req, res, next) => {

    console.log(req.user.identities[0].email);

    sgMail.setApiKey(keys.sendGridKey);

    const message = {};
    message.to = req.user.identities[0].email;
    message.from = "rajapragadeshpandian@gmail.com";
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
    // console.log(req.user);
    // Account.findOne({_id : "61aa1acd5cda43c11a14e65c"})
    // .exec()
    // .then((acc) =>{
    //     res.redirect(`/auth?accId=${acc._id}`);
    // })

    res.render('success');
    
    
    //res.render("success", { message : req.flash('info')});
    //res.render('login', { message : req.flash('info')});
});


router.get('/inviteteam', (req, res, next) => {
    //console.log(req.user);
    if(req.user) {
        res.send(req.user);
    } else {
        res.send("no active user");
    }

});

/*router.post('/signup', (req, res, next) => {
    
    const { email, name, password} = req.body;
    console.log(req.body.email);

    sgMail.setApiKey(keys.sendGridKey);

    const message = {};
    message.to = req.body.email;
    message.from = "rajapragadeshpandian@gmail.com";
    message.subject = "user verification";
    message.text = " hi from sendgrid";
    message.html = `<h1> hi from sendgrid</h1>
    <p>Please click on conform to accept the invite<p>
    <div>
    <a href="http://localhost:5000/auth/confirmation?email=${req.body.email}">confirm</a>
    </div>
    `;
console.log(message);
    sgMail.send(message)
    .then(response => {
        res.status(200).json({
            response : response
        })
    })
    .catch(next);

  
});*/

router.get('/confirmation', (req, res) => {
 res.redirect(`/auth/LogInPage`);
});


router.get('/logout', (req, res) => {
    req.logout();
    res.send("user logged out");
});



module.exports = router;

