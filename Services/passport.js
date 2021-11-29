const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const keys = require('../config/keys');

const User = require('../models/users');


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
                        return done(null, false);
                        
                    } else {

                        function saveUser(hash) {

                                let newUser = new User({
                                    name : req.body.name,
                                    password  : hash,
                                    identities : [{ email : email}]
                                })
                                .save()
                                .then((user) => {
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

            console.log(keys);
                function verifyPassword(user) {
                
                        if(user.length > 0) {
                            bcrypt.compare(password, user[0].password)
                            .then((result) => {
                                console.log(result);
                                if(result) {
                                    done(null, true);
                                } else {
                                    done(null, false);
                                }
                            })
                            .catch(err => done(err));
                        } else {
                            console.log("else part called");
                            done(null, false);
                        }
                    
                }

                    User.find({"identities.email" : email})
                    .exec()
                    .then((user) => verifyPassword(user))
                    .catch(err => done(err))    

         }
                  
    })
);

//GoogleStrategy.passReqToCallback = true;



passport.use(
    new GoogleStrategy(
        {
        clientID : keys.GoogleClientID,
        clientSecret : keys.GoogleClientSecret,
        callbackURL : '/auth/google/callback',
        proxy : true
    },
    (accessToken, refreshToken, profile, done) => {

        console.log("profile", profile);

        done(null, true);
    })
);