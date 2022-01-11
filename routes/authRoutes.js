
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const userConfirm = require('../Templates/userConfirm');
const resetPwd = require('../Templates/resetPwd');

const User = require('../models/users');
const Account = require('../models/account');

router.get('/', (req, res) => {
    console.log(keys);

    res.render("index");
});


router.get('/register', (req, res) => {
    res.render("register");
});

router.get('/applogin', (req, res) => {
    res.render("applogin");
});

router.get('/signup', (req, res) => {
    res.render("signup", { message: req.flash('info') });
});

router.get('/login', (req, res) => {
    //res.render('dashboard', { changes : item });
    console.log(req.user);
    res.render("login", { message: req.flash('info') || { success: req.query.message } || "" });
});



router.post('/register',
    passport.authenticate('localsignup',
        {
            successRedirect: '/auth/registerSuccess',
            failureRedirect: '/auth/signup',
            failureFlash: true
        }
    ));

router.post('/login',
    passport.authenticate('locallogin',
        {
            successRedirect: '/auth/loginSuccess',
            failureRedirect: '/auth/login',
            failureFlash: true
        }
    ));

router.get('/google/signup',
    passport.authenticate('googlesignup', {
        scope: ['profile', 'email'],
        state: "signup"
    }
    ));

router.get('/google/callback/signup',
    passport.authenticate('googlesignup', {
        successRedirect: '/auth/loginSuccess',
        failureRedirect: '/auth/signup',
        failureFlash: true
    }
    ));

router.get('/google/login',
    passport.authenticate('googlelogin', {
        scope: ['profile', 'email'],
        state: 'login'
    }
    ));

router.get('/google/callback/login',
    passport.authenticate('googlelogin', {
        successRedirect: '/auth/loginSuccess',
        failureRedirect: '/auth/signup',
        failureFlash: true
    }
    ));

router.get('/success', (req, res, next) => {
    console.log("success");
    res.render('success');
})


router.get('/registerSuccess', (req, res, next) => {
    //checked
    const token = jwt.sign({
        userId: req.user._id
    }, keys.emailSecret, { expiresIn: '1d' }
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
    console.log("active user", req.user._id);
    const id = req.user._id;

    function getAccount(user) {

        if (user) {

            function checkOwner(acc) {
                if (acc) {
                    console.log("OwnerAcc", acc);
                    res.cookie("accId", "announceB");
                    // res.redirect(`/changelog?accId=announceB`);
                    res.redirect('http://localhost:3000/dashboard');
                } else {
                    function checkEditor(editAcc) {
                        if (editAcc) {
                            console.log(editAcc);
                            res.cookie("accId", "announceB");
                            // res.redirect(`/changelog?accId=announceB`);
                            res.redirect('http://localhost:3000/dashboard');
                        } else {
                            res.status(404).json({
                                error: "please create account"
                            })
                        }
                    }

                    Account.checkUserType(user, "Editor")
                        .then(acc => checkEditor(acc))
                        .catch(next)
                }
            }

            Account.checkUserType(user, "Owner")
                .then(acc => checkOwner(acc))
                .catch(next)
        } else {
            res.status(400).json({
                message: "user doesnt exist"
            })
        }
    }

    User.getUserById(id)
        .then((user) => getAccount(user))
        .catch(next)

});

router.get('/inviteteam', (req, res, next) => {
    //console.log(req.user);
    if (req.user) {
        res.send(req.user);
    } else {
        res.send("no active user");
    }

});

router.get('/confirmation/:token', (req, res, next) => {
    //checked
    jwt.verify(req.params.token, keys.emailSecret,
        function (err, decoded) {
            if (err) {
                res.send("Email verification failed, possibly the link is invalid or expired");
            }
            else {
                const userId = decoded.userId;
                function updateFlag(user) {

                    if (user && user.verified) {
                        res.redirect(`/auth/login`);
                    } else {
                        User.verifyFlag(userId)
                            .then(() => {
                                res.redirect(`/auth/login`);
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

    const { email, name, password } = req.body;

    function updateDetails(user) {

        if (user && user.verified) {
            // check if google id exist or no
            if (user.password) {
                res.redirect('/auth/login');
            } else {
                function updateUser(hash) {
                    //email, name, hash
                    User.setNameAndPassword(email, name, hash)
                        .then(() => {
                            res.redirect('/auth/login');
                        })
                        .catch(next)
                }

                User.hashPassword(password)
                    .then((hash) => updateUser(hash))
                    .catch(next)
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

router.get('/reset', (req, res) => {
    res.render("reset", { message: "" });
});

router.post('/reset', (req, res, next) => {

    const { email } = req.body;
    function sendEmail(user) {
        console.log(user);
        if (user) {
            const token = jwt.sign({
                userId: user._id
            }, user.password, { expiresIn: '1d' }
            );
            console.log(keys);

            sgMail.setApiKey(keys.sendGridKey);
            const toEmail = user.identities[0].email;
            const subject = "Reset Password";
            const userId = user._id;

            const message = resetPwd(toEmail, subject, token, userId);

            sgMail.send(message)
                .then(response => {
                    res.render("reset", { message: "reset link sent successful" });
                })
                .catch(next);
        } else {
            res.render("reset", { message: "email not exist" });
        }
    }

    User.getUserByEmail(email)
        .then((user) => sendEmail(user))
        .catch(next)

});

router.get('/change/password/:userId/:token', (req, res, next) => {

    const { userId, token } = req.params;
    // '/change/password/:token'
    // set keys secrert as password hash 
    // so we can can use a link onlyonce
    function checkToken(user) {

        jwt.verify(token, user.password,
            function (err, decoded) {
                if (err) {
                    res.send("Email verification failed, possibly the link is invalid or expired");
                }
                else {
                    res.render('changePwd', { email: user.identities[0].email || "" });
                    //    const userId = decoded.userId;
                    //         User.getUserById(userId)
                    //         .then((user) => { 
                    // })
                    // .catch(next)
                }
            });
    }

    User.getUserById(userId)
        .then((user) => checkToken(user))
        .catch(next)

    //res.render('changePwd', {email : "prag@gmail.com" || ""});
})

router.post('/change/password', (req, res, next) => {
    const { email, password } = req.body;
    User.hashPassword(password)
        .then((hash) => User.setPassword(email, hash))
        .then((user) => {
            res.redirect(`/auth/login?message=password reset success`)
            //res.redirect(`/auth/userdetails?email=${user.identities[0].email}`); 
        })
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

router.get('/userdetails', (req, res, next) => {
    //change it to auth route
    //res.render('userDetails', {email : req.query.email || ""});
    res.render('userDetails', { email: "prag@gmail.com" || "" });
});



module.exports = router;

