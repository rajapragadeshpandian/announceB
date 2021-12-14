
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

    console.log(req.user);
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
    <a href="http://localhost:5000/auth/confirmation?email=${req.user.identities[0].email}">confirm</a>
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

     function verifyAccount(user) {

         const googleId = user.identities[0].googleId;
         const verified = user.identities[0].verified;

         if(googleId || verified) {
                 function checkOwner(acc) {
                    if(acc) {
                        console.log("OwnerAcc",acc);
                        res.redirect(`/changelog?accId=announceB`);
                    } else {
                            function checkEditor(editAcc) {
                                if(editAcc) {
                                    console.log(editAcc);
                                    res.redirect(`/changelog?accId=announceB`);            
                                } else {
                                    res.status(404).json({
                                        error : "please create account"
                                    })
                                }
                            }
                        Account.find(
                            { users : {
                                $elemMatch : {
                                        __user : user._id,
                                        userType : "Editor"
                                     }
                        }})
                        .exec()
                        .then(editAcc => checkEditor(editAcc))
                        .catch(next)
                    }
                 }

            Account.find(
                { users : {
                    $elemMatch : {
                            __user : user._id,
                            userType : "Owner"
                         }
            }})
            .exec()
            .then(acc => checkOwner(acc))
            .catch(next)

         } else {
                res.status(400).json({
                    error : "Please have your account verified"
                })
         }

     }
            User.findOne({_id : id})
            .exec()
            .then((user) => verifyAccount(user))
            .catch(next)

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

    User.updateOne({"identities.email" : req.query.email},
                    { "$set" : {
                    "identities.$.verified" : true
                    }}
                    )
                    .exec()
                    .then(() => {
                        res.redirect(`/auth/LogInPage`);
                    })
                    .catch((err) => done(err))
 
});

router.post('/create/user', (req, res, next) => {
    
    const { email, name, password} = req.body;

    function updateDetails(user) {

        if(user) {
            // check if google id exist or no
            if((user.identities[0].googleId) ||
                 (user.password) ) {
            res.redirect('/auth/LogInPage');
            } else  {
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
        }               

        } else {
            res.status(400).json({
               error: "User has to be verified to set creds"
            });
        }
        

    }

            User.findOne({"identities.email" : email,
            "identities.verified" : true
            })
            .exec()
            .then((user) => updateDetails(user))
            .catch(next)

})


router.get('/logout', (req, res) => {
    req.logout();
    res.send("user logged out");
});

router.post('/adhoc', (req, res, next) => {


    User.updateOne({"identities.email" : "rajapragadeshpandian@gmail.com"},
                    { "$set" : {
                    "identities.$.verified" :null
                    }}
                    )
                    .exec()
                    .then(() => {
                        res.send("updated successfully")
                    })
                    .catch((err) => done(err))
});




module.exports = router;

