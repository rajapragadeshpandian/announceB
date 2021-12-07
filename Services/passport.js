

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

LocalStrategy.passReqToCallback = true;
passport.use(
    new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true
    },
     (req, email, password, done) => {
         
         console.log(req.url);

         if(req.url == '/register' ) {

                function createUser(user) {

                    if(user.length > 0) {
                        
                        console.log("user exist");
                        return done(null, false, req.flash('info' , 'User Aready exist Please login'));
                        
                    } else {

                        function saveUser(hash) {

                                function createAccount(user) {

                                    let account = new Account({
                                        accName : "announceB",
                                        users : [{
                                            userType : "Owner", 
                                            // firstsignup --> owner
                                            // , co Owner
                                            __user : user._id,
                                            email : user.identities[0].email
                                        }]
                                    })
                                    .save()
                                    .then((account) => account)

                                    return Promise.all([user, account]);

                                }
                            let newUser = new User({
                                name : req.body.name,
                                password  : hash,
                                identities : [{ email : email}]
                            })
                            .save()
                            .then((user) => createAccount(user))
                            .then(([user, account]) => {
                                return done(null, user);
                            })
                            .catch((err) => done(err))
                               
                    }

                        bcrypt.hash(password, 10)
                        .then((hash) => saveUser(hash))
                        .catch(err => done(err))
                    
                    }
                }
        
             User.find({"identities.email"  : email})
            .exec()
            .then((user) => createUser(user))
            .catch(err => done(err));


                    
         } else if(req.url == '/login') {

                function verifyPassword(user) {
                
                        if(user.length > 0) {

                            if(!user[0].password) {
                                return done(null, false, req.flash('info' , 'You have a google account.Please login with google'));
                            }
                            
                            bcrypt.compare(password, user[0].password)
                            .then((result) => {
                                
                                if(result) {
                                    done(null, user);
                                } else {
                                    done(null, false, req.flash('info' , 'Passwod is incorrect'));
                                }
                            })
                            .catch(err => done(err));

                        } else {

                            console.log("else part called");
                            done(null, false, req.flash('info' , 'User not Exist.Please Sign up'));

                        }
                    
                }

                    User.find({"identities.email" : email})
                    .exec()
                    .then((user) => verifyPassword(user))
                    .catch(err => done(err))    

         }
                  
    })
);

GoogleStrategy.passReqToCallback = true;
passport.use(
    new GoogleStrategy(
        {
        clientID : keys.GoogleClientID,
        clientSecret : keys.GoogleClientSecret,
        callbackURL : '/auth/google/callback',
        passReqToCallback: true,
        proxy : true
    },
    (req, accessToken, refreshToken, profile, done) => {

        const id = profile.id;
        const email = profile.emails[0].value;

            console.log(id);
            console.log(email);

        function createUser(user) {

             console.log(user);
            // console.log(user[0].identities[0].googleId);
    
             if(user.length  > 0) {
                const googleId = user[0].identities[0].googleId;

                if(googleId) {
                    return done(null, false, req.flash('info' , 'Account already exist.Plese login with google'));
                } else {

                        function fetchUser() {
                            
                            User.find({"identities.email" : email})
                            .exec()
                            .then((user) => {
                                done(null, user);
                            })
                    
                        }

                    User.updateOne({"identities.email" : email},
                    { "$set" : {
                    "identities.$.googleId" : profile.id
                    }}
                    )
                    .exec()
                    .then(() => fetchUser())
                    .catch((err) => done(err))
                }             
                        
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
                            .then((account) => account)

                            return Promise.all([user, account])
                        }
                

                    let newUser = new User({
                        name : profile.displayName,
                        identities : [{ 
                            email : email,
                            googleId : id
                            }]
                    })
                    .save()
                    .then((user) => createAccount(user))
                    .then(([user, account]) => {
                        done(null, user);
                    })
                    .catch(err => done(err))

             }
        }

        if(req.query.state == "signup") {
            console.log("signup called");
            console.log(email);
        
            User.find({"identities.email" : email})
            .exec()
            .then((user) => createUser(user))
            .catch((err) => done(err))
            
        } else if(req.query.state == "login") {

            console.log("login called");
            console.log(id);

            User.find({"identities.googleId" : id})
            .exec()
            .then((user) => {
                console.log(user);
                if(user.length > 0) {
                    done(null, user);
                } else {
                    done(null, false, req.flash('info' , 'User Not exist. Please register with google'));
                }
            })
            .catch((err) => done(err))
            
        }

        
    })
);

