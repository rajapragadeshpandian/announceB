

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
//checked
                function createUser(user) {

                    if(user) {
                        function createAccount(acc) {
                            if(acc){
                             done(null, false, req.flash('info' , 'User and Owner account Aready exist Please login'));
                            } else {
                                Account.createAccount("Owner", user)
                                .then(() => done(null, user))
                                .catch(err => done(err))      
                            }
                    }
                      
                     Account.checkUserType(user,"Owner")
                     .then((acc) => createAccount(acc))
                     .catch((err) => done(err))

                    } else {

                        function saveUser(hash) {  

                            User.createNewUser(req.body.name, hash, email)
                            .then((user) => Account.createAccount("Owner", user))
                            .then(([acc, user]) => done(null, user))
                            .catch(err => done(err));
                    }

                    User.hashPassword(password)
                    .then((hash) => saveUser(hash))
                    .catch(err => done(err));
                    }
              }

                User.getUserByEmail(email)
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
//checked
        function verifyPassword(user) {
                
            if(user && user.verified) {

                if(user.password) {
                    User.comparePassword(password, user.password)
                    .then((result) => {
                        if(result) {
                            done(null, user);
                        } else {
                            done(null, false, req.flash('info' , 'Passwod is incorrect'));
                        }
                    })
                    .catch(err => done(err))
                } else {
                    done(null, false, req.flash('info' , "Password not set to your account.  try login with google"));
                }
            } else {
                console.log("else part called");
                done(null, false, req.flash('info' , 'User not Exist or yet to be verified'));
            }
    }

        User.getUserByEmail(email)
        .then((user) => verifyPassword(user))
        .catch(err => done(err));   

     })
    );

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
//checked
        const id = profile.id;
        const email = profile.emails[0].value;
        function createUser(user) {
             if(user) {
                //const googleId = user.identities[0].googleId;

                function createAccount(acc) {

                if(acc) {
                done(null, false, req.flash('info' , 'Account already exist.Plese login with google'));
                } else {

                    Account.createAccount("Owner", user)
                    .then(() => done(null, user))
                    .catch(err => done(err)) 
                } 
            }  

            Account.checkUserType(user,"Owner")
            .then((acc) => createAccount(acc))
            .catch((err) => done(err))
                        
             } else {       
                 //checked   
                User.createGoogleUser(profile.displayName, email, id)
                .then((user) => Account.createAccount("Owner",user))
                .then(([acc, user]) => done(null, user))
                .catch((err) => done(err))
             }
        }

        User.getUserByEmail(email)
        .then((user) => createUser(user))
        .catch(err => done(err));      
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
                        //checked
                        done(null, user);
                    } else {
                        //checked
                        User.updateGoogleId(email, profile.id)
                        .then(() => done(null, user))
                        .catch(err => done(err))
                    }
                } else {
                    //checked
                    done(null, false, req.flash('info' , 'User Not exist. Please register with google'));
                }
             }
             User.getUserByEmail(email)
             .then((user) => checkId(user))
             .catch(err => done(err));
    }));

