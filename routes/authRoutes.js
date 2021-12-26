
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const userConfirm = require('../Templates/userConfirm');

const User = require('../models/users');
const Account = require('../models/account');

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
passport.authenticate('localsignup',
{ successRedirect: '/auth/registerSuccess',
failureRedirect: '/auth/SignUpPage',
failureFlash: true}
));

router.post('/login',
passport.authenticate('locallogin',
{ successRedirect : '/auth/loginSuccess',
failureRedirect : '/auth/LogInPage',
failureFlash: true}
));

router.get('/google/signup',
passport.authenticate('googlesignup',{
scope : ['profile', 'email'] ,
state : "signup"}
));

router.get('/google/callback/signup', 
passport.authenticate('googlesignup',{
successRedirect : '/auth/loginSuccess',
failureRedirect : '/auth/SignUpPage',
failureFlash: true}
));

router.get('/google/login',
    passport.authenticate('googlelogin',{
    scope : ['profile', 'email'],
    state : 'login'}
));  

//http://localhost:5000/auth/google/callback/signup
//http://localhost:5000/auth/google/callback/login

router.get('/google/callback/login', 
passport.authenticate('googlelogin',{
successRedirect : '/auth/loginSuccess',
failureRedirect : '/auth/SignUpPage',
failureFlash: true}
)); 

router.get('/success', (req, res, next) => {
    res.render('success');
}) 

router.get('/registerSuccess', (req, res, next) => {
//checked
        const token = jwt.sign({
            userId: req.user._id
        }, keys.emailSecret , { expiresIn: '1d' }  
        );  

    console.log(req.user);
    console.log(keys);

    sgMail.setApiKey(keys.sendGridKey);
    const toEmail = req.user.identities[0].email;
    const subject = "User verification";

    const message = userConfirm(toEmail, subject, token);
    
    sgMail.send(message)
    .then(response => {
            res.render("success");
    
    })
    .catch(next);
});


router.get('/loginSuccess', (req, res, next) => {

//checked
        console.log("active user",req.user._id);
        const id = req.user._id;

     function getAccount(user) {

         if(user) {

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

                Account.checkUserType(user,"Editor")
                 .then(acc => checkEditor(acc))
                 .catch(next)
                    }
                 }

                 Account.checkUserType(user,"Owner")
                 .then(acc => checkOwner(acc))
                 .catch(next)
        } else {
            res.status(400).json({
                message : "user doesnt exist"
            })
        }

     }

     User.getUserById(id)
     .then((user) => getAccount(user))
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


router.get('/confirmation/:token', (req, res, next) => {
//checked
    jwt.verify(req.params.token, keys.emailSecret,
    function(err, decoded) {
   if (err) {
       res.send("Email verification failed, possibly the link is invalid or expired");
   }
   else {
       const userId = decoded.userId;
       function updateFlag(user) {
           
           if(user && user.verified) {
               res.redirect(`/auth/LogInPage`);
           } else {
               User.verifyFlag(userId)
               .then(() => {
                res.redirect(`/auth/LogInPage`);
               })
               .catch(next)
           }
       }

            User.getUserById(userId)
            .then((user) => updateFlag(user))
            .catch(next)
   }

});
 
});

router.post('/create/user', (req, res, next) => {
    
    const { email, name, password} = req.body;

    function updateDetails(user) {

        if(user && user.verified) {
            // check if google id exist or no
            if(user.password) {
            res.redirect('/auth/LogInPage');
            } else  {
            function updateUser(hash) {
                //email, name, hash
                User.setNameAndPassword(email, name, hash)
                .then(() => {
                    res.redirect('/auth/LogInPage');
                })
                .catch(next)
                /*User.updateOne(
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
                .catch(next)*/
            }
            
            User.hashPassword(password)
            .then((hash) => updateUser(hash))
            .catch(next)
            /*bcrypt.hash(password, 10)
            .then((hash) => updateUser(hash))
            .catch(err => done(err))*/     
        }               

        } else {
            res.status(400).json({
               error: "User has to be verified to set credentals"
            });
        }    
    }

    User.getUserByEmail(email)
    .then((user) => updateDetails(user))
    .catch(next)

})

router.get('/logout', (req, res) => {
    req.logout();
    res.send("user logged out");
});

// router.post('/adhoc', (req, res, next) => {
//     User.updateOne(
//         {"identities.email" : "rajapragadeshpandian@gmail.com"},
//                     { "$set" : {
//                     verified :null
//                     }}
//                     )
//                     .exec()
//                     .then(() => {
//                         res.send("updated successfully")
//                     })
//                     .catch((err) => done(err))
// });




module.exports = router;

