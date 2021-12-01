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

                function verifyPassword(user) {
                
                        if(user.length > 0) {

                            if(!user[0].password) {
                                return done(null, false);
                            }
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

        console.log(profile);
        const id = profile.id;
        const email = profile.emails[0].value;


        function createUser(user) {

             console.log(user);
            // console.log(user[0].identities[0].googleId);
        
             if(user.length  > 0) {
                const googleId = user[0].identities[0].googleId;

                if(googleId) {
                     done(null, false);
                } else {

                    User.updateOne({"identities.email" : email},
                    { "$set" : {
                    "identities.$.googleId" : profile.id
                    }}
                    )
                    .exec()
                    .then(() => {
                        done(null, true);
                     })
                }             
                        
             } else {

                    let newUser = new User({
                        name : profile.displayName,
                        identities : [{ 
                            email : email,
                            googleId : id
                            }]
                    })
                    .save()
                    .then((user) => {
                        done(null, user);
                    })

             }
        }

        if(req.query.state == "signup") {
            console.log("signup called");

            User.find({"identities.email"  : email})
            .exec()
            .then((user) => createUser(user))
            .catch()
            
        } else if(req.query.state == "login") {
            console.log("login called");

            User.find({"identities.googeId"  : id})
            .exec()
            .then((user) => {
                if(user) {
                    done(null, true);
                } else {
                    done(null, false);
                }
            })
            .catch((err) => done(err))
            
        }

        
    })
);