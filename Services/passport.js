

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');

const User = require('../models/users');
const Account = require('../models/account');


passport.serializeUser(function(user, done) {
    console.log("serialize",user);
    done(null,user);
  });
  
  passport.deserializeUser(function(user, done) {
      console.log("deserialize", user);
    done(null, user);
  });   
  
passport.use(
    'localsignup',
    new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true
    },
     (req, email, password, done) => {

                function createUser(user) {

                    if(user) {

                         function checkAccount(acc) {

                                if(acc){
                                    return done(null, false, req.flash('info' , 'User and Owner account Aready exist Please login'));
                                } else {

                                    let account = new Account({
                                        accName : "announceB",
                                        users : [{
                                            userType : "Owner",
                                            __user : user._id,
                                            email : user.identities[0].email
                                        }]
                                    })
                                    .save()
                                    .then((account) => {
                                         done(null, user);
                                    })
                                    .catch((err) => done(err))       
                                }
                        }

                     Account.findOne(
                            { users : {
                                $elemMatch : {
                                        __user : user._id,
                                        userType : "Owner"
                                     }
                        }})
                        .exec()
                        .then((acc) => checkAccount(acc))
                        .catch((err) => done(err))

                    } else {

                        function saveUser(hash) {

                            function createAccount(user) {

                                let account = new Account({
                                    accName : "announceB",
                                    users : [{
                                        userType : "Owner",
                                        __user : user._id,
                                        email : user.identities[0].email
                                    }]
                                })
                                .save()
                                .then((account) => {
                                        done(null, user);
                                })
                                .catch((err) => done(err))

                            }

                        let newUser = new User({
                            name : req.body.name,
                            password  : hash,
                            identities : [{ email : email}]
                        })
                        .save()
                        .then((user) => createAccount(user))
                        .catch((err) => done(err))
                    }

                    bcrypt.hash(password, 10)
                    .then((hash) => saveUser(hash))
                    .catch(err => done(err))
                    }
              }
        
             User.findOne({"identities.email"  : email})
            .exec()
            .then((user) => createUser(user))
            .catch(err => done(err));
    })
);

passport.use(
    'locallogin',
    new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true
    },
     (req, email, password, done) => {
        function verifyPassword(user) {
                
            if(user) {

                if(user.password) {
                    bcrypt.compare(password, user.password)
                    .then((result) => {
                        
                        if(result) {
                            done(null, user);
                        } else {
                            done(null, false, req.flash('info' , 'Passwod is incorrect'));
                        }
                    })
                    .catch(err => done(err));
                } else {
                    done(null, false, req.flash('info' , "Password not set to your account.  try login with google"));

                }
            } else {

                console.log("else part called");
                done(null, false, req.flash('info' , 'User not Exist or yet to be verified'));
            }
    }
        User.findOne({
            "identities.email" : email,
            verified : true
        })
        .exec()
        .then((user) => verifyPassword(user))
        .catch(err => done(err))    

     })
    );

//GoogleStrategy.passReqToCallback = true;
passport.use(
    'googlesignup',
    new GoogleStrategy(
        {
        clientID : keys.GoogleClientID,
        clientSecret : keys.GoogleClientSecret,
        callbackURL : '/auth/google/callback/signup',
        passReqToCallback: true,
        proxy : true
    },
    (req, accessToken, refreshToken, profile, done) => {

        const id = profile.id;
        const email = profile.emails[0].value;
        function createUser(user) {
             if(user) {
                const googleId = user.identities[0].googleId;

                function checkAccount(acc) {

                if(acc) {
                    return done(null, false, req.flash('info' , 'Account already exist.Plese login with google'));
                } else {

                    let account = new Account({
                        accName : "announceB",
                        users : [{
                            userType : "Owner",
                            __user : user._id,
                            email : user.identities[0].email
                        }]
                    })
                    .save()
                    .then((account) => {
                        done(null, user);
                    })
                    .catch((err) => done(err))

                } 
            }  
                Account.findOne(
                    { users : {
                        $elemMatch : {
                                __user : user._id,
                                userType : "Owner"
                             }
                }})
                .exec()
                .then((acc) => checkAccount(acc))
                .catch((err) => done(err))
                        
             } else {

                        function createAccount(user) {

                            let account = new Account({
                                accName : "announceB",
                                users : [{
                                    userType : "Owner", 
                                    __user : user._id,
                                    email : user.identities[0].email
                                }]
                            })
                            .save()
                            .then((account) => {
                                done(null, user);
                            })
                            .catch((err) => done(err))
                        }           

                    let newUser = new User({
                        name : profile.displayName,
                        identities : [{ 
                            email : email,
                            googleId : id
                            }],
                            verified : true
                    })
                    .save()
                    .then((user) => createAccount(user))
                    .catch(err => done(err))
             }
        }
            User.findOne({"identities.email" : email})
            .exec()
            .then((user) => createUser(user))
            .catch((err) => done(err))       
    })
);

passport.use(
    'googlelogin',
    new GoogleStrategy(
        {
        clientID : keys.GoogleClientID,
        clientSecret : keys.GoogleClientSecret,
        callbackURL : '/auth/google/callback/login',
        passReqToCallback: true,
        proxy : true
    },
    (req, accessToken, refreshToken, profile, done) => {

        console.log("login called");

        const id = profile.id;
        const email = profile.emails[0].value;

             function checkId(user) {

                if(user) {

                    if(user.identities[0].googleId) {
                        console.log("call here");   
                        done(null, user);

                    } else {
                        console.log("else called")
                        User.updateOne({"identities.email" : email},
                        { "$set" : {
                        "identities.$.googleId" : profile.id,
                        verified : true
                        }}
                        )
                        .exec()
                        .then(() => {
                            done(null, user)
                        })
                        .catch((err) => done(err))
                    }
                   
                } else {
                    done(null, false, req.flash('info' , 'User Not exist. Please register with google'));
                }
             }
    
            User.findOne({"identities.email" : email})
            .exec()
            .then((user) => checkId(user))
            .catch((err) => done(err))
    }));

